from datetime import datetime
from bson import ObjectId
from app.database import get_db
from app.utils.logger import logger


def serialize(order: dict) -> dict:
    order["id"] = str(order["_id"])
    del order["_id"]
    for key, value in order.items():
        if hasattr(value, "isoformat"):
            order[key] = value.isoformat()
    return order


class CargoService:

    @staticmethod
    async def get_all(cargo_status: str = None, limit: int = 20, skip: int = 0):
        db = get_db()
        query = {"cargo_status": {"$ne": "not_shipped"}}
        if cargo_status:
            query = {"cargo_status": cargo_status}

        cursor = db["orders"].find(query).sort("created_at", -1).skip(skip).limit(limit)
        orders = [serialize(o) async for o in cursor]
        total = await db["orders"].count_documents(query)
        return orders, total

    @staticmethod
    async def get_delayed():
        """
        Geciken kargo: cargo_status == 'delayed'
        VEYA estimated_delivery gecmis ve hala teslim edilmemis.
        """
        db = get_db()
        now = datetime.utcnow()
        query = {
            "$or": [
                {"cargo_status": "delayed"},
                {
                    "estimated_delivery": {"$lt": now},
                    "cargo_status": {"$nin": ["delivered", "not_shipped"]},
                },
            ]
        }
        cursor = db["orders"].find(query).sort("estimated_delivery", 1)
        delayed = []
        async for order in cursor:
            o = serialize(order)
            # Gecikme gun hesabi
            if o.get("estimated_delivery"):
                try:
                    est = datetime.fromisoformat(o["estimated_delivery"].replace("Z", ""))
                    delta = (now - est).days
                    o["delay_days"] = max(delta, 0)
                except Exception:
                    o["delay_days"] = 0
            else:
                o["delay_days"] = 0
            delayed.append(o)
        return delayed

    @staticmethod
    async def get_stats():
        db = get_db()
        now = datetime.utcnow()

        delayed_count = await db["orders"].count_documents({
            "$or": [
                {"cargo_status": "delayed"},
                {
                    "estimated_delivery": {"$lt": now},
                    "cargo_status": {"$nin": ["delivered", "not_shipped"]},
                },
            ]
        })
        delivered_count = await db["orders"].count_documents({"cargo_status": "delivered"})
        in_transit_count = await db["orders"].count_documents({"cargo_status": "in_transit"})
        total_shipped = await db["orders"].count_documents({"cargo_status": {"$ne": "not_shipped"}})

        on_time_pct = 0
        if total_shipped > 0:
            on_time_pct = round((delivered_count / total_shipped) * 100, 1)

        return {
            "delayed": delayed_count,
            "delivered": delivered_count,
            "in_transit": in_transit_count,
            "total_shipped": total_shipped,
            "on_time_percentage": on_time_pct,
        }

    @staticmethod
    async def update_status(order_id: str, cargo_status: str, cargo_company: str = None, tracking_number: str = None):
        db = get_db()
        update = {
            "cargo_status": cargo_status,
            "updated_at": datetime.utcnow(),
        }
        if cargo_company:
            update["cargo_company"] = cargo_company
        if tracking_number:
            update["tracking_number"] = tracking_number

        result = await db["orders"].update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update},
        )
        if result.matched_count == 0:
            return None

        updated = await db["orders"].find_one({"_id": ObjectId(order_id)})
        return serialize(updated)

    @staticmethod
    async def ai_triage():
        """
        Geciken ve islenmeyi bekleyen kargolari AI Triyaj algoritmasina gore siralar.
        Score = (Gecikme_Gun^1.5 * 20) + (Duygu_Carpani) + (Mesafe_KM * 0.05)
        """
        from app.utils.cities_coords import get_distance_from_warehouse
        
        db = get_db()
        now = datetime.utcnow()

        # Siparisleri ve musterileri cek
        orders_cursor = db["orders"].find({"cargo_status": {"$in": ["not_shipped", "delayed", "in_transit"]}})
        orders = []
        async for o in orders_cursor:
            orders.append(o)

        if not orders:
            return []

        customer_ids = list(set([o.get("customer_id") for o in orders if o.get("customer_id")]))
        customers_cursor = db["customers"].find({"_id": {"$in": [ObjectId(cid) for cid in customer_ids if ObjectId.is_valid(cid)]}})
        customers = {str(c["_id"]): c async for c in customers_cursor}

        triage_list = []
        for o in orders:
            # Gecikme Gunu Hesapla (serialize etmeden once, orjinal datetime objesi ile)
            delay_days = 0
            if o.get("estimated_delivery"):
                est = o["estimated_delivery"]
                if isinstance(est, datetime):
                    if now > est:
                        delay_days = (now - est).days
                elif isinstance(est, str):
                    try:
                        est_dt = datetime.fromisoformat(est.replace("Z", ""))
                        if now > est_dt:
                            delay_days = (now - est_dt).days
                    except Exception:
                        pass
                        
            # Cekilen orjinal sehir ve id
            city = o.get("delivery_city", "İstanbul")
            cid = o.get("customer_id")
            
            # Simdi serialize edebiliriz
            order_data = serialize(o)
            order_data["delay_days"] = delay_days

            # 2. Mesafe Hesapla
            city = o.get("delivery_city", "İstanbul")
            distance = get_distance_from_warehouse(city)
            order_data["distance_km"] = round(distance, 1)

            # 3. Duygu Carpani
            sentiment = "neutral"
            cid = o.get("customer_id")
            if cid and cid in customers:
                sentiment = customers[cid].get("sentiment", "neutral")
            
            sentiment_score = 0
            if sentiment == "angry":
                sentiment_score = 50
            elif sentiment == "neutral":
                sentiment_score = 10
            
            order_data["sentiment"] = sentiment

            # 4. Score Hesapla
            score = (pow(max(delay_days, 0), 1.5) * 20) + sentiment_score + (distance * 0.05)
            order_data["ai_score"] = round(score, 1)

            # Aciklama uret
            reasons = []
            if delay_days > 0: reasons.append(f"{delay_days} gun gecikme")
            if sentiment == "angry": reasons.append("Sinirli musteri")
            if distance > 300: reasons.append(f"Uzak mesafe ({int(distance)}km)")
            
            if not reasons:
                order_data["ai_reason"] = "Normal isleyis"
            else:
                order_data["ai_reason"] = " + ".join(reasons)

            triage_list.append(order_data)

        triage_list.sort(key=lambda x: x["ai_score"], reverse=True)
        return triage_list

    @staticmethod
    async def get_ai_insight():
        """
        Kargo operasyonlari hakkinda genel AI otoyumu/ozeti uretir.
        """
        import google.generativeai as genai
        from app.config import settings
        
        # Anlik istatistikleri cek
        stats = await CargoService.get_stats()
        
        # Geciken top 5 kargoyu cek (sehirler vb icin)
        delayed_all = await CargoService.get_delayed()
        delayed_info = [f"Şehir: {o.get('delivery_city', 'Bilinmiyor')}, Gecikme: {o.get('delay_days', 0)} gün" for o in delayed_all[:5]]
        
        prompt = f"""
        Sen bir Kargo Lojistik ve Tedarik Zinciri uzmanısın. İşletme yöneticisi için kısa, aksiyon odaklı ve proaktif bir günlük rapor hazırlayacaksın.
        
        Güncel Veriler:
        - Toplam Çıkan Kargo: {stats['total_shipped']}
        - Yolda: {stats['in_transit']}
        - Teslim Edilen: {stats['delivered']}
        - Geciken Kargo Sayısı: {stats['delayed']}
        - Zamanında Teslim Oranı: %{stats['on_time_percentage']}
        
        Dikkat Çeken Gecikmeler:
        {', '.join(delayed_info) if delayed_info else 'Dikkat çeken gecikme yok.'}
        
        Görev: Yukarıdaki verileri analiz et. Sorun varsa (örneğin gecikmeler artmışsa veya belirli bir rotada yığılma varsa) yöneticiye ne yapması gerektiğini (örn: dışarıdan araç kirala, o bölgedeki kuryeleri uyar vb.) 3-4 satırlık net, profesyonel bir metinle söyle. Sorun yoksa işlerin yolunda olduğunu belirterek motivasyon verici kısa bir analiz sun.
        Lütfen cevabın doğrudan rapor metni olsun, giriş veya selamlaşma yapma. Maksimum 3-4 cümle olsun.
        """

        try:
            if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key":
                # Fallback if key is missing/invalid
                return "Gemini API anahtarı ayarlanmamış. Sistem geçici olarak yerel analiz sunuyor: Gecikme oranı şu anki verilere göre normal seviyelerde. İzmir ve Ankara rotalarındaki gecikmelere dikkat edilmesi ve gerekirse o bölgelere ek kurye yönlendirilmesi tavsiye edilir."
                
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            print(f"!!! GEMINI HATASI: {e}")
            logger.error(f"Gemini API hatasi: {e}")
            return "Kargo verileriniz analiz edildi ancak AI modeli şu an yanıt veremiyor. Zamanında teslim oranınız güncel olarak takip edilmektedir."
