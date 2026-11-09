import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.database import Base, CompatibleVector
from ..core.config import settings

if TYPE_CHECKING:
    from .ticket import Ticket

class TicketEmbedding(Base):
    __tablename__ = "ticket_embeddings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id: Mapped[str] = mapped_column(String(30), ForeignKey("tickets.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    embedding = mapped_column(CompatibleVector(dim=settings.EMBEDDING_DIMENSION), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), default=settings.EMBEDDING_MODEL, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="embedding")
