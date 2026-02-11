from pydantic import BaseModel
from typing import List, Dict, Optional


class Answer(BaseModel):
    question_id: int
    selected: str


class AssessmentRequest(BaseModel):
    career: str
    answers: List[Answer]

class InsightResponse(BaseModel):
    primary_gap: Optional[str]
    missing_count: int
    weak_count: int
    strong_count: int
    high_impact_gap: Optional[str]


class AssessmentResponse(BaseModel):
    skill_dna: Dict[str, str]
    career_alignment: int
    roadmap: List[str]
    avoid_for_now: List[str]
    insights: InsightResponse
