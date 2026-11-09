from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from ..models.notification import NotificationType

class NotificationResponse(BaseModel):
    id: str
    recipientId: str
    ticketId: Optional[str] = None
    title: str
    message: str
    type: NotificationType
    read: bool
    createdAt: datetime

    class Config:
        from_attributes = True

class NotificationReadResponse(BaseModel):
    success: bool
    message: str
