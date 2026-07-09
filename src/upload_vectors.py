import os
import json
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Load .env
load_dotenv()

# Connect to Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("contractiq")

# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load CUAD dataset
train_path = "data/data (1)/train_separate_questions.json"
with open(train_path, "r", encoding="utf-8") as f:
    train_data = json.load(f)

vectors = []
NUM_CONTRACTS = 20

for i in range(min(NUM_CONTRACTS, len(train_data["data"]))):

    clause = train_data["data"][i]["paragraphs"][0]["context"]

    embedding = embedding_model.encode(clause).tolist()

    vectors.append({
        "id": f"contract_{i}",
        "values": embedding,
        "metadata": {
            "text": clause[:1000]
        }
    })

# Upload to Pinecone
index.upsert(vectors=vectors)

from src.logger import logger

logger.info(f"Uploaded {len(vectors)} vectors to Pinecone successfully.")