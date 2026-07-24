"""
Centralized logging configuration.

Keeping this in one place means every module gets consistently formatted
logs, and the log level can be controlled with a single environment
variable (LOG_LEVEL) without touching application code.
"""
import logging
import sys

from app.core.config import get_settings

_configured = False


def configure_logging() -> None:
    """Idempotent logging setup — safe to call multiple times."""
    global _configured
    if _configured:
        return

    settings = get_settings()
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Quiet down noisy third-party loggers unless we're in DEBUG.
    if level > logging.DEBUG:
        logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
        logging.getLogger("tensorflow").setLevel(logging.ERROR)

    _configured = True


def get_logger(name: str) -> logging.Logger:
    configure_logging()
    return logging.getLogger(name)
