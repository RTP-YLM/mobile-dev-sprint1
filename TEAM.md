# TEAM.md - Mobile Team

**PM:** กุ้ง (Project Manager) - จุดติดต่อเดียวกับนาย

---

## Team: Mobile Team

**สมาชิกทีม (10 คน)

| # | ชื่อ | บทบาท | Model | Skills | หน้าที่หลัก |
|---|------|-------|-------|--------|-------------|
| 1 | **เจน** | System Analyst | kimi-k2.5 | coding-agent, summarize, nano-pdf | เก็บ requirement, เขียน spec, ออกแบบระบบ |
| 2 | **ดรีม** | UX/UI Designer | sonnet | coding-agent, session-logs | User flow, Wireframe, Design system |
| 3 | **เจมส์** | Security Engineer | kimi-k2.5 | coding-agent, session-logs | API security, Auth, Pentest |
| 4 | **ต้น** | Backend Lead | kimi-k2.5 | coding-agent, github, session-logs | API, Database, Server architecture |
| 5 | **บีม** | Mobile Lead (RN) | sonnet | coding-agent, github, session-logs | React Native core, Cross-platform |
| 6 | **ปัน** | iOS Native | opus | coding-agent, github, apple-notes | Native iOS, Swift bridges, App Store |
| 7 | **พล** | Android Native | opus | coding-agent, github | Kotlin modules, Android features, Play Store |
| 8 | **ฟลุ๊ค** | DevOps/Build | sonnet | coding-agent, github, session-logs | CI/CD, Fastlane, Build automation |
| 9 | **มิ้นท์** | QA Engineer | sonnet | coding-agent, session-logs, summarize | Test cases, Automation, Bug tracking |
| 10 | **อาร์ต** | Data/Analytics | sonnet | coding-agent, github, summarize | Analytics, User tracking, Reports |

---

## Knowledge Transfer & Backup

| บทบาท | คนหลัก | คนสำรอง (Backup) | เหตุผล |
|-------|--------|-------------------|--------|
| SA | เจน | ดรีม | ดรีมเข้าใจ user flow, requirement |
| UX/UI | ดรีม | บีม | บีมทำ UI implementation, เข้าใจ design |
| Security | เจมส์ | ต้น | ต้นรู้ backend architecture, API endpoints |
| Backend | ต้น | เจมส์ | เจมส์รู้ security ของระบบ |
| Mobile Lead | บีม | ปัน หรือ พล | Native devs เข้าใจ RN bridge |
| iOS Native | ปัน | บีม | บีม lead mobile, เข้าใจ integration |
| Android Native | พล | บีม | บีม lead mobile, เข้าใจ integration |
| DevOps | ฟลุ๊ค | ต้น | ต้นรู้ infra, server setup |
| QA | มิ้นท์ | อาร์ต | อาร์ตเข้าใจ data/tracking ที่ต้อง test |
| Data | อาร์ต | มิ้นท์ | มิ้นท์ test analytics tracking |

---

## การทำงาน

### Phase 1: Discovery
1. เจน (SA) เก็บ requirement → ส่งต่อให้ดรีม
2. ดรีม (UX/UI) ออกแบบ user flow, wireframe
3. เจมส์ (Security) รีวิว spec เรื่อง security concern

### Phase 2: Design & Planning
4. เจน + ดรีม + ต้น → finalize API contract
5. ต้น (Backend) ออกแบบ DB schema
6. เจมส์ (Security) ออกแบบ auth, permission

### Phase 3: Development
7. ฟลุ๊ค (DevOps) ตั้ง CI/CD pipeline
8. ต้น (Backend) สร้าง API
9. ดรีม (UX/UI) ส่ง design system, component ให้บีม
10. บีม (Mobile Lead) สร้าง RN app structure
11. ปัน (iOS) + พล (Android) ช่วย native modules ที่จำเป็น
12. อาร์ต (Data) ตั้ง analytics tracking

### Phase 4: Testing & Release
13. มิ้นท์ (QA) เขียน test plan, automation
14. ฟลุ๊ค (DevOps) จัดการ build, signing, release
15. ปัน (iOS) submit App Store, พล (Android) submit Play Store

---

## การแทนที่ (Onboarding คนใหม่)

ถ้ามีคนออกจากทีม:
1. คนสำรอง (backup) รับงานชั่วคราว
2. กุ้ง spawn คนใหม่ตาม role
3. คนสำรอง onboard คนใหม่ (knowledge transfer)
4. คนใหม่อ่าน memory/ ของคนเก่า
5. คนใหม่ commit ว่าเข้าใจงานแล้ว

---

## Memory Files

แต่ละคนมี memory file ใน `memory/team/`:
- `เจน.md` - SA decisions, requirement history
- `ดรีม.md` - Design decisions, user research
- `เจมส์.md` - Security audit, vulnerabilities
- `ต้น.md` - Architecture decisions, API changes
- `บีม.md` - Mobile architecture, component library
- `ปัน.md` - iOS-specific decisions, App Store notes
- `พล.md` - Android-specific decisions, Play Store notes
- `ฟลุ๊ค.md` - Infrastructure, deployment notes
- `มิ้นท์.md` - Test coverage, bug patterns
- `อาร์ต.md` - Analytics setup, metrics definitions
