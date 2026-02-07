# Spec: Device Control

## Domain: Core

This specification defines device control functionality for HomeSync including on/off, dimming, and advanced device controls.

---

## Requirements

### REQ-001: Toggle Device On/Off
The system MUST allow users to turn devices on or off remotely

#### Scenario: Turn on device from app
- GIVEN user is on Device Detail screen
- WHEN user taps the power toggle
- THEN the device turns on within 2 seconds
- AND the UI updates to show "ON" status
- AND a confirmation toast appears
- AND the power consumption starts displaying real-time data

#### Scenario: Turn off device from app
- GIVEN user is on Device Detail screen
- WHEN user taps the power toggle
- THEN the device turns off within 2 seconds
- AND the UI updates to show "OFF" status
- AND a confirmation toast appears
- AND power consumption shows 0W or standby power

#### Scenario: Device is offline
- GIVEN device is offline
- WHEN user tries to toggle
- THEN show error message "Device is offline"
- AND queue command for retry when device comes online
- AND display "Command queued" indicator

#### Scenario: Command timeout
- GIVEN user sends toggle command
- WHEN device doesn't respond within 5 seconds
- THEN show "Command timed out" error
- AND offer "Retry" button
- AND keep UI in pending state until resolved

#### Scenario: Command confirmation for critical devices
- GIVEN device is marked as "critical" (e.g., refrigerator, security system)
- WHEN user tries to turn off
- THEN show confirmation dialog: "Are you sure you want to turn off {device name}?"
- AND require explicit confirmation before sending command

---

### REQ-002: Dimming Control
The system MUST support brightness/dimming control for compatible devices

#### Scenario: Adjust brightness
- GIVEN user has a dimmable device
- WHEN user drags the brightness slider
- THEN device brightness adjusts in real-time
- AND brightness percentage updates immediately
- AND changes are reflected within 500ms

#### Scenario: Set specific brightness level
- GIVEN user is adjusting brightness
- WHEN user taps on specific percentage
- THEN brightness jumps to that level
- AND slider animates to new position

#### Scenario: Minimum brightness limit
- GIVEN user drags slider to 0%
- WHEN brightness reaches minimum threshold (e.g., 5%)
- THEN device remains at minimum brightness
- OR offer option to "Turn Off" instead

#### Scenario: Non-dimmable device
- GIVEN device doesn't support dimming
- WHEN viewing device details
- THEN dimming controls are hidden
- AND only on/off toggle is shown

---

### REQ-003: Bulk Device Control
The system MUST support controlling multiple devices at once

#### Scenario: Turn off all devices
- GIVEN user is on dashboard
- WHEN user taps "All Off" button
- THEN show confirmation dialog listing affected devices
- AND turn off all controllable devices when confirmed
- AND show progress indicator for each device
- AND display summary: "15 devices turned off"

#### Scenario: Control by room
- GIVEN user is viewing a room
- WHEN user taps room power toggle
- THEN turn on/off all devices in that room
- AND show "Turning on/off X devices..." progress

#### Scenario: Select multiple devices
- GIVEN user is in device list
- WHEN user enters multi-select mode
- AND selects multiple devices
- AND taps "Turn On" or "Turn Off"
- THEN send commands to all selected devices
- AND show batch operation progress

#### Scenario: Safety confirmation for bulk off
- GIVEN user attempts to turn off many devices
- WHEN count exceeds threshold (e.g., >5 devices)
- THEN show confirmation: "You are about to turn off {count} devices"
- AND list critical devices separately with warning
- AND require explicit confirmation

---

### REQ-004: Real-time State Synchronization
The system MUST sync device states across all users in real-time

#### Scenario: State changed by another user
- GIVEN another user controls the same device
- WHEN device state changes
- THEN current user sees state update within 1 second
- AND UI reflects new state immediately
- AND show subtle "Updated by {user}" indicator (if multi-user support enabled)

#### Scenario: State changed physically
- GIVEN someone presses the physical button on device
- WHEN device state changes
- THEN app reflects new state within 2 seconds
- AND show "Physical switch activated" indicator

#### Scenario: State conflict resolution
- GIVEN user sends command while another command is in progress
- WHEN state conflict detected
- THEN show "Device state changed" notification
- AND update UI to reflect actual device state
- AND allow user to retry if needed

---

### REQ-005: Command Queue & Offline Handling
The system MUST queue commands when device is offline

#### Scenario: Queue command when offline
- GIVEN device is offline
- WHEN user sends control command
- THEN queue command locally
- AND show "Command queued" indicator
- AND display retry count (e.g., "Will retry 3 times")

#### Scenario: Execute queued commands
- GIVEN queued commands exist
- WHEN device comes back online
- THEN execute all queued commands in order
- AND show progress of command execution
- AND display summary of successful/failed commands

#### Scenario: Queue timeout
- GIVEN command has been queued for >24 hours
- WHEN device still hasn't come online
- THEN mark command as expired
- AND notify user: "Command expired - device offline too long"

#### Scenario: Queue management
- GIVEN multiple commands are queued
- WHEN user views device details
- THEN show "X pending commands" indicator
- AND allow user to view and cancel queued commands

---

### REQ-006: Control History & Logging
The system MUST log all control actions

#### Scenario: View control history
- GIVEN user is on device detail
- WHEN user selects "Control History"
- THEN display chronological list of on/off/dim actions
- AND show timestamp, action type, and initiator
- AND filter by date range

#### Scenario: Automation vs Manual distinction
- GIVEN viewing control history
- WHEN action was triggered by automation
- THEN show "Automation: {automation name}" as initiator
- AND distinguish visually from manual actions

#### Scenario: Failed command logging
- GIVEN a command failed to execute
- WHEN viewing history
- THEN show failed command with error reason
- AND indicate failure with red icon

---

### REQ-007: Quick Actions from Dashboard
The system MUST allow quick control from dashboard

#### Scenario: Quick toggle from dashboard
- GIVEN user is on dashboard
- WHEN user taps power icon on device card
- THEN toggle device state immediately
- AND show brief confirmation animation
- AND don't navigate away from dashboard

#### Scenario: Long-press for more options
- GIVEN user long-presses device card
- THEN show quick actions menu
- AND offer options: Turn On/Off, Set Brightness, View Details

#### Scenario: Favorite devices quick access
- GIVEN user has marked devices as favorites
- WHEN viewing dashboard
- THEN show "Favorites" section with quick toggles
- AND display up to 6 favorite devices for quick access
