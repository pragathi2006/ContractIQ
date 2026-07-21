REQUIRED_CLAUSES = [
    "Confidentiality",
    "Termination",
    "Payment Terms",
    "Liability",
    "Governing Law",
    "Intellectual Property"
]


def calculate_risk(clauses):

    detected = [c["name"] for c in clauses]

    reasons = []

    score = 0

    for clause in REQUIRED_CLAUSES:

        if clause not in detected:

            reasons.append(f"{clause} clause is missing.")

            score += 15

    if score <= 20:
        level = "Low"

    elif score <= 50:
        level = "Medium"

    else:
        level = "High"

    return {

        "risk_score": score,

        "risk_level": level,

        "reasons": reasons

    }