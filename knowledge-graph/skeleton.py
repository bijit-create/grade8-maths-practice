"""Write skeleton.json: the 20 Grade 8 NCERT (2017) outcomes, quoted from the PAL Maths Grades 6-10 graph
(which quoted them from SLOF), plus meta, domains and decisions. The PAL graph is read only.
Usage: python -I skeleton.py"""
import json, os

here = os.path.dirname(os.path.abspath(__file__))
PAL = "C:/Users/Bijit Krishna Sarkar/Downloads/Content Governance/PAL Maths Grades 6-10 Knowledge Graph/graph-data.json"
pal = json.load(open(PAL, encoding="utf-8"))
outcomes = [dict(o) for o in pal["outcomes"] if o["grade"] == 8]
extra_notes = {
    "LO-M803": "The chapter that taught this (Playing with Numbers) was removed from the NCERT Class 8 textbook in the 2023 rationalisation; the outcome stands in SLOF.",
    "LO-M813": "The chapter that taught this (Visualising Solid Shapes) was removed from the NCERT Class 8 textbook in the 2023 rationalisation; the outcome stands in SLOF.",
    "LO-M814": "The chapter that taught this (Visualising Solid Shapes) was removed from the NCERT Class 8 textbook in the 2023 rationalisation; the outcome stands in SLOF.",
    "LO-M815": "The chapter that taught this (Practical Geometry) was removed from the NCERT Class 8 textbook in the 2023 rationalisation; the outcome stands in SLOF.",
    "LO-M818": "Read as: finds the surface area and volume of cuboids, cubes and cylinders.",
}
for o in outcomes:
    if o["id"] in extra_notes:
        o["note"] = (o["note"] + " " + extra_notes[o["id"]]).strip()
d = {
    "meta": {
        "title": "Grade 8 Mathematics Knowledge Graph (CBSE)",
        "page_title": "Grade 8 Maths Knowledge Graph",
        "page_subtitle": "Mathematics, Grade 8, CBSE; NCERT (2017) outcomes M801 to M820 from SLOF; skills and knowledge items authored by ConveGenius",
        "subject": "Mathematics", "profile": "maths", "grades": [8],
        "source": {"label": "NCERT (2017) learning outcomes for Class VIII mathematics, as recorded in the ConveGenius SLOF Learning Outcome Master Sheet (tab Grade 8), quoted via the PAL Maths Grades 6-10 graph of 6 Oct 2026",
                   "url": "https://docs.google.com/spreadsheets/d/1IKc2PaaJkBT0jHFCO0lIQRgDY2qjz3O3cfSSWQr96Bk/edit"},
        "built_domains": [], "gates": pal["meta"]["gates"],
        "reuse": "Records copied from the PAL Maths Grades 6-10 graph (6 Oct 2026) and the Student 1 MYP2 graph (24 Oct 2026) keep their ids and text. A copied skill keeps its outcome when that outcome is in this graph; otherwise its outcome field points to the Grade 8 outcome and the original is kept in source_outcome. Neither source graph is changed.",
    },
    "domains": {k: pal["domains"][k] for k in ["RN", "NN", "RP", "AG", "GE", "ME", "DA", "PR", "NA"]},
    "decisions": dict(pal["decisions"], **{
        "note": "Decided framework rows copied unchanged from the PAL graph (6 Oct 2026); the ConGov decision log was not read in this session (no access to the ConGov project)."}),
    "outcomes": outcomes, "skills": [], "knowledge_items": [], "ki_requires": [], "links": [], "routes": [], "findings": {}, "errors": [],
}
json.dump(d, open(os.path.join(here, "skeleton.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for o in outcomes:
    print(o["id"], o["domain"], o["text"][:90])
