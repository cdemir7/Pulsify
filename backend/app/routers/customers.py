from fastapi import APIRouter, Query
from typing import Optional
from bson import ObjectId
from app.database import get_db
from app.utils.response import success, error
from app.utils.logger import logger
 
router = APIRouter()
 
 
def serialize_customer(customer: dict) -> dict:
    customer["id"] = str(customer["_id"])
    del customer["_id"]
    for key, value in customer.items():
        if hasattr(value, 'isoformat'):
            customer[key] = value.isoformat()
    if "sentiment_history" in customer:
        for item in customer["sentiment_history"]:
            for k, v in item.items():
                if hasattr(v, 'isoformat'):
                    item[k] = v.isoformat()
    return customer
 
 
@router.get("/")
async def get_customers(
    sentiment: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    try:
        db = get_db()
        query = {}
        if sentiment:
            query["sentiment"] = sentiment
 
        cursor = db["customers"].find(query).skip(skip).limit(limit)
        customers = []
        async for customer in cursor:
            customers.append(serialize_customer(customer))
 
        total = await db["customers"].count_documents(query)
 
        return success(
            data=customers,
            message="Müşteriler getirildi",
            meta={"total": total, "limit": limit, "skip": skip},
        )
    except Exception as e:
        logger.error(f"Müşteri listesi hatası: {e}")
        return error("FETCH_ERROR", "Müşteriler getirilemedi", status=500)
 
 
@router.get("/{customer_id}")
async def get_customer(customer_id: str):
    try:
        db = get_db()
        customer = await db["customers"].find_one({"_id": ObjectId(customer_id)})
        if not customer:
            return error("NOT_FOUND", "Müşteri bulunamadı", status=404)
        return success(data=serialize_customer(customer))
    except Exception as e:
        logger.error(f"Müşteri getirme hatası: {e}")
        return error("FETCH_ERROR", "Müşteri getirilemedi", status=500)
 
 
@router.put("/{customer_id}/sentiment")
async def update_sentiment(customer_id: str, body: dict):
    try:
        db = get_db()
        from datetime import datetime
        sentiment = body.get("sentiment", "neutral")
        message_ref = body.get("message_ref", "")
 
        history_entry = {
            "sentiment": sentiment,
            "date": datetime.utcnow(),
            "message_ref": message_ref
        }
 
        result = await db["customers"].update_one(
            {"_id": ObjectId(customer_id)},
            {
                "$set": {
                    "sentiment": sentiment,
                    "updated_at": datetime.utcnow()
                },
                "$push": {
                    "sentiment_history": {
                        "$each": [history_entry],
                        "$position": 0
                    }
                }
            }
        )
 
        if result.matched_count == 0:
            return error("NOT_FOUND", "Müşteri bulunamadı", status=404)
 
        return success(message="Duygu durumu güncellendi")
    except Exception as e:
        logger.error(f"Sentiment güncelleme hatası: {e}")
        return error("UPDATE_ERROR", "Duygu durumu güncellenemedi", status=500)