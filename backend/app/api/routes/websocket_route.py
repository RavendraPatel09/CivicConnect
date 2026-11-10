from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ...websocket.manager import manager

router = APIRouter(tags=["WebSockets"])

@router.websocket("/ws/tickets/{ticket_id}")
async def websocket_ticket_updates(websocket: WebSocket, ticket_id: str):
    await manager.connect_ticket(websocket, ticket_id)
    try:
        while True:
            # Keep connection open and accept client ping or client messages
            data = await websocket.receive_text()
            # Send heartbeat ack
            await websocket.send_json({"event": "pong", "ticket_id": ticket_id})
    except WebSocketDisconnect:
        manager.disconnect_ticket(websocket, ticket_id)
    except Exception:
        manager.disconnect_ticket(websocket, ticket_id)

@router.websocket("/ws/notifications/{user_id}")
async def websocket_user_notifications(websocket: WebSocket, user_id: str):
    await manager.connect_user(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"event": "pong", "user_id": user_id})
    except WebSocketDisconnect:
        manager.disconnect_user(websocket, user_id)
    except Exception:
        manager.disconnect_user(websocket, user_id)
