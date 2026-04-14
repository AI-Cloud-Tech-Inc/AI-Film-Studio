"""
Scene database model
"""
from sqlalchemy import Column, String, Text, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Scene(BaseModel):
    """Scene model"""
    __tablename__ = "scenes"
    
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    sequence_number = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(500))
    video_url = Column(String(500))
    duration = Column(Float, default=5.0)
    
    # Relationships
    project = relationship("Project", backref="scenes")
