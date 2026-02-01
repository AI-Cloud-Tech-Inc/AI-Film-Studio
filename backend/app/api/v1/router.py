"""
API Router - Version 1
"""
from fastapi import APIRouter
from app.api.v1.endpoints import (
    scripts,
    storyboards,
    scenes,
    voiceovers,
    videos,
    projects
)

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(scripts.router, prefix="/scripts", tags=["Scripts"])
api_router.include_router(storyboards.router, prefix="/storyboards", tags=["Storyboards"])
api_router.include_router(scenes.router, prefix="/scenes", tags=["Scenes"])
api_router.include_router(voiceovers.router, prefix="/voiceovers", tags=["Voiceovers"])
api_router.include_router(videos.router, prefix="/videos", tags=["Videos"])
