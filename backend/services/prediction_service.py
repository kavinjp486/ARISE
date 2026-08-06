"""
Prediction Service Layer (Real-Time Live Stream Model Inference)

Runs real-time vision detection directly on the live MJPEG camera feed, drawing
bounding boxes directly onto the stream and updating side metrics data seamlessly.
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, Optional, Generator
from backend.ml.tea_leaf_detector import TeaLeafDetector


class PredictionService:
    """
    Service layer executing real-time detection directly on the live camera stream.
    """

    latest_frame: Optional[np.ndarray] = None
    latest_prediction: Dict[str, Any] = {
        "status": "NO_LEAF_DETECTED",
        "disease": "No leaf detected in camera view",
        "yellow_percentage": 0.0,
        "confidence": 0,
        "recommendation": "Hold any tea leaf or photo in front of camera lens.",
        "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
        "engine_used": "ARISE Binary Vision Engine",
    }

    @classmethod
    def update_latest_frame(cls, frame: np.ndarray):
        if frame is not None and frame.size > 0:
            cls.latest_frame = frame.copy()

    @classmethod
    def get_active_frame(cls) -> np.ndarray:
        if cls.latest_frame is not None and cls.latest_frame.size > 0:
            return cls.latest_frame.copy()

        try:
            cap = cv2.VideoCapture(0)
            if cap.isOpened():
                ret, frame = cap.read()
                cap.release()
                if ret and frame is not None and frame.size > 0:
                    cls.update_latest_frame(frame)
                    return frame
        except Exception:
            pass

        # Fallback synthetic frame if webcam is offline
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        frame[:] = (15, 25, 18)
        cv2.ellipse(frame, (320, 240), (140, 70), 25, 0, 360, (35, 185, 50), -1)
        cv2.circle(frame, (350, 230), 25, (20, 215, 225), -1)
        return frame

    @classmethod
    def generate_mjpeg_stream(cls) -> Generator[bytes, None, None]:
        """
        Generates live MJPEG video stream bytes for /video_feed route with
        real-time bounding box overlays drawn directly on every video frame.
        """
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            frame = cls.get_active_frame()
            prediction = TeaLeafDetector.detect_frame(frame)
            cls.latest_prediction = prediction
            annotated = TeaLeafDetector.draw_live_stream_overlay(frame, prediction)
            _, jpeg = cv2.imencode(".jpg", annotated)
            frame_bytes = jpeg.tobytes()
            while True:
                yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")

        try:
            while True:
                ret, frame = cap.read()
                if not ret or frame is None:
                    frame = cls.get_active_frame()
                else:
                    cls.update_latest_frame(frame)

                # Run real-time vision detection directly on live camera frame
                prediction = TeaLeafDetector.detect_frame(frame)
                cls.latest_prediction = prediction

                # Draw bounding box and health badge directly on live webcam video feed
                annotated = TeaLeafDetector.draw_live_stream_overlay(frame, prediction)

                _, jpeg = cv2.imencode(".jpg", annotated)
                yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpeg.tobytes() + b"\r\n")
        finally:
            cap.release()

    @classmethod
    def process_image_bytes(cls, image_bytes: bytes) -> Dict[str, Any]:
        if not image_bytes:
            return cls.latest_prediction

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
                "engine_used": "None",
            }

    @classmethod
    def process_sample_frame(cls) -> Dict[str, Any]:
        """
        Returns the latest live stream prediction result for side metrics panels.
        """
        if cls.latest_frame is not None:
            cls.latest_prediction = TeaLeafDetector.detect_frame(cls.latest_frame)
        return cls.latest_prediction
