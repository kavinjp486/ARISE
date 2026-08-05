from fastapi import APIRouter
from backend.models.schemas import PredictRequest, PredictResponse
from backend.services.dummy_service import DummyService

router = APIRouter()

@router.post("/predict", response_model=PredictResponse, summary="Perform inference on provided features")
async def predict(request: PredictRequest):
    """
    Simulates model inference using dummy ML classification and logic.
    """
    return DummyService.get_dummy_prediction(request.features)
