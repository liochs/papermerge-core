from collections.abc import Sequence
from datetime import date
from enum import Enum
from typing import Generic, TypeAlias, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")
DocumentVersion = TypeVar("DocumentVersion")


class OCRStatusEnum(str, Enum):
    unknown = "UNKNOWN"
    received = "RECEIVED"
    started = "STARTED"
    success = "SUCCESS"
    failure = "FAILURE"


class PaginatedResponse(BaseModel, Generic[T]):
    page_size: int
    page_number: int
    num_pages: int
    items: Sequence[T]

    model_config = ConfigDict(from_attributes=True)


class TokenData(BaseModel):
    user_id: str
    username: str
    email: str
    scopes: list[str] = []
    groups: list[str] = []


CFValueType: TypeAlias = str | int | date | bool | float | None
CFNameType: TypeAlias = str


class OrderEnum(str, Enum):
    asc = "asc"
    desc = "desc"
