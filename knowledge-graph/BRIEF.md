# Author brief: Grade 8 Mathematics (CBSE) knowledge graph, one domain group

You are authoring part of a curriculum knowledge graph under the ConveGenius (ConGov) curriculum framework for one Grade 8 learner on the CBSE syllabus. The outcomes are the NCERT (2017) learning outcomes for Class VIII mathematics, M801 to M820, quoted exactly in `skeleton.json` (ids LO-M801 to LO-M820, each with a domain). Do not edit them. CBSE follows the NCERT textbook, so the NCERT Class 8 Mathematics textbook sets the ranges, forms and contexts (the conditions) of what each outcome asks for.

## Read first (all paths absolute)

Framework, newer plugin copy (call this folder `F` = `C:/Users/BIJITK~1/AppData/Local/Temp/claude/C--Users-Bijit-Krishna-Sarkar-Downloads-Student-2/75726b42-15d9-40a2-bedf-8b86da401a27/scratchpad/congov/skills`):
- `F/curriculum-framework/SKILL.md` and every file in `F/curriculum-framework/references/` (object-model, production-rule, link-types, writing-rules, maths-profile). Follow them exactly.
- `F/build-knowledge-graph/references/data-format.md` (record format) and `F/build-knowledge-graph/examples/rational-numbers-example.json` (house style: match its level of detail in every field).
- `F/check-knowledge-graph/SKILL.md` step 3: the judgment checks your records must pass.

Existing graphs, read-only. NEVER modify them:
- PAL graph: `C:/Users/Bijit Krishna Sarkar/Downloads/Content Governance/PAL Maths Grades 6-10 Knowledge Graph/graph-data.json` (Grades 6 to 10 NCERT outcomes; built domains RN and RP; 65 skills, 92 knowledge items).
- Student 1 MYP2 graph (Grade 7 level, school course): `C:/Users/Bijit Krishna Sarkar/Downloads/Student 1/myp2-knowledge-graph/graph-data.json` (133 skills, 234 knowledge items in RN, NN, RP, AG, DA, PR, GE, ME).
- Student 1 integers graph: `C:/Users/Bijit Krishna Sarkar/Downloads/Student 1/integers-plan/knowledge-graph/graph-data.json`.
- This graph's copied RN and RP fragment: `C:/Users/Bijit Krishna Sarkar/Downloads/Student 2/knowledge-graph/fragments/RN_RP.json` (the Grade 8 rational-number and proportion records already in this graph; reuse their knowledge items by id).

Working folder: `C:/Users/Bijit Krishna Sarkar/Downloads/Student 2/knowledge-graph/` (holds `skeleton.json`, `merge.py`). Write ONLY your own fragment file in `fragments/`. Use `python -X utf8 -I` for every Python run.

## What to produce

Apply the production rule to every outcome in your group:
- outcome-task skills, one per task type that shows the outcome as written (for "solves problems", the task is a problem; for "verifies", the task is a verification; for "proves", the task is a justification);
- step skills only where needed, each with `part_of` marked always or sometimes;
- full records for every skill;
- knowledge items with the three tests, kind, rationale, first_grade (the grade at which NCERT first expects the item);
- requires links with basis (and `helpful: true` where not required), ki_requires links, and typed links (is format of, contrasts with, extends, revisits) each with a one-sentence reason.

Every authored skill has review "pending". Conditions must be real NCERT Class 8 conditions (number ranges, forms, contexts, response mode). A teaching representation (number line, grid, tiles, compasses) enters a skill only when the outcome states it. Separation learners are specific learners giving a specific wrong answer with real numbers. The outcome's own example clause sets scope where there is one. Performances the textbook chapter teaches but the outcome does not ask for are left out and listed in the findings.

### Reuse before you author

- If an existing knowledge item (PAL, MYP2, integers or RN_RP fragment) already states the mathematics, copy the record verbatim with its id. Never write a second item with the same meaning.
- If an existing skill is the same performance at the Grade 8 scope, copy it verbatim with its id, except: set `outcome` to the Grade 8 outcome id, add `"source_outcome": "<its original outcome id>"`, and drop any `part_of` entry whose target you are not also copying (list each dropped entry in your findings). Copy every knowledge item a copied skill requires, and the ki_requires links among the items you copy. A separation neighbour must be a skill present in your fragment (copy it if needed, or point to a different neighbour only if you are authoring a new skill).
- If an existing skill is close but its range or conditions differ from what Grade 8 asks (for example MYP2's "Finds the square root of a square number" against NCERT's square roots by prime factorisation and by the division method), author a new skill and add an `extends` link from the existing one (copy the existing one too if you link to it).
- A copied knowledge item keeps its first_grade even when NCERT places it in a different grade; list each such item in your findings with the NCERT grade, and the merger will set it centrally.

### Ids for NEW records

Use only your ranges (two digits, continue upward, never reuse an id). They start after the highest id in the MYP2 graph so the graphs can be merged later:
- see the RANGES line in your task message.

If you need a knowledge item that belongs to another group's domain (for example a fraction fact inside pie charts, or an exponent fact inside mensuration), first look for it in the existing graphs and copy it. If it is not there, author it in YOUR range and list it under `cross_domain_kis` so the merger can deduplicate.

## Fragment format

Write `fragments/<GROUP>.json`:

```json
{"group": "<GROUP>", "built_domains": ["..."],
 "skills": [], "knowledge_items": [], "ki_requires": [], "links": [], "routes": [],
 "findings": {"<domain code>": "- markdown bullets"},
 "copied": {"skills": [], "knowledge_items": []},
 "cross_domain_kis": [{"id": "...", "statement": "...", "why": "..."}],
 "first_grade_notes": [{"id": "KI-..", "copied_first_grade": 7, "ncert_first_grade": 8}]}
```

Findings per domain must list: performances left out because the outcome does not ask for them; the reading used for every vague or damaged outcome; knowledge items that fail a test; copied records and anything dropped or changed; step cases that are not absorbed; kind classifications where two readings are possible; anything in the source that looks wrong. Follow the writing rules in findings too (no "name/named/naming" unless literal, no "survive", no metaphor, terms from the source).

## Check before you finish

From the working folder run
`python -X utf8 -I merge.py fragments/_test_<GROUP>.json fragments/RN_RP.json fragments/<GROUP>.json`
then
`python -X utf8 -I "F/build-knowledge-graph/scripts/check_graph.py" fragments/_test_<GROUP>.json --report fragments/_check_<GROUP>.md`
(write out the F path in full). Fix every error. Fix warnings where the fix is clear; ignore "in a built domain but has no skills" only for outcomes outside your group. Delete the `_test_` and `_check_` files when done.

## Report back (short)

Counts (skills new and copied, outcome tasks and steps, knowledge items new and copied, links), remaining warnings, and the 3 to 6 judgment calls a reviewer should look at first. Do not paste the records.
