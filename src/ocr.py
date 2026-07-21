import os
import shutil

from pdf2image import convert_from_path
import pytesseract

from src.logger import logger

# Allow overriding via environment variables; fall back to whatever is on PATH.
TESSERACT_CMD = os.getenv("TESSERACT_CMD") or shutil.which("tesseract")
POPPLER_PATH = os.getenv("POPPLER_PATH")  # None lets pdf2image search PATH.

if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
else:
    logger.warning(
        "Tesseract executable not found. Set TESSERACT_CMD or add it to PATH "
        "for OCR to work on scanned PDFs."
    )


def extract_text_from_scanned_pdf(pdf_path):
    text = ""

    # Convert PDF pages into images
    images = convert_from_path(
        pdf_path,
        poppler_path=POPPLER_PATH
    )

    # OCR each page
    for image in images:
        page_text = pytesseract.image_to_string(image)
        text += page_text + "\n"

    return text


if __name__ == "__main__":
    pdf_path = "data/Extracted_Questions.pdf"

    extracted_text = extract_text_from_scanned_pdf(pdf_path)

    print(extracted_text)