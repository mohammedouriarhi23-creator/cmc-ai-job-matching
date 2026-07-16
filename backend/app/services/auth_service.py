from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.candidate import CandidateProfile, ProfileStatus
from app.models.user import User, UserRole
from app.schemas.auth import CandidateRegister


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    normalized_email = email.strip().lower()

    statement = select(User).where(
        User.email == normalized_email
    )

    return db.scalar(statement)


def create_candidate_user(
    db: Session,
    payload: CandidateRegister,
) -> User:
    normalized_email = str(payload.email).strip().lower()

    existing_user = get_user_by_email(
        db,
        normalized_email,
    )

    if existing_user is not None:
        raise ValueError(
            "Un compte existe déjà avec cette adresse email."
        )

    user = User(
        email=normalized_email,
        hashed_password=hash_password(payload.password),
        role=UserRole.CANDIDATE,
        is_active=True,
    )

    candidate_profile = CandidateProfile(
        candidate_type=payload.candidate_type,
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        phone=payload.phone,
        city=payload.city,
        profile_status=ProfileStatus.NEW,
    )

    user.candidate_profile = candidate_profile

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
        return user

    except IntegrityError as exc:
        db.rollback()

        raise ValueError(
            "Impossible de créer ce compte candidat."
        ) from exc


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    user = get_user_by_email(
        db,
        email,
    )

    if user is None:
        return None

    if not user.is_active:
        return None

    password_is_valid = verify_password(
        password,
        user.hashed_password,
    )

    if not password_is_valid:
        return None

    return user