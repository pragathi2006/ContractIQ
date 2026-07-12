from src.celery_app import celery_app
from src.pdf_parser import extract_text
from src.logger import logger


@celery_app.task
def process_pdf(file_path):

    logger.info(f"Started processing PDF: {file_path}")

    try:
        extracted_text, total_pages = extract_text(file_path)

        logger.info("PDF processed successfully.")

        return {
            "status": "SUCCESS",
            "pages": total_pages,
            "characters": len(extracted_text),
            "preview": extracted_text[:500]
        }

    except Exception as e:

        logger.error(f"Processing failed: {e}")

        return {
            "status": "FAILED",
            "error": str(e)
        }