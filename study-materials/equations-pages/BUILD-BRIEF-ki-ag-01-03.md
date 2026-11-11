# Build brief: Student 2, KI-AG-01 and KI-AG-03 learner page

For anyone in the HTML tool who rebuilds, extends or connects `student2/ki-ag-01-03.html`. Written 9 Nov 2026, after Bijit approved the sample screens. He also accepted the six build choices listed below.

## Source of truth

- **Spec (approved):** `Downloads/Student 2/.claude/worktrees/student-2-setup-from-student-1-52b018/study-materials/ki-understanding-AG01-AG03.md`. Every question, worked example and wrong-answer reply on the page comes from it.
- **Rules for her screens:** `CLAUDE.md` in that same Student 2 folder.
- **Craft:** `techniques/21-current-html-craft.md` sections 4–6.
- **Wording:** the `instruction-language` and `question-formation` skills.
- **Sheet logger:** `site/assets/sheetlog.js` in her repo (bijit-create/grade8-maths-practice).

## Who and what

- **The learner:** one Grade 8 CBSE girl, working with no adult beside her.
- **What this page teaches:** the first two knowledge items on her equations route, before skill SK-AG-30 (equations with x on both sides).
  - **KI-AG-01:** a variable is a letter that stands for a number that can take different values.
  - **KI-AG-03:** an algebraic expression is a combination of numbers and variables joined by operation signs, with no equals sign.

Both are mathematical statements. **No bags, counters, balance or any other manipulative.** Bijit rejected restating them as manipulative facts. The only picture allowed is the small table of values in KI-AG-01 W1 and KI-AG-03 W3. The test fails if "bag", "counter" or "balance" appears in the code.

## What her screen shows (and nothing else)

- the worked example or question;
- the table, where the spec names one;
- the answer controls;
- the reply;
- **Read it**, which reads the screen aloud in en-IN with the browser's own voice (offline);
- **Pause**, which says "The work is paused. Your place is kept." and has a **Go on** button.

Never on her screen: ids (KI-, SK-), teacher words (skill, knowledge item, level, mastery, contrast, supported), or counts about her. The teacher strip only appears with `?teacher=1`.

## Flow for each stop (KI-AG-01, then KI-AG-03)

1. **Worked examples W1–W3.** Each ends in her own completion step: a typed value, a choice, or Yes/No. The step she completes varies from example to example. A step gets its reply straight away, with the correct working when she is wrong. Steps never stop the practice.
2. **Supported item.** Shown with the worked lines on screen and recorded as not her own (`own: 0`).
   - **Setting:** skip it when every completion step was right first time.
   - **Default: OFF.** Bijit has not decided this. Turn it on with `window.KI_CONFIG={skipSupported:true}` or `?skipSupported=1`. A skip is recorded as the event `supported item skipped`.
3. **Her own items, by signal**, in an authored order with fresh numbers each time and the letter rotating x, y, n, a.
   - KI-AG-01: `S1a S3 S2a S4a S5b S2z S6 S4c S5d S4b S2d S7 S5c`
   - KI-AG-03: `T1pos T2a T1letter T1eq T3a T1incWhy T4a T2b T1times T3b T5 T6 T4b`
   - Yes/No answers do not alternate, and the right choice is shuffled.
   - S7 comes only after an own-right S3. T5 comes only after an own-right T2 and T3.
4. **Held rule**, checked once the authored set is done (choice 2 below). The item holds when all three are true:
   - the last item was right on her own;
   - every contrast case was right on her own;
   - at least three signal kinds were right on her own.

   If the rule is not met, a fresh item is added for the first missing contrast case.
   - KI-AG-01 contrast cases: x = 0 (S2z), a decimal value (S2d), the order in x − k (S5b), the same letter twice (S4a), a number, not an object (S3).
   - KI-AG-03 contrast cases: an equation beside an expression (T1eq), an incomplete form (T1inc), 3x as 3 × x (T2a), the same numbers making a different expression (T3b), conjoining (T5).
5. **A miss:** the reply gives what her answer is, where that can be told, and the right working. **The next item is a fresh one of the same kind** (choice 1 below).
6. **Two misses in a row** end the practice for the day with her place saved. The screen says: "We stop here for today. Your place is kept." and "Next time, you start again with an example and then new questions."
   - Reloading on the same day shows the stop screen again.
   - The next day shows the worked examples again, then her items continue from the saved place with new numbers. There is no supported item on a resume.
7. **A two-choice reason never counts on its own.** An item is right only when every part is right. So S3's choice needs its paired value, and T1's "Why is it not an expression?" needs the sort answer beside it. If the sort is wrong, the reason question is not asked.
8. **Review:** each new day opens with one fresh item for every item already held. A wrong review item sends that item back to its practice.
9. **Not built here:** stage 3 (a mixed set with other items) and stage 4 (a fresh set after a gap of about 3 days). The Student 2 app owns those.

## Keypad and expression reader

- **Keys:** digits, the item's letter(s), +, −, ×, a decimal point, ⌫ and OK. The physical keyboard also works: `-` types −, `*` types ×, Enter is OK, and Backspace is ⌫.
- **The same keypad on every typed answer,** so the keys never hint at whether the answer is a number or an expression.
- **Equivalent forms are accepted.** `x + 4` = `4 + x`. `3x` = `3 × x` = `x × 3`, with the reply "We write this as 3x." (choice 5 below).
- **Planned wrong forms get their own reply,** matched by value for every x. For example `4 − x` gets the "order reversed" reply.
- **An unreadable answer is not marked wrong.** It gets an honest reply ("x − is not finished. Write a number or a letter after the last sign."), and she edits it.
- **Her own expression (T6)** is worked out at her value, the way a teacher would write it: "When x is 3, 2x + 5 is 2 × 3 + 5 = 11."

## Records (one per answer)

Each answer goes to `SheetLog.activity(...)`, only if `SheetLog` exists, with these fields:

| Field | What it holds |
|---|---|
| `event` | `answer`, or another event (see below) |
| `set` | `ki-ag-01` or `ki-ag-03` |
| `role` | `worked example step`, `supported`, `own` or `review` |
| `eq` | the question text |
| `x` | the letter's value, for example `y=6` |
| `answer` | what she typed or picked |
| `right` | 1 or 0 |
| `own` | 1 or 0 |
| `support` | `none`, `worked example on screen` or `worked lines on screen` |
| `checks` | for example `KI-AG-01 S2 \| contrast: x = 0` |
| `detail` | JSON text: kind, part n of m, the misreading tag of a wrong answer, the reply shown, and `itemRight` on the item's last part |

- **Other events:** `session start`, `saved stop`, `item holds`, `supported item skipped`, `unreadable answer`, `teaching decision`, `read it`, `pause`, `resume`, `session end`.
- **`SheetLog.state(...)`:** sent when an item holds, stops for the day, or goes back to practice.
- **Local storage:**
  - `student2-ki-ag01-03-v1` holds the page state.
  - `student2-ki-v1` is shared with her other journeys, using the same shape as the balance page: `{ki, res[], passed, stage}` under each stop id.

## Build choices Bijit accepted (9 Nov)

1. **No retry after a wrong answer.** She doesn't try the same item again. The reply gives the working, then the next item is a fresh one of the same kind. Two misses in a row stop the practice for the day.
2. **The full authored set always runs** (13 items per stop) before the held rule is checked. Otherwise the rule could be met early, and S7 or S6 would never be shown.
3. **S7 has a third part,** a value she works out (for example 5x when she buys 4 pens). This follows teaching point 4.
4. **One T3 question is reworded** to "Do 5x + 1 and x + 5 have the same value for every x?", which matches the T3 question before it.
5. **The keypad has a × key,** so that 3 × x can be typed.
6. **Skipping the supported item is OFF** by default.

## Connecting it to her app (for the Student 2 session)

Load `assets/sheet-config.js` and `assets/sheetlog.js` before the page's own script. This page has no `<script src>` lines of its own, so add these two lines right before its `<script>`:

```html
<script src="assets/sheet-config.js"></script>
<script src="assets/sheetlog.js"></script>
```

Nothing else changes. Without them the page runs offline and keeps its record in local storage.

## Teacher and review switches (never on her screen)

| Switch | What it does |
|---|---|
| `?teacher=1` | Shows the teacher strip: phase, item, misses in a row, contrast cases still needed, signals right, the skip setting, and a "Start again" button |
| `?screen=<kind>` | Renders one item for review, and stores nothing. Kinds: `S1a…S7`, `T1pos…T6`, `w01-1…w01-3`, `w03-1…w03-3`, `sup01`, `sup03` |
| `?seed=<n>` | Repeatable numbers |

## Testing

`node student2/ki-ag-01-03.test.cjs`. It drives Chromium with real pointer clicks and key presses, and covers:

- the expression reader;
- every planned wrong answer on every kind of item, checking that the reply is the spec's, nothing is green, and the record has `right = 0` and the item counted not right;
- the two-choice-reason rule;
- unreadable answers;
- the decimal point;
- T5 never using 1;
- the full journey through both stops, alternating pointer and keyboard, with the Sheet row shape, both items held and every contrast case reached;
- the review miss sending an item back to practice;
- the two-miss stop, the same-day reload, and the next-day resume at the same kind;
- the skip setting, on and off;
- Pause;
- phone width (375 px, no sideways scroll, every button at least 44 px);
- the wording scan over every string she saw, and no outside requests.

Screenshots and `strings-she-saw.txt` go to `student2/test-shots/`, or to the `SHOTS` folder if that is set.

## Still open (from the spec, not decided here)

- Is pens and rupees a context she knows, or should the story come from her textbook?
- Real wrong-answer replies are designs to test with her, not findings.
- The mixed set and the after-gap set belong to the app.
