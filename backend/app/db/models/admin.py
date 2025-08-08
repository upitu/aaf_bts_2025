from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLAlchemyEnum
from ..db.base import Base
import enum

class AdminRole(str, enum.Enum):
    GLOBAL_ADMIN = "global_admin"
    ADMIN = "admin"

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(SQLAlchemyEnum(AdminRole), nullable=False, default=AdminRole.ADMIN)
    is_active = Column(Boolean, default=True)
