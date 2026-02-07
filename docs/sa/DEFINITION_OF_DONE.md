# Definition of Done (DoD)
## Sprint 1 Quality Standards

**Version:** 1.0  
**Date:** 2026-02-07  
**Status:** Active  
**Applies to:** All Sprint 1 Deliverables

---

## 1. Overview

Definition of Done (DoD) คือเกณฑ์ที่กำหนดว่าเมื่อใด User Story หรือ Task ถือว่า "เสร็จสมบูรณ์" และพร้อมสำหรับการ release

**หลักการ:** ทีมต้องยอมรับร่วมกัน และตรวจสอบก่อนเปลี่ยนสถานะเป็น "Done"

---

## 2. Universal Definition of Done

เกณฑ์นี้ใช้กับ **ทุก User Story** ใน Sprint 1:

### 2.1 Code Quality

| # | Criterion | Verification Method | Owner |
|---|-----------|---------------------|-------|
| 1 | Code เขียนตาม Coding Standards | Linter ผ่าน 100% | Developer |
| 2 | Code ผ่าน Peer Review | PR approved by 1+ reviewer | Tech Lead |
| 3 | ไม่มี console.log / debug code | Code review checklist | Developer |
| 4 | Code มี Comments สำหรับ complex logic | Reviewer ตรวจสอบ | Reviewer |
| 5 | ไม่มี Code duplication > 10% | SonarQube/Codecov | CI |
| 6 | Dependencies เป็น latest stable (ยกเว้นมีข้อจำกัด) | npm audit / pip check | Developer |

### 2.2 Testing

| # | Criterion | Verification Method | Owner |
|---|-----------|---------------------|-------|
| 7 | Unit Tests ครอบคลุมฟังก์ชันหลัก | Coverage >= 80% | Developer |
| 8 | Integration Tests สำหรับ API endpoints | Tests ผ่านทั้ง happy path และ error cases | Developer |
| 9 | All tests pass ใน CI/CD pipeline | CI green | CI |
| 10 | ไม่มี flaky tests | Run test suite 3x ติดต่อกัน ผลเหมือนกัน | QA |

### 2.3 Documentation

| # | Criterion | Verification Method | Owner |
|---|-----------|---------------------|-------|
| 11 | API Documentation อัปเดต (Swagger/OpenAPI) | Swagger UI แสดง endpoint ถูกต้อง | Developer |
| 12 | README อัปเดต (ถ้ามีการเปลี่ยน setup) | Reviewer ตรวจสอบ | Tech Lead |
| 13 | Code Comments สำหรับ public APIs | JSDoc/OpenAPI annotations | Developer |
| 14 | Changelog อัปเดต (สำหรับ breaking changes) | CHANGELOG.md | Developer |

### 2.4 Security

| # | Criterion | Verification Method | Owner |
|---|-----------|---------------------|-------|
| 15 | ไม่มี High/Critical vulnerabilities | npm audit / Snyk scan ผ่าน | CI |
| 16 | Secrets ไม่ถูก hardcode | Secret scanning (GitLeaks/TruffleHog) | CI |
| 17 | Input validation ครบถ้วน | Test cases ครอบคลุม validation | Developer |
| 18 | Authentication/Authorization ทำงานถูกต้อง | Security test cases ผ่าน | QA |

### 2.5 Deployment & Operations

| # | Criterion | Verification Method | Owner |
|---|-----------|---------------------|-------|
| 19 | Feature สามารถ deploy ได้ | Deploy to staging สำเร็จ | DevOps |
| 20 | Feature ทำงานได้บน Staging | Smoke tests ผ่าน | QA |
| 21 | Monitoring/Logs ครบถ้วน | Logs ปรากฏใน Kibana/Grafana | DevOps |
| 22 | Health checks ผ่าน | /health endpoint return 200 | CI |

### 2.6 User Story Specific

| # | Criterion | Verification Method | Owner |
|---|-----------|---------------------|-------|
| 23 | Acceptance Criteria ทั้งหมดผ่าน | PO/QA verify | Product Owner |
| 24 | Feature ใช้งานได้บน Target Browser/Device | Cross-browser testing (ถ้าจำเป็น) | QA |
| 25 | ไม่ introduce regression bugs | Regression test suite ผ่าน | QA |

---

## 3. Epic-Specific Definition of Done

### 3.1 Epic 1: Project Setup & Architecture

```yaml
Additional Criteria:
  - Architecture diagram อัปเดต
  - ADR (Architecture Decision Records) เขียนสำหรับการตัดสินใจสำคัญ
  - Setup guide ใน README ละเอียดพอสำหรับ new developer
  - CI/CD pipeline รันได้สมบูรณ์
  - Monitoring dashboards พร้อมใช้งาน
```

**DoD Checklist:**
- [ ] Clean Architecture / Hexagonal Architecture ถูกต้อง
- [ ] Database migrations รันได้ไม่มี error
- [ ] Docker setup ทำงาน (docker-compose up สำเร็จ)
- [ ] Environment variables มี documentation
- [ ] Health check endpoint ตอบสนอง
- [ ] Logs เป็น structured format (JSON)

### 3.2 Epic 2: Authentication System

```yaml
Additional Criteria:
  - OWASP Authentication Cheat Sheet compliance
  - Password policy ตาม NIST guidelines
  - JWT security: short expiry, secure rotation
  - Audit logs สำหรับทุก auth action
```

**DoD Checklist:**
- [ ] Registration flow ทำงาน end-to-end
- [ ] Login with valid/invalid credentials ทดสอบแล้ว
- [ ] Email verification link มี expiry และใช้ครั้งเดียว
- [ ] Password reset flow ปลอดภัย (token expiry, single use)
- [ ] Rate limiting ทำงาน (5 login attempts / 15 min)
- [ ] JWT tokens: access (15 min), refresh (7 days)
- [ ] Logout revoke tokens ทันที
- [ ] Passwords hashed ด้วย bcrypt (cost 12+)
- [ ] Security test cases ผ่าน (SQL injection, XSS บน auth)
- [ ] Email templates responsive

### 3.3 Epic 3: User Management

```yaml
Additional Criteria:
  - GDPR compliance สำหรับ PII data
  - Role-based access control (RBAC) ชัดเจน
  - Audit trail สำหรับทุกการแก้ไขข้อมูลผู้ใช้
```

**DoD Checklist:**
- [ ] Profile view/update ทำงานถูกต้อง
- [ ] Change password ต้องการ current password
- [ ] Admin endpoints ตรวจสอบ role
- [ ] Pagination ทำงานถูกต้อง (default limit, max limit)
- [ ] Search/filter ทำงาน (case-insensitive, partial match)
- [ ] User status change มี email notification
- [ ] Suspended/banned users ไม่สามารถ login ได้
- [ ] Audit logs บันทึกทุก admin action

### 3.4 Epic 4: Core Infrastructure

```yaml
Additional Criteria:
  - API ตอบสนอง < 200ms (p95)
  - Error messages ไม่ leak sensitive info
  - CORS ตั้งค่าอย่างเข้มงวด
```

**DoD Checklist:**
- [ ] API response format สม่ำเสมอทุก endpoint
- [ ] Error handling middleware ครอบคลุม
- [ ] Validation ทำงานบน body, query, params
- [ ] Rate limiting headers ส่งกลับ (X-RateLimit-Remaining)
- [ ] CORS อนุญาตเฉพาะ whitelist origins
- [ ] Security headers ครบ (Helmet.js)
- [ ] API versioning ใน path (/api/v1/...)
- [ ] 404/500 error responses เป็น JSON format

### 3.5 Epic 5: Testing & QA

```yaml
Additional Criteria:
  - Test pyramid balance (70% unit, 20% integration, 10% E2E)
  - Test data management ชัดเจน (fixtures, factories)
  - CI/CD รัน test suite ทั้งหมด
```

**DoD Checklist:**
- [ ] Unit test coverage >= 80%
- [ ] Integration tests สำหรับทุก API endpoint
- [ ] E2E tests สำหรับ critical user flows
- [ ] Tests รันใน CI ทุก PR
- [ ] Pre-commit hooks ตั้งค่าถูกต้อง
- [ ] Code formatter (Prettier) รัน auto
- [ ] Linter ไม่มี warnings
- [ ] Test documentation มีการอธิบายวิธี run tests

---

## 4. DoD Verification Process

### 4.1 Before Starting Work
1. Developer อ่านและเข้าใจ Acceptance Criteria
2. อ่าน DoD ที่เกี่ยวข้องกับ Epic
3. ถามข้อสงสัยกับ Tech Lead/PO

### 4.2 During Development
1. เขียน tests ควบคู่กับ code (TDD/BDD)
2. Run linter/formatter ก่อน commit
3. อัปเดต documentation ตามความเหมาะสม

### 4.3 Before PR Submission
```bash
# Developer Self-Check Script
npm run lint        # Must pass
npm run test        # Must pass
npm run test:cov    # Coverage >= 80%
npm run build       # Must build successfully
npm audit           # No high/critical issues
```

### 4.4 PR Review Process
1. **Automated Checks:** CI runs lint, test, coverage, security scan
2. **Peer Review:** Minimum 1 approval
3. **Checklist Review:** Reviewer verifies DoD items
4. **PO Review:** สำหรับ UI/UX changes

### 4.5 After Merge
1. Deploy to Staging
2. Run smoke tests
3. PO verifies Acceptance Criteria
4. Update ticket status to "Done"

---

## 5. DoD Exception Process

หากไม่สามารถทำตาม DoD ได้:

1. **Document:** บันทึกเหตุผลใน Ticket/PR
2. **Risk Assessment:** ประเมินความเสี่ยง
3. **Approval:** ต้องได้รับอนุมัติจาก Tech Lead + PO
4. **Tech Debt:** สร้าง Tech Debt ticket สำหรับการแก้ไขในอนาคต
5. **Timebox:** กำหนด timeline สำหรับการแก้ไข

**Template:**
```markdown
## DoD Exception Request
**Ticket:** US-2.1
**Item:** Integration test coverage 75% (target 80%)
**Reason:** Time constraint, complex third-party integration
**Risk:** Low - core logic covered, only edge cases missing
**Mitigation:** Create ticket TECH-123 to add tests in Sprint 2
**Approved by:** @techlead @productowner
```

---

## 6. DoD Metrics

ติดตาม metrics เหล่านี้ราย Sprint:

| Metric | Target | Measurement |
|--------|--------|-------------|
| DoD Compliance Rate | 100% | % stories meeting all DoD criteria |
| Test Coverage | >= 80% | Code coverage report |
| Critical Vulnerabilities | 0 | Security scan results |
| Regression Bugs | < 5% | Bugs found in staging/production |
| Average Review Time | < 24h | PR review cycle time |
| Deployment Success Rate | > 95% | Successful deployments / total |

---

## 7. Checklist Template

สำหรับแปะใน Pull Request:

```markdown
## Definition of Done Checklist

### Code Quality
- [ ] Code follows style guidelines (linting passed)
- [ ] No console.logs or debugging code
- [ ] Peer review approved
- [ ] No code duplication issues

### Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests passing in CI
- [ ] Coverage >= 80%

### Documentation
- [ ] API docs updated (Swagger)
- [ ] README updated (if needed)
- [ ] Code comments added

### Security
- [ ] No high/critical vulnerabilities
- [ ] Input validation implemented
- [ ] No secrets in code

### Deployment
- [ ] Deploys successfully to staging
- [ ] Smoke tests pass
- [ ] Monitoring/logs verified

### Acceptance Criteria
- [ ] All acceptance criteria met
- [ ] PO verification (if applicable)
```

---

## 8. Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-07 | Initial DoD for Sprint 1 | Tech Lead |

---

## 9. References

- [Scrum Guide - Definition of Done](https://scrumguides.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
