from datetime import datetime, timezone
import enum
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Float, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base

if TYPE_CHECKING:
    from .user import User
    from .department import Department
    from .ticket_event import TicketEvent
    from .upvote import Upvote
    from .notification import Notification
    from .embedding import TicketEmbedding

class ComplaintCategory(str, enum.Enum):
    ROADS_POTHOLES = "roads_potholes"
    WATER_SUPPLY = "water_supply"
    GARBAGE_MANAGEMENT = "garbage_management"
    STREETLIGHTS = "streetlights"
    DRAINAGE = "drainage"
    PUBLIC_INFRASTRUCTURE = "public_infrastructure"

class ComplaintSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ComplaintStatus(str, enum.Enum):
    FILED = "filed"
    ACKNOWLEDGED = "acknowledged"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[str] = mapped_column(String(30), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[ComplaintCategory] = mapped_column(Enum(ComplaintCategory, name="complaint_category"), nullable=False, index=True)
    severity: Mapped[ComplaintSeverity] = mapped_column(Enum(ComplaintSeverity, name="complaint_severity"), default=ComplaintSeverity.MEDIUM, nullable=False, index=True)
    priority_score: Mapped[int] = mapped_column(Integer, default=50, nullable=False, index=True)
    status: Mapped[ComplaintStatus] = mapped_column(Enum(ComplaintStatus, name="complaint_status"), default=ComplaintStatus.FILED, nullable=False, index=True)
    
    # Location
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    landmark: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Media
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # AI Triage Fields
    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.90, nullable=False)
    is_overridden: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    overridden_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    overridden_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    override_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Department & Staff Assignment
    department_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True)
    assigned_staff_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    duplicate_of_ticket_id: Mapped[Optional[str]] = mapped_column(String(30), ForeignKey("tickets.id", ondelete="SET NULL"), nullable=True)
    
    # Social Engagement & Stats
    upvotes_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="tickets", foreign_keys=[user_id], lazy="selectin")
    assigned_staff: Mapped[Optional["User"]] = relationship("User", back_populates="assigned_tickets", foreign_keys=[assigned_staff_id], lazy="selectin")
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="tickets", lazy="selectin")
    events: Mapped[List["TicketEvent"]] = relationship("TicketEvent", back_populates="ticket", cascade="all, delete-orphan", order_by="TicketEvent.created_at.asc()", lazy="selectin")
    upvotes: Mapped[List["Upvote"]] = relationship("Upvote", back_populates="ticket", cascade="all, delete-orphan")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="ticket", cascade="all, delete-orphan")
    embedding: Mapped[Optional["TicketEmbedding"]] = relationship("TicketEmbedding", back_populates="ticket", uselist=False, cascade="all, delete-orphan", lazy="selectin")
