# Handover: Student 2 (15 Nov 2026)

Keep this file short (CLAUDE.md step 6). Replace a section when it is settled; do not stack new sections above old ones. The 11 Nov text of this file is in git (7899894). Written 15 Nov 2026 from her Sheet, the code on main and Bijit's answers of that day.

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

## What she meets now

- Live site: grade8-maths-practice.vercel.app (deployed 11 Nov, b14d43e). Home page: equations-1 (KI-AG-01, 03, "Start here"), equations-2 (KI-AG-04, 06), then quadrilaterals 1 to 7. Pushes do not deploy; a deploy needs Bijit's yes. `site/` on main is what is live.
- Her Sheet: the Signals tab now exists and holds her 15 Nov rows for ki-ag-01 only. It reads no other page.
- The Now tab has no row for sk-ge-08 or ki-ag-06, and its "held" marks include answers given after a reply. Read her record from the count above, not from Now.

## Where the pages differ from CLAUDE.md (known; changing one is a build)

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
- Student 1's 15 Nov structure (STATE.md, CANVAS.md, check.py, one sitting page) is not copied here. His own file says she follows "when unit 1 has run three sittings", and none has run.

## The next sitting, and why

Proposed, not built: one return sitting on the quadrilateral work of 11 to 13 Nov. About 12 first answers, no teaching before them, mixed in an order she cannot predict:
- the kinds that were not right at the first answer (rows 47, 52, 67, 87, 93, 172), with new shapes and numbers;
- the whole tasks SK-GE-08, SK-GE-11 and SK-GE-09, with no picture where the page had one;
- two or three equations in the form *Ganita Prakash* uses (for example 20 + 2c = 60), to see whether she already solves them.

Why: every "held" mark she has rests on one day. This is the first check after a gap and the first mixed set, and it can be asked again unchanged on a later day. What it decides: if the first answers are right, the quadrilateral work steps up (SK-GE-10, angles in a ratio; the exercises of *Ganita Prakash* 8, ch. 4), and the equations work starts from what she showed, not from the vocabulary pages. If not, the kind that was not right is taught before anything harder.

Route: a local prototype on `quad-engine.js`, played, a second reader on the screens, then Bijit's yes to the screens (CLAUDE.md, "Route for a new screen").

## Waiting for Bijit (two places)

1. His yes to the return sitting's screens, when they are shown.
2. Whether equations-1 and equations-2 stay on her home page as "Start here", now that her book does not use their words. Default until he says: they stay live, and no new work is built on them.

## Later (none changes the next sitting)

- Research proposals P1 to P6 (pages) and G1 to G8 (graph), `plan/research-2026-11-11.md` lines 255 to 283. G1 (the sign belongs to the term) bears on rows 239, 252 and 263. G5 names KI-GE-25, which was merged into KI-ME-40.
- Eight graph questions in `knowledge-graph/progress-note.md` lines 17 to 25; item 9 (chapters removed in 2023) should be read again against *Ganita Prakash*.
- A unit plan for equations taken from the graph (KI-AG-18, 19, 20, 24, 47; skills SK-AG-25 to 32) and checked against *Ganita Prakash* Grade 7 and 8. The graph has no skill for solving with the letter on one side.
- Logging first answer / after a reply, `supplied` and the page version on every row: do it in the return-sitting page first, then in the nine pages.
- Bijit's 13 Nov rule for Student 1 (after a failure, fall back down the requires chain to success, teach, then check) is in a memory note only; whether it is hers too has not been asked.
- Uncommitted work outside main: worktree `student-1-ki-experience-88b445` (the joined quadrilateral journey and the fuller `study-materials/quadrilaterals/HANDOVER.md`), `kis-skills-progress-3ba1de` (the approved KI-GE-23 screen), `grade-8-science-books-ed7a85` (science chapter studies), and `Downloads/HTML-TOOL/.claude/worktrees/quizzical-khayyam-ca7f11/student2/` (the spec and build script for the equations pages). Do not remove these worktrees.
- `README.md` lines 15, 18, 23 and 25 and `profile.md` line 22 still name pages that were removed on 11 Nov.
- Whether the 21 rows of 10 Nov are hers or tests on her device: taken as hers on Bijit's "everything"; not asked row by row.
