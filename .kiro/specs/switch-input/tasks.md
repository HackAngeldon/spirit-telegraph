# Implementation plan: Switch input

- [ ] 1. Shared types and input bus
  - Create `src/input/types.ts` and a small `inputBus` that fans `EngineInput` and status out to subscribers.
  - _Requirements: 3.4_

- [ ] 2. Keyboard, pointer and gamepad sources
  - [ ] 2.1 Keyboard adapter: configurable key, ignore repeats, cancel on hidden.
    - _Requirements: 1.1, 1.2, 3.2, 5.2_
  - [ ] 2.2 Pointer adapter on the `BrassKey` component, with pointer capture and cancel handling.
    - _Requirements: 1.3, 3.2_
  - [ ] 2.3 Gamepad adapter with per-frame polling and button diffing.
    - _Requirements: 1.4_
  - [ ] 2.4 Two-switch mapping (primary → dot, secondary → dash).
    - _Requirements: 1.5_
  - [ ] 2.5 Example tests for the adapters with mocked browser events.

- [ ] 3. Pure face detector
  - [ ] 3.1 Implement `stepFace` with the arming/active state machine, minimum hold, back-dated `down`, and cancel when the face is lost.
    - _Requirements: 2.3–2.6, 3.1, 3.3_
  - [ ] 3.2 Property test: strict alternation
    - **Property 1** · **Validates: Requirements 3.4, 2.3, 2.4**
  - [ ] 3.3 Property test: brief activations are filtered
    - **Property 2** · **Validates: Requirements 2.5, 2.6**
  - [ ] 3.4 Property test: faithful timestamps
    - **Property 3** · **Validates: Requirement 2.3**
  - [ ] 3.5 Property test: nothing stuck when the face disappears
    - **Property 4** · **Validates: Requirement 3.1**
  - [ ] 3.6 Property test: hysteresis prevents chatter
    - **Property 5** · **Validates: Requirements 2.3, 2.4**

- [ ] 4. Face adapter (browser)
  - [ ] 4.1 Self-host the MediaPipe WASM files and the face landmarker model in `public/models/`, and load them lazily.
    - _Requirements: 2.1, 5.4_
  - [ ] 4.2 Camera and detection loop, frame-rate monitor, and status reporting. No frame is ever stored or sent.
    - _Requirements: 2.1, 2.2, 3.3, 5.1, 5.3_
  - [ ] 4.3 Two-gesture support for two-switch mode.
    - _Requirements: 2.7_
  - [ ] 4.4 Write `docs/CAMERA_TEST.md`, a manual test checklist (lighting, glasses, partial eye closure).

- [ ] 5. Calibration
  - [ ] 5.1 Implement `thresholdsFromSamples` and `timingFromPresses`.
    - _Requirements: 4.1–4.3_
  - [ ] 5.2 Property test: sensible calibration
    - **Property 6** · **Validates: Requirements 4.1, 4.2**
  - [ ] 5.3 Property test: timing calibration stays in bounds and in order
    - **Property 7** · **Validates: Requirement 4.3**
  - [ ] 5.4 `CalibrationWizard` UI: gesture picker with live meters, rest, gestures, short/long presses, practice. Each step continues on one press of the switch being calibrated.
    - _Requirements: 4.4, 4.5_

- [ ] 6. Checkpoint
  - Run the tests, then try it for real: calibrate brow and blink, and send "SOS" and "HELLO" using only your face.
  - Log in `docs/KIRO_USAGE.md` what you had to tune by hand versus what the spec got right.
