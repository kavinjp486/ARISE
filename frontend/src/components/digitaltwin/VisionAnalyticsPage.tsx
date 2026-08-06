import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Cpu,
  Eye,
  FileCheck,
  Image as ImageIcon,
  RefreshCw,
  Scan,
  ShieldAlert,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

export interface PredictionResult {
  status: "HEALTHY" | "WARNING" | "DISEASED" | "NO_LEAF_DETECTED";
  disease: str;
  yellow_percentage: number;
  confidence: number;
  recommendation?: str;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  annotated_image?: str | null;
}

export function VisionAnalyticsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop"
  );
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult>({
    status: "WARNING",
    disease: "Chlorosis Yellowing",
    yellow_percentage: 6.85,
    confidence: 94,
    recommendation: "Early yellowing detected — Monitor moisture and schedule harvest within 48 hours.",
    bounding_box: { x: 180, y: 120, width: 260, height: 190 },
    annotated_image: null,
  });

  const [history, setHistory] = useState<
    Array<{ id: string; time: string; status: string; disease: str; yellow: number; conf: number }>
  >([
    { id: "SCAN-104", time: "14:08:12", status: "HEALTHY", disease: "Healthy Leaf", yellow: 1.2, conf: 98 },
    { id: "SCAN-103", time: "14:02:45", status: "WARNING", disease: "Chlorosis Yellowing", yellow: 6.85, conf: 94 },
    { id: "SCAN-102", time: "13:55:01", status: "DISEASED", disease: "Blister Blight Pathology", yellow: 22.4, conf: 91 },
  ]);

  // Execute inference by calling FastAPI /predict endpoint or fallback runner
  const runInference = async (fileObj?: File) => {
    setLoading(true);
    try {
      let data: PredictionResult;

      if (fileObj) {
        const formData = new FormData();
        formData.append("file", fileObj);

        const response = await fetch("http://localhost:8000/predict", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error("FastAPI server offline");
        }
      } else {
        const response = await fetch("http://localhost:8000/predict");
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error("FastAPI server offline");
        }
      }

      setPrediction(data);
      addHistoryLog(data);
    } catch (err) {
      // Demo Fallback Simulation when FastAPI server is offline
      const mockResult: PredictionResult = {
        status: "WARNING",
        disease: "Chlorosis Yellowing (Simulated)",
        yellow_percentage: Number((4 + Math.random() * 8).toFixed(2)),
        confidence: 92 + Math.floor(Math.random() * 7),
        recommendation: "Early yellowing detected — Monitor nitrogen levels and schedule selective harvest.",
        bounding_box: { x: 190, y: 130, width: 250, height: 180 },
        annotated_image: null,
      };
      setPrediction(mockResult);
      addHistoryLog(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const addHistoryLog = (res: PredictionResult) => {
    const newEntry = {
      id: `SCAN-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toLocaleTimeString(),
      status: res.status,
      disease: res.disease,
      yellow: res.yellow_percentage,
      conf: res.confidence,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 7)]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      runInference(file);
    }
  };

  return (
    <div className="flex-1 w-full p-4 md:p-6 max-w-[1800px] mx-auto space-y-6 select-none font-sans text-white">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#040C16] via-[#08182b] to-[#040C16] border border-cyan-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-orb text-xl shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            🔬
          </div>
          <div>
            <h1 className="font-orb text-lg md:text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>TEA LEAF VISION DETECTOR ANALYTICS</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                FASTAPI + OPENCV ENGINE
              </span>
            </h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Multi-spectrum HSV chlorosis segmentation, necrotic lesion detection, & confidence rating.
            </p>
          </div>
        </div>

        {/* Ingest Action Buttons */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 font-bold hover:bg-cyan-500/25 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Upload className="h-4 w-4" />
            <span>UPLOAD TEA LEAF IMAGE</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <button
            onClick={() => runInference()}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,168,107,0.2)]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>RUN PREDICTION INFERENCE</span>
          </button>
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
                SIDE-BY-SIDE INGESTION & OPENCV DETECTION OVERLAY
              </span>
              <span className="font-mono text-[10px] text-emerald-400">
                {prediction.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Viewport 1: Original Ingested Image */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>ORIGINAL INPUT FRAME</span>
                </div>
                <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Original Leaf"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white/60">
                    RAW RGB
                  </div>
                </div>
              </div>

              {/* Viewport 2: OpenCV Processed Frame / Base64 Annotated Image */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>OPENCV DETECTION OVERLAY</span>
                </div>
                <div className="relative aspect-video rounded-xl bg-black border-2 border-cyan-500/40 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                  {prediction.annotated_image ? (
                    <img
                      src={prediction.annotated_image}
                      alt="Annotated Leaf"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Leaf Overlay"
                        className="w-full h-full object-cover opacity-80"
                      />
                      {/* Bounding Box Visualizer Overlay */}
                      <div
                        className="absolute border-2 border-emerald-400 rounded bg-emerald-500/20 shadow-[0_0_20px_rgba(0,168,107,0.6)] flex items-start p-1"
                        style={{
                          left: `${(prediction.bounding_box.x / 640) * 100}%`,
                          top: `${(prediction.bounding_box.y / 480) * 100}%`,
                          width: `${(prediction.bounding_box.width / 640) * 100}%`,
                          height: `${(prediction.bounding_box.height / 480) * 100}%`,
                        }}
                      >
                        <span className="text-[8px] font-mono font-bold text-emerald-300 bg-black/80 px-1 py-0.2 rounded border border-emerald-500/40">
                          {prediction.disease} [{prediction.confidence}%]
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-400 font-bold border border-cyan-500/30">
                    OPENCV HSV SEGMENTED
                  </div>
                </div>
              </div>
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
                VISION DIAGNOSTIC METRICS
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                FASTAPI REAL-TIME
              </span>
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
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
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
                <div className="text-white/40 text-[10px]">CHLOROSIS SURFACE</div>
                <div className="font-orb text-xl font-bold text-amber-400 mt-1">
                  {prediction.yellow_percentage.toFixed(1)}%
                </div>
                <div className="text-[9px] text-white/40 mt-0.5">Yellow Pixel Ratio</div>
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
        </div>
      </div>

      {/* History Inspection Scans Table */}
      <div className="bg-[#04080F] border border-cyan-500/20 rounded-2xl p-5 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between font-orb text-xs font-bold text-white border-b border-white/10 pb-3">
          <span className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-cyan-400" />
            RECENT VISION INSPECTION HISTORY LOGS
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
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Disease Diagnosis</th>
                <th className="pb-2">Yellow %</th>
                <th className="pb-2">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 font-bold text-cyan-400">{row.id}</td>
                  <td className="py-2.5 text-white/50">{row.time}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                  <td className="py-2.5 font-bold text-white">{row.disease}</td>
                  <td className="py-2.5 text-amber-400">{row.yellow}%</td>
                  <td className="py-2.5 text-cyan-400">{row.conf}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
