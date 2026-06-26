from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import shops, search, gaps, dashboard

app = FastAPI(
    title="LocalPulse AI",
    description="The living nervous system of your neighborhood",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(shops.router)
app.include_router(search.router)
app.include_router(gaps.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "app": "LocalPulse AI",
        "tagline": "Google Maps shows what exists. LocalPulse shows what's alive — and what's missing.",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
