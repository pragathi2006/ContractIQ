import os
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from src.logger import logger

load_dotenv()

# Connect to Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("contractiq")

# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# User query
query = input("Enter contract query: ")

# Convert query to embedding
query_embedding = embedding_model.encode(query).tolist()

# Search Pinecone
results = index.query(
    vector=query_embedding,
    top_k=3,
    include_metadata=True
)

logger.info("Semantic search started.")

for match in results["matches"]:
    print(f"ID: {match['id']}")
    print(f"Similarity Score: {match['score']:.4f}")
    print(f"Preview: {match['metadata']['text'][:200]}")
    print("-" * 60)
logger.info("semantic search completed")    