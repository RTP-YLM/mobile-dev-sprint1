# Spec: Scheduling System

## Domain: Core

This specification defines the scheduling functionality for HomeSync, allowing users to set automatic on/off times for devices.

---

## Requirements

### REQ-001: Create Schedule
The system MUST allow users to create schedules for device control

#### Scenario: Create one-time schedule
- GIVEN user wants to schedule a device
- WHEN user selects "Add Schedule"
- THEN show schedule creation form
- AND allow selection of: device(s), action (on/off), date and time
- AND save schedule when confirmed
- AND show confirmation: "Schedule created for {date} at {time}"

#### Scenario: Create recurring schedule
- GIVEN user wants recurring schedule
- WHEN user selects "Recurring" option
- THEN allow selection of repeat pattern:
  - Daily
  - Weekdays (Mon-Fri)
  - Weekends (Sat-Sun)
  - Specific days of week
  - Custom interval (every X days)
- AND show summary of schedule pattern
- AND set end date optionally

#### Scenario: Schedule with multiple devices
- GIVEN user wants to schedule multiple devices
- WHEN creating schedule
- THEN allow selecting multiple devices
- AND allow same action for all OR different actions per device
- AND show device list with assigned actions

#### Scenario: Schedule name and notes
- GIVEN user is creating schedule
- WHEN form is displayed
- THEN allow optional schedule name (e.g., "Bedtime Lights")
- AND allow optional notes for context

---

### REQ-002: Edit and Delete Schedule
The system MUST allow users to manage existing schedules

#### Scenario: Edit schedule
- GIVEN user has existing schedules
- WHEN user selects edit on a schedule
- THEN populate form with current values
- AND allow modifying any field
- AND show "Save Changes" button
- AND confirm: "Schedule updated successfully"

#### Scenario: Delete schedule
- GIVEN user wants to remove schedule
- WHEN user taps delete
- THEN show confirmation dialog
- AND warn if schedule has upcoming occurrences
- AND delete schedule when confirmed
- AND show "Schedule deleted" toast

#### Scenario: Disable/Enable schedule
- GIVEN user wants to temporarily stop schedule
- WHEN user toggles schedule off
- THEN keep schedule saved but don't execute
- AND visually indicate disabled state
- AND allow re-enabling with single tap

#### Scenario: Duplicate schedule
- GIVEN user wants similar schedule
- WHEN user selects "Duplicate"
- THEN create copy with same settings
- AND open edit form for modifications
- AND append "(Copy)" to name

---

### REQ-003: Schedule Execution
The system MUST execute schedules reliably at the specified time

#### Scenario: Execute on-time schedule
- GIVEN schedule is set for 07:00 AM
- WHEN 07:00 AM arrives
- THEN execute scheduled action within 30 seconds
- AND show notification: "Schedule executed: {schedule name}"
- AND log execution in schedule history

#### Scenario: Handle device offline during execution
- GIVEN schedule is due to execute
- WHEN target device is offline
- THEN retry every 2 minutes for 10 minutes
- AND show "Schedule delayed - device offline" notification
- AND execute when device comes online OR mark as failed

#### Scenario: Skip if already in target state
- GIVEN schedule says "Turn on at 07:00"
- WHEN device is already on at 07:00
- THEN skip execution silently
- OR show "Device already in target state" log entry
- AND not send redundant command

#### Scenario: Time zone handling
- GIVEN user travels to different time zone
- WHEN schedule time arrives in original time zone
- THEN execute based on device location time zone
- AND optionally notify user of execution

---

### REQ-004: Schedule Management Interface
The system MUST provide a comprehensive schedule management UI

#### Scenario: View all schedules
- GIVEN user navigates to Schedules screen
- THEN display list of all schedules
- AND group by: Active Today, Upcoming, Disabled
- AND show next execution time for each
- AND indicate recurring vs one-time

#### Scenario: Filter and sort schedules
- GIVEN user has many schedules
- WHEN applying filters
- THEN filter by: device, room, status (active/disabled), type (one-time/recurring)
- AND sort by: next execution time, name, creation date

#### Scenario: Calendar view
- GIVEN user wants visual overview
- WHEN user switches to Calendar view
- THEN show monthly calendar with schedule indicators
- AND highlight days with scheduled events
- AND allow tapping day to see details

#### Scenario: Upcoming schedule preview
- GIVEN viewing schedule list
- THEN show next 24 hours of scheduled events
- AND display timeline with device icons
- AND allow quick edit from preview

---

### REQ-005: Recurring Schedule Patterns
The system MUST support flexible recurring patterns

#### Scenario: Daily recurring
- GIVEN user selects "Repeat Daily"
- WHEN schedule is saved
- THEN execute every day at specified time
- AND show "Daily at {time}" in schedule list

#### Scenario: Weekday recurring
- GIVEN user selects "Weekdays"
- WHEN schedule is saved
- THEN execute Monday through Friday only
- AND skip weekends automatically

#### Scenario: Specific days selection
- GIVEN user wants specific days
- WHEN user selects Mon, Wed, Fri
- THEN execute only on those days
- AND show "Mon, Wed, Fri at {time}"

#### Scenario: Multiple times per day
- GIVEN user wants device to turn on and off multiple times
- WHEN creating schedule
- THEN allow adding multiple time slots
- AND show all times in schedule view
- AND execute each independently

#### Scenario: End date or occurrence limit
- GIVEN recurring schedule is created
- WHEN user sets end condition
- THEN allow: end after date, end after X occurrences, or never end
- AND show remaining occurrences if limited

---

### REQ-006: Schedule with Conditions
The system MUST support conditional scheduling (advanced)

#### Scenario: Skip if already on (energy saving)
- GIVEN schedule to turn on at 07:00
- WHEN user enables "Skip if already consuming power >10W"
- THEN check device power before executing
- AND skip if device appears to be already on

#### Scenario: Execute only if home
- GIVEN schedule for when user is home
- WHEN user enables location condition (Phase 2)
- THEN check if user is home before executing
- AND skip or delay if away

#### Scenario: Weather-based condition
- GIVEN schedule for outdoor lights
- WHEN user sets "Only if sunset before 6 PM"
- THEN check local sunset time
- AND adjust execution accordingly

---

### REQ-007: Schedule Notifications
The system MUST notify users about schedule execution

#### Scenario: Pre-execution reminder
- GIVEN schedule is about to execute
- WHEN 5 minutes before execution
- THEN optionally send reminder notification
- AND allow user to skip this occurrence

#### Scenario: Execution confirmation
- GIVEN schedule executes successfully
- WHEN action completes
- THEN send notification: "{Device} turned on by schedule"
- AND include option to "Undo" within 30 seconds

#### Scenario: Execution failure alert
- GIVEN schedule fails to execute
- WHEN retry attempts exhausted
- THEN send alert: "Schedule failed: {reason}"
- AND suggest troubleshooting steps

#### Scenario: Daily schedule summary
- GIVEN morning time (configurable, default 08:00)
- WHEN daily summary time arrives
- THEN send notification with today's scheduled events
- AND allow quick disable if plans change
