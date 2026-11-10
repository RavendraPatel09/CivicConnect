from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc

from ...core.database import get_db
from ...core.dependencies import get_current_active_user
from ...models.user import User
from ...models.notification import Notification
from ...schemas.notification import NotificationResponse, NotificationReadResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        query = query.where(Notification.is_read == False)
    query = query.order_by(desc(Notification.created_at))

    res = await db.execute(query)
    notifs = res.scalars().all()

    return [
        NotificationResponse(
            id=n.id,
            recipientId=n.user_id,
            ticketId=n.ticket_id,
            title=n.title,
            message=n.message,
            type=n.notification_type,
            read=n.is_read,
            createdAt=n.created_at
        ) for n in notifs
    ]

@router.patch("/{id}/read", response_model=NotificationReadResponse)
async def mark_as_read(
    id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Notification).where(Notification.id == id, Notification.user_id == current_user.id))
    notif = res.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    await db.commit()
    return NotificationReadResponse(success=True, message="Marked as read")

@router.post("/read-all", response_model=NotificationReadResponse)
@router.post("/mark-all-read", response_model=NotificationReadResponse)
async def mark_all_as_read(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read == False)
        .values(is_read=True)
    )
    await db.commit()
    return NotificationReadResponse(success=True, message="All notifications marked as read")
