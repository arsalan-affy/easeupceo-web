"""
Remote file upload helper.

Pushes user-uploaded files (logos today, anything else tomorrow) to the shared
Worklynx storage endpoint instead of writing them to local disk. This is what
lets the backend and frontend deploy to separate hosts: uploaded artefacts
live at a stable absolute URL the frontend can fetch directly without going
back through the API process.

The endpoint contract (POST JSON):
    {
        "file":      "data:<mime>;base64,<b64-bytes>",
        "extension": "<ext-without-dot>"
    }

Auth is per-call: callers MUST pass the user's HRMS bearer token + organization
id (forwarded through from POST /start/ai-onboarding). No env fallback — the
service refuses to upload without auth so a misconfigured deployment fails
loudly instead of silently leaking files into a default tenant.

`.env` keys:
  ONBOARDING_UPLOAD_URL      (required) — upload endpoint
  ONBOARDING_UPLOAD_TIMEOUT  (optional, default 60) — seconds
"""
from __future__ import annotations

import base64
import json
import mimetypes
import os
from pathlib import Path
from typing import Any
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError

from dotenv import load_dotenv

# Load backend/.env regardless of the cwd uvicorn was launched from. Idempotent.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")


REMOTE_UPLOAD_URL = os.environ.get("ONBOARDING_UPLOAD_URL", "")
REMOTE_UPLOAD_TIMEOUT = float(os.environ.get("ONBOARDING_UPLOAD_TIMEOUT", "60"))


_EXTENSION_TO_MIME = {
    "jpg":  "image/jpeg",
    "jpeg": "image/jpeg",
    "png":  "image/png",
    "gif":  "image/gif",
    "svg":  "image/svg+xml",
    "webp": "image/webp",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "xls":  "application/vnd.ms-excel",
    "pdf":  "application/pdf",
}


def _mime_for(extension: str) -> str:
    ext = (extension or "").lower().lstrip(".")
    if ext in _EXTENSION_TO_MIME:
        return _EXTENSION_TO_MIME[ext]
    guessed, _ = mimetypes.guess_type(f"file.{ext}") if ext else (None, None)
    return guessed or "application/octet-stream"


def _extract_url(payload: Any) -> str | None:
    """Pluck the uploaded file URL out of whatever shape the API returns.

    The upload service hasn't pinned a single response schema, so probe the
    handful of common keys (url / fileUrl / Location / data.url / etc.) and
    return the first absolute-looking string.
    """
    if isinstance(payload, str):
        s = payload.strip()
        return s if s.startswith(("http://", "https://", "/")) else None
    if isinstance(payload, dict):
        for key in ("url", "fileUrl", "file_url", "Location", "location",
                    "path", "secure_url", "publicUrl", "public_url"):
            value = payload.get(key)
            if isinstance(value, str) and value:
                return value
        for key in ("data", "result", "response", "file"):
            url = _extract_url(payload.get(key))
            if url:
                return url
    if isinstance(payload, list) and payload:
        return _extract_url(payload[0])
    return None


def upload_file(
    file_bytes: bytes,
    extension: str,
    *,
    bearer_token:    str,
    organization_id: str,
) -> str:
    """
    Push raw file bytes to the remote uploader and return the hosted URL.

    `bearer_token` and `organization_id` are required — they come from the
    active onboarding session (HRMS handoff) and are stamped on every upload
    so files land in the right tenant. Empty / missing values raise.

    Raises RuntimeError on missing auth, missing config, or transport / parse
    failure so callers can surface a clean message in the chat
    ("we couldn't upload it (...)").
    """
    if not file_bytes:
        raise RuntimeError("file is empty")
    if not REMOTE_UPLOAD_URL:
        raise RuntimeError("ONBOARDING_UPLOAD_URL is not configured (see backend/.env)")
    if not bearer_token:
        raise RuntimeError("bearer_token is required (HRMS handoff missing on the session)")
    if not organization_id:
        raise RuntimeError("organization_id is required (HRMS handoff missing on the session)")

    ext = (extension or "").lower().lstrip(".") or "bin"
    mime = _mime_for(ext)

    encoded = base64.b64encode(file_bytes).decode("ascii")
    body = json.dumps({
        "file":      f"data:{mime};base64,{encoded}",
        "extension": ext,
    }).encode("utf-8")

    req = urlrequest.Request(REMOTE_UPLOAD_URL, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    req.add_header("Authorization", f"Bearer {bearer_token}")
    req.add_header("organization", organization_id)

    try:
        with urlrequest.urlopen(req, timeout=REMOTE_UPLOAD_TIMEOUT) as resp:
            raw = resp.read()
    except HTTPError as e:
        raise RuntimeError(f"upload failed ({e.code} {e.reason})") from e
    except URLError as e:
        raise RuntimeError(f"upload failed ({e.reason})") from e

    try:
        payload = json.loads(raw.decode("utf-8"))
    except (ValueError, UnicodeDecodeError) as e:
        raise RuntimeError("upload response was not JSON") from e

    url = _extract_url(payload)
    if not url:
        raise RuntimeError(f"upload response missing URL: {payload!r}")
    return url
