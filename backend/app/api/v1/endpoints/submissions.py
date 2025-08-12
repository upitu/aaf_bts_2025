from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
from ....db.session import get_db
from ....services import submission_service
from ....db.schemas.submission import Submission, SubmissionCreate
from ...dependencies import get_current_admin
from ....db.models.admin import Admin
from ....core.config import settings

router = APIRouter()

@router.post("/", response_model=Submission, status_code=201)
def handle_create_submission(
    name: str = Form(...),
    email: str = Form(...),
    mobile: str = Form(...),
    emirates_id: str = Form(...),
    emirate: str = Form(...),
    receipt: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Public endpoint to create a new user submission with a file upload.
    """
    submission_in = SubmissionCreate(name=name, email=email, mobile=mobile, emirates_id=emirates_id, emirate=emirate)

    if settings.ENFORCE_UNIQUE_EMAIL:
        if submission_service.get_submission_by_email(db, email=submission_in.email):
            raise HTTPException(status_code=400, detail="A submission with this email already exists.")
            
    if settings.ENFORCE_UNIQUE_MOBILE:
        if submission_service.get_submission_by_mobile(db, mobile=submission_in.mobile):
            raise HTTPException(status_code=400, detail="A submission with this mobile number already exists.")

    receipt_url, receipt_hash = submission_service.save_receipt_file(receipt)
    
    db_submission = submission_service.create_submission(db=db, submission=submission_in, receipt_url=receipt_url, receipt_hash=receipt_hash)

    # --- THIS IS THE FIX ---
    # Manually create the Pydantic response model from the database object.
    # This ensures all data types are correct before sending the response.
    return Submission.from_orm(db_submission)


@router.get("/", response_model=List[Submission])
def handle_get_all_submissions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Protected endpoint for admins to retrieve all user submissions.
    """
    submissions = submission_service.get_submissions(db, skip=skip, limit=limit)
    return submissions