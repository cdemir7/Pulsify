from datetime import datetime
from app.database import get_db
from app.services.cargo_service import CargoService

class DashboardService:
    @staticmethod
    async def get_summary():
        db = get_db()
        
        # 1. Istatistikler (Stats)
        total_orders = await db["orders"].count_documents({})
        
        cargo_stats = await CargoService.get_stats()
        delayed_cargo = cargo_stats["delayed"]
        
        total_customers = await db["customers"].count_documents({})
        happy_customers = await db["customers"].count_documents({"sentiment": "happy"})
        satisfaction_pct = round((happy_customers / total_customers * 100) if total_customers > 0 else 0)
        
        critical_stock = await db["products"].count_documents({"stock_quantity": {"$lte": 5}})
        
        # 2. Son Siparisler (Orders)
        cursor = db["orders"].find().sort("created_at", -1).limit(20)
        latest_orders = []
        async for o in cursor:
            # Musteri bilgisini cek
            customer = None
            if o.get("customer_id"):
                from bson import ObjectId
                try:
                    customer = await db["customers"].find_one({"_id": ObjectId(o["customer_id"])})
                except:
                    pass
                    
            latest_orders.append({
                "id": f"#{str(o['_id'])[-4:].upper()}",
                "customer": customer["name"] if customer else o.get("customer_name", "Bilinmiyor"),
                "product": o.get("items", [{"product_name": "Urun"}])[0].get("product_name", "Urun") if o.get("items") else "Urun",
                "amount": f"₺{o.get('total_amount', 0)}",
                "status": o.get("cargo_status", "processing"),
                "sentiment": customer.get("sentiment", "neutral") if customer else "neutral"
            })
            
        # 3. Duygu Analizi (Sentiments)
        neutral_customers = await db["customers"].count_documents({"sentiment": "neutral"})
        angry_customers = await db["customers"].count_documents({"sentiment": "angry"})
        
        sentiments = [
            {"emoji": "😊", "label": "Mutlu", "count": happy_customers, "pct": round((happy_customers/total_customers*100) if total_customers else 0), "bar": "bg-emerald-500", "sentiment": "happy"},
            {"emoji": "😐", "label": "Nötr", "count": neutral_customers, "pct": round((neutral_customers/total_customers*100) if total_customers else 0), "bar": "bg-gray-500", "sentiment": "neutral"},
            {"emoji": "😠", "label": "Sinirli", "count": angry_customers, "pct": round((angry_customers/total_customers*100) if total_customers else 0), "bar": "bg-red-500", "sentiment": "angry"},
        ]
        
        # 4. Riskli Musteriler (Risk Customers)
        risk_cursor = db["customers"].find({"sentiment": "angry"}).limit(5)
        risk_customers = []
        async for c in risk_cursor:
            initials = "".join([n[0] for n in c.get("name", "X").split()]).upper()[:2]
            risk_customers.append({
                "initials": initials,
                "name": c.get("name"),
                "score": c.get("loyalty_score", 40)
            })

        return {
            "stats": {
                "total_orders": total_orders,
                "delayed_cargo": delayed_cargo,
                "satisfaction": satisfaction_pct,
                "critical_stock": critical_stock
            },
            "latest_orders": latest_orders,
            "sentiments": sentiments,
            "risk_customers": risk_customers
        }
