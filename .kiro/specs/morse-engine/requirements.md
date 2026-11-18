# Requirements: Morse engine

## Introduction
The Morse engine turns raw switch activity (presses with timestamps, or explicit dot/dash symbols) into characters, control actions and an editable message. It is pure TypeScript with no DOM, timers or clock access, so it is deterministic and property-testable. Everything else in Spirit Telegraph builds on it.

## Glossary
- **Morse_Engine:** the pure reducer that turns switch inputs into engine events.
- **Composer:** the pure reducer that applies engine events to the message being written.
- **Press:** a switch `down` followed by an `up`. Its duration is `up.t - down.t` in milliseconds.
- **Dash threshold:** the press duration at or above which a press counts as a dash.
- **Letter pause:** the silence after which the pending symbols are committed as one character or control.
- **Control code:** a Morse sequence that triggers an action instead of a character (SPACE, ERASE, NEXT, ACCEPT, SPEAK, CLEAR, SOS). The defaults are listed in the morse-reference steering file.
- **Q-code:** a phrasebook shortcut such as `QWA`, expanded to a phrase at a word boundary.
- **Timed mode:** one switch; dots and dashes are told apart by press duration.
- **Two-switch mode:** one switch sends dots and another sends dashes; duration doesn't matter.
- **Asleep:** input is paused; only the wake hold and SOS are recognised.

## Requirements

### Requirement 1: Encode and decode Morse
**User Story:** As a user, I want my dots and dashes turned into the right letters, so that what I send is what appears.

#### Acceptance Criteria
1. THE Morse_Engine SHALL decode every character code in the morse-reference table to its character.
2. WHEN a committed sequence matches no character code and no control code, THE Morse_Engine SHALL emit an `unknown` event containing the sequence and SHALL NOT add a character.
3. THE Morse_Engine SHALL provide an `encode` function such that decoding the encoding of any supported text returns that text in upper case.
4. THE Morse_Engine SHALL treat lower-case input to `encode` as its upper-case equivalent.
5. THE Morse_Engine SHALL refuse a control-code configuration in which any control code equals a character code or another control code, and SHALL report which codes collide.

### Requirement 2: Classify presses in timed mode
**User Story:** As a user with one reliable movement, I want short and long presses told apart reliably, so that I can send Morse with a single switch.

#### Acceptance Criteria
1. WHEN a press shorter than the minimum press duration ends, THE Morse_Engine SHALL ignore it and emit no event.
2. WHEN a press ends with a duration below the dash threshold, THE Morse_Engine SHALL append a dot to the pending symbols and emit a `symbol` event.
3. WHEN a press ends with a duration at or above the dash threshold, THE Morse_Engine SHALL append a dash to the pending symbols and emit a `symbol` event.
4. WHEN a `cancel` input arrives during a press, THE Morse_Engine SHALL discard that press without emitting a symbol.
5. IF an input arrives with a timestamp earlier than the previous input, THEN THE Morse_Engine SHALL ignore it and leave its state unchanged.

### Requirement 3: Commit letters, words and controls
**User Story:** As a user, I want a pause to finish a letter, so that I don't need an extra movement for every letter.

#### Acceptance Criteria
1. WHEN no press has started for at least the letter pause after the last press ended, and symbols are pending, THE Morse_Engine SHALL commit the pending symbols on the next `tick` or `down` input.
2. WHEN the committed symbols match a character code, THE Morse_Engine SHALL emit a `char` event.
3. WHEN the committed symbols match a control code, THE Morse_Engine SHALL emit a `control` event for that control instead of a character.
4. WHERE automatic word spacing is enabled, WHEN no press has started for at least the word pause after a character was committed, THE Morse_Engine SHALL emit a SPACE control once.
5. WHILE a press is in progress, THE Morse_Engine SHALL NOT commit pending symbols.

### Requirement 4: Two-switch mode
**User Story:** As a user with two reliable movements (for example eyebrow and mouth), I want one movement for dots and one for dashes, so that timing matters less and I tire less.

#### Acceptance Criteria
1. WHILE in two-switch mode, WHEN a `symbol` input arrives, THE Morse_Engine SHALL append that symbol to the pending symbols regardless of press duration.
2. WHILE in two-switch mode, THE Morse_Engine SHALL commit letters by the letter pause exactly as in timed mode.
3. THE Morse_Engine SHALL produce the same characters in two-switch mode as in timed mode for the same symbol sequence and the same pauses.

### Requirement 5: Adapt to the user's timing
**User Story:** As a user whose speed changes with fatigue, I want the engine to follow my rhythm, so that I don't have to keep changing settings.

#### Acceptance Criteria
1. WHERE adaptive timing is enabled, WHEN a press is classified, THE Morse_Engine SHALL update its running estimates of dot and dash durations.
2. WHERE adaptive timing is enabled, WHILE the estimated dash duration is at least 1.8 times the estimated dot duration, THE Morse_Engine SHALL set the dash threshold to the geometric mean of the two estimates.
3. THE Morse_Engine SHALL keep the dash threshold within its configured minimum and maximum (defaults 150 ms and 2000 ms) at all times.
4. WHERE adaptive timing is enabled, THE Morse_Engine SHALL set the letter pause to three times the running estimate of gaps inside a letter, kept within its configured minimum and maximum (defaults 400 ms and 4000 ms).
5. WHERE adaptive timing is disabled, THE Morse_Engine SHALL use the configured dash threshold and letter pause unchanged.

### Requirement 6: Pause and wake input
**User Story:** As a user, I want to pause input when I rest or watch TV, so that natural movements don't type anything.

#### Acceptance Criteria
1. WHEN a press lasts at least the sleep hold (default 3000 ms), THE Morse_Engine SHALL toggle between awake and asleep, emit a `sleep` event with the new state, and discard any pending symbols.
2. WHILE asleep, THE Morse_Engine SHALL emit no `char` or `control` events except SOS.
3. WHILE asleep, WHEN the committed symbols equal the SOS code, THE Morse_Engine SHALL emit the SOS control.
4. THE Morse_Engine SHALL require the sleep hold to be longer than the dash threshold maximum, and SHALL reject settings that break this rule.

### Requirement 7: Compose the message
**User Story:** As a user, I want to build, fix and finish a message, so that I say exactly what I mean.

#### Acceptance Criteria
1. WHEN a `char` event is applied, THE Composer SHALL append the character to the current word.
2. WHEN a SPACE control is applied, THE Composer SHALL end the current word, expanding it first if it exactly matches a Q-code (case-insensitive).
3. WHEN an ERASE control is applied, THE Composer SHALL remove the last character of the message, if any.
4. WHEN a CLEAR control is applied, THE Composer SHALL empty the message.
5. WHEN a NEXT control is applied while suggestions are offered, THE Composer SHALL move the highlight to the next suggestion, wrapping to the first after the last.
6. WHEN an ACCEPT control is applied while a suggestion is highlighted, THE Composer SHALL replace the current partial word with the suggestion (or append the suggested phrase when there is no partial word) and end the word.
7. WHEN a SPEAK control is applied to a non-empty message, THE Composer SHALL expand a final Q-code if present, emit an `utterance` with the final text, and empty the message.
8. THE Composer SHALL only ever add text that came from decoded characters, an accepted suggestion or an expanded Q-code.
9. WHEN an SOS control is applied, THE Composer SHALL emit an `alarm` output and leave the message unchanged.
