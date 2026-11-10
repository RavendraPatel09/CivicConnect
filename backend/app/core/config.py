from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicConnect AI"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Security & Tokens
    SECRET_KEY: str = "civicconnect-dev-super-secret-key-change-in-production-2025"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database (Default to SQLite for local development, overridden by DATABASE_URL env for PostgreSQL)
    DATABASE_URL: str = "sqlite+aiosqlite:///./civicconnect.db"
    TEST_DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"
    
    # Redis / Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI & Embeddings
    GEMINI_API_KEY: str = ""
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    EMBEDDING_DIMENSION: int = 768
    LLM_MODEL: str = "gemini-1.5-flash"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # File Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()
