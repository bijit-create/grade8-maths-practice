# Review brief: one quadrilateral page (11 Nov 2026)

You review ONE learner page for Student 2, a Grade 8 CBSE girl who works alone (no adult beside her). You decide whether
it is ready to go live. You change no file except your own screenshots and report.

## Part A: second reader (do this BEFORE reading any source, brief or rules)
1. Make screenshots: run `node "<worktree>/tests/review-shots.cjs" <N>`. It writes PNGs of every worked example, the
   supported item, every kind of own item, one wrong reply and one right reply, at 1100 px and 375 px, into
   `tests/shots/review-qN/`. It loads a copy of the page without the Sheet scripts, so nothing is sent anywhere.
2. Look only at the PNGs. Write down: what each screen asks her to do; what mathematics the page teaches; anything
   you could not read, could not tell how to do, or that looks wrong (overlap, cut-off text, unreadable labels).

## Part B: judge against the rules
Now read `CLAUDE.md`, the page section of `study-materials/quadrilaterals/BUILD-BRIEF-pages-2-7.md` (page 1 has no
section: its comment block says what it is), and the page source `site/quadrilaterals-N.html`. Check:
- The mathematics is right in every item, worked example and reply (solve a few items yourself from the screenshots).
- The question, the picture and the answer box refer to the same quantity. Each picture has a job she does.
- Nothing is judged while she acts; a wrong reply says what her answer describes and does not praise unshown parts.
- The set defeats the shortcut it names (would "always no", "join letters two apart", "add the three numbers" score well?).
- Words: plain full sentences, questions name the quantity and end with ?, no ids/teacher words/counts on her screen,
  no colon fragments, no "move" as a noun. Use the `instruction-language` skill.
- Run `node tests/quadrilaterals-N.test.cjs` and report its last line.

## Verdict (under 250 words)
First line exactly `READY` or `FIX`. Then the second reader's one-paragraph reading. Then, if FIX, a numbered list of
must-fix items (each: where, what is wrong, a concrete change). Separate "would be better" items in a short second list.
Only list as must-fix what would confuse her, teach wrong mathematics, judge her wrongly, or break the rules.
