from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional

# --- Telemetry & Status Schemas ---

class PositionSchema(BaseModel):
    x: float = Field(..., description="Cable position X coordinate in meters")
    y: float = Field(..., description="Cable position Y coordinate in meters")

class RobotStatusData(BaseModel):
    connection: str = Field(..., description="'connected' | 'disconnected' | 'degraded'")
    battery: float = Field(..., description="Battery level percentage (0 - 100)")
    position: PositionSchema = Field(..., description="Robot spatial coordinates")
    speed: float = Field(..., description="Current velocity in m/s")
    mode: str = Field(..., description="'manual' | 'autonomous' | 'idle'")
    temperature: float = Field(..., description="Motor temperature in °C")
    payload: float = Field(..., description="Harvested tea leaf weight in kg")
    lastUpdate: str = Field(..., description="ISO or human-readable timestamp of last telemetry update")

# --- Control Schemas ---

class ControlRequest(BaseModel):
    command: str = Field(..., description="Command string: move, set_mode, harvest, emergency_stop, stop")
    params: Dict[str, Any] = Field(default_factory=dict, description="Command parameters e.g. direction, speed, mode")
    timestamp: Optional[int] = Field(None, description="Unix timestamp of request dispatch")

class ControlResponse(BaseModel):
    success: bool = Field(..., description="Whether command was accepted and dispatched")
    message: str = Field(..., description="Human-readable result summary")
    hardware_ack: bool = Field(False, description="True if acknowledged by physical ESP32 over Wi-Fi")

# --- AI Prediction Schemas ---

class BoundingBoxSchema(BaseModel):
    x: int = Field(..., description="Bounding box top-left X coordinate")
    y: int = Field(..., description="Bounding box top-left Y coordinate")
    width: int = Field(..., description="Bounding box width")
    height: int = Field(..., description="Bounding box height")

class VisionDetectionResponse(BaseModel):
    status: str = Field(..., description="'HEALTHY' | 'WARNING' | 'DISEASED' | 'NO_LEAF_DETECTED'")
    disease: str = Field(..., description="Disease diagnosis string")
    yellow_percentage: float = Field(..., description="Chlorosis yellowing surface percentage")
    confidence: int = Field(..., description="Detection confidence score (0-100)")
    bounding_box: BoundingBoxSchema = Field(..., description="Localization bounding box")

class PredictionData(BaseModel):
    primaryLabel: str = Field(..., description="Primary classification e.g. 'Ready for Harvest'")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0")
    status: str = Field(..., description="'ready_harvest' | 'healthy' | 'disease'")
    recommendation: str = Field(..., description="Actionable operator advice")
    detectedIssues: List[str] = Field(default_factory=list, description="Array of detected plant health issues")
    lastScan: str = Field(..., description="Timestamp of latest vision scan")

class PredictRequest(BaseModel):
    features: Optional[List[float]] = Field(None, description="Optional feature vector input")
    image_url: Optional[str] = Field(None, description="Optional camera image frame URL")
    image_base64: Optional[str] = Field(None, description="Optional base64 encoded camera frame payload")

# --- Activity Log Schemas ---

class ActivityLogEntry(BaseModel):
    id: str = Field(..., description="Unique event identifier")
    timestamp: str = Field(..., description="Event timestamp (HH:MM:SS)")
    message: str = Field(..., description="Telemetry event description")
    level: str = Field(..., description="'info' | 'success' | 'warning' | 'error'")

class LogsResponse(BaseModel):
    logs: List[ActivityLogEntry] = Field(..., description="List of system activity logs")
