# `frontend/src/modules/onboarding`

The Worklynx onboarding chat module. A self-contained React SPA that drives
the entire conversational flow with **Lynx**, the AI co-partner.

```jsx
import OnboardingShell from 'src/modules/onboarding';

<OnboardingShell onComplete={(sessionId, fallbackPayload) => {
  // call POST /finsh/ai-onboarding with sessionId, then redirect
}} />
```

The shell is fully self-contained: it owns its own session via `useLynxChat`,
its own theming via the `.lynx-shell` scope, and its own API client via
`onboardingApi`. The default mount in [`frontend/src/main.jsx`](../../main.jsx)
wires `onComplete` to the `/finsh/ai-onboarding` endpoint and redirects to
the URL the HRMS handed off in the entry query string.

## Module layout

```
modules/onboarding/
├── OnboardingShell.jsx          ← public entry, renders <LynxChat>
├── index.js                     ← named exports (OnboardingShell, LynxChat, useLynxChat, onboardingApi)
├── onboardingApi.js             ← thin fetch client for /start/ai-onboarding, /chat, /finalize
├── onboarding.css               ← shared component tokens (ThemePreview / EmployeeTable / ValidationReport)
├── lynxChat.css                 ← chat-specific styles (.lynx-shell, .lynx-bubble, …)
├── assets/
│   └── worklynx-logo.png
├── hooks/
│   └── useLynxChat.js           ← session lifecycle, message thread, persisted state, intent dispatch
└── components/
    ├── LynxChat.jsx             ← chat shell + composer routing
    ├── ThemePreview.jsx         ← live preview of the selected palette
    ├── EmployeeTable.jsx        ← validated row preview
    ├── ValidationReport.jsx     ← errors + warnings display
    └── chat/
        ├── ChatActionButtons.jsx
        ├── ChatComplete.jsx     ← celebration screen + "Enter Workspace"
        ├── ChatEmployeePreview.jsx
        ├── ChatExcelUpload.jsx
        ├── ChatLogoUpload.jsx
        ├── ChatMessage.jsx
        ├── ChatTextComposer.jsx
        ├── ChatThemePicker.jsx
        ├── TypingIndicator.jsx
        └── WelcomeHero.jsx
```

## HRMS handoff

`useLynxChat` reads the handoff context from `window.location.search` on
first load and forwards it to `POST /start/ai-onboarding`:

| Query param | Aliases | Goes to |
|---|---|---|
| `token` | `bearer`, `bearer_token` | `auth.bearer_token` |
| `org` | `organization`, `organization_id` | `auth.organization_id` |
| `return_url` | `return` | `return_url` (replayed by `/finalize`) |
| `user_name`, `user_email`, `user_phone`, `user_id` | — | `user.*` |
| `company` | — | `company.name` (skips the company step) |

After read, the params are stripped from the URL via `history.replaceState`
so the JWT doesn't sit in the address bar. If a fresh handoff is detected,
any persisted `localStorage` session is discarded so a new tenant doesn't
resume someone else's chat.

## Backend it talks to

See [`/API.md`](../../../../API.md) at the repo root for the full request /
response contract. The only endpoints this module hits:

* `POST /start/ai-onboarding`               — bootstrap / resume
* `POST /onboarding/chat`                — every multi-turn interaction
* `POST /finsh/ai-onboarding`            — Enter Workspace
* `GET  /onboarding/employees/template`  — Excel template download

## Env

```
# frontend/.env.local
VITE_ONBOARDING_API_BASE=
```

Empty = same-origin (production: backend serves the built SPA at `/`).
Set to `http://127.0.0.1:8000` when running `vite dev` against a backend on
a different port.
