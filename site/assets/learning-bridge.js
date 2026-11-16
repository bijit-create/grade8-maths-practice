/* Shared adapter for the existing lessons. Teaching remains authored; policy reads evidence.
   Local previews never send to the Sheet. No browser-side AI or inferred diagnoses. */
(function () {
  'use strict';
  const query = new URLSearchParams(location.search);
  const preview = query.get('try') === '1' || (query.has('screen') && query.get('screen') !== 'sitting');
  const catalogue = window.TeachingCatalogue;
  const policy = window.LearningPolicy.create({storage: localStorage, preview, targets: catalogue.targets});
  let active = null, supportRun = null, carryHelp = null;
  /* A check that was started and not finished survives a reload (16 Nov fix). Previews keep nothing. */
  const PENDING = 'student2-pending-check-v1';
  const pending = {
    get() { if (preview) return null; try { return JSON.parse(localStorage.getItem(PENDING)); } catch (_) { return null; } },
    set(v) { if (preview) return; try { localStorage.setItem(PENDING, JSON.stringify(v)); } catch (_) {} },
    clear() { try { localStorage.removeItem(PENDING); } catch (_) {} }
  };
  const versions = {};
  function def(set) { return catalogue.get(set); }
  function clean(value) { return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function send(event) {
    if (typeof SheetLog !== 'undefined' && !preview) SheetLog.activity({
      event: 'learning ' + event.role, set: event.target, role: event.role,
      eq: event.decision || '', answer: event.response || '', right: typeof event.right === 'boolean' ? +event.right : '',
      own: event.evidence === 'independent-fresh' ? 1 : 0,
      support: (event.supplied || []).join('; '), checks: event.target, detail: JSON.stringify(event)
    });
  }
  function init(set, version) { versions[set] = (version || 'unknown')+' / learning '+catalogue.version; policy.session(versions[set]); }
  function observe(row) {
    const d = def(row.set); if (!d || preview) return row;
    let detail = row.detail || {}; if (typeof detail === 'string') { try { detail = JSON.parse(detail); } catch (_) { detail = {}; } }
    if (row.event === 'session start') { init(row.set, detail.version); return row; }
    if (row.event !== 'answer') return row;
    const role = row.role === 'own' || row.role === 'first answer' ? 'own' : row.role === 'review' || row.role === 'retrieval' ? 'review' : 'supported';
    const supplied = Array.isArray(detail.supplied) ? detail.supplied.slice() : row.support && row.support !== 'none' ? [row.support] : [];
    if (active && active.set === row.set && active.helped) supplied.push('example requested during this item');
    if (role === 'supported' && !supplied.length) supplied.push('worked example or completion');
    const kind = detail.kind || detail.item || detail.example || (active && active.kind) || row.role;
    const decision = detail.decision || catalogue.decisionFor(row.set, kind, detail.part);
    const event = policy.recordAnswer({target: d.id, kind:d.kind, item: kind+'|'+clean(row.eq) + '|' + (active && active.set === row.set ? active.prompt : '') + '|' + (detail.part || ''),
      decision, response: String(row.answer == null ? '' : row.answer), right: row.right === 1 || row.right === true,
      role, supplied, version: versions[row.set] || detail.version || 'legacy-unversioned',
      feedbackTargets: detail.reply && !detail.feedbackDeferred ? [d.id].concat((d.requires || []).map(x => x.target)) : []});
    row.own = event.evidence === "independent-fresh" ? 1 : 0;
    detail.learning = event; detail.supplied = supplied; detail.version = versions[row.set] || detail.version || 'legacy-unversioned';
    row.detail = detail;
    return row;
  }
  function endSupport() { if (supportRun) supportRun.cancel(); supportRun = null; document.getElementById('learning-support')?.remove(); }
  function begin(set, role, kind, version, resume) {
    if (!def(set)) return; init(set, version); endSupport();
    /* The item redrawn after "Show me an example" keeps the help mark, so its answer is not logged as her own (16 Nov fix). */
    const helped = !!(carryHelp && carryHelp.set === set && carryHelp.kind === kind); carryHelp = null;
    active = {set, kind, role, prompt: clean(document.querySelector('#words')?.textContent || document.querySelector('#stage')?.textContent), helped};
    document.getElementById('learning-help')?.remove();
    if (role === 'worked' || role === 'supported') { policy.recordTeaching({target:def(set).id,kind:def(set).kind,method:role,supplied:[active.prompt],version}); return; }
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.id = 'learning-help'; b.textContent = 'Show me an example';
    b.onclick = () => { active.helped = true; runSupport(set, kind, '', true, r => { carryHelp = {set, kind}; resume(r); }); };
    (document.querySelector('.tools') || document.querySelector('.top') || document.body).appendChild(b);
  }
  function runSupport(set, kind, tag, help, done) {
    const d = def(set); if (!d) { done({outcome:'unavailable'}); return; }
    endSupport(); document.getElementById('learning-help')?.remove();
    const area = document.querySelector('.card') || document.querySelector('#stage')?.parentElement || document.body;
    const disabled = Array.from(area.querySelectorAll('button,input')); disabled.forEach(x => { x.dataset.policyDisabled = String(x.disabled); x.disabled = true; });
    const hidden = Array.from(area.children);hidden.forEach(x=>{x.dataset.previousHidden=String(x.hidden);x.hidden=true;});
    const panel = document.createElement('section'); panel.id = 'learning-support'; panel.className = 'learning-support'; panel.setAttribute('aria-label','An example and a question'); area.appendChild(panel);
    const complete = result => { endSupport();hidden.forEach(x=>{x.hidden=x.dataset.previousHidden==="true";delete x.dataset.previousHidden;}); disabled.forEach(x => { x.disabled = x.dataset.policyDisabled === 'true'; delete x.dataset.policyDisabled; }); done(result); };
    supportRun = window.TeachingSupport[help ? 'help' : 'repair']({set,kind,tag,container:panel,onEvent(e) {
      e.version = versions[set] || 'teaching-support 1.0';
      if (typeof e.right === 'boolean') {
        const ev = policy.recordAnswer({target:e.target || d.id,kind:(catalogue.get(e.target)||d).kind,item:e.item || e.question || e.decision,
          decision:e.decision || 'probe',response:String(e.response),right:e.right,role:e.role || 'probe',supplied:e.supplied || [],version:e.version,feedbackTargets:e.feedbackTargets || []});
        send(Object.assign({},e,{learning:ev}));
      } else { if(e.event==='teaching')policy.recordTeaching({target:e.target || d.id,kind:(catalogue.get(e.target)||d).kind,method:e.method || e.role || 'example',supplied:e.supplied || [],version:e.version}); send(e); }
    },onDone:complete});
    panel.scrollIntoView({block:'nearest'});
  }
  function repair(set, kind, tag, done) {
    pending.set({set, kind, tag: tag || '', at: new Date().toISOString()});
    runSupport(set, kind, tag, false, r => { pending.clear(); done(r); });
  }
  /* Called first by each page's go(): reopens an unfinished check for this page. Returns true when it did. */
  function resumePending(set, done) {
    const p = pending.get(); if (!p || p.set !== set || !def(set)) return false;
    repair(p.set, p.kind, p.tag, done); return true;
  }
  function guard(set) {
    if (preview || !def(set)) return true;
    const d = def(set);
    const needs = (d.requires || []).filter(r => r.gate === 'teach' && !['ready-for-review','retained'].includes(policy.status(r.target).state));
    if (!needs.length) { document.getElementById('learning-prerequisites')?.remove(); return true; }
    const area = document.querySelector('.card') || document.querySelector('#stage') || document.body;
    area.innerHTML = '';
    const panel = document.createElement('section'); panel.id='learning-prerequisites'; panel.className='learning-support';
    const p=document.createElement('p');p.textContent='These earlier ideas will help with this page. Choose one to practise first. Your place here is kept.';panel.appendChild(p);
    needs.forEach(r => {const t=catalogue.targets.find(x=>x.id===r.target);const a=document.createElement('a');a.className='btn';a.href=t ? t.page + '?target=' + encodeURIComponent(t.id) : 'next-practice.html';a.textContent=t ? t.name : 'Choose another page';panel.appendChild(a);});
    const a=document.createElement('a');a.className='btn';a.href='next-practice.html';a.textContent='See other work I can do';panel.appendChild(a);area.appendChild(panel);return false;
  }
  document.addEventListener('click',e=>{if(e.target.closest('#readBtn')&&document.getElementById('learning-support')){e.stopImmediatePropagation();speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(document.getElementById('learning-support').textContent));}},true);
  function reviewKind(set,kinds){
    const d=def(set);if(!d)return kinds[0];const s=policy.status(d.id);
    const missing=s.missingDelayedDecisions.length?s.missingDelayedDecisions:d.decisions;
    return kinds.find(k=>missing.includes(catalogue.decisionFor(set,k)))||kinds[0];
  }
  window.LearningBridge={init,observe,begin,repair,resumePending,guard,reviewKind,policy,preview,def};
})();
