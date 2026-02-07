# ระบบใบสั่งขายและจัดส่ง (Sales Order & Delivery)

## 1. ภาพรวม
ระบบสำหรับเปิดใบสั่งขาย ติดตามสถานะ และบันทึกการจัดส่ง

## 2. ผู้ใช้งาน
| Role | สิทธิ์ |
|------|-------|
| Sales | เปิด SO, ดูสถานะ |
| คลัง | จัดของ, ยืนยันส่ง |
| Admin | ทุกอย่าง + ตั้งค่า |

## 3. Flow หลัก
```
เปิด SO → รออนุมัติ → อนุมัติ → จัดของ → ส่งของ → เสร็จสิ้น
```

## 4. สถานะ SO
| สถานะ | คำอธิบาย |
|-------|---------|
| draft | แบบร่าง |
| pending | รออนุมัติ |
| approved | อนุมัติแล้ว |
| picking | กำลังจัดของ |
| shipped | ส่งแล้ว |
| completed | เสร็จสิ้น |
| cancelled | ยกเลิก |

## 5. Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- DB: PostgreSQL
