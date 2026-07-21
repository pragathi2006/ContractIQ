import time

from src.celery_app import celery_app
from src.pdf_parser import extract_text
from src.logger import logger
from src.nlp.contract_analyzer import analyze_contract


@celery_app.task(bind=True)
def process_pdf(self, file_path):

    logger.info(f"Started processing PDF: {file_path}")

    started_at = time.time()

    try:

        self.update_state(
            state="PROGRESS",
            meta={
                "progress": 10,
                "step": "Reading PDF..."
            }
        )

        extracted_text, total_pages = extract_text(file_path)

        if not extracted_text or not extracted_text.strip():
            raise ValueError(
                "No readable text found in this PDF. It may be scanned, "
                "corrupted, or empty."
            )

        self.update_state(
            state="PROGRESS",
            meta={
                "progress": 40,
                "step": "Analyzing Contract..."
            }
        )

        analysis = analyze_contract(extracted_text)

        self.update_state(
            state="PROGRESS",
            meta={
                "progress": 80,
                "step": "Calculating Risk..."
            }
        )

        result = {
            "status": "SUCCESS",

            "statistics": {
                "pages": total_pages,
                "characters": len(extracted_text),
                "processing_time_seconds": round(time.time() - started_at, 2),
            },

            "summary": analysis["summary"],

            "entities": analysis["entities"],

            "clauses": analysis["clauses"],

            "risk": analysis["risk"],

            "preview": extracted_text[:500],
        }

        self.update_state(
            state="PROGRESS",
            meta={
                "progress": 100,
                "step": "Completed"
            }
        )

        logger.info("Contract analyzed successfully.")

        return result

    except Exception as e:

        logger.error(f"Processing failed: {e}")

        raise