/* Shared engine for Student 2's quadrilateral pages (quadrilaterals-1.html ... quadrilaterals-7.html). 11 Nov 2026.
   Same flow and records as the equations KI pages (HTML-TOOL student2/ki-ag-04-06.html, 10 Nov 2026):
     worked examples (each ends in a step she completes) -> one supported item (recorded own: 0) -> her own items
     in an authored order until the item holds -> next day, one review item.
   - A miss: the next item is a fresh one of the same kind. Two misses in a row: saved stop for today.
     The next day starts with the worked examples again and goes straight to her own items, at the same kind.
   - Holds (provisional, as the equations pages): the last item right on her own, every contrast case right on her
     own, and at least three kinds right on her own.
   - Shared record of what holds: localStorage "student2-ki-v1", keyed by the page's set id.
   - Answers go to SheetLog.activity / SheetLog.state when assets/sheetlog.js is loaded before this file.
   - Her screen: a title, the picture, the words, one question, the decision button, the reply, Read it and Pause.
     The teacher strip shows only with ?teacher=1. ?screen=w1 | w2 | sup | <kind> shows one sample screen and stores nothing.

   A page calls QE.start(PAGE) with:
     PAGE = { set:"q1-make", ki:"KI-GE-21", teacher:"exact name and rule in symbols", title:"Her title",
              version:"q1 1.0 (11 Nov 2026)",
              worked:[task, task], sup:task, gen:{kind:task, ...}, plan:[kind, ...],
              contrasts:["name", ...], contrastKind:{name:kind}, gates:{kind:[kind needed first]},
              supSupport:"optional: what the supported item writes for her, for the support column" }
   A task is a function (ctx, it) that draws one item and calls ctx.done(...) exactly once, when she says it is finished.
   gen tasks also get ctx.kind and ctx.contrast; set ctx.contrast = "name" inside the task if the item is a contrast case.
   ctx gives:
     ctx.role          "worked" | "supported" | "own" | "review"
     ctx.open          true until ctx.done is called; the picture must ignore her actions once it is false
                       (buttons under the picture are removed by the engine at done)
     ctx.rng(), ctx.pick(arr), ctx.int(a,b)   seeded random (?seed=n)
     ctx.svg(viewBox, ariaLabel)  -> an <svg> in the picture column (cleared for every item)
     ctx.el(tag, attrs)          -> an SVG element;   ctx.picBelow(htmlElement) puts a table etc. under the picture
     ctx.say(text, cls)          -> a paragraph in the text column;   ctx.ask(text) -> the one question (blue)
     ctx.button(label, fn)       -> the decision button in the text column (only one at a time)
     ctx.choices([{t, fn}])      -> answer buttons in the text column
     ctx.numberBox(label, fn)    -> a box for a whole number and a "Check my answer" button; fn(value or null, raw)
     ctx.note(text)              -> an honest reply that judges nothing (e.g. "Write a number of degrees, like 75.")
     ctx.clearNote()
     ctx.done({right, answer, eq, tag, reply})  -> records the answer, shows the reply, removes controls, shows Next
     ctx.auto({right: fn, wrongs: [{fn, expect}]})  -> how the test gives a right and each planned wrong answer
*/
"use strict";
const QE=(()=>{
const QS=new URLSearchParams(location.search);
const TEACHER=QS.get("teacher")==="1";
const HAS_SHEET=typeof SheetLog!=="undefined";
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const todayKey=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
let seed=Number(QS.get("seed"))||((Date.now()%100000)+1);
function rng(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
const pick=a=>a[Math.floor(rng()*a.length)];
const int=(a,b)=>a+Math.floor(rng()*(b-a+1));
const $=id=>document.getElementById(id);
const NS="http://www.w3.org/2000/svg";
const plain=t=>String(t).replace(/<[^>]+>/g,"");

let PAGE=null,S=null,K=null,SAMPLE=false,stateKey="",kiKey="student2-ki-v1";
let screenText=[],itemOpen=false;
window.__records=[];

/* ---------- records ---------- */
function saveAll(){if(SAMPLE)return;store.set(stateKey,S);store.set(kiKey,K);}
function record(event,f){
  const row=Object.assign({t:new Date().toISOString(),event,set:PAGE.set,role:"",eq:"",answer:"",right:"",own:"",support:"",checks:"",detail:""},f||{});
  if(S&&!SAMPLE){S.events.push(row);if(S.events.length>2000)S.events.splice(0,S.events.length-2000);store.set(stateKey,S);}
  if(HAS_SHEET&&!SAMPLE){try{SheetLog.activity({event:row.event,set:row.set,role:row.role,eq:row.eq,answer:row.answer,right:row.right,own:row.own,support:row.support,checks:row.checks,detail:typeof row.detail==="string"?row.detail:JSON.stringify(row.detail)});}catch(e){}}
  window.__records.push(row);renderTeacher();}
function kiOf(){return K[PAGE.set]||(K[PAGE.set]={ki:PAGE.ki,res:[],passed:false,stage:""});}
function sendState(status){if(!HAS_SHEET||SAMPLE)return;const k=kiOf();
  try{SheetLog.state({set:PAGE.set,ki:PAGE.ki,teacher:PAGE.teacher,status,stage:k.stage||"",own_right:k.res.filter(r=>r.own&&r.right).length,items:k.res.length});}catch(e){}}
function flushSoon(){if(HAS_SHEET&&!SAMPLE)setTimeout(()=>{try{SheetLog.flush()}catch(e){}},50);}

/* ---------- screen ---------- */
function clearStage(){window.__qe.part=null;$("pic").innerHTML="";$("words").innerHTML="";$("acts").innerHTML="";screenText=[];itemOpen=false;stopSpeech();$("h1").textContent=PAGE.title;}
function para(t,cls){const p=document.createElement("p");p.className=cls||"say";p.textContent=t;$("words").appendChild(p);screenText.push(plain(t));return p;}
function replyBox(t,kind){const p=document.createElement("p");p.className="reply "+kind;p.textContent=t;$("words").appendChild(p);screenText.push(plain(t));p.scrollIntoView&&p.scrollIntoView({block:"nearest"});return p;}
function actionBtn(label,fn,cls){const b=document.createElement("button");b.type="button";b.className="btn primary "+(cls||"");b.textContent=label;b.addEventListener("click",fn);$("acts").appendChild(b);screenText.push(label);return b;}
function nextButton(fn){$("acts").innerHTML="";const b=actionBtn("Next",fn,"next");b.focus({preventScroll:true});}

function makeCtx(role,kind){
  let noteEl=null,doneCalled=false;
  const ctx={role,kind:kind||"",contrast:"",rng,pick,int,
    get open(){return itemOpen&&!doneCalled;},
    el(t,a){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e;},
    svg(vb,label){$("pic").querySelectorAll("svg").forEach(s=>s.remove());const s=document.createElementNS(NS,"svg");s.setAttribute("viewBox",vb);s.setAttribute("role","img");s.setAttribute("aria-label",label||"");$("pic").prepend(s);return s;},
    picBelow(e){$("pic").appendChild(e);return e;},
    say(t,cls){return para(t,cls);},
    ask(t){return para(t,"q");},
    button(label,fn){$("acts").querySelectorAll(".decide").forEach(b=>b.remove());return actionBtn(label,()=>{if(itemOpen)fn();},"decide");},
    choices(list){const w=document.createElement("div");w.className="choices";list.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="btn ch";b.textContent=c.t;b.addEventListener("click",()=>{if(itemOpen){b.classList.add("picked");c.fn();}});w.appendChild(b);screenText.push(c.t);});$("words").appendChild(w);return w;},
    numberBox(label,fn){const w=document.createElement("div");w.className="ans";w.innerHTML=`<input class="box" inputmode="numeric" autocomplete="off" aria-label="${label}"><span>°</span>`;$("words").appendChild(w);
      const inp=w.querySelector("input");const go=()=>{if(!itemOpen)return;const raw=inp.value.replace(/°/g,"").trim();fn(/^\d{1,4}$/.test(raw)?Number(raw):null,raw);};
      inp.addEventListener("keydown",e=>{if(e.key==="Enter")go();});ctx.button("Check my answer",go);return inp;},
    note(t){ctx.clearNote();noteEl=replyBox(t,"info");noteEl.dataset.unreadable="1";},
    clearNote(){if(noteEl){noteEl.remove();noteEl=null;}},
    auto(a){window.__qe.part=a;},
    done(r){if(doneCalled)return;doneCalled=true;itemOpen=false;ctx.clearNote();
      $("words").querySelectorAll("input,.ch").forEach(x=>x.disabled=true);$("acts").innerHTML="";$("pic").querySelectorAll("button").forEach(x=>x.remove());
      if(r.reply)replyBox(r.reply,r.right?"ok":"no");ctx.onDone&&ctx.onDone(r);}
  };
  return ctx;}
function runTask(task,role,kind,onDone){clearStage();const ctx=makeCtx(role,kind);itemOpen=true;ctx.onDone=r=>onDone(r,ctx);task(ctx);return ctx;}

/* ---------- flow ---------- */
function freshStop(){return {phase:"worked",w:0,firstTry:[],pi:0,queue:null,missRun:0,res:[],resumed:false};}
function start(page){PAGE=page;stateKey="student2-"+page.set+"-v1";document.title=page.title;
  window.__qe.PAGE=page;
  if(QS.get("screen")){SAMPLE=true;S={events:[],stops:{}};K={};return sample(QS.get("screen"));}
  S=store.get(stateKey);if(!S||S.v!==1)S={v:1,st:null,events:[],stoppedOn:null,lastDay:null,review:false};
  K=store.get(kiKey)||{};
  if(HAS_SHEET)try{SheetLog.setSession("s2q-"+Date.now().toString(36));}catch(e){}
  const today=todayKey(),newDay=S.lastDay!==today;S.lastDay=today;
  record("session start",{detail:{version:page.version}});
  if(S.stoppedOn===today)return endScreen("stopped");
  if(S.stoppedOn){S.stoppedOn=null;if(S.st){S.st.phase="worked";S.st.w=0;S.st.resumed=true;S.st.missRun=0;}}
  if(!S.st)S.st=freshStop();
  if(newDay&&kiOf().passed&&S.events.some(e=>e.event==="answer"))S.review=true;
  saveAll();go();}
function go(){saveAll();renderTeacher();
  if(S.review)return reviewItem();
  if(kiOf().passed)return endScreen("all");
  const st=S.st;
  if(st.phase==="worked")return workedExample(st);
  if(st.phase==="supported")return supportedItem(st);
  return ownItem(st);}
function workedExample(st){
  runTask(PAGE.worked[st.w],"worked","w"+(st.w+1),(r)=>{
    st.firstTry.push(!!r.right);
    record("answer",{role:"worked example step",eq:r.eq||"",answer:r.answer||"",right:r.right?1:0,own:1,support:"worked example on screen",checks:PAGE.ki+" W"+(st.w+1),detail:{example:"W"+(st.w+1),tag:r.tag||""}});
    saveAll();
    nextButton(()=>{st.w++;if(st.w>=PAGE.worked.length){st.phase=st.resumed?"own":"supported";st.resumed=false;}go();});});}
function supportedItem(st){
  runTask(PAGE.sup,"supported","sup",(r)=>{
    record("answer",{role:"supported",eq:r.eq||"",answer:r.answer||"",right:r.right?1:0,own:0,support:PAGE.supSupport||"worked lines on screen",checks:PAGE.ki,detail:{tag:r.tag||""}});
    kiOf().stage="own items";nextButton(()=>{st.phase="own";go();});});}
function heldNow(st){const own=st.res.filter(r=>r.own&&r.right),last=st.res[st.res.length-1],kinds=new Set(own.map(r=>r.kind));
  const missing=PAGE.contrasts.filter(c=>!own.some(r=>r.contrast===c));
  return {held:!!last&&last.own&&last.right&&!missing.length&&kinds.size>=Math.min(3,Object.keys(PAGE.gen).length),missing,kinds:[...kinds]};}
function ownItem(st){
  if(!st.queue)st.queue=PAGE.plan.slice();const q=st.queue;
  if(st.pi>=q.length){const h=heldNow(st);if(h.held)return holds(st);q.push(h.missing.length?PAGE.contrastKind[h.missing[0]]:q[q.length-1]);}
  let kind=q[st.pi];const gate=(PAGE.gates||{})[kind];
  if(gate){const ok=st.res.filter(r=>r.own&&r.right).map(r=>r.kind);const miss=gate.find(g=>!ok.includes(g));if(miss){q.splice(st.pi,0,miss);kind=miss;}}
  showOwn(kind,"own",(r)=>{
    st.res.push(r);kiOf().res.push(r);
    if(r.right){st.missRun=0;st.pi++;}
    else{st.missRun++;st.pi++;q.splice(st.pi,0,kind);
      if(st.missRun>=2){saveAll();return nextButton(()=>stopForToday());}}
    saveAll();nextButton(()=>go());});}
function showOwn(kind,role,after){
  runTask(PAGE.gen[kind],role,kind,(r,ctx)=>{
    const res={kind,contrast:ctx.contrast||"",right:!!r.right,own:true,role,t:new Date().toISOString()};
    record("answer",{role,eq:r.eq||"",answer:r.answer||"",right:r.right?1:0,own:1,support:"none",checks:PAGE.ki+" "+kind+(res.contrast?" | contrast: "+res.contrast:""),
      detail:{kind,tag:r.tag||"",reply:plain(r.reply||""),itemDone:true,itemRight:!!r.right}});
    after(res);});}
function holds(st){const k=kiOf();k.passed=true;k.stage="held on own items (mixed set and gap still to come)";k.heldOn=new Date().toISOString();
  record("item holds",{role:"own",checks:PAGE.ki,detail:{rule:"last right on her own, every contrast case right on her own, at least three kinds right on her own",kinds:heldNow(st).kinds}});
  sendState("held");saveAll();go();}
function stopForToday(){S.stoppedOn=todayKey();kiOf().stage="saved stop: two items in a row not right";
  record("saved stop",{checks:PAGE.ki,detail:{reason:"two items in a row not right on her own"}});sendState("stopped for today");saveAll();flushSoon();endScreen("stopped");}
function reviewItem(){const kinds=PAGE.plan.filter(k=>!(PAGE.gates||{})[k]);
  showOwn(pick(kinds),"review",(r)=>{S.review=false;kiOf().res.push(r);
    if(!r.right){const k=kiOf();k.passed=false;k.stage="back to practice after a review miss";S.st=freshStop();S.st.phase="own";sendState("back to practice");
      record("teaching decision",{checks:PAGE.ki,detail:{action:"back to practice",reason:"review item not right"}});}
    saveAll();nextButton(()=>go());});}
function endScreen(why){clearStage();
  if(why==="stopped"){para("We stop here for today. Your place is kept.");para("Next time, you start again with an example and then new questions.");}
  else{para("That is the end of this part. Your work is kept.");para("Next time, there will be new questions.");}
  record("session end",{detail:{reason:why}});flushSoon();}

/* ---------- Read it, Pause, teacher strip ---------- */
function stopSpeech(){try{speechSynthesis.cancel();}catch(e){}}
function speakable(t){return t.replace(/∠/g,"angle ").replace(/°/g," degrees").replace(/−/g," minus ").replace(/\+/g," plus ").replace(/=/g," equals ").replace(/×/g," times ");}
function wire(){
  $("readBtn").addEventListener("click",()=>{stopSpeech();try{const u=new SpeechSynthesisUtterance(speakable(screenText.join(". ")));u.lang="en-IN";u.rate=.92;speechSynthesis.speak(u);}catch(e){}record("read it",{});});
  $("pauseBtn").addEventListener("click",()=>{stopSpeech();$("pauseOv").classList.remove("hide");$("resumeBtn").focus();record("pause",{});saveAll();});
  $("resumeBtn").addEventListener("click",()=>{$("pauseOv").classList.add("hide");record("resume",{});});}
function renderTeacher(){if(!TEACHER||!S||SAMPLE)return;const t=$("teacher");t.classList.remove("hide");const st=S.st,h=st?heldNow(st):null;
  t.innerHTML=`<b>For the teacher.</b> ${PAGE.ki} (${PAGE.teacher}); phase ${st?st.phase:"-"}; item ${st?st.pi+1:"-"} (${st&&st.queue?st.queue[st.pi]||"":""}); misses in a row ${st?st.missRun:"-"}; contrasts still needed: ${h?h.missing.join(", ")||"none":"-"}; kinds right: ${h?h.kinds.join(" "):"-"}. ${S.events.length} records${HAS_SHEET?", "+SheetLog.pending()+" waiting to send":", no Sheet logger"}. <button class="btn" id="tReset" type="button">Start this page again</button>`;
  $("tReset").onclick=()=>{try{localStorage.removeItem(stateKey);const k=store.get(kiKey)||{};delete k[PAGE.set];store.set(kiKey,k);}catch(e){}location.reload();};}

/* ---------- sample screens (?screen=...) ---------- */
function sample(name){const m=name.match(/^w(\d)$/);
  const done=role=>(r)=>{record("answer",{role,eq:r.eq||"",answer:r.answer||"",right:r.right?1:0,own:role==="supported"?0:1,support:"sample screen",checks:PAGE.ki,detail:{tag:r.tag||""}});nextButton(()=>{});};
  if(m)return runTask(PAGE.worked[Number(m[1])-1],"worked",name,done("worked example step"));
  if(name==="sup")return runTask(PAGE.sup,"supported","sup",done("supported"));
  if(PAGE.gen[name])return showOwn(name,"own",()=>nextButton(()=>{}));
  para("There is no screen called "+name+".");}

window.__qe={part:null,get S(){return S},get K(){return K},heldNow:()=>S&&S.st?heldNow(S.st):null,get PAGE(){return PAGE},set PAGE(v){}};
document.addEventListener("DOMContentLoaded",wire);
return {start,record};
})();
