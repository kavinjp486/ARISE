export type ConnectionStatus = "connected" | "disconnected" | "degraded";

export type RobotMode = "manual" | "autonomous" | "idle";

export type LogLevel = "info" | "success" | "warning" | "error";

export type PredictionStatus = "healthy" | "disease" | "ready_harvest";

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  unit?: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: LogLevel;
}

export interface RobotStatusData {
  connection: ConnectionStatus;
  battery: number;
  position: { x: number; y: number };
  speed: number;
  mode: RobotMode;
  temperature: number;
  payload: number;
  lastUpdate: string;
}

export interface PredictionData {
  primaryLabel: string;
  confidence: number;
  status: PredictionStatus;
  recommendation: string;
  detectedIssues: string[];
  lastScan: string;
}

export interface CameraFeedData {
  label: string;
  resolution: string;
  fps: number;
  isLive: boolean;
}

export interface ControlAction {
  id: string;
  label: string;
  icon: string;
  variant: "default" | "outline" | "destructive";
}
