from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.candidate import CandidateType, ProfileStatus
from app.models.user import UserRole


class CandidateRegister(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    first_name: str = Field(
        min_length=2,
        max_length=100,
    )

    last_name: str = Field(
        min_length=2,
        max_length=100,
    )

    candidate_type: CandidateType

    phone: str | None = Field(
        default=None,
        max_length=30,
    )

    city: str | None = Field(
        default=None,
        max_length=100,
    )


class CandidateProfileResponse(BaseModel):
    id: int
    candidate_type: CandidateType
    first_name: str
    last_name: str
    phone: str | None
    city: str | None
    profile_status: ProfileStatus

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    candidate_profile: CandidateProfileResponse | None = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"