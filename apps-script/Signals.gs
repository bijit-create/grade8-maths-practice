/* Signals tab for Bijit: which planned misreadings Student 2's answers fit, how firmly, and what is not known yet.
   It reads the Activity tab and rewrites the tab "Signals" each time answers arrive (doPost in Code.gs calls updateSignals).
   Student 2 never sees this tab. Chosen by Bijit on 11 Nov 2026.
   Install: in the Sheet, Extensions > Apps Script, click + beside Files > Script, name it Signals, paste this file, Save.
   Then paste the new Code.gs, Save, and Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy.
   To write the tab straight away, choose updateSignals in the Run menu of the editor and click Run.
   Rules it keeps (CLAUDE.md): a wrong answer suggests a possibility and does not establish a misconception; one answer is
   worded as a possibility; "not reached" is never shown as "understood"; time taken is never used.
   READINGS maps each misreading tag recorded by the practice page ki-ag-01-03.html (detail.tag) to the name used in the
   approved spec of 9 Nov 2026 (study-materials/ki-understanding-AG01-AG03.md). fromSpec:false means the spec gives that
   answer a reply but no name, so the term is a plain description. The examples use x and one set of numbers. */

const SIGNALS = 'Signals';
const SIGNAL_SETS = ['ki-ag-01', 'ki-ag-03'];
/* The kinds of task in the authored order of ki-ag-01-03.html (build brief, 9 Nov 2026). */
const PLAN = ['S1a','S3','S2a','S4a','S5b','S2z','S6','S4c','S5d','S4b','S2d','S7','S5c',
              'T1pos','T2a','T1letter','T1eq','T1incWhy','T3a','T4a','T2b','T1times','T3b','T5','T6','T4b'];

const READINGS = {
  "letter value only": {
    term: "value of the letter given in place of the value of the expression",
    rule: "The answer is the number that x stands for, and the operation is not carried out. For x + 4 with x = 6 the answer given is 6, not 6 + 4 = 10.",
    kinds: ["S1a", "S1b", "S1c"],
    fromSpec: false
  },
  "letter ignored": {
    term: "letter ignored",
    rule: "The answer is the number written in the expression, and x is left out. For x + 4 with x = 6 the answer given is 4, not 6 + 4 = 10.",
    kinds: ["S1a", "S1c"],
    fromSpec: true
  },
  "juxtaposed": {
    term: "3x read as a two-digit number",
    rule: "The value of x is written beside the number as a digit. For 5x with x = 3 the answer given is 53, not 5 × 3 = 15. In S1a the same tag marks x + 4 with x = 6 answered as 64, and the spec gives that answer a reply but no name.",
    kinds: ["S1a", "S3", "S7"],
    fromSpec: true
  },
  "3x as two-digit number": {
    term: "3x read as a two-digit number",
    rule: "The value of x is written beside the coefficient as a digit. For 3x + 2 with x = 5 the answer given is 35 + 2 = 37, not 3 × 5 + 2 = 17.",
    kinds: ["T2a"],
    fromSpec: true
  },
  "operation": {
    term: "wrong operation",
    rule: "The answer uses a different operation from the one written or described. x − 4 with x = 9 is answered as 9 + 4 = 13, or '4 more than x' is written as x − 4.",
    kinds: ["S1b", "S5a", "S5b", "S5d", "T4b"],
    fromSpec: false
  },
  "letter as object": {
    term: "letter as object",
    rule: "The letter is read as the things and not as a number. x is read as the pens, not the number of pens, and 5x is read as 5 pens, not 5 × x.",
    kinds: ["S3", "S7"],
    fromSpec: true
  },
  "letter as cost": {
    term: "letter read as a different quantity in the story",
    rule: "x is read as the cost of the pens. x is the number of pens, and the cost in rupees is 5x.",
    kinds: ["S3"],
    fromSpec: false
  },
  "5x as 5 + x": {
    term: "3x read as 3 + x",
    rule: "The coefficient is added to x and not multiplied by it. For 5x with x = 3 the answer given is 5 + 3 = 8, not 5 × 3 = 15.",
    kinds: ["S3", "S7"],
    fromSpec: true
  },
  "3x as 3 + x": {
    term: "3x read as 3 + x",
    rule: "The coefficient is added to x and not multiplied by it. For 3x + 2 with x = 5 the answer given is 3 + 5 + 2 = 10, not 3 × 5 + 2 = 17. For 4x − 1 she chooses 'add 4, then take away 1'.",
    kinds: ["T2a", "T2b"],
    fromSpec: true
  },
  "one x counted": {
    term: "repeated letter counted once",
    rule: "Only one x is given its value. For x + x + 2 with x = 3 the answer given is 3 + 2 = 5, not 3 + 3 + 2 = 8.",
    kinds: ["S4a"],
    fromSpec: false
  },
  "each x a different number": {
    term: "each x in x + x a different number",
    rule: "She says that in x + x the first x can be 2 and the second x can be 5. Every x in one expression stands for the same number.",
    kinds: ["S4b"],
    fromSpec: true
  },
  "different letters must differ": {
    term: "x and y must differ",
    rule: "She says that x and y cannot stand for the same number. x = 5 and y = 5 is allowed.",
    kinds: ["S4c"],
    fromSpec: true
  },
  "order reversed": {
    term: "order reversed",
    rule: "The two parts of a subtraction are in the opposite order. '4 less than x' is written as 4 − x, not x − 4, or x − 4 is read as 'x less than 4'.",
    kinds: ["S5b", "S5d", "T4b"],
    fromSpec: true
  },
  "times as plus": {
    term: "multiplication written as addition",
    rule: "'3 times x' is written as x + 3, not 3x. '2 more than 3 times x' is written as x + 5, not 3x + 2.",
    kinds: ["S5c", "T4a"],
    fromSpec: false
  },
  "boundary": {
    term: "strict inequality read as non-strict",
    rule: "The boundary value is given for 'more than'. For x + 2 > 10 she gives x = 8, where x + 2 = 10.",
    kinds: ["S6"],
    fromSpec: false
  },
  "letter as count": {
    term: "5x read as the quantity x",
    rule: "5x is said to stand for the number of pens, which is x. 5x is 5 × x, the cost of the pens in rupees.",
    kinds: ["S7"],
    fromSpec: false
  },
  "expression must have =": {
    term: "an expression must have an answer, so it needs = (the operational reading of =)",
    rule: "2x − 5 = 9 is accepted as an expression, or 'x −' is said not to be an expression because it has no equals sign.",
    kinds: ["T1eq", "T1incWhy"],
    fromSpec: true
  },
  "incomplete accepted": {
    term: "incomplete form accepted as an expression",
    rule: "'x −' is accepted as an expression, although the − sign has nothing after it.",
    kinds: ["T1inc", "T1incWhy"],
    fromSpec: false
  },
  "3(x + 2)": {
    term: "3x + 2 read as 3(x + 2)",
    rule: "The addition is done before the multiplication. For 3x + 2 with x = 5 the answer given is 3 × (5 + 2) = 21, not 3 × 5 + 2 = 17.",
    kinds: ["T2a"],
    fromSpec: true
  },
  "order of operations": {
    term: "3x + 2 read as 3(x + 2)",
    rule: "The subtraction is placed before the multiplication. For 4x − 1 she chooses 'take away 1, then multiply by 4', which is 4(x − 1).",
    kinds: ["T2b"],
    fromSpec: true
  },
  "same numbers, same expression": {
    term: "expressions with the same numbers are the same",
    rule: "She says that 5x + 2 and x + 5 have the same value for every x. With x = 2 they are 12 and 7.",
    kinds: ["T3b"],
    fromSpec: true
  },
  "numbers swapped": {
    term: "order of operations lost",
    rule: "The multiplier and the number added change places. '2 more than 3 times x' is written as 3 + 2x, not 3x + 2.",
    kinds: ["T4a"],
    fromSpec: true
  },
  "conjoining": {
    term: "conjoining",
    rule: "The terms 3x and 2 are joined into one term. 3x + 2 is written as 5x, or the statement 3x + 2 = 5x is accepted.",
    kinds: ["T4a", "T5"],
    fromSpec: true
  },
  "no letter": {
    term: "numerical expression given where an expression with the letter was asked for",
    rule: "The answer has no x in it. For an expression with x that is 11 when x is 3, she writes 11 or 8 + 3.",
    kinds: ["T6"],
    fromSpec: false
  }
};

const KINDS = {
  "S1a": { stop: "ki-ag-01", task: "She works out the value of x + 4 for a given x." },
  "S1b": { stop: "ki-ag-01", task: "She works out the value of x − 2 for a given x." },
  "S1c": { stop: "ki-ag-01", task: "She works out the value of 3 + x for a given x." },
  "S2a": { stop: "ki-ag-01", task: "She says whether x + 4 can be 20, then gives the number that x stands for." },
  "S2z": { stop: "ki-ag-01", task: "She says whether x + 4 can be 4, then gives the number that x stands for, which is 0." },
  "S2d": { stop: "ki-ag-01", task: "She says whether x + x can be 7, then gives the number that x stands for, which is 3.5." },
  "S3": { stop: "ki-ag-01", task: "She chooses what the letter stands for in a story, then works out 5x for a given number of things." },
  "S4a": { stop: "ki-ag-01", task: "She works out the value of x + x + 2 for a given x." },
  "S4b": { stop: "ki-ag-01", task: "She says whether the two x's in x + x can stand for different numbers." },
  "S4c": { stop: "ki-ag-01", task: "She says whether two different letters can stand for the same number." },
  "S5a": { stop: "ki-ag-01", task: "She writes '4 more than a number x' as an expression." },
  "S5b": { stop: "ki-ag-01", task: "She writes '4 less than a number x' as an expression." },
  "S5c": { stop: "ki-ag-01", task: "She writes '3 times a number x' as an expression." },
  "S5d": { stop: "ki-ag-01", task: "She chooses the words that say what x − 4 means." },
  "S6": { stop: "ki-ag-01", task: "She gives a number for x that makes x + 2 more than 10, then a second, different number." },
  "S7": { stop: "ki-ag-01", task: "She judges the worked answer '5x means 5 pens', chooses what 5x stands for, then works out 5x." },
  "T1pos": { stop: "ki-ag-03", task: "She says whether 2x − 5 is an expression." },
  "T1letter": { stop: "ki-ag-03", task: "She says whether a letter alone, such as y, is an expression." },
  "T1times": { stop: "ki-ag-03", task: "She says whether 4 × x is an expression." },
  "T1eq": { stop: "ki-ag-03", task: "She says whether the equation 2x − 5 = 9 is an expression." },
  "T1inc": { stop: "ki-ag-03", task: "She says whether the incomplete form 'x −' is an expression." },
  "T1incWhy": { stop: "ki-ag-03", task: "She says whether 'x −' is an expression, then chooses the reason it is not." },
  "T2a": { stop: "ki-ag-03", task: "She works out the value of 3x + 2 for a given x." },
  "T2b": { stop: "ki-ag-03", task: "She chooses what is done to the number x in 4x − 1." },
  "T3a": { stop: "ki-ag-03", task: "She works out 5x + 1 and 1 + 5x for one x, then says whether they have the same value for every x." },
  "T3b": { stop: "ki-ag-03", task: "She works out 5x + 2 and x + 5 for one x, then says whether they have the same value for every x." },
  "T4a": { stop: "ki-ag-03", task: "She writes '2 more than 3 times a number x' as an expression." },
  "T4b": { stop: "ki-ag-03", task: "She writes '5 less than 2 times a number x' as an expression." },
  "T5": { stop: "ki-ag-03", task: "She judges the worked answer 3x + 2 = 5x, then works out 3x + 2 and 5x for one x." },
  "T6": { stop: "ki-ag-03", task: "She writes her own expression with x that has a given value when x is a given number." }
};

/* One function from Activity rows (objects keyed by the Activity column names) to the three parts of the list. */
function signalsFromRows(rows) {
  const dayOf = ts => { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const ans = rows.filter(r => r.event === 'answer' && SIGNAL_SETS.includes(r.set)).map((r, i) => {
    let d = {}; try { d = JSON.parse(String(r.detail || '{}').replace(/^'/, '')); } catch (e) {}
    return { i: i, day: dayOf(r.ts), kind: d.kind || '', tag: d.tag || '', right: Number(r.right) === 1,
      own: Number(r.own) === 1 && r.support === 'none', support: r.support, role: r.role, eq: r.eq, answer: r.answer,
      done: d.itemDone === true, itemRight: d.itemRight === true };
  });
  /* What happened on her next task of the same kind, after the reply to this answer. */
  const nextOfKind = a => {
    if (!a.kind) return 'none';
    const end = ans.find(b => b.i >= a.i && b.kind === a.kind && b.done);
    const nxt = ans.find(b => b.i > (end ? end.i : a.i) && b.kind === a.kind && b.done);
    return nxt ? (nxt.itemRight ? 'right' : 'not right') : 'none';
  };
  const kindsOf = term => [...new Set(Object.values(READINGS).filter(r => r.term === term).flatMap(r => r.kinds))].filter(k => PLAN.includes(k));
  const ownTasks = kinds => ans.filter(b => b.own && b.done && kinds.includes(b.kind));

  const seen = {}, unplanned = [];
  ans.filter(a => !a.right).forEach(a => {
    const R = READINGS[a.tag];
    if (!R) { unplanned.push(Object.assign({ next: nextOfKind(a) }, a)); return; }
    const s = seen[R.term] || (seen[R.term] = { term: R.term, rules: [], fromSpec: R.fromSpec, misses: [] });
    if (!s.rules.includes(R.rule)) s.rules.push(R.rule);
    s.misses.push(Object.assign({ next: nextOfKind(a) }, a));
  });
  const fits = Object.values(seen).map(s => {
    const lastDay = s.misses[s.misses.length - 1].day;
    const later = ownTasks(kindsOf(s.term)).filter(b => b.day > lastDay);
    return Object.assign(s, { times: s.misses.length, kinds: [...new Set(s.misses.map(m => m.kind))],
      own: s.misses.filter(m => m.own).length, days: [...new Set(s.misses.map(m => m.day))],
      later: { days: [...new Set(later.map(b => b.day))], tasks: later.length, notRight: later.filter(b => !b.itemRight).length } });
  }).sort((a, b) => b.kinds.length - a.kinds.length || b.times - a.times);

  const notSeen = [...new Set(Object.values(READINGS).map(r => r.term))].filter(t => !seen[t]).map(term => {
    const kinds = kindsOf(term), done = ownTasks(kinds);
    /* Where the wrong answers on these tasks are listed: under another reading in part 1, or in part 2. */
    const wrong = ans.filter(a => !a.right && a.own && kinds.includes(a.kind));
    return { term: term, kinds: kinds, reached: kinds.filter(k => done.some(b => b.kind === k)), tasks: done.length, notRight: done.filter(b => !b.itemRight).length,
      under: [...new Set(wrong.filter(a => READINGS[a.tag]).map(a => READINGS[a.tag].term))], inPart2: wrong.some(a => !READINGS[a.tag]) };
  });
  return { fits: fits, unplanned: unplanned, notSeen: notSeen, days: [...new Set(ans.map(a => a.day))].sort(), answers: ans.length, wrong: ans.filter(a => !a.right).length };
}

/* The list as rows of six cells, with a style for each row. The Sheet and the preview page both draw these rows. */
function signalsTable(S) {
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const date = d => Number(d.slice(8)) + ' ' + MON[Number(d.slice(5, 7)) - 1];
  const dates = a => a.length < 3 ? a.map(date).join(' and ') : a.slice(0, -1).map(date).join(', ') + ' and ' + date(a[a.length - 1]);
  const task = k => KINDS[k] ? KINDS[k].task : '';
  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const next = { 'right': 'Her answer was right.', 'not right': 'Her answer was not right.', 'none': 'She has not had another task of this kind yet.' };
  const help = a => a.own ? 'None' : a.support === 'worked example on screen' ? 'The worked example' : a.support === 'worked lines on screen' ? 'The worked lines' : 'Yes';
  const T = [];
  const add = (style, ...cells) => { while (cells.length < 6) cells.push(''); T.push({ style: style, cells: cells.map(c => String(c == null ? '' : c)) }); };

  add('title', "Signals from Student 2's answers");
  add('text', 'The script writes this tab again each time her answers arrive. Anything typed here is replaced.');
  add('text', S.answers ? 'This list reads ' + plural(S.answers, 'answer') + ' recorded ' + (S.days.length > 2 ? 'from ' + date(S.days[0]) + ' to ' + date(S.days[S.days.length - 1]) : 'on ' + dates(S.days)) + ' for two knowledge items. ' + (S.answers - S.wrong) + (S.answers - S.wrong === 1 ? ' was' : ' were') + ' right and ' + S.wrong + (S.wrong === 1 ? ' was' : ' were') + ' not right.'
                        : 'There are no answers for these two knowledge items yet.');
  add('text', 'KI-AG-01 is the meaning of a variable (a letter stands for a number that can take different values).');
  add('text', 'KI-AG-03 is the meaning of an algebraic expression (numbers and variables joined by operation signs, with no equals sign).');
  add('text', 'A reading is a wrong way to understand the mathematics, such as taking 5x as 5 pens. The practice page knows the wrong answer that each reading gives. When her answer is that wrong answer, it fits the reading.');
  add('text', 'A wrong answer suggests a possibility. It does not establish what she thinks.');
  add('text', 'After each wrong answer the page showed her a reply with the right working, and then gave her a fresh task of the same kind.');
  add('text', 'The rules and the kinds of task are written with x and sample numbers. Her questions use other letters and other numbers.');

  add('blank');
  add('h2', '1. Readings that her answers fit');
  if (!S.fits.length) add('text', 'No wrong answer has matched a planned reading.');
  S.fits.forEach(f => {
    add('blank');
    add('h3', cap(f.term));
    f.rules.forEach(r => add('text', r));
    if (!f.fromSpec) add('text', 'The spec of 9 Nov gives this answer a reply but no name. The name here is a description.');
    const firm = f.times === 1 ? 'One answer fits this reading. A single answer can be a slip.'
      : f.kinds.length === 1 ? f.times + ' answers fit this reading, all in one kind of task. It remains a possibility until it appears in a second kind of task.'
      : f.times + ' answers fit this reading, in ' + f.kinds.length + ' kinds of task.';
    const how = f.own === f.times ? (f.times === 1 ? 'She gave it on her own' : f.times === 2 ? 'She gave both on her own' : 'She gave all of them on her own')
      : f.own === 0 ? (f.times === 1 ? 'She gave it with help on the screen' : 'She gave all of them with help on the screen')
      : 'She gave ' + f.own + ' on her own and ' + (f.times - f.own) + ' with help on the screen';
    add('strong', firm + ' ' + how + ', on ' + dates(f.days) + '.');
    add('th', 'Date', 'Kind of task', 'Question', 'Her answer', 'Her next task of this kind, after the reply', 'Help on the screen');
    f.misses.forEach(m => add('row', date(m.day), task(m.kind), m.eq, m.answer, next[m.next], help(m)));
    add('text', !f.later.tasks ? 'She has not yet had a task that can show this reading on a later day.'
      : 'On ' + dates(f.later.days) + ', a later day, she had ' + plural(f.later.tasks, 'task') + ' that can show this reading. '
        + (f.later.notRight ? f.later.notRight + ' of them ' + (f.later.notRight === 1 ? 'was' : 'were') + ' not right.' : f.later.tasks === 1 ? 'Her answer was right.' : 'All of her answers were right.'));
  });

  add('blank');
  add('h2', '2. Answers that fit no planned reading');
  add('text', 'These wrong answers match none of the planned readings. They are shown as she gave them.');
  add('text', 'The page records no reading for a worked-example step, for a task with the worked lines on the screen, or for some Yes or No questions.');
  if (!S.unplanned.length) add('text', 'There are no such answers.');
  else {
    add('th', 'Date', 'Kind of task', 'Question', 'Her answer', 'Her next task of this kind, after the reply', 'Help on the screen');
    S.unplanned.forEach(a => add('row', date(a.day), task(a.kind) || (a.role === 'worked example step' ? 'She completes one step of a worked example.' : a.role === 'supported' ? 'She answers one task with the worked lines on the screen.' : ''), a.eq, a.answer, next[a.next], help(a)));
  }

  const reached = S.notSeen.filter(n => n.reached.length), not = S.notSeen.filter(n => !n.reached.length);
  add('blank');
  add('h2', '3. Readings not seen');
  add('h3', 'She reached tasks that can show these readings, and no answer fitted them.');
  if (!reached.length) add('text', 'There are none.');
  else {
    add('th', 'Kinds of task reached', 'Reading', 'Tasks of these kinds that she answered on her own', 'Kinds of task not reached yet');
    const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
    const where = n => { const p = []; if (n.under.length) p.push('under ' + list(n.under.map(cap)) + ' in part 1'); if (n.inPart2) p.push('in part 2'); return p.join(' and '); };
    reached.forEach(n => add('row', n.reached.length + ' of ' + n.kinds.length, n.term, plural(n.tasks, 'task') + '. '
      + (n.notRight ? n.notRight + (n.notRight === 1 ? ' was' : ' were') + ' not right, and no wrong answer fitted this reading. The wrong ' + (n.notRight === 1 ? 'answer is ' : 'answers are ') + where(n) + '.' : n.tasks === 1 ? 'It was right.' : 'All were right.'),
      n.kinds.filter(k => !n.reached.includes(k)).map(task).join('\n')));
  }
  add('blank');
  add('h3', 'She has not reached any task that can show these readings. Nothing is known about them yet.');
  if (!not.length) add('text', 'There are none.');
  else {
    add('th', 'Kinds of task reached', 'Reading', 'Kinds of task that can show it');
    not.forEach(n => add('row', '0 of ' + n.kinds.length, n.term, n.kinds.length ? n.kinds.map(task).join('\n') : 'No task in the planned set can show it.'));
  }
  return T;
}

/* Reads the Activity tab and rewrites the Signals tab. It changes no other tab. */
function updateSignals() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const act = ss.getSheetByName(ACTIVITY), last = act.getLastRow();
  const vals = last < 2 ? [] : act.getRange(2, 1, last - 1, ACTIVITY_COLS.length).getValues();
  const rows = vals.map(v => { const o = {}; ACTIVITY_COLS.forEach((c, i) => { o[c] = v[i]; }); return o; });
  const T = signalsTable(signalsFromRows(rows));
  const sh = ss.getSheetByName(SIGNALS) || ss.insertSheet(SIGNALS);
  sh.clear();
  [100, 330, 330, 170, 280, 150].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.getRange(1, 1, T.length, 6).setValues(T.map(r => r.cells.map(clean))).setVerticalAlignment('top').setWrap(true);
  const a1 = styles => T.map((r, i) => styles.includes(r.style) ? 'A' + (i + 1) + ':F' + (i + 1) : '').filter(String);
  const list = (styles, fn) => { const a = a1(styles); if (a.length) fn(sh.getRangeList(a)); };
  list(['title', 'text', 'h2', 'h3', 'strong'], l => l.setWrapStrategy(SpreadsheetApp.WrapStrategy.OVERFLOW));
  list(['title', 'h2', 'h3', 'strong', 'th'], l => l.setFontWeight('bold'));
  list(['title', 'h2'], l => l.setFontSize(13));
  list(['th'], l => l.setBackground('#f2f2f2'));
}
