import json
from logic.dependency_resolver import resolve_roadmap


def generate_roadmap(skill_levels, career):
    """
    Generates dependency-aware roadmap for a given career.
    """

    # Load skills
    with open("data/skills.json") as f:
        skills_data = json.load(f)

    # Load careers
    with open("data/careers.json") as f:
        careers = json.load(f)

    required_skills = careers[career]["required_skills"]

    roadmap = resolve_roadmap(
        skills_data,
        required_skills,
        skill_levels
    )

    return roadmap
