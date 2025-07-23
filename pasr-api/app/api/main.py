from pydantic import BaseModel

from fastapi import FastAPI, Body
from fastapi.responses import StreamingResponse
from app.core.llm import chat

app = FastAPI()

class ChatRequest(BaseModel):
    prompt: str

@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.post("/v1/messages")
def chat_completion(prompt: str = Body(...)):
    response = chat(prompt, stream=True)
    return StreamingResponse(
        response,
        status_code=200,
        media_type='text/event-stream',
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
