FROM python:3.12-slim

# Prevents Python from writing .pyc files and buffering stdout/stderr,
# which keeps container logs flowing in real time on HF Spaces.
#
# TF_USE_LEGACY_KERAS=1: the shipped model .h5 was saved under an older
# Keras 2 config format (verified during development — Keras 3's
# DepthwiseConv2D deserializer rejects it with an "Unrecognized keyword
# argument: groups" error). `tf_keras` (installed via requirements.txt) is
# TensorFlow's own maintained Keras-2 compatibility shim. This is also set
# in code (app/ml/model.py) so it works without any shell setup on any
# platform — set here too as defense-in-depth for the container.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    TF_USE_LEGACY_KERAS=1

# System libs required by opencv-python-headless and Pillow's image codecs.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hugging Face Spaces (Docker SDK) expects the container to listen on 7860.
ENV PORT=7860
EXPOSE 7860

# Writable data dir for the SQLite history DB (HF Spaces filesystem is
# writable at runtime but resets on rebuild — acceptable for this app).
RUN mkdir -p /code/data

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
