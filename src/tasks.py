import time

from src.celery_app import celery_app
from src.logger import logger

@celery_app.task
def test_task():

    logger.info("Background task started.")

    time.sleep(5)

    logger.info("Background task completed.")

    return "Task Finished Successfully!"