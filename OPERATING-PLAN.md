# Student 2: one operating plan across sittings

Updated 16 Nov 2026. This is the common teaching contract. `CLAUDE.md` governs rules, `CANVAS.md` explains the domain-grounded choices, and `HANDOVER.md` holds the latest dated learner and implementation state. Re-read those instead of reconstructing a new framework in every chat.

## From evidence to the next teaching action

1. Select a worthwhile bounded performance from her curriculum and graph, then name the relevant KIs and the decisions the whole skill requires. Check the mathematical statement and dependency against the actual task; do not accept an old graph gate uncritically.
2. Inspect the evidence with conditions. Distinguish taught-but-not-delayed, supported, independent, delayed, mixed, partial, unreadable and not-yet-seen. A legacy “passed” flag alone cannot establish all of these. Do not turn absent records into wrong answers.
3. Prepare relevant prerequisites. Use a brief fresh retrieval/check for parts already evidenced when needed; teach unfamiliar relevant parts with examples and practice. A low-stakes return sitting before a refresher is allowed for taught material or to locate a starting point, with useful feedback and a route into teaching. It is not a failure test imposed at the start of every new lesson.
4. Teach the target through the process it needs: meaningful explanation/model, examples and contrasts, prediction or completion, guided action, then reduced support. Facts, concepts, principles and procedures can each require more than one process. Use only supports that serve the target and record what they supplied.
5. After a difficulty, distinguish an access/format problem from candidate mathematical explanations using a small authored probe. Provide targeted teaching, a matched fresh check and suitable practice, then a fresh whole task. If uncertainty remains, keep it explicit and provide support or a saved next step rather than a diagnostic label or repeated guessing.
6. Practise whole-task coordination, method choice in a mixed set when relevant, and independent use. Use the relevant parts together; do not infer integration from part scores. Eligible unrelated work may continue while a specific gap is repaired.
7. End with the next action and its reason: retrieve/maintain, prepare a prerequisite, teach, practise with support, fade, integrate, discriminate between methods, or increase rigour. Plan a later fresh return. There is no default delay for a demonstrated skill and no automatic promotion from one right response.

## Evidence carried between sittings

Keep the target/item identity and version, actual question and response, first-attempt status, prior feedback/teaching that could cue it, supplied content, assistance conditions when known, correctness/readability, reply and fresh check, and session/date. Record the mathematical decisions the learner made herself. Read-aloud support should not automatically invalidate a mathematics claim; supplying the required equation does limit a claim about forming it.

Report “independent on these kinds today”, “right with this support”, “retained after this gap”, or “not yet checked”. A composite task supports its constituent KIs only where the task and response expose those decisions. Logging every requires edge as attained would invent evidence.

Historical rows are preserved. A page's immediate after-reply success remains useful repair evidence while being excluded from an independent retention claim. The historical 119/135 recount is kept with its original definitions and is not silently recalculated as new mastery.

## One implementation contract

The local implementation uses `site/assets/teaching-catalogue.js` for authored targets, mathematical content, prerequisites, examples/probes and item metadata; `site/assets/learning-policy.js` for shared decisions and evidence interpretation; `site/assets/teaching-support.js` for bounded probe/example/check routes, and `site/assets/learning-bridge.js` to connect them to the existing pages. `preparation.js` and `preparation-page.js` supply the seven named missing prerequisites through one page. `next-practice.html` reads the shared evidence and offers the next action. These names describe the intended shared boundary; the dated completion and tests are recorded in `HANDOVER.md`.

The existing equations pages and `quad-engine.js` remain the learner interfaces. Do not fork their decision rules separately. Every new target must either have sufficient authored teaching/probe/practice coverage to deliver the promised route or return a clear coverage limitation and a supported continuation; never invent a lesson or claim an unsupported prerequisite is taught. The catalogue is not the whole Grade 8 curriculum and no online LLM, machine-learning diagnosis, scheduler or new backend is implied.

Do not rewrite the whole knowledge graph to match a lesson. The current teaching policy supersedes old timing/gate annotations where they conflict: all **relevant** KIs needed for the performance are prepared, including a principle formerly marked “before attainment”; evidence for a whole skill still needs integrated practice. A target-specific catalogue mapping may clarify the route and record an unresolved graph mismatch. Semantic changes to the graph require separate mathematical/source verification.

## Author, review, verify, deliver

Bijit's current instruction authorises the local rules and teaching-code update. Continue that work, repair findings and verify the result without repeating historical approval waits for each local file or screen. Show meaningful screens and wrong-answer routes as reviewable evidence, use the available wording guidance and independent second reader, and state checks actually run. If a named skill is unavailable, report that and do the applicable manual check rather than claim the skill ran.

Production deployment, publishing, changing sharing or writing to the live Sheet remains a separate action requiring the applicable user instruction. Local tests/previews use the test/no-write route and must not send fictitious answers to the Sheet. A request to edit local code is not deployment permission.

Apply right-size to material decisions: name the smallest complete route, its limitation and the evidence for an added component. Show a brief disposition when it changes scope; invoking a skill alone does not prove the result is well sized. Keep the canvas and operating plan compact, replace stale current-state notes and preserve dated evidence/history in the existing records.

## Verification and revision

Check mathematical examples and plausible alternative responses, discriminating probes, support/first-answer attribution, repair-to-whole transitions, saved continuation, preview isolation and compatibility with existing records. Exercise actual pages as well as the shared policy. Record failures and coverage limits. Software checks prove those behaviours only; later learner work tests whether the teaching choice helped.

Counts, caps, streaks, stop triggers and retrieval gaps are visible project choices, revised from usefulness and learner evidence. Existing historical 8/10/two-miss choices do not become scientific laws or mandatory global pace. When a repeated route fails, inspect access, examples, prior knowledge and the teaching decision before adding more of the same.

## What future AI work must use

For every material change, read this contract and the canvas, inspect her dated evidence and the current catalogue, then state the target, supplied help, relevant dependencies, expected decision and evidence that would change the plan. Reuse the existing policy and interfaces. An AI may author or recommend a reviewed change; the child-facing runtime uses authored content and deterministic rules, not an online AI diagnosis. Missing content or evidence is a visible limitation, not permission to invent a mastery claim.

Run `node tests/learning-policy.test.cjs`, `node tests/learning-contract.test.cjs`, `node tests/preparation-dom.test.cjs`, and `node tests/learning-page-dom.test.cjs` after relevant changes; run the browser route and integration tests for interface changes and inspect changed screens. Record actual results and pending checks in the dated handover. Older quadrilateral flow tests describe the old two-miss/held behaviour; use the new integration tests for the changed flow while retaining historical tests.

The browser evidence boundary is conservatively a calendar day in Asia/Kolkata, not a detected real sitting. First delayed review is next day or later; maintenance is provisionally seven days after completing delayed coverage. These are revisable project settings. Required decisions/minima are explicit in the catalogue. Ready-for-review means provisional preparation to try dependent work, not general mastery or every authored variation passed. The evidence records show exactly which questions supported it. Read-aloud and the child’s own exploratory lines are kept as access/action conditions; mathematical hints remain supplied help.
