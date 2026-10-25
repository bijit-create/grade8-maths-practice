"""Write fragments/RN_RP.json: the Grade 8 rational-number and proportion records already built in the
PAL Maths Grades 6-10 graph (outcomes M801, M802, M809, M810), copied verbatim with the knowledge items they
reach. The PAL graph is read only. One change is made to a copy in this graph and listed in the findings.
Usage: python -I copy_rn_rp.py"""
import json, os

here = os.path.dirname(os.path.abspath(__file__))
PAL = "C:/Users/Bijit Krishna Sarkar/Downloads/Content Governance/PAL Maths Grades 6-10 Knowledge Graph/graph-data.json"
pal = json.load(open(PAL, encoding="utf-8"))
g8 = {o["id"] for o in pal["outcomes"] if o["grade"] == 8}
skills = [json.loads(json.dumps(s)) for s in pal["skills"] if s["outcome"] in g8]
ids = {s["id"] for s in skills}
kis = {r["ki"] for s in skills for r in s["requires"]}
changed = True
while changed:
    changed = False
    for r in pal["ki_requires"]:
        if r["from"] in kis and r["to"] not in kis:
            kis.add(r["to"]); changed = True
items = [k for k in pal["knowledge_items"] if k["id"] in kis]
kr = [r for r in pal["ki_requires"] if r["from"] in kis]
links_in = [l for l in pal["links"] if l["from"] in ids and l["to"] in ids]
links_dropped = [l for l in pal["links"] if (l["from"] in ids) != (l["to"] in ids)]

# Change 1: SK-RP-19's separation neighbour in the PAL graph is SK-RP-12 (Grade 7 simple interest), not in this graph.
sk = {s["id"]: s for s in skills}
sk["SK-RP-19"]["separation"] = {
    "neighbour": "SK-RP-20",
    "learner": "A learner finds the compound interest on \u20b910,000 at 8% per year for 2 years as \u20b91,664 but, for \u20b910,000 at 10% per year for 1 year compounded half-yearly, gives \u20b92,100, using 10% for each half-year."}

findings = {
 "RN": "\n".join([
  "- M801 and M802: 5 outcome-task skills (SK-RN-38 to 42) and 12 knowledge items (KI-RN-07, 13, 54 to 63) copied verbatim from the PAL Maths Grades 6-10 graph (6 Oct 2026), where they were authored for these same outcomes. Review stays pending.",
  "- The PAL findings for RN apply: no Grade 8 outcome asks for calculating with rational numbers as such; M801 asks for the properties, so bare addition, subtraction, multiplication and division of rational numbers (PAL SK-RN-34 to 36, Grade 7) are not copied. A reviewer who wants them in this learner's graph can copy them from the PAL graph.",
  "- Route route-rn-v2 (V2 \u00a74.2) is not copied: its mapped steps are Grade 6 and 7 skills.",
 ]),
 "RP": "\n".join([
  "- M809 and M810: 10 skills (9 outcome tasks, 1 step: SK-RP-14 to 23) and 15 knowledge items (KI-RP-08 to 12, 14 to 21, 23, 25) copied verbatim from the PAL Maths Grades 6-10 graph (6 Oct 2026). Review stays pending.",
  "- Changed on the copy in this graph only: SK-RP-19's separation neighbour was SK-RP-12 (Grade 7, simple interest), which is not in this graph; it is now SK-RP-20 with a learner who compounds annually but uses the annual rate for each half-year.",
  "- Links left out because their other end is a Grade 6 or 7 skill not in this graph: " + "; ".join(f"{l['from']} {l['type']} {l['to']}" for l in links_dropped) + ".",
  "- Step case: SK-RP-21 (decides direct, inverse or neither) is always part of SK-RP-22 and SK-RP-23.",
  "- Left out because M809 does not ask for them (as in the PAL build): compound interest compounded quarterly; interest compounded for a fraction of a year; successive discounts.",
 ]),
}
frag = {"group": "RN_RP", "built_domains": ["RN", "RP"], "skills": skills, "knowledge_items": items, "ki_requires": kr,
        "links": links_in, "routes": [], "findings": findings,
        "copied": {"skills": sorted(ids), "knowledge_items": sorted(kis)}, "cross_domain_kis": []}
json.dump(frag, open(os.path.join(here, "fragments", "RN_RP.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(skills), "skills,", len(items), "items,", len(kr), "ki links,", len(links_in), "links kept,", len(links_dropped), "links dropped")
