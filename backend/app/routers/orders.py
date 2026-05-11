from fastapi import APIRouter, Query
from typing import Optional
from app.models.order import OrderCreate, OrderUpdate
from app.services import order_service
from app.utils.response import success, error
from app.utils.logger import logger

router = APIRouter()


@router.get("/")
async def get_orders(
    status: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    try:
        orders, total = await order_service.list_orders(status, limit, skip)
        return success(
            data=orders,
            message="Siparisler getirildi",
            meta={"total": total, "limit": limit, "skip": skip},
        )
    except Exception as e:
        logger.error(f"Siparis listesi hatasi: {e}")
        return error("FETCH_ERROR", "Siparisler getirilemedi", status=500)


@router.get("/{order_id}")
async def get_order(order_id: str):
    try:
        order = await order_service.get_order(order_id)
        if not order:
            return error("NOT_FOUND", "Siparis bulunamadi", status=404)
        return success(data=order)
    except Exception as e:
        logger.error(f"Siparis getirme hatasi: {e}")
        return error("FETCH_ERROR", "Siparis getirilemedi", status=500)


@router.post("/", status_code=201)
async def create_order(body: OrderCreate):
    try:
        order = await order_service.create_order(body.model_dump())
        return success(data=order, message="Siparis olusturuldu", status=201)
    except Exception as e:
        logger.error(f"Siparis olusturma hatasi: {e}")
        return error("CREATE_ERROR", "Siparis olusturulamadi", status=500)


@router.put("/{order_id}")
async def update_order(order_id: str, body: OrderUpdate):
    try:
        data = {k: v for k, v in body.model_dump().items() if v is not None}
        updated = await order_service.update_order(order_id, data)
        if not updated:
            return error("NOT_FOUND", "Siparis bulunamadi", status=404)
        return success(data=updated, message="Siparis guncellendi")
    except Exception as e:
        logger.error(f"Siparis guncelleme hatasi: {e}")
        return error("UPDATE_ERROR", "Siparis guncellenemedi", status=500)


@router.delete("/{order_id}")
async def delete_order(order_id: str):
    try:
        deleted = await order_service.delete_order(order_id)
        if not deleted:
            return error("NOT_FOUND", "Siparis bulunamadi", status=404)
        return success(data=None, message="Siparis silindi")
    except Exception as e:
        logger.error(f"Siparis silme hatasi: {e}")
        return error("DELETE_ERROR", "Siparis silinemedi", status=500)
