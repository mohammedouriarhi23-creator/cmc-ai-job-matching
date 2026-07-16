import sys
from getpass import getpass
from pathlib import Path

from sqlalchemy import select


BACKEND_DIR = Path(__file__).resolve().parents[1]

sys.path.insert(
    0,
    str(BACKEND_DIR),
)


from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole


def main() -> None:
    email = input(
        "Email administrateur : "
    ).strip().lower()

    password = getpass(
        "Mot de passe administrateur : "
    )

    if len(password) < 8:
        print(
            "Le mot de passe doit contenir au moins 8 caractères."
        )
        return

    db = SessionLocal()

    try:
        existing_user = db.scalar(
            select(User).where(
                User.email == email
            )
        )

        if existing_user:
            print(
                "Un compte existe déjà avec cet email."
            )
            return

        admin = User(
            email=email,
            hashed_password=hash_password(password),
            role=UserRole.ADMIN,
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print(
            f"Administrateur créé : {email}"
        )

    finally:
        db.close()


if __name__ == "__main__":
    main()