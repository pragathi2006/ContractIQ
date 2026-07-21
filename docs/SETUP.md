# Setup

## Option A: Docker (recommended)

Requires Docker Desktop.

```bash
cp .env.example .env
```

Edit `.env`:
- `JWT_SECRET_KEY` — generate one: `python -c "import secrets; print(secrets.token_hex(32))"`
- `PINECONE_API_KEY` — optional, only needed for the semantic-search scripts in `src/`
- `DATABASE_URL` — leave as the default (`sqlite:///./contractiq.db`) unless you want a different database

```bash
docker compose up -d --build
```

This starts three containers: Redis, the FastAPI API (port 8000), and the
Celery worker. Then, separately, run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Option B: Native (no Docker)

You'll need Redis running locally (`redis-server`, or via a package
manager) and a Python virtualenv.

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
python -m spacy download en_core_web_sm

cp .env.example .env   # fill in JWT_SECRET_KEY

uvicorn api.main:app --reload            # terminal 1
celery -A src.celery_app worker --pool=solo --loglevel=info   # terminal 2 (Windows needs --pool=solo)

cd frontend && npm install && npm run dev   # terminal 3
```

## Training the clause classifier

The repo ships without trained model artifacts (`models/` is gitignored —
regenerate it locally rather than committing large binaries). Without it,
the app still works, falling back to keyword matching with a logged
warning.

```bash
python training/train_clause_model.py
```

Needs `data/data (1)/CUADv1.json` (already in the repo). Takes a few
minutes on CPU. See [training/README.md](../training/README.md) and
[docs/MODEL_CARD.md](MODEL_CARD.md) for details.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `JWT_SECRET_KEY` | Yes | Signs auth tokens. The API refuses to start without it. |
| `DATABASE_URL` | No (defaults to local SQLite) | SQLAlchemy connection string |
| `PINECONE_API_KEY` | No | Only used by `src/pinecone_db.py` and the semantic-search scripts |
| `CELERY_BROKER_URL` / `CELERY_RESULT_BACKEND` | No (defaults to `redis://localhost:6379/0`) | Overridden automatically inside Docker Compose |
| `TESSERACT_CMD` | No (Docker has it on `PATH`) | Path to the `tesseract` executable, for native/non-Docker OCR |
| `POPPLER_PATH` | No (Docker has it on `PATH`) | Path to poppler's `bin/` folder, for native/non-Docker OCR |
| `VITE_API_URL` (frontend) | No (defaults to `http://127.0.0.1:8000`) | Point the frontend at a different API host |

## Common issues

- **"JWT_SECRET_KEY environment variable must be set"** — you haven't
  created `.env` from `.env.example`, or forgot to fill in that value.
- **Upload hangs on "Processing"** — the Celery worker isn't running or
  can't reach Redis. Check `docker compose logs worker` (Docker) or that
  `redis-server` is running (native).
- **Scanned PDF fails even though it should fall back to OCR** — running
  natively, this usually means `tesseract` or `poppler` isn't installed
  or isn't on `PATH`. Set `TESSERACT_CMD`/`POPPLER_PATH` explicitly, or
  use Docker, which has both preinstalled.
- **Docker build is very slow / image is huge** — make sure you're
  building with the current `Dockerfile`, which installs a CPU-only
  torch build. The default PyPI wheel pulls in several GB of NVIDIA CUDA
  libraries this project never uses.
