import math
from datetime import date, datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.application import Application, ApplicationStatus
from app.models.candidate import CandidateProfile, CandidateType, ProfileStatus
from app.models.candidate_details import CandidateDocument
from app.models.job_offer import JobOffer, JobOfferStatus, JobOfferTarget
from app.models.user import User
from app.routers.candidate_profile import STORAGE_ROOT
from app.routers.dependencies import require_admin, require_candidate
from app.schemas.application import (
    ApplicationCandidateSummary,
    ApplicationCreate,
    ApplicationListResponse,
    ApplicationOfferSummary,
    ApplicationResponse,
    ApplicationStatusUpdate,
)


router = APIRouter(prefix="/applications", tags=["Applications"])

ADMIN_STATUS_TRANSITIONS = {
    ApplicationStatus.SUBMITTED: {
        ApplicationStatus.UNDER_REVIEW,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.REJECTED,
    },
    ApplicationStatus.UNDER_REVIEW: {
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.INTERVIEW,
        ApplicationStatus.REJECTED,
    },
    ApplicationStatus.SHORTLISTED: {
        ApplicationStatus.INTERVIEW,
        ApplicationStatus.ACCEPTED,
        ApplicationStatus.REJECTED,
    },
    ApplicationStatus.INTERVIEW: {
        ApplicationStatus.ACCEPTED,
        ApplicationStatus.REJECTED,
    },
    ApplicationStatus.ACCEPTED: set(),
    ApplicationStatus.REJECTED: set(),
    ApplicationStatus.WITHDRAWN: set(),
}


def get_candidate_profile(db: Session, user_id: int) -> CandidateProfile:
    profile = db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == user_id))
    if profile is None:
        raise HTTPException(404, "Profil candidat introuvable.")
    return profile


def build_application_response(
    application: Application,
    include_admin_note: bool = False,
) -> ApplicationResponse:
    offer_summary = None
    candidate_summary = None
    if application.job_offer is not None:
        offer_summary = ApplicationOfferSummary(
            id=application.job_offer.id,
            title=application.job_offer.title,
            company_name=application.job_offer.company_name,
            location=application.job_offer.location,
        )
    if application.candidate_profile is not None:
        profile = application.candidate_profile
        candidate_summary = ApplicationCandidateSummary(
            id=profile.id,
            first_name=profile.first_name,
            last_name=profile.last_name,
            phone=profile.phone,
            email=profile.user.email if profile.user else None,
            candidate_type=getattr(profile.candidate_type, "value", profile.candidate_type),
            profile_status=getattr(profile.profile_status, "value", profile.profile_status),
        )
    return ApplicationResponse(
        id=application.id,
        job_offer_id=application.job_offer_id,
        candidate_profile_id=application.candidate_profile_id,
        status=application.status,
        cover_letter=application.cover_letter,
        cv_file_name=application.cv_file_name,
        admin_note=application.admin_note if include_admin_note else None,
        applied_at=application.applied_at,
        reviewed_at=application.reviewed_at,
        updated_at=application.updated_at,
        offer=offer_summary,
        candidate=candidate_summary,
        allowed_statuses=sorted(
            ADMIN_STATUS_TRANSITIONS.get(application.status, set()),
            key=lambda item: item.value,
        ),
    )


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_offer(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    candidate_user: User = Depends(require_candidate),
) -> ApplicationResponse:
    profile = get_candidate_profile(db, candidate_user.id)
    if profile.profile_status != ProfileStatus.COMPLETED:
        raise HTTPException(409, "Votre profil doit être complété avant de postuler.")
    has_cv = db.scalar(
        select(CandidateDocument.id).where(
            CandidateDocument.candidate_profile_id == profile.id,
            CandidateDocument.document_type == "cv",
        )
    )
    if has_cv is None:
        raise HTTPException(409, "Ajoutez un CV à votre profil avant de postuler.")
    offer = db.get(JobOffer, payload.job_offer_id)
    if offer is None:
        raise HTTPException(404, "Offre introuvable.")
    if offer.status != JobOfferStatus.PUBLISHED:
        raise HTTPException(400, "Cette offre n'est pas publiée.")
    if offer.application_deadline and offer.application_deadline < date.today():
        raise HTTPException(400, "La date limite de cette offre est dépassée.")

    expected_target = (
        JobOfferTarget.LAUREAT
        if profile.candidate_type == CandidateType.LAUREAT
        else JobOfferTarget.STAGIAIRE
    )
    if offer.target_audience not in {JobOfferTarget.BOTH, expected_target}:
        raise HTTPException(403, "Cette offre ne correspond pas à votre type de profil.")

    application = db.scalar(
        select(Application).where(
            Application.job_offer_id == offer.id,
            Application.candidate_profile_id == profile.id,
        )
    )
    if application is not None and application.status != ApplicationStatus.WITHDRAWN:
        raise HTTPException(409, "Vous avez déjà postulé à cette offre.")

    cv_file_name = (
        profile.complete_profile_data.cv_file_name if profile.complete_profile_data else None
    )
    if application is None:
        application = Application(
            job_offer_id=offer.id,
            candidate_profile_id=profile.id,
            status=ApplicationStatus.SUBMITTED,
            cover_letter=payload.cover_letter,
            cv_file_name=cv_file_name,
        )
        db.add(application)
    else:
        application.status = ApplicationStatus.SUBMITTED
        application.cover_letter = payload.cover_letter
        application.cv_file_name = cv_file_name
        application.admin_note = None
        application.reviewed_by_user_id = None
        application.reviewed_at = None
        application.applied_at = datetime.now(timezone.utc)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Vous avez déjà postulé à cette offre.") from exc
    db.refresh(application)
    return build_application_response(application)


@router.get("/me", response_model=ApplicationListResponse)
def get_my_applications(
    application_status: ApplicationStatus | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    candidate_user: User = Depends(require_candidate),
) -> ApplicationListResponse:
    profile = get_candidate_profile(db, candidate_user.id)
    filters = [Application.candidate_profile_id == profile.id]
    if application_status is not None:
        filters.append(Application.status == application_status)
    total = db.scalar(select(func.count(Application.id)).where(*filters)) or 0
    applications = db.scalars(
        select(Application)
        .where(*filters)
        .order_by(Application.applied_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return ApplicationListResponse(
        items=[build_application_response(item) for item in applications],
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/me/{application_id}", response_model=ApplicationResponse)
def get_my_application(
    application_id: int,
    db: Session = Depends(get_db),
    candidate_user: User = Depends(require_candidate),
) -> ApplicationResponse:
    profile = get_candidate_profile(db, candidate_user.id)
    application = db.scalar(
        select(Application).where(
            Application.id == application_id,
            Application.candidate_profile_id == profile.id,
        )
    )
    if application is None:
        raise HTTPException(404, "Candidature introuvable.")
    return build_application_response(application)


@router.patch("/me/{application_id}/withdraw", response_model=ApplicationResponse)
def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    candidate_user: User = Depends(require_candidate),
) -> ApplicationResponse:
    profile = get_candidate_profile(db, candidate_user.id)
    application = db.scalar(
        select(Application).where(
            Application.id == application_id,
            Application.candidate_profile_id == profile.id,
        )
    )
    if application is None:
        raise HTTPException(404, "Candidature introuvable.")
    if application.status in {
        ApplicationStatus.ACCEPTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
    }:
        raise HTTPException(409, "Cette candidature ne peut plus être retirée.")
    application.status = ApplicationStatus.WITHDRAWN
    db.commit()
    db.refresh(application)
    return build_application_response(application)


@router.get("/admin/all", response_model=ApplicationListResponse)
def get_all_applications_admin(
    application_status: ApplicationStatus | None = Query(default=None, alias="status"),
    offer_id: int | None = Query(default=None, ge=1),
    candidate_type: CandidateType | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ApplicationListResponse:
    statement = select(Application).join(CandidateProfile)
    count_statement = select(func.count(Application.id)).join(CandidateProfile)
    filters = []
    if application_status is not None:
        filters.append(Application.status == application_status)
    if offer_id is not None:
        filters.append(Application.job_offer_id == offer_id)
    if candidate_type is not None:
        filters.append(CandidateProfile.candidate_type == candidate_type)
    if filters:
        statement = statement.where(*filters)
        count_statement = count_statement.where(*filters)
    total = db.scalar(count_statement) or 0
    applications = db.scalars(
        statement
        .order_by(Application.applied_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return ApplicationListResponse(
        items=[build_application_response(item, include_admin_note=True) for item in applications],
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/admin/offers/{offer_id}", response_model=ApplicationListResponse)
def get_offer_applications_admin(
    offer_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ApplicationListResponse:
    if db.get(JobOffer, offer_id) is None:
        raise HTTPException(404, "Offre introuvable.")
    total = db.scalar(
        select(func.count(Application.id)).where(Application.job_offer_id == offer_id)
    ) or 0
    applications = db.scalars(
        select(Application)
        .where(Application.job_offer_id == offer_id)
        .order_by(Application.applied_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return ApplicationListResponse(
        items=[build_application_response(item, include_admin_note=True) for item in applications],
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/admin/{application_id}/cv")
def download_application_cv_admin(
    application_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> FileResponse:
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(404, "Candidature introuvable.")
    document = db.scalar(
        select(CandidateDocument).where(
            CandidateDocument.candidate_profile_id == application.candidate_profile_id,
            CandidateDocument.document_type == "cv",
        )
    )
    if document is None:
        raise HTTPException(404, "Le CV de cette candidature est introuvable.")
    file_path = Path(document.file_path).resolve()
    if STORAGE_ROOT not in file_path.parents or not file_path.is_file():
        raise HTTPException(404, "Le fichier du CV est introuvable.")
    return FileResponse(
        path=file_path,
        media_type=document.mime_type,
        filename=document.original_filename,
    )


@router.patch("/admin/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> ApplicationResponse:
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(404, "Candidature introuvable.")
    if payload.status == ApplicationStatus.WITHDRAWN:
        raise HTTPException(400, "Seul le candidat peut retirer sa candidature.")
    allowed = ADMIN_STATUS_TRANSITIONS.get(application.status, set())
    if payload.status not in allowed:
        raise HTTPException(
            409,
            f"Transition impossible de {application.status.value} vers {payload.status.value}.",
        )
    application.status = payload.status
    application.admin_note = payload.admin_note
    application.reviewed_by_user_id = admin.id
    application.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(application)
    return build_application_response(application, include_admin_note=True)
