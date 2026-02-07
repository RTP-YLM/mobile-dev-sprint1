# HomeSync POC Mobile

Flutter App สำหรับแสดง Dashboard ควบคุม Smart Device

## 📱 Features

- ✅ แสดงค่า Power (W), Voltage (V), Current (A) real-time
- ✅ ปุ่ม ON/OFF ควบคุม relay
- ✅ WebSocket สำหรับ real-time updates
- ✅ Fallback polling ทุก 5 วินาที
- ✅ Shimmer loading effect

## 🚀 Setup

### 1. ติดตั้ง Dependencies
```bash
flutter pub get
```

### 2. แก้ไข IP Address
ไฟล์ที่ต้องแก้:
- `lib/services/api_service.dart` - แก้ `baseUrl`
- `lib/services/websocket_service.dart` - แก้ `wsUrl`

```dart
// ถ้ารันบน Android Emulator
static const String baseUrl = 'http://10.0.2.2:3000';

// ถ้ารันบน iOS Simulator
static const String baseUrl = 'http://localhost:3000';

// ถ้ารันบน Device จริง
static const String baseUrl = 'http://192.168.1.XXX:3000';  // IP ของเครื่อง Backend
```

### 3. รัน App
```bash
# Android
flutter run

# iOS (ต้องมี Xcode)
flutter run -d ios
```

## 📂 Project Structure

```
lib/
├── blocs/           # BLoC Pattern (State Management)
├── models/          # Data Models
├── screens/         # UI Screens
├── services/        # API & WebSocket Services
├── widgets/         # Reusable Widgets
└── main.dart
```

## 🏗 Architecture

- **State Management**: flutter_bloc (BLoC Pattern)
- **Networking**: dio (HTTP), web_socket_channel (WebSocket)
- **UI**: Material 3 Design

## 🔧 Dependencies

| Package | Purpose |
|---------|---------|
| flutter_bloc | State Management |
| dio | HTTP Client |
| web_socket_channel | WebSocket |
| flutter_switch | Toggle Switch UI |
| shimmer | Loading Effect |
| fl_chart | Charts (สำหรับขยายในอนาคต) |
| logger | Debug Logging |

## 🧪 Testing

```bash
# Run unit tests
flutter test

# Run integration tests
flutter drive --target=test_driver/app.dart
```

## 📱 Screenshots

[เพิ่ม screenshots ที่นี่หลังจากทดสอบ]

## 🐛 Troubleshooting

### ไม่สามารถเชื่อมต่อ Backend ได้
1. ตรวจสอบว่า Backend รันอยู่
2. ตรวจสอบ IP Address ให้ถูกต้อง
3. ตรวจสอบ firewall/network ระหว่าง device กับ backend

### WebSocket หลุดบ่อย
- ปกติจะ reconnect อัตโนมัติหลัง 5 วินาที
- ใช้ polling เป็น fallback

## 📝 Notes

- สำหรับ POC ไม่ต้อง Authentication
- ไม่มี local storage/cache
- UI เรียบง่าย เน้นใช้งานได้จริง
