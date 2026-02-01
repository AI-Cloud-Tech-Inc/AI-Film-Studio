"""
AI Film Studio - Main Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print(f"🎬 Starting {settings.APP_NAME}...")
    yield
    # Shutdown
    print("🛑 Shutting down AI Film Studio...")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered end-to-end video production platform",
    version=settings.API_VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=f"/api/{settings.API_VERSION}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AI Film Studio API",
        "version": settings.API_VERSION,
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
