from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.application import ApplicationStatus


class ApplicationCreate(BaseModel):
    job_offer_id: int = Field(gt=0)
    cover_letter: str | None = Field(
        default=None,
        max_length=5000,
    )


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    admin_note: str | None = Field(
        default=None,
        max_length=5000,
    )


class ApplicationOfferSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    company_name: str
    location: str | None = None


class ApplicationCandidateSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    email: str | None = None
    candidate_type: str | None = None
    profile_status: str | None = None


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_offer_id: int
    candidate_profile_id: int
    status: ApplicationStatus
    cover_letter: str | None = None
    cv_file_name: str | None = None
    admin_note: str | None = None
    applied_at: datetime
    reviewed_at: datetime | None = None
    updated_at: datetime

    offer: ApplicationOfferSummary | None = None
    candidate: ApplicationCandidateSummary | None = None
    allowed_statuses: list[ApplicationStatus] = Field(default_factory=list)


class ApplicationListResponse(BaseModel):
    items: list[ApplicationResponse]
    total: int
    page: int
    page_size: int
    pages: int
