# Test Data Preparation - Sprint 1

---

## 1. Test User Accounts

### Valid Users (Pre-registered)

```json
[
  {
    "email": "qa.user1@test.com",
    "password": "Test@1234",
    "name": "QA User One",
    "role": "user",
    "status": "active",
    "createdAt": "2026-02-01"
  },
  {
    "email": "qa.user2@test.com",
    "password": "Test@5678",
    "name": "QA User Two",
    "role": "user",
    "status": "active",
    "createdAt": "2026-02-02"
  },
  {
    "email": "qa.inactive@test.com",
    "password": "Test@1234",
    "name": "Inactive User",
    "role": "user",
    "status": "inactive",
    "createdAt": "2026-01-15"
  }
]
```

---

## 2. Test Registration Data

### Valid Registration Inputs

| Scenario | Email | Password | Expected |
|----------|-------|----------|----------|
| New user | `newuser1@test.com` | `Pass@word1` | ✅ Success |
| New user | `newuser2@test.com` | `Secure#2026` | ✅ Success |
| New user | `test.user+tag@test.com` | `Valid@123` | ✅ Success |

### Invalid Registration Inputs

| Scenario | Email | Password | Expected Error |
|----------|-------|----------|----------------|
| Existing email | `qa.user1@test.com` | `Test@1234` | "Email already registered" |
| Invalid email | `invalid-email` | `Test@1234` | "Invalid email format" |
| Weak password | `test@test.com` | `123456` | "Password too weak" |
| Short password | `test@test.com` | `Abc@1` | "Password must be 8+ characters" |
| No special char | `test@test.com` | `Password123` | "Password must contain special character" |

---

## 3. Test Login Data

### Valid Login Credentials

| User | Email | Password | Notes |
|------|-------|----------|-------|
| Standard user | `qa.user1@test.com` | `Test@1234` | Active account |
| Standard user | `qa.user2@test.com` | `Test@5678` | Active account |

### Invalid Login Attempts

| Scenario | Email | Password | Expected Error |
|----------|-------|----------|----------------|
| Wrong password | `qa.user1@test.com` | `WrongPass123` | "Invalid credentials" |
| Non-existent | `ghost@test.com` | `Test@1234` | "Invalid credentials" |
| Empty email | ` ` | `Test@1234` | "Email required" |
| Empty password | `qa.user1@test.com` | ` ` | "Password required" |

---

## 4. SQL Injection & Security Test Cases

```javascript
// Email field injections
const sqlInjectionTests = [
  "admin' OR '1'='1",
  "admin'--",
  "admin' OR '1'='1' /*",
  "'; DROP TABLE users; --",
  "1' UNION SELECT * FROM users--"
];

// Password field injections
const xssTests = [
  "<script>alert('XSS')</script>",
  "javascript:alert(1)",
  "<img src=x onerror=alert(1)>"
];
```

**Expected**: All should be safely escaped/rejected without exposing database errors.

---

## 5. Profile Test Data

### Valid Profile Updates

```json
{
  "name": "Updated QA User",
  "bio": "This is a test bio for QA purposes",
  "phone": "+66-123-456-789",
  "location": "Bangkok, Thailand"
}
```

### Invalid Profile Updates

| Field | Value | Expected Error |
|-------|-------|----------------|
| name | ` ` (empty) | "Name is required" |
| name | `A` (too short) | "Name must be 2+ characters" |
| phone | `invalid-phone` | "Invalid phone format" |

---

## 6. Edge Case Test Data

### Boundary Testing

| Test | Input | Expected |
|------|-------|----------|
| Max email length | 254 chars email | ✅ Accept |
| Max password length | 128 chars password | ✅ Accept |
| Unicode in name | `ผู้ใช้ทดสอบ` | ✅ Support Thai/Unicode |
| Special chars in name | `O'Brien` | ✅ Accept apostrophe |

---

## 7. Mock API Responses

### Successful Registration Response
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "usr_123456",
    "email": "newuser@test.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Failed Login Response
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid email or password"
  }
}
```

### Session Expired Response
```json
{
  "success": false,
  "error": {
    "code": "SESSION_EXPIRED",
    "message": "Your session has expired. Please login again."
  }
}
```

---

## 8. Database Seed Script (Example)

```sql
-- Clear existing test data
DELETE FROM users WHERE email LIKE '%@test.com';

-- Insert test users
INSERT INTO users (email, password_hash, name, status, created_at) VALUES
('qa.user1@test.com', '$2b$10$hash...', 'QA User One', 'active', '2026-02-01'),
('qa.user2@test.com', '$2b$10$hash...', 'QA User Two', 'active', '2026-02-02'),
('qa.inactive@test.com', '$2b$10$hash...', 'Inactive User', 'inactive', '2026-01-15');
```

---

## 9. Test Data Cleanup

**After each test cycle**:
- Delete all users with `@test.com` domain
- Reset auto-increment IDs
- Clear session tokens
- Restore database to clean state

**Cleanup Script**:
```bash
npm run db:reset-test
# or
./scripts/cleanup-test-data.sh
```

---

**Maintained by**: QA Team (มิ้นท์)  
**Last Updated**: 2026-02-07
