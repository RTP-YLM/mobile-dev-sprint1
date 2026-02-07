# Bug Report Template

---

## Bug ID: BUG-[YYYY-MM-DD]-[###]
**Example**: `BUG-2026-02-07-001`

---

## 📋 Summary
**[One-line description of the bug]**

Example: *Login button remains disabled after entering valid credentials*

---

## 🔴 Severity & Priority

- **Severity**: Critical / High / Medium / Low
- **Priority**: P0 / P1 / P2 / P3

### Severity Guidelines
- **Critical**: System crash, data loss, security breach, complete feature failure
- **High**: Major functionality broken, no workaround available
- **Medium**: Feature partially broken, workaround exists
- **Low**: UI cosmetic issue, minor inconvenience

---

## 🏷️ Component & Tags

- **Component**: Registration / Login / Profile / Session / UI
- **Tags**: `#frontend` `#backend` `#api` `#database` `#security` `#ui`

---

## 📍 Environment

- **Environment**: DEV / STAGING / PRODUCTION
- **URL**: `https://staging.example.com/login`
- **Browser**: Chrome 130 / Firefox 120 / Safari 17
- **OS**: macOS 14 / Windows 11 / iOS 17
- **Screen Resolution**: 1920x1080 / 375x667 (mobile)

---

## 📝 Steps to Reproduce

1. Navigate to `/login`
2. Enter email: `qa@test.com`
3. Enter password: `Test@1234`
4. Observe login button state

---

## ❌ Expected Result

- Login button should become enabled after valid input
- Clicking button should submit form

---

## ⚠️ Actual Result

- Login button remains disabled
- Cannot submit login form
- No error message shown

---

## 📸 Evidence

### Screenshots
- [ ] Attached: `screenshot-bug-001.png`

### Video
- [ ] Attached: `screenrecording-bug-001.mp4`

### Console Logs
```javascript
Uncaught TypeError: Cannot read property 'value' of null
  at validateForm (login.js:45)
```

### Network Logs
```
Request: POST /api/login
Status: [Not sent due to disabled button]
```

---

## 🔍 Additional Context

- Bug occurs only on Chrome (works fine on Firefox)
- Reproduced on 3 different machines
- Started after deployment on 2026-02-06
- Related to recent password validation changes

---

## 📊 Impact Assessment

- **Users Affected**: ~500 daily login attempts
- **Workaround Available**: Yes - Use Firefox browser
- **Business Impact**: High - Blocks user login on primary browser

---

## 🔗 Related Items

- **Test Case**: TC-LOGIN-001
- **User Story**: US-123 "User Login"
- **Related Bugs**: BUG-2026-02-05-012 (password validation)

---

## 🧪 Test Data Used

```json
{
  "email": "qa@test.com",
  "password": "Test@1234"
}
```

---

## 📌 Notes for Developer

- Issue appears to be in `validateForm()` function
- DOM selector for button may be incorrect
- Check recent changes in PR #456

---

**Reported by**: [Your Name]  
**Date Reported**: 2026-02-07 10:30 AM  
**Assigned to**: [Developer Name]  
**Status**: New / Assigned / In Progress / Fixed / Retest / Closed

---

## 🔄 Bug Lifecycle Tracking

| Date | Status | Action Taken | By |
|------|--------|--------------|-----|
| 2026-02-07 | New | Bug reported | มิ้นท์ (QA) |
| 2026-02-07 | Assigned | Assigned to Dev Team | PM |
| 2026-02-08 | In Progress | Investigating root cause | Dev |
| 2026-02-08 | Fixed | Deployed fix to DEV | Dev |
| 2026-02-09 | Retest | Verified fix works | มิ้นท์ (QA) |
| 2026-02-09 | Closed | Bug resolved | มิ้นท์ (QA) |

---

## ✅ Verification Checklist (for Retest)

- [ ] Bug no longer reproducible in DEV
- [ ] Regression testing passed
- [ ] Tested on all affected browsers/devices
- [ ] Verified in STAGING environment
- [ ] Ready for production deployment

---

**Template Version**: 1.0  
**Last Updated**: 2026-02-07
