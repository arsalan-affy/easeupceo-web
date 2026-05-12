"""
Final-output composer.

Takes the in-memory session state and produces the exact JSON contract the
caller (HRMS ingestion) expects. The shape is fixed — see /finsh/ai-onboarding
in router.py.
"""
from __future__ import annotations

from typing import Any


def build_final_payload(session: dict[str, Any]) -> dict[str, Any]:
    company = session.get("company") or {}
    branding = session.get("branding") or {}
    employees_state = session.get("employees") or {}
    flags = session.get("flags") or {}

    selected_theme = branding.get("selected_theme") or {
        "primary": "", "secondary": "", "accent": "", "background": "",
    }

    validation = employees_state.get("validation") or {
        "missing_columns": [],
        "invalid_rows": [],
        "duplicate_entries": [],
        "warnings": [],
    }

    employee_list = employees_state.get("employees") or []

    method = employees_state.get("method") or "skipped"
    employee_import_completed = method in ("uploaded", "sample") and len(employee_list) > 0

    return {
        "company": {
            "name":          company.get("name", ""),
            "industry":      company.get("industry", ""),
            "size":          company.get("size", ""),
            "country":       company.get("country", ""),
            "timezone":      company.get("timezone", ""),
            "contact_email": company.get("contact_email", ""),
        },
        "branding": {
            "logo_url":       branding.get("logo_url", ""),
            "selected_theme": {
                "primary":    selected_theme.get("primary", ""),
                "secondary":  selected_theme.get("secondary", ""),
                "accent":     selected_theme.get("accent", ""),
                "background": selected_theme.get("background", ""),
            },
            "theme_source": branding.get("theme_source", "manual"),
        },
        "employee_setup": {
            "method":           method,
            "employee_count":   len(employee_list),
            "template_version": "v1",
            "employees":        employee_list,
            "validation": {
                "missing_columns":   validation.get("missing_columns", []),
                "invalid_rows":      validation.get("invalid_rows", []),
                "duplicate_entries": validation.get("duplicate_entries", []),
                "warnings":          validation.get("warnings", []),
            },
        },
        "system_flags": {
            "setup_completed":           True,
            "demo_data_used":            bool(flags.get("demo_data_used", False)),
            "branding_completed":        bool(flags.get("branding_completed", False)),
            "employee_import_completed": employee_import_completed,
        },
    }
