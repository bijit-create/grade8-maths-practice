# Courtyard stories

Original artwork and character created for this practice screen. References informed the direction, without reusing book illustrations or characters: everyday observational humour in Indian picture books (Tulika / Pratham Books), restrained ink and colour in Tara Books, and a familiar Indian courtyard setting. The selected design uses a black-and-white domestic cat, peach plaster, a teal door, plant pots and a drying towel. Warm paper is the default theme.

`courtyard.webp` was generated with the built-in ImageGen tool, then resized to 1800 × 600 and compressed to WebP. `cats/cat-sprites.webp` contains 24 generated raster frames (six columns by four rows). CSS plays the walk, seated blink, knock and celebration sequences frame by frame. Individual transparent WebP frames and animated previews are saved alongside the atlas. The cat uses no SVG. The visible title, step count and speech bubbles have been removed; accessible announcements remain available to screen readers. No external fonts, animation libraries or network services are required at runtime.

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

## Cat sprite generation

Generated with the built-in ImageGen tool using the selected middle Courtyard stories concept as the character reference. The original PNG is retained at `artwork/cat-atlas.png`. Run `scripts/prepare-cat-sprites.py` to reproduce the lossless WebP atlas, 24 extracted frames and four animated previews in both source and site directories.

### Generation prompt

Use case: illustration-story. Asset type: production game animation sprite atlas with TRUE TRANSPARENT BACKGROUND. Create ONE exact regular grid containing 24 frames of the SAME black-and-white cat: SIX columns by FOUR rows, square cells, canvas 3072 by 2048 pixels. Input reference role: use ONLY the black-and-white domestic cat in the MIDDLE 'Courtyard stories' column as character/design reference; ignore all other cats, UI, text and backgrounds. New original hand-ink and flat gouache Indian children's picture-book illustration, sophisticated expressive lean domestic street cat, black ears and head cap, white muzzle and chest and legs, large black back patch and black curved tail, small warm amber eyes, pink inner ears, lively but not babyish. CONSISTENT identity, markings, proportions, scale and stroke texture in EVERY frame. Each cell contains exactly ONE complete cat with generous transparent margin, no cut off paws/tail/ears, no shadows or ground, no overlapping cells. No grid lines, no labels, no text, no watermark. Every cat occupies about 70 percent of its square cell and is centered on exactly the same horizontal anchor; common ground baseline at 85 percent of cell height, with headroom reserved for jumping. Row 1: six consecutive walk-cycle keyframes facing RIGHT, same side view, torso and head almost fixed, clearly alternating forelegs and hindlegs: left contact, down, passing, right contact, up, passing. Seamless walk loop. Row 2: six seated idle-cycle frames of this cat three-quarter facing the viewer/right: seated eyes open, chest inhale, small tail sway, half blink, eyes closed blink, eyes open. All are fully SEATED, same position, no standing. Row 3: six sequential knocking frames, cat seated facing VIEWER, paw on viewer's right raised: paw starts at chest, lifts, extends toward invisible glass, paw pads press forward, retracts, returns. SAME cat body/head and seated position, paw articulation is clearly different; no speech or comic marks. Row 4: six consecutive happy celebration jump keyframes three-quarter facing right: crouch preparation, push off, rising with paws up, happy apex with all paws airborne, descending, soft landing. Headroom inside each cell, body stays same size and markings. Ground position stays baseline except airborne frames. Preserve real alpha transparency (not a painted checkerboard). Output ONLY the precisely aligned 6 by 4 sprite atlas, no surrounding design board.

### Spacing correction prompt

undefined
