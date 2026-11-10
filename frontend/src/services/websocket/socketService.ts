type EventHandler = (event: any) => void;

class WebSocketService {
  private sockets: Map<string, WebSocket> = new Map();
  private listeners: Map<string, Set<EventHandler>> = new Map();

  private getWsUrl(path: string): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}${path}`;
  }

  public subscribeToTicket(ticketId: string, onUpdate: EventHandler): () => void {
    const channelKey = `ticket:${ticketId}`;
    if (!this.listeners.has(channelKey)) {
      this.listeners.set(channelKey, new Set());
    }
    this.listeners.get(channelKey)!.add(onUpdate);

    if (!this.sockets.has(channelKey)) {
      const url = this.getWsUrl(`/ws/tickets/${ticketId}`);
      try {
        const ws = new WebSocket(url);
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.listeners.get(channelKey)?.forEach((cb) => cb(data));
          } catch (e) {
            console.error('Failed to parse WebSocket message', e);
          }
        };

        ws.onclose = () => {
          this.sockets.delete(channelKey);
        };

        ws.onerror = () => {
          // Silent fallback
        };

        this.sockets.set(channelKey, ws);
      } catch (e) {
        // WebSocket not available
      }
    }

    return () => {
      const subs = this.listeners.get(channelKey);
      if (subs) {
        subs.delete(onUpdate);
        if (subs.size === 0) {
          this.listeners.delete(channelKey);
          const ws = this.sockets.get(channelKey);
          if (ws) {
            ws.close();
            this.sockets.delete(channelKey);
          }
        }
      }
    };
  }

  public subscribeToNotifications(userId: string, onNotification: EventHandler): () => void {
    const channelKey = `user:${userId}`;
    if (!this.listeners.has(channelKey)) {
      this.listeners.set(channelKey, new Set());
    }
    this.listeners.get(channelKey)!.add(onNotification);

    if (!this.sockets.has(channelKey)) {
      const url = this.getWsUrl(`/ws/notifications/${userId}`);
      try {
        const ws = new WebSocket(url);
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.listeners.get(channelKey)?.forEach((cb) => cb(data));
          } catch (e) {
            console.error('Failed to parse notification WS message', e);
          }
        };

        ws.onclose = () => {
          this.sockets.delete(channelKey);
        };

        ws.onerror = () => {
          // Silent fallback
        };

        this.sockets.set(channelKey, ws);
      } catch (e) {
        // Fallback
      }
    }

    return () => {
      const subs = this.listeners.get(channelKey);
      if (subs) {
        subs.delete(onNotification);
        if (subs.size === 0) {
          this.listeners.delete(channelKey);
          const ws = this.sockets.get(channelKey);
          if (ws) {
            ws.close();
            this.sockets.delete(channelKey);
          }
        }
      }
    };
  }
}

export const socketService = new WebSocketService();
export default socketService;
