import asyncio
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Store active WebSocket connections
active_connections = []

async def connect(websocket):
    """Register a new WebSocket connection"""
    await websocket.accept()
    active_connections.append(websocket)
    logger.info(f"New WebSocket connection. Total connections: {len(active_connections)}")
    return websocket

def disconnect(websocket):
    """Unregister a WebSocket connection"""
    if websocket in active_connections:
        active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Remaining connections: {len(active_connections)}")

async def send_card(content):
    """Send a card to all connected clients"""
    if not active_connections:
        logger.warning("No active connections to send card to")
        return False
    
    logger.info(f"Sending card to {len(active_connections)} connections")
    
    # Send to all connected clients
    for connection in active_connections:
        try:
            # Use create_task to avoid blocking
            asyncio.create_task(connection.send_json(content))
        except Exception as e:
            logger.error(f"Error sending to WebSocket: {e}")
            # Don't remove here to avoid modifying the list during iteration
    
    return True 