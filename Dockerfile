# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependency file
COPY requirements.txt .

# Install the CPU-only torch build first -- the default PyPI wheel pulls in
# several GB of NVIDIA CUDA libraries that this container never uses, since
# there's no GPU here. Installing it first means the plain `torch` entry in
# requirements.txt below is already satisfied and won't be reinstalled.
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# entity_extractor.py loads this spaCy model at import time; it isn't
# bundled with the `spacy` package itself.
RUN python -m spacy download en_core_web_sm

# Copy project files
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]