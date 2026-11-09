from typing import Optional, List
from pydantic import BaseModel, Field
from ..models.ticket import ComplaintCategory, ComplaintSeverity

class AITriageClassification(BaseModel):
    category: ComplaintCategory = Field(description="The validated civic complaint category")
    severity: ComplaintSeverity = Field(description="Assessed public hazard severity")
    priority_score: int = Field(ge=0, le=100, description="Priority urgency index from 0 to 100")
    summary: str = Field(description="Concise 1-2 sentence issue synthesis for municipal engineers")
    reasoning: str = Field(description="Detailed rationale for the assigned priority and department")
    recommended_department: str = Field(description="Specific municipal department to assign")
    acknowledgment: str = Field(description="Polite, contextual acknowledgment drafted for citizen")
    confidence: float = Field(ge=0.0, le=1.0, description="Model confidence score")

class DuplicateCandidate(BaseModel):
    ticket_id: str
    title: str
    similarity_score: float
    distance_km: Optional[float] = None
    category: ComplaintCategory

class DocumentChunkResult(BaseModel):
    document_id: str
    title: str
    content: str
    document_type: str
    similarity: float

class RAGQueryResponse(BaseModel):
    query: str
    retrieved_documents: List[DocumentChunkResult]
    ai_guidance: str
    has_relevant_guideline: bool
