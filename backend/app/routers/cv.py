import io
import time
from collections import defaultdict
from typing import Annotated, Literal

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile, status
from pypdf import PdfReader
from pypdf.errors import PdfReadError

from app.schemas.cv_extraction import CvParseResponse
from app.services.cv_extraction_service import (
    CvExtractionError,
    CvExtractionUnavailable,
    parse_cv,
)

router = APIRouter(prefix="/cv", tags=["CV"])

MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_PDF_PAGES = 10
ALLOWED_MIME_TYPES = {
    "application/pdf": "application/pdf",
    "image/jpeg": "image/jpeg",
    "image/png": "image/png",
}

RATE_LIMIT_MAX_REQUESTS = 3
RATE_LIMIT_WINDOW_SECONDS = 10 * 60
_rate_limit_hits: dict[str, list[float]] = defaultdict(list)


def _check_rate_limit(client_ip: str) -> None:
    now = time.monotonic()
    hits = _rate_limit_hits[client_ip]
    hits[:] = [t for t in hits if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(hits) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Trop de tentatives d'analyse de CV. Reessayez dans quelques minutes.",
        )
    hits.append(now)


@router.post("/parse", response_model=CvParseResponse)
async def parse_cv_endpoint(
    request: Request,
    profil: Annotated[Literal["stagiaire", "laureat"], Form()],
    file: Annotated[UploadFile, File()],
) -> CvParseResponse:
    # Route volontairement non authentifiee : le CV est depose a l'etape 1 du
    # wizard d'inscription, avant la creation du compte (pas de token encore).
    # Seul le rate limiting par IP protege cet endpoint des abus.
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(client_ip)

    mime_type = ALLOWED_MIME_TYPES.get(file.content_type or "")
    if mime_type is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format de fichier non supporte. Utilisez un PDF, JPG ou PNG.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le fichier depasse la taille maximale de 5 Mo.",
        )

    if mime_type == "application/pdf":
        try:
            page_count = len(PdfReader(io.BytesIO(file_bytes)).pages)
        except PdfReadError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce fichier PDF est illisible ou corrompu.",
            ) from exc
        if page_count > MAX_PDF_PAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Le PDF depasse la limite de {MAX_PDF_PAGES} pages.",
            )

    try:
        extraction = parse_cv(file_bytes, mime_type, profil)
    except CvExtractionUnavailable as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="L'analyse automatique de CV n'est pas disponible pour le moment.",
        ) from exc
    except CvExtractionError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Extraction impossible, merci de remplir manuellement.",
        ) from exc

    if not isinstance(extraction, dict) or not extraction:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Aucune information exploitable n'a ete trouvee dans ce CV.",
        )

    meta = extraction.pop("_meta", {}) if isinstance(extraction.get("_meta"), dict) else {}
    return CvParseResponse(data=extraction, meta=meta)
