from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....services import admin_service
from ....db.schemas.admin import Admin, AdminCreate
from ...dependencies import require_global_admin

router = APIRouter()

@router.post("/", response_model=Admin, status_code=201)
def create_new_admin(
    admin_in: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(require_global_admin)
):
    """
    Create a new admin. This endpoint is protected and only accessible
    by users with the 'global_admin' role.
    """
    # Check if an admin with this email already exists
    existing_admin = admin_service.get_admin_by_email(db, email=admin_in.email)
    if existing_admin:
        raise HTTPException(
            status_code=400,
            detail="An admin with this email already exists.",
        )
    
    return admin_service.create_admin(db=db, admin=admin_in)

# You can add other admin management endpoints here, e.g., for listing or deleting admins.
