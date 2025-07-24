from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    openai_api_base_url: str = Field(..., env="OPENAI_API_BASE_URL")

    dify_api_base_url: str = Field(..., env="DIFY_API_BASE_URL")
    dify_api_key: str = Field(..., env="DIFY_API_KEY")
    dify_api_user: str = Field(..., env="DIFY_API_USER")

    # file server path
    file_server_path: str = Field(..., env="FILE_SERVER_PATH")

    # database url
    database_url: str = Field(..., env="DATABASE_URL")

    # redis url
    redis_url: str = Field(..., env="REDIS_URL")


config = EnvConfig()
