const WebSocket = require('ws');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.setupHandlers();
  }

  setupHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('🔌 New WebSocket connection:', req.socket.remoteAddress);
      this.clients.add(ws);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to HomeSync POC WebSocket',
        timestamp: new Date().toISOString()
      }));

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleClientMessage(ws, message);
        } catch (err) {
          console.error('❌ Invalid WebSocket message:', err);
        }
      });

      ws.on('close', () => {
        console.log('👋 WebSocket disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('❌ WebSocket error:', err);
        this.clients.delete(ws);
      });
    });

    console.log('📡 WebSocket server initialized');
  }

  handleClientMessage(ws, message) {
    console.log('📨 WebSocket message from client:', message);
    
    // Handle ping/pong for keepalive
    if (message.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
    }
  }

  broadcast(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  broadcastTelemetry(data) {
    this.broadcast({
      type: 'telemetry',
      data: data,
      timestamp: new Date().toISOString()
    });
  }

  broadcastRelayState(state) {
    this.broadcast({
      type: 'relay_state',
      state: state,
      timestamp: new Date().toISOString()
    });
  }

  getConnectedClientsCount() {
    return this.clients.size;
  }
}

module.exports = WebSocketService;
