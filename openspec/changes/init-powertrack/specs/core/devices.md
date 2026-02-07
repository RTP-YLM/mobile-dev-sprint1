# Spec: Device Management

## Domain: Core

This specification defines device discovery, registration, and management functionality for NodeMCU-based devices.

---

## NodeMCU Device Specifications

### Hardware Options

#### Option 1: NodeMCU ESP8266 (Basic)

| Specification | Details |
|--------------|---------|
| **Microcontroller** | ESP8266 (ESP-12E/F module) |
| **WiFi** | Built-in 2.4GHz 802.11 b/g/n |
| **GPIO Pins** | 4-11 usable pins |
| **ADC** | 1 channel (10-bit, 0-1V or 0-3.3V) |
| **Flash Memory** | 4 MB |
| **RAM** | 80 KB |
| **Power** | 5V USB or 3.3V regulated |
| **Price** | ~฿100-150 |

#### Option 2: NodeMCU ESP32 (Advanced)

| Specification | Details |
|--------------|---------|
| **Microcontroller** | ESP32-D0WDQ6 |
| **WiFi** | Built-in 2.4GHz 802.11 b/g/n |
| **Bluetooth** | BLE + Classic |
| **GPIO Pins** | 18-30 usable pins |
| **ADC** | 12 channels (12-bit) |
| **Flash Memory** | 4-8 MB |
| **RAM** | 520 KB |
| **Power** | 5V USB or 3.3V |
| **Price** | ~฿150-300 |

### Recommended Configuration

**For most users:** ESP8266 is sufficient for single-circuit monitoring
**For advanced users:** ESP32 for multi-circuit, OTA updates, or future expansion

---

## Compatible Sensors

### 1. PZEM-004T (Power Monitoring Module)

**Specifications:**
- **Function:** AC power monitoring (Voltage, Current, Power, Energy, Frequency, Power Factor)
- **Voltage Range:** 80-260V AC
- **Current Range:** 0-100A (with external CT)
- **Communication:** UART (TTL)
- **Accuracy:** ±1%
- **Price:** ~฿200-300

**Measurements:**
| Metric | Unit | Accuracy |
|--------|------|----------|
| Voltage | V | ±1% |
| Current | A | ±1% |
| Active Power | W | ±1% |
| Energy | kWh | ±1% |
| Frequency | Hz | ±0.5Hz |
| Power Factor | - | ±0.1 |

**Wiring:**
```
PZEM-004T VCC  → NodeMCU 3.3V
PZEM-004T GND  → NodeMCU GND
PZEM-004T TX   → NodeMCU D6 (GPIO12) - via voltage divider
PZEM-004T RX   → NodeMCU D5 (GPIO14) - via voltage divider
PZEM-004T 5V   → NodeMCU VU (5V)
```

### 2. CT Clamp (Current Transformer)

**Specifications:**
- **Type:** SCT-013-000 (non-invasive)
- **Current Range:** 0-100A
- **Output:** 0-1V or 0-50mA
- **Split-core:** Can clip onto existing wires without cutting
- **Price:** ~฿100-200

**Use Cases:**
- Monitor main incoming power without electrical work
- Multi-circuit monitoring with multiple CTs
- Solar panel monitoring

### 3. Relay Module

**Specifications:**
- **Type:** 5V Single Channel Relay Module (active LOW)
- **Rating:** 10A @ 250V AC
- **Opto-isolated:** Yes
- **LED indicator:** Power + Active status
- **Price:** ~฿50-100

**Wiring:**
```
Relay VCC  → NodeMCU 3.3V
Relay GND  → NodeMCU GND
Relay IN   → NodeMCU D1 (GPIO5)
Relay NO   → Device Live wire
Relay COM  → Power Source Live
```

**Safety Warning:**
- Use appropriate enclosure rated for electrical installations
- Ensure proper wire gauge for load current
- Include fuse protection
- Consider hiring a licensed electrician for installation

---

## Device Capabilities

### Capabilities Model

```typescript
interface NodeCapabilities {
  // Control capabilities
  control: {
    onOff: boolean;           // Relay control available
    relayCount: number;       // Number of relays (1-4)
  };
  
  // Monitoring capabilities
  monitoring: {
    power: boolean;           // Power measurement
    voltage: boolean;         // Voltage measurement
    current: boolean;         // Current measurement
    energy: boolean;          // Energy accumulation
    frequency: boolean;       // AC frequency
    powerFactor: boolean;     // Power factor
    temperature: boolean;     // Device temperature (ESP32)
  };
  
  // Device info
  info: {
    model: string;            // "NodeMCU-ESP8266" | "NodeMCU-ESP32"
    firmware: string;         // Firmware version
    macAddress: string;       // WiFi MAC address
    ipAddress: string;        // Current IP
    rssi: number;             // WiFi signal strength
  };
  
  // Features
  features: {
    ota: boolean;             // OTA updates supported
    webConfig: boolean;       // Web-based configuration
    mqttTls: boolean;         // TLS support
  };
}
```

### Capability Detection

Devices auto-report capabilities on startup:

```json
{
  "node_id": "node-001",
  "capabilities": {
    "control": {
      "onOff": true,
      "relayCount": 1
    },
    "monitoring": {
      "power": true,
      "voltage": true,
      "current": true,
      "energy": true,
      "frequency": true,
      "powerFactor": true,
      "temperature": false
    },
    "features": {
      "ota": true,
      "webConfig": true,
      "mqttTls": true
    }
  },
  "sensors": ["PZEM-004T"],
  "firmware": "1.0.0"
}
```

---

## ADDED Requirements

### REQ-001: Device Discovery

The system MUST discover NodeMCU devices on the local network.

#### Scenario: Auto-discovery on setup
- GIVEN user initiates device setup
- WHEN app scans local network
- THEN discover NodeMCU devices via mDNS
- AND display discovered devices with:
  - Device name (hostname)
  - IP address
  - Node ID
  - Firmware version
  - Signal strength (RSSI)

#### Scenario: Manual device entry
- GIVEN auto-discovery fails or user prefers manual
- WHEN user enters device IP address
- THEN attempt connection to device HTTP endpoint
- AND validate device is HomeSync-compatible
- AND retrieve device information and capabilities

#### Scenario: QR code pairing
- GIVEN device has QR code sticker
- WHEN user scans QR code
- THEN extract device ID and configuration URL
- AND initiate pairing process

#### Scenario: No devices found
- GIVEN scan completes with no results
- THEN display troubleshooting steps:
  - Check WiFi network (2.4GHz required)
  - Verify device is powered on
  - Confirm device is in setup mode
- AND provide manual entry option

---

### REQ-002: Device Registration

The system MUST register discovered devices to user's account.

#### Scenario: Register single device
- GIVEN device is discovered
- WHEN user selects device to add
- THEN prompt for:
  - Device name (custom label)
  - Room/location assignment
  - Circuit description
- AND verify device connectivity
- AND save device configuration with capabilities
- AND start receiving MQTT data

#### Scenario: Batch registration
- GIVEN multiple devices discovered
- WHEN user selects multiple devices
- THEN register all selected devices
- AND auto-generate unique names (e.g., "Smart Node 1", "Smart Node 2")
- AND allow editing names in batch

#### Scenario: Device already registered
- GIVEN device is already in user's device list
- WHEN attempting to add same device
- THEN show "Device already added" message
- AND offer to update configuration or reassign

#### Scenario: Firmware version check
- GIVEN device is being registered
- WHEN checking device info
- THEN compare firmware version with latest
- AND notify if update available
- AND provide update instructions

---

### REQ-003: Device List View

The system MUST display all registered devices in a list view.

#### Scenario: View all devices
- GIVEN user navigates to Devices tab
- THEN display list of all registered devices
- AND show current power reading for each
- AND show online/offline status indicator
- AND display device name and location
- AND show WiFi signal strength (RSSI)

#### Scenario: Device sorting
- GIVEN devices list is displayed
- WHEN user selects sort option
- THEN sort by: name, location, power usage (high-low), online status, signal strength
- AND persist sort preference

#### Scenario: Device filtering
- GIVEN many devices registered
- WHEN user searches or filters
- THEN filter by: name, location, status (online/offline), room
- AND show filter chip indicating active filter

#### Scenario: Empty device list
- GIVEN no devices registered
- WHEN user opens Devices tab
- THEN show empty state illustration
- AND display "Add Your First Device" CTA
- AND provide setup guide link

---

### REQ-004: Device Capabilities Detection

The system MUST detect and store device capabilities for control features.

#### Scenario: Detect control capabilities
- GIVEN device is being registered
- WHEN connecting to device
- THEN detect available capabilities:
  - On/Off control (relay available)
  - Number of relays
  - Power monitoring (PZEM connected)
  - Temperature monitoring (ESP32 only)
- AND store capabilities in device profile
- AND show capabilities in device detail

#### Scenario: Display capabilities in UI
- GIVEN device has known capabilities
- WHEN viewing device detail
- THEN show capability icons/badges
- AND enable/disable controls based on capabilities
- AND show "Not supported" for incompatible features

#### Scenario: Capabilities update
- GIVEN device firmware is updated
- WHEN device reconnects with new capabilities
- THEN detect updated capabilities
- AND update device profile automatically
- AND notify user of new available features

---

### REQ-005: Device Detail View

The system MUST show detailed information for a specific device.

#### Scenario: View device details
- GIVEN user taps on device in list
- THEN navigate to Device Detail screen
- AND display:
  - Device name, model, firmware version
  - Real-time metrics (W, V, A, kWh, PF, Hz)
  - Current on/off state with toggle control
  - Assigned location/room
  - Connection status and IP address
  - WiFi signal strength (RSSI)
  - Uptime counter
  - Available capabilities

#### Scenario: Edit device information
- GIVEN user is on device detail
- WHEN user taps edit
- THEN allow editing: name, location, icon
- AND save changes immediately
- AND sync to backend

#### Scenario: View device history
- GIVEN user is on device detail
- WHEN user selects "View History"
- THEN navigate to history view filtered by this device
- AND display usage charts and statistics

#### Scenario: Device diagnostics
- GIVEN user is on device detail
- WHEN user selects "Diagnostics"
- THEN show:
  - WiFi connection info
  - MQTT connection status
  - Last seen timestamp
  - Error logs (if any)
  - Signal strength history

---

### REQ-006: Device Control

The system MUST support device control operations via MQTT.

#### Scenario: Toggle device power
- GIVEN device has relay capability
- WHEN user taps power button
- THEN send toggle command via MQTT to `homesync/{home_id}/nodes/{node_id}/command/relay`
- AND show loading state while waiting
- AND update UI to reflect new state on confirmation
- AND display error if command fails
- AND sync state across all connected users

#### Scenario: Adjust brightness (if supported)
- GIVEN device supports dimming (future feature)
- WHEN user drags brightness slider
- THEN send brightness command immediately
- AND show brightness percentage
- AND update device brightness in real-time

#### Scenario: Device reboot
- GIVEN user is on device settings
- WHEN user selects "Reboot Device"
- THEN show confirmation dialog
- AND send reboot command via MQTT
- AND show "Rebooting..." status
- AND auto-refresh when device comes back online

#### Scenario: Device remove
- GIVEN user wants to remove device
- WHEN user selects "Remove Device"
- THEN show confirmation with warning about data loss
- AND warn if device is used in scenes or automations
- AND remove device from account
- AND remove from all scenes and automations
- AND optionally preserve historical data

---

### REQ-007: Device Organization

The system MUST support organizing devices by location/room.

#### Scenario: Assign device to room
- GIVEN device is registered
- WHEN user edits device location
- THEN show predefined rooms (Living Room, Bedroom, Kitchen, etc.)
- AND allow custom room name entry
- AND group devices by room in list view

#### Scenario: Create custom location
- GIVEN user wants new location
- WHEN entering location name
- THEN validate for uniqueness
- AND save to user's custom locations
- AND make available for other devices

#### Scenario: Room-based grouping
- GIVEN devices are assigned to rooms
- WHEN viewing devices list
- THEN group devices by room with expandable sections
- AND show aggregate power usage per room

#### Scenario: Floor plan view
- GIVEN devices are assigned to locations
- WHEN viewing devices
- THEN optionally show floor plan view
- AND place devices on floor plan by position

---

### REQ-008: Device Health Monitoring

The system MUST monitor device health and connectivity.

#### Scenario: Connection health check
- GIVEN device is registered
- THEN periodically check device connectivity via MQTT LWT
- AND log connection drops
- AND display uptime percentage

#### Scenario: WiFi signal monitoring
- GIVEN device reports RSSI
- WHEN signal is weak (< -70 dBm)
- THEN show warning indicator
- AND suggest moving device or adding WiFi extender

#### Scenario: Firmware version check
- GIVEN device is connected
- WHEN checking device info
- THEN compare firmware version with latest release
- AND notify if update available
- AND provide link to firmware update guide

#### Scenario: Temperature monitoring
- GIVEN device reports temperature (ESP32)
- WHEN temperature exceeds safe threshold (> 70°C)
- THEN show warning indicator
- AND optionally send alert notification

---

### REQ-009: OTA Update Support

The system MUST support Over-The-Air firmware updates.

#### Scenario: Check for updates
- GIVEN user is on device settings
- WHEN checking for firmware updates
- THEN query latest firmware version from backend
- AND compare with device current version
- AND show update availability

#### Scenario: Initiate OTA update
- GIVEN update is available
- WHEN user selects "Update Firmware"
- THEN show confirmation with changelog
- AND send OTA command to device
- AND show progress indicator
- AND verify update success

#### Scenario: OTA failure handling
- GIVEN OTA update fails
- WHEN device doesn't respond
- THEN retry update automatically (up to 3 times)
- AND notify user of failure
- AND provide manual update instructions

---

## Device Setup Guide

### Hardware Assembly

#### Bill of Materials (per node)

| Item | Quantity | Price (฿) | Notes |
|------|----------|-----------|-------|
| NodeMCU ESP8266 | 1 | 100-150 | Or ESP32 for advanced features |
| PZEM-004T v3.0 | 1 | 200-300 | Power monitoring module |
| SCT-013 CT Clamp | 1 | 100-200 | Optional, for non-invasive install |
| 5V Relay Module | 1 | 50-100 | For control capability |
| Breadboard + Jumper wires | 1 set | 50-100 | For prototyping |
| Enclosure (electrical grade) | 1 | 100-200 | Required for safety |
| **Total** | | **~600-1050** | |

#### Wiring Diagram

```
NodeMCU ESP8266
┌─────────────────┐
│  D1 (GPIO5)     ├──────► Relay IN
│  D5 (GPIO14)    ├──────► PZEM TX (via divider)
│  D6 (GPIO12)    ├──────► PZEM RX (via divider)
│  D7 (GPIO13)    ├──────► LED indicator (optional)
│  3.3V           ├──────► PZEM VCC
│  VU (5V)        ├──────► PZEM 5V
│  GND            ├──────► Common GND
└─────────────────┘
```

#### Voltage Divider (Important!)

PZEM outputs 5V signals but ESP8266 inputs are 3.3V only!

```
PZEM TX ──┬──[10kΩ]──┬──► NodeMCU RX (D6)
          │          │
         [20kΩ]    GND
          │
         GND
```

### Firmware Setup

#### 1. Install Prerequisites

```bash
# Install PlatformIO (recommended)
pip install platformio

# Or use Arduino IDE
# Download from https://www.arduino.cc/en/software
```

#### 2. Configure Firmware

```cpp
// config.h
#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// MQTT Configuration (HiveMQ Cloud)
#define MQTT_BROKER "your-cluster.s1.eu.hivemq.cloud"
#define MQTT_PORT 8883
#define MQTT_USER "your-hivemq-username"
#define MQTT_PASSWORD "your-hivemq-password"
#define MQTT_TLS true

// Device Configuration
#define DEVICE_ID "node-001"  // Unique per device
#define HOME_ID "home-abc123" // From app setup

// Pin Configuration
#define PZEM_RX_PIN 12  // D6
#define PZEM_TX_PIN 14  // D5
#define RELAY_PIN 5     // D1
#define LED_PIN 13      // D7 (optional)

// Update Interval
#define TELEMETRY_INTERVAL 5000  // 5 seconds

#endif
```

#### 3. Flash Firmware

```bash
# Using PlatformIO
pio run --target upload

# Or using Arduino IDE
# Select Board: "NodeMCU 1.0 (ESP-12E Module)"
# Select Port: your COM port
# Click Upload
```

#### 4. First Boot

1. Device boots in AP mode if no WiFi configured
2. Connect to "HomeSync-Setup" WiFi network
3. Open http://192.168.4.1 in browser
4. Configure WiFi and MQTT settings
5. Device restarts and connects to HiveMQ

---

## Safety Guidelines

### ⚠️ Important Safety Warnings

1. **Electrical Hazard:** Working with AC mains voltage can cause injury or death
2. **Qualified Personnel:** Consider hiring a licensed electrician for installation
3. **Proper Enclosure:** Always use electrical-grade enclosure rated for your installation
4. **Fuse Protection:** Include appropriate fuses in your circuit
5. **Wire Gauge:** Use wire gauge appropriate for your load current
6. **GFCI:** Consider GFCI protection for outdoor or wet locations

### Recommended Safety Features

- Use opto-isolated relay modules
- Include thermal fuse in enclosure
- Use proper strain relief for cables
- Label all connections clearly
- Keep low-voltage and high-voltage separated

---

## Troubleshooting

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Device won't connect to WiFi | Wrong credentials / 5GHz network | Check 2.4GHz network, verify password |
| MQTT connection fails | Wrong broker settings / TLS issue | Verify HiveMQ config, check certificates |
| No power readings | PZEM wiring / voltage divider | Check TX/RX connections, verify voltage divider |
| Relay not working | Wrong pin / insufficient power | Check pin assignment, verify 5V supply |
| OTA update fails | Insufficient memory / network issue | Use ESP32, check WiFi signal |

### Debug Mode

Enable serial debug in firmware:

```cpp
#define DEBUG_SERIAL Serial
#define DEBUG_LEVEL DEBUG_VERBOSE
```

Monitor serial output at 115200 baud for diagnostic messages.
