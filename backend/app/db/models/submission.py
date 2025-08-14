from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy_utils import EncryptedType
from ..base import Base 
from ...core.config import settings

encryption_key = settings.SECRET_KEY

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    
    name = Column(EncryptedType(String, encryption_key), nullable=False)
    email = Column(EncryptedType(String, encryption_key), index=True, nullable=False)
    mobile = Column(EncryptedType(String, encryption_key), index=True, nullable=False)
    emirates_id = Column(EncryptedType(String, encryption_key), nullable=False)
    emirate = Column(String, index=True, nullable=False)
    
    receipt_url = Column(String, nullable=False)
    receipt_hash = Column(String, index=True, nullable=True) 
    
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
