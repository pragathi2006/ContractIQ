from pathlib import Path

import joblib
import spacy

from src.logger import logger

MODEL_DIR = Path(__file__).resolve().parent.parent.parent / "models" / "clause_classifier"

DECISION_THRESHOLD = 0.75

CLAUSE_PATTERNS = {
    "Confidentiality": ["confidential", "confidentiality", "non-disclosure"],
    "Termination": ["termination", "terminate", "terminated"],
    "Payment Terms": ["payment", "salary", "invoice", "compensation", "fee"],
    "Liability": ["liability", "liable", "damages"],
    "Governing Law": ["governing law", "laws of", "jurisdiction"],
    "Intellectual Property": ["intellectual property", "copyright", "patent", "trademark"],
    "Force Majeure": ["force majeure", "natural disaster", "act of god"],
    "Arbitration": ["arbitration", "arbitrator"],
    "Leave Policy": ["leave", "vacation", "paid leave"],
}

_sentencizer = None
_embedder = None
_classifier = None
_labels = None
_load_attempted = False


def _load_model():
    """Lazily loads the trained classifier. Returns False (once, quietly
    logging a warning) if the artifacts haven't been trained yet."""

    global _sentencizer, _embedder, _classifier, _labels, _load_attempted

    if _classifier is not None:
        return True

    if _load_attempted:
        return False

    _load_attempted = True

    classifier_path = MODEL_DIR / "classifier.joblib"
    labels_path = MODEL_DIR / "labels.joblib"
    embedding_model_path = MODEL_DIR / "embedding_model.txt"

    if not (classifier_path.exists() and labels_path.exists() and embedding_model_path.exists()):
        logger.warning(
            "Trained clause classifier not found at %s. Falling back to "
            "keyword matching. Run training/train_clause_model.py to "
            "generate it." % MODEL_DIR
        )
        return False

    from sentence_transformers import SentenceTransformer

    _classifier = joblib.load(classifier_path)
    _labels = joblib.load(labels_path)
    _embedder = SentenceTransformer(embedding_model_path.read_text().strip())

    _sentencizer = spacy.blank("en")
    _sentencizer.add_pipe("sentencizer")

    logger.info(f"Loaded trained clause classifier ({len(_labels)} categories).")

    return True


def _split_sentences(text):
    doc = _sentencizer(text)
    return [s.text.strip() for s in doc.sents if len(s.text.strip()) >= 15]


def _detect_clauses_ml(text):

    sentences = _split_sentences(text)

    if not sentences:
        return []

    embeddings = _embedder.encode(sentences, batch_size=64, convert_to_numpy=True)
    probabilities = _classifier.predict_proba(embeddings)

    best_by_category = {}

    for sent_idx, sent_probs in enumerate(probabilities):
        for label_idx, prob in enumerate(sent_probs):

            if prob < DECISION_THRESHOLD:
                continue

            category = _labels[label_idx]
            current_best = best_by_category.get(category)

            if current_best is None or prob > current_best["confidence"]:
                best_by_category[category] = {
                    "name": category,
                    "matched_text": sentences[sent_idx][:200],
                    "confidence": round(float(prob), 3),
                }

    _resolve_mutually_exclusive(best_by_category, "Cap On Liability", "Uncapped Liability")

    return sorted(best_by_category.values(), key=lambda c: -c["confidence"])


def _resolve_mutually_exclusive(detected, *category_names):
    """A liability clause can't be both capped and uncapped. The model
    sometimes fires on both because it keys off the word "liability"
    without reliably parsing negation ("shall NOT be capped"); when both
    fire, keep only whichever the classifier was more confident about."""

    present = [name for name in category_names if name in detected]

    if len(present) < 2:
        return

    winner = max(present, key=lambda name: detected[name]["confidence"])

    for name in present:
        if name != winner:
            del detected[name]


def _detect_clauses_keyword_fallback(text):

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


def detect_clauses(text):

    if _load_model():
        return _detect_clauses_ml(text)

    return _detect_clauses_keyword_fallback(text)
