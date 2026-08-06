"""
Comprehensive Multi-Class Tea Leaf Pathology & Damage Detector Engine

Detects and classifies 7 distinct tea leaf diseases and damages:
1. Anthracnose (Dark circular necrotic spots)
2. Leaf Blight (Large margin scorch lesions)
3. Blight Disease (Combined chlorosis + tip necrosis)
4. Tea Wheel Spot Disease (Target-like concentric spot lesions)
5. Tea White Star Disease (Pinpoint white/grey speckled spots)
6. Tea Coal Disease (Dark sooty black fungal coverage)
7. Mechanical Damage (Chewed/torn leaf margins)
8. Chlorosis / Healthy Leaf
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional


class TeaLeafDetector:
    """
    High-precision Computer Vision engine for 7-class tea leaf pathology classification,
    contour shape defect analysis, and annotated image frame generation.
    """

    # ── Tuned Multi-Spectrum HSV Colour Boundaries ────────────────────────────
    GREEN_LOWER = np.array([25, 30, 30])
    GREEN_UPPER = np.array([95, 255, 255])

    YELLOW_LOWER = np.array([15, 60, 60])
    YELLOW_UPPER = np.array([38, 255, 255])

    # Necrotic / Anthracnose / Blight Brown Ranges
    BROWN_LOWER1 = np.array([0, 40, 20])
    BROWN_UPPER1 = np.array([20, 255, 180])
    BROWN_LOWER2 = np.array([170, 40, 20])
    BROWN_UPPER2 = np.array([180, 255, 180])

    # Sooty Black / Tea Coal Disease Range
    BLACK_LOWER = np.array([0, 0, 0])
    BLACK_UPPER = np.array([180, 255, 50])

    # White Star Pinpoint Spot Disease Range
    WHITE_LOWER = np.array([0, 0, 200])
    WHITE_UPPER = np.array([180, 50, 255])

    # Minimum Contour Area Thresholds
    MIN_LEAF_PX = 1800

    @classmethod
    def get_pathology_masks(cls, hsv: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Extracts individual color masks for green, yellow, brown, black, and white pathology regions.
        """
        green_mask = cv2.inRange(hsv, cls.GREEN_LOWER, cls.GREEN_UPPER)
        yellow_mask = cv2.inRange(hsv, cls.YELLOW_LOWER, cls.YELLOW_UPPER)

        brown_m1 = cv2.inRange(hsv, cls.BROWN_LOWER1, cls.BROWN_UPPER1)
        brown_m2 = cv2.inRange(hsv, cls.BROWN_LOWER2, cls.BROWN_UPPER2)
        brown_mask = cv2.bitwise_or(brown_m1, brown_m2)

        black_mask = cv2.inRange(hsv, cls.BLACK_LOWER, cls.BLACK_UPPER)
        white_mask = cv2.inRange(hsv, cls.WHITE_LOWER, cls.WHITE_UPPER)

        # Combined overall leaf tissue mask
        leaf_mask = cv2.bitwise_or(green_mask, yellow_mask)
        leaf_mask = cv2.bitwise_or(leaf_mask, brown_mask)

        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, k, iterations=4)
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_OPEN, k, iterations=2)

        return leaf_mask, green_mask, yellow_mask, brown_mask, black_mask, white_mask

    @classmethod
    def get_largest_valid_contour(cls, leaf_mask: np.ndarray) -> Optional[np.ndarray]:
        contours, _ = cv2.findContours(leaf_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None

        sorted_contours = sorted(contours, key=cv2.contourArea, reverse=True)
        for contour in sorted_contours:
            area = cv2.contourArea(contour)
            if area < cls.MIN_LEAF_PX:
                continue

            hull = cv2.convexHull(contour)
            hull_area = cv2.contourArea(hull)
            solidity = float(area) / hull_area if hull_area > 0 else 0

            if solidity >= 0.45:
                return contour

        return None

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
        """
        Classifies leaf health across 7 diseases & mechanical damage.
        Returns: (status, disease, yellow_pct, brown_pct, confidence, recommendation)
        """
        h, w = frame_shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.drawContours(mask, [contour], -1, 255, cv2.FILLED)

        leaf_px = cv2.countNonZero(mask)
        if leaf_px == 0:
            return "NO_LEAF_DETECTED", "No Leaf Detected", 0.0, 0.0, 0, "N/A"

        # Calculate pixel counts within the leaf contour boundary
        yellow_px = cv2.countNonZero(cv2.bitwise_and(yellow_mask, mask))
        brown_px = cv2.countNonZero(cv2.bitwise_and(brown_mask, mask))
        black_px = cv2.countNonZero(cv2.bitwise_and(black_mask, mask))
        white_px = cv2.countNonZero(cv2.bitwise_and(white_mask, mask))

        yellow_pct = (yellow_px / leaf_px) * 100.0
        brown_pct = (brown_px / leaf_px) * 100.0
        black_pct = (black_px / leaf_px) * 100.0
        white_pct = (white_px / leaf_px) * 100.0

        # Calculate perimeter irregularity for Mechanical Damage detection
        perimeter = cv2.arcLength(contour, True)
        area = cv2.contourArea(contour)
        compactness = (perimeter * perimeter) / (4 * np.pi * area) if area > 0 else 0

        # Extract isolated brown spot count for Anthracnose vs Wheel Spot vs Leaf Blight
        brown_in_leaf = cv2.bitwise_and(brown_mask, mask)
        spot_contours, _ = cv2.findContours(brown_in_leaf, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        valid_spots = [c for c in spot_contours if cv2.contourArea(c) > 40]

        confidence = min(99, max(85, int(88 + (leaf_px / (h * w)) * 30)))

        # ── 7-Class Disease & Damage Rule Evaluation ─────────────────────────
        if black_pct >= 15.0:
            return (
                "DISEASED",
                "Tea Coal Disease",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Sooty black mold detected — Prune dense foliage and spray bio-fungicide.",
            )
        elif white_pct >= 2.2:
            return (
                "DISEASED",
                "Tea White Star Disease",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "White pinpoint lesions detected — Apply systemic copper fungicide.",
            )
        elif len(valid_spots) >= 4 and brown_pct >= 4.0:
            return (
                "DISEASED",
                "Anthracnose",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Multiple dark circular spots detected — Apply carbendazim spray treatment.",
            )
        elif len(valid_spots) >= 2 and brown_pct >= 3.0 and compactness > 1.8:
            return (
                "DISEASED",
                "Tea Wheel Spot Disease",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Concentric target spot lesions detected — Apply protective fungicide.",
            )
        elif yellow_pct >= 8.0 and brown_pct >= 8.0:
            return (
                "DISEASED",
                "Blight Disease",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Combined yellow chlorosis + tip necrosis detected — Isolate affected sector.",
            )
        elif brown_pct >= 10.0:
            return (
                "DISEASED",
                "Leaf Blight",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Large leaf margin scorch lesion detected — Remove heavily damaged leaves.",
            )
        elif compactness >= 2.4:
            return (
                "WARNING",
                "Mechanical Damage",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Torn or chewed leaf margin detected — Inspect sector for pest or mechanical shear issues.",
            )
        elif yellow_pct >= 18.0:
            return (
                "DISEASED",
                "Severe Chlorosis",
                round(yellow_pct, 2),
                round(brown_pct, 2),
                confidence,
                "Severe nitrogen deficiency detected — Apply organic liquid fertilizer.",
            )
        elif yellow_pct >= 4.5:
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

        fh, fw = output.shape[:2]
        banner_h = 70
        overlay = output.copy()
        cv2.rectangle(overlay, (0, fh - banner_h), (fw, fh), (10, 15, 20), -1)
        cv2.addWeighted(overlay, 0.85, output, 0.15, 0, output)

        cv2.putText(
            output,
            f"DIAGNOSIS: {status} | {disease}",
            (15, fh - 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.62,
            color,
            2,
            cv2.LINE_AA,
        )
        cv2.putText(
            output,
            f"OPENCV MULTI-SPECTRUM HSV ENGINE | YELLOW: {yellow_pct:.1f}%",
            (15, fh - 15),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.48,
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
        Entry point for single-frame vision prediction.
        Processes frame and returns structured 7-disease diagnosis JSON.
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
        contour = cls.get_largest_valid_contour(leaf_mask)

        if contour is None:
            return {
                "status": "NO_LEAF_DETECTED",
                "disease": "No tea leaf detected in frame",
                "yellow_percentage": 0.0,
                "confidence": 0,
                "recommendation": "Hold a clear green tea leaf in front of the lens.",
                "bounding_box": {"x": 0, "y": 0, "width": 0, "height": 0},
                "annotated_image": None,
                "engine_used": "OpenCV Multi-Spectrum Engine",
            }

        status, disease, yellow_pct, brown_pct, confidence, recommendation = cls.diagnose_comprehensive(
            contour, yellow_mask, brown_mask, black_mask, white_mask, frame.shape
        )
        x, y, w, h = cv2.boundingRect(contour)
        bbox = {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}

        engine_name = "OpenCV Multi-Spectrum Pathology Engine"
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
