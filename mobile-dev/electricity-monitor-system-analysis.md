# ระบบแอพมอนิเตอร์ระบบไฟฟ้าผ่าน MQTT
## System Analysis & Architecture Design

**จัดทำโดย:** เจน (System Analyst) - Mobile Development Team  
**วันที่:** 6 กุมภาพันธ์ 2026  
**ลูกค้า:** ระบบมอนิเตอร์การใช้ไฟฟ้า (Electricity Monitoring System)

---

## 📋 Executive Summary

ระบบนี้เป็น **IoT-based Energy Monitoring Mobile Application** ที่ใช้ MQTT Protocol เป็นหลักในการรับส่งข้อมูลแบบ real-time จากอุปกรณ์ smart meter/IoT sensors ไปยังแอพมือถือ โดยมีเป้าหมายหลักคือให้ผู้ใช้สามารถดูการใช้ไฟฟ้าแบบ real-time, ประวัติการใช้งาน, และรายงานสรุปผ่าน UI ที่สวยงามและใช้งานง่าย

---

## 1️⃣ System Architecture Overview

### High-Level Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Mobile App)                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Cross-Platform Mobile App                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │  Dashboard   │  │ Device List  │  │   Charts     │  │  Settings    │ │   │
│  │  │    View      │  │    View      │  │   & Stats    │  │   & Config   │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │   │
│  │  │              MQTT Client (Paho/eclipse-mosquitto)                   │  │   │
│  │  │              - Publish: Commands to devices                         │  │   │
│  │  │              - Subscribe: Real-time sensor data                     │  │   │
│  │  └────────────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼ (WebSocket/MQTT over TLS)
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         GATEWAY/API LAYER (Backend)                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        API Gateway (Kong/Nginx)                          │   │
│  │                    - Authentication & Rate Limiting                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Backend API Services (REST/GraphQL)                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │   │
│  │  │   Auth     │  │  Device    │  │  Energy    │  │    User/Profile    │ │   │
│  │  │  Service   │  │  Service   │  │  Service   │  │     Service        │ │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────┐
│    MQTT BROKER LAYER     │  │     DATABASE LAYER       │  │   MESSAGE QUEUE      │
│  ┌────────────────────┐  │  │  ┌──────────────────┐    │  │  ┌────────────────┐  │
│  │  Mosquitto/EMQX    │  │  │  │  PostgreSQL      │    │  │  │    Redis       │  │
│  │  (Primary Broker)  │  │  │  │  - Users         │    │  │  │  - Session     │  │
│  │                    │  │  │  │  - Devices       │    │  │  │  - Cache       │  │
│  │  Topics:           │  │  │  │  - Configurations│    │  │  │  - Pub/Sub     │  │
│  │  - sensor/data/#   │  │  │  └──────────────────┘    │  │  └────────────────┘  │
│  │  - device/status/# │  │  │  ┌──────────────────┐    │  └──────────────────────┘
│  │  - device/cmd/#    │  │  │  │  InfluxDB/TDengine│   │
│  │  - alerts/#        │  │  │  │  - Time-series    │   │
│  └────────────────────┘  │  │  │    power data     │   │
└──────────────────────────┘  │  └──────────────────┘    │
                              └──────────────────────────┘
                                          │
                    ┌─────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        IoT DEVICE LAYER (Edge/Field)                            │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────────────┐ │
│  │   Smart Meter      │  │   Energy Monitor   │  │       IoT Sensors          │ │
│  │  (Main Panel)      │  │  (Circuit Level)   │  │  (Temperature, Humidity)   │ │
│  │                    │  │                    │  │                            │ │
│  │  - WiFi/Ethernet   │  │  - CT Clamp        │  │  - ESP32/Arduino           │ │
│  │  - MQTT Publisher  │  │  - MQTT Publisher  │  │  - MQTT Publisher          │ │
│  └────────────────────┘  └────────────────────┘  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Patterns Used

| Pattern | Description | Why |
|---------|-------------|-----|
| **Pub/Sub (MQTT)** | Decoupled messaging between devices and app | Real-time, lightweight, battery-efficient |
| **Microservices** | Backend split into domain-specific services | Scalable, maintainable |
| **Time-Series DB** | Optimized for sensor data storage | Efficient querying of historical data |
| **CQRS** | Separate read/write models for energy data | Fast dashboards, scalable |
| **Edge Computing** | Basic processing at device level | Reduce bandwidth, faster response |

---

## 2️⃣ Component Breakdown

### 2.1 Backend Layer

#### Core Services

| Service | Technology Options | Responsibilities |
|---------|-------------------|------------------|
| **API Gateway** | Kong, Nginx, AWS API Gateway | Rate limiting, auth, routing |
| **Auth Service** | Node.js/Express, Python/FastAPI, Go | JWT/OAuth2, user management |
| **Device Service** | Node.js, Python | Device registration, pairing, config |
| **Energy Service** | Go, Python | Data aggregation, analytics, billing calc |
| **Notification Service** | Node.js, Python | Push notifications, alerts |
| **MQTT Bridge** | Node.js/MQTT.js, Python/paho-mqtt | Bridge MQTT ↔ HTTP/WebSocket |

#### Backend Infrastructure

```
Backend Stack Recommendation:
├── Language: Node.js (TypeScript) หรือ Python (FastAPI)
├── Framework: Express.js / FastAPI
├── ORM: Prisma / SQLAlchemy
├── Authentication: JWT + Refresh Tokens
├── API Style: REST + WebSocket for real-time
├── Container: Docker + Docker Compose
└── Cloud: AWS/GCP/Azure (optional, can start on-prem)
```

### 2.2 Frontend (Mobile App)

#### Technology Options

| Approach | Framework | Pros | Cons |
|----------|-----------|------|------|
| **Cross-Platform** | Flutter | Fast, beautiful UI, single codebase | Learning curve |
| **Cross-Platform** | React Native | Large community, JS ecosystem | Performance issues |
| **Native** | Swift + Kotlin | Best performance, platform features | Double development cost |

**Recommendation: Flutter** (เหมาะกับ requirement "UI สวยงาม" ที่สุด)

#### Mobile App Architecture

```
Mobile App (Flutter) Structure:
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── config/              # App configurations
│   ├── core/                # Core utilities, themes
│   ├── data/
│   │   ├── models/          # Data models
│   │   ├── repositories/    # Data access layer
│   │   └── datasources/     # API & MQTT clients
│   ├── domain/
│   │   ├── entities/        # Business entities
│   │   ├── usecases/        # Business logic
│   │   └── repositories/    # Abstract repos
│   └── presentation/
│       ├── bloc/            # State management (BLoC)
│       ├── pages/           # Screens
│       └── widgets/         # Reusable widgets
├── mqtt_client/             # Custom MQTT wrapper
└── assets/                  # Images, fonts, lottie
```

#### Key Mobile Dependencies

```yaml
# pubspec.yaml ตัวอย่าง
dependencies:
  flutter:
    sdk: flutter
  
  # MQTT Client
  mqtt_client: ^10.0.0        # หลักสำคัญ!
  mqtt5_client: ^4.0.0        # ถ้าต้องการ MQTT 5
  
  # State Management
  flutter_bloc: ^8.1.0        # BLoC pattern
  provider: ^6.1.0            # Alternative
  
  # UI & Charts
  fl_chart: ^0.66.0           # กราฟสวยงาม
  syncfusion_flutter_charts: ^24.1.41  # Professional charts
  lottie: ^3.0.0              # Animations
  shimmer: ^3.0.0             # Loading effects
  
  # Storage & Network
  hive: ^2.2.3                # Local DB
  dio: ^5.4.0                 # HTTP client
  retrofit: ^4.0.3            # Type-safe API
  
  # Utilities
  intl: ^0.19.0               # Date/number formatting
  flutter_local_notifications: ^16.0.0  # Push notifications
```

### 2.3 MQTT Broker

#### Broker Options

| Broker | License | Features | Best For |
|--------|---------|----------|----------|
| **Eclipse Mosquitto** | EPL/EDL | Lightweight, stable | Small-medium deployments |
| **EMQX** | Apache 2.0 | Enterprise features, clustering | Large scale, high availability |
| **HiveMQ** | Commercial | Professional support | Enterprise |
| **VerneMQ** | Apache 2.0 | Distributed, scalable | High throughput |

**Recommendation:** เริ่มที่ Mosquitto → ย้ายไป EMQX เมื่อ scale

#### MQTT Topic Structure Design

```
Topic Hierarchy ที่แนะนำ:

# ระดับบ้าน/อาคาร
home/{home_id}/
├── sensor/
│   ├── power/
│   │   ├── total              # พลังงานรวมทั้งบ้าน
│   │   ├── circuit/{circuit_id}  # แยกตามวงจร
│   │   └── device/{device_id}    # แยกตามอุปกรณ์
│   ├── voltage/
│   │   ├── l1, l2, l3         # แรงดันแต่ละเฟส
│   │   └── total
│   ├── current/
│   ├── frequency/
│   ├── power_factor/
│   └── energy/
│       └── kwh/{interval}     # daily, monthly, yearly
├── device/
│   ├── {device_id}/
│   │   ├── status             # online/offline
│   │   ├── telemetry          # ข้อมูลทั่วไป
│   │   └── alerts             # การแจ้งเตือน
│   └── status/all             # สถานะทั้งหมด
├── cmd/                       # คำสั่งควบคุม
│   └── {device_id}/
│       ├── reboot
│       ├── config
│       └── calibrate
└── system/
    ├── alerts                 # แจ้งเตือนระบบ
    └── logs                   # บันทึกเหตุการณ์
```

#### QoS (Quality of Service) Strategy

| Data Type | QoS | Retain | ความถี่ | เหตุผล |
|-----------|-----|--------|---------|--------|
| Real-time power | 0 | No | 1-5 sec | ต้องการความเร็ว ยอมเสียบาง packet |
| Energy counter | 1 | Yes | 1-5 min | สำคัญ ต้องได้รับแน่นอน |
| Device status | 1 | Yes | On change | ต้องรู้สถานะล่าสุด |
| Alerts | 2 | Yes | Event-driven | สำคัญมาก ต้องส่งให้ได้ |
| Commands | 1 | No | On demand | ต้อง confirm การทำงาน |

---

## 3️⃣ Data Flow: จากอุปกรณ์ → แอพ

### 3.1 Real-time Data Flow Sequence

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  IoT     │     │  MQTT    │     │  Backend │     │ WebSocket│     │  Mobile  │
│ Device   │────▶│ Broker   │────▶│  Bridge  │────▶│ Gateway  │────▶│   App    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │                │
     │ 1. Publish     │                │                │                │
     │───────────────▶│                │                │                │
     │                │                │                │                │
     │   topic:       │                │                │                │
     │   home/123/    │                │                │                │
     │   sensor/      │                │                │                │
     │   power/total  │                │                │                │
     │                │                │                │                │
     │   payload:     │                │                │                │
     │   {            │                │                │                │
     │     "w": 1250, │                │                │                │
     │     "v": 220.5,│                │                │                │
     │     "a": 5.67, │                │                │                │
     │     "pf": 0.95,│                │                │                │
     │     "ts":      │                │                │                │
     │     1707234567 │                │                │                │
     │   }            │                │                │                │
     │                │ 2. Forward     │                │                │
     │                │───────────────▶│                │                │
     │                │                │                │                │
     │                │                │ 3. Process     │                │
     │                │                │   - Validate   │                │
     │                │                │   - Transform  │                │
     │                │                │   - Store to   │                │
     │                │                │     TSDB       │                │
     │                │                │                │                │
     │                │                │ 4. Broadcast   │                │
     │                │                │───────────────▶│                │
     │                │                │                │ 5. Push to     │
     │                │                │                │    subscribed  │
     │                │                │                │    clients     │
     │                │                │                │───────────────▶│
     │                │                │                │                │
     │                │                │                │   payload:     │
     │                │                │                │   {            │
     │                │                │                │     "type":    │
     │                │                │                │     "power",   │
     │                │                │                │     "data": {  │
     │                │                │                │       "w":1250 │
     │                │                │                │     },         │
     │                │                │                │     "timestamp│
     │                │                │                │     ":"..."    │
     │                │                │                │   }            │
```

### 3.2 Data Processing Pipeline

```
Raw Data → Validation → Enrichment → Aggregation → Storage → API/Realtime
   │           │            │            │            │           │
   │           │            │            │            │           │
   ▼           ▼            ▼            ▼            ▼           ▼
Sensor     Check:       Add:        Calculate:    InfluxDB   Dashboard
Data       - Range      - Device     - Avg/Min/    (Time-     - Real-time
           - Type       metadata       Max         series)    - History
           - Format     - Location   - Cost        PostgreSQL - Reports
                        - Timezone   - Trends      (Meta)     - Alerts
```

### 3.3 Message Payload Specifications

#### Device → Broker (Sensor Data)

```json
{
  "schema_version": "1.0",
  "device_id": "meter_main_001",
  "home_id": "home_abc123",
  "timestamp": "2026-02-06T14:30:00Z",
  "data": {
    "power": {
      "active": 1250.5,      // Watts
      "reactive": 150.2,     // VAR
      "apparent": 1260.8     // VA
    },
    "voltage": {
      "l1": 220.5,
      "l2": 221.0,
      "l3": 219.8,
      "avg": 220.4
    },
    "current": {
      "l1": 5.67,
      "l2": 5.70,
      "l3": 5.65
    },
    "power_factor": 0.95,
    "frequency": 50.02,
    "energy": {
      "total_kwh": 15234.56,
      "today_kwh": 12.34,
      "this_month_kwh": 345.67
    },
    "thd": {
      "voltage": 2.5,
      "current": 3.2
    }
  },
  "status": {
    "relay": "closed",
    "wifi_rssi": -65,
    "uptime_seconds": 86400
  }
}
```

#### Backend → Mobile (Unified Format)

```json
{
  "event_type": "power_update",
  "home_id": "home_abc123",
  "device_id": "meter_main_001",
  "circuit_id": "circuit_main",
  "timestamp": "2026-02-06T14:30:00Z",
  "data": {
    "current_power_w": 1250.5,
    "voltage_v": 220.5,
    "current_a": 5.67,
    "power_factor": 0.95,
    "today_kwh": 12.34,
    "cost_today_thb": 61.70
  },
  "metadata": {
    "source": "mqtt",
    "processed_at": "2026-02-06T14:30:01Z",
    "latency_ms": 150
  }
}
```

---

## 4️⃣ Feature Analysis

### 4.1 ฟีเจอร์หลัก (Core Features) - MVP

#### F1: Real-time Dashboard
| Aspect | Details |
|--------|---------|
| **Description** | หน้าหลักแสดงการใช้ไฟฟ้าแบบ real-time |
| **UI Elements** | - Current power gauge (Animated)
| | - Today's usage card
| | - This month usage card
| | - Cost estimate card
| | - Mini sparkline chart |
| **Technical** | WebSocket + MQTT subscription |
| **Update freq** | 1-5 seconds |

#### F2: Device-level Monitoring
| Aspect | Details |
|--------|---------|
| **Description** | ดูการใช้ไฟฟ้ารายอุปกรณ์/รายวงจร |
| **UI Elements** | - Device list with status
| | - Device detail view
| | - Per-device power chart
| | - Device comparison |
| **Technical** | MQTT topic subscription per device |
| **Data source** | Circuit-level meters |

#### F3: Historical Data & Analytics
| Aspect | Details |
|--------|---------|
| **Description** | ดูย้อนหลัง รายวัน/รายเดือน/รายปี |
| **UI Elements** | - Date range picker
| | - Line/Bar charts
| | - Data export (CSV/PDF)
| | - Peak usage analysis |
| **Technical** | Time-series DB queries |
| **Time ranges** | Hourly, Daily, Weekly, Monthly, Yearly |

#### F4: Cost Tracking & Billing
| Aspect | Details |
|--------|---------|
| **Description** | คำนวณค่าไฟฟ้าและแสดงรายงาน |
| **UI Elements** | - Current billing cycle
| | - Tariff configuration
| | - Estimated bill
| | - Historical bills |
| **Technical** | Configurable tariff rules |
| **Thai tariff** | Ft rate + VAT support |

#### F5: Alerts & Notifications
| Aspect | Details |
|--------|---------|
| **Description** | แจ้งเตือนเมื่อเกิดเหตุการณ์สำคัญ |
| **UI Elements** | - Alert history
| | - Threshold settings
| | - Push notification settings |
| **Alert types** | - High power usage
| | - Device offline
| | - Unusual consumption
| | - Peak hour warning |

### 4.2 ฟีเจอร์เสริมที่น่าสนใจ (Nice-to-Have)

#### NF1: AI/ML Analytics ⭐ HIGH VALUE
| Feature | Description | Value |
|---------|-------------|-------|
| **Anomaly Detection** | ตรวจจับการใช้ไฟฟ้าผิดปกติ | ช่วยประหยัด, ป้องกันไฟรั่ว |
| **Usage Prediction** | ทำนายการใช้ไฟฟ้าล่วงหน้า | วางแผนการใช้งาน |
| **Appliance Recognition** | จำแนกอุปกรณ์จาก signature | Non-intrusive monitoring |
| **Recommendation Engine** | แนะนำวิธีประหยัดไฟ | User engagement |

#### NF2: Smart Home Integration
| Integration | Capability |
|-------------|------------|
| **Google Home** | Voice query: "How much power am I using?" |
| **Amazon Alexa** | "Alexa, ask my energy monitor..." |
| **Home Assistant** | Native integration for power users |
| **IFTTT** | Create automations based on energy usage |

#### NF3: Social & Gamification
| Feature | Description |
|---------|-------------|
| **Family Comparison** | เปรียบเทียบกับบ้านอื่น (anonymized) |
| **Energy Goals** | ตั้งเป้าประหยัดพลังงาน |
| **Achievements** | Badge/รางวัลเมื่อบรรลุเป้าหมาย |
| **Carbon Footprint** | แสดงผลกระทบต่อสิ่งแวดล้อม |

#### NF4: Advanced Features
| Feature | Technical Need | User Value |
|---------|----------------|------------|
| **Solar Integration** | Inverter data via MQTT | มอนิเตอร์ผลิตไฟเอง |
| **EV Charging** | Smart charger control | ชาร์จในช่วงค่าไฟถูก |
| **Load Control** | Remote relay switching | ปิดอุปกรณ์ remotely |
| **Multi-location** | Support multiple homes | สำหรับมีหลายที่ |
| **Shared Access** | Family member accounts | แชร์ข้อมูลในครอบครัว |

---

## 5️⃣ Technical Constraints & Risk Analysis

### 5.1 Technical Constraints

#### C1: MQTT-specific Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| **Message size limit** | 256MB (MQTT 5) / 256KB (practical) | Compress data, chunk if needed |
| **Connection limit** | Broker-dependent | Choose broker wisely, cluster if needed |
| **Keep-alive timeout** | Connection drops if idle | Set appropriate keep-alive (30-60s) |
| **Last Will & Testament** | Critical for offline detection | Always configure LWT |
| **TLS overhead** | Battery drain on mobile | Use session resumption, proper cert mgmt |

#### C2: Mobile-specific Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| **Background execution** | iOS/Android limit background MQTT | Use push notifications, background fetch |
| **Battery consumption** | MQTT keeps connection alive | Optimize QoS, use efficient protocols |
| **Network switching** | WiFi ↔ Mobile data transition | Implement auto-reconnect with backoff |
| **Memory limits** | Charts with large datasets | Pagination, data sampling |

#### C3: IoT Device Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| **Limited compute** | Can't do complex crypto | Use TLS 1.3, hardware acceleration |
| **Unreliable network** | Packet loss common | Use QoS 1, store-and-forward |
| **Power constraints** | Battery-powered sensors | Sleep mode, batch transmission |
| **OTA updates** | Security patches | Implement secure OTA mechanism |

### 5.2 Risk Analysis

#### HIGH Risk 🔴

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **MQTT Broker Downtime** | Medium | HIGH | Cluster setup, failover broker |
| **Data Loss** | Low | HIGH | Local buffer on device, DB replication |
| **Security Breach** | Low | HIGH | TLS everywhere, certificate pinning, audit |
| **Scalability Issues** | Medium | HIGH | Design for horizontal scaling from day 1 |

#### MEDIUM Risk 🟡

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Mobile App Battery Drain** | High | Medium | Optimize MQTT keep-alive, batch updates |
| **Time sync issues** | Medium | Medium | NTP on all devices, server-side timestamp |
| **Tariff calculation errors** | Medium | Medium | Thorough testing, user verification |
| **Device compatibility** | Medium | Medium | Standardized firmware, OTA updates |

#### LOW Risk 🟢

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **UI/UX not satisfying** | Medium | Low | User testing, iterative design |
| **Third-party service deprecation** | Low | Low | Abstraction layers, vendor flexibility |

### 5.3 Security Considerations

```
Security Layers:
┌─────────────────────────────────────────┐
│  Layer 1: Transport Security            │
│  - TLS 1.3 for MQTT (port 8883)         │
│  - Certificate pinning in mobile app    │
│  - WebSocket Secure (WSS)               │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Layer 2: Authentication                │
│  - X.509 certificates for devices       │
│  - Username/password + JWT for users    │
│  - Token-based API auth                 │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Layer 3: Authorization                 │
│  - Topic-level ACL on broker            │
│  - Role-based access (RBAC)             │
│  - Device ownership verification        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Layer 4: Data Security                 │
│  - Encryption at rest                   │
│  - PII handling compliance              │
│  - Audit logging                        │
└─────────────────────────────────────────┘
```

### 5.4 Scalability Considerations

#### Phase 1: POC (1-10 users)
- Single Mosquitto broker
- Single API server
- SQLite/PostgreSQL
- Docker Compose

#### Phase 2: Growth (100-1,000 users)
- EMQX cluster (2 nodes)
- Load-balanced API servers
- Dedicated InfluxDB
- Redis for caching

#### Phase 3: Scale (10,000+ users)
- EMQX cluster (5+ nodes)
- Kubernetes orchestration
- Sharded time-series DB
- CDN for static assets
- Multi-region deployment

---

## 6️⃣ Implementation Roadmap

### Phase 1: MVP (2-3 months)
- [ ] MQTT broker setup (Mosquitto)
- [ ] Basic backend API (Node.js/Python)
- [ ] Simple mobile app (Flutter)
- [ ] Real-time dashboard
- [ ] Device pairing flow
- [ ] Basic historical data

### Phase 2: Core Features (2 months)
- [ ] Multi-device support
- [ ] Cost calculation
- [ ] Alerts system
- [ ] Data export
- [ ] User management

### Phase 3: Enhancement (2 months)
- [ ] Advanced analytics
- [ ] AI/ML features
- [ ] Smart home integration
- [ ] Performance optimization
- [ ] Security hardening

---

## 7️⃣ Technology Stack Summary

| Layer | Primary Choice | Alternatives |
|-------|---------------|--------------|
| **Mobile App** | Flutter | React Native, Swift/Kotlin |
| **Backend** | Node.js + TypeScript | Python/FastAPI, Go |
| **MQTT Broker** | Mosquitto → EMQX | HiveMQ, VerneMQ |
| **Time-Series DB** | InfluxDB 2.x | TDengine, TimescaleDB |
| **Relational DB** | PostgreSQL | MySQL, CockroachDB |
| **Cache** | Redis | Memcached |
| **Queue** | Redis Pub/Sub | RabbitMQ, Kafka |
| **Hosting** | AWS/GCP | On-premise, Azure |
| **Container** | Docker + Compose | Kubernetes (later) |

---

## 8️⃣ Estimation Summary

| Component | Effort (Person-Days) | Complexity |
|-----------|---------------------|------------|
| Backend API | 20-25 days | Medium |
| MQTT Integration | 10-15 days | Medium-High |
| Mobile App (MVP) | 25-30 days | Medium |
| UI/UX Design | 10-12 days | Medium |
| Testing & QA | 15-20 days | Medium |
| DevOps/Infrastructure | 10-15 days | Medium |
| **Total MVP** | **90-117 days** | - |

---

**จัดทำโดย:** เจน (System Analyst)  
**ทีม:** Mobile Development  
**วันที่:** 6 กุมภาพันธ์ 2026

---

*เอกสารนี้เป็นการวิเคราะห์เบื้องต้นสำหรับการออกแบบระบบ ควรมีการทบทวนและปรับปรุงตาม feedback จากทีมพัฒนาและลูกค้า*
