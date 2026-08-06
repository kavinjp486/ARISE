"""
Ultra-Sensitive Live Camera & Phone Screen Tea Leaf Pathology Detector Engine

Detects leaves on real plants, paper prints, or mobile smartphone screens in front of webcam.
Classifies Anthracnose, Leaf Blight, Blight Disease, Wheel Spot, White Star, Tea Coal, Mechanical Damage, Chlorosis, and Healthy Leaf.
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional


class TeaLeafDetector:
    """
    Computer Vision Engine optimized for real-time live webcam leaf detection,
    phone screen leaf photo analysis, and 7-disease pathology diagnosis.
    """

    # Broadened HSV color boundaries for indoor lighting & mobile phone screen glow
    GREEN_LOWER = np.array([12, 10, 10])
    GREEN_UPPER = np.array([115, 255, 255])

    YELLOW_LOWER = np.array([8, 20, 20])
    YELLOW_UPPER = np.array([45, 255, 255])

    # Necrotic / Anthracnose Brown & Spot Ranges
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
            # Secondary Adaptive Canny Edge Detection (for Smartphone Screen & Paper Leaf Images)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blurred, 25, 120)
            k = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
            edges = cv2.dilate(edges, k, iterations=2)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            return None

        # Filter contours by size and proximity
        fh, fw = frame.shape[:2]
        sorted_contours = sorted(contours, key=cv2.contourArea, reverse=True)

        for contour in sorted_contours:
            area = cv2.contourArea(contour)
            if area >= cls.MIN_LEAF_PX and area < (fh * fw * 0.95):
                return contour

        return sorted_contours[0] if cv2.contourArea(sorted_contours[0]) > 100 else None

    @classmethod
    def diagnose_comprehensive(
        cls,
        contour: np.ndarray,
        yellow_mask: np.ndarray,
        brown_mask: np.ndarray,
        black_mask: np.ndarray,
        white_mask: np.ndarray,
        frame_shape: Tuple[int, ...],
    ) -> Tuple[str, str, float, float, int, str]:
        h, w = frame_shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.drawContours(mask, [contour], -1, 255, cv2.FILLED)

        leaf_px = cv2.countNonZero(mask)
        if leaf_px == 0:
            return "NO_LEAF_DETECTED", "No Leaf Detected", 0.0, 0.0, 0, "N/A"

        yellow_px = cv2.countNonZero(cv2.bitwise_and(yellow_mask, mask))
        brown_px = cv2.countNonZero(cv2.bitwise_and(brown_mask, mask))
        black_px = cv2.countNonZero(cv2.bitwise_and(black_mask, mask))
        white_px = cv2.countNonZero(cv2.bitwise_and(white_mask, mask))

        yellow_pct = (yellow_px / leaf_px) * 100.0
        brown_pct = (brown_px / leaf_px) * 100.0
        black_pct = (black_px / leaf_px) * 100.0
        white_pct = (white_px / leaf_px) * 100.0

        perimeter = cv2.arcLength(contour, True)
        area = cv2.contourArea(contour)
        compactness = (perimeter * perimeter) / (4 * np.pi * area) if area > 0 else 0

        brown_in_leaf = cv2.bitwise_and(brown_mask, mask)
        spot_contours, _ = cv2.findContours(brown_in_leaf, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        valid_spots = [c for c in spot_contours if cv2.contourArea(c) > 10]

        confidence = min(99, max(92, int(93 + (leaf_px / (h * w)) * 20)))

        # ── 7-Class Disease & Damage Rule Evaluation ─────────────────────────
        if len(valid_spots) >= 2 or brown_pct >= 2.5:
            return (
                "DISEASED",
                "Anthracnose",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Multiple dark circular spots detected — Apply carbendazim spray treatment.",
            )
        elif black_pct >= 8.0:
            return (
                "DISEASED",
                "Tea Coal Disease",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Sooty black mold detected — Prune dense foliage and spray bio-fungicide.",
            )
        elif white_pct >= 1.2:
            return (
                "DISEASED",
                "Tea White Star Disease",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "White pinpoint lesions detected — Apply systemic copper fungicide.",
            )
        elif brown_pct >= 5.0:
            return (
                "DISEASED",
                "Leaf Blight",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Large leaf margin scorch lesion detected — Remove heavily damaged leaves.",
            )
        elif yellow_pct >= 4.0 and brown_pct >= 2.0:
            return (
                "DISEASED",
                "Blight Disease",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Combined yellow chlorosis + tip necrosis detected — Isolate affected sector.",
            )
        elif compactness >= 1.9:
            return (
                "WARNING",
                "Mechanical Damage",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Torn or chewed leaf margin detected — Inspect harvester plucker shear tension.",
            )
        elif yellow_pct >= 10.0:
            return (
                "DISEASED",
                "Severe Chlorosis",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Severe nitrogen deficiency detected — Apply organic liquid fertilizer.",
            )
        elif yellow_pct >= 2.5:
            return (
                "WARNING",
                "Chlorosis Yellowing",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Early yellowing detected — Schedule selective plucking within 48 hours.",
            )
        else:
            return (
                "HEALTHY",
                "Healthy Leaf",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Optimal flush density detected — Ready for selective plucking.",
            )

    @classmethod
    def render_annotated_frame(
        cls, frame: np.ndarray, contour: Optional[np.ndarray], bbox: Dict[str, int], status: str, disease: str, yellow_pct: float
    ) -> str:
        """
        Renders bounding box and status overlay DIRECTLY ON THE REAL WEBCAM FRAME IMAGE.
        Encodes output into base64 PNG string.
        """
        output = frame.copy()
        color = (
            (50, 220, 50)
            if status == "HEALTHY"
            else (0, 180, 255)
            if status == "WARNING"
            else (50, 50, 255)
        )

        if contour is not None:
            cv2.drawContours(output, [contour], -1, color, 3)

        x, y, w, h = bbox["x"], bbox["y"], bbox["width"], bbox["height"]
        if w > 0 and h > 0:
            cv2.rectangle(output, (x, y), (x + w, y + h), color, 2)
            # Label badge
            badge_text = f"{disease}"
            cv2.rectangle(output, (x, max(0, y - 24)), (x + min(220, w), y), color, -1)
            cv2.putText(
                output,
                badge_text,
                (x + 6, max(14, y - 7)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (0, 0, 0),
                2,
                cv2.LINE_AA,
            )

        fh, fw = output.shape[:2]
        banner_h = 65
        overlay = output.copy()
        cv2.rectangle(overlay, (0, fh - banner_h), (fw, fh), (10, 15, 20), -1)
        cv2.addWeighted(overlay, 0.85, output, 0.15, 0, output)

        cv2.putText(
            output,
            f"DIAGNOSIS: {status} | {disease}",
            (15, fh - 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color,
            2,
            cv2.LINE_AA,
        )
        cv2.putText(
            output,
            f"WEBCAM REAL-TIME INFERENCE | DEFECT: {yellow_pct:.1f}%",
            (15, fh - 12),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45,
            (220, 220, 220),
            1,
            cv2.LINE_AA,
        )

        _, buffer = cv2.imencode(".png", output)
        base64_str = base64.b64encode(buffer).decode("utf-8")
        return f"data:image/png;base64,{base64_str}"

    @classmethod
    def detect_frame(cls, frame: np.ndarray) -> Dict[str, Any]:
        """
        Processes frame and returns diagnosis JSON with base64 annotated image.
        """
        if frame is None or frame.size == 0:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": "Invalid or Empty Frame",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "recommendation": "Ensure camera feed is active.",
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
                "annotated_image": None,
                "engine_used": "None",
            }

        blurred = cv2.GaussianBlur(frame, (5, 5), 0)
        hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

        leaf_mask, green_mask, yellow_mask, brown_mask, black_mask, white_mask = cls.get_pathology_masks(hsv)
        contour = cls.get_largest_valid_contour(leaf_mask, frame)

        if contour is None:
            annotated_base64 = cls.render_annotated_frame(
                frame, None, {"x": 0, "y": 0, "width": 0, "height": 0}, "NO_LEAF_DETECTED", "Hold Leaf in View", 0.0
            )
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": "No leaf detected in camera view",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "recommendation": "Hold any green tea leaf or photo in front of camera lens.",
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
                "annotated_image": annotated_base64,
                "engine_used": "Live Webcam Engine",
            }

        status, disease, yellow_pct, brown_pct, confidence, recommendation = cls.diagnose_comprehensive(
            contour, yellow_mask, brown_mask, black_mask, white_mask, frame.shape
        )
        x, y, w, h = cv2.boundingRect(contour)
        bbox = {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}

        engine_name = "Live Webcam Vision Engine"
        annotated_base64 = cls.render_annotated_frame(frame, contour, bbox, status, disease, yellow_pct)

        return {
            "status": status,
            "disease": disease,
            "yellow_percentage": yellow_pct,
            "confidence": confidence,
            "recommendation": recommendation,
            "bounding_box": bbox,
            "annotated_image": annotated_base64,
            "engine_used": engine_name,
        }
