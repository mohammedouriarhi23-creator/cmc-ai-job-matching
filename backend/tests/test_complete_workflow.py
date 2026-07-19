from datetime import date, timedelta

from sqlalchemy import func, select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.candidate_details import (
    CandidateDocument,
    CandidateEducation,
    CandidateExperience,
    CandidatePreference,
    CandidateSkill,
)
from app.models.user import User, UserRole


def bearer(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def login(client, email: str, password: str) -> str:
    response = client.post(
        "/api/auth/login",
        data={"username": email, "password": password},
    )
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def complete_profile_payload() -> dict:
    return {
        "cv_file_name": "cv-test.pdf",
        "profile_data": {
            "profil": "stagiaire",
            "identite": {
                "nom": "Candidat",
                "prenom": "Test",
                "dateNaissance": "2001-05-10",
                "sexe": "Homme",
                "nationalite": "Marocaine",
                "ville": "Oujda",
                "adresse": "Centre-ville",
                "telephone": "+212600000001",
                "email": "candidate.workflow@example.com",
                "linkedin": "https://linkedin.com/in/test",
                "portfolio": "https://example.com",
            },
            "formation": {
                "filiere": "Développement Digital",
                "niveau": "Technicien Spécialisé",
                "anneeFormation": "2ème année",
                "anneeObtentionPrevue": "2027",
                "moyenneGenerale": "15/20",
                "classement": "3",
            },
            "stageRecherche": {
                "typeStage": "PFE",
                "domaineRecherche": "Développement web",
                "dateDisponibilite": "2027-01-15",
                "dureeSouhaitee": "4 mois",
                "disponibiliteGeographique": "Oujda et Nador",
                "mobilite": "oui",
                "permisConduire": True,
                "vehiculePersonnel": False,
            },
            "competences": {
                "competencesTechniques": [
                    {"nom": "Python", "niveau": "Avancé", "categorie": "Backend"},
                    {"nom": "React", "niveau": "Intermédiaire", "categorie": "Frontend"},
                ],
                "langues": [{"langue": "Français", "niveau": "B2"}],
                "softSkills": ["Autonomie", "Travail en équipe"],
            },
            "parcours": {
                "experiences": [
                    {
                        "titre": "Stagiaire développeur",
                        "organisme": "CMC Lab",
                        "type": "Stage",
                        "dateDebut": "2026-01-01",
                        "dateFin": "2026-03-31",
                        "description": "Développement d'une API.",
                        "competencesAcquises": "FastAPI, PostgreSQL",
                    }
                ],
                "projets": [
                    {
                        "nom": "Job Matching",
                        "description": "Plateforme de recrutement",
                        "technologies": "FastAPI, React",
                        "lienGithub": "https://github.com/example/project",
                        "lienDemo": "https://example.com/demo",
                    }
                ],
                "certifications": [
                    {"nom": "Python", "organisme": "Test Academy", "date": "2026-06-01"}
                ],
            },
            "documentsProfil": {
                "cv": {"name": "cv-test.pdf", "size": 25, "type": "application/pdf"},
                "centresInteret": ["Technologie"],
                "secteur": "Informatique & Digital",
                "metier": "Développeur full stack",
                "modeTravail": "Hybride",
                "presentation": "Profil candidat complet et motivé.",
                "pourquoiCeStage": "Mettre en pratique mes compétences.",
                "ceQuiVousDistingue": "Autonomie et curiosité.",
                "consentPartage": True,
                "consentConfidentialite": True,
                "consentExactitude": True,
            },
            "cmc": "CMC Nador",
        },
    }


def test_complete_profile_company_offer_and_application_workflow(client):
    with SessionLocal() as db:
        db.add(
            User(
                email="admin.workflow@example.com",
                hashed_password=hash_password("AdminPassword123!"),
                role=UserRole.ADMIN,
                is_active=True,
            )
        )
        db.commit()

    register = client.post(
        "/api/auth/register",
        json={
            "email": "candidate.workflow@example.com",
            "password": "CandidatePassword123!",
            "first_name": "Test",
            "last_name": "Candidat",
            "candidate_type": "STAGIAIRE",
            "phone": "+212600000001",
            "city": "Oujda",
        },
    )
    assert register.status_code == 201, register.text

    candidate_token = login(
        client, "candidate.workflow@example.com", "CandidatePassword123!"
    )
    admin_token = login(client, "admin.workflow@example.com", "AdminPassword123!")
    candidate_headers = bearer(candidate_token)
    admin_headers = bearer(admin_token)

    saved_profile = client.put(
        "/api/candidate/profile",
        json=complete_profile_payload(),
        headers=candidate_headers,
    )
    assert saved_profile.status_code == 200, saved_profile.text
    assert saved_profile.json()["profile_data"]["formation"]["filiere"] == "Développement Digital"

    with SessionLocal() as db:
        assert db.scalar(select(func.count(CandidateEducation.id))) == 1
        assert db.scalar(select(func.count(CandidateSkill.id))) == 2
        assert db.scalar(select(func.count(CandidateExperience.id))) == 1
        assert db.scalar(select(func.count(CandidatePreference.id))) == 1

    pdf = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF"
    uploaded = client.post(
        "/api/candidate/profile/documents/cv",
        files={"file": ("cv-test.pdf", pdf, "application/pdf")},
        headers=candidate_headers,
    )
    assert uploaded.status_code == 201, uploaded.text
    document_id = uploaded.json()["id"]
    assert client.get(
        f"/api/candidate/profile/documents/{document_id}/download",
        headers=candidate_headers,
    ).status_code == 200

    company = client.post(
        "/api/companies",
        headers=admin_headers,
        json={
            "name": "Workflow Tech",
            "sector": "Informatique & Digital",
            "city": "Oujda",
            "email": "contact@workflow.example.com",
            "phone": "+212500000000",
            "contact_name": "Responsable RH",
            "description": "Entreprise partenaire utilisée par le test d'intégration.",
            "status": "ACTIVE",
        },
    )
    assert company.status_code == 201, company.text
    company_id = company.json()["id"]

    company_update = client.put(
        f"/api/companies/{company_id}",
        headers=admin_headers,
        json={"contact_name": "Équipe recrutement"},
    )
    assert company_update.status_code == 200, company_update.text
    assert company_update.json()["contact_name"] == "Équipe recrutement"

    admin_companies = client.get("/api/companies/admin/all", headers=admin_headers)
    assert admin_companies.status_code == 200
    assert admin_companies.json()["total"] == 1

    public_companies = client.get("/api/companies")
    assert public_companies.status_code == 200
    assert public_companies.json()["total"] == 1

    deadline = (date.today() + timedelta(days=30)).isoformat()
    offer = client.post(
        "/api/job-offers",
        headers=admin_headers,
        json={
            "title": "Stage développeur FastAPI",
            "company_id": company_id,
            "description": "Développer et tester les fonctionnalités backend de la plateforme.",
            "requirements": "Profil CMC motivé avec de bonnes bases Python.",
            "required_skills": ["Python", "FastAPI"],
            "preferred_skills": ["PostgreSQL", "React"],
            "location": "Oujda",
            "contract_type": "Stage PFE",
            "education_level": "Technicien Spécialisé",
            "offer_type": "PFE",
            "target_audience": "STAGIAIRE",
            "work_mode": "HYBRID",
            "number_of_positions": 2,
            "source": "CMC",
            "status": "PUBLISHED",
            "application_deadline": deadline,
        },
    )
    assert offer.status_code == 201, offer.text
    offer_id = offer.json()["id"]
    assert offer.json()["company_name"] == "Workflow Tech"

    offer_update = client.put(
        f"/api/job-offers/{offer_id}",
        headers=admin_headers,
        json={"number_of_positions": 3},
    )
    assert offer_update.status_code == 200, offer_update.text
    assert offer_update.json()["number_of_positions"] == 3

    archived_offer = client.patch(
        f"/api/job-offers/{offer_id}/archive",
        headers=admin_headers,
    )
    assert archived_offer.status_code == 200
    assert client.get("/api/job-offers").json()["total"] == 0
    published_offer = client.patch(
        f"/api/job-offers/{offer_id}/publish",
        headers=admin_headers,
    )
    assert published_offer.status_code == 200

    admin_offers = client.get("/api/job-offers/admin", headers=admin_headers)
    assert admin_offers.status_code == 200
    assert admin_offers.json()["items"][0]["description"].startswith("Développer")

    public_offers = client.get("/api/job-offers")
    assert public_offers.status_code == 200
    assert public_offers.json()["total"] == 1

    application = client.post(
        "/api/applications",
        headers=candidate_headers,
        json={"job_offer_id": offer_id, "cover_letter": "Je souhaite rejoindre ce stage."},
    )
    assert application.status_code == 201, application.text
    application_id = application.json()["id"]

    admin_applications = client.get("/api/applications/admin/all", headers=admin_headers)
    assert admin_applications.status_code == 200
    assert admin_applications.json()["total"] == 1
    admin_cv = client.get(
        f"/api/applications/admin/{application_id}/cv",
        headers=admin_headers,
    )
    assert admin_cv.status_code == 200
    assert admin_cv.content.startswith(b"%PDF")
    forbidden_cv = client.get(
        f"/api/applications/admin/{application_id}/cv",
        headers=candidate_headers,
    )
    assert forbidden_cv.status_code == 403

    duplicate = client.post(
        "/api/applications",
        headers=candidate_headers,
        json={"job_offer_id": offer_id},
    )
    assert duplicate.status_code == 409

    withdrawn = client.patch(
        f"/api/applications/me/{application_id}/withdraw",
        headers=candidate_headers,
    )
    assert withdrawn.status_code == 200
    assert withdrawn.json()["status"] == "WITHDRAWN"

    reapplied = client.post(
        "/api/applications",
        headers=candidate_headers,
        json={"job_offer_id": offer_id},
    )
    assert reapplied.status_code == 201, reapplied.text
    assert reapplied.json()["id"] == application_id
    assert reapplied.json()["status"] == "SUBMITTED"

    reviewed = client.patch(
        f"/api/applications/admin/{application_id}/status",
        headers=admin_headers,
        json={"status": "UNDER_REVIEW", "admin_note": "Profil complet."},
    )
    assert reviewed.status_code == 200, reviewed.text
    assert reviewed.json()["admin_note"] == "Profil complet."

    candidate_view = client.get("/api/applications/me", headers=candidate_headers)
    assert candidate_view.status_code == 200
    assert candidate_view.json()["items"][0]["admin_note"] is None

    invalid_transition = client.patch(
        f"/api/applications/admin/{application_id}/status",
        headers=admin_headers,
        json={"status": "ACCEPTED"},
    )
    assert invalid_transition.status_code == 409

    assert client.delete(
        f"/api/job-offers/{offer_id}", headers=admin_headers
    ).status_code == 409
    assert client.delete(
        f"/api/companies/{company_id}", headers=admin_headers
    ).status_code == 409

    with SessionLocal() as db:
        assert db.scalar(select(func.count(CandidateDocument.id))) == 1

    deleted_document = client.delete(
        f"/api/candidate/profile/documents/{document_id}",
        headers=candidate_headers,
    )
    assert deleted_document.status_code == 204
