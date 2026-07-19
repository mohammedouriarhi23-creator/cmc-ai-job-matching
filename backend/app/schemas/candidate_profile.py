from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class ProfileSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore", str_strip_whitespace=True)


class FileMetadata(ProfileSchema):
    name: str = Field(min_length=1, max_length=255)
    size: int | None = Field(default=None, ge=0, le=5 * 1024 * 1024)
    type: str | None = Field(default=None, max_length=100)
    stale: bool = False


class CandidateIdentity(ProfileSchema):
    nom: str = Field(min_length=2, max_length=100)
    prenom: str = Field(min_length=2, max_length=100)
    date_naissance: str = Field(alias="dateNaissance", min_length=4, max_length=20)
    sexe: str | None = Field(default=None, max_length=50)
    nationalite: str = Field(min_length=2, max_length=100)
    ville: str = Field(min_length=2, max_length=100)
    adresse: str | None = Field(default=None, max_length=500)
    telephone: str = Field(min_length=8, max_length=30)
    email: EmailStr
    linkedin: str | None = Field(default=None, max_length=1000)
    portfolio: str | None = Field(default=None, max_length=1000)
    photo: FileMetadata | None = None


class CandidateEducationData(ProfileSchema):
    filiere: str = Field(min_length=2, max_length=255)
    niveau: str = Field(min_length=1, max_length=100)
    annee_formation: str | None = Field(default=None, alias="anneeFormation", max_length=50)
    annee_obtention_prevue: str | None = Field(
        default=None, alias="anneeObtentionPrevue", max_length=20
    )
    annee_obtention: str | None = Field(default=None, alias="anneeObtention", max_length=20)
    moyenne_generale: str | None = Field(default=None, alias="moyenneGenerale", max_length=50)
    classement: str | None = Field(default=None, max_length=50)
    mention: str | None = Field(default=None, max_length=100)


class TechnicalSkillData(ProfileSchema):
    nom: str = Field(min_length=1, max_length=150)
    niveau: str | None = Field(default=None, max_length=50)
    categorie: str | None = Field(default=None, max_length=100)


class LanguageData(ProfileSchema):
    langue: str = Field(min_length=1, max_length=100)
    niveau: str | None = Field(default=None, max_length=20)


class CompetencesData(ProfileSchema):
    competences_techniques: list[TechnicalSkillData] = Field(
        default_factory=list, alias="competencesTechniques", max_length=100
    )
    langues: list[LanguageData] = Field(default_factory=list, max_length=30)
    soft_skills: list[str] = Field(default_factory=list, alias="softSkills", max_length=100)

    @field_validator("competences_techniques", mode="before")
    @classmethod
    def clean_technical_skills(cls, value: Any) -> Any:
        if not isinstance(value, list):
            return value
        result = []
        seen = set()
        for item in value:
            name = item.get("nom", "").strip() if isinstance(item, dict) else ""
            key = name.casefold()
            if name and key not in seen:
                seen.add(key)
                result.append(item)
        return result

    @field_validator("langues", mode="before")
    @classmethod
    def clean_languages(cls, value: Any) -> Any:
        if not isinstance(value, list):
            return value
        result = []
        seen = set()
        for item in value:
            name = item.get("langue", "").strip() if isinstance(item, dict) else ""
            key = name.casefold()
            if name and key not in seen:
                seen.add(key)
                result.append(item)
        return result

    @field_validator("soft_skills", mode="before")
    @classmethod
    def normalize_soft_skills(cls, value: Any) -> Any:
        if not isinstance(value, list):
            return value
        result = []
        seen = set()
        for item in value:
            item = item.get("value", "") if isinstance(item, dict) else item
            item = str(item).strip()
            key = item.casefold()
            if item and key not in seen:
                seen.add(key)
                result.append(item)
        return result


class ExperienceData(ProfileSchema):
    titre: str = Field(min_length=1, max_length=255)
    organisme: str | None = Field(default=None, max_length=255)
    type: str | None = Field(default=None, max_length=100)
    date_debut: str | None = Field(default=None, alias="dateDebut", max_length=20)
    date_fin: str | None = Field(default=None, alias="dateFin", max_length=20)
    description: str | None = Field(default=None, max_length=5000)
    competences_acquises: str | None = Field(
        default=None, alias="competencesAcquises", max_length=2000
    )


class ProjectData(ProfileSchema):
    nom: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=5000)
    technologies: str | None = Field(default=None, max_length=2000)
    lien_github: str | None = Field(default=None, alias="lienGithub", max_length=1000)
    lien_demo: str | None = Field(default=None, alias="lienDemo", max_length=1000)


class CertificationData(ProfileSchema):
    nom: str = Field(min_length=1, max_length=255)
    organisme: str | None = Field(default=None, max_length=255)
    date: str | None = Field(default=None, max_length=20)
    fichier: FileMetadata | None = None


class CareerData(ProfileSchema):
    experiences: list[ExperienceData] = Field(default_factory=list, max_length=100)
    projets: list[ProjectData] = Field(default_factory=list, max_length=100)
    certifications: list[CertificationData] = Field(default_factory=list, max_length=100)

    @field_validator("experiences", mode="before")
    @classmethod
    def clean_experiences(cls, value: Any) -> Any:
        return [item for item in value or [] if not isinstance(item, dict) or item.get("titre", "").strip()]

    @field_validator("projets", mode="before")
    @classmethod
    def clean_projects(cls, value: Any) -> Any:
        return [item for item in value or [] if not isinstance(item, dict) or item.get("nom", "").strip()]

    @field_validator("certifications", mode="before")
    @classmethod
    def clean_certifications(cls, value: Any) -> Any:
        return [item for item in value or [] if not isinstance(item, dict) or item.get("nom", "").strip()]


class InternshipSearchData(ProfileSchema):
    type_stage: str = Field(alias="typeStage", min_length=1, max_length=100)
    domaine_recherche: str = Field(alias="domaineRecherche", min_length=1, max_length=255)
    date_disponibilite: str = Field(alias="dateDisponibilite", min_length=4, max_length=20)
    duree_souhaitee: str = Field(alias="dureeSouhaitee", min_length=1, max_length=100)
    disponibilite_geographique: str | None = Field(
        default=None, alias="disponibiliteGeographique", max_length=500
    )
    mobilite: str | None = Field(default=None, max_length=50)
    permis_conduire: bool = Field(default=False, alias="permisConduire")
    vehicule_personnel: bool = Field(default=False, alias="vehiculePersonnel")


class GraduateSearchData(ProfileSchema):
    situation_actuelle: str = Field(alias="situationActuelle", min_length=1, max_length=150)
    universite_ecole: str | None = Field(default=None, alias="universiteEcole", max_length=255)
    formation_actuelle: str | None = Field(default=None, alias="formationActuelle", max_length=255)
    niveau_etudes_poursuite: str | None = Field(
        default=None, alias="niveauEtudesPoursuite", max_length=100
    )
    annee_etude: str | None = Field(default=None, alias="anneeEtude", max_length=50)
    types_opportunite: list[str] = Field(default_factory=list, alias="typesOpportunite")
    disponibilite: str | None = Field(default=None, max_length=100)
    date_disponibilite_precise: str | None = Field(
        default=None, alias="dateDisponibilitePrecise", max_length=20
    )
    ville_souhaitee: str | None = Field(default=None, alias="villeSouhaitee", max_length=150)
    regions_acceptees: str | None = Field(default=None, alias="regionsAcceptees", max_length=1000)
    mobilite_nationale: bool = Field(default=False, alias="mobiliteNationale")
    mobilite_internationale: bool = Field(default=False, alias="mobiliteInternationale")
    permis_b: bool = Field(default=False, alias="permisB")
    vehicule_personnel: bool = Field(default=False, alias="vehiculePersonnel")


class DocumentsProfileData(ProfileSchema):
    cv: FileMetadata
    lettre_motivation: FileMetadata | None = Field(default=None, alias="lettreMotivation")
    attestation_scolarite: FileMetadata | None = Field(default=None, alias="attestationScolarite")
    releve_notes: FileMetadata | None = Field(default=None, alias="releveNotes")
    portfolio_document: FileMetadata | None = Field(default=None, alias="portfolioDocument")
    diplome_ofppt: FileMetadata | None = Field(default=None, alias="diplomeOfppt")
    attestations_stage: FileMetadata | None = Field(default=None, alias="attestationsStage")
    certificats: FileMetadata | None = None
    centres_interet: list[str] = Field(default_factory=list, alias="centresInteret")
    centres_interet_autre: str | None = Field(default=None, alias="centresInteretAutre", max_length=255)
    secteur: str | None = Field(default=None, max_length=150)
    metier: str | None = Field(default=None, max_length=255)
    salaire_souhaite: str | None = Field(default=None, alias="salaireSouhaite", max_length=100)
    mode_travail: str | None = Field(default=None, alias="modeTravail", max_length=50)
    presentation: str | None = Field(default=None, max_length=1000)
    pourquoi_ce_stage: str | None = Field(default=None, alias="pourquoiCeStage", max_length=5000)
    ce_qui_vous_distingue: str | None = Field(
        default=None, alias="ceQuiVousDistingue", max_length=5000
    )
    consent_partage: bool = Field(alias="consentPartage")
    consent_confidentialite: bool = Field(alias="consentConfidentialite")
    consent_exactitude: bool = Field(default=False, alias="consentExactitude")


class CandidateCompleteProfile(ProfileSchema):
    profil: Literal["stagiaire", "laureat"]
    identite: CandidateIdentity
    formation: CandidateEducationData
    stage_recherche: InternshipSearchData | None = Field(default=None, alias="stageRecherche")
    situation_recherche: GraduateSearchData | None = Field(default=None, alias="situationRecherche")
    competences: CompetencesData
    parcours: CareerData
    documents_profil: DocumentsProfileData = Field(alias="documentsProfil")
    cmc: str = Field(default="CMC Nador", max_length=255)

    @model_validator(mode="after")
    def validate_profile_type(self) -> "CandidateCompleteProfile":
        if self.profil == "stagiaire" and self.stage_recherche is None:
            raise ValueError("Les informations de stage sont obligatoires pour un stagiaire.")
        if self.profil == "laureat" and self.situation_recherche is None:
            raise ValueError("La situation de recherche est obligatoire pour un lauréat.")
        if not self.documents_profil.consent_partage or not self.documents_profil.consent_confidentialite:
            raise ValueError("Les consentements de partage et de confidentialité sont obligatoires.")
        if self.profil == "stagiaire" and not self.documents_profil.consent_exactitude:
            raise ValueError("Le consentement d'exactitude est obligatoire pour un stagiaire.")
        return self


class CandidateProfileDataSave(BaseModel):
    cv_file_name: str | None = Field(default=None, max_length=255)
    profile_data: CandidateCompleteProfile


class CandidateProfileBasicUpdate(ProfileSchema):
    email: EmailStr | None = None
    first_name: str | None = Field(default=None, min_length=2, max_length=100)
    last_name: str | None = Field(default=None, min_length=2, max_length=100)
    phone: str | None = Field(default=None, max_length=30)
    city: str | None = Field(default=None, max_length=100)
    program_name: str | None = Field(default=None, min_length=2, max_length=255)
    level: str | None = Field(default=None, max_length=100)
    training_year: str | None = Field(default=None, max_length=50)
    graduation_year: str | None = Field(default=None, max_length=20)
    cmc: str | None = Field(default=None, max_length=255)


class CandidateDocumentResponse(BaseModel):
    id: int
    document_type: str
    original_filename: str
    mime_type: str
    file_size: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CandidateProfileDataResponse(BaseModel):
    id: int
    candidate_profile_id: int
    cv_file_name: str | None
    profile_data: dict[str, Any]
    documents: list[CandidateDocumentResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
