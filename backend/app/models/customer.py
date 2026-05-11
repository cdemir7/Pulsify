from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
 
 
class SentimentEnum(str, Enum):
    happy = "happy"
    neutral = "neutral"
    angry = "angry"
 
 
class SentimentHistory(BaseModel):
    sentiment: SentimentEnum
    date: datetime
    message_ref: Optional[str] = ""
 
 
class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    loyalty_score: int = Field(default=50, ge=0, le=100)
    sentiment: SentimentEnum = SentimentEnum.neutral
 
 
class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    loyalty_score: Optional[int] = Field(default=None, ge=0, le=100)
    sentiment: Optional[SentimentEnum] = None
 
 
class SentimentUpdate(BaseModel):
    sentiment: SentimentEnum
    message_ref: Optional[str] = ""