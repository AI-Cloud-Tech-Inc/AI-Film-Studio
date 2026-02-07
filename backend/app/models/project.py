"""
Project database model
"""
from sqlalchemy import Column, String, Text, Enum as SQLEnum
from app.models.base import BaseModel
import enum


class ProjectStatus(str, enum.Enum):
    """Project status enum"""
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class Project(BaseModel):
    """Project model"""
    __tablename__ = "projects"
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.DRAFT, nullable=False)
    video_format = Column(String(50), default="landscape")
    duration = Column(String(50))
    output_url = Column(String(500))
