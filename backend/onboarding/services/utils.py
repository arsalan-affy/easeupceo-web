"""
Shared helpers for the onboarding module.

Project-root resolution is centralized here so every service references the
same location for the demo / template Excel files. User-uploaded artefacts
(logos etc.) are pushed to the remote upload service — see
`services/file_upload.py` — and are no longer written to local disk.
"""
from __future__ import annotations

import os
import re
import uuid
from datetime import datetime, date
from pathlib import Path
from typing import Any


# ─────────────────────────────────────────────────────────────────────────────
# Filesystem layout
# ─────────────────────────────────────────────────────────────────────────────

# Static assets shipped with the onboarding module (Excel template + demo data)
ONBOARDING_ASSETS_DIR = Path(__file__).resolve().parents[1] / "assets"

DEMO_EMPLOYEES_XLSX     = ONBOARDING_ASSETS_DIR / "Demo_Data_Employee_Worklynx.xlsx"
TEMPLATE_EMPLOYEES_XLSX = ONBOARDING_ASSETS_DIR / "Template_Employee_Worklynx.xlsx"


# ─────────────────────────────────────────────────────────────────────────────
# Required columns for the employee import (exact, case-sensitive)
# ─────────────────────────────────────────────────────────────────────────────

REQUIRED_COLUMNS = [
    "_id",
    "Employee Code",
    "First Name",
    "Last Name",
    "Date of Joining",
    "Working Status",
    "Email",
    "Date of Birth",
    "Contact Number",
    "Gender",
    "Position",
    "Department",
    "Role",
    "Shift",
    "Work Location",
    "Location",
]

# Fields that must be non-empty on every data row
NON_EMPTY_FIELDS = [
    "Employee Code",
    "First Name",
    "Last Name",
    "Email",
    "Working Status",
]

DATE_FIELDS = ["Date of Joining", "Date of Birth"]


# ─────────────────────────────────────────────────────────────────────────────
# Generic helpers
# ─────────────────────────────────────────────────────────────────────────────

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def new_session_id() -> str:
    return uuid.uuid4().hex


def is_valid_email(value: str) -> bool:
    return bool(value) and bool(EMAIL_RE.match(value.strip()))


def to_iso_date(value: Any) -> str | None:
    """Normalise a cell to YYYY-MM-DD or return None if it can't be parsed."""
    if value in (None, ""):
        return None
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, (int, float)):
        # Sometimes Excel stores dates as serials when openpyxl falls back
        try:
            base = datetime(1899, 12, 30)
            return (base + _timedelta_days(float(value))).date().isoformat()
        except Exception:
            return None
    text = str(value).strip()
    if not text:
        return None

    # If the string carries a time component (ISO 'T' or space-separated),
    # peel it off and parse just the date portion.
    date_part = text.split("T", 1)[0].split(" ", 1)[0]

    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_part, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _timedelta_days(days: float):
    from datetime import timedelta
    return timedelta(days=days)


def normalize_hex(color: str) -> str:
    """Coerce a colour string to lowercase #rrggbb. Returns "" if invalid."""
    if not color:
        return ""
    s = color.strip().lstrip("#")
    if len(s) == 3:
        s = "".join(ch * 2 for ch in s)
    if len(s) != 6:
        return ""
    try:
        int(s, 16)
    except ValueError:
        return ""
    return f"#{s.lower()}"


def cell_value(value: Any) -> Any:
    """Normalise an openpyxl cell value for JSON output.

    datetime values are coerced to YYYY-MM-DD (no time component) — Worklynx
    employee dates are calendar dates, never timestamps.
    """
    if value is None:
        return ""
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return value
