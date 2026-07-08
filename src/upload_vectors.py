import os
import json
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Load .env
load_dotenv()

# Connect to Pinecone
pc = Pinecone(api_key=os.getenv("pcsk_7LMho9_36KBN6KkVR2gudDLaWRTnupyv3vdGYgFFYs7U1yZLDFH6WEb2GcA7ohAFr5Si2x"))
index = pc.Index("contractiq")

# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load CUAD dataset
train_path = "data/data (1)/train_separate_questions.json"
with open(train_path, "r", encoding="utf-8") as f:
    train_data = json.load(f)

vectors = []

# Upload first 5 contracts
for i in range(5):

    clause = train_data["data"][i]["paragraphs"][0]["context"]

    embedding = embedding_model.encode(clause).tolist()

    vectors.append({
        "id": str(i),
        "values": embedding,
        "metadata": {
            "text": clause[:1000]
        }
    })

# Upload to Pinecone
index.upsert(vectors=vectors)

print(f"✅ Uploaded {len(vectors)} vectors successfully!")