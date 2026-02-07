# HomeSync POC - Team Checklist

## 👥 รายชื่อทีม

| บทบาท | ชื่อ | GitHub | ความรับผิดชอบ |
|-------|------|--------|---------------|
| Backend/Firmware | ต้น | @ton | Node.js, MQTT, Arduino |
| Mobile | บีม | @beam | Flutter App |
| DevOps | ฟลุ๊ค | @fluke | Infrastructure, HiveMQ |
| QA/Hardware | มิ้นท์ | @mint | Testing, Assembly |
| PM | กุ้ง | @gung | Coordination, Report |

---

## ✅ Pre-Start Checklist

### ฟลุ๊ค (Infrastructure)
- [ ] สมัคร HiveMQ Cloud account
- [ ] สร้าง cluster และ credentials
- [ ] Setup InfluxDB (Docker หรือ Cloud)
- [ ] ส่ง config ให้ทีม:
  - [ ] MQTT broker URL
  - [ ] MQTT port (8883)
  - [ ] MQTT username/password
  - [ ] InfluxDB URL
  - [ ] InfluxDB token

### มิ้นท์ (Hardware)
- [ ] สั่งซื้อ/ยืม hardware:
  - [ ] NodeMCU ESP8266
  - [ ] PZEM-004T v3.0
  - [ ] Relay module
  - [ ] Jumper wires
  - [ ] Multimeter (optional)
- [ ] ประกอบตาม wiring diagram
- [ ] ทดสอบไฟเลี้ยงปกติ

---

## 🏃 Week 1 Tasks

### Day 1-2: Infrastructure

**ฟลุ๊ค:**
- [ ] Deploy InfluxDB
- [ ] สร้าง HiveMQ cluster
- [ ] ส่ง config document ให้ทีม
- [ ] Setup monitoring (optional)

**มิ้นท์:**
- [ ] รับ hardware
- [ ] ตรวจสอบอุปกรณ์ครบถ้วน
- [ ] เริ่ม assembly

---

### Day 2-3: Hardware Assembly

**ต้น + มิ้นท์:**
- [ ] ประกอบ NodeMCU + PZEM + Relay
- [ ] Flash firmware ครั้งแรก
- [ ] ทดสอบ WiFi connection
- [ ] ทดสอบ PZEM readings
- [ ] ทดสอบ relay control

**Deliverable:**
- [ ] NodeMCU ต่อ WiFi ได้
- [ ] อ่านค่า PZEM ได้
- [ ] ควบคุม relay ได้
- [ ] ส่งข้อมูลผ่าน Serial ได้

---

### Day 3-5: Backend Development

**ต้น:**
- [ ] Setup project structure
- [ ] Implement MQTT client
- [ ] Implement InfluxDB writer
- [ ] Create REST API endpoints
- [ ] Implement WebSocket server
- [ ] Test with HiveMQ
- [ ] Test with InfluxDB

**Deliverable:**
- [ ] `GET /api/poc/readings` working
- [ ] `POST /api/poc/relay` working
- [ ] WebSocket broadcasting
- [ ] Data storing in InfluxDB

---

## 🏃 Week 2 Tasks

### Day 1-3: Mobile Development

**บีม:**
- [ ] Setup Flutter project
- [ ] Create UI mockups
- [ ] Implement API service
- [ ] Implement WebSocket client
- [ ] Create dashboard screen
- [ ] Test with backend

**Deliverable:**
- [ ] App แสดงค่าไฟได้
- [ ] App ควบคุม relay ได้
- [ ] Real-time updates ทำงาน

---

### Day 3-4: Integration & Testing

**ทั้งทีม:**
- [ ] End-to-end test
- [ ] Run test cases (TC-001 ถึง TC-010)
- [ ] บันทึกผลการทดสอบ
- [ ] แก้ไข bugs ที่เจอ
- [ ] ตรวจสอบ latency
- [ ] ทดสอบ stability (24h)

**มิ้นท์:**
- [ ] ทำ accuracy test
- [ ] บันทึก test results
- [ ] สร้าง bug reports

---

### Day 5: Demo & Report

**ทั้งทีม:**
- [ ] เตรียบ demo script
- [ ] ซ้อม presentation
- [ ] ถ่าย demo video (optional)
- [ ] สรุปผล POC

**กุ้ง:**
- [ ] รวบรวม feedback
- [ ] เขียน POC report
- [ ] Present ผลลัพธ์

---

## 📋 Daily Standup Questions

ทุกเช้า ให้แต่ละคนตอบ:
1. เมื่อวานทำอะไรเสร็จ?
2. วันนี้จะทำอะไร?
3. มีอะไรติดขัดไหม?

---

## 🚨 Escalation

ถ้าติดปัญหาเกิน 2 ชั่วโมง:
1. ถามในกลุ่ม
2. ถ้าไม่มีคนตอบ → Ping PM
3. ถ้าบล็อกทีมอื่น → ประชุมด่วน

---

## 📁 File Organization

```
homesync-poc/
├── backend/          # ต้น
│   ├── src/
│   ├── .env
│   └── README.md
├── mobile/           # บีม
│   ├── lib/
│   └── README.md
├── firmware/         # ต้น+มิ้นท์
│   ├── src/
│   └── README.md
├── infrastructure/   # ฟลุ๊ค
│   ├── docker-compose.yml
│   └── README.md
└── docs/            # กุ้ง
    ├── POC_REPORT.md
    └── TEST_RESULTS.md
```

---

## 📝 Definition of Done

### Backend
- [ ] Code ผ่าน testing
- [ ] API documentation ครบ
- [ ] README อธิบายการใช้งาน
- [ ] .env.example ครบถ้วน

### Mobile
- [ ] App รันได้ทั้ง iOS/Android
- [ ] UI responsive
- [ ] ไม่มี compile errors
- [ ] README อธิบายการตั้งค่า IP

### Firmware
- [ ] Upload ผ่านทั้ง PlatformIO และ Arduino IDE
- [ ] Serial output ชัดเจน
- [ ] config.h มี comments
- [ ] README มี wiring diagram

### QA
- [ ] Test cases ผ่าน 80%
- [ ] Bug reports มี reproduction steps
- [ ] Accuracy test มีผลลัพธ์
- [ ] มี screenshot/video

---

## 🎉 Success Criteria (Recap)

1. ✅ Mobile แสดงค่าไฟถูกต้อง (±10%)
2. ✅ Relay ตอบสนองภายใน 3 วินาที
3. ✅ ข้อมูลเก็บลง DB ได้
4. ✅ ทำงานต่อเนื่อง 24 ชั่วโมง
5. ✅ ทีมเข้าใจ pain points
