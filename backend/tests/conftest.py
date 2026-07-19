import os
import re
import shutil
import tempfile

import pytest
from dotenv import dotenv_values
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url


config = dotenv_values(".env")
source_database_url = os.environ.get("TEST_DATABASE_URL") or config.get("DATABASE_URL")
if not source_database_url:
    raise RuntimeError("DATABASE_URL ou TEST_DATABASE_URL est nécessaire pour les tests.")

source_url = make_url(source_database_url)
test_database_name = f"{source_url.database}_test"
if not re.fullmatch(r"[a-zA-Z0-9_]+", test_database_name):
    raise RuntimeError("Nom de base de test invalide.")

test_url = source_url.set(database=test_database_name)
maintenance_engine = create_engine(
    source_url.set(database="postgres"),
    isolation_level="AUTOCOMMIT",
)
with maintenance_engine.connect() as connection:
    exists = connection.execute(
        text("SELECT 1 FROM pg_database WHERE datname = :name"),
        {"name": test_database_name},
    ).scalar()
    if not exists:
        connection.execute(text(f'CREATE DATABASE "{test_database_name}"'))
maintenance_engine.dispose()

test_storage = tempfile.mkdtemp(prefix="cmc_candidate_documents_")
os.environ["DATABASE_URL"] = test_url.render_as_string(hide_password=False)
os.environ["CANDIDATE_STORAGE_PATH"] = test_storage

from app.core.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def database_schema():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    shutil.rmtree(test_storage, ignore_errors=True)


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client
