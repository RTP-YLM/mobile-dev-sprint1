# Test Cases Document
## Sprint 1 Testing Suite

**Version:** 1.0  
**Date:** 2026-02-07  
**Status:** Draft  
**Test Framework:** Jest/Vitest + Supertest (Integration)

---

## Test Case ID Convention

```
[EPIC]-[US]-[TC]-[NUMBER]

Example: E2-US2.1-TC001 = Epic 2, User Story 2.1, Test Case 001
```

---

## Epic 1: Project Setup & Architecture

### E1-US1.1: Project Initialization Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E1-US1.1-TC001 | Verify project structure | Repo cloned | 1. Check folder structure <br>2. Verify Clean Architecture layers | โครงสร้างตามมาตรฐาน Clean Architecture | P0 |
| E1-US1.1-TC002 | CI/CD pipeline execution | Push to main branch | 1. Push code <br>2. Check GitHub Actions | Pipeline run สำเร็จ | P0 |
| E1-US1.1-TC003 | Environment configuration | .env file exists | 1. Load environment variables <br>2. Verify all required vars | โหลด config สำเร็จไม่มี error | P0 |

### E1-US1.2: Database Setup Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E1-US1.2-TC001 | Database connection | DB server running | 1. Initiate connection <br>2. Execute test query | Connection established | P0 |
| E1-US1.2-TC002 | Migration execution | Migration files ready | 1. Run migrations <br>2. Verify schema | Schema ถูกต้อง | P0 |
| E1-US1.2-TC003 | Database seeding | Migrations applied | 1. Run seeders <br>2. Check data | Seed data ถูก insert | P1 |
| E1-US1.2-TC004 | Connection pooling | Multiple requests | 1. Send concurrent queries <br>2. Monitor connections | Connection pool ทำงาน | P1 |

### E1-US1.3: Logging & Monitoring Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E1-US1.3-TC001 | Structured logging | App running | 1. Generate logs <br>2. Verify JSON format | Logs เป็น JSON format | P1 |
| E1-US1.3-TC002 | Health check endpoint | Server running | 1. GET /health <br>2. Check response | Return 200 with status | P0 |
| E1-US1.3-TC003 | Error tracking integration | Sentry configured | 1. Trigger error <br>2. Check Sentry | Error ปรากฏใน Sentry | P1 |

---

## Epic 2: Authentication System

### E2-US2.1: User Registration Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E2-US2.1-TC001 | Successful registration | Database ready | 1. POST /api/v1/auth/register <br>2. Valid email & password | 201 Created, JWT returned | P0 |
| E2-US2.1-TC002 | Duplicate email | User exists | 1. Register with existing email | 409 Conflict, error message | P0 |
| E2-US2.1-TC003 | Invalid email format | - | 1. POST with invalid email | 400 Bad Request, validation error | P0 |
| E2-US2.1-TC004 | Weak password | - | 1. POST with password "123" | 400 Bad Request, password policy error | P0 |
| E2-US2.1-TC005 | Missing required fields | - | 1. POST without email | 400 Bad Request, field required | P0 |
| E2-US2.1-TC006 | Password mismatch | - | 1. POST with different passwords | 400 Bad Request, passwords don't match | P1 |
| E2-US2.1-TC007 | Email verification sent | Registration success | 1. Check email queue/inbox | Verification email sent | P0 |
| E2-US2.1-TC008 | Password hashing | Registration success | 1. Query database <br>2. Check password field | Password hashed (bcrypt) | P0 |

### E2-US2.2: User Login Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E2-US2.2-TC001 | Successful login | User registered & verified | 1. POST /api/v1/auth/login <br>2. Valid credentials | 200 OK, tokens returned | P0 |
| E2-US2.2-TC002 | Invalid password | User exists | 1. POST with wrong password | 401 Unauthorized | P0 |
| E2-US2.2-TC003 | Non-existent user | - | 1. POST with unregistered email | 401 Unauthorized (ไม่บอกว่า email ไม่มี) | P0 |
| E2-US2.2-TC004 | Unverified user | User registered, not verified | 1. POST with unverified account | 403 Forbidden, verify required | P1 |
| E2-US2.2-TC005 | Rate limiting - login | - | 1. Attempt login 6 times in 1 min | 429 Too Many Requests | P1 |
| E2-US2.2-TC006 | Login history recorded | Login success | 1. Check login_history table | Record ถูกสร้างพร้อม IP, UA | P1 |
| E2-US2.2-TC007 | Remember me token | - | 1. Login with remember=true | Refresh token expires 30 days | P2 |
| E2-US2.2-TC008 | Token format | Login success | 1. Decode JWT | Valid JWT structure, correct claims | P0 |

### E2-US2.3: Email Verification Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E2-US2.3-TC001 | Successful verification | Token valid | 1. GET /api/v1/auth/verify?token=xxx | 200 OK, account activated | P0 |
| E2-US2.3-TC002 | Invalid token | - | 1. GET with invalid token | 400 Bad Request, invalid token | P0 |
| E2-US2.3-TC003 | Expired token | Token > 24h old | 1. GET with expired token | 400 Bad Request, token expired | P0 |
| E2-US2.3-TC004 | Token reuse | Token used once | 1. Verify with same token again | 400 Bad Request, token invalid | P1 |
| E2-US2.3-TC005 | Resend verification | User unverified | 1. POST /api/v1/auth/resend-verification | 200 OK, new email sent | P1 |
| E2-US2.3-TC006 | Already verified | User verified | 1. Try verify again | 400 Bad Request, already verified | P1 |

### E2-US2.4: Password Reset Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E2-US2.4-TC001 | Request reset - valid email | User exists | 1. POST /api/v1/auth/forgot-password | 200 OK (ไม่บอกว่า email มีหรือไม่) | P0 |
| E2-US2.4-TC002 | Request reset - invalid email | - | 1. POST with non-existent email | 200 OK (security - same as valid) | P0 |
| E2-US2.4-TC003 | Reset with valid token | Token valid | 1. POST /api/v1/auth/reset-password | 200 OK, password updated | P0 |
| E2-US2.4-TC004 | Reset with expired token | Token > 1h | 1. POST with expired token | 400 Bad Request, token expired | P0 |
| E2-US2.4-TC005 | Reset with weak password | Token valid | 1. POST with weak new password | 400 Bad Request, policy violation | P0 |
| E2-US2.4-TC006 | Token invalidation after use | Reset success | 1. Try use same token again | 400 Bad Request, token invalid | P1 |
| E2-US2.4-TC007 | Notification email | Reset success | 1. Check email | Password changed notification sent | P1 |

### E2-US2.5: Token Refresh Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E2-US2.5-TC001 | Refresh with valid token | Have valid refresh token | 1. POST /api/v1/auth/refresh | 200 OK, new access token | P0 |
| E2-US2.5-TC002 | Refresh with expired token | Token expired | 1. POST with expired refresh | 401 Unauthorized | P0 |
| E2-US2.5-TC003 | Refresh with invalid token | - | 1. POST with invalid token | 401 Unauthorized | P0 |
| E2-US2.5-TC004 | Token rotation | Refresh success | 1. Check old refresh token | Old token revoked, new token issued | P1 |
| E2-US2.5-TC005 | Reuse detection | Token used twice | 1. Use refresh token twice | 401 Unauthorized, all tokens revoked | P1 |

### E2-US2.6: Logout Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E2-US2.6-TC001 | Logout success | User logged in | 1. POST /api/v1/auth/logout | 200 OK, tokens revoked | P0 |
| E2-US2.6-TC002 | Token invalidation | Logout success | 1. Use access token after logout | 401 Unauthorized, token invalid | P0 |
| E2-US2.6-TC003 | Session cleanup | Logout success | 1. Check sessions table | Session record deleted | P1 |
| E2-US2.6-TC004 | Logout without token | - | 1. POST without auth header | 401 Unauthorized | P0 |

---

## Epic 3: User Management

### E3-US3.1: View Profile Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E3-US3.1-TC001 | Get own profile | User authenticated | 1. GET /api/v1/users/me | 200 OK, profile data | P0 |
| E3-US3.1-TC002 | Profile data structure | - | 1. Verify response fields | มี: id, email, name, avatar, created_at, last_login | P0 |
| E3-US3.1-TC003 | Unauthorized access | No token | 1. GET without auth | 401 Unauthorized | P0 |

### E3-US3.2: Update Profile Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E3-US3.2-TC001 | Update name | User authenticated | 1. PATCH /api/v1/users/me <br>2. New name | 200 OK, name updated | P0 |
| E3-US3.2-TC002 | Update avatar | User authenticated | 1. Upload new avatar | 200 OK, avatar URL updated | P1 |
| E3-US3.2-TC003 | Attempt email change | - | 1. PATCH with new email | 400 Bad Request, use verification flow | P1 |
| E3-US3.2-TC004 | Invalid phone format | - | 1. PATCH with invalid phone | 400 Bad Request, validation error | P1 |
| E3-US3.2-TC005 | Timestamp update | Update success | 1. Check updated_at field | Timestamp updated | P1 |

### E3-US3.3: Change Password Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E3-US3.3-TC001 | Change with correct current | User authenticated | 1. POST /api/v1/users/change-password | 200 OK, password changed | P0 |
| E3-US3.3-TC002 | Wrong current password | - | 1. POST with wrong current | 400 Bad Request, incorrect password | P0 |
| E3-US3.3-TC003 | Same new password | - | 1. POST with same password | 400 Bad Request, must be different | P1 |
| E3-US3.3-TC004 | Weak new password | - | 1. POST with weak password | 400 Bad Request, policy error | P0 |
| E3-US3.3-TC005 | Session invalidation | Change success | 1. Try other active sessions | All sessions revoked | P1 |
| E3-US3.3-TC006 | Notification email | Change success | 1. Check email | Password changed email sent | P1 |

### E3-US3.4: Admin List Users Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E3-US3.4-TC001 | List all users | Admin authenticated | 1. GET /api/v1/admin/users | 200 OK, user list | P0 |
| E3-US3.4-TC002 | Pagination | Multiple users | 1. GET with page & limit | Paginated result | P0 |
| E3-US3.4-TC003 | Filter by status | - | 1. GET ?status=active | Only active users | P1 |
| E3-US3.4-TC004 | Filter by role | - | 1. GET ?role=admin | Only admin users | P1 |
| E3-US3.4-TC005 | Search by email | - | 1. GET ?search=user@example | Matching users | P1 |
| E3-US3.4-TC006 | Non-admin access | User not admin | 1. GET as regular user | 403 Forbidden | P0 |

### E3-US3.5: Admin Manage User Status Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E3-US3.5-TC001 | Suspend user | Admin auth, active user | 1. PATCH /api/v1/admin/users/:id/status | 200 OK, status=suspended | P0 |
| E3-US3.5-TC002 | Ban user | Admin auth | 1. PATCH status=ban | 200 OK, status=banned | P0 |
| E3-US3.5-TC003 | Reactivate user | Admin auth | 1. PATCH status=active | 200 OK, status=active | P0 |
| E3-US3.5-TC004 | Session revocation on suspend | User has active sessions | 1. Suspend user <br>2. Check sessions | All sessions revoked | P1 |
| E3-US3.5-TC005 | Email notification | Status changed | 1. Check user's email | Notification sent | P1 |
| E3-US3.5-TC006 | Audit log | Status changed | 1. Check audit_logs table | Record created with admin & timestamp | P1 |

---

## Epic 4: Core Infrastructure

### E4-US4.1: API Response Standardization Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E4-US4.1-TC001 | Success response format | Any successful request | 1. Verify response structure | {success, data, message} | P0 |
| E4-US4.1-TC002 | Error response format | Any failed request | 1. Verify error structure | {success, errors, message} | P0 |
| E4-US4.1-TC003 | API versioning | - | 1. Call /api/v1/... | Version in path | P0 |
| E4-US4.1-TC004 | 404 handling | Invalid endpoint | 1. GET /api/v1/nonexistent | 404, standardized error | P0 |

### E4-US4.2: Request Validation Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E4-US4.2-TC001 | Body validation | - | 1. POST with invalid body | 400, detailed errors | P0 |
| E4-US4.2-TC002 | Query param validation | - | 1. GET with invalid params | 400, validation error | P0 |
| E4-US4.2-TC003 | Path param validation | - | 1. GET with invalid ID format | 400, validation error | P0 |
| E4-US4.2-TC004 | SQL injection attempt | - | 1. Send SQL in input | Input sanitized, no injection | P0 |

### E4-US4.3: Rate Limiting Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E4-US4.3-TC001 | Auth endpoint limit | - | 1. Call auth 6 times/min | 429 on 6th call | P0 |
| E4-US4.3-TC002 | General API limit | - | 1. Call API 101 times/min | 429 on 101st call | P1 |
| E4-US4.3-TC003 | Rate limit headers | Request made | 1. Check response headers | X-RateLimit-* present | P1 |
| E4-US4.3-TC004 | Limit reset | Wait for window | 1. Wait 1 min <br>2. Request again | 200 OK, counter reset | P1 |

### E4-US4.4: CORS Configuration Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E4-US4.4-TC001 | Allowed origin | - | 1. Request from allowed origin | 200, CORS headers | P0 |
| E4-US4.4-TC002 | Disallowed origin | - | 1. Request from other origin | No CORS headers / blocked | P0 |
| E4-US4.4-TC003 | Preflight request | - | 1. Send OPTIONS request | 204, allowed methods | P0 |
| E4-US4.4-TC004 | Credentials header | - | 1. Request with credentials | Access-Control-Allow-Credentials: true | P0 |

### E4-US4.5: Security Headers Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E4-US4.5-TC001 | Security headers present | - | 1. Check response headers | X-Content-Type-Options, X-Frame-Options, etc. | P0 |
| E4-US4.5-TC002 | CSP header | - | 1. Check Content-Security-Policy | CSP header present | P0 |
| E4-US4.5-TC003 | HSTS header | HTTPS request | 1. Check Strict-Transport-Security | HSTS header present | P1 |

---

## Epic 5: Testing & QA

### E5-US5.1: Unit Testing Setup Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E5-US5.1-TC001 | Test runner execution | Tests written | 1. Run npm test | All tests execute | P0 |
| E5-US5.1-TC002 | Coverage report | Tests run | 1. Run with coverage flag | Coverage report generated | P0 |
| E5-US5.1-TC003 | Coverage threshold | - | 1. Check coverage % | >= 80% | P0 |

### E5-US5.2: Integration Testing Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E5-US5.2-TC001 | Test database isolation | - | 1. Run integration tests | ใช้ test database แยก | P0 |
| E5-US5.2-TC002 | API integration | Server running | 1. Run API integration tests | All endpoints tested | P0 |
| E5-US5.2-TC003 | Database cleanup | Tests complete | 1. Check test DB | Data cleaned after tests | P0 |

### E5-US5.3: E2E Testing Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E5-US5.3-TC001 | Registration flow | E2E env ready | 1. Run registration E2E test | Test passes | P0 |
| E5-US5.3-TC002 | Login flow | - | 1. Run login E2E test | Test passes | P0 |
| E5-US5.3-TC003 | Password reset flow | - | 1. Run reset E2E test | Test passes | P1 |

### E5-US5.4: Code Quality Tests

| TC ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|-------|-----------|---------------|-------|-----------------|----------|
| E5-US5.4-TC001 | Linter execution | - | 1. Run linter | No errors | P0 |
| E5-US5.4-TC002 | Formatter check | - | 1. Run format check | All files formatted | P0 |
| E5-US5.4-TC003 | Pre-commit hooks | - | 1. Try commit | Hooks run automatically | P0 |

---

## Regression Test Suite

ชุดทดสอบที่ต้องรันเมื่อมีการแก้ไขโค้ด:

```
Critical Path (Run on every PR):
├── E2-US2.1-TC001: Registration
├── E2-US2.2-TC001: Login
├── E2-US2.5-TC001: Token Refresh
├── E2-US2.6-TC001: Logout
├── E3-US3.1-TC001: View Profile
└── E4-US4.3-TC001: Rate Limiting

Full Regression (Run before release):
├── All Epic 2 Tests
├── All Epic 3 Tests
├── All Epic 4 Tests
└── Selected Epic 1, 5 Tests
```

---

## Test Environment Setup

### Unit/Integration Test Config
```javascript
// jest.config.js or vitest.config.js
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

### Test Data Fixtures
```javascript
// fixtures/users.js
export const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'Test User'
};

export const adminUser = {
  email: 'admin@example.com',
  password: 'AdminPass123!',
  role: 'admin'
};
```

---

## Test Execution Schedule

| Test Type | Frequency | Environment |
|-----------|-----------|-------------|
| Unit Tests | Every commit | Local/CI |
| Integration Tests | Every PR | CI |
| Critical Path | Every PR | CI |
| Full Regression | Before release | Staging |
| E2E Tests | Nightly | Staging |
| Security Tests | Weekly | Staging |
| Performance Tests | Before major release | Production-like |
