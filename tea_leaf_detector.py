"""
Tea Leaf Disease Detector
Run: py tea_leaf_detector.py
Quit: press Q
"""

import cv2
import numpy as np
import time

# ── Camera ────────────────────────────────────────────────────────────────────
CAMERA_INDEX = 0   # change to 1 or 2 if webcam not detected

# ── HSV colour ranges ─────────────────────────────────────────────────────────
GREEN_LOWER  = np.array([25, 30, 30])
GREEN_UPPER  = np.array([95, 255, 255])

YELLOW_LOWER = np.array([15, 60, 60])
YELLOW_UPPER = np.array([38, 255, 255])

# ── Thresholds ────────────────────────────────────────────────────────────────
MIN_LEAF_PX     = 2000
YELLOW_THR      = 6.0
YELLOW_SEV_THR  = 20.0


def get_largest_green_blob(hsv):
    green_mask  = cv2.inRange(hsv, GREEN_LOWER,  GREEN_UPPER)
    yellow_mask = cv2.inRange(hsv, YELLOW_LOWER, YELLOW_UPPER)
    leaf_mask   = cv2.bitwise_or(green_mask, yellow_mask)

    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, k, iterations=4)
    leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_OPEN,  k, iterations=2)

    contours, _ = cv2.findContours(leaf_mask, cv2.RETR_EXTERNAL,
                                   cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None, green_mask, yellow_mask, leaf_mask

    best = max(contours, key=cv2.contourArea)
    if cv2.contourArea(best) < MIN_LEAF_PX:
        return None, green_mask, yellow_mask, leaf_mask

    return best, green_mask, yellow_mask, leaf_mask


def diagnose(contour, yellow_mask, frame_shape):
    h, w = frame_shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.drawContours(mask, [contour], -1, 255, cv2.FILLED)

    leaf_px    = cv2.countNonZero(mask)
    yellow_px  = cv2.countNonZero(cv2.bitwise_and(yellow_mask, mask))
    yellow_pct = (yellow_px / leaf_px * 100) if leaf_px > 0 else 0

    if yellow_pct >= YELLOW_SEV_THR:
        return "DISEASED", "Severe Chlorosis", yellow_pct, (0, 0, 220)
    elif yellow_pct >= YELLOW_THR:
        return "DISEASED", "Chlorosis", yellow_pct, (0, 80, 220)
    elif yellow_pct >= 2.0:
        return "WARNING",  "Early Yellowing", yellow_pct, (0, 180, 255)
    else:
        return "HEALTHY",  "Healthy Leaf", yellow_pct, (50, 200, 50)


def draw_result(frame, contour, status, disease, yellow_pct, color):
    cv2.drawContours(frame, [contour], -1, color, 3)
    x, y, w, h = cv2.boundingRect(contour)
    cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)

    fw, fh = frame.shape[1], frame.shape[0]
    panel_h = 110
    panel_y = fh - panel_h

    overlay = frame.copy()
    cv2.rectangle(overlay, (0, panel_y), (fw, fh), (15, 15, 15), -1)
    cv2.addWeighted(overlay, 0.82, frame, 0.18, 0, frame)
    cv2.rectangle(frame, (0, panel_y), (fw, panel_y + 5), color, -1)

    cv2.putText(frame, f"Status:  {status}",
                (20, panel_y + 35), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2, cv2.LINE_AA)
    cv2.putText(frame, f"Disease: {disease}",
                (20, panel_y + 68), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(frame, f"Yellow area: {yellow_pct:.1f}%",
                (20, panel_y + 98), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (180, 180, 180), 1, cv2.LINE_AA)


def main():
    print("Starting Tea Leaf Disease Detector...")
    print("Press Q to quit\n")

    cap = cv2.VideoCapture(CAMERA_INDEX)
    if not cap.isOpened():
        print(f"Cannot open camera {CAMERA_INDEX}. Change CAMERA_INDEX at top of file.")
        return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    prev_time = time.time()
    fps = 0.0

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        frame   = cv2.flip(frame, 1)
        frame   = cv2.resize(frame, (640, 480))
        blurred = cv2.GaussianBlur(frame, (5, 5), 0)
        hsv     = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

        contour, green_mask, yellow_mask, leaf_mask = get_largest_green_blob(hsv)

        if contour is not None:
            status, disease, yellow_pct, color = diagnose(contour, yellow_mask, frame.shape)
            draw_result(frame, contour, status, disease, yellow_pct, color)
        else:
            fh, fw = frame.shape[:2]
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, fh - 55), (fw, fh), (15, 15, 15), -1)
            cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)
            cv2.putText(frame, "No leaf detected — hold a green leaf in front of camera",
                        (10, fh - 18), cv2.FONT_HERSHEY_SIMPLEX, 0.52,
                        (140, 140, 140), 1, cv2.LINE_AA)

        now  = time.time()
        fps  = 0.9 * fps + 0.1 / max(now - prev_time, 1e-6)
        prev_time = now
        cv2.putText(frame, f"FPS: {fps:.0f}  |  Tea Leaf Detector  |  Q = quit",
                    (10, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (160, 160, 160), 1, cv2.LINE_AA)

        cv2.imshow("Tea Leaf Disease Detector", frame)
        if cv2.waitKey(1) & 0xFF in (ord('q'), 27):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Done.")


if __name__ == "__main__":
    main()
