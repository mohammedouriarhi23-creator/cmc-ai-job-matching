from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.applications import router as applications_router
from app.routers.auth import router as auth_router
from app.routers.candidate_profile import router as candidate_router
from app.routers.companies import router as companies_router
from app.routers.cv import router as cv_router
from app.routers.job_offers import router as job_offers_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    cv_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    candidate_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    companies_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    job_offers_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    applications_router,
    prefix=settings.API_V1_PREFIX,
)


@app.get("/")
def root():
    return {
        "message": "CMC Connect API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
