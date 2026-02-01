"""
AI Content Generation Service
Integrates with OpenAI, Anthropic for text/script generation
"""
from typing import Dict, Any, Optional
import logging
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
from app.core.config import settings

logger = logging.getLogger(__name__)


class AIGenerator:
    """AI content generation using OpenAI and Anthropic"""
    
    def __init__(self):
        """Initialize AI clients"""
        self.openai_client = None
        self.anthropic_client = None
        
        if settings.OPENAI_API_KEY:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            logger.info("OpenAI client initialized")
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            logger.info("Anthropic client initialized")
    
    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: str = "gpt-4",
        max_tokens: int = 2000,
        temperature: float = 0.7
    ) -> str:
        """
        Generate text using specified AI model
        
        Args:
            prompt: User prompt
            system_prompt: System instruction
            model: Model to use (gpt-4, claude-3-opus, etc.)
            max_tokens: Maximum response tokens
            temperature: Creativity level (0-1)
            
        Returns:
            Generated text content
        """
        try:
            if model.startswith("gpt") and self.openai_client:
                return await self._generate_openai(prompt, system_prompt, model, max_tokens, temperature)
            elif model.startswith("claude") and self.anthropic_client:
                return await self._generate_anthropic(prompt, system_prompt, model, max_tokens, temperature)
            else:
                logger.warning(f"Model {model} not available, using fallback")
                return self._generate_fallback(prompt)
        except Exception as e:
            logger.error(f"Error generating text: {str(e)}")
            return self._generate_fallback(prompt)
    
    async def _generate_openai(
        self,
        prompt: str,
        system_prompt: Optional[str],
        model: str,
        max_tokens: int,
        temperature: float
    ) -> str:
        """Generate using OpenAI"""
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        response = await self.openai_client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.choices[0].message.content
    
    async def _generate_anthropic(
        self,
        prompt: str,
        system_prompt: Optional[str],
        model: str,
        max_tokens: int,
        temperature: float
    ) -> str:
        """Generate using Anthropic Claude"""
        response = await self.anthropic_client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt or "You are a helpful AI assistant.",
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def _generate_fallback(self, prompt: str) -> str:
        """Fallback generation when APIs are unavailable"""
        logger.info("Using fallback generation")
        return f"Generated content based on: {prompt[:100]}..."


# Global instance
ai_generator = AIGenerator()
