# IoT Energy Monitoring Research Report
## โดย ปัน (iOS Native Developer) - Mobile Development Team

**วันที่:** 6 กุมภาพันธ์ 2026  
**หัวข้อ:** การใช้งานอุปกรณ์ IoT และ Sensor สำหรับ Monitor ไฟฟ้าผ่าน MQTT

---

## 1. อุปกรณ์/Adapter ที่นิยมใช้วัดการใช้ไฟฟ้า (ที่รองรับ MQTT)

### 1.1 Smart Plug with Energy Monitoring

| อุปกรณ์ | ยี่ห้อ | ข้อดี | ราคาประมาณ |
|---------|--------|-------|-------------|
| Shelly Plug S / Plus | Shelly | Tasmota compatible, Local API, เปิดเผย Protocol | ฿400-700 |
| Sonoff POW R3 / POW Elite | Sonoff | ราคาถูก, วัดได้แม่นยำ, Tasmota support | ฿350-600 |
| TP-Link Kasa EP25 | TP-Link | แอพดี, Matter support, Energy monitoring | ฿450-650 |
| Eve Energy | Eve | HomeKit native, Thread/Matter, Privacy focus | ฿1,200-1,500 |
| Fibaro Wall Plug | Fibaro | Z-Wave, สวยงาม, LED ring indicator | ฿1,500-2,000 |
| Aeotec Smart Switch 7 | Aeotec | Z-Wave, คุณภาพสูง | ฿1,800-2,500 |

### 1.2 Energy Monitor / Clamp Meter

| อุปกรณ์ | ยี่ห้อ | ใช้สำหรับ | ราคาประมาณ |
|---------|--------|-----------|-------------|
| Shelly EM / 3EM | Shelly | วัดเฟสเดียว/สามเฟส ที่ตู้ไฟหลัก | ฿800-1,500 |
| Iotawatt | Open Source | หลาย channel, Open source, ยืดหยุ่นมาก | ฿3,000-4,500 |
| Emporia Vue | Emporia | หลาย channel, Cloud + Local API | ฿2,500-4,000 |
| Home Assistant Glow | DIY | Pulse meter จากไฟกระพริบ | ฿200-400 |
| PZEM-004T + ESP32 | DIY | วัดเฟสเดียว, ราคาถูก | ฿150-300 |
| SDM120 / SDM630 | Eastron | Modbus RS485, อุตสาหกรรม | ฿1,500-5,000 |

### 1.3 DIY/Development Board

| อุปกรณ์ | รายละเอียด | ราคา |
|---------|------------|------|
| ESP32 + CT Sensor (SCT-013) | ต่อเอง, ยืดหยุ่นสูง | ฿100-200 |
| ESP32 + PZEM-004T | วัด V, A, W, Wh, PF, Hz | ฿150-250 |
| NodeMCU + ADS1115 + CT | ราคาถูกสุด | ฿80-150 |

---

## 2. ตัวอย่างอุปกรณ์ยอดนิยม พร้อมราคาและความสามารถ

### 2.1 Shelly Series (แนะนำสูงสุดสำหรับ Commercial Project)

#### Shelly Plug S (Gen 2)
- **ราคา:** ~฿400-500
- **ความสามารถ:**
  - วัดพลังงาน: Power (W), Voltage (V), Current (A), Energy (Wh)
  - Switch control ผ่าน MQTT/HTTP/Bluetooth
  - Local API (ไม่ต้องพึ่ง Cloud)
  - OTA update
  - Overload protection (16A)
  - Schedule & Timer built-in
- **MQTT:** Native support ไม่ต้อง Flash firmware
- **ข้อดี:** API เปิดเผย, มีเอกสารละเอียด, บริษัทจากบัลแกเรีย

#### Shelly Plug Plus (US/EU)
- **ราคา:** ~฿550-700
- **ความสามารถ:**
  - Bluetooth gateway (สามารถ control Shelly BLU devices)
  - Scripting support (JavaScript-like)
  - All features of Plug S + better hardware
  - Matter support (firmware update)

#### Shelly EM
- **ราคา:** ~฿900-1,100
- **ความสามารถ:**
  - 2 channels CT clamp
  - วัดได้สูงสุด 120A ต่อ channel
  - สำหรับตู้ไฟหลัก (Main breaker)
  - Real-time power monitoring

#### Shelly 3EM
- **ราคา:** ~฿1,300-1,600
- **ความสามารถ:**
  - 3-phase monitoring (3 channels)
  - สำหรับบ้าน/อาคารที่ใช้ไฟ 3 เฟส
  - วัดแยกแต่ละ phase

### 2.2 Sonoff Series (คุ้มค่า ราคาถูก)

#### Sonoff POW R3 (POW Elite)
- **ราคา:** ~฿450-600
- **ความสามารถ:**
  - วัด Power, Voltage, Current
  - LCD Display บนตัวเครื่อง (ดูค่าได้เลย)
  - eWeLink app (Cloud)
  - Flash Tasmota/ESPHome ได้
  - รองรับ 16A
- **MQTT:** ผ่าน Tasmota หรือ eWeLink API

#### Sonoff POW R2
- **ราคา:** ~฿350-450
- **ความสามารถ:**
  - Basic power monitoring
  - ไม่มี display
  - Flash Tasmota ได้

#### Sonoff SPM (Smart Power Manager)
- **ราคา:** ~฿2,000-3,000 (รวม base + modules)
- **ความสามารถ:**
  - 4-32 channels
  - DIN rail mount
  - สำหรับตู้ไฟ

### 2.3 Tasmota Devices (Open Source Firmware)

Tasmota คือ Open source firmware สำหรับ ESP8266/ESP32 devices ไม่ใช่แบรนด์อุปกรณ์ แต่เป็น firmware ที่ flash แทน firmware ของผู้ผลิต

**อุปกรณ์ที่รองรับ Tasmota:**
- Sonoff ทุกรุ่น
- Shelly ทุกรุ่น (แต่ Shelly มี firmware ตัวเองดีอยู่แล้ว)
- Tuya-based devices (หลายร้อยรุ่น)
- Athom devices
- Athom Plug V2 (Tasmota pre-flashed)
  - **ราคา:** ~฿400-500
  - **ความสามารถ:** Tasmota ติดมาจากโรงงาน

**ทำไมต้อง Tasmota:**
- ไม่พึ่ง Cloud ของผู้ผลิต
- ควบคุมทั้งหมดผ่าน MQTT/HTTP
- ไม่มี phoning home
- Community ใหญ่มาก

### 2.4 ESP32-Based DIY

#### ESP32 + PZEM-004T Module
- **ราคา:** ~฿150-250
- **ความสามารถ:**
  - วัด AC Voltage (80-260V)
  - Current (0-100A)
  - Active Power
  - Energy (kWh)
  - Power Factor
  - Frequency
  - Modbus RTU interface
- **การต่อ:** ESP32 UART → PZEM-004T

#### ESP32 + SCT-013 CT Clamp
- **ราคา:** ~฿100-180
- **ความสามารถ:**
  - วัด Current อย่างเดียว (ต้องคำนวณ Power เอง)
  - หลายขนาด: 10A, 20A, 30A, 50A, 100A
  - Output: 0-1V หรือ 0-50mA

---

## 3. การ Setup อุปกรณ์ให้ส่งข้อมูลผ่าน MQTT

### 3.1 Shelly Devices (ง่ายที่สุด)

**ขั้นตอน:**
1. ต่อ Shelly เข้า WiFi (ผ่าน Shelly app หรือ AP mode)
2. เข้า Web UI (หา IP จาก router หรือ Shelly app)
3. ไปที่ Settings → MQTT
4. Enable MQTT
5. กรอกข้อมูล MQTT Broker:
   - Server: `mqtt.yourdomain.com` หรือ IP
   - Port: `1883` (หรือ `8883` สำหรับ TLS)
   - Username/Password (ถ้ามี)
   - Client ID: `shelly-plug-001` (ตั้งเอง)
6. Save

**Shelly MQTT Topics เริ่มต้น:**
```
shellyplug-s-123456/status/switch:0    # สถานะ switch
shellyplug-s-123456/status/em:0        # ข้อมูลพลังงาน
shellyplug-s-123456/events/rpc         # Events ทั้งหมด
```

**RPC over MQTT (Shelly Gen 2):**
```
# สั่งเปิด/ปิด
Topic: shellyplug-s-123456/rpc
Payload: {"id":1, "src":"user_1", "method":"Switch.Set", "params":{"id":0,"on":true}}

# ขอข้อมูล status
Topic: shellyplug-s-123456/rpc
Payload: {"id":2, "src":"user_1", "method":"Switch.GetStatus", "params":{"id":0}}
```

### 3.2 Sonoff with Tasmota

**Flash Tasmota:**
1. ใช้ Tasmota Web Installer: https://tasmota.github.io/install/
2. หรือ Tuya-Convert (OTA ไม่ต้องแกะเครื่อง)
3. หรือ Serial flash ด้วย USB-TTL

**Setup MQTT ใน Tasmota:**
1. เข้า Web UI (เชื่อมต่อ WiFi ก่อน)
2. Configuration → Configure MQTT
3. กรอก:
   - Host: `mqtt.yourdomain.com`
   - Port: `1883`
   - Client: `tasmota_%06X` (auto)
   - Topic: `tasmota_plug_01`
   - Full Topic: `%prefix%/%topic%/`
4. Save → Restart

**Tasmota จะ publish ที่:**
```
tele/tasmota_plug_01/SENSOR    # ข้อมูล sensor ทุก TelePeriod (default 300s)
tele/tasmota_plug_01/STATE     # สถานะทั่วไป
stat/tasmota_plug_01/RESULT    # ผลลัพธ์จาก command
cmnd/tasmota_plug_01/POWER     # สั่งควบคุม
```

### 3.3 ESP32 + Arduino/PlatformIO

**ตัวอย่าง Code (Arduino):**
```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASS";
const char* mqtt_server = "mqtt.yourdomain.com";

WiFiClient espClient;
PubSubClient client(espClient);
PZEM004Tv30 pzem(&Serial2, 16, 17);  // RX, TX

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32_PZEM_001")) {
      // Connected
    } else {
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  float pf = pzem.pf();
  float frequency = pzem.frequency();

  // สร้าง JSON payload
  String payload = "{";
  payload += "\"voltage\":" + String(voltage) + ",";
  payload += "\"current\":" + String(current) + ",";
  payload += "\"power\":" + String(power) + ",";
  payload += "\"energy\":" + String(energy) + ",";
  payload += "\"pf\":" + String(pf) + ",";
  payload += "\"frequency\":" + String(frequency);
  payload += "}";

  client.publish("home/energy/plug01", payload.c_str());
  
  delay(5000);  // ส่งทุก 5 วินาที
}
```

### 3.4 Home Assistant + MQTT Integration

**MQTT Discovery (Auto-configure):**
Shelly, Tasmota, ESPHome รองรับ MQTT Discovery ทำให้ Home Assistant จดจำอุปกรณ์อัตโนมัติ

---

## 4. Data Format (JSON Structure)

### 4.1 Shelly Gen 2 (RPC Format)

**Energy Data (จาก `status/em:0`):**
```json
{
  "id": 0,
  "a_current": 2.345,
  "a_voltage": 223.5,
  "a_act_power": 523.4,
  "a_aprt_power": 523.8,
  "a_pf": 0.98,
  "a_freq": 50.0,
  "total_current": 2.345,
  "total_act_power": 523.4,
  "total_aprt_power": 523.8
}
```

**Switch Status:**
```json
{
  "id": 0,
  "source": "init",
  "output": true,
  "apower": 523.4,
  "voltage": 223.5,
  "current": 2.345,
  "aenergy": {
    "total": 15234.567,
    "by_minute": [523.4, 520.1, 518.3],
    "minute_ts": 1707232800
  },
  "temperature": {
    "tC": 42.5,
    "tF": 108.5
  }
}
```

### 4.2 Tasmota

**SENSOR Message:**
```json
{
  "Time": "2024-02-06T21:15:30",
  "ENERGY": {
    "TotalStartTime": "2024-01-01T00:00:00",
    "Total": 15234.567,
    "Yesterday": 12.345,
    "Today": 8.234,
    "Period": 3,
    "Power": 523,
    "ApparentPower": 534,
    "ReactivePower": 108,
    "Factor": 0.98,
    "Voltage": 223,
    "Current": 2.345
  }
}
```

**STATE Message:**
```json
{
  "Time": "2024-02-06T21:15:30",
  "Uptime": "3T12:34:56",
  "UptimeSec": 302096,
  "Heap": 28,
  "SleepMode": "Dynamic",
  "Sleep": 50,
  "LoadAvg": 19,
  "MqttCount": 12,
  "POWER": "ON",
  "Wifi": {
    "AP": 1,
    "SSId": "YourWiFi",
    "BSSId": "AA:BB:CC:DD:EE:FF",
    "Channel": 6,
    "Mode": "11n",
    "RSSI": 78,
    "Signal": -61,
    "LinkCount": 1,
    "Downtime": "0T00:00:06"
  }
}
```

### 4.3 ESPHome (สำหรับ ESP32 DIY)

```json
{
  "id": "esp32-pzem-001",
  "state": "ON",
  "value": 523.4,
  "voltage": 223.5,
  "current": 2.345,
  "power": 523.4,
  "energy": 15234.567,
  "power_factor": 0.98,
  "frequency": 50.0
}
```

### 4.4 PZEM-004T Raw Data (ถ้าอ่านผ่าน Modbus)

```json
{
  "device_id": "pzem_001",
  "timestamp": 1707232800,
  "voltage": 223.5,
  "current": 2.345,
  "power": 523.4,
  "energy": 15234.567,
  "frequency": 50.0,
  "power_factor": 0.98,
  "alarm_status": false
}
```

### 4.5 Summary of Data Fields

| Field | Unit | Shelly | Tasmota | ESPHome | PZEM |
|-------|------|--------|---------|---------|------|
| Voltage | V | ✅ | ✅ | ✅ | ✅ |
| Current | A | ✅ | ✅ | ✅ | ✅ |
| Active Power | W | ✅ | ✅ | ✅ | ✅ |
| Apparent Power | VA | ✅ | ✅ | ✅ | ❌ |
| Reactive Power | VAR | ❌ | ✅ | ✅ | ❌ |
| Power Factor | 0-1 | ✅ | ✅ | ✅ | ✅ |
| Energy Total | kWh | ✅ | ✅ | ✅ | ✅ |
| Energy Daily | kWh | ✅ | ✅ | ✅ | ❌ |
| Frequency | Hz | ✅ | ❌ | ✅ | ✅ |
| Temperature | °C | ✅ | ✅ | ✅ | ❌ |

---

## 5. ความท้าทายในการ Integrate กับอุปกรณ์หลากหลายยี่ห้อ

### 5.1 Data Format Inconsistency

**ปัญหา:**
- แต่ละยี่ห้อใช้ JSON structure ต่างกัน
- Field names ไม่เหมือนกัน (voltage vs V vs volt)
- Units อาจต่างกัน (W vs kW, Wh vs kWh)
- Timestamp formats แตกต่าง (Unix timestamp vs ISO 8601)

**แนวทางแก้ไข:**
```javascript
// Normalization Layer
function normalizeEnergyData(rawData, deviceType) {
  switch(deviceType) {
    case 'shelly':
      return {
        voltage: rawData.a_voltage,
        current: rawData.a_current,
        power: rawData.a_act_power,
        energy: rawData.aenergy?.total,
        timestamp: Date.now()
      };
    case 'tasmota':
      return {
        voltage: rawData.ENERGY?.Voltage,
        current: rawData.ENERGY?.Current,
        power: rawData.ENERGY?.Power,
        energy: rawData.ENERGY?.Total,
        timestamp: Date.now()
      };
    // ... อื่นๆ
  }
}
```

### 5.2 Topic Structure Differences

| ยี่ห้อ | Topic Pattern |
|--------|---------------|
| Shelly | `shelly{device}-{id}/status/{component}` |
| Tasmota | `tele/{topic}/SENSOR` |
| ESPHome | `{device_name}/sensor/{entity}/state` |
| Custom ESP32 | แล้วแต่ implement |

**แนวทางแก้ไข:**
- ใช้ MQTT topic mapping configuration
- หรือใช้ wildcard subscription: `+/+/+/SENSOR`
- สร้าง abstraction layer รับทุก topic แล้ว route ตาม device type

### 5.3 Update Frequency Variations

**ปัญหา:**
- Shelly: อัพเดทตอนมีการเปลี่ยนแปลง หรือ poll ได้
- Tasmota: TelePeriod default 300s (5 นาที)
- บางอุปกรณ์ push ทุกวินาที บางตัว push ทุกนาที

**แนวทางแก้ไข:**
- ตั้งค่าให้เหมือนกันทุกตัว (ถ้าทำได้)
- หรือรับข้อมูลตามที่มัน push แล้ว interpolate เอง
- ใช้ last-wins strategy ใน database

### 5.4 Authentication & Security

**ปัญหา:**
- บางอุปกรณ์ไม่รองรับ TLS (MQTT over SSL)
- Certificate management บน embedded device ยาก
- Username/password storage บนอุปกรณ์ไม่ปลอดภัยเท่า

**แนวทางแก้ไข:**
- ใช้ local MQTT broker (mosquitto) ใน network
- แยก VLAN สำหรับ IoT devices
- ใช้ mTLS ถ้าอุปกรณ์รองรับ

### 5.5 Firmware Variations

**ปัญหา:**
- Shelly Gen 1 vs Gen 2 API ต่างกันมาก
- Tasmota version เก่า/ใหม่มี features ต่างกัน
- OTA update อาจทำให้ API เปลี่ยน

**แนวทางแก้ไข:**
- ล็อค firmware version สำหรับ production
- ทำ versioning ใน code
- Test กับ firmware หลาย version

### 5.6 Network Reliability

**ปัญหา:**
- WiFi หลุดบ่อย (IoT devices มี antenna เล็ก)
- MQTT reconnect logic ต่างกัน
- Message loss ตอน offline

**แนวทางแก้ไข:**
- ใช้ MQTT QoS 1 หรือ 2
- ตั้งค่า Last Will and Testament (LWT)
- มี heartbeat checking ในแอพ

### 5.7 Discovery & Provisioning

**ปัญหา:**
- อุปกรณ์ใหม่ต้อง pairing process ที่ต่างกัน
- ผู้ใช้ต้องรู้ IP หรือ hostname
- Manual configuration ยุ่งยาก

**แนวทางแก้ไข:**
- ใช้ mDNS discovery (Shelly, ESPHome)
- สร้าง QR code scanning สำหรับ provisioning
- Auto-detect device type จาก topic pattern

---

## 6. อุปกรณ์ที่แนะนำสำหรับ POC/Prototype

### 6.1 สำหรับ POC ขนาดเล็ก (1-5 จุด)

**แนะนำ: Shelly Plug S (2-3 ตัว)**
- **เหตุผล:**
  - ไม่ต้อง flash firmware
  - MQTT ทำงานได้เลย
  - เอกสารครบ
  - ราคาเหมาะสม
  - มี Cloud สำรอง (ถ้าต้องการ)
- **ราคา:** ~฿400-500 x 3 = ~฿1,200-1,500

**วิธีเริ่มต้น:**
1. ซื้อ Shelly Plug S 3 ตัว
2. ตั้งค่า MQTT ชี้มาที่ server
3. Subscribe topic: `shellyplug-s-+/status/+`
4. เริ่มรับข้อมูลได้ทันที

### 6.2 สำหรับ POC ขนาดกลาง (5-20 จุด)

**แนะนำ: ผสมผสาน**
- Shelly Plug S (10A loads): 3-5 ตัว
- Shelly Plus Plug (ควบคุมผ่าน Bluetooth ได้): 2-3 ตัว
- Shelly EM (Main breaker): 1 ตัว
- **ราคารวม:** ~฿3,000-4,500

### 6.3 สำหรับต้นทุนต่ำสุด (DIY Focus)

**แนะนำ: ESP32 + PZEM-004T (3-5 ชุด)**
- **ราคา:** ~฿150 x 5 = ~฿750
- **ข้อดี:** ควบคุมทุกอย่างได้เอง
- **ข้อเสีย:** ต้องประกอบเอง, ไม่มีเคส

### 6.4 สำหรับ Production Ready

**แนะนำ: Shelly ทั้งระบบ**
- Shelly 3EM (ตู้ไฟหลัก)
- Shelly Plug Plus (outlet สำคัญ)
- Shelly Plus 1PM (hardwired appliances)
- **เหตุผล:**
  - CE certified
  - Local API (ไม่พึ่ง Cloud)
  - มี warranty
  - OTA update สะดวก

### 6.5 สำหรับ Enterprise/Industrial

**แนะนำ:**
- Eastron SDM630 (Modbus, DIN rail)
- Iotawatt (Open source, หลาย channel)
- + ESP32/RPi เป็น MQTT gateway

---

## 7. MQTT Broker Recommendation

### สำหรับ POC/Development
- **Mosquitto** (Raspberry Pi/Cloud VM)
- **EMQX** (เวอร์ชั่น Community)
- **HiveMQ** (Free tier 100 devices)

### สำหรับ Production
- **EMQX** (Clustering, High availability)
- **HiveMQ** (Enterprise)
- **AWS IoT Core** (ถ้าใช้ AWS)
- **Azure IoT Hub** (ถ้าใช้ Azure)

---

## 8. iOS App Integration Considerations

### 8.1 MQTT Libraries สำหรับ iOS
- **CocoaMQTT** (Swift native)
- **MQTTClient** (Objective-C)
- **MQTTNIO** (Swift NIO-based)

### 8.2 Architecture แนะนำ
```
[IoT Device] → [MQTT Broker] → [Backend/API] → [iOS App]
                        ↓
                   [Database]
```
- iOS App ควรคุยกับ Backend API มากกว่าต่อ MQTT ตรง
- หรือใช้ MQTT แบบ publish-only (control) subscribe ผ่าน backend

### 8.3 Security
- อย่า hardcode MQTT credentials ในแอพ
- ใช้ Token-based authentication (JWT)
- TLS/SSL สำหรับทุก connection

---

## 9. สรุป Recommendation

### เริ่มต้นเร็วที่สุด (Quick Win)
👉 **Shelly Plug S 3 ตัว** (~฿1,500) + Mosquitto on Raspberry Pi

### คุ้มค่าที่สุด (Best Value)
👉 **Sonoff POW R3 + Flash Tasmota** (~฿450 ต่อตัว)

### ยืดหยุ่นสูงสุด (Maximum Flexibility)
👉 **ESP32 + PZEM-004T** DIY (~฿150 ต่อจุด)

### Production Grade
👉 **Shelly ทั้งระบบ** (ราคาสูงขึ้นแต่ reliable)

---

## 10. References & Resources

- Shelly API Docs: https://shelly-api-docs.shelly.cloud/
- Tasmota Docs: https://tasmota.github.io/docs/
- ESPHome: https://esphome.io/
- PZEM-004T Library: https://github.com/mandulaj/PZEM-004T-v30
- MQTT Spec: https://mqtt.org/mqtt-specification/

---

**Report โดย:** ปัน (iOS Native Developer)  
**Team:** Mobile Development  
**Date:** 6 Feb 2026

หากมีคำถามเพิ่มเติมหรือต้องการ detail เฉพาะด้านสามารถสอบถามได้เลยครับ! 🙏
