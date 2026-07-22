import os
import uuid

from fastapi import FastAPI, UploadFile, File, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from celery.result import AsyncResult
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from src.logger import logger
from src.tasks import process_pdf
from src.celery_app import celery_app
from src.db import Base, engine, get_db
from src.auth import get_current_user
from src.models import Contract, User
from api.auth_router import router as auth_router
from api.contracts_router import router as contracts_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ContractIQ API",
    description="AI-Powered Contract Analysis API",
    version="1.0.0"
)
DEFAULT_CORS_ORIGINS = "http://localhost:5173,http://localhost:5174"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(contracts_router)

@app.get(
    "/",
    summary="API Health Check",
    description="Checks whether the ContractIQ API is running."
)
def home():

    logger.info("Home endpoint accessed.")

    return {
        "success": True,
        "message": "ContractIQ REST API is running.",
        "version": "1.0.0"
    }


@app.post(
    "/upload",
    summary="Upload Contract",
    description="Uploads a PDF contract and starts background processing using Celery."
)
async def upload_contract(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if not file.filename.lower().endswith(".pdf"):
        logger.warning("Non-PDF file upload attempted.")

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed."
        )

    upload_folder = "uploads"
    os.makedirs(upload_folder, exist_ok=True)

    stored_name = f"{uuid.uuid4().hex}.pdf"
    file_path = os.path.join(upload_folder, stored_name)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    logger.info(f"Saved file: {file.filename} -> {stored_name} (user: {current_user.email})")

    task_id = uuid.uuid4().hex

    contract = Contract(
        user_id=current_user.id,
        task_id=task_id,
        filename=file.filename,
        status="PROCESSING",
    )
    db.add(contract)
    db.commit()

    task = process_pdf.apply_async(args=[file_path], task_id=task_id)

    logger.info(f"Background task created: {task.id}")

    return JSONResponse(
        status_code=status.HTTP_202_ACCEPTED,
        content={
            "success": True,
            "message": "PDF uploaded successfully. Background processing started.",
            "data": {
                "filename": file.filename,
                "task_id": task.id
            }
        }
    )


@app.get(
    "/task/{task_id}",
    summary="Check Task Status",
    description="Returns the processing status and result of a background task."
)
def get_task(task_id: str, current_user: User = Depends(get_current_user)):

    task = AsyncResult(task_id, app=celery_app)

    if task.state == "PENDING":

        return {
            "success": True,
            "data": {
                "task_id": task.id,
                "state": task.state,
                "message": "Task is waiting in queue."
            }
        }

    elif task.state == "STARTED":

        return {
            "success": True,
            "data": {
                "task_id": task.id,
                "state": task.state,
                "message": "Task is currently processing."
            }
        }

    elif task.state == "SUCCESS":

        return {
            "success": True,
            "data": {
                "task_id": task.id,
                "state": task.state,
                "result": task.result
            }
        }

    elif task.state == "FAILURE":

        return {
            "success": False,
            "data": {
                "task_id": task.id,
                "state": task.state,
                "error": str(task.result)
            }
        }

    return {
        "success": True,
        "data": {
            "task_id": task.id,
            "state": task.state
        }
    }
