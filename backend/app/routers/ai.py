from fastapi import APIRouter
from bson import ObjectId
from app.database import get_db
from app.utils.response import success, error
from app.utils.logger import logger
from app.services.ai_service import AIService
 
router = APIRouter()
 
 
@router.post("/chat")
async def chat(body: dict):
    try:
        message = body.get("message", "")
        context = body.get("context", {})
 
        if not message:
            return error("INVALID_INPUT", "Mesaj boş olamaz", status=400)
 
        # Intent classification
        intent_result = await AIService.classify_intent(message)
        intent = intent_result.get("intent", "other")
 
        # Duygu analizi
        sentiment_result = await AIService.analyze_sentiment(message)
        sentiment = sentiment_result.get("sentiment", "neutral")
 
        # Sipariş bilgisi ekle (order_query ise)
        if intent == "order_query" and context.get("customer_name"):
            db = get_db()
            order = await db["orders"].find_one(
                {"customer_name": context["customer_name"]},
                sort=[("created_at", -1)]
            )
            if order:
                context["last_order"] = {
                    "order_code": order.get("order_code"),
                    "status": order.get("status"),
                    "tracking_number": order.get("tracking_number"),
                    "cargo_status": order.get("cargo_status"),
                }
 
        # AI yanıtı üret
        reply = await AIService.chat(message, context)
 
        return success(data={
            "reply": reply,
            "sentiment": sentiment,
            "sentiment_confidence": sentiment_result.get("confidence", 0.5),
            "intent": intent,
        })
 
    except Exception as e:
        logger.error(f"Chat hatası: {e}")
        return error("CHAT_ERROR", "Yanıt üretilemedi", status=500)
 
 
@router.post("/sentiment")
async def analyze_sentiment(body: dict):
    try:
        message = body.get("message", "")
        if not message:
            return error("INVALID_INPUT", "Mesaj boş olamaz", status=400)
 
        result = await AIService.analyze_sentiment(message)
        return success(data=result, message="Duygu analizi tamamlandı")
 
    except Exception as e:
        logger.error(f"Sentiment analizi hatası: {e}")
        return error("SENTIMENT_ERROR", "Duygu analizi yapılamadı", status=500)
 
 
@router.post("/report/daily")
async def daily_report():
    try:
        db = get_db()
 
        total_orders = await db["orders"].count_documents({})
        delayed_orders = await db["orders"].count_documents({"status": "delayed"})
        angry_customers = await db["customers"].count_documents({"sentiment": "angry"})
        low_stock = await db["products"].count_documents({"$expr": {"$lte": ["$stock_quantity", "$critical_threshold"]}})
 
        data = {
            "toplam_siparis": total_orders,
            "geciken_siparis": delayed_orders,
            "sinirli_musteri": angry_customers,
            "kritik_stok": low_stock,
        }
 
        report = await AIService.generate_daily_report(data)
 
        # Raporu kaydet (cache zaten varsa insert etme)
        from datetime import datetime, timezone
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        existing = await db["ai_reports"].find_one({
            "report_type": "daily_summary",
            "generated_at": {"$gte": today_start}
        })
        if not existing:
            await db["ai_reports"].insert_one({
                "report_type": "daily_summary",
                "content": report,
                "generated_at": datetime.now(timezone.utc),
                "metadata": data,
            })
 
        return success(data={"report": report, "metadata": data}, message="Günlük rapor oluşturuldu")
 
    except Exception as e:
        logger.error(f"Günlük rapor hatası: {e}")
        return error("REPORT_ERROR", "Rapor oluşturulamadı", status=500)
 
 
@router.get("/report/daily/latest")
async def get_latest_report():
    try:
        db = get_db()
        report = await db["ai_reports"].find_one(
            {"report_type": "daily_summary"},
            sort=[("generated_at", -1)]
        )
        if not report:
            return error("NOT_FOUND", "Rapor bulunamadı", status=404)
 
        report["id"] = str(report["_id"])
        del report["_id"]
        if hasattr(report.get("generated_at"), "isoformat"):
            report["generated_at"] = report["generated_at"].isoformat()
 
        return success(data=report)
 
    except Exception as e:
        logger.error(f"Rapor getirme hatası: {e}")
        return error("FETCH_ERROR", "Rapor getirilemedi", status=500)
 
 
@router.get("/loyalty/{customer_id}")
async def loyalty_analysis(customer_id: str):
    try:
        db = get_db()
 
        # Müşteriyi getir
        customer = await db["customers"].find_one({"_id": ObjectId(customer_id)})
        if not customer:
            return error("NOT_FOUND", "Müşteri bulunamadı", status=404)
 
        # Son siparişleri getir
        cursor = db["orders"].find(
            {"customer_id": customer_id}
        ).sort("created_at", -1).limit(5)
 
        orders = []
        async for o in cursor:
            orders.append({
                "order_code": o.get("order_code"),
                "status": o.get("status"),
                "amount": o.get("amount"),
                "cargo_status": o.get("cargo_status"),
            })
 
        # Gemini ile sadakat analizi yap
        import json
        prompt = f"""
Asagidaki musteri verileri ve siparis gecmisine gore Turkce sadakat analizi yap.
Yalnizca JSON formatinda yanit ver:
{{"loyalty_comment": "kisa yorum", "risk_level": "low|medium|high", "recommendation": "oneri"}}
 
Musteri: {customer.get("name")}
Sadakat Skoru: {customer.get("loyalty_score")}
Duygu Durumu: {customer.get("sentiment")}
Toplam Siparis: {customer.get("total_orders")}
Son Siparisler: {json.dumps(orders, ensure_ascii=False)}
"""
        from app.services.ai_service import _call_with_retry
        from app.services.ai_service import model, _parse_json
        response = await _call_with_retry(model.generate_content, prompt)
        analysis = _parse_json(response.text)
 
        if not analysis:
            analysis = {
                "loyalty_comment": "Analiz yapılamadı",
                "risk_level": "medium",
                "recommendation": "Manuel inceleme önerilir"
            }
 
        return success(data={
            "customer_id": customer_id,
            "customer_name": customer.get("name"),
            "loyalty_score": customer.get("loyalty_score"),
            "sentiment": customer.get("sentiment"),
            "analysis": analysis,
        }, message="Sadakat analizi tamamlandı")
 
    except Exception as e:
        logger.error(f"Sadakat analizi hatası: {e}")
        return error("LOYALTY_ERROR", "Sadakat analizi yapılamadı", status=500)
 
 
@router.get("/cargo-alerts")
async def cargo_alerts():
    try:
        db = get_db()
 
        # Geciken kargoları getir
        cursor = db["orders"].find(
            {"cargo_status": {"$in": ["delayed", "in_transit"]}}
        ).sort("created_at", 1).limit(10)
 
        delayed_orders = []
        async for o in cursor:
            customer = None
            if o.get("customer_id"):
                try:
                    customer = await db["customers"].find_one({"_id": ObjectId(o["customer_id"])})
                except:
                    pass
 
            delayed_orders.append({
                "order_code": o.get("order_code"),
                "customer_name": o.get("customer_name"),
                "customer_sentiment": customer.get("sentiment", "neutral") if customer else "neutral",
                "tracking_number": o.get("tracking_number"),
                "cargo_status": o.get("cargo_status"),
                "estimated_delivery": o.get("estimated_delivery").isoformat() if o.get("estimated_delivery") else None,
            })
 
        if not delayed_orders:
            return success(data={"alerts": [], "summary": "Geciken kargo bulunmuyor."})
 
        # Gemini ile risk değerlendirmesi
        import json
        prompt = f"""
Asagidaki geciken kargo listesini analiz et.
Yalnizca JSON formatinda yanit ver:
{{"summary": "kisa ozet", "high_risk_count": 0, "recommendation": "oneri"}}
 
Geciken Kargolar: {json.dumps(delayed_orders, ensure_ascii=False)}
"""
        from app.services.ai_service import _call_with_retry, model, _parse_json
        response = await _call_with_retry(model.generate_content, prompt)
        analysis = _parse_json(response.text)
 
        if not analysis:
            analysis = {
                "summary": f"{len(delayed_orders)} geciken kargo tespit edildi.",
                "high_risk_count": len(delayed_orders),
                "recommendation": "Müşterilere bildirim gönderilmesi önerilir."
            }
 
        return success(data={
            "alerts": delayed_orders,
            "analysis": analysis,
        }, message="Kargo uyarıları getirildi")
 
    except Exception as e:
        logger.error(f"Kargo uyarı hatası: {e}")
        return error("CARGO_ALERT_ERROR", "Kargo uyarıları getirilemedi", status=500)