# Handover: seven quadrilateral pages (11 Nov 2026)

Branch `claude/funny-gates-6c0b8e` (worktree `.claude/worktrees/funny-gates-6c0b8e`). Deployed to production 11 Nov on Bijit's word (see Status).

## Bijit's decisions, 11 Nov 2026 (this chat)
- Seven experiences, each its own page that records to her Sheet: (1) make a quadrilateral from points, (2) yes/no on near
  misses, (3) draw the diagonals, (4) the 4 angles add up to 360° through 2 triangles, (5) find the fourth angle (SK-GE-08),
  (6) an angle from the angle beside it on a straight line (SK-GE-11), (7) angles written with x (SK-GE-09).
- Agents build the pages (Sonnet); this chat orchestrates. Then "add reviewer agents to decide and then deploy".
- Graph decisions (all three "yes"), NOT yet applied to the graph, which is rebuilt from `knowledge-graph/fragments/`
  (edit the GE fragment, then rerun merge/finalize):
  1. KI-GE-21's statement says the sides do not cross (meet only at their end points).
  2. KI-GE-23 needs KI-GE-66 (instructional route).
  3. SK-GE-08 needs KI-GE-21 directly (required before teaching).
- The SK-GE-08 draft screen was never shown to Bijit before page 5 was built from it.

## What is where
- `site/assets/quad-engine.js`: shared engine (flow, held rule, two-miss stop, review, records, SheetLog, Read it,
  Pause, `?screen=`, `?teacher=1`). `site/assets/quad.css`: shared look.
- `site/quadrilaterals-1.html` ... `-7.html`: each loads `assets/sheet-config.js` + `assets/sheetlog.js` before the engine.
  Sets: q1-make, ki-ge-21, ki-me-40, ki-ge-23, sk-ge-08, sk-ge-11, sk-ge-09. Shared record `student2-ki-v1`.
- `tests/quad-test-lib.cjs` + `tests/quadrilaterals-N.test.cjs`: run on a temp COPY without the Sheet lines, every http(s)
  request blocked. `node tests/quadrilaterals-N.test.cjs`. `tests/review-shots.cjs N` makes reviewer screenshots.
- Briefs: `BUILD-BRIEF-pages-2-7.md`, `REVIEW-BRIEF.md` (second reader from screenshots, then rules; verdict READY/FIX).
- `site/index.html` is NOT changed: another session (finish-equations-pages) is adding the equations pages and the home
  page links on its own branch. The quadrilateral links go in when the branches are merged.

## Status at handover
See the table at the end (updated as reviews come in).

## Before deploying
A deploy from this branch alone publishes `site/` without the other session's equations pages and home page. Merge
that branch first, or ask Bijit. Vercel prod deploys need Bijit's go-ahead (he asked to deploy after the reviews).

## Status
| Page | Built | Test | Review |
|---|---|---|---|
| 1 make | this chat | 474 passed | FIX (5 points with one on a side), fixed |
| 2 near misses | agent | 692 passed | READY |
| 3 diagonals | agent | 528 passed | READY; side/diagonal/neither made random (rule), fixed |
| 4 angle sum 360° | agent | 615 passed | READY (note: every item asking for the total of all four interior angles, or all six triangle angles, has answer 360°. Items finding one angle from its two parts have varying answers. The "possible or not" items require a different response.) |
| 5 fourth angle | agent | 921 passed | READY (built from the unapproved SK-GE-08 draft) |
| 6 angle beside it | agent | 806 passed | FIX (two angles drawn as one arc, invisible tap targets), fixed |
| 7 angles with x | agent | 576 passed | READY; title made plainer |

Deployed to production on Bijit's word ("Production now", 11 Nov) from this branch: the quadrilateral pages are reachable
by URL (/quadrilaterals-1 ... /quadrilaterals-7); the home page has no links yet, and the equations session's pages are
not in this deploy. Next deploy must come from the merged branches.

## 11 Nov, later: committed (6a30629) and deployed to production on Bijit's "please push and deploy"
- Page 4 teacher comment and teacher string (`?teacher=1`) now name KI-GE-66 (an interior diagonal divides a
  quadrilateral into two triangles) and KI-GE-22 (triangle angle sum); the old text gave KI-GE-66 the triangle's
  meaning. Nothing she sees changed; test 615 passed. `site/knowledge-graph.html` carries the three graph decisions and
  the KI-GE-66 repair. The supported item's support column now says the 180° rule was written for her (`supSupport`). Live as
  deployment dpl_DtzUbNj2NWwEeWsabrJVSqZGbjJH. Review: ChatGPT bridge request cd28102b.
