from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings
from app.utils.logger import logger

client: AsyncIOMotorClient = None


async def connect_db() -> None:
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
    logger.info("MongoDB client olusturuldu")


async def close_db() -> None:
    global client
    if client:
        client.close()
        logger.info("MongoDB baglantisi kapatildi")


def get_db() -> AsyncIOMotorDatabase:
    return client["pulsify"]


async def create_indexes() -> None:
    try:
        db = get_db()

        await db["orders"].create_index([("customer_id", 1)])
        await db["orders"].create_index([("status", 1)])
        await db["orders"].create_index([("created_at", -1)])

        await db["customers"].create_index([("phone", 1)], unique=True)
        await db["customers"].create_index([("sentiment", 1)])
        await db["customers"].create_index([("loyalty_score", -1)])

        await db["products"].create_index([("category", 1)])
        await db["products"].create_index([("stock_quantity", 1)])

        await db["ai_reports"].create_index([("report_type", 1)])
        await db["ai_reports"].create_index([("generated_at", -1)])

        logger.info("MongoDB indeksleri olusturuldu")
    except Exception as e:
        logger.warning(f"MongoDB indeks olusturulamadi (Atlas baglantisi yok?): {e}")
