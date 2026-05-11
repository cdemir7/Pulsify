from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
from app.database import get_db


def _serialize(order: dict) -> dict:
    order["id"] = str(order["_id"])
    del order["_id"]
    for key, value in order.items():
        if hasattr(value, "isoformat"):
            order[key] = value.isoformat()
    return order


async def list_orders(status: Optional[str], limit: int, skip: int) -> tuple[list, int]:
    db = get_db()
    query = {"status": status} if status else {}
    cursor = db["orders"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    orders = [_serialize(o) async for o in cursor]
    total = await db["orders"].count_documents(query)
    return orders, total


async def get_order(order_id: str) -> Optional[dict]:
    db = get_db()
    order = await db["orders"].find_one({"_id": ObjectId(order_id)})
    return _serialize(order) if order else None


async def create_order(data: dict) -> dict:
    db = get_db()
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    data.setdefault("status", "pending")
    data.setdefault("cargo_status", "not_shipped")
    result = await db["orders"].insert_one(data)
    data["id"] = str(result.inserted_id)
    data.pop("_id", None)
    for key, value in data.items():
        if hasattr(value, "isoformat"):
            data[key] = value.isoformat()
    return data


async def update_order(order_id: str, data: dict) -> Optional[dict]:
    db = get_db()
    data["updated_at"] = datetime.now(timezone.utc)
    result = await db["orders"].update_one(
        {"_id": ObjectId(order_id)},
        {"$set": data},
    )
    if result.matched_count == 0:
        return None
    return await get_order(order_id)


async def delete_order(order_id: str) -> bool:
    db = get_db()
    result = await db["orders"].delete_one({"_id": ObjectId(order_id)})
    return result.deleted_count > 0
