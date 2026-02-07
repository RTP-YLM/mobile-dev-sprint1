# 🏠 HomeSync POC

Proof of Concept สำหรับระบบ Smart Home Platform

## 📋 Overview

**Architecture:** NodeMCU → HiveMQ → Backend → Mobile

**Scope:**
- 1x NodeMCU ESP8266
- 1x PZEM-004T (Power Sensor)
- 1x Relay Module
- Real-time Dashboard
- Remote ON/OFF Control

**Timeline:** 1-2 สัปดาห์

---

## 📁 โครงสร้างโปรเจค

```
homesync-poc/
├── backend/          # Node.js Backend (ต้น)
├── mobile/           # Flutter App (บีม)
├── firmware/         # Arduino/PlatformIO (ต้น+มิ้นท์)
├── infrastructure/   # Docker, Config (ฟลุ๊ค)
├── docs/            # Documentation
└── README.md
```

---

## 🚀 Quick Start

### 1. Infrastructure Setup (ฟลุ๊ค)
```bash
cd infrastructure
docker-compose up -d  # Start InfluxDB
```

### 2. Backend (ต้น)
```bash
cd backend
npm install
npm run dev
```

### 3. Mobile (บีม)
```bash
cd mobile
flutter pub get
flutter run
```

### 4. Firmware (ต้น+มิ้นท์)
- เปิด `firmware/homesync_poc/homesync_poc.ino` ใน Arduino IDE
- แก้ไข WiFi credentials และ HiveMQ config
- Upload ไปยัง NodeMCU

---

## 📡 MQTT Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| `homesync/poc/node1/telemetry/power` | NodeMCU → Backend | ส่งค่า Power (W) |
| `homesync/poc/node1/telemetry/voltage` | NodeMCU → Backend | ส่งค่า Voltage (V) |
| `homesync/poc/node1/telemetry/current` | NodeMCU → Backend | ส่งค่า Current (A) |
| `homesync/poc/node1/command/relay` | Backend → NodeMCU | สั่ง ON/OFF relay |

---

## 🔌 Hardware Wiring

```
NodeMCU 5V    → PZEM VCC
NodeMCU GND   → PZEM GND
NodeMCU D1    → PZEM TX
NodeMCU D2    → PZEM RX
NodeMCU D5    → Relay IN
```

---

## 👥 Team Responsibilities

| สมาชิก | หน้าที่ | Deliverables |
|--------|---------|--------------|
| **ต้น** | Backend + Firmware | MQTT Bridge, REST API, NodeMCU Code |
| **บีม** | Mobile App | Flutter Dashboard |
| **ฟลุ๊ค** | Infrastructure | HiveMQ, InfluxDB, Deployment |
| **มิ้นท์** | QA/Testing | Test Cases, Hardware Assembly |

---

## ✅ Success Criteria

1. ✅ Mobile แสดงค่าไฟถูกต้อง (±10%)
2. ✅ กด ON/OFF ที่ Mobile relay ตอบสนองภายใน 3 วินาที
3. ✅ ข้อมูลเก็บลง DB สามารถ query ย้อนหลังได้
4. ✅ ระบบทำงานต่อเนื่อง 24 ชั่วโมงโดยไม่ crash
5. ✅ ทีมเข้าใจ pain points ของ project จริง

---

## 📊 POC Report Template

ดูที่ `docs/POC_REPORT_TEMPLATE.md`
