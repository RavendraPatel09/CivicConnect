from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, computed_field
from ..models.ticket import ComplaintCategory, ComplaintSeverity, ComplaintStatus

class TicketEventResponse(BaseModel):
    id: str
    ticket_id: Optional[str] = None
    actor_id: Optional[str] = None
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None
    event_type: Optional[str] = None
    previous_status: Optional[str] = None
    new_status: Optional[str] = None
    title: str
    note: Optional[str] = None
    created_at: datetime

    @computed_field
    @property
    def timestamp(self) -> str:
        return self.created_at.isoformat()

    @computed_field
    @property
    def status(self) -> str:
        return self.new_status or "filed"

    @computed_field
    @property
    def description(self) -> str:
        return self.note or self.title

    @computed_field
    @property
    def actorName(self) -> str:
        return self.actor_name or "System"

    @computed_field
    @property
    def actorRole(self) -> str:
        return self.actor_role or "System"

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
