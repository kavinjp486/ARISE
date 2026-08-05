from pydantic import BaseModel, Field
from typing import Dict, List, Any

# --- GET /status Schemas ---

class StatusResponse(BaseModel):
    status: str = Field(..., description="Overall backend system status")
    device_connected: bool = Field(..., description="Connection status of the external device (e.g. ESP32)")
    mode: str = Field(..., description="Current operating mode of the system")
    battery_level: float = Field(..., description="Battery level percentage of the connected device")
    uptime_seconds: int = Field(..., description="System uptime in seconds")
    details: Dict[str, Any] = Field(default_factory=dict, description="Additional environment metrics")


# --- POST /control Schemas ---

class ControlRequest(BaseModel):
    command: str = Field(..., description="The command action to execute (e.g. 'start', 'stop', 'calibrate')")
    params: Dict[str, Any] = Field(default_factory=dict, description="Optional parameters for the command")


class ControlResponse(BaseModel):
    status: str = Field(..., description="Result of the command execution (e.g. 'success', 'failed')")
    message: str = Field(..., description="Informational message about the command result")
    executed_command: str = Field(..., description="The command that was executed")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Returned data from the command execution")


# --- POST /predict Schemas ---

class PredictRequest(BaseModel):
    features: List[float] = Field(..., description="List of numerical feature inputs for prediction")


class PredictResponse(BaseModel):
    prediction: str = Field(..., description="Predicted class or regression value")
    confidence: float = Field(..., description="Confidence score of the prediction (between 0.0 and 1.0)")
    model_version: str = Field(..., description="Version identifier of the running ML model")
    timestamp: str = Field(..., description="ISO 8601 timestamp of when the prediction was made")


# --- GET /logs Schemas ---

class LogEntry(BaseModel):
    timestamp: str = Field(..., description="ISO 8601 timestamp of the log event")
    level: str = Field(..., description="Severity level of the log (e.g. INFO, WARNING, ERROR)")
    message: str = Field(..., description="The log message content")


class LogsResponse(BaseModel):
    logs: List[LogEntry] = Field(..., description="List of recent logs")
    total_count: int = Field(..., description="Total count of logs returned")
