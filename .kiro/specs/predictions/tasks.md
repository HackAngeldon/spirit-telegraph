# Implementation plan: Predictions

- [ ] 1. Lexicon
  - [ ] 1.1 Choose an English word-frequency list whose license allows redistribution. Record the source and license in `THIRD_PARTY_NOTICES.md`. Write the AAC core-word starter set.
    - _Requirements: 1.5_
  - [ ] 1.2 Build script that turns the list into a compact sorted lexicon (`public/lexicon.bin` or JSON), loaded at startup and cached by the PWA.
    - _Requirements: 1.1, 1.4_

- [ ] 2. Offline predictor
  - [ ] 2.1 Implement `suggestOffline` (prefix range plus top-k scoring) and `learn`, with persistence in IndexedDB.
    - _Requirements: 1.1–1.3, 2.1–2.4_
  - [ ] 2.2 Property test: prefix consistency
    - **Property 1** · **Validates: Requirements 1.1, 5.2**
  - [ ] 2.3 Property test: learning never demotes
    - **Property 3** · **Validates: Requirement 2.2**
  - [ ] 2.4 Property test: deterministic ranking
    - **Property 4** · **Validates: Requirement 1.2**

- [ ] 3. Merge
  - [ ] 3.1 Implement `mergeSuggestions` with normalisation, the ordering rules, and the stable highlight.
    - _Requirements: 5.1–5.4_
  - [ ] 3.2 Property test: bounded and unique
    - **Property 2** · **Validates: Requirement 5.1**
  - [ ] 3.3 Property test: stable highlight
    - **Property 6** · **Validates: Requirement 5.4**

- [ ] 4. Predict proxy
  - [ ] 4.1 `api/predict.ts`: zod request validation, per-IP rate limit, Claude call (model from env, effort low, structured output, server-side fallback), `stop_reason` handling, output sanitiser, no content logging. Look up the current `@anthropic-ai/sdk` API with the context7 MCP server before writing the call.
    - _Requirements: 4.1–4.6_
  - [ ] 4.2 Property test: the proxy never passes through unsafe output
    - **Property 7** · **Validates: Requirements 4.4, 3.6**
  - [ ] 4.3 Example tests with a mocked SDK client: 400 on oversize input, 429 on rate limit, empty lists on refusal.
  - [ ] 4.4 Add `.env.example` with `ANTHROPIC_API_KEY=` and `PREDICT_MODEL=claude-opus-5-5`.

- [ ] 5. AI client
  - [ ] 5.1 Debounce, token bucket, timeout, request ids, response validation, silent fallback.
    - _Requirements: 3.3–3.6_
  - [ ] 5.2 Property test: stale responses are dropped (model the client as a pure reducer over send/receive events)
    - **Property 5** · **Validates: Requirement 3.5**
  - [ ] 5.3 Settings: AI opt-in screen that explains exactly what is sent, the "AI on" indicator, the saved-phrases opt-in, and "Forget my history".
    - _Requirements: 3.1, 3.2, 2.4_

- [ ] 6. Checkpoint
  - Run `scripts/eval-predictions.mjs` once with AI off and once with AI on (your own key). Put the inputs-saved numbers in `docs/KIRO_USAGE.md` and in the demo video. Use only numbers you actually measured.
