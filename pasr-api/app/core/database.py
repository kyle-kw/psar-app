from datetime import datetime
from sqlmodel import create_engine, SQLModel, Session, Field
from app.config import config


def create_db_engine():
    return create_engine(config.database_url)


class User(SQLModel, table=True):
    # id 自增
    id: int = Field(default=None, primary_key=True, autoincrement=True)
    username: str = Field(unique=True)
    password: str
    email: str = Field(unique=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class File(SQLModel, table=True):
    # id 自增
    id: int = Field(default=None, primary_key=True, autoincrement=True)
    file_name: str
    file_path: str
    # 文件md5
    file_key: str
    file_size: int
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class Record(SQLModel, table=True):
    # id 自增
    id: int = Field(default=None, primary_key=True, autoincrement=True)
    # 不使用外键
    user_id: int
    review_type: str
    review_status: str

    input_content: str
    output_content: str

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)



