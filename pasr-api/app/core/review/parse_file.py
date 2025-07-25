

def parse_pdf_file(file_bytes: bytes, file_name: str):
    pass


def parse_docx_file(file_bytes: bytes, file_name: str):
    pass


def parse_txt_file(file_bytes: bytes, file_name: str) -> str:
    return file_bytes.decode("utf-8")


def parse_file(file_bytes: bytes, file_name: str):
    if file_name.endswith(".pdf"):
        return parse_pdf_file(file_bytes, file_name)
    elif file_name.endswith(".docx"):
        return parse_docx_file(file_bytes, file_name)
    elif file_name.endswith(".txt") or file_name.endswith(".md"):
        return parse_txt_file(file_bytes, file_name)
    else:
        raise ValueError(f"Unsupported file type: {file_name}")

