# Design: Communicator app

## Overview
A single-page React app. A small **session controller** owns the real-time pipeline (input → engine → composer → outputs) outside React and publishes snapshots to a Zustand store. React only renders. Speech, alarm and storage are side-effect services triggered by composer outputs.

```mermaid
flowchart TB
  subgraph Browser
    IN[inputBus<br/>(switch-input)] --> SC
    TICK[50 ms tick while pending] --> SC
    SC[sessionController<br/>stepEngine + applyEvent + yes/no + alarm] --> ST[(Zustand store)]
    PR[predictor<br/>(predictions)] <--> SC
    SC -->|utterance / yes / no| TTS[speechService]
    SC -->|alarm| AL[alarmService]
    ST --> UI[React UI]
    ST <--> DB[(IndexedDB via idb-keyval)]
    CG[Caregiver panel<br/>speech recognition / text] --> PR
  end
  PR -. opt-in .-> API[/api/predict/]
```

## Components and interfaces

### Session controller (`src/app/session-controller.ts`)
```ts
export interface SessionSnapshot {
  tape: MorseSymbol[]; telegram: string; suggestions: string[]; highlight: number | null;
  asleep: boolean; yesNo: { active: boolean; since: number } | null;
  alarm: { active: boolean; since: number } | null;
  status: InputStatus; lastUnknownAt: number | null;
}
export function createSessionController(deps: {
  settings: () => Settings; predictor: Predictor; speech: SpeechService; alarm: AlarmService;
  now: () => number; onSnapshot: (s: SessionSnapshot) => void;
}): { handle(input: EngineInput): void; start(): void; stop(): void; setHeard(text: string): void; enterYesNo(): void; };
```
- **Pure core:** `reduceSession(state, input, ctx) → { state, effects }`. Effects are `speak`, `startAlarm`, `stopAlarm`, `requestPredictions` and `persistHistory`. The thin controller runs the effects. This keeps yes/no mode and alarm precedence property-testable.
- **Yes/no interception:** when a committed sequence is exactly `.` or `-` in yes/no mode, it becomes a `speak('Yes' | 'No')` effect plus history, instead of being passed to the composer (Req 4.2–4.4).
- **Alarm precedence:** an `alarm` output always produces `startAlarm`, whatever the state (Req 5.1).

### UI components (`src/ui/`)
| Component | Purpose | Requirements |
|---|---|---|
| `TelegraphScreen` | Layout: candles, key, tape, telegram, suggestions, status | 1.1–1.5 |
| `BrassKey` | SVG telegraph key; also the pointer switch | 1.1 |
| `PaperTape` | Prints symbols of the letter in progress | 1.1–1.3 |
| `Telegram` | The composed message in large type | 1.2 |
| `SpiritSuggestions` | Suggestion strip with a planchette highlight | predictions 5.x |
| `CheatSheet` | Morse reference, controls first | 1.4 |
| `CaregiverPanel` | Listen button / text field, "Heard: …", Yes/No button | 3.1–3.3, 4.1 |
| `HistoryList` | Spoken messages; select to repeat | 2.1–2.2 |
| `AlarmOverlay` | SOS state and the "I'm here" button | 5.1–5.3 |
| `Phrasebook` | Q-code list and editor | 6.1–6.3 |
| `Trainer` | Lessons and accuracy | 7.1–7.4 |
| `Onboarding` | First-run flow, uses `CalibrationWizard` | 8.1–8.2 |
| `Settings` | All settings, export/import/delete | 9.x, 10.x |

### Services
- **`speechService`** wraps `speechSynthesis`: voice selection, a queue, and `cancel()`. If there are no voices, it emits `fallback-display` (Req 2.3).
- **`recognitionService`** wraps `SpeechRecognition` for one utterance at a time, never persists audio, and reports `unsupported` when unavailable (Req 3.1–3.4).
- **`alarmService`** uses a Web Audio oscillator alarm (works offline; no audio file needed), a 10 s spoken interval, and drives the overlay pulse at 1 Hz (well under the 3 Hz limit) (Req 5.2).
- **`storage`** uses `idb-keyval` with versioned keys (`settings@1`, `phrasebook@1`, `history@1`, `lexiconHistory@1`) plus export/import with schema validation (Req 10.x).

### PWA
`vite-plugin-pwa` with `generateSW`. Precache the app shell, fonts, lexicon and sounds. Runtime-cache `/models/*` with CacheFirst so the face model is cached after first use (Req 11.1).

## Data models
```ts
interface Settings {
  input: SwitchProfile; timing: TimingSettings;
  voice: { name?: string; rate: number; pitch: number };
  theme: 'seance' | 'contrast-dark' | 'contrast-light';
  telegramPx: number; reduceMotion: boolean;
  sounds: { sidetone: boolean; stamp: boolean; unknown: boolean };
  ai: { enabled: boolean; sharePhrases: boolean };
}
interface HistoryItem { id: string; text: string; at: number; kind: 'utterance' | 'yes' | 'no' | 'sos'; }
interface Phrasebook { [code: string]: string }   // 'QWA' -> 'I need water.'
interface ExportFile { version: 1; settings: Settings; phrasebook: Phrasebook; history: HistoryItem[]; learned: History; }
```

## Correctness properties

**Property 1: Only the user's words are spoken.** *For any* sequence of session inputs, predictor results and heard utterances, every `speak` effect is one of: a composer utterance, "Yes"/"No" from yes/no mode, the SOS phrase, or a history item the user re-selected. Suggestions and heard text are never spoken directly. **Validates: Requirements 2.4, predictions 5.5**

**Property 2: SOS always wins.** *For any* session state (asleep, yes/no mode, mid-letter, alarm already active) and any input sequence containing a complete SOS code, the result contains `startAlarm`, or the alarm was already active. **Validates: Requirement 5.1**

**Property 3: Yes/no is exact.** *For any* committed sequence in yes/no mode, `.` speaks "Yes", `-` speaks "No", and anything else leaves yes/no mode and is processed exactly as it would be outside yes/no mode. **Validates: Requirements 4.2–4.4**

**Property 4: Safe flashing.** *For any* alarm duration and settings, the overlay pulse frequency is at most 2 Hz. **Validates: Requirement 5.2**

**Property 5: Export round trip.** *For any* valid saved data, `import(export(data))` equals `data`. **Validates: Requirement 10.2**

**Property 6: Q-code validation.** *For any* proposed code, it is accepted if and only if it starts with Q, is 2–4 letters (A–Z) and isn't already used. **Validates: Requirement 6.2**

## Error handling
| Situation | Behaviour |
|---|---|
| No speech voices | Full-screen text display of each utterance. |
| Speech recognition unsupported or denied | Text field in the caregiver panel. |
| IndexedDB unavailable (private mode) | Run in memory, with a banner: "Settings won't be saved in this window". |
| Import file invalid | Reject with a specific message and change nothing. |
| Audio blocked before first interaction | The onboarding "Start" press unlocks the audio context; the alarm retries on the next interaction and shows the visual alarm meanwhile. |

## Testing strategy
- Property tests for `reduceSession` (properties 1–3), `alarmService` timing math (property 4), storage export/import (property 5) and phrasebook validation (property 6).
- Component tests with Testing Library: status display, cheat sheet toggle, alarm overlay focus and button.
- **Playwright end-to-end tests** (keyboard switch only):
  1. Onboarding to first message.
  2. Type "HI" → SPACE → SPEAK → history shows "HI".
  3. Caregiver types "Are you cold?" → yes/no mode → dot → "Yes" in history.
  4. SOS while asleep → alarm → "I'm here".
  5. Offline: go offline, type and speak, AI shows as unavailable.
- **Visual and accessibility checks:** use the Playwright MCP server from Kiro to screenshot each theme and run an axe scan. Fix contrast problems before the demo.
