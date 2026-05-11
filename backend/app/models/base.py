from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _=None):
        if not ObjectId.is_valid(str(v)):
            raise ValueError("Geçersiz ObjectId")
        return str(v)


class PulsifyBaseModel(BaseModel):
    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class TimestampMixin(BaseModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
