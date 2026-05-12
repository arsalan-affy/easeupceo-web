# Worklynx Onboarding

Conversational, AI-driven onboarding for the Worklynx HRMS. Drops in between
HRMS login and the workspace dashboard: collects company name, branding
(logo + theme), and an employee roster, then hands the structured payload
back to HRMS.

## Repo layout

| Folder | What it is |
|---|---|
| `backend/` | FastAPI app (onboarding API + LLM). Runs on `:8000`. |
| `frontend-app/` | React SPA — marketing site, live-order pages, and the LynxChat onboarding at `/start-onboarding`. Runs on `:5173`. |

Dev quickstart:
```bash
# Terminal 1 — backend
python -m uvicorn backend.main:app --reload --port 8000

# Terminal 2 — frontend (vite proxies /start, /finsh, /onboarding → :8000)
cd frontend-app && npm install && npm run dev
# → http://localhost:5173/                                          (marketing home)
# → http://localhost:5173/live-order                                (customer order pages)
# → http://localhost:5173/start-onboarding?token=<JWT>&org=<id>&return_url=<encoded>
#                                                                   (LynxChat onboarding)
```

```
HRMS login
    │  302 redirect to /start-onboarding?token=<JWT>&org=<id>&return_url=<encoded>
    ▼
Onboarding deploy (this service)         ← SPA + API in one process
    │  /start-onboarding route mounts LynxChat
    │  user runs the chat, picks a theme, uploads employees
    ▼
Click "Enter Workspace"
    │  POST /finsh/ai-onboarding
    │  → backend POSTs final JSON to HRMS_SYNC_URL with the user's bearer
    │  → returns { redirect_url }
    ▼
Browser navigates to return_url → user back in HRMS
```

---

## What you need

| | Version | Why |
|---|---|---|
| Python | 3.11+ | Backend |
| Node | 18+ | Build the React SPA |
| A Gemini API key | — | Powers the chat (Lynx) |
| HRMS sync endpoint URL | — | (Production) where the final payload gets POSTed |

---

## Setup

```bash
git clone <repo>
cd BUSINESS-ONBOARDING-2

# Python deps
python -m venv .venv
source .venv/Scripts/activate          # Windows Git Bash
# .venv\Scripts\activate               # Windows cmd / PowerShell
# source .venv/bin/activate            # macOS / Linux
pip install -r backend/requirements.txt

# Frontend build (produces frontend-app/dist that the backend serves)
cd frontend-app
npm install
npm run build
cd ..

# Config
cp backend/.env.example backend/.env
#  → open backend/.env and fill in GEMINI_API_KEY (required)
#  → set HRMS_SYNC_URL once HRMS gives you the ingest endpoint
```

## Run

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

That's it — single process serves both:

| URL | What |
|---|---|
| http://127.0.0.1:8000/ | Marketing home (React SPA) |
| http://127.0.0.1:8000/start-onboarding | LynxChat onboarding (needs `?token=…&org=…&return_url=…`) |
| http://127.0.0.1:8000/live-order | Customer-facing order pages |
| http://127.0.0.1:8000/docs | Interactive API docs (Swagger) |

### Test it in the browser

Simulates the HRMS handoff with a real token (note the `/start-onboarding`
path — `/` is the marketing site, not the chat):

```
http://127.0.0.1:8000/start-onboarding?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBjYWY3YjY4ODk5M2E2NWRkMzA4OWYiLCJuYW1lIjoiTXVydGF6YSBNYWxpayIsImVtYWlsIjoibXVydGF6YS5tYWxpa0BhZmZ5Y2xvdWRpdHNvbHV0aW9ucy5jb20iLCJwaG9uZSI6Iis5MTg5NjI3NjAyNjIiLCJpYXQiOjE3Nzg0ODE0ODJ9.MCKuW8NQufbUE0HD6odpDIpSJg9qqj3vhzJpmdxlUAo&org=57&return_url=https%3A%2F%2Fexample.com%2Fdashboard&user_name=Murtaza%20Malik&user_email=murtaza.malik%40affycloudit.com&company=Affycloud
```

Open in an **incognito** window so old localStorage doesn't leak in.

The SPA reads the query params, strips them from the URL bar, and runs the
chat. Click *Enter Workspace* at the end → browser navigates to the URL in
`return_url`.

### Frontend dev mode (with hot reload)

For faster iteration on the React side, run vite alongside the backend. Vite
proxies `/start/ai-onboarding`, `/finsh/ai-onboarding`, and `/onboarding/*`
to `:8000` (see [frontend-app/vite.config.js](frontend-app/vite.config.js)), so
the SPA stays same-origin and no env override is needed:

```bash
# terminal 1
python -m uvicorn backend.main:app --port 8000

# terminal 2
cd frontend-app && npm run dev          # SPA on http://127.0.0.1:5173
# → http://127.0.0.1:5173/start-onboarding?token=…&org=…&return_url=…
```

Only set `VITE_ONBOARDING_API_BASE=http://127.0.0.1:8000` in
`frontend-app/.env.local` if you're running vite against a backend on a
**different host** (bypasses the proxy). Reset it to empty and rebuild before
deploying.

---

## API

Four endpoints. JSON in / JSON out unless noted. Full schemas in
[`API.md`](API.md).

### 1. `POST /start/ai-onboarding`

Bootstrap a session. **Called by the HRMS handoff page** right after login.

**Request**:

```json
{
  "auth": {
    "bearer_token":    "<HRMS JWT>",
    "organization_id": "57"
  },
  "user": {
    "id":    "user_abc123",
    "name":  "Jane Doe",
    "email": "jane@acme.com",
    "phone": "+1 555 000 0000"
  },
  "company":    { "name": "Acme Inc" },
  "return_url": "https://hrms.example.com/dashboard"
}
```

| Field | Required | Notes |
|---|---|---|
| `auth.bearer_token` | **yes** | User's HRMS JWT. Stamped on every upload + the final HRMS sync. Missing → `401` |
| `auth.organization_id` | **yes** | Sent in the `organization` HTTP header. Missing → `400` |
| `return_url` | **yes** | Where to redirect after Enter Workspace. Missing → `400` |
| `user.*` | no | Display / pre-fill |
| `company.name` | no | If set, chat skips the company-name step |
| `resume_session_id` | no | Reattach to an in-progress session |

**Response 200**:

```json
{
  "session_id":   "9f13c8…",
  "current_step": 2,
  "state":        { /* full session snapshot */ }
}
```

The SPA persists `session_id` in `localStorage` and includes it on every
chat / finalize call.

**Curl**:

```bash
curl -X POST http://127.0.0.1:8000/start/ai-onboarding \
  -H 'Content-Type: application/json' \
  -d '{
    "auth":       {"bearer_token":"<JWT>","organization_id":"57"},
    "user":       {"name":"Jane","email":"jane@acme.com"},
    "company":    {"name":"Acme Inc"},
    "return_url": "https://example.com/dashboard"
  }'
```

### 2. `POST /onboarding/chat`

Multipart endpoint that drives the chat. The SPA hits this for every turn —
text replies, action buttons, file uploads (logo + employee xlsx), theme
picks. Integrators normally don't call this directly.

| Field | Notes |
|---|---|
| `session_id` | Required. From `/start/ai-onboarding` |
| `text` | User's free-text reply |
| `intent` | `logo_upload`, `logo_skip`, `select_theme`, `employees_upload`, `employees_demo`, `employees_skip`, `confirm_employees`, `revert_*`, `finalize`, … |
| `theme` | JSON when `intent=select_theme` |
| `file` | Image when `intent=logo_upload`, `.xlsx` when `intent=employees_upload` |

Returns the next `message`, `ui` descriptor, `data` for inline previews,
and a fresh `state` snapshot.

### 3. `POST /finsh/ai-onboarding`

The **Enter Workspace** handler. Validates the session is complete, builds
the canonical payload, POSTs it to `HRMS_SYNC_URL`, and returns the URL
the SPA should redirect the browser to.

**Request**:

```json
{ "session_id": "9f13c8…" }
```

**Response 200**:

```json
{
  "session_id":   "9f13c8…",
  "success":      true,
  "synced":       true,
  "sync_response": { "id": "tenant_abc", "status": "ok" },
  "final_payload": {
    "company":      { "name": "Acme Inc", "industry": "", "size": "", … },
    "branding":     {
      "logo_url":      "https://uploads…/abc.png",
      "selected_theme": { "primary": "#…", "secondary": "#…", "accent": "#…", "background": "#…" },
      "theme_source":  "logo_generated"
    },
    "employee_setup": {
      "method":         "uploaded",
      "employee_count": 42,
      "employees":      [ /* … */ ],
      "validation":     { "missing_columns": [], "invalid_rows": [], "duplicate_entries": [], "warnings": [] }
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
| `synced` | `true` if the backend successfully POSTed to `HRMS_SYNC_URL`. `false` when `HRMS_SYNC_URL` is unset (dev) — frontend then needs to push the payload itself |
| `sync_response` | Whatever HRMS replied with. `null` when `synced: false` |
| `final_payload` | Always returned — same shape regardless of sync status |
| `redirect_url` | Verbatim from the `return_url` you sent on `/start/ai-onboarding` |

**Errors**:

| Status | Meaning |
|---|---|
| `400` | Company name missing / theme not selected / no `return_url` on session |
| `401` | Session has no auth context (recreate via `/start/ai-onboarding`) |
| `404` | Bad `session_id` |
| `502` | `HRMS_SYNC_URL` is set but the call failed (the message includes HRMS's response) |

**Curl**:

```bash
curl -X POST http://127.0.0.1:8000/finsh/ai-onboarding \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"<SID from /start>"}'
```

### 4. `GET /onboarding/employees/template`

Streams the canonical employee `.xlsx` template. Use as a download link in
the chat ("Download the template, fill it in, upload it back").

---

## Environment variables (`backend/.env`)

| Var | Required | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | **yes** | — | Drives the chat orchestrator (Gemini) |
| `GEMINI_MODEL` | no | `gemini-2.5-flash` | Override the model |
| `ONBOARDING_UPLOAD_URL` | **yes** | `https://alfabackend.inkapps.io/api/MoneyTransfers/uploadFile` (shipped in `.env.example`) | Remote storage endpoint for logos |
| `ONBOARDING_UPLOAD_TIMEOUT` | no | `60` | Upload HTTP timeout (sec) |
| `HRMS_SYNC_URL` | **prod** | empty | HRMS endpoint that ingests the final payload. If empty, `/finsh/ai-onboarding` returns `synced:false` |
| `HRMS_SYNC_TIMEOUT` | no | `60` | HRMS sync HTTP timeout (sec) |

**No bearer token / org id lives in `.env`** by design. They come per-request
from the HRMS handoff (the `auth` block on `/start/ai-onboarding`) so files
land in the right tenant. A misconfigured deploy fails loudly — we don't
silently leak files into a default account.

---

## Integration checklist (for the HRMS team)

1. **Set `HRMS_SYNC_URL`** in `backend/.env` to your HRMS endpoint that
   ingests the onboarding payload. The endpoint will receive a `POST` with:

   ```
   Authorization: Bearer <user's JWT>
   organization:  <org id>
   Content-Type:  application/json

   { /* final_payload — see /finsh/ai-onboarding response above */ }
   ```

2. **From HRMS**, after login redirect users to:

   ```
   https://onboarding.example.com/start-onboarding?token=<JWT>&org=<orgId>&return_url=<urlencoded HRMS URL>
   ```

   Optional extras the SPA accepts:
   `&user_name=…&user_email=…&user_phone=…&user_id=…&company=…`

   The SPA strips these from the URL on load (the JWT doesn't sit in the
   address bar). `/` serves the marketing home — don't redirect users there.

3. **You're done.** The chat runs, calls `/finsh/ai-onboarding` on Enter
   Workspace, and the SPA redirects the browser to your `return_url`.

---

## Project layout

```
.
├── README.md                       ← this file
├── API.md                          ← deeper API reference
├── .gitignore
├── backend/
│   ├── requirements.txt            ← pip install -r backend/requirements.txt
│   ├── .env                        ← gitignored
│   ├── .env.example                ← copy to .env, fill in
│   ├── main.py                     ← FastAPI app: serves SPA + mounts API
│   ├── ai_logic.py                 ← Lynx chat orchestrator (all AI logic)
│   └── onboarding/                 ← module
│       ├── router.py               ← endpoint handlers
│       ├── schemas.py              ← Pydantic models
│       ├── assets/                 ← Excel template + demo data
│       └── services/
│           ├── excel_service.py    ← parse + validate uploaded xlsx
│           ├── theme_service.py    ← extract palettes from logo
│           ├── file_upload.py      ← POST uploads to ONBOARDING_UPLOAD_URL
│           ├── hrms_sync.py        ← POST final payload to HRMS_SYNC_URL
│           ├── json_builder.py     ← compose the final payload
│           └── utils.py
└── frontend-app/
    ├── package.json
    ├── vite.config.js              ← dev proxy: /start, /finsh, /onboarding → :8000
    ├── index.html
    └── src/
        ├── main.jsx                ← SPA entry
        ├── App.jsx                 ← routes (/, /live-order, /start-onboarding, …)
        ├── marketing/              ← landing-page pages + layout
        ├── live-order/             ← customer-facing order pages
        ├── pages/StartOnboardingPage.jsx ← /start-onboarding wrapper
        └── modules/onboarding/     ← chat module (OnboardingShell + LynxChat)
```

---

## Production deploy

Single Python process behind a reverse proxy (nginx / Caddy / traefik) for TLS:

```bash
cd frontend-app && npm install && npm run build && cd ..
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Sessions live in process memory, so for multi-instance deployments either
pin sessions to one instance or swap the `_SESSIONS` dict in
[`backend/onboarding/router.py`](backend/onboarding/router.py) for Redis —
nothing else has to change.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `503 frontend not built` on `/` | Run `cd frontend-app && npm run build` |
| Handoff URL opens the marketing site, not the chat | The URL must hit `/start-onboarding`, not `/` |
| SPA opens but `POST /start/…` returns 401 | URL was missing `?token=…` — that's the strict mode working |
| Logo upload says "we couldn't upload it" | Token / org missing on session, OR `ONBOARDING_UPLOAD_URL` unreachable |
| Enter Workspace doesn't redirect | `return_url` was empty on `/start/…`. Check Network tab — `redirect_url` in the response will be empty |
| `502 HRMS sync failed (…)` on finalize | `HRMS_SYNC_URL` is set but the HRMS call failed — message includes HRMS's response |
| Browser shows old chat / wrong port | localStorage cached. Open in incognito or clear `worklynx.lynxchat.v1` |

---

## Further reading

* [API.md](API.md) — request/response shapes, alias query params, error codes
* [backend/onboarding/README.md](backend/onboarding/README.md) — backend module internals (sessions, services)
* [frontend-app/src/modules/onboarding/README.md](frontend-app/src/modules/onboarding/README.md) — SPA module internals (handoff parsing, hook)
