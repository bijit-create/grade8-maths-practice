# Handover: Student 2 (11 Nov 2026)

Keep this file short (CLAUDE.md step 6). Replace a section when it is settled; do not stack new sections above old ones.

## What she meets now

Facts from git, 11 Nov 2026 (commit e400dd2); check the code before relying on them.
- Home page (`site/index.html`) starts her on `equations-1.html` (KI-AG-01, KI-AG-03) and `equations-2.html` (KI-AG-04, KI-AG-06), built in HTML-TOOL, logging to her Sheet. The balance page (`balance-equations.html`) is off the home page as rejected; its file stays.
- Her Sheet: `apps-script/Code.gs` (receiver) and `Signals.gs` (the Signals tab). No Status.gs.
- Live site: grade8-maths-practice.vercel.app. Pushes do not deploy; prod deploys need Bijit's yes.
- Not reconciled here: memory notes from 11 Nov also record quadrilateral pages going live and the bags-and-counters KI-AG-01/03 page being dropped. Which pages she is meant to use is a question for Bijit.

## Her record

None yet. `profile.md` (local) is mostly blank.

## 11 Nov 2026: Student 1's 10–11 Nov work brought in (rules, research, code). Not committed.

- `CLAUDE.md`: six steps; which document governs; `supplied` and "helped" in the record; what a knowledge item is and the moment test; show, predict, fade with practice after modelling; decisions rest on researched knowledge (lever points); the route for a new screen.
- `charter.md` (new): Student 1's goals, for her, without his evidence.
- `research-from-student-1/` (local): his 11 Nov research with a status note on each file and the ChatGPT method in `README.md`.
- `templates-from-student-1/2026-11-11/` (local): his journey engine, ladder, tests and Sheet scripts, keys switched to student2. `PORTING-NOTE.md` says what moving the balance page onto it would take.
- These two local folders were written in this worktree (`.claude/worktrees/peaceful-villani-833f1f`), not the main checkout, and git does not carry them. Move them into the main checkout before the worktree is removed.

## 11 Nov 2026 (evening): ChatGPT's Student 2 handoff checked and repairs applied. Deployed.

On Bijit's "please push and deploy", everything below went into branch `claude/funny-gates-6c0b8e` as commit 6a30629 (pushed). Production deployment dpl_DtzUbNj2NWwEeWsabrJVSqZGbjJH is READY on grade8-maths-practice.vercel.app; the live page 4, engine and graph page were checked. The main checkout holds the same graph and `site/knowledge-graph.html` edits, uncommitted, beside other sessions' uncommitted work (CLAUDE.md, charter, science-books). They agree with the branch until it is merged into main.

Sources: bridge request e29fba0a (ChatGPT's handoff, 09:19) and cd28102b (Claude's audit of it, 15:47; P2, P3 accepted, P1, P4–P7 corrected; each correction checked before use). Backups in the session scratchpad `backup-2026-11-11/`.
- Graph (`knowledge-graph/`: `fragments/GE.json`, `merged-raw.json`, `graph-data.json`, `vault/`, `graph-page.html`; and `site/knowledge-graph.html` in main and in worktree funny-gates): Bijit's three decisions applied. KI-GE-21 now excludes crossed sides, touching opposite sides and three vertices in a line. KI-GE-23 requires KI-GE-66 (instructional route). SK-GE-08 requires KI-GE-21. KI-GE-66 corrected; the old statement was false for a concave shape: "Every quadrilateral has at least one diagonal that lies inside it apart from its end points, and that diagonal divides the quadrilateral into two triangles." The vault note for KI-GE-66 was renamed to match, with its links. The patched `merged-raw.json` matches a fresh `merge.py` run. `finalize.py` was not rerun, because it rewrites the whole file. The published graph artifact was not republished.
- Page 4 (worktree funny-gates, `site/quadrilaterals-4.html`): the teacher comment and `?teacher=1` string now name KI-GE-66 and KI-GE-22 correctly. Nothing she sees changed. Test: 615 passed, 0 failed.
- `HANDOVER-7-pages.md`: "Nothing deployed" corrected, and the page 4 note made exact. `HANDOVER-sk-ge-08.md` (worktree kis-skills-progress): the approved prototype's two faults recorded. The prototype itself was not edited.
- Already settled: the daily cap of 8, with up to 10 after a modelling run, is in `CLAUDE.md`.

Bijit took all three defaults ("Yes, take them", 11 Nov). Done locally, not deployed: C1 is recorded in `profile.md`. C2 and C3 are noted in page 4's header comment. The supported item's `support` column now says the 180° rule was written for her. This uses an optional `supSupport` field in `quad-engine.js`; the other six pages keep "worked lines on screen". To revise on her evidence:
- C1. Which topic she starts on: equations, quadrilaterals, or both in a set order. [Keep equations as the recorded focus until he changes it.]- C2. Every total on page 4 is 360°. [Keep page 4 as supported practice and read its totals as limited evidence. Propose a triangle-against-quadrilateral contrast through the new-screen route if independent attainment is needed.]
- C3. The triangle angle sum (KI-GE-22) is written beside her on page 4. [Keep it supplied and record it as supplied. Add a short teach-and-check if her answers show trouble using 180°.]

## Open, for Bijit

- Decided (Bijit, 11 Nov evening, "own page code"): her next screens are built on her own pages' code (`site/assets/quad-engine.js` and the equations pages), not Student 1's engine. So `student2-ki-v1` keeps her pages' shape `{ki,res[],passed,stage}`; his engine's `{res,passed}` shape is not used for her.
- 11 Nov evening, Bijit: "yes please do all" to the open list. Three sessions were started from the session that did the ChatGPT review: (1) git housekeeping on main, (2) her Sheet (Signals.gs; whether Status.gs is needed), (3) research (NCERT check of the quadrilateral and equations items, what the balance models).
- Whether her Sheet gets Status.gs (his stage and "helped" logic) beside Signals.gs.
- Her topic's structure (what the balance models and does not) has not been researched; his research does not cover it.
