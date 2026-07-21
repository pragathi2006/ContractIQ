# Clause Classifier Training

`train_clause_model.py` trains the multi-label clause classifier used by
`src/nlp/clause_detector.py`, replacing the keyword-matching heuristic with
a model trained on the [CUAD](https://www.atticusprojectai.org/cuad) dataset
(510 real commercial contracts, expert-annotated for 41 clause categories).

## What it does

1. Splits each contract into sentences and labels each one with whichever
   of 19 well-represented, risk-relevant clause categories its text
   overlaps (multi-label; categories with <100 example contracts, and pure
   metadata fields like "Parties" or "Agreement Date", are excluded).
2. Embeds sentences with the `all-MiniLM-L6-v2` sentence-transformer
   (frozen — no fine-tuning, keeps training CPU-feasible).
3. Trains a One-vs-Rest logistic regression on top of the embeddings.
4. Evaluates on a held-out 20% of *contracts* (not sentences, to avoid
   leaking a document's own sentences into both train and test).
5. Saves the model, label list, and evaluation report to
   `models/clause_classifier/` (gitignored — regenerate locally with this
   script rather than committing model binaries).

## Running it

```
python training/train_clause_model.py
```

Requires `data/data (1)/CUADv1.json` (already in the repo, gitignored) and
the packages in `requirements.txt`. Takes a few minutes on CPU.

## Known limitations

Evaluated on a held-out 20% of CUAD contracts (see
`models/clause_classifier/eval_report.txt` for the full per-category
breakdown across decision thresholds 0.5/0.65/0.75/0.85). At the threshold
currently used in production (0.75): micro-avg precision 0.38, recall 0.77,
F1 0.51. In practice this means:

- Strong categories (Governing Law, Insurance, Audit Rights) are both
  high-precision and high-recall.
- Weaker categories (Exclusivity, Change Of Control, Non-Compete) recall
  most real instances but also produce a meaningful number of false
  positives — e.g. a sentence about an employee's time commitment
  ("devote 80% of his time...") gets misclassified as "Revenue/Profit
  Sharing" and "Minimum Commitment" due to superficial numeric/percentage
  similarity, not real semantic understanding of financial terms.
- The frozen sentence-embedding + linear-classifier approach was chosen to
  keep training CPU-feasible; a fine-tuned transformer would likely do
  better but needs a GPU and much more training time.

Treat clause detections as a first-pass screening aid, not a substitute
for legal review — which is true of any automated contract analysis tool,
not just this one.

## Fallback behavior

If `models/clause_classifier/` doesn't exist (e.g. a fresh clone before
training has been run), `src/nlp/clause_detector.py` falls back to the
original keyword-matching approach and logs a warning — the app still
works, just with less accurate clause detection until you train the model.
