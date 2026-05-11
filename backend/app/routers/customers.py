from fastapi import APIRouter, Query
from typing import Optional
from app.utils.response import success, error
from app.utils.logger import logger
from app.services.customer_service import CustomerService
from app.models.customer import SentimentUpdate
 
router = APIRouter()
 
 
@router.get("/")
async def get_customers(
    sentiment: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    try:
        customers, total = await CustomerService.get_all(sentiment, limit, skip)
        return success(
            data=customers,
            message="Müşteriler getirildi",
            meta={"total": total, "limit": limit, "skip": skip},
        )
    except Exception as e:
        logger.error(f"Müşteri listesi hatası: {e}")
        return error("FETCH_ERROR", "Müşteriler getirilemedi", status=500)
 
 
@router.get("/stats")
async def get_customer_stats():
    try:
        stats = await CustomerService.get_stats()
        return success(data=stats, message="İstatistikler getirildi")
    except Exception as e:
        logger.error(f"Müşteri istatistik hatası: {e}")
        return error("FETCH_ERROR", "İstatistikler getirilemedi", status=500)
 
 
@router.get("/risk")
async def get_risk_customers():
    try:
        customers = await CustomerService.get_risk_customers()
        return success(data=customers, message="Risk altındaki müşteriler getirildi")
    except Exception as e:
        logger.error(f"Risk müşteri hatası: {e}")
        return error("FETCH_ERROR", "Risk müşterileri getirilemedi", status=500)
 
 
@router.get("/{customer_id}")
async def get_customer(customer_id: str):
    try:
        customer = await CustomerService.get_by_id(customer_id)
        if not customer:
            return error("NOT_FOUND", "Müşteri bulunamadı", status=404)
        return success(data=customer)
    except Exception as e:
        logger.error(f"Müşteri getirme hatası: {e}")
        return error("FETCH_ERROR", "Müşteri getirilemedi", status=500)
 
 
@router.put("/{customer_id}/sentiment")
async def update_sentiment(customer_id: str, body: SentimentUpdate):
    try:
        updated = await CustomerService.update_sentiment(
            customer_id, body.sentiment, body.message_ref
        )
        if not updated:
            return error("NOT_FOUND", "Müşteri bulunamadı", status=404)
        return success(message="Duygu durumu güncellendi")
    except Exception as e:
        logger.error(f"Sentiment güncelleme hatası: {e}")
        return error("UPDATE_ERROR", "Duygu durumu güncellenemedi", status=500)