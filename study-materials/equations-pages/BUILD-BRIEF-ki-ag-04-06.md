# Build brief: Student 2, KI-AG-04 and KI-AG-06 learner page

`student2/ki-ag-04-06.html`, built 10 Nov 2026 after Bijit's go-ahead ("Yes, build them"). Everything not said here is the same as `BUILD-BRIEF-ki-ag-01-03.md`: the flow, the held rule, the six build choices, the keypad, the records, Read it, Pause, the teacher switches and how to connect the Sheet logger.

## Source of truth

- **Spec:** `student2/specs/ki-ag-04-06.md`. Every question, worked example and wrong-answer reply on the page comes from it.
- **Generated, not hand-edited.** Edit `student2/build/content/ki-ag-04-06.js` (or the engine patches in `student2/build/make-pages.cjs`), then run `node student2/build/make-pages.cjs student2/build/content student2`.

## What the page teaches

- **KI-AG-04:** a term is a number, a variable, or a product of numbers and variables; terms are joined by + or −, and the sign belongs to the term.
- **KI-AG-06:** the coefficient is the number that multiplies the variable (x has 1, −x has −1); a constant term has no variable (3x + 2y has none).

No picture. W1 of each stop has a small table that splits expressions into terms; the table is the mathematics.

## Her items, in the authored order

| Stop | Order (12 each) | Contrast cases (each must be right on her own) |
|---|---|---|
| KI-AG-04 | `U1 U2 U4 U3 U5same U1x U2b U5diff U4b U3b U1 U2` | sign with term (U2); × does not split a term (U1x); same terms, other order (U5same); signs swapped (U5diff) |
| KI-AG-06 | `V1 V4 V2 V3 V1y V5 V4none V2neg V3b V1 V5b V4` | hidden 1 (V2); coefficient −1 (V2neg); sign of coefficient (V3); no constant term (V4none) |

- U5 comes only after an own-right U2 (gate).
- U3 is a choice ("one term / two terms / three terms") paired with a value of 7xy; the choice never counts on its own.
- U4 and V5 accept the terms in either order (5x − 3 or −3 + 5x). The keypad's − key types a leading minus.

## Engine piece added for this page

- **`letterFirst` on an expression answer** (W3 of KI-AG-04, "Write 9 − 4x with the term in x first"). The same expression typed back with the number first is marked not right, with the reply "That is the same expression, but the term in x is not first…". −4x + 9 is right.

## Choices made while building (Bijit can overrule)

- **W2 of KI-AG-04:** "Is 6ab one term, or more than one?" Choices one / two / three terms, then "If a is 2 and b is 3, what is 6ab?" (36).
- **W3 of KI-AG-06** asks "Does 6 + x have a constant term?" and then "What is the constant term of 6 + x?" The spec's "What is it?" was reworded so the question names what it asks for (question-formation).
- **V4none** is a Yes/No on its own, like S4b and S4c on the approved page (a judgement, not a reason).
- **V5b** reverses V5: the coefficient is negative and the constant positive (−3y + 8, or 8 − 3y).
- Wording: replies avoid colon fragments ("…, so the expression is 5x − 3"), and "Both letters multiply" became "x and y are both multiplied" (literal verbs).

## Testing

`node student2/ki-ag-04-06.test.cjs` → **543 passed, 0 failed** (three runs in a row, 10 Nov 2026). The checklist is in `student2/page-test-lib.cjs`, copied from `ki-ag-01-03.test.cjs` and reading the kinds, worked examples and contrast cases from the page itself:

- every planned wrong answer on every worked step, the helped item and every kind (65), each with the spec's reply, nothing green, `right = 0`, the item not counted right; every kind also answered right;
- the full journey through both stops, alternating pointer and keyboard: both items held, every contrast case reached, every authored kind shown, the Sheet row shape;
- a review miss sending KI-AG-04 back to practice; the two-miss stop, same-day reload, next-day resume at the same kind; the skip setting on and off; Pause;
- phone width 375 px (no sideways scroll, every button at least 44 px) on every screen;
- the wording scan (banned words, colon fragments, questions end in ?, no slash fractions) and no outside requests;
- page-specific: the letterFirst reply, −4x + 9 typed with a leading minus, terms in either order, the U5 gate.

Screenshots and `strings-she-saw.txt` go to `student2/test-shots/ki-ag-04-06/` (git-ignored).

## Still open

- The spec's sources were cited from memory; links still to be checked.
- The `instruction-language` and `question-formation` skills were applied by hand to the strings above; a full skill pass over `strings-she-saw.txt` is still to do with the other pages.
