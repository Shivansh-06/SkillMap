from fastapi import FastAPI, HTTPException
import json
from pathlib import Path

from logic.evaluator import calculate_score, get_skill_level
from logic.roadmap import generate_roadmap
from models.schemas import AssessmentRequest, AssessmentResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="SkillMap", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent

# Load data
with open(BASE_DIR / "data" / "questions.json", "r") as f:
    QUESTIONS = json.load(f)

with open(BASE_DIR / "data" / "careers.json", "r") as f:
    CAREERS = json.load(f)


@app.get("/")
def root():
    return {"message": "SkillMap API is running"}

@app.get("/questions")
def get_questions(career: str):
    if career not in CAREERS:
        raise HTTPException(status_code=400, detail="Invalid career selected")

    # For MVP, return all questions
    # Later: filter by career / difficulty
    return {
        "career": career,
        "questions": QUESTIONS
    }


@app.post("/assess", response_model=AssessmentResponse)
def assess(request: AssessmentRequest):

    # Load careers dynamically
    with open("data/careers.json") as f:
        careers = json.load(f)

    if request.career not in careers:
        raise HTTPException(status_code=400, detail="Invalid career selected")

    required_skills = careers[request.career]["required_skills"]

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
    max_score = 0

    for skill, total in skill_total.items():
        if total == 0:
            continue

        score = calculate_score(skill_correct[skill], total)
        level = get_skill_level(score)
        skill_dna[skill] = level

        # Only compute alignment on required skills
        if skill in required_skills:
            alignment_score += score
            max_score += 100  # each skill max is 100

    # Normalize alignment score to percentage
    if max_score > 0:
        alignment_score = int((alignment_score / max_score) * 100)
    else:
        alignment_score = 0

    # Generate dependency-aware roadmap
    roadmap = generate_roadmap(skill_dna, request.career)

    # Strong skills to avoid for now
    avoid = [
        skill for skill in required_skills
        if skill_dna.get(skill) == "Strong"
    ]

    return {
        "skill_dna": skill_dna,
        "career_alignment": alignment_score,
        "roadmap": roadmap,
        "avoid_for_now": avoid
    }
