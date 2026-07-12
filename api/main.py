from fastapi import FastAPI, UploadFile, File
from celery.result import AsyncResult
import os

from src.logger import logger
from src.tasks import process_pdf
from src.celery_app import celery_app

app = FastAPI()


@app.get("/")
def home():
    logger.info("Home endpoint accessed.")

    return {
        "message": "ContractIQ API Running Successfully"
    }


@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):

    upload_folder = "uploads"
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    logger.info(f"Saved file: {file.filename}")

    task = process_pdf.delay(file_path)

    logger.info(f"Background task created: {task.id}")

    return {
        "filename": file.filename,
        "task_id": task.id,
        "status": "Processing Started"
    }


@app.get("/task/{task_id}")
def get_task(task_id: str):

    task = AsyncResult(task_id, app=celery_app)

    if task.state == "PENDING":
        return {
            "task_id": task.id,
            "state": task.state,
            "message": "Task is waiting to be processed."
        }

    elif task.state == "STARTED":
        return {
            "task_id": task.id,
            "state": task.state,
            "message": "Task is currently running."
        }

    elif task.state == "SUCCESS":
        return {
            "task_id": task.id,
            "state": task.state,
            "result": task.result
        }

    elif task.state == "FAILURE":
        return {
            "task_id": task.id,
            "state": task.state,
            "error": str(task.result)
        }

    else:
        return {
            "task_id": task.id,
            "state": task.state
        }