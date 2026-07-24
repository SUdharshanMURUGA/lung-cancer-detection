from fastapi.testclient import TestClient

from app.main import app


def test_health_check():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        assert body["model_loaded"] is True


def test_version():
    with TestClient(app) as client:
        response = client.get("/version")
        assert response.status_code == 200
        body = response.json()
        assert body["model_input_size"] == 350
        assert len(body["classes"]) == 4
