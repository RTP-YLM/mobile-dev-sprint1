# 📱 Sprint 1 Plan - Mobile Development Project

---

## 1. วิเคราะห์ Requirement และ Scope

### 🎯 Sprint 1 Goal
> "Establish solid technical foundation and deliver core authentication flow with basic app infrastructure"

### 📋 Scope Overview
Sprint 1 เน้นการสร้าง **Foundation & Core Features** ประกอบด้วย:

| หมวดหมู่ | Scope |
|---------|-------|
| **Infrastructure** | Project setup, CI/CD pipeline, Development environment |
| **Backend Core** | API Gateway, Authentication service, Database schema |
| **Mobile Core** | App architecture, Navigation, Authentication UI |
| **DevOps** | CI/CD, Environment setup, Monitoring basics |
| **QA Setup** | Test framework, Test cases for Sprint 1 features |

### 🚫 Out of Scope (Sprint 1)
- Payment integration
- Push notification
- Advanced analytics
- Social media features
- Admin dashboard

### 📝 Assumptions
- ทีมมี 2 weeks (10 working days)
- Tech Stack: iOS (Swift/SwiftUI), Backend (Node.js/Go + PostgreSQL), AWS/GCP
- App type: Consumer-facing mobile app (e.g., E-commerce, Fintech, or Lifestyle)

---

## 2. Sprint Backlog

### Epic 1: Infrastructure & Project Setup

| ID | User Story | Priority | Status |
|----|-----------|----------|--------|
| SP1-001 | 作为开发者，我希望有标准化的项目结构，以便团队协作高效 | Must Have | To Do |
| SP1-002 | 作为开发者，我希望有本地开发环境一键启动，以便快速开始开发 | Must Have | To Do |
| SP1-003 | 作为团队，我们希望有代码规范和 linting 规则，以保持代码质量 | Should Have | To Do |

### Epic 2: Backend Foundation

| ID | User Story | Priority | Status |
|----|-----------|----------|--------|
| SP1-004 | 作为用户，我希望可以注册账号，以便使用应用 | Must Have | To Do |
| SP1-005 | 作为用户，我希望可以登录和登出，以便访问我的账户 | Must Have | To Do |
| SP1-006 | 作为后端，我希望有 API 文档自动生成，以便前端对接 | Must Have | To Do |
| SP1-007 | 作为系统，我希望有数据库迁移系统，以便管理 schema 变更 | Must Have | To Do |

### Epic 3: Mobile App Foundation

| ID | User Story | Priority | Status |
|----|-----------|----------|--------|
| SP1-008 | 作为用户，我希望看到精美的启动页和引导页，以便了解应用 | Must Have | To Do |
| SP1-009 | 作为用户，我希望有注册界面，以便创建新账户 | Must Have | To Do |
| SP1-010 | 作为用户，我希望有登录界面，以便访问我的账户 | Must Have | To Do |
| SP1-011 | 作为用户，我希望有主页框架和底部导航栏，以便浏览应用 | Should Have | To Do |

### Epic 4: DevOps & CI/CD

| ID | User Story | Priority | Status |
|----|-----------|----------|--------|
| SP1-012 | 作为团队，我们希望有 CI/CD pipeline，以便自动测试和部署 | Must Have | To Do |
| SP1-013 | 作为开发者，我希望有 staging 环境，以便测试功能 | Must Have | To Do |

### Epic 5: QA & Testing

| ID | User Story | Priority | Status |
|----|-----------|----------|--------|
| SP1-014 | 作为 QA，我希望有测试计划和测试用例，以便验证功能 | Must Have | To Do |
| SP1-015 | 作为开发者，我希望有单元测试框架，以便保证代码质量 | Should Have | To Do |

---

## 3. Acceptance Criteria

### 🔧 Infrastructure Tasks

#### SP1-001: 项目结构标准化
**Acceptance Criteria:**
- [ ] มี Git repository บน GitHub/GitLab พร้อม branch protection rules
- [ ] มี folder structure ที่ชัดเจน (docs/, src/, tests/, scripts/)
- [ ] มี README.md ที่อธิบายการ setup project
- [ ] มี .gitignore ที่ครอบคลุมสำหรับ iOS และ Backend
- [ ] มี Pull Request template

#### SP1-002: 本地开发环境
**Acceptance Criteria:**
- [ ] มี Docker Compose สำหรับ run database และ dependencies
- [ ] มี script สำหรับ setup สภาพแวดล้อม (setup.sh หรือ Makefile)
- [ ] สามารถ run ทั้ง iOS app และ Backend ใน local ได้ภายใน 5 นาที
- [ ] มี environment file template (.env.example)

#### SP1-003: 代码规范
**Acceptance Criteria:**
- [ ] มี SwiftLint config สำหรับ iOS
- [ ] มี ESLint/Prettier config สำหรับ Backend
- [ ] มี pre-commit hooks
- [ ] Code coverage reporting setup

---

### ⚙️ Backend Tasks

#### SP1-004: 用户注册 API
**Acceptance Criteria:**
- [ ] POST /api/v1/auth/register endpoint ทำงานได้
- [ ] Validate email format และ password strength
- [ ] Hash password ก่อนเก็บ (bcrypt/argon2)
- [ ] ส่ง verification email (optional for Sprint 1 - can be mock)
- [ ] คืน JWT token หลัง register สำเร็จ
- [ ] Unit test coverage >= 80%

**API Spec:**
```json
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response 201:
{
  "userId": "uuid",
  "email": "user@example.com",
  "token": "jwt_token",
  "expiresIn": 3600
}
```

#### SP1-005: 登录/登出 API
**Acceptance Criteria:**
- [ ] POST /api/v1/auth/login endpoint ทำงานได้
- [ ] POST /api/v1/auth/logout endpoint ทำงานได้
- [ ] Validate credentials และคืน JWT token
- [ ] Handle wrong password (max 5 attempts)
- [ ] Token expiration handling
- [ ] Unit test coverage >= 80%

**API Spec:**
```json
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "userId": "uuid",
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": 3600
}
```

#### SP1-006: API 文档
**Acceptance Criteria:**
- [ ] ใช้ Swagger/OpenAPI 3.0
- [ ] มี documentation สำหรับทุก endpoint
- [ ] สามารถ test API ผ่าน Swagger UI ได้
- [ ] มี example requests/responses

#### SP1-007: Database Migration
**Acceptance Criteria:**
- [ ] ใช้ migration tool (e.g., golang-migrate, Sequelize, Prisma)
- [ ] มี initial schema สำหรับ users table
- [ ] มี migration script สำหรับ CI/CD
- [ ] มี rollback strategy

**Schema (Users Table):**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);
```

---

### 📱 Mobile Tasks

#### SP1-008: 启动页和引导页
**Acceptance Criteria:**
- [ ] มี Launch Screen (LaunchScreen.storyboard)
- [ ] มี Onboarding flow (2-3 หน้า)
- [ ] มี skip onboarding option
- [ ] เก็บ state ว่า user เคยดู onboarding แล้ว
- [ ] รองรับ Light/Dark mode
- [ ] มี animation ที่ smooth

#### SP1-009: 注册界面
**Acceptance Criteria:**
- [ ] มี Register screen พร้อม form (email, password, confirm password, name)
- [ ] Real-time validation (email format, password strength)
- [ ] Show/Hide password toggle
- [ ] Loading state ขณะส่ง request
- [ ] Error handling แสดงข้อความที่เข้าใจง่าย
- [ ] Navigate ไป login หลัง register สำเร็จ
- [ ] Accessibility labels ครบถ้วน

**UI Checklist:**
- [ ] Text fields มี proper padding
- [ ] Keyboard handling (dismiss on tap outside)
- [ ] Scroll view สำหรับ small screens

#### SP1-010: 登录界面
**Acceptance Criteria:**
- [ ] มี Login screen พร้อม form (email, password)
- [ ] "Remember me" checkbox
- [ ] "Forgot password?" link (mock หรือ navigate ไป placeholder)
- [ ] Biometric authentication (Face ID/Touch ID) option
- [ ] Loading state ขณะ login
- [ ] Error handling (wrong credentials, network error)
- [ ] Navigate ไป Home หลัง login สำเร็จ
- [ ] Secure storage สำหรับ token (Keychain)

#### SP1-011: 主页框架
**Acceptance Criteria:**
- [ ] มี TabBarController ด้วย 3-5 tabs
- [ ] มี placeholder screens สำหรับแต่ละ tab
- [ ] Tab icons และ labels
- [ ] Tab selection animation
- [ ] Profile tab แสดง user info (mock หรือจาก API)

**Tab Structure (Example):**
```
┌─────────────────────────────────────┐
│  🏠 Home   🔍 Search   👤 Profile  │
└─────────────────────────────────────┘
```

---

### 🚀 DevOps Tasks

#### SP1-012: CI/CD Pipeline
**Acceptance Criteria:**
- [ ] GitHub Actions/GitLab CI สำหรับ Backend:
  - [ ] Run tests on every PR
  - [ ] Lint checks
  - [ ] Build Docker image
  - [ ] Deploy to staging on merge
- [ ] Fastlane setup สำหรับ iOS:
  - [ ] Build automation
  - [ ] TestFlight deployment (optional)
- [ ] Pipeline status notifications (Slack/Discord)

#### SP1-013: Staging Environment
**Acceptance Criteria:**
- [ ] Staging API deployed บน cloud (AWS/GCP/Azure)
- [ ] Staging database (separate from production)
- [ ] Environment variables แยกตาม environment
- [ ] SSL/TLS enabled
- [ ] Basic monitoring/logging setup

---

### 🧪 QA Tasks

#### SP1-014: 测试计划与用例
**Acceptance Criteria:**
- [ ] มี Test Plan สำหรับ Sprint 1
- [ ] มี Test Cases ครอบคลุม:
  - [ ] Registration (positive/negative cases)
  - [ ] Login (positive/negative cases)
  - [ ] UI/UX testing (onboarding, navigation)
  - [ ] API testing
- [ ] มี Bug report template

#### SP1-015: 单元测试框架
**Acceptance Criteria:**
- [ ] XCTest setup สำหรับ iOS พร้อม sample tests
- [ ] Backend unit test framework setup
- [ ] Code coverage reporting ใน CI
- [ ] มี test examples ที่ team สามารถ follow ได้

---

## 4. Effort Estimation

### Story Points Scale
- **1 SP** = 2-4 hours (Simple, well-understood task)
- **2 SP** = 4-8 hours (Small task, minor complexity)
- **3 SP** = 1-1.5 days (Medium complexity)
- **5 SP** = 2-3 days (Complex, needs research)
- **8 SP** = 4-5 days (Very complex, high uncertainty)

### Backlog with Estimation

| ID | Task | Story Points | Estimated Hours |
|----|------|--------------|-----------------|
| **Epic 1: Infrastructure** | | | |
| SP1-001 | Project structure setup | 2 SP | 6 hours |
| SP1-002 | Local dev environment | 3 SP | 12 hours |
| SP1-003 | Code standards & linting | 2 SP | 6 hours |
| **Epic 2: Backend** | | | |
| SP1-004 | User registration API | 3 SP | 12 hours |
| SP1-005 | Login/logout API | 3 SP | 10 hours |
| SP1-006 | API documentation | 2 SP | 6 hours |
| SP1-007 | Database migrations | 2 SP | 6 hours |
| **Epic 3: Mobile** | | | |
| SP1-008 | Launch & onboarding screens | 3 SP | 12 hours |
| SP1-009 | Registration UI | 5 SP | 16 hours |
| SP1-010 | Login UI | 5 SP | 16 hours |
| SP1-011 | Home framework & navigation | 3 SP | 10 hours |
| **Epic 4: DevOps** | | | |
| SP1-012 | CI/CD pipeline | 5 SP | 16 hours |
| SP1-013 | Staging environment | 3 SP | 12 hours |
| **Epic 5: QA** | | | |
| SP1-014 | Test plan & cases | 3 SP | 12 hours |
| SP1-015 | Test framework setup | 2 SP | 8 hours |

### Summary
| Category | Tasks | Total SP | Total Hours |
|----------|-------|----------|-------------|
| Infrastructure | 3 | 7 SP | 24 hours |
| Backend | 4 | 10 SP | 34 hours |
| Mobile | 4 | 16 SP | 54 hours |
| DevOps | 2 | 8 SP | 28 hours |
| QA | 2 | 5 SP | 20 hours |
| **TOTAL** | **15** | **46 SP** | **160 hours** |

### Sprint Capacity Analysis
- **Team size:** 6 people
- **Sprint duration:** 10 working days
- **Available capacity:** 6 × 10 × 6 hours = 360 hours (assuming 6 productive hours/day)
- **Buffer:** 360 - 160 = 200 hours (55% buffer for meetings, reviews, bugs)

**✅ Feasible for Sprint 1**

---

## 5. Task Assignment Recommendation

### 👥 Team Members & Responsibilities

| สมาชิก | บทบาท | จุดแข็ง |
|--------|-------|---------|
| เจน | SA | Architecture, Requirements, Documentation |
| ต้น | Backend | API Development, Database, Performance |
| บีม | Mobile Lead | Architecture, Code Review, iOS Expert |
| ปัน | iOS Native | UI Implementation, Swift/SwiftUI |
| ฟลุ๊ค | DevOps | CI/CD, Infrastructure, Cloud |
| มิ้นท์ | QA | Testing, Quality Gates, Bug Tracking |

### 📋 Task Distribution

#### 🎯 เจน (SA) - 30 hours
| Task | SP | Hours | Notes |
|------|----|-------|-------|
| SP1-001: Project structure | 2 | 6 | Setup repo, templates |
| SP1-003: Code standards | 1 | 4 | Review standards |
| SP1-006: API documentation | 1 | 4 | Document specs |
| SP1-014: Test plan & cases | 3 | 12 | Write test cases |
| **Support tasks** | - | 4 | Daily support |

#### 🎯 ต้น (Backend) - 40 hours
| Task | SP | Hours | Notes |
|------|----|-------|-------|
| SP1-002: Dev environment | 1 | 4 | Backend part |
| SP1-004: Registration API | 3 | 12 | Core feature |
| SP1-005: Login/logout API | 3 | 10 | Core feature |
| SP1-007: DB migrations | 2 | 6 | Schema management |
| SP1-015: Test framework | 1 | 4 | Backend tests |
| **Buffer/Refinement** | - | 4 | Bug fixes |

#### 🎯 บีม (Mobile Lead) - 40 hours
| Task | SP | Hours | Notes |
|------|----|-------|-------|
| SP1-001: Project structure | - | 4 | iOS project setup |
| SP1-002: Dev environment | 1 | 4 | iOS part |
| SP1-008: Launch/onboarding | 1 | 6 | Architecture review |
| SP1-011: Home framework | 3 | 10 | Navigation setup |
| **Code Reviews** | - | 8 | Review ปัน's code |
| **Architecture decisions** | - | 8 | Technical decisions |

#### 🎯 ปัน (iOS Native) - 46 hours
| Task | SP | Hours | Notes |
|------|----|-------|-------|
| SP1-008: Launch/onboarding | 2 | 6 | UI implementation |
| SP1-009: Registration UI | 5 | 16 | Complex form |
| SP1-010: Login UI | 5 | 16 | Complex form |
| SP1-015: Test framework | 1 | 4 | iOS tests |
| **Bug fixes** | - | 4 | Post-implementation |

#### 🎯 ฟลุ๊ค (DevOps) - 40 hours
| Task | SP | Hours | Notes |
|------|----|-------|-------|
| SP1-012: CI/CD pipeline | 5 | 16 | Full setup |
| SP1-013: Staging environment | 3 | 12 | Cloud setup |
| SP1-002: Dev environment | 1 | 4 | Docker setup |
| **Monitoring setup** | - | 4 | Basic monitoring |
| **Documentation** | - | 4 | DevOps docs |

#### 🎯 มิ้นท์ (QA) - 26 hours
| Task | SP | Hours | Notes |
|------|----|-------|-------|
| SP1-014: Test plan & cases | 3 | 12 | Full coverage |
| SP1-015: Test framework | 1 | 4 | Coordination |
| **Test execution** | - | 6 | Manual testing |
| **Bug tracking setup** | - | 4 | Jira/Linear setup |

### 🔄 Daily Collaboration Flow

```
Daily Standup (15 min)
├── ปัน update UI progress
├── ต้น update API progress
├── ฟลุ๊ค update infra progress
├── มิ้นท์ update testing status
├── บีม share architecture decisions
└── เจน clarify requirements

Mid-Sprint Review (Day 5)
├── Backend API demo
├── Mobile UI demo
├── Integration test
└── Scope adjustment

Sprint Review (Day 10)
├── Feature demo
├── Acceptance testing
├── Retrospective
└── Sprint 2 planning
```

### 🚨 Risk Mitigation

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| API delay | High | Backend starts first, use mock data | ต้น, บีม |
| iOS complexity | Medium | บีม pair with ปัน on complex tasks | บีม |
| CI/CD issues | Medium | ฟลุ๊ค starts from day 1 | ฟลุ๊ค |
| Requirements change | Medium | Daily sync with เจน | เจน |
| Testing bottleneck | Low | มิ้นท์ involved from start | มิ้นท์ |

---

## 6. Definition of Done

### ✅ For All Tasks
- [ ] Code complete and reviewed
- [ ] Unit tests passing (min 70% coverage)
- [ ] No critical/major bugs
- [ ] Documentation updated
- [ ] Peer reviewed

### ✅ For Features (User Stories)
- [ ] Acceptance criteria met
- [ ] QA tested and approved
- [ ] UI matches design (if available)
- [ ] Works on target devices
- [ ] Performance acceptable

### ✅ For Sprint 1 Complete
- [ ] All Must Have items done
- [ ] Demo-ready build
- [ ] Documentation complete
- [ ] Team retrospective done

---

## 7. Sprint 1 Timeline

| Day | Focus | Key Activities |
|-----|-------|----------------|
| Day 1 | Kickoff & Setup | Sprint planning, environment setup |
| Day 2 | Foundation | Repo setup, architecture decisions |
| Day 3 | Backend Core | API development starts |
| Day 4 | Mobile Core | UI development starts |
| Day 5 | Mid-Sprint | Review progress, adjust scope |
| Day 6 | Integration | Connect frontend-backend |
| Day 7 | Testing | QA testing, bug fixes |
| Day 8 | Polish | UI polish, edge cases |
| Day 9 | Final QA | Regression testing |
| Day 10 | Review & Retro | Sprint demo, retrospective |

---

## 📊 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sprint Velocity | 40+ SP | Actual completed SP |
| Bug Count | <10 critical | QA tracking |
| Code Coverage | >70% | CI reports |
| API Uptime | 99% | Monitoring |
| Team Satisfaction | >8/10 | Retro survey |

---

*Generated for Sprint 1 Planning*  
*Last Updated: 2026-02-07*
