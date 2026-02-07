# Test Cases - Sprint 1

---

## TC-REG: User Registration

### TC-REG-001: Successful Registration
**Priority**: P0 | **Type**: Positive  
**Precondition**: User not registered  
**Steps**:
1. Navigate to `/register`
2. Fill form:
   - Email: `newuser@test.com`
   - Password: `Test@1234`
   - Confirm Password: `Test@1234`
3. Click "Sign Up"

**Expected**:
- ✅ Success message shown
- ✅ User redirected to dashboard
- ✅ Email confirmation sent (if applicable)

---

### TC-REG-002: Registration with Existing Email
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Navigate to `/register`
2. Use email: `existing@test.com` (already registered)
3. Fill password fields
4. Submit form

**Expected**:
- ❌ Error: "Email already registered"
- ❌ Form not submitted

---

### TC-REG-003: Password Validation
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Try passwords:
   - `123` (too short)
   - `password` (no special char)
   - `Test123` (no special char)

**Expected**:
- ❌ Error: "Password must be 8+ chars with 1 uppercase, 1 number, 1 special char"

---

### TC-REG-004: Password Mismatch
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Password: `Test@1234`
2. Confirm: `Test@5678`
3. Submit

**Expected**:
- ❌ Error: "Passwords do not match"

---

### TC-REG-005: Empty Fields Validation
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Leave email/password blank
2. Submit form

**Expected**:
- ❌ Inline errors on all required fields

---

## TC-LOGIN: User Login

### TC-LOGIN-001: Successful Login
**Priority**: P0 | **Type**: Positive  
**Precondition**: User `qa@test.com` exists  
**Steps**:
1. Navigate to `/login`
2. Email: `qa@test.com`
3. Password: `Test@1234`
4. Click "Login"

**Expected**:
- ✅ Redirected to dashboard
- ✅ Session token stored
- ✅ User menu shows username

---

### TC-LOGIN-002: Invalid Credentials
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Email: `qa@test.com`
2. Password: `WrongPass123`
3. Submit

**Expected**:
- ❌ Error: "Invalid email or password"
- ❌ No session created

---

### TC-LOGIN-003: Non-existent User
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Email: `ghost@test.com` (not registered)
2. Password: `Test@1234`

**Expected**:
- ❌ Error: "Invalid email or password" (don't reveal user doesn't exist)

---

### TC-LOGIN-004: Empty Credentials
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Leave fields blank
2. Submit

**Expected**:
- ❌ Inline validation errors

---

### TC-LOGIN-005: SQL Injection Attempt
**Priority**: P0 | **Type**: Security  
**Steps**:
1. Email: `admin' OR '1'='1`
2. Submit

**Expected**:
- ❌ Login fails safely
- ❌ No database error exposed

---

## TC-SESSION: Session Management

### TC-SESSION-001: Session Persistence
**Priority**: P0 | **Type**: Functional  
**Steps**:
1. Login successfully
2. Navigate to different pages
3. Close browser tab
4. Reopen and visit site

**Expected**:
- ✅ User still logged in (if "Remember Me")
- ✅ Session maintained across tabs

---

### TC-SESSION-002: Logout
**Priority**: P0 | **Type**: Functional  
**Steps**:
1. Login
2. Click "Logout"

**Expected**:
- ✅ Redirected to login page
- ✅ Session token cleared
- ✅ Cannot access protected pages without re-login

---

### TC-SESSION-003: Session Timeout
**Priority**: P1 | **Type**: Functional  
**Steps**:
1. Login
2. Wait for session timeout (30 min)
3. Try to access protected page

**Expected**:
- ❌ Redirected to login
- ❌ Message: "Session expired"

---

### TC-SESSION-004: Concurrent Sessions
**Priority**: P2 | **Type**: Functional  
**Steps**:
1. Login on Browser A
2. Login with same user on Browser B

**Expected**:
- ⚠️ Both sessions active OR
- ⚠️ Browser A logged out (depends on requirement)

---

## TC-PROFILE: User Profile

### TC-PROFILE-001: View Profile
**Priority**: P0 | **Type**: Positive  
**Steps**:
1. Login
2. Navigate to `/profile`

**Expected**:
- ✅ Display: email, name, join date
- ✅ All fields populated correctly

---

### TC-PROFILE-002: Edit Profile - Success
**Priority**: P1 | **Type**: Positive  
**Steps**:
1. Go to profile edit page
2. Change name: `Updated Name`
3. Save

**Expected**:
- ✅ Success message
- ✅ Changes persisted
- ✅ UI reflects new name

---

### TC-PROFILE-003: Edit Profile - Validation
**Priority**: P1 | **Type**: Negative  
**Steps**:
1. Clear required field (e.g., name)
2. Save

**Expected**:
- ❌ Error: "Name is required"
- ❌ Changes not saved

---

### TC-PROFILE-004: Cancel Edit
**Priority**: P2 | **Type**: Functional  
**Steps**:
1. Start editing profile
2. Make changes
3. Click "Cancel"

**Expected**:
- ✅ Changes discarded
- ✅ Original values displayed

---

## TC-UI: UI/UX Testing

### TC-UI-001: Responsive Design - Mobile
**Priority**: P1 | **Type**: Compatibility  
**Steps**:
1. Open site on mobile (375px width)
2. Check all pages

**Expected**:
- ✅ No horizontal scroll
- ✅ Buttons/forms accessible
- ✅ Text readable

---

### TC-UI-002: Cross-browser Compatibility
**Priority**: P1 | **Type**: Compatibility  
**Browsers**: Chrome, Firefox, Safari, Edge  
**Steps**:
1. Test login/registration on each browser

**Expected**:
- ✅ Consistent behavior
- ✅ No layout breaks

---

### TC-UI-003: Accessibility - Keyboard Navigation
**Priority**: P2 | **Type**: Accessibility  
**Steps**:
1. Use Tab key to navigate forms
2. Use Enter to submit

**Expected**:
- ✅ Focus order logical
- ✅ All interactive elements accessible

---

### TC-UI-004: Error Message Visibility
**Priority**: P1 | **Type**: Usability  
**Steps**:
1. Trigger validation errors (login, registration)

**Expected**:
- ✅ Errors clearly visible (color, icon)
- ✅ Error text descriptive
- ✅ Accessible (screen readers)

---

### TC-UI-005: Loading States
**Priority**: P2 | **Type**: Usability  
**Steps**:
1. Submit login form
2. Observe during API call

**Expected**:
- ✅ Loading spinner shown
- ✅ Button disabled during load
- ✅ No double-submit possible

---

## Test Execution Summary Template

| ID | Status | Notes | Tested By | Date |
|----|--------|-------|-----------|------|
| TC-REG-001 | ⏳ | | | |
| TC-LOGIN-001 | ⏳ | | | |
| ... | | | | |

**Legend**: ✅ Pass | ❌ Fail | ⏳ Not Tested | ⚠️ Blocked
