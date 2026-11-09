from typing import Dict, Set, Any
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger("civicconnect.websocket")

class ConnectionManager:
    def __init__(self):
        # Room subscribers: ticket_id -> set of active WebSockets
        self.ticket_rooms: Dict[str, Set[WebSocket]] = {}
        # User subscribers: user_id -> set of active WebSockets (for personal notifications)
        self.user_connections: Dict[str, Set[WebSocket]] = {}

    async def connect_ticket(self, websocket: WebSocket, ticket_id: str):
        await websocket.accept()
        if ticket_id not in self.ticket_rooms:
            self.ticket_rooms[ticket_id] = set()
        self.ticket_rooms[ticket_id].add(websocket)
        logger.info(f"WebSocket connected to ticket room {ticket_id}")

    def disconnect_ticket(self, websocket: WebSocket, ticket_id: str):
        if ticket_id in self.ticket_rooms:
            self.ticket_rooms[ticket_id].discard(websocket)
            if not self.ticket_rooms[ticket_id]:
                del self.ticket_rooms[ticket_id]
        logger.info(f"WebSocket disconnected from ticket room {ticket_id}")

    async def connect_user(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(websocket)

    def disconnect_user(self, websocket: WebSocket, user_id: str):
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def broadcast_ticket_event(self, ticket_id: str, event_name: str, payload: Dict[str, Any]):
        """Broadcasts a real-time event to all clients inspecting a specific ticket."""
        message = {
            "event": event_name,
            "ticket_id": ticket_id,
            "data": payload
        }
        if ticket_id in self.ticket_rooms:
            dead_sockets = set()
            for ws in self.ticket_rooms[ticket_id]:
                try:
                    await ws.send_text(json.dumps(message))
                except Exception:
                    dead_sockets.add(ws)
            for ws in dead_sockets:
                self.ticket_rooms[ticket_id].discard(ws)

    async def send_user_notification(self, user_id: str, notification_payload: Dict[str, Any]):
        """Delivers real-time push notification to a specific user's open sessions."""
        message = {
            "event": "notification.created",
            "data": notification_payload
        }
        if user_id in self.user_connections:
            dead_sockets = set()
            for ws in self.user_connections[user_id]:
                try:
                    await ws.send_text(json.dumps(message))
                except Exception:
                    dead_sockets.add(ws)
            for ws in dead_sockets:
                self.user_connections[user_id].discard(ws)

manager = ConnectionManager()
