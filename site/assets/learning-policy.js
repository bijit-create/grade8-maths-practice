/* Shared, local learning evidence and next-work recommendations.
   These are conservative scheduling/coverage conventions, not mastery estimates.
   Existing page records are deliberately neither imported nor changed. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LearningPolicy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var KEY = 'student2-learning-v1';
  /* Reviewed for these mathematics tasks: access to the existing words and
     lines the learner herself tries do not supply the mathematical decision.
     Every other supplied string remains mathematical help by default. */
  var ACCESS_ONLY = ['read aloud', 'lines she drew to try before answering'];
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function list(value) { return Array.isArray(value) ? value : []; }
  function named(value) { return typeof value === 'string' && value.trim().length > 0; }
  function unique(values) { return Array.from(new Set(values)); }
  function stable(value) {
    if (value === undefined) return 'undefined';
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
    return '{' + Object.keys(value).sort().map(function (key) { return JSON.stringify(key) + ':' + stable(value[key]); }).join(',') + '}';
  }
  function afterDays(day, count) {
    var date = new Date(day + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate() + count);
    return date.toISOString().slice(0, 10);
  }
  function nextDay(day) { return afterDays(day, 1); }
  function create(options) {
    options = options || {};
    var storage = options.storage;
    if (!storage) { try { storage = typeof localStorage !== 'undefined' ? localStorage : null; } catch (_) {} }
    var preview = !!options.preview, targets = [], aliases = {}, byId = {};
    var state = { schema: 1, session: null, events: [] }, storageIssue = '';
    function clock() {
      var value = typeof options.now === 'function' ? options.now() : options.now;
      var date = value === undefined ? new Date() : new Date(value);
      if (!Number.isFinite(date.getTime())) date = new Date();
      return date;
    }
    function dayOf(date) {
      try {
        var parts = new Intl.DateTimeFormat('en-CA', { timeZone: options.timeZone || 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
        var p = {}; parts.forEach(function (v) { p[v.type] = v.value; });
        return p.year + '-' + p.month + '-' + p.day;
      } catch (_) { return date.toISOString().slice(0, 10); }
    }
    function persist() {
      if (preview || !storage) return;
      try { storage.setItem(KEY, JSON.stringify(state)); } catch (_) { storageIssue = 'Evidence is available on this page but could not be saved on this device.'; }
    }
    if (!preview && storage) {
      try {
        var saved = JSON.parse(storage.getItem(KEY) || 'null');
        if (saved && saved.schema === 1 && Array.isArray(saved.events)) {
          state = saved;
          state.events = state.events.filter(function (e) { return e && typeof e === 'object'; });
          if (state.session && (!named(state.session.day) || !Array.isArray(state.session.versions))) state.session = null;
        }
      } catch (_) { storageIssue = 'The shared evidence record could not be read; earlier page records have been left unchanged.'; }
    }
    function configure(values) {
      targets = list(values && values.targets ? values.targets : values).filter(function (d) { return d && named(d.id); }).map(copy);
      byId = {}; aliases = {};
      targets.forEach(function (d) {
        byId[d.id] = d; aliases[d.id] = d.id;
        list(d.sets).forEach(function (set) { aliases[set] = d.id; });
      });
    }
    configure(options.targets || []);
    function canonical(target) { return aliases[target] || target; }
    function descriptor(target) { return byId[canonical(target)] || null; }
    function scopeKey(target) {
      var d = descriptor(target);
      return d ? stable({ id: d.id, kind: d.kind || d.type, scope: d.scope || d.evidence && d.evidence.range || '', evidence: d.evidence || {} }) : '';
    }
    function dependencies(target) {
      var d = descriptor(target);
      return list(d && (d.requires || d.prerequisites)).filter(function (r) { return typeof r === 'string' || (r && r.required !== false); }).map(function (r) {
        return typeof r === 'string' ? { target: canonical(r), gate: 'teach', basis: 'authored prerequisite' }
          : { target: canonical(r.target || r.ki || r.id), gate: r.gate || 'teach', basis: r.basis || 'authored prerequisite', requiredState: r.requiredState || '' };
      });
    }
    function relatedTargets(target, visited) {
      visited = visited || [];
      target = canonical(target);
      if (visited.indexOf(target) >= 0) return visited;
      visited.push(target);
      dependencies(target).forEach(function (r) { if (named(r.target)) relatedTargets(r.target, visited); });
      return visited;
    }
    function session(version) {
      var date = clock(), day = dayOf(date), at = date.toISOString();
      /* A day is a deliberately conservative shared boundary across page visits.
         It is not an inference about when a real sitting starts or ends. */
      if (!state.session || state.session.day !== day) state.session = { id: 's2-learning-' + day, day: day, startedAt: at, updatedAt: at, versions: [] };
      if (named(version) && state.session.versions.indexOf(version) < 0) state.session.versions.push(version);
      if (named(version)) state.session.version = version;
      state.session.updatedAt = at;
      persist();
      return copy(state.session);
    }
    function ensureSession(version) { return session(named(version) ? version : (state.session && state.session.version)); }
    function append(event) {
      event.id = state.session.id + '-' + (state.events.length + 1);
      event.at = clock().toISOString(); event.day = dayOf(new Date(event.at)); event.session = state.session.id;
      state.events.push(event); persist();
      return copy(event);
    }
    function recordTeaching(input) {
      input = input || {}; ensureSession(input.version);
      var errors = [];
      if (!named(input.target)) errors.push('missing target');
      if (!named(input.kind)) errors.push('missing knowledge kind');
      if (!named(input.method)) errors.push('missing teaching method');
      if (!Array.isArray(input.supplied)) errors.push('missing supplied list');
      var version = input.version || state.session.version || '';
      if (!named(version)) errors.push('missing version');
      return append({ type: 'teaching', target: canonical(named(input.target) ? input.target : ''), scope: scopeKey(input.target), kind: input.kind || '', method: input.method || '', supplied: list(input.supplied).slice(), version: version,
        valid: errors.length === 0, issues: errors, reason: input.reason || '' });
    }
    function recordAnswer(input) {
      input = input || {}; ensureSession(input.version);
      var errors = [], target = canonical(named(input.target) ? input.target : ''), d = descriptor(target), role = String(input.role || '').toLowerCase();
      if (!named(target)) errors.push('missing target');
      if (!named(input.kind)) errors.push('missing knowledge kind');
      if (input.item === undefined || input.item === null || input.item === '') errors.push('missing item');
      if (!named(input.decision)) errors.push('missing cognitive decision');
      if (input.response === undefined) errors.push('missing response');
      if (typeof input.right !== 'boolean') errors.push('missing boolean result');
      if (!named(role)) errors.push('missing role');
      if (!Array.isArray(input.supplied)) errors.push('missing supplied list');
      if (!named(input.version)) errors.push('missing version');
      var declared = list(d && d.evidence && (d.evidence.decisions || d.evidence.requiredDecisions)).length ? (d.evidence.decisions || d.evidence.requiredDecisions) : list(d && d.decisions);
      if (d && declared.length && declared.indexOf(input.decision) < 0) errors.push('decision is outside this authored evidence range');
      if (d && named(d.kind || d.type) && named(input.kind) && String(d.kind || d.type).toLowerCase() !== input.kind.toLowerCase()) errors.push('knowledge kind does not match the target');
      var item = null, response = null;
      try { item = input.item === undefined ? null : copy(input.item); response = input.response === undefined ? null : copy(input.response); }
      catch (_) { errors.push('item or response cannot be saved'); }
      var signature = stable([target, input.decision, item]);
      var scope = scopeKey(target);
      var earlier = state.events.filter(function (e) { return e.type === 'answer' && e.valid && e.target === target; });
      var fresh = !earlier.some(function (e) { return e.signature === signature; });
      var related = relatedTargets(target);
      var exposed = state.events.some(function (e) { return e.valid && e.type === 'teaching' && e.day === state.session.day && related.indexOf(e.target) >= 0; });
      var ownRole = ['own', 'review', 'first answer', 'first-answer', 'first', 'independent', 'practice', 'practise', 'probe', 'delayed'].indexOf(role) >= 0;
      var accessSupports = list(input.supplied).filter(function (s) { return ACCESS_ONLY.indexOf(s) >= 0; });
      var contentSupplied = list(input.supplied).filter(function (s) { return ACCESS_ONLY.indexOf(s) < 0; });
      var unaided = ownRole && Array.isArray(input.supplied) && contentSupplied.length === 0;
      var diagnostic = role === 'probe';
      var evidence = errors.length ? 'invalid' : !unaided ? 'supported' : !fresh ? 'repeated' : exposed ? 'after-related-teaching' : 'independent-fresh';
      var priorDay = state.events.some(function (e) { return e.valid && e.target === target && e.scope === scope && e.day < state.session.day && (e.type === 'teaching' || e.type === 'answer' && !e.diagnostic); });
      var delayed = errors.length === 0 && !diagnostic && unaided && fresh && !exposed && priorDay;
      var event = append({ type: 'answer', target: target, kind: input.kind || '', item: item, decision: input.decision || '', response: response, right: input.right === true,
        role: role, supplied: list(input.supplied).slice(), accessSupports: accessSupports, contentSupplied: contentSupplied, version: input.version || '', valid: errors.length === 0, issues: errors,
        signature: signature, scope: scope, fresh: fresh, unaided: unaided, diagnostic: diagnostic, beforeRelatedTeaching: !exposed, evidence: evidence, delayed: delayed });
      /* Feedback is teaching. Score the response before recording that teaching,
         then expose every explicitly named shared piece of knowledge. */
      var feedback = input.feedbackDeferred ? [] : list(input.feedbackTargets).map(canonical);
      if (errors.length === 0 && feedback.length) unique(feedback.concat(target)).filter(named).forEach(function (id) {
        var td = descriptor(id);
        recordTeaching({ target: id, kind: td ? (td.kind || td.type || input.kind) : input.kind, method: 'answer feedback', supplied: ['feedback after ' + String(input.item && input.item.id || input.item)], version: input.version, reason: 'Related feedback follows the recorded response.' });
      });
      return event;
    }
    function status(target) {
      target = canonical(target);
      var d = descriptor(target), spec = d && d.evidence || {}, required = list(spec.decisions || spec.requiredDecisions).length ? (spec.decisions || spec.requiredDecisions) : list(d && d.decisions), scope = scopeKey(target);
      var all = state.events.filter(function (e) { return e.valid && e.target === target; });
      var answers = all.filter(function (e) { return e.type === 'answer' && e.scope === scope; });
      var lastError = -1;
      answers.forEach(function (e, i) { if (!e.diagnostic && e.unaided && e.fresh && !e.right) lastError = i; });
      var current = answers.slice(lastError + 1);
      var practice = current.filter(function (e) { return !e.diagnostic && e.unaided && e.fresh && e.right; });
      var cold = current.filter(function (e) { return !e.diagnostic && e.evidence === 'independent-fresh' && e.right; });
      var delayed = current.filter(function (e) { return !e.diagnostic && e.delayed && e.right; });
      var coverage = unique(practice.map(function (e) { return e.decision; }));
      var delayedRequired = Array.isArray(spec.delayedDecisions) ? spec.delayedDecisions : required;
      var missing = required.filter(function (decision) { return coverage.indexOf(decision) < 0; });
      /* Minima are accepted only from the reviewed target's catalogue, not invented here. */
      var minimum = Number.isFinite(spec.independent) && spec.independent > 0 ? spec.independent : null;
      var delayedMinimum = Number.isFinite(spec.delayed) && spec.delayed > 0 ? spec.delayed : null;
      var requirementsKnown = required.length > 0 && minimum !== null && (spec.requiresDelayed === false || delayedMinimum !== null);
      var ready = requirementsKnown && practice.length >= minimum && missing.length === 0;
      /* Once a delayed range is covered, schedule maintenance after seven days
         (or the catalogue's explicit interval). A new cycle needs new evidence;
         old delayed answers do not keep satisfying every subsequent review. */
      var maintenanceDays = Number.isInteger(spec.maintenanceDays) && spec.maintenanceDays > 0 ? spec.maintenanceDays : 7;
      var completedDay = null, cycle = [], completedCoverage = [];
      delayed.forEach(function (e) {
        if (completedDay && e.day < afterDays(completedDay, maintenanceDays)) return;
        cycle.push(e);
        var covered = unique(cycle.map(function (v) { return v.decision; }));
        if (requirementsKnown && cycle.length >= delayedMinimum && delayedRequired.every(function (v) { return covered.indexOf(v) >= 0; })) {
          completedDay = e.day; completedCoverage = covered; cycle = [];
        }
      });
      var today = dayOf(clock()), maintenanceDue = !!completedDay && afterDays(completedDay, maintenanceDays) <= today;
      var delayedCoverage = completedDay && !maintenanceDue ? completedCoverage : unique(cycle.map(function (e) { return e.decision; }));
      var missingDelayed = delayedRequired.filter(function (decision) { return delayedCoverage.indexOf(decision) < 0; });
      var retained = ready && spec.requiresDelayed !== false && !!completedDay && !maintenanceDue;
      var lastAnswer = answers[answers.length - 1], lastPractice = answers.length ? answers[answers.length - 1].at : null;
      var teaching = all.filter(function (e) { return e.type === 'teaching'; });
      var lastTeaching = teaching.length ? teaching[teaching.length - 1].at : null;
      var recentUnaided = answers.filter(function (e) { return !e.diagnostic && e.unaided && e.fresh; }).slice(-1)[0];
      var needsRepair = !!recentUnaided && !recentUnaided.right;
      var resultState = needsRepair ? 'needs-repair' : retained ? 'retained' : ready ? 'ready-for-review' : practice.length ? 'practising' : all.length ? 'supported' : 'unknown';
      if (!requirementsKnown && !needsRepair) resultState = all.length ? 'practising' : 'unknown';
      var learning = all.filter(function (e) { return e.type === 'teaching' || e.type === 'answer' && e.scope === scope && !e.diagnostic; });
      var lastLearningDay = learning.length ? learning[learning.length - 1].day : null;
      var due = completedDay ? afterDays(completedDay, maintenanceDays) : ready && lastLearningDay ? nextDay(lastLearningDay) : null;
      var reason = needsRepair ? 'The latest fresh unaided response was not right; check the decision before choosing teaching.'
        : retained ? 'Delayed fresh unaided evidence covers the authored decisions; this is evidence within the recorded scope, not total mastery.'
        : maintenanceDue ? 'The next maintenance check is due. Cover the authored review decisions with new fresh unaided answers before related teaching.'
        : ready ? 'The provisional fresh-practice minimum and authored decision coverage are met; return after a gap.'
        : !requirementsKnown ? 'No complete reviewed evidence requirements are available; previous page passed marks are not used.'
        : missing.length ? 'Fresh practice is still needed for: ' + missing.join('; ') + '.' : 'More fresh practice is needed under this target’s provisional criterion.';
      return copy({ target: target, kind: d && (d.kind || d.type) || '', state: resultState, reason: reason, requirementsKnown: requirementsKnown, scope: d && (d.scope || spec.range) || [],
        practiceRight: practice.length, independentRight: cold.length, independentBeforeTeachingRight: cold.length, afterTeachingRight: practice.filter(function (e) { return e.evidence === 'after-related-teaching'; }).length,
        independentWrong: answers.filter(function (e) { return !e.diagnostic && e.unaided && e.fresh && !e.right; }).length,
        supportedAnswers: answers.filter(function (e) { return !e.unaided; }).length, delayedRight: delayed.length, decisionCoverage: coverage, missingDecisions: missing, delayedDecisionCoverage: delayedCoverage, missingDelayedDecisions: missingDelayed,
        lastPractice: lastPractice, lastTeaching: lastTeaching, lastAnswer: lastAnswer ? { at: lastAnswer.at, right: lastAnswer.right, decision: lastAnswer.decision, evidence: lastAnswer.evidence } : null,
        nextReview: due, due: !!due && due <= today, maintenanceDays: maintenanceDays, delayedRangeLastCompleted: completedDay, maintenanceDue: maintenanceDue,
        diagnosticAnswers: answers.filter(function (e) { return e.diagnostic; }).length,
        recentErrors: answers.filter(function (e) { return !e.right; }).slice(-5).map(function (e) { return { at: e.at, item: e.item, decision: e.decision, response: e.response, role: e.role, evidence: e.evidence }; }),
        provisional: true, schedulingConvention: 'First review on the next calendar day or later, before related teaching; repeat a covered range after ' + maintenanceDays + ' days. Both intervals are provisional conventions, not guarantees of retention.' });
    }
    function choose(values) {
      if (values) configure(values);
      var eligible = [], blocked = [], waiting = [], today = dayOf(clock());
      targets.forEach(function (d, order) {
        var s = status(d.id), prereqs = dependencies(d.id).map(function (r) {
          var ps = status(r.target), pd = descriptor(r.target);
          var ready = r.requiredState === 'retained' ? ps.state === 'retained' : ps.state === 'retained' || ps.state === 'ready-for-review';
          return { target: r.target, gate: r.gate, basis: r.basis, state: ps.state, ready: ready, available: !!pd && !pd.unavailable, reason: ps.reason };
        });
        var teachBlocks = prereqs.filter(function (r) { return r.gate === 'teach' && !r.ready; });
        var attainment = prereqs.filter(function (r) { return r.gate === 'attainment' && !r.ready; });
        if (d.unavailable) { blocked.push({ target: d.id, reason: 'No reviewed teaching page is available for this prerequisite.', prerequisites: prereqs }); return; }
        if (teachBlocks.length) { blocked.push({ target: d.id, reason: 'Prepare the relevant prerequisites before recommending this target.', prerequisites: teachBlocks }); return; }
        if (s.state === 'retained') return;
        var action = s.state === 'needs-repair' ? 'repair' : s.due ? 'review' : s.state === 'unknown' || !s.lastPractice ? 'teach' : 'practise';
        var candidate = { target: d.id, action: action, reason: s.reason, prerequisites: prereqs, attainmentPending: attainment, page: d.page || '', name: d.name || d.id, nextReview: s.nextReview, order: order };
        if (s.state === 'ready-for-review' && s.nextReview > today) { candidate.action = 'review'; waiting.push(candidate); return; }
        eligible.push(candidate);
      });
      var priority = { repair: 0, review: 1, practise: 2, teach: 3 };
      eligible.sort(function (a, b) { return priority[a.action] - priority[b.action] || a.order - b.order; });
      var first = eligible[0];
      return copy({ target: first ? first.target : null, action: first ? first.action : null, reason: first ? first.reason : waiting.length ? 'The prepared targets are waiting for a later-day check; eligible unrelated targets remain available.' : 'No eligible next target is available in this authored list; review the listed prerequisites or extend the teaching plan.',
        prerequisites: first ? first.prerequisites : [], page: first ? first.page : '', eligible: eligible, blocked: blocked, waiting: waiting, convention: 'Recommendations use this authored catalogue and local evidence; they do not infer total mastery.', storageIssue: storageIssue });
    }
    function snapshot() { return copy({ key: KEY, schema: 1, session: state.session, events: state.events, preview: preview, storageIssue: storageIssue }); }
    return { session: session, recordAnswer: recordAnswer, recordTeaching: recordTeaching, status: status, choose: choose, snapshot: snapshot };
  }
  return { create: create, key: KEY };
});
