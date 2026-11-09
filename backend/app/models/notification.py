import uuid
from datetime import datetime, timezone
import enum
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base

if TYPE_CHECKING:
    from .user import User
    from .ticket import Ticket

class NotificationType(str, enum.Enum):
    COMPLAINT_RECEIVED = "complaint_received"
    AI_TRIAGE_COMPLETED = "ai_triage_completed"
    STAFF_ASSIGNED = "staff_assigned"
    COMPLAINT_STATUS_CHANGED = "complaint_status_changed"
    COMPLAINT_RESOLVED = "complaint_resolved"

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    ticket_id: Mapped[Optional[str]] = mapped_column(String(30), ForeignKey("tickets.id", ondelete="SET NULL"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, name="notification_type"), nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notifications")
    ticket: Mapped[Optional["Ticket"]] = relationship("Ticket", back_populates="notifications")
