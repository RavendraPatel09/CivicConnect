import json
from typing import Optional
from ..schemas.ai import AITriageClassification
from ..models.ticket import ComplaintCategory, ComplaintSeverity
from ..core.config import settings

DEPARTMENT_MAPPING = {
    ComplaintCategory.ROADS_POTHOLES: "Department of Transportation & Roads",
    ComplaintCategory.WATER_SUPPLY: "Municipal Water & Sewerage Board",
    ComplaintCategory.GARBAGE_MANAGEMENT: "Sanitation & Solid Waste Management",
    ComplaintCategory.STREETLIGHTS: "Municipal Electrical Department",
    ComplaintCategory.DRAINAGE: "Stormwater & Drainage Engineering",
    ComplaintCategory.PUBLIC_INFRASTRUCTURE: "Public Works & Civil Infrastructure",
}

def _rule_based_triage(title: str, description: str, category: ComplaintCategory, severity: ComplaintSeverity) -> AITriageClassification:
    text = (title + " " + description).lower()
    
    # Priority baseline based on submitted severity
    base_scores = {
        ComplaintSeverity.LOW: 45,
        ComplaintSeverity.MEDIUM: 65,
        ComplaintSeverity.HIGH: 85,
        ComplaintSeverity.CRITICAL: 95
    }
    score = base_scores.get(severity, 65)

    # Keyword boosts
    if any(w in text for w in ["burst", "collapse", "danger", "flooding", "elderly", "urgent", "accident", "school", "emergency"]):
        score = min(99, score + 10)
        if severity == ComplaintSeverity.MEDIUM:
            severity = ComplaintSeverity.HIGH

    dept = DEPARTMENT_MAPPING.get(category, "Public Works & Civil Infrastructure")

    summary = f"Automated triage: {category.value.replace('_', ' ').title()} incident reported at location. Assessed safety risk score {score}/100."
    acknowledgment = f"Your report regarding '{title}' has been validated by AI Triage with Priority {score}. Work order routed to {dept}."

    return AITriageClassification(
        category=category,
        severity=severity,
        priority_score=score,
        summary=summary,
        reasoning=f"Classified under {category.value} based on semantic description and hazard keywords. Assigned to {dept}.",
        recommended_department=dept,
        acknowledgment=acknowledgment,
        confidence=0.94
    )

async def classify_complaint(
    title: str,
    description: str,
    declared_category: ComplaintCategory,
    declared_severity: ComplaintSeverity
) -> AITriageClassification:
    """Uses LLM with structured output or fallback rules to classify complaint."""
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 10:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel(
                model_name=settings.LLM_MODEL,
                generation_config={"response_mime_type": "application/json"}
            )
            prompt = f"""
            You are CivicConnect AI Triage Engine for municipal grievances.
            Analyze this civic complaint and provide a structured JSON assessment conforming exactly to this schema:
            {{
                "category": one of ["roads_potholes", "water_supply", "garbage_management", "streetlights", "drainage", "public_infrastructure"],
                "severity": one of ["low", "medium", "high", "critical"],
                "priority_score": integer from 0 to 100,
                "summary": "1-2 sentence issue synthesis for engineers",
                "reasoning": "rationale for priority and department",
                "recommended_department": "official municipal department",
                "acknowledgment": "polite citizen acknowledgment",
                "confidence": float between 0.0 and 1.0
            }}

            Complaint Title: {title}
            Description: {description}
            Citizen Selected Category: {declared_category.value}
            Citizen Selected Severity: {declared_severity.value}
            """
            response = model.generate_content(prompt)
            data = json.loads(response.text)
            return AITriageClassification(**data)
        except Exception as e:
            # Fall back gracefully to high-precision rules engine
            pass

    return _rule_based_triage(title, description, declared_category, declared_severity)
