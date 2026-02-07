const mqtt = require('mqtt');
const config = require('./config');

class MQTTService {
  constructor() {
    this.client = null;
    this.messageHandlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const options = {
        clientId: config.MQTT.CLIENT_ID,
        username: config.MQTT.USERNAME,
        password: config.MQTT.PASSWORD,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      };

      console.log('🔌 Connecting to MQTT Broker:', config.MQTT.BROKER_URL);
      
      this.client = mqtt.connect(config.MQTT.BROKER_URL, options);

      this.client.on('connect', () => {
        console.log('✅ MQTT Connected');
        this.subscribeToTopics();
        resolve();
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message);
      });

      this.client.on('error', (err) => {
        console.error('❌ MQTT Error:', err);
        reject(err);
      });

      this.client.on('disconnect', () => {
        console.log('⚠️ MQTT Disconnected');
      });

      this.client.on('reconnect', () => {
        console.log('🔄 MQTT Reconnecting...');
      });
    });
  }

  subscribeToTopics() {
    const topics = [
      config.MQTT.TOPICS.TELEMETRY_POWER,
      config.MQTT.TOPICS.TELEMETRY_VOLTAGE,
      config.MQTT.TOPICS.TELEMETRY_CURRENT
    ];

    topics.forEach(topic => {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`❌ Failed to subscribe ${topic}:`, err);
        } else {
          console.log(`📡 Subscribed to: ${topic}`);
        }
      });
    });
  }

  handleMessage(topic, message) {
    try {
      const payload = JSON.parse(message.toString());
      console.log(`📨 Received [${topic}]:`, payload);

      // Notify all handlers
      if (this.messageHandlers.has(topic)) {
        this.messageHandlers.get(topic).forEach(handler => handler(payload));
      }

      // Wildcard handler
      if (this.messageHandlers.has('*')) {
        this.messageHandlers.get('*').forEach(handler => handler(topic, payload));
      }
    } catch (err) {
      console.error('❌ Error parsing MQTT message:', err);
    }
  }

  onMessage(topic, handler) {
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, []);
    }
    this.messageHandlers.get(topic).push(handler);
  }

  publish(topic, message) {
    return new Promise((resolve, reject) => {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      
      this.client.publish(topic, payload, { qos: 1 }, (err) => {
        if (err) {
          console.error(`❌ Failed to publish to ${topic}:`, err);
          reject(err);
        } else {
          console.log(`📤 Published to [${topic}]:`, payload);
          resolve();
        }
      });
    });
  }

  sendRelayCommand(state) {
    const message = {
      command: 'relay',
      state: state,
      timestamp: new Date().toISOString()
    };
    return this.publish(config.MQTT.TOPICS.COMMAND_RELAY, message);
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

module.exports = new MQTTService();
