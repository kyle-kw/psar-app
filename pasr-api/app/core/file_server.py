import os
from app.config import config


def upload_file(file_bytes: bytes, file_name: str):
    file_path = os.path.join(config.file_server_path, file_name)
    with open(file_path, "wb") as f:
        f.write(file_bytes)


def download_file(file_name: str):
    file_path = os.path.join(config.file_server_path, file_name)
    with open(file_path, "rb") as f:
        return f.read()
