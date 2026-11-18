---
inclusion: always
---
# Product: Spirit Telegraph

## In one line
A single-switch Morse communicator that gives a voice to people who can't speak or type. It works with a blink, an eyebrow raise, a key or a tap, predicts what you mean, and speaks it aloud.

## The story (Kiroween 2026, Resurrection category)
In 1848 the Fox sisters claimed to talk with the dead through knocking codes, and newspapers called it the "spiritual telegraph". We bring back the telegraph key, one of the first digital communication technologies, to give the living a voice.

## Who it's for
- **Primary users:** people with severe motor and speech impairments who still have one or two reliable movements. This includes ALS/MND, cerebral palsy, brainstem stroke and locked-in syndrome, high spinal cord injury, and patients who are temporarily intubated.
- **Secondary users:** caregivers, family and nurses who talk with them and need to understand them quickly.

## The problem
Dedicated speech devices (AAC) are expensive and often need special hardware. Letter boards are slow and need a patient partner in the room. Many people who can blink or raise an eyebrow still have no fast, private, low-cost way to say what they mean.

## What the MVP does
1. Turns one movement (or two) into Morse code. Inputs: webcam gestures (blink, brow raise, mouth open), keyboard, mouse/touch, or a USB/Bluetooth switch (these appear as a key or gamepad button).
2. Decodes Morse into text, with timing that adapts to the user.
3. Predicts words and whole replies, including replies to what the caregiver just said.
4. Speaks the message aloud.
5. Raises an alarm when the user sends SOS.
6. Teaches Morse with a built-in trainer.

## Product principles (non-negotiable)
1. **The user's words are theirs.** Never speak, send or insert anything the user did not select. Suggestions are offers; only the user accepts them.
2. **Privacy first.** Camera frames never leave the device and are never stored. AI predictions are opt-in, and only the typed text and the caregiver's transcribed question are sent.
3. **Works offline.** Morse input, gestures, offline predictions, speech and SOS all work without a network connection.
4. **Fatigue-aware.** Every gesture costs the user effort. Minimise inputs per message, never require fast input, and let the user pause input at any time.
5. **Readable first, spooky second.** The séance theme must never cost contrast, size or clarity.
6. **Not a medical device.** Never claim clinical safety. SOS supplements a real nurse-call system; it never replaces one.

## Success measures for the demo
- A new user sends "HELLO" within 5 minutes using the on-screen cheat sheet.
- With predictions on, a common reply to a caregiver's question takes 6 inputs or fewer.
- Keyboard input shows feedback in under 100 ms; a face gesture shows feedback in under 200 ms.
