---
inclusion: fileMatch
fileMatchPattern: ["src/ui/**/*.tsx", "src/ui/**/*.css", "src/app/**/*.tsx"]
---
# Accessibility rules (WCAG 2.2 AA minimum)

Our users have severe motor impairments, and often fatigue and low vision. Their caregivers are busy and may be older. Treat these rules as requirements, not nice-to-haves.

## Input
- Every action must work with a single switch (via Morse control codes) **and** with keyboard, mouse and touch. Never build a feature that needs fine pointer control.
- No action may depend on speed. Every timing (letter pause, dash threshold, hold-to-pause) is user-adjustable.
- On-screen hit targets are at least 44×44 CSS px; the brass key is at least 160 px.
- Keyboard focus is always visible: a 3 px outline with at least 3:1 contrast against its surroundings.

## Reading
- The composed message ("telegram") uses at least 32 px text and is scalable to 64 px in settings.
- Body text is at least 18 px. Use Atkinson Hyperlegible for anything functional.
- Text contrast is at least 4.5:1 (7:1 in the high-contrast themes). Check the séance theme too: candle glow and sepia must not reduce text contrast.
- Never convey state by colour alone. Pair colour with an icon, text or shape (for example "AI on ●" plus a label).

## Motion and flashing
- Respect `prefers-reduced-motion` and the in-app "Reduce motion" setting. When either is on, turn off candle flicker, tape scrolling animation and ghost-ink effects.
- Nothing may flash more than 3 times per second (WCAG 2.3.1). This includes the SOS alarm.

## Screen readers (for caregivers who use them)
- Use one `aria-live="polite"` region for committed letters and words, and `aria-live="assertive"` only for SOS.
- Every control has an accessible name. Icon-only buttons need `aria-label`.
- Decorative graphics (candles, ornaments, paper texture) get `aria-hidden="true"`.

## When you change a UI file
Check it against the rules above and fix violations in the same change. In your summary, list anything you couldn't fix.
