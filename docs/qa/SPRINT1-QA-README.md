# Sprint 1 - QA Testing Documentation

📦 **ชุดเอกสารทดสอบสำหรับ Sprint 1** - พร้อมใช้งานทันที

---

## 📚 เอกสารทั้งหมด

### 1. 📋 [Test Plan](sprint1-test-plan.md)
- Test scope & approach
- Test environments (DEV, STAGING, PROD)
- Entry/Exit criteria
- Risk mitigation

### 2. ✅ [Test Cases](sprint1-test-cases.md)
**27 test cases** ครอบคลุม:
- **TC-REG** (5 cases): User Registration
- **TC-LOGIN** (5 cases): User Login
- **TC-SESSION** (4 cases): Session Management
- **TC-PROFILE** (4 cases): User Profile
- **TC-UI** (5 cases): UI/UX & Compatibility

### 3. 🗄️ [Test Data](sprint1-test-data.md)
- Pre-registered test users
- Valid/Invalid input sets
- SQL injection & XSS test data
- Mock API responses
- Database seed scripts

### 4. 🐛 [Bug Report Template](bug-report-template.md)
- Structured bug reporting format
- Severity/Priority guidelines
- Evidence checklist
- Lifecycle tracking

---

## 🚀 Quick Start

### ขั้นตอนการทดสอบ

1. **เตรียมข้อมูล**: ใช้ test data จาก `sprint1-test-data.md`
2. **รัน test cases**: ตาม `sprint1-test-cases.md` (เริ่มจาก P0 → P1 → P2)
3. **รายงาน bugs**: ใช้ `bug-report-template.md`
4. **สรุปผล**: อัพเดท execution status ใน test plan

### Test Accounts (Quick Reference)

| Email | Password | Purpose |
|-------|----------|---------|
| `qa.user1@test.com` | `Test@1234` | Standard testing |
| `qa.user2@test.com` | `Test@5678` | Concurrent session test |
| `qa.inactive@test.com` | `Test@1234` | Inactive user test |

---

## ✨ Highlights

- ✅ **27 test cases** พร้อม expected results
- ✅ **Security tests** (SQL injection, XSS)
- ✅ **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile responsive** test cases
- ✅ **Accessibility** (keyboard navigation)

---

## 📊 Test Coverage

| Feature | Test Cases | Priority |
|---------|------------|----------|
| Registration | 5 | P0-P1 |
| Login | 5 | P0-P1 |
| Session | 4 | P0-P2 |
| Profile | 4 | P0-P2 |
| UI/UX | 5 | P1-P2 |
| **Total** | **27** | |

---

## 🎯 Success Criteria (Exit Sprint 1)

- [ ] 100% test cases executed
- [ ] 0 Critical bugs
- [ ] 0 High bugs (or PM accepted)
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsive verified
- [ ] Test summary report submitted

---

**Prepared by**: มิ้นท์ (QA Team)  
**Sprint**: Sprint 1  
**Date**: 2026-02-07  
**Status**: ✅ Ready for Testing
