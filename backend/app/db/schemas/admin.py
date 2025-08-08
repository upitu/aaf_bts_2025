from pydantic import BaseModel, EmailStr
from ..db.models.admin import AdminRole

# Schema for requesting an OTP
class OTPRequest(BaseModel):
    email: EmailStr

# Schema for verifying an OTP
class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

# Schema for the JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str

# Base schema for an Admin user
class AdminBase(BaseModel):
    email: EmailStr

# Schema for creating a new Admin
class AdminCreate(AdminBase):
    role: AdminRole = AdminRole.ADMIN

# Schema for reading/returning Admin data
class Admin(AdminBase):
    id: int
    role: AdminRole
    is_active: bool

    class Config:
        orm_mode = True
