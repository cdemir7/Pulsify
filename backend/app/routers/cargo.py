from fastapi import APIRouter, Query
from typing import Optional
from app.utils.response import success, error
from app.utils.logger import logger
from app.services.cargo_service import CargoService
from app.services.notification_service import NotificationService
from app.database import get_db
from bson import ObjectId

router = APIRouter()


@router.get("/")
async def get_cargo(
    cargo_status: Optional[str] = Query(None, description="not_shipped | in_transit | delayed | delivered"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    try:
        orders, total = await CargoService.get_all(cargo_status, limit, skip)
        return success(
            data=orders,
            message="Kargo listesi getirildi",
            meta={"total": total, "limit": limit, "skip": skip},
        )
    except Exception as e:
        logger.error(f"Kargo listesi hatasi: {e}")
        return error("FETCH_ERROR", "Kargo listesi getirilemedi", status=500)


@router.get("/stats")
async def get_cargo_stats():
    try:
        stats = await CargoService.get_stats()
        return success(data=stats, message="Kargo istatistikleri getirildi")
    except Exception as e:
        logger.error(f"Kargo istatistik hatasi: {e}")
        return error("FETCH_ERROR", "Istatistikler getirilemedi", status=500)


@router.get("/delayed")
async def get_delayed_cargo():
    try:
        delayed = await CargoService.get_delayed()
        return success(
            data=delayed,
            message=f"{len(delayed)} geciken kargo bulundu",
            meta={"count": len(delayed)},
        )
    except Exception as e:
        logger.error(f"Geciken kargo hatasi: {e}")
        return error("FETCH_ERROR", "Geciken kargolar getirilemedi", status=500)


@router.get("/ai-triage")
async def get_ai_triage():
    try:
        triage = await CargoService.ai_triage()
        return success(
            data=triage,
            message="AI Triyaj listesi hazirlandi",
            meta={"count": len(triage)}
        )
    except Exception as e:
        logger.error(f"AI Triyaj hatasi: {e}")
        return error("FETCH_ERROR", "AI Triyaj listesi hazirlanamadi", status=500)

@router.get("/ai-insight")
async def get_ai_insight():
    try:
        insight_text = await CargoService.get_ai_insight()
        return success(
            data={"insight": insight_text},
            message="CEO Ozeti uretildi"
        )
    except Exception as e:
        logger.error(f"AI Insight hatasi: {e}")
        return error("FETCH_ERROR", "AI Ozeti hazirlanamadi", status=500)


@router.put("/{order_id}")
async def update_cargo_status(order_id: str, body: dict):
    try:
        cargo_status = body.get("cargo_status")
        if not cargo_status:
            return error("VALIDATION_ERROR", "cargo_status zorunludur", status=400)

        valid_statuses = ["not_shipped", "in_transit", "delayed", "delivered"]
        if cargo_status not in valid_statuses:
            return error(
                "VALIDATION_ERROR",
                f"Gecersiz durum. Gecerli degerler: {valid_statuses}",
                status=400,
            )

        updated = await CargoService.update_status(
            order_id,
            cargo_status,
            cargo_company=body.get("cargo_company"),
            tracking_number=body.get("tracking_number"),
        )
        if not updated:
            return error("NOT_FOUND", "Siparis bulunamadi", status=404)

        return success(data=updated, message="Kargo durumu guncellendi")
    except Exception as e:
        logger.error(f"Kargo guncelleme hatasi: {e}")
        return error("UPDATE_ERROR", "Kargo durumu guncellenemedi", status=500)


@router.post("/{order_id}/notify")
async def notify_customer(order_id: str):
    try:
        db = get_db()
        order = await db["orders"].find_one({"_id": ObjectId(order_id)})
        
        if not order:
            return error("NOT_FOUND", "Siparis bulunamadi", status=404)

        customer_name = order.get("customer_name", "Müşteri")
        tracking = order.get("tracking_number", "Bilinmiyor")
        target_chat_id = order.get("telegram_chat_id")

        message = (
            f"Sayın {customer_name} iyi günler dileriz,\n\n"
            f"{tracking} numaralı kargonuzla alakalı Pulsify olarak yaşadığınız mağduriyetin farkındayız. "
            f"Mağduriyetinizi gidermek için elimizden geleni yapıyoruz. Ekibimiz durumla ilgili bilgilendirildi."
        )

        success_sent = await NotificationService.send_telegram_message(message, chat_id=target_chat_id)
        if success_sent:
            from datetime import datetime
            await db["orders"].update_one(
                {"_id": ObjectId(order_id)},
                {"$set": {"last_notified_at": datetime.utcnow()}}
            )
            return success(message="Musteriye Telegram uzerinden bildirim gonderildi")
        else:
            return error("NOTIFICATION_FAILED", "Bildirim gonderilemedi", status=500)
    except Exception as e:
        logger.error(f"Bildirim gonderme hatasi: {e}")
        return error("NOTIFICATION_ERROR", "Bildirim isleminde hata olustu", status=500)
