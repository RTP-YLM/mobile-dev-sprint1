# ⚡ PowerTrack - Electricity Monitoring App
## UX/UI Design Document

**Project:** Mobile Electricity Monitoring App  
**Theme:** Dark Mode (Night-friendly)  
**Platform:** iOS & Android  
**Designer:** แอน (UX/UI Designer)

---

# 📋 1. INFORMATION ARCHITECTURE

## 1.1 App Structure (Sitemap)

```
📱 PowerTrack App
│
├── 🏠 Dashboard (Home)
│   ├── Real-time Power Usage
│   ├── Total Consumption Today
│   ├── Cost Estimate
│   ├── Active Devices Count
│   └── Quick Alerts Preview
│
├── 📟 Devices
│   ├── Device List (Grid/List View)
│   ├── Search/Filter
│   ├── Add New Device
│   └── Device Groups (Room-based)
│       └── 🔄 Device Detail
│           ├── Real-time Stats
│           ├── Power Graph (Live)
│           ├── Daily/Weekly/Monthly Stats
│           ├── Device Settings
│           └── Power On/Off Control
│
├── 📊 History/Analytics
│   ├── Usage Trends
│   ├── Peak Hours Analysis
│   ├── Compare Periods
│   ├── Export Reports
│   └── Custom Date Range
│
├── 💰 Cost
│   ├── Current Bill Estimate
│   ├── Billing History
│   ├── Rate Calculator
│   ├── Budget Setting
│   └── Cost Forecast
│
├── 🔔 Alerts
│   ├── Unread Notifications
│   ├── Alert History
│   ├── Alert Settings
│   └── Threshold Configuration
│
└── ⚙️ Settings
    ├── Account
    ├── Notification Preferences
    ├── Display Settings
    ├── Energy Rate Configuration
    ├── Device Management
    ├── Data Export
    └── Help & Support
```

## 1.2 User Flow Diagram

```
                    ┌─────────────────┐
                    │   Launch App    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Splash/Login  │
                    └────────┬────────┘
                             │
                             ▼
         ┌──────────────────────────────────────────┐
         │               🏠 DASHBOARD               │
         │  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
         │  │ Devices │  │ History │  │  Cost   │   │
         │  │  Card   │  │  Card   │  │  Card   │   │
         │  └────┬────┘  └────┬────┘  └────┬────┘   │
         │       │            │            │        │
         └───────┼────────────┼────────────┼────────┘
                 │            │            │
                 ▼            ▼            ▼
        ┌──────────────────────────────────────────┐
        │            BOTTOM NAVIGATION             │
        │  🏠    📟    📊    💰    🔔    ⚙️       │
        │ Dash  Device History Cost Alert Setting │
        └──────────────────────────────────────────┘
                 │            │            │
                 ▼            ▼            ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │ 📟 Devices│  │📊 History│  │ 💰 Cost  │
         └────┬─────┘  └──────────┘  └──────────┘
              │
              ▼
      ┌───────────────┐
      │ Device Detail │◄──────┐
      │  - Live Data  │       │
      │  - Control    │       │
      │  - Settings   │       │
      └───────────────┘       │
              │               │
              ▼               │
      ┌───────────────┐       │
      │   Analytics   │───────┘
      │   for Device  │
      └───────────────┘
```

## 1.3 Navigation Pattern

**Primary Navigation:** Bottom Tab Bar (5 tabs)
- Dashboard (Home)
- Devices
- History
- Cost
- More (Alerts + Settings)

**Secondary Navigation:** 
- Floating Action Button (Quick Actions)
- Deep linking from notifications
- Swipe gestures between tabs

---

# 🖼️ 2. WIREFRAMES (7 หน้า)

## 2.1 Dashboard Screen

```
┌─────────────────────────────────────────┐
│  Status Bar (Time, Battery, WiFi)       │
├─────────────────────────────────────────┤
│  👤 Hi, John           🔔 ⚙️  [Header]  │
├─────────────────────────────────────────┤
│                                         │
│  ⚡ CURRENT POWER                       │
│  ┌─────────────────────────────────┐   │
│  │          2,847 W                │   │
│  │    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄        │   │
│  │   [Live Waveform Animation]    │   │
│  │         ↑ +12% vs yesterday    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📊 TODAY'S USAGE          💰 COST      │
│  ┌──────────────┐        ┌────────────┐│
│  │   14.2 kWh   │        │  ฿ 71.00   ││
│  │   ━━━━━━━━   │        │  est. today ││
│  └──────────────┘        └────────────┘│
│                                         │
│  🏠 ACTIVE DEVICES                      │
│  ┌─────────────────────────────────┐   │
│  │ 🌡️ AC        ⚡ 1,200W   ● On   │   │
│  │ 🖥️ TV        ⚡ 145W     ● On   │   │
│  │ ❄️ Fridge    ⚡ 85W      ● On   │   │
│  │ 💻 Computer  ⚡ 320W     ● On   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📈 ENERGY TREND (Last 7 Days)          │
│  ┌─────────────────────────────────┐   │
│  │    ▁▃▅▇█▇▅▃                    │   │
│  │   [Bar Chart - Mini]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [🏠] [📟] [📊] [💰] [⚙️]        │
│          Dashboard Navigation           │
└─────────────────────────────────────────┘
```

### Component Details:
- **Header:** User greeting + notification bell + settings shortcut
- **Hero Card:** Large power reading with live waveform
- **Stat Cards:** 2-column grid for key metrics
- **Device List:** Scrollable, shows top 4 active devices
- **Trend Chart:** Mini bar chart, clickable to History

---

## 2.2 Devices Screen

```
┌─────────────────────────────────────────┐
│  🔍 Search devices...      ┇ ━ ━ [View] │
├─────────────────────────────────────────┤
│  [All] [Living Room] [Bedroom] [Kitchen]│
│  [Laundry] [Outdoor]                    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🌡️  Air Conditioner             │   │
│  │     Living Room      ⚡ 1,200W  │   │
│  │     ● Online    [Toggle Switch] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🖥️  Smart TV                    │   │
│  │     Living Room      ⚡ 145W    │   │
│  │     ● Online    [Toggle Switch] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ❄️  Refrigerator                │   │
│  │     Kitchen           ⚡ 85W    │   │
│  │     ● Online    [Toggle Switch] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔌  Washing Machine             │   │
│  │     Laundry           ⚡ 0W     │   │
│  │     ○ Offline   [Toggle Switch] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💡  Smart Lights                │   │
│  │     Bedroom           ⚡ 45W    │   │
│  │     ● Online    [Toggle Switch] │   │
│  └─────────────────────────────────┘   │
│                                         │
│          [+]  Add New Device            │
│                                         │
│         [🏠] [📟] [📊] [💰] [⚙️]        │
└─────────────────────────────────────────┘
```

### Component Details:
- **Search Bar:** With clear button and voice search
- **Filter Chips:** Horizontal scrollable, multi-select
- **Device Cards:** Icon, name, location, power, status, toggle
- **Status Indicator:** Green (online) / Gray (offline) dot
- **FAB:** Floating button for adding devices

---

## 2.3 Device Detail Screen

```
┌─────────────────────────────────────────┐
│  ← Back              🌡️ Air Conditioner │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────────────┐                 │
│         │             │                 │
│         │   🌡️        │                 │
│         │  Device     │                 │
│         │   Icon      │                 │
│         │             │                 │
│         └─────────────┘                 │
│                                         │
│      Air Conditioner 18°C              │
│         ⚡ 1,200 Watts                  │
│      ● Online • Living Room            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      POWER ON/OFF               │   │
│  │                                 │   │
│  │     ┌───────────────────┐      │   │
│  │     │     [ ○────● ]    │      │   │
│  │     │    Large Toggle   │      │   │
│  │     └───────────────────┘      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     LIVE POWER CONSUMPTION      │   │
│  │                                 │   │
│  │  1,400 ┤      ╭─╮               │   │
│  │  1,200 ┤  ╭──╯ ╰──╮  ← Current  │   │
│  │  1,000 ┤ ╭╯        ╰╮            │   │
│  │   800  ┤╭╯          ╰╮           │   │
│  │        └──────────────            │   │
│  │      1m  5m  15m  30m  1h         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  TODAY'S USAGE        ESTIMATED COST    │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  8.4 kWh     │    │    ฿ 42      │  │
│  │  ━━━━━━━━━   │    │  ━━━━━━━━━━  │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📊 VIEW DETAILED ANALYTICS  →   │   │
│  ├─────────────────────────────────┤   │
│  │ ⚙️ DEVICE SETTINGS           →   │   │
│  ├─────────────────────────────────┤   │
│  │ 🔔 SET ALERTS               →   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Component Details:
- **Hero Section:** Large device icon, name, current power, status
- **Power Toggle:** Large prominent toggle switch
- **Live Chart:** Real-time updating line graph (last hour)
- **Quick Stats:** 2-column layout
- **Action Menu:** List of additional options

---

## 2.4 History/Analytics Screen

```
┌─────────────────────────────────────────┐
│  📊 Analytics & History      ⚙️ [Filter]│
├─────────────────────────────────────────┤
│                                         │
│  [Day] [Week] [Month] [Year] [Custom]   │
│         ★ Week selected                 │
│                                         │
│  TOTAL CONSUMPTION      AVG PER DAY     │
│  ┌──────────────┐      ┌──────────────┐ │
│  │  98.4 kWh    │      │   14.1 kWh   │ │
│  │  ↑ +5.2%     │      │  ━━━━━━━━━   │ │
│  └──────────────┘      └──────────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │   kWh                           │   │
│  │  20 ┤    ▓▓▓▓                   │   │
│  │  15 ┤    ▓▓▓▓ ▓▓▓▓              │   │
│  │  10 ┤ ▓▓▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓        │   │
│  │   5 ┤ ▓▓▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓   │   │
│  │   0 ┼────┬────┬────┬────┬────   │   │
│  │      Mon  Tue  Wed  Thu  Fri    │   │
│  │                                 │   │
│  │   [📈 Bar Chart - Weekly View]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PEAK USAGE HOURS                       │
│  ┌─────────────────────────────────┐   │
│  │ 🕐 18:00 - 20:00   ▓▓▓▓▓▓▓▓ 35% │   │
│  │ 🕐 12:00 - 14:00   ▓▓▓▓▓▓    25% │   │
│  │ 🕐 20:00 - 22:00   ▓▓▓▓      20% │   │
│  └─────────────────────────────────┘   │
│                                         │
│  TOP CONSUMING DEVICES                  │
│  ┌─────────────────────────────────┐   │
│  │ 🌡️ Air Conditioner   45.2 kWh  │   │
│  │ 🚿 Water Heater      18.5 kWh  │   │
│  │ 🖥️ TV                 8.3 kWh  │   │
│  │ ❄️ Refrigerator       6.2 kWh  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [📤 Export Report]  [🔍 Compare]       │
│                                         │
│         [🏠] [📟] [📊] [💰] [⚙️]        │
└─────────────────────────────────────────┘
```

### Component Details:
- **Time Period Selector:** Segmented control for day/week/month/year
- **Summary Cards:** Key metrics with trend indicators
- **Main Chart:** Interactive bar/line chart with zoom
- **Peak Hours:** Horizontal bar chart for time analysis
- **Device Ranking:** List of top consumers

---

## 2.5 Cost Screen

```
┌─────────────────────────────────────────┐
│  💰 Cost & Billing           ℹ️ [Info]  │
├─────────────────────────────────────────┤
│                                         │
│     CURRENT BILL CYCLE                  │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         ฿ 1,247.50             │   │
│  │      Estimated Bill             │   │
│  │                                 │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━       │   │
│  │  65% of monthly budget used     │   │
│  │                                 │   │
│  │  [Progress Bar - Gradient]      │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  THIS MONTH      PROJECTED     BUDGET   │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ ฿ 1,247  │  │ ฿ 1,920  │  │ ฿2000  │ │
│  │  so far  │  │  /month  │  │ /month │ │
│  └──────────┘  └──────────┘  └────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📈 COST TREND                  │   │
│  │                                 │   │
│  │  Jan  Feb  Mar  Apr  May  Jun   │   │
│  │  ▓▓   ▓▓   ▓▓   ▓▓   ▓▓   ███  │   │
│  │  1.2k 1.3k 1.1k 1.4k 1.5k 1.9k │   │
│  │                   ↑ Current    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  RATE BREAKDOWN                         │
│  ┌─────────────────────────────────┐   │
│  │ ⚡ Base Charge      ฿ 38.22    │   │
│  │ ⚡ First 150 kWh    ฿ 672.00   │   │
│  │ ⚡ Next 150 kWh     ฿ 537.28   │   │
│  │ ─────────────────────────────   │   │
│  │ Total               ฿ 1,247.50 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [✏️ Edit Budget]  [📊 View Details]    │
│                                         │
│         [🏠] [📟] [📊] [💰] [⚙️]        │
└─────────────────────────────────────────┘
```

### Component Details:
- **Bill Card:** Large estimated amount with progress bar
- **Stat Row:** 3-column layout for quick comparison
- **Trend Chart:** Monthly bar chart with current highlight
- **Rate Breakdown:** Detailed calculation showing tiers
- **Action Buttons:** Edit budget and detailed view

---

## 2.6 Alerts Screen

```
┌─────────────────────────────────────────┐
│  🔔 Notifications            ✓ [Mark All]│
├─────────────────────────────────────────┤
│  [All] [Unread] [Warnings] [System]     │
├─────────────────────────────────────────┤
│                                         │
│  TODAY                                  │
│  ┌─────────────────────────────────┐   │
│  │ 🔴 🌡️ High Power Alert          │   │
│  │    AC consuming 2,500W          │   │
│  │    (above normal 1,200W)        │   │
│  │              2 hours ago    →   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🟡 💰 Budget Warning            │   │
│  │    80% of monthly budget used   │   │
│  │    ฿ 1,600 / ฿ 2,000           │   │
│  │              5 hours ago    →   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  YESTERDAY                              │
│  ┌─────────────────────────────────┐   │
│  │ 🔵 📊 Daily Report              │   │
│  │    Yesterday: 15.2 kWh used     │   │
│  │    Cost: ฿ 76.00               │   │
│  │              1 day ago      →   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🟢 ✅ Device Online             │   │
│  │    Washing Machine reconnected  │   │
│  │              1 day ago      →   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ⚪ 🔌 Device Offline            │   │
│  │    Smart Plug disconnected      │   │
│  │              1 day ago      →   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [⚙️ Alert Settings]                    │
│                                         │
│         [🏠] [📟] [📊] [💰] [⚙️]        │
└─────────────────────────────────────────┘
```

### Component Details:
- **Filter Tabs:** Quick filter by alert type
- **Grouped by Date:** Section headers for today/yesterday/earlier
- **Alert Cards:** Color-coded by severity (red/yellow/blue/green/gray)
- **Icon + Title + Description + Timestamp**
- **Swipe Actions:** Mark read, delete, settings

---

## 2.7 Settings Screen

```
┌─────────────────────────────────────────┐
│  ⚙️ Settings                          │
├─────────────────────────────────────────┤
│                                         │
│  ACCOUNT                                │
│  ┌─────────────────────────────────┐   │
│  │ 👤 John Doe                     │   │
│  │    john@email.com          →    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  GENERAL                                │
│  ┌─────────────────────────────────┐   │
│  │ 🔔 Notifications           →    │   │
│  │ 🌙 Dark Mode              [●━━━]│   │
│  │ 🌐 Language        English   →  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ENERGY                                 │
│  ┌─────────────────────────────────┐   │
│  │ ⚡ Energy Rate             →    │   │
│  │    Current: ฿ 4.5/kWh          │   │
│  │                                 │   │
│  │ 💰 Monthly Budget          →    │   │
│  │    Current: ฿ 2,000            │   │
│  │                                 │   │
│  │ 🏠 Home Configuration      →    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  DEVICES                                │
│  ┌─────────────────────────────────┐   │
│  │ 🔌 Manage Devices          →    │   │
│  │ ➕ Add New Device          →    │   │
│  │ 📶 MQTT Connection         →    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  DATA                                   │
│  ┌─────────────────────────────────┐   │
│  │ 📤 Export Data             →    │   │
│  │ 🗑️ Clear Cache             →    │   │
│  │ ☁️ Backup & Sync           →    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ABOUT                                  │
│  ┌─────────────────────────────────┐   │
│  │ ❓ Help & Support          →    │   │
│  │ ⭐ Rate App               →    │   │
│  │ 📋 Privacy Policy         →    │   │
│  │ ℹ️ About PowerTrack       →    │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [🏠] [📟] [📊] [💰] [⚙️]        │
└─────────────────────────────────────────┘
```

### Component Details:
- **Account Card:** User profile summary
- **Grouped Sections:** General, Energy, Devices, Data, About
- **Toggle Switches:** For on/off settings
- **Arrow Indicators:** For navigation to sub-screens
- **Sub-text:** Helper text for context

---

# 🎨 3. DESIGN SYSTEM

## 3.1 Color Palette (Dark Theme)

### Primary Colors
```
Electric Blue (Primary)     #00D4FF  rgb(0, 212, 255)
Electric Blue Light         #66E5FF  rgb(102, 229, 255)
Electric Blue Dark          #0099CC  rgb(0, 153, 204)
```

### Background Colors
```
Background Primary          #0A0A0F  rgb(10, 10, 15)
Background Secondary        #12121A  rgb(18, 18, 26)
Background Tertiary         #1A1A24  rgb(26, 26, 36)
Background Elevated         #222230  rgb(34, 34, 48)
```

### Surface Colors
```
Surface Primary             #1E1E2D  rgb(30, 30, 45)
Surface Secondary           #2A2A3C  rgb(42, 42, 60)
Surface Hover               #35354A  rgb(53, 53, 74)
Surface Pressed             #404059  rgb(64, 64, 89)
```

### Semantic Colors
```
Success (Green)             #00E676  rgb(0, 230, 118)
Warning (Yellow)            #FFD600  rgb(255, 214, 0)
Error (Red)                 #FF5252  rgb(255, 82, 82)
Info (Blue)                 #448AFF  rgb(68, 138, 255)
```

### Data Visualization Colors
```
Power High (Hot)            #FF5252  Red
Power Medium                #FFD600  Yellow  
Power Low (Cool)            #00E676  Green
Power Active                #00D4FF  Electric Blue
Chart Gradient Start        #00D4FF  Cyan
Chart Gradient End          #7C4DFF  Purple
```

### Text Colors
```
Text Primary                #FFFFFF  rgb(255, 255, 255)
Text Secondary              #B0B0C0  rgb(176, 176, 192)
Text Tertiary               #6C6C80  rgb(108, 108, 128)
Text Disabled               #4A4A5C  rgb(74, 74, 92)
Text Inverse                #0A0A0F  rgb(10, 10, 15)
```

### Border & Divider
```
Border Subtle               #2A2A3C  rgb(42, 42, 60)
Border Default              #3A3A50  rgb(58, 58, 80)
Border Focus                #00D4FF  rgb(0, 212, 255)
```

## 3.2 Typography

### Font Family
```
Primary:   Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
Monospace: SF Mono, Fira Code, monospace (for numbers)
```

### Type Scale
```
Display      48px / 56px line   Bold      (Hero numbers)
H1           32px / 40px line   Bold      (Screen titles)
H2           24px / 32px line   Semibold  (Section headers)
H3           20px / 28px line   Semibold  (Card titles)
H4           18px / 24px line   Medium    (Subsection)
Body Large   16px / 24px line   Regular   (Primary text)
Body         14px / 20px line   Regular   (Secondary text)
Caption      12px / 16px line   Medium    (Labels, timestamps)
Overline     10px / 12px line   Semibold  (Badges, tags) - Uppercase
```

### Typography Usage
```
Power Numbers:     Monospace, Display size, Electric Blue
Currency:          Monospace, H2 size, Success Green
Section Headers:   H2, Text Primary, letter-spacing: 0.5px
Card Titles:       H3, Text Primary
Body Text:         Body, Text Secondary
Labels:            Caption, Text Tertiary, UPPERCASE
Button Text:       Body Large, Semibold, Text Primary
```

## 3.3 Component Library

### Buttons

**Primary Button**
```
Background:    Gradient (Electric Blue → Electric Blue Light)
Text:          #0A0A0F (Inverse)
Padding:       16px 24px
Border Radius: 12px
Font:          Body Large, Semibold
Shadow:        0 4px 16px rgba(0, 212, 255, 0.3)
Hover:         Brightness +10%
Pressed:       Scale 0.98
```

**Secondary Button**
```
Background:    Surface Secondary
Border:        1px solid Border Default
Text:          Text Primary
Padding:       14px 24px
Border Radius: 12px
Hover:         Background → Surface Hover
```

**Icon Button**
```
Size:          44px × 44px
Background:    Transparent
Border Radius: 12px
Icon:          24px, Text Secondary
Hover:         Background → Surface Secondary
```

### Cards

**Stat Card**
```
Background:    Surface Primary
Border:        1px solid Border Subtle
Border Radius: 16px
Padding:       20px
Shadow:        0 4px 20px rgba(0, 0, 0, 0.2)
Hover:         Border → Border Default, translateY(-2px)
```

**Device Card**
```
Background:    Surface Primary
Border:        1px solid Border Subtle
Border Radius: 16px
Padding:       16px
Layout:        Flex row, space-between
Icon:          48px circle, colored background
Shadow:        0 2px 12px rgba(0, 0, 0, 0.15)
```

**Alert Card**
```
Background:    Surface Primary
Left Border:   4px solid (color by severity)
Border Radius: 12px
Padding:       16px
Shadow:        0 2px 8px rgba(0, 0, 0, 0.1)
```

### Form Elements

**Text Input**
```
Background:    Background Tertiary
Border:        1px solid Border Default
Border Radius: 12px
Padding:       14px 16px
Font:          Body Large
Focus:         Border → Electric Blue, shadow glow
Placeholder:   Text Tertiary
```

**Toggle Switch**
```
Track Off:     Background Tertiary, 52px × 32px
Track On:      Electric Blue
Thumb:         White, 28px diameter
Border Radius: 16px
Animation:     200ms ease-out
```

**Slider**
```
Track:         Background Tertiary, 4px height
Fill:          Gradient (Electric Blue → Purple)
Thumb:         White, 20px, shadow
Border Radius: 2px
```

### Data Visualization Components

**Live Chart**
```
Background:    Transparent
Grid Lines:    Border Subtle, 1px dashed
Line:          Electric Blue, 2px
Fill:          Gradient (Electric Blue 30% → Transparent)
Animation:     Smooth 1s update cycle
```

**Progress Bar**
```
Background:    Background Tertiary
Fill:          Gradient (Success → Warning → Error by %)
Height:        8px
Border Radius: 4px
Animation:     Width transition 300ms ease
```

**Power Indicator**
```
Size:          8px
Color:         Pulsing Electric Blue
Animation:     2s pulse infinite
Low Power:     Static Green
Medium:        Static Yellow
High:          Pulsing Red
```

---

# 🧠 4. UX PRINCIPLES APPLIED

## 4.1 Visual Hierarchy

**Application in Design:**
1. **Size & Weight:** Power readings use Display font (48px) while labels use Caption (12px)
2. **Color Contrast:** Active power uses Electric Blue (#00D4FF) against dark background for maximum contrast
3. **Spacing:** 24px between sections, 16px within cards, 8px between related elements
4. **Z-Index Layers:** 
   - Layer 1: Background (z-0)
   - Layer 2: Cards/Surfaces (z-10)
   - Layer 3: Floating elements/FAB (z-20)
   - Layer 4: Modals/Overlays (z-30)

## 4.2 Gestalt Laws

**Law of Proximity**
- Related stats grouped in cards with consistent internal spacing
- Navigation items clustered at bottom
- Alerts grouped by date with clear section headers

**Law of Similarity**
- All device cards share identical structure and styling
- Alert colors indicate severity consistently (red=urgent, yellow=warning, etc.)
- Icons use consistent sizing and color treatment

**Law of Closure**
- Progress bars appear complete even when partial
- Chart lines imply continuous data flow
- Card borders create perceived containers

**Law of Continuity**
- Bottom navigation follows thumb-friendly curve
- Time-series charts flow left-to-right naturally
- Swipe gestures follow natural reading direction

**Law of Common Region**
- Cards with borders group related information
- Tab bars group navigation options
- Section headers visually separate content groups

## 4.3 Fitts's Law

**Application:**
- **Bottom Navigation:** 56px touch targets within thumb reach
- **Power Toggle:** Large 64px × 36px switch for easy operation
- **FAB (Add Device):** 56px diameter, positioned at bottom-right
- **Device Cards:** Full-width touch targets (minimum 72px height)
- **Close/Back buttons:** 44px minimum in top corners

## 4.4 Hick's Law

**Simplification Strategies:**
- Bottom nav limited to 5 options (optimal for decision-making)
- Device filters use horizontal scroll to reduce visible options
- Settings grouped logically to reduce cognitive load
- Dashboard shows only 4 most relevant devices by default

## 4.5 Jakob's Law

**Familiar Patterns:**
- Bottom tab navigation (iOS/Android standard)
- Card-based layout (Material Design influence)
- Left-swipe for back navigation
- Pull-to-refresh for data updates
- Long-press for contextual actions

## 4.6 Miller's Law (7±2)

**Chunking Information:**
- Device list shows 5 items before scrolling
- Alerts grouped by day (not individual timestamps)
- Settings organized into 5 main categories
- Navigation limited to 5 primary destinations

## 4.7 Peak-End Rule

**Designing for Peak Moments:**
- **Peak:** Seeing real-time power update with smooth animation
- **Peak:** Successfully turning off high-power device remotely
- **End:** Quick summary card at bottom of each screen
- **End:** Confirmation toast after actions

## 4.8 Aesthetic-Usability Effect

**Beautiful = Usable:**
- Smooth gradient backgrounds create depth
- Consistent border-radius (12-16px) feels modern
- Subtle shadows add hierarchy without clutter
- Electric Blue accent feels premium and tech-focused

---

# 🎬 5. INTERACTION DESIGN

## 5.1 Page Transitions

**Tab Switching**
```
Duration:    300ms
Easing:      cubic-bezier(0.4, 0.0, 0.2, 1)
Effect:      Horizontal slide + fade
Direction:   Left/Right based on tab order
```

**Screen Push (Detail View)**
```
Duration:    400ms
Easing:      cubic-bezier(0.4, 0.0, 0.2, 1)
Effect:      Slide from right (iOS) / Fade up (Android)
Back:        Edge swipe to pop
```

**Modal Presentation**
```
Duration:    350ms
Easing:      cubic-bezier(0.4, 0.0, 0.2, 1)
Effect:      Scale from 0.9 → 1.0 + fade in
Background:  Dim + blur
Dismiss:     Pull down or tap outside
```

## 5.2 Micro-interactions

**Power Toggle Switch**
```
Tap Feedback:      Scale 0.95 on press
Slide Animation:   Spring physics (damping: 20)
Glow Effect:       Box-shadow pulse when ON
Haptic:            Light impact on change
```

**Device Card Press**
```
Press:        Scale 0.98, brightness -5%
Release:      Spring back to 1.0
Ripple:       Center-out ripple from touch point
Duration:     200ms
```

**Live Data Update**
```
Number Change:  Count-up animation
Duration:       500ms
Easing:         ease-out
Chart Update:   Smooth path morph (1s)
Indicator:      Subtle pulse on changed value
```

**Pull to Refresh**
```
Threshold:      80px pull
Animation:      Spinning loader (Electric Blue)
Release:        Spring back with haptic
Success:        Checkmark morph + subtle bounce
```

**Notification Badge**
```
Entrance:       Scale 0 → 1.2 → 1.0 (bounce)
Update:         Subtle shake animation
Clear:          Scale 1 → 0 + fade
Duration:       300ms
```

## 5.3 Chart Interactions

**Line/Bar Chart**
```
Tap:            Show tooltip with exact value
Pan:            Crosshair follows finger
Pinch:          Zoom in/out time range
Double-tap:     Reset zoom to default
Long-press:     Freeze and show details
```

**Tooltip Design**
```
Background:     Surface Elevated
Border:         1px solid Border Default
Shadow:         0 8px 24px rgba(0,0,0,0.3)
Arrow:          Point to data point
Animation:      Fade + scale 0.9 → 1.0
```

## 5.4 Gesture Support

| Gesture | Action | Screen |
|---------|--------|--------|
| Swipe Left | Next tab | Dashboard |
| Swipe Right | Previous tab | Any tab |
| Swipe Left | Delete device | Devices list |
| Pull Down | Refresh data | Any screen |
| Long Press | Multi-select | Devices list |
| Pinch | Zoom chart | History |
| Double Tap | Toggle favorite | Device detail |

## 5.5 Loading States

**Skeleton Screens**
```
Background:     Surface Primary
Shimmer:        Linear gradient animation
Angle:          110deg
Duration:       1.5s infinite
Delay:          Stagger 100ms per element
```

**Progressive Loading**
```
Step 1:         Show cached data immediately
Step 2:         Skeleton for new data
Step 3:         Fade in fresh content
Step 4:         Update with live MQTT data
```

## 5.6 Error States

**Network Error**
```
Icon:           🌐 with slash
Animation:      Icon shake
Message:        "Connection lost"
Action:         "Retry" button with pulse
```

**Empty States**
```
Illustration:   Custom dark-themed illustration
Animation:      Subtle floating animation
Message:        Friendly, helpful copy
CTA:            Primary action button
```

---

# ♿ 6. ACCESSIBILITY CONSIDERATIONS

## 6.1 Visual Accessibility

### Color Contrast Ratios (WCAG 2.1 AA)
```
Electric Blue on BG Primary:    7.2:1  ✅ AAA
Text Primary on BG Primary:     18.5:1 ✅ AAA
Text Secondary on BG Primary:   8.4:1  ✅ AAA
Success Green on BG Primary:    6.8:1  ✅ AA
Warning Yellow on BG Primary:   10.2:1 ✅ AAA
Error Red on BG Primary:        7.8:1  ✅ AAA
```

### Color Blindness Support
```
Red-Green (Deuteranopia):
  - Error: Red + ❌ icon
  - Success: Green + ✓ icon
  - Never rely on color alone

Blue-Yellow (Tritanopia):
  - Primary Blue + distinctive shape
  - Information: Blue + ℹ️ icon

Monochromacy:
  - Patterns in charts (stripes, dots)
  - Labels on all data points
  - Texture differentiation
```

### High Contrast Mode
```
When enabled:
  - Background: #000000
  - Text: #FFFFFF
  - Borders: #FFFFFF (2px solid)
  - Remove all transparency effects
  - Increase icon stroke width
```

## 6.2 Typography Accessibility

### Dynamic Type Support (iOS) / Font Scale (Android)
```
Minimum Scale:    85%  (13.6px base)
Default Scale:    100% (16px base)
Maximum Scale:    200% (32px base)

Implementation:
  - Use relative units (sp, em, rem)
  - Test at 200% scale
  - Truncate with "..." if needed
  - Ensure 44px minimum touch targets
```

### Font Recommendations
```
Primary:   Inter (excellent legibility)
Features:  - OpenType features enabled
           - Tabular numbers for alignment
           - Distinct 0/O, 1/l/I
```

## 6.3 Screen Reader Support (VoiceOver/TalkBack)

### Semantic Labels
```
Power reading:    "Current power consumption: 2,847 watts"
Toggle switch:    "Air conditioner toggle, on"
Chart:            "Usage chart showing 7 days, highest on Wednesday"
Alert:            "Warning: High power usage alert, air conditioner"
```

### Focus Management
```
On page load:     Focus to H1 heading
After action:     Focus to success message
Modal open:       Trap focus within modal
Modal close:      Return focus to trigger button
```

### Accessibility Hints
```
Device card:      "Double tap to view details, swipe left to delete"
Chart:            "Use two fingers to explore chart data"
Pull refresh:     "Pull down to refresh data"
```

## 6.4 Motor Accessibility

### Touch Target Sizes
```
Minimum:          44 × 44px (Apple HIG)
Recommended:      48 × 48px (Material Design)
Navigation items: 56px height
Buttons:          48px minimum height
Spacing:          8px between adjacent targets
```

### Reduce Motion Support
```
When enabled:
  - Disable parallax effects
  - Instant transitions instead of slides
  - Remove pulse animations
  - Keep essential feedback (button press)
  - Respect prefers-reduced-motion media query
```

## 6.5 Cognitive Accessibility

### Clear Language
```
✓ "Air conditioner is using more power than usual"
✗ "AC power consumption anomaly detected"

✓ "Turn off to save ฿45 this month"
✗ "Potential cost reduction opportunity identified"
```

### Consistent Patterns
```
- Same icons always mean same actions
- Color coding consistent throughout app
- Navigation never changes position
- Feedback follows predictable patterns
```

### Error Prevention
```
- Confirm before deleting devices
- Warn before turning off critical devices
- Show estimated impact of actions
- Allow undo within 5 seconds
```

## 6.6 Accessibility Testing Checklist

```
□ Navigate entire app with VoiceOver/TalkBack
□ Use app at 200% text scale
□ Test with color blindness simulators
□ Verify all touch targets ≥ 44px
□ Test with reduced motion enabled
□ Navigate using external keyboard
□ Verify sufficient contrast ratios
□ Test screen orientation changes
```

---

# 📱 7. RESPONSIVE CONSIDERATIONS

## 7.1 Breakpoints

```
Mobile Small:   320px - 375px  (iPhone SE, Mini)
Mobile:         376px - 428px  (iPhone Pro Max)
Tablet:         768px - 1024px (iPad)
```

## 7.2 Tablet Adaptations

```
Dashboard:
  - 2-column grid for stat cards
  - Side-by-side device list and detail
  - Larger charts with more data points

Devices:
  - Grid layout (2 columns)
  - Persistent detail pane on right

History:
  - Split view: chart left, insights right
  - Larger time range visible
```

---

# 🚀 8. IMPLEMENTATION NOTES

## 8.1 Real-time Data Strategy

```
MQTT Connection:
  - Keep-alive: 60 seconds
  - Reconnect: Exponential backoff
  - QoS: Level 1 (at least once)

UI Updates:
  - Batch updates every 1 second max
  - Smooth number transitions
  - Visual indicator when live
```

## 8.2 Performance Targets

```
First Contentful Paint:    < 1.5s
Time to Interactive:       < 3s
Animation Frame Rate:      60fps
Memory Usage:              < 100MB
APK/IPA Size:              < 50MB
```

## 8.3 Offline Support

```
Cached Data:
  - Last 24 hours always available
  - Device list and settings
  - Alert history (last 30 days)

Actions Queue:
  - Device control commands
  - Settings changes
  - Sync when connection restored
```

---

# 📝 APPENDIX

## A. Icon Set

```
Navigation:
  🏠 Home/Dashboard
  📟 Devices
  📊 Analytics
  💰 Cost
  🔔 Alerts
  ⚙️ Settings

Devices:
  🌡️ AC/Heater
  🖥️ TV
  ❄️ Fridge
  💻 Computer
  🔌 Plug
  💡 Light
  🚿 Water Heater
  🌀 Fan
  🍳 Oven
  🌊 Washing Machine

Status:
  ● Online (filled)
  ○ Offline (empty)
  ⚡ Power
  🔴 Alert/Error
  🟡 Warning
  🟢 Success
  🔵 Info
```

## B. Animation Timing Reference

```
Instant:        0ms    (immediate feedback)
Fast:           100ms  (button press)
Normal:         200ms  (hover, small transitions)
Smooth:         300ms  (page transitions)
Elaborate:      500ms  (complex animations)
Ambient:        2000ms (pulsing, live indicators)
```

## C. Sound Design (Optional)

```
Power On:       Subtle electric hum (100ms)
Power Off:      Descending tone (150ms)
Alert:          Soft chime
Success:        Pleasant ding
Error:          Low buzz
```

---

*Document Version: 1.0*  
*Last Updated: February 2026*  
*Designer: แอน (UX/UI Designer)*
