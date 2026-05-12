"""
Pydantic models for the chat-mode onboarding API.

Three endpoints carry typed request/response shapes:
  * POST /start/ai-onboarding     → StartSessionRequest / StartSessionResponse
  * POST /finsh/ai-onboarding  → FinalizeRequest / FinalizeResponse
  * POST /onboarding/chat      → ChatResponse (multipart request)

Everything else (template download) returns raw bytes and doesn't need a
Pydantic model.
"""
from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


# ─────────────────────────────────────────────────────────────────────────────
# Integration handoff: the host system (HRMS) drops the user here with these.
# ─────────────────────────────────────────────────────────────────────────────

class HandoffAuth(BaseModel):
    """Auth context forwarded from the HRMS login that brought the user here.

    `bearer_token` is stamped on every uploadFile call and on the final sync
    POST. `organization_id` becomes the `organization` header value. Both are
    optional in development (the backend falls back to .env defaults so the
    chat works standalone), but BOTH are required in production for the data
    to land in the right tenant.
    """
    bearer_token:    str | None = None
    organization_id: str | None = None


class HandoffUser(BaseModel):
    """Optional user details from HRMS used to pre-fill the chat."""
    id:    str | None = None
    name:  str | None = None
    email: str | None = None
    phone: str | None = None


class HandoffCompany(BaseModel):
    """Optional company pre-fill from HRMS."""
    name: str | None = None


# ─────────────────────────────────────────────────────────────────────────────
# Session lifecycle
# ─────────────────────────────────────────────────────────────────────────────

class StartSessionRequest(BaseModel):
    """
    Bootstrap (or resume) a chat-onboarding session.

    Production usage from HRMS:
        POST /start/ai-onboarding
        {
          "auth":       { "bearer_token": "<JWT>", "organization_id": "57" },
          "user":       { "name": "Jane",  "email": "jane@acme.com" },
          "company":    { "name": "Acme Inc" },
          "return_url": "https://hrms.example.com/dashboard"
        }

    `resume_session_id` lets the frontend reattach to an in-progress session
    after a page reload. When set and recognised, the existing session's auth
    context is preserved unless explicitly overridden.
    """
    resume_session_id: str | None     = None
    auth:              HandoffAuth    = Field(default_factory=HandoffAuth)
    user:              HandoffUser    = Field(default_factory=HandoffUser)
    company:           HandoffCompany = Field(default_factory=HandoffCompany)
    return_url:        str | None     = None


class StartSessionResponse(BaseModel):
    session_id:   str
    current_step: int
    state:        dict[str, Any]


# ─────────────────────────────────────────────────────────────────────────────
# Finalize (Enter Workspace button)
# ─────────────────────────────────────────────────────────────────────────────

class FinalizeRequest(BaseModel):
    session_id: str


class FinalizeResponse(BaseModel):
    """
    Returned to the frontend when the user clicks "Enter Workspace".

    The frontend should redirect the browser to `redirect_url` once it
    receives `success: true`. `final_payload` is the full onboarding output
    (see services/json_builder.build_final_payload) — the integrator can use
    it to render a confirmation screen or as a fallback if `synced` is false.

    `synced` reflects whether the backend was able to push the payload to the
    HRMS sync endpoint. When `HRMS_SYNC_URL` is unset (e.g. local dev) this
    is false and the integrator's frontend is expected to perform the sync
    using `final_payload`.
    """
    session_id:    str
    success:       bool
    synced:        bool
    sync_response: dict[str, Any] | None = None
    final_payload: dict[str, Any]
    redirect_url:  str = ""


# ─────────────────────────────────────────────────────────────────────────────
# Chat-mode envelope (Lynx conversational onboarding)
# ─────────────────────────────────────────────────────────────────────────────

class ChatUIOption(BaseModel):
    id:      str
    label:   str
    variant: Literal["primary", "ghost", "danger"] = "ghost"
    icon:    str | None = None


class ChatUI(BaseModel):
    input_type: Literal[
        "text_input",
        "action_buttons",
        "logo_upload",
        "theme_picker",
        "excel_upload",
        "employee_preview",
        "complete",
        "none",
    ]
    placeholder:  str = ""
    submit_label: str | None = None
    options:      list[ChatUIOption] = []


class ChatResponse(BaseModel):
    session_id: str
    message:    str
    ui:         ChatUI
    data:       dict[str, Any] = {}
    phase:      str
    off_topic:  bool = False
    state:      dict[str, Any] = {}
