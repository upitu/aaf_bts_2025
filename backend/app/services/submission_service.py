from sqlalchemy.orm import Session
from ..db.models.submission import Submission
from ..db.schemas.submission import SubmissionCreate
from typing import List
import hashlib
import os
from fastapi import UploadFile

# --- File Handling ---
UPLOAD_DIRECTORY = "./uploads"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

def save_receipt_file(file: UploadFile) -> (str, str):
    """
    Saves the uploaded file and calculates its hash for duplicate checking.
    Returns the file path and the file hash.
    """
    # Generate a secure filename to avoid conflicts
    file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
    
    # Read file content
    file_content = file.file.read()
    
    # Calculate SHA-256 hash of the file content
    file_hash = hashlib.sha256(file_content).hexdigest()
    
    # Save the file
    with open(file_location, "wb+") as file_object:
        file_object.write(file_content)
        
    receipt_url = file_location
    
    return receipt_url, file_hash

# --- Database Services ---

def get_submission_by_email(db: Session, email: str) -> Submission | None:
    """Fetches a submission by email."""
    return db.query(Submission).filter(Submission.email == email).first()

def get_submission_by_mobile(db: Session, mobile: str) -> Submission | None:
    """Fetches a submission by mobile number."""
    return db.query(Submission).filter(Submission.mobile == mobile).first()

def create_submission(db: Session, submission: SubmissionCreate, receipt_url: str, receipt_hash: str) -> Submission:
    """Creates a new user submission in the database with all fields."""
    db_submission = Submission(
        name=submission.name,
        email=submission.email,
        mobile=submission.mobile,
        emirates_id=submission.emirates_id,
        emirate=submission.emirate,
        receipt_url=receipt_url,
        receipt_hash=receipt_hash
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_submissions(db: Session, skip: int = 0, limit: int = 100) -> List[Submission]:
    """Retrieves a list of all submissions for the admin dashboard."""
    return db.query(Submission).offset(skip).limit(limit).all()

def get_all_submission_names(db: Session) -> List[str]:
    """
    Efficiently retrieves only the names of all submissions.
    """
    # .scalars() ensures we get a list of strings, not a list of tuples
    return db.query(Submission.name).scalars().all()