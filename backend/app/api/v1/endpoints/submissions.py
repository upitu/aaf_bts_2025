from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
from ....db.session import get_db
from ....services import submission_service
from ....db.schemas.submission import Submission, SubmissionCreate, SubmissionOut
from ...dependencies import get_current_admin
from ....db.models.admin import Admin
from ....core.config import settings
from app.services import submission_service
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=SubmissionOut, status_code=201)
def handle_create_submission(
    name: str = Form(...),
    email: str = Form(...),
    mobile: str = Form(...),
    emirates_id: str = Form(...),
    emirate: str = Form(...),
    receipt: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    submission_in = SubmissionCreate(
        name=name, email=email, mobile=mobile, emirates_id=emirates_id, emirate=emirate
    )

    if settings.ENFORCE_UNIQUE_EMAIL and submission_service.get_submission_by_email(db, email=submission_in.email):
        raise HTTPException(status_code=400, detail="A submission with this email already exists.")
    if settings.ENFORCE_UNIQUE_MOBILE and submission_service.get_submission_by_mobile(db, mobile=submission_in.mobile):
        raise HTTPException(status_code=400, detail="A submission with this mobile number already exists.")

    receipt_url, receipt_hash = submission_service.save_receipt_file(receipt)

    db_submission = submission_service.create_submission(
        db=db,
        submission=submission_in,
        receipt_url=receipt_url,
        receipt_hash=receipt_hash,
    )

    # With model_config.from_attributes=True on SubmissionOut,
    # FastAPI + Pydantic v2 will serialize the ORM object automatically.
    return db_submission


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