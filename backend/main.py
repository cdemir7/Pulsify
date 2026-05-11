from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import connect_db, close_db, create_indexes
from app.utils.logger import logger
from app.utils.response import error


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    await create_indexes()
    yield
    await close_db()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Pulsify API",
        description="KOBİ AI Asistanı Backend",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return error("INTERNAL_ERROR", "Sunucu hatasi olustu", status=500)

    # Routers buraya eklenecek (Adım 1.5+)
    # from app.routers import orders, customers, cargo, ai
    # app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
    # app.include_router(customers.router, prefix="/api/customers", tags=["customers"])
    # app.include_router(cargo.router, prefix="/api/cargo", tags=["cargo"])
    # app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

    @app.get("/", tags=["health"])
    async def root():
        return {"success": True, "message": "Pulsify API çalışıyor", "version": "1.0.0"}

    @app.get("/health", tags=["health"])
    async def health():
        return {"success": True, "status": "ok"}

    return app


app = create_app()
