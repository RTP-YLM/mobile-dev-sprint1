# Spec: Scenes

## Domain: Core

This specification defines the scene functionality for HomeSync, allowing users to create and activate presets that control multiple devices simultaneously.

---

## Requirements

### REQ-001: Create Scene
The system MUST allow users to create scenes with multiple device actions

#### Scenario: Create scene from scratch
- GIVEN user wants to create a scene
- WHEN selecting "New Scene"
- THEN open scene builder
- AND require: scene name, icon/color selection
- AND allow adding multiple devices with desired states
- AND show real-time preview of scene configuration

#### Scenario: Add devices to scene
- GIVEN user is building a scene
- WHEN adding devices
- THEN show list of all controllable devices
- AND allow selecting device state:
  - On/Off
  - Brightness level (if dimmable)
  - Color (if RGB device)
- AND show current device state as starting point

#### Scenario: Scene from current states
- GIVEN devices are in desired configuration
- WHEN user selects "Save Current as Scene"
- THEN capture all device states automatically
- AND prompt for scene name
- AND allow excluding specific devices
- AND save complete scene

#### Scenario: Scene with delayed actions
- GIVEN complex scene is being created
- WHEN configuring actions
- THEN allow adding delays between actions
- AND show timeline of scene execution
- AND allow reordering actions via drag-and-drop

#### Scenario: Scene icon and color
- GIVEN scene is being created
- WHEN selecting appearance
- THEN offer icon library (light, moon, TV, home, etc.)
- AND allow color selection for visual distinction
- AND show icon in dashboard and scene list

---

### REQ-002: Edit and Manage Scenes
The system MUST allow users to modify and organize scenes

#### Scenario: Edit scene configuration
- GIVEN user has existing scenes
- WHEN selecting edit
- THEN show scene builder with current settings
- AND allow: add/remove devices, change states, rename
- AND preserve scene ID and shortcuts

#### Scenario: Reorder scenes
- GIVEN user has multiple scenes
- WHEN in scene management mode
- THEN allow drag-and-drop reordering
- AND update dashboard display order
- AND persist custom order

#### Scenario: Duplicate scene
- GIVEN user wants similar scene
- WHEN selecting duplicate
- THEN create copy with "(Copy)" suffix
- AND open in edit mode
- AND allow immediate customization

#### Scenario: Delete scene
- GIVEN user wants to remove scene
- WHEN selecting delete
- THEN show confirmation dialog
- AND warn if scene is used in automations
- AND delete when confirmed
- AND remove from all shortcuts

#### Scenario: Organize into folders (Phase 2)
- GIVEN many scenes exist
- WHEN organizing
- THEN allow creating folders/categories
- AND move scenes between folders
- AND collapse/expand folders

---

### REQ-003: Activate Scene
The system MUST allow quick and reliable scene activation

#### Scenario: Tap to activate
- GIVEN scene is displayed
- WHEN user taps scene card
- THEN execute all scene actions
- AND show activation animation
- AND display progress of device updates
- AND show "Scene activated" confirmation

#### Scenario: Quick activation from dashboard
- GIVEN dashboard is configured
- WHEN viewing quick actions panel
- THEN show scene buttons as primary actions
- AND allow single-tap activation
- AND show last activated time

#### Scenario: Widget/Shortcut activation (Phase 2)
- GIVEN Phase 2 widget support
- WHEN user has home screen widget
- THEN allow scene activation from home screen
- AND show scene icon on widget
- AND execute without opening app

#### Scenario: Voice activation (Phase 2)
- GIVEN Phase 2 voice support
- WHEN user says "Activate Movie Night"
- THEN activate corresponding scene
- AND confirm via voice response
- AND show visual feedback in app

#### Scenario: Schedule-based activation
- GIVEN scene needs to activate automatically
- WHEN creating schedule
- THEN allow selecting scene as action
- AND activate scene at scheduled time
- AND log scheduled activation

---

### REQ-004: Scene Execution
The system MUST execute scenes reliably with proper feedback

#### Scenario: Execute all actions
- GIVEN scene is activated
- WHEN execution begins
- THEN send all device commands
- AND show progress: "Turning on 5 of 8 devices..."
- AND handle failures gracefully

#### Scenario: Partial execution handling
- GIVEN some devices fail during scene
- WHEN execution completes
- THEN show partial success message
- AND list successful and failed devices
- AND offer retry for failed devices
- AND log partial execution

#### Scenario: Scene interruption
- GIVEN user activates scene
- WHEN user taps again during execution
- THEN not interrupt ongoing execution
- OR show "Scene already activating" message
- AND prevent duplicate commands

#### Scenario: Execution timeout
- GIVEN scene is executing
- WHEN devices don't respond within 30 seconds
- THEN mark those devices as failed
- AND continue with remaining devices
- AND show timeout notification

#### Scenario: Safe scene execution
- GIVEN scene affects many devices
- WHEN >10 devices or >2000W would be affected
- THEN show confirmation: "This scene affects X devices"
- AND list high-power devices
- AND require confirmation

---

### REQ-005: Favorite Scenes
The system MUST provide quick access to favorite scenes

#### Scenario: Mark as favorite
- GIVEN scene is created
- WHEN user taps star icon
- THEN add to favorites
- AND show in dashboard quick actions
- AND allow up to 6 favorite scenes

#### Scenario: Unfavorite scene
- GIVEN scene is favorited
- WHEN user taps star again
- THEN remove from favorites
- AND remove from dashboard quick actions
- AND preserve in full scene list

#### Scenario: Reorder favorites
- GIVEN user has favorite scenes
- WHEN in edit mode
- THEN allow reordering favorites
- AND update dashboard layout
- AND persist order

---

### REQ-006: Scene History
The system MUST track scene activation history

#### Scenario: View scene history
- GIVEN user wants to review
- WHEN viewing scene details
- THEN show activation history
- AND display: timestamp, initiator (manual/automation/schedule), success status
- AND filter by date range

#### Scenario: Most used scenes
- GIVEN scenes have been used
- WHEN viewing scene list
- THEN optionally sort by usage frequency
- AND show usage count badge
- AND highlight frequently used scenes

#### Scenario: Recently used
- GIVEN scenes are activated
- WHEN viewing dashboard
- THEN show "Recently Used" section
- AND display last 3-4 activated scenes
- AND allow quick re-activation

---

### REQ-007: Scene Templates
The system MUST provide pre-built scene templates

#### Scenario: Browse scene templates
- GIVEN user wants quick setup
- WHEN selecting "Browse Templates"
- THEN show common scenes:
  - "Good Morning" - Turn on lights, coffee maker, radio
  - "Leaving Home" - Turn off all lights, set AC to away mode
  - "Movie Night" - Dim lights, turn on TV area, ambient lighting
  - "Bedtime" - Turn off main lights, turn on night lights
  - "Focus Mode" - Turn off distractions, set desk lighting
  - "Party Mode" - Colorful lighting, turn on entertainment

#### Scenario: Apply template
- GIVEN user selects template
- WHEN applying
- THEN suggest devices matching template roles
- AND allow customizing each action
- AND save as new scene

#### Scenario: Smart suggestions
- GIVEN user has devices configured
- WHEN viewing scenes
- THEN suggest scene templates based on device types
- AND auto-map devices to template roles
- AND allow one-tap creation
