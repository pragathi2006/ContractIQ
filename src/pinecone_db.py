import os

from dotenv import load_dotenv
from pinecone import Pinecone

from src.logger import logger

load_dotenv()

pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

index = pc.Index("contractiq")

logger.info("Successfully connected to Pinecone index.")