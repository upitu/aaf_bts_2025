from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy_utils import EncryptedType
from ..db.base import Base
from ..core.config import settings

encryption_key = settings.SECRET_KEY

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    
    first_name = Column(EncryptedType(String, encryption_key), nullable=False)
    last_name = Column(EncryptedType(String, encryption_key), nullable=False)
    email = Column(EncryptedType(String, encryption_key), unique=True, index=True, nullable=False)
    
    emirate = Column(String, index=True, nullable=False)
    
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
