from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CandidateEducation(Base):
    __tablename__ = "candidate_educations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    institution: Mapped[str] = mapped_column(String(255), default="CMC Nador", nullable=False)
    program_name: Mapped[str] = mapped_column(String(255), nullable=False)
    level: Mapped[str] = mapped_column(String(100), nullable=False)
    training_year: Mapped[str | None] = mapped_column(String(50))
    expected_graduation_year: Mapped[str | None] = mapped_column(String(20))
    graduation_year: Mapped[str | None] = mapped_column(String(20))
    grade: Mapped[str | None] = mapped_column(String(50))
    ranking: Mapped[str | None] = mapped_column(String(50))
    distinction: Mapped[str | None] = mapped_column(String(100))

    candidate_profile = relationship("CandidateProfile", back_populates="education")


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"
    __table_args__ = (
        UniqueConstraint("candidate_profile_id", "name", name="uq_candidate_skill_name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    level: Mapped[str | None] = mapped_column(String(50))
    category: Mapped[str | None] = mapped_column(String(100))

    candidate_profile = relationship("CandidateProfile", back_populates="skills")


class CandidateLanguage(Base):
    __tablename__ = "candidate_languages"
    __table_args__ = (
        UniqueConstraint("candidate_profile_id", "language", name="uq_candidate_language"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    language: Mapped[str] = mapped_column(String(100), nullable=False)
    level: Mapped[str | None] = mapped_column(String(20))

    candidate_profile = relationship("CandidateProfile", back_populates="languages")


class CandidateSoftSkill(Base):
    __tablename__ = "candidate_soft_skills"
    __table_args__ = (
        UniqueConstraint("candidate_profile_id", "name", name="uq_candidate_soft_skill"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)

    candidate_profile = relationship("CandidateProfile", back_populates="soft_skills")


class CandidateExperience(Base):
    __tablename__ = "candidate_experiences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    organization: Mapped[str | None] = mapped_column(String(255))
    experience_type: Mapped[str | None] = mapped_column(String(100))
    start_date: Mapped[str | None] = mapped_column(String(20))
    end_date: Mapped[str | None] = mapped_column(String(20))
    description: Mapped[str | None] = mapped_column(Text)
    acquired_skills: Mapped[str | None] = mapped_column(Text)

    candidate_profile = relationship("CandidateProfile", back_populates="experiences")


class CandidateProject(Base):
    __tablename__ = "candidate_projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    technologies: Mapped[str | None] = mapped_column(Text)
    github_url: Mapped[str | None] = mapped_column(String(1000))
    demo_url: Mapped[str | None] = mapped_column(String(1000))

    candidate_profile = relationship("CandidateProfile", back_populates="projects")


class CandidateCertification(Base):
    __tablename__ = "candidate_certifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    organization: Mapped[str | None] = mapped_column(String(255))
    issued_date: Mapped[str | None] = mapped_column(String(20))

    candidate_profile = relationship("CandidateProfile", back_populates="certifications")


class CandidatePreference(Base):
    __tablename__ = "candidate_preferences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    current_situation: Mapped[str | None] = mapped_column(String(150))
    opportunity_types: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    target_domain: Mapped[str | None] = mapped_column(String(255))
    availability: Mapped[str | None] = mapped_column(String(100))
    availability_date: Mapped[str | None] = mapped_column(String(20))
    desired_duration: Mapped[str | None] = mapped_column(String(100))
    preferred_city: Mapped[str | None] = mapped_column(String(150))
    accepted_regions: Mapped[str | None] = mapped_column(Text)
    geographic_availability: Mapped[str | None] = mapped_column(Text)
    national_mobility: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    international_mobility: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    has_driver_license: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    has_vehicle: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sector: Mapped[str | None] = mapped_column(String(150))
    target_job: Mapped[str | None] = mapped_column(String(255))
    expected_salary: Mapped[str | None] = mapped_column(String(100))
    work_mode: Mapped[str | None] = mapped_column(String(50))
    interests: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    presentation: Mapped[str | None] = mapped_column(Text)
    motivation: Mapped[str | None] = mapped_column(Text)
    differentiator: Mapped[str | None] = mapped_column(Text)
    consent_sharing: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    consent_privacy: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    consent_accuracy: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    candidate_profile = relationship("CandidateProfile", back_populates="preference")


class CandidateDocument(Base):
    __tablename__ = "candidate_documents"
    __table_args__ = (
        UniqueConstraint(
            "candidate_profile_id", "document_type", name="uq_candidate_document_type"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    candidate_profile_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    document_type: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    candidate_profile = relationship("CandidateProfile", back_populates="documents")
