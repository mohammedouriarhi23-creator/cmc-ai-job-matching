from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token
from app.models.user import User
from app.routers.dependencies import (
    get_current_user,
    require_admin,
    require_candidate,
)
from app.schemas.auth import (
    CandidateRegister,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import (
    authenticate_user,
    create_candidate_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_candidate(
    payload: CandidateRegister,
    db: Annotated[Session, Depends(get_db)],
) -> User:
    try:
        return create_candidate_user(
            db,
            payload,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    form_data: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    # Dans le formulaire OAuth2, username représente ici l'email.
    user = authenticate_user(
        db,
        email=form_data.username,
        password=form_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    token = create_access_token(
        subject=str(user.id),
        role=user.role.value,
    )

    return TokenResponse(
        access_token=token,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def read_current_user(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
) -> User:
    return current_user


@router.get("/candidate-access")
def candidate_access(
    current_user: Annotated[
        User,
        Depends(require_candidate),
    ],
) -> dict:
    return {
        "message": "Accès candidat autorisé.",
        "user_id": current_user.id,
        "role": current_user.role,
    }


@router.get("/admin-access")
def admin_access(
    current_user: Annotated[
        User,
        Depends(require_admin),
    ],
) -> dict:
    return {
        "message": "Accès administration autorisé.",
        "user_id": current_user.id,
        "role": current_user.role,
    }