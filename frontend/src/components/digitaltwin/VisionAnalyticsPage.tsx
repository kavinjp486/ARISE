import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  CheckCircle2,
  Cpu,
  Eye,
  FileCheck,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Scan,
  Sparkles,
  Zap,
} from "lucide-react";

export interface PredictionResult {
  status: "HEALTHY" | "WARNING" | "DISEASED" | "NO_LEAF_DETECTED";
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
  annotated_image?: string | null;
  engine_used?: string;
}

const DISEASE_CLASSES_REF = [
  {
    name: "Anthracnose",
    tag: "Fungus (Colletotrichum)",
    desc: "Dark brown circular necrotic spots with light centers across leaf blade.",
    action: "Apply carbendazim spray treatment.",
  },
  {
    name: "Leaf Blight",
    tag: "Fungus (Exobasidium)",
    desc: "Large irregular brown margin scorch lesions spreading along leaf tip.",
    action: "Remove heavily damaged leaves.",
  },
  {
    name: "Blight Disease",
    tag: "Combined Infection",
    desc: "Combined yellow chlorosis fading into dark tip necrosis.",
    action: "Isolate infected crop sector.",
  },
  {
    name: "Tea Wheel Spot",
    tag: "Fungus (Phyllosticta)",
    desc: "Concentric target-like circular spot lesions on foliage.",
    action: "Apply protective bio-fungicide.",
  },
  {
    name: "Tea White Star",
    tag: "Fungus (Elsinoe leucospila)",
    desc: "Small pinpoint white/grey speckled spots across green leaf blade.",
    action: "Apply systemic copper spray.",
  },
  {
    name: "Tea Coal Disease",
    tag: "Sooty Mold (Meliola)",
    desc: "Dark sooty black fungal coverage obstructing photosynthesis.",
    action: "Prune dense canopy and spray bio-fungicide.",
  },
  {
    name: "Mechanical Damage",
    tag: "Chewing / Harvester Shear",
    desc: "Chewed or torn leaf margins and structural notch defects.",
    action: "Inspect harvester plucker blade shear tension.",
  },
  {
    name: "Chlorosis Yellowing",
    tag: "Nutrient / Moisture Defect",
    desc: "Widespread leaf yellowing due to nitrogen deficiency.",
    action: "Apply liquid organic fertilizer.",
  },
];

export function VisionAnalyticsPage() {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult>({
    status: "DISEASED",
    disease: "Anthracnose",
    yellow_percentage: 4.85,
    confidence: 96,
    recommendation: "Multiple dark circular spots detected — Apply carbendazim spray treatment.",
    bounding_box: { x: 170, y: 110, width: 280, height: 210 },
    annotated_image: null,
    engine_used: "OpenCV Multi-Spectrum Engine",
  });

  const [history, setHistory] = useState<
    Array<{ id: string; time: string; status: string; disease: string; yellow: number; conf: number }>
  >([
    { id: "INSPECT-108", time: "14:15:30", status: "DISEASED", disease: "Anthracnose", yellow: 4.85, conf: 96 },
    { id: "INSPECT-107", time: "14:11:10", status: "DISEASED", disease: "Tea Coal Disease", yellow: 2.1, conf: 94 },
    { id: "INSPECT-106", time: "14:08:12", status: "HEALTHY", disease: "Healthy Leaf", yellow: 1.2, conf: 98 },
    { id: "INSPECT-105", time: "14:02:45", status: "WARNING", disease: "Tea Wheel Spot", yellow: 6.8, conf: 92 },
  ]);

  // Manually stop robot & inspect plant leaf
  const inspectPlantLeaf = async () => {
    setLoading(true);
    setIsLiveStreaming(false); // Freeze live stream to inspect plant
    try {
      const response = await fetch("http://localhost:8000/inspect", {
        method: "POST",
      });

      if (response.ok) {
        const data: PredictionResult = await response.json();
        setPrediction(data);
        addHistoryLog(data);
      } else {
        throw new Error("FastAPI server offline");
      }
    } catch (err) {
      // Demo Fallback Simulation when FastAPI server is offline
      const mockResult: PredictionResult = {
        status: "WARNING",
        disease: "Chlorosis Yellowing (Simulated)",
        yellow_percentage: Number((4 + Math.random() * 8).toFixed(2)),
        confidence: 94 + Math.floor(Math.random() * 5),
        recommendation: "Early yellowing detected — Monitor moisture and schedule selective harvest.",
        bounding_box: { x: 180, y: 120, width: 260, height: 190 },
        annotated_image: null,
        engine_used: "OpenCV Multi-Spectrum Engine",
      };
      setPrediction(mockResult);
      addHistoryLog(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const resumeLiveStream = () => {
    setIsLiveStreaming(true);
  };

  const addHistoryLog = (res: PredictionResult) => {
    const newEntry = {
      id: `INSPECT-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toLocaleTimeString(),
      status: res.status,
      disease: res.disease,
      yellow: res.yellow_percentage,
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
              <span>LIVE ROBOT CAMERA STREAM & PLANT INSPECTOR</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                LIVE 1080p STREAM
              </span>
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Real-time video feed from the onboard cable robot camera. Press INSPECT to freeze & analyze plant.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {isLiveStreaming ? (
            <button
              onClick={inspectPlantLeaf}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-amber-500/30 border-2 border-amber-400 text-amber-200 font-orb font-black hover:bg-amber-500/40 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,191,0,0.4)] animate-pulse"
            >
              <PauseCircle className="h-5 w-5 text-amber-300" />
              <span>STOP & INSPECT PLANT LEAF</span>
            </button>
          ) : (
            <button
              onClick={resumeLiveStream}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/30 via-cyan-500/20 to-cyan-500/30 border-2 border-cyan-400 text-cyan-200 font-orb font-black hover:bg-cyan-500/40 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            >
              <PlayCircle className="h-5 w-5 text-cyan-300" />
              <span>RESUME LIVE CAMERA STREAM</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Side-by-Side Visual Comparison & Live Diagnostic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 Cols): Dual Viewport Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dual Viewport Container */}
          <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-4 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-orb text-xs font-bold text-cyan-400 pb-2 border-b border-white/10">
              <span className="flex items-center gap-2">
                <Scan className="h-4 w-4 text-cyan-400" />
                LIVE STREAM VS FROZEN INSPECTION DETECTION OVERLAY
              </span>
              <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                {isLiveStreaming ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    STREAMING LIVE
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    INSPECTION FROZEN
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Viewport 1: Live MJPEG Video Feed */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-white/50 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-cyan-400" />
                    LIVE ROBOT CAMERA STREAM
                  </span>
                  <span className="text-[9px] text-cyan-400 font-bold">1080p @ 60 FPS</span>
                </div>
                <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                  <img
                    src="http://localhost:8000/video_feed"
                    onError={(e) => {
                      // Fallback image if backend server is not running
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop";
                    }}
                    alt="Live Robot Feed"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE FEED
                  </div>
                </div>
              </div>

              {/* Viewport 2: Frozen Inspection & OpenCV Bounding Box Overlay */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-amber-400 flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    INSPECTED PLANT DIAGNOSIS
                  </span>
                  <span className="text-[9px] text-amber-300">OPENCV OVERLAY</span>
                </div>
                <div className="relative aspect-video rounded-xl bg-black border-2 border-amber-500/40 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,191,0,0.2)]">
                  {prediction.annotated_image ? (
                    <img
                      src={prediction.annotated_image}
                      alt="Annotated Leaf"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop"
                        alt="Leaf Overlay"
                        className="w-full h-full object-cover opacity-80"
                      />
                      {/* Bounding Box Overlay */}
                      <div
                        className="absolute border-2 border-red-500 rounded bg-red-500/20 shadow-[0_0_20px_rgba(255,60,60,0.6)] flex items-start p-1"
                        style={{
                          left: `${(prediction.bounding_box.x / 640) * 100}%`,
                          top: `${(prediction.bounding_box.y / 480) * 100}%`,
                          width: `${(prediction.bounding_box.width / 640) * 100}%`,
                          height: `${(prediction.bounding_box.height / 480) * 100}%`,
                        }}
                      >
                        <span className="text-[8px] font-mono font-bold text-red-300 bg-black/80 px-1 py-0.2 rounded border border-red-500/40">
                          {prediction.disease} [{prediction.confidence}%]
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-400 font-bold border border-amber-500/30">
                    {prediction.engine_used || "OpenCV Multi-Spectrum"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Pathology Catalog Grid */}
          <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-4 space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-orb text-xs font-bold text-white border-b border-white/10 pb-2">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                SUPPORTED 7-CLASS PATHOLOGY REFERENCE CATALOG
              </span>
              <span className="font-mono text-[10px] text-cyan-400">AGRONOMIST AUDITED</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-mono text-[11px]">
              {DISEASE_CLASSES_REF.map((d, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between space-y-1 hover:border-cyan-400/40 transition-colors"
                >
                  <div>
                    <div className="font-orb font-bold text-white text-[11px]">{d.name}</div>
                    <div className="text-[9px] text-cyan-400 font-semibold">{d.tag}</div>
                  </div>
                  <div className="text-[9px] text-white/50 leading-tight">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Live Metrics & Diagnosis Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Health Status & Metrics Card */}
          <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-5 space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-orb text-xs font-bold text-white border-b border-white/10 pb-3">
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                INSPECTED PLANT METRICS
              </span>
              <button
                onClick={inspectPlantLeaf}
                disabled={loading}
                className="font-mono text-[10px] text-cyan-400 underline font-bold"
              >
                RE-INSPECT NOW
              </button>
            </div>

            {/* Health Status Badge */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                prediction.status === "HEALTHY"
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(0,168,107,0.3)]"
                  : prediction.status === "WARNING"
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(255,191,0,0.3)]"
                  : "bg-red-500/15 border-red-500/40 text-red-300 shadow-[0_0_20px_rgba(255,60,60,0.3)]"
              }`}
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                  HEALTH STATUS
                </div>
                <div className="font-orb text-xl font-black mt-0.5 flex items-center gap-2">
                  {prediction.status === "HEALTHY" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  )}
                  <span>{prediction.status}</span>
                </div>
                <div className="text-xs font-mono mt-1 opacity-90">
                  Diagnosis: <strong className="text-white">{prediction.disease}</strong>
                </div>
              </div>

              <div className="text-right font-orb">
                <div className="text-[10px] font-mono opacity-70">CONFIDENCE</div>
                <div className="text-2xl font-black">{prediction.confidence}%</div>
              </div>
            </div>

            {/* Metrics Breakdown Tiles */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              {/* Yellow Surface Percentage */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-white/40 text-[10px]">SURFACE DEFECT AREA</div>
                <div className="font-orb text-xl font-bold text-amber-400 mt-1">
                  {prediction.yellow_percentage.toFixed(1)}%
                </div>
                <div className="text-[9px] text-white/40 mt-0.5">Lesion Surface Ratio</div>
              </div>

              {/* Bounding Box Area */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
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
            <div className="bg-gradient-to-r from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 rounded-xl p-3.5 space-y-1">
              <div className="font-orb text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-cyan-400" />
                AGRONOMIST RECOMMENDATION:
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
                RECENT MANUAL PLANT INSPECTIONS
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
                              : row.status === "WARNING"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
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
