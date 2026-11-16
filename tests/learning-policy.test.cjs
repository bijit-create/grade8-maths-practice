'use strict';
const assert = require('node:assert/strict');
const Policy = require('../site/assets/learning-policy.js');
const tests = [];
function test(name, run) { tests.push([name, run]); }
function memory(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: k => values.get(k) || null, setItem: (k,v) => values.set(k,v), values };
}
const target = (id, decisions = ['recognise'], extra = {}) => ({ id, kind: 'Concept', sets: [id.toLowerCase()], evidence: { independent: 2, delayed: 1, decisions, requiresDelayed: true }, scope: ['authored examples only'], ...extra });
function setup(targets = [target('A')], options = {}) {
  let date = '2026-11-16T04:00:00Z';
  const storage = options.storage || memory();
  const policy = Policy.create({ storage, targets, now: () => date, ...options });
  policy.session('page 1');
  return { policy, storage, day: value => { date = value; policy.session('page 1'); } };
}
const answer = (policy, overrides = {}) => policy.recordAnswer({ target: 'A', kind: 'Concept', item: 'example 1', decision: 'recognise', response: 'yes', right: true, role: 'own', supplied: [], version: 'page 1', ...overrides });

test('canonical targets share evidence across pages while legacy records stay untouched', () => {
  const legacy = JSON.stringify({ a: { passed: true } });
  const storage = memory({ 'student2-ki-v1': legacy });
  const one = setup([target('A')], { storage });
  answer(one.policy, { target: 'a' });
  const two = setup([target('A')], { storage });
  answer(two.policy, { item: 'example 2', version: 'different page' });
  assert.equal(two.policy.status('A').practiceRight, 2);
  assert.equal(two.policy.status('a').state, 'ready-for-review');
  assert.equal(storage.getItem('student2-ki-v1'), legacy);
});
test('old passed marks never count as new evidence', () => {
  const { policy } = setup([target('A')], { storage: memory({ 'student2-ki-v1': '{"a":{"passed":true}}' }) });
  assert.equal(policy.status('A').state, 'unknown');
  assert.equal(policy.status('A').practiceRight, 0);
});
test('related feedback across pages is teaching and later practice is not cold evidence', () => {
  const { policy } = setup([target('A'), target('B', ['recognise'], { requires: [{ target: 'A', gate: 'teach', basis: 'mathematical necessity' }] })]);
  const first = answer(policy, { right: false, feedbackTargets: ['A'] });
  assert.equal(first.evidence, 'independent-fresh');
  policy.session('second page');
  const next = answer(policy, { target: 'B', item: 'other task', version: 'second page' });
  assert.equal(next.evidence, 'after-related-teaching');
  assert.equal(next.delayed, false);
  assert.equal(policy.status('B').practiceRight, 1);
  assert.equal(policy.status('B').independentRight, 0);
});
test('post-feedback fresh practice can prepare a delayed check without being called cold or retained', () => {
  const { policy } = setup();
  policy.recordTeaching({ target: 'A', kind: 'Concept', method: 'worked example', supplied: ['worked lines'], version: 'page 1' });
  answer(policy);
  answer(policy, { item: 'example 2' });
  const s = policy.status('A');
  assert.equal(s.state, 'ready-for-review');
  assert.equal(s.independentRight, 0);
  assert.equal(s.afterTeachingRight, 2);
  assert.equal(s.nextReview, '2026-11-17');
});
test('fresh later-day answer counts delayed; repeats and taught answers do not', () => {
  const run = setup();
  answer(run.policy); answer(run.policy, { item: 'example 2' });
  run.day('2026-11-17T04:00:00Z');
  assert.equal(run.policy.choose().action, 'review');
  assert.equal(answer(run.policy, { item: 'example 1' }).evidence, 'repeated');
  assert.equal(answer(run.policy, { item: 'example 3' }).delayed, true);
  assert.equal(run.policy.status('A').state, 'retained');
  run.day('2026-11-18T04:00:00Z');
  run.policy.recordTeaching({ target: 'A', kind: 'Concept', method: 'reminder', supplied: ['rule'], version: 'page 1' });
  assert.equal(answer(run.policy, { item: 'example 4' }).delayed, false);
});
test('decision coverage prevents repeated success on just one cognitive action from completing the range', () => {
  const { policy } = setup([target('A', ['recognise','construct'])]);
  answer(policy); answer(policy, { item: 'example 2' });
  assert.equal(policy.status('A').state, 'practising');
  assert.deepEqual(policy.status('A').missingDecisions, ['construct']);
  answer(policy, { item: 'construction 1', decision: 'construct' });
  assert.equal(policy.status('A').state, 'ready-for-review');
});
test('unmet relevant prerequisites block their dependent target, leaving unrelated learning eligible', () => {
  const defs = [target('B', ['recognise'], { requires: [{target:'A',gate:'teach',basis:'authored route'}] }), target('A', ['recognise'], { unavailable: true }), target('C')];
  const { policy } = setup(defs);
  const choice = policy.choose();
  assert.equal(choice.target, 'C');
  assert.equal(choice.action, 'teach');
  assert.equal(choice.blocked.find(x => x.target === 'B').prerequisites[0].target, 'A');
});
test('attainment prerequisites do not prevent supported teaching of a principle within a skill', () => {
  const { policy } = setup([target('B', ['recognise'], { requires: [{target:'A',gate:'attainment',basis:'authored route'}] }), target('A', ['recognise'], { unavailable:true })]);
  const next = policy.choose();
  assert.equal(next.target, 'B');
  assert.equal(next.eligible[0].attainmentPending[0].target, 'A');
});
test('missing metadata or undeclared decision records evidence invalid instead of advancing', () => {
  const { policy } = setup();
  const invalid = answer(policy, { supplied: undefined });
  assert.equal(invalid.evidence, 'invalid');
  assert.ok(invalid.issues.includes('missing supplied list'));
  assert.equal(answer(policy, { decision: 'invented' }).valid, false);
  assert.equal(policy.status('A').practiceRight, 0);
});
test('supported and worked steps cannot satisfy unaided decision coverage', () => {
  const { policy } = setup();
  assert.equal(answer(policy, { role:'worked example step',supplied:[] }).evidence,'supported');
  assert.equal(answer(policy, {item:'example 2',supplied:['rule beside answer']}).evidence,'supported');
  assert.equal(policy.status('A').practiceRight, 0);
});
test('latest wrong fresh unaided answer requests a probe/repair and does not retain an old success label', () => {
  const run = setup();
  answer(run.policy); answer(run.policy,{item:'example 2'});
  run.day('2026-11-17T04:00:00Z');
  answer(run.policy,{item:'example 3'});
  answer(run.policy,{item:'example 4',right:false,response:'no'});
  assert.equal(run.policy.status('A').state,'needs-repair');
  assert.equal(run.policy.choose().action,'repair');
  assert.equal(run.policy.status('A').recentErrors.length,1);
});
test('returned data and caller objects cannot mutate saved earlier evidence', () => {
  const { policy, storage } = setup();
  const item = { equation:'3x=12' }, response = { value:4 };
  const event = answer(policy,{item,response});
  const saved = storage.getItem(Policy.key);
  item.equation='changed'; response.value=9; event.response.value=8;
  const snap=policy.snapshot();snap.events[0].response.value=7;
  assert.equal(storage.getItem(Policy.key),saved);
  assert.equal(policy.snapshot().events[0].response.value,4);
});
test('preview mode and storage errors do not mutate real learning records or crash teaching', () => {
  const storage=memory({[Policy.key]:'{"schema":1,"session":null,"events":[]}'});
  const before=storage.getItem(Policy.key);
  const {policy}=setup([target('A')],{storage,preview:true});
  answer(policy);
  assert.equal(storage.getItem(Policy.key),before);
  const broken=setup([target('A')],{storage:{getItem(){throw Error('denied');},setItem(){throw Error('full');}}});
  assert.doesNotThrow(()=>answer(broken.policy));
  assert.ok(broken.policy.snapshot().storageIssue);
});
test('a deferred wrong-answer reply is observation, not imaginary teaching', () => {
  const { policy } = setup();
  answer(policy, {right:false,feedbackDeferred:true,feedbackTargets:['A']});
  assert.equal(policy.snapshot().events.filter(e=>e.type==='teaching').length,0);
  assert.equal(answer(policy,{item:'fresh after deferred error'}).evidence,'independent-fresh');
  const other=setup();
  answer(other.policy,{right:false});
  assert.equal(other.policy.snapshot().events.filter(e=>e.type==='teaching').length,0);
});
test('diagnostic probes remain recorded but neither certify nor revoke practice readiness', () => {
  const run=setup();
  answer(run.policy,{item:'probe one',role:'probe'});
  answer(run.policy,{item:'probe two',role:'probe'});
  assert.equal(run.policy.status('A').practiceRight,0);
  assert.equal(run.policy.status('A').diagnosticAnswers,2);
  answer(run.policy);answer(run.policy,{item:'example 2'});
  answer(run.policy,{item:'probe three',role:'probe',right:false});
  assert.equal(run.policy.status('A').state,'ready-for-review');
  run.day('2026-11-17T04:00:00Z');
  assert.equal(answer(run.policy,{item:'later probe',role:'probe'}).delayed,false);
  assert.equal(run.policy.status('A').delayedRight,0);
});
test('retained range returns for provisional maintenance and old delayed successes do not satisfy the new cycle', () => {
  const run=setup([target('A',['recognise','construct'])]);
  answer(run.policy);answer(run.policy,{item:'construction one',decision:'construct'});
  run.day('2026-11-17T04:00:00Z');
  answer(run.policy,{item:'review recognition one'});
  answer(run.policy,{item:'review construction one',decision:'construct'});
  assert.equal(run.policy.status('A').state,'retained');
  assert.equal(run.policy.status('A').nextReview,'2026-11-24');
  run.day('2026-11-24T04:00:00Z');
  assert.equal(run.policy.choose().action,'review');
  assert.equal(run.policy.status('A').state,'ready-for-review');
  answer(run.policy,{item:'maintenance recognition'});
  assert.equal(run.policy.status('A').state,'ready-for-review');
  assert.deepEqual(run.policy.status('A').missingDelayedDecisions,['construct']);
  answer(run.policy,{item:'maintenance construction',decision:'construct'});
  assert.equal(run.policy.status('A').state,'retained');
  assert.equal(run.policy.status('A').nextReview,'2026-12-01');
});
test('new target scope requires new evidence while page versions can still share an unchanged target', () => {
  const run=setup();
  answer(run.policy);answer(run.policy,{item:'example 2'});
  const changed=Policy.create({storage:run.storage,targets:[target('A',['recognise','construct'],{scope:['new authored range']})],now:()=>new Date('2026-11-17T04:00:00Z')});
  changed.session('new page version');
  assert.equal(changed.status('A').practiceRight,0);
  assert.equal(answer(changed,{item:'new range recognition',version:'new page version'}).delayed,false);
  assert.equal(changed.snapshot().events.filter(e=>e.type==='answer').length,3);
});
test('reviewed access and learner-made exploratory lines remain distinct from mathematical help', () => {
  const run=setup();
  const spoken=answer(run.policy,{supplied:['read aloud']});
  assert.equal(spoken.evidence,'independent-fresh');
  assert.deepEqual(spoken.supplied,['read aloud']);
  assert.deepEqual(spoken.accessSupports,['read aloud']);
  assert.deepEqual(spoken.contentSupplied,[]);
  const drawn=answer(run.policy,{item:'example 2',supplied:['lines she drew to try before answering']});
  assert.equal(drawn.unaided,true);
  assert.equal(run.policy.status('A').state,'ready-for-review');
  run.day('2026-11-17T04:00:00Z');
  const later=answer(run.policy,{item:'example 3',supplied:['read aloud','lines she drew to try before answering']});
  assert.equal(later.delayed,true);
  const helped=answer(run.policy,{item:'example 4',supplied:['read aloud','the equation is already written']});
  assert.equal(helped.evidence,'supported');
  assert.deepEqual(helped.contentSupplied,['the equation is already written']);
  assert.equal(answer(run.policy,{item:'example 5',supplied:['spoken worked solution']}).evidence,'supported');
});

let failed=0;
for(const [name,run] of tests){try{run();process.stdout.write('PASS '+name+'\n');}catch(error){failed++;process.stderr.write('FAIL '+name+'\n'+error.stack+'\n');}}
if(failed)process.exitCode=1;
else process.stdout.write(`${tests.length} learning-policy checks passed.\n`);
