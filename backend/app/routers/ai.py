from fastapi import APIRouter
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
 
        # Veritabanından özet verileri topla
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
 
        # Raporu kaydet
        from datetime import datetime
        await db["ai_reports"].insert_one({
            "report_type": "daily_summary",
            "content": report,
            "generated_at": datetime.utcnow(),
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