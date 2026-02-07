# 📋 รายงานสรุปประชุมทีม Dev - โปรเจค HomeSync

**วันที่ประชุม:** 6 กุมภาพันธ์ 2026  
**ผู้เข้าร่วม:** บีม (Mobile Lead), ต้น (Backend), ฟลุ๊ค (DevOps), มิ้นท์ (QA)  
**ผู้จัดทำรายงาน:** Assistant สรุปจากเอกสาร  

---

## 1. สรุปโปรเจค (Project Summary)

### ความเข้าใจร่วมกันของทีม

**HomeSync** คือแอพพลิเคชั่น Smart Home + Energy Monitoring ที่มี Core Value คือ:
1. **Real-time Energy Monitoring** - Monitor การใช้ไฟฟ้า real-time ผ่าน Shelly devices
2. **Smart Device Control** - ควบคุมอุปกรณ์ on/off/dim ได้จากแอพ
3. **Intelligent Automation** - สร้าง IFTTT rules เชื่อมโยงพลังงานกับการควบคุม
4. **Unified Dashboard** - แสดงทั้งข้อมูลพลังงานและ control อุปกรณ์ในหน้าเดียว
5. **Energy-Saving Automation** - Automation ที่ focus การประหยัดพลังงาน

### Key Features ที่ต้องทำ (MVP)
| Feature | Status | ความซับซ้อน |
|---------|--------|-------------|
| Real-time Monitoring (W, V, A, kWh) | In Scope | ปานกลาง |
| Device Control (On/Off) | **NEW** | ปานกลาง |
| Dimming Control | **NEW** | ต่ำ |
| Scheduling (Time-based) | **NEW** | ปานกลาง |
| Automation Rules (IFTTT) | **NEW** | **สูง** |
| Scenes (Multi-device preset) | **NEW** | ปานกลาง |
| Historical Data & Charts | In Scope | ปานกลาง |
| Cost Calculation & Budget | In Scope | ต่ำ |
| Alerts & Notifications | In Scope | ปานกลาง |

### User Personas ที่ต้องรองรับ
1. **The Saver** - คนอยากประหยัดไฟ (Focus: monitoring, budget alerts)
2. **The Tech Enthusiast** - คนชอบบ้านอัจฉริยะ (Focus: automation, scenes)
3. **The Estate Manager** - คนมีบ้านขนาดใหญ่ (Focus: multi-room control)

### คำถามที่ทีมมีต่อ PM
- **Q1:** Automation rules ต้องรองรับกี่ rules ต่อ user? (เอกสารระบุ 100 rules/user ใน MVP)
- **Q2:** Scene ต้องรองรับกี่ scenes ต่อ user?
- **Q3:** Schedule มี limit ไหม? (ทั้ง one-time และ recurring)
- **Q4:** ต้องรองรับ devices สูงสุดกี่ตัวต่อบ้าน?
- **Q5:** Multi-user support (family sharing) เป็น Phase 2 ใช่ไหม?
- **Q6:** มี devices ตัวอย่างให้ทีม test ไหม? (ต้องซื้อ Shelly Plug S กี่ตัว)

---

## 2. Feasibility Assessment (การประเมินความเป็นไปได้)

### 2.1 Mobile (บีม - Flutter)

#### ✅ ทำได้ / Feasible
| Aspect | Assessment | Details |
|--------|------------|---------|
| **BLoC Pattern** | ✅ รองรับดี | ใช้ flutter_bloc จัดการ real-time state ได้ รองรับ stream จาก MQTT |
| **MQTT Client** | ✅ รองรับ | ใช้ `mqtt_client` library รองรับ publish commands สมบูรณ์ |
| **Real-time Updates** | ✅ ทำได้ | Stream-based architecture รองรับการ update UI แบบ real-time |
| **Chart Rendering** | ✅ ทำได้ | fl_chart รองรับ live chart, zoom/pan ได้ |
| **Offline Support** | ✅ ทำได้ | sqflite สำหรับ caching และ sync queue |

#### ⚠️ ข้อกังวล / Concerns
1. **Rule Builder UI** - ต้องใช้ library เพิ่ม (เช่น `flutter_flow_chart` หรือ `graphview`) สำหรับ visual automation builder
2. **Complex State Management** - Automation/Schedule/Scene มี state ซับซ้อน ต้องวาง BLoC structure ดีๆ
3. **Performance** - Chart ที่มี data points มากๆ ต้อง optimize (downsampling)
4. **Testing** - Real-time features ต้องมี integration testing ที่ดี

#### 📊 Estimates
- **Phase 1 (Foundation):** 80 ชม. - 2 สัปดาห์
- **Phase 2 (Core):** 92 ชม. - 2 สัปดาห์
- **Phase 3-6 (Features):** 196 ชม. - 4 สัปดาห์
- **Phase 7-8 (Testing+Deploy):** 124 ชม. - 2 สัปดาห์
- **รวม:** ~492 ชม. (~3 เดือนสำหรับ 1 Flutter dev, ลดลงได้ถ้ามี 2 คน)

---

### 2.2 Backend (ต้น - Node.js)

#### ✅ ทำได้ / Feasible
| Component | Assessment | Details |
|-----------|------------|---------|
| **Architecture** | ✅ รองรับดี | Clean Architecture รองรับ command flow, automation engine ได้ |
| **API Endpoints** | ✅ ชัดเจน | ต้องเพิ่ม endpoints สำหรับ automation, schedule, scene |
| **Database Schema** | ✅ รองรับ | PostgreSQL schema ในเอกสารรองรับ scheduling/automation แล้ว |
| **Automation Engine** | ⚠️ ต้องสร้างใหม่ | ไม่มี library สำเร็จรูปที่พอดี ต้องสร้างเอง |
| **MQTT Integration** | ✅ มีพร้อม | ใช้ `mqtt` library รองรับ pub/sub commands |

#### ⚠️ ข้อกังวล / Concerns
1. **Automation Engine Complexity** - ต้องสร้าง rule evaluation engine เอง รวมถึง:
   - Trigger monitoring (device state, power threshold, time, schedule)
   - Condition evaluation (AND/OR logic)
   - Action execution with cooldown, retry logic
   - Conflict resolution
2. **Schedule Executor** - ต้องใช้ `node-cron` หรือ `Bull Queue` สำหรับ cron jobs
3. **Scene Execution** - ต้อง handle sequential commands, partial failures
4. **Technical Debt Risk** - Automation engine ถ้าออกแบบไม่ดี จะกลายเป็น legacy เร็ว

#### 📊 Backend API Endpoints ที่ต้องเพิ่ม
```
# Automation
POST   /api/v1/automations
GET    /api/v1/automations
PUT    /api/v1/automations/:id
DELETE /api/v1/automations/:id
POST   /api/v1/automations/:id/test
GET    /api/v1/automations/:id/history

# Schedules
POST   /api/v1/schedules
GET    /api/v1/schedules
PUT    /api/v1/schedules/:id
DELETE /api/v1/schedules/:id

# Scenes
POST   /api/v1/scenes
GET    /api/v1/scenes
PUT    /api/v1/scenes/:id
DELETE /api/v1/scenes/:id
POST   /api/v1/scenes/:id/activate

# Commands
POST   /api/v1/devices/:id/command
GET    /api/v1/commands/queue
```

---

### 2.3 DevOps (ฟลุ๊ค)

#### ✅ พร้อม / Ready
| Component | Recommendation | Cost Estimate |
|-----------|----------------|---------------|
| **MQTT Broker** | EMQX (Prod) / Mosquitto (Dev) | EMQX Cloud: ~$20-50/month |
| **Backend Hosting** | AWS ECS / GCP Cloud Run | ~$30-80/month |
| **Database** | RDS PostgreSQL + InfluxDB Cloud | ~$50-150/month |
| **Redis** | ElastiCache / Redis Cloud | ~$20-50/month |
| **CI/CD** | GitHub Actions + Codemagic | ~$0-50/month |

#### ⚠️ ข้อกังวล / Concerns
1. **MQTT Broker Scaling** - ถ้ามีหลายบ้านต่อ MQTT broker ต้อง plan scaling ดีๆ
2. **EMQX vs Mosquitto** - EMQX รองรับ clustering ดีกว่า แต่แพงกว่า
3. **InfluxDB** - Time-series data จะเยอะมาก ต้อง plan retention policy
4. **Security** - MQTT ACL, TLS certificates ต้อง setup รอบคอบ

#### 💰 Cost Estimate (Monthly)
| Environment | Estimated Cost |
|-------------|----------------|
| **Development** | ~$50-100 |
| **Staging** | ~$100-200 |
| **Production** | ~$300-500 (เริ่มต้น) |

---

### 2.4 QA (มิ้นท์)

#### ✅ Test Strategy
| Type | Approach | Tools |
|------|----------|-------|
| **Unit Tests** | BLoC testing, Service testing | flutter_test, jest |
| **Widget Tests** | UI component testing | flutter_test |
| **Integration Tests** | API, MQTT, Database | integration_test, postman |
| **E2E Tests** | Full user flows | Maestro / Appium |

#### ⚠️ ความท้าทายในการทดสอบ
1. **Real-time Features** - ต้อง mock MQTT broker หรือใช้ test broker
2. **Automation Rules** - ต้อง test time-based triggers, รอให้ถึงเวลาจริง
3. **Device Control** - ต้องมี test devices จริง หรือ mock device responses
4. **Offline/Online Sync** - ต้อง test network interruption scenarios

#### 🔧 Test Infrastructure ที่ต้องมี
- Test MQTT Broker (แยกจาก Production)
- Mock Shelly devices (หรือซื้อจริง 3-5 ตัว)
- CI pipeline สำหรับ automated testing

---

## 3. Technical Clarifications (ประเด็นที่ต้องถาม PM เพิ่ม)

### 3.1 Scope & Limitations
| # | Question | Impact |
|---|----------|--------|
| 1 | Automation rules จำกัดกี่ rules ต่อ user? | Affects database design |
| 2 | Scene รองรับกี่ scenes ต่อ user? | Affects local storage |
| 3 | Schedule มี limit ไหม? | Affects cron job scaling |
| 4 | Devices สูงสุดกี่ตัวต่อบ้าน? | Affects MQTT topic management |
| 5 | Multi-user/family sharing เป็น Phase 2 ใช่ไหม? | Affects auth model |

### 3.2 Business Requirements
| # | Question | Impact |
|---|----------|--------|
| 6 | มี SLA สำหรับ automation execution ไหม? (เช่น ต้องทำงานภายใน 10 วิ) | Affects architecture |
| 7 | Scene activation ต้อง atomic ไหม? (ทำทั้งหมดหรือไม่ทำเลย) | Affects implementation |
| 8 | Schedule ถ้า device offline ต้อง retry นานแค่ไหน? | Affects queue design |
| 9 | Automation ถ้า trigger ติดกันมากๆ ต้อง throttle ไหม? | Affects rate limiting |

### 3.3 Hardware & Testing
| # | Question | Impact |
|---|----------|--------|
| 10 | ต้องซื้อ Shelly Plug S กี่ตัวสำหรับ dev/testing? | Budget |
| 11 | มี budget สำหรับ cloud infrastructure ไหม? | Cost planning |
| 12 | ต้อง support devices ยี่ห้ออื่นนอกจาก Shelly ไหม? | Compatibility layer |

---

## 4. Risk & Concerns (ความเสี่ยงที่ทีมเห็น)

### 🔴 High Risk
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Automation Engine Complexity** | High | High | เริ่มจาก simple rules ก่อน, ใช้ library ถ้าได้ |
| **MQTT Connection Stability** | High | High | Auto-reconnect, fallback polling |
| **Device Control Latency** | Medium | High | Optimistic UI, local network priority |

### 🟡 Medium Risk
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Real-time Chart Performance** | Medium | Medium | Data downsampling, lazy loading |
| **Schedule Execution Reliability** | Medium | High | Bull Queue, retry logic |
| **Multi-device Scene Execution** | Medium | Medium | Sequential commands, timeout handling |

### 🟢 Low Risk
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Mobile Battery Consumption** | Medium | Low | Optimize MQTT keep-alive |
| **Cost Calculation Accuracy** | Medium | Medium | Manual override option |

---

## 5. Recommendation (ข้อแนะนำจากทีม)

### ✅ ทีมแนะนำ: **GO** (with adjustments)

โปรเจค HomeSync **ทำได้จริง** และมี market potential ดี แต่ต้องปรับ scope บางส่วน:

### 🔧 Recommended Adjustments
1. **Automation Engine:** เริ่มจาก simple rules ก่อน (IFTTT basic) ไม่ต้อง complex conditions ใน MVP
2. **Schedule:** รองรับ basic recurring (daily, weekdays) ก่อน ไม่ต้อง complex conditions
3. **Scene:** เริ่มจาก instant activation ไม่ต้อง delayed actions ใน MVP
4. **Device Support:** Focus Shelly ก่อน ยี่ห้ออื่น Phase 2

### 📅 Suggested Timeline Adjustment
- **Original:** 11 weeks (492 hours)
- **Recommended:** 12-13 weeks สำหรับทีมขนาดนี้:
  - Flutter: 1-2 คน
  - Backend: 1-2 คน
  - DevOps: 0.5 คน (shared)
  - QA: 1 คน

---

## 6. Action Items (แต่ละคนต้องทำก่อนเริ่ม Sprint 1)

### บีม (Mobile Lead - Flutter)
| # | Task | Due Date |
|---|------|----------|
| 1 | Setup Flutter project structure (Clean Architecture) | ก่อน Sprint 1 |
| 2 | Research `flutter_flow_chart` หรือ library สำหรับ rule builder UI | ก่อน Sprint 1 |
| 3 | สร้าง Design System components ตาม UI spec | Week 1 |
| 4 | Setup MQTT client service + BLoC pattern | Week 1-2 |
| 5 | ทำ POC สำหรับ real-time chart | Week 2 |

### ต้น (Backend Developer)
| # | Task | Due Date |
|---|------|----------|
| 1 | Setup Node.js project + PostgreSQL + InfluxDB | ก่อน Sprint 1 |
| 2 | ออกแบบ Automation Engine architecture (ละเอียด) | ก่อน Sprint 1 |
| 3 | Setup MQTT Bridge service | Week 1 |
| 4 | Implement core API (Auth, Devices, Readings) | Week 1-2 |
| 5 | Research `node-cron` vs `Bull Queue` สำหรับ scheduling | Week 2 |

### ฟลุ๊ค (DevOps)
| # | Task | Due Date |
|---|------|----------|
| 1 | Setup development environment (Docker Compose) | ก่อน Sprint 1 |
| 2 | Setup Git repository + CI/CD pipeline (GitHub Actions) | ก่อน Sprint 1 |
| 3 | Setup MQTT Broker (Mosquitto) สำหรับ dev | Week 1 |
| 4 | ประเมิน cost ละเอียดสำหรับ staging/production | Week 2 |
| 5 | Setup monitoring stack (Grafana/Prometheus) | Week 3 |

### มิ้นท์ (QA)
| # | Task | Due Date |
|---|------|----------|
| 1 | เขียน Test Plan สำหรับ real-time features | ก่อน Sprint 1 |
| 2 | Research test automation tools (Maestro/Appium) | ก่อน Sprint 1 |
| 3 | Setup test MQTT broker | Week 1 |
| 4 | เขียน Test Cases สำหรับ Phase 1 | Week 1-2 |
| 5 | จัดซื้อ Shelly Plug S สำหรับ testing (จำนวนตามที่ตกลง) | Week 2 |

### PM (กุ้ง)
| # | Task | Due Date |
|---|------|----------|
| 1 | ตอบคำถาม Technical Clarifications ข้างต้น | ASAP |
| 2 | ยืนยัน budget สำหรับ infrastructure | Week 1 |
| 3 | ยืนยัน budget สำหรับ Shelly devices (test) | Week 1 |
| 4 | จัดประชุมรีวิว architecture กับทีม | Week 2 |

---

## 7. Hardware Requirements (ที่ต้องซื้อ)

### สำหรับ Development & Testing
| Item | Quantity | Est. Cost (THB) | Note |
|------|----------|-----------------|------|
| Shelly Plug S | 5-8 ตัว | ~6,000-10,000 | Test devices |
| WiFi Router (แยกสำหรับ dev) | 1 | ~2,000 | Isolate test network |
| Raspberry Pi (สำหรับ test MQTT) | 1-2 | ~3,000 | Local broker testing |
| **รวม** | | **~11,000-15,000** | |

---

## 8. Infrastructure ที่ต้อง Setup ก่อนเริ่ม

### Development Environment
- [ ] Docker Compose with: PostgreSQL, InfluxDB, Redis, Mosquitto
- [ ] Git repository with branch protection
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Test MQTT Broker

### Staging Environment
- [ ] AWS/GCP account
- [ ] EMQX or Mosquitto broker
- [ ] RDS PostgreSQL
- [ ] InfluxDB Cloud
- [ ] Redis ElastiCache

---

## สรุป

โปรเจค HomeSync เป็นโปรเจคที่ท้าทายแต่ทำได้จริง ทีมมีความพร้อมในการพัฒนา แต่ต้องระวังความซับซ้อนของ Automation Engine และ Schedule System เป็นพิเศษ

**คำแนะนำหลัก:**
1. เริ่มจาก MVP scope ที่ชัดเจน
2. ทำ POC สำหรับ automation engine ก่อน
3. มี test devices พร้อมตั้งแต่ต้น
4. วาง architecture ให้รองรับ scaling ในอนาคต

**พร้อมเริ่ม Sprint 1 เมื่อ:**
- ได้คำตอบ Technical Clarifications จาก PM
- Setup development environment เสร็จ
- มี Shelly devices พร้อมใช้งาน

---

*รายงานจัดทำโดย: Assistant*  
*วันที่: 6 กุมภาพันธ์ 2026*
