from fastapi import APIRouter
from backend.models.schemas import PredictionData, PredictRequest
from backend.services.dummy_service import DummyService

router = APIRouter()

@router.get("/predict", response_model=PredictionData, summary="Get latest AI vision inference prediction")
async def get_prediction():
    """
    Returns the latest tea leaf disease & harvest readiness inference results.
    """
    return DummyService.get_prediction()

@router.post("/predict", response_model=PredictionData, summary="Perform inference on frame input")
async def post_prediction(request: PredictRequest):
    """
    Simulates ML vision inference on uploaded image frame or feature vector.
    """
    return DummyService.get_prediction()
