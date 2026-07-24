---
title: Lung Cancer Detection API
emoji: 🫁
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Lung Cancer Detection API

FastAPI inference backend for the AI Lung Cancer Detection System. Serves
predictions from a pretrained EfficientNet-B0 model (inference only — this
service does not train or fine-tune the model).

## Endpoints

| Method | Path             | Description                              |
|--------|------------------|-------------------------------------------|
| GET    | `/health`        | Liveness + model-loaded status            |
| GET    | `/version`       | API + model metadata                      |
| POST   | `/predict`       | Upload a CT scan image, get a prediction  |
| GET    | `/history`       | List past predictions                     |
| DELETE | `/history/{id}`  | Delete a past prediction record           |

### Example: `/predict` response

```json
{
  "class": "Normal",
  "confidence": 98.45,
  "prediction_time": "0.24 sec",
  "risk_level": "Low",
  "description": "No radiographic features associated with malignant lung tissue were detected in this scan.",
  "probabilities": [
    { "class_name": "Normal", "probability": 98.45 },
    { "class_name": "Adenocarcinoma", "probability": 0.9 },
    { "class_name": "Squamous cell carcinoma", "probability": 0.4 },
    { "class_name": "Large cell carcinoma", "probability": 0.25 }
  ]
}
```

## Local development

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

On Windows PowerShell, use `.venv\Scripts\Activate.ps1` instead of `source .venv/bin/activate`. No platform-specific environment variable setup is needed — the Keras compatibility flag is set in code (`app/ml/model.py`), not the shell.

API docs available at `http://localhost:8000/docs`.

## Model file

`model/my_model.h5` (~49MB) must be present for the app to start. It is
committed directly to the repo (under GitHub's 100MB hard limit, so no Git
LFS required, though LFS is a reasonable choice if the model grows).

## Deployment (Hugging Face Spaces)

This repo's `README.md` YAML header configures the Space as a Docker SDK
app listening on port 7860 — no manual Space configuration needed beyond
pushing this folder as the Space's contents.
