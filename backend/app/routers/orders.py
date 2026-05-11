from fastapi import APIRouter, Query
from typing import Optional
from bson import ObjectId
from app.database import get_db
from app.utils.response import success, error
from app.utils.logger import logger
 
router = APIRouter()
 
 
def serialize_order(order: dict) -> dict:
    order["id"] = str(order["_id"])
    del order["_id"]
    # datetime nesnelerini string'e çevir
    for key, value in order.items():
        if hasattr(value, 'isoformat'):
            order[key] = value.isoformat()
    return order
 
 
@router.get("/")
async def get_orders(
    status: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    try:
        db = get_db()
        query = {}
        if status:
            query["status"] = status
 
        cursor = db["orders"].find(query).skip(skip).limit(limit)
        orders = []
        async for order in cursor:
            orders.append(serialize_order(order))
 
        total = await db["orders"].count_documents(query)
 
        return success(
            data=orders,
            message="Siparişler getirildi",
            meta={"total": total, "limit": limit, "skip": skip},
        )
    except Exception as e:
        logger.error(f"Sipariş listesi hatası: {e}")
        return error("FETCH_ERROR", "Siparişler getirilemedi", status=500)
 
 
@router.get("/{order_id}")
async def get_order(order_id: str):
    try:
        db = get_db()
        order = await db["orders"].find_one({"_id": ObjectId(order_id)})
        if not order:
            return error("NOT_FOUND", "Sipariş bulunamadı", status=404)
        return success(data=serialize_order(order))
    except Exception as e:
        logger.error(f"Sipariş getirme hatası: {e}")
        return error("FETCH_ERROR", "Sipariş getirilemedi", status=500)
 
 
@router.post("/")
async def create_order(order_data: dict):
    try:
        db = get_db()
        from datetime import datetime
        order_data["created_at"] = datetime.utcnow()
        order_data["updated_at"] = datetime.utcnow()
        if "status" not in order_data:
            order_data["status"] = "pending"
        if "cargo_status" not in order_data:
            order_data["cargo_status"] = "not_shipped"
 
        result = await db["orders"].insert_one(order_data)
        order_data["id"] = str(result.inserted_id)
        del order_data["_id"]
 
        return success(data=order_data, message="Sipariş oluşturuldu", status=201)
    except Exception as e:
        logger.error(f"Sipariş oluşturma hatası: {e}")
        return error("CREATE_ERROR", "Sipariş oluşturulamadı", status=500)
 
 
@router.put("/{order_id}")
async def update_order(order_id: str, update_data: dict):
    try:
        db = get_db()
        from datetime import datetime
        update_data["updated_at"] = datetime.utcnow()
 
        result = await db["orders"].update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return error("NOT_FOUND", "Sipariş bulunamadı", status=404)
 
        updated = await db["orders"].find_one({"_id": ObjectId(order_id)})
        return success(data=serialize_order(updated), message="Sipariş güncellendi")
    except Exception as e:
        logger.error(f"Sipariş güncelleme hatası: {e}")
        return error("UPDATE_ERROR", "Sipariş güncellenemedi", status=500)