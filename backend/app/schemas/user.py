from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from ..models.user import UserRole

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    profile_image: Optional[str] = None
    department_id: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_image: Optional[str] = None
    department_id: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    profile_image: Optional[str] = None
    department_id: Optional[str] = None
    department_name: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
