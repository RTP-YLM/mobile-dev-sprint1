# HomeSync - Smart Home & Energy Monitor
## OpenSpec Proposal v2.1 (NodeMCU Architecture)

> **Core Value:** แอพพลิเคชั่นบ้านอัจฉริยะแบบครบวงจร - ควบคุมและ monitor การใช้ไฟฟ้าในที่เดียว
> 
> **Architecture Update:** Migrated from Shelly commercial devices to NodeMCU DIY approach with HiveMQ Cloud

---

## Problem Statement

### ปัญหาในบ้านยุคปัจจุบัน

เจ้าของบ้านและผู้เช่าอพาร์ทเมนต์ในปัจจุบันเผชิญกับความท้าทายในการจัดการบ้านอัจฉริยะและพลังงาน:

#### 1. Fragmented Ecosystem (ระบบกระจัดกระจาย)
- ต้องใช้หลายแอพสำหรับ smart home: แอพหนึ่ง control ไฟ, อีกแอพ monitor ไฟ, อีกแอพ control แอร์
- ไม่มี **unified dashboard** ที่แสดงทั้งการใช้พลังงานและสถานะอุปกรณ์ในหน้าเดียว
- ยากต่อการจัดการบ้านที่มีอุปกรณ์หลายยี่ห้อ

#### 2. ไม่มี Visibility ด้านพลังงาน
- รู้ค่าไฟฟ้าก็ต่อเมื่อได้รับบิลเดือนละครั้ง ทำให้ไม่สามารถปรับพฤติกรรมการใช้ไฟได้ทันท่วงที
- ไม่รู้จุดที่ใช้ไฟเยอะ - ไม่สามารถระบุได้ว่าเครื่องใช้ไฟตัวไหนกินไฟมากที่สุด
- พฤติกรรมการใช้ไฟไม่มี feedback loop แบบ real-time

#### 3. ขาด Automation ที่ชาญฉลาด
- ไม่มีระบบ automation ที่เชื่อมโยงการใช้ไฟกับการ control อุปกรณ์
- ต้องคอยเปิด-ปิดอุปกรณ์ด้วยตนเอง แม้จะรู้ว่ากำลังใช้ไฟเกิน
- ไม่สามารถตั้ง schedule หรือ scene ที่ช่วยประหยัดพลังงานได้

#### 4. ไม่มีระบบแจ้งเตือนแบบ Proactive
- ไม่รู้เมื่อมีการใช้ไฟผิดปกติหรือเกินกำหนดที่ตั้งไว้
- ไม่มีการแจ้งเตือนเมื่ออุปกรณ์ทำงานผิดปกติ

### ผลกระทบ
- **ค่าไฟฟ้าสูงเกินความจำเป็น** - ใช้ไฟโดยไม่รู้ตัว
- **ความไม่สะดวกในการใช้ชีวิต** - ต้องสลับแอพบ่อย, ลืมปิดอุปกรณ์
- **พลาดโอกาสในการประหยัดพลังงาน** - ไม่มีระบบช่วยตัดสินใจอัตโนมัติ

---

## Goals (เป้าหมาย)

### Goal 1: Real-time Energy Monitoring
ผู้ใช้สามารถดูการใช้ไฟฟ้าแบบ real-time ผ่านมือถือ อัพเดตทุก 5-30 วินาที แสดงกำลังไฟ (W), แรงดัน (V), กระแส (A), และค่าไฟสะสมรายวัน พร้อมระบบระบุตำแหน่ง/ห้องของแต่ละอุปกรณ์ได้

### Goal 2: Smart Device Control
ผู้ใช้สามารถควบคุมอุปกรณ์บ้านอัจฉริยะผ่านแอพได้แบบ real-time:
- **On/Off Control** - เปิด-ปิดอุปกรณ์ได้ทันที
- **Dimming Control** - ปรับความสว่างหลอดไฟ (หากรองรับ)
- **Status Feedback** - แสดงสถานะอุปกรณ์แบบ real-time (on/off, power consumption)

### Goal 3: Intelligent Automation (If-This-Then-That)
ผู้ใช้สามารถสร้าง automation rules ที่เชื่อมโยงการใช้ไฟกับการ control อุปกรณ์:
- **Energy-Based Triggers** - หากใช้ไฟเกิน X วัตต์ → ปิดอุปกรณ์ Y
- **Time-Based Triggers** - ตั้งเวลาเปิด-ปิดอุปกรณ์อัตโนมัติ
- **Condition-Based Triggers** - หากอุณหภูมิสูงกว่า X → เปิดพัดลม
- **Scene Activation** - กดปุ่มเดียวทำหลายอย่างพร้อมกัน (เช่น "Leaving Home" → ปิดทุกไฟ + ปิดแอร์)

### Goal 4: Unified Smart Home Dashboard
หน้าหลักที่แสดงข้อมูลครบวงจรในที่เดียว:
- **Energy Overview** - การใช้ไฟรวมและรายอุปกรณ์
- **Device Grid** - สถานะและ control อุปกรณ์ทั้งหมด
- **Quick Actions** - ปุ่ม scene และ shortcut ที่ใช้บ่อย
- **Active Automations** - แสดง automation ที่กำลังทำงานอยู่

### Goal 5: Energy-Saving Automation
ระบบ automation ที่ช่วยประหยัดพลังงานโดยอัตโนมัติ:
- **Auto-Off When Idle** - ปิดอุปกรณ์อัตโนมัติเมื่อไม่มีการใช้งาน
- **Peak Hour Management** - ลดการใช้ไฟในช่วง on-peak อัตโนมัติ
- **Budget-Based Control** - ปิดอุปกรณ์ไม่จำเป็นเมื่อใกล้ถึงงบประมาณ
- **Sleep Mode** - ตั้งค่าให้ปิดอุปกรณ์ทั้งหมดตามเวลานอน

---

## Non-Goals (อะไรที่ไม่ทำใน scope นี้)

### Hardware
1. **ไม่ผลิต Hardware เอง** - ใช้อุปกรณ์ที่มีอยู่ในตลาด (NodeMCU, sensors) เท่านั้น
2. **ไม่ทำ Custom Gateway** - ใช้ HiveMQ Cloud (managed MQTT broker)
3. **ไม่รองรับ Battery-Powered Sensors** - Focus อุปกรณ์ที่เสียบปลั๊กเท่านั้น

### AI และ Advanced Features
4. **ไม่ทำ AI/ML Learning** - ไม่มีการเรียนรู้พฤติกรรมผู้ใช้เพื่อ prediction (phase 2)
5. **ไม่ทำ Voice Control** - ไม่รองรับ Alexa, Google Assistant ใน phase นี้ (phase 2)
6. **ไม่ทำ Computer Vision** - ไม่มี video/camera integration
7. **ไม่ทำ Predictive Maintenance** - ไม่มีการคาดการณ์อายุอุปกรณ์

### Scope และ Scale
8. **ไม่รองรับ Commercial/Industrial** - Focus เฉพาะ residential (บ้าน/อพาร์ทเมนต์)
9. **ไม่รองรับ Multi-Home ใน MVP** - 1 home ต่อ 1 account ในเวอร์ชันแรก
10. **ไม่ทำ Complex Third-Party Integrations** - ไม่เชื่อมต่อกับระบบที่ซับซ้อน (HVAC systems, ระบบรักษาความปลอดภัย)
11. **ไม่ทำ Billing Integration กับการไฟฟ้า** - ผู้ใช้กรอกข้อมูลค่าไฟเอง
12. **ไม่รองรับ Shared Access ใน MVP** - ไม่มีระบบแชร์ access กับสมาชิกครอบครัว

---

## Success Criteria

### Monitoring Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Device Control Response Time** | < 2 seconds | เวลาจากกดปุ่มจนถึงอุปกรณ์ตอบสนอง |
| **Automation Execution Rate** | > 99% | อัตราสำเร็จของ automation rules |
| **User-Created Automations** | > 60% ของผู้ใช้ | ผู้ใช้ที่สร้าง automation อย่างน้อย 1 rule |
| **Scene Usage** | > 3 scenes/user | จำนวน scene ที่สร้างต่อผู้ใช้ |

### Energy Saving Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Reported Energy Savings** | > 15% | ผู้ใช้รายงานว่าประหยัดไฟได้ |
| **Active Energy Automations** | > 40% ของผู้ใช้ | ผู้ใช้ที่เปิด automation ประหยัดพลังงาน |
| **Peak Hour Reduction** | > 20% | ลดการใช้ไฟในช่วง on-peak |

### User Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Daily Active Users (DAU/MAU)** | > 35% | สูงกว่า app monitor ธรรมดา |
| **Control Actions per Day** | > 5 actions/user | จำนวนครั้งที่ control อุปกรณ์ |
| **Dashboard Opens per Week** | > 4 times | ผู้ใช้เปิด app ดู dashboard |

### System Reliability

| Metric | Target | Measurement |
|--------|--------|-------------|
| **MQTT Connection Uptime** | > 99.5% | ความเสถียรของการเชื่อมต่อ |
| **Automation Reliability** | > 99% | Automation ทำงานตามเงื่อนไข |
| **Data Accuracy** | ±5% | ความแม่นยำเทียบกับมิเตอร์จริง |
| **Push Notification Delivery** | > 95% | อัตราส่งต่อการแจ้งเตือน |

### User Satisfaction

| Metric | Target | Measurement |
|--------|--------|-------------|
| **App Store Rating** | > 4.5 stars | คะแนนเฉลี่ย |
| **User Retention (Day 30)** | > 45% | สูงกว่า benchmark ของ utility apps |
| **Net Promoter Score (NPS)** | > 40 | ผู้ใช้แนะนำให้เพื่อน |

---

## Architecture Overview (New)

### DIY Approach: NodeMCU + HiveMQ Cloud

```
NodeMCU (ESP8266/ESP32) + PZEM-004T
    ↓ (MQTT over TLS)
HiveMQ Cloud (Free Tier)
    ↓ (Subscribe)
Backend (Node.js)
    ↓ (Write/Query)
InfluxDB (Time-series)
    ↑ (Query)
Backend API (REST/WebSocket)
    ↑
Flutter Mobile App
```

### Key Changes from Previous Architecture

| Component | Before (Shelly) | After (NodeMCU) |
|-----------|-----------------|-----------------|
| **Device** | Shelly Plug S (commercial) | NodeMCU ESP8266/ESP32 (DIY) |
| **MQTT Broker** | Self-hosted Mosquitto/EMQX | HiveMQ Cloud (managed) |
| **Backend** | Optional / Minimal | **Required** (Node.js) |
| **Setup Complexity** | Plug & Play | DIY Assembly + Firmware |
| **Cost per Node** | ~฿500-800 | ~฿350-550 |
| **Flexibility** | Limited | High (custom sensors) |

---

## DIY Approach: Pros & Cons

### ✅ ข้อดีของ DIY Approach

1. **ต้นทุนต่ำกว่า**
   - NodeMCU ราคา ~฿100-150 ต่อตัว (เทียบกับ Shelly ~฿500-800)
   - ประหยัดได้ ~30-50% ต่อจุดตรวจวัด

2. **ยืดหยุ่นสูง**
   - สามารถต่อ sensor ต่างๆ ได้ตามต้องการ (PZEM, CT Clamp, Relay, etc.)
   - ปรับแต่ง firmware ได้เองตาม use case
   - รองรับอุปกรณ์ที่ไม่ใช่ smart plug (เช่น ติดตั้งในตู้ไฟ)

3. **เรียนรู้ได้**
   - ผู้ใช้ได้เรียนรู้เกี่ยวกับ IoT, electronics, programming
   - สามารถแก้ไข/ปรับปรุงระบบได้เอง
   - ไม่ผูกติดกับ vendor ใด vendor หนึ่ง

4. **Scalability**
   - ขยายจำนวน node ได้ไม่จำกัด (จำกัดแค่ HiveMQ free tier)
   - อัพเกรด hardware ได้ง่าย (ESP32 แทน ESP8266)

### ⚠️ ข้อเสียของ DIY Approach

1. **ต้องประกอบเอง**
   - ต้องต่อวงจรเอง (NodeMCU + PZEM + Relay)
   - ต้องเข้าใจเรื่องไฟฟ้าพื้นฐาน
   - ใช้เวลา setup นานกว่า (เทียบกับ plug & play)

2. **ไม่มี Warranty**
   - อุปกรณ์ DIY ไม่มีการรับประกัน
   - ต้องดูแลแก้ไขปัญหาเอง
   - ความเสี่ยงด้านความปลอดภัยหากต่อวงจรผิด

3. **ความน่าเชื่อถือ**
   - อาจมีปัญหา stability มากกว่าอุปกรณ์ commercial
   - ต้องทำ OTA update เอง
   - ต้อง monitor อุปกรณ์เอง

4. **Security Responsibility**
   - ต้องดูแล security ของ firmware เอง
   - ต้องจัดการ TLS certificates
   - ต้องอัพเดต firmware เองเมื่อพบช่องโหว่

### 🎯 เหมาะกับใคร?

**เหมาะกับ:**
- Tech enthusiasts ที่ชอบ DIY
- ผู้ใช้ที่ต้องการประหยัดต้นทุน
- ผู้ใช้ที่ต้องการความยืดหยุ่นสูง
- Developers ที่ต้องการเรียนรู้ IoT

**ไม่เหมาะกับ:**
- ผู้ใช้ทั่วไปที่ไม่ถนัดเทคนิค
- ผู้ใช้ที่ต้องการ "แค่เสียบแล้วใช้งานได้"
- ใช้ใน commercial environment ที่ต้องการ warranty

---

## Key Differentiators

### 1. Monitor + Control ในที่เดียว
- แอพอื่นส่วนใหญ่ทำได้แค่ monitor หรือ control อย่างใดอย่างหนึ่ง
- HomeSync ผสมผสานทั้งสองฟีเจอร์เข้าด้วยกัน ทำให้ผู้ใช้เห็นความสัมพันธ์ระหว่างการ control และการใช้พลังงาน

### 2. DIY-Friendly with Full Control
- ไม่ผูกติดกับ ecosystem ใด ecosystem หนึ่ง
- เปิดเผย hardware design และ firmware
- ผู้ใช้สามารถ customize ได้ตามต้องการ

### 3. Energy-Centric Automation
- Automation ของเรา focus ที่การประหยัดพลังงานเป็นหลัก
- Trigger จากการใช้ไฟ (wattage, cost) ไม่ใช่แค่เวลา
- Real feedback: ผู้ใช้เห็นว่า automation ช่วยประหยัดได้เท่าไหร่

### 4. Low-Cost Entry Point
- เริ่มต้นเพียง ~฿350 ต่อจุด (เทียบกับ ~฿500-800 ของ commercial solutions)
- HiveMQ Cloud free tier รองรับได้ถึง 100 devices
- ไม่มี subscription fee สำหรับเริ่มต้น

### 5. Unified Experience
- ไม่ต้องสลับแอพไปมา
- Dashboard ที่แสดงทั้ง energy และ devices
- Consistent UI/UX ทั้งหมด

---

## User Personas

### Persona A: "The Saver" (คนอยากประหยัดไฟ)

**Profile:**
- **Name:** คุณสมชาย
- **Age:** 45 ปี
- **Occupation:** พนักงานบริษัท
- **Home:** บ้านเดี่ยว 3 ห้องนอน
- **Tech Level:** ปานกลาง (สามารถทำตามคู่มือประกอบ hardware ได้)

**Pain Points:**
- ตกใจทุกครั้งที่เห็นบิลค่าไฟ
- ไม่รู้ว่าเครื่องใช้ไฟตัวไหนกินไฟเยอะ
- ลืมปิดไฟและแอร์บ่อย

**How HomeSync Helps:**
- **Monitoring:** ดูการใช้ไฟ real-time รู้ทันทีเมื่อใช้เยอะผิดปกติ
- **Automation:** ตั้งให้ปิดไฟอัตโนมัติเมื่อไม่มีคนอยู่ห้อง
- **Budget Alerts:** แจ้งเตือนเมื่อใกล้ถึงงบประมาณที่ตั้งไว้
- **Cost Tracking:** เห็นว่าเครื่องใช้ไฟตัวไหนกินไฟเท่าไหร่

**Favorite Features:**
- Energy dashboard ที่แสดงค่าไฟสะสมรายวัน
- Auto-off automation สำหรับไฟที่ลืมปิด
- Monthly cost projection

### Persona B: "The Tech Enthusiast" (คนอยากบ้านอัจฉริยะ)

**Profile:**
- **Name:** คุณมิน
- **Age:** 32 ปี
- **Occupation:** Software Developer
- **Home:** คอนโด 1 ห้องนอน
- **Tech Level:** สูง

**Pain Points:**
- มีหลายแอพสำหรับ smart home
- อยาก control อุปกรณ์จากที่เดียว
- อยากสร้าง scene ที่ซับซ้อน

**How HomeSync Helps:**
- **Unified Control:** Control ทุกอุปกรณ์ในที่เดียว
- **Scene Creation:** สร้าง scene "Movie Night" → ปิดไฟห้องนั่งเล่น + เปิด LED สีนวล
- **Scheduling:** ตั้ง schedule เปิดแอร์ก่อนถึงบ้าน 30 นาที
- **IFTTT Rules:** สร้าง rule "หากอุณหภูมิสูงกว่า 28°C → เปิดพัดลม"

**Favorite Features:**
- Scene editor ที่ใช้งานง่าย
- Device grid ที่แสดงสถานะทั้งหมด
- Advanced automation rules
- DIY hardware ที่ customize ได้

### Persona C: "The Estate Manager" (คนมีบ้านหลังใหญ่)

**Profile:**
- **Name:** คุณวิภา
- **Age:** 52 ปี
- **Occupation:** ธุรกิจส่วนตัว
- **Home:** บ้านเดี่ยว 2 ชั้น 5 ห้องนอน
- **Tech Level:** ต่ำ-ปานกลาง (จ้างช่างติดตั้ง)

**Pain Points:**
- บ้านใหญ่ ดูแลยาก เดินเปิด-ปิดไฟเหนื่อย
- ไม่รู้ว่าแต่ละชั้นใช้ไฟเท่าไหร่
- ลูกๆ ลืมปิดแอร์บ่อย

**How HomeSync Helps:**
- **Multi-Location Monitoring:** Monitor การใช้ไฟแยกตามชั้น/ห้อง
- **Centralized Control:** ปิดไฟทั้งบ้านได้จากปุ่มเดียว
- **Group Control:** ปิดไฟทุกห้องนอนพร้อมกัน
- **Family Alerts:** แจ้งเตือนเมื่อมีห้องที่ใช้ไฟผิดปกติ

**Favorite Features:**
- Floor plan view ที่แสดงอุปกรณ์แต่ละห้อง
- "All Off" button สำหรับปิดทั้งบ้าน
- Room-based energy tracking

---

## Scope

### In Scope (ทำใน MVP)

#### Energy Monitoring
- [x] Real-time power consumption (W, V, A) ผ่าน PZEM-004T
- [x] Cost calculation ตามอัตราค่าไฟ
- [x] Historical data (7 วัน, 30 วัน, 1 ปี)
- [x] Multi-device support (NodeMCU + sensors)
- [x] Room/location tagging
- [x] Budget setting และ alerts

#### Device Control
- [x] On/off control แบบ real-time (ผ่าน Relay module)
- [x] Status feedback (on/off state)
- [x] Dimming control (ถ้าอุปกรณ์รองรับ)
- [x] Device grouping
- [x] Quick toggle from dashboard

#### Automation
- [x] **Time-based schedules** - ตั้งเวลาเปิด-ปิดอุปกรณ์
- [x] **Energy-based triggers** - If power > X, then turn off Y
- [x] **Scene creation** - กดปุ่มเดียวทำหลายอย่างพร้อมกัน
- [x] **Simple IFTTT rules** - เงื่อนไขพื้นฐาน (time, power, state)

#### Dashboard & UI
- [x] Unified dashboard (energy + devices)
- [x] Device grid view
- [x] Energy charts and graphs
- [x] Quick actions panel
- [x] Active automations display

#### Alerts & Notifications
- [x] Push notifications สำหรับ threshold alerts
- [x] Budget limit alerts
- [x] Device offline alerts
- [x] Automation execution notifications

### Out of Scope (ไม่ทำใน MVP)

#### Hardware
- [ ] ไม่ผลิต hardware เอง (ใช้ NodeMCU off-the-shelf)
- [ ] ไม่รองรับ battery-powered sensors
- [ ] ไม่รองรับ Zigbee/Z-Wave โดยตรง (ผ่าน bridge เท่านั้น)

#### Advanced Features
- [ ] Video/Camera integration
- [ ] Voice control (Alexa, Google Assistant)
- [ ] AI/ML learning และ prediction
- [ ] Geofencing (automation ตามตำแหน่ง)
- [ ] Advanced analytics (machine learning)

#### Scale & Integration
- [ ] Multi-home support (1 account หลายบ้าน)
- [ ] Commercial/Industrial use cases
- [ ] Solar/grid feed-in monitoring
- [ ] Complex HVAC integration
- [ ] Third-party service integrations (IFTTT, Zapier)
- [ ] Shared access (family members)

#### Future Considerations
- [ ] Voice control integration (Phase 2)
- [ ] AI-powered recommendations (Phase 2)
- [ ] Mobile widgets (Phase 2)
- [ ] Apple Watch / Wear OS app (Phase 2)

---

## Stakeholders

### Primary Users (ผู้ใช้หลัก)

| Stakeholder | Description | Primary Needs |
|------------|-------------|---------------|
| **Homeowners** | เจ้าของบ้านที่ต้องการประหยัดค่าไฟและควบคุมบ้าน | Energy monitoring, automation, cost tracking |
| **Tech Enthusiasts** | คนชอบเทคโนโลยีที่มี smart home แล้ว | Unified control, scene creation, DIY hardware |
| **Estate Owners** | เจ้าของบ้านขนาดใหญ่ | Multi-room monitoring, centralized control |
| **Apartment Renters** | ผู้เช่าอพาร์ทเมนต์ | Easy setup, device-level tracking, portability |

### Secondary Stakeholders

| Stakeholder | Role | Interest |
|------------|------|----------|
| **Energy Consultants** | ที่ปรึกษาด้านพลังงาน | Aggregate data, reporting tools |
| **Property Managers** | ผู้จัดการอพาร์ทเมนต์ | Multi-unit monitoring (future) |
| **DIY Community** | Maker/Hacker community | Open hardware designs, firmware |

### Internal Stakeholders

| Stakeholder | Team | Responsibility |
|------------|------|----------------|
| **Mobile Dev Team** | Flutter Engineers | App development |
| **Backend Team** | Node.js Engineers | API, MQTT integration, Database, Automation Engine |
| **Firmware Team** | Embedded Engineers | NodeMCU firmware, OTA updates |
| **QA Team** | Testers | Testing, validation |
| **Product Manager** | PM | Roadmap, prioritization |
| **UX/UI Designer** | Design | User experience, interface |

---

## Risks

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **MQTT Connection Unstable** | Medium | High | Implement auto-reconnect, connection pooling, HiveMQ managed service |
| **Device Control Latency** | Medium | High | Local network priority, optimistic UI updates, retry mechanism |
| **Firmware Bugs** | High | High | OTA update capability, extensive testing, rollback mechanism |
| **Automation Rule Complexity** | Medium | Medium | Simple rule builder, validation, clear error messages |
| **High Battery Consumption** | Medium | High | Optimize MQTT keep-alive, background fetch instead of persistent connection |
| **Data Loss During Offline** | Medium | Medium | Local buffering, sync queue, conflict resolution |
| **InfluxDB Query Performance** | Medium | Medium | Index optimization, data aggregation, caching layer |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **DIY Setup Too Complex** | High | High | Step-by-step guide, video tutorials, pre-flashed firmware option |
| **Hardware Assembly Errors** | Medium | High | Clear wiring diagrams, safety guidelines, verification steps |
| **Inaccurate Cost Calculation** | Medium | High | Multiple tariff templates, manual override, clear disclaimer |
| **Low User Retention** | Medium | High | Push notifications, weekly reports, energy savings dashboard |
| **Automation Creates Frustration** | Medium | High | Easy on/off toggle for automation, undo feature, activity log |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **HiveMQ Free Tier Limits** | Medium | Medium | Monitor usage, upgrade path documented, self-hosted option |
| **Competitor with Free Alternative** | Medium | Medium | Focus on DIY community, energy-centric features, open source |
| **Regulatory (Data Privacy)** | Low | Medium | GDPR compliance, local data storage option |
| **DIY Market Size** | Medium | Medium | Target tech enthusiasts first, then expand |

### Security Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Remote Control Security** | Medium | High | End-to-end encryption, authentication, activity logging |
| **Firmware Security** | Medium | High | Signed firmware updates, secure boot option |
| **Automation Abuse** | Low | Medium | Rate limiting, confirmation for critical actions |

---

## Cost Estimate

### Hardware Cost Comparison

| Item | NodeMCU DIY | Shelly Commercial |
|------|-------------|-------------------|
| **Controller** | ฿100-150 | ฿500-800 |
| **Power Sensor (PZEM-004T)** | ฿200-300 | - (built-in) |
| **Relay Module** | ฿50-100 | - (built-in) |
| **Enclosure & Misc** | ฿50-100 | - |
| **รวมต่อจุด** | **~฿400-650** | **~฿500-800** |

### Infrastructure Cost

| Service | Cost |
|---------|------|
| **HiveMQ Cloud (Free Tier)** | $0 |
| **Backend Server (VPS)** | ~$10-20/month |
| **InfluxDB Cloud (Free)** | $0 |
| **Domain & SSL** | ~$10/year |

### Development Cost

| Phase | Est. Hours |
|-------|------------|
| Phase 1: Foundation | ~80 hours |
| Phase 2: Core Features | ~92 hours |
| Phase 2.5: Device Control | ~48 hours |
| Phase 3: History & Analytics | ~60 hours |
| Phase 3.5: Scheduling | ~40 hours |
| Phase 4: Cost & Budgeting | ~40 hours |
| Phase 5: Automation | ~72 hours |
| Phase 6: Scenes | ~42 hours |
| Phase 7: Alerts & Notifications | ~50 hours |
| Phase 8: Settings & Polish | ~48 hours |
| Phase 9: Testing & QA | ~88 hours |
| Phase 10: Deployment | ~52 hours |
| **Total** | **~712 hours** |

---

## Alternatives Considered

### Alternative 1: Native App (iOS/Android)
**Considered:** Build separate Swift/Kotlin apps
**Decision:** Rejected - Development time 2x, maintenance overhead, harder to iterate
**Rationale:** Flutter provides near-native performance with single codebase

### Alternative 2: Web App Only
**Considered:** Progressive Web App (PWA) without native app
**Decision:** Rejected - Limited push notification capability on iOS, offline limitations
**Rationale:** Real-time monitoring requires reliable background sync and notifications

### Alternative 3: Commercial IoT Platform (ThingsBoard, Grafana)
**Considered:** Use existing platform instead of building custom
**Decision:** Rejected - Customization limitations, subscription costs, vendor lock-in
**Rationale:** Need custom UX focused on smart home control and energy tracking

### Alternative 4: Shelly (Original Plan)
**Considered:** Use Shelly Plug S commercial devices
**Decision:** Changed to NodeMCU DIY approach
**Rationale:** 
- Lower cost per node (~30-50% savings)
- Greater flexibility for custom installations
- Learning opportunity for users
- No vendor lock-in

### Alternative 5: SQLite Only (No InfluxDB)
**Considered:** Use SQLite on device for all data storage
**Decision:** Rejected - No historical data persistence, device loss = data loss
**Rationale:** Time-series database optimized for IoT data, better query performance

### Alternative 6: Firebase Backend
**Considered:** Use Firebase Realtime Database instead of custom backend
**Decision:** Rejected - Limited time-series capabilities, expensive at scale
**Rationale:** Custom backend with InfluxDB better suited for IoT time-series data and automation logic

### Alternative 7: Home Assistant Integration
**Considered:** Build on top of Home Assistant platform
**Decision:** Rejected - Too complex for average users, steep learning curve
**Rationale:** Target users who want simple but powerful solution, not tinkerers

---

## Appendix

### Related Documents
- Technical Architecture: `design.md`
- Detailed Specifications: `specs/`
- Implementation Plan: `tasks.md`
- UI/UX Mockups: `designs/`

### References
- [NodeMCU Documentation](https://nodemcu.readthedocs.io/)
- [PZEM-004T Datasheet](https://innovatorsguru.com/wp-content/uploads/2019/06/PZEM-004T-V3.0-Datasheet-User-Manual.pdf)
- [HiveMQ Cloud Documentation](https://www.hivemq.com/docs/hivemq-cloud/introduction.html)
- [MQTT Protocol Specification](https://mqtt.org/mqtt-specification/)
- [OpenSpec Standard](https://github.com/Fission-AI/OpenSpec)

### Device Compatibility

#### Supported Devices (MVP)
| Device Type | Platform | Components | Features |
|------------|----------|------------|----------|
| Smart Node | NodeMCU ESP8266 | PZEM-004T + Relay | Monitor + Control |
| Smart Node Pro | NodeMCU ESP32 | PZEM-004T + Relay + CT Clamp | Monitor + Control + Multi-circuit |

#### Future Support (Phase 2)
| Device Type | Platform | Status |
|------------|----------|--------|
| Battery Sensor | ESP32 + Deep Sleep | Planned |
| IR Blaster | ESP8266 + IR LED | Under consideration |

### Glossary

| Term | Definition |
|------|------------|
| **Scene** | ชุดคำสั่งที่ทำงานพร้อมกันเมื่อกดปุ่มเดียว |
| **Automation** | กฎที่ทำงานอัตโนมัติตามเงื่อนไขที่ตั้งไว้ |
| **IFTTT** | If This Then That - รูปแบบการสร้าง automation |
| **MQTT** | Message Queuing Telemetry Transport - โปรโตคอลสื่อสาร |
| **Unified Dashboard** | หน้าหลักที่แสดงข้อมูลทั้งหมดในที่เดียว |
| **NodeMCU** | Development board บนพื้นฐาน ESP8266/ESP32 |
| **PZEM-004T** | Power monitoring module สำหรับวัดไฟ AC |
| **OTA** | Over-The-Air firmware update |

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-06 | เจน (System Analyst) | Initial proposal - Monitor only |
| 2.0 | 2025-02-06 | เจน (System Analyst) | Major revision - Smart Home as Core Value |
| 2.1 | 2025-02-06 | เจน (System Analyst) | **Architecture Update:** Shelly → NodeMCU, Self-hosted MQTT → HiveMQ Cloud |
