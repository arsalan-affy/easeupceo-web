# `backend/onboarding`

FastAPI module that powers the conversational Worklynx onboarding chat.
Mounts at `/onboarding` and is wired in by `backend/main.py`.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/start/ai-onboarding` | HRMS handoff. Accepts `auth { bearer_token, organization_id }`, optional `user`, `company` pre-fill, and `return_url`. Creates / resumes the in-memory session |
| `POST` | `/onboarding/chat` | Multipart drive-everything endpoint. Takes `text`, `intent`, `theme`, optional `file`. Returns the next message + UI descriptor |
| `POST` | `/finsh/ai-onboarding` | Enter Workspace handler. Validates the session, builds the canonical payload, POSTs it to `HRMS_SYNC_URL` (when configured), returns `redirect_url` + `final_payload` |
| `GET` | `/onboarding/employees/template` | Streams the canonical employee `.xlsx` template |

Full schemas, request/response shapes, and curl examples live in [`/API.md`](../../API.md)
at the repo root.

## Module layout

```
backend/onboarding/
├── router.py             ← all four endpoints; thin adapter over services + ai_logic
├── schemas.py            ← Pydantic models (StartSessionRequest, FinalizeResponse, ChatResponse, …)
├── assets/
│   ├── Template_Employee_Worklynx.xlsx
│   └── Demo_Data_Employee_Worklynx.xlsx
└── services/
    ├── excel_service.py  ← parse + validate uploaded employee xlsx
    ├── theme_service.py  ← extract palettes from a logo image
    ├── file_upload.py    ← push uploads to the remote storage endpoint
    ├── hrms_sync.py      ← POST the final payload to HRMS_SYNC_URL
    ├── json_builder.py   ← compose the final payload returned by /finalize
    └── utils.py          ← shared helpers + asset paths
```

All conversational logic — prompts, intent classification, response phrasing,
phase routing — lives in the single file `backend/ai_logic.py` (project rule:
all AI logic in one place). The router calls `ai_logic.chat_turn(...)` after
applying any side-effect.

## Sessions

In-memory dict keyed by an opaque uuid. Each session holds:

```python
{
  "current_step": 1..6,
  "auth":       {"bearer_token": "...", "organization_id": "..."},
  "user":       {"id": "...", "name": "...", "email": "..."},
  "return_url": "https://...",
  "company":    {"name": "Acme Inc"},
  "branding": {
    "logo_url":          "https://uploads…/abc.png",
    "extracted_colors":  ["#…", …],
    "palettes":          [...],
    "standard_palettes": [...],
    "selected_theme":    {"primary": "...", ...} | None,
    "theme_source":      "logo_generated" | "manual" | "standard" | None
  },
  "employees": {"method": "uploaded"|"sample"|"skipped"|None, "employees": [...], ...},
  "flags":     {"setup_completed": False, ...}
}
```

Sessions are process-local — restart the server and they're gone. For
production, swap `_SESSIONS` in `router.py` for Redis or a DB-backed table;
nothing else needs to change.

## File uploads

User-uploaded files (logos, future attachments) never touch local disk.
`services/file_upload.upload_file(bytes, ext, bearer_token=…, organization_id=…)`
pushes them to the remote upload service and returns the absolute hosted URL.
The bearer + org come from the session (HRMS handoff).

The remote endpoint contract:
```
POST <ONBOARDING_UPLOAD_URL>
Authorization: Bearer <token>
organization:  <org-id>
Content-Type:  application/json

{ "file": "data:<mime>;base64,<b64>", "extension": "<ext>" }
```

## HRMS sync

`services/hrms_sync.sync(payload, bearer_token=…, organization_id=…)` POSTs the
final onboarding JSON to `HRMS_SYNC_URL` with the same auth headers. Called by
`/finalize` when `HRMS_SYNC_URL` is set. If unset (local dev), `/finalize`
returns `synced: false` and the `final_payload` for the caller to push themselves.

## Environment variables

See `backend/.env.example` for the full list; this module reads:

| Var | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | yes | Gemini chat |
| `GEMINI_MODEL` | no | defaults to `gemini-2.5-flash` |
| `ONBOARDING_UPLOAD_URL` | yes | Remote uploadFile endpoint |
| `ONBOARDING_UPLOAD_TIMEOUT` | no | Upload HTTP timeout, default `60` sec |
| `HRMS_SYNC_URL` | prod | HRMS endpoint that ingests the final payload |
| `HRMS_SYNC_TIMEOUT` | no | HRMS sync HTTP timeout, default `60` sec |
