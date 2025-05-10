import { toast } from 'react-toastify';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = null;
    this.dispatch = null;
    this.heartbeatInterval = null;
    this.reconnectTimeout = null;
  }

  initialize(url, dispatch) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.url = url.replace('http://', 'ws://').replace('https://', 'wss://') + '/api/orders/ws';
    this.dispatch = dispatch;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected to:', this.url);
      toast.info('Connected to real-time updates');
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error, event.data);
        toast.error('Invalid WebSocket data received');
        return;
      }
      console.log('WebSocket Update:', data);

      if (data.message) {
        toast.info(data.message);
      } else if (data.error) {
        toast.error(`WebSocket Error: ${data.error}`);
      } else if (!data.operation || !data.order && !data.orderId) {
        console.error('Invalid WebSocket update:', data);
        toast.error('Received invalid order update');
      } else {
        this.dispatch({ type: 'orders/websocketOrderUpdate', payload: data });
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      toast.error('Lost connection to updates. Please refresh manually.');
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      //toast.warn('Disconnected from real-time updates. Reconnecting...');
      this.stopHeartbeat();
      this.scheduleReconnect();
    };

    this.ws.addEventListener('ping', () => {
      if (this.ws.readyState === WebSocket.OPEN) {
        console.log('Received ping');
      }
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log('Sending client heartbeat');
        this.ws.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 25000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) return;

    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.connect();
      this.reconnectTimeout = null;
    }, 3000);
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketService();