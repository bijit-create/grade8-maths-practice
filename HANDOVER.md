# Handover: Student 2 (16 Nov 2026)

Keep this file short. The 11 Nov text is in git (7899894); the 15 Nov learner recount and decisions below are preserved. The 16 Nov changes update local teaching rules and code under Bijit's current instruction. Local authoring permission does not authorise production deployment or live Sheet writes.

## Current local update, 16 Nov

- `CANVAS.md` is her compact working model: domain principles, source/read-depth limits, learner evidence, conditional decisions and revision conditions. `OPERATING-PLAN.md` supplies one evidence-to-next-teaching loop across days. These are Student 2's own compact documents, not a copy of Student 1's full architecture.
- Current policy: prepare the KIs relevant to the selected skill; teach unfamiliar relevant knowledge; integrate it in skill practice; continue eligible unrelated work. Use a discriminating probe for an ambiguous response, targeted teaching, a fresh check and fresh whole-task use, then a delayed return. There is no global slow default, no automatic promotion on one answer and no inference that unknown means failed.
- The shared target catalogue, policy and teaching-support helpers are a **local prototype**, connected through her existing page interfaces. The existing equations and geometry pages now use the shared bridge; seven missing prerequisites use one preparation page. Next-practice gives a recommended next action and eligible alternatives. Exact checks and limits are in `UPDATE-2026-11-16.md`. Installed in the main Student 2 folder with backups and hash verification. Final policy, contract, DOM and browser checks pass; changed mobile screens were inspected. No learner has supplied evidence for these helpers yet. No deployment or live record write is part of this update.
- A historical graph timing label does not override relevant-prerequisite preparation. Target-specific catalogue mappings may clarify the route; the complete old graph has not been revalidated or semantically rewritten.
- The two vocabulary pages remain available locally and live under the earlier decision. Their wording is not the basis for claiming her curriculum requires those names. Next work is chosen from mathematical capability and her book, not a home-page “Start here” label.

## 16 Nov afternoon: Claude took over the deployment (branch `claude/chatgpt-implementation-status-e9b38e`)

- ChatGPT's update (uncommitted in the main folder) was copied unchanged into this worktree; the main folder is left as ChatGPT left it. The Claude CLI session ChatGPT started (15:05) stopped at 15:07 and was not closed (stopping it was refused by the permission check).
- Fixed here: (1) a check opened after a wrong answer is saved (`student2-pending-check-v1`) and reopens after a reload; before, a reload skipped it. (2) The question redrawn after "Show me an example" now records `supplied: example requested during this item`; before, `supplied` was empty (the answer was already counted as not her own).
- Not fixed: delivery to the Sheet cannot be confirmed by the page (the post is no-cors). Plan: after deploy, send one marked row (set `qa-test`, device `qa-claude`) and read it back from Activity. Never send a state row in a test: Now is keyed by lesson and set, so it would overwrite her row.
- Tests: all 16 pass (7 page tests updated to the new route: "practice complete", the check after a wrong answer, earlier ideas recorded first; new `tests/learning-fixes.test.cjs`, 11 checks, which fail on the unfixed copy).
- Screens for Bijit: `tests/shots/review-16-nov/` (10 screens and their words). Open faults seen there: after a wrong whole answer she gets no reply, only "Next"; after a wrong answer to the supported question she is not told it is wrong and gets no worked answer; "Try a new example" opens a question. Nothing deployed; deploy waits for Bijit's yes to the screens.
- Fixed later on 16 Nov (Bijit: "Yes, fix them first"): (1) after a wrong whole answer she now sees "That answer is not right." and what her answer describes (`describe`, authored per page, or the authored reply's "You wrote …°. That is …" sentence); the rule and working stay back for the check. Recorded as `detail.shownBeforeCheck`. (2) A wrong answer to the supported question now shows the worked answer ("The answer is …" and its working), then "We stop this page here for today. Your place is kept." Wording changes from the instruction-language check applied. Tests that asserted no reply after a wrong answer were changed to assert this reply. All 16 test files pass; screens recaptured. Second reader noted: the supported question after the two-triangle lesson ("What is 180 + 180?") can be answered by copying the line above it (catalogue design, not changed).

## Her record

Source: her Sheet "Student 2 – Maths progress record", tab Activity, read 15 Nov 2026 and saved as `data/activity-2026-11-15.csv` (local). Counted by `python tests/count-first-answers.py <that csv>`; a second reader counted the same rows by hand and got the same numbers. Rows on device d-54ufsm are hers. Bijit, 15 Nov: "She has done everything very independently." The Sheet itself has no field for who was there.

A **first answer** is an item on her own that did not come straight after a wrong-answer reply. **After a reply** is the fresh item straight after one. The pages log both as her own; this count keeps them apart. Each cell is right / asked.

| Date | Page (set) | First answers | After a reply | Worked steps |
|---|---|---|---|---|
| 10 Nov | Balance: bags, counters, share | 3 / 4 | 1 / 3 | none logged |
| 11 Nov | Balance: share, check | 2 / 3 | 1 / 2 | none logged |
| 11 Nov | Make a quadrilateral (q1-make) | 8 / 10 | 2 / 2 | 2 / 2 |
| 11 Nov | Decide whether it is a quadrilateral (ki-ge-21) | 11 / 12 | 1 / 1 | 2 / 2 |
| 11 Nov | Diagonals (ki-me-40) | 10 / 12 | 2 / 2 | 2 / 2 |
| 12 Nov | What the 4 angles add up to (ki-ge-23) | 11 / 11 | none | 2 / 2 |
| 12 Nov | Find the missing angle (sk-ge-08) | 6 / 6, page not finished | none | 2 / 2 |
| 13 Nov | An angle from the angle beside it (sk-ge-11) | 12 / 12 | none | 2 / 2 |
| 13 Nov | Angles written with x (sk-ge-09) | 15 / 16 | 1 / 1 | 2 / 2 |
| 15 Nov | Letters and expressions (ki-ag-01) | 9 / 11, saved stop | 2 / 4 | 4 / 6 |
| 15 Nov | Terms (ki-ag-04) | 7 / 12 | 5 / 6 | 4 / 5 |
| 15 Nov | Coefficients (ki-ag-06) | 9 / 10 | 1 / 1 | 3 / 5 |

All first answers: 119 right of 135. The second half of Letters and expressions (ki-ag-03) was not reached.

First answers that were not right (Sheet row, what was asked, her answer):
- 47, 52: make a quadrilateral: a shape with 5 sides; a shape with three points on a line.
- 67: an open shape: "yes, a quadrilateral".
- 87, 93: a diagonal of a dart: MK; how many diagonals a quadrilateral has: 1.
- 172: a worked sum, 185° + 45° + 55° + 95° = 380°: "Yes, they add up to 360°".
- 193: "6 less than a number y": 6 − y. 195: "Can a + 9 be 9?": No.
- 232, 242: "Do 12 − 2y and −2y + 12 have the same value for every y?": No. "Do 9 − 2a and 2a − 9 …?": Yes.
- 236: "How many terms does 4 × a + 4 have?": 3.
- 239, 252, 263: the second term of 14 − 2y: 2y; of 8y − 6: 6; the constant term of 5x − 7: 7.
- 11, 39: balance, 4x + 10 = 6x + 4 (her entry was not stored); "is 5 a solution of 2x + 11 = 3x + 6": "not the same".

What the record cannot show: anything after a gap or in a mixed set (no set has answers on two days, except the balance sets bags, counters and share); whether she read a reply; what she typed on most balance items. She found x in 16 of 17 angle equations though no page teaches solving one. On 15 Nov she typed "5+2" seven times into one box, which the page could not read.

## Live baseline last checked 15 Nov

- Live site: grade8-maths-practice.vercel.app (deployed 11 Nov, b14d43e). Home page: equations-1 (KI-AG-01, 03, "Start here"), equations-2 (KI-AG-04, 06), then quadrilaterals 1 to 7. Pushes do not deploy; a deploy needs Bijit's yes. The deployed baseline is separate from the newer local update; local files must not be described as already live.
- Her Sheet: the Signals tab now exists and holds her 15 Nov rows for ki-ag-01 only. It reads no other page.
- The Now tab has no row for sk-ge-08 or ki-ag-06, and its "held" marks include answers given after a reply. Read her record from the count above, not from Now.

## Known baseline differences, recorded 15 Nov

These describe the pre-update/live baseline. A local repair does not repair production; verify the current local code and delivery record before declaring a point fixed locally.

- The fresh item after a wrong-answer reply is logged as her own and counts towards "holds" (`quad-engine.js`, both equations pages, `Signals.gs:205`). Worked-example steps are logged with own = 1.
- No row holds `supplied` or who was there. The page version is only on the "session start" row.
- After a wrong answer: one reply, one fresh item of the same kind, then a stop after two misses. No check of a part, no teaching. A page reload in the middle of a two-part item drops that item from the page's totals.
- Nine separate pages and two copies of the flow (inline in each equations page; `quad-engine.js`). `?screen=` on an equations page still writes rows to her Sheet.
- Nothing checks a page against the graph. quadrilaterals-7 (SK-GE-09) needs KI-AG-47, KI-AG-11 and KI-AG-20, which no page teaches. q1-make and ki-ge-21 both record KI-GE-21.
- Tests: the seven quadrilateral tests pass (run 15 Nov); they need Playwright from the HTML-TOOL folder. The equations tests are in `study-materials/equations-pages/`, and the equations-1 test fails about 1 run in 3.

## Decided

- Bijit, 15 Nov: her Class 8 book is *Ganita Prakash*. There linear equations are Grade 7 work (Part 2, ch. 7, "Finding the Unknown"); the book says "letter-number" and does not teach "variable", "coefficient" or "constant term" (`plan/research-2026-11-11.md`, local). So equations-1 and equations-2 teach words her book does not use.
- Bijit, 15 Nov: harder work on a skill comes only after she has practised it and it has developed (`CLAUDE.md`, "Knowledge items before skills").
- Bijit, 11 Nov: her screens are built on her own pages' code, not Student 1's engine. Status.gs is not needed. C2 and C3 (page 4: every total is 360°; the 180° rule is written beside her) keep their defaults.
- On 15 Nov Student 1's full structure (STATE.md, CANVAS.md, check.py, one sitting page) was not copied, awaiting three of his unit-1 sittings. The 16 Nov authorisation now adds her own compact canvas and operating contract with shared local helpers; it does not import his learner evidence or full architecture.

## Next teaching and the return sitting

Proposed on 15 Nov, then built locally during the night as `site/return-sitting.html`: a return to quadrilateral work of 11 to 13 Nov, mixing fresh questions before a refresher. No record says she has taken it. Its scope includes:
- the kinds that were not right at the first answer (rows 47, 52, 67, 87, 93, 172), with new shapes and numbers;
- the whole tasks SK-GE-08, SK-GE-11 and SK-GE-09, with no picture where the page had one;
- two or three equations in the form *Ganita Prakash* uses (for example 20 + 2c = 60), to see whether she already solves them.

Why: her “held” marks predominantly rest on same-day blocked practice. A delayed mixed return supplies missing evidence; use fresh items on later returns rather than interpreting remembered answers as generalisation. One right item suggests a provisional next step, not an established skill. Before harder quadrilateral work (such as angles in a ratio), check the relevant knowledge and practise the integrated skill. Equations work starts from demonstrated mathematical capability and the relevant preparation, not a vocabulary score.

The earlier prototype review found evidence contamination from preceding worked replies, answer leakage, a degenerate-shape judge and interface faults. Local repairs and their checks must be reported explicitly; its old 261 software checks did not establish learning or readiness. The 16 Nov update also adds local authored support and shared decisions rather than treating the return page as a complete teaching system. Unfamiliar relevant parts receive teaching and practice, and difficulty does not block eligible unrelated work.

## Authorisation and remaining boundary

Bijit has authorised the rules and local teaching-code update. The earlier “wait for screens before authoring” checkpoint is superseded for this work; show and verify actual screens as part of delivery. Production deployment/live Sheet changes remain separate. Keep the vocabulary pages available under the existing default; local next-practice guidance may direct her from relevant mathematical evidence instead.

## Later (none changes the next sitting)

- Research proposals P1 to P6 (pages) and G1 to G8 (graph), `plan/research-2026-11-11.md` lines 255 to 283. G1 (the sign belongs to the term) bears on rows 239, 252 and 263. G5 names KI-GE-25, which was merged into KI-ME-40.
- Eight graph questions in `knowledge-graph/progress-note.md` lines 17 to 25; item 9 (chapters removed in 2023) should be read again against *Ganita Prakash*.
- A unit plan for equations taken from the graph (KI-AG-18, 19, 20, 24, 47; skills SK-AG-25 to 32) and checked against *Ganita Prakash* Grade 7 and 8. The graph has no skill for solving with the letter on one side.
- Historical Sheet rows lack full support/first-answer conditions; preserve them and interpret their limitations. Shared local evidence is not proof that the live Sheet receiver or historical rows have been migrated.
- The current operating contract now explicitly requires discriminating checks, relevant preparation, targeted teaching and a fresh return to the whole. Student 1's personal evidence and unverified diagnoses remain excluded.
- Uncommitted work outside main: worktree `student-1-ki-experience-88b445` (the joined quadrilateral journey and the fuller `study-materials/quadrilaterals/HANDOVER.md`), `kis-skills-progress-3ba1de` (the approved KI-GE-23 screen), `grade-8-science-books-ed7a85` (science chapter studies), and `Downloads/HTML-TOOL/.claude/worktrees/quizzical-khayyam-ca7f11/student2/` (the spec and build script for the equations pages). Do not remove these worktrees.
- `profile.md` and older source notes may retain historical removed-page links; `README.md` now distinguishes current pages from historical sources.
- Whether the 21 rows of 10 Nov are hers or tests on her device: taken as hers on Bijit's "everything"; not asked row by row.
