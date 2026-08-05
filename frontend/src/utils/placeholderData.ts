import type {
  ActivityLogEntry,
  CameraFeedData,
  ControlAction,
  PredictionData,
  RobotStatusData,
  StatCardData,
} from "@/types";

export const PLACEHOLDER_STATS: StatCardData[] = [
  {
    id: "harvested",
    label: "Leaves Harvested",
    value: "1,284",
    unit: "kg",
    change: "+12.4%",
    trend: "up",
  },
  {
    id: "coverage",
    label: "Field Coverage",
    value: "67",
    unit: "%",
    change: "+5.2%",
    trend: "up",
  },
  {
    id: "uptime",
    label: "Robot Uptime",
    value: "6.2",
    unit: "hrs",
    change: "Stable",
    trend: "neutral",
  },
  {
    id: "alerts",
    label: "Active Alerts",
    value: "2",
    change: "-1 today",
    trend: "down",
  },
];

export const PLACEHOLDER_ROBOT_STATUS: RobotStatusData = {
  connection: "connected",
  battery: 78,
  position: { x: 142.5, y: 87.3 },
  speed: 0.8,
  mode: "autonomous",
  temperature: 34,
  payload: 12.4,
  lastUpdate: "2026-08-05 21:45:02",
};

export const PLACEHOLDER_PREDICTION: PredictionData = {
  primaryLabel: "Ready for Harvest",
  confidence: 0.92,
  status: "ready_harvest",
  recommendation: "Proceed with selective plucking on rows 14–16.",
  detectedIssues: ["Minor leaf discoloration (2%)", "Moisture level optimal"],
  lastScan: "2026-08-05 21:44:58",
};

export const PLACEHOLDER_CAMERA: CameraFeedData = {
  label: "Front Camera — Row 14",
  resolution: "1920×1080",
  fps: 24,
  isLive: true,
};

export const PLACEHOLDER_ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: "1",
    timestamp: "21:45:02",
    message: "Autonomous harvest cycle resumed on sector B.",
    level: "success",
  },
  {
    id: "2",
    timestamp: "21:44:31",
    message: "AI scan completed — harvest-ready leaves detected.",
    level: "info",
  },
  {
    id: "3",
    timestamp: "21:43:10",
    message: "Cable tension within safe operating range.",
    level: "info",
  },
  {
    id: "4",
    timestamp: "21:41:55",
    message: "Battery at 78% — no action required.",
    level: "success",
  },
  {
    id: "5",
    timestamp: "21:40:22",
    message: "Minor vibration spike detected — auto-corrected.",
    level: "warning",
  },
  {
    id: "6",
    timestamp: "21:38:04",
    message: "Operator switched control mode to autonomous.",
    level: "info",
  },
];

export const PLACEHOLDER_CONTROLS: ControlAction[] = [
  { id: "forward", label: "Forward", icon: "ArrowUp", variant: "default" },
  { id: "backward", label: "Backward", icon: "ArrowDown", variant: "default" },
  { id: "left", label: "Left", icon: "ArrowLeft", variant: "outline" },
  { id: "right", label: "Right", icon: "ArrowRight", variant: "outline" },
  { id: "harvest", label: "Harvest", icon: "Scissors", variant: "default" },
  { id: "stop", label: "Emergency Stop", icon: "Octagon", variant: "destructive" },
];

/** Hourly harvest yield for the statistics chart */
export const PLACEHOLDER_YIELD_DATA = [
  { hour: "06:00", yield: 42 },
  { hour: "08:00", yield: 68 },
  { hour: "10:00", yield: 95 },
  { hour: "12:00", yield: 112 },
  { hour: "14:00", yield: 88 },
  { hour: "16:00", yield: 130 },
  { hour: "18:00", yield: 104 },
];
