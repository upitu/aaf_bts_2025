from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ....db.schemas.admin import OTPRequest, OTPVerify, Token
from ....core.security import generate_otp, store_otp, send_otp_email, verify_otp, create_access_token
from ....services import admin_service 
from ....db.session import get_db 

router = APIRouter()

@router.post("/request-otp", status_code=200)
def request_otp(otp_request: OTPRequest, db: Session = Depends(get_db)):
    """
    Handles the first step of login: requesting an OTP.
    """
    admin = admin_service.get_admin_by_email(db, email=otp_request.email)

    if not admin or not admin.is_active:
        # Note: We don't reveal if the user exists for security reasons.
        print(f"Login attempt for non-existent or inactive admin: {otp_request.email}")
        return {"message": "If an account with this email exists, an OTP has been sent."}

    otp = generate_otp()
    store_otp(email=otp_request.email, otp=otp)
    send_otp_email(email=otp_request.email, otp=otp)
    
    return {"message": "If an account with this email exists, an OTP has been sent."}


@router.post("/verify-otp", response_model=Token)
def verify_otp_and_login(otp_verify: OTPVerify, db: Session = Depends(get_db)):
    """
    Handles the second step: verifying the OTP and issuing a JWT token.
    """
    admin = admin_service.get_admin_by_email(db, email=otp_verify.email)
    if not admin:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    if not verify_otp(email=otp_verify.email, otp=otp_verify.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # OTP is valid, create an access token with user's role
    access_token = create_access_token(data={"sub": admin.email, "role": admin.role.value})
    
    return {"access_token": access_token, "token_type": "bearer"}
