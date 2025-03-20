import asyncio
import websockets
import json

# Store active WebSocket connections
active_connections = set()

async def handle_client(websocket, path):
    """
    Handles WebSocket connections, receives messages, and broadcasts responses.
    """
    active_connections.add(websocket)
    print(f"New client connected! Total clients: {len(active_connections)}")

    try:
        async for message in websocket:
            data = json.loads(message)

            # Process different message types
            if data["type"] == "text":
                response = {"type": "text", "data": f"Received: {data['data']}"}
                await broadcast(response)

            elif data["type"] == "event":
                response = {"type": "event", "data": f"Event triggered: {data['data']}"}
                await broadcast(response)

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        active_connections.remove(websocket)


async def broadcast(message: dict):
    """
    Send real-time messages to all connected WebSocket clients.
    """
    if active_connections:  # Ensure there are connected clients
        msg = json.dumps(message)
        await asyncio.wait([ws.send(msg) for ws in active_connections])


async def start_websocket_server():
    """
    Starts the WebSocket server on ws://localhost:8765
    """
    print("Starting WebSocket server on ws://localhost:8765")
    async with websockets.serve(handle_client, "0.0.0.0", 8765):
        await asyncio.Future()  # Keep the WebSocket server running


if __name__ == "__main__":
    asyncio.run(start_websocket_server())
