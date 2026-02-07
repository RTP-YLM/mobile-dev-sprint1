# Spec: MQTT Connection & Communication

## Domain: Technical

This specification defines MQTT protocol implementation for device communication using HiveMQ Cloud as the managed broker.

---

## HiveMQ Cloud Configuration

### Broker Settings

```yaml
Broker: {cluster-id}.s1.eu.hivemq.cloud
Protocol: MQTT v3.1.1 / MQTT v5
Port: 8883 (TLS/SSL)
WebSocket Port: 8884 (WSS)
MQTT over TLS: Required for production
```

### Authentication

```yaml
Method: Username/Password
Username: {hivemq-username}
Password: {hivemq-password}
Client ID Format: homesync_{home_id}_{device_id}_{random}
```

### Free Tier Limits

| Limit | Value | Notes |
|-------|-------|-------|
| **Concurrent Connections** | 100 | Sufficient for ~20-30 homes |
| **Data Transfer** | 10 GB/month | ~330 MB/day |
| **Namespaces** | 3 | dev, staging, prod |
| **MQTT Connections/sec** | 1,000 | Burst capacity |
| **Message Size** | 64 KB | Per message |

### Upgrade Path

When limits are approached:
- **HiveMQ Cloud Starter**: $30/month, 1,000 connections, 100 GB
- **HiveMQ Cloud Business**: $150/month, 10,000 connections, 500 GB
- **Self-hosted EMQX**: Unlimited (requires infrastructure management)

---

## Topic Structure

### Base Topic Pattern

```
homesync/{home_id}/nodes/{node_id}/{category}/{metric}
```

### Topic Categories

#### 1. Telemetry (Device → Backend)

```
homesync/{home_id}/nodes/{node_id}/telemetry/power
homesync/{home_id}/nodes/{node_id}/telemetry/voltage
homesync/{home_id}/nodes/{node_id}/telemetry/current
homesync/{home_id}/nodes/{node_id}/telemetry/energy
homesync/{home_id}/nodes/{node_id}/telemetry/power_factor
homesync/{home_id}/nodes/{node_id}/telemetry/frequency
homesync/{home_id}/nodes/{node_id}/telemetry/temperature
```

#### 2. Status (Device → Backend)

```
homesync/{home_id}/nodes/{node_id}/status/online
homesync/{home_id}/nodes/{node_id}/status/relay
homesync/{home_id}/nodes/{node_id}/status/firmware
homesync/{home_id}/nodes/{node_id}/status/rssi
```

#### 3. Command (Backend → Device)

```
homesync/{home_id}/nodes/{node_id}/command/relay
homesync/{home_id}/nodes/{node_id}/command/led
homesync/{home_id}/nodes/{node_id}/command/config
homesync/{home_id}/nodes/{node_id}/command/ota
```

#### 4. Response (Device → Backend)

```
homesync/{home_id}/nodes/{node_id}/response/command
homesync/{home_id}/nodes/{node_id}/response/ota
```

### Example Topics

```
# Power reading from node-001 in home-abc123
homesync/abc123/nodes/node-001/telemetry/power

# Relay control command to node-001
homesync/abc123/nodes/node-001/command/relay

# Online status
homesync/abc123/nodes/node-001/status/online
```

---

## Message Payload Format

### Telemetry Messages

```json
{
  "value": 125.5,
  "unit": "W",
  "timestamp": "2025-02-06T14:30:00Z",
  "quality": 99
}
```

### Status Messages

```json
{
  "online": true,
  "timestamp": "2025-02-06T14:30:00Z",
  "uptime": 86400,
  "firmware": "1.2.3"
}
```

### Command Messages

```json
{
  "action": "on",
  "request_id": "req-uuid-123",
  "timestamp": "2025-02-06T14:30:00Z"
}
```

### Response Messages

```json
{
  "request_id": "req-uuid-123",
  "status": "success",
  "result": "on",
  "timestamp": "2025-02-06T14:30:01Z"
}
```

---

## ADDED Requirements

### REQ-001: MQTT Client Configuration

The system MUST configure and manage MQTT client connections to HiveMQ Cloud.

#### Scenario: Broker configuration
- GIVEN app initializes
- WHEN setting up MQTT
- THEN support configuration for:
  - Broker host: `{cluster-id}.s1.eu.hivemq.cloud`
  - Port: 8883 (TLS required)
  - WebSocket Port: 8884 (for fallback)
  - Client ID: unique per device session
  - Keep-alive interval: 60 seconds
  - Clean session: false (for persistent subscriptions)
  - Authentication: Username/Password from HiveMQ console

#### Scenario: TLS/SSL connection
- GIVEN production environment
- WHEN connecting to HiveMQ Cloud
- THEN use TLS 1.2 or higher
- AND validate server certificate
- AND use CA certificate provided by HiveMQ

#### Scenario: WebSocket fallback
- GIVEN direct MQTT port blocked by firewall
- WHEN attempting connection
- THEN fallback to WebSocket Secure (WSS) on port 8884
- AND maintain same functionality over WS

---

### REQ-002: Connection Management

The system MUST manage MQTT connection lifecycle robustly.

#### Scenario: Auto-connect on startup
- GIVEN app launches
- WHEN MQTT service initializes
- THEN attempt connection to HiveMQ Cloud
- AND show connecting indicator
- AND timeout after 10 seconds if unreachable

#### Scenario: Automatic reconnection
- GIVEN connection is lost
- WHEN detecting disconnect
- THEN attempt reconnection with exponential backoff:
  - 1st retry: 1 second
  - 2nd retry: 2 seconds
  - 3rd retry: 4 seconds
  - Max: 60 seconds between retries
- AND update UI with connection status

#### Scenario: Connection state events
- GIVEN MQTT client exists
- WHEN connection state changes
- THEN emit events: connecting, connected, disconnected, error
- AND allow UI components to subscribe to state changes
- AND log state transitions for debugging

#### Scenario: Graceful disconnect
- GIVEN app is closing or user logs out
- WHEN disconnecting
- THEN send DISCONNECT packet
- AND unsubscribe from all topics
- AND release resources properly

---

### REQ-003: Topic Subscription

The system MUST subscribe to appropriate MQTT topics for device data.

#### Scenario: Device data subscription
- GIVEN device is registered with ID "node-001"
- WHEN device comes online
- THEN subscribe to: `homesync/{home_id}/nodes/node-001/telemetry/+`
- AND subscribe to: `homesync/{home_id}/nodes/node-001/status/+`
- AND subscribe to: `homesync/{home_id}/nodes/node-001/response/+`

#### Scenario: Multi-device subscription
- GIVEN multiple devices registered
- WHEN managing subscriptions
- THEN subscribe to each device's topics
- AND handle up to 20 concurrent device subscriptions
- AND unsubscribe when device removed

#### Scenario: Wildcard subscriptions
- GIVEN broker supports wildcards
- WHEN optimizing subscriptions
- THEN use: `homesync/{home_id}/nodes/+/telemetry/+` for all telemetry
- AND filter messages by registered device IDs
- AND balance between efficiency and precision

#### Scenario: QoS configuration
- GIVEN subscription setup
- WHEN configuring QoS
- THEN use QoS 0 for telemetry (fire-and-forget, real-time priority)
- AND use QoS 1 for commands (at-least-once delivery)
- AND use QoS 1 for status (ensure state consistency)

---

### REQ-004: Message Handling

The system MUST handle incoming MQTT messages efficiently.

#### Scenario: Parse telemetry messages
- GIVEN message arrives on `homesync/{home_id}/nodes/{node_id}/telemetry/{metric}`
- WHEN processing message
- THEN parse JSON payload
- AND extract value, unit, timestamp
- AND associate with node_id and metric from topic
- AND emit to data stream

#### Scenario: Status parsing
- GIVEN message on `homesync/{home_id}/nodes/{node_id}/status/online`
- WHEN processing
- THEN parse JSON payload
- AND update device online status
- AND trigger re-subscription if needed

#### Scenario: Online/offline detection
- GIVEN LWT (Last Will and Testament) configured
- WHEN device disconnects unexpectedly
- THEN receive LWT message on `homesync/{home_id}/nodes/{node_id}/status/online`
- AND mark device as offline
- AND update last seen timestamp

#### Scenario: Message queuing
- GIVEN high message frequency
- WHEN processing bursts
- THEN implement message queue/buffer
- AND process at sustainable rate
- AND drop outdated messages if falling behind

---

### REQ-005: Command Publishing

The system MUST publish commands to control devices via MQTT.

#### Scenario: Toggle device power
- GIVEN user taps power button
- WHEN sending command
- THEN publish to: `homesync/{home_id}/nodes/{node_id}/command/relay`
- WITH JSON payload: `{ "action": "on" | "off", "request_id": "..." }`
- AND QoS 1 for reliability
- AND timeout after 5 seconds if no response

#### Scenario: Command acknowledgment
- GIVEN command is sent
- WHEN device responds on `homesync/{home_id}/nodes/{node_id}/response/command`
- THEN parse response payload
- AND match request_id to pending command
- AND update UI with confirmed state

#### Scenario: Command retry
- GIVEN command fails or times out
- WHEN retrying
- THEN retry up to 3 times
- WITH exponential backoff
- AND show error to user if all retries fail

---

### REQ-006: Error Handling

The system MUST handle MQTT errors gracefully.

#### Scenario: Authentication failure
- GIVEN wrong credentials
- WHEN connecting to HiveMQ
- THEN detect CONNACK reason code
- AND show "Authentication Failed" error
- AND prompt user to check settings

#### Scenario: Network unreachable
- GIVEN no network connectivity
- WHEN attempting connection
- THEN detect socket error
- AND enter "offline mode"
- AND queue pending operations
- AND retry when network returns

#### Scenario: Broker limits reached
- GIVEN HiveMQ free tier limits reached
- WHEN subscribing or publishing
- THEN detect connection refused
- AND show appropriate error message
- AND suggest upgrade or limit usage

#### Scenario: Invalid message format
- GIVEN malformed JSON message received
- WHEN parsing
- THEN log warning with raw payload and topic
- AND skip processing
- AND continue with next message

---

### REQ-007: Backend MQTT Bridge

The system MUST implement backend service that bridges MQTT to database.

#### Scenario: Subscribe to all device topics
- GIVEN backend service starts
- WHEN connecting to HiveMQ
- THEN subscribe to: `homesync/+/nodes/+/telemetry/+`
- AND subscribe to: `homesync/+/nodes/+/status/+`
- AND parse home_id and node_id from topic

#### Scenario: Store telemetry to InfluxDB
- GIVEN telemetry message received
- WHEN processing
- THEN write to InfluxDB with:
  - Measurement: power_readings
  - Tags: home_id, node_id, metric
  - Fields: value, quality
  - Timestamp: from message or server time

#### Scenario: Handle device commands
- GIVEN mobile app sends command via REST API
- WHEN backend receives command
- THEN publish to appropriate MQTT topic
- AND wait for device response
- AND return result to mobile app

#### Scenario: Broadcast state changes
- GIVEN device state changes
- WHEN backend processes update
- THEN broadcast to WebSocket connections
- AND update Redis cache
- AND notify relevant mobile clients

---

### REQ-008: Last Will and Testament (LWT)

The system MUST configure LWT for device offline detection.

#### Scenario: Configure LWT on connect
- GIVEN NodeMCU connects to MQTT
- WHEN establishing connection
- THEN set LWT topic: `homesync/{home_id}/nodes/{node_id}/status/online`
- AND set LWT payload: `{ "online": false, "reason": "unexpected_disconnect" }`
- AND set LWT QoS: 1
- AND set LWT retain: true

#### Scenario: Graceful disconnect
- GIVEN device shuts down properly
- WHEN disconnecting
- THEN publish offline message manually
- AND with retain flag
- AND clear LWT

---

### REQ-009: Mobile MQTT Security

The system MUST NOT expose HiveMQ credentials in mobile app.

#### Scenario: Backend-mediated communication
- GIVEN mobile app needs to communicate with devices
- WHEN sending commands
- THEN send via Backend REST API
- AND let backend publish to MQTT
- AND do NOT include HiveMQ credentials in mobile app

#### Scenario: Real-time updates
- GIVEN mobile app needs real-time updates
- WHEN subscribing to device data
- THEN use WebSocket connection to backend
- OR use authenticated MQTT via backend proxy
- AND never connect directly to HiveMQ with shared credentials

---

## HiveMQ Cloud Setup Guide

### 1. Create Cluster

1. Sign up at [HiveMQ Cloud](https://console.hivemq.cloud)
2. Create new cluster (Free tier)
3. Select region: `eu-west-1` (Europe) or `us-east-1` (US)
4. Note cluster ID: `{cluster-id}.s1.eu.hivemq.cloud`

### 2. Configure Authentication

1. Go to "Access Management"
2. Create credentials:
   - Username: `homesync-backend`
   - Password: [generate strong password]
3. (Optional) Create separate credentials for development

### 3. Test Connection

```bash
# Using mosquitto CLI
mosquitto_sub \
  -h {cluster-id}.s1.eu.hivemq.cloud \
  -p 8883 \
  -u homesync-backend \
  -P {password} \
  -t "test/topic" \
  --capath /etc/ssl/certs
```

### 4. Configure Backend

```javascript
// Node.js example using mqtt package
const mqtt = require('mqtt');

const client = mqtt.connect('mqtts://{cluster-id}.s1.eu.hivemq.cloud:8883', {
  username: 'homesync-backend',
  password: process.env.HIVEMQ_PASSWORD,
  clientId: `homesync-backend-${Date.now()}`,
  clean: false,
  reconnectPeriod: 5000,
});

client.on('connect', () => {
  console.log('Connected to HiveMQ Cloud');
  client.subscribe('homesync/+/nodes/+/telemetry/+');
});
```

### 5. Monitoring

- Use HiveMQ Cloud Console to monitor:
  - Active connections
  - Message throughput
  - Data usage (10 GB limit)
- Set up alerts for 80% data usage

---

## Migration from Self-Hosted MQTT

### Differences from Mosquitto/EMQX

| Aspect | Self-Hosted | HiveMQ Cloud |
|--------|-------------|--------------|
| **Setup** | Manual installation | Managed service |
| **Maintenance** | Required | None |
| **Scaling** | Manual | Automatic |
| **TLS** | Self-configured | Built-in |
| **Clustering** | Complex | Built-in |
| **Cost** | Infrastructure cost | Free tier + usage |
| **Limits** | Hardware limited | Plan limits |

### Topic Migration

**Old (Mosquitto):**
```
shellies/shellyplug-001/relay/0/power
```

**New (HiveMQ):**
```
homesync/abc123/nodes/node-001/telemetry/power
```

### Configuration Changes

1. Update broker hostname in all configs
2. Update authentication (username/password)
3. Update topic structures
4. Update TLS certificate paths (if needed)
5. Test connectivity before production cutover
