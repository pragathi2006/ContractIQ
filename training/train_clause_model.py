"""
Trains a real multi-label clause classifier on the CUAD dataset
(data/data (1)/CUADv1.json), replacing the keyword-matching heuristic
previously used in src/nlp/clause_detector.py.

Pipeline:
  1. Split each CUAD contract into sentences.
  2. Label each sentence with whichever of the selected clause
     categories its span overlaps (multi-label).
  3. Embed sentences with a frozen sentence-transformer.
  4. Train a One-vs-Rest logistic regression on top of the embeddings.
  5. Evaluate on a held-out set of contracts (not sentences, to avoid
     leaking the same document into train and test).
  6. Save the model + label list + threshold to models/clause_classifier/.

Run: python training/train_clause_model.py
"""

import json
import os
import re
import time
from pathlib import Path

import joblib
import numpy as np
import spacy
import torch
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier

torch.set_num_threads(os.cpu_count())

# Sentences are clipped to this many characters before embedding -- clause
# excerpts are short, and this bounds tokenization/inference cost against
# any long, badly-split "sentences" the rule-based sentencizer produces on
# dense legal text.
MAX_SENTENCE_CHARS = 400

# For every positively-labeled sentence, keep at most this many negative
# (no-category) sentences from the same split. The raw dataset is >90%
# negative, which wastes most of the embedding budget for little signal.
NEGATIVE_TO_POSITIVE_RATIO = 3

ROOT = Path(__file__).resolve().parent.parent
CUAD_PATH = ROOT / "data" / "data (1)" / "CUADv1.json"
MODEL_DIR = ROOT / "models" / "clause_classifier"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

# Substantive, well-represented clause categories (>=100 contracts each in
# CUAD). Pure metadata fields (Document Name, Parties, Agreement Date, ...)
# are excluded since they aren't risk-relevant clauses and are already
# covered by named-entity extraction.
SELECTED_CATEGORIES = [
    "Governing Law",
    "Anti-Assignment",
    "Cap On Liability",
    "License Grant",
    "Audit Rights",
    "Termination For Convenience",
    "Post-Termination Services",
    "Exclusivity",
    "Renewal Term",
    "Insurance",
    "Revenue/Profit Sharing",
    "Minimum Commitment",
    "Non-Transferable License",
    "Ip Ownership Assignment",
    "Change Of Control",
    "Non-Compete",
    "Uncapped Liability",
    "Notice Period To Terminate Renewal",
    "Covenant Not To Sue",
]

DECISION_THRESHOLD = 0.5


def load_cuad():
    with open(CUAD_PATH, "r", encoding="utf-8") as f:
        return json.load(f)["data"]


def category_name(question):
    match = re.search(r'related to "(.+?)"', question)
    return match.group(1) if match else question[:40]


def build_sentence_dataset(contracts, sentencizer):
    """Returns (contract_ids, sentences, label_matrix)."""

    contract_ids = []
    sentences = []
    labels = []

    label_index = {name: i for i, name in enumerate(SELECTED_CATEGORIES)}

    for contract_idx, contract in enumerate(contracts):

        for paragraph in contract["paragraphs"]:

            context = paragraph["context"]
            doc = sentencizer(context)
            sents = [(s.start_char, s.end_char, s.text) for s in doc.sents]

            # Pre-compute which char ranges are "positive" for each category.
            positive_spans = {name: [] for name in SELECTED_CATEGORIES}

            for qa in paragraph["qas"]:
                name = category_name(qa["question"])

                if name not in label_index or qa.get("is_impossible"):
                    continue

                for answer in qa.get("answers", []):
                    start = answer["answer_start"]
                    end = start + len(answer["text"])
                    positive_spans[name].append((start, end))

            for start_char, end_char, text in sents:

                text = text.strip()

                if len(text) < 15:  # skip near-empty/boilerplate fragments
                    continue

                label_vec = np.zeros(len(SELECTED_CATEGORIES), dtype=np.float32)

                for name, spans in positive_spans.items():
                    for span_start, span_end in spans:
                        if start_char < span_end and end_char > span_start:
                            label_vec[label_index[name]] = 1.0
                            break

                contract_ids.append(contract_idx)
                sentences.append(text[:MAX_SENTENCE_CHARS])
                labels.append(label_vec)

    return np.array(contract_ids), sentences, np.vstack(labels)


def subsample_negatives(sentences, labels, rng):
    """Keeps every positively-labeled row plus a bounded random sample of
    all-zero rows, so embedding time scales with signal, not with the
    dataset's natural (heavily negative) class balance."""

    is_positive = labels.sum(axis=1) > 0
    positive_idx = np.where(is_positive)[0]
    negative_idx = np.where(~is_positive)[0]

    keep_negatives = min(
        len(negative_idx), len(positive_idx) * NEGATIVE_TO_POSITIVE_RATIO
    )
    sampled_negative_idx = rng.choice(negative_idx, size=keep_negatives, replace=False)

    keep_idx = np.sort(np.concatenate([positive_idx, sampled_negative_idx]))

    return (
        [sentences[i] for i in keep_idx],
        labels[keep_idx],
    )


def main():

    t0 = time.time()

    print("Loading CUAD dataset...")
    contracts = load_cuad()
    print(f"  {len(contracts)} contracts loaded.")

    print("Splitting contracts into sentences and building labels...")
    sentencizer = spacy.blank("en")
    sentencizer.add_pipe("sentencizer")
    sentencizer.max_length = 2_000_000

    contract_ids, sentences, labels = build_sentence_dataset(contracts, sentencizer)
    print(f"  {len(sentences)} sentences from {len(contracts)} contracts.")
    print(f"  Positive examples per category:")
    for i, name in enumerate(SELECTED_CATEGORIES):
        print(f"    {labels[:, i].sum():6.0f}  {name}")

    print("Splitting train/test by contract (avoids document leakage)...")
    unique_contracts = np.unique(contract_ids)
    train_contracts, test_contracts = train_test_split(
        unique_contracts, test_size=0.2, random_state=42
    )
    train_mask = np.isin(contract_ids, train_contracts)
    test_mask = np.isin(contract_ids, test_contracts)

    train_sentences = [s for s, m in zip(sentences, train_mask) if m]
    test_sentences = [s for s, m in zip(sentences, test_mask) if m]
    y_train = labels[train_mask]
    y_test = labels[test_mask]
    print(f"  Train: {len(train_sentences)} sentences / {len(train_contracts)} contracts")
    print(f"  Test:  {len(test_sentences)} sentences / {len(test_contracts)} contracts")

    print(f"Subsampling negatives (ratio {NEGATIVE_TO_POSITIVE_RATIO}:1)...")
    rng = np.random.default_rng(42)
    train_sentences, y_train = subsample_negatives(train_sentences, y_train, rng)
    test_sentences, y_test = subsample_negatives(test_sentences, y_test, rng)
    print(f"  Train: {len(train_sentences)} sentences")
    print(f"  Test:  {len(test_sentences)} sentences")

    print(f"Embedding sentences with {EMBEDDING_MODEL_NAME}...")
    embedder = SentenceTransformer(EMBEDDING_MODEL_NAME)
    embedder.max_seq_length = 128
    X_train = embedder.encode(
        train_sentences, batch_size=64, show_progress_bar=True, convert_to_numpy=True
    )
    X_test = embedder.encode(
        test_sentences, batch_size=64, show_progress_bar=True, convert_to_numpy=True
    )

    print("Training One-vs-Rest logistic regression...")
    clf = OneVsRestClassifier(
        LogisticRegression(max_iter=2000, class_weight="balanced"),
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    print("Evaluating on held-out contracts at multiple thresholds...")
    probabilities = clf.predict_proba(X_test)

    reports = {}
    for threshold in (0.5, 0.65, 0.75, 0.85):
        y_pred = (probabilities >= threshold).astype(int)
        report = classification_report(
            y_test, y_pred, target_names=SELECTED_CATEGORIES, zero_division=0
        )
        reports[threshold] = report
        print(f"\n===== Threshold {threshold} =====")
        print(report)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, MODEL_DIR / "classifier.joblib")
    joblib.dump(SELECTED_CATEGORIES, MODEL_DIR / "labels.joblib")
    (MODEL_DIR / "embedding_model.txt").write_text(EMBEDDING_MODEL_NAME)

    with open(MODEL_DIR / "eval_report.txt", "w") as f:
        for threshold, report in reports.items():
            f.write(f"===== Threshold {threshold} =====\n{report}\n\n")

    # Cache test embeddings/labels/probabilities so future threshold tuning
    # or error analysis doesn't require re-running the ~10 minute embedding
    # step from scratch.
    cache_dir = MODEL_DIR / "_cache"
    cache_dir.mkdir(exist_ok=True)
    np.savez_compressed(
        cache_dir / "embeddings.npz",
        X_train=X_train, y_train=y_train,
        X_test=X_test, y_test=y_test, probabilities=probabilities,
    )
    joblib.dump(test_sentences, cache_dir / "test_sentences.joblib")

    print(f"Saved model artifacts to {MODEL_DIR}")
    print(f"Total time: {time.time() - t0:.1f}s")


if __name__ == "__main__":
    main()
