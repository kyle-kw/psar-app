from celery import Celery
from app.core.review.runner import run_review
from app.config import config


celery_app = Celery(
    "celery_app",
    broker=config.redis_url,
    backend=config.redis_url,
)


@celery_app.task
def review_task(review_type: str, input_content: str):
    review_content = run_review(review_type, input_content)
    return review_content



