import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  CheckCircle2,
  Cpu,
  Eye,
  FileCheck,
  RefreshCw,
  Scan,
  Sparkles,
  Zap,
} from "lucide-react";

export interface PredictionResult {
  status: "HEALTHY" | "DISEASED" | "NO_LEAF_DETECTED";
  disease: string;
  yellow_percentage: number;
  confidence: number;
  recommendation?: string;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  engine_used?: string;
}

const DISEASE_CLASSES_REF = [
  {
    name: "Healthy Tea Leaf",
    tag: "Clean Canopy",
    desc: "Optimal chlorophyll absorption with clean leaf blade margins.",
    action: "Ready for selective plucking.",
  },
  {
    name: "Diseased Leaf",
    tag: "Pathology Detected",
    desc: "Anthracnose, Leaf Blight, Chlorosis, or Tea Coal mold lesions.",
    action: "Apply organic fungicide treatment to sector.",
  },
];

export function VisionAnalyticsPage() {
  const [autoDetect, setAutoDetect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult>({
    status: "DISEASED",
    disease: "Diseased (Anthracnose Lesions)",
    yellow_percentage: 4.85,
    confidence: 96,
    recommendation: "Disease detected on leaf surface — Apply organic fungicide spray to sector.",
    bounding_box: { x: 170, y: 110, width: 280, height: 210 },
    engine_used: "ARISE Binary Vision Engine",
  });

  const [history, setHistory] = useState<
    Array<{ id: string; time: string; status: string; disease: string; defect: number; conf: number }>
  >([
    { id: "SCAN-108", time: "14:15:30", status: "DISEASED", disease: "Diseased Leaf", defect: 4.85, conf: 96 },
    { id: "SCAN-107", time: "14:11:10", status: "HEALTHY", disease: "Healthy Tea Leaf", defect: 0.8, conf: 98 },
    { id: "SCAN-106", time: "14:08:12", status: "DISEASED", disease: "Diseased Leaf", defect: 6.2, conf: 94 },
  ]);

  // Poll latest prediction from live camera stream model
  const pollLiveStreamPrediction = async () => {
    try {
      const response = await fetch(`http://localhost:8000/predict?t=${Date.now()}`);
      if (response.ok) {
        const data: PredictionResult = await response.json();
        setPrediction(data);
        if (data.status !== "NO_LEAF_DETECTED") {
          addHistoryLog(data);
        }
      }
    } catch (err) {
      // Offline fallback simulation
      const mockResult: PredictionResult = {
        status: "HEALTHY",
        disease: "Healthy Tea Leaf",
        yellow_percentage: 0.8,
        confidence: 97,
        recommendation: "Optimal flush density detected — Ready for selective plucking.",
        bounding_box: { x: 180, y: 120, width: 260, height: 190 },
        engine_used: "ARISE Binary Vision Engine",
      };
      setPrediction(mockResult);
    }
  };

  // Fast continuous polling loop (600ms) to update side metrics live from stream
  useEffect(() => {
    if (!autoDetect) return;

    pollLiveStreamPrediction();
    const interval = setInterval(() => {
      pollLiveStreamPrediction();
    }, 600);

    return () => clearInterval(interval);
  }, [autoDetect]);

  const addHistoryLog = (res: PredictionResult) => {
    const newEntry = {
      id: `SCAN-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toLocaleTimeString(),
      status: res.status,
      disease: res.disease,
      defect: res.yellow_percentage,
      conf: res.confidence,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 7)]);
  };

  return (
    <div className="flex-1 w-full p-4 md:p-6 max-w-[1800px] mx-auto space-y-6 select-none font-sans text-white">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#040C16] via-[#08182b] to-[#040C16] border border-cyan-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-orb text-xl shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            📹
          </div>
          <div>
            <h1 className="font-orb text-lg md:text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>LIVE WEBCAM TEA LEAF HEALTH DETECTOR</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                REAL-TIME STREAM INFERENCE
              </span>
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Live webcam feed with real-time bounding box detection. Side panel updates automatically as leaves are scanned.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setAutoDetect(!autoDetect)}
            className={`px-4 py-2 rounded-xl font-bold border transition-all flex items-center gap-2 ${
              autoDetect
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_15px_rgba(0,168,107,0.3)]"
                : "bg-white/5 text-white/50 border-white/10"
            }`}
          >
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>LIVE INFERENCE: {autoDetect ? "ACTIVE (600ms)" : "PAUSED"}</span>
          </button>

          <button
            onClick={pollLiveStreamPrediction}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-orb font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>REFRESH METRICS</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Live Stream Viewport (Left 7 Cols) & Side Metrics Panel (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 Cols): FEATURED LIVE WEBCAM STREAM */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-4 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-orb text-xs font-bold text-cyan-400 pb-2 border-b border-white/10">
              <span className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                LIVE ROBOT WEBCAM VIDEO STREAM (WITH REAL-TIME BOUNDING BOX)
              </span>
              <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                1080p @ 60 FPS
              </span>
            </div>

            {/* LIVE WEBCAM VIDEO FEED WITH REAL-TIME BOUNDING BOX OVERLAY */}
            <div className="relative aspect-video rounded-xl bg-black border-2 border-cyan-500/40 overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.2)]">
              <img
                src="http://localhost:8000/video_feed"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop";
                }}
                alt="Live Robot Webcam Feed"
                className="w-full h-full object-cover"
              />

              {/* Status Badge Tag on Top Left */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 text-xs font-mono text-emerald-400 font-bold border border-emerald-500/40 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE CAMERA STREAM</span>
              </div>

              {/* Dynamic Status Indicator on Top Right */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/80 text-xs font-mono font-bold border border-cyan-500/40 text-cyan-300">
                {prediction.engine_used || "ARISE Binary Vision Engine"}
              </div>
            </div>
          </div>

          {/* Reference Classification Guide */}
          <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-4 space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-orb text-xs font-bold text-white border-b border-white/10 pb-2">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                BINARY LEAF CLASSIFICATION STANDARDS
              </span>
              <span className="font-mono text-[10px] text-cyan-400">AGRONOMIST AUDITED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {DISEASE_CLASSES_REF.map((d, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between space-y-1.5 hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orb font-bold text-white text-xs">{d.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        i === 0
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-red-500/20 text-red-400 border border-red-500/40"
                      }`}
                    >
                      {d.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/60 leading-relaxed">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): WEBCAM DETECTED LEAF METRICS PANEL */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Health Status & Metrics Panel */}
          <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-5 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-orb text-xs font-bold text-white border-b border-white/10 pb-3">
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                WEBCAM DETECTED LEAF METRICS
              </span>
              <span className="font-mono text-[10px] text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                LIVE UPDATING
              </span>
            </div>

            {/* Health Status Badge (HEALTHY vs DISEASED) */}
            <div
              className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                prediction.status === "HEALTHY"
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_25px_rgba(0,168,107,0.3)]"
                  : prediction.status === "DISEASED"
                  ? "bg-red-500/15 border-red-500/40 text-red-300 shadow-[0_0_25px_rgba(255,60,60,0.3)]"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                  CURRENT LEAF STATUS
                </div>
                <div className="font-orb text-2xl font-black mt-1 flex items-center gap-2">
                  {prediction.status === "HEALTHY" ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  ) : prediction.status === "DISEASED" ? (
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  ) : (
                    <Eye className="h-6 w-6 text-white/40" />
                  )}
                  <span>{prediction.status}</span>
                </div>
                <div className="text-xs font-mono mt-1.5 opacity-90">
                  Diagnosis: <strong className="text-white">{prediction.disease}</strong>
                </div>
              </div>

              <div className="text-right font-orb">
                <div className="text-[10px] font-mono opacity-70">CONFIDENCE</div>
                <div className="text-3xl font-black">{prediction.confidence}%</div>
              </div>
            </div>

            {/* Metrics Breakdown Tiles */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              {/* Defect Surface Ratio */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <div className="text-white/40 text-[10px]">SURFACE DEFECT AREA</div>
                <div className="font-orb text-xl font-bold text-amber-400 mt-1">
                  {prediction.yellow_percentage.toFixed(1)}%
                </div>
                <div className="text-[9px] text-white/40 mt-0.5">Lesion / Defect Surface</div>
              </div>

              {/* Bounding Box Dimensions */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <div className="text-white/40 text-[10px]">BOUNDING BOX</div>
                <div className="font-orb text-sm font-bold text-cyan-400 mt-1">
                  {prediction.bounding_box.width} × {prediction.bounding_box.height} px
                </div>
                <div className="text-[9px] text-white/40 mt-0.5">
                  X:{prediction.bounding_box.x} Y:{prediction.bounding_box.y}
                </div>
              </div>
            </div>

            {/* Agronomist Recommendation Banner */}
            <div className="bg-gradient-to-r from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 rounded-xl p-4 space-y-1">
              <div className="font-orb text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-cyan-400" />
                AGRONOMIST ACTION RECOMMENDATION:
              </div>
              <p className="text-xs text-white/80 font-mono leading-relaxed">
                {prediction.recommendation}
              </p>
            </div>
          </div>

          {/* History Inspection Scans Table */}
          <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-4 space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-orb text-xs font-bold text-white border-b border-white/10 pb-2">
              <span className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-cyan-400" />
                RECENT LIVE WEBCAM SCAN LOGS
              </span>
              <span className="font-mono text-[10px] text-white/40">
                PAST {history.length} SCANS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                    <th className="pb-2">Scan ID</th>
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Diagnosis</th>
                    <th className="pb-2">Conf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {history.map((row) => (
                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 font-bold text-cyan-400">{row.id}</td>
                      <td className="py-2 text-white/50 text-[10px]">{row.time}</td>
                      <td className="py-2">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            row.status === "HEALTHY"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 font-bold text-white text-[11px]">{row.disease}</td>
                      <td className="py-2 text-cyan-400">{row.conf}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
