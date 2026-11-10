import pytest_asyncio
from app.core.database import engine, Base

@pytest_asyncio.fixture(autouse=True)
async def initialize_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
