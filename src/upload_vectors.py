import json
from sentence_transformers import SentenceTransformer

from src.pinecone_db import index
from src.logger import logger

logger.info("Connected to Pinecone for vector upload.")

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

logger.info("Embedding model loaded.")

train_path = "data/data (1)/train_separate_questions.json"

with open(train_path, "r", encoding="utf-8") as f:
    train_data = json.load(f)

logger.info(f"Loaded dataset with {len(train_data['data'])} contracts.")

NUM_CONTRACTS = 20

vectors = []

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

logger.info(f"Prepared {len(vectors)} vectors.")

try:
    index.upsert(vectors=vectors)
    logger.info(f"Uploaded {len(vectors)} vectors successfully to Pinecone.")
    print(f"✅ Uploaded {len(vectors)} vectors successfully!")

except Exception as e:
    logger.error(f"Vector upload failed: {e}")
    print("Error:", e)