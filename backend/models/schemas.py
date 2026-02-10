from pydantic import BaseModel
from typing import List, Dict


class Answer(BaseModel):
    question_id: int
    selected: str


class AssessmentRequest(BaseModel):
    career: str
    answers: List[Answer]


class AssessmentResponse(BaseModel):
    skill_dna: Dict[str, str]
    career_alignment: int
    roadmap: List[str]
    avoid_for_now: List[str]
