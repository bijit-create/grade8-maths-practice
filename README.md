# Student 2

Work for one learner, set up the same way as the Student 1 folder. Student 2 is on a different course from Student 1, so the MYP2 knowledge graph and course overview are not copied here.

## How lessons are designed (from 9 Nov 2026)

`CLAUDE.md` holds the design rules, copied from Student 1's rules of 7–9 Nov (success first, journeys with probes chosen by the wrong answer, manipulatives she moves, practice that defeats shortcuts, wording checked with `instruction-language`). The first journey built to them is designed in `study-materials/equations-journey-1.md` and built as `study-materials/balance-journey.html` (copied to `site/balance-equations.html`; tests: `node study-materials/balance-journey-test.cjs` with NODE_PATH set to HTML-TOOL/agentic-generator/node_modules). Every answer and event also goes to the Google Sheet "Student 2 – Maths progress record" (https://docs.google.com/spreadsheets/d/1I3JpJ4mxoshq2YFDf38P6rQ9jSsArbBz0IQzSVcpJz4): one row per answer in Activity, one row per practice set in Now. The Sheet's script is `apps-script/Code.gs` (to change it: paste, Save, Deploy > Manage deployments > edit > New version, which keeps the URL); the page sends through `site/assets/sheetlog.js` and `sheet-config.js`. A third tab, Signals, is rewritten by `apps-script/Signals.gs` each time answers arrive: it lists the planned misreadings her answers fit, the answers that fit none, and the readings not seen or not reached (preview with simulated rows: `study-materials/signals-sample.html`; test: `node study-materials/signals-test.cjs`). Rows wait on the device when offline. Opening the page with `?teacher=1` also shows a CSV download. Student 1's current reference files are in `templates-from-student-1/2026-11-09/`.

## Folders
- `profile.md` — who Student 2 is. Fill this in first.
- `data/` — the course overview, assessments, photos of work, CSV exports from the tablet pages.
- `knowledge-graph/` — the skill graph for Student 2's course: Grade 8 CBSE maths, built with the congov-knowledge-graph plugin from the NCERT (2017) outcomes M801 to M820. `graph-data.json` is the source of truth; `progress-note.md` says how it was built and what is open.
- `plan/` — the plan for the topic in focus and the session log.
- `study-materials/` — tablet lessons and teacher guides made for Student 2.
- `worksheets/` — paper sheets (worksheet-forge), one folder per sheet.
- `site/` — what students see online: an index page plus copies of `knowledge-graph/graph-page.html` and `study-materials/equations-practice.html`. When either source page changes, copy it into `site/` again and push.
- `templates-from-student-1/` — Student 1's work, copied to adapt. Do not hand these to Student 2 as they are.

## Online

- Site for students: https://grade8-maths-practice.vercel.app (index), https://grade8-maths-practice.vercel.app/equations-practice and https://grade8-maths-practice.vercel.app/knowledge-graph.
- Source: https://github.com/bijit-create/grade8-maths-practice (public). Vercel project `grade8-maths-practice` (account bijits-projects-ec8c6e30), root directory `site/`. The project is not yet connected to the GitHub repo, so a push does not deploy by itself: either connect it once in the Vercel dashboard (project Settings, Git, Connect, pick this repo) or ask Claude to redeploy `main` after a push.
- Kept off GitHub by `.gitignore`: `profile.md`, `data/`, `plan/` and `templates-from-student-1/` (that folder names a school and a learner detail). They stay on this machine only.

## About the templates
They were made for Student 1 (MYP2, integers) and still say so inside:
- `lesson-method.md` — the general lesson method (one model per outcome, five-rung fading ladder, spaced returns). The most reusable file.
- `integers-plan.md`, `how-memory-forms.md`, `representations-research.md` — how Student 1's plan, memory-tracking and model research were laid out.
- `study-materials/` — the tablet lessons. Their saved-progress keys and CSV file names now say `student2`, so they do not mix with Student 1's data on a shared tablet. The questions, models and wording are still Student 1's integers content.
- `worksheets/*/spec.json` — two worksheet-forge specs that were delivered and reviewed (dividing with negatives; add and subtract in steps). Their sources and author lines still point at Student 1.
