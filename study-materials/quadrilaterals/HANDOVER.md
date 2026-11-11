# Handover: quadrilaterals, the first three knowledge items (11 Nov 2026)

Written at 217k tokens (the limit is 150k). The next chat starts here. Branch `claude/student-1-ki-experience-88b445`
(worktree `.claude/worktrees/student-1-ki-experience-88b445`). Nothing is committed, deployed or recorded.

## Bijit's request
11 Nov: "look at student 1 and build KI like that, verify the KIs, the skills and then start building the experience",
then "list all skills and KIs of equations and quadrilaterals", then "yes, lets build for three initial KIs of quadrilaterals".

## The three items (Student 2 graph, `knowledge-graph/graph-data.json`, 24 Oct 2026; statements word for word)
1. **KI-GE-21**, Concept: "A quadrilateral is a closed figure in a plane bounded by four line segments, and it has four
   sides, four vertices and four angles." No item before it.
2. **KI-ME-40**, Fact or term: "A diagonal of a polygon is a line segment that joins two vertices that are not next to
   each other." Needs KI-GE-21.
3. **KI-GE-23**, Principle: "The four angles of a quadrilateral add up to 360°." Needs KI-GE-21 (necessity) and KI-GE-22,
   triangle angle sum (instructional route). The first skill is SK-GE-08 (find the fourth angle from three).

Framework row 15 (as applied in Student 1, `integers-plan/items-to-skill.md`): 21 and ME-40 come before teaching, as
short stops; 23 is a principle, so it is taught inside the SK-GE-08 task, not as its own page.

Graph findings, for Bijit to decide (not changed):
- KI-GE-21 is needed directly by no skill, only through other items.
- KI-GE-23's reason (a diagonal makes two triangles, 180° + 180°) is KI-GE-66, but KI-GE-23 does not link to KI-GE-66 or
  KI-ME-40. Suggested link: KI-GE-23 needs KI-GE-66 (instructional route).
- KI-GE-21 does not exclude a shape whose sides cross. The screen does (NCERT: a polygon is a simple closed curve).

## Built: ONE screen. Bijit approved it on 11 Nov ("Yes, this screen")
`study-materials/quadrilaterals/ki-ge-21-screen.html` (local prototype, records nothing). Student 1 layout (picture left,
text right). Five points; she taps 4 of them in turn and taps the first again to close the shape. Each side is drawn and
named as she makes it (the letters follow her taps). Nothing is judged until "My shape is finished". Replies describe what
she made: not closed (and how many sides), 3 or 5 sides, sides crossing, or right (sides, vertices and angles named, with
arcs drawn). Her next tap starts the step again. Checked at 1100 px and 375 px: no errors, no sideways scroll.
Screenshot script: scratchpad `shot.cjs` (Playwright from HTML-TOOL/agentic-generator/node_modules).

Wording check (instruction-language), changed: the title "Quadrilaterals" became "Make a quadrilateral from 4 points"
(a title says what she does); "Its sides meet only at its corners" was added to the opening line, because the reply about
crossing sides relied on a rule she had not been told; "vertices" is now explained by "Its 4 corners ... are its
vertices"; the reply about an open shape now says "straight sides", as the others do.

## Next (only after Bijit has seen the screen)
- Test of KI-GE-21 with near misses, one after another: shapes she judges with "Yes, it is a quadrilateral" or "No". The
  order defeats "it looks like a square" and "4 corners is enough": a concave quadrilateral (yes), 4 points joined but not
  closed (no), a triangle (no), 4 sides with one curved (no), a tilted kite (yes), a pentagon (no). A fresh shape follows a
  wrong answer.
- KI-ME-40: she draws a diagonal by joining two vertices; a side is the near miss.
- SK-GE-08 with KI-GE-23 inside it: she drags one vertex, the four angles are written beside the shape and the sum stays
  360° on every row (the numbers that remain the same, as in Student 1's ladder); she predicts the fourth angle before it
  is shown; then a question with no picture.
- Then: record to her Sheet (`site/assets/sheetlog.js`) and the shared store `student2-ki-v1`.

## Second reader (screenshots only, 11 Nov): open findings, not fixed
It read the screen as "tap 4 of 5 points, close, press finished" and the mathematics as "closed, 4 straight sides, sides
meet only at corners, named by vertices, sides and angles". Its findings:
- With 5 points, any 4 that do not cross work, so the building step tests little. The near-miss test is what has to do it.
- She may tap 4 points and press the button without closing. The page handles this (the "not closed" reply) but no
  screenshot showed it.
- Vertices and angles are told in the right reply, not done. She does nothing with them yet.
- Crossing sides are shown dashed, and the side labels sit on the dashes and are hard to read. The faint side labels are
  low in contrast.
- After a right shape, "My shape is finished" still shows under the new task. It is unclear what it does there.

## Built 11 Nov (second chat): the near-miss test screen. Bijit approved it on 11 Nov ("Yes, this screen")
`ki-ge-21-near-miss-screen.html` (local prototype, records nothing); sample picture `ki-ge-21-near-miss-samples.png`.
She judges one lettered shape at a time with "Yes, it is a quadrilateral" / "No, it is not a quadrilateral". Order: concave
dart (yes), open square-like ABCD (no), triangle (no), square-like ABCD with DA curved (no), tilted kite (yes), house
pentagon (no). After any answer the straight sides are numbered on the shape, a curved side is coloured, the two loose
ends of an open shape are ringed, and the reply says closed or not, how many straight sides, which side is curved. Wrong:
"Your answer was yes/no, but ..." then "Show a different shape" gives a fresh shape of the same kind (second set: concave
at C, tilted open, other triangle, rhombus with BC curved, tilted trapezium, square with a cut corner). Wrong again: the
reply plus "We stop here for today. Your place is kept. Next time, you start with new shapes." Checked at 1100 and 375 px:
no errors, no sideways scroll. Screenshot script: scratchpad `shot2.cjs` (run with NODE_PATH=HTML-TOOL/agentic-generator/node_modules).

Second reader (screenshots only) and what was done: right replies now open "Yes, ABCD is a quadrilateral." / "No, ...";
the rings and the curved side are named in the reply; the curved side is solid, not dashed; rings made smaller.
Kept as it is (approved without changing these): (1) no crossed-sides shape, so "sides meet only at its corners" is not tested; (2) the fresh shape after a
wrong answer has the same answer as the reply just gave, so it is a helped answer, not evidence (as CLAUDE.md counts it);
(3) "always no" scores 4 of 6; (4) the stop screen has no button (a saved stop by design).
The three graph decisions above are still open (asked 11 Nov, not answered). Next: KI-ME-40, the diagonal screen.

## Built 11 Nov (second chat): KI-ME-40 diagonal screen, NOT yet seen by Bijit
`ki-me-40-screen.html` (local prototype, records nothing); sample picture `ki-me-40-samples.png`; script scratchpad `shot40.cjs`.
She taps one vertex, then another; the line and its name (in her tap order) appear. Judged only at "My line is finished".
Three quadrilaterals, both diagonals each: plain ABCD, tilted kite, dart whose diagonal AC lies outside the shape. Replies:
a side ("A and B are next to each other, so AB is a side of ABCD, not a diagonal"), the same diagonal again ("CA is the same
line segment as AC ..."), right ("A and C are not next to each other, so AC is a diagonal of ABCD"; dart adds "AC lies
outside the shape, and it is still a diagonal"). Two wrong in a row: both diagonals shown, saved stop.
Second reader (screenshots only), fixed: "next to each other" now defined by the sides; reply placed above the next task;
her wrong line stays solid over a side; tap targets about 47 px on a phone; no double name on a repeated diagonal; the
worked answer shows both diagonals. Open for Bijit: (1) every shape is ABCD, so "join letters two apart" always works
(true of any quadrilateral named in order, but it skips the picture); (2) the second diagonal can be found by elimination;
(3) she can only join vertices, so "any line across the shape" cannot be tried.
