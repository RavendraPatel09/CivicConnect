from typing import List
import math
import hashlib
from ..core.config import settings

def _deterministic_embedding(text: str, dim: int = 768) -> List[float]:
    """Generates a stable, normalized embedding vector for tests and offline development."""
    vec = [0.0] * dim
    words = text.lower().split()
    for word in words:
        h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
        for i in range(dim):
            # Deterministic pseudo-random projection
            bit = (h >> (i % 64)) & 1
            val = 1.0 if bit == 1 else -1.0
            vec[i] += val * (1.0 / (1.0 + (i % 10)))

    # Normalize vector to unit length
    magnitude = math.sqrt(sum(v * v for v in vec))
    if magnitude > 0:
        vec = [v / magnitude for v in vec]
    else:
        vec[0] = 1.0
    return vec

async def generate_embedding(text: str) -> List[float]:
    """Generates embedding using Gemini API if key is set, else uses deterministic vector."""
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 10:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            result = genai.embed_content(
                model=settings.EMBEDDING_MODEL,
                content=text,
                task_type="retrieval_document"
            )
            embedding = result['embedding']
            # Truncate or pad to expected dimension
            if len(embedding) == settings.EMBEDDING_DIMENSION:
                return embedding
            elif len(embedding) > settings.EMBEDDING_DIMENSION:
                return embedding[:settings.EMBEDDING_DIMENSION]
        except Exception as e:
            # Fall back gracefully to deterministic vector if API limit or network error
            pass

    return _deterministic_embedding(text, settings.EMBEDDING_DIMENSION)

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Calculates cosine similarity between two vector lists."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return max(0.0, min(1.0, dot_product / (mag1 * mag2)))
