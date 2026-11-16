const fs=require('fs');
const edit=(f,fn)=>{let s=fs.readFileSync(f,'utf8');fs.writeFileSync(f,fn(s));};
edit('site/assets/teaching-catalogue.js',s=>s.replace('requiredDecisions:decisions.slice(),requiresDelayed:true','requiredDecisions:decisions.slice(),decisions:decisions.slice(),independent:Math.max(2,decisions.length),delayed:Math.max(2,decisions.length),requiresDelayed:true')
 .replace("['form','calculate','check'],[req('KI-GE-21')","['calculate'],[req('KI-GE-21')")
 .replace('Find a fourth interior angle from three given angles; fresh numbers and changed presentation; paper evidence is separate.','Calculate a fourth interior angle from three given angles with the rule retrieved; formula formation and explanation are not separately assessed here.')
 .replace("[req('KI-GE-24'),req('KI-GE-11')]","[req('KI-GE-24'),req('KI-GE-11'),req('KI-GE-23'),req('SK-GE-08')]")
 .replace('function decisionFor(set,kind){','function decisionFor(set,kind,part){')
 .replace("if(t.id==='KI-AG-03')return", "if(t.id==='KI-AG-03'&&/^T3/.test(k)&&Number(part)===1)return 'evaluate';\n if(t.id==='KI-AG-04'&&/^U5/.test(k)&&Number(part)>1)return 'evaluate';\n if(t.id==='KI-AG-01'&&((k==='S3'&&Number(part)>1)||(k==='S7'&&Number(part)===3)))return 'substitute';\n if(t.id==='KI-AG-03')return")
 .replace("['identify','construct','compare'],[req('KI-AG-01')", "['identify','construct','compare','evaluate'],[req('KI-AG-01')"));
// Preview must neither consume nor write a child's prior page state.
for(const f of ['site/equations-1.html','site/equations-2.html','site/assets/quad-engine.js'])edit(f,s=>{
 s=s.replace('get(k){try{return JSON.parse(localStorage.getItem(k))}', 'get(k){if(new URLSearchParams(location.search).has("screen")||new URLSearchParams(location.search).get("try")==="1")return null;try{return JSON.parse(localStorage.getItem(k))}')
 .replace('set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}', 'set(k,v){if(new URLSearchParams(location.search).has("screen")||new URLSearchParams(location.search).get("try")==="1")return;try{localStorage.setItem(k,JSON.stringify(v))}');
 s=s.replace('if(S.stoppedOn===today)', 'if(S.stoppedOn===today&&!new URLSearchParams(location.search).get("action"))');
 s=s.replace('saved stop: two items in a row not right','saved teaching continuation').replaceAll('two items in a row not right on her own','the supported check needs more teaching');
 s=s.replace('We stop here for today. Your place is kept.','Your place is kept. You can choose another page or come back to this example.');
 s=s.replace('record("session end",{detail:{reason:why}});','const link=document.createElement("a");link.className="btn";link.href="next-practice.html";link.textContent="Choose the next page";(document.getElementById("acts")||document.getElementById("stage")).appendChild(link);\n  record("session end",{detail:{reason:why}});');
 // The old page passed flag is a record of page completion only. Do not send it as a new held claim.
 s=s.replaceAll('sendState(S.stop,"held")','sendState(S.stop,"practice complete; shared evidence decides next work")').replaceAll('sendState("held")','sendState("practice complete; shared evidence decides next work")');
 if(f.includes('equations')){
  s=s.replace('if(it.summary)reply(', 'if(it.summary&&(right||!window.LearningBridge||SAMPLE))reply(');
  s=s.replace('const action=new URLSearchParams(location.search).get("action");','const action=new URLSearchParams(location.search).get("action");\n  if(action==="practise"&&S.stop){const st=ST();st.phase="own";st.queue=null;st.pi=0;kiOf(S.stop).passed=false;}');
  s=s.replace('if(action==="repair"&&S.stop){S.stoppedOn=null;const st=ST();st.phase="own";st.missRun=0;}','if(action==="repair"&&S.stop){S.stoppedOn=null;const st=ST();st.phase="worked";st.w=0;st.resumed=true;st.missRun=0;kiOf(S.stop).passed=false;}');
  s=s.replace('saveAll();nextButton("Next",()=>go());});}\nfunction endScreen','saveAll();if(!r.right&&window.LearningBridge)return nextButton("Look at this together",()=>LearningBridge.repair(id,r.kind,"",out=>{if(out.outcome==="needs-more-teaching")stopForToday(def);else go();}));nextButton("Next",()=>go());});}\nfunction endScreen');
 }else{
  s=s.replace('if(QS.get("action")==="repair"){S.stoppedOn=null;S.st.phase="own";S.st.missRun=0;}','if(QS.get("action")==="repair"){S.stoppedOn=null;S.st.phase="worked";S.st.w=0;S.st.resumed=true;S.st.missRun=0;kiOf().passed=false;}\n  if(QS.get("action")==="practise"){S.st.phase="own";S.st.queue=null;S.st.pi=0;kiOf().passed=false;}');
  s=s.replace('saveAll();nextButton(()=>go());});}\nfunction endScreen','saveAll();if(!r.right&&window.LearningBridge)return nextButton(()=>LearningBridge.repair(PAGE.set,r.kind,r.tag||"",out=>{if(out.outcome==="needs-more-teaching")stopForToday();else go();}));nextButton(()=>go());});}\nfunction endScreen');
 }
 return s;
});
edit('site/quadrilaterals-5.html',s=>s.replaceAll('ctx.say(RULE);','if(ctx.role==="worked"||ctx.role==="supported")ctx.say(RULE);'));
edit('site/assets/learning-bridge.js',s=>s.replace('catalogue.decisionFor(row.set, kind)','detail.decision || catalogue.decisionFor(row.set, kind, detail.part)')
 .replace('kind:def(set).id,','kind:def(set).id,')
 .replace('kind,method:role','kind:def(set).kind,method:role')
 .replace('kind:e.kind || kind,method:', 'kind:(catalogue.get(e.target)||d).kind,method:')
 .replace('detail.learning = event;', 'row.own = event.evidence === "independent-fresh" ? 1 : 0;\n    detail.learning = event;')
 .replace('const panel = document.createElement(\'section\');', 'const hidden = Array.from(area.children);hidden.forEach(x=>{x.dataset.previousHidden=String(x.hidden);x.hidden=true;});\n    const panel = document.createElement(\'section\');')
 .replace('const complete = result => { endSupport();', 'const complete = result => { endSupport();hidden.forEach(x=>{x.hidden=x.dataset.previousHidden==="true";delete x.dataset.previousHidden;});')
 .replace("window.LearningBridge={", "document.addEventListener('click',e=>{if(e.target.closest('#readBtn')&&document.getElementById('learning-support')){e.stopImmediatePropagation();speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(document.getElementById('learning-support').textContent));}},true);\n  window.LearningBridge={"));
edit('site/return-sitting.html',s=>s.replace('first_attempt:true,supplied,','first_attempt:true,decision:({"decide-yes":"classify","make-5":"construct","make-line":"construct","decide-open":"boundary","dart":"draw","howmany":"count","check-slip":"check","fourth-angle":"calculate","angle-beside":"calculate","angles-x":"substitute","eq-1":"solve","eq-2":"solve","eq-3":"solve"})[it.id],supplied,')
 .replace('row.detail=adapted.detail;','row.detail=adapted.detail;row.own=adapted.own;')
 .replace('if(first){send({event:"sitting end"','const link=document.createElement("a");link.href="next-practice.html";link.className="btn";link.textContent="Choose the next page";$("acts").appendChild(link);\n  if(first){send({event:"sitting end"'));
// Existing analytics must honour the new event interpretation while leaving old rows alone.
edit('apps-script/Signals.gs',s=>s.replace("own: Number(r.own) === 1 && r.support === 'none'", "own: d.learning ? d.learning.valid && d.learning.evidence === 'independent-fresh' : Number(r.own) === 1 && r.support === 'none'"));
