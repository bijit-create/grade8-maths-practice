# Progress note: Grade 8 Mathematics (CBSE) knowledge graph

24 October 2026. Built for Student 2 (Grade 8, CBSE) with the congov-knowledge-graph plugin (newer copy unzipped from `Content Governance/congov-knowledge-graph.plugin`, which has the error layer and the ASCII vault titles). Source: the NCERT (2017) learning outcomes for Class VIII mathematics, M801 to M820, as recorded in SLOF and quoted in the PAL Maths Grades 6-10 graph of 6 Oct 2026. All eight domains in one pass, as for the Student 1 MYP2 graph; the plugin's one-domain-per-checkpoint rule was not followed, so every judgment call below is still open for Bijit.

- **Outcomes:** 20 (M801 to M820), quoted exactly, grade 8. Domains: RN 2, NN 3, AG 3, RP 2, GE 5, ME 3, DA 1, PR 1.
- **Skills:** 119 (91 new, 28 copied: 15 from the PAL graph for M801, M802, M809, M810, and 13 from the Student 1 MYP2 graph with `source_outcome`). Outcome tasks 102, steps 17. By domain: NN 32, GE 25, AG 17, ME 17, RP 10, DA 8, RN 5, PR 5.
- **Knowledge items:** 258 (142 new, 116 copied). Kinds: 112 principle, 71 concept, 51 procedure, 24 fact or term. First expected grade: 129 at Grade 8, 61 at Grade 6, 59 at Grade 7, 9 earlier.
- **Links:** 358 skill requires (49 helpful), 303 item-to-item requires, 57 is part of (34 always; 13 absorbed, 44 not absorbed), 31 contrasts with, 27 extends, 4 is format of, 3 revisits. One route, `route-g8-ncert`, in NCERT textbook chapter order (102 steps).
- **Check:** 0 errors; 2 warnings, both on KI-RN-30 (single-digit multiplication facts, fails the sentence test), inherited from the PAL graph.
- **Not changed:** the Central Framework, the PAL graph, the Student 1 graphs. Copies changed in this graph only: SK-RP-19's neighbour, SK-ME-02's neighbour, SK-PR-05 and SK-PR-08 made steps, 15 first expected grades set to NCERT's placement (listed under findings "Merge" and in each domain's findings).
- **Decision log:** not read (no access to the ConGov project from this session). Decided rows copied from the PAL graph, 6 Oct.
- **Plugin gap found:** the page template has no style for the "revisits" link type, so a graph with a revisits link draws no edges at all (the MYP2 graph had none and did not show it). `page_fix.py` adds the style on the generated page; the plugin's `page_template.html` should get the same line.
- **Error layer:** not derived. `derive_errors.py` in the plugin copy can seed it from the separation tests when wanted.

## Open questions for Bijit

1. **Decided 24 Oct 2026 (Bijit): keep.** Scope added from the textbook, not the outcome text. M804: deciding perfect squares and cubes and the smallest multiplier or divisor (SK-NN-14 to 17). M805: standard form (SK-NN-29 to 31). M812: finding unknown sides, angles and diagonal segments (SK-GE-15, 16). M820: expected counts and comparing with theoretical probability (SK-PR-10, 11). Bijit chose to keep all of them in this learner's graph; each still carries its note that the outcome text does not ask for it.
2. **M815 and the protractor.** Three constructions (SK-GE-28 to 30) need angles set with a protractor, which the outcome does not state. Keep or drop.
3. **M813.** Oblique and isometric sketches (SK-GE-21, 22) are Grade 7 content in NCERT; views (SK-GE-19, 20) are Grade 8. Nets and maps were left out.
4. **M816 split.** SK-ME-15 estimates on the grid; SK-ME-16 verifies a given estimate by formula. A combined estimate-and-verify task is the other reading.
5. **M808 reading.** "Problems of daily life" is read as the textbook's numerical evaluations (103², 98 × 102); no worded situation exists in the chapter. Factorisation with identities is left out.
6. **Conditions from recall.** The authors did not open the NCERT textbook; ranges, example numbers and some first expected grades come from memory of the pre-2023 edition and are marked "not checked" in item notes (about 190 items carry a note). A pass against the printed textbook would settle them.
7. **Kinds with two readings** are noted on the items concerned (divisibility rules KI-NN-17 to 23 as principle or procedure; a few concept-or-fact items). Each one moves a gate.
8. **Gates:** row 15 (6 Oct) against the Central Framework revision of 10 Oct (all knowledge before training). With 112 principles, this decides a lot.
9. **Removed chapters.** M803, M813, M814 and M815 belong to chapters removed from the NCERT textbook in 2023; the outcomes stand in SLOF. Whether this learner's school still teaches them decides whether to plan from them.

## Files

`graph-data.json` (source of truth), `vault/` (Obsidian), `graph-page.html` (published at https://claude.ai/artifact/U9Hi5YZxuqKo46YFZLsyGQ), `check-report.md`. To rebuild: `skeleton.py`, `copy_rn_rp.py`, then `merge.py merged-raw.json fragments/*.json`, `finalize.py` (uses `fold.json`), `check_graph.py`, `build_graph.py`, `page_fix.py`. `BRIEF.md` is the authoring brief the five domain groups followed; `fragments/` holds their output.
