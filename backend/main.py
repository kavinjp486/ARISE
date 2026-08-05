from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import status, control, predict, logs

app = FastAPI(
    title="ARISE Backend API",
    description="FastAPI backend serving control, status, telemetry logs, and machine learning prediction mocks.",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust as needed in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(status.router, tags=["Status"])
app.include_router(control.router, tags=["Control"])
app.include_router(predict.router, tags=["Predict"])
app.include_router(logs.router, tags=["Logs"])

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint offering a simple welcome message and API redirect.
    """
    return {
        "message": "Welcome to the ARISE API. Visit /docs for the interactive Swagger documentation.",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    # Start server locally when executing main.py directly
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
