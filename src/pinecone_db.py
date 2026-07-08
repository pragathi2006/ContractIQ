import os

from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

pc = Pinecone(
    api_key=os.getenv("pcsk_7LMho9_36KBN6KkVR2gudDLaWRTnupyv3vdGYgFFYs7U1yZLDFH6WEb2GcA7ohAFr5Si2x")
)

index = pc.Index("contractiq")

print("✅ Connected to Pinecone!")