from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, field_serializer


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ContractSummary(BaseModel):
    id: int
    task_id: str
    filename: str
    status: str
    risk_level: Optional[str] = None
    risk_score: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

    @field_serializer("created_at")
    def serialize_created_at(self, value: datetime) -> str:
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.isoformat()


class ContractDetail(ContractSummary):
    error: Optional[str] = None
    result: Optional[Any] = None
