def generate_roadmap(skill_dna: dict) -> tuple[list, list]:
    roadmap = []
    avoid = []

    for skill, level in skill_dna.items():
        if level == "Missing":
            roadmap.append(skill)

    for skill, level in skill_dna.items():
        if level == "Weak":
            roadmap.append(skill)

    for skill, level in skill_dna.items():
        if level == "Strong":
            avoid.append(skill)

    return roadmap, avoid
