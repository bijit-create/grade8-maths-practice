# Student 2: design for independent learning

Student 2 is one Grade 8 CBSE learner (NCERT textbook; outcomes M801 to M820 in `knowledge-graph/`). Read `profile.md` before designing anything. It is still mostly blank: there is no record of her work yet. No adult will sit with her (Bijit, 9 Nov 2026). Her answers are to go to a Google Sheet, as Student 1's do.

These rules are copied from Student 1's `CLAUDE.md` (7 to 9 Nov 2026), where Bijit set them after many rounds of correction. They are written for Student 2 here. Student 1's evidence (his answers, dates, counts) is not hers. Where a rule rested on his record, it is kept as a starting design choice and marked "provisional", to be revised from her own record.

Design so that she can learn without an adult beside her. Every essential path (instructions, feedback, help, pause and resume, paper submission) must work without one. The goal is connected knowledge and increasingly capable, retained, independent performance, including written mathematics.

## Start with the smallest complete lesson

- Show the actual child-facing words, picture, response and wrong-answer feedback before proposing architecture. A framework or stage list is not a learner experience.
- Choose one bounded, worthwhile complete performance and keep its mathematical meaning intact. Related problems, new contexts and harder combinations follow later.
- Use the seven success dimensions (meaning, execution, selection, integration, retention, transfer, independence; `templates-from-student-1/2026-11-09/charter.md`) as evaluation questions, not as seven modules or gates. One task may supply several kinds of evidence.
- Prefer an authored sequence with usable help and correction over a general adaptive system. Reuse existing controls and records. Add a component only for a named limitation of the simpler design, and say what evidence justifies it. Apply the `right-size` skill to every design, build and review.

## Teach the mathematics clearly

- Make the question, the equation and the answer box refer to the same quantity. Teach any new picture convention; do not assume it is familiar.
- Include explanation, her practice, useful correction and a fresh independent chance. Return to the complete performance after a gap. Counts and schedules are provisional design choices, not mastery thresholds.
- When a response or a photo of paper work cannot be read, say so honestly. Do not silently require Bijit to mark, watch or step in.

## Read evidence honestly

- Keep responses with their conditions. Keep first attempts, helped answers and later independent work apart. A wrong answer suggests possibilities; it does not establish a misconception.
- Do not treat a fast answer, or an answer that matches a number on the screen, as proof of disengagement, and do not discard it or demote her for it. Elapsed time is not evidence of attention or struggle.
- Record only what judges the teaching: the item, the support given, the response, the reply and retry, and later fresh or delayed performance.

## Her actions and the route through difficulty

- Give every picture a job she performs: predict the next state, make a change, place a value. Watching is not evidence. Keep words next to the marks they describe and change help in place.
- After a wrong answer on a whole task, say what her answer describes when that can be told, and leave the remaining decision to her. Do not praise a part her answer has not shown.
- A wrong answer points to a part to check. Check that part with one short item. Probes may chain inside the branch for her wrong answer, one short item per part, moving on only while each check is right. The chain stops at the first part that is not right; that part gets its teaching and one fresh check. At every stage a wrong answer gets one targeted explanation and one matched fresh example. If that is still not right, show the worked answer and offer a saved stop. A saved stop never waits on an adult: the next session brings new examples.
- Follow repair with fresh whole tasks whose answers differ.

## Manipulatives

A manipulative is something she moves. Student 1's thermometer (`templates-from-student-1/2026-11-09/thermometer-to-numbers.html`) is the reference for how one behaves.

- She moves the object itself (drag, or controls of at least 44 px beside the object that travel with it; keys work too). Moving happens only at the picture.
- Draw her action while she makes it, and when she finishes, write its mathematics beside it. The action and the equation are never in two places.
- Judge nothing while she moves. The check comes only when she says the step is done, with a button in the text column. A wrong step gets a reply describing what she did and goes back to the start of that step.
- Each kind of manipulation is a mathematical operation, and each result is written as mathematics beside it.
- Practise one kind until it holds before the next. Progress goes in stages, not by a count: right with support → right on a fresh item with less guidance → right on her own across the contrast cases that defeat the shortcut → choosing correctly in a mixed set → right after a gap. A right answer after a reply counts as help. At most 8 items of one kind a day; start each session with one item of every kind already passed (provisional).
- Keep one plain manipulative and fade it: the picture → the picture beside the written lines → the written lines alone (the picture only on request, recorded as supplied) → paper. Guided tasks first, then open ones where she makes her own example.
- Her screen shows only the picture, the problem, one question, the decision button and the reply. Practice names, rules, progress and design notes go where she does not see them.

## Knowledge items before skills, success first

- A journey does not open with a whole task she may fail. Order: (1) a warm-up of the knowledge items her dated record already shows, each done as an action; (2) for each item not shown, a worked example, one item straight after it (recorded as supported), then fresh items on her own until it holds; (3) practice of the skill, from whole tasks with steps prompted to whole tasks without prompts, then contrast cases and a mixed set; (4) a return after a gap with a fresh whole task and no help; then paper.
- Her record decides which items are a warm-up. There is no opening test. Holding the parts does not join them, so the whole skill is always practised.
- Two items in a row not right on her own end that practice for the day with her place saved. The next session shows the worked example again, then new items.
- An item that holds in one journey counts in the next. Store it once for her (`student2-ki-v1`).

## Practice that needs thinking

- Following the steps must not be possible without the decisions the mathematics needs. Each practice set names the shortcut it has to defeat and includes the items that defeat it, compared side by side first, then as fresh numbers in an unpredictable order.
- Check the answer format with familiar arithmetic before reading a wrong answer as a mathematical gap.
- Check reasons in more than one way (a two-choice reason, completing a picture, correcting a worked answer, a fresh item). A chosen reason alone is not evidence of understanding.

## Words

- Check every child-facing string with the `instruction-language` skill before showing it. Keep the actor, the action, the quantity and the relationship. No labels, slogans, colon fragments or invented words. No "move" as a noun on her screen. Questions name the quantity in full.
- The teacher side gets the exact mathematical name with the rule in symbols, in a separate string from the child's.
- Nothing on her screen may be an id (KI-, SK-, M8..), a teacher word (knowledge item, skill, mastery, level, rung) or a count about her.

## What stays off GitHub

`profile.md`, `data/`, `plan/` and `templates-from-student-1/` stay on this machine (`.gitignore`). The `site/` folder is public. Vercel prod deploys need Bijit's go-ahead.

Revise these rules when her evidence warrants it. Software checks establish software behaviour; learning must be shown by her.
