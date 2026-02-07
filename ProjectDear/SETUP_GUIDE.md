# 🚀 Setup Guide - Gold Scalping Bot

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง MetaTrader 5

#### macOS
```bash
# ดาวน์โหลดจาก: https://www.metatrader5.com/en/download
# หรือ
brew install --cask metatrader5
```

#### Windows
ดาวน์โหลดจาก: https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe

---

### 2. สมัคร Demo Account

เลือก broker ที่รองรับ MT5 (แนะนำ):

#### Option 1: Exness (แนะนำ - spread ต่ำ)
1. ไปที่: https://www.exness.com/a/demo-account
2. กรอกข้อมูล:
   - Account type: **Standard**
   - Currency: **USD**
   - Leverage: **1:100**
   - Balance: **$300**
3. จดข้อมูล:
   - Login (เลขบัญชี)
   - Password
   - Server: `Exness-MT5Trial` หรือ `ExnessDemo-MT5`

#### Option 2: XM
1. ไปที่: https://www.xm.com/demo-account
2. เลือก MT5, USD, $300
3. จด login/password/server

#### Option 3: IC Markets
1. ไปที่: https://www.icmarkets.com/global/en/open-demo-account
2. เลือก MT5 Demo
3. จด login/password/server

---

### 3. Login MT5

1. เปิด MetaTrader 5
2. File → Login to Trade Account
3. ใส่ Login/Password/Server จาก broker
4. ✅ เชื่อมต่อสำเร็จ → เห็น balance $300

---

### 4. ติดตั้ง Python Dependencies

```bash
cd ProjectDear

# ติดตั้ง dependencies
pip install -r requirements.txt
```

**หมายเหตุ:** TA-Lib อาจต้องติดตั้งแยก:

#### macOS
```bash
brew install ta-lib
pip install TA-Lib
```

#### Windows
ดาวน์โหลด wheel จาก: https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib
```bash
pip install TA_Lib‑0.4.XX‑cpXX‑cpXXm‑win_amd64.whl
```

---

### 5. แก้ไข config.json

```json
{
  "mt5": {
    "login": 12345678,              // ← ใส่ demo account login
    "password": "YourPassword",     // ← ใส่ password
    "server": "Exness-MT5Trial",    // ← ใส่ server name
    "path": "/Applications/MetaTrader 5.app"  // macOS
    // "path": "C:\\Program Files\\MetaTrader 5\\terminal64.exe"  // Windows
  },
  ...
}
```

---

### 6. ทดสอบการเชื่อมต่อ

```bash
python -c "from broker import MT5Broker; import json; config = json.load(open('config.json')); broker = MT5Broker(config); broker.connect()"
```

ถ้าเห็น:
```
✅ Connected to MT5
   Account: 12345678
   Balance: $300.00
   Server: Exness-MT5Trial
```
= **พร้อมแล้ว!** 🎉

---

### 7. รัน Bot

```bash
python bot.py
```

Expected output:
```
🤖 Gold Scalping Bot initialized
   Symbol: XAUUSD
   Risk: 2.0% per trade
   TP/SL: 30/15 pips

✅ Connected to MT5
   Account: 12345678
   Balance: $300.00
   Server: Exness-MT5Trial

🚀 Bot started! Monitoring market...
```

---

## 🛠️ Troubleshooting

### ❌ "MT5 connection failed"
- ตรวจสอบ login/password/server ใน config.json
- ลอง login ด้วยตัวเอง ผ่าน MT5 app ก่อน
- เช็คว่า MT5 app ปิดหรือยัง (บางครั้งต้องปิดก่อนรัน bot)

### ❌ "No module named 'MetaTrader5'"
```bash
pip install MetaTrader5
```

### ❌ "No module named 'talib'"
ติดตั้ง TA-Lib ตามขั้นตอนข้างบน

### ❌ "Symbol 'XAUUSD' not found"
- เปิด MT5 → Market Watch → คลิกขวา → Symbols
- หา "XAUUSD" (Gold vs USD) → Show
- Restart bot

---

## 📊 ตรวจสอบผลลัพธ์

### ใน Terminal
Bot จะแสดง real-time:
```
💰 Trade #1 executed!
   Type: BUY
   Price: 2650.50
   Lot: 0.04
   RSI: 42.31 | ATR: 2.15

✅ WIN: $12.00
📊 Daily P/L: $12.00
```

### ใน MT5 App
- **Terminal → Trade** = ดู open positions
- **Terminal → History** = ดู closed trades
- **Charts** = ดูกราฟ + indicator

### Log Files
- `logs/trades_YYYY-MM-DD.log` = รายละเอียดทุก trade
- `trades.db` = SQLite database (ใช้ DB Browser)

---

## ⚙️ ปรับแต่ง Strategy

แก้ใน `config.json`:

```json
{
  "strategy": {
    "risk_percent": 2.0,           // เพิ่ม = เสี่ยงมากขึ้น
    "stop_loss_pips": 15,          // ลด = เสี่ยง SL โดนง่าย
    "take_profit_pips": 30,        // เพิ่ม = รอกำไรนานขึ้น
    "max_trades_per_day": 5,       // จำกัดจำนวน trade
    "max_consecutive_losses": 3    // หยุดถ้าขาดทุนติด
  },
  "indicators": {
    "rsi_oversold": 30,            // ลด = signal น้อยลง
    "rsi_overbought": 70,          // เพิ่ม = signal น้อยลง
    "atr_threshold": 1.5           // เพิ่ม = เทรดแค่ตลาดผันผวนมาก
  }
}
```

บันทึกแล้ว restart bot

---

## 🎯 เป้าหมาย Demo

- **สัปดาห์แรก:** เรียนรู้ระบบ, ดูว่า strategy ทำงานยังไง
- **สัปดาห์ที่ 2:** ปรับแต่ง config ให้ win rate > 45%
- **เป้าหมาย:** กำไรสุทธิ 10-20%/สัปดาห์ อย่างต่อเนื่อง

**ถ้าผ่าน 2 สัปดาห์แล้วได้กำไรสม่ำเสมอ → พร้อม real account!**

---

## 📞 Support

มีปัญหา? บอกนายได้เลยครับ ผมช่วยแก้ให้!
