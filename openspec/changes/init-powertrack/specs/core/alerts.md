# Spec: Alerts & Notifications

## Domain: Core

This specification defines the alert system for notifying users about important events and thresholds.

---

## ADDED Requirements

### REQ-001: Power Threshold Alerts
The system MUST alert when power consumption exceeds configured thresholds.

#### Scenario: High power alert
- GIVEN user sets power threshold (e.g., 3000W)
- WHEN real-time power exceeds threshold
- THEN send push notification within 30 seconds
- AND display: "High Power Usage: XXXXW (Threshold: XXXXW)"
- AND include device name causing the spike
- AND deep-link to device detail

#### Scenario: Threshold configuration
- GIVEN user configures alerts
- WHEN setting thresholds
- THEN allow per-device or global threshold
- AND support multiple thresholds (warning, critical)
- AND validate threshold is reasonable (> 0, < max device capacity)

#### Scenario: Alert cooldown
- GIVEN alert was recently sent
- WHEN threshold continues to be exceeded
- THEN prevent spam by implementing cooldown period (e.g., 5 minutes)
- AND batch multiple threshold breaches
- AND display "Alert suppressed - threshold still exceeded"

---

### REQ-002: Budget Alerts
The system MUST alert when approaching or exceeding budget limits.

#### Scenario: Budget warning
- GIVEN monthly budget is set
- WHEN spending reaches 80% of budget
- THEN send "Budget Warning" notification
- AND display: "You've used 80% of your monthly budget (฿X,XXX of ฿Y,YYY)"
- AND include days remaining in month
- AND suggest energy saving tips

#### Scenario: Budget exceeded alert
- GIVEN spending exceeds budget
- WHEN new cost data arrives
- THEN send immediate "Budget Exceeded" notification
- AND display overage amount
- AND show projected final bill if usage continues

#### Scenario: Daily spending alert
- GIVEN daily spending is unusually high
- WHEN daily cost exceeds 150% of average
- THEN send "Unusual Daily Spending" alert
- AND compare to typical daily usage
- AND ask if user wants to investigate

---

### REQ-003: Device Status Alerts
The system MUST alert about device connectivity and health issues.

#### Scenario: Device offline alert
- GIVEN device was online
- WHEN device disconnects for > 5 minutes
- THEN send "Device Offline" notification
- AND include device name and last seen time
- AND suggest troubleshooting steps

#### Scenario: Device back online
- GIVEN device was offline
- WHEN device reconnects
- THEN send "Device Back Online" notification (optional, user-configurable)
- AND display offline duration
- AND show missed data summary if any

#### Scenario: Multiple device offline
- GIVEN multiple devices go offline simultaneously
- WHEN detecting network issue
- THEN send single aggregated notification
- AND display: "X devices offline - possible network issue"

#### Scenario: High temperature alert
- GIVEN device reports temperature
- WHEN temperature exceeds safe threshold (e.g., 70°C)
- THEN send "Device Overheating" alert
- AND include current temperature reading
- AND recommend immediate action

---

### REQ-004: Anomaly Detection Alerts
The system MUST detect and alert unusual usage patterns.

#### Scenario: Night usage anomaly
- GIVEN historical pattern shows low night usage
- WHEN night usage exceeds normal by 200%
- THEN send "Unusual Night Usage" alert
- AND display expected vs actual usage
- AND ask if user wants to check devices

#### Scenario: Sudden power spike
- GIVEN normal baseline usage
- WHEN power spikes > 500% instantly
- THEN send "Power Spike Detected" alert
- AND include magnitude and duration
- AND suggest checking for faulty appliances

#### Scenario: Continuous high usage
- GIVEN device runs continuously for > 12 hours
- WHEN power draw is consistently high
- THEN send "Continuous Usage Alert"
- AND suggest checking if device should be turned off
- AND calculate cost impact

---

### REQ-005: Schedule-based Alerts
The system MUST support time-based alert rules.

#### Scenario: Scheduled budget check
- GIVEN mid-month date
- WHEN running scheduled check
- THEN calculate if on track to exceed budget
- AND send "Mid-month Budget Check" notification
- AND include projected vs budget comparison

#### Scenario: Weekly summary
- GIVEN end of week (Sunday)
- WHEN weekly summary scheduled
- THEN send "Weekly Usage Summary" notification
- AND include: total kWh, cost, vs last week
- AND link to detailed weekly report

#### Scenario: Monthly report ready
- GIVEN month has ended
- WHEN monthly report generated
- THEN send "Monthly Report Ready" notification
- AND highlight key insights
- AND include cost and savings tips

---

### REQ-006: Alert Management
The system MUST allow users to manage alert preferences.

#### Scenario: Alert preferences
- GIVEN user opens alert settings
- WHEN configuring alerts
- THEN allow enabling/disabling each alert type:
  - Power threshold alerts
  - Budget alerts
  - Device status alerts
  - Anomaly alerts
  - Weekly/Monthly reports

#### Scenario: Quiet hours
- GIVEN user sets quiet hours (e.g., 22:00 - 07:00)
- WHEN alert triggers during quiet hours
- THEN queue non-critical alerts
- AND deliver after quiet hours end
- AND still deliver critical alerts (overheating, fire risk)

#### Scenario: Alert history
- GIVEN alerts have been sent
- WHEN user views alert history
- THEN display list of past alerts
- AND allow filtering by type and date
- AND allow marking as read/unread
- AND persist for 30 days

### REQ-007: Automation Trigger Alerts
The system MUST alert users about automation execution and failures.

#### Scenario: Automation executed notification
- GIVEN automation rule triggers
- WHEN action is executed successfully
- THEN optionally send notification: "Automation '{name}' activated"
- AND include triggered device(s) and action taken
- AND allow quick disable if unwanted
- AND respect notification preferences

#### Scenario: Automation failed alert
- GIVEN automation fails to execute
- WHEN retry attempts exhausted
- THEN send alert: "Automation '{name}' failed to execute"
- AND include failure reason and affected device
- AND link to automation settings
- AND suggest troubleshooting steps

#### Scenario: Scene activated notification
- GIVEN scene is activated
- WHEN notification is enabled for scenes
- THEN send notification: "Scene '{scene name}' activated"
- AND show devices affected and their new states
- AND indicate initiator (manual/schedule/automation)

#### Scenario: Schedule execution alert
- GIVEN scheduled action executes
- WHEN notification is enabled for schedules
- THEN send notification: "Schedule '{name}' executed"
- AND show executed action and target device
- AND allow quick edit if schedule needs adjustment

#### Scenario: Multi-user action notification
- GIVEN another user controls shared device
- WHEN device state changes by other user
- THEN optionally notify: "{Device} turned on by {user}"
- AND include timestamp and location context

#### Scenario: Alert from automation conditions
- GIVEN automation has alert-only action
- WHEN condition is met
- THEN send alert without changing device state
- AND include relevant data (current power, temperature, etc.)
- AND allow creating rule from this alert

#### Scenario: Quiet hours exception for automations
- GIVEN quiet hours are active
- WHEN critical automation triggers (e.g., safety-related)
- THEN bypass quiet hours and send notification
- AND include "[Critical]" prefix in notification
- AND allow configuring automation priority

### REQ-008: Notification channels
- GIVEN user configures notifications
- WHEN selecting channels
- THEN support:
  - Push notifications (primary)
  - In-app notification center
  - Email (optional, future)
- AND allow per-alert-type channel selection
