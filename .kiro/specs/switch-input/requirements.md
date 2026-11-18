# Requirements: Switch input

## Introduction
Switch input turns whatever movement the user can make into clean `down`, `up`, `symbol` and `cancel` events for the Morse engine. Sources: keyboard, mouse/touch (the on-screen brass key), gamepad buttons (many accessibility switches appear as gamepads or keys), and webcam face gestures detected on the device with MediaPipe. A calibration wizard tunes gestures and timing to each person.

## Glossary
- **Switch_Input:** the module that turns source signals into engine inputs.
- **Source:** where a signal comes from: `keyboard`, `pointer`, `gamepad` or `face`.
- **Gesture:** a face movement used as a switch: `blink` (both eyes), `brow` (eyebrow raise), `mouth` (mouth open).
- **Score:** a MediaPipe blendshape value from 0 to 1 for a gesture, read on every video frame.
- **On / off thresholds:** the score above which a gesture counts as active, and the lower score below which it counts as released (hysteresis).
- **Minimum hold:** how long a gesture must stay active before it counts. This filters out natural blinks and twitches.
- **Calibration_Wizard:** a guided flow that measures the user's resting and deliberate gestures and their dot/dash rhythm.

## Requirements

### Requirement 1: Keyboard, pointer and gamepad switches
**User Story:** As a user with a hand, foot or head switch, I want my switch to work without setup, so that I can start right away.

#### Acceptance Criteria
1. WHEN the configured key (default Space) is pressed and released, THE Switch_Input SHALL emit `down` and `up` with the event timestamps.
2. THE Switch_Input SHALL ignore key auto-repeat while a key is held.
3. WHEN the on-screen brass key receives pointer down and pointer up (mouse, touch or pen), THE Switch_Input SHALL emit `down` and `up`.
4. WHEN a gamepad button selected in settings changes state, THE Switch_Input SHALL emit `down` or `up` within one animation frame.
5. WHILE in two-switch mode, THE Switch_Input SHALL map the first configured switch to `symbol '.'` and the second to `symbol '-'`.

### Requirement 2: Face gestures on the device
**User Story:** As a user who can only move my face, I want a webcam to read a blink, eyebrow raise or mouth movement, so that I need no special hardware.

#### Acceptance Criteria
1. WHEN the user selects a face gesture, THE Switch_Input SHALL ask for camera permission, load the face model, and show a live preview with a meter for the selected gesture.
2. THE Switch_Input SHALL process video frames only on the device and SHALL NOT store, record or send any frame or image.
3. WHEN a gesture score rises above the on threshold and stays above the off threshold for at least the minimum hold, THE Switch_Input SHALL emit `down` stamped with the time the score first crossed the on threshold.
4. WHEN an active gesture's score falls below the off threshold, THE Switch_Input SHALL emit `up` with that frame's timestamp.
5. IF a gesture's score falls below the off threshold before the minimum hold has passed, THEN THE Switch_Input SHALL emit nothing.
6. THE Switch_Input SHALL use a default minimum hold of 250 ms for `blink` and 120 ms for `brow` and `mouth`.
7. WHILE in two-switch mode with face input, THE Switch_Input SHALL support two different gestures as the dot and dash switches.

### Requirement 3: Never leave a switch stuck
**User Story:** As a user, I want nothing to type by itself if the camera loses me or the app goes to the background, so that I'm never misquoted.

#### Acceptance Criteria
1. IF the face is not detected for more than 500 ms while a gesture is active, THEN THE Switch_Input SHALL emit `cancel`.
2. IF the page becomes hidden while any switch is down, THEN THE Switch_Input SHALL emit `cancel`.
3. WHILE no face is detected, THE Switch_Input SHALL report a `no-face` status so the UI can show "I can't see you" with a lighting tip.
4. THE Switch_Input SHALL emit strictly alternating `down` and `up` events per switch, with `cancel` also ending a press.

### Requirement 4: Calibration wizard
**User Story:** As a user or caregiver, I want a short guided setup, so that the system fits this person's movements and speed.

#### Acceptance Criteria
1. WHEN calibration starts for a face gesture, THE Calibration_Wizard SHALL record 5 seconds of rest and then 5 deliberate gestures, and set the on threshold at 60% and the off threshold at 40% of the way from the rest score (95th percentile) to the median gesture peak.
2. IF the median gesture peak is less than 0.15 above the resting 95th percentile, THEN THE Calibration_Wizard SHALL say the gesture is not distinct enough and suggest a different gesture.
3. WHEN calibrating timing, THE Calibration_Wizard SHALL ask for 5 short and 5 long presses and set the dash threshold to the geometric mean of their medians, and the letter pause to 2.5 times the median short press, within the engine's bounds.
4. THE Calibration_Wizard SHALL work with every source and SHALL be operable with the switch being calibrated (one press continues each step).
5. WHEN calibration finishes, THE Calibration_Wizard SHALL save the results to the user's profile and offer a 30-second practice ("send E, then T, then SOS").

### Requirement 5: Responsiveness
**User Story:** As a user, I want immediate feedback, so that I know my movement was seen.

#### Acceptance Criteria
1. THE Switch_Input SHALL process face frames at 15 frames per second or more on a mid-range laptop from 2022 or later.
2. THE Switch_Input SHALL emit keyboard and pointer events within 16 ms of the browser event.
3. WHEN the frame rate drops below 10 fps for 3 seconds, THE Switch_Input SHALL report a `slow` status and the UI SHALL suggest closing other tabs or lowering camera resolution.
4. THE Switch_Input SHALL load the face model only when a face gesture is selected.
