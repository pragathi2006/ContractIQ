CLAUSE_PATTERNS = {
    "Confidentiality": [
        "confidential",
        "confidentiality",
        "non-disclosure"
    ],

    "Termination": [
        "termination",
        "terminate",
        "terminated"
    ],

    "Payment Terms": [
        "payment",
        "salary",
        "invoice",
        "compensation",
        "fee"
    ],

    "Liability": [
        "liability",
        "liable",
        "damages"
    ],

    "Governing Law": [
        "governing law",
        "laws of",
        "jurisdiction"
    ],

    "Intellectual Property": [
        "intellectual property",
        "copyright",
        "patent",
        "trademark"
    ],

    "Force Majeure": [
        "force majeure",
        "natural disaster",
        "act of god"
    ],

    "Arbitration": [
        "arbitration",
        "arbitrator"
    ],

    "Leave Policy": [
        "leave",
        "vacation",
        "paid leave"
    ]
}


def detect_clauses(text):

    text = text.lower()

    detected = []

    for clause, keywords in CLAUSE_PATTERNS.items():

        for keyword in keywords:

            if keyword in text:

                detected.append({
                    "name": clause,
                    "matched_keyword": keyword,
                    "confidence": 1.0
                })

                break

    return detected