# Implementation plan: Communicator app

Depends on: morse-engine (all), switch-input (tasks 1–3 at least), predictions (tasks 2–3 at least).

- [ ] 1. Theme and shell
  - [ ] 1.1 Theme tokens for Séance, High contrast dark and High contrast light; self-hosted fonts (IM Fell English, Atkinson Hyperlegible); reduce-motion handling.
    - _Requirements: 9.1_
  - [ ] 1.2 App shell with routes: Telegraph, Trainer, Phrasebook, Settings, Onboarding.

- [ ] 2. Session controller
  - [ ] 2.1 Implement `reduceSession` (engine + composer + yes/no + alarm precedence) and the thin effect-running controller with the 50 ms tick.
    - _Requirements: 1.1–1.3, 4.2–4.5, 5.1_
  - [ ] 2.2 Property test: only the user's words are spoken
    - **Property 1** · **Validates: Requirements 2.4, predictions 5.5**
  - [ ] 2.3 Property test: SOS always wins
    - **Property 2** · **Validates: Requirement 5.1**
  - [ ] 2.4 Property test: yes/no is exact
    - **Property 3** · **Validates: Requirements 4.2–4.4**

- [ ] 3. Telegraph screen
  - [ ] 3.1 `BrassKey` (SVG, press animation, sidetone, pointer switch), `PaperTape`, `Telegram`, status line, candles as status lights.
    - _Requirements: 1.1–1.3, 1.5_
  - [ ] 3.2 `SpiritSuggestions` with planchette highlight and ghost-ink fade-in (off under reduce motion).
    - _Requirements: predictions 5.1–5.4_
  - [ ] 3.3 `CheatSheet`, controls first, letters by frequency.
    - _Requirements: 1.4_

- [ ] 4. Speech and history
  - [ ] 4.1 `speechService` with voice settings and the full-screen fallback; `HistoryList` with select-to-repeat.
    - _Requirements: 2.1–2.4_

- [ ] 5. Caregiver panel and yes/no mode
  - [ ] 5.1 `recognitionService` plus text fallback; "Heard: …" display; 60 s freshness passed to the predictor.
    - _Requirements: 3.1–3.4_
  - [ ] 5.2 Yes/No button and overlay labels.
    - _Requirements: 4.1, 4.5_

- [ ] 6. SOS alarm
  - [ ] 6.1 `alarmService` (Web Audio tone, spoken phrase every 10 s, 1 Hz pulse) and `AlarmOverlay` with the "I'm here" button.
    - _Requirements: 5.1–5.3_
  - [ ] 6.2 Property test: safe flashing
    - **Property 4** · **Validates: Requirement 5.2**
  - [ ] 6.3 Not-a-medical-device notice in onboarding and alarm settings.
    - _Requirements: 5.4_

- [ ] 7. Phrasebook
  - [ ] 7.1 Default Q-codes, list with Morse rendering, add/edit with validation.
    - _Requirements: 6.1–6.3_
  - [ ] 7.2 Property test: Q-code validation
    - **Property 6** · **Validates: Requirement 6.2**

- [ ] 8. Trainer
  - [ ] 8.1 Lessons (letters in pairs, starting with E/T, I/A, N/M), audio and visual prompts, accuracy tracking, unlocking at 90%.
    - _Requirements: 7.1–7.4_

- [ ] 9. Onboarding and settings
  - [ ] 9.1 First-run flow using `CalibrationWizard`, with a practice SOS that doesn't raise the alarm.
    - _Requirements: 8.1, 8.2_
  - [ ] 9.2 Settings screen with live apply and validation errors.
    - _Requirements: 9.1–9.3_

- [ ] 10. Storage and PWA
  - [ ] 10.1 IndexedDB storage with versioned keys, export/import, delete all, and the in-memory fallback banner.
    - _Requirements: 10.1–10.3_
  - [ ] 10.2 Property test: export round trip
    - **Property 5** · **Validates: Requirement 10.2**
  - [ ] 10.3 PWA: precache, model runtime cache, offline AI indicator.
    - _Requirements: 11.1–11.3_

- [ ] 11. End-to-end and accessibility pass
  - [ ] 11.1 Playwright end-to-end tests 1–5 from the design (keyboard switch only).
  - [ ] 11.2 With the Playwright MCP server: screenshot every theme and run axe, then fix contrast, focus and naming problems.
    - _Requirements: accessibility steering_

- [ ] 12. (Stretch) Caregiver link
  - [ ] 12.1 Pairing code and realtime channel for utterances and alarms only.
    - _Requirements: 12.1, 12.2_

- [ ] 13. Ship
  - Deploy to Vercel. Set `PREDICT_API_KEY` and `PREDICT_MODEL` in project env, then smoke-test the deployed app with AI off and on.
  - Run `/kiro-log`, then finish `docs/KIRO_USAGE.md` and record the demo video (`docs/DEMO_SCRIPT.md`).
