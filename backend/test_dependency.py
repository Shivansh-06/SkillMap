import json
from logic.dependency_resolver import resolve_roadmap

with open("data/skills.json") as f:
    skills_data = json.load(f)

with open("data/careers.json") as f:
    careers = json.load(f)

career = "Data Scientist"
required_skills = careers[career]["required_skills"]

# Simulated skill levels
skill_levels = {
    "Probability": "Weak",
    "Statistics": "Weak",
    "Linear Algebra": "Weak",
    "Python Basics": "Weak",
    "Python for Data": "Weak",
    "Machine Learning": "Missing",
    "Model Evaluation": "Missing"
}

roadmap = resolve_roadmap(
    skills_data,
    required_skills,
    skill_levels
)

print("Generated Roadmap:")
for skill in roadmap:
    print("-", skill)
