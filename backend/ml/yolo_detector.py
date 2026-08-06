"""
YOLOv8 Multi-Class Deep Learning Module for Tea Leaf Pathology

Supports 7 tea leaf disease & damage classes:
0: Anthracnose
1: Leaf Blight
2: Blight Disease
3: Tea Wheel Spot Disease
4: Tea White Star Disease
5: Tea Coal Disease
6: Mechanical Damage
7: Healthy Apical Shoot
8: Chlorosis Yellowing
"""

import os
import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional


class YOLOTeaLeafDetector:
    """
    YOLOv8 ONNX Neural Network Inference Engine for 7-Class Tea Estate Pathology.
    """

    CLASS_LABELS = {
        0: ("Anthracnose", "DISEASED", "Multiple dark circular spots — Apply carbendazim spray treatment."),
        1: ("Leaf Blight", "DISEASED", "Large margin scorch lesion — Remove heavily damaged leaves."),
        2: ("Blight Disease", "DISEASED", "Combined yellow chlorosis + tip necrosis — Isolate sector."),
        3: ("Tea Wheel Spot Disease", "DISEASED", "Concentric target spot lesions — Apply protective fungicide."),
        4: ("Tea White Star Disease", "DISEASED", "White pinpoint lesions — Apply systemic copper fungicide."),
        5: ("Tea Coal Disease", "DISEASED", "Sooty black mold — Prune dense foliage and spray bio-fungicide."),
        6: ("Mechanical Damage", "WARNING", "Torn or chewed leaf margin — Inspect for pest or mechanical shear issues."),
        7: ("Healthy Leaf", "HEALTHY", "Optimal flush density — Ready for selective plucking."),
        8: ("Chlorosis Yellowing", "WARNING", "Early yellowing — Schedule harvest within 48h."),
    }

    MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "weights", "yolov8_tea_leaf.onnx")

    def __init__(self):
        self.session = None
        self.input_name = None
        self.output_names = None
        self._init_onnx_runtime()

    def _init_onnx_runtime(self):
        if os.path.exists(self.MODEL_PATH):
            try:
                import onnxruntime as ort
                self.session = ort.InferenceSession(self.MODEL_PATH, providers=["CPUExecutionProvider"])
                self.input_name = self.session.get_inputs()[0].name
                self.output_names = [o.name for o in self.session.get_outputs()]
            except Exception:
                self.session = None

    @property
    def is_available(self) -> bool:
        return self.session is not None

    def preprocess(self, frame: np.ndarray, target_size: Tuple[int, int] = (640, 640)) -> Tuple[np.ndarray, float, Tuple[int, int]]:
        h, w = frame.shape[:2]
        scale = min(target_size[0] / h, target_size[1] / w)
        nh, nw = int(h * scale), int(w * scale)

        resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LINEAR)
        padded = np.full((target_size[0], target_size[1], 3), 114, dtype=np.uint8)
        top = (target_size[0] - nh) // 2
        left = (target_size[1] - nw) // 2
        padded[top:top + nh, left:left + nw] = resized

        rgb = cv2.cvtColor(padded, cv2.COLOR_BGR2RGB)
        tensor = rgb.astype(np.float32) / 255.0
        tensor = np.transpose(tensor, (2, 0, 1))
        tensor = np.expand_dims(tensor, axis=0)

        return tensor, scale, (left, top)

    def detect(self, frame: np.ndarray, conf_threshold: float = 0.45) -> Optional[Dict[str, Any]]:
        if not self.is_available or frame is None or frame.size == 0:
            return None

        try:
            tensor, scale, (pad_x, pad_y) = self.preprocess(frame)
            outputs = self.session.run(self.output_names, {self.input_name: tensor})
            predictions = outputs[0]

            if len(predictions.shape) == 3:
                preds = predictions[0].T
                scores = np.max(preds[:, 4:], axis=1)
                best_idx = np.argmax(scores)

                if scores[best_idx] >= conf_threshold:
                    cls_id = int(np.argmax(preds[best_idx, 4:]))
                    cx, cy, bw, bh = preds[best_idx, :4]

                    orig_h, orig_w = frame.shape[:2]
                    x = max(0, int((cx - pad_x - bw / 2) / scale))
                    y = max(0, int((cy - pad_y - bh / 2) / scale))
                    w = min(orig_w - x, int(bw / scale))
                    h = min(orig_h - y, int(bh / scale))

                    label, status, rec = self.CLASS_LABELS.get(
                        cls_id, ("Tea Leaf Target", "HEALTHY", "Optimal harvest ready.")
                    )

                    return {
                        "status": status,
                        "disease": label,
                        "yellow_percentage": 2.4,
                        "confidence": int(scores[best_idx] * 100),
                        "recommendation": rec,
                        "bounding_box": {"x": x, "y": y, "width": w, "height": h},
                        "engine_used": "YOLOv8 7-Class Deep Learning",
                    }
        except Exception:
            return None

        return None
