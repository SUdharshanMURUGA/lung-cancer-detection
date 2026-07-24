# Pulmo AI — Lung Cancer Detection System

[![Backend CI](https://github.com/SUdharshanMURUGA/lung-cancer-detection/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/SUdharshanMURUGA/lung-cancer-detection/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/SUdharshanMURUGA/lung-cancer-detection/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/SUdharshanMURUGA/lung-cancer-detection/actions/workflows/frontend-ci.yml)

> the badges will start reporting real pass/fail status automatically.


An AI-assisted screening tool that classifies chest CT images into
**Normal**, **Adenocarcinoma**, **Squamous Cell Carcinoma**, or **Large
Cell Carcinoma** using a fine-tuned EfficientNet-B0 model. Inference only —
the model is not retrained by this application.

> Research and educational demonstration only. Not a certified medical
> device. See `frontend/app/privacy/page.tsx` for the full disclaimer.

## Architecture

```
┌─────────────────────┐         HTTPS / JSON          ┌──────────────────────┐
│   Next.js 15 (SPA)   │ ─────────────────────────────▶│   FastAPI backend    │
│   Vercel             │◀───────────────────────────── │   Hugging Face Spaces│
│                       │                                │   (Docker)            │
│  - Landing & info     │                                │  - EfficientNet-B0    │
│  - Predict UI         │                                │    loaded once at     │
│  - History UI         │                                │    startup            │
└─────────────────────┘                                │  - SQLite history DB  │
                                                          └──────────────────────┘
```

- **frontend/** — Next.js 15 / React 19 / TypeScript / Tailwind CSS 4. Deployed to Vercel.
- **backend/** — FastAPI / TensorFlow (via `tf_keras` compatibility layer) / SQLAlchemy. Deployed to Hugging Face Spaces (Docker SDK).

## Quick start (local, no Docker)

**Terminal 1 — backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
API docs: http://localhost:8000/docs

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
App: http://localhost:3000

## Quick start (Docker Compose)

```bash
docker compose up --build
```
Frontend: http://localhost:3000 · Backend: http://localhost:8000

(The `docker-compose.yml` setup is for local development convenience only —
production deployment targets are Vercel for the frontend and Hugging Face
Spaces for the backend, as described below.)

## Repository structure

```
lung-cancer-ai/
├── frontend/          Next.js app — see frontend/README (this file covers both)
├── backend/           FastAPI app — see backend/README.md for API details
├── docker-compose.yml Local full-stack dev convenience
└── README.md          This file
```

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | frontend | Base URL of the FastAPI backend |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `CONTACT_RECIPIENT_EMAIL` | frontend | Contact form email delivery (server-side only) |
| `ALLOWED_ORIGINS` | backend | Comma-separated list of origins allowed by CORS |
| `MODEL_PATH` | backend | Path to the `.h5` model file |
| `DATABASE_URL` | backend | SQLite connection string for prediction history |

Full lists with defaults: `frontend/.env.example`, `backend/.env.example`.

## Model notes

The shipped model (`backend/model/my_model.h5`) is an EfficientNet-B0 with
input shape `350×350×3`, trained externally. This repo performs **inference
only**. It was saved under Keras 2's config format; the backend uses
`tf_keras` (TensorFlow's maintained Keras-2 compatibility package) rather
than pinning to an old TensorFlow release — see `backend/app/ml/model.py`
for the reasoning.

## Screenshots

_Not included yet — this project was built and verified end-to-end via
HTTP/API testing in an environment without a working browser, so no
screenshots were captured during development. Run the app locally (see
Quick start below) and drop images into `docs/screenshots/` — a good set
to capture is the Landing page hero, the Prediction page with a result
card showing the probability chart, and the History page._

## Testing

Full test-set accuracy (95.56% on 315 held-out images), confusion matrix,
per-class metrics, and the API edge-case test suite are documented in
[`docs/TESTING.md`](./docs/TESTING.md).

## Deployment

See the phase-by-phase deployment walkthrough (GitHub → Vercel → Hugging
Face Spaces → env vars → CORS → custom domain) once you're ready to ship —
ask and we'll go through it step by step.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

MIT — see [`LICENSE`](./LICENSE). Note the license does **not** cover the
trained model weights or training data; see the note in the LICENSE file.
