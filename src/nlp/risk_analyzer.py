# Each group lists the names for the same underlying protection across
# both the trained clause classifier's taxonomy (CUAD-derived) and the
# keyword-matching fallback's taxonomy, so the contract only gets dinged
# for a missing protection if neither detector's equivalent fired.
PROTECTIVE_CLAUSE_GROUPS = [
    ("Governing Law", {"Governing Law"}),
    ("Termination Clause", {"Termination For Convenience", "Termination"}),
    ("Liability Cap", {"Cap On Liability", "Liability"}),
    ("IP Ownership", {"Ip Ownership Assignment", "Intellectual Property"}),
]

# Clauses whose presence itself is a risk signal, rather than their absence.
RED_FLAG_CLAUSES = {
    "Uncapped Liability": "Contract contains uncapped liability exposure.",
}

MISSING_CLAUSE_PENALTY = 15
RED_FLAG_PENALTY = 25


def calculate_risk(clauses):

    detected = {c["name"] for c in clauses}

    reasons = []

    score = 0

    for label, equivalent_names in PROTECTIVE_CLAUSE_GROUPS:

        if not (detected & equivalent_names):

            reasons.append(f"{label} clause is missing.")

            score += MISSING_CLAUSE_PENALTY

    for name, reason in RED_FLAG_CLAUSES.items():

        if name in detected:

            reasons.append(reason)

            score += RED_FLAG_PENALTY

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
