from pydantic import BaseModel, ConfigDict, Field
from typing import Dict, List, Optional

class EmirateStat(BaseModel):
    emirate: str
    count: int

class TimeBucket(BaseModel):
    bucket: str
    count: int

class TimePoint(BaseModel):
    bucket: str
    count: int

class PeakHour(BaseModel):
    hour_label: str
    count: int

class DashboardStats(BaseModel):
    # allow ORM, and (optionally) keep this strict; we define every field we return
    model_config = ConfigDict(from_attributes=True)

    total_submissions: int
    submissions_by_emirate: Dict[str, int] = Field(default_factory=dict)
    emirate_colors: Dict[str, str] | None = None

    # NEW fields that were being dropped
    submissions_by_language: Dict[str, int] = Field(default_factory=dict)
    submissions_over_time: List[TimePoint] = Field(default_factory=list)
    peak_hour: Optional[PeakHour] = None