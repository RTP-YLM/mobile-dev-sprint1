# PowerTrack - Technical Design Document

## System Architecture

### High-Level Architecture Overview (New)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MOBILE CLIENT                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Flutter    │  │  BLoC State  │  │  WebSocket   │  │  Local Cache │    │
│  │     UI       │◄─┤   Management │◄─┤   Client     │◄─┤   (SQLite)   │    │
│  │              │  │   (Devices)  │  │   (to Backend)│  │  (Queue)     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
│         │                 │                 │                               │
│         │  ┌──────────────┴─────────────────┘                               │
│         │  │                                                                 │
│         │  ▼                                                                 │
│         │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│         └──┤  Command     │  │  Schedule    │  │  Scene       │            │
│            │  Queue       │  │  Manager     │  │  Store       │            │
│            └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              │ HTTPS / WebSocket
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND SERVICES                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  API Gateway │  │  MQTT        │  │   Data       │  │   Alert      │    │
│  │  (Node.js)   │  │  Bridge      │  │   Processor  │  │   Service    │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         ▼                 ▼                 ▼                 ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Automation   │  │  Schedule    │  │  Command     │  │  Scene       │    │
│  │ Engine       │  │  Executor    │  │  Processor   │  │  Manager     │    │
│  │ (Rules)      │  │  (Cron)      │  │  (MQTT)      │  │  (Presets)   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
│         │                 │                 │                               │
│         └─────────────────┴─────────────────┘                               │
│                           │                                                  │
│         ▼                 ▼                 ▼                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │ PostgreSQL   │  │  InfluxDB    │  │   Redis      │                       │
│  │ (Metadata)   │  │  (Time-Series)│  │  (Cache/Queue)│                       │
│  │ + Rules      │  │               │  │ + Pub/Sub    │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              │ MQTT over TLS 1.2/1.3
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DEVICE LAYER                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │ NodeMCU        │  │ NodeMCU        │  │ NodeMCU        │                 │
│  │ ESP8266 +      │  │ ESP32 +        │  │ ESP8266 +      │                 │
│  │ PZEM-004T +    │  │ PZEM-004T +    │  │ CT Clamp       │                 │
│  │ Relay          │  │ Multi-Relay    │  │ (Monitor Only) │                 │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘                 │
│          │                   │                   │                            │
└──────────┴───────────────────┴───────────────────┴────────────────────────────┘
           │                   │                   │
           └───────────────────┴───────────────────┘
                               │
                    WiFi Network (2.4GHz) → Internet
```

### Architecture Changes Summary

| Component | Before (Shelly) | After (NodeMCU) |
|-----------|-----------------|-----------------|
| **Device Layer** | Shelly Plug S (commercial) | NodeMCU + PZEM-004T + Relay (DIY) |
| **MQTT Broker** | Self-hosted EMQX/Mosquitto | HiveMQ Cloud (managed) |
| **Mobile → Device** | Direct MQTT (optional) | Via Backend API only (required) |
| **Security Model** | Device credentials shared | Backend-mediated, no direct device access |
| **Backend Role** | Optional/Minimal | Required (MQTT bridge, auth, API) |

---

## Component Responsibilities

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| **Mobile App** | Flutter + Dart | Cross-platform UI, local state management |
| **State Management** | flutter_bloc | Business logic, device state management |
| **WebSocket Client** | web_socket_channel | Real-time updates from backend |
| **Local Cache** | sqflite | Offline data storage, command sync queue |
| **Command Queue** | Dart Isolate | Queue offline commands, retry logic |
| **API Gateway** | Node.js + Express | REST API, authentication, request routing |
| **MQTT Bridge** | Node.js + mqtt | HiveMQ connection, message routing, command relay |
| **Automation Engine** | Node.js + node-cron | Rule evaluation, trigger processing |
| **Schedule Executor** | Node.js + Bull Queue | Cron-based schedule execution |
| **Command Processor** | Node.js + Redis | Command validation, device routing |
| **Data Processor** | Node.js | Aggregation, anomaly detection, cost calculation |
| **Alert Service** | Node.js + node-cron | Notification generation, alert throttling |
| **PostgreSQL** | PostgreSQL 15+ | User data, device metadata, automation rules |
| **InfluxDB** | InfluxDB 2.x | Time-series data, historical analytics |
| **Redis** | Redis 7+ | Session cache, rate limiting, pub/sub |
| **MQTT Broker** | HiveMQ Cloud | Managed MQTT broker, TLS termination |
| **NodeMCU Firmware** | Arduino/PlatformIO | Device firmware, sensor reading, MQTT client |

---

## Data Flow

### 1. Real-time Data Flow (Device → Mobile)

```
┌─────────┐     MQTT      ┌──────────┐     MQTT      ┌──────────┐
│ NodeMCU │ ─────────────►│  HiveMQ  │ ─────────────►│ Backend  │
│ Device  │  telemetry    │  Cloud   │               │ Bridge   │
└─────────┘               └──────────┘               └────┬─────┘
                                                          │
                                                          │ Process
                                                          │ Store
                                                          ▼
┌─────────┐     WS/HTTP   ┌──────────┐            ┌──────────┐
│ Mobile  │ ◄─────────────│  Backend │ ◄─────────│ InfluxDB │
│   App   │   Real-time   │  API/WS  │   Query   │ (History)│
│         │   Broadcast   │          │           │          │
└─────────┘               └──────────┘            └──────────┘
     ▲
     │
     │ BLoC State Update
     │
└─────────┐
│  UI     │
│ Render  │
└─────────┘
```

**Flow Steps:**
1. NodeMCU publishes telemetry to HiveMQ: `homesync/{home_id}/nodes/{node_id}/telemetry/power`
2. HiveMQ Cloud routes message to backend subscriber
3. Backend MQTT Bridge processes message
4. Data is written to InfluxDB for persistence
5. Backend broadcasts update to connected mobile clients via WebSocket
6. Mobile BLoC layer processes update and re-renders UI

### 2. Command Flow (Mobile → Device)

```
┌─────────┐    HTTPS      ┌──────────┐     MQTT       ┌──────────┐
│ Mobile  │ ─────────────►│ Backend  │ ──────────────►│  HiveMQ  │
│   App   │  POST /cmd    │ Command  │  Publish cmd   │  Cloud   │
│         │               │ Processor│                │          │
│         │ ◄─────────────│          │ ◄──────────────│          │
└─────────┘  WS Broadcast └────┬─────┘   Device Resp  └────┬─────┘
                               │                           │
                               ▼                           ▼
                         ┌──────────┐                ┌──────────┐
                         │  Redis   │                │ NodeMCU  │
                         │  Queue   │                │ Device   │
│                        └──────────┘                └──────────┘
```

**Flow Steps:**
1. User taps power toggle in mobile app
2. Mobile sends HTTPS POST to backend API: `/api/v1/devices/{id}/command`
3. Backend authenticates and validates command
4. Backend publishes MQTT command to HiveMQ: `homesync/{home_id}/nodes/{node_id}/command/relay`
5. NodeMCU receives command and executes
6. NodeMCU publishes response to `homesync/{home_id}/nodes/{node_id}/response/command`
7. Backend receives response and broadcasts to all connected clients
8. Mobile UI updates to reflect confirmed state

**Security Note:** Mobile app never connects directly to HiveMQ. All device communication is mediated through the backend API.

### 3. Historical Data Query Flow

```
┌─────────┐    REST API    ┌──────────┐    Flux Query   ┌─────────┐
│ Mobile  │ ──────────────►│  API     │ ───────────────►│InfluxDB │
│   App   │  /api/readings │  Gateway │                 │         │
│         │ ◄──────────────│          │ ◄───────────────│         │
└─────────┘   JSON Response└──────────┘   Query Result  └─────────┘
```

### 4. Automation Rule Execution Flow

```
┌─────────┐    MQTT      ┌──────────┐   Evaluation   ┌──────────┐
│ NodeMCU │ ────────────►│ Backend  │ ──────────────►│ Action   │
│ Device  │  Telemetry   │Automation│  Trigger Match │ Executor │
│ State   │              │ Engine   │                │          │
└─────────┘              └──────────┘                └────┬─────┘
     ▲                                                    │
     │                                                    ▼
     │                                             ┌──────────┐
     │                                             │ Devices  │
     └─────────────────────────────────────────────│ Notification│
                                                   └──────────┘
```

---

## Security Architecture

### Multi-Layer Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                 SECURITY LAYERS                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Transport Security                                │
│  ├── TLS 1.3 for all Mobile ↔ Backend communication         │
│  ├── TLS 1.2+ for Backend ↔ HiveMQ communication            │
│  ├── Certificate pinning in mobile app                      │
│  └── WebSocket Secure (wss://) only                         │
│                                                             │
│  Layer 2: Authentication                                    │
│  ├── JWT with short expiry (15 min)                         │
│  ├── Refresh token rotation                                 │
│  └── Biometric/PIN for sensitive actions                    │
│                                                             │
│  Layer 3: Authorization                                     │
│  ├── Device-level access control (home_id isolation)        │
│  ├── Action-level permissions                               │
│  └── Audit logging for all control actions                  │
│                                                             │
│  Layer 4: MQTT Security (HiveMQ)                            │
│  ├── Backend-only credentials (never in mobile app)         │
│  ├── Per-device topic structure isolation                   │
│  └── ACL rules prevent cross-home access                    │
│                                                             │
│  Layer 5: Device Security                                   │
│  ├── Firmware signing for OTA updates                       │
│  ├── Device certificate authentication (optional)           │
│  └── Secure credential storage in device flash              │
│                                                             │
│  Layer 6: Application Security                              │
│  ├── Rate limiting on control endpoints                     │
│  ├── Confirmation for bulk operations                       │
│  └── Safety limits on automation rules                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Security Principles

1. **Backend as Security Gateway:** Mobile never talks directly to devices or HiveMQ
2. **Credential Isolation:** HiveMQ credentials exist only in backend environment variables
3. **Topic Isolation:** Devices publish to home-specific topics only
4. **TLS Everywhere:** All connections encrypted end-to-end
5. **Signed Firmware:** OTA updates cryptographically signed

---

## State Management Architecture

### Device State Synchronization

```
┌─────────────────────────────────────────────────────────────┐
│                    STATE SYNC FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NodeMCU ──► HiveMQ ──► Backend ──► Redis Pub/Sub          │
│                                │                            │
│            ┌───────────────────┼───────────────────┐       │
│            ▼                   ▼                   ▼       │
│        Mobile App         Mobile App          Web Client   │
│        (User A)           (User B)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**State Update Protocol:**
1. Device publishes state change to HiveMQ
2. Backend receives and archives to InfluxDB
3. Backend publishes to Redis `device:state:{id}` channel
4. All connected clients receive update via WebSocket
5. Local BLoC state is updated, UI re-renders

---

## Technology Choices

### HiveMQ Cloud (MQTT Broker)

**Rationale:**
- **Managed Service:** No broker maintenance required
- **Free Tier:** 100 connections, 10 GB/month sufficient for MVP
- **TLS Built-in:** Automatic certificate management
- **Scalability:** Easy upgrade path as user base grows
- **High Availability:** 99.9% uptime SLA on paid tiers

**Comparison with Self-Hosted:**
| Aspect | HiveMQ Cloud | Self-Hosted EMQX |
|--------|--------------|------------------|
| Setup Time | Minutes | Hours/Days |
| Maintenance | None | Regular |
| TLS Certs | Automatic | Manual renewal |
| Scaling | Automatic | Manual |
| Cost (MVP) | $0 | Server cost |
| Cost (Scale) | $30-150/mo | Server + ops |

### NodeMCU (Device Platform)

**Rationale:**
- **Low Cost:** ~฿100-150 per device
- **WiFi Built-in:** No additional modules needed
- **Arduino Ecosystem:** Mature libraries and community
- **Flexible:** Support various sensors and configurations
- **OTA Capable:** Remote firmware updates

**ESP8266 vs ESP32:**
| Feature | ESP8266 | ESP32 |
|---------|---------|-------|
| Price | ~฿100-150 | ~฿150-300 |
| GPIO | 4-11 pins | 18-30 pins |
| Bluetooth | No | Yes |
| Power | Lower | Higher |
| RAM | 80 KB | 520 KB |
| Use Case | Single relay/node | Multi-circuit/advanced |

### Backend: Node.js + TypeScript

**Rationale:**
- **JavaScript Ecosystem:** Same language for MQTT, API, and WebSocket
- **Async I/O:** Handles many concurrent connections efficiently
- **TypeScript:** Type safety, better IDE support
- **MQTT Libraries:** mqtt package mature and well-maintained

### Time-Series Database: InfluxDB

**Rationale:**
- **Purpose-built:** Optimized for IoT time-series data
- **High Write Throughput:** Handles thousands of writes/second
- **Efficient Storage:** Compression algorithms for time-series
- **Flux Query:** Powerful aggregation and windowing

---

## Database Schema

### PostgreSQL Schema (Metadata)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    home_id VARCHAR(50) UNIQUE NOT NULL, -- For MQTT topic isolation
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Devices table (NodeMCU)
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    home_id VARCHAR(50) NOT NULL, -- Redundant for query efficiency
    node_id VARCHAR(50) NOT NULL, -- Device's self-reported ID
    name VARCHAR(100) NOT NULL,
    model VARCHAR(50) NOT NULL, -- 'NodeMCU-ESP8266', 'NodeMCU-ESP32'
    location VARCHAR(100),
    ip_address INET,
    mac_address MACADDR,
    firmware_version VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    capabilities JSONB DEFAULT '{}', -- Store detected capabilities
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(home_id, node_id)
);

-- Device sensors table
CREATE TABLE device_sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    sensor_type VARCHAR(50) NOT NULL, -- 'PZEM-004T', 'CT-Clamp', etc.
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Other tables remain similar (tariffs, budgets, alerts, etc.)
-- ... (see previous version for complete schema)
```

### InfluxDB Schema (Time-Series)

```flux
// Bucket: powertrack
// Retention: 1 year (with downsampling)

// Raw power readings (retain 90 days raw, then downsample)
measurement: telemetry
  tags:
    - home_id (string)
    - node_id (string)
    - metric (string)  // power, voltage, current, energy, etc.
  fields:
    - value (float)
    - quality (integer)  // 0-100 signal quality
  timestamp: nanosecond

// Device status events
measurement: device_status
  tags:
    - home_id (string)
    - node_id (string)
    - status (string)  // 'online', 'offline'
  fields:
    - firmware_version (string)
    - rssi (integer)  // WiFi signal strength
  timestamp: nanosecond
```

---

## API Design

### Key Endpoints

#### Device Management
```http
GET /api/v1/devices
Response: [{ id, node_id, name, model, location, isOnline, currentPower, capabilities }]

POST /api/v1/devices
Body: { node_id, name, location }
Response: { device, mqttConfig }

POST /api/v1/devices/{id}/command
Body: { command: 'on' | 'off' | 'toggle', relay?: number }
Response: { success, newState }
```

#### Real-time Connection
```http
WS /api/v1/realtime
Headers: Authorization: Bearer {token}

// Client → Server
{ "action": "subscribe", "home_id": "abc123" }

// Server → Client
{ "type": "telemetry", "node_id": "node-001", "metric": "power", "value": 125.5 }
{ "type": "status", "node_id": "node-001", "online": true }
```

---

## Deployment Architecture

### Development Environment

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: powertrack
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev

  influxdb:
    image: influxdb:2.7
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: admin123
      DOCKER_INFLUXDB_INIT_ORG: powertrack
      DOCKER_INFLUXDB_INIT_BUCKET: powertrack

  redis:
    image: redis:7-alpine

  backend:
    build: ./backend
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://dev:dev@postgres:5432/powertrack
      INFLUXDB_URL: http://influxdb:8086
      REDIS_URL: redis://redis:6379
      HIVEMQ_HOST: your-cluster.s1.eu.hivemq.cloud
      HIVEMQ_PORT: 8883
      HIVEMQ_USER: ${HIVEMQ_USER}
      HIVEMQ_PASSWORD: ${HIVEMQ_PASSWORD}
```

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                      AWS/GCP Cloud                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   ALB/NLB   │  │  ECS/EKS    │  │  Managed DB     │ │
│  │  (HTTPS)    │  │  (Backend)  │  │  (RDS/CloudSQL) │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────┘ │
│         │                │                              │
│         └────────────────┘                              │
│                          ┌─────────────────┐            │
│                          │  InfluxDB Cloud │            │
│                          │  (Free tier)    │            │
│                          └─────────────────┘            │
│                                                         │
│  External Services:                                     │
│  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │  HiveMQ Cloud   │  │  Firebase Cloud Messaging   │  │
│  │  (MQTT Broker)  │  │  (Push Notifications)       │  │
│  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Migration from Previous Architecture

### Changes Required

| Component | Migration Action |
|-----------|-----------------|
| **Device Firmware** | Replace Shelly firmware with custom NodeMCU firmware |
| **MQTT Topics** | Update from `shellies/...` to `homesync/{home_id}/nodes/...` |
| **Mobile App** | Replace direct MQTT with WebSocket to backend |
| **Backend** | Add MQTT bridge service for HiveMQ connection |
| **Infrastructure** | Replace self-hosted broker with HiveMQ Cloud |

### Migration Steps

1. **Setup HiveMQ Cloud cluster**
2. **Deploy updated backend** with MQTT bridge
3. **Flash NodeMCU devices** with new firmware
4. **Update mobile app** to use new API
5. **Migrate existing data** (if any from previous system)
6. **Decommission old infrastructure**
