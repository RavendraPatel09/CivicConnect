from typing import List
from pydantic import BaseModel
from ..models.ticket import ComplaintCategory, ComplaintSeverity

class CategoryDistributionItem(BaseModel):
    category: ComplaintCategory
    count: int
    resolved: int

class MonthlyTrendItem(BaseModel):
    month: str
    filed: int
    resolved: int

class PriorityDistributionItem(BaseModel):
    priority: ComplaintSeverity
    count: int

class DepartmentMetricItem(BaseModel):
    department: str
    totalAssigned: int
    resolved: int
    avgResolutionHours: int
    satisfactionRate: int

class AnalyticsSummaryResponse(BaseModel):
    totalComplaints: int
    pendingComplaints: int
    highPriorityComplaints: int
    resolvedComplaints: int
    inProgressComplaints: int
    avgResolutionDays: float
    citizenSatisfactionRate: float
    categoryDistribution: List[CategoryDistributionItem]
    monthlyTrends: List[MonthlyTrendItem]
    priorityDistribution: List[PriorityDistributionItem]
    departmentPerformance: List[DepartmentMetricItem]
