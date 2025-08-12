from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

# Schema for the data coming from the frontend form
class SubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    emirates_id: str
    emirate: str

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