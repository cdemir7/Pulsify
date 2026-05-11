from datetime import datetime
from bson import ObjectId
from app.database import get_db
from app.utils.logger import logger
 
 
def serialize_customer(customer: dict) -> dict:
    customer["id"] = str(customer["_id"])
    del customer["_id"]
    for key, value in customer.items():
        if hasattr(value, "isoformat"):
            customer[key] = value.isoformat()
    if "sentiment_history" in customer:
        for item in customer["sentiment_history"]:
            for k, v in item.items():
                if hasattr(v, "isoformat"):
                    item[k] = v.isoformat()
    return customer
 
 
class CustomerService:
 
    @staticmethod
    async def get_all(sentiment: str = None, limit: int = 20, skip: int = 0):
        db = get_db()
        query = {}
        if sentiment:
            query["sentiment"] = sentiment
 
        cursor = db["customers"].find(query).skip(skip).limit(limit)
        customers = []
        async for customer in cursor:
            customers.append(serialize_customer(customer))
 
        total = await db["customers"].count_documents(query)
        return customers, total
 
    @staticmethod
    async def get_by_id(customer_id: str):
        db = get_db()
        customer = await db["customers"].find_one({"_id": ObjectId(customer_id)})
        if not customer:
            return None
        return serialize_customer(customer)
 
    @staticmethod
    async def get_risk_customers():
        db = get_db()
        cursor = db["customers"].find(
            {"sentiment": "angry"}
        ).sort("loyalty_score", 1).limit(10)
        customers = []
        async for customer in cursor:
            customers.append(serialize_customer(customer))
        return customers
 
    @staticmethod
    async def update_sentiment(customer_id: str, sentiment: str, message_ref: str = ""):
        db = get_db()
        history_entry = {
            "sentiment": sentiment,
            "date": datetime.utcnow(),
            "message_ref": message_ref,
        }
 
        result = await db["customers"].update_one(
            {"_id": ObjectId(customer_id)},
            {
                "$set": {
                    "sentiment": sentiment,
                    "updated_at": datetime.utcnow(),
                },
                "$push": {
                    "sentiment_history": {
                        "$each": [history_entry],
                        "$position": 0,
                    }
                },
            },
        )
        return result.matched_count > 0
 
    @staticmethod
    async def get_stats():
        db = get_db()
        total = await db["customers"].count_documents({})
        angry = await db["customers"].count_documents({"sentiment": "angry"})
        happy = await db["customers"].count_documents({"sentiment": "happy"})
        vip = await db["customers"].count_documents({"loyalty_score": {"$gte": 80}})
        risk = await db["customers"].count_documents({"sentiment": "angry", "loyalty_score": {"$lt": 50}})
 
        return {
            "total": total,
            "angry": angry,
            "happy": happy,
            "vip": vip,
            "risk": risk,
        }