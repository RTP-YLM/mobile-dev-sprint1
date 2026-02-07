# Test Plan - Sprint 1

## 1. Test Scope

### In Scope
- User Registration (new user signup)
- User Login (email/password authentication)
- Session Management (token lifecycle, timeout)
- User Profile (view, edit, update)
- UI/UX (responsive design, accessibility, navigation)

### Out of Scope
- Password reset/recovery
- OAuth/Social login
- Advanced profile features (avatar upload, preferences)
- Payment/subscription features
- Admin functionalities

---

## 2. Test Approach

### Testing Levels
- **Unit Testing**: Developer-owned (code review only)
- **Integration Testing**: API endpoints, database interactions
- **Functional Testing**: E2E user workflows
- **UI Testing**: Cross-browser, responsive design
- **Exploratory Testing**: Ad-hoc testing for edge cases

### Testing Types
- ✅ Functional Testing (primary focus)
- ✅ Usability Testing
- ✅ Security Testing (basic auth validation)
- ✅ Compatibility Testing (browsers, devices)
- ⚠️ Performance Testing (limited - response time only)

---

## 3. Test Environments

| Environment | Purpose | URL | Access |
|------------|---------|-----|--------|
| **DEV** | Development testing | `dev.example.com` | QA team |
| **STAGING** | Pre-production validation | `staging.example.com` | QA + Stakeholders |
| **PRODUCTION** | Smoke testing post-deployment | `app.example.com` | Limited QA |

### Test Data Strategy
- Use **dedicated test accounts** (never production data)
- Reset test database before each test cycle
- Maintain seed data scripts for consistency

---

## 4. Entry & Exit Criteria

### Entry Criteria (เริ่ม test ได้เมื่อ)
- ✅ All features deployed to DEV/STAGING
- ✅ Test cases reviewed and approved
- ✅ Test data prepared
- ✅ No critical blockers from previous sprint

### Exit Criteria (ผ่าน sprint เมื่อ)
- ✅ 100% of test cases executed
- ✅ 0 critical bugs open
- ✅ 0 high bugs open (or accepted by PM)
- ✅ Test summary report approved

---

## 5. Defect Management

### Severity Levels
- **Critical**: System crash, data loss, security breach
- **High**: Major feature broken, no workaround
- **Medium**: Feature partially broken, workaround exists
- **Low**: UI glitch, minor inconvenience

### Bug Lifecycle
1. New → 2. Assigned → 3. Fixed → 4. Retest → 5. Closed/Reopened

---

## 6. Deliverables

- [ ] Test case execution report
- [ ] Bug summary report
- [ ] Test coverage metrics
- [ ] Sign-off from QA Lead

---

## 7. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Environment instability | High | Daily health checks, backup staging |
| Incomplete requirements | Medium | Daily standup clarifications |
| Time constraints | High | Prioritize P0/P1 test cases |

---

**Prepared by**: QA Team (มิ้นท์)  
**Date**: 2026-02-07  
**Sprint**: Sprint 1
