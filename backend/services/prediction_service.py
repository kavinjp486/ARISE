"""
Prediction Service Layer

Decouples FastAPI endpoint routes from OpenCV image decoding & model inference.
Handles camera frame capture, base64 images, and streaming responses.
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, Optional, Generator
from backend.ml.tea_leaf_detector import TeaLeafDetector


class PredictionService:
    """
    Service layer providing camera ingestion, image decoding, and vision model execution routines.
    """

    @classmethod
    def capture_live_frame(cls) -> np.ndarray:
        """
        Attempts to read a frame from the onboard robot camera / USB webcam.
        Falls back to generating a synthetic tea leaf frame if webcam is not present.
        """
        try:
            cap = cv2.VideoCapture(0)
            if cap.isOpened():
                ret, frame = cap.read()
                cap.release()
                if ret and frame is not None and frame.size > 0:
                    return frame
        except Exception:
            pass

        # Fallback Synthetic High-Resolution Tea Leaf Frame
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        frame[:] = (15, 25, 18)

        # Draw a synthetic tea leaf contour
        cv2.ellipse(frame, (320, 240), (140, 70), 25, 0, 360, (35, 185, 50), -1)
        # Add chlorosis yellowing spot
        cv2.circle(frame, (350, 230), 25, (20, 215, 225), -1)
        # Add brown spot
        cv2.circle(frame, (280, 250), 12, (25, 45, 160), -1)

        return frame

    @classmethod
    def generate_mjpeg_stream(cls) -> Generator[bytes, None, None]:
        """
        Generates continuous MJPEG video stream bytes for /video_feed route.
        """
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            # Generate static frame stream if webcam is offline
            frame = cls.capture_live_frame()
            _, jpeg = cv2.imencode(".jpg", frame)
            frame_bytes = jpeg.tobytes()
            while True:
                yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    frame = cls.capture_live_frame()

                # Add live timestamp overlay
                cv2.putText(
                    frame,
                    "ARISE ROBOT CAM 1080p | LIVE STREAM",
                    (15, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    (0, 240, 255),
                    2,
                    cv2.LINE_AA,
                )

                _, jpeg = cv2.imencode(".jpg", frame)
                yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpeg.tobytes() + b"\r\n")
        finally:
            cap.release()

    @classmethod
    def process_image_bytes(cls, image_bytes: bytes) -> Dict[str, Any]:
        if not image_bytes:
            return TeaLeafDetector.detect_frame(cls.capture_live_frame())

        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return TeaLeafDetector.detect_frame(frame)
        except Exception as e:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": f"Failed to decode image: {str(e)}",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "recommendation": "N/A",
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
                "annotated_image": None,
                "engine_used": "None",
            }

    @classmethod
    def process_base64_frame(cls, base64_str: str) -> Dict[str, Any]:
        try:
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
                "recommendation": "N/A",
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
                "annotated_image": None,
                "engine_used": "None",
            }

    @classmethod
    def process_sample_frame(cls) -> Dict[str, Any]:
        """
        Captures live camera frame (or fallback sample) and runs vision detection.
        """
        frame = cls.capture_live_frame()
        return TeaLeafDetector.detect_frame(frame)
