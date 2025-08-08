from sqlalchemy.orm import Session
from ..db.models.admin import Admin, AdminRole
from ..db.schemas.admin import AdminCreate
from ..core.config import settings

def get_admin_by_email(db: Session, email: str) -> Admin | None:
    """Fetches an admin by their email address."""
    return db.query(Admin).filter(Admin.email == email).first()

def create_admin(db: Session, admin: AdminCreate) -> Admin:
    """Creates a new admin in the database."""
    db_admin = Admin(email=admin.email, role=admin.role)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def create_global_admin_if_not_exists(db: Session):
    """
    A utility function to ensure the global admin exists on startup.
    This should be called when your application starts.
    """
    global_admin = get_admin_by_email(db, email=settings.GLOBAL_ADMIN_EMAIL)
    if not global_admin:
        print(f"Global admin {settings.GLOBAL_ADMIN_EMAIL} not found, creating...")
        admin_in = AdminCreate(
            email=settings.GLOBAL_ADMIN_EMAIL,
            role=AdminRole.GLOBAL_ADMIN
        )
        create_admin(db, admin_in)
        print("Global admin created successfully.")