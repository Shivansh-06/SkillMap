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
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent

# Load data
with open(BASE_DIR / "data" / "questions.json", "r") as f:
    QUESTIONS = json.load(f)

with open(BASE_DIR / "data" / "careers.json", "r") as f:
    CAREERS = json.load(f)

with open(BASE_DIR / "data" / "skills.json") as f:
    skills_data = json.load(f)

def count_career_dependents(target, required_skills):
    count = 0
    for skill in required_skills:
        prerequisites = skills_data.get(skill, {}).get("prerequisites", [])
        if target in prerequisites:
            count += 1
    return count





@app.get("/")
def root():
    return {"message": "SkillMap API is running"}

@app.get("/questions")
def get_questions(career: str):
    if career not in CAREERS:
        raise HTTPException(status_code=400, detail="Invalid career selected")

    required_skills = CAREERS[career]["required_skills"]

    filtered_questions = [
        q for q in QUESTIONS
        if q["skill"] in required_skills
    ]

    return {
        "career": career,
        "questions": filtered_questions
    }



@app.post("/assess", response_model=AssessmentResponse)
def assess(request: AssessmentRequest):

    if request.career not in CAREERS:
        raise HTTPException(status_code=400, detail="Invalid career selected")

    required_skills = CAREERS[request.career]["required_skills"]

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

        if skill in required_skills:
            alignment_score += score
            max_score += 100

    # Normalize alignment
    if max_score > 0:
        alignment_score = int((alignment_score / max_score) * 100)
    else:
        alignment_score = 0

    # ----------- INSIGHT METRICS -----------

    missing_skills = []
    weak_skills = []
    strong_skills = []

    for skill in required_skills:
        level = skill_dna.get(skill)
        if level == "Missing":
            missing_skills.append(skill)
        elif level == "Weak":
            weak_skills.append(skill)
        elif level == "Strong":
            strong_skills.append(skill)

    # Primary bottleneck
    primary_gap = None
    if missing_skills:
        primary_gap = missing_skills[0]
    elif weak_skills:
        primary_gap = weak_skills[0]

    # High-impact gap (has dependents)
    high_impact_gap = None
    if primary_gap and count_career_dependents(primary_gap, required_skills) > 0:
        high_impact_gap = primary_gap

    # ----------- ROADMAP -----------

    roadmap = generate_roadmap(skill_dna, request.career)

    avoid = [
        skill for skill in required_skills
        if skill_dna.get(skill) == "Strong"
    ]

    return {
        "skill_dna": skill_dna,
        "career_alignment": alignment_score,
        "roadmap": roadmap,
        "avoid_for_now": avoid,
        "insights": {
            "primary_gap": primary_gap,
            "missing_count": len(missing_skills),
            "weak_count": len(weak_skills),
            "strong_count": len(strong_skills),
            "high_impact_gap": high_impact_gap
        }
    }

@app.get("/health")
def health():
    return {"status": "ok"}
