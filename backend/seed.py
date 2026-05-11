import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import random
 
MONGO_URI = "mongodb://localhost:27017/pulsify"
 
customers_data = [
    {
        "name": "Ahmet Yılmaz",
        "phone": "0532 123 34 56",
        "email": "ahmet@example.com",
        "loyalty_score": 42,
        "sentiment": "angry",
        "sentiment_history": [
            {"sentiment": "angry", "date": datetime.utcnow(), "message_ref": "kargo gecikmesi"},
            {"sentiment": "neutral", "date": datetime.utcnow() - timedelta(days=3), "message_ref": "ürün sorusu"},
            {"sentiment": "happy", "date": datetime.utcnow() - timedelta(days=12), "message_ref": "hızlı teslimat"},
        ],
        "last_order_date": datetime.utcnow(),
        "total_orders": 8,
        "total_spent": 3240.0,
        "created_at": datetime.utcnow() - timedelta(days=90),
        "updated_at": datetime.utcnow(),
    },
    {
        "name": "Fatma Kaya",
        "phone": "0545 234 87 65",
        "email": "fatma@example.com",
        "loyalty_score": 87,
        "sentiment": "happy",
        "sentiment_history": [
            {"sentiment": "happy", "date": datetime.utcnow(), "message_ref": "ürün beğendi"},
            {"sentiment": "happy", "date": datetime.utcnow() - timedelta(days=7), "message_ref": "hızlı kargo"},
        ],
        "last_order_date": datetime.utcnow(),
        "total_orders": 24,
        "total_spent": 12800.0,
        "created_at": datetime.utcnow() - timedelta(days=365),
        "updated_at": datetime.utcnow(),
    },
    {
        "name": "Ali Rıza",
        "phone": "0501 345 12 78",
        "email": "ali@example.com",
        "loyalty_score": 61,
        "sentiment": "neutral",
        "sentiment_history": [
            {"sentiment": "neutral", "date": datetime.utcnow() - timedelta(days=1), "message_ref": "ürün sorusu"},
        ],
        "last_order_date": datetime.utcnow() - timedelta(days=1),
        "total_orders": 5,
        "total_spent": 2100.0,
        "created_at": datetime.utcnow() - timedelta(days=60),
        "updated_at": datetime.utcnow(),
    },
    {
        "name": "Zeynep Arslan",
        "phone": "0542 456 90 12",
        "email": "zeynep@example.com",
        "loyalty_score": 38,
        "sentiment": "angry",
        "sentiment_history": [
            {"sentiment": "angry", "date": datetime.utcnow(), "message_ref": "kargo gecikmesi"},
            {"sentiment": "neutral", "date": datetime.utcnow() - timedelta(days=10), "message_ref": "ürün sorusu"},
        ],
        "last_order_date": datetime.utcnow() - timedelta(days=2),
        "total_orders": 3,
        "total_spent": 890.0,
        "created_at": datetime.utcnow() - timedelta(days=30),
        "updated_at": datetime.utcnow(),
    },
    {
        "name": "Mehmet Şahin",
        "phone": "0538 567 44 23",
        "email": "mehmet@example.com",
        "loyalty_score": 92,
        "sentiment": "happy",
        "sentiment_history": [
            {"sentiment": "happy", "date": datetime.utcnow() - timedelta(days=2), "message_ref": "memnun kaldı"},
        ],
        "last_order_date": datetime.utcnow() - timedelta(days=2),
        "total_orders": 31,
        "total_spent": 18500.0,
        "created_at": datetime.utcnow() - timedelta(days=730),
        "updated_at": datetime.utcnow(),
    },
    {
        "name": "Can Yıldız",
        "phone": "0530 678 23 45",
        "email": "can@example.com",
        "loyalty_score": 55,
        "sentiment": "neutral",
        "sentiment_history": [],
        "last_order_date": datetime.utcnow(),
        "total_orders": 2,
        "total_spent": 375.0,
        "created_at": datetime.utcnow() - timedelta(days=14),
        "updated_at": datetime.utcnow(),
    },
]
 
orders_data = [
    {
        "order_code": "ORD-2026-1234",
        "customer_name": "Ahmet Yılmaz",
        "product": "Ürün A",
        "amount": 450.0,
        "status": "delayed",
        "cargo_status": "delayed",
        "cargo_company": "Aras Kargo",
        "tracking_number": "TRK884521",
        "created_at": datetime.utcnow() - timedelta(days=5),
        "updated_at": datetime.utcnow(),
        "estimated_delivery": datetime.utcnow() - timedelta(days=2),
    },
    {
        "order_code": "ORD-2026-1235",
        "customer_name": "Fatma Kaya",
        "product": "Ürün B",
        "amount": 280.0,
        "status": "delivered",
        "cargo_status": "delivered",
        "cargo_company": "MNG Kargo",
        "tracking_number": "TRK773412",
        "created_at": datetime.utcnow() - timedelta(days=3),
        "updated_at": datetime.utcnow(),
        "estimated_delivery": datetime.utcnow(),
    },
    {
        "order_code": "ORD-2026-1236",
        "customer_name": "Ali Rıza",
        "product": "Ürün C",
        "amount": 920.0,
        "status": "processing",
        "cargo_status": "not_shipped",
        "created_at": datetime.utcnow() - timedelta(days=1),
        "updated_at": datetime.utcnow(),
        "estimated_delivery": datetime.utcnow() + timedelta(days=2),
    },
    {
        "order_code": "ORD-2026-1237",
        "customer_name": "Ayşe Demir",
        "product": "Ürün D",
        "amount": 165.0,
        "status": "cancelled",
        "cargo_status": "not_shipped",
        "created_at": datetime.utcnow() - timedelta(days=2),
        "updated_at": datetime.utcnow(),
    },
    {
        "order_code": "ORD-2026-1238",
        "customer_name": "Mehmet Şahin",
        "product": "Ürün A",
        "amount": 340.0,
        "status": "delivered",
        "cargo_status": "delivered",
        "cargo_company": "Yurtiçi Kargo",
        "tracking_number": "TRK661209",
        "created_at": datetime.utcnow() - timedelta(days=4),
        "updated_at": datetime.utcnow(),
        "estimated_delivery": datetime.utcnow() - timedelta(days=1),
    },
    {
        "order_code": "ORD-2026-1239",
        "customer_name": "Zeynep Arslan",
        "product": "Ürün E",
        "amount": 710.0,
        "status": "delayed",
        "cargo_status": "delayed",
        "cargo_company": "PTT Kargo",
        "tracking_number": "TRK990341",
        "created_at": datetime.utcnow() - timedelta(days=6),
        "updated_at": datetime.utcnow(),
        "estimated_delivery": datetime.utcnow() - timedelta(days=3),
    },
    {
        "order_code": "ORD-2026-1240",
        "customer_name": "Can Yıldız",
        "product": "Ürün B",
        "amount": 195.0,
        "status": "pending",
        "cargo_status": "not_shipped",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "estimated_delivery": datetime.utcnow() + timedelta(days=3),
    },
]
 
products_data = [
    {"product_name": "Ürün A", "category": "Elektronik", "stock_quantity": 45, "critical_threshold": 10, "price": 450.0, "is_active": True, "updated_at": datetime.utcnow()},
    {"product_name": "Ürün B", "category": "Giyim", "stock_quantity": 4, "critical_threshold": 5, "price": 280.0, "is_active": True, "updated_at": datetime.utcnow()},
    {"product_name": "Ürün C", "category": "Ev & Yaşam", "stock_quantity": 2, "critical_threshold": 5, "price": 920.0, "is_active": True, "updated_at": datetime.utcnow()},
    {"product_name": "Ürün D", "category": "Giyim", "stock_quantity": 28, "critical_threshold": 5, "price": 165.0, "is_active": True, "updated_at": datetime.utcnow()},
    {"product_name": "Ürün E", "category": "Elektronik", "stock_quantity": 12, "critical_threshold": 5, "price": 710.0, "is_active": True, "updated_at": datetime.utcnow()},
]
 
 
async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["pulsify"]
 
    print("🌱 Seed data yükleniyor...")
 
    # Mevcut verileri temizle
    await db["customers"].delete_many({})
    await db["orders"].delete_many({})
    await db["products"].delete_many({})
    print("✅ Mevcut veriler temizlendi")
 
    # Müşterileri ekle
    result = await db["customers"].insert_many(customers_data)
    print(f"✅ {len(result.inserted_ids)} müşteri eklendi")
 
    # Customer ID'lerini siparişlere ekle
    customers = await db["customers"].find({}).to_list(length=100)
    customer_map = {c["name"]: str(c["_id"]) for c in customers}
 
    for order in orders_data:
        customer_name = order["customer_name"]
        if customer_name in customer_map:
            order["customer_id"] = customer_map[customer_name]
 
    # Siparişleri ekle
    result = await db["orders"].insert_many(orders_data)
    print(f"✅ {len(result.inserted_ids)} sipariş eklendi")
 
    # Ürünleri ekle
    result = await db["products"].insert_many(products_data)
    print(f"✅ {len(result.inserted_ids)} ürün eklendi")
 
    print("\n🎉 Seed data başarıyla yüklendi!")
    client.close()
 
 
if __name__ == "__main__":
    asyncio.run(seed())