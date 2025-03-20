import base64
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

from app.twilio_transcriber import TwilioTranscriber

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

@app.get("/api/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy", "message": "Service is running"},
        status_code=200
    )
    

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