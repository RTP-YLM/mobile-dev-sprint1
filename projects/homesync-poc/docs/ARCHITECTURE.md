```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HOMESYNC POC ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐      WiFi      ┌──────────────────────────────────────────┐
│             │◄──────────────►│           HIVE MQ CLOUD                  │
│   NodeMCU   │                │         (MQTT Broker)                    │
│  ESP8266    │                │                                          │
│             │                │  ┌────────────────────────────────────┐  │
│ ┌─────────┐ │                │  │  Topics:                           │  │
│ │ PZEM    │ │                │  │  • homesync/poc/node1/telemetry/+  │  │
│ │-004T    │ │   MQTT/8883    │  │  • homesync/poc/node1/command/+    │  │
│ └─────────┘ │◄──────────────►│  └────────────────────────────────────┘  │
│ ┌─────────┐ │                │                                          │
│ │ Relay   │ │                │                                          │
│ └─────────┘ │                └──────────────────────┬───────────────────┘
└─────────────┘                                       │
                                                      │ MQTT/8883
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER (Node.js)                        │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ MQTT Client  │  │ REST API     │  │ WebSocket    │  │ InfluxDB    │ │
│  │ (Subscriber) │  │ (Express)    │  │ Server       │  │ Client      │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                  │                  │      │
│         └─────────────────┴──────────────────┴──────────────────┘      │
│                           │                                           │
│                           ▼                                           │
│                    ┌─────────────┐                                    │
│                    │ Data Store  │                                    │
│                    │ (Memory)    │                                    │
│                    └─────────────┘                                    │
│                                                                       │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────────────────────┐
│  REST API    │   │  WebSocket   │   │        INFLUX DB             │
│  GET /api/   │   │  ws://       │   │  ┌────────────────────────┐  │
│  poc/readings│   │  /readings   │   │  │  Bucket: poc_telemetry │  │
│              │   │              │   │  │  • power               │  │
│ POST /api/   │   │ Real-time    │   │  │  • voltage             │  │
│ poc/relay    │   │ updates      │   │  │  • current             │  │
└──────┬───────┘   └──────┬───────┘   │  └────────────────────────┘  │
       │                  │           └──────────────────────────────┘
       │                  │
       ▼                  ▼
┌─────────────────────────────────────────┐
│          MOBILE APP (Flutter)          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Dashboard Screen        │   │
│  │  ┌─────────────────────────┐    │   │
│  │  │   ⚡ Power Card         │    │   │
│  │  │   123.4 W               │    │   │
│  │  │   220.5 V | 0.56 A      │    │   │
│  │  └─────────────────────────┘    │   │
│  │  ┌─────────────────────────┐    │   │
│  │  │   🔌 Relay Control      │    │   │
│  │  │   [     ON | OFF     ]  │    │   │
│  │  └─────────────────────────┘    │   │
│  │  ┌─────────────────────────┐    │   │
│  │  │   📶 Status: Connected  │    │   │
│  │  └─────────────────────────┘    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Update: Polling (5s) + WebSocket      │
│                                         │
└─────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                              DATA FLOW
═══════════════════════════════════════════════════════════════════════════

TELEMETRY (NodeMCU → Mobile):
  PZEM ──► NodeMCU ──MQTT──► HiveMQ ──MQTT──► Backend ──WS──► Mobile
                              (8883)        (parse+store)   (real-time)
                                                          ──API──► Mobile
                                                              (polling)

COMMAND (Mobile → Relay):
  Mobile ──API──► Backend ──MQTT──► HiveMQ ──MQTT──► NodeMCU ──GPIO──► Relay
          (POST)            (publish)  (8883)      (subscribe)    (D5)

STORAGE:
  Backend ──► InfluxDB (time-series data)
              • เก็บ history ย้อนหลัง
              • สำหรับ analytics ในอนาคต


═══════════════════════════════════════════════════════════════════════════
                            TECHNOLOGY STACK
═══════════════════════════════════════════════════════════════════════════

┌─────────────┬─────────────────┬─────────────────────────────────────────┐
│ Component   │ Technology      │ Purpose                                 │
├─────────────┼─────────────────┼─────────────────────────────────────────┤
│ Hardware    │ ESP8266         │ WiFi microcontroller                    │
│ Sensor      │ PZEM-004T v3.0  │ AC power measurement (V, A, W, kWh)     │
│ Relay       │ 5V Module       │ Switch control                          │
│ MQTT Broker │ HiveMQ Cloud    │ Message queue (free tier)               │
│ Backend     │ Node.js         │ API server & MQTT bridge                │
│ Database    │ InfluxDB 2.x    │ Time-series data storage                │
│ Mobile      │ Flutter         │ Cross-platform mobile app               │
│ Protocol    │ MQTT over TLS   │ Secure IoT communication                │
│ API         │ REST + WS       │ HTTP API + WebSocket real-time          │
└─────────────┴─────────────────┴─────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                              SECURITY NOTES
═══════════════════════════════════════════════════════════════════════════

POC (Current):
  ⚠️  No authentication
  ⚠️  MQTT credentials in code
  ⚠️  TLS enabled but certificate not verified (setInsecure)
  ⚠️  No API key/Token
  ✅  MQTT over TLS (port 8883)

Production (Future):
  🔐 Device certificate authentication (x509)
  🔐 JWT tokens for API
  🔐 MQTT ACL (Access Control Lists)
  🔐 API rate limiting
  🔐 Device provisioning flow
```
