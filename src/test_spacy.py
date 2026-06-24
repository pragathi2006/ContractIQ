import spacy

nlp = spacy.load("en_core_web_sm")

text = "Amazon will pay Microsoft $10000 on July 15 2026"

doc = nlp(text)

for ent in doc.ents:
    print(ent.text, "-", ent.label_)