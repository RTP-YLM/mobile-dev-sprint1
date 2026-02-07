require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MQTT - HiveMQ Cloud
  MQTT: {
    BROKER_URL: process.env.MQTT_BROKER_URL || 'mqtts://your-hivemq-broker.hivemq.cloud:8883',
    USERNAME: process.env.MQTT_USERNAME || 'your-username',
    PASSWORD: process.env.MQTT_PASSWORD || 'your-password',
    CLIENT_ID: process.env.MQTT_CLIENT_ID || `homesync-backend-${Date.now()}`,
    
    // Topics
    TOPICS: {
      TELEMETRY_POWER: 'homesync/poc/node1/telemetry/power',
      TELEMETRY_VOLTAGE: 'homesync/poc/node1/telemetry/voltage',
      TELEMETRY_CURRENT: 'homesync/poc/node1/telemetry/current',
      COMMAND_RELAY: 'homesync/poc/node1/command/relay'
    }
  },

  // InfluxDB
  INFLUXDB: {
    URL: process.env.INFLUXDB_URL || 'http://localhost:8086',
    TOKEN: process.env.INFLUXDB_TOKEN || 'your-token',
    ORG: process.env.INFLUXDB_ORG || 'homesync',
    BUCKET: process.env.INFLUXDB_BUCKET || 'poc_telemetry'
  },

  // PostgreSQL (Optional for POC)
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/homesync'
};
