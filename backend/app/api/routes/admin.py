from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel, EmailStr

from ...core.database import get_db
from ...core.dependencies import require_role
from ...core.security import get_password_hash
from ...models.user import User, UserRole
from ...models.department import Department
from ...models.ticket_event import TicketEvent
from ...schemas.user import UserResponse
from ...schemas.ticket import TicketEventResponse

router = APIRouter(prefix="/admin", tags=["Administrative Controls"])

class StaffCreateRequest(BaseModel):
    name: str
    email: EmailStr
    department_id: str
    password: Optional[str] = "Password123!"

@router.get("/staff", response_model=List[UserResponse])
async def list_staff_members(
    admin: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(User).where(User.role.in_([UserRole.STAFF, UserRole.ADMIN])).order_by(User.name)
    )
    users = res.scalars().all()
    return [
        UserResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            profile_image=u.profile_image,
            department_id=u.department_id,
            department_name=u.department.name if u.department else None,
            is_active=u.is_active,
            created_at=u.created_at
        ) for u in users
    ]

@router.post("/staff", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_staff_member(
    req: StaffCreateRequest,
    admin: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(User).where(User.email == req.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )

    dept_res = await db.execute(select(Department).where(Department.id == req.department_id))
    dept = dept_res.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")

    new_staff = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=get_password_hash(req.password or "Password123!"),
        role=UserRole.STAFF,
        department_id=dept.id,
        profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(new_staff)
    await db.commit()
    await db.refresh(new_staff)

    return UserResponse(
        id=new_staff.id,
        name=new_staff.name,
        email=new_staff.email,
        role=new_staff.role,
        profile_image=new_staff.profile_image,
        department_id=new_staff.department_id,
        department_name=dept.name,
        is_active=new_staff.is_active,
        created_at=new_staff.created_at
    )

@router.get("/audit-logs", response_model=List[TicketEventResponse])
async def get_audit_logs(
    limit: int = 50,
    admin: User = Depends(require_role([UserRole.ADMIN, UserRole.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(TicketEvent).order_by(desc(TicketEvent.created_at)).limit(limit)
    )
    events = res.scalars().all()
    return [
        TicketEventResponse(
            id=ev.id,
            ticket_id=ev.ticket_id,
            actor_id=ev.actor_id,
            actor_name=ev.actor_name,
            actor_role=ev.actor_role,
            event_type=ev.event_type,
            previous_status=ev.previous_status,
            new_status=ev.new_status,
            title=ev.title,
            note=ev.note,
            created_at=ev.created_at
        ) for ev in events
    ]
