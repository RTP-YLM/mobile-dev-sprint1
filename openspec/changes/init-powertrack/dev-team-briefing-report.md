# 📋 รายงานสรุป Session บรีฟทีม Dev - NodeMCU + HiveMQ Architecture

**Date:** 2026-02-07  
**PM:** กุ้ง  
**ทีมที่เข้าร่วม:** บีม (Mobile), ต้น (Backend), ฟลุ๊ค (DevOps), มิ้นท์ (QA)

---

## 1️⃣ ทีมเข้าใจ Architecture ใหม่ตรงกันหรือไม่?

### ✅ สรุป Architecture ใหม่ที่เข้าใจตรงกัน

```
┌────────────┐      REST/WebSocket      ┌─────────────┐      MQTT over TLS     ┌─────────────┐
│   Mobile   │◄───────────────────────►│   Backend   │◄──────────────────────►│   HiveMQ    │
│  (Flutter) │    (Required - No Direct) │   (Node.js) │                        │    Cloud    │
└────────────┘                           └─────────────┘                        └──────┬──────┘
                                                                                       │
                                                                                       │ MQTT
                                                                                       ▼
                                                                               ┌─────────────┐
                                                                               │   NodeMCU   │
                                                                               │ ESP8266/32  │
                                                                               │ + PZEM-004T │
                                                                               │ + Relay     │
                                                                               └─────────────┘
```

### 👥 ความเข้าใจของแต่ละคน

| คน | บทบาท | เข้าใจหลักการ | ข้อสังเกต |
|---|---|---|---|
| **ต้น** (Backend) | ตัวกลางทั้งหมด | ✅ **เข้าใจดี** | ต้องทำ MQTT Bridge, OTA Server, API Gateway |
| **บีม** (Mobile) | REST + WebSocket | ✅ **เข้าใจดี** | ไม่ต้องทำ MQTT Client แล้ว แต่ต้องทำ OTA UI + Calibration |
| **ฟลุ๊ค** (DevOps) | HiveMQ Cloud + Hosting | ✅ **เข้าใจดี** | ไม่ต้อง host MQTT เอง แต่ต้อง host Backend + OTA files |
| **มิ้นท์** (QA) | Test Plan | ✅ **เข้าใจดี** | ต้องเตรียม NodeMCU test devices |

### ✅ Key Points ที่เข้าใจตรงกัน

1. **Mobile ไม่ได้ต่อ HiveMQ ตรงอีกต่อไป** - ผ่าน Backend API เท่านั้น
2. **Backend เป็นตัวกลาง Security + Business Logic** - ไม่มี direct device access
3. **Topic Structure:** `homesync/{home_id}/nodes/{node_id}/telemetry/{metric}`
4. **HiveMQ Cloud Free Tier:** 100 connections, 10GB/month
5. **Device:** NodeMCU ESP8266/ESP32 + PZEM-004T (หรือ CT Clamp) + Relay Module
6. **OTA:** Backend เป็น OTA Server (เก็บ firmware, ส่งให้ device)

---

## 2️⃣ จุดที่ยังไม่ชัด / ต้องถามเพิ่ม

### ⚠️ Critical Questions (ต้องตัดสินใจก่อนเริ่ม)

| # | คำถาม | ผลกระทบ | ใครตอบ |
|---|---|---|---|
| 1 | **HiveMQ free tier 10GB/month พอไหม?** ถ้าส่ง telemetry ทุก 5 วินาที ต่อ device จะใช้ data เท่าไร? | ต้อง optimize reporting interval หรือ upgrade plan | ต้น + ฟลุ๊ค |
| 2 | **OTA firmware เก็บที่ไหน?** S3/GCS หรือใน backend container? | ผลต่อ infrastructure design | ฟลุ๊ค |
| 3 | **Firmware signing/verification ทำไหม?** หรือ OTA แบบ plain binary? | Security risk ถ้าไม่ sign | ต้น + PM |
| 4 | **Sensor calibration เก็บที่ไหน?** Device flash หรือ Backend DB? | ถ้า device พัง calibration หายไหม? | ต้น |
| 5 | **ESP8266 vs ESP32 รองรับทั้งคู่ไหม?** หรือเลือกอย่างใดอย่างหนึ่งก่อน? | ผลต่อ firmware development | PM |
| 6 | **MQTT QoS level เท่าไร?** QoS 0/1/2 สำหรับ telemetry vs commands? | ผลต่อ reliability vs bandwidth | ต้น |

### ⚠️ Technical Ambiguities

1. **Device Provisioning Flow:**
   - ใช้วิธีไหนเพิ่ม device ใหม่? 
   - 1) User กรอก `node_id` เอง หรือ
   - 2) Scan QR Code บน NodeMCU หรือ
   - 3) Auto-discovery ผ่าน local network?

2. **WiFi Provisioning:**
   - ใช้ ESP SoftAP mode (แบบที่ design ไว้) หรือ
   - ใช้ WPS หรือ
   - ใช้ Bluetooth (ถ้า ESP32)?

3. **Device Authentication:**
   - Device จำ `home_id` ไว้ใน flash หรือ backend ส่งมาทุกครั้ง?
   - HiveMQ credentials ใช้ shared credential หรือ per-device?

---

## 3️⃣ Concerns และ Risks

### 🔴 High Risk

| Risk | Impact | Mitigation |
|---|---|---|
| **HiveMQ Free Tier Limits** | ถ้าเกิน 100 connections หรือ 10GB/month device จะถูกตัด | 1) คำนวณ data usage ก่อน 2) มี upgrade plan ถ้า MVP ดี |
| **OTA Update Failures** | Device bricked ถ้า flash ไม่สำเร็จ | 1) Firmware rollback mechanism 2) A/B partition 3) มี recovery mode |
| **NodeMCU Reliability** | DIY hardware ไม่เสถียรเท่า commercial (Shelly) | 1) Watchdog timer ใน firmware 2) Auto-restart on error 3) Clear troubleshooting guide |

### 🟡 Medium Risk

| Risk | Impact | Mitigation |
|---|---|---|
| **Calibration Complexity** | User ต้องใช้ multimeter อาจทำให้ churn สูง | 1) มี optional calibration (ไม่ทำก็ใช้ default ได้) 2) คาลิเบรท wizard ที่เข้าใจง่าย |
| **WiFi Connectivity Issues** | NodeMCU รีคอนเนคบ่อยกว่า Shelly | 1) WiFi manager ที่ robust 2) Auto-reconnect with exponential backoff |
| **Backend Single Point of Failure** | ถ้า Backend down = Mobile ควบคุม device ไม่ได้ | 1) High availability backend 2) Local network fallback (future) |

### 🟢 Low Risk (แต่ต้องระวัง)

| Risk | Notes |
|---|---|
| **GPIO Pin Conflicts** | ตั้งค่าผิด = เซ็นเซอร์ไม่ทำงาน |
| **Firmware Version Mismatch** | ต้องมี version compatibility check |
| **Time Sync Issues** | Device ต้อง sync NTP เพื่อ schedule/ota |

---

## 4️⃣ Action Items ที่ชัดเจน

### 👨‍💻 ต้น (Backend Developer)

#### Pre-Sprint Setup (ก่อนเริ่ม Sprint 1)
- [ ] **Setup HiveMQ Cloud cluster** (free tier)
  - Create cluster
  - Setup TLS certificates
  - Create test credentials
  
- [ ] **Implement MQTT Bridge**
  - Node.js MQTT client (mqtt package)
  - Subscribe: `homesync/+/nodes/+/telemetry/+`
  - Subscribe: `homesync/+/nodes/+/status`
  - Publish: `homesync/{home_id}/nodes/{node_id}/command/+`
  
- [ ] **Setup Databases**
  - PostgreSQL (device metadata, users, rules)
  - InfluxDB (time-series telemetry)
  - Redis (session cache, pub/sub for WebSocket)
  
- [ ] **OTA Server Architecture**
  - Design firmware storage (S3/GCS/local)
  - Implement firmware download endpoint
  - Version management system
  
- [ ] **API Endpoints (Core)**
  - `GET /api/v1/devices` - List devices
  - `POST /api/v1/devices` - Register device
  - `POST /api/v1/devices/{id}/command` - Send command
  - `WS /api/v1/realtime` - WebSocket for live updates

#### Research Needed
- [ ] Calculate data usage: telemetry every 5s × 100 devices × 30 days = ? GB
- [ ] MQTT QoS best practices for telemetry vs commands
- [ ] InfluxDB retention policy and downsampling

---

### 📱 บีม (Mobile Lead - Flutter)

#### Pre-Sprint Research
- [ ] **WebSocket Client Research**
  - `web_socket_channel` vs custom implementation
  - Auto-reconnect strategy
  - Message queuing when offline
  
- [ ] **OTA Update UI Pattern**
  - Progressive download indicator
  - Background download capability
  - Cancel/resume download
  
- [ ] **Calibration Wizard UX**
  - Step-by-step multimeter guide
  - Real-time value comparison
  - Offset calculation visualization

#### Components to Prepare
- [ ] Device Card with technical info (Node ID, RSSI, Firmware version)
- [ ] Onboarding Flow (5 steps: Welcome → Hardware → Firmware → WiFi → Calibration)
- [ ] OTA Update Screen (Check → Download → Flash → Verify)
- [ ] Calibration Screen (Voltage + Current)
- [ ] Diagnostics Tab (Connection status, logs, restart)
- [ ] Settings Tab (GPIO config, reporting interval, WiFi settings)

#### State Management Updates
- [ ] Refactor BLoC: Remove MQTT client
- [ ] Add WebSocket BLoC
- [ ] Add Command Queue (offline support)

---

### 🚀 ฟลุ๊ค (DevOps)

#### Infrastructure Setup
- [ ] **HiveMQ Cloud**
  - Create production cluster
  - Configure backup cluster (optional)
  - Setup monitoring/alerting
  
- [ ] **Backend Hosting**
  - AWS/GCP account setup
  - ECS/EKS or VM decision
  - Load balancer + SSL termination
  
- [ ] **Storage for OTA**
  - S3 bucket หรือ GCS bucket
  - CDN for firmware distribution
  - Version lifecycle policy
  
- [ ] **Database Hosting**
  - RDS/CloudSQL for PostgreSQL
  - InfluxDB Cloud (free tier) หรือ self-hosted
  - Redis (ElastiCache/Memorystore)
  
- [ ] **CI/CD Pipeline**
  - Backend auto-deploy
  - Firmware build pipeline (GitHub Actions)

#### Monitoring Setup
- [ ] Backend health checks
- [ ] MQTT connection monitoring
- [ ] Device online/offline alerts
- [ ] Data usage monitoring (HiveMQ)

---

### 🧪 มิ้นท์ (QA)

#### Test Environment Preparation
- [ ] **Hardware Procurement**
  - NodeMCU ESP8266 × 5 units
  - NodeMCU ESP32 × 2 units (for testing)
  - PZEM-004T modules × 5
  - CT Clamp sensors × 2
  - Relay modules × 5
  - Power supplies 5V/2A × 5
  - Multimeter สำหรับ calibration testing
  
- [ ] **Test Network Setup**
  - WiFi router สำหรับ test devices
  - Weak signal area (สำหรับ test edge cases)

#### Test Plan Draft
- [ ] **OTA Test Cases**
  - Normal update flow
  - Interrupted download (network fail)
  - Interrupted flash (power fail)
  - Rollback scenario
  - Large firmware file (>512KB)
  
- [ ] **Calibration Test Cases**
  - Calibration wizard flow
  - Offset calculation accuracy
  - Save/load calibration values
  - Calibration after device restart
  
- [ ] **Connectivity Test Cases**
  - WiFi disconnect/reconnect
  - MQTT broker disconnect
  - Backend API unavailable
  - Weak signal (-75dBm+)
  
- [ ] **End-to-End Scenarios**
  - Full onboarding flow
  - Device control (on/off) with latency measurement
  - Automation rule triggering
  - Schedule execution

---

## 5️⃣ Recommendation

### 🚦 Overall Readiness: **YELLOW** (พร้อมเริ่ม แต่ต้องเคลียร์คำถามก่อน)

### ✅ พร้อมเริ่มทันที
- Architecture ตกลงกันแล้ว
- UX/UI design ครบถ้วน
- Backend stack ชัดเจน (Node.js + PostgreSQL + InfluxDB + Redis)
- Mobile stack ชัดเจน (Flutter + WebSocket)

### ⚠️ ต้องเคลียร์ก่อนเริ่ม Sprint 1 (Pre-Sprint Phase)
1. **ตอบคำถาม Critical Questions** ข้างต้นให้ครบ
2. **ต้น** setup HiveMQ + Database ให้เสร็จ
3. **ฟลุ๊ค** confirm infrastructure cost estimate
4. **มิ้นท์** สั่งซื้อ hardware test devices
5. **บีม** finalize WebSocket library choice

### 📅 Suggested Timeline

| Phase | Duration | Activities |
|---|---|---|
| **Pre-Sprint** | 3-5 วัน | Setup infrastructure, answer open questions, research |
| **Sprint 1** | 2 weeks | Core backend API + Basic device connectivity |
| **Sprint 2** | 2 weeks | Onboarding flow + Device control |
| **Sprint 3** | 2 weeks | OTA + Calibration |
| **Sprint 4** | 2 weeks | Automation + Schedule + Polish |

### 💡 Additional Recommendations

1. **Start with ESP8266 first** - ถ้าเสถียรแล้วค่อย add ESP32 support
2. **OTA ทำ rollback ให้เสร็จก่อน release** - ป้องกัน device bricked
3. **Documentation สำคัญมาก** - ต้องมี DIY guide ที่ละเอียดให้ user
4. **Consider Beta Program** - ให้ power users ทดสอบก่อน public release

---

## 📎 References

- [Architecture Design](/openspec/changes/init-powertrack/design.md)
- [UX/UI Design](/design/HomeSync-UXUI-Design.md)
- HiveMQ Cloud: https://www.hivemq.com/mqtt-cloud/

---

**Report Prepared By:** OpenClaw Assistant  
**Date:** 2026-02-07

**สรุป:** ทีมเข้าใจ architecture ใหม่ตรงกันแล้ว มีจุดต้องถามเพิ่ม 6 ข้อ (ไม่ block การเริ่มงาน แต่ต้องตอบใน pre-sprint) มี risks หลัก 3 เรื่องที่ต้อง mitigate แนะนำให้มี pre-sprint phase 3-5 วันเพื่อ setup infrastructure และตอบคำถามที่เหลือ จากนั้นพร้อมเริ่ม Sprint 1
