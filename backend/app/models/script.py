"""
Script database model
"""
from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Script(BaseModel):
    """Script model"""
    __tablename__ = "scripts"
    
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(50), default="en")
    
    # Relationships
    project = relationship("Project", backref="scripts")
