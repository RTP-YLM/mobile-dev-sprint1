# Spec: Cost Calculation & Budgeting

## Domain: Core

This specification defines electricity cost calculation, tariff management, and budgeting features.

---

## ADDED Requirements

### REQ-001: Tariff Configuration
The system MUST support configurable electricity tariffs.

#### Scenario: Select predefined tariff
- GIVEN user opens cost settings
- WHEN selecting electricity provider
- THEN show predefined tariffs:
  - MEA (Metropolitan Electricity Authority) - Thailand
  - PEA (Provincial Electricity Authority) - Thailand
  - Custom/Other
- AND auto-populate rates based on selection

#### Scenario: Configure custom tariff
- GIVEN user selects custom tariff
- WHEN configuring rates
- THEN support:
  - Flat rate (per kWh)
  - Tiered rate (progressive pricing)
  - Time-of-use (peak/off-peak rates)
- AND validate input values
- AND save to user profile

#### Scenario: Service charge configuration
- GIVEN tariff includes fixed charges
- WHEN configuring cost settings
- THEN allow entering:
  - Service charge (THB/month)
  - VAT percentage
  - Other fees
- AND include in total cost calculation

#### Scenario: Currency configuration
- GIVEN user in different region
- WHEN setting up cost tracking
- THEN support multiple currencies (THB, USD, EUR, SGD, etc.)
- AND apply currency formatting throughout app
- AND store exchange rate for reporting

---

### REQ-002: Real-time Cost Calculation
The system MUST calculate electricity costs in real-time.

#### Scenario: Current session cost
- GIVEN device is consuming power
- WHEN viewing dashboard
- THEN display:
  - Current power cost per hour (฿/hr)
  - Today's accumulated cost
  - This month's accumulated cost
- AND update with each MQTT message

#### Scenario: Device-level cost breakdown
- GIVEN multiple devices registered
- WHEN viewing cost breakdown
- THEN display cost per device
- AND show percentage of total
- AND rank devices by cost (highest to lowest)

#### Scenario: Projected monthly cost
- GIVEN partial month data exists
- WHEN calculating projections
- THEN extrapolate based on current usage pattern
- AND display: "Projected: ฿X,XXX based on current usage"
- AND update projection daily

---

### REQ-003: Cost History & Reporting
The system MUST track and report historical costs.

#### Scenario: Daily cost tracking
- GIVEN day has passed
- WHEN viewing cost history
- THEN display daily cost summary
- AND compare to previous day
- AND show day-of-week average

#### Scenario: Monthly bill estimation
- GIVEN month is in progress or completed
- WHEN viewing monthly report
- THEN display:
  - Total kWh consumed
  - Energy charge (by tier if applicable)
  - Service charge
  - VAT
  - Total estimated bill
- AND compare to previous month

#### Scenario: Yearly cost overview
- GIVEN year of data available
- WHEN viewing yearly report
- THEN display monthly cost trend
- AND calculate total yearly cost
- AND show average monthly cost
- AND identify highest/lowest months

---

### REQ-004: Budget Management
The system MUST support monthly budget setting and tracking.

#### Scenario: Set monthly budget
- GIVEN user wants to set budget
- WHEN entering budget amount
- THEN validate positive number
- AND allow setting for specific month or recurring
- AND save to user preferences

#### Scenario: Budget progress tracking
- GIVEN budget is set
- WHEN viewing cost dashboard
- THEN display:
  - Budget progress bar (% used)
  - Amount spent / Budget amount
  - Days remaining in month
- AND color-code: green (<50%), amber (50-80%), red (>80%)

#### Scenario: Budget alert threshold
- GIVEN budget is configured
- WHEN user sets alert threshold
- THEN allow setting percentage (e.g., 80%)
- AND send notification when threshold reached
- AND include current spending info in notification

#### Scenario: Budget exceeded warning
- GIVEN spending exceeds budget
- WHEN new cost data arrives
- THEN immediately update UI to red warning state
- AND send push notification
- AND suggest energy saving tips

---

### REQ-005: Cost Comparison
The system MUST support cost comparison features.

#### Scenario: Period comparison
- GIVEN user selects two periods
- WHEN comparing costs
- THEN display:
  - Side-by-side cost breakdown
  - Absolute difference
  - Percentage change
  - kWh difference
- AND indicate increase/decrease

#### Scenario: Device cost comparison
- GIVEN multiple devices
- WHEN viewing comparison
- THEN show cost per device as percentage of total
- AND display pie chart visualization
- AND allow time period selection

#### Scenario: Cost efficiency metrics
- GIVEN cost and usage data
- WHEN calculating efficiency
- THEN display:
  - Cost per day (average)
  - Cost per kWh (effective rate)
  - Trend vs previous period

---

### REQ-006: Billing Integration Simulation
The system MUST accurately simulate electricity bills.

#### Scenario: MEA/PEA bill calculation
- GIVEN user selects Thai electricity authority
- WHEN calculating bill
- THEN apply correct progressive tariff:
  - 0-150 kWh: ฿3.2484/kWh
  - 151-400 kWh: ฿4.2218/kWh
  - 401+ kWh: ฿4.4217/kWh
- AND add service charge: ฿38.22/month
- AND calculate 7% VAT
- AND display line-by-line breakdown

#### Scenario: Time-of-use calculation
- GIVEN time-of-use tariff configured
- WHEN calculating costs
- THEN apply different rates for:
  - Peak hours (e.g., 9:00-22:00)
  - Off-peak hours (e.g., 22:00-9:00)
- AND display peak vs off-peak breakdown
- AND suggest shifting usage to off-peak

#### Scenario: Bill estimation accuracy
- GIVEN actual bill arrives
- WHEN user inputs actual amount
- THEN compare with app estimation
- AND show variance percentage
- AND use to improve future estimations
