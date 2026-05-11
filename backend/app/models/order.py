from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from app.models.base import PulsifyBaseModel, TimestampMixin

OrderStatus = str   # "pending | processing | shipped | delivered | cancelled"
CargoStatus = str   # "not_shipped | in_transit | delayed | delivered"


class OrderCreate(PulsifyBaseModel):
    order_code: str
    customer_id: Optional[str] = None
    customer_name: str
    product: str
    amount: float
    status: OrderStatus = "pending"
    cargo_status: CargoStatus = "not_shipped"
    cargo_company: Optional[str] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None


class OrderUpdate(PulsifyBaseModel):
    customer_name: Optional[str] = None
    product: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[OrderStatus] = None
    cargo_status: Optional[CargoStatus] = None
    cargo_company: Optional[str] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None


class OrderResponse(OrderCreate, TimestampMixin):
    id: str
