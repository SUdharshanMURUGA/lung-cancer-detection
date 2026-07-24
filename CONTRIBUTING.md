# Contributing

Thanks for considering a contribution. This is a portfolio-scale project,
so the process is intentionally lightweight.

## Getting set up

Follow the "Quick start" section in the root [`README.md`](./README.md) to
get both services running locally.

## Before opening a PR

**Backend**
```bash
cd backend
pip install -r requirements-dev.txt
pytest tests/ -v
```

**Frontend**
```bash
cd frontend
npm run lint
npm run build
```
Both must pass — the CI workflows in `.github/workflows/` will run these
automatically on your PR, but running them locally first saves a round trip.

## Code style

- **Backend**: type hints on all function signatures, Pydantic models for
  every request/response shape, no business logic inside route handlers
  (keep it in `app/ml/`, `app/db/`, etc.).
- **Frontend**: TypeScript strict mode (already enabled), Tailwind utility
  classes over custom CSS where possible, components stay in
  `components/<domain>/`, not `app/`.

## Reporting issues

Open a GitHub issue with steps to reproduce. For anything related to model
predictions being wrong on a specific image, please attach the image (with
any identifying information removed) so it can be added to the test set.

## What not to contribute

This project explicitly does **not** retrain the model — it's an inference
service. If you have a proposal for a better-performing model, open an
issue to discuss it first rather than submitting a new `.h5` file directly.
