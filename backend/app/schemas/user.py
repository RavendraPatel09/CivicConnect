from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, computed_field
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

    @computed_field
    @property
    def department(self) -> Optional[str]:
        return self.department_name

    @computed_field
    @property
    def avatar(self) -> Optional[str]:
        return self.profile_image

    @computed_field
    @property
    def joinedDate(self) -> str:
        return self.created_at.isoformat()

    class Config:
        from_attributes = True
