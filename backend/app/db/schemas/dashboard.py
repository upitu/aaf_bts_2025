from pydantic import BaseModel
from typing import Dict

# Schema for a single emirate's statistics
class EmirateStat(BaseModel):
    emirate: str
    count: int

# The main schema for all dashboard statistics
class DashboardStats(BaseModel):
    total_submissions: int
    submissions_by_emirate: Dict[str, int]
