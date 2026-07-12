from celery import Celery

celery_app = Celery(
    "contractiq",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=["src.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    result_expires=3600
)