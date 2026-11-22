# Narration and optional recordings

The default reader uses locally installed English browser voices, normal pitch, short sentences and deliberate paragraph pauses. It never changes the story data. A voice menu handles voices that arrive after page load; speed can be changed while reading. Play, Pause, Resume and Replay work independently of automatic reading (the header's Read to me toggle). Resume repeats the interrupted sentence, which avoids unreliable browser pause/resume implementations and lost words. A highlight tracks the current paragraph. The reader stops at the end of a page and never chooses for the child.

Music and effects are quiet while narration plays. Picture discoveries keep their captions without interrupting narration. Navigation and returning to the shelf cancel pending speech and pause timers. No voice or a failed voice leaves the full written page available with an explanatory status.

Browser voices vary substantially. These changes improve pacing and control; they do not turn an installed mechanical voice into a human reader. No claim of natural or humanlike output is made. The actual audio could not be listened to during this implementation. Cultural-name pronunciation needs a speaker's listening review. We avoid unverified phonetic substitutions in the existing stories.

Online browser voices are an explicit, session-only opt-in. They may send the story text to the provider and may require internet. Local voices need to be installed on the device; a browser may expose no suitable voice. A previously loaded book or a downloaded local copy remains readable without audio. The site does not install an offline service worker.

## Better voice option: reviewed local audio

For consistent expressive narration, a grown-up can record the sentences, or a maintainer can generate and review neural TTS audio outside the app. Azure's [Audio Content Creation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-audio-content-creation) supports editing narration and downloading audio. This requires a service account and may incur charges. Browser [voice availability and localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice) are device dependent. Neither option has been audibly evaluated here.

1. Run `node tests/export-narration.cjs > narration-script.json` from the project root (use a UTF-8 output shell). This exports every page title, exact story text, question and choice label in playback order. Do not alter the protected story files.
2. Record or synthesize one MP3 per exported segment. Keep credentials exclusively in the provider's tool or a server-side generation environment, never in HTML, JavaScript, Git or the manifest. Use an adult voice you have permission to use. Direct a gentle read with small changes in dialogue, clear names and no background music. Do not add spoken instructions or change the words.
3. Listen to every clip and review Tamil/Malayalam names with a fluent speaker. Trim long leading/trailing silence; the player already adds sentence/paragraph pauses. Put the files at the exported `audio/<story>/<page>/<index>.mp3` paths.
4. Add each reviewed page to `js/audio-manifest.js`, e.g. `window.STORY_AUDIO['kerala/k1'] = ['audio/kerala/k1/0.mp3', ...];` with one path per exported segment. No recordings are bundled yet. Omitted or failed segments use browser speech. Only relative paths under `audio/` are accepted.
5. Test the page, speed, pause/resume, replay, both branches, offline playback and missing-file fallback. Committed recordings work without a runtime paid service but increase download/repository size. Re-export and review recordings whenever a new story changes.

## Checks

- `node tests/content.cjs`: original-file SHA-256 baseline, exactly six stories, all branches/endings reachable, expected path lengths, unique discovery ids and SVG generation.
- `node tests/narration.cjs`: deterministic speech lifecycle tests, local/online selection, cancellation, pause/resume, speed and unavailable voice.
- `node tests/serve.cjs`: static local preview at http://127.0.0.1:8000.

The baseline was captured before edits in `tests/preservation-baseline.json`. Both `js/stories.js` and `js/art.js` must match byte-for-byte, covering all original words, endings, choices, cultural notes and illustration definitions.

## Implementation verification (2026-11-16)

Passed: original-file SHA-256 preservation; six shelf entries; 47 scene renders; all 12 ending routes and alternate-ending return handlers; 108 discovery definitions; app startup/open/next/home and no-voice controls in a lightweight DOM fixture; deterministic narration lifecycle tests; linked preview assets returning HTTP 200; JavaScript syntax and Git whitespace checks. Run `node tests/app.cjs` for the app event checks.

GPT-6 Astra authored and reviewed the three stories and reviewed the narration architecture. A mechanical design scan reported existing gradient-contrast detection warnings and existing pop-up bounce easing; those established visual styles were retained.

The local server ran, but Computer Use refused browser inspection because it could not determine the browser URL confidently enough to enforce its policy. Therefore actual browser console inspection, screenshots, narrow-screen appearance, real touch interaction, available device voice enumeration and audible narration quality were not verified. DOM fixtures and generated SVG checks are not a substitute for those checks. No natural/humanlike voice-quality claim is made.

## Illustrated replacement revision

The Nila, Tara and Pip additions have been replaced with Anu, Dev and Moss. The narration engine and audio manifest remain byte-identical to the revision baseline. See [replacement story sources](replacement-stories.md) and [illustration/audio verification](illustrated-assets.md) for the current revision. The original three books remain unchanged.
