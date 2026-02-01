"""
Autonomous Film Creation API Routes
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import logging
from app.agents.orchestrator import AgentOrchestrator
from app.services.ai_generator import ai_generator
from app.services.video_generator import video_generator
from app.services.audio_generator import audio_generator

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize orchestrator
orchestrator = AgentOrchestrator()


class FilmRequest(BaseModel):
    """Film creation request"""
    prompt: str = Field(..., description="Film concept/idea", min_length=10)
    style: str = Field(default="cinematic", description="Visual style")
    duration: Optional[int] = Field(default=30, description="Target duration in seconds", ge=5, le=300)
    voice_id: Optional[str] = Field(default=None, description="ElevenLabs voice ID")
    music_style: Optional[str] = Field(default="cinematic orchestral", description="Music style")
    model: str = Field(default="gpt-4", description="AI model for script generation")


class FilmResponse(BaseModel):
    """Film creation response"""
    status: str
    film_id: str
    message: str
    data: Optional[Dict[str, Any]] = None


@router.post("/create-film", response_model=FilmResponse)
async def create_autonomous_film(request: FilmRequest, background_tasks: BackgroundTasks):
    """
    Create a complete film autonomously from a text prompt
    
    This endpoint orchestrates all AI agents to:
    1. Generate creative vision and scene breakdown (Director)
    2. Write detailed script with dialogue (Screenwriter)
    3. Generate video clips for each scene (Video Generator)
    4. Generate voiceover and music (Audio Generator)
    5. Assemble final film (Editor)
    """
    try:
        logger.info(f"Starting autonomous film creation: {request.prompt[:50]}...")
        
        # Step 1: Orchestrate the complete workflow
        result = await orchestrator.create_film(
            user_prompt=request.prompt,
            style=request.style
        )
        
        if result.get("status") == "error":
            raise HTTPException(status_code=500, detail=result.get("error"))
        
        # Step 2: Generate media assets (video and audio)
        scenes = result["director_vision"]["scenes"]
        script_scenes = result["script"]["script_scenes"]
        
        # Generate video for each scene
        video_tasks = []
        for idx, scene in enumerate(scenes):
            script = script_scenes[idx] if idx < len(script_scenes) else {}
            video_prompt = f"{request.style}: {script.get('visual_description', scene.get('description'))}"
            
            video_result = await video_generator.generate_video_from_text(
                prompt=video_prompt,
                duration=scene.get("duration", 10),
                style=request.style
            )
            video_tasks.append(video_result)
        
        # Generate audio for each scene
        audio_tasks = []
        for idx, script_scene in enumerate(script_scenes):
            narration = script_scene.get("narration", "")
            music_prompt = f"{request.music_style} for {script_scene.get('description', 'scene')}"
            
            audio_result = await audio_generator.generate_scene_audio(
                narration_text=narration,
                music_prompt=music_prompt,
                duration=scenes[idx].get("duration", 10) if idx < len(scenes) else 10,
                voice_id=request.voice_id
            )
            audio_tasks.append(audio_result)
        
        # Step 3: Assemble final film
        assembly_result = await orchestrator.editor.process({
            "scenes": scenes,
            "video_clips": [v.get("video_url", "") for v in video_tasks],
            "audio_files": [a.get("music_url", "") for a in audio_tasks]
        })
        
        # Generate unique film ID
        import uuid
        film_id = str(uuid.uuid4())
        
        response_data = {
            "film_id": film_id,
            "prompt": request.prompt,
            "style": request.style,
            "scenes": len(scenes),
            "total_duration": sum(s.get("duration", 0) for s in scenes),
            "director_vision": result["director_vision"],
            "script": result["script"],
            "video_assets": video_tasks,
            "audio_assets": audio_tasks,
            "timeline": assembly_result["timeline"],
            "agents_used": ["Director", "Screenwriter", "Video Generator", "Audio Generator", "Editor"]
        }
        
        logger.info(f"Film created successfully: {film_id}")
        
        return FilmResponse(
            status="success",
            film_id=film_id,
            message=f"Film created successfully with {len(scenes)} scenes",
            data=response_data
        )
    
    except Exception as e:
        logger.error(f"Error creating film: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-scene", response_model=Dict[str, Any])
async def generate_single_scene(
    prompt: str,
    style: str = "cinematic",
    duration: int = 10,
    include_audio: bool = True,
    voice_id: Optional[str] = None
):
    """
    Generate a single scene with video and audio
    """
    try:
        # Generate script using AI
        script_prompt = f"""
        Create a detailed scene description for: {prompt}
        Style: {style}
        Duration: {duration} seconds
        
        Include:
        - Visual description
        - Narration text
        - Camera movement
        - Mood and atmosphere
        """
        
        script = await ai_generator.generate_text(
            prompt=script_prompt,
            system_prompt="You are a professional film screenwriter.",
            max_tokens=500
        )
        
        # Generate video
        video_result = await video_generator.generate_video_from_text(
            prompt=f"{style}: {prompt}",
            duration=duration,
            style=style
        )
        
        # Generate audio if requested
        audio_result = None
        if include_audio:
            audio_result = await audio_generator.generate_scene_audio(
                narration_text=script,
                music_prompt=f"{style} background music",
                duration=duration,
                voice_id=voice_id
            )
        
        return {
            "status": "success",
            "script": script,
            "video": video_result,
            "audio": audio_result,
            "duration": duration
        }
    
    except Exception as e:
        logger.error(f"Error generating scene: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agent-status")
async def get_agent_status():
    """Get status of all AI agents"""
    return {
        "status": "active",
        "agents": orchestrator.get_agent_status(),
        "services": {
            "ai_generator": "active" if ai_generator.openai_client else "unavailable",
            "video_generator": "active",
            "audio_generator": "active" if audio_generator.elevenlabs_client else "unavailable"
        }
    }


@router.post("/clear-memory")
async def clear_agent_memory():
    """Clear memory from all agents"""
    orchestrator.clear_all_memory()
    return {"status": "success", "message": "All agent memories cleared"}


@router.get("/voices")
async def list_voices():
    """List available ElevenLabs voices"""
    voices = await audio_generator.list_available_voices()
    return {"voices": voices, "total": len(voices)}
