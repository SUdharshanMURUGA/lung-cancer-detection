import io

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app


def _sample_image_bytes() -> bytes:
    img = Image.new("RGB", (400, 400), color=(120, 120, 120))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_predict_returns_valid_shape():
    with TestClient(app) as client:
        files = {"file": ("test.png", _sample_image_bytes(), "image/png")}
        response = client.post("/predict", files=files)
        assert response.status_code == 200
        body = response.json()
        assert body["class"] in [
            "Normal",
            "Adenocarcinoma",
            "Squamous cell carcinoma",
            "Large cell carcinoma",
        ]
        assert 0 <= body["confidence"] <= 100
        assert len(body["probabilities"]) == 4
        assert "risk_level" in body


def test_predict_rejects_bad_content_type():
    with TestClient(app) as client:
        files = {"file": ("test.txt", b"not an image", "text/plain")}
        response = client.post("/predict", files=files)
        assert response.status_code == 415


def test_history_lists_after_predict():
    with TestClient(app) as client:
        files = {"file": ("test.png", _sample_image_bytes(), "image/png")}
        client.post("/predict", files=files)
        response = client.get("/history")
        assert response.status_code == 200
        assert response.json()["total"] >= 1
