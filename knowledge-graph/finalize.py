"""Turn merged-raw.json into graph-data.json: fold duplicate knowledge items written by two groups, set the
first expected grade of copied items to NCERT's placement, add one route in NCERT textbook chapter order, and
record what changed. Usage: python -X utf8 -I finalize.py"""
import json, os, re

here = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(here, "merged-raw.json"), encoding="utf-8"))
SK = {s["id"]: s for s in d["skills"]}
KI = {k["id"]: k for k in d["knowledge_items"]}
notes = []

# 1. Duplicate knowledge items written by two groups: dropped id -> kept id(s). Filled after reading the fragments.
FOLD = json.load(open(os.path.join(here, "fold.json"), encoding="utf-8")) if os.path.exists(os.path.join(here, "fold.json")) else {}


def remap(ids):
    out = []
    for i in ids:
        for j in FOLD.get(i, [i]):
            if j not in out:
                out.append(j)
    return out


for s in d["skills"]:
    reqs, seen = [], set()
    for r in s.get("requires", []):
        for j in remap([r["ki"]]):
            if j in seen:
                continue
            seen.add(j)
            reqs.append(dict(r, ki=j))
    s["requires"] = reqs
kr, seen = [], set()
for r in d["ki_requires"]:
    for a in remap([r["from"]]):
        for b in remap([r["to"]]):
            if a != b and (a, b) not in seen:
                seen.add((a, b))
                kr.append(dict(r, **{"from": a, "to": b}))
d["ki_requires"] = kr
for l in d["links"]:
    l["from"], l["to"] = remap([l["from"]])[0], remap([l["to"]])[0]
d["knowledge_items"] = [k for k in d["knowledge_items"] if k["id"] not in FOLD]
if FOLD:
    notes.append("- Duplicate knowledge items folded (dropped into kept): " + "; ".join(f"{a} into {', '.join(b)}" for a, b in FOLD.items()) + ".")

# 2. First expected grade of copied items, as NCERT places them (collected from the fragments' first_grade_notes)
FG = {}
for f in sorted(os.listdir(os.path.join(here, "fragments"))):
    if f.endswith(".json") and not f.startswith("_"):
        g = json.load(open(os.path.join(here, "fragments", f), encoding="utf-8"))
        for n in g.get("first_grade_notes", []):
            FG[n["id"]] = n["ncert_first_grade"]
FG.pop("KI-PR-13", None); FG.pop("KI-PR-18", None)  # the DA_PR group placed these in Class 9 from memory only; left as copied
changed = []
for i, gr in FG.items():
    i = remap([i])[0]
    if i in KI and KI[i]["first_grade"] != gr:
        changed.append(f"{i} ({KI[i]['first_grade']} to {gr})")
        KI[i]["first_grade"] = gr
if changed:
    notes.append("- First expected grade set to NCERT's placement on copied items (the source graphs are unchanged): " + ", ".join(changed) + ".")

# 2b. SK-ME-05 (perimeter of a triangle, parallelogram or trapezium) was copied only as a separation neighbour; no Grade 8
#     outcome asks for a perimeter, so it is removed and SK-ME-02 gets an in-graph neighbour (a change to the copy in this graph only).
d["skills"] = [s for s in d["skills"] if s["id"] != "SK-ME-05"]
SK.pop("SK-ME-05", None)
SK["SK-ME-02"]["separation"] = {"neighbour": "SK-ME-01",
    "learner": "A learner finds the area of a parallelogram with base 8 cm and height 5 cm as 40 cm² but gives the area of a triangle with base 8 cm and height 5 cm as 40 cm² too, leaving out the half."}
d["links"] = [l for l in d["links"] if "SK-ME-05" not in (l["from"], l["to"])]
for s in d["skills"]:
    s["part_of"] = [p for p in s.get("part_of", []) if p["skill"] != "SK-ME-05"]
notes.append("- SK-ME-05 (perimeter), copied by the ME group only to serve as SK-ME-02's separation neighbour, is removed: no Grade 8 outcome asks for a perimeter. On the copy of SK-ME-02 in this graph the neighbour is now SK-ME-01, with a learner who leaves out the half in the triangle formula. The contrasts-with link SK-ME-02 to SK-ME-05 goes with it.")
notes.append("- KI-PR-13 and KI-PR-18 keep first_grade 7 as copied; the DA_PR group placed them in Class 9 from memory only, and both are helpful requirements, so nothing gates on them.")
notes.append("- KI-AG-58 is folded into KI-NN-11 although only KI-AG-58 states the value of the number with its digits interchanged; that value follows from KI-NN-11 by substitution, and the digit-puzzle skill SK-AG-26 now requires KI-NN-11.")

# 3. Route: NCERT Class 8 Mathematics textbook chapter order (rationalised edition 2023-24, then the three chapters removed in 2023
#    in their old positions), outcome-task skills only. States teaching order only.
CHAPTERS = [
    ("1 Rational Numbers", ["LO-M801", "LO-M802"]),
    ("2 Linear Equations in One Variable", ["LO-M806"]),
    ("3 Understanding Quadrilaterals", ["LO-M811", "LO-M812"]),
    ("4 Data Handling", ["LO-M819", "LO-M820"]),
    ("5 Squares and Square Roots; 6 Cubes and Cube Roots", ["LO-M804"]),
    ("7 Comparing Quantities", ["LO-M809"]),
    ("8 Algebraic Expressions and Identities", ["LO-M807", "LO-M808"]),
    ("9 Mensuration", ["LO-M816", "LO-M817", "LO-M818"]),
    ("10 Exponents and Powers", ["LO-M805"]),
    ("11 Direct and Inverse Proportions", ["LO-M810"]),
    ("Practical Geometry (removed 2023)", ["LO-M815"]),
    ("Visualising Solid Shapes (removed 2023)", ["LO-M813", "LO-M814"]),
    ("Playing with Numbers (removed 2023)", ["LO-M803"]),
]
steps = []
for ch, los in CHAPTERS:
    for lo in los:
        for s in d["skills"]:
            if s["outcome"] == lo and s["role"] == "outcome task":
                steps.append({"label": s["statement"], "skill": s["id"], "chapter": ch})
d["routes"] = [r for r in d["routes"] if r["id"] != "route-g8-ncert"] + [{
    "id": "route-g8-ncert", "domain": "", "source": "NCERT Class 8 Mathematics textbook, chapter order (2023-24 rationalised edition; the three removed chapters placed last)",
    "steps": steps}]

# 4. Findings for the merge
d["findings"]["Merge"] = "\n".join([
    "- Authored by ConveGenius, 24 Oct 2026, in five domain groups plus the copied RN and RP records, merged into one file. Review is pending for every authored record.",
    *notes,
    "- Route route-g8-ncert lists the outcome-task skills in NCERT Class 8 textbook chapter order; it states teaching order only.",
    "- The ConGov decision log was not read in this session; decided rows are copied from the PAL graph of 6 Oct 2026.",
])
d["meta"]["built_domains"] = [x for x in ["RN", "NN", "RP", "AG", "GE", "ME", "DA", "PR"] if x in d["meta"]["built_domains"]]
json.dump(d, open(os.path.join(here, "graph-data.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(d["skills"]), "skills,", len(d["knowledge_items"]), "knowledge items,", len(steps), "route steps,", len(changed), "first grades changed")
