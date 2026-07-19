import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company import Company, PartnershipStatus
from app.models.job_offer import JobOffer, JobOfferStatus
from app.models.user import User
from app.routers.dependencies import require_admin
from app.schemas.company import (
    CompanyCreate,
    CompanyListResponse,
    CompanyResponse,
    CompanyUpdate,
)


router = APIRouter(prefix="/companies", tags=["Partner companies"])


def build_company_response(db: Session, company: Company) -> CompanyResponse:
    active_offer_count = db.scalar(
        select(func.count(JobOffer.id)).where(
            JobOffer.company_id == company.id,
            JobOffer.status == JobOfferStatus.PUBLISHED,
        )
    ) or 0
    return CompanyResponse(
        id=company.id,
        name=company.name,
        sector=company.sector,
        city=company.city,
        email=company.email,
        phone=company.phone,
        contact_name=company.contact_name,
        website=company.website,
        description=company.description,
        status=company.status,
        active_offer_count=active_offer_count,
        created_at=company.created_at,
        updated_at=company.updated_at,
    )


@router.get("", response_model=CompanyListResponse)
def list_active_companies(
    search: str | None = Query(default=None),
    city: str | None = Query(default=None),
    sector: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> CompanyListResponse:
    filters = [Company.status == PartnershipStatus.ACTIVE]
    if search:
        pattern = f"%{search.strip()}%"
        filters.append(or_(Company.name.ilike(pattern), Company.description.ilike(pattern)))
    if city:
        filters.append(Company.city.ilike(f"%{city.strip()}%"))
    if sector:
        filters.append(Company.sector.ilike(f"%{sector.strip()}%"))

    total = db.scalar(select(func.count(Company.id)).where(*filters)) or 0
    companies = db.scalars(
        select(Company)
        .where(*filters)
        .order_by(Company.name)
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return CompanyListResponse(
        items=[build_company_response(db, item) for item in companies],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/admin/all", response_model=CompanyListResponse)
def list_companies_admin(
    search: str | None = Query(default=None),
    partnership_status: PartnershipStatus | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> CompanyListResponse:
    filters = []
    if search:
        pattern = f"%{search.strip()}%"
        filters.append(or_(Company.name.ilike(pattern), Company.sector.ilike(pattern)))
    if partnership_status:
        filters.append(Company.status == partnership_status)
    total = db.scalar(select(func.count(Company.id)).where(*filters)) or 0
    companies = db.scalars(
        select(Company)
        .where(*filters)
        .order_by(Company.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return CompanyListResponse(
        items=[build_company_response(db, item) for item in companies],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/{company_id}", response_model=CompanyResponse)
def get_active_company(company_id: int, db: Session = Depends(get_db)) -> CompanyResponse:
    company = db.get(Company, company_id)
    if company is None or company.status != PartnershipStatus.ACTIVE:
        raise HTTPException(404, "Entreprise partenaire introuvable.")
    return build_company_response(db, company)


@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(
    payload: CompanyCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> CompanyResponse:
    company = Company(**payload.model_dump())
    db.add(company)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Une entreprise existe déjà avec ce nom.") from exc
    db.refresh(company)
    return build_company_response(db, company)


@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: int,
    payload: CompanyUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> CompanyResponse:
    company = db.get(Company, company_id)
    if company is None:
        raise HTTPException(404, "Entreprise partenaire introuvable.")
    data = payload.model_dump(exclude_unset=True)
    for required_field in ("name", "sector", "city", "status"):
        if required_field in data and data[required_field] is None:
            raise HTTPException(422, f"Le champ {required_field} ne peut pas être nul.")
    for field, value in data.items():
        setattr(company, field, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Une entreprise existe déjà avec ce nom.") from exc
    db.refresh(company)
    return build_company_response(db, company)


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> None:
    company = db.get(Company, company_id)
    if company is None:
        raise HTTPException(404, "Entreprise partenaire introuvable.")
    offer_count = db.scalar(
        select(func.count(JobOffer.id)).where(JobOffer.company_id == company.id)
    ) or 0
    if offer_count:
        raise HTTPException(
            409,
            "Cette entreprise possède des offres. Désactivez-la au lieu de la supprimer.",
        )
    db.delete(company)
    db.commit()
