"""
Custom exceptions and their global handlers.

Registering handlers centrally (in main.py, pointing here) means every
route gets consistent, structured JSON error responses instead of each
route needing its own try/except boilerplate.
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


class AppError(Exception):
    """Base class for all application-raised errors."""

    status_code: int = status.HTTP_400_BAD_REQUEST
    default_message: str = "An unexpected error occurred."

    def __init__(self, message: str | None = None):
        self.message = message or self.default_message
        super().__init__(self.message)


class InvalidImageError(AppError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_message = "The uploaded file could not be read as a valid image."


class UnsupportedFileTypeError(AppError):
    status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    default_message = "Unsupported file type. Please upload a PNG or JPEG image."


class FileTooLargeError(AppError):
    status_code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    default_message = "Uploaded file exceeds the maximum allowed size."


class ModelNotLoadedError(AppError):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_message = "The prediction model is not currently available. Please try again shortly."


class RecordNotFoundError(AppError):
    status_code = status.HTTP_404_NOT_FOUND
    default_message = "The requested record was not found."


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    logger.warning("Handled application error: %s (%s)", exc.message, request.url.path)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.__class__.__name__, "detail": exc.message},
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "detail": "Something went wrong while processing your request.",
        },
    )
