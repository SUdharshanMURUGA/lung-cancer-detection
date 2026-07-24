# Testing Report

Generated as part of Phase 6. Two kinds of testing were performed:
1. **Model accuracy** — the full held-out test set run through the actual backend inference pipeline (not a mock, not a sample).
2. **API robustness** — the `pytest` suite (`backend/tests/`), covering the happy path plus adversarial and concurrency edge cases.

## 1. Full test-set accuracy

Run against all 315 images in `test/` (the complete held-out set, not a
sample), through `app.ml.model.ModelService` + `app.ml.preprocess`, i.e.
the exact code path the API uses.

**Overall accuracy: 301 / 315 = 95.56%**

### Confusion matrix (rows = actual, columns = predicted)

| Actual \ Predicted | Normal | Adenocarcinoma | Squamous | Large Cell |
|---|---:|---:|---:|---:|
| **Normal** (n=54) | 53 | 1 | 0 | 0 |
| **Adenocarcinoma** (n=120) | 0 | 112 | 4 | 4 |
| **Squamous cell carcinoma** (n=90) | 0 | 2 | 85 | 3 |
| **Large cell carcinoma** (n=51) | 0 | 0 | 0 | 51 |

### Per-class metrics

| Class | Precision | Recall | F1 | n |
|---|---:|---:|---:|---:|
| Normal | 100.00% | 98.15% | 99.07% | 54 |
| Adenocarcinoma | 97.39% | 93.33% | 95.32% | 120 |
| Squamous cell carcinoma | 95.51% | 94.44% | 94.97% | 90 |
| Large cell carcinoma | 87.93% | 100.00% | 93.58% | 51 |

### Inference performance

- Mean: **202ms** per image
- Max: 686ms (cold-ish outlier, likely first request after a GC pause)
- Total wall time for all 315 images (sequential, single process): 69.3s

### Reading these results honestly

- **No false negatives from any cancer class into "Normal"** — the
  confusion matrix's entire "Normal" column outside row 1 is zero. In a
  screening context this is the error mode that matters most, and the
  model doesn't make it on this test set.
- **Large Cell Carcinoma has 100% recall but only 88% precision** — the
  model over-predicts this class, pulling in some Adenocarcinoma and
  Squamous cases (4 + 3 = 7 misclassifications land here). Practically:
  a "Large Cell Carcinoma" result deserves slightly more scrutiny than
  its confidence score alone suggests.
- **Adenocarcinoma ↔ Squamous is the model's main confusion pair** (4 + 2
  = 6 cases), which lines up with how these two subtypes are also the
  hardest pair for human radiologists to distinguish from imaging alone.
- 315 images is a reasonable sample for a portfolio-grade demonstration,
  but it is **not** a clinical validation study — real deployment would
  need a much larger, prospectively-collected test set and a proper
  statistical confidence interval on these numbers.

## 2. API test suite

`backend/tests/` — 14 tests, all passing:

**Happy path** (`test_health.py`, `test_predict.py`)
- Health and version endpoints
- Valid prediction returns the correct response shape
- History reflects a prediction after it's made

**Edge cases** (`test_edge_cases.py`)
- Corrupt image bytes with a valid content-type → clean 422, not a crash
- Truncated/partial image data → clean 422
- Oversized upload (>10MB) → rejected at 413 before touching the model
- Non-image content-type (`text/plain`) → 415
- **PDF bytes disguised with an `image/png` content-type** → still rejected 422, because validation checks actual decoded content, not just the declared MIME type
- Missing file field, empty file → 422
- Grayscale and RGBA images (common in real CT exports) → correctly converted to RGB and processed without error
- **8 concurrent requests** against the shared, module-level model singleton → all succeed, and identical input produces identical output every time (confirms no cross-request state leakage)

Run it yourself:
```bash
cd backend
pip install -r requirements-dev.txt
pytest tests/ -v
```

## What Phase 6 does not cover

- Browser-based UI/visual testing (no working browser was available in the
  build sandbox — see the Phase 5 note). Worth a manual pass once you run
  the app locally.
- Load testing beyond 8 concurrent requests — fine for a portfolio demo,
  not a substitute for real load testing before any production traffic.
- Cross-browser/device testing of the frontend.
