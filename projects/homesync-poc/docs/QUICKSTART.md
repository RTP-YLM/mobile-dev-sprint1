# Quick Start Guide - HomeSync POC

## 🚀 เริ่มต้นใช้งานใน 5 นาที

### Step 1: Infrastructure (ฟลุ๊ค)

```bash
cd infrastructure
docker-compose up -d

# ตรวจสอบว่ารันปกติ
docker-compose ps
```

### Step 2: HiveMQ Setup

1. ไปที่ https://www.hivemq.com/mqtt-cloud/
2. สร้าง cluster (Free tier)
3. สร้าง credentials
4. บันทึกไว้ใช้ในขั้นตอนถัดไป

### Step 3: Backend (ต้น)

```bash
cd backend
cp .env.example .env
# แก้ไข .env ให้มีค่า HiveMQ ที่สร้างไว้

npm install
npm run dev
```

### Step 4: Firmware (ต้น+มิ้นท์)

```bash
# แก้ไข config ใน firmware/src/config.h
# - WiFi credentials
# - HiveMQ credentials

# PlatformIO
cd firmware
pio run --target upload

# หรือ Arduino IDE
# เปิด firmware/homesync_poc.ino แล้ว upload
```

### Step 5: Mobile (บีม)

```bash
cd mobile

# แก้ไข IP ใน:
# - lib/services/api_service.dart
# - lib/services/websocket_service.dart

flutter pub get
flutter run
```

---

## 🧪 ทดสอบระบบ

### Test 1: ดูข้อมูลจาก API
```bash
curl http://localhost:3000/api/poc/readings
```

### Test 2: สั่งเปิด Relay
```bash
curl -X POST http://localhost:3000/api/poc/relay \
  -H "Content-Type: application/json" \
  -d '{"state": true}'
```

### Test 3: ดูข้อมูลใน InfluxDB
ไปที่ http://localhost:8086 → Data Explorer

---

## 🛠 Troubleshooting

### "Cannot connect to MQTT"
- ตรวจสอบ HiveMQ credentials
- ตรวจสอบว่า port 8883 ไม่ถูก block

### "Mobile cannot connect to backend"
- ตรวจสอบ IP address (ใช้ IP เครื่องจริง ไม่ใช่ localhost)
- ตรวจสอบ firewall

### "No data from PZEM"
- ตรวจสอบ wiring TX/RX (crossover)
- ตรวจสอบว่า PZEM ได้รับ 5V

---

## 📞 Support

| ปัญหา | ติดต่อ |
|-------|--------|
| Infrastructure | ฟลุ๊ค |
| Backend/Firmware | ต้น |
| Mobile | บีม |
| Testing | มิ้นท์ |
