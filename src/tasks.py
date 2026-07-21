import json
import time

from src.celery_app import celery_app
from src.pdf_parser import extract_text_with_ocr_fallback
from src.logger import logger
from src.nlp.contract_analyzer import analyze_contract
from src.db import SessionLocal
from src.models import Contract


def _save_contract_result(task_id, *, status, risk_level=None, risk_score=None,
                           result=None, error=None):
    """Persists the outcome of a background analysis to the Contract row
    created when the upload was accepted, so the dashboard/history pages
    can show real data instead of the in-memory Celery result (which
    expires after an hour)."""

    db = SessionLocal()

    try:
        contract = db.query(Contract).filter(Contract.task_id == task_id).first()

        if not contract:
            logger.warning(f"No Contract row found for task_id={task_id}")
            return

        contract.status = status
        contract.risk_level = risk_level
        contract.risk_score = risk_score
        contract.result_json = json.dumps(result) if result is not None else None
        contract.error = error

        db.commit()

    finally:
        db.close()


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

        extracted_text, total_pages, extraction_method = extract_text_with_ocr_fallback(file_path)

        if not extracted_text or not extracted_text.strip():
            raise ValueError(
                "No readable text found in this PDF, even after OCR. It "
                "may be corrupted or empty."
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
                "extraction_method": extraction_method,
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

        _save_contract_result(
            self.request.id,
            status="SUCCESS",
            risk_level=analysis["risk"]["risk_level"],
            risk_score=analysis["risk"]["risk_score"],
            result=result,
        )

        return result

    except Exception as e:

        logger.error(f"Processing failed: {e}")

        _save_contract_result(self.request.id, status="FAILURE", error=str(e))

        raise