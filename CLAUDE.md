# Student 2: design for independent learning

Student 2 is one Grade 8 CBSE learner (NCERT textbook; outcomes M801 to M820 in `knowledge-graph/`). Read `profile.md` before designing anything. It is still mostly blank: there is no record of her work yet. No adult will sit with her (Bijit, 9 Nov 2026). Her answers are to go to a Google Sheet, as Student 1's do.

These rules are copied from Student 1's `CLAUDE.md` (7 to 11 Nov 2026), where Bijit set them after many rounds of correction. They are written for Student 2 here. Student 1's evidence (his answers, dates, counts) is not hers. Where a rule rested on his record, it is kept as a starting design choice and marked "provisional", to be revised from her own record.

Design so that she can learn without an adult beside her. Every essential path (instructions, feedback, help, pause and resume, paper submission) must work without one. The goal is connected knowledge and increasingly capable, retained, independent performance, including written mathematics.

## Six steps before anything is built or shown (from Student 1, 10 Nov 2026)

Each step leaves a result Bijit can see in the reply. On Student 1 the rules below were written and still broken, because nothing showed whether a check had been run. Bijit called step 1 the most important.

1. **Goal first.** Before any design, build or review, write three lines: what this is for and for whom; whether there is a better goal or a shorter route than the one asked; what success will look like, as something Bijit or she can see or do. For design and build work, wait for Bijit's answer. For a look-up or a chore, go on.
2. **One real screen first, then wait.** Before building or deploying anything she or a teacher will see, show Bijit one real screen: the actual words, the picture, the question and the reply to a wrong answer. A "yes" to a description is not a "yes" to a screen. A request to deploy shows the changed screen with it.
3. **Show the wording check.** Run the `instruction-language` skill on every string she or the teacher will read, and put its result in the reply. A label made up during the work ("journey 2", an item code) is never used without its plain meaning beside it.
4. **A second reader.** Before a screen goes to Bijit, an agent that has seen only the screen, not the design notes, says what the screen asks and what mathematics it teaches. Its answer goes in the reply in a few lines. If it cannot say, the screen is not ready. For wide reading, use one agent per source, each returning a few lines. An agent does not replace Bijit seeing the screen.
5. **Name the source.** Before writing, look for the current file, the earlier decision and the project's own guide. Say in the first line which source was used and its date. Where a name, date or number is not known, leave a blank and ask once; do not make one up.
6. **Keep the chat small.** Read the count with `mcp__ccd_session_mgmt__get_usage`. When the total nears 150k tokens, update `HANDOVER.md` and start a new chat; a new chat already starts at about 114k. If the count is past 150k, finish the request in hand, say the count, and start a new chat for the next one. Automatic compaction is not a handover. Keep `HANDOVER.md` short: Student 1's grew to about 145 KB and is loaded into every chat, so a new chat there started at about 175k. Here, replace an old section when it is settled instead of adding another above it.

## Which document governs (from Student 1, 10 Nov 2026)

When two documents disagree, the one higher in this list wins:

1. `CLAUDE.md` (this file): the design rules.
2. `charter.md`: her goals and what success means.
3. `HANDOVER.md`: what is built, what is live and what is open. Its facts are dated; check the code before relying on them.
4. The code: `study-materials/` (sources), `site/` (what she sees), `apps-script/` (her Sheet).

Everything else is history, evidence or background: `knowledge-graph/`, the notes in `study-materials/`, and the local folders `templates-from-student-1/` and `research-from-student-1/` (written for Student 1; each file says what in it is general). Do not take a rule, a threshold or a test of success from them. Add a line to `CHANGELOG.md` when a governing document changes.

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
- Every logged answer records `supplied`: what the screen did for her when she answered (for example the equation already written, the balance drawn, the first step done). An empty list means nothing was supplied. A right answer is evidence only for the decisions she made herself; one where the screen wrote the equation is evidence of calculating, not of forming the equation (from Student 1, 11 Nov).
- A session in which an adult prompted her is marked "helped" as a whole, and its answers do not count as her own. Nothing is deleted (from Student 1, 11 Nov).

## Her actions and the route through difficulty

- Give every picture a job she performs: predict the next state, make a change, place a value. Watching is not evidence. Keep words next to the marks they describe and change help in place.
- After a wrong answer on a whole task, say what her answer describes when that can be told, and leave the remaining decision to her. Do not praise a part her answer has not shown.
- A wrong answer points to a part to check. Check that part with one short item. Probes may chain inside the branch for her wrong answer, one short item per part, moving on only while each check is right. The chain stops at the first part that is not right; that part gets its teaching and one fresh check. At every stage a wrong answer gets one targeted explanation and one matched fresh example. If that is still not right, show the worked answer and offer a saved stop. A saved stop never waits on an adult: the next session brings new examples.
- Follow repair with fresh whole tasks whose answers differ.

## Manipulatives

A manipulative is something she moves. Student 1's thermometer (`templates-from-student-1/2026-11-09/thermometer-to-numbers.html`) is the reference for how one behaves; his ladder (`templates-from-student-1/2026-11-11/ladder-routine.html`) is the reference for show, predict, fade.

- She moves the object itself (drag, or controls of at least 44 px beside the object that travel with it; keys work too). Moving happens only at the picture.
- Draw her action while she makes it, and when she finishes, write its mathematics beside it. The action and the equation are never in two places.
- Judge nothing while she moves. The check comes only when she says the step is done, with a button in the text column. A wrong step gets a reply describing what she did and goes back to the start of that step.
- Each kind of manipulation is a mathematical operation, and each result is written as mathematics beside it.
- Practise one kind until it holds before the next. Progress goes in stages, not by a count: right with support → right on a fresh item with less guidance → right on her own across the contrast cases that defeat the shortcut → choosing correctly in a mixed set → right after a gap. A right answer after a reply counts as help. At most 8 items of one kind a day; start each session with one item of every kind already passed (provisional). Practice that follows a modelling run is the exception (see "Show, then predict, then fade").
- Keep one plain manipulative and fade it: the picture → the picture beside the written lines → the written lines alone (the picture only on request, recorded as supplied) → paper. Guided tasks first, then open ones where she makes her own example.
- Her screen shows only the picture, the problem, one question, the decision button and the reply. Practice names, rules, progress and design notes go where she does not see them.

## Knowledge items before skills, success first

- A journey does not open with a whole task she may fail. Order: (1) a warm-up of the knowledge items her dated record already shows, each done as an action; (2) for each item not shown, a worked example, one item straight after it (recorded as supported), then fresh items on her own until it holds; (3) practice of the skill, from whole tasks with steps prompted to whole tasks without prompts, then contrast cases and a mixed set; (4) a return after a gap with a fresh whole task and no help; then paper.
- Her record decides which items are a warm-up. There is no opening test. Holding the parts does not join them, so the whole skill is always practised.
- Two items in a row not right on her own end that practice for the day with her place saved. The next session shows the worked example again, then new items.
- An item that holds in one journey counts in the next. Store it once for her (`student2-ki-v1`).

## What a knowledge item is (from Student 1, 10 to 11 Nov)

- A knowledge item is mathematical knowledge: a fact, a concept or a principle that is true of numbers, equations or quantities. It is never a word cue or a habit of the screen. Bijit, 11 Nov: "goes up means plus is never a knowledge item, it is not mathematical knowledge." For her, "the same thing done to both sides keeps the equation true" can be an item; "take away means minus" or "move the number across and change its sign" cannot. The range of an item is kinds of situation or structure, never kinds of word.
- Never restate an item as facts about the manipulative ("a bag weighs x"). The balance is a way to show the item, not the item.
- A principle needs understanding, not only recall: it is shown on its own first, then practised and recorded inside the whole task. "Required before attainment" says when an item may be recorded, not whether it is taught.
- **The moment test.** For any item, ask: "Where does she decide this, and how would I see her decide it wrong?" An item with such a moment can be checked there. This is an evidence test, never a reason not to teach. Bijit: "if a knowledge item can be taught, we will teach them." An item with no moment is still taught; we only do not claim she holds it.

## Show, then predict, then fade (from Student 1, 11 Nov)

The process for teaching a knowledge item. Bijit, 11 Nov: "first show, then predict, and then fade."

- **Show.** Build the example one unit at a time, with its mathematics written beside it each time, and keep the earlier lines on screen so they stack. Hold everything still except one thing, so that only one thing changes per line. She presses the control for each line herself. No prose stating the conclusion: the lines carry it. Choose the run so the shortcut she might form is wrong on every line, not on one line she has to notice.
- **Predict.** The control is held back and she writes the next line before it is drawn, then continues past where the picture stopped. This is checkable without an adult and cannot be read off a picture that is not yet drawn.
- **Fade.** Then practice with the supports removed one at a time (the picture with a marked start → the picture only → no picture → paper).
- **Practice after modelling.** Up to 10 items may follow each modelled run, because they are graded by removing one support at a time, not ten tries at the same thing (Bijit, 11 Nov: "build 10 practice for each"). Two not right in a row on her own end that practice with her place kept. Both numbers are provisional lever points, not findings: Student 1's research found no source for either, and found that items spread over days and then mixed help more later than ten in a row.

## Decisions rest on researched knowledge (from Student 1, 11 Nov)

- Bijit, 11 Nov: decisions must rest on established domain knowledge, researched and cited. "Don't fake it." Name the source and say how much of it was read (full text, abstract, secondary).
- The rules in this file are design decisions, not domain knowledge. Every count, streak, cap and stop rule here is a **lever point**: a choice we can turn, to be revised from her record, never a principle. Do not attach a theory's name to a number it does not give.
- Judge each principle on its warrant, its evidence quality and how near its conditions are to her; give it a role in the decision (constraint, guide, trade-off, evidence requirement); say what would make us revise the choice. The method and the background are in `research-from-student-1/README.md` (local). That research was written for Student 1, who was learning integers; use the parts each file marks as general, and research her topic's own structure (linear equations, what the balance does and does not model) before resting a decision on it.

## Route for a new screen (from Student 1, 11 Nov)

A local prototype beside the journey (loading the shared code, recording nothing) → play it and take screenshots → a second reader on the screens only → Bijit's yes to the played screens → only then into the shared engine and the live pages. Nothing goes into a live page or the engine on a yes to a description.

## Practice that needs thinking

- Following the steps must not be possible without the decisions the mathematics needs. Each practice set names the shortcut it has to defeat and includes the items that defeat it, compared side by side first, then as fresh numbers in an unpredictable order.
- Check the answer format with familiar arithmetic before reading a wrong answer as a mathematical gap.
- Check reasons in more than one way (a two-choice reason, completing a picture, correcting a worked answer, a fresh item). A chosen reason alone is not evidence of understanding.

## Words

- Check every child-facing string with the `instruction-language` skill before showing it. Keep the actor, the action, the quantity and the relationship. No labels, slogans, colon fragments or invented words. No "move" as a noun on her screen. Questions name the quantity in full.
- The teacher side gets the exact mathematical name with the rule in symbols, in a separate string from the child's.
- Nothing on her screen may be an id (KI-, SK-, M8..), a teacher word (knowledge item, skill, mastery, level, rung) or a count about her.

## What stays off GitHub

`profile.md`, `data/`, `plan/`, `templates-from-student-1/` and `research-from-student-1/` stay on this machine (`.gitignore`). The `site/` folder is public. Vercel prod deploys need Bijit's go-ahead.

Revise these rules when her evidence warrants it. Software checks establish software behaviour; learning must be shown by her.
