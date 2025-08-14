from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

# Schema for the data coming from the frontend form
class SubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    emirates_id: str
    emirate: str

class SubmissionOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    mobile: str
    emirates_id: str
    emirate: str
    receipt_url: str
    receipt_hash: Optional[str] = None
    submitted_at: datetime

    # 👇 This is the key for v2 (replaces v1's orm_mode=True)
    model_config = ConfigDict(from_attributes=True)

# Schema for the data being returned by the API
class Submission(BaseModel):
    id: int
    name: str
    email: EmailStr
    mobile: str
    emirates_id: str
    emirate: str
    receipt_url: str
    submitted_at: datetime

    class Config:
        orm_mode = True

model_config = ConfigDict(from_attributes=True)