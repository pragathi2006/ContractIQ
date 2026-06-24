from document_processor import process_document
from ner import extract_entities
from clause_classifier import classify_clause


def analyze_contract(pdf_path):

    # Extract text from document
    extracted_text = process_document(pdf_path)

    # Extract entities
    entities = extract_entities(extracted_text)

    # Classify clause
    clause_type = classify_clause(extracted_text)

    # Final result
    result = {
        "entities": entities,
        "clause_type": clause_type
    }

    return result


if __name__ == "__main__":

    pdf_path = "data/Extracted_Questions.pdf"

    analysis_result = analyze_contract(pdf_path)

    print(analysis_result)