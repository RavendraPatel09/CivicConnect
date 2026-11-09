import math
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.ticket import Ticket, ComplaintStatus
from ..models.embedding import TicketEmbedding
from ..schemas.ai import DuplicateCandidate
from .embeddings import cosine_similarity

def calculate_haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

async def find_duplicates(
    db: AsyncSession,
    target_embedding: List[float],
    current_ticket_id: Optional[str],
    lat: float,
    lng: float,
    category: str,
    similarity_threshold: float = 0.70,
    max_distance_km: float = 2.0
) -> List[DuplicateCandidate]:
    """Finds open complaints that are semantically and geographically close."""
    query = (
        select(Ticket, TicketEmbedding)
        .join(TicketEmbedding, Ticket.id == TicketEmbedding.ticket_id)
        .where(
            Ticket.status.in_([ComplaintStatus.FILED, ComplaintStatus.ACKNOWLEDGED, ComplaintStatus.IN_PROGRESS])
        )
    )
    if current_ticket_id:
        query = query.where(Ticket.id != current_ticket_id)

    result = await db.execute(query)
    candidates: List[DuplicateCandidate] = []

    for ticket, emb in result.all():
        # Geographic proximity
        dist_km = calculate_haversine_km(lat, lng, ticket.latitude, ticket.longitude)
        if dist_km > max_distance_km:
            continue

        # Cosine similarity
        score = cosine_similarity(target_embedding, emb.embedding)
        
        # Boost score slightly if category matches exactly
        if ticket.category.value == category:
            score = min(1.0, score + 0.05)

        if score >= similarity_threshold:
            candidates.append(
                DuplicateCandidate(
                    ticket_id=ticket.id,
                    title=ticket.title,
                    similarity_score=round(score, 3),
                    distance_km=round(dist_km, 2),
                    category=ticket.category
                )
            )

    candidates.sort(key=lambda x: x.similarity_score, reverse=True)
    return candidates[:5]
