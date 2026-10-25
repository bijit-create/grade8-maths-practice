"""Merge skeleton.json with fragment files into one graph file.
Usage: python -I merge.py <out.json> <fragment.json> [<fragment.json> ...]
Records with the same id must be identical (copied records); otherwise the script stops."""
import json, os, sys

here = os.path.dirname(os.path.abspath(__file__))
out, frags = sys.argv[1], sys.argv[2:]
d = json.load(open(os.path.join(here, "skeleton.json"), encoding="utf-8"))
seen = {}


def add(kind, rec):
    k = (kind, rec["id"])
    if k in seen:
        if seen[k] != rec:
            sys.exit(f"CONFLICT: {kind} {rec['id']} differs between fragments")
        return
    seen[k] = rec
    d[kind].append(rec)


for f in frags:
    g = json.load(open(f, encoding="utf-8"))
    for s in g.get("skills", []):
        add("skills", s)
    for k in g.get("knowledge_items", []):
        add("knowledge_items", k)
    for r in g.get("ki_requires", []):
        if r not in d["ki_requires"]:
            d["ki_requires"].append(r)
    for l in g.get("links", []):
        if not any(x["from"] == l["from"] and x["to"] == l["to"] and x["type"] == l["type"] for x in d["links"]):
            d["links"].append(l)
    d["routes"] += g.get("routes", [])
    for dom, txt in g.get("findings", {}).items():
        d["findings"][dom] = (d["findings"].get(dom, "") + "\n" + txt).strip()
    for dom in g.get("built_domains", []):
        if dom not in d["meta"]["built_domains"]:
            d["meta"]["built_domains"].append(dom)

json.dump(d, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{out}: {len(d['skills'])} skills, {len(d['knowledge_items'])} knowledge items, "
      f"{len(d['ki_requires'])} item links, {len(d['links'])} links")
