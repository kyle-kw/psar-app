import json
from fastapi.responses import StreamingResponse
from typing import Iterable

def build_sse_message(iterable: Iterable[str]) -> Iterable[str]:
    for content in iterable:
        message = {
            "event": "text_chunk",
            "data": content
        }
        yield f"data: {json.dumps(message, ensure_ascii=False)}\n\n"



def build_sse_response(iterable: Iterable[str]) -> StreamingResponse:
    return StreamingResponse(
        build_sse_message(iterable),
        media_type="text/event-stream",
    )




