import math
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.application import Application, ApplicationStatus
from app.models.candidate import CandidateProfile, CandidateType
from app.models.company import Company, PartnershipStatus
from app.models.job_offer import (
    JobOffer,
    JobOfferSource,
    JobOfferStatus,
    JobOfferTarget,
    JobOfferType,
    WorkMode,
)
from app.models.user import User
from app.routers.dependencies import get_optional_current_user, require_admin
from app.schemas.job_offer import (
    JobOfferCreate,
    JobOfferListResponse,
    JobOfferResponse,
    JobOfferUpdate,
    OfferCompanySummary,
)


router = APIRouter(prefix="/job-offers", tags=["Job offers"])


def build_offer_response(
    offer: JobOffer,
    application_count: int = 0,
    has_applied: bool = False,
) -> JobOfferResponse:
    company = None
    if offer.company is not None:
        company = OfferCompanySummary.model_validate(offer.company)
    return JobOfferResponse(
        id=offer.id,
        title=offer.title,
        company_id=offer.company_id,
        company_name=offer.company_name,
        company=company,
        sector=offer.sector,
        description=offer.description,
        requirements=offer.requirements,
        skills_required=offer.skills_required,
        required_skills=offer.required_skills or [],
        preferred_skills=offer.preferred_skills or [],
        location=offer.location,
        contract_type=offer.contract_type,
        experience_required=offer.experience_required,
        education_level=offer.education_level,
        offer_type=offer.offer_type,
        target_audience=offer.target_audience,
        work_mode=offer.work_mode,
        number_of_positions=offer.number_of_positions,
        source=offer.source,
        status=offer.status,
        external_url=offer.external_url,
        is_remote=offer.is_remote,
        application_deadline=offer.application_deadline,
        created_by_user_id=offer.created_by_user_id,
        published_at=offer.published_at,
        created_at=offer.created_at,
        updated_at=offer.updated_at,
        application_count=application_count,
        has_applied=has_applied,
    )


def get_candidate_profile(db: Session, user_id: int) -> CandidateProfile | None:
    return db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == user_id))


def get_applied_offer_ids(db: Session, candidate_profile_id: int) -> set[int]:
    return set(
        db.scalars(
            select(Application.job_offer_id).where(
                Application.candidate_profile_id == candidate_profile_id,
                Application.status != ApplicationStatus.WITHDRAWN,
            )
        ).all()
    )


def resolve_company(
    db: Session,
    company_id: int | None,
    company_name: str | None,
) -> tuple[Company | None, str]:
    if company_id is None:
        if not company_name:
            raise HTTPException(422, "Le nom de l'entreprise est obligatoire.")
        return None, company_name.strip()
    company = db.get(Company, company_id)
    if company is None:
        raise HTTPException(404, "Entreprise partenaire introuvable.")
    if company.status == PartnershipStatus.INACTIVE:
        raise HTTPException(409, "Cette entreprise partenaire est inactive.")
    return company, company.name


def application_count_for(db: Session, offer_id: int) -> int:
    return db.scalar(
        select(func.count(Application.id)).where(Application.job_offer_id == offer_id)
    ) or 0


@router.get("", response_model=JobOfferListResponse)
def list_published_offers(
    search: str | None = Query(default=None),
    city: str | None = Query(default=None),
    sector: str | None = Query(default=None),
    offer_type: JobOfferType | None = Query(default=None),
    target_audience: JobOfferTarget | None = Query(default=None),
    source: JobOfferSource | None = Query(default=None),
    work_mode: WorkMode | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
) -> JobOfferListResponse:
    filters = [
        JobOffer.status == JobOfferStatus.PUBLISHED,
        or_(
            JobOffer.application_deadline.is_(None),
            JobOffer.application_deadline >= date.today(),
        ),
    ]
    if search:
        pattern = f"%{search.strip()}%"
        filters.append(
            or_(
                JobOffer.title.ilike(pattern),
                JobOffer.company_name.ilike(pattern),
                JobOffer.description.ilike(pattern),
                JobOffer.requirements.ilike(pattern),
                JobOffer.location.ilike(pattern),
                JobOffer.sector.ilike(pattern),
            )
        )
    if city:
        filters.append(JobOffer.location.ilike(f"%{city.strip()}%"))
    if sector:
        filters.append(JobOffer.sector.ilike(f"%{sector.strip()}%"))
    if offer_type:
        filters.append(JobOffer.offer_type == offer_type)
    if target_audience:
        filters.append(
            or_(
                JobOffer.target_audience == target_audience,
                JobOffer.target_audience == JobOfferTarget.BOTH,
            )
        )
    if source:
        filters.append(JobOffer.source == source)
    if work_mode:
        filters.append(JobOffer.work_mode == work_mode)

    candidate_profile = None
    if current_user is not None:
        candidate_profile = get_candidate_profile(db, current_user.id)
        if candidate_profile is not None and target_audience is None:
            candidate_target = (
                JobOfferTarget.LAUREAT
                if candidate_profile.candidate_type == CandidateType.LAUREAT
                else JobOfferTarget.STAGIAIRE
            )
            filters.append(
                or_(
                    JobOffer.target_audience == candidate_target,
                    JobOffer.target_audience == JobOfferTarget.BOTH,
                )
            )

    total = db.scalar(select(func.count(JobOffer.id)).where(*filters)) or 0
    offers = db.scalars(
        select(JobOffer)
        .where(*filters)
        .order_by(JobOffer.published_at.desc(), JobOffer.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    applied_offer_ids = (
        get_applied_offer_ids(db, candidate_profile.id) if candidate_profile is not None else set()
    )
    return JobOfferListResponse(
        items=[
            build_offer_response(offer, has_applied=offer.id in applied_offer_ids)
            for offer in offers
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/admin", response_model=JobOfferListResponse)
def list_all_offers_admin(
    search: str | None = Query(default=None),
    offer_status: JobOfferStatus | None = Query(default=None, alias="status"),
    offer_type: JobOfferType | None = Query(default=None),
    source: JobOfferSource | None = Query(default=None),
    company_id: int | None = Query(default=None, gt=0),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> JobOfferListResponse:
    filters = []
    if search:
        pattern = f"%{search.strip()}%"
        filters.append(
            or_(
                JobOffer.title.ilike(pattern),
                JobOffer.company_name.ilike(pattern),
                JobOffer.description.ilike(pattern),
                JobOffer.location.ilike(pattern),
            )
        )
    if offer_status:
        filters.append(JobOffer.status == offer_status)
    if offer_type:
        filters.append(JobOffer.offer_type == offer_type)
    if source:
        filters.append(JobOffer.source == source)
    if company_id:
        filters.append(JobOffer.company_id == company_id)
    total = db.scalar(select(func.count(JobOffer.id)).where(*filters)) or 0
    offers = db.scalars(
        select(JobOffer)
        .where(*filters)
        .order_by(JobOffer.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return JobOfferListResponse(
        items=[
            build_offer_response(offer, application_count_for(db, offer.id)) for offer in offers
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/{offer_id}", response_model=JobOfferResponse)
def get_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
) -> JobOfferResponse:
    offer = db.get(JobOffer, offer_id)
    if offer is None:
        raise HTTPException(404, "Offre introuvable.")
    is_admin = current_user is not None and getattr(current_user.role, "value", current_user.role) == "ADMIN"
    if not is_admin:
        if offer.status != JobOfferStatus.PUBLISHED:
            raise HTTPException(404, "Offre introuvable.")
        if offer.application_deadline and offer.application_deadline < date.today():
            raise HTTPException(410, "La date limite de cette offre est dépassée.")

    has_applied = False
    if current_user is not None:
        candidate_profile = get_candidate_profile(db, current_user.id)
        if candidate_profile is not None:
            has_applied = db.scalar(
                select(Application.id).where(
                    Application.job_offer_id == offer.id,
                    Application.candidate_profile_id == candidate_profile.id,
                    Application.status != ApplicationStatus.WITHDRAWN,
                )
            ) is not None
    return build_offer_response(
        offer,
        application_count=application_count_for(db, offer.id),
        has_applied=has_applied,
    )


@router.post("", response_model=JobOfferResponse, status_code=status.HTTP_201_CREATED)
def create_offer(
    payload: JobOfferCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> JobOfferResponse:
    if payload.application_deadline and payload.application_deadline < date.today():
        raise HTTPException(400, "La date limite ne peut pas être déjà dépassée.")
    company, company_name = resolve_company(db, payload.company_id, payload.company_name)
    data = payload.model_dump(exclude={"company_name"})
    if company is not None:
        data["sector"] = data.get("sector") or company.sector
        data["location"] = data.get("location") or company.city
    data["is_remote"] = payload.work_mode == WorkMode.REMOTE
    offer = JobOffer(**data, company_name=company_name, created_by_user_id=admin.id)
    if offer.status == JobOfferStatus.PUBLISHED:
        offer.published_at = datetime.now(timezone.utc)
    db.add(offer)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Impossible de créer cette offre.") from exc
    db.refresh(offer)
    return build_offer_response(offer)


@router.put("/{offer_id}", response_model=JobOfferResponse)
def update_offer(
    offer_id: int,
    payload: JobOfferUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> JobOfferResponse:
    offer = db.get(JobOffer, offer_id)
    if offer is None:
        raise HTTPException(404, "Offre introuvable.")
    data = payload.model_dump(exclude_unset=True)
    non_nullable = {
        "title", "description", "offer_type", "target_audience", "work_mode",
        "number_of_positions", "source", "status", "required_skills", "preferred_skills",
    }
    invalid = [field for field in non_nullable if field in data and data[field] is None]
    if invalid:
        raise HTTPException(422, f"Le champ {invalid[0]} ne peut pas être nul.")
    deadline = data.get("application_deadline")
    if deadline is not None and deadline < date.today():
        raise HTTPException(400, "La date limite ne peut pas être déjà dépassée.")

    if "company_id" in data or "company_name" in data:
        company_id = data.pop("company_id", offer.company_id)
        company_name_input = data.pop("company_name", offer.company_name)
        company, company_name = resolve_company(db, company_id, company_name_input)
        offer.company_id = company.id if company is not None else None
        offer.company_name = company_name
        if company is not None:
            data["sector"] = data.get("sector") or company.sector
    old_status = offer.status
    for field, value in data.items():
        setattr(offer, field, value)
    if "work_mode" in data:
        offer.is_remote = offer.work_mode == WorkMode.REMOTE
    if old_status != JobOfferStatus.PUBLISHED and offer.status == JobOfferStatus.PUBLISHED:
        offer.published_at = datetime.now(timezone.utc)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Impossible de mettre à jour cette offre.") from exc
    db.refresh(offer)
    return build_offer_response(offer, application_count_for(db, offer.id))


@router.patch("/{offer_id}/publish", response_model=JobOfferResponse)
def publish_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> JobOfferResponse:
    offer = db.get(JobOffer, offer_id)
    if offer is None:
        raise HTTPException(404, "Offre introuvable.")
    if offer.application_deadline and offer.application_deadline < date.today():
        raise HTTPException(400, "Impossible de publier une offre expirée.")
    offer.status = JobOfferStatus.PUBLISHED
    offer.published_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(offer)
    return build_offer_response(offer, application_count_for(db, offer.id))


@router.patch("/{offer_id}/archive", response_model=JobOfferResponse)
def archive_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> JobOfferResponse:
    offer = db.get(JobOffer, offer_id)
    if offer is None:
        raise HTTPException(404, "Offre introuvable.")
    offer.status = JobOfferStatus.ARCHIVED
    db.commit()
    db.refresh(offer)
    return build_offer_response(offer, application_count_for(db, offer.id))


@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> None:
    offer = db.get(JobOffer, offer_id)
    if offer is None:
        raise HTTPException(404, "Offre introuvable.")
    if application_count_for(db, offer.id):
        raise HTTPException(409, "Cette offre possède des candidatures. Archivez-la.")
    db.delete(offer)
    db.commit()
