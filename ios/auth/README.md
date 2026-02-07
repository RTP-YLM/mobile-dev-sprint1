# iOS Authentication Flow - SwiftUI

โปรเจค Authentication Flow สำหรับ iOS ที่พัฒนาด้วย SwiftUI พร้อมรองรับ Accessibility และ Dynamic Type

## 📁 โครงสร้างไฟล์

```
ios/auth/
├── Components.swift          # Reusable UI Components
├── OnboardingScreen.swift    # หน้าแนะนำแอพสำหรับผู้ใช้ใหม่
├── LoginScreen.swift         # หน้าเข้าสู่ระบบ
├── RegisterScreen.swift      # หน้าสมัครสมาชิก
├── ForgotPasswordScreen.swift # หน้ากู้คืนรหัสผ่าน
└── AuthApp.swift            # Entry point และ Navigation
```

## 🎨 UI Components

### 1. CustomTextField
TextField แบบ custom พร้อม validation และ accessibility:
```swift
CustomTextField(
    title: "Email",
    placeholder: "Enter your email",
    text: $email,
    keyboardType: .emailAddress,
    isSecure: false,
    errorMessage: emailError
)
```

**Features:**
- ✅ รองรับ SecureField (password)
- ✅ Toggle show/hide password
- ✅ Error message display
- ✅ Dynamic Type support
- ✅ VoiceOver labels

### 2. PrimaryButton
ปุ่มหลักพร้อม loading state:
```swift
PrimaryButton(
    title: "Sign In",
    action: { login() },
    isLoading: isLoading,
    isEnabled: isFormValid
)
```

**Features:**
- ✅ Loading indicator
- ✅ Disabled state styling
- ✅ Dynamic Type support
- ✅ Accessibility hints

### 3. ErrorBanner
แสดงข้อความ error แบบ banner:
```swift
ErrorBanner(
    message: "Invalid credentials",
    onDismiss: { clearError() }
)
```

## 📱 Screens

### OnboardingScreen
- Feature highlights 3 หน้า
- Page indicators
- Skip/Next/Get Started buttons
- รองรับ swipe navigation

### LoginScreen
- Email/Password inputs
- Form validation
- "Forgot Password?" link
- "Sign Up" link
- Keyboard navigation support

### RegisterScreen
- Email/Password/Confirm Password
- Password strength indicator
- Real-time validation
- Terms agreement

### ForgotPasswordScreen
- Email input for recovery
- Success state view
- Resend option

## ✅ Form Validation

### Email Validation
```swift
Validation.isValidEmail("user@example.com") // true/false
```
- Regex pattern: `[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`
- Real-time validation
- Clear error messages

### Password Validation
```swift
let result = Validation.validatePassword("MyP@ssw0rd")
// result.isValid: Bool
// result.strength: .weak/.medium/.strong
// result.message: String
```

**Requirements:**
- อย่างน้อย 8 ตัวอักษร
- มีตัวพิมพ์ใหญ่ (A-Z)
- มีตัวพิมพ์เล็ก (a-z)
- มีตัวเลข (0-9)
- มีอักขระพิเศษ (!@#$%^&*)

## ♿ Accessibility Support

### VoiceOver Labels
ทุก component มี accessibility labels:
```swift
.accessibilityLabel("Email input field")
.accessibilityHint("Double tap to edit")
.accessibilityValue("Current value: \(text)")
```

### Dynamic Type
รองรับการปรับขนาดตัวอักษรตามการตั้งค่าของผู้ใช้:
```swift
.dynamicTypeSize(.xSmall ... .accessibility3)
```

### Keyboard Navigation
รองรับ navigation ด้วย keyboard:
- Tab/Next ระหว่าง fields
- Return/Enter สำหรับ submit
- Focus management

## 🚀 วิธีใช้งาน

### 1. ติดตั้ง
คัดลอกไฟล์ทั้งหมดในโฟลเดอร์ `auth/` เข้าไปใน Xcode project

### 2. ตั้งค่า App Entry Point
ใช้ `AuthApp.swift` เป็น @main หรือ integrate เข้ากับ existing app:

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### 3. Customization

#### เปลี่ยนสี theme:
```swift
PrimaryButton(
    title: "Sign In",
    action: action,
    backgroundColor: .purple  // เปลี่ยนสีปุ่ม
)
```

#### เพิ่ม validation rule:
```swift
// ใน Validation struct
static func isValidPhone(_ phone: String) -> Bool {
    // custom validation
}
```

### 4. API Integration
แก้ไข method `login()`, `register()`, `sendResetRequest()` ในแต่ละ screen:

```swift
private func login() {
    isLoading = true
    
    // แทนที่ด้วย API call จริง
    AuthService.login(email: email, password: password) { result in
        isLoading = false
        switch result {
        case .success:
            isLoggedIn = true
        case .failure(let error):
            generalError = error.localizedDescription
        }
    }
}
```

## 📝 ตัวอย่าง Demo

**Test credentials:**
- Email: `test@example.com`
- Password: `password`

หรือสมัครใหม่ได้ที่ RegisterScreen

## 🎨 Preview Support

ทุก screen มี Preview สำหรับ:
- Light/Dark mode
- Different device sizes
- Accessibility sizes (Dynamic Type)

```swift
struct LoginScreen_Previews: PreviewProvider {
    static var previews: some View {
        LoginScreen()
        LoginScreen().preferredColorScheme(.dark)
        LoginScreen().environment(\.dynamicTypeSize, .accessibility2)
    }
}
```

## 🔒 Security Notes

- ใช้ `@AppStorage` สำหรับเก็บสถานะ login (demo only)
- ใน production ควรใช้ Keychain สำหรับเก็บ token
- Password validation ทำงานบน client เบื้องต้น
- ควรมี server-side validation เพิ่มเติม

## 📋 Requirements

- iOS 16.0+
- Swift 5.9+
- Xcode 15.0+

## 🛠️ สิ่งที่สามารถปรับปรุงเพิ่ม

- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Social login (Apple/Google)
- [ ] Email verification screen
- [ ] Password requirements tooltip
- [ ] Auto-fill support (iCloud Keychain)
