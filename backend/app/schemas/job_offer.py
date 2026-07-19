from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.models.company import PartnershipStatus
from app.models.job_offer import (
    JobOfferSource,
    JobOfferStatus,
    JobOfferTarget,
    JobOfferType,
    WorkMode,
)


def normalize_skills(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for raw_value in values:
        value = raw_value.strip()
        key = value.casefold()
        if value and key not in seen:
            seen.add(key)
            result.append(value)
    return result


class JobOfferBase(BaseModel):
    title: str = Field(min_length=2, max_length=255)
    company_id: int | None = Field(default=None, gt=0)
    company_name: str | None = Field(default=None, min_length=2, max_length=255)
    sector: str | None = Field(default=None, max_length=150)
    description: str = Field(min_length=10, max_length=20000)
    requirements: str | None = Field(default=None, max_length=10000)
    skills_required: str | None = Field(default=None, max_length=5000)
    required_skills: list[str] = Field(default_factory=list, max_length=100)
    preferred_skills: list[str] = Field(default_factory=list, max_length=100)
    location: str | None = Field(default=None, max_length=255)
    contract_type: str | None = Field(default=None, max_length=100)
    experience_required: int | None = Field(default=None, ge=0, le=60)
    education_level: str | None = Field(default=None, max_length=150)
    offer_type: JobOfferType = JobOfferType.EMPLOYMENT
    target_audience: JobOfferTarget = JobOfferTarget.BOTH
    work_mode: WorkMode = WorkMode.ONSITE
    number_of_positions: int = Field(default=1, ge=1, le=1000)
    source: JobOfferSource = JobOfferSource.CMC
    status: JobOfferStatus = JobOfferStatus.DRAFT
    external_url: str | None = Field(default=None, max_length=1000)
    is_remote: bool = False
    application_deadline: date | None = None

    @field_validator("required_skills", "preferred_skills")
    @classmethod
    def clean_skills(cls, value: list[str]) -> list[str]:
        return normalize_skills(value)

    @model_validator(mode="after")
    def validate_company(self) -> "JobOfferBase":
        if self.company_id is None and not self.company_name:
            raise ValueError("Une entreprise partenaire ou un nom d'entreprise est obligatoire.")
        return self


class JobOfferCreate(JobOfferBase):
    pass


class JobOfferUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=255)
    company_id: int | None = Field(default=None, gt=0)
    company_name: str | None = Field(default=None, min_length=2, max_length=255)
    sector: str | None = Field(default=None, max_length=150)
    description: str | None = Field(default=None, min_length=10, max_length=20000)
    requirements: str | None = Field(default=None, max_length=10000)
    skills_required: str | None = Field(default=None, max_length=5000)
    required_skills: list[str] | None = Field(default=None, max_length=100)
    preferred_skills: list[str] | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=255)
    contract_type: str | None = Field(default=None, max_length=100)
    experience_required: int | None = Field(default=None, ge=0, le=60)
    education_level: str | None = Field(default=None, max_length=150)
    offer_type: JobOfferType | None = None
    target_audience: JobOfferTarget | None = None
    work_mode: WorkMode | None = None
    number_of_positions: int | None = Field(default=None, ge=1, le=1000)
    source: JobOfferSource | None = None
    status: JobOfferStatus | None = None
    external_url: str | None = Field(default=None, max_length=1000)
    is_remote: bool | None = None
    application_deadline: date | None = None

    @field_validator("required_skills", "preferred_skills")
    @classmethod
    def clean_optional_skills(cls, value: list[str] | None) -> list[str] | None:
        return normalize_skills(value) if value is not None else None


class OfferCompanySummary(BaseModel):
    id: int
    name: str
    sector: str
    city: str
    status: PartnershipStatus

    model_config = ConfigDict(from_attributes=True)


class JobOfferRead(JobOfferBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_name: str
    company: OfferCompanySummary | None = None
    created_by_user_id: int | None = None
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    application_count: int = 0
    has_applied: bool = False


class JobOfferListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    company_id: int | None = None
    company_name: str
    sector: str | None = None
    description: str
    requirements: str | None = None
    skills_required: str | None = None
    location: str | None = None
    contract_type: str | None = None
    education_level: str | None = None
    offer_type: JobOfferType
    target_audience: JobOfferTarget
    work_mode: WorkMode
    number_of_positions: int
    required_skills: list[str]
    preferred_skills: list[str]
    source: JobOfferSource
    status: JobOfferStatus
    is_remote: bool
    external_url: str | None = None
    application_deadline: date | None = None
    published_at: datetime | None = None
    created_at: datetime
    application_count: int = 0
    has_applied: bool = False


class JobOfferListResponse(BaseModel):
    items: list[JobOfferListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


JobOfferResponse = JobOfferRead
