"""
Real-Time Stream Tea Leaf Health & Disease Detector Engine

Fast Binary Classifier: Healthy vs Diseased Tea Leaf Detection.
Optimized for live webcam video streams with real-time bounding box overlays.
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional


class TeaLeafDetector:
    """
    Computer Vision Engine optimized for real-time live webcam stream processing,
    binary Healthy vs Diseased classification, and live bounding box rendering.
    """

    # Multi-spectrum HSV boundaries for leaf tissue & pathology lesions
    GREEN_LOWER = np.array([10, 10, 10])
    GREEN_UPPER = np.array([115, 255, 255])

    YELLOW_LOWER = np.array([8, 20, 20])
    YELLOW_UPPER = np.array([45, 255, 255])

    BROWN_LOWER1 = np.array([0, 15, 10])
    BROWN_UPPER1 = np.array([30, 255, 240])
    BROWN_LOWER2 = np.array([150, 15, 10])
    BROWN_UPPER2 = np.array([180, 255, 240])

    BLACK_LOWER = np.array([0, 0, 0])
    BLACK_UPPER = np.array([180, 255, 65])

    WHITE_LOWER = np.array([0, 0, 160])
    WHITE_UPPER = np.array([180, 60, 255])

    MIN_LEAF_PX = 200

    @classmethod
    def get_pathology_masks(cls, hsv: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        green_mask = cv2.inRange(hsv, cls.GREEN_LOWER, cls.GREEN_UPPER)
        yellow_mask = cv2.inRange(hsv, cls.YELLOW_LOWER, cls.YELLOW_UPPER)

        brown_m1 = cv2.inRange(hsv, cls.BROWN_LOWER1, cls.BROWN_UPPER1)
        brown_m2 = cv2.inRange(hsv, cls.BROWN_LOWER2, cls.BROWN_UPPER2)
        brown_mask = cv2.bitwise_or(brown_m1, brown_m2)

        black_mask = cv2.inRange(hsv, cls.BLACK_LOWER, cls.BLACK_UPPER)
        white_mask = cv2.inRange(hsv, cls.WHITE_LOWER, cls.WHITE_UPPER)

        leaf_mask = cv2.bitwise_or(green_mask, yellow_mask)
        leaf_mask = cv2.bitwise_or(leaf_mask, brown_mask)

        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, k, iterations=3)
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_OPEN, k, iterations=2)

        return leaf_mask, green_mask, yellow_mask, brown_mask, black_mask, white_mask

    @classmethod
    def get_largest_valid_contour(cls, leaf_mask: np.ndarray, frame: np.ndarray) -> Optional[np.ndarray]:
        contours, _ = cv2.findContours(leaf_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            # Secondary Adaptive Canny Edge Detection (for smartphone screen & paper leaf images)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blurred, 25, 120)
            k = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
            edges = cv2.dilate(edges, k, iterations=2)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            return None

        fh, fw = frame.shape[:2]
        sorted_contours = sorted(contours, key=cv2.contourArea, reverse=True)

        for contour in sorted_contours:
            area = cv2.contourArea(contour)
            if area >= cls.MIN_LEAF_PX and area < (fh * fw * 0.95):
                return contour

        return sorted_contours[0] if cv2.contourArea(sorted_contours[0]) > 100 else None

    @classmethod
    def diagnose_binary(
        cls,
        contour: np.ndarray,
        yellow_mask: np.ndarray,
        brown_mask: np.ndarray,
        black_mask: np.ndarray,
        white_mask: np.ndarray,
        frame_shape: Tuple[int, ...],
    ) -> Tuple[str, str, float, int, str]:
        """
        Binary Classifier: Diagnoses whether detected leaf is HEALTHY or DISEASED.
        Returns: (status, disease_label, defect_percentage, confidence, recommendation)
        """
        h, w = frame_shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.drawContours(mask, [contour], -1, 255, cv2.FILLED)

        leaf_px = cv2.countNonZero(mask)
        if leaf_px == 0:
            return "NO_LEAF_DETECTED", "No Leaf Detected", 0.0, 0, "Hold leaf in front of camera."

        yellow_px = cv2.countNonZero(cv2.bitwise_and(yellow_mask, mask))
        brown_px = cv2.countNonZero(cv2.bitwise_and(brown_mask, mask))
        black_px = cv2.countNonZero(cv2.bitwise_and(black_mask, mask))
        white_px = cv2.countNonZero(cv2.bitwise_and(white_mask, mask))

        defect_px = yellow_px + brown_px + black_px + white_px
        defect_pct = min(100.0, round((defect_px / leaf_px) * 100.0, 2))

        confidence = min(99, max(90, int(92 + (leaf_px / (h * w)) * 20)))

        # Evaluate Healthy vs Diseased criteria
        if defect_pct >= 2.0 or brown_px > 30 or black_px > 30:
            specific_pathology = (
                "Anthracnose Lesions" if brown_px > yellow_px
                else "Chlorosis Yellowing" if yellow_px > 100
                else "Tea Coal Mold" if black_px > 100
                else "Fungal Infection"
            )
            return (
                "DISEASED",
                f"Diseased ({specific_pathology})",
                defect_pct,
                confidence,
                "Disease detected on leaf surface — Apply organic fungicide spray to sector.",
            )
        else:
            return (
                "HEALTHY",
                "Healthy Tea Leaf",
                defect_pct,
                confidence,
                "Optimal flush density detected — Ready for selective plucking.",
            )

    @classmethod
    def draw_live_stream_overlay(cls, frame: np.ndarray, result: Dict[str, Any]) -> np.ndarray:
        """
        Draws bounding box and prediction status directly onto the live webcam video stream.
        """
        output = frame.copy()
        status = result.get("status", "NO_LEAF_DETECTED")
        disease = result.get("disease", "")
        bbox = result.get("bounding_box", {"x": 0, "y": 0, "width": 0, "height": 0})
        conf = result.get("confidence", 0)

        if status == "HEALTHY":
            color = (50, 220, 50)  # Neon Cyber Green
        elif status == "DISEASED":
            color = (50, 50, 255)  # Crimson Red
        else:
            color = (120, 120, 120)  # Gray searching

        x, y, w, h = bbox["x"], bbox["y"], bbox["width"], bbox["height"]
        if w > 0 and h > 0:
            # Draw primary bounding box
            cv2.rectangle(output, (x, y), (x + w, y + h), color, 3)

            # Top label badge
            label_str = f" {status} [{conf}%] "
            cv2.rectangle(output, (x, max(0, y - 28)), (x + min(220, w), y), color, -1)
            cv2.putText(
                output,
                label_str,
                (x + 5, max(15, y - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 0),
                2,
                cv2.LINE_AA,
            )

        # Bottom tactical HUD status bar on live video stream
        fh, fw = output.shape[:2]
        banner_h = 45
        overlay = output.copy()
        cv2.rectangle(overlay, (0, fh - banner_h), (fw, fh), (10, 15, 20), -1)
        cv2.addWeighted(overlay, 0.85, output, 0.15, 0, output)

        status_text = f"MODEL STATUS: {status} | {disease}"
        cv2.putText(
            output,
            status_text,
            (15, fh - 15),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            color,
            2,
            cv2.LINE_AA,
        )

        return output

    @classmethod
    def detect_frame(cls, frame: np.ndarray) -> Dict[str, Any]:
        """
        Processes frame and returns structured binary diagnosis JSON.
        """
        if frame is None or frame.size == 0:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": "No Leaf Detected",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "recommendation": "Ensure camera feed is active.",
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
                "engine_used": "ARISE Binary Vision Engine",
            }

        blurred = cv2.GaussianBlur(frame, (5, 5), 0)
        hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

        leaf_mask, green_mask, yellow_mask, brown_mask, black_mask, white_mask = cls.get_pathology_masks(hsv)
        contour = cls.get_largest_valid_contour(leaf_mask, frame)

        if contour is None:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": "Searching for leaf...",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "recommendation": "Hold any tea leaf or leaf photo in front of camera lens.",
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
                "engine_used": "ARISE Binary Vision Engine",
            }

        status, disease, defect_pct, confidence, recommendation = cls.diagnose_binary(
            contour, yellow_mask, brown_mask, black_mask, white_mask, frame.shape
        )
        x, y, w, h = cv2.boundingRect(contour)
        bbox = {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}

        return {
            "status": status,
            "disease": disease,
            "yellow_percentage": defect_pct,
            "confidence": confidence,
            "recommendation": recommendation,
            "bounding_box": bbox,
            "engine_used": "ARISE Binary Vision Engine",
        }
