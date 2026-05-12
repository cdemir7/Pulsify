from fastapi import APIRouter
from app.utils.response import success, error
from app.services.dashboard_service import DashboardService
from app.utils.logger import logger

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary():
    try:
        data = await DashboardService.get_summary()
        return success(data=data, message="Dashboard ozeti getirildi")
    except Exception as e:
        logger.error(f"Dashboard hatasi: {e}")
        return error("FETCH_ERROR", "Dashboard verileri getirilemedi", status=500)
