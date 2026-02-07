# 🍏 Installation Guide - Apple Silicon (M1/M2/M3)

## เราจะใช้ SiliconMetaTrader5
Source: https://github.com/bahadirumutiscimen/silicon-metatrader5

Solution นี้รัน MT5 ผ่าน Docker + QEMU x86 emulation บน Mac

---

## ขั้นตอนติดตั้ง

### 1. ติดตั้ง Dependencies ✅
```bash
brew install colima docker qemu lima lima-additional-guestagents
```

### 2. เริ่ม Colima Engine
```bash
# ลบ config เก่า (ถ้ามี)
colima delete -f

# เริ่มใหม่ด้วย x86 emulation
colima start --arch x86_64 --vm-type=qemu --cpu 4 --memory 8
```
⏳ ใช้เวลา 2-3 นาที

### 3. ดาวน์โหลด MT5 Docker Setup
```bash
cd ProjectDear
git clone https://github.com/bahadirumutiscimen/silicon-metatrader5.git
cd silicon-metatrader5/docker
```

### 4. รัน MT5 Container
```bash
docker compose up --build
```
⏳ ครั้งแรกใช้เวลา 5-10 นาที (download + setup)

**หมายเหตุ:**
- เมื่อเห็น log ไหลมา = สำเร็จ
- กด Ctrl+C = หยุด MT5
- รันใหม่: `docker compose up` (ไม่ต้อง --build)

### 5. เข้า MT5 ผ่าน VNC
1. เปิดเบราว์เซอร์: http://localhost:6081/vnc.html
2. Password: `123456`
3. รอจน MT5 ขึ้น (อาจใช้เวลา 25-30 นาที ครั้งแรก!)
4. เข้า **File → Open an Account**
5. ค้นหา **Exness**
6. Login ด้วย:
   - Login: `415211240`
   - Password: `3605@Dear Sv.`
   - Server: `Exness-MT5Trial14`

### 6. ติดตั้ง Python Client
```bash
pip3 install siliconmetatrader5
```

### 7. ทดสอบการเชื่อมต่อ
```bash
cd ProjectDear
python3 test_silicon_mt5.py
```

---

## 🛠️ การใช้งานประจำวัน

### เปิดระบบ (เช้า)
```bash
# 1. เริ่ม Colima
colima start

# 2. เริ่ม MT5
cd ProjectDear/silicon-metatrader5/docker
docker compose up
```

### ปิดระบบ (เย็น)
```bash
# 1. หยุด MT5
Ctrl+C (หรือ docker compose down)

# 2. หยุด Colima (เพื่อเคลียร์ RAM)
colima stop
```

### รีเซ็ตระบบ (ถ้ามีปัญหา)
```bash
colima delete -f
colima start --arch x86_64 --vm-type=qemu --cpu 4 --memory 8
cd ProjectDear/silicon-metatrader5/docker
docker compose up --build
```

---

## 📊 สถานะการติดตั้ง

- [x] Homebrew
- [x] Docker
- [ ] Colima (กำลังติดตั้ง...)
- [ ] MT5 Container
- [ ] Python Client
- [ ] Connection Test

---

**Next:** รอ Colima ติดตั้งเสร็จ แล้วรันคำสั่งต่อไป
