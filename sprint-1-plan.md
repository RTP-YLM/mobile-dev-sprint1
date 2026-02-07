# Sprint 1 Plan - Mobile Development Project

## 📋 ข้อมูลทีม

| บทบาท | ชื่อ | ความรับผิดชอบหลัก |
|-------|------|------------------|
| SA | เจน | Requirement Analysis, User Stories |
| Backend | ต้น | API Development, Database |
| Mobile Lead | บีม | Architecture, Code Review, Coordination |
| iOS Native | ปัน | iOS App Development |
| DevOps | ฟลุ๊ค | CI/CD, Environment Setup |
| QA | มิ้นท์ | Testing, Quality Assurance |

---

## 1️⃣ Sprint 1: Requirements & Scope Analysis

### Sprint Goal
> **"สร้างรากฐานระบบและส่งมอบ Feature สำคัญสำหรับ MVP พร้อมใช้งานจริง"**

### Scope (2 Weeks Sprint)
- **Theme:** Foundation & Core Authentication
- **Focus Areas:**
  - Infrastructure & Environment Setup
  - User Authentication System
  - Project Architecture & Standards
  - Basic App Structure

### Key Deliverables
1. ระบบ Login/Register ทำงานได้ครบถ้วน
2. API Authentication ด้วย JWT
3. Mobile App Foundation (iOS)
4. CI/CD Pipeline สำหรับทั้ง Backend และ Mobile
5. Test Automation Framework เริ่มต้น

---

## 2️⃣ Sprint Backlog

### 🔴 Epic: Infrastructure & Setup

| ID | User Story | Priority | Story Points |
|----|-----------|----------|--------------|
| S1-001 | ในฐานะ DevOps ฉันต้องการ Setup CI/CD Pipeline เพื่อให้การ Deploy เป็นระบบอัตโนมัติ | High | 5 |
| S1-002 | ในฐานะ Mobile Lead ฉันต้องการกำหนด Code Standards และ Project Architecture เพื่อให้ทีมพัฒนาอย่างเป็นระบบ | High | 3 |
| S1-003 | ในฐานะ Backend ฉันต้องการ Setup Development Environment และ Database เพื่อเริ่มพัฒนา API | High | 3 |

### 🔵 Epic: Authentication System

| ID | User Story | Priority | Story Points |
|----|-----------|----------|--------------|
| S1-004 | ในฐานะ User ฉันต้องการ Register ด้วย Email/Password เพื่อสร้างบัญชีใหม่ | High | 5 |
| S1-005 | ในฐานะ User ฉันต้องการ Login ด้วย Email/Password เพื่อเข้าใช้งานแอป | High | 5 |
| S1-006 | ในฐานะ User ฉันต้องการฟีเจอร์ Forgot Password เพื่อกู้คืนรหัสผ่าน | Medium | 3 |
| S1-007 | ในฐานะ User ฉันต้องการ Login ด้วย Social Account (Google/Apple) เพื่อความสะดวก | Medium | 5 |

### 🟢 Epic: Mobile App Foundation

| ID | User Story | Priority | Story Points |
|----|-----------|----------|--------------|
| S1-008 | ในฐานะ User ฉันต้องการเห็น Splash Screen และ Onboarding เมื่อเปิดแอปครั้งแรก | Medium | 3 |
| S1-009 | ในฐานะ User ฉันต้องการ Navigation ที่ชัดเจนเพื่อใช้งานแอปได้ง่าย | High | 3 |
| S1-010 | ในฐานะ User ฉันต้องการเห็น Home Screen หลังจาก Login สำเร็จ | High | 3 |

### 🟡 Epic: QA & Testing

| ID | User Story | Priority | Story Points |
|----|-----------|----------|--------------|
| S1-011 | ในฐานะ QA ฉันต้องการ Test Cases สำหรับ Authentication Flows | High | 3 |
| S1-012 | ในฐานะ QA ฉันต้องการ Automated Test Framework พื้นฐาน | Medium | 5 |

---

## 📊 Sprint Metrics

| Metric | Value |
|--------|-------|
| **Total Story Points** | 43 |
| **Sprint Duration** | 10 วันทำการ (2 สัปดาห์) |
| **Team Velocity Target** | ~40-45 SP/Sprint |
| **Buffer** | ~10% |

---

## 3️⃣ Acceptance Criteria

### S1-001: CI/CD Pipeline Setup
```
✅ GitHub/GitLab CI pipeline ทำงานได้ทั้ง Backend และ Mobile
✅ Automated build ทุกครั้งที่มี PR
✅ Automated unit test execution
✅ Deployment to Staging environment อัตโนมัติ
✅ Notification to Slack/Teams เมื่อ build ล้มเหลว
```

### S1-002: Code Standards & Architecture
```
✅ เอกสาร Architecture Decision Records (ADR) ครบถ้วน
✅ Coding standards document (Swift/Kotlin) อัปเดต
✅ Git branching strategy (GitFlow/GitHub Flow) กำหนดแล้ว
✅ Code review checklist สร้างแล้ว
✅ Folder structure convention กำหนดแล้ว
```

### S1-003: Backend Environment Setup
```
✅ Development/Staging/Production environments พร้อมใช้
✅ Database schema migration system ตั้งค่าแล้ว
✅ Environment variables management ปลอดภัย
✅ API documentation setup (Swagger/OpenAPI)
✅ Health check endpoint ทำงานได้
```

### S1-004: User Registration (Backend)
```
✅ POST /api/auth/register รับ email, password, name
✅ Email validation format ถูกต้อง
✅ Password requirements enforced (min 8 chars, 1 uppercase, 1 number)
✅ Duplicate email check ทำงานได้
✅ User created in database สำเร็จ
✅ Verification email sent (optional for MVP)
✅ Response 200 with user data (excluding password)
```

### S1-005: User Login (Backend)
```
✅ POST /api/auth/login รับ email, password
✅ Valid credentials return JWT access token + refresh token
✅ Invalid credentials return 401 Unauthorized
✅ Token contains user_id, email, role
✅ Token expires in 1 hour (access), 7 days (refresh)
```

### S1-006: Forgot Password
```
✅ POST /api/auth/forgot-password รับ email
✅ Reset token generated and stored (valid 1 hour)
✅ Reset email sent with secure link
✅ POST /api/auth/reset-password รับ token + new password
✅ Token validation works correctly
✅ Password updated successfully
```

### S1-007: Social Login
```
✅ Google OAuth integration ทำงานได้
✅ Apple Sign-In integration ทำงานได้ (iOS requirement)
✅ New user auto-registered on first login
✅ Existing user linked to social account
✅ JWT tokens returned same as email login
```

### S1-008: Splash Screen & Onboarding
```
✅ Splash screen display 2-3 seconds
✅ App logo และ branding แสดงถูกต้อง
✅ Onboarding screens (3-4 slides) สำหรับ first-time user
✅ Skip option สำหรับ onboarding
✅ Smooth transitions between screens
```

### S1-009: Navigation Structure
```
✅ Tab-based navigation (if applicable) หรือ Drawer navigation
✅ Navigation between Auth screens ลื่นไหล
✅ Back button behavior ถูกต้อง
✅ Deep linking structure รองรับ
```

### S1-010: Home Screen
```
✅ Display หลัง login สำเร็จ
✅ User greeting with name
✅ Logout button ทำงานได้
✅ Pull-to-refresh mechanism มี
✅ Empty state / Loading state รองรับ
```

### S1-011: Test Cases for Auth
```
✅ Test cases ครอบคลุม happy path และ edge cases
✅ Test data prepared
✅ Regression test suite สำหรับ auth flows
✅ Bug reporting template กำหนดแล้ว
```

### S1-012: Automated Test Framework
```
✅ Unit test framework setup (XCTest for iOS)
✅ Integration test setup
✅ Minimum 80% code coverage สำหรับ auth module
✅ Test automation in CI pipeline
```

---

## 4️⃣ Effort Estimation

### Story Points Reference
| Points | Effort | Description |
|--------|--------|-------------|
| 1 | XS | < 2 hours, very simple |
| 2 | S | 2-4 hours, straightforward |
| 3 | M | 4-8 hours, moderate complexity |
| 5 | L | 1-2 days, complex |
| 8 | XL | 2-3 days, very complex |

### Task Breakdown by Hours

| Task | Story Points | Est. Hours | Role |
|------|--------------|------------|------|
| S1-001 CI/CD Pipeline | 5 | 16h | ฟลุ๊ค |
| S1-002 Code Standards | 3 | 8h | บีม |
| S1-003 Backend Environment | 3 | 10h | ต้น |
| S1-004 User Registration API | 5 | 12h | ต้น |
| S1-005 User Login API | 5 | 10h | ต้น |
| S1-006 Forgot Password API | 3 | 8h | ต้น |
| S1-007 Social Login API | 5 | 14h | ต้น |
| S1-008 Splash & Onboarding | 3 | 10h | ปัน |
| S1-009 Navigation | 3 | 8h | ปัน |
| S1-010 Home Screen | 3 | 10h | ปัน |
| S1-011 Test Cases | 3 | 8h | มิ้นท์ |
| S1-012 Test Framework | 5 | 12h | บีม, มิ้นท์ |
| **Total** | **43** | **~126h** | |

---

## 5️⃣ การ分配งานให้ทีม

### 📅 Sprint Timeline (10 วันทำการ)

```
Week 1:
Day 1-2:   Planning + Setup
Day 3-5:   Development Phase 1

Week 2:
Day 6-8:   Development Phase 2 + Integration
Day 9:     Testing & Bug Fixes
Day 10:    Sprint Review & Retrospective
```

### 👥 การ分配งานรายบุคคล

#### เจน (SA) - Support Role
- **Responsibilities:**
  - Review และ refine user stories ทุกวัน
  - Clarify requirements ให้ทีม development
  - Prepare sprint documentation
  - Attend daily standups
- **Workload:** ~20% allocation (supporting)

#### ต้น (Backend Developer)
| Day | Task | Output |
|-----|------|--------|
| 1-2 | S1-003: Environment Setup | Dev/Staging env ready |
| 3-4 | S1-004: Register API | POST /auth/register |
| 5 | S1-005: Login API | POST /auth/login |
| 6-7 | S1-006: Forgot Password | Reset password flow |
| 8-9 | S1-007: Social Login | Google/Apple OAuth |
| 10 | Bug fixes & Documentation | API docs updated |
- **Total:** ~62 hours (ให้สมดุลใน sprint จริง ~40h)
- **Note:** Social Login อาจ move ไป Sprint 2 ถ้าเวลาไม่พอ

#### บีม (Mobile Lead)
| Day | Task | Output |
|-----|------|--------|
| 1 | S1-002: Architecture Design | ADR document |
| 1-2 | Project scaffolding | Base project structure |
| 3-10 | Code reviews + Pair programming | Quality assurance |
| 7-9 | S1-012: Test Framework | Unit test setup |
- **Total:** ~30% coding, 70% coordination & review

#### ปัน (iOS Native Developer)
| Day | Task | Output |
|-----|------|--------|
| 1-2 | Setup iOS project with บีม | Project initialized |
| 3-4 | S1-008: Splash & Onboarding | UI Screens |
| 5-6 | S1-009: Navigation | Navigation flow |
| 7-8 | S1-010: Home Screen | Home UI + Integration |
| 9-10 | Integrate APIs + Bug fixes | Full auth flow |
- **Total:** ~40 hours
- **Dependencies:** ต้องรอ API จากต้น วันที่ 5

#### ฟลุ๊ค (DevOps)
| Day | Task | Output |
|-----|------|--------|
| 1-3 | S1-001: CI/CD Pipeline | Pipeline running |
| 4-5 | Monitoring setup | Logs & alerts |
| 6-10 | Support deployment | Stable environments |
- **Total:** ~20 hours
- **Note:** Available 50% ใน sprint นี้, อีก 50% ทำ infrastructure อื่น

#### มิ้นท์ (QA)
| Day | Task | Output |
|-----|------|--------|
| 1-2 | S1-011: Test Cases | Test case document |
| 3-5 | Test environment setup | QA env ready |
| 6-8 | Manual testing | Bug reports |
| 9 | Regression testing | Test report |
| 10 | Sprint review prep | Demo notes |
- **Total:** ~25 hours
- **Note:** Start testing ได้ตั้งแต่วัน 6 (เมื่อมี build แรก)

---

## 📋 Sprint Board (Kanban Style)

### To Do
- [ ] S1-007 Social Login (สำรอง - อาจย้ายไป Sprint 2)

### In Progress
- [ ] S1-001 CI/CD Pipeline (ฟลุ๊ค)
- [ ] S1-003 Backend Environment (ต้น)

### Code Review
- [ ] S1-002 Code Standards (บีม)

### Testing
- [ ] S1-011 Test Cases (มิ้นท์)

### Done
- [ ] Sprint Planning
- [ ] Team onboarding

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Social Login integration ซับซ้อนกว่าคาด | Medium | Medium | มี fallback plan: move to Sprint 2 |
| iOS Developer (ปัน) ไม่มีประสบการณ์กับ OAuth | Low | Medium | บีม pair programming วันแรก |
| API จาก Backend ล่าช้า | High | Low | ใช้ Mock API สำหรับ Mobile dev ช่วงแรก |
| CI/CD configuration issues | Medium | Medium | ฟลุ๊ค start first, buffer time 2 วัน |

---

## 🎯 Sprint 1 Success Criteria

```
✅ All High priority stories completed
✅ Authentication flow end-to-end working
✅ CI/CD pipeline operational
✅ Zero critical bugs
✅ Team velocity baseline established
✅ Sprint retrospective completed
```

---

## 📝 Notes for Next Sprint

1. **Sprint 2 Candidates:**
   - User Profile Management
   - Push Notifications
   - Biometric Authentication (Face ID/Touch ID)
   - Offline Support foundation

2. **Technical Debt to Address:**
   - API response caching
   - Error handling standardization
   - Analytics integration

---

*สร้างเมื่อ: 2026-02-07*  
*Sprint Duration: 2 Weeks*  
*Total Story Points: 43*
