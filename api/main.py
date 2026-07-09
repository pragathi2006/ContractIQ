from fastapi import FastAPI, UploadFile, File
import os

from src.pdf_parser import extract_text
from src.logger import logger

app = FastAPI()


@app.get("/")
def home():

    logger.info("Home endpoint accessed.")

    return {
        "message": "ContractIQ API Running Successfully"
    }


@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):

    logger.info(f"Received file: {file.filename}")

    upload_folder = "uploads"

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        logger.info("Uploads folder created.")

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    logger.info(f"File saved successfully: {file.filename}")

    extracted_text, total_pages = extract_text(file_path)

    if extracted_text:

        logger.info("Text extraction completed successfully.")

        return {
            "filename": file.filename,
            "status": "success",
            "pages_processed": total_pages,
            "characters_extracted": len(extracted_text),
            "text_preview": extracted_text[:500],
            "processing_status": "completed"
        }

    logger.error("Text extraction failed.")

    return {
        "filename": file.filename,
        "status": "failed",
        "processing_status": "error"
    }