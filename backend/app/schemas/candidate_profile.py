from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class CandidateProfileDataSave(BaseModel):
    cv_file_name: str | None = Field(
        default=None,
        max_length=255,
    )

    profile_data: dict[str, Any]


class CandidateProfileDataResponse(BaseModel):
    id: int
    candidate_profile_id: int
    cv_file_name: str | None
    profile_data: dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )