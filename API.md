# Onboarding API Reference

Base URL: `https://<your-onboarding-deploy>` (e.g. `http://127.0.0.1:8000` in dev).

The deploy serves the React SPA on `/` (marketing home), the LynxChat
onboarding at `/start-onboarding`, and the API at `/start/ai-onboarding`,
`/finsh/ai-onboarding`, and `/onboarding/*` — all from a single process.

JSON in / JSON out unless noted.

---

## Integration flow at a glance

```
HRMS (login)
    │
    │  302 redirect to:
    │    https://onboarding.example.com/start-onboarding
    │      ?token=<JWT>
    │      &org=57
    │      &return_url=https%3A%2F%2Fhrms…%2Fdashboard
    │      [&user_name=…&user_email=…&company=…]
    ▼
Onboarding deploy serves the SPA — /start-onboarding mounts LynxChat
    │
    │  SPA reads URL query params, then strips them from the address bar
    │  POST /start/ai-onboarding  { auth, user, company, return_url }
    ▼
Backend creates a session, stores the auth + return_url, returns session_id
    │
    │  POST /onboarding/chat  (multi-turn, multipart)
    │    — logo uploads forward to the Worklynx upload service
    │      using the session bearer + org
    ▼
User clicks "Enter Workspace"
    │
    │  POST /finsh/ai-onboarding  { session_id }
    │    — backend builds the final payload, POSTs it to HRMS_SYNC_URL
    │      with the session bearer + org headers, returns redirect_url
    ▼
SPA does window.location.assign(redirect_url) → user lands back in HRMS
```

### Handoff URL format

```
https://onboarding.example.com/start-onboarding
                              ?token=<JWT>
                              &org=<organization_id>
                              &return_url=<urlencoded HRMS URL>
                              [&user_name=Jane%20Doe]
                              [&user_email=jane%40acme.com]
                              [&user_phone=...]
                              [&user_id=...]
                              [&company=Acme%20Inc]
```

Don't redirect users to `/` — that's the marketing site. The chat is only
mounted at `/start-onboarding`.

The SPA accepts the following alias names too, so the HRMS can use whatever
naming convention is most natural:

| Field | Accepted query param names |
|---|---|
| Bearer token | `token`, `bearer`, `bearer_token` |
| Organization id | `org`, `organization`, `organization_id` |
| Return URL | `return_url`, `return` |

---

## 1. `POST /start/ai-onboarding`

Bootstrap (or resume) a chat session. Called by the HRMS handoff page right
after login, before the chat UI renders.

### Request

```json
{
  "resume_session_id": null,
  "auth": {
    "bearer_token":    "eyJhbGciOi…",
    "organization_id": "57"
  },
  "user": {
    "id":    "user_abc123",
    "name":  "Jane Doe",
    "email": "jane@acme.com",
    "phone": "+1 555 000 0000"
  },
  "company": {
    "name": "Acme Inc"
  },
  "return_url": "https://hrms.example.com/dashboard"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `resume_session_id` | string | no | If set & known, reattach to that session. Auth/return_url already on the session are kept; required-field checks below are skipped on resume |
| `auth.bearer_token` | string | **yes** | User's HRMS JWT. Stamped on every uploadFile call + the final HRMS sync. Missing → `401` |
| `auth.organization_id` | string | **yes** | Sent in the `organization` HTTP header. Missing → `400` |
| `return_url` | string | **yes** | Where to redirect the browser after Enter Workspace. Returned verbatim by `/finalize`. Missing → `400` |
| `user.*` | string | no | Pre-fill / display only. Stored in session for downstream use |
| `company.name` | string | no | If provided, chat skips the company-name step and jumps straight to branding |

### Response — `200 OK`

```json
{
  "session_id":   "9f13c8…",
  "current_step": 2,
  "state":        { … full session snapshot … }
}
```

`session_id` must be passed on every subsequent `/onboarding/chat` and
`/finsh/ai-onboarding` call. The frontend persists it in `localStorage`.

`state` is the full server-side session object; the frontend only reads a few
fields (e.g. `state.branding.logo_url`).

---

## 2. `POST /onboarding/chat`

Multipart form. Drives the entire chat UX: free text, intent buttons, file
uploads (logo + employees xlsx), theme picks. The backend orchestrates the
conversational state machine and side-effects (logo upload to remote storage,
xlsx parsing, theme save).

### Request — `multipart/form-data`

| Field | Required | Notes |
|---|---|---|
| `session_id` | yes | From `/start` |
| `text` | no | User's free-text reply (used in PHASE_COMPANY, name corrections, etc.) |
| `intent` | no | One of: `logo_skip`, `logo_upload`, `select_theme`, `employees_upload`, `employees_demo`, `employees_skip`, `confirm_employees`, `revert_company`, `revert_logo`, `revert_theme`, `revert_employees`, `finalize` |
| `theme` | no | JSON string when `intent=select_theme`. Shape: `{"name":"…","primary":"#…","secondary":"#…","accent":"#…","background":"#…","source":"logo"\|"standard"}` |
| `file` | no | Image file when `intent=logo_upload`, .xlsx when `intent=employees_upload` |

### Response — `200 OK`

```json
{
  "session_id": "9f13c8…",
  "message":    "Got your logo — here are some matching themes.",
  "ui": {
    "input_type":   "theme_picker",
    "placeholder":  "",
    "submit_label": null,
    "options":      []
  },
  "data":  { /* phase-specific payload, e.g. palettes */ },
  "phase": "PHASE_THEME_PICKER",
  "off_topic": false,
  "state": { /* same shape as /start response */ }
}
```

The frontend should render `message`, render the composer based on `ui.input_type`,
and use `data` + `state` for any inline previews.

> **Note**: this endpoint also supports `intent=finalize` (the chat-driven
> finalize). It returns the final payload in `data.final_payload` but does
> **not** push to HRMS. For the production "Enter Workspace" handover use the
> dedicated `/finalize` endpoint below.

---

## 3. `POST /finsh/ai-onboarding`

Driven by the **Enter Workspace** button. Validates the session is complete,
builds the canonical payload, syncs it to HRMS (when `HRMS_SYNC_URL` is
configured) and returns the URL to redirect the user to.

### Request

```json
{ "session_id": "9f13c8…" }
```

### Response — `200 OK`

```json
{
  "session_id":   "9f13c8…",
  "success":      true,
  "synced":       true,
  "sync_response": { "id": "tenant_abc", "status": "ok" },
  "final_payload": {
    "company":      { "name": "Acme Inc", "industry": "", … },
    "branding":     { "logo_url": "https://…/uploads/abc.png",
                       "selected_theme": { "primary": "#…", … },
                       "theme_source": "logo_generated" },
    "employee_setup": {
      "method":         "uploaded",
      "employee_count": 42,
      "employees":      [ … ],
      "validation":     { "missing_columns": [], … }
    },
    "system_flags": {
      "setup_completed":           true,
      "demo_data_used":            false,
      "branding_completed":        true,
      "employee_import_completed": true
    }
  },
  "redirect_url": "https://hrms.example.com/dashboard"
}
```

| Field | Notes |
|---|---|
| `synced` | `true` if the backend successfully POSTed `final_payload` to `HRMS_SYNC_URL`. `false` if `HRMS_SYNC_URL` is unset (dev mode) — frontend then needs to push the payload itself |
| `sync_response` | The HRMS endpoint's parsed JSON reply (or `{"raw": "<text>"}` if it wasn't JSON). `null` when `synced=false` |
| `final_payload` | The canonical payload — also returned for confirmation screens / fallback sync |
| `redirect_url` | Verbatim from `start.return_url`. Empty string if HRMS didn't supply one |

### Error responses

| Status | When |
|---|---|
| `400 Company name missing — chat must reach the company step.` | Session never captured a company name |
| `400 Theme not selected — user must pick a theme before finalizing.` | User skipped the theme step |
| `400 Session has no return_url. Restart from /start/ai-onboarding with a return_url.` | Session was created without `return_url` |
| `401 Session has no auth context. Restart from /start/ai-onboarding.` | Session has no bearer token (couldn't have been created via /start in strict mode, but possible via direct dict manipulation) |
| `404 Session not found.` | Bad / expired `session_id` |
| `502 HRMS sync failed (…)` | `HRMS_SYNC_URL` is set but the call to HRMS failed. The payload is still buildable — call `/onboarding/chat` with `intent=finalize` to retrieve it without re-syncing |

---

## 4. `GET /onboarding/employees/template`

Static download. Streams the canonical employee `.xlsx` template the user
fills in for the bulk-employee path. Use as `<a href="…/onboarding/employees/template" download>`.

Returns `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

---

## Session shape (returned in `/start.state` and `/chat.state`)

```jsonc
{
  "current_step": 1..6,
  "auth":       { "bearer_token": "…", "organization_id": "…" },
  "user":       { "id": "…", "name": "…", "email": "…", "phone": "…" },
  "return_url": "https://…",
  "company":    { "name": "Acme Inc" },
  "branding": {
    "logo_url":          "https://uploads…/abc.png",  // absolute URL from remote uploader
    "extracted_colors":  ["#…", …],
    "palettes":          [ { "name":"Logo Match", "primary":"#…", … }, … ],
    "standard_palettes": [ { "name":"Worklynx",   "primary":"#…", … }, … ],
    "selected_theme":    { "primary":"#…", "secondary":"#…", "accent":"#…", "background":"#…" } | null,
    "theme_source":      "logo_generated" | "manual" | "standard" | null
  },
  "employees": {
    "method":     "uploaded" | "sample" | "skipped" | null,
    "employees":  [ … ],
    "row_count":  0,
    "validation": { "missing_columns": [], "invalid_rows": [], … }
  },
  "flags": {
    "demo_data_used":            false,
    "branding_path_selected":    false,
    "branding_completed":        false,
    "employee_import_completed": false,
    "setup_completed":           false
  }
}
```

`auth.bearer_token` is intentionally returned to the frontend so a SPA reload
can replay it on resume; treat it as opaque.

---

## Environment variables

| Var | Required | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | yes | — | Drives the Lynx chat orchestrator |
| `GEMINI_MODEL` | no | `gemini-2.5-flash` | Override model |
| `ONBOARDING_UPLOAD_URL` | yes | `https://alfabackend.inkapps.io/api/MoneyTransfers/uploadFile` (shipped in `.env.example`) | Remote uploadFile endpoint |
| `ONBOARDING_UPLOAD_TIMEOUT` | no | `60` | Upload HTTP timeout (sec) |
| `HRMS_SYNC_URL` | prod | empty | HRMS endpoint that ingests the final payload. If unset, `/finsh/ai-onboarding` returns `synced:false` and the frontend must push the payload itself |
| `HRMS_SYNC_TIMEOUT` | no | `60` | HRMS sync HTTP timeout (sec) |

The bearer token + organization id used on uploads and on the HRMS sync are
**always** forwarded per-request from the `auth` block on `POST /start/ai-onboarding`.
There is no env fallback by design — a misconfigured deploy fails loudly
instead of leaking files into a default tenant.

---

## Curl examples

```bash
# 1. Start a session (HRMS handoff)
SID=$(curl -s -X POST http://localhost:8000/start/ai-onboarding \
  -H 'Content-Type: application/json' \
  -d '{
        "auth":       {"bearer_token":"<JWT>","organization_id":"57"},
        "user":       {"name":"Jane","email":"jane@acme.com"},
        "company":    {"name":"Acme Inc"},
        "return_url": "https://hrms.example.com/dashboard"
      }' | jq -r .session_id)

# 2. Drive the chat (drops to multipart)
curl -X POST http://localhost:8000/onboarding/chat \
  -F "session_id=$SID" \
  -F "intent=logo_upload" \
  -F "file=@./logo.png"

# 3. Finalize when the user clicks Enter Workspace
curl -X POST http://localhost:8000/finsh/ai-onboarding \
  -H 'Content-Type: application/json' \
  -d "{\"session_id\":\"$SID\"}"
```

---

## Deploying

The deploy is a single Python process serving both the SPA and the API.

```bash
# 1. Build the SPA into frontend/dist
cd frontend
npm install
npm run build
cd ..

# 2. Install backend deps (FastAPI, openpyxl, python-dotenv, colorthief, …)
pip install -r backend/requirements.txt

# 3. Run
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

That's it. Point HRMS at
`https://<host>:<port>/start-onboarding?token=…&org=…&return_url=…`.

If `frontend-app/dist` is missing the API still works, but `/` returns a 503
with a hint to build the SPA. This makes mis-deploys obvious.

### Dev mode (vite hot reload)

```bash
# terminal 1
python -m uvicorn backend.main:app --reload --port 8000

# terminal 2
cd frontend-app && npm run dev
# → http://localhost:5173/start-onboarding?token=…&org=…&return_url=…
```

Vite proxies `/start/ai-onboarding`, `/finsh/ai-onboarding`, and `/onboarding/*`
to `:8000` (see `frontend-app/vite.config.js`), so the SPA stays same-origin
and `VITE_ONBOARDING_API_BASE` should be left empty.
