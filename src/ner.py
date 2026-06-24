import spacy

# Load spaCy language model
nlp = spacy.load("en_core_web_sm")


def extract_entities(text):

    doc = nlp(text)

    entities = []

    for ent in doc.ents:
        entities.append({
            "text": ent.text,
            "label": ent.label_
        })

    return entities


if __name__ == "__main__":

    sample_text = """
    Amazon Pvt Ltd agrees to pay Microsoft India $50000
    before July 10 2026 in accordance with the agreement.
    """

    extracted_entities = extract_entities(sample_text)

    print(extracted_entities)