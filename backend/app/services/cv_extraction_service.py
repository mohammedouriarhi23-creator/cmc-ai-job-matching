import base64
import json
import logging
from typing import Literal

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
)

SYSTEM_INSTRUCTION = """Tu es un extracteur d'informations de CV pour une plateforme d'insertion \
professionnelle marocaine (CMC). Tu recois le fichier d'un CV (PDF natif, PDF scanne ou image) dans \
n'importe quelle mise en page (une ou deux colonnes) et n'importe quelle langue (francais, arabe, anglais).

Renvoie UNIQUEMENT un objet JSON valide, sans texte autour, sans balises markdown, sans backticks.

Pour chaque champ scalaire extrait, renvoie un objet {"value": ..., "confidence": "high"|"medium"|"low"}.
Si une information est absente du CV, "value" doit etre null et la confidence "low".
N'invente JAMAIS de donnee : si ce n'est pas ecrit dans le CV, la valeur est null. Ne devine pas un email \
ou un telephone a partir du nom.

Normalisation obligatoire :
- dates au format YYYY-MM (mois inconnu -> YYYY seul si c'est tout ce qui est disponible)
- telephone au format +212XXXXXXXXX si c'est un numero marocain reconnaissable, sinon tel quel
- niveaux de langue en CECRL : A1, A2, B1, B2, C1 ou C2 (estime au mieux si le CV dit juste "courant" \
  ou "notions")
- niveaux de competence technique en "Debutant", "Intermediaire" ou "Avance"
"""

RESPONSE_SCHEMA_STAGIAIRE = """{
  "identite": {
    "nom": {"value": string|null, "confidence": string},
    "prenom": {"value": string|null, "confidence": string},
    "dateNaissance": {"value": string|null, "confidence": string},
    "nationalite": {"value": string|null, "confidence": string},
    "ville": {"value": string|null, "confidence": string},
    "adresse": {"value": string|null, "confidence": string},
    "telephone": {"value": string|null, "confidence": string},
    "email": {"value": string|null, "confidence": string},
    "linkedin": {"value": string|null, "confidence": string},
    "portfolio": {"value": string|null, "confidence": string}
  },
  "formation": {
    "filiere": {"value": string|null, "confidence": string},
    "niveau": {"value": "Technicien"|"Technicien Specialise"|null, "confidence": string},
    "anneeFormation": {"value": string|null, "confidence": string},
    "anneeObtentionPrevue": {"value": string|null, "confidence": string},
    "moyenneGenerale": {"value": string|null, "confidence": string},
    "classement": {"value": string|null, "confidence": string}
  },
  "competencesTechniques": [{"nom": string, "niveau": string|null, "categorie": string|null, "confidence": string}],
  "langues": [{"langue": string, "niveau": string|null, "confidence": string}],
  "softSkills": [{"value": string, "confidence": string}],
  "experiences": [{"titre": string, "organisme": string|null, "type": string|null, "dateDebut": string|null, "dateFin": string|null, "description": string|null, "competencesAcquises": string|null, "confidence": string}],
  "projets": [{"nom": string, "description": string|null, "technologies": string|null, "lienGithub": string|null, "lienDemo": string|null, "confidence": string}],
  "certifications": [{"nom": string, "organisme": string|null, "date": string|null, "confidence": string}],
  "presentation": {"value": string|null, "confidence": string},
  "_meta": {"langueDetectee": string, "champsNonExtraits": [string], "avertissements": [string]}
}"""

RESPONSE_SCHEMA_LAUREAT = """{
  "identite": {
    "nom": {"value": string|null, "confidence": string},
    "prenom": {"value": string|null, "confidence": string},
    "dateNaissance": {"value": string|null, "confidence": string},
    "nationalite": {"value": string|null, "confidence": string},
    "ville": {"value": string|null, "confidence": string},
    "adresse": {"value": string|null, "confidence": string},
    "telephone": {"value": string|null, "confidence": string},
    "email": {"value": string|null, "confidence": string},
    "linkedin": {"value": string|null, "confidence": string},
    "portfolio": {"value": string|null, "confidence": string}
  },
  "formation": {
    "filiere": {"value": string|null, "confidence": string},
    "niveau": {"value": "Qualification"|"Technicien"|"Technicien Specialise"|null, "confidence": string},
    "anneeObtention": {"value": string|null, "confidence": string},
    "mention": {"value": string|null, "confidence": string}
  },
  "competencesTechniques": [{"nom": string, "niveau": string|null, "categorie": string|null, "confidence": string}],
  "langues": [{"langue": string, "niveau": string|null, "confidence": string}],
  "softSkills": [{"value": string, "confidence": string}],
  "experiences": [{"titre": string, "organisme": string|null, "type": string|null, "dateDebut": string|null, "dateFin": string|null, "description": string|null, "competencesAcquises": string|null, "confidence": string}],
  "projets": [{"nom": string, "description": string|null, "technologies": string|null, "lienGithub": string|null, "lienDemo": string|null, "confidence": string}],
  "certifications": [{"nom": string, "organisme": string|null, "date": string|null, "confidence": string}],
  "presentation": {"value": string|null, "confidence": string},
  "_meta": {"langueDetectee": string, "champsNonExtraits": [string], "avertissements": [string]}
}"""


def _build_prompt(profil: Literal["stagiaire", "laureat"]) -> str:
    schema = RESPONSE_SCHEMA_STAGIAIRE if profil == "stagiaire" else RESPONSE_SCHEMA_LAUREAT
    return (
        "Analyse le CV joint et renvoie un objet JSON respectant EXACTEMENT cette structure "
        f"(types indiques a titre informatif, ne les inclus pas dans la reponse) :\n\n{schema}\n\n"
        "Dans _meta.champsNonExtraits, liste les noms des champs de premier niveau pour lesquels "
        "aucune information exploitable n'a ete trouvee dans le CV."
    )


def _call_gemini(file_bytes: bytes, mime_type: str, profil: Literal["stagiaire", "laureat"]) -> dict:
    url = GEMINI_ENDPOINT.format(model=settings.GEMINI_MODEL)
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": _build_prompt(profil)},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64.b64encode(file_bytes).decode("ascii"),
                        }
                    },
                ],
            }
        ],
        "generationConfig": {"response_mime_type": "application/json"},
    }
    response = httpx.post(
        url,
        params={"key": settings.GEMINI_API_KEY},
        json=payload,
        timeout=60.0,
    )
    response.raise_for_status()
    data = response.json()
    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
    return json.loads(raw_text)


class CvExtractionError(Exception):
    pass


class CvExtractionUnavailable(Exception):
    pass


def parse_cv(file_bytes: bytes, mime_type: str, profil: Literal["stagiaire", "laureat"]) -> dict:
    if not settings.GEMINI_API_KEY:
        raise CvExtractionUnavailable("GEMINI_API_KEY non configuree")

    last_error: Exception | None = None
    for attempt in range(2):
        try:
            return _call_gemini(file_bytes, mime_type, profil)
        except (httpx.HTTPError, KeyError, IndexError, json.JSONDecodeError) as exc:
            last_error = exc
            logger.warning(
                "Echec extraction CV (tentative %s/2) : %s", attempt + 1, type(exc).__name__
            )

    raise CvExtractionError("Extraction impossible apres 2 tentatives") from last_error
