"""complete candidate profiles, companies and job offers

Revision ID: b72e3d9a4f10
Revises: ed0ee79c464f
Create Date: 2026-07-19 01:00:00
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "b72e3d9a4f10"
down_revision: Union[str, Sequence[str], None] = "ed0ee79c464f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    partnership_status = postgresql.ENUM(
        "PENDING", "ACTIVE", "INACTIVE", name="partnership_status_enum", create_type=False
    )
    partnership_status.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "companies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("sector", sa.String(150), nullable=False),
        sa.Column("city", sa.String(150), nullable=False),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(30), nullable=True),
        sa.Column("contact_name", sa.String(255), nullable=True),
        sa.Column("website", sa.String(1000), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", partnership_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_companies_id", "companies", ["id"])
    op.create_index("ix_companies_name", "companies", ["name"], unique=True)
    op.create_index("ix_companies_sector", "companies", ["sector"])
    op.create_index("ix_companies_city", "companies", ["city"])
    op.create_index("ix_companies_status", "companies", ["status"])

    op.execute("ALTER TYPE job_offer_type_enum ADD VALUE IF NOT EXISTS 'PFE'")
    target_enum = postgresql.ENUM(
        "STAGIAIRE", "LAUREAT", "BOTH", name="job_offer_target_enum", create_type=False
    )
    work_mode_enum = postgresql.ENUM(
        "ONSITE", "REMOTE", "HYBRID", name="job_offer_work_mode_enum", create_type=False
    )
    target_enum.create(op.get_bind(), checkfirst=True)
    work_mode_enum.create(op.get_bind(), checkfirst=True)
    op.add_column("job_offers", sa.Column("company_id", sa.Integer(), nullable=True))
    op.add_column("job_offers", sa.Column("sector", sa.String(150), nullable=True))
    op.add_column(
        "job_offers",
        sa.Column(
            "required_skills",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'[]'::jsonb"),
            nullable=False,
        ),
    )
    op.add_column(
        "job_offers",
        sa.Column(
            "preferred_skills",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'[]'::jsonb"),
            nullable=False,
        ),
    )
    op.add_column(
        "job_offers",
        sa.Column("target_audience", target_enum, server_default="BOTH", nullable=False),
    )
    op.add_column(
        "job_offers",
        sa.Column("work_mode", work_mode_enum, server_default="ONSITE", nullable=False),
    )
    op.add_column(
        "job_offers",
        sa.Column("number_of_positions", sa.Integer(), server_default="1", nullable=False),
    )
    op.create_foreign_key(
        "fk_job_offers_company_id", "job_offers", "companies", ["company_id"], ["id"], ondelete="SET NULL"
    )
    for column in ("company_id", "sector", "target_audience", "work_mode"):
        op.create_index(f"ix_job_offers_{column}", "job_offers", [column])

    op.create_table(
        "candidate_educations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("institution", sa.String(255), nullable=False),
        sa.Column("program_name", sa.String(255), nullable=False),
        sa.Column("level", sa.String(100), nullable=False),
        sa.Column("training_year", sa.String(50)),
        sa.Column("expected_graduation_year", sa.String(20)),
        sa.Column("graduation_year", sa.String(20)),
        sa.Column("grade", sa.String(50)),
        sa.Column("ranking", sa.String(50)),
        sa.Column("distinction", sa.String(100)),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_candidate_educations_id", "candidate_educations", ["id"])
    op.create_index("ix_candidate_educations_candidate_profile_id", "candidate_educations", ["candidate_profile_id"], unique=True)

    op.create_table(
        "candidate_skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("level", sa.String(50)),
        sa.Column("category", sa.String(100)),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("candidate_profile_id", "name", name="uq_candidate_skill_name"),
    )
    op.create_index("ix_candidate_skills_id", "candidate_skills", ["id"])
    op.create_index("ix_candidate_skills_candidate_profile_id", "candidate_skills", ["candidate_profile_id"])
    op.create_index("ix_candidate_skills_name", "candidate_skills", ["name"])

    op.create_table(
        "candidate_languages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("language", sa.String(100), nullable=False),
        sa.Column("level", sa.String(20)),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("candidate_profile_id", "language", name="uq_candidate_language"),
    )
    op.create_index("ix_candidate_languages_id", "candidate_languages", ["id"])
    op.create_index("ix_candidate_languages_candidate_profile_id", "candidate_languages", ["candidate_profile_id"])

    op.create_table(
        "candidate_soft_skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(150), nullable=False),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("candidate_profile_id", "name", name="uq_candidate_soft_skill"),
    )
    op.create_index("ix_candidate_soft_skills_id", "candidate_soft_skills", ["id"])
    op.create_index("ix_candidate_soft_skills_candidate_profile_id", "candidate_soft_skills", ["candidate_profile_id"])

    op.create_table(
        "candidate_experiences",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("organization", sa.String(255)),
        sa.Column("experience_type", sa.String(100)),
        sa.Column("start_date", sa.String(20)),
        sa.Column("end_date", sa.String(20)),
        sa.Column("description", sa.Text()),
        sa.Column("acquired_skills", sa.Text()),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_candidate_experiences_id", "candidate_experiences", ["id"])
    op.create_index("ix_candidate_experiences_candidate_profile_id", "candidate_experiences", ["candidate_profile_id"])

    op.create_table(
        "candidate_projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("technologies", sa.Text()),
        sa.Column("github_url", sa.String(1000)),
        sa.Column("demo_url", sa.String(1000)),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_candidate_projects_id", "candidate_projects", ["id"])
    op.create_index("ix_candidate_projects_candidate_profile_id", "candidate_projects", ["candidate_profile_id"])

    op.create_table(
        "candidate_certifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("organization", sa.String(255)),
        sa.Column("issued_date", sa.String(20)),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_candidate_certifications_id", "candidate_certifications", ["id"])
    op.create_index("ix_candidate_certifications_candidate_profile_id", "candidate_certifications", ["candidate_profile_id"])

    op.create_table(
        "candidate_preferences",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("current_situation", sa.String(150)),
        sa.Column("opportunity_types", postgresql.JSONB(), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("target_domain", sa.String(255)),
        sa.Column("availability", sa.String(100)),
        sa.Column("availability_date", sa.String(20)),
        sa.Column("desired_duration", sa.String(100)),
        sa.Column("preferred_city", sa.String(150)),
        sa.Column("accepted_regions", sa.Text()),
        sa.Column("geographic_availability", sa.Text()),
        sa.Column("national_mobility", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("international_mobility", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("has_driver_license", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("has_vehicle", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("sector", sa.String(150)),
        sa.Column("target_job", sa.String(255)),
        sa.Column("expected_salary", sa.String(100)),
        sa.Column("work_mode", sa.String(50)),
        sa.Column("interests", postgresql.JSONB(), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("presentation", sa.Text()),
        sa.Column("motivation", sa.Text()),
        sa.Column("differentiator", sa.Text()),
        sa.Column("consent_sharing", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("consent_privacy", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("consent_accuracy", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_candidate_preferences_id", "candidate_preferences", ["id"])
    op.create_index("ix_candidate_preferences_candidate_profile_id", "candidate_preferences", ["candidate_profile_id"], unique=True)

    op.create_table(
        "candidate_documents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("candidate_profile_id", sa.Integer(), nullable=False),
        sa.Column("document_type", sa.String(80), nullable=False),
        sa.Column("original_filename", sa.String(255), nullable=False),
        sa.Column("stored_filename", sa.String(255), nullable=False),
        sa.Column("file_path", sa.String(500), nullable=False),
        sa.Column("mime_type", sa.String(100), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["candidate_profile_id"], ["candidate_profiles.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("candidate_profile_id", "document_type", name="uq_candidate_document_type"),
    )
    op.create_index("ix_candidate_documents_id", "candidate_documents", ["id"])
    op.create_index("ix_candidate_documents_candidate_profile_id", "candidate_documents", ["candidate_profile_id"])
    op.create_index("ix_candidate_documents_document_type", "candidate_documents", ["document_type"])


def downgrade() -> None:
    for table in (
        "candidate_documents",
        "candidate_preferences",
        "candidate_certifications",
        "candidate_projects",
        "candidate_experiences",
        "candidate_soft_skills",
        "candidate_languages",
        "candidate_skills",
        "candidate_educations",
    ):
        op.drop_table(table)
    for column in ("work_mode", "target_audience", "sector", "company_id"):
        op.drop_index(f"ix_job_offers_{column}", table_name="job_offers")
    op.drop_constraint("fk_job_offers_company_id", "job_offers", type_="foreignkey")
    for column in (
        "number_of_positions",
        "work_mode",
        "target_audience",
        "preferred_skills",
        "required_skills",
        "sector",
        "company_id",
    ):
        op.drop_column("job_offers", column)
    op.drop_table("companies")
    postgresql.ENUM(name="job_offer_work_mode_enum").drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name="job_offer_target_enum").drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name="partnership_status_enum").drop(op.get_bind(), checkfirst=True)
