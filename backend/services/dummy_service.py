import time
from datetime import datetime, timezone
from typing import Dict, Any, List
from backend.models.schemas import (
    StatusResponse,
    ControlResponse,
    PredictResponse,
    LogEntry,
    LogsResponse,
)

class DummyService:
    @staticmethod
    def get_dummy_status() -> StatusResponse:
        return StatusResponse(
            status="healthy",
            device_connected=True,
            mode="active_monitoring",
            battery_level=87.5,
            uptime_seconds=int(time.monotonic()),
            details={
                "cpu_utilization_percent": 12.4,
                "memory_free_mb": 1420.5,
                "sensor_rssi_dbm": -65,
                "environment_temp_c": 24.8
            }
        )

    @staticmethod
    def execute_dummy_control(command: str, params: Dict[str, Any]) -> ControlResponse:
        # A simple response message based on the command
        valid_commands = ["start", "stop", "calibrate", "reset"]
        normalized_command = command.lower().strip()
        
        if normalized_command in valid_commands:
            status = "success"
            message = f"Command '{normalized_command}' received and acknowledged."
            payload = {"processed_at": datetime.now(timezone.utc).isoformat(), "parameters_applied": params}
        else:
            status = "failed"
            message = f"Unknown command '{command}'. Valid commands are: {', '.join(valid_commands)}"
            payload = {}

        return ControlResponse(
            status=status,
            message=message,
            executed_command=command,
            payload=payload
        )

    @staticmethod
    def get_dummy_prediction(features: List[float]) -> PredictResponse:
        # Generate a dummy prediction based on features.
        # Since ML is not integrated yet, we do a simple mock classification
        # for testing robustness (e.g. sum of features dictates classes)
        total_sum = sum(features)
        
        if total_sum > 10.0:
            prediction = "anomaly_detected"
            confidence = 0.92
        else:
            prediction = "normal"
            confidence = 0.98

        return PredictResponse(
            prediction=prediction,
            confidence=confidence,
            model_version="mock-v1.0.0",
            timestamp=datetime.now(timezone.utc).isoformat()
        )

    @staticmethod
    def get_dummy_logs() -> LogsResponse:
        current_time = datetime.now(timezone.utc)
        
        # Static mock logs with dynamically updated timestamps
        logs = [
            LogEntry(
                timestamp=current_time.replace(minute=max(0, current_time.minute - 5)).isoformat(),
                level="INFO",
                message="ARISE Backend application started successfully."
            ),
            LogEntry(
                timestamp=current_time.replace(minute=max(0, current_time.minute - 4)).isoformat(),
                level="INFO",
                message="Connected to virtual ESP32 sensor module on channel 0."
            ),
            LogEntry(
                timestamp=current_time.replace(minute=max(0, current_time.minute - 2)).isoformat(),
                level="WARNING",
                message="Virtual ESP32 connection experienced mild latency fluctuations (50ms)."
            ),
            LogEntry(
                timestamp=current_time.isoformat(),
                level="INFO",
                message="System status health-check: OK."
            ),
        ]
        
        return LogsResponse(
            logs=logs,
            total_count=len(logs)
        )
