from __future__ import annotations

import re
from pathlib import Path
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.models.candidate import CandidateProfile, CandidateType, ProfileStatus
from app.models.candidate_details import (
    CandidateCertification,
    CandidateDocument,
    CandidateEducation,
    CandidateExperience,
    CandidateLanguage,
    CandidatePreference,
    CandidateProject,
    CandidateSkill,
    CandidateSoftSkill,
)
from app.models.candidate_profile_data import CandidateProfileData
from app.models.user import User
from app.routers.dependencies import require_candidate
from app.schemas.candidate_profile import (
    CandidateCompleteProfile,
    CandidateDocumentResponse,
    CandidateProfileBasicUpdate,
    CandidateProfileDataResponse,
    CandidateProfileDataSave,
)


router = APIRouter(prefix="/candidate/profile", tags=["Candidate profile"])

MAX_DOCUMENT_SIZE = 5 * 1024 * 1024
DOCUMENT_TYPE_PATTERN = re.compile(r"^[a-z][a-z0-9_-]{0,79}$")
ALLOWED_DOCUMENTS = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
}
_configured_storage = Path(settings.CANDIDATE_STORAGE_PATH)
STORAGE_ROOT = (
    _configured_storage
    if _configured_storage.is_absolute()
    else Path(__file__).resolve().parents[2] / _configured_storage
).resolve()


def get_candidate_profile_or_404(current_user: User) -> CandidateProfile:
    profile = current_user.candidate_profile
    if profile is None:
        raise HTTPException(status_code=404, detail="Profil candidat introuvable.")
    return profile


def get_stored_profile(db: Session, profile_id: int) -> CandidateProfileData | None:
    return db.scalar(
        select(CandidateProfileData).where(
            CandidateProfileData.candidate_profile_id == profile_id
        )
    )


def build_profile_response(
    stored_profile: CandidateProfileData,
    documents: list[CandidateDocument],
) -> CandidateProfileDataResponse:
    return CandidateProfileDataResponse(
        id=stored_profile.id,
        candidate_profile_id=stored_profile.candidate_profile_id,
        cv_file_name=stored_profile.cv_file_name,
        profile_data=stored_profile.profile_data,
        documents=[CandidateDocumentResponse.model_validate(item) for item in documents],
        created_at=stored_profile.created_at,
        updated_at=stored_profile.updated_at,
    )


def sync_normalized_profile(
    db: Session,
    candidate_profile: CandidateProfile,
    complete_profile: CandidateCompleteProfile,
) -> None:
    identity = complete_profile.identite
    education = complete_profile.formation
    candidate_profile.first_name = identity.prenom
    candidate_profile.last_name = identity.nom
    candidate_profile.phone = identity.telephone
    candidate_profile.city = identity.ville
    candidate_profile.profile_summary = complete_profile.documents_profil.presentation
    candidate_profile.profile_status = ProfileStatus.COMPLETED

    stored_education = candidate_profile.education
    if stored_education is None:
        stored_education = CandidateEducation(candidate_profile_id=candidate_profile.id)
        db.add(stored_education)
    stored_education.institution = complete_profile.cmc
    stored_education.program_name = education.filiere
    stored_education.level = education.niveau
    stored_education.training_year = education.annee_formation
    stored_education.expected_graduation_year = education.annee_obtention_prevue
    stored_education.graduation_year = education.annee_obtention
    stored_education.grade = education.moyenne_generale
    stored_education.ranking = education.classement
    stored_education.distinction = education.mention

    detail_models = (
        CandidateSkill,
        CandidateLanguage,
        CandidateSoftSkill,
        CandidateExperience,
        CandidateProject,
        CandidateCertification,
    )
    for model in detail_models:
        db.execute(delete(model).where(model.candidate_profile_id == candidate_profile.id))
    db.flush()

    for item in complete_profile.competences.competences_techniques:
        db.add(
            CandidateSkill(
                candidate_profile_id=candidate_profile.id,
                name=item.nom,
                level=item.niveau,
                category=item.categorie,
            )
        )
    for item in complete_profile.competences.langues:
        db.add(
            CandidateLanguage(
                candidate_profile_id=candidate_profile.id,
                language=item.langue,
                level=item.niveau,
            )
        )
    for item in complete_profile.competences.soft_skills:
        if item:
            db.add(CandidateSoftSkill(candidate_profile_id=candidate_profile.id, name=item))
    for item in complete_profile.parcours.experiences:
        db.add(
            CandidateExperience(
                candidate_profile_id=candidate_profile.id,
                title=item.titre,
                organization=item.organisme,
                experience_type=item.type,
                start_date=item.date_debut,
                end_date=item.date_fin,
                description=item.description,
                acquired_skills=item.competences_acquises,
            )
        )
    for item in complete_profile.parcours.projets:
        db.add(
            CandidateProject(
                candidate_profile_id=candidate_profile.id,
                name=item.nom,
                description=item.description,
                technologies=item.technologies,
                github_url=item.lien_github,
                demo_url=item.lien_demo,
            )
        )
    for item in complete_profile.parcours.certifications:
        db.add(
            CandidateCertification(
                candidate_profile_id=candidate_profile.id,
                name=item.nom,
                organization=item.organisme,
                issued_date=item.date,
            )
        )

    preference = candidate_profile.preference
    if preference is None:
        preference = CandidatePreference(candidate_profile_id=candidate_profile.id)
        db.add(preference)

    documents = complete_profile.documents_profil
    if complete_profile.profil == "stagiaire":
        search = complete_profile.stage_recherche
        assert search is not None
        preference.current_situation = "EN_FORMATION"
        preference.opportunity_types = [search.type_stage]
        preference.target_domain = search.domaine_recherche
        preference.availability_date = search.date_disponibilite
        preference.desired_duration = search.duree_souhaitee
        preference.geographic_availability = search.disponibilite_geographique
        preference.national_mobility = search.mobilite == "oui"
        preference.international_mobility = False
        preference.has_driver_license = search.permis_conduire
        preference.has_vehicle = search.vehicule_personnel
    else:
        search = complete_profile.situation_recherche
        assert search is not None
        preference.current_situation = search.situation_actuelle
        preference.opportunity_types = search.types_opportunite
        preference.availability = search.disponibilite
        preference.availability_date = search.date_disponibilite_precise
        preference.preferred_city = search.ville_souhaitee
        preference.accepted_regions = search.regions_acceptees
        preference.national_mobility = search.mobilite_nationale
        preference.international_mobility = search.mobilite_internationale
        preference.has_driver_license = search.permis_b
        preference.has_vehicle = search.vehicule_personnel

    interests = list(documents.centres_interet)
    if documents.centres_interet_autre:
        interests.append(documents.centres_interet_autre)
    preference.sector = documents.secteur
    preference.target_job = documents.metier
    preference.expected_salary = documents.salaire_souhaite
    preference.work_mode = documents.mode_travail
    preference.interests = interests
    preference.presentation = documents.presentation
    preference.motivation = documents.pourquoi_ce_stage
    preference.differentiator = documents.ce_qui_vous_distingue
    preference.consent_sharing = documents.consent_partage
    preference.consent_privacy = documents.consent_confidentialite
    preference.consent_accuracy = documents.consent_exactitude


@router.get("", response_model=CandidateProfileDataResponse)
def get_my_complete_profile(
    current_user: Annotated[User, Depends(require_candidate)],
    db: Annotated[Session, Depends(get_db)],
) -> CandidateProfileDataResponse:
    candidate_profile = get_candidate_profile_or_404(current_user)
    stored_profile = get_stored_profile(db, candidate_profile.id)
    if stored_profile is None:
        raise HTTPException(404, "Le profil complet n'a pas encore été enregistré.")
    documents = db.scalars(
        select(CandidateDocument)
        .where(CandidateDocument.candidate_profile_id == candidate_profile.id)
        .order_by(CandidateDocument.document_type)
    ).all()
    return build_profile_response(stored_profile, list(documents))


@router.put("", response_model=CandidateProfileDataResponse)
def save_my_complete_profile(
    payload: CandidateProfileDataSave,
    current_user: Annotated[User, Depends(require_candidate)],
    db: Annotated[Session, Depends(get_db)],
) -> CandidateProfileDataResponse:
    candidate_profile = get_candidate_profile_or_404(current_user)
    expected_type = (
        "laureat" if candidate_profile.candidate_type == CandidateType.LAUREAT else "stagiaire"
    )
    if payload.profile_data.profil != expected_type:
        raise HTTPException(400, "Le type de profil ne correspond pas au compte candidat.")

    requested_email = str(payload.profile_data.identite.email).lower()
    email_owner = db.scalar(select(User).where(User.email == requested_email))
    if email_owner is not None and email_owner.id != current_user.id:
        raise HTTPException(409, "Cette adresse email est déjà utilisée.")

    stored_profile = get_stored_profile(db, candidate_profile.id)
    profile_json = payload.profile_data.model_dump(mode="json", by_alias=True)
    cv_file_name = payload.cv_file_name or payload.profile_data.documents_profil.cv.name
    if stored_profile is None:
        stored_profile = CandidateProfileData(
            candidate_profile_id=candidate_profile.id,
            cv_file_name=cv_file_name,
            profile_data=profile_json,
        )
        db.add(stored_profile)
    else:
        stored_profile.cv_file_name = cv_file_name
        stored_profile.profile_data = profile_json

    current_user.email = requested_email
    sync_normalized_profile(db, candidate_profile, payload.profile_data)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Certaines informations du profil existent déjà.") from exc

    db.refresh(stored_profile)
    documents = db.scalars(
        select(CandidateDocument).where(
            CandidateDocument.candidate_profile_id == candidate_profile.id
        )
    ).all()
    return build_profile_response(stored_profile, list(documents))


@router.patch("/basic", response_model=CandidateProfileDataResponse)
def update_my_basic_profile(
    payload: CandidateProfileBasicUpdate,
    current_user: Annotated[User, Depends(require_candidate)],
    db: Annotated[Session, Depends(get_db)],
) -> CandidateProfileDataResponse:
    candidate_profile = get_candidate_profile_or_404(current_user)
    stored_profile = get_stored_profile(db, candidate_profile.id)
    if stored_profile is None:
        raise HTTPException(409, "Le profil complet doit d'abord être enregistré.")

    values = payload.model_dump(exclude_unset=True)
    if "email" in values:
        requested_email = str(values["email"]).lower()
        owner = db.scalar(select(User).where(User.email == requested_email))
        if owner is not None and owner.id != current_user.id:
            raise HTTPException(409, "Cette adresse email est déjà utilisée.")
        current_user.email = requested_email
    if "first_name" in values:
        candidate_profile.first_name = values["first_name"]
    if "last_name" in values:
        candidate_profile.last_name = values["last_name"]
    if "phone" in values:
        candidate_profile.phone = values["phone"]
    if "city" in values:
        candidate_profile.city = values["city"]

    profile_data = dict(stored_profile.profile_data)
    identity = dict(profile_data.get("identite") or {})
    formation = dict(profile_data.get("formation") or {})
    identity_mapping = {
        "email": "email",
        "first_name": "prenom",
        "last_name": "nom",
        "phone": "telephone",
        "city": "ville",
    }
    for source, target in identity_mapping.items():
        if source in values:
            identity[target] = str(values[source]) if values[source] is not None else ""
    education_mapping = {
        "program_name": "filiere",
        "level": "niveau",
        "training_year": "anneeFormation",
        "graduation_year": "anneeObtention",
    }
    for source, target in education_mapping.items():
        if source in values:
            formation[target] = values[source]
    profile_data["identite"] = identity
    profile_data["formation"] = formation
    if "cmc" in values:
        profile_data["cmc"] = values["cmc"]
    stored_profile.profile_data = profile_data

    education = candidate_profile.education
    if education is not None:
        if "program_name" in values:
            education.program_name = values["program_name"]
        if "level" in values:
            education.level = values["level"]
        if "training_year" in values:
            education.training_year = values["training_year"]
        if "graduation_year" in values:
            education.graduation_year = values["graduation_year"]
        if "cmc" in values:
            education.institution = values["cmc"]

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Impossible de mettre à jour ce profil.") from exc
    db.refresh(stored_profile)
    documents = db.scalars(
        select(CandidateDocument).where(
            CandidateDocument.candidate_profile_id == candidate_profile.id
        )
    ).all()
    return build_profile_response(stored_profile, list(documents))


def validate_document_bytes(content: bytes, mime_type: str) -> None:
    signatures = {
        "application/pdf": b"%PDF",
        "image/jpeg": b"\xff\xd8\xff",
        "image/png": b"\x89PNG\r\n\x1a\n",
    }
    if not content.startswith(signatures[mime_type]):
        raise HTTPException(400, "Le contenu du fichier ne correspond pas à son format.")


@router.get("/documents", response_model=list[CandidateDocumentResponse])
def list_my_documents(
    current_user: Annotated[User, Depends(require_candidate)],
    db: Annotated[Session, Depends(get_db)],
) -> list[CandidateDocument]:
    profile = get_candidate_profile_or_404(current_user)
    return list(
        db.scalars(
            select(CandidateDocument)
            .where(CandidateDocument.candidate_profile_id == profile.id)
            .order_by(CandidateDocument.document_type)
        ).all()
    )


@router.post(
    "/documents/{document_type}",
    response_model=CandidateDocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_my_document(
    document_type: str,
    file: Annotated[UploadFile, File()],
    current_user: Annotated[User, Depends(require_candidate)],
    db: Annotated[Session, Depends(get_db)],
) -> CandidateDocument:
    if not DOCUMENT_TYPE_PATTERN.fullmatch(document_type):
        raise HTTPException(400, "Type de document invalide.")
    mime_type = file.content_type or ""
    suffix = ALLOWED_DOCUMENTS.get(mime_type)
    if suffix is None:
        raise HTTPException(400, "Format non supporté. Utilisez PDF, JPG ou PNG.")

    content = bytearray()
    while chunk := await file.read(1024 * 1024):
        content.extend(chunk)
        if len(content) > MAX_DOCUMENT_SIZE:
            raise HTTPException(400, "Le fichier dépasse la taille maximale de 5 Mo.")
    if not content:
        raise HTTPException(400, "Le fichier est vide.")
    validate_document_bytes(bytes(content), mime_type)

    profile = get_candidate_profile_or_404(current_user)
    candidate_dir = (STORAGE_ROOT / str(profile.id)).resolve()
    if STORAGE_ROOT not in candidate_dir.parents:
        raise HTTPException(400, "Chemin de stockage invalide.")
    candidate_dir.mkdir(parents=True, exist_ok=True)
    stored_filename = f"{uuid4().hex}{suffix}"
    target_path = (candidate_dir / stored_filename).resolve()
    target_path.write_bytes(content)

    document = db.scalar(
        select(CandidateDocument).where(
            CandidateDocument.candidate_profile_id == profile.id,
            CandidateDocument.document_type == document_type,
        )
    )
    previous_path: Path | None = None
    if document is None:
        document = CandidateDocument(
            candidate_profile_id=profile.id,
            document_type=document_type,
            original_filename=(file.filename or f"document{suffix}")[:255],
            stored_filename=stored_filename,
            file_path=str(target_path),
            mime_type=mime_type,
            file_size=len(content),
        )
        db.add(document)
    else:
        previous_path = Path(document.file_path)
        document.original_filename = (file.filename or f"document{suffix}")[:255]
        document.stored_filename = stored_filename
        document.file_path = str(target_path)
        document.mime_type = mime_type
        document.file_size = len(content)

    stored_profile = get_stored_profile(db, profile.id)
    if document_type == "cv" and stored_profile is not None:
        stored_profile.cv_file_name = document.original_filename

    try:
        db.commit()
    except Exception:
        db.rollback()
        target_path.unlink(missing_ok=True)
        raise
    db.refresh(document)
    if previous_path and previous_path.resolve() != target_path:
        previous_path.unlink(missing_ok=True)
    return document


@router.get("/documents/{document_id}/download")
def download_my_document(
    document_id: int,
    current_user: Annotated[User, Depends(require_candidate)],
    db: Annotated[Session, Depends(get_db)],
) -> FileResponse:
    profile = get_candidate_profile_or_404(current_user)
    document = db.scalar(
        select(CandidateDocument).where(
            CandidateDocument.id == document_id,
            CandidateDocument.candidate_profile_id == profile.id,
        )
    )
    if document is None:
        raise HTTPException(404, "Document introuvable.")
    file_path = Path(document.file_path).resolve()
    if STORAGE_ROOT not in file_path.parents or not file_path.is_file():
        raise HTTPException(404, "Fichier introuvable.")
    return FileResponse(
        path=file_path,
        media_type=document.mime_type,
        filename=document.original_filename,
    )


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_document(
    document_id: int,
    current_user: Annotated[User, Depends(require_candidate)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    profile = get_candidate_profile_or_404(current_user)
    document = db.scalar(
        select(CandidateDocument).where(
            CandidateDocument.id == document_id,
            CandidateDocument.candidate_profile_id == profile.id,
        )
    )
    if document is None:
        raise HTTPException(404, "Document introuvable.")
    file_path = Path(document.file_path).resolve()
    document_type = document.document_type
    db.delete(document)
    stored_profile = get_stored_profile(db, profile.id)
    if document_type == "cv" and stored_profile is not None:
        stored_profile.cv_file_name = None
    db.commit()
    if STORAGE_ROOT in file_path.parents:
        file_path.unlink(missing_ok=True)
