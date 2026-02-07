# HomeSync App - Technical Specification
## เอกสารสเปคระบบ (อัพเดท 7 ก.พ. 2026)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Flutter Mobile App                            │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  │   │
│  │  │ Dashboard  │  │  EV        │  │   Solar    │  │ Settings │  │   │
│  │  │   Screen   │  │  Charging  │  │   Energy   │  │  Screen  │  │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Firebase Auth   │      │  Node.js Backend │      │  MQTT Broker     │
│  (Phone OTP)     │      │  (API Gateway)   │      │  (HiveMQ/EMQX)   │
└──────────────────┘      └────────┬─────────┘      └──────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                              ▼
          ┌──────────────────┐          ┌──────────────────┐
          │   PostgreSQL     │          │    InfluxDB      │
          │   (Metadata)     │          │  (Time-Series)   │
          │  - Users         │          │  - Power data    │
          │  - Devices       │          │  - Voltage       │
          │  - Settings      │          │  - Current       │
          └──────────────────┘          └──────────────────┘
```

---

## 2. Authentication System (NEW)

### 2.1 Technology: Firebase Authentication

**เหตุผลที่เลือก:**
- ฟรี 50,000 users/month
- รองรับ Phone OTP (คนไทยชอบ ไม่ต้องจำ password)
- Social Login: Google, Apple, Facebook
- Anonymous Auth (ให้ลองใช้ก่อน login)
- Security ดี (Google ดูแล)

### 2.2 Login Methods (Priority)

| ลำดับ | วิธี | รายละเอียด |
|-------|------|-----------|
| 1 | **Phone OTP** (หลัก) | ใส่เบอร์ → รับ SMS → ยืนยัน code |
| 2 | **Google Sign-In** | สำหรับ Android users |
| 3 | **Apple Sign-In** | บังคับสำหรับ iOS (Apple policy) |
| 4 | **Anonymous** | ลองใช้ก่อน ไม่ต้อง login |

### 2.3 Authentication Flow

```
[เปิด App ครั้งแรก]
         │
         ▼
[Welcome Screen]
         │
    ┌────┴────┐
    ▼         ▼
[ลองใช้ก่อน]  [เข้าสู่ระบบ]
    │           │
    ▼           ▼
[Anonymous]  [เลือกวิธี]
    │           │
    ▼      ┌────┼────┐
[Dashboard] ▼    ▼    ▼
        [Phone] [Google] [Apple]
            │
            ▼
    [ใส่เบอร์โทร]
            │
            ▼
    [ส่ง OTP]
            │
            ▼
    [ยืนยันรหัส]
            │
            ▼
    [สร้าง User ใน PostgreSQL]
            │
            ▼
    [เข้า Dashboard]
```

### 2.4 User States

| State | คำอธิบาย | สิทธิ์ |
|-------|---------|--------|
| **Anonymous** | ไม่ได้ login | ดู dashboard ได้, ไม่ sync ข้อมูล |
| **Authenticated** | Login แล้ว | ดู dashboard, sync ข้อมูล, ตั้งค่าได้ |

---

## 3. Database Architecture (NEW)

### 3.1 ทำไมต้อง 2 Database?

| ฐานข้อมูล | ใช้เก็บ | จุดเด่น |
|-----------|---------|---------|
| **PostgreSQL** | Metadata (Users, Devices, Settings) | Relational, ACID, ซับซ้อน |
| **InfluxDB** | Sensor Data (Power, Voltage, Current) | Time-series, เร็ว, ลบเก่าอัตโนมัติ |

**เหตุผล:**
- Sensor data เข้ามาทุก 5 วินาที (10 อุปกรณ์ × 12 ครั้ง/นาที × 1440 นาที = **172,800 rows/วัน/บ้าน**)
- PostgreSQL จะช้าและบวมถ้าเก็บข้อมูล time-series ปริมาณมาก
- InfluxDB ออกแบบมาสำหรับ IoT time-series โดยเฉพาะ

### 3.2 PostgreSQL Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,  -- จาก Firebase Auth
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homes Table (1 user มีหลายบ้านได้)
CREATE TABLE homes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL DEFAULT 'บ้านของฉัน',
    address TEXT,
    tariff_rate DECIMAL(10,2) DEFAULT 4.5,  -- บาท/kWh
    monthly_budget DECIMAL(10,2) DEFAULT 3000,  -- งบค่าไฟ/เดือน
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices Table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES homes(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'smart_plug', 'ev_charger', 'solar_inverter'
    mqtt_topic VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    icon VARCHAR(50) DEFAULT '🔌',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device Settings Table
CREATE TABLE device_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id),
    alert_threshold_watt INTEGER,  -- แจ้งเตือนเมื่อเกินกี่วัตต์
    auto_schedule JSONB,  -- ตั้งเวลาเปิด/ปิดอัตโนมัติ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts Table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,  -- 'high_usage', 'device_offline', 'budget_warning'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 InfluxDB Schema (Time-Series)

```json
// Measurement: power_readings
{
  "measurement": "power_readings",
  "tags": {
    "device_id": "shelly-plug-01",
    "user_id": "user_123",
    "home_id": "home_456"
  },
  "fields": {
    "power_w": 1250.5,
    "voltage_v": 220.5,
    "current_a": 5.67,
    "power_factor": 0.95,
    "frequency_hz": 50.02
  },
  "timestamp": "2025-02-07T10:30:00Z"
}

// Measurement: energy_totals (สำหรับคำนวณค่าไฟ)
{
  "measurement": "energy_totals",
  "tags": {
    "device_id": "shelly-plug-01",
    "user_id": "user_123"
  },
  "fields": {
    "total_kwh": 15234.56,
    "today_kwh": 12.34
  },
  "timestamp": "2025-02-07T10:30:00Z"
}

// Measurement: solar_production
{
  "measurement": "solar_production",
  "tags": {
    "inverter_id": "solar-inv-01",
    "user_id": "user_123"
  },
  "fields": {
    "production_w": 4250.0,
    "exported_to_grid_w": 1500.0,
    "battery_charge_w": 1200.0
  },
  "timestamp": "2025-02-07T10:30:00Z"
}

// Measurement: ev_charging
{
  "measurement": "ev_charging",
  "tags": {
    "charger_id": "ev-charger-01",
    "user_id": "user_123"
  },
  "fields": {
    "power_w": 11500.0,
    "voltage_v": 235.0,
    "current_a": 48.0,
    "battery_percent": 78.0
  },
  "timestamp": "2025-02-07T10:30:00Z"
}
```

### 3.4 Data Retention Policy

| Database | Retention | เหตุผล |
|----------|-----------|--------|
| PostgreSQL | Forever | Metadata ไม่เยอะ |
| InfluxDB Raw | 1 ปี | ข้อมูลทุก 5 วินาที |
| InfluxDB Hourly Avg | 2 ปี | Agg สำหรับ report |
| InfluxDB Daily Avg | 5 ปี | Agg สำหรับ trend |

---

## 4. API Endpoints

### 4.1 Authentication APIs

```
POST /api/auth/verify-phone
  Body: { "phone": "+66812345678" }
  Response: { "verification_id": "xxx" }

POST /api/auth/verify-otp
  Body: { "verification_id": "xxx", "otp": "123456" }
  Response: { "token": "JWT", "user": { ... } }

POST /api/auth/anonymous
  Response: { "token": "JWT", "user": { ... } }

POST /api/auth/link-phone
  Header: Authorization: Bearer {anonymous_token}
  Body: { "phone": "+66812345678", "otp": "123456" }
  Response: { "token": "JWT", "user": { ... } }
```

### 4.2 Device APIs

```
GET /api/devices
  Header: Authorization: Bearer {token}
  Response: { "devices": [...] }

GET /api/devices/:id/readings
  Query: ?from=2025-02-01&to=2025-02-07
  Response: { "readings": [...] }

POST /api/devices/:id/control
  Body: { "relay": true/false }
  Response: { "success": true }
```

### 4.3 Energy APIs

```
GET /api/energy/realtime
  Response: { "power": 1250, "voltage": 220, "current": 5.6 }

GET /api/energy/daily
  Query: ?date=2025-02-07
  Response: { "kwh": 12.4, "cost": 62.0 }

GET /api/energy/monthly
  Query: ?month=2&year=2025
  Response: { "kwh": 345, "cost": 1725, "budget_percent": 65 }

GET /api/energy/solar
  Response: { "production_w": 4250, "consumption_w": 1850, "grid_import_w": -500 }
```

### 4.4 EV Charging APIs

```
GET /api/ev/status
  Response: { "battery_percent": 78, "charging": true, "power_w": 11500 }

POST /api/ev/schedule
  Body: { "mode": "immediate|night|solar", "start_time": "22:00" }
  Response: { "success": true }
```

---

## 5. Real-time Updates

### 5.1 WebSocket Events

```javascript
// Client subscribes to:
ws://api.homesync.app/realtime?token={JWT}

// Events from server:
{ "type": "power_update", "value": 1250.5, "timestamp": "..." }
{ "type": "device_status", "device_id": "...", "online": true }
{ "type": "alert", "alert_id": "...", "message": "ใช้ไฟเกิน 1,500W" }
{ "type": "ev_status", "battery_percent": 78, "remaining_minutes": 45 }
```

---

## 6. Security Considerations

### 6.1 Authentication
- Firebase Auth จัดการให้หมด (token, refresh, expiry)
- Backend verify Firebase JWT ทุก request
- Anonymous users ถูกจำกัดสิทธิ์

### 6.2 Authorization
- User ดูได้แค่ข้อมูลตัวเอง (check user_id ทุก query)
- Device control ตรวจสอบ ownership ก่อน execute

### 6.3 Data Encryption
- Transit: TLS 1.3 ทุก connection
- At Rest: PostgreSQL/InfluxDB encryption ตาม provider

---

## 7. Summary of NEW Components

### 7.1 เพิ่มจากเดิม (จาก SA Analysis)

| ส่วน | เดิม | ใหม่ |
|------|-----|------|
| **Auth** | JWT ธรรมดา | Firebase Auth (Phone OTP) |
| **DB** | ไม่ชัดเจน | PostgreSQL + InfluxDB แยกชัด |
| **EV** | ไม่มี | APIs + Real-time status |
| **Solar** | ไม่มี | Grid flow + Battery + ROI |

### 7.2 Tech Stack สมบูรณ์

```
Frontend:     Flutter (Dart)
Auth:         Firebase Authentication
Backend:      Node.js + Express + TypeScript
MQTT Broker:  HiveMQ Cloud / EMQX
Database 1:   PostgreSQL (Render/Supabase/AWS RDS)
Database 2:   InfluxDB Cloud (Time-Series)
Hosting:      Render / Railway / AWS
```

---

**จัดทำโดย:** ดรีม (UX/UI Designer) + กุ้ง (PM)  
**อัพเดทล่าสุด:** 7 กุมภาพันธ์ 2026  
**สถานะ:** พร้อมส่งให้ทีม Develop
