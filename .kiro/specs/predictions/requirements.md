# Requirements: Predictions

## Introduction
Every gesture costs our users effort, so predictions matter more here than anywhere else. Two predictors work together: an **offline predictor** that completes words instantly from a bundled word list and the user's own history, and an optional **AI predictor** (Claude, via a serverless proxy) that suggests whole replies, including replies to what the caregiver just said. Suggestions are only offers: the user accepts them with NEXT and ACCEPT, and nothing is ever spoken automatically.

## Glossary
- **Predictor:** the module that produces ranked suggestions for the composer.
- **Offline_Predictor:** on-device word completion from frequency data and user history.
- **AI_Predictor:** the browser client that calls `/api/predict`.
- **Predict_Proxy:** the serverless function that calls the Claude API.
- **Partial word:** the letters typed since the last space.
- **Heard:** the caregiver's last utterance, transcribed by speech recognition or typed.
- **Completion:** a suggested word that finishes the partial word.
- **Reply:** a suggested whole phrase that answers what was heard.

## Requirements

### Requirement 1: Offline word completion
**User Story:** As a user, I want common words finished for me after one or two letters, so that I send fewer letters.

#### Acceptance Criteria
1. WHEN the partial word changes, THE Offline_Predictor SHALL return up to 3 completions that start with the partial word (ignoring case), within 10 ms.
2. THE Offline_Predictor SHALL rank completions by a score that combines general word frequency with how often and how recently the user has spoken the word.
3. WHEN the partial word is empty and nothing has been heard recently, THE Offline_Predictor SHALL return the user's most frequent phrase starters (for example "I", "Please", "Yes").
4. THE Offline_Predictor SHALL work with no network connection.
5. THE Offline_Predictor SHALL use only word lists whose license allows redistribution, and the license SHALL be credited in `THIRD_PARTY_NOTICES.md`.

### Requirement 2: Learn from the user
**User Story:** As a user, I want the suggestions to learn my words and phrases, so that they get faster the more I use them.

#### Acceptance Criteria
1. WHEN an utterance is spoken, THE Offline_Predictor SHALL record its words and the whole phrase in on-device history.
2. WHEN a word has just been spoken, THE Offline_Predictor SHALL rank that word no lower than before for every prefix of it.
3. WHEN the same phrase has been spoken 3 or more times, THE Offline_Predictor SHALL offer it as a phrase suggestion when its first word is typed.
4. WHEN the user chooses "Forget my history", THE Offline_Predictor SHALL delete all learned data.

### Requirement 3: AI suggestions (opt-in)
**User Story:** As a user, I want smart suggestions for whole replies, especially to what my caregiver just asked, so that I can answer in a few inputs.

#### Acceptance Criteria
1. THE AI_Predictor SHALL be off by default and SHALL turn on only after the user or caregiver enables it in settings, which explains exactly what is sent.
2. WHILE AI suggestions are on, THE UI SHALL show a visible "AI on" indicator with a text label.
3. WHEN a letter or word is committed or a new heard utterance arrives, THE AI_Predictor SHALL request suggestions, sending only the message text, the partial word, the heard text (if any from the last 60 s) and, if the user opted in, up to 20 saved phrases.
4. THE AI_Predictor SHALL wait 250 ms after the last change before sending a request, and SHALL send at most 20 requests per minute.
5. WHEN a response arrives for a request older than the latest one sent, THE AI_Predictor SHALL discard it.
6. IF a request fails, times out after 2.5 s, or returns invalid data, THEN THE AI_Predictor SHALL return no AI suggestions and SHALL keep showing offline suggestions without an error dialog.

### Requirement 4: The proxy
**User Story:** As the developer, I want a small, safe proxy, so that the API key stays secret and costs stay bounded.

#### Acceptance Criteria
1. THE Predict_Proxy SHALL accept `POST /api/predict` with JSON `{ requestId, text, partialWord, heard?, phrases? }` and reject bodies over 4 KB or fields over their limits (text 500, heard 300, each phrase 80 characters) with status 400.
2. THE Predict_Proxy SHALL read the API key only from server environment variables and SHALL never return it or log it.
3. THE Predict_Proxy SHALL call the Claude API with the model from `PREDICT_MODEL` (default `claude-opus-5-5`), effort `low`, and a JSON schema for structured output.
4. THE Predict_Proxy SHALL validate the model output and return `{ requestId, completions: string[≤3], replies: string[≤4] }`, with each suggestion at most 60 characters.
5. THE Predict_Proxy SHALL limit each client IP to 30 requests per minute and return 429 above that.
6. THE Predict_Proxy SHALL NOT log request or response text.

### Requirement 5: Merge and present suggestions
**User Story:** As a user, I want one short, sensible list of suggestions, so that choosing is quick.

#### Acceptance Criteria
1. THE Predictor SHALL merge offline and AI results into at most 4 suggestions with no duplicates (ignoring case and trailing punctuation).
2. WHILE the partial word is not empty, THE Predictor SHALL show only completions that start with the partial word, followed by replies only if fewer than 4 completions exist.
3. WHILE the partial word is empty and a heard utterance is less than 60 s old, THE Predictor SHALL list AI replies first.
4. WHEN new results arrive, THE Predictor SHALL keep the currently highlighted suggestion in place if it is still in the list, so that the highlight never jumps under the user.
5. THE Predictor SHALL never send a suggestion to speech output; only the composer's utterance is spoken.
