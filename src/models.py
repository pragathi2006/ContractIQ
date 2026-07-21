from datetime import datetime, timezone

from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text

from src.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    task_id = Column(String, unique=True, index=True, nullable=False)
    filename = Column(String, nullable=False)

    status = Column(String, nullable=False, default="PROCESSING")

    risk_level = Column(String, nullable=True)
    risk_score = Column(Integer, nullable=True)
    error = Column(Text, nullable=True)

    result_json = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
