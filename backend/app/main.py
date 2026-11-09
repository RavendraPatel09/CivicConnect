from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .core.config import settings
from .core.database import engine, Base
from .models import Department

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Initialize database tables if using SQLite or if first boot
    async with engine.begin() as conn:
        if "sqlite" in settings.DATABASE_URL:
            await conn.run_sync(Base.metadata.create_all)
            
    # Seed standard initial municipal departments
    from .core.database import AsyncSessionLocal
    from sqlalchemy import select
    async with AsyncSessionLocal() as session:
        initial_depts = [
            "Department of Transportation & Roads",
            "Municipal Water & Sewerage Board",
            "Sanitation & Solid Waste Management",
            "Municipal Electrical Department",
            "Stormwater & Drainage Engineering",
            "Public Works & Civil Infrastructure",
        ]
        for dept_name in initial_depts:
            res = await session.execute(select(Department).where(Department.name == dept_name))
            if not res.scalar_one_or_none():
                session.add(Department(name=dept_name, description=f"Municipal oversight for {dept_name}"))
        await session.commit()
        
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise-grade smart city grievance management platform backend featuring AI triage, semantic duplicate clustering, and real-time WebSockets.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads (local development mode)
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/health", tags=["System"])
@app.get(f"{settings.API_V1_STR}/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "database": "connected",
        "version": "1.0.0"
    }
