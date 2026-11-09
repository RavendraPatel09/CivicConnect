import json
import random
from typing import Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc, asc

from ...core.database import get_db
from ...core.dependencies import (
    get_current_active_user,
    get_optional_current_user,
    require_role
)
from ...models.user import User, UserRole
from ...models.ticket import Ticket, ComplaintCategory, ComplaintSeverity, ComplaintStatus
from ...models.ticket_event import TicketEvent
from ...models.upvote import Upvote
from ...models.department import Department
from ...models.notification import Notification, NotificationType
from ...models.embedding import TicketEmbedding
from ...schemas.ticket import (
    TicketCreate,
    TicketResponse,
    TicketLocation,
    AITriageDetail,
    TicketEventResponse,
    TicketUpdateStatus,
    TicketTriageOverride,
    NearbyTicketResponse
)
from ...ai.classifier import classify_complaint
from ...ai.embeddings import generate_embedding
from ...ai.duplicate_detector import find_duplicates, calculate_haversine_km
from ...websocket.manager import manager

router = APIRouter(prefix="/tickets", tags=["Tickets & Grievances"])

def _map_ticket_to_response(ticket: Ticket, current_user_id: Optional[str] = None) -> TicketResponse:
    # Images JSON or fallback
    images = []
    if ticket.image_url:
        try:
            images = json.loads(ticket.image_url) if ticket.image_url.startswith("[") else [ticket.image_url]
        except Exception:
            images = [ticket.image_url]

    # Check if current user upvoted
    is_upvoted = False
    if current_user_id and hasattr(ticket, "upvotes") and ticket.upvotes:
        is_upvoted = any(u.user_id == current_user_id for u in ticket.upvotes)

    dept_name = ticket.department.name if ticket.department else "Unassigned Department"
    staff_name = ticket.assigned_staff.name if ticket.assigned_staff else None

    # Timeline mapping
    timeline_responses = [
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
        ) for ev in ticket.events
    ]

    ai_triage = AITriageDetail(
        recommendedCategory=ticket.category,
        recommendedSeverity=ticket.severity,
        priorityScore=ticket.priority_score,
        suggestedDepartment=dept_name,
        summary=ticket.ai_summary or f"{ticket.title} assessed at Priority {ticket.priority_score}/100.",
        acknowledgmentDraft=ticket.ai_response or "Your report has been logged and queued for municipal resolution.",
        confidenceScore=ticket.confidence_score,
        similarTicketIds=[ticket.duplicate_of_ticket_id] if ticket.duplicate_of_ticket_id else [],
        isOverridden=ticket.is_overridden,
        overriddenBy=ticket.overridden_by,
        overriddenAt=ticket.overridden_at,
        overrideNotes=ticket.override_notes
    )

    return TicketResponse(
        id=ticket.id,
        title=ticket.title,
        description=ticket.description,
        category=ticket.category,
        severity=ticket.severity,
        status=ticket.status,
        location=TicketLocation(
            address=ticket.address,
            lat=ticket.latitude,
            lng=ticket.longitude,
            landmark=ticket.landmark
        ),
        images=images,
        citizenId=ticket.user_id,
        citizenName=ticket.user.name if ticket.user else "Citizen",
        citizenEmail=ticket.user.email if ticket.user else "citizen@example.com",
        assignedDepartment=dept_name,
        assignedStaffId=ticket.assigned_staff_id,
        assignedStaffName=staff_name,
        upvotes=ticket.upvotes_count,
        isUpvoted=is_upvoted,
        aiTriage=ai_triage,
        timeline=timeline_responses,
        createdAt=ticket.created_at,
        updatedAt=ticket.updated_at,
        resolvedAt=ticket.resolved_at
    )

@router.get("", response_model=List[TicketResponse])
async def get_tickets(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    sort_by: Optional[str] = "newest",
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Ticket)

    if search:
        s = f"%{search.lower()}%"
        query = query.where(
            or_(
                func.lower(Ticket.title).like(s),
                func.lower(Ticket.description).like(s),
                func.lower(Ticket.id).like(s),
                func.lower(Ticket.address).like(s)
            )
        )

    if category and category != "all":
        query = query.where(Ticket.category == category)

    if status and status != "all":
        query = query.where(Ticket.status == status)

    if severity and severity != "all":
        query = query.where(Ticket.severity == severity)

    if sort_by == "newest":
        query = query.order_by(desc(Ticket.created_at))
    elif sort_by == "oldest":
        query = query.order_by(asc(Ticket.created_at))
    elif sort_by == "priority":
        query = query.order_by(desc(Ticket.priority_score))
    elif sort_by == "upvotes":
        query = query.order_by(desc(Ticket.upvotes_count))
    else:
        query = query.order_by(desc(Ticket.created_at))

    res = await db.execute(query)
    tickets = res.scalars().all()
    user_id = current_user.id if current_user else None
    return [_map_ticket_to_response(t, user_id) for t in tickets]

@router.get("/my", response_model=List[TicketResponse])
async def get_my_tickets(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Ticket).where(Ticket.user_id == current_user.id).order_by(desc(Ticket.created_at))
    res = await db.execute(query)
    tickets = res.scalars().all()
    return [_map_ticket_to_response(t, current_user.id) for t in tickets]

@router.get("/nearby", response_model=List[NearbyTicketResponse])
async def get_nearby_tickets(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_km: float = Query(2.0, ge=0.5, le=50.0),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Ticket))
    all_tickets = res.scalars().all()
    user_id = current_user.id if current_user else None

    nearby_results: List[NearbyTicketResponse] = []
    for t in all_tickets:
        dist = calculate_haversine_km(lat, lng, t.latitude, t.longitude)
        if dist <= radius_km:
            base_resp = _map_ticket_to_response(t, user_id)
            nearby_results.append(NearbyTicketResponse(**base_resp.model_dump(), distanceKm=round(dist, 2)))

    nearby_results.sort(key=lambda x: x.distanceKm)
    return nearby_results

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket_by_id(
    ticket_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = res.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Complaint record not found")

    user_id = current_user.id if current_user else None
    return _map_ticket_to_response(ticket, user_id)

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    req: TicketCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Generate unique sequential / branded complaint ID
    new_id = f"CC-2025-{random.randint(1000, 9999)}"

    # 2. Run structured AI Triage Classification
    ai_result = await classify_complaint(
        title=req.title,
        description=req.description,
        declared_category=req.category,
        declared_severity=req.severity
    )

    # 3. Department assignment
    dept_res = await db.execute(select(Department).where(Department.name == ai_result.recommended_department))
    dept = dept_res.scalar_one_or_none()
    dept_id = dept.id if dept else None

    # 4. Generate text embedding for vector storage & duplicate detection
    embedding_vector = await generate_embedding(f"{req.title} {req.description} {req.address}")

    # 5. Semantic Duplicate Detection
    duplicates = await find_duplicates(
        db=db,
        target_embedding=embedding_vector,
        current_ticket_id=None,
        lat=req.lat,
        lng=req.lng,
        category=req.category.value
    )
    dup_id = duplicates[0].ticket_id if duplicates else None

    image_json = json.dumps(req.images) if req.images else None

    # 6. Create Ticket Entity
    ticket = Ticket(
        id=new_id,
        user_id=current_user.id,
        title=req.title,
        description=req.description,
        category=req.category,
        severity=ai_result.severity,
        priority_score=ai_result.priority_score,
        status=ComplaintStatus.ACKNOWLEDGED,
        latitude=req.lat,
        longitude=req.lng,
        address=req.address,
        landmark=req.landmark,
        image_url=image_json,
        ai_summary=ai_result.summary,
        ai_response=ai_result.acknowledgment,
        confidence_score=ai_result.confidence,
        department_id=dept_id,
        duplicate_of_ticket_id=dup_id,
        upvotes_count=1
    )
    db.add(ticket)
    await db.flush()

    # 7. Store Vector Embedding
    emb_record = TicketEmbedding(
        ticket_id=ticket.id,
        embedding=embedding_vector
    )
    db.add(emb_record)

    # 8. Create Initial Timeline Events
    ev1 = TicketEvent(
        ticket_id=ticket.id,
        actor_id=current_user.id,
        actor_name=current_user.name,
        actor_role="Citizen",
        event_type="filed",
        previous_status=None,
        new_status="filed",
        title="Report Filed",
        note="Grievance logged with photographic proof and geocoded coordinates."
    )
    ev2 = TicketEvent(
        ticket_id=ticket.id,
        actor_id=None,
        actor_name="CivicConnect AI Engine v2.4",
        actor_role="AI Assistant",
        event_type="triage",
        previous_status="filed",
        new_status="acknowledged",
        title="AI Triage Assessment Completed",
        note=f"Assigned Priority {ai_result.priority_score}/100. Routed to {ai_result.recommended_department}."
    )
    db.add_all([ev1, ev2])

    # 9. Auto-upvote by creator
    db.add(Upvote(ticket_id=ticket.id, user_id=current_user.id))

    # 10. Create In-App Notification
    notif = Notification(
        user_id=current_user.id,
        ticket_id=ticket.id,
        title="Report Registered & AI Queued",
        message=f"Your grievance '{ticket.title}' has been registered as {ticket.id}. Initial priority {ticket.priority_score}/100.",
        notification_type=NotificationType.COMPLAINT_RECEIVED
    )
    db.add(notif)
    await db.commit()
    await db.refresh(ticket)

    response = _map_ticket_to_response(ticket, current_user.id)

    # 11. Broadcast to real-time WebSockets
    await manager.broadcast_ticket_event(ticket.id, "ticket.created", response.model_dump(mode="json"))

    return response

@router.patch("/{ticket_id}/status", response_model=TicketResponse)
async def update_ticket_status(
    ticket_id: str,
    req: TicketUpdateStatus,
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = res.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Complaint record not found")

    old_status = ticket.status
    ticket.status = req.status
    ticket.updated_at = datetime.now(timezone.utc)
    if req.status == ComplaintStatus.RESOLVED:
        ticket.resolved_at = datetime.now(timezone.utc)

    # Automatically assign staff if unassigned and updater is staff
    if current_user.role == UserRole.STAFF and not ticket.assigned_staff_id:
        ticket.assigned_staff_id = current_user.id

    status_titles = {
        ComplaintStatus.FILED: "Report Reset to Filed",
        ComplaintStatus.ACKNOWLEDGED: "Complaint Acknowledged",
        ComplaintStatus.IN_PROGRESS: "Field Crew Dispatched & Work Commenced",
        ComplaintStatus.RESOLVED: "Repairs Completed & Inspected",
        ComplaintStatus.REJECTED: "Grievance Closed Without Action"
    }

    event = TicketEvent(
        ticket_id=ticket.id,
        actor_id=current_user.id,
        actor_name=current_user.name,
        actor_role="Municipal Staff" if current_user.role == UserRole.STAFF else "Administrator",
        event_type="status_change",
        previous_status=old_status.value,
        new_status=req.status.value,
        title=status_titles.get(req.status, "Status Updated"),
        note=req.notes or f"Transitioned from {old_status.value} to {req.status.value}."
    )
    db.add(event)

    # Send notification to citizen
    notif = Notification(
        user_id=ticket.user_id,
        ticket_id=ticket.id,
        title=f"Status Update on {ticket.id}",
        message=f"Your complaint status is now '{req.status.value.replace('_', ' ')}': {req.notes or status_titles.get(req.status)}",
        notification_type=NotificationType.COMPLAINT_RESOLVED if req.status == ComplaintStatus.RESOLVED else NotificationType.COMPLAINT_STATUS_CHANGED
    )
    db.add(notif)
    await db.commit()
    await db.refresh(ticket)

    response = _map_ticket_to_response(ticket, current_user.id)

    # Broadcast event via WebSocket
    await manager.broadcast_ticket_event(ticket.id, "ticket.status_updated", {
        "status": req.status.value,
        "previous_status": old_status.value,
        "actor": current_user.name,
        "note": req.notes
    })

    return response

@router.post("/{ticket_id}/triage-override", response_model=TicketResponse)
async def override_ai_triage(
    ticket_id: str,
    req: TicketTriageOverride,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = res.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Complaint record not found")

    dept_res = await db.execute(select(Department).where(Department.name == req.assignedDepartment))
    dept = dept_res.scalar_one_or_none()
    if dept:
        ticket.department_id = dept.id

    ticket.category = req.category
    ticket.severity = req.severity
    ticket.priority_score = req.priorityScore
    ticket.is_overridden = True
    ticket.overridden_by = current_user.name
    ticket.overridden_at = datetime.now(timezone.utc)
    ticket.override_notes = req.overrideNotes
    ticket.updated_at = datetime.now(timezone.utc)

    event = TicketEvent(
        ticket_id=ticket.id,
        actor_id=current_user.id,
        actor_name=current_user.name,
        actor_role="Administrator",
        event_type="triage_override",
        previous_status=ticket.status.value,
        new_status=ticket.status.value,
        title="AI Triage Overridden by Administrator",
        note=f"Category: {req.category.value}, Severity: {req.severity.value}, Score: {req.priorityScore}. Reason: {req.overrideNotes}"
    )
    db.add(event)
    await db.commit()
    await db.refresh(ticket)

    return _map_ticket_to_response(ticket, current_user.id)

@router.post("/{ticket_id}/upvote")
async def upvote_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = res.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Check if already upvoted
    uv_res = await db.execute(select(Upvote).where(Upvote.ticket_id == ticket_id, Upvote.user_id == current_user.id))
    existing = uv_res.scalar_one_or_none()

    if existing:
        # Toggle: Remove upvote
        await db.delete(existing)
        ticket.upvotes_count = max(0, ticket.upvotes_count - 1)
        is_upvoted = False
    else:
        # Add upvote
        db.add(Upvote(ticket_id=ticket_id, user_id=current_user.id))
        ticket.upvotes_count += 1
        is_upvoted = True

    await db.commit()
    return {"upvotes": ticket.upvotes_count, "isUpvoted": is_upvoted}
