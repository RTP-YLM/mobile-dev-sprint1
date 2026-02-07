# Spec: Automation Rules (IFTTT)

## Domain: Core

This specification defines the automation rules engine for HomeSync, enabling if-this-then-that functionality for smart home control.

---

## Requirements

### REQ-001: Create Automation Rule
The system MUST allow users to create automation rules with triggers and actions

#### Scenario: Create simple automation
- GIVEN user wants to create automation
- WHEN user selects "New Automation"
- THEN show rule builder interface
- AND require: trigger (when), action (then), name
- AND allow saving when both trigger and action defined
- AND activate rule immediately when saved

#### Scenario: Energy-based trigger
- GIVEN user wants energy-based automation
- WHEN selecting trigger type
- THEN allow: "When power consumption goes above/below X watts"
- AND allow per-device or total home consumption
- AND set duration threshold (e.g., >1000W for 5 minutes)
- AND show estimated impact

#### Scenario: Time-based trigger
- GIVEN user wants time-based trigger
- WHEN configuring trigger
- THEN allow: specific time, sunrise, sunset
- AND allow offset (e.g., 30 minutes before sunset)
- AND show next trigger time

#### Scenario: Device state trigger
- GIVEN user wants device state trigger
- WHEN configuring trigger
- THEN allow: "When {device} turns on/off"
- AND allow multiple devices with OR/AND logic
- AND show state transition diagram

#### Scenario: Multiple conditions
- GIVEN user wants complex rule
- WHEN adding conditions
- THEN allow combining conditions with AND/OR
- AND allow: time range + energy condition
- AND show logic tree visualization

---

### REQ-002: Automation Actions
The system MUST support diverse automation actions

#### Scenario: Control device action
- GIVEN automation trigger fires
- WHEN action is device control
- THEN allow: turn on, turn off, toggle, set brightness
- AND allow multiple devices in one action
- AND allow delays between actions (e.g., turn on A, wait 5s, turn on B)

#### Scenario: Send notification action
- GIVEN automation trigger fires
- WHEN action is notification
- THEN send push notification with custom message
- AND include relevant data (current power, device name)
- AND allow deep link to relevant screen

#### Scenario: Scene activation action
- GIVEN automation trigger fires
- WHEN action is scene
- THEN activate specified scene
- AND show scene execution progress

#### Scenario: Delayed action
- GIVEN user wants delayed response
- WHEN configuring action
- THEN allow adding delay (e.g., "wait 10 minutes")
- AND show countdown in active automations
- AND allow canceling delayed action before execution

#### Scenario: Multiple actions
- GIVEN complex automation needed
- WHEN creating actions
- THEN allow chaining multiple actions
- AND allow conditional actions (if-else)
- AND show action sequence timeline

---

### REQ-003: Energy-Specific Automations
The system MUST provide energy-centric automation templates

#### Scenario: Auto-off when idle
- GIVEN device is not being used
- WHEN power stays below threshold (e.g., <5W) for X minutes
- THEN send warning notification first
- AND turn off device after grace period if no response
- AND log auto-off event

#### Scenario: Budget protection
- GIVEN monthly budget is set
- WHEN daily spending rate indicates budget will be exceeded
- THEN send alert: "You're on track to exceed budget"
- AND optionally turn off non-essential devices
- AND show which devices would be affected

#### Scenario: Peak hour management
- GIVEN peak rate hours configured
- WHEN peak hour starts
- THEN send notification: "Peak hours started - consider turning off non-essentials"
- AND highlight high-consumption devices
- AND offer "Enable Peak Mode" (turn off selected devices)

#### Scenario: High consumption alert
- GIVEN power consumption is unusually high
- WHEN consumption exceeds baseline by 200% for 10 minutes
- THEN send alert with device breakdown
- AND offer to investigate or turn off suspected device

---

### REQ-004: Automation Management
The system MUST provide comprehensive automation management

#### Scenario: View all automations
- GIVEN user navigates to Automations screen
- THEN list all automation rules
- AND show: name, trigger type, action count, status
- AND indicate active/inactive state
- AND show last triggered time

#### Scenario: Enable/disable automation
- GIVEN user wants to pause automation
- WHEN user toggles automation off
- THEN stop evaluating triggers immediately
- AND preserve all settings
- AND show "Paused" status
- AND allow re-enabling with single tap

#### Scenario: Edit automation
- GIVEN user wants to modify rule
- WHEN user selects edit
- THEN populate rule builder with current settings
- AND allow changing any aspect
- AND show history of previous versions

#### Scenario: Delete automation
- GIVEN user wants to remove rule
- WHEN user selects delete
- THEN show confirmation with rule summary
- AND delete when confirmed
- AND optionally save as template first

#### Scenario: Test automation
- GIVEN user wants to verify rule works
- WHEN user taps "Test Automation"
- THEN simulate trigger condition
- AND execute actions immediately
- AND show test results
- AND don't count as actual execution

---

### REQ-005: Automation Execution
The system MUST execute automations reliably and safely

#### Scenario: Trigger evaluation
- GIVEN automation is active
- WHEN trigger condition is met
- THEN evaluate conditions within 10 seconds
- AND execute actions if all conditions pass
- AND log trigger event

#### Scenario: Cooldown period
- GIVEN automation has cooldown configured
- WHEN trigger fires during cooldown
- THEN skip execution
- AND log: "Skipped due to cooldown"
- AND show remaining cooldown time

#### Scenario: Maximum executions
- GIVEN automation has daily limit
- WHEN execution count reached
- THEN stop evaluating for the day
- AND resume at midnight
- AND notify user if limit was intentional protection

#### Scenario: Safety limits
- GIVEN automation controls critical devices
- WHEN execution would affect >X devices or >Y watts
- THEN require confirmation before executing
- OR skip if user not responsive within 30 seconds

#### Scenario: Execution failure handling
- GIVEN action fails to execute
- WHEN device is offline or unresponsive
- THEN retry up to 3 times with exponential backoff
- AND notify user of failure after retries exhausted
- AND mark automation as having issues

---

### REQ-006: Automation History & Analytics
The system MUST track automation performance

#### Scenario: View execution history
- GIVEN user wants to review automation activity
- WHEN viewing automation details
- THEN show execution log with timestamps
- AND show: triggered, executed, failed states
- AND filter by date range
- AND export to CSV

#### Scenario: Success rate statistics
- GIVEN automation has executed multiple times
- WHEN viewing analytics
- THEN show success rate percentage
- AND show average response time
- AND highlight common failure reasons

#### Scenario: Energy impact tracking
- GIVEN energy-saving automation
- WHEN viewing automation details
- THEN show estimated energy/cost savings
- AND compare with before automation period
- AND show monthly/annual projections

#### Scenario: Activity feed
- GIVEN user wants overview of all automations
- WHEN viewing Activity screen
- THEN show chronological feed of all automation events
- AND group by date
- AND filter by specific automation

---

### REQ-007: Automation Templates
The system MUST provide pre-built automation templates

#### Scenario: Browse templates
- GIVEN user wants quick setup
- WHEN selecting "Browse Templates"
- THEN show categories: Energy Saving, Convenience, Security, Comfort
- AND show popular templates with usage stats
- AND allow preview of template behavior

#### Scenario: Apply template
- GIVEN user selects template
- WHEN applying template
- THEN pre-fill rule builder with template settings
- AND allow customization before saving
- AND suggest relevant devices for this home

#### Scenario: Template categories
- GIVEN templates are available
- THEN provide templates for:
  - "Turn off all lights at midnight"
  - "Dim lights to 30% at sunset"
  - "Turn off entertainment devices after 2 hours idle"
  - "Alert when refrigerator power usage drops (door open?)"
  - "Turn on AC 30 minutes before arriving home"

#### Scenario: Community templates
- GIVEN Phase 2
- WHEN browsing templates
- THEN show community-submitted templates
- AND show ratings and usage count
- AND allow importing with one tap
