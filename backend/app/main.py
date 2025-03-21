import asyncio
import base64
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
from typing import Dict, Any
import urllib.parse

from app.twilio_transcriber import TwilioTranscriber
from app.websocket_manager import connect, disconnect, send_card
from app.services.profile_service import ProfileService
from app.services.portfolio_service import PortfolioService
from app.services.buckets_service import BucketsService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="FastAPI Backend",
    description="Backend API for the full stack application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize profile service
profile_service = ProfileService()
portfolio_service = PortfolioService()
bucket_service = BucketsService()
PROFILES_PATH = os.path.join(os.path.dirname(__file__), "database", "profiles.json")
PORTFOLIOS_PATH = os.path.join(os.path.dirname(__file__), "database", "portfolio.json")

@app.get("/api/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy", "message": "Service is running"},
        status_code=200
    )

@app.get("/api/portfolio/", response_model=Dict[str, Any])
async def get_preloaded_portfolio():
    """
    Get a pre-loaded portfolio
    """
    try:
        portfolio = portfolio_service.load_portfolio(PORTFOLIOS_PATH)
        return portfolio
    except Exception as e:
        logger.error(f"Error retrieving portfolio: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving portfolio: {str(e)}")

@app.get("/api/profiles/{name}", response_model=Dict[str, Any])
async def get_profile_by_name(name: str = Path(..., description="Name of the profile to retrieve")):
    """
    Get a profile by name
    """
    try:
        # Decode URL-encoded name
        decoded_name = urllib.parse.unquote(name)
        logger.info(f"Looking for profile with name: {decoded_name}")
        
        profiles = profile_service.load_profile(PROFILES_PATH)
        profile = profile_service.get_profile_by_name(profiles, decoded_name)
        
        if not profile:
            raise HTTPException(status_code=404, detail=f"Profile with name '{decoded_name}' not found")
            
        return profile
    except Exception as e:
        logger.error(f"Error retrieving profile for name '{name}': {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving profile: {str(e)}")

@app.get("/api/buckets/{id}", response_model=Dict[str, Any])
async def get_bucket_by_id(id: str = Path(..., description="ID of the bucket to retrieve")):
    """
    Get a bucket by id
    """
    try:
        bucket = bucket_service.get_bucket_by_id(id)
        return bucket
    except Exception as e:
        logger.error(f"Error retrieving bucket for id '{id}': {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving bucket: {str(e)}")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connect(websocket)
    try:
        while True:
            # Keep connection open
            data = await websocket.receive_text()
            # You can handle any incoming messages here
    except WebSocketDisconnect:
        disconnect(websocket)


@app.websocket("/media")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    transcriber = None
    
    try:
        logger.info("WebSocket connection established")
        
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            event_type = message.get("event")
            
            if event_type == "connected":
                # Initialize the transcriber when the client connects
                transcriber = TwilioTranscriber()
                transcriber.connect()
                logger.info("Transcriber connected")
                transcriber.send_start()
                
            elif event_type == "start":
                logger.info("Transcription started")
                # Any additional start logic can go here
                
            elif event_type == "media":
                if not transcriber:
                    logger.error("Received media before transcriber was connected")
                    await websocket.send_text(json.dumps({
                        "error": "Transcriber not connected. Send 'connected' event first."
                    }))
                    continue
                    
                try:
                    payload_b64 = message["media"]["payload"]
                    payload_mulaw = base64.b64decode(payload_b64)
                    transcriber.stream(payload_mulaw)
                except KeyError as e:
                    logger.error(f"Missing expected field in media event: {e}")
                    await websocket.send_text(json.dumps({
                        "error": f"Malformed media event: {str(e)}"
                    }))
                except Exception as e:
                    logger.error(f"Error processing media: {e}")
                    await websocket.send_text(json.dumps({
                        "error": f"Failed to process media: {str(e)}"
                    }))
            
            elif event_type == "stop":
                logger.info("Transcription stopped")
                # Any additional stop logic can go here
                transcriber.send_stop()
                
            else:
                logger.warning(f"Unknown event type: {event_type}")
                
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        # Clean up resources
        if transcriber:
            try:
                # Assuming TwilioTranscriber has a disconnect method
                transcriber.disconnect()
                logger.info("Transcriber disconnected")
            except Exception as e:
                logger.error(f"Error disconnecting transcriber: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("BACKEND_HOST", "localhost"),
        port=int(os.getenv("BACKEND_PORT", 8000)),
        reload=True
    ) 