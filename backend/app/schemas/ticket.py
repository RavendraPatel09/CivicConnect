from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from ..models.ticket import ComplaintCategory, ComplaintSeverity, ComplaintStatus

class TicketEventResponse(BaseModel):
    id: str
    ticket_id: str
    actor_id: Optional[str] = None
    actor_name: str
    actor_role: str
    event_type: str
    previous_status: Optional[str] = None
    new_status: Optional[str] = None
    title: str
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AITriageDetail(BaseModel):
    recommendedCategory: ComplaintCategory
    recommendedSeverity: ComplaintSeverity
    priorityScore: int
    suggestedDepartment: str
    summary: str
    acknowledgmentDraft: str
    confidenceScore: float
    similarTicketIds: List[str] = []
    isOverridden: bool = False
    overriddenBy: Optional[str] = None
    overriddenAt: Optional[datetime] = None
    overrideNotes: Optional[str] = None

class TicketLocation(BaseModel):
    address: str
    lat: float
    lng: float
    landmark: Optional[str] = None

class TicketCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=20, max_length=5000)
    category: ComplaintCategory
    severity: ComplaintSeverity = ComplaintSeverity.MEDIUM
    address: str
    landmark: Optional[str] = None
    lat: float
    lng: float
    images: List[str] = []

class TicketUpdateStatus(BaseModel):
    status: ComplaintStatus
    notes: Optional[str] = None

class TicketTriageOverride(BaseModel):
    category: ComplaintCategory
    severity: ComplaintSeverity
    assignedDepartment: str
    assignedStaffName: Optional[str] = None
    priorityScore: int = Field(..., ge=0, le=100)
    overrideNotes: str = Field(..., min_length=5)

class TicketResponse(BaseModel):
    id: str
    title: str
    description: str
    category: ComplaintCategory
    severity: ComplaintSeverity
    status: ComplaintStatus
    location: TicketLocation
    images: List[str]
    citizenId: str
    citizenName: str
    citizenEmail: str
    assignedDepartment: str
    assignedStaffId: Optional[str] = None
    assignedStaffName: Optional[str] = None
    upvotes: int
    isUpvoted: bool = False
    aiTriage: AITriageDetail
    timeline: List[TicketEventResponse] = []
    createdAt: datetime
    updatedAt: datetime
    resolvedAt: Optional[datetime] = None

    class Config:
        from_attributes = True

class NearbyTicketResponse(TicketResponse):
    distanceKm: float

class PaginatedTicketsResponse(BaseModel):
    items: List[TicketResponse]
    total: int
    page: int
    limit: int
    total_pages: int
