from fastapi import APIRouter
from backend.models.schemas import ControlRequest, ControlResponse
from backend.services.esp32_service import ESP32Service

router = APIRouter()

@router.post("/control", response_model=ControlResponse, summary="Execute navigation or harvesting command")
async def execute_control(request: ControlRequest):
    """
    Triggers actions (move, harvest, set_mode, emergency_stop) on ESP32 or Mock hardware.
    """
    return await ESP32Service.dispatch_command(request.command, request.params)
