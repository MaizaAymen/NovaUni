from bson import ObjectId
from pydantic import BaseModel
from typing import Optional

class CourseSchema(BaseModel):
    _id: Optional[str] = None  # Store ObjectId as a string
    name: str
    description: Optional[str] = None
    video_url: Optional[str] = None  # Optional suggested video URL
    category: Optional[str] = None  # Course category: informatique, gestion, prepa, english
    price: Optional[float] = None

    class Config:
        json_encoders = {ObjectId: str}
        from_attributes = True  # Renamed in Pydantic V2 (replaces orm_mode)
