from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.llm import chat
from app.core.utils import build_sse_response
from app.core.celery_task import review_task

app = FastAPI()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许的前端域名
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有请求头
)


class ReviewRequest(BaseModel):
    review_type: str
    input_content: str


class ChatRequest(BaseModel):
    prompt: str


@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.post("/v1/messages")
def chat_completion(request: ChatRequest):
    response = chat(request.prompt, stream=True)
    return build_sse_response(response)


@app.post("/v1/review")
def review(request: ReviewRequest):
    res = review_task.delay(request.review_type, request.input_content)
    return {"message": "review task started", "task_id": res.id}


@app.get("/v1/review/{task_id}")
def review_status(task_id: str):
    res = review_task.AsyncResult(task_id)
    return {"message": "review task status", "status": res.status}


@app.get("/v1/review/{task_id}/result")
def review_result(task_id: str):
    res = review_task.AsyncResult(task_id)
    return {"message": "review task result", "result": res.result}


@app.get("/v1/records")
def get_records():
    return {"message": "get records"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
