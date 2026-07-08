from fastapi import FastAPI, UploadFile, File
import os
from src.pdf_parser import extract_text

app = FastAPI()


@app.get("/")
def home():
    return {"message": "ContractIQ API Running Successfully"}


@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):

    upload_folder = "uploads"

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    extracted_text, total_pages = extract_text(file_path)
    return {
        "filename": file.filename,
        "status": "File uploaded successfully",
        "text_preview": extracted_text[:500] if extracted_text else "No text extracted"
    }
    