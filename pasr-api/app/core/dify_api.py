import httpx
import json
from loguru import logger

from app.config import config

def dify_execute_workflow_stream(query: str):
    """流式版本 - 使用生成器返回数据"""
    url = f"{config.dify_api_base_url}/v1/workflows/run"
    headers = {
        "Authorization": f"Bearer {config.dify_api_key}",
        "Content-Type": "application/json",
    }
    data = {
        "inputs": {"query": query},
        "response_mode": "streaming",
        "user": config.dify_api_user,
    }

    with httpx.stream("POST", url, json=data, headers=headers) as response:
        for line in response.iter_lines():
            if line.strip():
                # 处理 Server-Sent Events (SSE) 格式
                if line.startswith("data: "):
                    data_content = line[6:]  # 移除 "data: " 前缀
                    try:
                        data = json.loads(data_content)
                        if data["event"] == "text_chunk":
                            yield data["data"]["text"]
                    except json.JSONDecodeError:
                        logger.error(f"json decode error: {line}")
                elif line.strip() == "event: ping":
                    continue
                else:
                    # 如果不是 SSE 格式，直接尝试解析 JSON
                    logger.error(f"not sse: {line}")


def dify_upload_file(file_bytes: bytes, file_name: str):
    url = f"{config.dify_api_base_url}/v1/files/upload"
    headers = {
        "Authorization": f"Bearer {config.dify_api_key}",
    }
    data = {"user": config.dify_api_user}
    files = {
        "file": (file_name, file_bytes),
    }
    response = httpx.post(url, headers=headers, files=files, data=data)
    response.raise_for_status()

    return response.json()["id"]



