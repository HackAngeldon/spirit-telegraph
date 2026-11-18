---
inclusion: always
---
# Project structure and conventions

```
src/
  engine/        Pure Morse engine: codec, timing classifier, adaptive timing, composer. No DOM, no clocks.
  input/         Switch sources: keyboard, pointer, gamepad, face. Pure detectors and thin browser adapters.
  predict/       Offline predictor, AI client, merge and ranking logic.
  speech/        Text-to-speech and speech-recognition wrappers.
  store/         Zustand stores and IndexedDB persistence.
  ui/            React components, grouped by feature (telegraph/, trainer/, settings/, alarm/, onboarding/).
  ui/theme/      Theme tokens (seance, contrast-dark, contrast-light) and fonts.
  app/           App shell, routing, and wiring of input → engine → composer → UI.
api/
  predict.ts     Serverless proxy to the Claude API.
public/models/   Self-hosted MediaPipe WASM files and the face landmarker model.
tests/e2e/       Playwright tests.
docs/            KIRO_USAGE.md (hackathon write-up log), DEMO_SCRIPT.md.
scripts/         Small Node scripts used by Kiro hooks.
```

## Conventions
- Named exports only; no default exports (except where a framework requires one, such as `api/predict.ts`).
- Pure logic lives in `*.ts` files with no React imports. React components live in `*.tsx` files.
- Tests sit next to the code they test: `foo.ts` → `foo.test.ts` for examples and `foo.pbt.test.ts` for properties.
- Every property test names its property and the requirement it validates in a comment, for example `// Property 1: round trip (Validates: morse-engine 1.3)`.
- Types: prefer discriminated unions for events (`{ type: 'char', char: 'A' }`). No `any`; use `unknown` and narrow it.
- File names: `kebab-case.ts`; components in `PascalCase.tsx`.
- Imports flow one way: `ui` → `store` → `engine` / `input` / `predict` / `speech`. The engine never imports from anything above it.
- Keep functions small. If a reducer case grows past about 30 lines, extract a helper.
