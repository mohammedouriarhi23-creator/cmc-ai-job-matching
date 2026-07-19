"""preserve historical candidate profile revision

Revision ID: ebe5b1b187e4
Revises: 043f25d7f0c5
Create Date: 2026-07-17 17:30:08.862125
"""
from typing import Sequence, Union


revision: str = "ebe5b1b187e4"
down_revision: Union[str, Sequence[str], None] = "043f25d7f0c5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
