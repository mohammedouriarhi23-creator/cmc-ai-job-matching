from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CandidateType(str, Enum):
    STAGIAIRE = "STAGIAIRE"
    LAUREAT = "LAUREAT"


class ProfileStatus(str, Enum):
    NEW = "NEW"
    CV_PROCESSING = "CV_PROCESSING"
    CV_PENDING_CONFIRMATION = "CV_PENDING_CONFIRMATION"
    INCOMPLETE = "INCOMPLETE"
    COMPLETED = "COMPLETED"


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
        index=True,
    )

    candidate_type: Mapped[CandidateType] = mapped_column(
        SqlEnum(
            CandidateType,
            name="candidate_type",
        ),
        nullable=False,
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    profile_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    profile_status: Mapped[ProfileStatus] = mapped_column(
        SqlEnum(
            ProfileStatus,
            name="profile_status",
        ),
        default=ProfileStatus.NEW,
        nullable=False,
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

    user: Mapped["User"] = relationship(
        back_populates="candidate_profile",
    )

    cv_extractions: Mapped[list["CvExtraction"]] = relationship(
        back_populates="candidate",
        cascade="all, delete-orphan",
    )
    complete_profile_data: Mapped["CandidateProfileData | None"] = relationship(
        back_populates="candidate_profile",
        uselist=False,
        cascade="all, delete-orphan",
    )
    applications = relationship(
        "Application",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    education = relationship(
        "CandidateEducation",
        back_populates="candidate_profile",
        uselist=False,
        cascade="all, delete-orphan",
    )
    skills = relationship(
        "CandidateSkill",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    languages = relationship(
        "CandidateLanguage",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    soft_skills = relationship(
        "CandidateSoftSkill",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    experiences = relationship(
        "CandidateExperience",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    projects = relationship(
        "CandidateProject",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    certifications = relationship(
        "CandidateCertification",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    preference = relationship(
        "CandidatePreference",
        back_populates="candidate_profile",
        uselist=False,
        cascade="all, delete-orphan",
    )
    documents = relationship(
        "CandidateDocument",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
