# Equations journey 1: x on both sides, on a balance

9 Nov 2026. This is the first Student 2 journey, designed the way Student 1's journeys now are (`../CLAUDE.md`, copied from Student 1 on 9 Nov). It is not built yet; this is the design to agree on first.

## Why the 24 Oct page has to change

`equations-practice.html` was built on Student 1's 24 Oct method, which Student 1 dropped on 7–9 Nov. Under the new rules, the 24 Oct page:
- opens each item with an entry check of 5 (an opening test; now replaced by "success first");
- counts 9 of 10 right and a median time of 6 seconds (time is no longer evidence; progress goes in stages, not counts);
- moves her down a level after a separation error (a wrong answer is no longer a diagnosis; it opens a probe);
- teaches with symbols only, with no manipulative she moves;
- uses "move" as a noun in what she picks ("she picks every move from three").

It stays live until journey 1 replaces its home card.

## The complete performance

Solve a linear equation with x on both sides, with positive whole numbers and a whole-number answer: 2x + 9 = 5x + 3 → x = 2. This is SK-AG-30 without the bracket (the bracket comes in a later journey). Knowledge items: KI-AG-19 (do the same to both sides), KI-AG-24 (take x from both sides), KI-AG-18 (a solution makes both sides equal), and sharing both sides into equal groups (÷).

## The manipulative: a balance

Each bag holds the same number of counters; that number is x. The balance is level, so both sides hold the same number of counters. Her actions are the operations:

| She does | Mathematics written beside it |
|---|---|
| takes the same number of bags off both sides | 2x + 9 − 2x = 5x + 3 − 2x, then 9 = 3x + 3 |
| takes the same number of counters off both sides | 9 − 3 = 3x + 3 − 3, then 6 = 3x |
| shares both sides into equal groups, one per bag | 6 ÷ 3 = 3x ÷ 3, then 2 = x |
| puts her x into every bag of the first balance | 2 × 2 + 9 = 13 and 5 × 2 + 3 = 13 |

The balance does not tilt while she works. It shows whether it is level only when she taps the button, so no single tap gives a verdict.

Fading: the balance with the lines written for her → the balance with her typing each line → the lines alone, with the balance only on request (recorded as supplied) → paper.

The balance cannot show negative numbers, so this journey keeps to positive numbers. Negative terms come later, with the lines alone.

## Her screens

All strings were checked with `instruction-language`.

**1. Worked example.**
"Here is one solved for you."
"Each bag holds the same number of counters. We call that number x."
"The balance is level, so both sides hold the same number of counters. 2x + 9 = 5x + 3."
Each step then plays with its line beside the balance. Button: "Next step".

**2. Her first one, straight after (recorded as supported).** 3x + 4 = 5x + 2.
"Take the same number of bags off both sides. Then tap the button."
Button: "I have taken bags off both sides".
- Right: "Yes. You took 3 bags off each side, and the balance is still level. 4 = 2x + 2."
- Bags off one side only: "You took 3 bags off the left side and none off the right side. The balance tips, because the two sides no longer hold the same number of counters. The bags are back where they started."
- Different numbers off each side: "You took 3 bags off the left side and 2 off the right side. The balance tips. Take the same number off both sides. The bags are back where they started."

**3. Counters, then sharing.**
"Take the same number of counters off both sides, so that only bags remain on one side."
"2 = 2x. Share the counters on the left equally between the 2 bags. How many counters are in one bag?" Answer box: "x = ▢".
- If she gives 2 (the number of bags): "2 is the number of bags. The question asks how many counters are in one bag."

**4. Check it.**
"Put 1 counter in every bag on the first balance. Do both sides hold the same number of counters?" Buttons: "Yes, the same" / "No, not the same".

## Practice, and the shortcut it defeats

The shortcut to defeat is the graph's separation error for SK-AG-30: the x term carried to the other side with its sign kept (5x − 7 = 2x + 8 → 7x − 7 = 8). On the balance, that is taking bags off one side only.

Contrast cases, shown side by side first, then as fresh numbers in an order she cannot predict:
- more bags on the right (3x + 4 = 5x + 2) against more bags on the left (7x + 4 = 3x + 16), so the bags can remain on either side;
- a question asking for x against a question asking for the counters in all the bags;
- equations where the number of bags equals the number of counters to take off, so a number on the screen is not the answer.

Stages, as in `../CLAUDE.md`: supported → fresh with less guidance → contrast cases on her own → mixed set → after a gap → paper.

## Build

Reuse Student 1's shared journey core (`templates-from-student-1/2026-11-09/study-materials/journey-engine.js` and `journey-screen.js`). Replace the thermometer picture with the balance, and switch the storage keys to `student2-…`.

## Open, for Bijit

1. Is an adult with her during sessions? The rules assume not.
2. Her record is empty, so success first teaches every knowledge item with a worked example. A Grade 8 learner may already hold "same to both sides". Is there any dated evidence (a school test, a worksheet, her teacher's word) that would make those items a warm-up instead?
3. Bags of counters is a new picture convention for her and has to be taught on screen 1. Keep it, or use another object?
4. Recording: Student 1's answers go to a Google Sheet through Apps Script. Student 2 has no Sheet yet. Keep records on the device, with a download, until one is needed?
