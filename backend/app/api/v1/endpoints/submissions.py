from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....db.session import get_db
from ....services import submission_service
from ....db.schemas.submission import Submission, SubmissionCreate
from ...dependencies import get_current_admin
from ....db.models.admin import Admin

router = APIRouter()

@router.post("/", response_model=Submission, status_code=201)
def handle_create_submission(
    submission_in: SubmissionCreate,
    db: Session = Depends(get_db)
):
    """
    Public endpoint to create a new user submission.
    """
    # Check if a submission with this email already exists
    existing_submission = submission_service.get_submission_by_email(db, email=submission_in.email)
    if existing_submission:
        raise HTTPException(
            status_code=400,
            detail="A submission with this email has already been received.",
        )
    
    return submission_service.create_submission(db=db, submission=submission_in)


@router.get("/", response_model=List[Submission])
def handle_get_all_submissions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin) # This protects the endpoint
):
    """
    Protected endpoint for admins to retrieve all user submissions.
    """
    submissions = submission_service.get_submissions(db, skip=skip, limit=limit)
    return submissions
