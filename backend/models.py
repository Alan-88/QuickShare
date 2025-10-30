from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime

class Paste(Base):
    __tablename__ = "pastes"
    
    id = Column(Integer, primary_key=True, index=True)
    unique_id = Column(String(10), unique=True, index=True, nullable=False)
    encrypted_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expire_hours = Column(Integer, default=0)  # 0 = 永不过期
    max_views = Column(Integer, default=0)    # 0 = 不限次数
    current_views = Column(Integer, default=0)
    password_hash = Column(String(255), nullable=True, default=None)
