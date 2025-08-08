from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from ..core.config import settings
from ..db import session as db_session
from ..services import admin_service
from ..db.models.admin import Admin, AdminRole

# This tells FastAPI where to look for the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/verify-otp")

def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(db_session.get_db)) -> Admin:
    """
    Decodes the JWT token, verifies the user, and returns the Admin object.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    admin = admin_service.get_admin_by_email(db, email=email)
    if admin is None:
        raise credentials_exception
    return admin

def require_global_admin(current_admin: Admin = Depends(get_current_admin)):
    """
    A dependency that checks if the current user is a GLOBAL_ADMIN.
    """
    if current_admin.role != AdminRole.GLOBAL_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_admin
