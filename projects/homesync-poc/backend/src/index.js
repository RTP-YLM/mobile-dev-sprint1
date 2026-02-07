const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const mqttService = require('./services/mqttService');
const influxdbService = require('./services/influxdbService');
const WebSocketService = require('./services/websocketService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Store latest readings
let latestReadings = {
  power: null,
  voltage: null,
  current: null,
  relayState: false,
  lastUpdate: null
};

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'HomeSync POC Backend',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.get('/api/poc/readings', async (req, res) => {
  try {
    const dbReadings = await influxdbService.getLatestReadings(5);
    
    res.json({
      success: true,
      data: {
        power: dbReadings.power?.value || latestReadings.power,
        voltage: dbReadings.voltage?.value || latestReadings.voltage,
        current: dbReadings.current?.value || latestReadings.current,
        relayState: latestReadings.relayState,
        lastUpdate: dbReadings.power?.time || latestReadings.lastUpdate
      }
    });
  } catch (err) {
    console.error('❌ Error fetching readings:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      data: latestReadings
    });
  }
});

app.post('/api/poc/relay', async (req, res) => {
  const { state } = req.body;
  
  if (typeof state !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'State must be a boolean (true/false)'
    });
  }

  try {
    await mqttService.sendRelayCommand(state);
    
    latestReadings.relayState = state;
    
    // Broadcast to WebSocket clients
    if (app.wsService) {
      app.wsService.broadcastRelayState(state);
    }

    res.json({
      success: true,
      message: `Relay ${state ? 'ON' : 'OFF'} command sent`,
      state: state
    });
  } catch (err) {
    console.error('❌ Error sending relay command:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mqtt: mqttService.client?.connected || false,
    wsClients: app.wsService?.getConnectedClientsCount() || 0,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Initialize services
async function startServer() {
  try {
    // Connect to MQTT
    await mqttService.connect();

    // Setup MQTT message handlers
    mqttService.onMessage(config.MQTT.TOPICS.TELEMETRY_POWER, (data) => {
      latestReadings.power = data.value;
      latestReadings.lastUpdate = new Date().toISOString();
      
      // Write to InfluxDB
      influxdbService.writeTelemetry('power', data.value);
      
      // Broadcast via WebSocket
      if (app.wsService) {
        app.wsService.broadcastTelemetry({
          type: 'power',
          value: data.value,
          timestamp: data.timestamp
        });
      }
    });

    mqttService.onMessage(config.MQTT.TOPICS.TELEMETRY_VOLTAGE, (data) => {
      latestReadings.voltage = data.value;
      influxdbService.writeTelemetry('voltage', data.value);
      
      if (app.wsService) {
        app.wsService.broadcastTelemetry({
          type: 'voltage',
          value: data.value,
          timestamp: data.timestamp
        });
      }
    });

    mqttService.onMessage(config.MQTT.TOPICS.TELEMETRY_CURRENT, (data) => {
      latestReadings.current = data.value;
      influxdbService.writeTelemetry('current', data.value);
      
      if (app.wsService) {
        app.wsService.broadcastTelemetry({
          type: 'current',
          value: data.value,
          timestamp: data.timestamp
        });
      }
    });

    // Start HTTP server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📡 API: http://localhost:${config.PORT}/api/poc/readings`);
      console.log(`🔌 WS: ws://localhost:${config.PORT}`);
    });

    // Initialize WebSocket
    app.wsService = new WebSocketService(server);

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down...');
  mqttService.disconnect();
  await influxdbService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down...');
  mqttService.disconnect();
  await influxdbService.close();
  process.exit(0);
});

startServer();
