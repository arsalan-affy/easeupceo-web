"""
FastAPI router — mounts at /onboarding.

Wire-up from your existing app:

    from backend.onboarding.router import router as onboarding_router
    app.include_router(onboarding_router)

The chat-mode UX runs through a single multipart endpoint (POST /onboarding/chat)
backed by the conversational orchestrator in `ai_logic.chat_turn`. Three small
support endpoints handle lifecycle + handover:

  * POST /start/ai-onboarding             — bootstrap / resume a session
                                            (HRMS hands off bearer + org here)
  * POST /finsh/ai-onboarding             — Enter Workspace button: validates,
                                            syncs to HRMS, returns redirect URL
  * GET  /onboarding/employees/template   — download the Excel template

User-uploaded artefacts (logos, etc.) are pushed to the shared Worklynx
upload service via `services.file_upload` so the backend stays stateless and
can be deployed independently from the frontend — see file_upload.py for the
endpoint contract and override env vars.

This module owns its own in-process session store so it doesn't touch the
existing database. Sessions are keyed by an opaque uuid handed to the client
via /start/ai-onboarding; the frontend persists it in localStorage and replays
it on every subsequent call.
"""
from __future__ import annotations

import io
import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse

# All conversational AI logic (Lynx chat orchestrator) lives in the
# single `backend/ai_logic.py` file per the project's single-file AI rule.
from backend import ai_logic

from .schemas import (
    ChatResponse,
    ChatUI,
    ChatUIOption,
    FinalizeRequest,
    FinalizeResponse,
    StartSessionRequest,
    StartSessionResponse,
)
from .services import excel_service, hrms_sync, theme_service
from .services.file_upload import upload_file
from .services.json_builder import build_final_payload
from .services.theme_service import STANDARD_PALETTES
from .services.utils import (
    DEMO_EMPLOYEES_XLSX,
    TEMPLATE_EMPLOYEES_XLSX,
    new_session_id,
    normalize_hex,
)


# Routes use explicit full paths (no prefix) so each one matches the agreed
# integrator contract: /start/ai-onboarding, /finsh/ai-onboarding, etc.
router = APIRouter(tags=["onboarding"])


# ─────────────────────────────────────────────────────────────────────────────
# In-process session store
#
# Production note: swap this dict for Redis or a DB-backed table when this
# module is integrated into the live HRMS — the public surface stays the same.
# ─────────────────────────────────────────────────────────────────────────────

_SESSIONS: dict[str, dict[str, Any]] = {}

_STANDARD_PALETTES_FOR_CHAT = [{**p, "source": "standard"} for p in STANDARD_PALETTES]


def _empty_session() -> dict[str, Any]:
    return {
        "current_step": 1,
        # HRMS handoff context — stamped on uploads + the final HRMS sync.
        # Empty {} until POST /start/ai-onboarding populates it.
        "auth":       {"bearer_token": "", "organization_id": ""},
        "user":       {},
        "return_url": "",
        "company": {},
        "branding": {
            "logo_url": "",
            "extracted_colors": [],
            "palettes": [],
            "standard_palettes": list(_STANDARD_PALETTES_FOR_CHAT),
            "selected_theme": None,
            "theme_source": None,
        },
        "employees": {
            "method": None,
            "employees": [],
            "row_count": 0,
            "validation": {},
        },
        "flags": {
            "demo_data_used": False,
            "branding_path_selected": False,   # flipped true on logo upload OR skip
            "branding_completed": False,        # flipped true once a theme is saved
            "employee_import_completed": False,
            "setup_completed": False,
        },
    }


def _get_session(session_id: str) -> dict[str, Any]:
    sess = _SESSIONS.get(session_id)
    if sess is None:
        raise HTTPException(status_code=404, detail="Session not found. Start a new onboarding session.")
    return sess


# ─────────────────────────────────────────────────────────────────────────────
# Session lifecycle
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/start/ai-onboarding", response_model=StartSessionResponse)
def start(req: StartSessionRequest):
    """
    Bootstrap (or resume) a chat-onboarding session.

    Called by the HRMS immediately after the user's signup / login redirect.

    Required fields (rejected with 401/400 if missing on a fresh /start):
      * auth.bearer_token    — user's HRMS JWT, reused on upload + sync calls
      * auth.organization_id — tenant id, sent in the `organization` header
      * return_url           — where to redirect after Enter Workspace

    Pre-fill (`user`, `company`) is optional. If `company.name` is provided,
    the chat skips straight to the branding step.

    On a resume call (`resume_session_id` matches an active session), the
    auth/return_url already on the session are kept — they only need to be
    re-sent if HRMS wants to overwrite them.
    """
    is_resume = bool(req.resume_session_id and req.resume_session_id in _SESSIONS)

    if is_resume:
        sid = req.resume_session_id
    else:
        # Fresh /start — enforce the handoff contract strictly.
        if not req.auth.bearer_token:
            raise HTTPException(status_code=401, detail="auth.bearer_token is required")
        if not req.auth.organization_id:
            raise HTTPException(status_code=400, detail="auth.organization_id is required")
        if not req.return_url:
            raise HTTPException(status_code=400, detail="return_url is required")
        sid = new_session_id()
        _SESSIONS[sid] = _empty_session()

    sess = _SESSIONS[sid]

    # Persist the handoff context. Each field only overwrites the existing
    # session value when explicitly provided — that way a resume call without
    # auth doesn't accidentally wipe the auth set by the original /start.
    if req.auth.bearer_token:
        sess["auth"]["bearer_token"] = req.auth.bearer_token
    if req.auth.organization_id:
        sess["auth"]["organization_id"] = req.auth.organization_id
    user_dict = req.user.model_dump(exclude_none=True)
    if user_dict:
        sess["user"] = {**sess.get("user", {}), **user_dict}
    if req.company.name:
        sess["company"] = {**sess.get("company", {}), "name": req.company.name}
        sess["current_step"] = max(sess.get("current_step", 1), 2)
    if req.return_url:
        sess["return_url"] = req.return_url

    return StartSessionResponse(
        session_id=sid,
        current_step=sess["current_step"],
        state=sess,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Finalize — driven by the "Enter Workspace" button at the end of the chat.
#
# Validates the session is complete, builds the canonical onboarding payload,
# pushes it to the HRMS sync endpoint (when HRMS_SYNC_URL is configured) and
# returns the payload + the redirect URL the frontend should navigate to.
#
# This is a separate REST endpoint from the chat-driven `intent=finalize`
# path so an integrator can call it headless (e.g. server-to-server) without
# going through the chat loop.
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/finsh/ai-onboarding", response_model=FinalizeResponse)
def finalize(req: FinalizeRequest):
    sess = _get_session(req.session_id)

    if not (sess.get("auth") or {}).get("bearer_token"):
        raise HTTPException(status_code=401, detail="Session has no auth context. Restart from /start/ai-onboarding.")
    if not sess.get("return_url"):
        raise HTTPException(status_code=400, detail="Session has no return_url. Restart from /start/ai-onboarding with a return_url.")
    if not (sess.get("company") or {}).get("name"):
        raise HTTPException(status_code=400, detail="Company name missing — chat must reach the company step.")
    if not (sess.get("branding") or {}).get("selected_theme"):
        raise HTTPException(status_code=400, detail="Theme not selected — user must pick a theme before finalizing.")

    sess["flags"]["setup_completed"] = True
    sess["current_step"] = 6

    final_payload = build_final_payload(sess)

    synced = False
    sync_response: dict[str, Any] | None = None
    if hrms_sync.is_configured():
        auth = sess.get("auth") or {}
        try:
            sync_response = hrms_sync.sync(
                final_payload,
                bearer_token=auth.get("bearer_token") or None,
                organization_id=auth.get("organization_id") or None,
            )
            synced = True
        except RuntimeError as e:
            # The frontend can still complete the redirect using the payload
            # it gets back; surface the failure as a 502 so the integrator
            # knows the HRMS-side write didn't happen.
            raise HTTPException(status_code=502, detail=str(e))

    return FinalizeResponse(
        session_id=req.session_id,
        success=True,
        synced=synced,
        sync_response=sync_response,
        final_payload=final_payload,
        redirect_url=sess.get("return_url") or "",
    )


# ─────────────────────────────────────────────────────────────────────────────
# Static asset streaming — the Excel template only.
# Uploaded logos are hosted by the remote upload service (see file_upload.py)
# and referenced by absolute URL in `branding.logo_url`, so the backend no
# longer serves user-uploaded files itself.
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/onboarding/employees/template")
def download_template():
    if not TEMPLATE_EMPLOYEES_XLSX.exists():
        raise HTTPException(status_code=404, detail="Template file not found.")
    return FileResponse(
        path=str(TEMPLATE_EMPLOYEES_XLSX),
        filename="Template_Employee_Worklynx.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


# ─────────────────────────────────────────────────────────────────────────────
#
#  Chat-mode (Lynx conversational onboarding)
#
#  POST /onboarding/chat — single endpoint that drives the entire chatbot UX.
#
#  All conversational logic, prompting, and response-shaping lives in
#  `ai_logic.chat_turn`. This endpoint is just an adapter:
#    1. Apply any side-effect against the existing services (logo upload,
#       theme save, excel parse, finalize).
#    2. Call ai_logic.chat_turn(...) to get the next chat reply + UI.
#    3. Return the chat envelope to the frontend.
#
#  The endpoint is intentionally multipart so it can carry an optional file
#  (logo image or filled employee xlsx) on the same call.
# ─────────────────────────────────────────────────────────────────────────────


def _ensure_standard_palettes(sess: dict[str, Any]) -> None:
    """Seed standard palettes into the session so the chat layer can serve them
    even before a logo is uploaded ("I don't have a logo" path)."""
    branding = sess.setdefault("branding", {})
    if not branding.get("standard_palettes"):
        branding["standard_palettes"] = list(_STANDARD_PALETTES_FOR_CHAT)


def _state_summary(sess: dict[str, Any]) -> dict[str, Any]:
    """Compact snapshot of the session that's safe to send back to the client."""
    branding  = sess.get("branding", {})
    employees = sess.get("employees", {})
    return {
        "current_step": sess.get("current_step", 1),
        "company": sess.get("company", {}),
        "branding": {
            "logo_url":          branding.get("logo_url", ""),
            "selected_theme":    branding.get("selected_theme"),
            "theme_source":      branding.get("theme_source"),
            "extracted_colors":  branding.get("extracted_colors", []),
            "palettes":          branding.get("palettes", []),
            "standard_palettes": branding.get("standard_palettes", []),
        },
        "employees": {
            "method":     employees.get("method"),
            "row_count":  employees.get("row_count", 0),
            "employees":  employees.get("employees", []),
            "validation": employees.get("validation", {}),
        },
        "flags": sess.get("flags", {}),
    }


def _chat_envelope(session_id: str, sess: dict[str, Any], turn: dict[str, Any]) -> ChatResponse:
    ui_dict = turn.get("ui") or {"input_type": "none", "placeholder": "", "options": []}
    options = [ChatUIOption(**o) for o in (ui_dict.get("options") or [])]
    ui = ChatUI(
        input_type=ui_dict.get("input_type", "none"),
        placeholder=ui_dict.get("placeholder", ""),
        submit_label=ui_dict.get("submit_label"),
        options=options,
    )
    return ChatResponse(
        session_id=session_id,
        message=turn.get("message", ""),
        ui=ui,
        data=turn.get("data") or {},
        phase=turn.get("phase", ""),
        off_topic=bool(turn.get("off_topic", False)),
        state=_state_summary(sess),
    )


@router.post("/onboarding/chat", response_model=ChatResponse)
async def chat(
    session_id: str = Form(...),
    text:       str | None = Form(default=None),
    intent:     str | None = Form(default=None),
    theme:      str | None = Form(default=None),  # JSON string when intent=select_theme
    file: UploadFile | None = File(default=None),
):
    sess = _get_session(session_id)
    _ensure_standard_palettes(sess)

    side_effect: dict[str, Any] | None = None

    # ── Intent: start/restart ───────────────────────────────────────────────
    # ai_logic.chat_turn handles the welcome message; no side-effect needed.

    # ── Intent: logo skip ───────────────────────────────────────────────────
    if intent == "logo_skip":
        sess["branding"]["logo_url"] = ""
        sess["branding"]["palettes"] = []
        sess["branding"]["extracted_colors"] = []
        sess["flags"]["branding_path_selected"] = True
        side_effect = {"kind": "logo_skipped"}

    # ── Intent: logo upload (file required) ────────────────────────────────
    if intent == "logo_upload":
        if not file:
            raise HTTPException(status_code=400, detail="Logo file missing.")
        if not (file.content_type or "").startswith("image/"):
            side_effect = {"kind": "logo_invalid", "reason": "we only support image files (PNG, JPG, SVG)"}
        else:
            image_bytes = await file.read()
            if not image_bytes:
                side_effect = {"kind": "logo_invalid", "reason": "the file came through empty"}
            else:
                try:
                    palette_data = theme_service.build_palettes(image_bytes)
                except Exception as e:
                    palette_data = None
                    side_effect = {"kind": "logo_invalid", "reason": f"we couldn't read it ({e})"}
                if palette_data is not None:
                    suffix = Path(file.filename or "logo.png").suffix or ".png"
                    auth = sess.get("auth") or {}
                    try:
                        hosted_url = upload_file(
                            image_bytes,
                            suffix,
                            bearer_token=auth.get("bearer_token", ""),
                            organization_id=auth.get("organization_id", ""),
                        )
                    except RuntimeError as e:
                        side_effect = {"kind": "logo_invalid", "reason": f"we couldn't upload it ({e})"}
                    else:
                        sess["branding"]["logo_url"]  = hosted_url
                        sess["branding"]["extracted_colors"] = palette_data["extracted_colors"]
                        sess["branding"]["palettes"] = palette_data["palettes"]
                        sess["branding"]["standard_palettes"] = (
                            palette_data.get("standard_palettes") or list(_STANDARD_PALETTES_FOR_CHAT)
                        )
                        sess["flags"]["branding_path_selected"] = True
                        side_effect = {"kind": "logo_uploaded"}

    # ── Intent: theme selection (theme JSON required) ───────────────────────
    if intent == "select_theme":
        if not theme:
            raise HTTPException(status_code=400, detail="theme payload missing.")
        try:
            theme_obj = json.loads(theme)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="theme payload is not valid JSON.")

        selected = {
            "primary":    normalize_hex(theme_obj.get("primary", "")),
            "secondary":  normalize_hex(theme_obj.get("secondary", "")),
            "accent":     normalize_hex(theme_obj.get("accent", "")),
            "background": normalize_hex(theme_obj.get("background", "")),
        }
        if not all(selected.values()):
            raise HTTPException(status_code=400, detail="Invalid hex colour in theme payload.")
        theme_source = theme_obj.get("source") or theme_obj.get("theme_source") or (
            "logo_generated" if (sess["branding"].get("palettes") or []) else "manual"
        )
        sess["branding"]["selected_theme"] = selected
        sess["branding"]["theme_source"]   = theme_source
        sess["flags"]["branding_completed"] = True
        sess["current_step"] = max(sess.get("current_step", 1), 4)
        side_effect = {"kind": "theme_selected", "selected": {**selected, "name": theme_obj.get("name", "")}}

    # ── Intent: employees upload (file required) ───────────────────────────
    if intent == "employees_upload":
        if not file:
            raise HTTPException(status_code=400, detail="Excel file missing.")
        fname = (file.filename or "").lower()
        if not fname.endswith((".xlsx", ".xlsm")):
            side_effect = {"kind": "excel_invalid", "reason": "I need a .xlsx file"}
        else:
            raw = await file.read()
            if not raw:
                side_effect = {"kind": "excel_invalid", "reason": "the file came through empty"}
            else:
                try:
                    result = excel_service.parse_employees(io.BytesIO(raw))
                    sess["employees"] = {
                        "method":     "uploaded",
                        "employees":  result["employees"],
                        "row_count":  result["row_count"],
                        "validation": result["validation"],
                    }
                    sess["flags"]["demo_data_used"] = False
                    sess["current_step"] = max(sess.get("current_step", 1), 5)
                    side_effect = {
                        "kind":       "employees_parsed",
                        "method":     "uploaded",
                        "employees":  result["employees"],
                        "validation": result["validation"],
                    }
                except Exception as e:
                    side_effect = {"kind": "excel_invalid", "reason": f"we couldn't parse it ({e})"}

    # ── Intent: load demo employees ────────────────────────────────────────
    if intent == "employees_demo":
        if not DEMO_EMPLOYEES_XLSX.exists():
            side_effect = {"kind": "excel_invalid", "reason": "demo data file is missing on the server"}
        else:
            result = excel_service.parse_demo_employees()
            sess["employees"] = {
                "method":     "sample",
                "employees":  result["employees"],
                "row_count":  result["row_count"],
                "validation": result["validation"],
            }
            sess["flags"]["demo_data_used"] = True
            sess["current_step"] = max(sess.get("current_step", 1), 5)
            side_effect = {
                "kind":       "employees_parsed",
                "method":     "sample",
                "employees":  result["employees"],
                "validation": result["validation"],
            }

    # ── Intent: skip employees ─────────────────────────────────────────────
    if intent == "employees_skip":
        sess["employees"] = {"method": "skipped", "employees": [], "row_count": 0, "validation": {}}
        sess["flags"]["demo_data_used"] = False
        sess["flags"]["employee_import_completed"] = False
        sess["current_step"] = max(sess.get("current_step", 1), 5)
        side_effect = {"kind": "employees_skipped"}

    # ── Intent: confirm employee import ────────────────────────────────────
    if intent == "confirm_employees":
        emp = sess.get("employees", {})
        if emp.get("method") in ("uploaded", "sample") and (emp.get("employees") or []):
            sess["flags"]["employee_import_completed"] = True

    # ── Intent: revert_* — user clicked "Change" on a previous answer ───────
    # Each revert clears the matching slice of session state and lets
    # ai_logic.chat_turn re-render the corresponding step's UI. Reverts
    # cascade only where downstream state would otherwise be invalid:
    #   revert_company  → wipes everything (company is upstream of all)
    #   revert_logo     → wipes logo + theme (theme is logo-derived)
    #   revert_theme    → just clears the chosen theme
    #   revert_employees→ just clears the employee table
    if intent == "revert_company":
        sess["company"]   = {}
        sess["branding"]  = {
            "logo_url": "",
            "extracted_colors": [], "palettes": [],
            "standard_palettes": list(_STANDARD_PALETTES_FOR_CHAT),
            "selected_theme": None, "theme_source": None,
        }
        sess["employees"] = {"method": None, "employees": [], "row_count": 0, "validation": {}}
        sess["flags"]    = {
            "demo_data_used":            False,
            "branding_path_selected":    False,
            "branding_completed":        False,
            "employee_import_completed": False,
            "setup_completed":           False,
        }
        sess["current_step"] = 1

    if intent == "revert_logo":
        sess["branding"]["logo_url"]            = ""
        sess["branding"]["palettes"]            = []
        sess["branding"]["extracted_colors"]    = []
        sess["branding"]["selected_theme"]      = None
        sess["branding"]["theme_source"]        = None
        sess["flags"]["branding_path_selected"] = False
        sess["flags"]["branding_completed"]     = False

    if intent == "revert_theme":
        sess["branding"]["selected_theme"]  = None
        sess["branding"]["theme_source"]    = None
        sess["flags"]["branding_completed"] = False

    if intent == "revert_employees":
        sess["employees"] = {"method": None, "employees": [], "row_count": 0, "validation": {}}
        sess["flags"]["employee_import_completed"] = False
        sess["flags"]["demo_data_used"]            = False

    # ── Intent: finalize (build final payload) ──────────────────────────────
    if intent == "finalize":
        if not (sess.get("company") or {}).get("name"):
            raise HTTPException(status_code=400, detail="Company name missing.")
        if not (sess.get("branding") or {}).get("selected_theme"):
            raise HTTPException(status_code=400, detail="Theme not selected.")

        sess["flags"]["setup_completed"] = True
        sess["current_step"] = 6
        final_json = build_final_payload(sess)
        side_effect = {"kind": "finalized", "final_payload": final_json}

    # ── Hand off to the conversational orchestrator ────────────────────────
    turn = ai_logic.chat_turn(sess, user_text=text, intent=intent, side_effect=side_effect)

    # If the user just typed a company name in free text, persist it now so
    # the next turn finds the session already advanced past the welcome. The
    # `force_update` flag lets PHASE_BRANDING_CHOICE corrections overwrite an
    # already-saved name.
    extracted = turn.get("extracted") or {}
    if extracted.get("company_name"):
        existing = (sess.get("company") or {}).get("name", "")
        if extracted.get("force_update") or not existing:
            sess["company"] = {
                **(sess.get("company") or {}),
                "name": extracted["company_name"],
            }
            sess["current_step"] = max(sess.get("current_step", 1), 3)

    # If chat_turn inferred an intent from natural-language text (e.g. user
    # typed "i don't have one" in PHASE_BRANDING_CHOICE), apply the same
    # side-effect the equivalent button click would have done — so the
    # session lands in the same state regardless of how the user responded.
    inferred = turn.get("inferred_intent")
    if inferred == "logo_skip":
        sess["branding"]["logo_url"] = ""
        sess["branding"]["palettes"] = []
        sess["branding"]["extracted_colors"] = []
        sess["flags"]["branding_path_selected"] = True

    # Stamp current_step from phase, for anything still reading it.
    phase_to_step = {
        ai_logic.PHASE_WELCOME:          1,
        ai_logic.PHASE_COMPANY:          1,
        ai_logic.PHASE_BRANDING_CHOICE:  2,
        ai_logic.PHASE_THEME_PICKER:     2,
        ai_logic.PHASE_EMPLOYEE_CHOICE:  3,
        ai_logic.PHASE_EMPLOYEE_UPLOAD:  3,
        ai_logic.PHASE_EMPLOYEE_PREVIEW: 3,
        ai_logic.PHASE_FINALIZE:         4,
        ai_logic.PHASE_COMPLETE:         5,
    }
    sess["current_step"] = max(
        sess.get("current_step", 1),
        phase_to_step.get(turn.get("phase", ""), sess.get("current_step", 1)),
    )

    return _chat_envelope(session_id, sess, turn)
