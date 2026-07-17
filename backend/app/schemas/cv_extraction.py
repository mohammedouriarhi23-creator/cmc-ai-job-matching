from typing import Any

from pydantic import BaseModel


class CvParseResponse(BaseModel):
    data: dict[str, Any]
    meta: dict[str, Any]
