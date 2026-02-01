"""
Agent Orchestrator - Coordinates all AI agents
"""
from typing import Dict, Any
import logging
from .director_agent import DirectorAgent
from .screenwriter_agent import ScreenwriterAgent
from .editor_agent import EditorAgent

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """Orchestrates the workflow between all AI agents"""
    
    def __init__(self, model: str = "gpt-4"):
        """Initialize all agents"""
        self.director = DirectorAgent(model=model)
        self.screenwriter = ScreenwriterAgent(model=model)
        self.editor = EditorAgent(model=model)
        logger.info("Agent Orchestrator initialized with all agents")
    
    async def create_film(self, user_prompt: str, style: str = "cinematic") -> Dict[str, Any]:
        """
        Orchestrate the complete film creation workflow
        
        Args:
            user_prompt: User's film idea/concept
            style: Visual style preference
            
        Returns:
            Complete film production data
        """
        logger.info(f"Starting autonomous film creation: {user_prompt[:50]}...")
        
        try:
            # Step 1: Director creates vision and scene breakdown
            logger.info("Step 1: Director creating vision...")
            director_output = await self.director.process({
                "prompt": user_prompt,
                "style": style
            })
            
            # Step 2: Screenwriter creates detailed script
            logger.info("Step 2: Screenwriter creating script...")
            screenwriter_output = await self.screenwriter.process({
                "vision": director_output["vision"],
                "scenes": director_output["scenes"]
            })
            
            # Step 3: Generate video and audio (placeholder for now)
            logger.info("Step 3: Generating media assets...")
            media_assets = await self._generate_media_assets(
                director_output["scenes"],
                screenwriter_output["script_scenes"]
            )
            
            # Step 4: Editor assembles final film
            logger.info("Step 4: Editor assembling final film...")
            editor_output = await self.editor.process({
                "scenes": director_output["scenes"],
                "video_clips": media_assets["video_clips"],
                "audio_files": media_assets["audio_files"]
            })
            
            # Compile final result
            result = {
                "status": "success",
                "user_prompt": user_prompt,
                "style": style,
                "director_vision": director_output,
                "script": screenwriter_output,
                "media_assets": media_assets,
                "final_timeline": editor_output,
                "workflow_steps": [
                    {"agent": "Director", "status": "completed"},
                    {"agent": "Screenwriter", "status": "completed"},
                    {"agent": "Media Generator", "status": "completed"},
                    {"agent": "Editor", "status": "completed"}
                ]
            }
            
            logger.info("Film creation completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error in film creation workflow: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "user_prompt": user_prompt
            }
    
    async def _generate_media_assets(
        self,
        scenes: list[Dict[str, Any]],
        script_scenes: list[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate video and audio assets
        TODO: Integrate with AI video/audio generation services
        """
        video_clips = []
        audio_files = []
        
        for idx, scene in enumerate(scenes):
            # Placeholder - will integrate with Stable Diffusion, etc.
            video_clips.append(f"scene_{idx + 1}_video.mp4")
            audio_files.append(f"scene_{idx + 1}_audio.mp3")
        
        return {
            "video_clips": video_clips,
            "audio_files": audio_files,
            "scene_count": len(scenes)
        }
    
    def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        return {
            "director": {
                "name": self.director.name,
                "memory_items": len(self.director.memory)
            },
            "screenwriter": {
                "name": self.screenwriter.name,
                "memory_items": len(self.screenwriter.memory)
            },
            "editor": {
                "name": self.editor.name,
                "memory_items": len(self.editor.memory)
            }
        }
    
    def clear_all_memory(self):
        """Clear memory from all agents"""
        self.director.clear_memory()
        self.screenwriter.clear_memory()
        self.editor.clear_memory()
        logger.info("All agent memories cleared")
