# How we used Kiro

> This file becomes the "How Kiro was used" write-up on Devpost. Update it at the end of each session with the `/kiro-log` slash command (from `.kiro/steering/kiro-log.md`). Only write what actually happened.

## Summary (fill in at the end)
- **Kiro surfaces used:** IDE / CLI / Web / Crew. What we used each for and how they differed.
- **Specs:** 4 feature specs (`morse-engine`, `switch-input`, `predictions`, `communicator-app`), written requirements-first in EARS notation. They started as a drafted brief; we ran Analyze Requirements and revised them in Markdown Review before implementation. *(List what Analyze Requirements caught.)*
- **Property-based testing:** 33 correctness properties across the specs. *(Best story: the counterexample fast-check found, what it revealed and how we fixed it.)*
- **Hooks:** `test-engine-on-save`, `a11y-review`, `test-companion`, `verify-after-task`, `guard-secrets`. *(What each one caught, with real examples.)*
- **Steering:** always-on `product.md`, `tech.md` and `structure.md`; file-matched `accessibility.md`, `visual-theme.md` and `morse-reference.md`; manual `kiro-log.md`. *(Which one changed Kiro's output the most, with a before and after.)*
- **MCP:** Playwright (screenshots and accessibility scans of all three themes) and context7 (up-to-date docs for MediaPipe and the LLM provider's SDK). *(What this let us do that would otherwise have been hard.)*
- **Parallel tasks / Kiro Crew:** *(Did switch-input and predictions run in parallel? What happened?)*
- **Powers:** *(Which ones, if any, and what they added.)*
- **Spec-driven vs vibe coding:** *(One honest paragraph.)*

## Daily log
<!-- /kiro-log appends entries below this line -->

### 2026-11-18: starting point (before Kiro)
- **Prepared outside Kiro:** the specs, steering files and hooks were drafted with another AI coding assistant as a starting brief.
- **Prototype set aside:** a throwaway prototype of the app was also built outside Kiro. It was removed from this repo, and the app is being rebuilt in Kiro from the specs. Lessons from it fed into the spec and steering text only, not into code.
- **Kiro features used:** none yet. All tasks in `.kiro/specs/*/tasks.md` are unticked.
- **Next in Kiro:** run Analyze Requirements on each spec, revise in Markdown Review, then build task by task, starting with `morse-engine`.
