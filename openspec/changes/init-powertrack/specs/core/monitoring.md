# Spec: Real-time Monitoring

## Domain: Core

This specification defines the real-time electricity monitoring functionality for PowerTrack.

---

## ADDED Requirements

### REQ-001: View Real-time Power Usage
The system MUST display current total power consumption across all connected devices.

#### Scenario: Dashboard shows live data
- GIVEN user has devices connected and online
- WHEN user opens Dashboard
- THEN total power (W) updates every 5-30 seconds
- AND displays voltage (V), current (A), power factor
- AND displays daily kWh accumulated
- AND displays estimated daily cost
- AND shows last update timestamp

#### Scenario: No devices connected
- GIVEN user has no devices registered
- WHEN user opens Dashboard
- THEN show empty state with device setup guide
- AND display "Add Device" CTA button

#### Scenario: Devices offline
- GIVEN user has registered devices but all are offline
- WHEN user opens Dashboard
- THEN display last known values with "offline" indicator
- AND show "Check Connection" troubleshooting guide
- AND display timestamp of last successful update

#### Scenario: Single device view
- GIVEN user is viewing a specific device detail
- WHEN real-time data arrives
- THEN update power gauge/chart immediately
- AND show device status (online/offline)
- AND display on/off state with visual indicator
- AND show last state change timestamp

---

### REQ-002: Device State Monitoring
The system MUST monitor and display on/off state of devices alongside power consumption.

#### Scenario: Monitor device state in dashboard
- GIVEN user is on Dashboard
- WHEN viewing device grid
- THEN show power consumption AND on/off status for each device
- AND use color coding (green=on, gray=off, amber=offline)
- AND show toggle button for quick control

#### Scenario: State change detection
- GIVEN device changes state
- WHEN on/off status changes
- THEN update UI within 2 seconds
- AND show brief animation for state change
- AND log state change with timestamp

#### Scenario: Combined power and state view
- GIVEN user is viewing energy data
- WHEN looking at device consumption
- THEN show power graph with state markers
- AND indicate periods when device was off (zero/standby power)
- AND correlate state changes with power spikes

### REQ-003: Real-time Chart Display
The system MUST display power consumption trends in real-time charts.

#### Scenario: Live power trend chart
- GIVEN user is on Dashboard
- WHEN real-time data updates
- THEN chart shows power trend over last 1 hour
- AND chart auto-scrolls with new data
- AND y-axis auto-scales based on max value

#### Scenario: Time range selection
- GIVEN user is viewing a chart
- WHEN user selects time range (1h, 6h, 24h, 7d)
- THEN chart reloads with appropriate aggregation
- AND maintains real-time updates for current period

#### Scenario: Chart interaction
- GIVEN chart is displaying data
- WHEN user taps on a data point
- THEN show detailed tooltip with timestamp and exact values
- AND allow zoom/pan on historical data

---

### REQ-004: Connection Status Indicator
The system MUST indicate connection status between app and devices.

#### Scenario: MQTT connected
- GIVEN app has active MQTT connection
- THEN show green "Live" indicator in app bar
- AND display "Connected" in settings

#### Scenario: MQTT disconnected
- GIVEN MQTT connection is lost
- THEN show amber "Reconnecting..." indicator
- AND attempt auto-reconnect with exponential backoff
- AND display last successful connection time

#### Scenario: Complete offline mode
- GIVEN no network connection available
- THEN show red "Offline" indicator
- AND display cached data with timestamp
- AND queue updates for later sync

---

### REQ-005: Pull-to-Refresh
The system MUST support manual refresh of real-time data.

#### Scenario: User pulls to refresh
- GIVEN user pulls down on Dashboard
- WHEN refresh gesture completes
- THEN trigger immediate data fetch
- AND update all displayed metrics
- AND show refresh timestamp

#### Scenario: Background refresh
- GIVEN app returns from background
- WHEN app becomes active
- THEN automatically refresh data
- AND sync any missed updates

---

### REQ-006: Unified Dashboard View
The system MUST provide a unified dashboard showing both energy and control data.

#### Scenario: Unified dashboard display
- GIVEN user opens Dashboard
- THEN show:
  - Total power consumption across all devices
  - Quick toggle controls for frequently used devices
  - Energy chart with real-time updates
  - Active scenes and automations
  - Recent alerts and notifications
- AND allow customizing dashboard layout

#### Scenario: Energy + Control correlation
- GIVEN user is analyzing usage
- WHEN viewing historical chart
- THEN show state change markers on the chart
- AND allow filtering by device state
- AND correlate control actions with energy changes

### REQ-007: Unit Display Preferences
The system MUST support customizable unit display.

#### Scenario: Power unit selection
- GIVEN user opens Settings
- WHEN user selects power unit preference
- THEN display options: Watts (W), Kilowatts (kW)
- AND apply to all power displays in app
- AND auto-convert values appropriately

#### Scenario: Currency selection
- GIVEN user is in cost settings
- WHEN user selects currency
- THEN display options: THB, USD, EUR, etc.
- AND apply currency symbol throughout app

#### Scenario: Temperature unit
- GIVEN device reports temperature data
- WHEN displaying temperature
- THEN respect user's °C/°F preference
- AND convert values automatically
