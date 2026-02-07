# Spec: Historical Data & Analytics

## Domain: Core

This specification defines historical data storage, retrieval, and analytics functionality.

---

## ADDED Requirements

### REQ-001: Historical Data Storage
The system MUST store time-series data for all connected devices.

#### Scenario: Data persistence
- GIVEN device is sending MQTT data
- THEN store: timestamp, power (W), voltage (V), current (A), energy (kWh), device_id
- AND retain data for minimum 1 year
- AND aggregate data for efficient querying

#### Scenario: Data aggregation
- GIVEN raw data is stored
- THEN create pre-aggregated views:
  - Hourly averages (retain 90 days)
  - Daily summaries (retain 1 year)
  - Monthly summaries (retain indefinitely)
- AND downsample raw data older than 90 days

#### Scenario: Data retention policy
- GIVEN data reaches retention limit
- THEN archive or delete according to policy:
  - Raw data: 90 days
  - Hourly: 1 year
  - Daily/Monthly: indefinite

---

### REQ-002: Historical Data Query
The system MUST support flexible historical data queries.

#### Scenario: Query by time range
- GIVEN user selects date range
- WHEN querying history
- THEN return data points within range
- AND support presets: Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Custom Range
- AND limit results to prevent memory issues

#### Scenario: Query by device
- GIVEN user wants device-specific history
- WHEN selecting device filter
- THEN return data for selected device(s) only
- AND support "All Devices" aggregate view

#### Scenario: Data granularity selection
- GIVEN user views historical chart
- WHEN zooming or selecting range
- THEN automatically select appropriate granularity:
  - < 1 day: 1-minute intervals
  - 1-7 days: 15-minute intervals
  - 7-30 days: 1-hour intervals
  - > 30 days: 1-day intervals

---

### REQ-003: Historical Charts
The system MUST display historical data in interactive charts.

#### Scenario: Daily usage chart
- GIVEN user views history
- WHEN "Daily" view selected
- THEN display bar/line chart of hourly usage
- AND show peak usage time
- AND display total kWh for the day

#### Scenario: Weekly comparison chart
- GIVEN user views history
- WHEN "Weekly" view selected
- THEN display daily totals for 7 days
- AND show day-over-day change percentage
- AND highlight highest/lowest usage days

#### Scenario: Monthly trend chart
- GIVEN user views history
- WHEN "Monthly" view selected
- THEN display line chart of daily usage
- AND overlay average line
- AND show cumulative usage trend

#### Scenario: Yearly overview
- GIVEN user views history
- WHEN "Yearly" view selected
- THEN display monthly aggregated data
- AND compare with previous year (if available)
- AND show seasonal patterns

---

### REQ-004: Usage Statistics
The system MUST calculate and display usage statistics.

#### Scenario: Summary statistics
- GIVEN data is available for period
- THEN display:
  - Total energy consumed (kWh)
  - Average power (W)
  - Peak power (W) with timestamp
  - Minimum power (W)
  - Usage hours (time with power > 0)

#### Scenario: Peak analysis
- GIVEN historical data exists
- WHEN analyzing peak usage
- THEN identify top 5 peak usage periods
- AND show what time of day peaks occur
- AND suggest potential savings

#### Scenario: Comparison statistics
- GIVEN multiple time periods
- WHEN comparing periods
- THEN calculate:
  - Absolute difference in kWh
  - Percentage change
  - Cost difference
- AND indicate increase/decrease with visual indicator

---

### REQ-005: Data Export
The system MUST support exporting historical data.

#### Scenario: Export to CSV
- GIVEN user wants to export data
- WHEN selecting export option
- THEN generate CSV with columns: timestamp, device, power, voltage, current, energy
- AND allow selecting date range
- AND include device metadata

#### Scenario: Export to PDF report
- GIVEN user wants formatted report
- WHEN selecting PDF export
- THEN generate report with:
  - Summary statistics
  - Charts
  - Device breakdown
  - Cost analysis
- AND allow email sharing

#### Scenario: Scheduled reports
- GIVEN user enables scheduled reports
- WHEN report period ends (weekly/monthly)
- THEN automatically generate report
- AND send push notification when ready
- AND allow viewing in app

---

### REQ-006: Data Sync
The system MUST sync historical data between device and cloud.

#### Scenario: Initial sync
- GIVEN user installs app with existing data
- WHEN first login
- THEN sync all available historical data
- AND show progress indicator
- AND allow background continuation

#### Scenario: Incremental sync
- GIVEN app has existing data
- WHEN new data available
- THEN sync only new/changed data
- AND merge with local cache
- AND resolve conflicts (server wins)

#### Scenario: Offline data viewing
- GIVEN device is offline
- WHEN user views history
- THEN display cached data
- AND indicate "Last synced: [timestamp]"
- AND queue sync for when online
