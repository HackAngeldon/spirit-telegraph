---
inclusion: always
---
# Project structure and conventions

```
src/
  engine/        Pure Morse engine: codec, timing classifier, adaptive timing, composer. No DOM, no clocks.
  input/         Switch sources: keyboard, pointer, gamepad, face. Pure detectors and thin browser adapters.
  predict/       Offline predictor, AI client, merge and ranking logic.
  services/      Browser side effects: audio (sidetone, siren), speech, speech recognition, alarm.
  store/         Data model, Zustand store, IndexedDB persistence, export/import.
  ui/            React components, grouped by feature (telegraph/, trainer/, phrasebook/, settings/, onboarding/).
  ui/theme/      tokens.css (three themes), base.css, components.css. Plain CSS with component class names.
  app/           App shell, session reducer (pure) and controller (wires input → engine → composer → effects).
api/
  predict.ts     Serverless proxy to the Claude API (self-contained; Vercel bundles it separately).
public/models/   MediaPipe WASM copied by `npm run models` (git-ignored); optional local face model.
tests/e2e/       Playwright tests.
docs/            KIRO_USAGE.md (hackathon write-up log), DEMO_SCRIPT.md, CAMERA_TEST.md.
scripts/         Node scripts: Kiro hook helpers, copy-mediapipe, eval-predictions.
```

## Conventions
- Named exports only; no default exports (except where a framework requires one, such as `api/predict.ts`).
- Pure logic lives in `*.ts` files with no React imports. React components live in `*.tsx` files.
- Tests sit next to the code they test: `foo.ts` → `foo.test.ts` for examples and `foo.pbt.test.ts` for properties.
- Every property test names its property and the requirement it validates in a comment, for example `// Property 1: round trip (Validates: morse-engine 1.3)`.
- Types: prefer discriminated unions for events (`{ type: 'char', char: 'A' }`). No `any`; use `unknown` and narrow it.
- File names: `kebab-case.ts`; components in `PascalCase.tsx`.
- Imports flow one way: `ui` → `app` / `store` → `engine` / `input` / `predict` / `services`. The engine never imports from anything above it.
- Keep functions small. If a reducer case grows past about 30 lines, extract a helper.
