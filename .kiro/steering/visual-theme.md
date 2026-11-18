---
inclusion: fileMatch
fileMatchPattern: ["src/ui/**/*", "src/**/*.css"]
---
# Visual theme: "Telegraph office at midnight"

A Victorian spiritualist's telegraph office at midnight: brass, oxblood leather, sepia paper tape, candlelight. Spooky through craft and atmosphere, never through gore or jump scares. Functional surfaces stay crisp and high-contrast.

## Themes
1. **Séance** (default): dark walnut background, brass and candle accents, cream paper tape.
2. **High contrast dark:** near-black background, white text, amber accents, no textures.
3. **High contrast light:** white background, black text, deep blue accents, no textures.

Define every colour as a token in `src/ui/theme/tokens.css`. Components never use raw colour values.

## Séance tokens (starting point; verify contrast)
- `--bg`: #17110d (walnut black)
- `--surface`: #241a14
- `--paper`: #f3e6c8 (tape and telegram background)
- `--ink`: #1d1410 (text on paper)
- `--text`: #f5ead2 (text on dark)
- `--brass`: #c9a24a
- `--oxblood`: #7a1f1f (danger; SOS)
- `--ghost`: #9fd3c7 (predictions: "spirit ink")
- `--focus`: #ffd166

## Typography
- Headings and ornament text: "IM Fell English" (Google Fonts, OFL). Use sparingly.
- Everything functional: "Atkinson Hyperlegible" (Google Fonts, OFL).
- Morse symbols: draw dots and dashes as shapes, not font glyphs, so they stay crisp at any size.

## Signature elements
- **The brass key:** a large, tactile telegraph key that presses down on input and doubles as a touch switch. A short sidetone (≈ 600 Hz) plays while the key is down; it can be muted.
- **Paper tape:** dots and dashes of the current letter print onto a strip of tape, then the decoded letter is stamped onto the telegram.
- **The telegram:** the composed message, typeset like a Victorian telegram form. Words end with "STOP" only in the history view, never in the spoken text.
- **Spirit ink:** predictions appear in `--ghost` with a soft ink-bleed fade-in. A planchette-shaped highlight marks the selected suggestion.
- **Candles:** two candles frame the screen and flicker gently. They also act as status lights: lit means listening, snuffed means input paused.

## Don'ts
- No skulls, blood or horror imagery. The tone is uncanny and warm, not frightening.
- No low-contrast "aged" text effects on anything the user needs to read.
- No background audio. Sound effects (sidetone, stamp, alarm) only, each with its own mute.
