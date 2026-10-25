"""Small adjustments to the generated graph-page.html for this graph (the plugin's page_template.html is not changed):
a style for the "revisits" link type, which the template leaves out (without it every edge fails to draw when the graph
has a revisits link); short node labels for every domain; no error-layer button when the graph has no error patterns;
a route note that says what the one route is. Safe to run more than once.
Usage: python -X utf8 -I page_fix.py graph-page.html"""
import sys

p = sys.argv[1]
html = open(p, encoding="utf-8").read()
FIX = [
    ('  {k:"is format of", lab:"is format of", dash:"6 2 1 2", w:1.6, col:"--lo"},\n',
     '  {k:"is format of", lab:"is format of", dash:"6 2 1 2", w:1.6, col:"--lo"},\n  {k:"revisits", lab:"revisits", dash:"8 3", w:1.4, col:"--ki"},\n'),
    ('.replace("SK-RN-","S").replace("KI-RN-","K")', '.replace(/^(SK|KI)-/,"")'),
    ('tgBox.prepend(lb);', 'if((DATA.errors||[]).length) tgBox.prepend(lb);'),
    ('<p class="note">The yellow line joins route steps that have a skill.',
     '<p class="note">One route, in NCERT Class 8 textbook chapter order, joins the outcome-task skills (toggle it on the graph); it states teaching order only.'),
    ('<p class="note">Columns are grades.', '<p class="note">Columns are grades: knowledge items first expected before Grade 8 sit on the left, everything of Grade 8 on the right.'),
]
done = 0
for a, b in FIX:
    if b in html:
        continue  # already applied
    if a not in html:
        sys.exit(f"not found in page: {a[:60]}")
    html = html.replace(a, b)
    done += 1
open(p, "w", encoding="utf-8").write(html)
print(f"page fixed ({done} changes applied)")
