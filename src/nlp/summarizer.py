def generate_summary(text, max_sentences=5):

    sentences = text.split(".")

    summary = "."

    summary = summary.join(sentences[:max_sentences])

    if not summary.endswith("."):
        summary += "."

    return summary.strip()