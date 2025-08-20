from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db.models.submission import Submission
from ..db.schemas.submission import SubmissionCreate
from typing import List, Tuple, Optional
from pathlib import Path
from fastapi import UploadFile, HTTPException
import hashlib, os, uuid, secrets, re

# IMPORTANT: this path must be the SAME directory we mount as a Docker volume
UPLOAD_DIRECTORY = os.getenv("UPLOAD_DIRECTORY", "/app/uploads")
_slug_re = re.compile(r"[^A-Za-z0-9_.-]+")

def _slugify(name: str) -> str:
    name = os.path.basename(name or "")
    name = _slug_re.sub("_", name).strip("._-")
    return name[:40] or "file"

def save_receipt_file(file: UploadFile) -> tuple[str, str]:
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

    # Read file content and hash
    file_content = file.file.read()
    file_hash = hashlib.sha256(file_content).hexdigest()

    # Safe name
    base, ext = os.path.splitext(file.filename or "")
    slug = _slugify(base)
    ext = (ext or "").lower()
    safe_name = f"{file_hash[:8]}-{slug}{ext}"

    # Save file
    file_path = os.path.join(UPLOAD_DIRECTORY, safe_name)
    with open(file_path, "wb") as out:
        out.write(file_content)

    # Return URL path for API
    return f"/uploads/{safe_name}", file_hash

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
        receipt_hash=receipt_hash
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_submissions(db: Session, skip: int = 0, limit: int = 100) -> List[Submission]:
    return db.query(Submission).offset(skip).limit(limit).all()

def get_all_submission_names(db: Session) -> List[str]:
    return [name for (name,) in db.query(Submission.name).all()]

ALLOWED_SORTS = {
    "name": Submission.name,
    "email": Submission.email,
    "mobile": Submission.mobile,
    "emirate": Submission.emirate,
    "submitted_at": Submission.submitted_at,
    "id": Submission.id,
}

def list_submissions(db, *, skip=0, limit=50, sort_by="submitted_at", order="desc"):
    col = ALLOWED_SORTS.get(sort_by, Submission.id)
    col = col.desc() if order.lower() == "desc" else col.asc()

    total = db.query(func.count(Submission.id)).scalar()
    items = (
        db.query(Submission)
        .order_by(col)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total

def delete_submissions_by_ids(db, ids: list[int]) -> int:
    q = db.query(Submission).filter(Submission.id.in_(ids))
    count = q.count()
    q.delete(synchronize_session=False)
    db.commit()
    return count