"""Populate the normalized candidate tables from legacy JSONB profiles.

This command is safe to run more than once: each profile is synchronized from
its canonical JSONB payload and the detail collections are replaced.
"""

from pydantic import ValidationError
from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.candidate import CandidateProfile
from app.models.candidate_profile_data import CandidateProfileData
from app.routers.candidate_profile import sync_normalized_profile
from app.schemas.candidate_profile import CandidateCompleteProfile


def backfill() -> tuple[int, int]:
    synchronized = 0
    skipped = 0

    with SessionLocal() as db:
        profiles = db.scalars(select(CandidateProfileData).order_by(CandidateProfileData.id)).all()
        for stored_profile in profiles:
            candidate_profile = db.get(CandidateProfile, stored_profile.candidate_profile_id)
            if candidate_profile is None:
                skipped += 1
                continue

            try:
                complete_profile = CandidateCompleteProfile.model_validate(
                    stored_profile.profile_data
                )
            except ValidationError:
                skipped += 1
                continue

            sync_normalized_profile(db, candidate_profile, complete_profile)
            synchronized += 1

        db.commit()

    return synchronized, skipped


if __name__ == "__main__":
    synchronized_count, skipped_count = backfill()
    print(
        "Candidate profile backfill complete: "
        f"synchronized={synchronized_count}, skipped={skipped_count}"
    )
