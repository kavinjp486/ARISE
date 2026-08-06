"""
Prediction Service Layer

Decouples FastAPI endpoint routes from OpenCV image decoding & model inference.
Handles raw bytes, base64 images, and fallback sample frame creation.
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, Optional
from backend.ml.tea_leaf_detector import TeaLeafDetector


class PredictionService:
    """
    Service layer providing image decoding and model execution routines.
    """

    @classmethod
    def process_image_bytes(cls, image_bytes: bytes) -> Dict[str, Any]:
        """
        Decodes raw JPEG/PNG image bytes into an OpenCV BGR numpy matrix and runs detection.
        """
        if not image_bytes:
            return TeaLeafDetector.detect_frame(None)

        try:
            # Decode raw byte stream into OpenCV BGR matrix
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return TeaLeafDetector.detect_frame(frame)
        except Exception as e:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": f"Failed to decode image bytes: {str(e)}",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
            }

    @classmethod
    def process_base64_frame(cls, base64_str: str) -> Dict[str, Any]:
        """
        Decodes a base64-encoded image string into an OpenCV BGR matrix and runs detection.
        """
        try:
            # Strip data URI header if present (e.g. data:image/jpeg;base64,...)
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]

            image_bytes = base64.b64decode(base64_str)
            return cls.process_image_bytes(image_bytes)
        except Exception as e:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": f"Invalid base64 payload: {str(e)}",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
            }

    @classmethod
    def process_sample_frame(cls) -> Dict[str, Any]:
        """
        Generates a synthetic green tea leaf frame for automated endpoint testing or zero-input calls.
        """
        # Create 640x480 dark background frame
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        frame[:] = (15, 20, 15)

        # Draw a synthetic green leaf ellipse contour in the center
        cv2.ellipse(frame, (320, 240), (120, 60), 30, 0, 360, (30, 180, 45), -1)
        # Add a slight chlorosis yellow spot to verify detection logic
        cv2.circle(frame, (340, 230), 20, (25, 210, 220), -1)

        return TeaLeafDetector.detect_frame(frame)
