# PowerTrack - Implementation Tasks

## Phase 1: Foundation (Week 1-2)

### Infrastructure Setup
- [ ] **INFRA-001**: Setup HiveMQ Cloud account
  - Estimate: 2 hours
  - Create free tier cluster
  - Configure authentication credentials
  - Document cluster endpoint
  - Test connection with mosquitto CLI

- [ ] **INFRA-002**: Setup development environment with Docker Compose
  - Estimate: 4 hours
  - PostgreSQL, InfluxDB, Redis containers
  - Docker networking configuration
  - Volume persistence setup

- [ ] **INFRA-003**: Setup Git repository and CI/CD pipeline
  - Estimate: 4 hours
  - GitHub/GitLab repository structure
  - Branch protection rules (main, develop)
  - GitHub Actions for linting and testing

### Backend Foundation
- [ ] **BACK-001**: Initialize Node.js + TypeScript project structure
  - Estimate: 6 hours
  - Express.js setup
  - TypeScript configuration
  - ESLint + Prettier setup
  - Folder structure (Clean Architecture)

- [ ] **BACK-002**: Setup database connections (PostgreSQL + InfluxDB)
  - Estimate: 6 hours
  - Prisma ORM setup for PostgreSQL
  - InfluxDB client configuration
  - Connection pooling
  - Health check endpoints

- [ ] **BACK-003**: Implement authentication system
  - Estimate: 8 hours
  - User registration endpoint
  - Login with JWT tokens
  - Password hashing (Argon2id)
  - Token refresh mechanism
  - Logout endpoint

- [ ] **BACK-004**: Setup MQTT bridge service for HiveMQ
  - Estimate: 10 hours
  - MQTT client connection to HiveMQ Cloud (TLS)
  - Subscribe to `homesync/+/nodes/+/telemetry/+`
  - Message routing to InfluxDB
  - Device status tracking via LWT
  - Error handling and reconnection

- [ ] **BACK-005**: Create base API endpoints (Users, Devices)
  - Estimate: 8 hours
  - CRUD endpoints for users
  - CRUD endpoints for NodeMCU devices
  - Input validation (Zod)
  - Error handling middleware
  - API documentation (Swagger/OpenAPI)

- [ ] **BACK-006**: Implement WebSocket service for real-time updates
  - Estimate: 8 hours
  - WebSocket server with authentication
  - Subscribe to Redis pub/sub
  - Broadcast device updates to clients
  - Connection management

### Firmware Foundation
- [ ] **FIRM-001**: Setup PlatformIO project for NodeMCU
  - Estimate: 4 hours
  - Project structure for ESP8266/ESP32
  - Library dependencies (PubSubClient, ArduinoJson, etc.)
  - Build configurations for multiple boards
  - Serial debugging setup

- [ ] **FIRM-002**: Implement WiFi connection manager
  - Estimate: 6 hours
  - WiFi station mode with auto-reconnect
  - WiFiManager for initial setup (captive portal)
  - Connection status LED indicator
  - Fallback to AP mode if connection fails

- [ ] **FIRM-003**: Implement MQTT client for HiveMQ
  - Estimate: 8 hours
  - TLS connection to HiveMQ Cloud
  - Auto-reconnect with exponential backoff
  - LWT (Last Will and Testament) configuration
  - Connection status publishing

- [ ] **FIRM-004**: Implement PZEM-004T sensor reading
  - Estimate: 8 hours
  - UART communication with PZEM
  - Read voltage, current, power, energy, frequency, PF
  - Error handling for sensor failures
  - Calibration support

- [ ] **FIRM-005**: Implement telemetry publishing
  - Estimate: 6 hours
  - Publish to `homesync/{home_id}/nodes/{node_id}/telemetry/{metric}`
  - Configurable publish interval (default 5s)
  - JSON payload formatting
  - Quality indicator

### Mobile Foundation
- [ ] **MOB-001**: Initialize Flutter project with proper structure
  - Estimate: 4 hours
  - Flutter 3.x setup
  - Project folder structure (Clean Architecture)
  - Analysis options configuration
  - Splash screen setup

- [ ] **MOB-002**: Integrate core dependencies
  - Estimate: 4 hours
  - flutter_bloc for state management
  - dio for HTTP client
  - web_socket_channel for WebSocket
  - sqflite for local storage
  - get_it for dependency injection

- [ ] **MOB-003**: Setup BLoC pattern architecture
  - Estimate: 6 hours
  - Base BLoC classes
  - Event/state structure
  - BLoC observer for debugging
  - Example feature implementation

- [ ] **MOB-004**: Implement local database (SQLite)
  - Estimate: 6 hours
  - Database helper class
  - Tables: devices, readings, settings, alerts, sync_queue
  - CRUD operations for each table
  - Migration strategy

- [ ] **MOB-005**: Create design system components
  - Estimate: 8 hours
  - Color palette (dark theme)
  - Typography (Inter font)
  - Button components
  - Card components
  - Loading indicators
  - Empty state widgets

---

## Phase 2: Core Features (Week 3-4)

### Authentication & Onboarding
- [ ] **MOB-006**: Implement login screen
  - Estimate: 6 hours
  - Email/password form
  - Form validation
  - Error handling
  - Loading states

- [ ] **MOB-007**: Implement registration screen
  - Estimate: 6 hours
  - Registration form
  - Password confirmation
  - Terms acceptance
  - Success feedback

- [ ] **MOB-008**: Create onboarding flow
  - Estimate: 6 hours
  - Welcome screens
  - App feature highlights
  - DIY hardware introduction
  - Skip option for existing users

### Device Discovery & Setup
- [ ] **MOB-009**: Implement device discovery (mDNS)
  - Estimate: 8 hours
  - Network scan for NodeMCU devices
  - Display discovered devices
  - Show device info (IP, firmware, signal)
  - Manual IP entry option

- [ ] **MOB-010**: Create Add Device wizard
  - Estimate: 10 hours
  - Step-by-step setup flow
  - Home ID generation/entry
  - Device naming
  - Location assignment
  - Connection test

- [ ] **MOB-011**: Implement QR code pairing
  - Estimate: 6 hours
  - QR code scanner
  - Parse device configuration
  - Auto-fill setup form
  - Error handling for invalid codes

### Dashboard & Monitoring
- [ ] **MOB-012**: Implement Dashboard UI
  - Estimate: 10 hours
  - Hero card with current power
  - Stats grid (voltage, current, daily kWh)
  - Cost display card
  - Pull-to-refresh
  - Connection status indicator

- [ ] **MOB-013**: Integrate WebSocket for real-time updates
  - Estimate: 10 hours
  - WebSocket connection service
  - Auto-reconnect logic
  - Message parsing
  - BLoC integration

- [ ] **MOB-014**: Implement real-time power updates
  - Estimate: 8 hours
  - Power BLoC implementation
  - Real-time data stream from WebSocket
  - UI updates
  - Error handling for connection loss

- [ ] **MOB-015**: Create real-time chart (fl_chart)
  - Estimate: 10 hours
  - Live power trend chart
  - 1-hour default view
  - Auto-scrolling
  - Tap to see details

### Device Management
- [ ] **MOB-016**: Implement Devices list screen
  - Estimate: 8 hours
  - Device list UI
  - Online/offline indicators
  - Current power display
  - Signal strength indicator
  - Pull-to-refresh

- [ ] **MOB-017**: Create Device Detail screen
  - Estimate: 10 hours
  - Device info display
  - Real-time metrics (W, V, A, kWh, PF, Hz)
  - Firmware version
  - WiFi signal (RSSI)
  - History quick link

### Firmware Development
- [ ] **FIRM-006**: Implement command handling (relay control)
  - Estimate: 8 hours
  - Subscribe to `command/relay` topic
  - Parse command payload
  - Control relay GPIO
  - Send response

- [ ] **FIRM-007**: Implement status reporting
  - Estimate: 6 hours
  - Publish online status
  - Report relay state
  - Report firmware version
  - Report WiFi RSSI

- [ ] **FIRM-008**: Implement configuration via MQTT
  - Estimate: 6 hours
  - Subscribe to `command/config` topic
  - Update telemetry interval
  - Update thresholds
  - Save to EEPROM

---

## Phase 2.5: Device Control (Week 5)

### Command Infrastructure
- [ ] **BACK-007**: Implement command processor service
  - Estimate: 10 hours
  - REST endpoint for device commands
  - Command validation
  - MQTT publish to HiveMQ
  - Response handling with timeout
  - Retry logic with exponential backoff

- [ ] **BACK-008**: Create device capabilities API
  - Estimate: 6 hours
  - Detect and store device capabilities
  - Capability update on firmware changes
  - Capabilities query endpoint
  - Device type definitions

- [ ] **MOB-018**: Implement device control BLoC
  - Estimate: 8 hours
  - Command state management
  - Optimistic UI updates
  - Error handling and retry
  - Multi-device state tracking

### Device Control UI
- [ ] **MOB-019**: Enhanced device detail with controls
  - Estimate: 10 hours
  - Power toggle with state feedback
  - Real-time state sync
  - Command progress indicator
  - Error handling and retry

- [ ] **MOB-020**: Implement bulk device control
  - Estimate: 8 hours
  - Multi-select mode
  - Bulk on/off operations
  - Progress tracking
  - Confirmation dialogs
  - "All Off" functionality

### Safety & Confirmation
- [ ] **MOB-021**: Implement safety confirmations
  - Estimate: 6 hours
  - Critical device warnings
  - Bulk operation confirmations
  - Haptic feedback for controls
  - Undo functionality (within 5 seconds)

---

## Phase 3: History & Analytics (Week 6-7)

### Historical Data
- [ ] **BACK-009**: Implement readings API with aggregation
  - Estimate: 8 hours
  - Query endpoints for historical data
  - Time-range filtering
  - Granularity selection (raw, hour, day)
  - Pagination

- [ ] **BACK-010**: Setup InfluxDB retention policies
  - Estimate: 4 hours
  - Raw data retention (90 days)
  - Hourly aggregation tasks
  - Daily aggregation tasks
  - Downsampling configuration

- [ ] **MOB-022**: Implement History screen
  - Estimate: 10 hours
  - Time range selector (Today, Week, Month, Custom)
  - Historical chart display
  - Data table view
  - Device filter
  - State change markers on charts

- [ ] **MOB-023**: Create chart time range selection
  - Estimate: 8 hours
  - 1h, 6h, 24h, 7d, 30d presets
  - Custom date range picker
  - Granularity auto-selection
  - Chart zoom/pan

### Analytics
- [ ] **MOB-024**: Implement usage statistics display
  - Estimate: 8 hours
  - Summary cards (total, average, peak)
  - Peak usage analysis
  - Usage patterns
  - Comparison with previous period

- [ ] **MOB-025**: Create device comparison view
  - Estimate: 6 hours
  - Pie chart of device usage
  - Side-by-side comparison
  - Ranking by usage/cost

- [ ] **MOB-026**: Implement data export (CSV)
  - Estimate: 6 hours
  - CSV generation
  - Date range selection
  - Share functionality
  - Download to device

---

## Phase 3.5: Scheduling (Week 8)

### Backend Schedule System
- [ ] **BACK-011**: Implement schedule executor service
  - Estimate: 10 hours
  - Cron-based job scheduling
  - Schedule storage and retrieval
  - Execution queue with Bull
  - Retry logic for offline devices
  - Execution logging

- [ ] **BACK-012**: Create schedule management API
  - Estimate: 8 hours
  - CRUD for schedules
  - Recurring pattern support
  - Multi-device schedules
  - Schedule conflict detection
  - Next execution calculation

### Mobile Schedule UI
- [ ] **MOB-027**: Implement schedule list screen
  - Estimate: 8 hours
  - List all schedules with status
  - Group by active/disabled
  - Show next execution time
  - Enable/disable toggle

- [ ] **MOB-028**: Create schedule builder
  - Estimate: 12 hours
  - Device and action selection
  - Time picker
  - Recurring pattern selection
  - Schedule name and notes
  - Preview of next executions

- [ ] **MOB-029**: Implement schedule notifications
  - Estimate: 6 hours
  - Pre-execution reminders
  - Execution confirmations
  - Failure alerts
  - Daily schedule summary

---

## Phase 4: Cost & Budgeting (Week 9)

### Cost Calculation
- [ ] **BACK-013**: Implement tariff management API
  - Estimate: 6 hours
  - CRUD for tariff configurations
  - Thai MEA/PEA tariff templates
  - Custom tariff support

- [ ] **BACK-014**: Create cost calculation service
  - Estimate: 8 hours
  - Real-time cost calculation
  - Daily/monthly aggregation
  - Projection algorithms
  - Budget tracking

- [ ] **MOB-030**: Implement Cost screen
  - Estimate: 8 hours
  - Current spending display
  - Daily/Monthly breakdown
  - Cost trend chart
  - Device cost breakdown

- [ ] **MOB-031**: Create tariff configuration
  - Estimate: 6 hours
  - Tariff selection (MEA/PEA/Custom)
  - Rate input forms
  - Service charge/VAT settings
  - Validation

### Budget Management
- [ ] **MOB-032**: Implement budget setup
  - Estimate: 6 hours
  - Monthly budget input
  - Alert threshold setting
  - Recurring budget option
  - Currency selection

- [ ] **MOB-033**: Create budget tracking display
  - Estimate: 6 hours
  - Progress bar visualization
  - Color-coded status
  - Projected final amount
  - Days remaining

---

## Phase 5: OTA & Firmware Management (Week 10)

### OTA Infrastructure
- [ ] **FIRM-009**: Implement OTA update mechanism
  - Estimate: 12 hours
  - Firmware download over HTTPS
  - Flash writing with verification
  - Rollback on failure
  - Progress reporting via MQTT

- [ ] **FIRM-010**: Implement firmware versioning
  - Estimate: 4 hours
  - Semantic versioning
  - Version reporting on startup
  - Compatibility checking

- [ ] **BACK-015**: Create OTA management API
  - Estimate: 8 hours
  - Firmware upload endpoint
  - Version management
  - Rollout control (canary, percentage)
  - OTA status tracking

### Mobile OTA UI
- [ ] **MOB-034**: Implement firmware update screen
  - Estimate: 8 hours
  - Check for updates
  - Show changelog
  - Update progress
  - Update history

- [ ] **MOB-035**: Create device diagnostics
  - Estimate: 6 hours
  - WiFi diagnostics
  - MQTT connection status
  - Error logs
  - Signal strength history

---

## Phase 6: Automation (Week 11-12)

### Backend Automation Engine
- [ ] **BACK-016**: Implement automation engine
  - Estimate: 16 hours
  - Rule evaluation system
  - Trigger monitoring (device, time, energy)
  - Condition evaluation (AND/OR logic)
  - Action execution queue
  - Cooldown and rate limiting

- [ ] **BACK-017**: Create automation management API
  - Estimate: 10 hours
  - CRUD for automation rules
  - Rule validation
  - Template system
  - Execution history logging

- [ ] **BACK-018**: Implement trigger monitors
  - Estimate: 8 hours
  - Device state monitor
  - Power threshold monitor
  - Time-based trigger scheduler
  - Energy budget monitor

### Mobile Automation UI
- [ ] **MOB-036**: Implement automation list screen
  - Estimate: 8 hours
  - List all automation rules
  - Active/inactive toggle
  - Last triggered time
  - Success rate indicator

- [ ] **MOB-037**: Create rule builder
  - Estimate: 16 hours
  - Visual trigger selection
  - Condition builder with AND/OR
  - Action configuration
  - Test automation function
  - Template browser

- [ ] **MOB-038**: Implement energy automation templates
  - Estimate: 8 hours
  - Auto-off when idle template
  - Budget protection template
  - Peak hour management template
  - High consumption alert template

- [ ] **MOB-039**: Create automation history view
  - Estimate: 6 hours
  - Execution log
  - Success/failure tracking
  - Energy impact display
  - Filter by automation

---

## Phase 7: Scenes (Week 13)

### Backend Scene Management
- [ ] **BACK-019**: Implement scene manager service
  - Estimate: 10 hours
  - Scene storage and retrieval
  - Scene activation coordinator
  - Sequential action execution
  - State snapshot functionality

- [ ] **BACK-020**: Create scene API
  - Estimate: 8 hours
  - CRUD for scenes
  - Scene templates
  - Activation endpoint
  - Execution logging

### Mobile Scene UI
- [ ] **MOB-040**: Implement scene list and dashboard
  - Estimate: 8 hours
  - Grid/list view of scenes
  - Favorite scenes section
  - Recent scenes section
  - Scene activation with animation

- [ ] **MOB-041**: Create scene builder
  - Estimate: 12 hours
  - Device selection
  - State configuration per device
  - Delay configuration
  - Icon and color selection
  - Live preview

- [ ] **MOB-042**: Implement scene templates
  - Estimate: 6 hours
  - "Good Morning" template
  - "Leaving Home" template
  - "Movie Night" template
  - "Bedtime" template
  - "Focus Mode" template

- [ ] **MOB-043**: Create scene execution feedback
  - Estimate: 6 hours
  - Progress indicator
  - Device-by-device status
  - Partial success handling
  - Retry failed devices

---

## Phase 8: Alerts & Notifications (Week 14)

### Alert System
- [ ] **BACK-021**: Implement alert engine
  - Estimate: 8 hours
  - Threshold monitoring
  - Anomaly detection
  - Automation trigger alerts
  - Schedule execution alerts
  - Notification queue

- [ ] **BACK-022**: Setup push notification service
  - Estimate: 8 hours
  - Firebase Cloud Messaging integration
  - APNs configuration (iOS)
  - Device token management
  - Notification templates

- [ ] **BACK-023**: Create alert configuration API
  - Estimate: 6 hours
  - Alert rule CRUD
  - Per-device alerts
  - Global alerts
  - Quiet hours
  - Automation notification preferences

- [ ] **MOB-044**: Implement Alerts screen
  - Estimate: 8 hours
  - Alert history list
  - Read/unread status
  - Filter by type (threshold, budget, device, automation)
  - Clear all option

- [ ] **MOB-045**: Create alert settings
  - Estimate: 6 hours
  - Alert type toggles
  - Threshold configuration
  - Quiet hours setup
  - Automation notification settings
  - Test notification

- [ ] **MOB-046**: Implement push notification handling
  - Estimate: 6 hours
  - Foreground handling
  - Background handling
  - Deep linking to relevant screen
  - Notification grouping
  - Automation action buttons

---

## Phase 9: Settings & Polish (Week 15)

### Settings
- [ ] **MOB-047**: Implement Settings screen
  - Estimate: 8 hours
  - User profile settings
  - Unit preferences (W/kW, °C/°F)
  - Currency settings
  - Theme settings
  - About section

- [ ] **MOB-048**: Create account management
  - Estimate: 6 hours
  - Change password
  - Update profile
  - Logout
  - Delete account

### Sync & Offline
- [ ] **MOB-049**: Implement sync queue system
  - Estimate: 8 hours
  - Queue pending changes
  - Retry logic
  - Conflict resolution
  - Sync status display

- [ ] **MOB-050**: Create offline mode handling
  - Estimate: 6 hours
  - Offline detection
  - Cached data display
  - Queue operations for later
  - Reconnect sync

### UI Polish
- [ ] **MOB-051**: Implement animations and transitions
  - Estimate: 6 hours
  - Page transitions
  - Micro-interactions
  - Loading animations
  - Success/error feedback

- [ ] **MOB-052**: Add haptic feedback
  - Estimate: 2 hours
  - Button presses
  - Success actions
  - Error notifications

- [ ] **MOB-053**: Implement app icons and splash
  - Estimate: 4 hours
  - iOS app icons (all sizes)
  - Android adaptive icons
  - Launch screen
  - Dark/light variants

---

## Phase 10: Testing & QA (Week 16-17)

### Testing
- [ ] **TEST-001**: Write unit tests for BLoCs
  - Estimate: 12 hours
  - Power BLoC tests
  - Device BLoC tests
  - Cost BLoC tests
  - Control BLoC tests
  - Automation BLoC tests
  - Mock repositories

- [ ] **TEST-002**: Write widget tests
  - Estimate: 12 hours
  - Dashboard widget tests
  - Device list tests
  - Form validation tests
  - Navigation tests
  - Control UI tests

- [ ] **TEST-003**: Write integration tests
  - Estimate: 12 hours
  - End-to-end flows
  - WebSocket integration
  - API integration
  - Database operations
  - Automation execution tests

- [ ] **TEST-004**: Backend unit tests
  - Estimate: 12 hours
  - Service layer tests
  - API endpoint tests
  - MQTT bridge tests
  - Database query tests
  - Automation engine tests

- [ ] **TEST-005**: Firmware testing
  - Estimate: 8 hours
  - Unit tests for sensor reading
  - MQTT connection tests
  - OTA update tests
  - Hardware-in-the-loop tests

### QA & Bug Fixes
- [ ] **QA-001**: Conduct feature testing
  - Estimate: 20 hours
  - Test all user flows
  - Device compatibility testing (ESP8266 + ESP32)
  - Network condition testing
  - Edge case testing
  - Multi-user scenario testing

- [ ] **QA-002**: Performance testing
  - Estimate: 10 hours
  - Memory leak detection
  - Battery usage analysis
  - Network usage optimization
  - Chart rendering performance
  - Automation execution performance

- [ ] **QA-003**: Security audit
  - Estimate: 10 hours
  - API security review
  - JWT implementation review
  - MQTT ACL verification
  - Input validation testing
  - Remote control security testing

---

## Phase 11: Deployment (Week 18)

### Backend Deployment
- [ ] **DEPLOY-001**: Setup production infrastructure
  - Estimate: 8 hours
  - AWS/GCP project setup
  - VPC networking
  - Security groups
  - SSL certificates

- [ ] **DEPLOY-002**: Deploy backend services
  - Estimate: 8 hours
  - Containerize backend
  - Setup Kubernetes/EKS
  - Configure auto-scaling
  - Setup load balancers

- [ ] **DEPLOY-003**: Setup production databases
  - Estimate: 6 hours
  - RDS PostgreSQL setup
  - InfluxDB Cloud setup
  - Redis ElastiCache setup
  - Backup configuration

### Mobile Deployment
- [ ] **DEPLOY-004**: Prepare iOS release
  - Estimate: 6 hours
  - App Store Connect setup
  - Certificates and provisioning
  - Build archive
  - App Store submission

- [ ] **DEPLOY-005**: Prepare Android release
  - Estimate: 6 hours
  - Play Console setup
  - Keystore management
  - AAB build
  - Play Store submission

- [ ] **DEPLOY-006**: Setup CI/CD for mobile
  - Estimate: 6 hours
  - Codemagic/GitHub Actions
  - Automated builds
  - Beta distribution (TestFlight/Internal Testing)
  - Release automation

### Monitoring & Documentation
- [ ] **DEPLOY-007**: Setup monitoring and alerting
  - Estimate: 6 hours
  - Datadog/Grafana Cloud
  - Error tracking (Sentry)
  - Uptime monitoring
  - Alert thresholds

- [ ] **DEPLOY-008**: Create user documentation
  - Estimate: 8 hours
  - Hardware assembly guide
  - Firmware flashing guide
  - App user guide
  - Troubleshooting guide
  - Video tutorials

---

## Post-Launch (Week 19+)

### Analytics & Optimization
- [ ] **POST-001**: Implement analytics tracking
  - Estimate: 6 hours
  - Firebase Analytics
  - Custom events (automation usage, scene usage)
  - User funnels
  - Retention metrics

- [ ] **POST-002**: Performance optimization
  - Estimate: Ongoing
  - Memory optimization
  - Startup time improvement
  - Chart rendering optimization
  - API response caching
  - Automation engine optimization

### User Feedback
- [ ] **POST-003**: Implement feedback system
  - Estimate: 4 hours
  - In-app feedback form
  - Rating prompt
  - Support contact
  - FAQ section

### Iteration
- [ ] **POST-004**: Plan v1.1 features
  - Estimate: Planning
  - Voice control integration
  - AI-powered recommendations
  - Mobile widgets
  - Wear OS / Apple Watch app
  - Multi-home support
  - Family sharing

---

## Task Summary

| Phase | Duration | Total Hours |
|-------|----------|-------------|
| Phase 1: Foundation | Week 1-2 | ~100 hours |
| Phase 2: Core Features | Week 3-4 | ~92 hours |
| Phase 2.5: Device Control | Week 5 | ~48 hours |
| Phase 3: History & Analytics | Week 6-7 | ~60 hours |
| Phase 3.5: Scheduling | Week 8 | ~40 hours |
| Phase 4: Cost & Budgeting | Week 9 | ~40 hours |
| Phase 5: OTA & Firmware | Week 10 | ~42 hours |
| Phase 6: Automation | Week 11-12 | ~72 hours |
| Phase 7: Scenes | Week 13 | ~42 hours |
| Phase 8: Alerts & Notifications | Week 14 | ~50 hours |
| Phase 9: Settings & Polish | Week 15 | ~48 hours |
| Phase 10: Testing & QA | Week 16-17 | ~96 hours |
| Phase 11: Deployment | Week 18 | ~54 hours |
| **Total** | **18 weeks** | **~784 hours** |

### Team Allocation (Estimated)

| Role | Count | Responsibilities |
|------|-------|------------------|
| Flutter Developer | 2-3 | Mobile app development, UI/UX implementation |
| Backend Developer | 2 | API, MQTT bridge, Database, Automation Engine |
| Firmware Developer | 1-2 | NodeMCU firmware, OTA, sensor integration |
| DevOps Engineer | 1 | Infrastructure, CI/CD, monitoring |
| QA Engineer | 1-2 | Testing, Automation, Security audit |
| UI/UX Designer | 1 | Design system, Mockups, Scene builder design |
| Technical Writer | 1 | Documentation, guides, tutorials |
| System Analyst | 1 | Requirements, Architecture coordination |

### Critical Path

1. **Week 1-2**: Backend API + HiveMQ integration + Firmware foundation
2. **Week 3-4**: Device discovery + Real-time monitoring
3. **Week 5**: Device control via MQTT
4. **Week 10**: OTA updates working
5. **Week 12**: All features complete, testing begins
6. **Week 18**: Production deployment

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| MQTT instability (HiveMQ) | Implement retry logic, backend buffering |
| Firmware bugs | OTA update capability, staged rollouts |
| Device hardware failures | Clear DIY guide, community support |
| HiveMQ free tier limits | Monitor usage, upgrade plan ready |
| DIY setup complexity | Step-by-step video guides, pre-flashed options |
