from src.logger import logger

NAMESPACE = "user_contracts"

_embedder = None
_index = None
_disabled = False


def _get_embedder():
    global _embedder

    if _embedder is None:
        from sentence_transformers import SentenceTransformer
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")

    return _embedder


def _get_index():
    global _index, _disabled

    if _disabled:
        return None

    if _index is None:
        try:
            from src.pinecone_db import index as pinecone_index
            _index = pinecone_index

        except Exception as e:
            logger.warning(f"Pinecone unavailable, similarity search disabled: {e}")
            _disabled = True
            return None

    return _index


def index_contract(contract_id, user_id, filename, text):
    index = _get_index()

    if index is None or not text:
        return

    try:
        embedding = _get_embedder().encode(text[:2000]).tolist()

        index.upsert(
            vectors=[{
                "id": f"contract_{contract_id}",
                "values": embedding,
                "metadata": {
                    "user_id": str(user_id),
                    "filename": filename,
                    "text": text[:500],
                },
            }],
            namespace=NAMESPACE,
        )

        logger.info(f"Indexed contract {contract_id} in Pinecone.")

    except Exception as e:
        logger.error(f"Failed to index contract {contract_id} in Pinecone: {e}")


def find_similar(contract_id, user_id, top_k=3):
    index = _get_index()

    if index is None:
        return []

    try:
        results = index.query(
            id=f"contract_{contract_id}",
            top_k=top_k + 1,
            include_metadata=True,
            namespace=NAMESPACE,
            filter={"user_id": str(user_id)},
        )

    except Exception as e:
        logger.error(f"Pinecone similarity query failed for contract {contract_id}: {e}")
        return []

    matches = []

    for match in results.matches:

        if match.id == f"contract_{contract_id}":
            continue

        matches.append({
            "contract_id": int(match.id.replace("contract_", "")),
            "filename": match.metadata.get("filename"),
            "score": round(float(match.score), 3),
        })

    return matches[:top_k]
