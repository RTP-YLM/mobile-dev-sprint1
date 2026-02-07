# StudyZen iOS App

iOS SwiftUI Application สำหรับระบบ Authentication Sprint 1

## สถาปัตยกรรม

- **Framework**: SwiftUI (iOS 16+)
- **Pattern**: MVVM (Model-View-ViewModel)
- **Networking**: URLSession + async/await
- **Storage**: Keychain (Secure storage for JWT tokens)

## โครงสร้างโปรเจกต์

```
MobileApp/
├── App/
│   └── MobileApp.swift              # App Entry Point
├── Models/
│   ├── User.swift                   # User model
│   ├── AuthResponse.swift           # Auth API responses
│   └── APIError.swift               # Error handling
├── Services/
│   ├── AuthService.swift            # Authentication logic
│   └── NetworkManager.swift         # Network layer
├── ViewModels/
│   ├── LoginViewModel.swift         # Login logic
│   ├── RegisterViewModel.swift      # Registration logic
│   └── ProfileViewModel.swift       # Profile logic
├── Views/
│   ├── Auth/
│   │   ├── OnboardingView.swift     # 3-screen onboarding
│   │   ├── LoginView.swift          # Login screen
│   │   ├── RegisterView.swift       # Registration screen
│   │   └── ForgotPasswordView.swift # Forgot password
│   └── Main/
│       └── ProfileView.swift        # User profile
├── Components/
│   ├── CustomTextField.swift        # Reusable text input
│   ├── PrimaryButton.swift          # Reusable buttons
│   └── LoadingView.swift            # Loading states
└── Utils/
    ├── KeychainHelper.swift         # Secure keychain storage
    └── Validators.swift             # Form validation
```

## Features

1. ✅ **Onboarding Flow** - 3 หน้าจอแนะนำแอพ
2. ✅ **Login Screen** - Email, password พร้อม validation
3. ✅ **Register Screen** - สมัครสมาชิก พร้อม confirm password
4. ✅ **Forgot Password** - ส่งลิงก์รีเซ็ตรหัสผ่าน
5. ✅ **Profile View** - แสดงข้อมูล user และสถิติ
6. ✅ **JWT Token Storage** - เก็บ token ใน Keychain
7. ✅ **Auto-login** - ตรวจสอบ token อัตโนมัติ

## Backend Integration

- **Base URL**: `http://localhost:3000/api`
- **Endpoints**:
  - `POST /auth/login` - Login
  - `POST /auth/register` - Register
  - `POST /auth/refresh` - Refresh token
  - `POST /auth/forgot-password` - Forgot password
  - `GET /users/me` - Get current user

## วิธี Build

### วิธีที่ 1: เปิดใน Xcode โดยตรง

1. เปิด Xcode
2. File → Open Folder...
3. เลือกโฟลเดอร์ `MobileApp/`
4. Xcode จะสร้าง project อัตโนมัติจาก Swift Package

### วิธีที่ 2: สร้าง Xcode Project

```bash
cd MobileApp
swift package generate-xcodeproj  # หากต้องการ .xcodeproj
```

### วิธีที่ 3: Build ผ่าน Command Line

```bash
cd MobileApp
swift build
```

## การตั้งค่า Development

### 1. Backend Server

ตรวจสอบว่า backend รันอยู่ที่ `http://localhost:3000`

```bash
# ในโฟลเดอร์ backend
npm run dev
```

### 2. iOS Simulator

1. ใน Xcode: Product → Destination → เลือก iPhone Simulator
2. Run (⌘+R)

### 3. Network Configuration

ไฟล์ `Info.plist` มีการตั้งค่า `NSAllowsArbitraryLoads` เพื่ออนุญาตให้เชื่อมต่อ HTTP (localhost)

**หมายเหตุ**: สำหรับ production ควรใช้ HTTPS เท่านั้น

## Form Validation

### Login
- Email: ต้องเป็นรูปแบบ email ที่ถูกต้อง
- Password: ต้องไม่ว่างเปล่า

### Register
- Name: ต้องไม่ว่างเปล่า
- Email: ต้องเป็นรูปแบบ email ที่ถูกต้อง
- Password: ขั้นต่ำ 8 ตัวอักษร
- Confirm Password: ต้องตรงกับ password

## Security

- JWT Access Token: เก็บใน Keychain
- Refresh Token: เก็บใน Keychain
- User Data: เก็บใน Keychain (encoded JSON)
- ไม่มีการเก็บ sensitive data ใน UserDefaults

## Testing

```bash
# Run unit tests
swift test

# หรือใน Xcode: Product → Test (⌘+U)
```

## Preview

ทุก View มี `#Preview` สามารถดู preview ได้ใน Xcode Canvas

```swift
#Preview {
    LoginView()
}
```

## ข้อควรระวัง

1. **localhost**: ใช้ได้เฉพาะใน Simulator เท่านั้น สำหรับ device จริงต้องใช้ IP address ของเครื่อง หรือ deploy backend
2. **ATS**: สำหรับ production ต้องใช้ HTTPS และลบ `NSAllowsArbitraryLoads`
3. **Keychain**: ข้อมูลใน keychain จะคงอยู่แม้ลบแอพ ต้องมีการจัดการ clean up ที่เหมาะสม

## License

Internal Use Only
