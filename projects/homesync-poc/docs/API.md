# API Documentation - HomeSync POC

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "mqtt": true,
  "wsClients": 2,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Get Latest Readings
```
GET /api/poc/readings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "power": 123.45,
    "voltage": 220.5,
    "current": 0.56,
    "relayState": false,
    "lastUpdate": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "data": {
    "power": null,
    "voltage": null,
    "current": null,
    "relayState": false,
    "lastUpdate": null
  }
}
```

---

### 3. Control Relay
```
POST /api/poc/relay
```

**Request Body:**
```json
{
  "state": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Relay ON command sent",
  "state": true
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "State must be a boolean"
}
```

---

## WebSocket

### Connection
```
ws://localhost:3000
```

### Client → Server Messages

#### Ping
```json
{
  "type": "ping"
}
```

### Server → Client Messages

#### Connected
```json
{
  "type": "connected",
  "message": "Connected to HomeSync POC WebSocket",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Telemetry Update
```json
{
  "type": "telemetry",
  "data": {
    "type": "power",
    "value": 123.45
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Relay State Update
```json
{
  "type": "relay_state",
  "state": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## MQTT Topics

### NodeMCU → Backend (Telemetry)

| Topic | Payload | Frequency |
|-------|---------|-----------|
| `homesync/poc/node1/telemetry/power` | `{"value": 123.45}` | 5s |
| `homesync/poc/node1/telemetry/voltage` | `{"value": 220.5}` | 5s |
| `homesync/poc/node1/telemetry/current` | `{"value": 0.56}` | 5s |

### Backend → NodeMCU (Commands)

| Topic | Payload | Description |
|-------|---------|-------------|
| `homesync/poc/node1/command/relay` | `{"state": true}` | Turn relay ON |
| `homesync/poc/node1/command/relay` | `{"state": false}` | Turn relay OFF |

---

## Error Codes

| HTTP | Error | Description |
|------|-------|-------------|
| 200 | OK | Success |
| 400 | Bad Request | Invalid parameters |
| 500 | Internal Server | Server error |

---

## Testing with curl

```bash
# Health check
curl http://localhost:3000/health

# Get readings
curl http://localhost:3000/api/poc/readings

# Turn relay ON
curl -X POST http://localhost:3000/api/poc/relay \
  -H "Content-Type: application/json" \
  -d '{"state": true}'

# Turn relay OFF
curl -X POST http://localhost:3000/api/poc/relay \
  -H "Content-Type: application/json" \
  -d '{"state": false}'
```

---

## Testing WebSocket with wscat

```bash
# Install wscat
npm install -g wscat

# Connect
wscat -c ws://localhost:3000

# Send ping
> {"type": "ping"}

# Receive telemetry
< {"type": "telemetry", "data": {"type": "power", "value": 123.45}, ...}
```
