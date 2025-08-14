from sqlalchemy.orm import Session
from ..db.models.submission import Submission
from ..db.schemas.submission import SubmissionCreate
from typing import List, Tuple, Optional
import hashlib
import os
import secrets
from pathlib import Path
from fastapi import UploadFile, HTTPException

# --- File Handling ---
UPLOAD_DIRECTORY = Path(os.getenv("UPLOAD_DIR", "./uploads")).resolve()
UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)

# public URL prefix where StaticFiles/Nginx serves the uploads from
PUBLIC_UPLOAD_PREFIX = os.getenv("PUBLIC_UPLOAD_PREFIX", "/uploads")  # e.g. "/uploads"

ALLOWED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}
MAX_BYTES = 10 * 1024 * 1024  # 10 MB

def _secure_ext(filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return ext if ext in ALLOWED_EXTS else ""

def save_receipt_file(file: UploadFile) -> Tuple[str, str]:
    """
    Saves the uploaded file safely and returns (public_url, sha256_hex).
    """
    file.file.seek(0)
    content = file.file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file.")

    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large.")

    ext = _secure_ext(file.filename or "")
    if not ext:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    # Hash for dedupe and stable naming (content-addressed)
    sha256 = hashlib.sha256(content).hexdigest()

    filename = f"{sha256[:16]}-{secrets.token_hex(4)}{ext}"
    disk_path = UPLOAD_DIRECTORY / filename


    with open(disk_path, "wb") as f:
        f.write(content)

    public_url = f"{PUBLIC_UPLOAD_PREFIX}/{filename}"

    return public_url, sha256

# --- Database Services ---

def get_submission_by_email(db: Session, email: str) -> Optional[Submission]:
    return db.query(Submission).filter(Submission.email == email).first()

def get_submission_by_mobile(db: Session, mobile: str) -> Optional[Submission]:
    return db.query(Submission).filter(Submission.mobile == mobile).first()

def create_submission(db: Session, submission: SubmissionCreate, receipt_url: str, receipt_hash: str) -> Submission:
    db_submission = Submission(
        name=submission.name,
        email=submission.email,
        mobile=submission.mobile,
        emirates_id=submission.emirates_id,
        emirate=submission.emirate,
        receipt_url=receipt_url,   
        receipt_hash=receipt_hash,
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_submissions(db: Session, skip: int = 0, limit: int = 100) -> List[Submission]:
    return db.query(Submission).offset(skip).limit(limit).all()

def get_all_submission_names(db: Session) -> List[str]:
    return [name for (name,) in db.query(Submission.name).all()]