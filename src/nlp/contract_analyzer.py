from src.nlp.entity_extractor import extract_entities
from src.nlp.clause_detector import detect_clauses
from src.nlp.summarizer import generate_summary
from src.nlp.risk_analyzer import calculate_risk


def analyze_contract(text):

    entities = extract_entities(text)

    clauses = detect_clauses(text)

    summary = generate_summary(text)

    risk = calculate_risk(clauses)

    return {

        "summary": summary,

        "entities": entities,

        "clauses": clauses,

        "risk": risk

    }