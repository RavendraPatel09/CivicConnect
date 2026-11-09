from typing import AsyncGenerator
import json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.types import TypeDecorator, Text
from pgvector.sqlalchemy import Vector
from .config import settings

class Base(DeclarativeBase):
    pass

# Custom Vector Type that uses native pgvector.sqlalchemy.Vector on PostgreSQL,
# and falls back to JSON-serialized floats on SQLite for local test suites.
class CompatibleVector(TypeDecorator):
    impl = Text
    cache_ok = True

    def __init__(self, dim: int = 768, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dim = dim

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(Vector(self.dim))
        return dialect.type_descriptor(Text())

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "postgresql":
            return value
        if isinstance(value, (list, tuple)):
            return json.dumps(list(value))
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "postgresql":
            return value
        if isinstance(value, str):
            try:
                return json.loads(value)
            except Exception:
                return value
        return value

# Create Async Engine
is_sqlite = "sqlite" in settings.DATABASE_URL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    **({"connect_args": {"check_same_thread": False}} if is_sqlite else {"pool_pre_ping": True, "pool_size": 20, "max_overflow": 10})
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
