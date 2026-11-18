# Spirit Telegraph

**Give the living a voice.** A single-switch Morse communicator for people who can't speak or type. It works with a blink, an eyebrow raise, a key or a tap, predicts what you mean, and speaks it aloud. It runs in the browser, works offline, and camera frames never leave the device.

Built for **Kiroween 2026** (Resurrection category). In 1848 the "spiritual telegraph" claimed to talk with the dead; we bring back the telegraph key so the living can be heard.

> Status: **starting kit for the Kiro build**. This repo holds the Kiro specs, steering, hooks and MCP setup. There is no app code yet: the app is built in Kiro from these specs. (An earlier prototype was built outside Kiro and set aside; it is not part of this repo.)

---

## What's in this folder

```
.kiro/
  steering/   product, tech, structure (always on) · accessibility, visual-theme, morse-reference (file-matched) · kiro-log (manual: /kiro-log)
  specs/      morse-engine · switch-input · predictions · communicator-app   (requirements.md, design.md, tasks.md each)
  hooks/      test-engine-on-save · a11y-review · test-companion · verify-after-task · guard-secrets
  settings/   mcp.json (Playwright, context7)
scripts/      guard-secrets.mjs (used by the guard-secrets hook)
docs/         KIRO_USAGE.md (write-up log) · DEMO_SCRIPT.md (3-minute video plan)
LICENSE       MIT (shows in GitHub's About panel)
```

The four specs contain **33 correctness properties**, written to be checked with property-based tests (fast-check).

## How to use this with Kiro

1. **The repo** is public on GitHub with an MIT license, and `.kiro/` is committed. Keep it that way.
2. **Open this folder in Kiro IDE.** Steering loads automatically. Open the MCP panel and confirm `playwright` and `context7` connect (Node 24 needed). Open Agent Hooks and confirm the five hooks are listed.
3. **Make the specs Kiro's, not ours.** These specs are a drafted starting point. Judges score how well *you* use Kiro, so for each spec:
   - Open `requirements.md` → **Analyze Requirements**. Fix what it finds in Markdown Review.
   - Ask Kiro to revise `design.md` and `tasks.md` from the revised requirements. Keep its changes; they're your evidence.
   - Note what Kiro caught in `docs/KIRO_USAGE.md`.
4. **Build in this order.**
   1. `morse-engine` (everything depends on it; property-test heavy).
   2. `switch-input` and `predictions` **in parallel**. They don't touch each other, which makes them a good showcase for Kiro's parallel task waves or Kiro Crew.
   3. `communicator-app`.
5. **Run `/kiro-log` at the end of every session.** By the deadline, the "How Kiro was used" write-up is mostly done.

Ideas for more Kiro depth, if time allows: a custom "accessibility reviewer" agent, and a look through the **Powers** panel for testing or deployment powers worth using.

## 16-day plan (today → Fri Dec 4, 2:00 PM PT)

| Dates | Goal | Done when |
|---|---|---|
| Nov 18–19 | Repo, Kiro setup, Analyze Requirements on all four specs; scaffold the project | Specs revised; `npm test` runs |
| Nov 19–21 | `morse-engine` | All 13 engine properties green; typing works with the keyboard in a bare test page |
| Nov 22–24 | `switch-input` + `predictions` in parallel | Brow and blink calibrated and sending letters; offline completions working; proxy deployed |
| Nov 25–28 | `communicator-app` tasks 1–9 | Full flow with keyboard: type, suggestions, speak, yes/no, SOS, trainer |
| Nov 29–30 | Storage, PWA, end-to-end tests, accessibility pass, **deploy** | Live URL works offline; axe clean on all themes |
| Dec 1 | Real-world test and polish | Someone else uses it cold; fix their top 3 problems |
| Dec 2 | Record and edit the demo video | Under 3 min, captioned, public on YouTube |
| Dec 3 | Write-up, blog post, social post, **submit** | Devpost submission complete |
| Dec 4 | Buffer only | Deadline 2:00 PM PT |

**If you fall behind, cut in this order:** the caregiver link (already a stretch goal) → gamepad source → two-switch mode → trainer beyond three lessons. Never cut: calibration, SOS, offline mode, the accessibility pass.

## Prize targets
- **Category:** Resurrection ($5k) and the overall prizes.
- **Bonus:** Best Demo ($1k), Bonus Blog Prize (Kiro credits), Social Blitz (post with `#KiroweenHackathon26` at the *start* of the post).
- Best Ghost of Kiroween Past ($2k), only if you registered for Kiroween 2025.

## Submission checklist
- [ ] Public GitHub repo with all source, assets and setup instructions
- [ ] Open-source license visible in the GitHub About panel
- [ ] `/.kiro` at the repo root, committed, **not** in `.gitignore`
- [ ] Working app URL. If anything needs a login, put the credentials only in the private Devpost form field.
- [ ] Demo video under 3 minutes, public on YouTube, showing the app working, with no copyrighted music
- [ ] Text description of features
- [ ] "How Kiro was used" write-up (from `docs/KIRO_USAGE.md`)
- [ ] Category and bonus prizes selected
- [ ] Blog post URL (must say it was written for Kiroween 2026) and social post URL, both published during the submission period

## Running the app (once built)
```bash
npm install
```
```bash
npm run dev
```
Copy `.env.example` to `.env` for local AI predictions. The app works fully without it; AI suggestions are optional.

## Important
Spirit Telegraph is **not a medical device**. SOS supplements, and never replaces, a nurse-call or emergency system.

## License
MIT. See `LICENSE`. Third-party data and fonts are credited in `THIRD_PARTY_NOTICES.md` (created during the build).
