import uuid
from datetime import datetime, timezone
import enum
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base

if TYPE_CHECKING:
    from .ticket import Ticket
    from .upvote import Upvote
    from .notification import Notification
    from .department import Department
    from .refresh_token import RefreshToken

class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    STAFF = "staff"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), default=UserRole.CITIZEN, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    profile_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    department_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="staff_members", lazy="selectin")
    tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="user", foreign_keys="[Ticket.user_id]")
    assigned_tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="assigned_staff", foreign_keys="[Ticket.assigned_staff_id]")
    upvotes: Mapped[List["Upvote"]] = relationship("Upvote", back_populates="user", cascade="all, delete-orphan")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
