# HomeSync POC - Hardware Guide

## 📋 Shopping List

### อุปกรณ์หลัก

| Item | จำนวน | ราคาโดยประมาณ | หาซื้อที่ |
|------|--------|----------------|-----------|
| NodeMCU ESP8266 | 1 | 150-250 บาท | Shopee/Lazada |
| PZEM-004T v3.0 | 1 | 200-350 บาท | Shopee/Lazada |
| Relay Module 5V | 1 | 30-50 บาท | Shopee/Lazada |
| Jumper Wires (Male-Female) | 1 ชุด | 50 บาท | Shopee/Lazada |
| USB Cable (Micro USB) | 1 | มีอยู่แล้ว | - |
| 5V Power Adapter (2A) | 1 | 100-200 บาท | Shopee/Lazada |

### อุปกรณ์เสริม (Optional)

| Item | จำนวน | ราคาโดยประมาณ | หาซื้อที่ |
|------|--------|----------------|-----------|
| Multimeter | 1 | 300-800 บาท | Shopee/Lazada |
| Breadboard | 1 | 50-100 บาท | Shopee/Lazada |
| Electrical Box | 1 | 100-200 บาท | HomePro |
| Extension Cord (for testing) | 1 | 100-300 บาท | HomePro |

**รวมประมาณ:** 500-800 บาท (ไม่รวม optional)

---

## 🔌 Wiring Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        NodeMCU ESP8266                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 3V3  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  · │   │
│  │ GND  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  · │   │
│  │ D1   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  · │   │
│  │ D2   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  · │   │
│  │ D5   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  · │   │
│  │ 5V   ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  · │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
       │    │    │    │
       │    │    │    │
       │    │    │    └───────────┐
       │    │    │                │
       │    │    │    ┌───────────┴───────────┐
       │    │    │    │                       │
       │    │    │    ▼                       ▼
       │    │    │  ┌──────────┐        ┌──────────┐
       │    │    └──┤ PZEM TX  │        │ Relay IN │
       │    │       ├──────────┤        ├──────────┤
       │    └───────┤ PZEM RX  │        │ Relay GND│
       │            ├──────────┤        ├──────────┤
       └────────────┤ PZEM VCC │        │ Relay VCC│
                    ├──────────┤        └──────────┘
                    │ PZEM GND │
                    └──────────┘
```

### Pin Connections

| NodeMCU | PZEM-004T | Description |
|---------|-----------|-------------|
| 5V | VCC | Power supply |
| GND | GND | Ground |
| D1 | TX | Serial RX (NodeMCU receives) |
| D2 | RX | Serial TX (NodeMCU transmits) |

| NodeMCU | Relay | Description |
|---------|-------|-------------|
| D5 | IN | Control signal |
| GND | GND | Ground |
| 5V | VCC | Power supply |

---

## ⚡ Power Considerations

### วิธีต่อไฟ

**วิธีที่ 1: USB Power (สำหรับทดสอบ)**
- ใช้ USB cable ต่อกับ computer หรือ adapter
- จ่ายไฟ 5V ผ่าน USB
- **ข้อจำกัด:** กระแสจำกัด (max ~500mA)

**วิธีที่ 2: External 5V Supply (แนะนำ)**
- ใช้ adapter 5V 2A
- ต่อเข้า pin 5V และ GND บน NodeMCU
- ต่อไฟ AC เข้า PZEM ตามปกติ

**⚠️ คำเตือน:**
- PZEM-004T ต่อไฟ AC 220V - **ระวังอันตรายจากไฟฟ้า!**
- ถ้าไม่มั่นใจ ให้ consult ช่างไฟฟ้า
- ทดสอบกับ load ที่ปลอดภัยก่อน (เช่น หลอดไฟ)

---

## 🔧 Assembly Steps

### Step 1: ต่อ PZEM-004T กับ NodeMCU
1. ต่อสายไฟเลี้ยง (5V, GND)
2. ต่อสายสัญญาณ (D1→TX, D2→RX)
3. **ระวัง:** TX/RX ต้อง cross (TX ของอันนึง → RX ของอีกอัน)

### Step 2: ต่อ Relay กับ NodeMCU
1. ต่อ VCC → 5V
2. ต่อ GND → GND
3. ต่อ IN → D5

### Step 3: ต่อไฟ AC (ให้ช่างทำ หรือทำด้วยความระมัดระวัง)
1. ต่อสาย Line (L) เข้า PZEM L-in
2. ต่อสายจาก PZEM L-out ไป Load
3. ต่อสาย Neutral (N) เข้า PZEM N-in
4. ต่อสายจาก PZEM N-out ไป Load

### Step 4: ทดสอบ
1. เปิด Serial Monitor (115200 baud)
2. Upload firmware
3. ดู output ว่าอ่านค่าได้หรือไม่

---

## 📸 Assembly Photos

[เพิ่มรูปภาพตามจริงหลังจากประกอบ]

---

## 🐛 Common Hardware Issues

### Issue 1: PZEM ไม่ตอบสนอง
**Symptoms:** Serial แสดง "Error reading voltage"

**Solutions:**
1. ตรวจสอบ wiring TX/RX
2. ตรวจสอบว่าได้รับไฟ 5V
3. ลองสลับ TX/RX
4. Reset PZEM (ถอดปลั๊กไฟ AC แล้วเสียบใหม่)

### Issue 2: WiFi ไม่เชื่อมต่อ
**Symptoms:** "Connecting to WiFi..." นานๆ

**Solutions:**
1. ตรวจสอบ SSID/Password
2. ตรวจสอบว่าเป็น 2.4GHz (ESP8266 ไม่รองรับ 5GHz)
3. ย้าย NodeMCU ใกล้ router
4. ลองกดปุ่ม RST บน NodeMCU

### Issue 3: Relay ไม่ทำงาน
**Symptoms:** สั่ง ON แต่ไม่ได้ยินเสียง click

**Solutions:**
1. ตรวจสอบ wiring (VCC, GND, IN)
2. ตรวจสอบว่า relay เป็น active HIGH หรือ LOW
3. ลองสลับ IN pin
4. ทดสอบ relay โดยตรง (ต่อ VCC→IN ชั่วคราว)

---

## 📝 Bill of Materials (สำหรับสั่งซื้อ)

### Shopee/Lazada Links (ตัวอย่าง)

**NodeMCU ESP8266**
- ค้นหา: "NodeMCU ESP8266 V3 CH340"
- ราคา: ~150-200 บาท

**PZEM-004T v3.0**
- ค้นหา: "PZEM-004T v3.0 มิเตอร์วัดไฟ AC"
- ราคา: ~200-300 บาท
- **ระวัง:** ซื้อ version 3.0 เท่านั้น

**Relay Module**
- ค้นหา: "Relay Module 5V 1 Channel"
- ราคา: ~30-50 บาท

**Jumper Wires**
- ค้นหา: "Jumper Wire สายไฟจัมเปอร์"
- แนะนำ: ซื้อแบบ Male-Female (M-F)

---

## 🔒 Safety Notes

⚠️ **ข้อควรระวังเรื่องความปลอดภัย:**

1. **ไฟ AC 220V อันตรายถึงชีวิต**
   - ถ้าไม่มีประสบการณ์ ให้ปรึกษาช่างไฟฟ้า
   - อย่าแตะส่วนที่เป็นโลหะเมื่อต่อไฟ
   - ใช้ electrical tape หุ้มข้อต่อ

2. **Load Testing**
   - เริ่มจาก load เล็กๆ (หลอดไฟ)
   - อย่าใช้กับเครื่องใช้ไฟฟ้าที่มีมอเตอร์ใหญ่

3. **Enclosure**
   - ใช้กล่องปิดสนิท
   - ติดฉลาก "มีแรงดันไฟฟ้า"

4. **Fuse/Circuit Breaker**
   - ควรมี fuse หรือ breaker ก่อน PZEM
   - กันช็อต/กันไฟเกิน
