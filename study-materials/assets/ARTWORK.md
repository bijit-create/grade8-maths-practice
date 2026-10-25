# Courtyard stories

Original artwork and character created for this practice screen. References informed the direction, without reusing book illustrations or characters: everyday observational humour in Indian picture books (Tulika / Pratham Books), restrained ink and colour in Tara Books, and a familiar Indian courtyard setting. The selected design uses a black-and-white domestic cat, peach plaster, a teal door, plant pots and a drying towel. Warm paper is the default theme.

`courtyard.webp` was generated with the built-in ImageGen tool, then resized to 1800 × 600 and compressed to WebP. `courtyard.js` contains the original vector character and its animation states. No external fonts, animation libraries or network services are required at runtime.

## Image generation prompt

Create a production background asset for a Grade 8 maths practice app, a very wide flat panoramic Indian courtyard illustration (aspect ratio 3:1). Original contemporary Indian children's book illustration, hand ink outlines and restrained flat gouache washes with natural paper grain. Quiet, sophisticated, warm, not preschool. Faded peach plaster wall across background, dusty teal wooden home door at far right (door bottom at 80 percent image height), a simple shaded verandah, terracotta pots with plants near edges, a small towel drying on a line at left, mango leaves entering upper corners, red oxide ground in bottom quarter. Palette warm ivory #faf5e9, dusty teal #387d83, faded coral, muted mustard. Ground at bottom must remain a continuous clear flat path for a separate animated cat to walk on. Wide level side elevation, no perspective foreground, no characters, NO CAT, no animals, no writing or letters or numerals, no UI, no border, no mockup. Large empty central wall, minimal details, avoid dense ornamental borders. This artwork occupies a shallow header strip above the maths question. Return just the art.

## Behaviour

- Correct answers move the cat forward; mistakes make it sit without subtracting distance.
- Every five successes cause a brief hop and confetti. Completing the session opens the door and celebrates the homecoming.
- After 90 seconds without a tap or key press, the cat faces the student and knocks twice, then sits. A new interaction dismisses the nudge. Hidden tabs and the teacher panel suppress reminders.
- Pause cat stops reactions, reminders and decorative animation. Reduced-motion preferences disable animation and confetti while retaining static feedback.
- Questions that exceed the available space use labelled panels within the same question. Worked solutions have previous/next step controls. The teacher overlay remains scrollable.

## Validation

`tests/courtyard-browser.js` runs against a disposable browser session of the local lesson, not student data. It checks generated presentations, hints and corrections for all five rungs, all knowledge items, page bounds, footer bounds, and document overflow. It also checks success, error, milestone, inactivity, pause, homecoming and reset states. The source page and its assets must be copied to `site/` together.
