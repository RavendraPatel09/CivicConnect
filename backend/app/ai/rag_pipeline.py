from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.document import MunicipalDocument
from ..schemas.ai import DocumentChunkResult, RAGQueryResponse
from .embeddings import generate_embedding, cosine_similarity
from ..core.config import settings

INITIAL_MUNICIPAL_GUIDELINES = [
    {
        "title": "Municipal Pothole and Asphalt Repair SOP-204",
        "document_type": "procedure",
        "source": "Department of Transportation Code v4",
        "content": (
            "Standard Operating Procedure for Road Degradation: Any depression exceeding 2 inches in depth "
            "or 1 square foot in area in high-traffic corridors or bus transit routes must be cordoned within "
            "4 hours and patched with hot-mix asphalt within 24 to 48 hours. Field crew lead Marcus Vance "
            "is authorized to issue emergency asphalt purchase orders without secondary commissioner review."
        )
    },
    {
        "title": "Municipal Water Main Rupture Emergency Protocol",
        "document_type": "emergency_standard",
        "source": "Municipal Water & Sewerage Board Standard Operations",
        "content": (
            "Potable Water Pipeline Leaks: High-pressure conduit failures threatening structural sidewalk erosion "
            "require immediate emergency hydraulic team dispatch within 30 minutes. Valves on branch mains must be "
            "isolated to preserve neighborhood pressure, and water quality testing is mandatory before declaring resolution."
        )
    },
    {
        "title": "Solid Waste Collection and Cycle Path Obstruction Policy",
        "document_type": "guideline",
        "source": "Sanitation & Solid Waste Management Bylaw 12",
        "content": (
            "Commercial and Residential Dumpster Overflows: If uncollected refuse or bio-waste encroaches upon "
            "public cycle lanes or pedestrian footpaths, route dispatch must redirect the nearest sanitation compactor "
            "within 12 hours. Fines will be levied on commercial premises if private dumpster service was neglected."
        )
    },
    {
        "title": "Electrical Grid and Streetlight Safety Protocol",
        "document_type": "safety_standard",
        "source": "Municipal Electrical Department Technical Manual",
        "content": (
            "Streetlight Cluster Failures: Outages affecting three or more consecutive fixtures along pedestrian corridors "
            "are classified as Medium-High public safety hazards. Electricians must inspect underground feeder conduits, "
            "replace burnt ballast drivers, and verify illumination against municipal photometric grid requirements."
        )
    },
    {
        "title": "Stormwater Culvert Clearing and Flood Mitigation Code",
        "document_type": "procedure",
        "source": "Stormwater & Drainage Engineering Guideline",
        "content": (
            "Drainage Basin Obstruction: Silt, gravel, and construction debris blocking curb inlet catch basins must be "
            "flushed using high-pressure hydrovac vacuum excavators within 24 hours of rainy season alerts to prevent storefront inundation."
        )
    }
]

async def seed_initial_documents(db: AsyncSession):
    """Seeds initial municipal guidelines into the RAG vector store if empty."""
    res = await db.execute(select(MunicipalDocument))
    if not res.scalars().first():
        for doc in INITIAL_MUNICIPAL_GUIDELINES:
            emb = await generate_embedding(doc["title"] + " " + doc["content"])
            d = MunicipalDocument(
                title=doc["title"],
                content=doc["content"],
                document_type=doc["document_type"],
                source=doc["source"],
                embedding=emb
            )
            db.add(d)
        await db.commit()

async def query_rag(db: AsyncSession, query_text: str, top_k: int = 3) -> RAGQueryResponse:
    """Performs semantic retrieval against municipal documents and synthesizes grounded guidance."""
    query_emb = await generate_embedding(query_text)

    res = await db.execute(select(MunicipalDocument))
    all_docs = res.scalars().all()

    scored_docs: List[tuple[MunicipalDocument, float]] = []
    for doc in all_docs:
        if doc.embedding is not None:
            sim = cosine_similarity(query_emb, doc.embedding)
            scored_docs.append((doc, sim))

    scored_docs.sort(key=lambda x: x[1], reverse=True)
    top_matches = scored_docs[:top_k]

    # Filter by minimum relevance threshold (0.55)
    relevant_chunks: List[DocumentChunkResult] = []
    for doc, sim in top_matches:
        if sim >= 0.55:
            relevant_chunks.append(
                DocumentChunkResult(
                    document_id=doc.id,
                    title=doc.title,
                    content=doc.content,
                    document_type=doc.document_type,
                    similarity=round(sim, 3)
                )
            )

    has_relevant = len(relevant_chunks) > 0
    
    if not has_relevant:
        guidance = "No supporting municipal guideline or SOP was found in the knowledge base matching this specific inquiry."
    else:
        context_str = "\n\n".join([f"[{c.title} (Source: {c.document_type})]: {c.content}" for c in relevant_chunks])
        guidance = (
            f"Retrieved {len(relevant_chunks)} relevant municipal policy guidelines:\n"
            f"{context_str}\n\n"
            f"Recommendation: Adhere strictly to the target turnaround window and safety protocols specified in the retrieved sources above."
        )

    return RAGQueryResponse(
        query=query_text,
        retrieved_documents=relevant_chunks,
        ai_guidance=guidance,
        has_relevant_guideline=has_relevant
    )
