import asyncio
import io

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
from PIL import Image

from app.core.config import get_settings
from app.main import app

settings = get_settings()


def _sample_image_bytes(size=(400, 400), color=(120, 120, 120)) -> bytes:
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_corrupt_image_bytes_rejected():
    """A file with an image content-type but garbage bytes must fail
    cleanly with a 422, not crash the server."""
    with TestClient(app) as client:
        garbage = b"this is not a real png file, just garbage bytes" * 20
        files = {"file": ("fake.png", garbage, "image/png")}
        response = client.post("/predict", files=files)
        assert response.status_code == 422
        body = response.json()
        assert body["error"] == "InvalidImageError"


def test_truncated_image_rejected():
    """A real PNG header followed by truncated data should fail cleanly."""
    with TestClient(app) as client:
        real_bytes = _sample_image_bytes()
        truncated = real_bytes[: len(real_bytes) // 3]
        files = {"file": ("truncated.png", truncated, "image/png")}
        response = client.post("/predict", files=files)
        assert response.status_code == 422


def test_oversized_file_rejected():
    """A file larger than MAX_UPLOAD_SIZE_MB must be rejected before
    it ever reaches the model."""
    with TestClient(app) as client:
        oversized = b"\x00" * (settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024 + 1)
        files = {"file": ("big.png", oversized, "image/png")}
        response = client.post("/predict", files=files)
        assert response.status_code == 413
        assert response.json()["error"] == "FileTooLargeError"


def test_non_image_content_type_rejected():
    with TestClient(app) as client:
        files = {"file": ("notes.txt", b"hello world", "text/plain")}
        response = client.post("/predict", files=files)
        assert response.status_code == 415
        assert response.json()["error"] == "UnsupportedFileTypeError"


def test_pdf_disguised_as_png_content_type_rejected():
    """Content-type is spoofed as image/png but the bytes are a PDF header
    — preprocessing must still reject it based on actual content."""
    with TestClient(app) as client:
        pdf_bytes = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n1 0 obj\n<< /Type /Catalog >>\nendobj"
        files = {"file": ("disguised.png", pdf_bytes, "image/png")}
        response = client.post("/predict", files=files)
        assert response.status_code == 422


def test_missing_file_field_rejected():
    with TestClient(app) as client:
        response = client.post("/predict")
        assert response.status_code == 422


def test_empty_file_rejected():
    with TestClient(app) as client:
        files = {"file": ("empty.png", b"", "image/png")}
        response = client.post("/predict", files=files)
        assert response.status_code == 422


def test_grayscale_and_rgba_images_are_handled():
    """Real CT exports are sometimes grayscale or have an alpha channel —
    both must be converted to RGB without error."""
    with TestClient(app) as client:
        for mode, color in [("L", 128), ("RGBA", (100, 100, 100, 255))]:
            img = Image.new(mode, (400, 400), color=color)
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            files = {"file": (f"test_{mode}.png", buf.getvalue(), "image/png")}
            response = client.post("/predict", files=files)
            assert response.status_code == 200, f"Failed for mode={mode}"
            assert response.json()["class"] in [
                "Normal",
                "Adenocarcinoma",
                "Squamous cell carcinoma",
                "Large cell carcinoma",
            ]


@pytest.mark.anyio
async def test_concurrent_predictions_do_not_interfere():
    """Fire multiple predictions concurrently and confirm the shared,
    module-level model singleton handles them without errors or
    cross-request data corruption."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        async with app.router.lifespan_context(app):
            image_bytes = _sample_image_bytes()

            async def make_request():
                files = {"file": ("concurrent.png", image_bytes, "image/png")}
                return await client.post("/predict", files=files)

            responses = await asyncio.gather(*[make_request() for _ in range(8)])

            assert all(r.status_code == 200 for r in responses)
            classes = {r.json()["class"] for r in responses}
            # Identical input should yield an identical prediction every time
            # (the model is deterministic at inference time).
            assert len(classes) == 1


@pytest.fixture
def anyio_backend():
    return "asyncio"
