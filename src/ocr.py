import os
import shutil

from pdf2image import convert_from_path
import pytesseract

from src.logger import logger

TESSERACT_CMD = os.getenv("TESSERACT_CMD") or shutil.which("tesseract")
POPPLER_PATH = os.getenv("POPPLER_PATH")

if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
else:
    logger.warning(
        "Tesseract executable not found. Set TESSERACT_CMD or add it to PATH "
        "for OCR to work on scanned PDFs."
    )


def extract_text_from_scanned_pdf(pdf_path):
    text = ""

    images = convert_from_path(
        pdf_path,
        poppler_path=POPPLER_PATH
    )

    for image in images:
        page_text = pytesseract.image_to_string(image)
        text += page_text + "\n"

    return text, len(images)


if __name__ == "__main__":
    pdf_path = "data/Extracted_Questions.pdf"

    extracted_text, pages = extract_text_from_scanned_pdf(pdf_path)

    print(extracted_text)