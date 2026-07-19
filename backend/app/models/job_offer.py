from __future__ import annotations

import enum
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.core.database import Base


class JobOfferType(str, enum.Enum):
    INTERNSHIP = "INTERNSHIP"
    PFE = "PFE"
    EMPLOYMENT = "EMPLOYMENT"


class JobOfferSource(str, enum.Enum):
    CMC = "CMC"
    SCRAPING = "SCRAPING"


class JobOfferStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"


class JobOfferTarget(str, enum.Enum):
    STAGIAIRE = "STAGIAIRE"
    LAUREAT = "LAUREAT"
    BOTH = "BOTH"


class WorkMode(str, enum.Enum):
    ONSITE = "ONSITE"
    REMOTE = "REMOTE"
    HYBRID = "HYBRID"


class JobOffer(Base):
    __tablename__ = "job_offers"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    company_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    company_id: Mapped[int | None] = mapped_column(
        ForeignKey("companies.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    sector: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    requirements: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    skills_required: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    required_skills: Mapped[list[str]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    preferred_skills: Mapped[list[str]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )

    contract_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    experience_required: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    education_level: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    target_audience: Mapped[JobOfferTarget] = mapped_column(
        Enum(JobOfferTarget, name="job_offer_target_enum"),
        nullable=False,
        default=JobOfferTarget.BOTH,
        index=True,
    )

    work_mode: Mapped[WorkMode] = mapped_column(
        Enum(WorkMode, name="job_offer_work_mode_enum"),
        nullable=False,
        default=WorkMode.ONSITE,
        index=True,
    )

    number_of_positions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    offer_type: Mapped[JobOfferType] = mapped_column(
        Enum(
            JobOfferType,
            name="job_offer_type_enum",
        ),
        nullable=False,
        default=JobOfferType.EMPLOYMENT,
        index=True,
    )

    source: Mapped[JobOfferSource] = mapped_column(
        Enum(
            JobOfferSource,
            name="job_offer_source_enum",
        ),
        nullable=False,
        default=JobOfferSource.CMC,
        index=True,
    )

    status: Mapped[JobOfferStatus] = mapped_column(
        Enum(
            JobOfferStatus,
            name="job_offer_status_enum",
        ),
        nullable=False,
        default=JobOfferStatus.DRAFT,
        index=True,
    )

    external_url: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    is_remote: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    application_deadline: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    created_by_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    applications = relationship(
        "Application",
        back_populates="job_offer",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    company = relationship(
        "Company",
        back_populates="job_offers",
    )
