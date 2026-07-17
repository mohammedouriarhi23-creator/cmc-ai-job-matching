from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.candidate import ProfileStatus
from app.models.candidate_profile_data import CandidateProfileData
from app.models.user import User
from app.routers.dependencies import require_candidate
from app.schemas.candidate_profile import (
    CandidateProfileDataResponse,
    CandidateProfileDataSave,
)


router = APIRouter(
    prefix="/candidate/profile",
    tags=["Candidate profile"],
)


def get_candidate_profile_or_404(
    current_user: User,
):
    profile = current_user.candidate_profile

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil candidat introuvable.",
        )

    return profile


@router.get(
    "",
    response_model=CandidateProfileDataResponse,
)
def get_my_complete_profile(
    current_user: Annotated[
        User,
        Depends(require_candidate),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
) -> CandidateProfileData:
    candidate_profile = get_candidate_profile_or_404(
        current_user
    )

    profile_data = (
        db.query(CandidateProfileData)
        .filter(
            CandidateProfileData.candidate_profile_id
            == candidate_profile.id
        )
        .first()
    )

    if profile_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Le profil complet n'a pas encore été enregistré.",
        )

    return profile_data


@router.put(
    "",
    response_model=CandidateProfileDataResponse,
)
def save_my_complete_profile(
    payload: CandidateProfileDataSave,
    current_user: Annotated[
        User,
        Depends(require_candidate),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
) -> CandidateProfileData:
    candidate_profile = get_candidate_profile_or_404(
        current_user
    )

    stored_profile = (
        db.query(CandidateProfileData)
        .filter(
            CandidateProfileData.candidate_profile_id
            == candidate_profile.id
        )
        .first()
    )

    if stored_profile is None:
        stored_profile = CandidateProfileData(
            candidate_profile_id=candidate_profile.id,
            cv_file_name=payload.cv_file_name,
            profile_data=payload.profile_data,
        )

        db.add(stored_profile)

    else:
        stored_profile.cv_file_name = payload.cv_file_name
        stored_profile.profile_data = payload.profile_data

    candidate_profile.profile_status = ProfileStatus.COMPLETED

    db.commit()
    db.refresh(stored_profile)

    return stored_profile