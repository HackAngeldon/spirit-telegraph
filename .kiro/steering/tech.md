---
inclusion: always
---
# Tech stack and constraints

## Stack
- **App:** React 19 + TypeScript 7 in `strict` mode (plus `noUncheckedIndexedAccess`), built with Vite 8. Single-page app, installable as a PWA (`vite-plugin-pwa`). TypeScript uses `verbatimModuleSyntax` and `erasableSyntaxOnly`: use `import type`, include `.ts`/`.tsx` extensions in relative imports, and no enums or namespaces.
- **State:** Zustand for UI state. The Morse engine and composer are pure reducers that live outside React.
- **Styling:** plain CSS files in `src/ui/theme/` with component class names, plus CSS custom properties for theme tokens. No CSS-in-JS runtime.
- **Fonts:** `@fontsource/atkinson-hyperlegible` and `@fontsource/im-fell-english` (bundled, so they work offline).
- **Face gestures:** `@mediapipe/tasks-vision` FaceLandmarker with blendshapes (`eyeBlinkLeft`, `eyeBlinkRight`, `browInnerUp`, `jawOpen`). Load it lazily, only when a face input is selected. The WASM files are copied from `node_modules` into `public/models/wasm/` by `npm run models` (runs before dev and build). The `.task` model loads from `/models/face_landmarker.task` if present, otherwise from Google's model storage, and the service worker caches it after first use.
- **Speech:** Web Speech API. `speechSynthesis` for speaking; `SpeechRecognition` / `webkitSpeechRecognition` for the caregiver's voice where the browser supports it, with typed input as the fallback.
- **Storage:** IndexedDB via `idb-keyval`. Nothing is stored server-side.
- **AI predictions:** a serverless function at `api/predict.ts` (Vercel) using the official `@anthropic-ai/sdk`. The model comes from env `PREDICT_MODEL`, default `claude-opus-5-5`, with `output_config.effort: "low"` and structured JSON output. The API key lives only in server env `ANTHROPIC_API_KEY`; it never reaches the browser.
- **Tests:** Vitest 5, `fast-check` 4 for property-based tests, Testing Library for components (to add), Playwright for end-to-end tests (to add).
- **Tooling:** oxlint + Prettier, Node 24 LTS, npm.

## Commands
- `npm run dev`: start the dev server
- `npm run build`: type-check and build for production
- `npm test`: all unit and property tests (Vitest, single run)
- `npm run test:pbt`: property tests only (`*.pbt.test.ts`)
- `npm run typecheck`: `tsc -b` (project references; no output files)
- `npm run lint`: oxlint
- `npm run format` / `npm run format:check`: Prettier
- `npm run e2e`: Playwright end-to-end tests, added with the communicator-app spec (use the keyboard as the switch; never require a camera in CI)

## Hard constraints
- `src/engine/` and the pure parts of `src/input/` and `src/predict/` must not touch the DOM, `Date.now()`, timers or randomness. Time always arrives as an argument (`t` in milliseconds). This keeps them deterministic and property-testable.
- Never send camera frames, images or audio to any server.
- Never put secrets in client code or in committed files. Commit `.env.example` only.
- Don't send `temperature`, `top_p` or `top_k` to the Claude API (current API versions reject them). Don't use assistant prefill. Use `output_config.format` for JSON output.
- Keep the initial JS bundle under 250 KB gzipped, excluding the lazily loaded MediaPipe files.
- Supported browsers: current Chrome, Edge, Firefox and Safari. Speech recognition is Chromium-only, so it must degrade to typed input.
