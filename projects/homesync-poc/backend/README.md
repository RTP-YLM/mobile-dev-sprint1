# HomeSync POC Backend

Backend สำหรับเชื่อมต่อ MQTT (HiveMQ) และให้ API แก่ Mobile App

## 📋 Features

- ✅ MQTT Bridge - Subscribe/Publish ข้อมูลกับ NodeMCU
- ✅ REST API - ให้ Mobile ดึงข้อมูล
- ✅ WebSocket - Real-time updates ไป Mobile
- ✅ InfluxDB - เก็บ telemetry data

## 🚀 Setup

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment
```bash
cp .env.example .env
# แก้ไข .env ให้ถูกต้อง
```

### 3. รัน Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API Info |
| GET | `/health` | Health Check |
| GET | `/api/poc/readings` | ดึงค่าล่าสุด (Power, Voltage, Current) |
| POST | `/api/poc/relay` | สั่ง ON/OFF relay `{ "state": true }` |
| WS | `/` | WebSocket สำหรับ real-time updates |

## 🔌 WebSocket Events

**Client → Server:**
```json
{ "type": "ping" }
```

**Server → Client:**
```json
{ "type": "connected", "message": "...", "timestamp": "..." }
{ "type": "telemetry", "data": { "type": "power", "value": 123.4 }, "timestamp": "..." }
{ "type": "relay_state", "state": true, "timestamp": "..." }
```

## 🧪 Testing

```bash
# Test MQTT connection
node scripts/test-mqtt.js

# Test API
curl http://localhost:3000/api/poc/readings

# Test relay ON
curl -X POST http://localhost:3000/api/poc/relay \
  -H "Content-Type: application/json" \
  -d '{"state": true}'
```

## 📦 Dependencies

- `express` - Web framework
- `mqtt` - MQTT client
- `ws` - WebSocket server
- `@influxdata/influxdb-client` - InfluxDB client
- `cors` - Enable CORS
- `dotenv` - Environment variables
