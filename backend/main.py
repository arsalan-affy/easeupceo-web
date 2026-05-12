"""
Standalone runner for the onboarding module.

Serves the built React SPA at `/` and the onboarding API at `/onboarding/*`,
so HRMS can redirect users to a single URL like:

    https://onboarding.example.com/?token=<JWT>&org=57&return_url=<encoded>

The SPA reads those query params, calls POST /start/ai-onboarding with them,
runs the chat, then calls POST /finsh/ai-onboarding on Enter Workspace.

Build the frontend first:
    cd frontend-app && npm install && npm run build

Then run:
    python -m uvicorn backend.main:app --reload --port 8000
"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.onboarding.router import router as onboarding_router


PROJECT_ROOT  = Path(__file__).resolve().parents[1]
FRONTEND_DIST = PROJECT_ROOT / "frontend-app" / "dist"


app = FastAPI(title="Worklynx Onboarding API", version="1.0.0")

# CORS stays wide-open so the SPA can also be served from a separate origin
# in dev (vite at :5173 hitting the API at :8000). Tighten in production
# behind your gateway if the SPA is co-deployed with the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(onboarding_router)


# ─────────────────────────────────────────────────────────────────────────────
# SPA: serve `frontend/dist` at `/` so the onboarding deploy is a single URL.
#
# Hashed Vite assets land under `/assets/...`. Any other path falls through
# to index.html so the SPA's client-side routing works (and so an HRMS deep
# link like `/?token=...` lands on the React shell).
# ─────────────────────────────────────────────────────────────────────────────

if FRONTEND_DIST.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=str(FRONTEND_DIST / "assets")),
        name="spa-assets",
    )

    @app.get("/", include_in_schema=False)
    def spa_root():
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa_catchall(full_path: str):
        # Real file in dist (favicon.ico, robots.txt, etc.)
        candidate = FRONTEND_DIST / full_path
        if candidate.is_file():
            return FileResponse(str(candidate))
        # Anything else: hand back the SPA shell.
        return FileResponse(str(FRONTEND_DIST / "index.html"))

else:
    @app.get("/", include_in_schema=False)
    def spa_missing():
        return JSONResponse(
            status_code=503,
            content={
                "service": "worklynx-onboarding",
                "status":  "frontend not built",
                "hint":    "run `cd frontend-app && npm install && npm run build`",
            },
        )
