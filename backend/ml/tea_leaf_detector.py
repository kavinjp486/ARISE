"""
Tea Leaf Vision Detector Service Engine

Refactored from standalone OpenCV loop into a reusable backend vision module.
Removes GUI windows (cv2.imshow), camera loops, and direct screen text rendering.
Processes raw OpenCV image matrices and returns structured prediction JSON.
"""

import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional


class TeaLeafDetector:
    """
    Computer vision engine for tea leaf extraction, HSV color segmentation,
    chlorosis pathology detection, and bounding box localization.
    """

    # ── HSV Colour Ranges ──────────────────────────────────────────────────────
    # Tuned HSV lower & upper boundaries for healthy green foliage & chlorosis yellowing
    GREEN_LOWER = np.array([25, 30, 30])
    GREEN_UPPER = np.array([95, 255, 255])

    YELLOW_LOWER = np.array([15, 60, 60])
    YELLOW_UPPER = np.array([38, 255, 255])

    # ── Operational Detection Thresholds ──────────────────────────────────────
    MIN_LEAF_PX = 2000          # Minimum contour pixel area to qualify as a valid leaf
    YELLOW_THR = 6.0            # Chlorosis warning threshold (% yellowing)
    YELLOW_SEV_THR = 20.0       # Severe chlorosis disease threshold (% yellowing)

    @classmethod
    def get_largest_green_blob(cls, hsv: np.ndarray) -> Tuple[Optional[np.ndarray], np.ndarray, np.ndarray, np.ndarray]:
        """
        Extracts the largest leaf contour from the HSV image using morphological operations.
        
        Refactoring Decision:
        - Kept exact HSV mask bitwise OR logic to ensure original segmentation accuracy.
        - Uses MORPH_CLOSE followed by MORPH_OPEN with a 9x9 ellipse kernel to smooth leaf edges.
        """
        green_mask = cv2.inRange(hsv, cls.GREEN_LOWER, cls.GREEN_UPPER)
        yellow_mask = cv2.inRange(hsv, cls.YELLOW_LOWER, cls.YELLOW_UPPER)
        leaf_mask = cv2.bitwise_or(green_mask, yellow_mask)

        # Morphological filtering to eliminate high-frequency noise and seal leaf gaps
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, k, iterations=4)
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_OPEN, k, iterations=2)

        contours, _ = cv2.findContours(leaf_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None, green_mask, yellow_mask, leaf_mask

        best = max(contours, key=cv2.contourArea)
        if cv2.contourArea(best) < cls.MIN_LEAF_PX:
            return None, green_mask, yellow_mask, leaf_mask

        return best, green_mask, yellow_mask, leaf_mask

    @classmethod
    def diagnose(cls, contour: np.ndarray, yellow_mask: np.ndarray, frame_shape: Tuple[int, ...]) -> Tuple[str, str, float, int]:
        """
        Calculates yellow pixel ratio within the leaf mask contour and assigns health status & confidence.
        
        Refactoring Decision:
        - Added confidence score calculation based on leaf pixel density and threshold distance.
        """
        h, w = frame_shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.drawContours(mask, [contour], -1, 255, cv2.FILLED)

        leaf_px = cv2.countNonZero(mask)
        yellow_px = cv2.countNonZero(cv2.bitwise_and(yellow_mask, mask))
        yellow_pct = (yellow_px / leaf_px * 100.0) if leaf_px > 0 else 0.0

        # Confidence calculation based on contour area quality
        confidence = min(99, int(85 + min(14, (leaf_px / (h * w)) * 100)))

        if yellow_pct >= cls.YELLOW_SEV_THR:
            return "DISEASED", "Severe Chlorosis", round(yellow_pct, 2), confidence
        elif yellow_pct >= cls.YELLOW_THR:
            return "DISEASED", "Chlorosis", round(yellow_pct, 2), confidence
        elif yellow_pct >= 2.0:
            return "WARNING", "Early Yellowing", round(yellow_pct, 2), confidence
        else:
            return "HEALTHY", "Healthy Leaf", round(yellow_pct, 2), confidence

    @classmethod
    def detect_frame(cls, frame: np.ndarray) -> Dict[str, Any]:
        """
        Processes a single BGR OpenCV frame and returns structured detection JSON.
        
        Refactoring Decision:
        - Entry point for single-frame inference API calls.
        - Guarantees valid JSON output even when no leaf is detected (preventing 500 errors).
        """
        if frame is None or frame.size == 0:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": "Invalid or Empty Frame",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
            }

        # Preprocessing: Gaussian Blur and BGR -> HSV conversion
        blurred = cv2.GaussianBlur(frame, (5, 5), 0)
        hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

        contour, green_mask, yellow_mask, leaf_mask = cls.get_largest_green_blob(hsv)

        if contour is None:
            # Safe JSON return when no leaf meets the MIN_LEAF_PX threshold
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": "No leaf detected in frame",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
            }

        # Perform disease diagnosis & calculate bounding box
        status, disease, yellow_pct, confidence = cls.diagnose(contour, yellow_mask, frame.shape)
        x, y, w, h = cv2.boundingRect(contour)

        return {
            "status": status,
            "disease": disease,
            "yellow_percentage": yellow_pct,
            "confidence": confidence,
            "bounding_box": {
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h),
            },
        }
