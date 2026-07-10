from sentence_transformers import SentenceTransformer

from src.pinecone_db import index
from src.logger import logger

logger.info("Semantic Search Started.")

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

logger.info("Embedding model loaded.")

query = input("Enter search query: ")

logger.info(f"User Query: {query}")

query_embedding = embedding_model.encode(query).tolist()

try:

    results = index.query(
        vector=query_embedding,
        top_k=3,
        include_metadata=True
    )

    logger.info(f"Found {len(results.matches)} matching contracts.")

    print("\nTop Matching Contracts\n")

    for match in results.matches:

        print(f"Contract ID : {match.id}")
        print(f"Similarity Score : {match.score:.4f}")
        print(f"Preview : {match.metadata['text'][:200]}")
        print("-" * 70)

    logger.info("Semantic search completed successfully.")

except Exception as e:

    logger.error(f"Semantic search failed: {e}")
    print("Error:", e)