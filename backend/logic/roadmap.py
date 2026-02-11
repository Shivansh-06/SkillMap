import json
from logic.dependency_resolver import resolve_roadmap


def generate_roadmap(skill_levels, career):
    """
    Generates dependency-aware roadmap for a given career.
    Only returns skills that are Missing or Weak.
    """

    # Load skills
    with open("data/skills.json") as f:
        skills_data = json.load(f)

    # Load careers
    with open("data/careers.json") as f:
        careers = json.load(f)

    required_skills = careers[career]["required_skills"]

    # Get dependency-ordered roadmap
    ordered_skills = resolve_roadmap(
        skills_data,
        required_skills,
        skill_levels
    )

    # STRICT FILTERING (Option A)
    roadmap = [
        skill for skill in ordered_skills
        if skill_levels.get(skill) in ["Missing", "Weak"]
    ]

    return roadmap
