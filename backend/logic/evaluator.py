def calculate_score(correct: int, total: int) -> int:
    if total == 0:
        return 0
    return int((correct / total) * 100)


def get_skill_level(score: int) -> str:
    if score >= 80:
        return "Strong"
    elif score >= 50:
        return "Weak"
    else:
        return "Missing"
