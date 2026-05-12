"""
HRMS sync — push the finalised onboarding payload back to the HRMS so the
new tenant lands fully provisioned when the user clicks "Enter Workspace".

Triggered from POST /finsh/ai-onboarding. Auth context (bearer token + org)
comes from the session that the HRMS dropped in via POST /start/ai-onboarding.

Configuration (`.env`):
  HRMS_SYNC_URL      (optional) — POST endpoint on the HRMS; if unset, the
                                   backend skips the sync and returns the
                                   payload to the frontend so the integrator
                                   can push it themselves.
  HRMS_SYNC_TIMEOUT  (optional, default 60) — seconds.

The payload shape is whatever `services.json_builder.build_final_payload`
produces. If the HRMS expects a different shape, transform it inside
`hrms_sync.sync` before posting (don't change json_builder — the frontend
also reads from it).
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError

from dotenv import load_dotenv

# Load backend/.env regardless of the cwd uvicorn was launched from. Idempotent.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")


HRMS_SYNC_URL     = os.environ.get("HRMS_SYNC_URL", "")
HRMS_SYNC_TIMEOUT = float(os.environ.get("HRMS_SYNC_TIMEOUT", "60"))


def is_configured() -> bool:
    return bool(HRMS_SYNC_URL)


def sync(
    payload: dict[str, Any],
    *,
    bearer_token:    str | None = None,
    organization_id: str | None = None,
) -> dict[str, Any]:
    """
    POST `payload` to the configured HRMS sync endpoint.

    Returns the parsed JSON response from HRMS (or `{"raw": "<text>"}` if the
    response wasn't JSON). Raises RuntimeError on transport / HTTP failure so
    the /finalize endpoint can convert that into a 502.
    """
    if not HRMS_SYNC_URL:
        raise RuntimeError("HRMS_SYNC_URL is not configured (see .env)")

    body = json.dumps(payload).encode("utf-8")
    req = urlrequest.Request(HRMS_SYNC_URL, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    if bearer_token:
        req.add_header("Authorization", f"Bearer {bearer_token}")
    if organization_id:
        req.add_header("organization", organization_id)

    try:
        with urlrequest.urlopen(req, timeout=HRMS_SYNC_TIMEOUT) as resp:
            raw = resp.read()
    except HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode("utf-8", errors="replace")[:500]
        except Exception:
            pass
        raise RuntimeError(f"HRMS sync failed ({e.code} {e.reason}) {detail}".strip()) from e
    except URLError as e:
        raise RuntimeError(f"HRMS sync failed ({e.reason})") from e

    text = raw.decode("utf-8", errors="replace")
    try:
        return json.loads(text)
    except ValueError:
        return {"raw": text}
