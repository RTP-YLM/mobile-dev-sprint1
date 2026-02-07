# Spec: Data Synchronization

## Domain: Technical

This specification defines data synchronization between mobile app, backend, and time-series database.

---

## ADDED Requirements

### REQ-001: Local Data Cache
The system MUST maintain local cache for offline functionality.

#### Scenario: SQLite local storage
- GIVEN app initializes
- THEN create SQLite database with tables:
  - devices (id, name, type, location, config)
  - readings (timestamp, device_id, power, voltage, current, energy)
  - settings (key, value)
  - alerts (id, type, message, timestamp, read)
  - sync_queue (id, operation, data, timestamp, retry_count)

#### Scenario: Cache recent data
- GIVEN new readings arrive
- WHEN processing
- THEN store last 7 days of readings locally
- AND prune older data automatically
- AND maintain device metadata indefinitely

#### Scenario: Read cache when offline
- GIVEN no network connection
- WHEN user requests data
- THEN serve from local cache
- AND show "Offline - Last updated: X minutes ago"
- AND disable write operations

---

### REQ-002: Sync Queue Management
The system MUST queue operations for later sync when offline.

#### Scenario: Queue device configuration changes
- GIVEN user edits device name while offline
- WHEN saving changes
- THEN add to sync_queue: `{operation: "update_device", data: {...}}`
- AND show pending indicator
- AND allow continued editing

#### Scenario: Queue readings during offline
- GIVEN device sends MQTT data
- WHEN backend unreachable
- THEN buffer readings locally (if needed for aggregation)
- OR queue for later batch upload
- AND maintain FIFO order

#### Scenario: Process sync queue
- GIVEN connection restored
- WHEN processing queue
- THEN send operations in order
- AND retry failed operations (max 3 attempts)
- AND remove successfully synced items
- AND show sync progress

#### Scenario: Sync conflict resolution
- GIVEN same data modified on multiple devices
- WHEN syncing
- THEN apply "last write wins" strategy
- OR server timestamp priority
- AND log conflict for debugging

---

### REQ-003: Backend API Integration
The system MUST sync with REST API for metadata operations.

#### Scenario: User authentication
- GIVEN user opens app
- WHEN authenticating
- THEN POST /auth/login with credentials
- AND receive JWT token
- AND store token securely (Keychain/Keystore)
- AND include token in subsequent requests

#### Scenario: Fetch user profile
- GIVEN user is authenticated
- WHEN app initializes
- THEN GET /api/v1/user/profile
- AND retrieve: user settings, preferences, tariff config
- AND sync with local settings

#### Scenario: Sync devices
- GIVEN devices registered locally
- WHEN syncing with backend
- THEN GET /api/v1/devices to fetch list
- AND POST /api/v1/devices for new devices
- AND PUT /api/v1/devices/{id} for updates
- AND DELETE for removals

#### Scenario: Fetch historical data
- GIVEN user requests history
- WHEN data not in local cache
- THEN GET /api/v1/readings?device_id=&from=&to=&granularity=
- AND paginate large requests (limit 1000 per request)
- AND cache response locally

---

### REQ-004: Time-Series Data Sync
The system MUST handle time-series data sync with InfluxDB.

#### Scenario: Real-time data ingestion
- GIVEN MQTT message arrives
- WHEN processing
- THEN write to InfluxDB via backend API:
  ```
  measurement: power_readings
  tags: device_id, user_id
  fields: power, voltage, current, energy
  timestamp: ISO8601
  ```

#### Scenario: Batch upload historical data
- GIVEN offline period with buffered data
- WHEN syncing
- THEN batch insert to minimize API calls
- AND use InfluxDB line protocol for efficiency
- AND verify successful write

#### Scenario: Query aggregated data
- GIVEN user requests history view
- WHEN querying
- THEN use Flux query language for aggregation:
  ```flux
  from(bucket: "powertrack")
    |> range(start: -7d)
    |> filter(fn: (r) => r._measurement == "power_readings")
    |> aggregateWindow(every: 1h, fn: mean)
  ```

#### Scenario: Data retention sync
- GIVEN retention policy applied
- WHEN querying old data
- THEN receive downsampled aggregates
- AND cache aggregation results
- AND handle missing raw data gracefully

---

### REQ-005: Background Sync
The system MUST perform background synchronization.

#### Scenario: Periodic background fetch
- GIVEN iOS/Android background fetch triggered
- WHEN executing
- THEN fetch latest readings
- AND sync pending queue
- AND update local cache
- AND schedule local notifications if needed

#### Scenario: Push notification sync
- GIVEN push notification arrives (silent/data only)
- WHEN processing
- THEN sync relevant data immediately
- AND update UI if app active
- AND show notification if required

#### Scenario: App foreground sync
- GIVEN app comes to foreground
- WHEN becoming active
- THEN immediately trigger sync
- AND refresh all visible data
- AND clear stale cache indicators

---

### REQ-006: Sync Status & Monitoring
The system MUST provide visibility into sync status.

#### Scenario: Show sync status
- GIVEN sync is in progress
- WHEN displaying UI
- THEN show sync indicator (subtle, non-blocking)
- AND display last successful sync time
- AND show pending items count if any

#### Scenario: Sync error notification
- GIVEN sync fails repeatedly
- WHEN error threshold reached
- THEN show "Sync Issue" warning
- AND provide retry button
- AND link to troubleshooting

#### Scenario: Manual sync trigger
- GIVEN user wants to force sync
- WHEN pulling to refresh or tapping sync button
- THEN immediately trigger full sync
- AND show progress indicator
- AND display result (success/failure)

#### Scenario: Sync bandwidth optimization
- GIVEN user on metered connection
- WHEN syncing
- THEN reduce sync frequency
- AND compress payloads (gzip)
- AND prioritize critical data
- AND provide "Sync on WiFi only" option
