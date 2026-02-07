# รายงานวิเคราะห์ Mobile App Architecture
## แอพมอนิเตอร์ระบบไฟฟ้าผ่าน MQTT

**จัดทำโดย:** บีม (Mobile Lead)  
**วันที่:** 6 กุมภาพันธ์ 2026  
**โปรเจค:** Energy Monitoring Mobile App

---

## 📋 สารบัญ

1. [Technology Selection](#1-technology-selection)
2. [MQTT Library Recommendations](#2-mqtt-library-recommendations)
3. [UI/UX Design Guidelines](#3-uiux-design-guidelines)
4. [Real-time State Management](#4-real-time-state-management)
5. [Data Visualization](#5-data-visualization)
6. [Performance Considerations](#6-performance-considerations)
7. [สรุปและข้อเสนอแนะ](#7-สรุปและข้อเสนอแนะ)

---

## 1. Technology Selection

### 1.1 เปรียบเทียบ Flutter vs React Native vs Native

| Criteria | Flutter | React Native | Native (iOS/Android) |
|----------|---------|--------------|----------------------|
| **Development Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Performance (Real-time)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **UI Consistency** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **MQTT Support** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Chart Libraries** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Team Expertise Required** | Medium | Medium-High | High |
| **Maintenance Cost** | Low | Medium | High |

### 1.2 คำแนะนำ: **Flutter** 🏆

#### เหตุผลที่เลือก Flutter:

**1. Performance สูงกว่าสำหรับ Real-time Data**
- Dart คอมไพล์เป็น native code (ARM/x86) ไม่ผ่าน JavaScript bridge
- Rendering ด้วย Skia engine 60fps สม่ำเสมอ
- เหมาะกับ animation ของ charts และ real-time updates

**2. UI Consistency 100%**
- Widget system ทำให้ UI บน iOS และ Android ตรงกันเป๊ะ
- Material Design 3 และ Cupertino widgets พร้อมใช้
- Customizable ได้ละเอียดสำหรับ dashboard ที่ซับซ้อน

**3. Chart & Visualization Libraries หลากหลาย**
- `fl_chart` - ที่สุดของ chart library สำหรับ Flutter
- `graphic` - Grammar of Graphics สำหรับ visualization ซับซ้อน
- `syncfusion_flutter_charts` - Enterprise-grade charts

**4. MQTT Support ดีเยี่ยม**
- `mqtt_client` - Pure Dart, ไม่ต้องพึ่ง native plugin
- WebSocket support สำหรับ MQTT over Web
- Null-safety ready

**5. Hot Reload เร็วมาก**
- พัฒนา dashboard ซับซ้อนได้อย่างรวดเร็ว
- ทดสอบ UI changes แบบ real-time

**6. Single Codebase จริงๆ**
- ไม่ต้องแยกทีม iOS/Android
- Feature parity 100% ทั้งสอง platform

### 1.3 เมื่อไหร่ควรเลือก React Native?

- ทีมมี JavaScript/React แข็งแกร่งอยู่แล้ว
- ต้องการ reuse web codebase บางส่วน
- แอพไม่ซับซ้อนมาก ไม่มี real-time data หนักๆ

### 1.4 เมื่อไหร่ควรเลือก Native?

- ต้องการ performance สูงสุดจริงๆ
- มี native features ที่ต้องใช้เฉพาะทางมากๆ
- งบประมาณสูง มีทีม iOS และ Android แยกกัน

---

## 2. MQTT Library Recommendations

### 2.1 สำหรับ Flutter: `mqtt_client` ⭐

```yaml
dependencies:
  mqtt_client: ^10.5.1
  mqtt5_client: ^4.6.0  # สำหรับ MQTT v5
```

**จุดเด่น:**
- ✅ Pure Dart implementation - ไม่พึ่ง platform channel
- ✅ รองรับ MQTT v3.1, v3.1.1, และ v5.0
- ✅ WebSocket support (wss://) สำหรับ web deployment
- ✅ Auto-reconnect ในตัว
- ✅ Null-safety fully supported
- ✅ Publish/Subscribe API ใช้งานง่าย

**Use Case ที่เหมาะสม:**
- IoT device monitoring
- Real-time telemetry
- Energy data streaming

### 2.2 Alternative: `flutter_mqtt`

```yaml
dependencies:
  flutter_mqtt: ^2.0.0
```

- หากต้องการ native implementation ที่ใช้ Paho MQTT โดยตรง
- แต่มี platform channel overhead เล็กน้อย

### 2.3 สำหรับ React Native (หากเปลี่ยนใจ)

| Library | รายละเอียด |
|---------|-----------|
| `react_native_mqtt` | ใช้ Paho MQTT, ค่อนข้าง stable |
| `sp-react-native-mqtt` | อัพเดทบ่อยกว่า, support MQTT v5 |
| `mqtt` (npm) | Pure JS, ใช้กับ React Native ได้ |

---

## 3. UI/UX Design Guidelines

### 3.1 Information Architecture

```
App Structure:
├── Dashboard (Home)
│   ├── Overall Power Usage (Real-time)
│   ├── Today's Statistics
│   ├── Quick Device Status
│   └── Alerts/Notifications
├── Devices List
│   ├── Grid View / List View toggle
│   ├── Room-based Grouping
│   └── Device Status Overview
├── Device Detail
│   ├── Real-time Metrics
│   ├── Historical Charts
│   ├── Device Controls
│   └── Settings
└── Settings
    ├── MQTT Connection
    ├── Notification Preferences
    └── Theme Settings
```

### 3.2 Dashboard Design Principles

#### 3.2.1 Visual Hierarchy

```dart
// Priority 1: Current Power Usage (Hero Section)
// - ตัวเลขใหญ่, อยู่ตรงกลาง
// - Real-time animation
// - Color-coded (Green/Yellow/Red)

// Priority 2: Quick Stats Row
// - วันนี้ใช้ไปเท่าไหร่ (kWh)
// - คาดการณ์ค่าไฟ (บาท)
// - Peak usage time

// Priority 3: Device Grid
// - Card-based layout
// - Online/Offline indicator
// - Current draw per device
```

#### 3.2.2 Color Scheme (Energy Monitoring)

```dart
class EnergyColors {
  // Power Level Indicators
  static const lowUsage = Color(0xFF4CAF50);      // Green
  static const mediumUsage = Color(0xFFFFA726);   // Orange  
  static const highUsage = Color(0xFFEF5350);     // Red
  static const criticalUsage = Color(0xFFD32F2F); // Dark Red
  
  // Status
  static const online = Color(0xFF4CAF50);
  static const offline = Color(0xFF9E9E9E);
  static const warning = Color(0xFFFFC107);
}
```

### 3.3 Widget Patterns

#### 3.3.1 Real-time Power Card

```dart
class PowerUsageCard extends StatelessWidget {
  final double currentWatts;
  final double todayKwh;
  final double estimatedCost;
  
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // Hero: Current Usage
            AnimatedPowerDisplay(
              watts: currentWatts,
              style: TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.bold,
                color: _getColorForWatts(currentWatts),
              ),
            ),
            Text('WATTS', style: TextStyle(fontSize: 14)),
            
            // Stats Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                StatItem(
                  label: 'Today',
                  value: '${todayKwh.toStringAsFixed(2)} kWh',
                ),
                StatItem(
                  label: 'Est. Cost',
                  value: '฿${estimatedCost.toStringAsFixed(0)}',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

#### 3.3.2 Device List Item

```dart
class DeviceListTile extends StatelessWidget {
  final Device device;
  
  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 12,
        height: 12,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: device.isOnline 
            ? EnergyColors.online 
            : EnergyColors.offline,
        ),
      ),
      title: Text(device.name),
      subtitle: Text(device.room),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text(
            '${device.currentPower.toStringAsFixed(0)} W',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: _getPowerColor(device.currentPower),
            ),
          ),
          Text(
            '${device.todayEnergy.toStringAsFixed(2)} kWh today',
            style: TextStyle(fontSize: 12),
          ),
        ],
      ),
      onTap: () => _navigateToDetail(device),
    );
  }
}
```

### 3.4 Navigation Patterns

**แนะนำ: Bottom Navigation Bar + Deep Linking**

```dart
// 3 หน้าหลักเท่านั้น (Keep it simple)
NavigationBar(
  destinations: [
    NavigationDestination(
      icon: Icon(Icons.dashboard_outlined),
      selectedIcon: Icon(Icons.dashboard),
      label: 'Dashboard',
    ),
    NavigationDestination(
      icon: Icon(Icons.devices_outlined),
      selectedIcon: Icon(Icons.devices),
      label: 'Devices',
    ),
    NavigationDestination(
      icon: Icon(Icons.settings_outlined),
      selectedIcon: Icon(Icons.settings),
      label: 'Settings',
    ),
  ],
)
```

### 3.5 Responsive Design

```dart
// Dashboard ปรับตามขนาดหน้าจอ
class ResponsiveDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    
    if (width < 600) {
      return MobileDashboard();      // 1 column
    } else if (width < 900) {
      return TabletDashboard();      // 2 columns
    } else {
      return DesktopDashboard();     // 3 columns (สำหรับ iPad/tablet)
    }
  }
}
```

---

## 4. Real-time State Management

### 4.1 Architecture Pattern: BLoC (Business Logic Component)

เหตุผลที่เลือก BLoC:
- แยก business logic ออกจาก UI ชัดเจน
- รองรับ reactive streams สำหรับ MQTT data
- Testable ง่าย
- Scalable สำหรับ feature ที่ซับซ้อน

### 4.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         PRESENTATION                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Dashboard  │  │Device List  │  │   Device Detail     │ │
│  │    Page     │  │    Page     │  │       Page          │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────────┼────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                       BLoC LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ DashboardBloc   │  │  DeviceListBloc │  │DeviceDetailBloc│
│  │                 │  │                 │  │              ││
│  │ - Subscribe to  │  │ - Manage device │  │ - Real-time  ││
│  │   total power   │  │   list state    │  │   metrics    ││
│  │ - Aggregate     │  │ - Handle filter │  │ - Historical ││
│  │   statistics    │  │   & search      │  │   data       ││
│  └────────┬────────┘  └────────┬────────┘  └──────┬───────┘│
└───────────┼────────────────────┼──────────────────┼────────┘
            │                    │                  │
            ▼                    ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORY LAYER                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              MqttRepository (Singleton)                 ││
│  │  ┌─────────────────────────────────────────────────┐   ││
│  │  │           mqtt_client (Dart Package)            │   ││
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │   ││
│  │  │  │ Connection  │  │  Publisher  │  │Subscriber│ │   ││
│  │  │  │   Manager   │  │             │  │          │ │   ││
│  │  │  └─────────────┘  └─────────────┘  └──────────┘ │   ││
│  │  └─────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Implementation: MQTT Repository

```dart
// lib/repositories/mqtt_repository.dart

import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';
import 'package:rxdart/rxdart.dart';

class MqttRepository {
  static final MqttRepository _instance = MqttRepository._internal();
  factory MqttRepository() => _instance;
  MqttRepository._internal();

  MqttServerClient? _client;
  
  // Streams สำหรับแต่ละ topic
  final Map<String, BehaviorSubject<MqttMessage>> _topicStreams = {};
  final BehaviorSubject<ConnectionState> _connectionState = 
    BehaviorSubject.seeded(ConnectionState.disconnected);
  
  Stream<ConnectionState> get connectionState => _connectionState.stream;
  
  // Configuration
  final String _server = 'your-mqtt-broker.com';
  final int _port = 1883;
  final String _clientId = 'energy_monitor_${DateTime.now().millisecondsSinceEpoch}';

  Future<void> connect() async {
    _client = MqttServerClient(_server, _clientId);
    _client!.port = _port;
    _client!.logging(on: false);
    _client!.keepAlivePeriod = 60;
    _client!.onDisconnected = _onDisconnected;
    _client!.onConnected = _onConnected;
    _client!.onSubscribed = _onSubscribed;
    
    // Auto reconnect
    _client!.autoReconnect = true;
    
    final connMessage = MqttConnectMessage()
      .withClientIdentifier(_clientId)
      .startClean()
      .withWillQos(MqttQos.atLeastOnce);
      
    _client!.connectionMessage = connMessage;
    
    try {
      _connectionState.add(ConnectionState.connecting);
      await _client!.connect();
    } catch (e) {
      _connectionState.add(ConnectionState.disconnected);
      rethrow;
    }
    
    // Listen to all incoming messages
    _client!.updates!.listen(_onMessage);
  }

  Stream<MqttMessage> subscribeToTopic(String topic) {
    if (!_topicStreams.containsKey(topic)) {
      _topicStreams[topic] = BehaviorSubject<MqttMessage>();
      
      if (_client?.connectionStatus?.state == MqttConnectionState.connected) {
        _client!.subscribe(topic, MqttQos.atLeastOnce);
      }
    }
    return _topicStreams[topic]!.stream;
  }

  void _onMessage(List<MqttReceivedMessage<MqttMessage>> messages) {
    for (final message in messages) {
      final topic = message.topic;
      final payload = message.payload;
      
      if (_topicStreams.containsKey(topic)) {
        _topicStreams[topic]!.add(payload);
      }
      
      // Wildcard matching สำหรับ topic patterns
      _topicStreams.forEach((key, stream) {
        if (_topicMatches(key, topic)) {
          stream.add(payload);
        }
      });
    }
  }

  bool _topicMatches(String subscription, String topic) {
    // รองรับ wildcards: + (single level), # (multi level)
    final subParts = subscription.split('/');
    final topicParts = topic.split('/');
    
    for (int i = 0; i < subParts.length; i++) {
      if (subParts[i] == '#') return true;
      if (subParts[i] == '+') continue;
      if (i >= topicParts.length || subParts[i] != topicParts[i]) {
        return false;
      }
    }
    return subParts.length == topicParts.length;
  }

  void _onConnected() {
    _connectionState.add(ConnectionState.connected);
    // Resubscribe to all topics
    _topicStreams.keys.forEach((topic) {
      _client!.subscribe(topic, MqttQos.atLeastOnce);
    });
  }

  void _onDisconnected() {
    _connectionState.add(ConnectionState.disconnected);
  }

  void _onSubscribed(String topic) {
    print('Subscribed to: $topic');
  }

  void dispose() {
    _topicStreams.values.forEach((s) => s.close());
    _topicStreams.clear();
    _client?.disconnect();
    _connectionState.close();
  }
}

enum ConnectionState { disconnected, connecting, connected }
```

### 4.4 Implementation: Dashboard BLoC

```dart
// lib/blocs/dashboard/dashboard_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'dart:convert';

part 'dashboard_bloc.freezed.dart';

// Events
@freezed
class DashboardEvent with _$DashboardEvent {
  const factory DashboardEvent.started() = _Started;
  const factory DashboardEvent.powerDataReceived(double watts) = _PowerDataReceived;
  const factory DashboardEvent.deviceStatusChanged(String deviceId, bool isOnline) = _DeviceStatusChanged;
}

// States
@freezed
class DashboardState with _$DashboardState {
  const factory DashboardState({
    @Default(0.0) double currentPowerWatts,
    @Default(0.0) double todayKwh,
    @Default(0.0) double estimatedMonthlyCost,
    @Default({}) Map<String, bool> deviceStatuses,
    @Default(false) bool isConnected,
    @Default([]) List<double> powerHistory, // สำหรับ sparkline chart
  }) = _DashboardState;
}

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final MqttRepository _mqttRepository;
  StreamSubscription? _powerSubscription;
  StreamSubscription? _connectionSubscription;

  DashboardBloc(this._mqttRepository) : super(const DashboardState()) {
    on<_Started>(_onStarted);
    on<_PowerDataReceived>(_onPowerDataReceived);
    on<_DeviceStatusChanged>(_onDeviceStatusChanged);
  }

  Future<void> _onStarted(_Started event, Emitter<DashboardState> emit) async {
    // Subscribe to total power topic
    _powerSubscription = _mqttRepository
      .subscribeToTopic('energy/total/power')
      .listen((message) {
        final payload = (message as MqttPublishMessage).payload.message;
        final data = jsonDecode(String.fromCharCodes(payload));
        final watts = (data['watts'] as num).toDouble();
        add(DashboardEvent.powerDataReceived(watts));
      });
    
    // Listen connection state
    _connectionSubscription = _mqttRepository
      .connectionState
      .listen((connectionState) {
        emit(state.copyWith(isConnected: connectionState == ConnectionState.connected));
      });
    
    // Subscribe to all device status
    _mqttRepository
      .subscribeToTopic('energy/devices/+/status')
      .listen((message) {
        final payload = (message as MqttPublishMessage).payload.message;
        final data = jsonDecode(String.fromCharCodes(payload));
        add(DashboardEvent.deviceStatusChanged(
          data['deviceId'],
          data['online'],
        ));
      });
  }

  void _onPowerDataReceived(_PowerDataReceived event, Emitter<DashboardState> emit) {
    // Update power history (keep last 60 readings ~ 1 minute at 1 reading/sec)
    final newHistory = [...state.powerHistory, event.watts];
    if (newHistory.length > 60) {
      newHistory.removeAt(0);
    }
    
    // Calculate today's kWh (simplified)
    final newTodayKwh = state.todayKwh + (event.watts / 1000 / 3600);
    
    // Estimate monthly cost (assuming ฿4.5 per kWh)
    final daysInMonth = 30;
    final estimatedMonthly = newTodayKwh * daysInMonth * 4.5;
    
    emit(state.copyWith(
      currentPowerWatts: event.watts,
      todayKwh: newTodayKwh,
      estimatedMonthlyCost: estimatedMonthly,
      powerHistory: newHistory,
    ));
  }

  void _onDeviceStatusChanged(_DeviceStatusChanged event, Emitter<DashboardState> emit) {
    final newStatuses = Map<String, bool>.from(state.deviceStatuses);
    newStatuses[event.deviceId] = event.isOnline;
    emit(state.copyWith(deviceStatuses: newStatuses));
  }

  @override
  Future<void> close() {
    _powerSubscription?.cancel();
    _connectionSubscription?.cancel();
    return super.close();
  }
}
```

### 4.5 Topic Structure แนะนำ

```yaml
# MQTT Topic Hierarchy
energy/
├── total/
│   ├── power           # กำลังไฟรวม (W) - real-time
│   ├── energy          # พลังงานสะสม (kWh) - daily
│   └── voltage         # แรงดันไฟ (V)
├── devices/
│   ├── {device_id}/
│   │   ├── power       # กำลังไฟของอุปกรณ์
│   │   ├── energy      # พลังงานสะสม
│   │   ├── status      # online/offline
│   │   └── telemetry   # ข้อมูลอื่นๆ (temp, signal, etc.)
│   └── ...
├── rooms/
│   ├── {room_id}/
│   │   └── power       # กำลังไฟต่อห้อง
│   └── ...
└── alerts/
    ├── high_usage      # แจ้งเตือนใช้ไฟเกิน
    └── device_offline  # แจ้งเตือนอุปกรณ์ offline
```

---

## 5. Data Visualization

### 5.1 Chart Libraries แนะนำ

#### 5.1.1 `fl_chart` (แนะนำ #1)

```yaml
dependencies:
  fl_chart: ^0.68.0
```

**จุดเด่น:**
- สวยงาม ปรับแต่งได้ละเอียด
- Line chart, Bar chart, Pie chart, Scatter chart
- Touch interactions
- Animations
- Real-time updates ได้สบาย

#### 5.1.2 `syncfusion_flutter_charts`

```yaml
dependencies:
  syncfusion_flutter_charts: ^26.1.35
```

**จุดเด่น:**
- Enterprise-grade features
- Real-time updates มี built-in
- หลากหลาย chart types
- มี Community license (ฟรีสำหรับบริษัทเล็ก)

### 5.2 Implementation: Real-time Line Chart

```dart
// lib/widgets/power_chart.dart

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class RealTimePowerChart extends StatelessWidget {
  final List<double> data;
  final double maxY;
  
  const RealTimePowerChart({
    Key? key,
    required this.data,
    this.maxY = 5000,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: maxY / 5,
        ),
        titlesData: FlTitlesData(
          show: true,
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false), // ซ่อนเวลา
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 40,
              interval: maxY / 5,
              getTitlesWidget: (value, meta) {
                return Text(
                  '${value.toInt()}',
                  style: TextStyle(fontSize: 10),
                );
              },
            ),
          ),
          rightTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        borderData: FlBorderData(show: false),
        minX: 0,
        maxX: data.length.toDouble() - 1,
        minY: 0,
        maxY: maxY,
        lineBarsData: [
          LineChartBarData(
            spots: data.asMap().entries.map((e) {
              return FlSpot(e.key.toDouble(), e.value);
            }).toList(),
            isCurved: true,
            color: Theme.of(context).primaryColor,
            barWidth: 2,
            isStrokeCapRound: true,
            dotData: FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              color: Theme.of(context).primaryColor.withOpacity(0.1),
            ),
          ),
        ],
      ),
    );
  }
}
```

### 5.3 Implementation: Device Usage Bar Chart

```dart
class DeviceUsageChart extends StatelessWidget {
  final List<DeviceUsage> devices;
  
  @override
  Widget build(BuildContext context) {
    // Sort by usage (descending)
    final sortedDevices = [...devices]..sort((a, b) => b.kwh.compareTo(a.kwh));
    final maxUsage = sortedDevices.first.kwh;
    
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: maxUsage * 1.2,
        barTouchData: BarTouchData(
          enabled: true,
          touchTooltipData: BarTouchTooltipData(
            tooltipBgColor: Colors.blueGrey,
            getTooltipItem: (group, groupIndex, rod, rodIndex) {
              final device = sortedDevices[groupIndex];
              return BarTooltipItem(
                '${device.name}\n',
                TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                children: [
                  TextSpan(
                    text: '${device.kwh.toStringAsFixed(2)} kWh',
                    style: TextStyle(color: Colors.yellow),
                  ),
                ],
              );
            },
          ),
        ),
        titlesData: FlTitlesData(
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                final index = value.toInt();
                if (index < 0 || index >= sortedDevices.length) {
                  return const SizedBox.shrink();
                }
                return Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    sortedDevices[index].name.substring(0, min(8, sortedDevices[index].name.length)),
                    style: TextStyle(fontSize: 10),
                  ),
                );
              },
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        borderData: FlBorderData(show: false),
        barGroups: sortedDevices.asMap().entries.map((entry) {
          return BarChartGroupData(
            x: entry.key,
            barRods: [
              BarChartRodData(
                toY: entry.value.kwh,
                color: _getUsageColor(entry.value.kwh, maxUsage),
                width: 20,
                borderRadius: BorderRadius.circular(4),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }
  
  Color _getUsageColor(double usage, double max) {
    final ratio = usage / max;
    if (ratio > 0.7) return Colors.red;
    if (ratio > 0.4) return Colors.orange;
    return Colors.green;
  }
}
```

### 5.4 Animation Best Practices

```dart
// ใช้ Implicit Animations สำหรับตัวเลข
class AnimatedPowerDisplay extends StatelessWidget {
  final double watts;
  
  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: watts),
      duration: Duration(milliseconds: 300),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Text(
          value.toStringAsFixed(0),
          style: TextStyle(
            fontSize: 64,
            fontWeight: FontWeight.bold,
            fontFeatures: [FontFeature.tabularFigures()], // ตัวเลขไม่กระโดด
          ),
        );
      },
    );
  }
}
```

---

## 6. Performance Considerations

### 6.1 Data Throttling & Batching

```dart
class ThrottledStream<T> {
  final Duration throttleDuration;
  T? _lastValue;
  Timer? _throttleTimer;
  final _controller = StreamController<T>.broadcast();
  
  Stream<T> get stream => _controller.stream;
  
  ThrottledStream({this.throttleDuration = const Duration(milliseconds: 100)});
  
  void add(T value) {
    _lastValue = value;
    
    if (_throttleTimer?.isActive ?? false) return;
    
    _emit();
    _throttleTimer = Timer(throttleDuration, () {
      _throttleTimer = null;
    });
  }
  
  void _emit() {
    if (_lastValue != null) {
      _controller.add(_lastValue!);
    }
  }
  
  void dispose() {
    _throttleTimer?.cancel();
    _controller.close();
  }
}

// ใช้ใน BLoC
final _throttledPower = ThrottledStream<double>(
  throttleDuration: Duration(milliseconds: 200), // 5 updates/sec max
);
```

### 6.2 Chart Data Optimization

```dart
class ChartDataBuffer {
  final int maxPoints;
  final List<FlSpot> _data = [];
  
  ChartDataBuffer({this.maxPoints = 100});
  
  void add(FlSpot point) {
    _data.add(point);
    
    // Keep only recent points
    if (_data.length > maxPoints) {
      _data.removeAt(0);
    }
    
    // Downsample if too many points
    if (_data.length > maxPoints * 0.9) {
      _downsample();
    }
  }
  
  void _downsample() {
    // LTTB (Largest Triangle Three Buckets) algorithm หรือ simple decimation
    final newData = <FlSpot>[];
    final bucketSize = (_data.length / (maxPoints * 0.7)).ceil();
    
    for (int i = 0; i < _data.length; i += bucketSize) {
      final end = (i + bucketSize < _data.length) ? i + bucketSize : _data.length;
      final bucket = _data.sublist(i, end);
      
      // Take average of bucket
      final avgY = bucket.map((p) => p.y).reduce((a, b) => a + b) / bucket.length;
      newData.add(FlSpot(bucket.first.x, avgY));
    }
    
    _data
      ..clear()
      ..addAll(newData);
  }
  
  List<FlSpot> get data => List.unmodifiable(_data);
}
```

### 6.3 Memory Management

```dart
class PowerHistoryManager {
  static const int maxInMemoryPoints = 500;
  static const Duration retentionPeriod = Duration(hours: 24);
  
  final List<TimestampedValue> _history = [];
  
  void add(double value) {
    _history.add(TimestampedValue(
      timestamp: DateTime.now(),
      value: value,
    ));
    
    // Remove old data
    final cutoff = DateTime.now().subtract(retentionPeriod);
    _history.removeWhere((point) => point.timestamp.isBefore(cutoff));
    
    // Limit in-memory size
    if (_history.length > maxInMemoryPoints) {
      _history.removeAt(0);
    }
  }
  
  // Persist to local storage periodically
  Future<void> persist() async {
    final prefs = await SharedPreferences.getInstance();
    // Serialize and save...
  }
}
```

### 6.4 Widget Optimization

```dart
// ใช้ const constructors
const Card(
  child: const PowerDisplay(),
);

// ใช้ RepaintBoundary สำหรับ complex widgets
RepaintBoundary(
  child: CustomPaint(
    size: Size.infinite,
    painter: GridPainter(),
  ),
);

// ValueListenableBuilder แทน StreamBuilder ถ้าเป็นไปได้
ValueListenableBuilder<double>(
  valueListenable: powerNotifier,
  builder: (context, value, child) {
    return Text('${value.toStringAsFixed(0)} W');
  },
);

// Selective rebuilds ด้วย BlocSelector
BlocSelector<DashboardBloc, DashboardState, double>(
  selector: (state) => state.currentPowerWatts,
  builder: (context, power) {
    return PowerDisplay(watts: power);
  },
);
```

### 6.5 Battery Optimization

```dart
class BatteryAwareUpdater {
  static const Duration activeUpdateInterval = Duration(seconds: 1);
  static const Duration backgroundUpdateInterval = Duration(minutes: 5);
  
  Timer? _updateTimer;
  
  void start() {
    // ลดความถี่เมื่อแอพไม่ได้ใช้งาน
    AppLifecycleListener(
      onStateChange: (state) {
        switch (state) {
          case AppLifecycleState.resumed:
            _setUpdateInterval(activeUpdateInterval);
          case AppLifecycleState.paused:
          case AppLifecycleState.inactive:
            _setUpdateInterval(backgroundUpdateInterval);
          case AppLifecycleState.detached:
            _stopUpdates();
          case AppLifecycleState.hidden:
            _setUpdateInterval(backgroundUpdateInterval);
        }
      },
    );
  }
  
  void _setUpdateInterval(Duration interval) {
    _updateTimer?.cancel();
    _updateTimer = Timer.periodic(interval, (_) => _fetchUpdate());
  }
  
  void _stopUpdates() {
    _updateTimer?.cancel();
    _updateTimer = null;
  }
  
  void dispose() {
    _stopUpdates();
  }
}
```

### 6.6 Network Optimization

```dart
class MqttConnectionOptimizer {
  // QoS Levels
  // - QoS 0: At most once (fire and forget) - เร็วสุด
  // - QoS 1: At least once - ปานกลาง
  // - QoS 2: Exactly once - ช้าสุด
  
  MqttQos getQoSForTopic(String topic) {
    if (topic.contains('realtime') || topic.contains('power')) {
      return MqttQos.atMostOnce; // ข้อมูล real-time ส่งเร็วๆ
    }
    if (topic.contains('config') || topic.contains('command')) {
      return MqttQos.exactlyOnce; // คำสั่งต้องแน่ใจว่าถึง
    }
    return MqttQos.atLeastOnce; // ค่าเริ่มต้น
  }
  
  // Compression สำหรับ payload ใหญ่
  String compressPayload(Map<String, dynamic> data) {
    final jsonString = jsonEncode(data);
    // ใช้ dart:zlib หรือ gzip ถ้า payload ใหญ่
    return jsonString;
  }
}
```

---

## 7. สรุปและข้อเสนอแนะ

### 7.1 Technology Stack ที่แนะนำ

| Layer | Technology |
|-------|------------|
| **Framework** | Flutter |
| **State Management** | flutter_bloc (BLoC pattern) |
| **MQTT Client** | mqtt_client (Pure Dart) |
| **Charts** | fl_chart |
| **DI** | get_it + injectable |
| **Local Storage** | hive หรือ isar |
| **Reactive** | rxdart |

### 7.2 ข้อเสนอแนะสำหรับการพัฒนา

**Phase 1: Foundation (สัปดาห์ 1-2)**
1. ตั้งค่า Flutter project พร้อม BLoC architecture
2. Implement MQTT Repository พร้อม auto-reconnect
3. สร้าง connection status indicator

**Phase 2: Core Features (สัปดาห์ 3-4)**
1. Dashboard พร้อม real-time power display
2. Device list แบบ basic
3. Simple line chart สำหรับ power history

**Phase 3: Polish (สัปดาห์ 5-6)**
1. Advanced charts (bar, pie)
2. Historical data view
3. Notifications/Alerts
4. UI animations

**Phase 4: Optimization (สัปดาห์ 7-8)**
1. Performance tuning
2. Battery optimization
3. Error handling แบบ comprehensive
4. Testing (unit, widget, integration)

### 7.3 สิ่งที่ต้องระวัง

| ปัญหา | แนวทางแก้ไข |
|-------|------------|
| **Memory leaks** | ปิด subscription ทุกครั้งใน dispose |
| **Battery drain** | Throttle updates, reduce frequency in background |
| **UI jank** | ใช้ const, RepaintBoundary, ลด rebuilds |
| **Connection drops** | Auto-reconnect, exponential backoff |
| **Data overflow** | Limit history, downsample charts |

### 7.4 ตัวอย่างโครงสร้างโปรเจค

```
lib/
├── main.dart
├── app.dart
├── injection.dart              # Dependency injection
├── config/
│   ├── constants.dart
│   ├── routes.dart
│   └── theme.dart
├── core/
│   ├── extensions/
│   ├── utils/
│   └── widgets/
├── data/
│   ├── models/
│   ├── repositories/
│   └── datasources/
│       ├── local/
│       └── remote/
│           └── mqtt/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
├── presentation/
│   ├── blocs/
│   ├── pages/
│   └── widgets/
└── services/
    └── notification_service.dart
```

---

## แนวทางการทดสอบ

### Unit Tests
```dart
group('DashboardBloc', () {
  blocTest<DashboardBloc, DashboardState>(
    'emits updated power when data received',
    build: () => DashboardBloc(mockMqttRepo),
    act: (bloc) => bloc.add(PowerDataReceived(1500.0)),
    expect: () => [
      DashboardState(currentPowerWatts: 1500.0),
    ],
  );
});
```

### Integration Tests
```dart
// ทดสอบ MQTT connection lifecycle
testWidgets('reconnects automatically after disconnection', (tester) async {
  // ...
});
```

---

**จัดทำโดย:** บีม (Mobile Lead)  
**หากมีข้อสงสัยเพิ่มเติม สามารถสอบถามได้ครับ**
