def classify_clause(text):

    text = text.lower()

    if "terminate" in text:
        return "Termination Clause"

    elif "payment" in text or "pay" in text:
        return "Payment Clause"

    elif "confidential" in text:
        return "Confidentiality Clause"

    elif "liability" in text:
        return "Liability Clause"

    else:
        return "Unknown Clause"


if __name__ == "__main__":

    sample_text = """
    Either party may terminate this agreement
    by giving 30 days notice.
    """

    result = classify_clause(sample_text)

    print(result)