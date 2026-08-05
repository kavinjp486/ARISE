from fastapi import APIRouter
from backend.models.schemas import RobotStatusData
from backend.services.esp32_service import ESP32Service

router = APIRouter()

@router.get("/status", response_model=RobotStatusData, summary="Retrieve current robot telemetry status")
async def get_status():
    """
    Returns live robot telemetry status (battery, speed, position, payload, mode, connectivity).
    """
    return ESP32Service.get_latest_status()

@router.post("/status/telemetry", summary="Receive telemetry push from ESP32")
async def update_telemetry(data: RobotStatusData):
    """
    Endpoint for physical ESP32 to push real-time sensor telemetry directly to FastAPI.
    """
    ESP32Service.update_telemetry(data)
    return {"status": "ACK", "message": "Telemetry cache updated"}
