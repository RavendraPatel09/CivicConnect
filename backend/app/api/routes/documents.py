from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from ...core.database import get_db
from ...core.dependencies import require_role
from ...models.user import User, UserRole
from ...models.document import MunicipalDocument
from ...schemas.ai import DocumentChunkResult, RAGQueryResponse
from ...ai.rag_pipeline import query_rag, seed_initial_documents
from ...ai.embeddings import generate_embedding

router = APIRouter(prefix="/documents", tags=["Municipal Knowledge Base & RAG"])

class DocumentCreate(BaseModel):
    title: str
    content: str
    document_type: str = "guideline"
    source: Optional[str] = "Municipal Knowledge Base"

class DocumentResponse(BaseModel):
    id: str
    title: str
    content: str
    document_type: str
    source: Optional[str] = None

    class Config:
        from_attributes = True

class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 3

@router.get("", response_model=List[DocumentResponse])
async def list_documents(db: AsyncSession = Depends(get_db)):
    # Auto-seed if empty
    await seed_initial_documents(db)
    res = await db.execute(select(MunicipalDocument).order_by(MunicipalDocument.title))
    return res.scalars().all()

@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    doc: DocumentCreate,
    admin: User = Depends(require_role([UserRole.ADMIN, UserRole.STAFF])),
    db: AsyncSession = Depends(get_db)
):
    emb = await generate_embedding(doc.title + " " + doc.content)
    new_doc = MunicipalDocument(
        title=doc.title,
        content=doc.content,
        document_type=doc.document_type,
        source=doc.source,
        embedding=emb
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    return new_doc

@router.post("/query", response_model=RAGQueryResponse)
async def query_municipal_rag(
    req: RAGQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    await seed_initial_documents(db)
    return await query_rag(db, req.query, top_k=req.top_k)
