"""
Preprocessing pipeline for CT scan images.

CRITICAL: this must exactly match the preprocessing used when the model
was trained/originally served, otherwise predictions silently degrade.
The reference implementation (Keras `image.load_img` + `img_to_array` +
divide by 255) is reproduced here using Pillow + NumPy so the backend has
no dependency on `tensorflow.keras.preprocessing`, which keeps startup
lighter and avoids pulling in unnecessary TF submodules.
"""
import io

import numpy as np
from PIL import Image, UnidentifiedImageError

from app.core.config import get_settings
from app.exceptions import InvalidImageError

settings = get_settings()


def load_and_preprocess_image(file_bytes: bytes) -> np.ndarray:
    """
    Convert raw uploaded image bytes into a model-ready batch tensor.

    Steps (matching the original working pipeline):
      1. Decode image bytes
      2. Convert to RGB (drops alpha channel / handles grayscale CT exports)
      3. Resize to the model's expected input size (350x350)
      4. Scale pixel values to [0, 1]
      5. Add a batch dimension -> shape (1, 350, 350, 3)

    Raises:
        InvalidImageError: if the bytes cannot be decoded as an image.
    """
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
        # Re-open after verify(); verify() leaves the file object unusable.
        img = Image.open(io.BytesIO(file_bytes))
        img = img.convert("RGB")
    except (UnidentifiedImageError, OSError) as exc:
        raise InvalidImageError("Uploaded file is not a valid image.") from exc

    target_size = (settings.MODEL_INPUT_SIZE, settings.MODEL_INPUT_SIZE)
    img = img.resize(target_size, resample=Image.BILINEAR)

    img_array = np.asarray(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # (1, H, W, C)

    return img_array
