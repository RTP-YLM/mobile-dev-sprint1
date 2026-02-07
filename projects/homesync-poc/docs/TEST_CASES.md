# HomeSync POC - Test Cases

## 🎯 Test Overview

| ID | Test Case | Priority | Owner |
|----|-----------|----------|-------|
| TC-001 | NodeMCU ส่งข้อมูลมาถึง Backend | High | มิ้นท์ |
| TC-002 | Backend เก็บข้อมูลลง InfluxDB | High | มิ้นท์ |
| TC-003 | Backend ส่งข้อมูลไป Mobile ผ่าน API | High | มิ้นท์ |
| TC-004 | Mobile แสดงข้อมูลถูกต้อง | High | มิ้นท์ |
| TC-005 | WebSocket real-time updates | Medium | มิ้นท์ |
| TC-006 | กด ON/OFF ที่ Mobile → Relay ตอบสนอง | High | มิ้นท์ |
| TC-007 | Latency test (ควร < 3 วินาที) | High | มิ้นท์ |
| TC-008 | WiFi disconnect/reconnect | Medium | มิ้นท์ |
| TC-009 | 24-hour stability test | Medium | มิ้นท์ |
| TC-010 | ค่าที่อ่านได้ถูกต้อง (±10%) | High | มิ้นท์ |

---

## 📋 Detailed Test Cases

### TC-001: NodeMCU → Backend Data Flow
**Objective:** ตรวจสอบว่า NodeMCU ส่งข้อมูลมาถึง Backend ผ่าน MQTT

**Preconditions:**
- NodeMCU ต่อ WiFi ได้
- Backend รันอยู่
- HiveMQ connection ปกติ

**Steps:**
1. เปิด Serial Monitor ดู NodeMCU logs
2. ดู Backend logs (`npm run dev`)
3. รอ 5 วินาที (telemetry interval)

**Expected Results:**
- [ ] NodeMCU logs แสดง "Published to MQTT"
- [ ] Backend logs แสดง "📨 Received [homesync/poc/node1/telemetry/power]"

**Pass/Fail:** ___

---

### TC-002: Backend → InfluxDB
**Objective:** ตรวจสอบว่าข้อมูลถูกเขียนลง InfluxDB

**Preconditions:**
- InfluxDB รันอยู่
- TC-001 ผ่าน

**Steps:**
1. ไปที่ InfluxDB UI: http://localhost:8086
2. Login → Data Explorer
3. Select bucket: `poc_telemetry`
4. Select measurement: `power`

**Expected Results:**
- [ ] มี data points แสดงใน graph
- [ ] ค่า value ตรงกับที่ NodeMCU ส่ง

**Pass/Fail:** ___

---

### TC-003: Backend API
**Objective:** ตรวจสอบ API endpoint

**Steps:**
```bash
curl http://localhost:3000/api/poc/readings
```

**Expected Results:**
```json
{
  "success": true,
  "data": {
    "power": 123.4,
    "voltage": 220.5,
    "current": 0.56,
    "relayState": false,
    "lastUpdate": "2024-01-01T00:00:00.000Z"
  }
}
```

**Pass/Fail:** ___

---

### TC-004: Mobile Dashboard
**Objective:** ตรวจสอบว่า Mobile แสดงข้อมูลถูกต้อง

**Steps:**
1. เปิด App
2. รอจนกว่าจะแสดง "เชื่อมต่อแล้ว"
3. เปรียบเทียบค่ากับ Multimeter (ถ้ามี)

**Expected Results:**
- [ ] แสดงค่า Power, Voltage, Current
- [ ] ค่าเปลี่ยนแปลงตามจริง (ถ้าโหลดเปลี่ยน)
- [ ] ไม่มี error messages

**Pass/Fail:** ___

---

### TC-005: WebSocket Real-time
**Objective:** ตรวจสอบ WebSocket updates

**Steps:**
1. เปิด Mobile App
2. เปิด Browser ไปที่ `wscat` หรือ Postman
3. Connect WebSocket: `ws://localhost:3000`
4. รอ 5 วินาที

**Expected Results:**
- [ ] ได้รับ message type: `connected`
- [ ] ได้รับ message type: `telemetry` ทุก 5 วินาที

**Pass/Fail:** ___

---

### TC-006: Relay Control
**Objective:** ตรวจสอบการควบคุม relay จาก Mobile

**Steps:**
1. เปิด Mobile App
2. กดปุ่ม ON
3. ดูที่ NodeMCU (LED หรือ Multimeter)
4. กดปุ่ม OFF
5. ดูที่ NodeMCU

**Expected Results:**
- [ ] กด ON → Relay ทำงาน (ได้ยินเสียง "click")
- [ ] กด OFF → Relay ปิด
- [ ] Mobile แสดง state ถูกต้อง

**Pass/Fail:** ___

---

### TC-007: Latency Test
**Objective:** วัดเวลาตอบสนอง

**Steps:**
```bash
# Test 1: API Latency
time curl http://localhost:3000/api/poc/readings

# Test 2: Relay Command Latency
time curl -X POST http://localhost:3000/api/poc/relay \
  -H "Content-Type: application/json" \
  -d '{"state": true}'
```

**Expected Results:**
- [ ] API response < 100ms
- [ ] Relay command → relay ตอบสนอง < 3 วินาที

**Measured Times:**
- API: ___ ms
- Relay ON: ___ ms
- Relay OFF: ___ ms

**Pass/Fail:** ___

---

### TC-008: WiFi Resilience
**Objective:** ตรวจสอบการกลับมาทำงานหลัง WiFi disconnect

**Steps:**
1. ปิด WiFi router 5 วินาที
2. เปิด WiFi ใหม่
3. รอ 30 วินาที
4. ตรวจสอบว่า NodeMCU reconnect

**Expected Results:**
- [ ] NodeMCU reconnect ภายใน 30 วินาที
- [ ] ข้อมูลเริ่ม flow อีกครั้ง
- [ ] Mobile แสดงสถานะ "เชื่อมต่อแล้ว"

**Pass/Fail:** ___

---

### TC-009: 24-Hour Stability
**Objective:** ตรวจสอบว่าระบบทำงานต่อเนื่องได้ 24 ชั่วโมง

**Steps:**
1. เปิดระบบทั้งหมด
2. รอ 24 ชั่วโมง
3. ตรวจสอบ logs

**Expected Results:**
- [ ] ไม่มี crash
- [ ] ข้อมูลไม่ขาด (check InfluxDB)
- [ ] Memory usage stable

**Actual Results:**
- อาการที่พบ: ___
- จำนวน disconnections: ___

**Pass/Fail:** ___

---

### TC-010: Accuracy Test
**Objective:** ตรวจสอบความถูกต้องของค่าที่อ่านได้

**Preconditions:**
- มี Multimeter
- มี Load ที่รู้ค่า (เช่น หลอดไฟ 60W)

**Steps:**
1. วัดค่าด้วย Multimeter
2. เปรียบเทียบกับค่าใน Mobile App
3. ทดสอบกับ load ต่างๆ

**Expected Results:**
- [ ] ค่า Voltage ตรง ±10%
- [ ] ค่า Current ตรง ±10%
- [ ] ค่า Power ตรง ±10%

**Test Data:**
| Load | Expected W | Multimeter W | App W | Error % |
|------|------------|--------------|-------|---------|
| 60W bulb | 60 | ___ | ___ | ___ |
| 100W bulb | 100 | ___ | ___ | ___ |

**Pass/Fail:** ___

---

## 📊 Test Summary Form

| Test ID | Status | Notes |
|---------|--------|-------|
| TC-001 | ⬜ Pass ⬜ Fail | |
| TC-002 | ⬜ Pass ⬜ Fail | |
| TC-003 | ⬜ Pass ⬜ Fail | |
| TC-004 | ⬜ Pass ⬜ Fail | |
| TC-005 | ⬜ Pass ⬜ Fail | |
| TC-006 | ⬜ Pass ⬜ Fail | |
| TC-007 | ⬜ Pass ⬜ Fail | |
| TC-008 | ⬜ Pass ⬜ Fail | |
| TC-009 | ⬜ Pass ⬜ Fail | |
| TC-010 | ⬜ Pass ⬜ Fail | |

**Overall Result:** ⬜ Pass ⬜ Fail

**Tester:** _____________ **Date:** _____________
