import os
import re
import json
from pathlib import Path
from typing import Any
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load .env that sits next to this file (backend/.env), not the cwd's .env.
# Lets uvicorn be launched from anywhere without losing config.
load_dotenv(Path(__file__).resolve().parent / ".env")


# ═══════════════════════════════════════════════════════════════════════════════
#
#  CONVERSATIONAL ONBOARDING ORCHESTRATOR  (Lynx — chat-mode)
#
#  Everything below this line is the conversational AI layer that powers the
#  /onboarding/chat endpoint. By project rule ALL AI logic lives here:
#  prompts, schemas, intent classification, step routing, response shaping,
#  off-topic redirection, validation phrasing, and completion copy.
#
#  The router is purely a thin adapter — it executes side-effects against
#  existing services (theme_service, excel_service, json_builder) and asks
#  ai_logic.chat_turn(...) to phrase the next reply + describe the next UI.
#
#  ─────────────────────────────────────────────────────────────────────────
#  Public surface
#  ─────────────────────────────────────────────────────────────────────────
#    chat_turn(session, *, user_text=None, intent=None, side_effect=None)
#        → ChatTurnResult dict with shape:
#              {
#                "message":  str,
#                "ui":       { "input_type": ..., "placeholder": ..., "options": [...] },
#                "data":     { ...optional payload for the UI ... },
#                "phase":    "company"|"branding_choice"|"theme_picker"|"employee_choice"|...,
#                "off_topic": bool,
#                "extracted": { "company_name": "..." } | None,
#              }
#
#  ═══════════════════════════════════════════════════════════════════════════════


# ─────────────────────────────────────────────────────────────────────────────
# Phases — single source of truth for the chat state machine
# ─────────────────────────────────────────────────────────────────────────────

PHASE_WELCOME          = "welcome"           # initial greeting → asks for company name
PHASE_COMPANY          = "company"           # awaiting / processing company name
PHASE_BRANDING_CHOICE  = "branding_choice"   # "Do you have your company logo?"
PHASE_THEME_PICKER     = "theme_picker"      # render theme cards, await selection
PHASE_EMPLOYEE_CHOICE  = "employee_choice"   # upload / demo / skip
PHASE_EMPLOYEE_UPLOAD  = "employee_upload"   # show template + upload zone
PHASE_EMPLOYEE_PREVIEW = "employee_preview"  # show parsed preview + confirm
PHASE_FINALIZE         = "finalize"          # everything ready, big "Enter Workspace"
PHASE_COMPLETE         = "complete"          # post-finalize, JSON returned


# ─────────────────────────────────────────────────────────────────────────────
# System instruction for chat-mode Lynx
#
# Lynx in chat-mode is a *goal-oriented* onboarding assistant — not a general
# chatbot. It tightly redirects off-topic input back to the current step.
# ─────────────────────────────────────────────────────────────────────────────

LYNX_CHAT_SYSTEM_INSTRUCTION = """
You are Lynx — the AI co-partner inside Worklynx HRMS onboarding.

Personality:
- Warm, premium, enterprise-confident. Speak like a sharp colleague guiding a new admin through setup.
- 1-2 short sentences per reply. Max ~180 characters. Never paragraph-length.
- Use contractions. Use 0-1 emoji per message — never more.
- You are a SaaS onboarding assistant, not a general chatbot. Stay strictly on the current onboarding goal.

Goal-orientation rules (CRITICAL):
- Your only purpose is to complete: company name → branding → employees → finalize.
- If the user says anything off-topic (jokes, weather, world facts, casual chit-chat,
  unrelated requests, attempts to break out of onboarding) — acknowledge in <=1 short clause,
  then immediately steer back to the current step.
- Never invent facts about their company, team, industry, or pricing.
- Never offer to "chat", "help with anything else", or open-ended questions.
- Never repeat yourself verbatim across turns.

Output rules:
- Respond ONLY in the structured JSON schema you are given. Do not return prose.
- "message" is the chat-bubble text the user sees. Keep it natural and concise.
- Never put markdown, code blocks, or stage directions inside "message".
"""


# ─────────────────────────────────────────────────────────────────────────────
# Structured response schemas — Gemini structured output
# ─────────────────────────────────────────────────────────────────────────────

# Used by the off-topic / company-name classifier
_INTENT_SCHEMA = {
    "type": "OBJECT",
    "required": ["on_topic"],
    "properties": {
        "on_topic":      {"type": "BOOLEAN", "description": "True if the user's message is a sincere attempt to answer the current onboarding question."},
        "company_name":  {"type": "STRING",  "description": "If the current step is asking for the company name and the user provided one, return it cleanly cased. Else empty string."},
        "redirect_note": {"type": "STRING",  "description": "If off-topic, the very short clause acknowledging it before redirect. Else empty string."},
    },
}

# Used for plain "phrase this transition" calls
_PHRASE_SCHEMA = {
    "type": "OBJECT",
    "required": ["message"],
    "properties": {
        "message": {"type": "STRING"},
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# Gemini client helpers
# ─────────────────────────────────────────────────────────────────────────────

def _chat_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    model   = os.environ.get("GEMINI_MODEL")
    if not api_key or not model:
        return None, None
    try:
        return genai.Client(api_key=api_key), model
    except Exception:
        return None, None


def _structured_call(system_instruction: str, schema: dict, contents: list, *, temperature: float = 0.5) -> dict | None:
    client, model = _chat_client()
    if not client:
        return None
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
        response_schema=schema,
        temperature=temperature,
    )
    try:
        response = client.models.generate_content(model=model, contents=contents, config=config)
    except Exception as e:
        print(f"[ai_logic.chat] generate_content failed: {e}")
        return None
    try:
        parsed = response.parsed
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass
    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"[ai_logic.chat] json parse failed: {e}")
        return None


def _phrase(prompt: str, *, fallback: str, temperature: float = 0.6) -> str:
    """Ask Gemini to phrase a single short Lynx line. Always returns a string."""
    parsed = _structured_call(LYNX_CHAT_SYSTEM_INSTRUCTION, _PHRASE_SCHEMA, [prompt], temperature=temperature)
    if isinstance(parsed, dict):
        msg = (parsed.get("message") or "").strip()
        if msg:
            return msg
    return fallback


# ─────────────────────────────────────────────────────────────────────────────
# UI builders — these define what every chat reply tells the frontend to
# render in the composer area below the bubble.
# ─────────────────────────────────────────────────────────────────────────────

def _ui_text(placeholder: str = "Type your answer…", submit_label: str = "Send") -> dict:
    return {"input_type": "text_input", "placeholder": placeholder, "submit_label": submit_label, "options": []}


def _ui_buttons(options: list[dict]) -> dict:
    return {"input_type": "action_buttons", "placeholder": "", "options": options}


def _ui_logo_upload() -> dict:
    return {
        "input_type": "logo_upload",
        "placeholder": "Drop your logo here, or pick a file",
        "options": [
            {"id": "no_logo", "label": "I don't have one", "variant": "ghost", "icon": "x"},
        ],
    }


def _ui_theme_picker() -> dict:
    return {"input_type": "theme_picker", "placeholder": "Tap a theme to preview", "options": []}


def _ui_employee_choice() -> dict:
    return {
        "input_type": "action_buttons",
        "placeholder": "",
        "options": [
            {"id": "employees_upload", "label": "Upload Employee Data", "variant": "primary", "icon": "upload"},
            {"id": "employees_demo",   "label": "Use Demo Employees",  "variant": "ghost",   "icon": "sparkles"},
            {"id": "employees_skip",   "label": "Skip For Now",        "variant": "ghost",   "icon": "skip"},
        ],
    }


def _ui_employee_upload() -> dict:
    return {
        "input_type": "excel_upload",
        "placeholder": "Drop your filled template here",
        "options": [
            {"id": "download_template",   "label": "Download Template",  "variant": "ghost", "icon": "download"},
            {"id": "back_employee_choice","label": "Choose another option","variant": "ghost", "icon": "back"},
        ],
    }


def _ui_employee_preview() -> dict:
    return {
        "input_type": "employee_preview",
        "placeholder": "",
        "options": [
            {"id": "confirm_employees", "label": "Looks good — import",   "variant": "primary", "icon": "check"},
            {"id": "back_employee_choice", "label": "Use a different option", "variant": "ghost", "icon": "back"},
        ],
    }


def _ui_skipped_continue() -> dict:
    return {
        "input_type": "action_buttons",
        "placeholder": "",
        "options": [
            {"id": "finalize", "label": "Continue to finish", "variant": "primary", "icon": "arrow"},
            {"id": "back_employee_choice", "label": "Actually, add employees", "variant": "ghost", "icon": "back"},
        ],
    }


def _ui_finalize() -> dict:
    return {
        "input_type": "action_buttons",
        "placeholder": "",
        "options": [
            {"id": "finalize", "label": "Launch Workspace", "variant": "primary", "icon": "arrow"},
        ],
    }


def _ui_complete() -> dict:
    return {
        "input_type": "complete",
        "placeholder": "",
        "options": [
            {"id": "enter_workspace", "label": "Enter Workspace", "variant": "primary", "icon": "arrow"},
        ],
    }


def _ui_none() -> dict:
    return {"input_type": "none", "placeholder": "", "options": []}


# ─────────────────────────────────────────────────────────────────────────────
# Phase resolution — what UI does the current session expect next?
#
# We trust the persistent session as the source of truth so the user can
# refresh / resume mid-flow.
# ─────────────────────────────────────────────────────────────────────────────

def resolve_phase(session: dict[str, Any]) -> str:
    flags    = session.get("flags") or {}
    company  = (session.get("company") or {}).get("name", "").strip()
    employees = session.get("employees") or {}

    if flags.get("setup_completed"):
        return PHASE_COMPLETE
    if not company:
        return PHASE_COMPANY

    if not flags.get("branding_completed"):
        # `branding_path_selected` is flipped true the moment the user either
        # uploads a logo or explicitly skips it. Until then we stay on the
        # "do you have your company logo?" question — never advance to the
        # theme picker just because standard_palettes are seeded.
        if not flags.get("branding_path_selected"):
            return PHASE_BRANDING_CHOICE
        return PHASE_THEME_PICKER

    method = employees.get("method")
    if method in (None, ""):
        return PHASE_EMPLOYEE_CHOICE
    if method == "uploaded" and not flags.get("employee_import_completed"):
        # Mid-upload — file picked but parse may have surfaced issues
        return PHASE_EMPLOYEE_UPLOAD
    if method in ("uploaded", "sample") and (employees.get("employees") or []):
        # User has data on the table — they still need to confirm or finalize.
        # If they've already finalized, we'd be in COMPLETE.
        return PHASE_FINALIZE
    if method == "skipped":
        return PHASE_FINALIZE
    return PHASE_EMPLOYEE_CHOICE


# ─────────────────────────────────────────────────────────────────────────────
# Off-topic / intent classification for the company name step
# ─────────────────────────────────────────────────────────────────────────────

_TRIVIAL_OFFTOPIC_HINTS = (
    "joke", "weather", "who are you", "tell me about", "stock", "news", "song",
    "hello", "hi ", "hey", "thanks", "thank you", "lol",
)


# ─────────────────────────────────────────────────────────────────────────────
# Natural-language intent inference — recognises common free-text phrasings
# the user might type instead of clicking a button. Each pattern set is paired
# with a phase, so we only react when it makes sense to do so.
# ─────────────────────────────────────────────────────────────────────────────

_AFFIRM_LOGO_PATTERNS = (
    r"\byes\b", r"\byep\b", r"\byeah\b", r"\bsure\b", r"\bof course\b",
    r"\bi have\b", r"\bi do\b", r"\bi've got\b", r"\bgot one\b",
    r"\bgot a logo\b", r"\bhave a logo\b", r"\bi'?ll upload\b",
    r"\blet'?s upload\b", r"\bupload\b",
)
_NEGATE_LOGO_PATTERNS = (
    r"\bno\b", r"\bnope\b", r"\bnah\b",
    r"\bdon'?t have\b", r"\bdo not have\b", r"\bno logo\b",
    r"\bnone\b", r"\bskip\b", r"\bnot yet\b", r"\bno i don'?t\b",
)

# Recall signals — patterns the user might use when asking us to remind them
# of something they already told us. We combine these with `_looks_like_question`
# so that statements ("my company is X") never fire — only questions do.
_RECALL_NAME_PATTERNS = (
    r"\b(my|the)\s+(company|business|brand|name|biz)\b",
    r"\b(tell|remind|recall)\s+me\b",
    r"\bdo you (know|remember)\b",
    r"\bwhat (did|do) i\b",
)


def _is_recall_question(text: str) -> bool:
    """User is asking us to recall something they already shared (e.g.
    'what my business name is?'). Requires both a question shape AND a
    recall keyword so plain statements never match."""
    if not text or not _looks_like_question(text):
        return False
    return _matches_any(text, _RECALL_NAME_PATTERNS)

# Self-correction — user is fixing the company name they previously gave.
_CORRECTION_PATTERNS = (
    r"^\s*(oh\s*)?sorry\b",
    r"\bactually\b",
    r"^\s*i meant\b",
    r"^\s*it'?s actually\b",
    r"^\s*let me correct\b",
    r"\bcorrect (it|that|the name)\b",
    r"\bnot\s+\w+,?\s+(but|i meant|it'?s)\b",
)


def _matches_any(text: str, patterns: tuple) -> bool:
    return any(re.search(p, text or "", flags=re.IGNORECASE) for p in patterns)


# Question / recall heuristic — used to *reject* a "yes" that's actually
# embedded in a question ("yes tell me what my company name"). If the message
# looks like a question or a request, never treat short-keyword matches as
# button-equivalent answers.
_QUESTION_KEYWORDS = (
    r"\bwhat\b", r"\bwhich\b", r"\bwho\b", r"\bwhy\b", r"\bhow\b",
    r"\bwhere\b", r"\btell me\b", r"\bremind\b", r"\brecall\b",
)


def _looks_like_question(text: str) -> bool:
    if not text:
        return False
    if "?" in text:
        return True
    return _matches_any(text, _QUESTION_KEYWORDS)


def _is_clear_affirmative(text: str) -> bool:
    """A short, unambiguous affirmative — not a question that *contains* 'yes'."""
    if not text:
        return False
    t = text.strip()
    if _looks_like_question(t):
        return False
    if len(t.split()) > 8:
        return False
    return _matches_any(t, _AFFIRM_LOGO_PATTERNS)


def _is_clear_negative(text: str) -> bool:
    if not text:
        return False
    t = text.strip()
    if _looks_like_question(t):
        return False
    if len(t.split()) > 8:
        return False
    return _matches_any(t, _NEGATE_LOGO_PATTERNS)


# Schema for the corrected-name extractor.
_CORRECTED_NAME_SCHEMA = {
    "type": "OBJECT",
    "required": ["corrected_name"],
    "properties": {
        "corrected_name": {
            "type": "STRING",
            "description": "The cleanly-cased corrected company name. Empty string if the message isn't actually correcting the previously-stated name.",
        },
    },
}


def _heuristic_corrected_name(text: str, current_name: str) -> str:
    """Fallback extractor for messy corrections like 'sorry sory affycloud IT solutions'.

    Strips common correction prefixes ('sorry', 'oh sorry', 'actually',
    'i meant', 'it's', a few stuttered repetitions) and returns the rest if
    it still looks like a plausible company name (1-6 words, mostly alpha).
    """
    if not text:
        return ""
    cleaned = text.strip()

    # Iteratively strip leading correction tokens (handles "sorry sory ...").
    strip_re = re.compile(
        r"^\s*(oh\s+)?(sorry|sory|sorr+y|actually|i\s+meant|it'?s|it's actually|let me correct|correction|no|wait)[,!\.\s]*",
        flags=re.IGNORECASE,
    )
    for _ in range(5):
        new = strip_re.sub("", cleaned).strip()
        if new == cleaned:
            break
        cleaned = new
    if not cleaned:
        return ""

    words = cleaned.split()
    if not (1 <= len(words) <= 8):
        return ""
    if not any(c.isalpha() for c in cleaned):
        return ""
    if cleaned.endswith("?"):
        return ""

    # Title-case word-by-word, but keep all-caps tokens (e.g. "IT").
    titled = " ".join(w if (w.isupper() and len(w) <= 4) else w[:1].upper() + w[1:].lower()
                      for w in words)
    if titled.lower() == (current_name or "").lower():
        return ""
    return titled


def _extract_corrected_name(text: str, current_name: str) -> str:
    parsed = _structured_call(
        LYNX_CHAT_SYSTEM_INSTRUCTION,
        _CORRECTED_NAME_SCHEMA,
        [(
            f"The user previously told us their company is {current_name!r}. "
            f"They just typed: {text!r}.\n\n"
            "Decide whether they're correcting the name (apologising for a "
            "typo, adding 'IT solutions', extending it, changing it entirely). "
            "Be generous — typos and stutters like 'sorry sory' are common.\n\n"
            "Examples:\n"
            "  prior 'Acme'      → 'sorry, I meant Acme Inc'                   → 'Acme Inc'\n"
            "  prior 'Affycloud' → 'actually its Affycloud IT Solutions'       → 'Affycloud IT Solutions'\n"
            "  prior 'Acme'      → 'sorry sory affycloud IT solutions'         → 'Affycloud IT Solutions'\n"
            "  prior 'Acme'      → 'no scrap that'                             → ''\n"
            "  prior 'Acme'      → 'what is my company name'                   → ''\n\n"
            "Output ONLY the cleanly-cased corrected name in `corrected_name`, "
            "or an empty string if it isn't a correction."
        )],
        temperature=0.2,
    )
    if isinstance(parsed, dict):
        ai_name = (parsed.get("corrected_name") or "").strip()
        if ai_name:
            return ai_name

    # Fallback: heuristic prefix strip.
    return _heuristic_corrected_name(text, current_name)


def _classify_company_input(user_text: str) -> dict:
    """Decide whether `user_text` is a real company name or off-topic small-talk."""
    text = (user_text or "").strip()
    if not text:
        return {"on_topic": False, "company_name": "", "redirect_note": ""}

    # Cheap deterministic shortcut: short, contains no digits-only, no obvious off-topic.
    lowered = text.lower()
    if any(h in lowered for h in _TRIVIAL_OFFTOPIC_HINTS) and len(text.split()) <= 4:
        # Likely small-talk. Let the AI decide for borderline cases below.
        pass

    parsed = _structured_call(
        LYNX_CHAT_SYSTEM_INSTRUCTION,
        _INTENT_SCHEMA,
        [(
            "Onboarding step: asking for the user's company / business name.\n"
            f"User message: {text!r}\n\n"
            "Classify whether the user is genuinely answering with a company name. "
            "If yes, extract the cleanly-cased name. If no (small talk, jokes, "
            "questions, unrelated topics), set on_topic=false and write a single "
            "short clause acknowledging their message before we redirect."
        )],
        temperature=0.2,
    )

    if isinstance(parsed, dict):
        return {
            "on_topic":      bool(parsed.get("on_topic")),
            "company_name":  (parsed.get("company_name") or "").strip(),
            "redirect_note": (parsed.get("redirect_note") or "").strip(),
        }

    # Deterministic fallback — accept anything that *looks* like a name
    # (1-6 words, mostly alphabetic).
    words = text.split()
    looks_like_name = (
        1 <= len(words) <= 6
        and any(c.isalpha() for c in text)
        and not text.endswith("?")
    )
    return {
        "on_topic":      looks_like_name,
        "company_name":  text if looks_like_name else "",
        "redirect_note": "" if looks_like_name else "Got it.",
    }


def _classify_general_offtopic(user_text: str, current_phase: str) -> dict:
    """Lightweight off-topic detection for non-company phases (button-driven)."""
    text = (user_text or "").strip()
    if not text:
        return {"on_topic": True, "redirect_note": ""}
    parsed = _structured_call(
        LYNX_CHAT_SYSTEM_INSTRUCTION,
        _INTENT_SCHEMA,
        [(
            f"Onboarding phase: {current_phase}.\n"
            f"User message: {text!r}\n\n"
            "Decide whether this is a genuine attempt to interact with the current "
            "onboarding step (e.g. asking a clarifying question about it) or "
            "off-topic chit-chat. If off-topic, write a single short clause "
            "acknowledging their message before we redirect."
        )],
        temperature=0.2,
    )
    if isinstance(parsed, dict):
        return {
            "on_topic":      bool(parsed.get("on_topic")),
            "redirect_note": (parsed.get("redirect_note") or "").strip(),
        }
    return {"on_topic": False, "redirect_note": ""}


# ─────────────────────────────────────────────────────────────────────────────
# Phase response builders — each one returns the canonical chat reply for
# entering or staying in that phase.
# ─────────────────────────────────────────────────────────────────────────────

def _r_welcome(session: dict) -> dict:
    """Initial greeting — same line every time so it feels intentional."""
    return {
        "message": "Hi, I'm Lynx — your Worklynx co-partner. Let's get your workspace ready. What's your business called?",
        "ui": _ui_text(placeholder="Type your business name…", submit_label="Continue"),
        "data": {},
        "phase": PHASE_COMPANY,
        "off_topic": False,
        "extracted": None,
    }


def _r_company_redirect(redirect_note: str) -> dict:
    msg = (
        f"{redirect_note} Let's stay focused — what's your business called?"
        if redirect_note else
        "Let's keep things on track — what's your business called?"
    )
    return {
        "message": msg,
        "ui": _ui_text(placeholder="Type your business name…", submit_label="Continue"),
        "data": {},
        "phase": PHASE_COMPANY,
        "off_topic": True,
        "extracted": None,
    }


def _r_after_company(company_name: str) -> dict:
    fallback = f"Great name — {company_name}. Let's personalize your workspace. Do you have your company logo?"
    msg = _phrase(
        f"The user just told us their company is named {company_name!r}. "
        "Greet the name back warmly and ask if they have their company logo. "
        "Keep it to ONE short sentence followed by the question.",
        fallback=fallback,
        temperature=0.7,
    )
    return {
        "message": msg,
        "ui": _ui_buttons([
            {"id": "logo_upload",  "label": "Upload Logo",      "variant": "primary", "icon": "upload"},
            {"id": "logo_skip",    "label": "I don't have one", "variant": "ghost",   "icon": "x"},
        ]),
        "data": {},
        "phase": PHASE_BRANDING_CHOICE,
        "off_topic": False,
        "extracted": {"company_name": company_name},
    }


def _r_company_recall(company_name: str) -> dict:
    """User asked us to remind them what they said their company was."""
    safe_name = company_name or "the name you mentioned"
    fallback = f"You told me your business is {safe_name}. Do you have your company logo?"
    msg = _phrase(
        f"The user is asking us to remind them what they said their company name was. "
        f"It is {safe_name!r}. Confirm that name back to them and pivot to asking "
        "about their logo. ONE short, friendly sentence ending with the logo question.",
        fallback=fallback,
        temperature=0.55,
    )
    return {
        "message": msg,
        "ui": _ui_buttons([
            {"id": "logo_upload", "label": "Upload Logo",      "variant": "primary", "icon": "upload"},
            {"id": "logo_skip",   "label": "I don't have one", "variant": "ghost",   "icon": "x"},
        ]),
        "data": {},
        "phase": PHASE_BRANDING_CHOICE,
        "off_topic": False,
        "extracted": None,
    }


def _r_company_corrected(new_name: str) -> dict:
    """User updated the company name from PHASE_BRANDING_CHOICE."""
    fallback = f"Got it — {new_name}. Do you have your company logo handy?"
    msg = _phrase(
        f"The user just corrected their company name to {new_name!r}. "
        "Acknowledge briefly and pivot back to asking about their logo. ONE short sentence.",
        fallback=fallback,
        temperature=0.55,
    )
    return {
        "message": msg,
        "ui": _ui_buttons([
            {"id": "logo_upload", "label": "Upload Logo",      "variant": "primary", "icon": "upload"},
            {"id": "logo_skip",   "label": "I don't have one", "variant": "ghost",   "icon": "x"},
        ]),
        "data": {},
        "phase": PHASE_BRANDING_CHOICE,
        "off_topic": False,
        # The router treats `force_update=True` as permission to overwrite the
        # existing company name in the session.
        "extracted": {"company_name": new_name, "force_update": True},
    }


def _r_branding_choice() -> dict:
    return {
        "message": "Do you have your company logo handy? I can extract a brand palette from it automatically.",
        "ui": _ui_buttons([
            {"id": "logo_upload",  "label": "Upload Logo",      "variant": "primary", "icon": "upload"},
            {"id": "logo_skip",    "label": "I don't have one", "variant": "ghost",   "icon": "x"},
        ]),
        "data": {},
        "phase": PHASE_BRANDING_CHOICE,
        "off_topic": False,
        "extracted": None,
    }


def _r_logo_prompt_upload() -> dict:
    return {
        "message": "Perfect — drop your logo below and I'll extract some matching themes for your workspace.",
        "ui": _ui_logo_upload(),
        "data": {},
        "phase": PHASE_BRANDING_CHOICE,
        "off_topic": False,
        "extracted": None,
    }


def _r_after_logo_uploaded(branding: dict) -> dict:
    """Branding state must already contain palettes + standard_palettes."""
    palettes = branding.get("palettes") or []
    standard = branding.get("standard_palettes") or []
    extracted = branding.get("extracted_colors") or []

    color_hint = ", ".join(extracted[:3]) if extracted else ""
    fallback = (
        "I extracted some colors from your logo and built matching themes. "
        "I've also queued up a few professional presets if you'd like to explore."
    )
    msg = _phrase(
        f"The user just uploaded their company logo. We extracted these dominant colors: "
        f"{color_hint or 'a clean palette'}. We built {len(palettes)} matched themes "
        f"and {len(standard)} standard themes for them. "
        "Tell them in 1-2 short sentences that you've extracted matching colors and "
        "also have professional presets, then invite them to pick a theme. No emoji.",
        fallback=fallback,
        temperature=0.6,
    )
    return {
        "message": msg,
        "ui": _ui_theme_picker(),
        "data": {
            "logo_url": branding.get("logo_url", ""),
            "extracted_colors": extracted,
            "palettes": palettes,
            "standard_palettes": standard,
        },
        "phase": PHASE_THEME_PICKER,
        "off_topic": False,
        "extracted": None,
    }


def _r_logo_skipped(branding: dict) -> dict:
    standard = branding.get("standard_palettes") or []
    return {
        "message": "No problem — let's start with one of our professional workspace themes. Pick one to preview.",
        "ui": _ui_theme_picker(),
        "data": {
            "logo_url": "",
            "extracted_colors": [],
            "palettes": [],
            "standard_palettes": standard,
        },
        "phase": PHASE_THEME_PICKER,
        "off_topic": False,
        "extracted": None,
    }


def _r_invalid_logo(reason: str) -> dict:
    return {
        "message": f"That file doesn't look like a logo image — {reason}. Try a PNG, JPG, or SVG instead, or skip if you don't have one.",
        "ui": _ui_logo_upload(),
        "data": {},
        "phase": PHASE_BRANDING_CHOICE,
        "off_topic": False,
        "extracted": None,
    }


def _r_after_theme_selected(selected: dict, company_name: str = "") -> dict:
    fallback = "Great choice. Your workspace is starting to look amazing — let's bring your team in next."
    msg = _phrase(
        f"The user selected a theme with primary {selected.get('primary')}. "
        f"Their company is {company_name or 'their workspace'}. "
        "Compliment the choice and pivot to bringing in their team. ONE short sentence. No emoji.",
        fallback=fallback,
        temperature=0.6,
    )
    return {
        "message": msg + " Do you already have your employee list ready?",
        "ui": _ui_employee_choice(),
        "data": {"selected_theme": selected},
        "phase": PHASE_EMPLOYEE_CHOICE,
        "off_topic": False,
        "extracted": None,
    }


def _r_employee_choice() -> dict:
    return {
        "message": "Do you already have your employee list ready? You can upload a sheet, try our demo data, or skip for now.",
        "ui": _ui_employee_choice(),
        "data": {},
        "phase": PHASE_EMPLOYEE_CHOICE,
        "off_topic": False,
        "extracted": None,
    }


def _r_employee_upload_prompt() -> dict:
    return {
        "message": "Great. Download our template, fill in your team, then drop it back here — I'll validate it instantly.",
        "ui": _ui_employee_upload(),
        "data": {},
        "phase": PHASE_EMPLOYEE_UPLOAD,
        "off_topic": False,
        "extracted": None,
    }


def _r_employee_validation(employees: list, validation: dict, *, method: str) -> dict:
    """Phrase the validation summary and offer next-step buttons."""
    missing  = len(validation.get("missing_columns") or [])
    invalid  = len(validation.get("invalid_rows") or [])
    dupes    = len(validation.get("duplicate_entries") or [])
    empties  = len(validation.get("empty_required_fields") or [])
    bad_dt   = len(validation.get("invalid_date_formats") or [])
    n        = len(employees)
    has_blockers = any((missing, invalid, dupes, empties, bad_dt))

    if method == "sample":
        fallback = f"Perfect — I've prepared {n} demo employees so you can explore Worklynx instantly."
        msg = _phrase(
            f"We just loaded {n} demo employees on the user's behalf. "
            "Tell them in ONE short sentence we've prepared the demo set so they can explore. No emoji.",
            fallback=fallback,
            temperature=0.5,
        )
    elif n == 0:
        fallback = "I couldn't find any employee rows in that file — try filling in the template and re-uploading."
        msg = _phrase(
            "The user uploaded an Excel file but it had zero employee rows. "
            "Tell them gently in ONE sentence that the file looks empty and to fill in the template.",
            fallback=fallback,
            temperature=0.4,
        )
    elif has_blockers:
        problems = []
        if missing:  problems.append(f"{missing} missing column(s)")
        if invalid:  problems.append(f"{invalid} invalid row(s)")
        if dupes:    problems.append(f"{dupes} duplicate(s)")
        if empties:  problems.append(f"{empties} empty required field(s)")
        if bad_dt:   problems.append(f"{bad_dt} bad date(s)")
        fallback = (
            f"I found {n} employees, but there are a few issues to look at: "
            f"{', '.join(problems)}. You can still import or fix the file first."
        )
        msg = _phrase(
            f"The user uploaded {n} employees and we found these problems: "
            f"{', '.join(problems)}. Summarize in ONE short sentence and offer to import "
            "as-is or re-upload after fixing.",
            fallback=fallback,
            temperature=0.4,
        )
    else:
        fallback = f"I found {n} employees ready to import — everything looks clean."
        msg = _phrase(
            f"The user uploaded {n} employees and the file is fully clean. "
            "Tell them in ONE short, confident sentence we found {n} ready to import. No emoji.",
            fallback=fallback,
            temperature=0.5,
        )

    return {
        "message": msg,
        "ui": _ui_employee_preview(),
        "data": {
            "employees": employees,
            "row_count": n,
            "validation": validation,
            "method": method,
        },
        "phase": PHASE_EMPLOYEE_PREVIEW,
        "off_topic": False,
        "extracted": None,
    }


def _r_employees_skipped() -> dict:
    return {
        "message": "No worries — you can always import employees later from the dashboard.",
        "ui": _ui_skipped_continue(),
        "data": {},
        "phase": PHASE_FINALIZE,
        "off_topic": False,
        "extracted": None,
    }


def _r_invalid_excel(reason: str) -> dict:
    return {
        "message": f"That file doesn't look like the employee template — {reason}. Re-download the template and try again.",
        "ui": _ui_employee_upload(),
        "data": {},
        "phase": PHASE_EMPLOYEE_UPLOAD,
        "off_topic": False,
        "extracted": None,
    }


def _r_ready_to_finalize(company_name: str, n_employees: int) -> dict:
    company = company_name or "your workspace"
    fallback = (
        f"{company}'s workspace is fully configured. "
        "Launch it to start managing your team."
    )
    msg = _phrase(
        f"The user has finished onboarding setup for {company!r} "
        f"with {n_employees} employees on file. "
        "Confirm in ONE short, professional sentence that everything is "
        "configured and they can launch the workspace. "
        "Avoid words like 'magic', 'wow', 'amazing', or any emoji.",
        fallback=fallback,
        temperature=0.55,
    )
    return {
        "message": msg,
        "ui": _ui_finalize(),
        "data": {},
        "phase": PHASE_FINALIZE,
        "off_topic": False,
        "extracted": None,
    }


def _r_completed(company_name: str, final_payload: dict) -> dict:
    fallback = f"You're all set, {company_name}. Welcome to your Worklynx workspace." if company_name else "You're all set. Welcome to your Worklynx workspace."
    msg = _phrase(
        f"The user just finalized onboarding for {company_name or 'their company'}. "
        "Congratulate them in ONE short, warm sentence and welcome them in. Up to one emoji.",
        fallback=fallback,
        temperature=0.7,
    )
    return {
        "message": msg,
        "ui": _ui_complete(),
        "data": {"final": final_payload},
        "phase": PHASE_COMPLETE,
        "off_topic": False,
        "extracted": None,
    }


def _r_offtopic_redirect(current_phase: str, redirect_note: str) -> dict:
    """Bounce off-topic input back to whatever UI the current phase expects."""
    fillers = {
        PHASE_COMPANY:          "What's your business called?",
        PHASE_BRANDING_CHOICE:  "Do you have your company logo?",
        PHASE_THEME_PICKER:     "Pick a theme to keep going.",
        PHASE_EMPLOYEE_CHOICE:  "How would you like to add employees — upload, demo, or skip?",
        PHASE_EMPLOYEE_UPLOAD:  "Drop your filled template here when ready.",
        PHASE_EMPLOYEE_PREVIEW: "Confirm the import or pick a different option.",
        PHASE_FINALIZE:         "We're one step away — ready to finish up?",
    }
    redirect = fillers.get(current_phase, "Let's continue your setup.")
    note = redirect_note.strip() or "Let's stay focused on your setup."
    msg = f"{note} {redirect}".strip()

    ui_for_phase = {
        PHASE_COMPANY:          _ui_text(placeholder="Type your business name…", submit_label="Continue"),
        PHASE_BRANDING_CHOICE:  _ui_buttons([
            {"id": "logo_upload", "label": "Upload Logo",      "variant": "primary", "icon": "upload"},
            {"id": "logo_skip",   "label": "I don't have one", "variant": "ghost",   "icon": "x"},
        ]),
        PHASE_THEME_PICKER:     _ui_theme_picker(),
        PHASE_EMPLOYEE_CHOICE:  _ui_employee_choice(),
        PHASE_EMPLOYEE_UPLOAD:  _ui_employee_upload(),
        PHASE_EMPLOYEE_PREVIEW: _ui_employee_preview(),
        PHASE_FINALIZE:         _ui_finalize(),
    }
    return {
        "message":  msg,
        "ui":       ui_for_phase.get(current_phase, _ui_none()),
        "data":     {},
        "phase":    current_phase,
        "off_topic": True,
        "extracted": None,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Public entry point — chat_turn
# ─────────────────────────────────────────────────────────────────────────────

#  side_effect kinds the router can hand us:
#     "logo_uploaded"    + branding   -> theme picker
#     "logo_invalid"     + reason
#     "logo_skipped"     + branding
#     "theme_selected"   + selected   -> employee choice
#     "employees_parsed" + employees, validation, method
#     "employees_skipped"
#     "excel_invalid"    + reason
#     "finalized"        + final_payload
#
#  intent strings the router can hand us (when no text):
#     "start"  | "logo_upload_prompt" | "logo_skip" | "employees_choice"
#     "employees_upload_prompt"       | "back_to_employees_choice"
#     "finalize_prompt"

def chat_turn(
    session: dict[str, Any],
    *,
    user_text: str | None = None,
    intent:    str | None = None,
    side_effect: dict | None = None,
) -> dict[str, Any]:
    """
    Decide what Lynx should say next.

    The router has *already* applied any side-effect against the existing
    services (theme_service, excel_service, json_builder) and updated
    `session` accordingly. This function looks at the resulting state and
    returns the conversational reply + a UI descriptor for the frontend.

    Side-effect-driven flows take priority. When neither a side-effect nor
    an intent is present, we re-render the current phase (idempotent).
    """
    company_name = (session.get("company") or {}).get("name", "").strip()

    # ── 1. Side-effect-driven replies ───────────────────────────────────────
    if side_effect:
        kind = side_effect.get("kind")

        if kind == "logo_uploaded":
            return _r_after_logo_uploaded(session.get("branding") or {})

        if kind == "logo_invalid":
            return _r_invalid_logo(side_effect.get("reason") or "we couldn't read it")

        if kind == "logo_skipped":
            return _r_logo_skipped(session.get("branding") or {})

        if kind == "theme_selected":
            return _r_after_theme_selected(side_effect.get("selected") or {}, company_name)

        if kind == "employees_parsed":
            return _r_employee_validation(
                side_effect.get("employees") or [],
                side_effect.get("validation") or {},
                method=side_effect.get("method") or "uploaded",
            )

        if kind == "employees_skipped":
            return _r_employees_skipped()

        if kind == "excel_invalid":
            return _r_invalid_excel(side_effect.get("reason") or "wrong format")

        if kind == "finalized":
            return _r_completed(company_name, side_effect.get("final_payload") or {})

    # ── 2. Intent-driven replies (button taps with no side-effect yet) ──────
    if intent:
        if intent == "start":
            return _r_welcome(session)
        if intent == "logo_upload_prompt":
            return _r_logo_prompt_upload()
        if intent == "logo_skip":
            # No backend mutation needed; just transition to theme picker.
            return _r_logo_skipped(session.get("branding") or {})
        if intent in ("employees_choice", "back_employee_choice", "back_to_employees_choice"):
            return _r_employee_choice()
        if intent == "employees_upload_prompt":
            return _r_employee_upload_prompt()
        if intent == "finalize_prompt":
            n = len((session.get("employees") or {}).get("employees") or [])
            return _r_ready_to_finalize(company_name, n)

        # Revert intents — user clicked "Change" on a previous answer. The
        # router already cleared the corresponding slice of session state;
        # we just re-render the step's UI so the user can re-answer.
        if intent == "revert_company":
            return _r_welcome(session)
        if intent == "revert_logo":
            return _r_branding_choice()
        if intent == "revert_theme":
            branding = session.get("branding") or {}
            return {
                "message": "No problem — pick a different theme.",
                "ui": _ui_theme_picker(),
                "data": {
                    "logo_url":          branding.get("logo_url", ""),
                    "extracted_colors":  branding.get("extracted_colors") or [],
                    "palettes":          branding.get("palettes") or [],
                    "standard_palettes": branding.get("standard_palettes") or [],
                },
                "phase":     PHASE_THEME_PICKER,
                "off_topic": False,
                "extracted": None,
            }
        if intent == "revert_employees":
            return _r_employee_choice()

    # ── 3. Free-text user input — interpret against the current phase ──────
    phase = resolve_phase(session)

    if phase == PHASE_WELCOME or phase == PHASE_COMPANY:
        cls = _classify_company_input(user_text or "")
        if cls["on_topic"] and cls["company_name"]:
            return _r_after_company(cls["company_name"])
        return _r_company_redirect(cls["redirect_note"])

    # Free-text handling for the branding choice. Order matters here:
    #   1. Recall  ("what's my business name?") — answer it.
    #   2. Correction ("sorry, actually it's X IT Solutions") — update the
    #      company name and re-ask about the logo.
    #   3. Strict affirm  ("yes" / "i have one")  → show the logo dropzone.
    #   4. Strict skip    ("no" / "i don't")     → run the skip flow.
    # Anything else falls through to the AI off-topic classifier below.
    if phase == PHASE_BRANDING_CHOICE and user_text:
        # 1. Recall question — must come BEFORE affirm/skip so a question
        #    that happens to contain "yes" doesn't get mis-routed.
        if _is_recall_question(user_text):
            return _r_company_recall(company_name)

        # 2. Self-correction — extract the corrected name via Gemini.
        if _matches_any(user_text, _CORRECTION_PATTERNS):
            new_name = _extract_corrected_name(user_text, company_name)
            if new_name and new_name.lower() != company_name.lower():
                return _r_company_corrected(new_name)

        # 3. Strict affirmative — short, unambiguous, no question keywords.
        if _is_clear_affirmative(user_text):
            return _r_logo_prompt_upload()

        # 4. Strict skip.
        if _is_clear_negative(user_text):
            resp = _r_logo_skipped(session.get("branding") or {})
            # The router applies the corresponding side-effect (clear matched
            # palettes, mark branding_path_selected) so subsequent turns find
            # the session in the same shape as if the button were clicked.
            resp["inferred_intent"] = "logo_skip"
            return resp

    if user_text:
        # In any other phase, free text is treated as off-topic and bounced
        # back to the UI the phase already expects.
        cls = _classify_general_offtopic(user_text, phase)
        if not cls["on_topic"]:
            return _r_offtopic_redirect(phase, cls["redirect_note"])

    # ── 4. Idempotent re-render of the current phase ────────────────────────
    if phase == PHASE_BRANDING_CHOICE:
        return _r_branding_choice()
    if phase == PHASE_THEME_PICKER:
        branding = session.get("branding") or {}
        return {
            "message": "Pick a theme to preview your workspace.",
            "ui": _ui_theme_picker(),
            "data": {
                "logo_url": branding.get("logo_url", ""),
                "extracted_colors": branding.get("extracted_colors") or [],
                "palettes": branding.get("palettes") or [],
                "standard_palettes": branding.get("standard_palettes") or [],
            },
            "phase": PHASE_THEME_PICKER,
            "off_topic": False,
            "extracted": None,
        }
    if phase == PHASE_EMPLOYEE_CHOICE:
        return _r_employee_choice()
    if phase == PHASE_EMPLOYEE_UPLOAD:
        return _r_employee_upload_prompt()
    if phase == PHASE_EMPLOYEE_PREVIEW:
        emp = session.get("employees") or {}
        return _r_employee_validation(
            emp.get("employees") or [], emp.get("validation") or {},
            method=emp.get("method") or "uploaded",
        )
    if phase == PHASE_FINALIZE:
        n = len((session.get("employees") or {}).get("employees") or [])
        return _r_ready_to_finalize(company_name, n)
    if phase == PHASE_COMPLETE:
        # No mutation happens here — the router only enters PHASE_COMPLETE
        # via a "finalized" side-effect, which is handled above.
        return _r_completed(company_name, {})

    # Default — restart the welcome.
    return _r_welcome(session)
