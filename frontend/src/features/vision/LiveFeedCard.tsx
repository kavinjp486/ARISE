import React, { useRef, useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { VideoOff, RefreshCw, Camera } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ApiService } from "../../services/api";

export interface LiveDetectionResult {
  status: "HEALTHY" | "DISEASED" | "WARNING" | "NO_LEAF_DETECTED";
  disease: string;
  yellow_percentage: number;
  confidence: number;
  recommendation: string;
  bounding_box: { x: number; y: number; width: number; height: number };
  frame_width?: number;
  frame_height?: number;
  engine_used?: string;
}

export interface LiveFeedCardProps {
  isCameraOnline: boolean;
  onToggleCamera: () => void;
  onDetectionResult?: (result: LiveDetectionResult) => void;
  className?: string;
}

export const LiveFeedCard: React.FC<LiveFeedCardProps> = ({
  isCameraOnline,
  onToggleCamera,
  onDetectionResult,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detection, setDetection] = useState<LiveDetectionResult>({
    status: "NO_LEAF_DETECTED",
    disease: "Hold a green leaf in front of camera",
    yellow_percentage: 0,
    confidence: 0,
    recommendation: "Hold any tea leaf or leaf photo in front of camera lens.",
    bounding_box: { x: 0, y: 0, width: 0, height: 0 },
    engine_used: "tea_leaf_detector.py",
  });

  // Start / stop real user webcam via getUserMedia
  useEffect(() => {
    let active = true;

    if (!isCameraOnline) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    navigator.mediaDevices
      ?.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        setCameraError(null);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        if (!active) return;
        console.warn("Webcam access error:", err);
        setCameraError(
          err.name === "NotAllowedError"
            ? "Camera permission denied in browser. Please enable webcam permission."
            : "No webcam detected or camera device is busy."
        );
      });

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isCameraOnline]);

  // Real-time frame inference loop connected to tea_leaf_detector.py
  useEffect(() => {
    if (!isCameraOnline || cameraError) return;

    let isMounted = true;
    let isProcessing = false;

    // Canvas element for extracting 640x480 video frames
    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvas.width = 640;
    hiddenCanvas.height = 480;
    const ctx = hiddenCanvas.getContext("2d", { willReadFrequently: true });

    const interval = setInterval(async () => {
      if (isProcessing) return;
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !ctx) return;

      isProcessing = true;
      try {
        ctx.drawImage(video, 0, 0, 640, 480);
        const base64 = hiddenCanvas.toDataURL("image/jpeg", 0.7);

        // Send directly to backend running tea_leaf_detector.py
        const result = await ApiService.detectFrame(base64);

        if (isMounted && result) {
          const typedResult = result as LiveDetectionResult;
          setDetection(typedResult);
          onDetectionResult?.(typedResult);
        }
      } catch (err) {
        // graceful handle
      } finally {
        isProcessing = false;
      }
    }, 380); // ~2.6 FPS continuous detection loop

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isCameraOnline, cameraError, onDetectionResult]);

  const hasLeaf =
    detection.status !== "NO_LEAF_DETECTED" &&
    detection.bounding_box.width > 0 &&
    detection.bounding_box.height > 0;

  const isHealthy = detection.status === "HEALTHY";

  // Calculate percentage bounding box inside 640x480 frame
  const bbox = detection.bounding_box;
  const fw = detection.frame_width || 640;
  const fh = detection.frame_height || 480;

  const bboxLeft = `${(bbox.x / fw) * 100}%`;
  const bboxTop = `${(bbox.y / fh) * 100}%`;
  const bboxWidth = `${(bbox.width / fw) * 100}%`;
  const bboxHeight = `${(bbox.height / fh) * 100}%`;

  return (
    <Card
      title="Optical stream"
      headerAction={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleCamera}
            className="text-xs"
          >
            {isCameraOnline ? "Disconnect webcam" : "Connect webcam"}
          </Button>
        </div>
      }
      className={className}
    >
      <div className="relative aspect-[16/9] w-full rounded-[10px] overflow-hidden bg-[#0C1312] border border-[#26332F] flex flex-col justify-between select-none">
        {isCameraOnline ? (
          cameraError ? (
            /* Camera Permission or Device Error */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0E1514]">
              <div className="w-10 h-10 rounded-[10px] bg-[#1B2625] border border-[#26332F] flex items-center justify-center text-[#F5A524] mb-3">
                <VideoOff className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-semibold text-[#E6EDEB]">Webcam unavailable</h4>
              <p className="mt-1 text-xs text-[#8FA19C] max-w-sm">{cameraError}</p>
              <Button
                variant="secondary"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                className="mt-3.5"
                onClick={onToggleCamera}
              >
                Retry camera access
              </Button>
            </div>
          ) : (
            /* Live User Webcam Video + Real-Time tea_leaf_detector.py Bounding Box */
            <>
              <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
                {/* HTML5 Live Webcam Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Real-time Bounding Box Overlay rendered directly from tea_leaf_detector.py */}
                {hasLeaf && (
                  <div
                    className="absolute pointer-events-none transition-all duration-150"
                    style={{
                      left: bboxLeft,
                      top: bboxTop,
                      width: bboxWidth,
                      height: bboxHeight,
                    }}
                  >
                    {/* Floating label tab above bounding box */}
                    <div
                      className={`absolute -top-6 left-0 px-2 py-0.5 rounded-[4px] text-[11px] font-mono font-medium whitespace-nowrap bg-[#141D1C]/95 border shadow-sm ${
                        isHealthy
                          ? "border-[#4ADE80] text-[#4ADE80]"
                          : "border-[#F5A524] text-[#F5A524]"
                      }`}
                    >
                      {isHealthy
                        ? `Healthy Leaf · ${detection.confidence}%`
                        : `${detection.disease} · ${detection.yellow_percentage}% yellowing`}
                    </div>

                    {/* 2px Bounding Box Outline */}
                    <div
                      className={`w-full h-full rounded-[4px] border-2 shadow-sm ${
                        isHealthy ? "border-[#4ADE80]" : "border-[#F5A524]"
                      }`}
                    />
                  </div>
                )}

                {/* Subtitle banner if no leaf in camera view */}
                {!hasLeaf && (
                  <div className="absolute bottom-10 inset-x-0 flex justify-center pointer-events-none px-4">
                    <span className="px-3.5 py-1.5 rounded-[6px] bg-[#0E1514]/85 border border-[#26332F] text-xs font-mono text-[#8FA19C] backdrop-blur-sm text-center">
                      No leaf detected — hold a green leaf in front of camera
                    </span>
                  </div>
                )}
              </div>

              {/* Overlay chip at top-left ("Live Webcam") */}
              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#0E1514]/85 border border-[#26332F] text-[11px] font-mono text-[#E6EDEB] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse-dot" />
                  Live Webcam · 640×480
                </span>
              </div>
            </>
          )
        ) : (
          /* Webcam Disconnected / Standby State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0E1514]">
            <div className="w-10 h-10 rounded-[10px] bg-[#1B2625] border border-[#26332F] flex items-center justify-center text-[#8FA19C] mb-3">
              <Camera className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-semibold text-[#E6EDEB]">Webcam disconnected</h4>
            <p className="mt-1 text-xs text-[#8FA19C] max-w-xs">
              Click Connect Webcam to stream your live camera and detect tea leaves using tea_leaf_detector.py.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={<Camera className="w-3.5 h-3.5" />}
              className="mt-3.5"
              onClick={onToggleCamera}
            >
              Connect webcam
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
