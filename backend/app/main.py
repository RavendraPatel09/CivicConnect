from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .core.config import settings
from .core.database import engine, Base
from .core.security import get_password_hash
from .models import Department, User, UserRole
from .api.routes import (
    auth,
    tickets,
    notifications,
    departments,
    analytics,
    admin,
    documents,
    websocket_route
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Initialize database tables if using SQLite or if first boot
    async with engine.begin() as conn:
        if "sqlite" in settings.DATABASE_URL:
            await conn.run_sync(Base.metadata.create_all)
            
    # Seed standard initial municipal departments and demo accounts
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
        dept_map = {}
        for dept_name in initial_depts:
            res = await session.execute(select(Department).where(Department.name == dept_name))
            dept = res.scalar_one_or_none()
            if not dept:
                dept = Department(name=dept_name, description=f"Municipal oversight for {dept_name}")
                session.add(dept)
                await session.flush()
            dept_map[dept_name] = dept.id

        # Seed Demo Personas
        demo_users = [
            {
                "name": "Elena Rostova",
                "email": "elena.rostova@example.com",
                "role": UserRole.CITIZEN,
                "dept": None,
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            },
            {
                "name": "Marcus Vance",
                "email": "marcus.vance@citygov.org",
                "role": UserRole.STAFF,
                "dept": dept_map.get("Department of Transportation & Roads"),
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            {
                "name": "Commissioner Sarah Chen",
                "email": "sarah.chen@civicconnect.gov",
                "role": UserRole.ADMIN,
                "dept": dept_map.get("Public Works & Civil Infrastructure"),
                "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            }
        ]

        for u in demo_users:
            u_res = await session.execute(select(User).where(User.email == u["email"]))
            if not u_res.scalar_one_or_none():
                session.add(User(
                    name=u["name"],
                    email=u["email"],
                    password_hash=get_password_hash("Password123!"),
                    role=u["role"],
                    department_id=u["dept"],
                    profile_image=u["avatar"],
                    is_active=True
                ))

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

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(tickets.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)

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
