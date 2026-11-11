# Build brief: quadrilateral experiences 2 to 7 (11 Nov 2026)

Bijit chose seven experiences on 11 Nov 2026, each its own page that records to Student 2's Google Sheet.
Experience 1 is built: `site/quadrilaterals-1.html` (passes `node tests/quadrilaterals-1.test.cjs`). **It is your model.
Copy its shell and conventions exactly.**

## Read first (in this worktree)
1. `CLAUDE.md`: the rules for her screens. Above all: no adult beside her; a picture has a job she does; nothing is
   judged while she acts, only when she presses the decision button; a wrong answer gets a reply that says what her
   answer describes; no ids, teacher words or counts on her screen.
2. `site/assets/quad-engine.js`: read the header. It gives the flow (worked examples, supported item, her own items
   until the item holds, two misses in a row end the day), the records, Read it, Pause and `?screen=` samples.
   **Do not edit the engine, `quad.css`, `quad-test-lib.cjs` or any other page.** If you need something the engine lacks,
   do it inside your page, and say so in your report.
3. `site/quadrilaterals-1.html` and `tests/quadrilaterals-1.test.cjs`.
4. The approved prototype screens in `study-materials/quadrilaterals/` named in your section. Approved wording is kept.

## What every page must have
- The same shell as page 1: `<link rel="stylesheet" href="assets/quad.css">`, the top bar with Read it and Pause, the
  `#teacher`, `#pic`, `#words`, `#acts`, `#pauseOv` elements, and **exactly this line before the engine and page script**:
  `<script src="assets/sheet-config.js"></script><script src="assets/sheetlog.js"></script>`
- A comment block at the top: the item or skill, its statement, the teacher name with the rule in symbols, the kinds,
  and the shortcut the set defeats (which kinds defeat it).
- `QE.start({...})` with a unique `set`, 2 worked examples (each ends in one step she completes), one supported item,
  at least 4 kinds of own item, an authored `plan` of 10 to 12 items that mixes the kinds in an unpredictable order,
  and 2 to 4 `contrasts` (items that defeat the shortcut).
- Every task calls `ctx.done({right, answer, eq, tag, reply})` exactly once and registers
  `ctx.auto({right(){...}, wrongs:[{expect, fn(){...}}]})`: `right` gives the right answer through the same functions
  her taps, drags and clicks call, and each wrong gives one planned wrong answer whose reply contains `expect`.
  Give at least 2 planned wrongs per own kind, taken from the real likely errors.
- Fresh numbers and shapes each time from `ctx.rng/int/pick` (so `?seed=` repeats them).
- Number answers: `ctx.numberBox("Your answer in degrees", fn)`. An answer that is not a whole number gets `ctx.note(...)`,
  never a wrong mark.
- Pictures in a 420 by 380 viewBox. Tap targets: a transparent circle `class="hit"` of radius 30 or more.
  Draggable vertices: pointer events on the SVG plus arrow keys; 44 px buttons.
- Her actions are ignored once `ctx.open` is false.

## Words (check every string with the `instruction-language` skill before you finish)
Plain sentences that keep the actor, the action and the quantity. Questions end with ? and name the quantity in full
("How many degrees is ∠D?"). No colon fragments ("Answer: 5"), no "move" as a noun, no em dash, no words "count",
"level", "skill", "contrast", "kind", "supported", "teacher". Wrong replies start "You wrote 280°." or "Your answer was
no, but ..." and then say what her answer describes. Right replies say why it is right. Use ∠A, ° and the minus sign −.

## Test
Write `tests/quadrilaterals-N.test.cjs` like page 1's: `require("./quad-test-lib.cjs").run({page, phoneShots, extra})`.
In `extra`, drive at least one item with **real** pointer clicks or drags on the picture (`p.locator(...).click()`,
`p.mouse`), and check anything special to your page. Run `node tests/quadrilaterals-N.test.cjs` until it ends
`0 failed`. The library tests a copy of the page without the Sheet lines, so nothing reaches the real Sheet.
**Never open the page itself in a browser with the Sheet lines in place** (it would post to her live Sheet): for
screenshots use the copy approach or a SheetLog stub plus blocking every http(s) request, as the test library does.
Then take 3 desktop screenshots (a worked example, an own item with a wrong reply, one with a right reply) into
`tests/shots/qN/` and look at them; fix anything overlapping or unreadable.

## Report back (short)
Files written; test result line; the kinds, plan and contrasts; the wording changes the instruction-language check made;
anything you could not do or decided yourself that Bijit should know. Do not commit. Do not deploy.

---

## Page 2: `site/quadrilaterals-2.html`, set `ki-ge-21`, title "Decide whether each shape is a quadrilateral"
KI-GE-21, tested with near misses. Source: approved `ki-ge-21-near-miss-screen.html` (keep its shapes, its marks after an
answer: straight sides numbered, curved side coloured, loose ends ringed, and its reply wording). Yes/No answers with the
two buttons "Yes, it is a quadrilateral" / "No, it is not a quadrilateral" (`ctx.choices`).
New, decided by Bijit 11 Nov: **sides that cross** is now part of KI-GE-21, so add a crossed (bow-tie) 4-sided shape,
answer no, reply naming the two crossing sides.
Kinds: concave (yes), kite or tilted shape with unequal sides (yes), irregular quadrilateral (yes), open (no),
triangle (no), curved side (no), pentagon (no), crossed (no). Fresh shapes: rotate, stretch and jitter templates.
Shortcuts: "it must look like a square" and "4 corners is enough", and "always answer no": keep yes and no about equal in
the plan. Contrasts: "a corner points in", "tilted with unequal sides", "one side curved", "sides cross".
Worked examples: W1 a tilted quadrilateral explained (closed, 4 straight sides numbered, sides meet only at corners), her
step is Yes/No on it; W2 a near miss with a curved side explained, her step is Yes/No on a fresh curved one.

## Page 3: `site/quadrilaterals-3.html`, set `ki-me-40`, title "Draw the diagonals of a quadrilateral"
KI-ME-40: a diagonal joins two vertices that are not next to each other. Source: approved `ki-me-40-screen.html` (tap one
vertex then another; the line and its name appear in her tap order; judged at "My line is finished"; "Start this line
again" under the picture; keep its replies). One item = one line.
Open point to fix: every shape was ABCD with A at the top left, so "join letters two apart" works without looking. Use
different letter sets (PQRS, KLMN, WXYZ) and start the lettering at a different corner each time.
Kinds: first diagonal of a convex shape; the other diagonal (the first one already drawn and named); dart where the
diagonal lies outside the shape; "side or diagonal?" choice on a drawn line (half sides, half diagonals); how many
diagonals a quadrilateral has (choice 1, 2, 4), only once in the plan. Contrasts: "diagonal outside the shape",
"a side is not a diagonal" (the choice item where the drawn line is a side), "the same diagonal named the other way"
(planned wrong: drawing CA after AC).

## Page 4: `site/quadrilaterals-4.html`, set `ki-ge-23`, title "Find out what the 4 angles of a quadrilateral add up to"
KI-GE-23: the four angles of a quadrilateral add up to 360°. Bijit decided 11 Nov that it is taught through KI-GE-66: a
diagonal cuts the quadrilateral into 2 triangles, and the angles of each triangle add up to 180°, so 180° + 180° = 360°.
Source for the dragging and angle labels: `sk-ge-08-screen.html` part 1 (drag a vertex, the 4 angles are measured, whole
degrees that always add to 360 by largest remainder, written at the vertices while she drags; keep only convex shapes
there).
W1: ABCD with diagonal AC drawn; triangle ABC and triangle ACD shaded differently; each triangle's 3 angles written; the
angle at A is made of 2 parts and so is the angle at C. Her step: she types what the 6 angles add up to (360).
W2: she drags a vertex; the angles change; she adds a row to a small table for 3 different shapes (`ctx.picBelow`);
her step: what the 4 angles add up to in every row (360). Planned wrong replies as in `sk-ge-08-screen.html` checkSum.
Own kinds (decide the exact items; each needs a picture job or a reason): "two triangles" (6 triangle angles shown, she
finds ∠A from its 2 parts, or the sum); "after a drag" (she drags a vertex, then says what the sum is now);
"possible or not" (Yes/No: can a quadrilateral have angles 100°, 100°, 100°, 100°? replies give the sum); "corner points
in" (a concave shape with a reflex angle such as 210°, the sum is still 360°); "rectangle" (4 right angles, 4 × 90°).
Contrasts: "corner points in", "four angles that cannot be", "shape changes, sum does not".

## Page 5: `site/quadrilaterals-5.html`, set `sk-ge-08`, title "Find the missing angle of a quadrilateral"
SK-GE-08: find the fourth angle from the other three. Rule: ∠D = 360° − (∠A + ∠B + ∠C). Source: `sk-ge-08-screen.html`
parts 2 and 3 (picture with 3 angles shown and one "?", the hidden vertex varies; then no picture, PQRS). This draft has
NOT been approved by Bijit; keep it as close to the draft as possible and note every change.
W1: worked fully (three angles added, taken from 360°), her step is the last subtraction. W2: hidden angle at a different
vertex, her step is the whole answer with the working lines on screen.
Kinds: picture, hidden at A/B/C/D; "looks like a right angle" (hidden angle 91° or 89° on a nearly rectangular shape);
reflex (a concave shape whose hidden angle is more than 180°); no picture (text only, letters vary).
Planned wrongs: the sum of the three (reply says it is ∠A + ∠B + ∠C); 180° minus the sum or a triangle rule; 90° on the
"looks like" item ("It looks like a right angle, but ..."); an arithmetic slip of 10.
Contrasts: "looks like a right angle", "hidden angle not at D", "angle more than 180°", "no picture".

## Page 6: `site/quadrilaterals-6.html`, set `sk-ge-11`, title "Find an angle of a quadrilateral from the angle beside it"
SK-GE-11: find an interior angle from the angle that makes a straight line with it at the same vertex. Rule:
∠ABC = 180° − exterior angle. Picture: a quadrilateral with one side extended past a vertex as a straight line (draw
the extension dashed, with a point E on it), the outside angle written, the inside angle "?".
A picture job: before typing, she taps which of two marked angles at that vertex is the angle of the quadrilateral
(inside), or the item asks her to drag the extension line? Choose the simplest job that makes her look at the vertex,
and keep it on every item at first, faded later in the plan.
W1: worked (angles on a straight line add up to 180°, so the inside angle is 180° − 110° = 70°), her step is the
subtraction. W2: worked two-step: the inside angle from the outside one, then the fourth angle from 360°.
Kinds: inside from outside (outside more than 90°); inside from outside (outside less than 90°); two-step (one of the
three known angles is given as an outside angle, find the fourth angle); which angle is it (choice).
Planned wrongs: she types the outside angle itself; 360° − outside; in the two-step, she uses the outside angle in the
sum. Contrasts: "outside angle less than 90°", "two steps", "outside angle at a different vertex".

## Page 7: `site/quadrilaterals-7.html`, set `sk-ge-09`, title "Find the angles of a quadrilateral written with x"
SK-GE-09: find the angles of a quadrilateral from angles given as expressions in x. She has worked on linear equations
(equations pages). Picture: a quadrilateral with expressions at its vertices (x, 2x, 3x, 4x; or x + 10°, x − 20°, 2x, x).
W1: worked (x + 2x + 3x + 4x = 360°, so 10x = 360°, x = 36°, the angles are 36°, 72°, 108°, 144°), her step is x.
W2: worked with constant terms, her step is one angle, the largest.
Kinds: choose the equation (choice of 3: the right one, one with 180°, one missing a term); find x; find one named angle
(not x: the angle 3x); constant terms; check (the 4 angles she found add up to 360°: yes/no on a worked answer with a
slip). Planned wrongs: x given when an angle was asked (reply: that is x; the angle is 3x, which is ...); equation with
180°; dropped constant term. Contrasts: "x is not the angle", "constant terms", "a worked answer with a slip".
Whole numbers only: choose x so every angle is a whole number of degrees and every angle is between 20° and 200°
(at most one above 180°, and then the shape is concave: draw it so).
