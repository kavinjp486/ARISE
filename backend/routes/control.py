from fastapi import APIRouter
from backend.models.schemas import ControlRequest, ControlResponse
from backend.services.dummy_service import DummyService

router = APIRouter()

@router.post("/control", response_model=ControlResponse, summary="Execute a command on the device/system")
async def execute_control(request: ControlRequest):
    """
    Triggers actions/commands on the system and returns control confirmation dummy JSON.
    """
    return DummyService.execute_dummy_control(request.command, request.params)
