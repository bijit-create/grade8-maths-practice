/* Shared, bounded teaching after a response or on request. No network or state.
   Probe results identify an observed difficulty on that task, never a diagnosis.
   onEvent is the sole record channel; the host returns to a fresh whole task. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./teaching-catalogue.js'));else root.TeachingSupport=factory(root.TeachingCatalogue);})(typeof globalThis!=='undefined'?globalThis:this,function(C){
'use strict';
let sequence=0;
function run(options,mode){
 const {set,kind,tag,container}=options;const route=C.routeFor(set,kind,tag),def=C.get(set);
 if(!container||!route){if(options.onDone)options.onDone({outcome:'unavailable',helpedTargets:[]});return {cancel(){}};}
 const doc=container.ownerDocument,uid='teaching-'+(++sequence);let cancelled=false,finished=false,probeIndex=0;
 const helped=new Set(),responses=[],lines=[];container.replaceChildren();container.classList.add('teaching-support');container.setAttribute('role','region');container.setAttribute('aria-label','Help with this question');
 container.style.cssText+=';display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--line,#ccc);border-radius:12px;margin-top:12px;max-width:100%;';
 const work=doc.createElement('div'),question=doc.createElement('div');work.style.cssText=question.style.cssText='display:flex;flex-direction:column;gap:10px';container.append(work,question);
 function emit(data){if(cancelled)return;const event=Object.assign({event:'teaching support',set,version:C.version,target:def.id,kind,trigger:mode,sourceTag:tag||'',supplied:[],feedbackTargets:[],at:new Date().toISOString()},data);if(options.onEvent)options.onEvent(event);}
 function p(text,cls='say',where=work){const el=doc.createElement('p');el.className=cls;el.textContent=text;where.append(el);return el;}
 function button(text,action,where=question){const b=doc.createElement('button');b.type='button';b.className='btn primary';b.style.cssText='min-height:48px;white-space:normal;text-align:left';b.textContent=text;b.onclick=()=>{if(!cancelled&&!finished)action();};where.append(b);return b;}
 function done(outcome){if(finished||cancelled)return;finished=true;emit({event:'support finished',role:'teaching',outcome,helpedTargets:[...helped],responses:responses.slice()});if(options.onDone)options.onDone({outcome,helpedTargets:[...helped],responses:responses.slice()});}
 function finishMessage(outcome,keep){if(!keep)question.replaceChildren();p(outcome==='needs-more-teaching'?'We stop this page here for today. Your place is kept.':'Now try a new question.', 'say',question);button('Go on',()=>done(outcome));}
 function ask(task,role,after){
  question.replaceChildren();const prompt=p(task.prompt,'q',question);prompt.id=uid+'-'+task.id;let locked=false;const controls=doc.createElement('div');controls.style.cssText='display:flex;flex-wrap:wrap;gap:8px';question.append(controls);
  function answer(raw){if(locked||cancelled)return;let value=raw;
   if(!task.options){const text=String(raw).trim().replace(/−/g,'-');if(!/^-?\d+(?:\.\d+)?$/.test(text)){let note=question.querySelector('[data-format]');if(!note){note=p('Write a number, such as 7 or −3.','reply info',question);note.dataset.format='1';}emit({event:'unreadable answer',role,target:task.target,item:task.id,response:raw,decision:task.decision,supplied:lines.slice()});return;}value=Number(text);}
   locked=true;const right=value===task.correct;controls.querySelectorAll('button,input').forEach(e=>e.disabled=true);
   const response=task.options?task.options[value]:String(raw);responses.push({item:task.id,target:task.target,right,role});
   emit({event:'answer',role,target:task.target,item:task.id,decision:task.decision,response,answer:response,right,supplied:lines.slice(),feedbackTargets:[],supported:role!=='probe'||lines.length>0});
   p(right?'That is right.':'That answer is not right.','reply '+(right?'ok':'no'),question);
   /* A wrong answer after teaching: the worked answer, then a saved stop (CLAUDE.md, the route through difficulty). */
   const worked=role==='supported check'&&!right;
   if(worked){const line='The answer is '+(task.options?task.options[task.correct]:String(task.correct).replace('-','−'))+'.';p(line,'say',question);emit({event:'teaching',role:'feedback',target:task.target,item:task.id,method:'worked answer after the supported check',supplied:[line],feedbackTargets:[task.target]});}
   /* Feedback is itself instruction and affects every later claim on this target. */
   if(task.why){p(task.why,'say',question);helped.add(task.target);emit({event:'teaching',role:'feedback',target:task.target,item:task.id,method:'answer explanation',supplied:[task.why],feedbackTargets:[task.target]});}
   if(worked)return after(right);
   button('Next',()=>after(right),question);
  }
  if(task.options)task.options.forEach((label,i)=>button(label,()=>answer(i),controls));
  else{const input=doc.createElement('input');input.type='text';input.inputMode='decimal';input.autocomplete='off';input.setAttribute('aria-labelledby',prompt.id);input.style.cssText='font:inherit;min-height:48px;width:140px;padding:8px';controls.append(input);button('Check my answer',()=>answer(input.value),controls);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(input.value);}};}
 }
 function teach(plan,target,reason){
  helped.add(target);work.replaceChildren();lines.splice(0,lines.length,...plan.lines);p('Look at this example.');
  if(plan.figure==='two-triangles'){
   const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 360 240');svg.setAttribute('role','img');svg.setAttribute('aria-label','Quadrilateral ABCD split by diagonal AC into triangles ABC and ACD, each with an angle total of 180 degrees');svg.style.cssText='width:100%;max-width:360px';
   svg.innerHTML='<path d="M35 50 L280 25 L325 205 Z" fill="#dbeaff" stroke="#325b96" stroke-width="2"/><path d="M35 50 L325 205 L70 215 Z" fill="#ffebd1" stroke="#8b5525" stroke-width="2"/><path d="M35 50 L325 205" stroke="#7550a0" stroke-width="3"/><g fill="#1a2430" font-family="sans-serif" font-size="18"><text x="18" y="40">A</text><text x="280" y="20">B</text><text x="330" y="220">C</text><text x="50" y="235">D</text><text x="190" y="90">180°</text><text x="100" y="175">180°</text></g>';work.appendChild(svg);
  }
  plan.lines.forEach(line=>p(line));
  emit({event:'teaching',role:'worked example',target,method:reason,supplied:plan.lines.slice(),feedbackTargets:[target]});
  question.replaceChildren();button('Try a new question',()=>{
   /* Worked lines stay available: this is deliberately a supported check. */
   ask(plan.check,'supported check',right=>finishMessage(right?'supported-success':'needs-more-teaching',!right));
  });
 }
 function probe(){
  if(probeIndex>=Math.min(2,route.probes.length)){emit({event:'probe conclusion',role:'probe',outcome:'parts-correct-cause-unresolved',response:'The checked parts were right. This does not establish why the original answer was wrong.'});return teach(route.whole,def.id,'coordinate the whole task after parts were checked');}
  const task=route.probes[probeIndex++];ask(task,'probe',right=>{if(right)probe();else{emit({event:'probe conclusion',role:'probe',target:task.target,item:task.id,outcome:'difficulty-observed',response:'This part needs teaching; the original cause is still a hypothesis.'});teach(task.lesson,task.target,'teach the part that was not right');}});
 }
 emit({event:'support started',role:'teaching',route:route.id,method:mode==='help'?'requested worked example':'bounded discriminating probes'});
 if(mode==='help')teach(route.whole,def.id,'requested worked example');else{p('First, check one fact that this question uses.');probe();}
 return {cancel(){cancelled=true;container.replaceChildren();}};
}
return {repair:options=>run(options,'repair'),help:options=>run(options,'help')};
});
