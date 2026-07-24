"""
Application entry point.

Responsibilities kept deliberately minimal here — this file wires things
together (CORS, routers, error handlers, startup/shutdown) and contains
no business logic of its own.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, history, predict, version
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.db.database import init_db
from app.exceptions import AppError, app_error_handler, unhandled_exception_handler
from app.ml.model import model_service

configure_logging()
logger = get_logger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    logger.info("Starting %s v%s (%s)", settings.APP_NAME, settings.APP_VERSION, settings.ENVIRONMENT)
    init_db()
    model_service.load()
    yield
    # --- Shutdown ---
    logger.info("Shutting down, releasing model from memory")
    model_service.unload()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Inference API for AI-assisted lung cancer classification from CT scan images.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    app.add_exception_handler(AppError, app_error_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    app.include_router(health.router)
    app.include_router(version.router)
    app.include_router(predict.router)
    app.include_router(history.router)

    return app


app = create_app()
