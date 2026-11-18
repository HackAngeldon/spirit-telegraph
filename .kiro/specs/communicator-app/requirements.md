# Requirements: Communicator app

## Introduction
The communicator is the app people see: the brass key, the paper tape, the telegram, suggestions, speech, the caregiver panel, the SOS alarm, the Morse trainer, settings and offline support. It wires switch input → Morse engine → composer → speech, using the predictions module for suggestions.

## Glossary
- **Communicator:** the Spirit Telegraph web app.
- **Telegram:** the message being composed, shown in large type.
- **Tape:** the strip that shows the dots and dashes of the letter in progress.
- **Caregiver panel:** the area where the caregiver's question appears (heard by speech recognition or typed).
- **History:** the list of messages already spoken.
- **Alarm:** the SOS alert state.

## Requirements

### Requirement 1: The telegraph screen
**User Story:** As a user, I want to see each dot and dash as I make it, and my message as it grows, so that I always know where I am.

#### Acceptance Criteria
1. WHEN the engine emits a `symbol`, THE Communicator SHALL print it on the tape within 100 ms of the input, and SHALL animate the brass key and play the sidetone unless muted.
2. WHEN a character is committed, THE Communicator SHALL stamp it onto the telegram and clear the tape.
3. WHEN an `unknown` sequence is committed, THE Communicator SHALL show "not a letter" on the tape for 1.5 s and play a soft low tone unless muted.
4. THE Communicator SHALL show a Morse cheat sheet that can be toggled, with the controls listed first and letters ordered by English frequency.
5. THE Communicator SHALL show input status at all times: listening, paused (asleep), "I can't see you", camera denied, or slow.

### Requirement 2: Speaking and history
**User Story:** As a user, I want my message spoken aloud when I finish it, so that people in the room hear me.

#### Acceptance Criteria
1. WHEN the composer emits an `utterance`, THE Communicator SHALL speak it with the selected voice, rate and pitch, and add it to the history with a timestamp.
2. WHEN an item in the history is selected by pointer or by the switch, THE Communicator SHALL speak it again.
3. IF the browser has no speech voices, THEN THE Communicator SHALL show the utterance full-screen in large text instead.
4. THE Communicator SHALL speak only composer utterances, history items the user re-selects, the yes/no answers from Requirement 4, and the SOS phrase.

### Requirement 3: Caregiver panel
**User Story:** As a caregiver, I want to ask a question out loud and see it on screen, so that the user gets reply suggestions.

#### Acceptance Criteria
1. WHEN the caregiver presses "Listen" and the browser supports speech recognition, THE Communicator SHALL transcribe one utterance and show it as "Heard: …".
2. WHERE speech recognition is not supported, THE Communicator SHALL show a text field for typing the question instead.
3. WHEN a heard utterance is shown, THE Communicator SHALL pass it to the predictor as fresh context for 60 seconds.
4. THE Communicator SHALL never record audio to storage; recognition results are kept only as text in memory.

### Requirement 4: Yes/no mode
**User Story:** As a caregiver, I want a quick yes/no mode, so that simple questions take a single movement.

#### Acceptance Criteria
1. WHEN the caregiver presses "Yes/No question", THE Communicator SHALL enter yes/no mode and show large YES (dot) and NO (dash) labels.
2. WHILE in yes/no mode, WHEN exactly one dot is committed, THE Communicator SHALL speak "Yes", add it to history and leave yes/no mode.
3. WHILE in yes/no mode, WHEN exactly one dash is committed, THE Communicator SHALL speak "No", add it to history and leave yes/no mode.
4. WHILE in yes/no mode, WHEN any other sequence is committed, THE Communicator SHALL leave yes/no mode and process the sequence normally.
5. WHEN 30 seconds pass in yes/no mode without input, THE Communicator SHALL leave yes/no mode.

### Requirement 5: SOS alarm
**User Story:** As a user, I want to call for help urgently, so that someone comes even if they're in another room.

#### Acceptance Criteria
1. WHEN the composer emits `alarm`, THE Communicator SHALL enter the alarm state within 200 ms, in every mode and even when input is paused.
2. WHILE in the alarm state, THE Communicator SHALL play a loud repeating alarm tone (ignoring the mute settings), say "I need help now" every 10 seconds, and pulse the screen in `--oxblood` at no more than 2 flashes per second.
3. WHILE in the alarm state, THE Communicator SHALL show a large "I'm here" button that ends the alarm, reachable by pointer and keyboard.
4. THE Communicator SHALL state in the alarm settings and onboarding that SOS does not replace a nurse-call or emergency system.

### Requirement 6: Phrasebook (Q-codes)
**User Story:** As a user, I want my own shortcuts for things I say often, so that common messages take three letters.

#### Acceptance Criteria
1. THE Communicator SHALL ship with the default Q-codes from the morse-reference steering file.
2. WHEN the caregiver adds or edits a Q-code, THE Communicator SHALL require the code to start with Q, be 2–4 letters long and be unique, and SHALL save it on the device.
3. THE Communicator SHALL show the phrasebook as a list the user can browse, with each code drawn in Morse beside its phrase.

### Requirement 7: Morse trainer
**User Story:** As a new user or caregiver, I want to learn Morse inside the app, so that I'm not stuck at the start.

#### Acceptance Criteria
1. THE Communicator SHALL offer lessons that introduce letters two at a time, starting with E, T, I, A, N and M, plus the SPACE, ERASE and SPEAK controls.
2. WHEN a lesson prompt is shown, THE Communicator SHALL play it as sound and show it as dots and dashes, and SHALL mark the user's attempt correct or incorrect.
3. WHEN accuracy over the last 20 attempts reaches 90%, THE Communicator SHALL unlock the next pair of letters.
4. THE Communicator SHALL use the user's current input source and timing in the trainer.

### Requirement 8: Onboarding
**User Story:** As a first-time user and caregiver, I want a short guided start, so that we're talking within minutes.

#### Acceptance Criteria
1. WHEN the app opens for the first time, THE Communicator SHALL run onboarding: what the app is → choose input → calibration (from the switch-input spec) → send "E" → send "SOS" (in practice mode, with no alarm) → the not-a-medical-device notice.
2. THE Communicator SHALL let a caregiver skip onboarding and reach it again later from settings.

### Requirement 9: Settings and themes
**User Story:** As a user or caregiver, I want to adjust the app to this person, so that it's comfortable for long use.

#### Acceptance Criteria
1. THE Communicator SHALL offer settings for: input source and mode, timings (from the engine), automatic word spacing, voice/rate/pitch, theme (Séance, High contrast dark, High contrast light), telegram text size (32–64 px), reduce motion, each sound's mute, AI suggestions and saved-phrase sharing.
2. WHEN settings change, THE Communicator SHALL apply them immediately and save them on the device.
3. IF engine settings are invalid (for example colliding control codes), THEN THE Communicator SHALL block saving and name the problem.

### Requirement 10: Data on the device
**User Story:** As a user, I want my data to stay mine, so that I trust the app.

#### Acceptance Criteria
1. THE Communicator SHALL store settings, profile, phrasebook, history and learned words only in this browser's IndexedDB.
2. WHEN "Export" is chosen, THE Communicator SHALL download a JSON file of all saved data; WHEN that file is imported, THE Communicator SHALL restore the same data.
3. WHEN "Delete all data" is confirmed, THE Communicator SHALL remove all saved data and return to onboarding.

### Requirement 11: Offline and installable
**User Story:** As a user in a hospital with bad Wi-Fi, I want the app to keep working, so that I'm never cut off mid-sentence.

#### Acceptance Criteria
1. THE Communicator SHALL be installable as a PWA and SHALL precache the app shell, fonts, lexicon and (after first use) the face model.
2. WHILE offline, THE Communicator SHALL keep input, decoding, offline predictions, speech, history, the trainer and SOS working.
3. WHILE offline, THE Communicator SHALL hide the "AI on" indicator's active state and show "AI unavailable offline" instead.

### Requirement 12 (stretch): Caregiver link
**User Story:** As a caregiver in another room, I want messages and SOS on my phone, so that I can respond from anywhere in the home.

#### Acceptance Criteria
1. WHERE the caregiver link is enabled, WHEN the user shares a pairing code, THE Communicator SHALL show utterances and alarms on the paired phone within 2 seconds.
2. THE caregiver link SHALL send only utterance text and alarm events, never camera data or drafts.
