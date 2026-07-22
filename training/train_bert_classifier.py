"""
Fine-tunes DistilBERT for multi-label clause classification on CUAD.

This is a real fine-tuning run (backward pass + optimizer step over
real CUAD-derived training data), unlike notebooks/bert-training.ipynb,
which loaded BERT and CUAD but never combined them into an actual
training loop -- its "training" cells fit on 4 hardcoded toy sentences,
and its extractive-QA cells computed a single loss value without ever
calling .backward().

Reuses the sentence-building pipeline from train_clause_model.py (same
19 categories, same contract-level train/test split) so results are
directly comparable to that approach -- see docs/MODEL_CARD.md.

Run: python training/train_bert_classifier.py
"""

import os
import sys
import time
from pathlib import Path

import joblib
import numpy as np
import spacy
import torch
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForSequenceClassification

sys.path.insert(0, str(Path(__file__).resolve().parent))
from train_clause_model import (
    load_cuad,
    build_sentence_dataset,
    subsample_negatives,
    SELECTED_CATEGORIES,
)

torch.set_num_threads(os.cpu_count())

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "models" / "bert_clause_classifier"
MODEL_NAME = "distilbert-base-uncased"
MAX_LENGTH = 96
BATCH_SIZE = 16
EPOCHS = 3
LEARNING_RATE = 2e-5

# Full fine-tuning (forward + backward through all of DistilBERT) costs
# far more per example than the frozen-embedding approach in
# train_clause_model.py, so this run trains on a smaller, capped subset
# to stay CPU-feasible. train_clause_model.py's classifier already
# covers the full dataset and is what's actually wired into the app.
MAX_TRAIN_SENTENCES = 6000
MAX_TEST_SENTENCES = 1500


class ClauseDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx], dtype=torch.float32)
        return item


def cap_dataset(sentences, labels, max_size, rng):
    if len(sentences) <= max_size:
        return sentences, labels

    idx = rng.choice(len(sentences), size=max_size, replace=False)
    return [sentences[i] for i in idx], labels[idx]


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

    print("Subsampling negatives (ratio 3:1)...")
    rng = np.random.default_rng(42)
    train_sentences, y_train = subsample_negatives(train_sentences, y_train, rng)
    test_sentences, y_test = subsample_negatives(test_sentences, y_test, rng)
    print(f"  Train: {len(train_sentences)}  Test: {len(test_sentences)}")

    train_sentences, y_train = cap_dataset(train_sentences, y_train, MAX_TRAIN_SENTENCES, rng)
    test_sentences, y_test = cap_dataset(test_sentences, y_test, MAX_TEST_SENTENCES, rng)
    print(f"  Capped for CPU fine-tuning -> Train: {len(train_sentences)}  Test: {len(test_sentences)}")

    print(f"Loading {MODEL_NAME}...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(SELECTED_CATEGORIES),
        problem_type="multi_label_classification",
    )

    train_encodings = tokenizer(
        train_sentences, padding=True, truncation=True, max_length=MAX_LENGTH, return_tensors="pt"
    )
    test_encodings = tokenizer(
        test_sentences, padding=True, truncation=True, max_length=MAX_LENGTH, return_tensors="pt"
    )

    train_loader = DataLoader(
        ClauseDataset(train_encodings, y_train), batch_size=BATCH_SIZE, shuffle=True
    )
    test_loader = DataLoader(
        ClauseDataset(test_encodings, y_test), batch_size=BATCH_SIZE
    )

    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)

    print(f"Fine-tuning for {EPOCHS} epochs...")
    model.train()

    for epoch in range(EPOCHS):

        epoch_loss = 0.0
        n_batches = 0
        epoch_start = time.time()

        for batch in train_loader:

            optimizer.zero_grad()

            outputs = model(
                input_ids=batch["input_ids"],
                attention_mask=batch["attention_mask"],
                labels=batch["labels"],
            )

            loss = outputs.loss
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()
            n_batches += 1

        print(
            f"  Epoch {epoch + 1}/{EPOCHS}: avg loss {epoch_loss / n_batches:.4f} "
            f"({time.time() - epoch_start:.1f}s)"
        )

    print("Evaluating on held-out contracts at multiple thresholds...")
    model.eval()

    all_probs = []

    with torch.no_grad():
        for batch in test_loader:
            outputs = model(input_ids=batch["input_ids"], attention_mask=batch["attention_mask"])
            probs = torch.sigmoid(outputs.logits)
            all_probs.append(probs.numpy())

    probabilities = np.vstack(all_probs)

    reports = {}

    for threshold in (0.3, 0.4, 0.5, 0.6):
        y_pred = (probabilities >= threshold).astype(int)
        report = classification_report(
            y_test, y_pred, target_names=SELECTED_CATEGORIES, zero_division=0
        )
        reports[threshold] = report
        print(f"\n===== Threshold {threshold} =====")
        print(report)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(MODEL_DIR)
    tokenizer.save_pretrained(MODEL_DIR)
    joblib.dump(SELECTED_CATEGORIES, MODEL_DIR / "labels.joblib")

    with open(MODEL_DIR / "eval_report.txt", "w") as f:
        for threshold, report in reports.items():
            f.write(f"===== Threshold {threshold} =====\n{report}\n\n")

    print(f"Saved model artifacts to {MODEL_DIR}")
    print(f"Total time: {time.time() - t0:.1f}s")


if __name__ == "__main__":
    main()
