from pydantic import BaseModel, EmailStr
from typing import Optional, List
from bson import ObjectId

# isma3ni ya isnsan rahi base
class EtudiantSchema(BaseModel):
    _id: Optional[str] = None  # This will store the ObjectId as a string
    nom: str
    prenom: str
    speciality: Optional[str] = None  # Make speciality optional
    email: EmailStr
    age: Optional[int] = None

    class Config:
        # This ensures that we can serialize BSON ObjectId to string
        json_encoders = {
            ObjectId: str,
        }
        from_attributes = True  # Renamed in Pydantic V2 (replaces orm_mode)
        extra = "ignore"

class QuestionModel(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class QuizModel(BaseModel):
    _id: Optional[str] = None
    subject: str
    questions: List[QuestionModel]
    ai_generated: Optional[bool] = False
    
class SubmissionModel(BaseModel):
    _id: Optional[str] = None
    student_id: str
    quiz_id: str
    answers: List[str]
    score: Optional[float] = None
    submitted_at: Optional[str] = None
    
    class Config:
        json_encoders = {
            ObjectId: str,
        }
        from_attributes = True
        extra = "ignore"