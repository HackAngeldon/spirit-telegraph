---
inclusion: fileMatch
fileMatchPattern: ["src/engine/**/*", "src/trainer/**/*", "src/ui/trainer/**/*"]
---
# Morse reference (source of truth for the engine)

## Character codes (International Morse, ITU-R M.1677-1, plus `!`)
| Char | Code | Char | Code | Char | Code | Char | Code |
|---|---|---|---|---|---|---|---|
| A | .- | J | .--- | S | ... | 1 | .---- |
| B | -... | K | -.- | T | - | 2 | ..--- |
| C | -.-. | L | .-.. | U | ..- | 3 | ...-- |
| D | -.. | M | -- | V | ...- | 4 | ....- |
| E | . | N | -. | W | .-- | 5 | ..... |
| F | ..-. | O | --- | X | -..- | 6 | -.... |
| G | --. | P | .--. | Y | -.-- | 7 | --... |
| H | .... | Q | --.- | Z | --.. | 8 | ---.. |
| I | .. | R | .-. | 0 | ----- | 9 | ----. |

Punctuation: `.` .-.-.-, `,` --..--, `?` ..--.., `'` .----., `!` -.-.--, `/` -..-., `(` -.--., `)` -.--.-, `&` .-..., `:` ---..., `;` -.-.-., `-` -....-, `"` .-..-., `@` .--.-.

Deliberately **not** typeable: `+` (its code is the AR prosign, which we use for SPEAK) and `=` (its code is the BT prosign, reserved).

## Control codes (defaults; user-configurable, must never collide with a character code)
| Control | Code | Origin | Effect |
|---|---|---|---|
| SPACE | ..-- | unused in ITU | End the current word |
| ERASE | ---- | unused in ITU | Delete the last character |
| NEXT | .-.- | unused in ITU | Move the suggestion highlight to the next suggestion |
| ACCEPT | ---. | unused in ITU | Accept the highlighted suggestion |
| SPEAK | .-.-. | AR prosign, "end of message" | Speak the message and file it in history |
| CLEAR | ........ | HH prosign, "error" | Clear the whole current message |
| SOS | ...---... | distress prosign | Raise the alarm, in every state |

## Timing
- ITU ratios: dot = 1 unit, dash = 3 units, gap inside a letter = 1 unit, gap between letters = 3 units, gap between words = 7 units.
- Assistive users are slower and less regular than radio operators, so the engine does **not** use fixed ratios. It classifies a press as a dot or dash by a threshold, and commits a letter after a pause. Both values adapt to the user within bounds.
- Word spaces come from the SPACE code by default. Automatic word spacing after a long pause is an opt-in setting, because users often pause to think mid-word.

## Q-codes (phrasebook shortcuts)
Typing one of these as a whole word expands it at the word boundary. The first five borrow real radio Q-codes.
| Code | Expands to | Real radio meaning |
|---|---|---|
| QSL | Yes, I understand. | I acknowledge receipt |
| QRS | Please speak more slowly. | Send more slowly |
| QRZ | Who is there? | Who is calling me? |
| QRT | I need to rest now. | Stop sending |
| QTH | Where am I? | What is your location? |
| QWA | I need water. | (custom) |
| QPN | I am in pain. | (custom) |
| QPO | Please change my position. | (custom) |
| QNR | Please call the nurse. | (custom) |
| QLY | I love you. | (custom) |
