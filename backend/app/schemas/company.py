from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.company import PartnershipStatus


class CompanyBase(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    sector: str = Field(min_length=2, max_length=150)
    city: str = Field(min_length=2, max_length=150)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=30)
    contact_name: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=1000)
    description: str | None = Field(default=None, max_length=5000)
    status: PartnershipStatus = PartnershipStatus.PENDING


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=255)
    sector: str | None = Field(default=None, min_length=2, max_length=150)
    city: str | None = Field(default=None, min_length=2, max_length=150)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=30)
    contact_name: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=1000)
    description: str | None = Field(default=None, max_length=5000)
    status: PartnershipStatus | None = None


class CompanyResponse(CompanyBase):
    id: int
    active_offer_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CompanyListResponse(BaseModel):
    items: list[CompanyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
