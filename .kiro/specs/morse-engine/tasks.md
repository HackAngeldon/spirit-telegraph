# Implementation plan: Morse engine

- [ ] 1. Set up the project and test tooling
  - Scaffold Vite + React + TypeScript (strict). Add Vitest, fast-check, ESLint and Prettier, and the npm scripts listed in the tech steering file.
  - Create `src/engine/` with an `index.ts` that re-exports the public API.
  - _Requirements: all (foundation)_

- [ ] 2. Codec
  - [ ] 2.1 Implement `CHAR_CODES`, `decodeSequence`, `encode` and `decodeCodes` from the morse-reference steering file.
    - _Requirements: 1.1, 1.3, 1.4_
  - [ ] 2.2 Implement `ControlMap`, the default controls, and `validateControls`.
    - _Requirements: 1.5_
  - [ ] 2.3 Property test: round trip
    - **Property 1** · **Validates: Requirements 1.1, 1.3, 1.4**
  - [ ] 2.4 Property test: no collisions in the defaults
    - **Property 2** · **Validates: Requirement 1.5**

- [ ] 3. Engine core (timed mode)
  - [ ] 3.1 Implement `TimingSettings`, the presets, `validateSettings`, `EngineState` and `initialEngineState`.
    - _Requirements: 2.1, 6.4_
  - [ ] 3.2 Implement `stepEngine` for `down`, `up`, `cancel` and `tick`: classification, letter commit, control lookup, unknown sequences, and the out-of-order guard.
    - _Requirements: 2.1–2.5, 3.1–3.3, 3.5_
  - [ ] 3.3 Write the shared generators in `test-gen.ts` (messages, ITU timing streams with jitter, random input streams).
  - [ ] 3.4 Property test: monotonic classification
    - **Property 3** · **Validates: Requirements 2.2, 2.3**
  - [ ] 3.5 Property test: tolerates jitter
    - **Property 4** · **Validates: Requirements 2.2, 2.3, 3.1, 3.2**
  - [ ] 3.6 Property test: short presses are inert
    - **Property 5** · **Validates: Requirement 2.1**
  - [ ] 3.7 Property test: never crashes, never emits junk
    - **Property 6** · **Validates: Requirements 1.2, 2.5**

- [ ] 4. Automatic word spacing and two-switch mode
  - [ ] 4.1 Implement optional automatic word spacing on `tick`.
    - _Requirements: 3.4_
  - [ ] 4.2 Implement `symbol` inputs for two-switch mode.
    - _Requirements: 4.1, 4.2_
  - [ ] 4.3 Property test: two-switch matches timed
    - **Property 9** · **Validates: Requirement 4.3**

- [ ] 5. Adaptive timing
  - [ ] 5.1 Implement the moving-average estimates and the threshold and pause adaptation with clamping.
    - _Requirements: 5.1–5.5_
  - [ ] 5.2 Property test: adaptive bounds hold
    - **Property 7** · **Validates: Requirements 5.3, 5.4**
  - [ ] 5.3 Property test: adaptation converges
    - **Property 8** · **Validates: Requirement 5.2**

- [ ] 6. Sleep and wake
  - [ ] 6.1 Implement the sleep-hold toggle and SOS-only decoding while asleep.
    - _Requirements: 6.1–6.4_
  - [ ] 6.2 Property test: asleep is silent except SOS
    - **Property 10** · **Validates: Requirements 6.2, 6.3**

- [ ] 7. Composer
  - [ ] 7.1 Implement `applyEvent` for chars, SPACE (with Q-code expansion), ERASE, CLEAR, NEXT, ACCEPT, SPEAK and SOS, plus `currentPartialWord`.
    - _Requirements: 7.1–7.9_
  - [ ] 7.2 Property test: erase is the inverse of typing
    - **Property 11** · **Validates: Requirements 7.1, 7.3**
  - [ ] 7.3 Property test: nothing is put in the user's mouth
    - **Property 12** · **Validates: Requirements 7.6, 7.8**
  - [ ] 7.4 Property test: Q-codes expand whole words only
    - **Property 13** · **Validates: Requirement 7.2**

- [ ] 8. Checkpoint
  - Run `npm test` and `npm run typecheck`. Every property must pass with no skipped runs.
  - Record any counterexample a property found during development (and the fix) in `docs/KIRO_USAGE.md`. This is the strongest evidence for the judges.
