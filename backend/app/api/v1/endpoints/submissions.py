# app/api/v1/endpoints/submissions.py
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Literal

from ....db.session import get_db
from ....db.models.admin import Admin
from ....db.models.submission import Submission as SubmissionModel
from ....db.schemas.submission import SubmissionCreate, SubmissionOut
from ....services import submission_service
from ...dependencies import get_current_admin
from ....core.config import settings

from pydantic import BaseModel

router = APIRouter()

# ---------- Create (unchanged) ----------
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
    return db_submission


# ---------- List with pagination + sorting ----------
class SubmissionsPage(BaseModel):
    items: List[SubmissionOut]
    total: int

# Whitelist of sortable columns (avoid SQL injection)
SORT_COLUMNS = {
    "id": SubmissionModel.id,
    "name": SubmissionModel.name,
    "email": SubmissionModel.email,
    "mobile": SubmissionModel.mobile,
    "emirate": SubmissionModel.emirate,
    # Adjust this to your actual timestamp column name:
    # If your ORM field is 'created_at' or 'submitted_at', point to it here.
    "submitted_at": getattr(SubmissionModel, "created_at", SubmissionModel.id),
}

@router.get("/", response_model=SubmissionsPage)
def handle_get_all_submissions(
    skip: int = 0,
    limit: int = 100,
    sort_by: Literal["id","name","email","mobile","emirate","submitted_at"] = "submitted_at",
    order: Literal["asc","desc"] = "desc",
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """
    Protected endpoint for admins to retrieve submissions with pagination & sorting.
    Returns a page object: { items: [...], total: N }.
    """
    # total count
    total = db.query(func.count(SubmissionModel.id)).scalar() or 0

    # sort
    col = SORT_COLUMNS.get(sort_by, SORT_COLUMNS["id"])
    col = col.desc() if order.lower() == "desc" else col.asc()

    # page
    rows = (
        db.query(SubmissionModel)
        .order_by(col)
        .offset(skip)
        .limit(limit)
        .all()
    )
    # Pydantic v2 will map ORM -> schema because model_config.from_attributes=True in your schema
    return {"items": rows, "total": total}


# ---------- Bulk delete ----------
class IdsBody(BaseModel):
    ids: List[int]

@router.delete("/", response_model=dict)
def handle_bulk_delete(
    payload: IdsBody = Body(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    if not payload.ids:
        raise HTTPException(status_code=400, detail="No IDs provided.")
    q = db.query(SubmissionModel).filter(SubmissionModel.id.in_(payload.ids))
    count = q.count()
    if count == 0:
        return {"deleted": 0}
    q.delete(synchronize_session=False)
    db.commit()
    return {"deleted": count}


# ---------- Delete single ----------
@router.delete("/{submission_id}", response_model=dict)
def handle_delete_one(
    submission_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    q = db.query(SubmissionModel).filter(SubmissionModel.id == submission_id)
    if not db.query(q.exists()).scalar():
        raise HTTPException(status_code=404, detail="Submission not found")
    q.delete(synchronize_session=False)
    db.commit()
    return {"deleted": 1}