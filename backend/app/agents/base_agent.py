"""
Base Agent Class for AI Film Studio
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """Abstract base class for all AI agents"""
    
    def __init__(self, name: str, model: str = "gpt-4"):
        """
        Initialize base agent
        
        Args:
            name: Agent name
            model: LLM model to use
        """
        self.name = name
        self.model = model
        self.memory: list[Dict[str, Any]] = []
        logger.info(f"Initialized {self.name} agent with model {self.model}")
    
    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process input and return output
        
        Args:
            input_data: Input data dictionary
            
        Returns:
            Output data dictionary
        """
        pass
    
    def add_to_memory(self, data: Dict[str, Any]):
        """Add data to agent memory"""
        self.memory.append(data)
        logger.debug(f"{self.name} memory updated: {len(self.memory)} items")
    
    def clear_memory(self):
        """Clear agent memory"""
        self.memory = []
        logger.info(f"{self.name} memory cleared")
    
    def get_context(self, max_items: int = 10) -> list[Dict[str, Any]]:
        """Get recent context from memory"""
        return self.memory[-max_items:]
