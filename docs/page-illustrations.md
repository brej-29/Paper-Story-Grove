# Individual page illustrations

The three revised books each use eight separately generated, full-frame paintings: four shared story pages and two pages for each alternate ending. A six-page read never repeats a painting. Covers can preview an interior painting. The protected original books keep their existing SVG artwork.

The earlier four-panel sheets remain reference material only; the renderer no longer uses them. Every active page image lives in its story folder under `assets/stories/lamps`, `feast`, or `dragon`. `js/illustration.js` maps stage and branch to a unique image and three simple discoveries.

`assets/stories/page-manifest.json` records the initial page prompts, references and settings. `page-results.json` records the final active job IDs and confirmed download URLs. `continuity-edits.json` and `feast-continuity-edits.json` record six deliberate corrections: remove Revathi before her arrival, remove Leela before her arrival, and keep leaves empty before seating. Exact final prompts are also preserved in the `.webp.json` provenance sidecars; `library.prompt.txt` records the mural prompt.

GPT Image 2.6, medium, 2k, WebP: 24 page paintings plus one woodland home mural, followed by six continuity corrections, for 31 completed generation jobs in this revision. The representative page preflight returned 1 credit, including the reference. The home used the same model/quality/resolution (16:9); a preflight with that model/quality/resolution and 4:3 returned 1 credit. This implies approximately 31 quoted credits at the representative rate; actual billing debits were not returned. Four explicit rate-limit submission failures were retried only for the rejected items; no submitted job was accidentally duplicated. No further generation is required to run the book.

Local WebP assets retain their complete composition, optimized to 1600 px wide. No service or credentials are needed to display them. Generation provenance is development documentation and is never required in the child-facing interface.

New story copy uses short rhythmic lines and simple prose, 27–34 words per page. Typography is larger and more spacious only in the revised editions. The original story data, original SVG art, narration engine and optional recording manifest are unchanged; `node tests/preservation.cjs` verifies their SHA-256 hashes.

Final Astra code review found and resolved a page-turn race when leaving a book mid-animation. Transition tokens now prevent an old timer from stealing focus or blocking the next book. `tests/navigation.cjs` reproduces this sequence. The kite launch text and discovery now match Moss holding the reel.

## Local checks

Run `node tests/page-art.cjs` to detect missing/repeated page images, identical image bytes, or wordy/damaged page text. Run the other scripts in `tests` for routes, audio controls and narration. Start the book with `node tests/serve.cjs`, then open `http://127.0.0.1:8000/`.

The server ran and all 43 referenced resources returned nonempty HTTP 200 responses. Every new painting was visually reviewed in contact sheets, including six corrected images. The home shell and shelf were inspected in Edge during integration, but the browser was then minimized; the exposed Computer Use API could not restore it. Final phone rendering, browser-console inspection, real touch input and audible narration/music remain unverified. Mocked audio tests verify sequencing and controls, not voice quality. The mechanical design detector's warm-cream warning was retained intentionally to match the mural; two bounce-easing advisories belong to protected original rules.
