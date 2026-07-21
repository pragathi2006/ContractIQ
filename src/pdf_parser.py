import pdfplumber
from src.logger import logger


def extract_text(pdf_path):
    text = ""

    try:
        logger.info(f"Started extracting text from: {pdf_path}")

        with pdfplumber.open(pdf_path) as pdf:

            total_pages = len(pdf.pages)

            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        logger.info(f"Successfully extracted text from {total_pages} pages.")

        return text, total_pages

    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        return None, 0


def extract_text_with_ocr_fallback(pdf_path):
    """Tries the fast text-layer extraction first; if the PDF has no
    extractable text (e.g. a scanned/image-only document), falls back to
    OCR (src/ocr.py). Returns (text, total_pages, method) where method is
    "text" or "ocr"."""

    text, total_pages = extract_text(pdf_path)

    if text and text.strip():
        return text, total_pages, "text"

    logger.info(f"No text layer found in {pdf_path}; falling back to OCR.")

    from src.ocr import extract_text_from_scanned_pdf

    try:
        ocr_text, ocr_pages = extract_text_from_scanned_pdf(pdf_path)
        return ocr_text, ocr_pages, "ocr"

    except Exception as e:
        logger.error(f"OCR fallback failed: {e}")
        return None, 0, "ocr"


if __name__ == "__main__":

    pdf_path = "data/Extracted_Questions.pdf"

    extracted_text, pages = extract_text(pdf_path)

    if extracted_text:
        print(extracted_text)