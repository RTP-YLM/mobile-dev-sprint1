# HomeSync POC Firmware

Firmware สำหรับ NodeMCU ESP8266 + PZEM-004T + Relay

## 📋 Hardware Requirements

- NodeMCU ESP8266 (或 ESP-12E)
- PZEM-004T v3.0 (Power Sensor)
- Relay Module (5V)
- Jumper Wires
- 5V Power Supply

## 🔌 Wiring Diagram

```
NodeMCU 5V    → PZEM VCC
NodeMCU GND   → PZEM GND
NodeMCU D1    → PZEM TX  
NodeMCU D2    → PZEM RX
NodeMCU D5    → Relay IN
NodeMCU GND   → Relay GND
NodeMCU 5V    → Relay VCC (ถ้า relay ไม่มี external power)
```

## 🛠 Setup Options

### Option 1: PlatformIO (แนะนำ)

```bash
cd firmware
pio run --target upload
pio device monitor
```

### Option 2: Arduino IDE

1. ติดตั้ง Board ESP8266:
   - File → Preferences → Additional Boards Manager URLs:
   - Add: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - Tools → Board → Boards Manager → ค้นหา "ESP8266" → Install

2. ติดตั้ง Libraries:
   - Sketch → Include Library → Manage Libraries
   - ค้นหาและติดตั้ง:
     - "PubSubClient" by Nick O'Leary
     - "PZEM-004Tv30" by Peter Mandula

3. Select Board: `NodeMCU 1.0 (ESP-12E Module)`

4. เปิดไฟล์ `homesync_poc.ino` แล้ว Upload

## ⚙️ Configuration

แก้ไขไฟล์ `src/config.h` (PlatformIO) หรือ top ของ `.ino` file (Arduino IDE):

```cpp
#define WIFI_SSID       "Your_WiFi_Name"
#define WIFI_PASSWORD   "Your_WiFi_Password"

// HiveMQ Cloud - สมัครฟรีที่ https://www.hivemq.com/mqtt-cloud/
#define MQTT_BROKER     "your-cluster.hivemq.cloud"
#define MQTT_USER       "your-username"
#define MQTT_PASS       "your-password"
```

## 📡 MQTT Topics

| Topic | Direction | Payload |
|-------|-----------|---------|
| `homesync/poc/node1/telemetry/voltage` | Publish | `{"value":220.5}` |
| `homesync/poc/node1/telemetry/current` | Publish | `{"value":1.234}` |
| `homesync/poc/node1/telemetry/power` | Publish | `{"value":150.5}` |
| `homesync/poc/node1/command/relay` | Subscribe | `{"state":true}` |

## 🔧 Troubleshooting

### PZEM ไม่ตอบสนอง
- ตรวจสอบ wiring TX/RX (crossover: TX→RX, RX→TX)
- ตรวจสอบว่า PZEM ได้รับไฟ 5V
- ลอง reset NodeMCU

### MQTT Connection Failed
- ตรวจสอบ WiFi credentials
- ตรวจสอบ HiveMQ credentials
- ตรวจสอบ firewall (port 8883 ต้องเปิด)

### WiFi หลุดบ่อย
- เพิ่ม power supply ที่ stable
- ใช้ external antenna (ถ้ามี)
- ลด interval การส่งข้อมูล

## 📊 Serial Output

```
🏠 HomeSync POC - NodeMCU Starting...
Initializing PZEM-004T...
Connecting to WiFi: Your_WiFi
.....
✅ WiFi Connected!
IP Address: 192.168.1.XXX
Attempting MQTT connection...connected
Subscribed to: homesync/poc/node1/command/relay
✅ Setup complete!

📊 Reading sensors...
Voltage: 220.5 V
Current: 1.234 A
Power: 150.5 W
Energy: 0.123 kWh
Frequency: 50.0 Hz
PF: 0.95
✅ Published to MQTT
```
