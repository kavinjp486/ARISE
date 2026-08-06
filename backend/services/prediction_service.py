"""
Prediction Service Layer (Background Threaded Vision Engine)

Runs continuous background webcam capture & vision detection in a dedicated thread.
Provides non-blocking MJPEG video streaming (/video_feed) and instant prediction response (/predict).
"""

import base64
import cv2
import numpy as np
import threading
import time
from typing import Dict, Any, Optional, Generator
from backend.ml.tea_leaf_detector import TeaLeafDetector


class PredictionService:
    """
    Service layer executing real-time background webcam capture and model detection.
    """

    _thread: Optional[threading.Thread] = None
    _running: bool = False
    _lock = threading.Lock()

    latest_frame: Optional[np.ndarray] = None
    latest_jpeg: Optional[bytes] = None
    latest_prediction: Dict[str, Any] = {
        "status": "NO_LEAF_DETECTED",
        "disease": "Searching for leaf...",
        "yellow_percentage": 0.0,
        "confidence": 0,
        "recommendation": "Hold any tea leaf or leaf photo in front of camera lens.",
        "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
        "engine_used": "ARISE Binary Vision Engine",
    }

    @classmethod
    def start_camera_thread(cls):
        """
        Starts dedicated background camera thread if not already running.
        """
        with cls._lock:
            if cls._running:
                return
            cls._running = True
            cls._thread = threading.Thread(target=cls._camera_loop, daemon=True)
            cls._thread.start()

    @classmethod
    def _camera_loop(cls):
        """
        Continuous background thread loop reading webcam frames, running vision detection,
        and updating shared JPEG bytes and prediction JSON.
        """
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            # Fallback synthetic frame loop if webcam is unavailable
            synthetic_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            synthetic_frame[:] = (15, 25, 18)
            cv2.ellipse(synthetic_frame, (320, 240), (140, 70), 25, 0, 360, (35, 185, 50), -1)
            cv2.circle(synthetic_frame, (350, 230), 25, (20, 215, 225), -1)

            prediction = TeaLeafDetector.detect_frame(synthetic_frame)
            annotated = TeaLeafDetector.draw_live_stream_overlay(synthetic_frame, prediction)
            _, jpeg = cv2.imencode(".jpg", annotated)
            cls.latest_jpeg = jpeg.tobytes()
            cls.latest_prediction = prediction
            return

        try:
            while cls._running:
                ret, frame = cap.read()
                if ret and frame is not None and frame.size > 0:
                    cls.latest_frame = frame.copy()

                    # Run real-time vision detection directly on live webcam frame
                    prediction = TeaLeafDetector.detect_frame(frame)
                    cls.latest_prediction = prediction

                    # Draw bounding box and health status overlay on live webcam stream
                    annotated = TeaLeafDetector.draw_live_stream_overlay(frame, prediction)
                    _, jpeg = cv2.imencode(".jpg", annotated)
                    cls.latest_jpeg = jpeg.tobytes()
                else:
                    time.sleep(0.05)

                time.sleep(0.033)  # ~30 FPS
        finally:
            cap.release()

    @classmethod
    def generate_mjpeg_stream(cls) -> Generator[bytes, None, None]:
        """
        Generates non-blocking MJPEG video stream bytes for /video_feed route.
        """
        cls.start_camera_thread()

        while True:
            if cls.latest_jpeg is not None:
                yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + cls.latest_jpeg + b"\r\n")
            time.sleep(0.04)

    @classmethod
    def process_sample_frame(cls) -> Dict[str, Any]:
        """
        Returns the latest live stream prediction result instantly (<1ms).
        """
        cls.start_camera_thread()
        if cls.latest_frame is not None:
            cls.latest_prediction = TeaLeafDetector.detect_frame(cls.latest_frame)
        return cls.latest_prediction

    @classmethod
    def process_image_bytes(cls, image_bytes: bytes) -> Dict[str, Any]:
        if not image_bytes:
            return cls.process_sample_frame()

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
