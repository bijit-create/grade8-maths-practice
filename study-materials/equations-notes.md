# Equations: teacher notes

`equations-practice.html`, built 24 Oct 2026 for Student 2 (Grade 8, CBSE). Outcome M806 ("Solves puzzles and daily life problems using variables"), from `../knowledge-graph/graph-data.json`. Method: the Student 1 lesson method (`../templates-from-student-1/lesson-method.md`): Direct Instruction, high-frequency item cycles, a five-level fading ladder per skill, spaced returns. Authored by ConveGenius; review pending.

## Run it

Open the file on the tablet or laptop (offline is fine). Press Start. Keep a notebook beside it; from level 3 on, she does the working on paper and types only the answer. A session is about 15 minutes and 40 to 55 answers. Progress is saved in the browser. Export the CSV from the Teacher panel at the end of every session.

The page plans each day itself. To choose the blocks yourself, open Teacher, tap the Order buttons in the order you want, then "Start this order now" (one session only).

## What to say

Nothing the screen does not say. The grey strip is written for her, in the same words every time. When she is wrong, the screen shows the right move and one line. If she is stuck, point at the steps and press Next. The same question comes back after two others, and a new one of the same kind comes back at the end of the block.

## The model

One model for the whole outcome: **an equation is two sides that stay equal, and every move is done to both sides.** The moves are always worded the same way:

- Take ___ from both sides.
- Add ___ to both sides.
- Divide both sides by ___.
- Open the bracket: multiply each term inside.
- Multiply every term by ___ (to clear the fractions).
- Cross-multiply.

The page never says "move it across and change the sign". That phrase is where the error in the graph's separation test comes from: 5x − 7 = 2x + 8 turned into 7x − 7 = 8.

## What she practises, in order

**Knowledge items** (quick taps, 12 to 16 per burst, under about 6 seconds each):

| Order | Item | Graph id | Kind | Gate |
|---|---|---|---|---|
| 1 | Is it a solution? | KI-AG-18 | Concept | before teaching |
| 2 | Same to both sides (undo + − × ÷) | KI-AG-19 | Principle | before attainment |
| 3 | Like terms | KI-AG-11 | Principle | before attainment |
| 4 | Open the bracket | KI-AG-13 | Procedure | before attainment |
| 5 | Take x from both sides | KI-AG-24 | Procedure | before attainment |
| 6 | Clear the fractions | KI-AG-61 | Procedure | before attainment |
| 7 | Cross-multiply | KI-RP-07 | Principle | before attainment |
| 8 | Consecutive numbers | KI-AG-62 | Concept | before teaching |
| 9 | Ratios as 7x and 5x | KI-AG-60 | Principle | before attainment |
| 10 | Ages after or before some years | KI-AG-59 | Principle | before attainment |
| 11 | Digits: 10a + b | KI-NN-11 | Concept | before teaching |
| 12 | Fraction of a quantity | KI-RN-32 | Concept | before teaching |

Each new item gets: an entry check of 5 (all 5 right skips the teaching), one shown example, a faultless example set (four lines that differ in exactly the thing the item decides), then the burst. One question in three is an earlier item. An item is **passed** after 9 of 10 right in a day; it is **held** after 9 of 10 right on two different days with a median time of 6 seconds or less. Held items come back after 1, 3, 7 and 14 days.

**Skills** (the ladder):

| Skill | Graph id | Starts when |
|---|---|---|
| Solve: x on both sides or a bracket | SK-AG-30 | "Is it a solution?" passed |
| Solve with fractions | SK-AG-31 | SK-AG-30 at level 4 |
| Solve with x below the line | SK-AG-32 | SK-AG-30 at level 4 |
| Write the equation (tap the right one of three) | SK-AG-29 | consecutive numbers passed, SK-AG-30 at level 3 |
| Word problems | SK-AG-25 | SK-AG-29 at 3, SK-AG-30 at 4 |
| Word problems: x on both sides | SK-AG-27 | SK-AG-29 at 3, SK-AG-30 at 4 |
| Digit puzzles | SK-AG-26 | digits passed, SK-AG-29 at 3, SK-AG-30 at 4 |
| Word problems with fractions | SK-AG-28 | fraction of passed, SK-AG-29 at 3, SK-AG-31 at 4, SK-AG-32 at 3 |

A skill starts once its concept items are passed (row 15: facts, terms and concepts before teaching). Its procedures and principles are taught alongside. The skill counts as **attained** only when it reaches level 5, gets 4 right in a row there, and those procedures and principles are held.

The five levels:

| Level | Solving | Word problems |
|---|---|---|
| 1 | every step shown; she reads x | equation and steps shown; she answers the question |
| 2 | she picks every move from three | equation shown; she solves on paper |
| 3 | she picks the first move; finishes on paper | she picks the equation from three, then solves |
| 4 | equation only; "Show steps" on tap | problem only; "Show the equation" on tap |
| 5 | equation only | problem only |

Up a level after 4 right in a row. Down a level after 2 wrong in a row, or after one separation error. A separation error is the wrong answer the graph records for that skill:

| Skill | Separation error |
|---|---|
| SK-AG-30 | the x term moved with its sign kept |
| SK-AG-31 | only the x terms multiplied |
| SK-AG-32 | numerators set equal |
| SK-AG-25 | consecutive multiples of 8 going up by 1, or the years added once |
| SK-AG-27 | the years taken from one age only |
| SK-AG-26 | the digits added instead of 10x + y |
| SK-AG-28 | three-fourths of the whole herd instead of the rest |

A wrong move choice at level 2 or 3 resets the streak and the question comes back, but only a wrong final answer or a separation error moves her down. Level 4 is the one to watch: the Teacher panel counts her peeks. On days with nothing new, a short mixed block of skills she has already attained runs at level 5.

## Reading the CSV

There is one row per answer. The columns are:

- **block:** entry check, quick answers, second-day check, return, ladder, move or equation pick.
- **id:** the graph id.
- **rung:** the ladder level.
- **task, answer, correct**
- **err:** which wrong move the answer matches. Examples are "x-term one side", "number one side", "bracket", "sign", "divide upside down", "answered x" (she gave x when the question asked for something else), or the wrong equation she picked.
- **rt:** response time in milliseconds.
- **peek** and **retry**
- **sep:** 1 for a separation error.

## Tested

Tested on 24 Oct 2026.

**Generators.** Every question generator was run 3,000 times in Node, and every check passed:

- each answer satisfies its equation;
- the wrong choices differ from the right one and from each other;
- every wrong answer the page recognises differs from the right answer;
- no text shows a broken expression.

Four faults were found and fixed along the way:

- K11 could show "x + 0x".
- A fraction equation could produce a coefficient of 408.
- One P27c wrong equation was the same as the right one.
- In P28b, setting numerators equal gave the right answer whenever the new fraction was already in lowest terms.

**Simulated days.** A script then answered the page as a learner would, over simulated days. Peeks were taken at level 4.

| Wrong-answer rate | Days | What happened |
|---|---|---|
| 6% | 32 | All 12 items held by day 16. All 8 skills attained by day 26. Sessions of 44 to 59 answers while items are being learnt, then 11 to 35 once the work is returns. |
| 10% | 24 | All items held and all skills attained by day 24. |
| 20% | 14 | She stays on the early solving levels and gets only a few items held, which is what the ladder should do. |

There were no script errors. Every screen was checked, 1,224 in the last run, and none showed an id, a teacher word or a broken expression. Nothing overflows sideways at phone width.

**Not tested.** No real learner has used the page. Browser storage could not be tested in the preview pane, so save and reload must be checked once on the tablet: play two questions, close, reopen, and look at Teacher.

## Hygiene check (repeat after any edit)

Render every screen she can reach and read its text as she would. Fail the screen if it shows an id (KI-, SK-, LO-), a teacher word (knowledge item, skill, mastery, rung, review, outcome, session), two instructions in one line, or a count about her other than the end-of-session total. Those belong in the Teacher panel or the CSV.

## Not known yet

Her profile is blank, so this is built for a general Grade 8 learner on the NCERT textbook. Once her teacher says where she gets stuck, the first thing to change is the start point. For example, if one-step equations are not secure, the "same to both sides" item needs more weight before SK-AG-30.
