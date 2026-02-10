from fastapi import FastAPI, HTTPException
import json
from pathlib import Path

from logic.evaluator import calculate_score, get_skill_level
from logic.roadmap import generate_roadmap
from models.schemas import AssessmentRequest, AssessmentResponse

app = FastAPI(title="SkillMap", version="0.1.0")

BASE_DIR = Path(__file__).resolve().parent

# Load data
with open(BASE_DIR / "data" / "questions.json", "r") as f:
    QUESTIONS = json.load(f)

with open(BASE_DIR / "data" / "careers.json", "r") as f:
    CAREERS = json.load(f)


@app.get("/")
def root():
    return {"message": "SkillMap AI API is running"}


@app.post("/assess", response_model=AssessmentResponse)
def assess(request: AssessmentRequest):

    if request.career not in CAREERS:
        raise HTTPException(status_code=400, detail="Invalid career selected")

    # Initialize counters
    skill_correct = {}
    skill_total = {}

    for q in QUESTIONS:
        skill = q["skill"]
        skill_correct.setdefault(skill, 0)
        skill_total.setdefault(skill, 0)

    # Score answers
    for answer in request.answers:
        question = next((q for q in QUESTIONS if q["id"] == answer.question_id), None)
        if question:
            skill = question["skill"]
            skill_total[skill] += 1
            if answer.selected == question["answer"]:
                skill_correct[skill] += 1

    # Build Skill DNA
    skill_dna = {}
    alignment_score = 0

    for skill, total in skill_total.items():
        score = calculate_score(skill_correct[skill], total)
        level = get_skill_level(score)
        skill_dna[skill] = level

        weight = CAREERS[request.career]["skills"].get(skill, 0)
        alignment_score += int(score * weight)

    roadmap, avoid = generate_roadmap(skill_dna)

    return {
        "skill_dna": skill_dna,
        "career_alignment": alignment_score,
        "roadmap": roadmap,
        "avoid_for_now": avoid
    }
