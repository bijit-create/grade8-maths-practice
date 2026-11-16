# Written on 15 Nov 2026. Counts Student 2's answers from a CSV copy of the Activity tab of her Sheet.
# Run: python tests/count-first-answers.py <path to the CSV>. Standard library only. It reads; it changes nothing.
#
# The rule it applies:
# - Only rows on device d-54ufsm are used. Rows are grouped by date and practice set.
# - An item is one question. On the two equations pages (sets ki-ag-01, ki-ag-03, ki-ag-04, ki-ag-06) an item can
#   have several parts, one row per part; the item ends at the row whose Detail says itemDone. An item is right
#   only if every part was right.
# - W counts rows whose role is "worked example step". S counts role "supported". R counts role "review" or
#   "retrieval". W, S and R are counted one row at a time.
# - Own items are role "own", and role "practice" on the balance page (sets bags, counters, share, check).
#   An own item is class A ("after a reply") when the answer row just before it in the same set on the same
#   date, of any role, was not right, because a reply with the working had just been shown. An item with a
#   not-right part counts as a not-right answer here even when its last part was right. It is also class A
#   when the item before it in the set was cut off by a page restart and it is the same kind of question
#   (the page asks it again with a new letter). Every other own item is class F ("first answer").
# - An own item cut off by a "session start" row before it was finished is counted in its class by the parts
#   that were answered, right only if all of those were right, and marked cut off.
# - "unreadable answer" rows are not answers; they are counted per set.
# - On the balance page the Answer cell can hold "right first" or "after a reply" in place of her entry.
#   "after a reply" has Right = 0, so it counts as a not-right first answer.
# - An answer row with any other role (the balance page's "guided_practice") is listed under "does not fit"
#   and is not counted, but it still decides whether the next own item is class A.
# No diagnosis is made here.
import csv, json, sys

DEVICE = 'd-54ufsm'
EQ_SETS = {'ki-ag-01', 'ki-ag-03', 'ki-ag-04', 'ki-ag-06'}
BALANCE = {'bags', 'counters', 'share', 'check'}
CLASSES = ['F', 'A', 'W', 'S', 'R']


def main(path):
    with open(path, encoding='utf-8', newline='') as f:
        rows = list(csv.reader(f))
    table, order = {}, []      # (date, set) -> counts
    last_right = {}            # (date, set) -> was the last answer row right
    open_item = {}             # set -> own item not yet finished
    last_cut = {}              # set -> kind of the item a restart cut off
    wrong_f, wrong_w, misfit = [], [], []

    def cell(key):
        if key not in table:
            order.append(key)
            table[key] = {c: [0, 0] for c in CLASSES}
            table[key].update(cut=0, unreadable=0, lesson='')
        return table[key]

    def close(item, cut):
        t = cell(item['key'])
        right = all(p[1] for p in item['parts'])
        t[item['cls']][1] += 1
        t[item['cls']][0] += right
        t['cut'] += cut
        if cut:
            last_cut[item['key'][1]] = item['kind']
        if item['done_right'] is not None and item['done_right'] != right:
            misfit.append('row %d: Detail itemRight disagrees with the parts' % item['parts'][-1][0])
        if item['cls'] == 'F' and not right:
            n, _, q, a, tag = next(p for p in item['parts'] if not p[1])
            wrong_f.append((n, item['key'][1], q, a, tag + (' (cut off)' if cut else '')))

    for n, r in enumerate(rows[1:], 2):
        r = r + [''] * (16 - len(r))
        if r[13] != DEVICE:
            continue
        date, lesson, event, st, role = r[0][:11], r[1], r[3], r[4], r[5]
        try:
            d = json.loads(r[15]) if r[15] else {}
        except ValueError:
            d = {}
        if event == 'session start':
            for s in list(open_item):
                close(open_item.pop(s), 1)
            continue
        if event == 'unreadable answer':
            cell((date, st))['unreadable'] += 1
            continue
        if event != 'answer':
            continue
        key, right = (date, st), r[9] in ('1', 'TRUE', 'true')
        t = cell(key)
        t['lesson'] = lesson
        tag = d.get('tag') or ''
        own = role == 'own' or (role == 'practice' and st in BALANCE)
        if own:
            item = open_item.get(st)
            if item and st in EQ_SETS and d.get('part', 1) > 1 and d.get('kind') == item['kind']:
                item['parts'].append((n, right, r[6], r[8], tag))
            else:
                if item:
                    close(open_item.pop(st), 1)
                after_reply = last_right.get(key) is False
                asked_again = last_cut.pop(st, None) == d.get('kind', '?')
                item = {'key': key, 'cls': 'A' if after_reply or asked_again else 'F', 'kind': d.get('kind'),
                        'parts': [(n, right, r[6], r[8], tag)], 'done_right': None}
                open_item[st] = item
            if st not in EQ_SETS or d.get('itemDone') is True:
                if isinstance(d.get('itemRight'), bool):
                    item['done_right'] = d['itemRight']
                close(open_item.pop(st), 0)
        elif role in ('worked example step', 'supported', 'review', 'retrieval'):
            c = 'W' if role == 'worked example step' else 'S' if role == 'supported' else 'R'
            t[c][1] += 1
            t[c][0] += right
            if c == 'W' and not right:
                wrong_w.append((n, st, r[6], r[8], tag))
        else:
            misfit.append('row %d: %s, set %s, role "%s", %s, answer "%s", right %s'
                          % (n, date, st, role, r[6], r[8], r[9]))
        last_right[key] = right and not (own and st not in open_item and not all(p[1] for p in item['parts']))
    for s in list(open_item):
        close(open_item.pop(s), 1)

    print('CSV rows (with the heading row): %d' % len(rows))
    print('date | set | lesson | F | A | W | S | R | cut off | unreadable   (each is right / total)')
    for key in order:
        t = table[key]
        print(' | '.join([key[0], key[1], t['lesson']] + ['%d/%d' % tuple(t[c]) for c in CLASSES]
                         + [str(t['cut']), str(t['unreadable'])]))
    for title, lst in (('Not-right first answers (class F)', wrong_f), ('Not-right worked example steps (class W)', wrong_w)):
        print('\n%s: %d' % (title, len(lst)))
        for n, st, q, a, tag in lst:
            print('row %d | %s | %s | her answer: %s | tag: %s' % (n, st, q, a, tag or 'none'))
    print('\nDoes not fit: %d' % len(misfit))
    for m in misfit:
        print(m)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main(sys.argv[1])
