/* Test for ki-ag-01-03.html, driven with real pointer clicks and real key presses in Chromium.
   Run:  node study-materials/equations-pages/equations-1.test.cjs   (tests site/equations-1.html)
   Needs Playwright. Set PLAYWRIGHT_PATH if it is not found in the places below. */
const path=require("path"),fs=require("fs");
const PW=[process.env.PLAYWRIGHT_PATH,"playwright",path.resolve(__dirname,"../agentic-generator/node_modules/playwright"),"C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright"].filter(Boolean);
let chromium;for(const p of PW){try{chromium=require(p).chromium;break;}catch(e){}}
if(!chromium){console.error("Playwright not found. Set PLAYWRIGHT_PATH.");process.exit(2);}
/* The live page loads assets/sheetlog.js, which posts to her real Sheet. The test runs a copy in a folder with no assets/, so only the stub logger below is used. */
const SITE_PAGE=path.resolve(__dirname,"../../site/equations-1.html");const TMP=fs.mkdtempSync(path.join(require("os").tmpdir(),"s2-eq1-"));
const PAGE=path.join(TMP,"equations-1.html");fs.writeFileSync(PAGE,fs.readFileSync(SITE_PAGE,"utf8").replace(/<script src="assets\/[^"]+"><\/script>\n?/g,""));
const URL0=require("url").pathToFileURL(PAGE).href;
const SHOTS=process.env.SHOTS||path.join(TMP,"test-shots");fs.mkdirSync(SHOTS,{recursive:true});
const MINUS="\u2212",TIMES="\u00d7";
const norm=s=>String(s).replace(/`/g,"").replace(/[\u00a0]/g," ").replace(/\u2060/g,"").replace(/\s+/g," ").trim();
let pass=0,fail=0;const fails=[];
function ok(cond,msg){if(cond)pass++;else{fail++;fails.push(msg);console.log("  FAIL "+msg);}}
const SHEET_STUB=`window.__sheet=[];window.__state=[];window.SheetLog={setSession(){},activity(r){window.__sheet.push(r)},state(r){window.__state.push(r)},flush(){},pending(){return 0}};`;
const BANNED=/KI-|SK-|M8\d\d|knowledge item|\bskill|mastery|\blevel|\brung|\bstays?\b|\bmoves?\b|\u2014|\bcop(y|ies)\b|\bturned\b|signal|contrast|supported|teacher|\bcounts?\b/i;
const seenText=new Set();

/* ---------- driving the page ---------- */
async function key(p,k,kb){if(kb){const map={[MINUS]:"-",[TIMES]:"*","OK":"Enter","⌫":"Backspace"};await p.keyboard.press(map[k]||k);}else await p.click(`.key[data-k="${k}"]`);}
async function typeIn(p,str,kb){for(const ch of str)await key(p,ch,kb);await key(p,"OK",kb);}
const toKeys=s=>s.replace(/\s+/g,"").replace(/-/g,MINUS).replace(/\*/g,TIMES);
async function partInfo(p){return p.evaluate(()=>{const P=window.__ki.part,C=window.__ki.ctx||{};if(!P)return null;
  const o={type:P.type,ans:P.ans,yes:P.yes,no:P.no,canon:P.canon,L:P.L||C.letter,v:P.v,T:P.T,solve:P.solve,wrongs:P.wrongs,a:P.a,b:P.b,endOnWrong:!!P.endOnWrong,onlyIfRight:!!P.onlyIfRight,
   rows:P.rows&&P.rows.map(r=>({ans:r.ans})),wrongReply:P.wrongReply,wrong:P.wrong||null,forms:(P.forms||[]).map(f=>({a:f.a,b:f.b,reply:f.reply})),
   options:P.options&&P.options.map(x=>({t:x.t,right:!!x.right,reply:x.reply||""})),hold:!!C.hold};return o;});}
async function clickChoice(p,text){const want=norm(text);const btns=p.locator(".choices .ch:not([disabled])");const n=await btns.count();
  for(let i=0;i<n;i++){if(norm(await btns.nth(i).textContent())===want){await btns.nth(i).click();return true;}}return false;}
function exprString(a,b,L){/* a·L + b as she would type it */const term=a===1?L:a===-1?MINUS+L:a+L;
  if(a===0)return String(b);if(b===0)return term;if(a<0)return `${b}${MINUS}${Math.abs(a)===1?"":Math.abs(a)}${L}`;return `${term}${b<0?MINUS:"+"}${Math.abs(b)}`;}
async function answerRight(p,info,kb){
  if(info.type==="num")return typeIn(p,String(info.ans),kb);
  if(info.type==="own")return typeIn(p,String(info.solve),kb);
  if(info.type==="nums"){for(const r of info.rows)await typeIn(p,String(r.ans),kb);return;}
  if(info.type==="expr")return typeIn(p,toKeys(info.canon),kb);
  if(info.type==="ownexpr")return typeIn(p,`${info.L}+${info.T-info.v}`,kb);
  if(info.type==="yn")return clickChoice(p,info.ans?info.yes:info.no);
  if(info.type==="choice")return clickChoice(p,info.options.find(o=>o.right).t);
}
/* Planned wrong answers for one part, each with the reply the spec says she gets (or null where only "not green" is checked). */
function plannedWrongs(info){const W=[];
  if(info.type==="num"){for(const k in (info.wrong||{}))W.push({type:"num",val:k,expect:info.wrong[k]});if(!W.length||info.hold)W.push({type:"num",val:String(Number(info.ans)+100),expect:null});}
  if(info.type==="own")for(const w of info.wrongs)W.push({type:"num",val:String(w),expect:null});
  if(info.type==="nums")W.push({type:"nums",vals:info.rows.map((r,i)=>String(i?r.ans:r.ans+1)),expect:null});
  if(info.type==="expr")for(const f of info.forms)W.push({type:"expr",val:exprString(f.a,f.b,info.L),expect:f.reply});
  if(info.type==="ownexpr"){W.push({type:"expr",val:String(info.T),expect:"is a number with no"});W.push({type:"expr",val:`${info.L}+${info.T-info.v+1}`,expect:"That is not"});}
  if(info.type==="yn")W.push({type:"yn",pick:info.ans?info.no:info.yes,expect:info.hold?null:info.wrongReply});
  if(info.type==="choice")for(const o of info.options.filter(o=>!o.right))W.push({type:"choice",pick:o.t,expect:info.hold?null:(o.reply||null)});
  return W;}
async function giveWrong(p,w,kb){
  if(w.type==="num")return typeIn(p,w.val.replace(/-/g,MINUS),kb);
  if(w.type==="nums"){for(const v of w.vals)await typeIn(p,v,kb);return;}
  if(w.type==="expr")return typeIn(p,toKeys(w.val),kb);
  return clickChoice(p,w.pick);}
async function collectText(p){const t=await p.evaluate(()=>[...document.querySelectorAll("#stage p,#stage .reply,#stage .ch,#stage th,#stage td,.top .btn,#pauseOv p,#pauseOv .btn,.key")].map(e=>e.textContent));t.forEach(x=>seenText.add(norm(x)));}
async function solveScreen(p,kb){/* answers whatever is on screen right, then presses Next; returns false at an end screen */
  for(let guard=0;guard<10;guard++){
    const next=p.locator(".actions .btn");if(await next.count()){await collectText(p);if(kb){await next.focus();await p.keyboard.press("Enter");}else await next.click();return true;}
    const info=await partInfo(p);const hasCtl=await p.locator(".keypad, .choices .ch:not([disabled])").count();
    if(!info||!hasCtl){return false;}
    await answerRight(p,info,kb);}
  return true;}

(async()=>{
const br=await chromium.launch();
const errors=[];
const newPage=async(opts={})=>{const ctx=await br.newContext({viewport:opts.viewport||{width:900,height:1000},hasTouch:!!opts.touch});
  if(opts.sheet!==false)await ctx.addInitScript(SHEET_STUB);
  if(opts.clear)await ctx.addInitScript(()=>{try{localStorage.clear()}catch(e){}});
  const p=await ctx.newPage();p.on("pageerror",e=>errors.push(e.message));p.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  await ctx.route(/^https?:/,r=>{errors.push("outside request "+r.request().url());r.abort();});return p;};

/* ===== 1. Offline and source checks ===== */
console.log("1. source");
const src=fs.readFileSync(PAGE,"utf8");
ok(!/\bfetch\(|https?:\/\/(?!www\.w3\.org)/.test(src.replace(/<!--[\s\S]*?-->/g,"")),"page makes no outside request");
ok(!/bag|counter|balance/i.test(src.replace(/<!--[\s\S]*?-->/g,"").replace(/\/\*[\s\S]*?\*\//g,"")),"no bags, counters or balance in the page");

/* ===== 2. Expression reader ===== */
console.log("2. expression reader");
{const p=await newPage({clear:true});await p.goto(URL0+"?screen=S5a");
 const r=await p.evaluate(()=>{const K=window.__ki,eq=(s,a,L,b)=>{const e=K.readExpr(s);return !!e&&K.sameExpr(e,a,L,b);};
  return {a:eq("x+4",1,"x",4),b:eq("4+x",1,"x",4),c:eq("x\u22124",1,"x",-4),d:!eq("4\u2212x",1,"x",-4),e:eq("3x",3,"x",0),f:eq("3\u00d7x",3,"x",0),g:eq("x\u00d73",3,"x",0),h:eq("x+x+x",3,"x",0),
   i:K.readExpr("3x+")===null,j:K.readExpr("x3")===null,k:K.readExpr("+")===null,l:eq("2+3x",3,"x",2),m:eq("3.5",0,"x",3.5),n:K.readNumber("3.5")===3.5,o:K.readNumber("3..5")===null,
   p:K.substitute("2x+1","x",3)==="2 \u00d7 3 + 1"};});
 for(const k in r)ok(r[k],"expression reader case "+k);
 await p.context().close();}

/* ===== 3. Every planned wrong answer, on every kind of item ===== */
console.log("3. planned wrong answers");
const KINDS=await (async()=>{const p=await newPage({clear:true});await p.goto(URL0+"?screen=S1a");const k=await p.evaluate(()=>[...Object.keys(window.__ki.G01),...Object.keys(window.__ki.G03)]);await p.context().close();return k;})();
let wrongCount=0;
{const p=await newPage({clear:true});
 for(const kind of KINDS){
  await p.goto(URL0+"?screen="+kind);const nParts=await p.evaluate(()=>0);
  /* walk the parts: for part j, try every planned wrong after answering parts < j right */
  for(let j=0;j<6;j++){
   await p.goto(URL0+"?screen="+kind);let info=await partInfo(p);let reached=true;
   for(let i=0;i<j;i++){if(!info){reached=false;break;}await answerRight(p,info,false);const nx=p.locator(".actions .btn");if(await nx.count())await nx.click();info=await partInfo(p);
     if(await p.locator(".keypad, .choices .ch:not([disabled])").count()===0){reached=false;break;}}
   if(!reached||!info)break;
   const wrongs=plannedWrongs(info);
   const already=await p.evaluate(()=>window.__records?window.__records.length:0);
   for(let w=0;w<wrongs.length;w++){
    if(w>0){await p.goto(URL0+"?screen="+kind);let inf=await partInfo(p);for(let i=0;i<j;i++){await answerRight(p,inf,false);const nx=p.locator(".actions .btn");if(await nx.count())await nx.click();inf=await partInfo(p);}info=inf;}
    const W=plannedWrongs(info)[w];await giveWrong(p,W,w%2===1&&W.type!=="yn"&&W.type!=="choice");
    /* if the reply is held to the end (S7, T5), finish the remaining parts right so the summary shows */
    let guard=0;while(info.hold&&guard++<4){const nx=await p.locator(".actions .btn").count();const ctl=await p.locator(".keypad, .choices .ch:not([disabled])").count();if(nx||!ctl)break;const inf=await partInfo(p);await answerRight(p,inf,false);}
    const label=`${kind} part ${j+1} wrong "${W.val||W.vals||W.pick}"`;
    const replies=(await p.locator("#stage .reply:not([data-unreadable])").allTextContents()).map(norm);
    const last=replies[replies.length-1]||"";
    ok(last.length>0,label+": a reply is shown");
    ok(!/^Right\b/.test(last),label+": the reply does not say Right");
    if(W.expect)ok(last.includes(norm(W.expect)),label+": reply is the planned one ("+norm(W.expect).slice(0,60)+"...)");
    const green=await p.locator(".box.right, .ch.right").count();
    if(W.type==="num"||W.type==="expr")ok(await p.locator(".box.wrong").count()>=1,label+": her box is marked not right");
    if(W.type==="choice"&&!info.hold)ok(await p.locator(".ch.wrong").count()===1,label+": her choice is marked not right");
    const recs=await p.evaluate(()=>window.__records.filter(r=>r.event==="answer"));const lastRec=recs[recs.length-1];
    const anyWrong=recs.some(r=>r.right===0);ok(anyWrong,label+": a record says right = 0");
    const itemEnd=recs.filter(r=>r.detail&&r.detail.itemDone);if(itemEnd.length)ok(itemEnd[itemEnd.length-1].detail.itemRight===false,label+": the item is not counted right");
    await collectText(p);wrongCount++;}
  }
 }
 /* The two-choice reason never counts alone: sort right + reason wrong is not right; sort wrong skips the reason. */
 await p.goto(URL0+"?screen=T1incWhy");let info=await partInfo(p);await answerRight(p,info,false);await p.locator(".actions .btn").click();
 info=await partInfo(p);await clickChoice(p,info.options.find(o=>!o.right).t);
 let recs=await p.evaluate(()=>window.__records.filter(r=>r.event==="answer"));ok(recs[recs.length-1].detail.itemRight===false,"T1 reason wrong after a right sort: item not right");
 await p.goto(URL0+"?screen=T1incWhy");info=await partInfo(p);await clickChoice(p,info.yes);
 ok(await p.locator(".choices .ch:not([disabled])").count()===0&&await p.locator(".actions .btn").count()===1,"T1 sort wrong: no reason question, Next only");
 /* S3: the right choice with a wrong value is not right */
 await p.goto(URL0+"?screen=S3");info=await partInfo(p);await answerRight(p,info,false);await p.locator(".actions .btn").click();info=await partInfo(p);await typeIn(p,String(info.ans+1),false);
 recs=await p.evaluate(()=>window.__records.filter(r=>r.event==="answer"));ok(recs[recs.length-1].detail.itemRight===false,"S3 right choice, wrong value: item not right");
 /* Unreadable answers are said honestly and not marked wrong */
 await p.goto(URL0+"?screen=S5b");info=await partInfo(p);await typeIn(p,info.L+MINUS,false);
 ok((await p.locator(".reply[data-unreadable]").textContent()).includes("is not finished"),"unfinished expression: honest reply");
 ok(await p.locator(".box.wrong").count()===0,"unfinished expression: not marked wrong");
 await typeIn(p,String(-info.b),false);ok(await p.locator(".box.right").count()===1,"after fixing the expression, the right answer registers");
 await p.goto(URL0+"?screen=S1a");info=await partInfo(p);await typeIn(p,info.L,false);ok((await p.locator(".reply[data-unreadable]").textContent()).includes("answer here is a number"),"letter typed in a number box: honest reply");
 /* x + 4 and 4 + x both accepted; 3 × x accepted with the written form */
 await p.goto(URL0+"?screen=S5a");info=await partInfo(p);await typeIn(p,`${info.b}+${info.L}`,false);ok(await p.locator(".box.right").count()===1,"k + x accepted for k more than x");
 await p.goto(URL0+"?screen=S5c");info=await partInfo(p);await typeIn(p,`${info.a}${TIMES}${info.L}`,false);ok((await p.locator(".reply").last().textContent()).includes("We write this as"),"k × x accepted with 'We write this as kx'");
 /* the decimal point */
 await p.goto(URL0+"?screen=S2d");info=await partInfo(p);await answerRight(p,info,false);info=await partInfo(p);ok(String(info.ans).includes("."),"S2 decimal case asks for a decimal");await typeIn(p,String(info.ans),false);ok(await p.locator(".box.right").count()===1,"decimal answer typed with the point key is accepted");
 /* T5 never uses x = 1 */
 let ones=0;for(let i=0;i<15;i++){await p.goto(URL0+"?screen=T5");await answerRight(p,await partInfo(p),false);const r=(await p.locator(".qrow .ask").first().textContent());if(/ is 1,/.test(norm(r)))ones++;}
 ok(ones===0,"T5 never checks with the letter equal to 1");
 await p.context().close();}
console.log(`   ${wrongCount} planned wrong answers tried`);

/* ===== 4. Full journey: both stops, right answers, pointer and keyboard ===== */
console.log("4. full journey");
let journeyPage;
{const p=await newPage({clear:false});journeyPage=p;await p.goto(URL0+"?fresh");await p.evaluate(()=>localStorage.clear());await p.goto(URL0);
 ok(await p.locator("#stage").evaluate(e=>e.innerHTML.length)>200,"page boots with content");
 ok(await p.locator("#teacher").isHidden(),"teacher strip hidden on her screen");
 await p.screenshot({path:path.join(SHOTS,"journey-start.png"),fullPage:true});
 let screens=0,kb=false,sawSupported=false;
 while(screens<120){const before=await p.evaluate(()=>window.__ki.S.stops[window.__ki.S.stop]?.phase);if(before==="supported")sawSupported=true;
   const going=await solveScreen(p,kb);if(!going)break;screens++;kb=!kb;}
 await collectText(p);
 const endText=norm(await p.locator("#stage").textContent());
 ok(endText.includes("That is the end of this part"),"journey reaches the end screen ("+endText.slice(0,50)+")");
 const K=await p.evaluate(()=>window.__ki.K);ok(K["ki-ag-01"]&&K["ki-ag-01"].passed&&K["ki-ag-03"]&&K["ki-ag-03"].passed,"both items hold in student2-ki-v1");
 ok(sawSupported,"supported item shown by default");
 const sheet=await p.evaluate(()=>window.__sheet);const fields=["event","set","role","eq","answer","right","own","support","checks","detail"];
 ok(sheet.length>0&&sheet.every(r=>fields.every(f=>f in r)),"every Sheet row has event, set, role, eq, answer, right, own, support, checks, detail");
 const answers=sheet.filter(r=>r.event==="answer");ok(answers.length>=40,"one Sheet row per answer ("+answers.length+")");
 ok(answers.every(r=>typeof r.detail==="string"),"detail is sent as text");
 ok(sheet.filter(r=>r.event==="item holds").length===2,"two 'item holds' rows");
 ok(answers.some(r=>r.role==="supported"&&r.own===0),"supported item recorded as not her own");
 const roles=new Set(answers.map(r=>r.role));ok(roles.has("worked example step")&&roles.has("own"),"roles recorded: worked example step, own");
 const st=await p.evaluate(()=>window.__state);ok(st.length===2&&st.every(s=>s.status==="held"),"state rows sent for both held items");
 /* the letter varies across her own items */
 const letters=new Set(answers.filter(r=>r.role==="own").map(r=>(r.eq.match(/\b([xyna])\b/)||[])[1]).filter(Boolean));ok(letters.size>=3,"her items use at least three letters ("+[...letters].join(",")+")");
 /* every contrast case was right on her own */
 const checks=answers.filter(r=>r.role==="own"&&r.right===1).map(r=>r.checks).join("|");
 for(const c of ["x = 0","decimal value","order in x − k","same letter twice","number, not object","equation beside expression","incomplete form","3x as 3 × x","same numbers, different expression","conjoining"])ok(checks.includes("contrast: "+c),"contrast case reached: "+c);
 /* review after a gap: one item of each held item; a wrong one sends it back */
 await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem("student2-ki-ag01-03-v1"));s.lastDay="2000-01-01";localStorage.setItem("student2-ki-ag01-03-v1",JSON.stringify(s));});
 await p.goto(URL0);let info=await partInfo(p);ok(!!info,"next day opens with a review item");
 const w=plannedWrongs(info)[0];await giveWrong(p,w,false);let g=0;while(g++<4&&!(await p.locator(".actions .btn").count())){const inf=await partInfo(p);if(!(await p.locator(".keypad, .choices .ch:not([disabled])").count()))break;await answerRight(p,inf,false);}
 const recs=await p.evaluate(()=>window.__records.filter(r=>r.event==="answer"));ok(recs[recs.length-1].role==="review","review answer recorded with role review");
 await p.locator(".actions .btn").click();
 /* the review item can come from either held item; the one she got wrong goes back to practice */
 const revSet=recs[recs.length-1].set;const K2=await p.evaluate(()=>window.__ki.K);ok(["ki-ag-01","ki-ag-03"].includes(revSet)&&K2[revSet]&&K2[revSet].passed===false,"a wrong review item sends its item ("+revSet+") back to practice");
 await p.context().close();}

/* ===== 5. Two misses in a row: saved stop, same day, next day ===== */
console.log("5. two-miss stop");
{const p=await newPage({});await p.goto(URL0+"?x");await p.evaluate(()=>localStorage.clear());await p.goto(URL0);
 while(await p.evaluate(()=>window.__ki.S.stops[window.__ki.S.stop]?.phase)!=="own")await solveScreen(p,false);
 const kind1=await p.evaluate(()=>{const s=window.__ki.S.stops["ki-ag-01"];return s.queue[s.pi];});
 for(let miss=0;miss<2;miss++){let info=await partInfo(p);await giveWrong(p,plannedWrongs(info)[0],false);
   let g=0;while(g++<4&&!(await p.locator(".actions .btn").count())){const inf=await partInfo(p);if(!(await p.locator(".keypad, .choices .ch:not([disabled])").count()))break;await answerRight(p,inf,false);}
   if(miss===0){const nextKind=await p.evaluate(()=>{const s=window.__ki.S.stops["ki-ag-01"];return s.queue[s.pi];});ok(nextKind===kind1,"after one miss, the next item is a fresh one of the same kind ("+kind1+")");}
   await p.locator(".actions .btn").click();}
 const t=norm(await p.locator("#stage").textContent());ok(t.includes("We stop here for today. Your place is kept."),"two misses in a row: saved stop screen");
 await collectText(p);await p.screenshot({path:path.join(SHOTS,"saved-stop.png"),fullPage:true});
 ok(await p.locator(".keypad, .choices .ch").count()===0,"stop screen has no answer controls");
 const sheet=await p.evaluate(()=>window.__sheet);ok(sheet.some(r=>r.event==="saved stop"),"saved stop recorded");
 await p.reload();ok(norm(await p.locator("#stage").textContent()).includes("We stop here for today"),"reload on the same day stays stopped");
 await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem("student2-ki-ag01-03-v1"));s.stoppedOn="2000-01-01";s.lastDay="2000-01-01";localStorage.setItem("student2-ki-ag01-03-v1",JSON.stringify(s));});
 await p.reload();ok(norm(await p.locator("#stage").textContent()).includes("the letter x stands for a number"),"next day starts with the worked example again");
 let sawSup=false;for(let i=0;i<10;i++){const ph=await p.evaluate(()=>window.__ki.S.stops["ki-ag-01"].phase);if(ph==="supported")sawSup=true;if(ph==="own")break;await solveScreen(p,false);}
 ok(!sawSup,"after a saved stop, worked examples lead straight to her own items");
 const k2=await p.evaluate(()=>{const s=window.__ki.S.stops["ki-ag-01"];return s.queue[s.pi];});ok(k2===kind1,"her place is kept: the same kind of item comes next, with new numbers");
 await p.context().close();}

/* ===== 6. Skip-supported setting ===== */
console.log("6. skip setting");
{const p=await newPage({});await p.goto(URL0+"?y");await p.evaluate(()=>localStorage.clear());await p.goto(URL0+"?skipSupported=1");
 let sup=false;for(let i=0;i<12;i++){const ph=await p.evaluate(()=>window.__ki.S.stops["ki-ag-01"]?.phase);if(ph==="supported")sup=true;if(ph==="own")break;await solveScreen(p,false);}
 ok(!sup,"skipSupported=1 and every step right first time: supported item skipped");
 ok((await p.evaluate(()=>window.__sheet)).some(r=>r.event==="supported item skipped"),"the skip is recorded");
 await p.evaluate(()=>localStorage.clear());await p.goto(URL0+"?skipSupported=1&z");
 await typeIn(p,"13",false);/* W1 first step wrong */
 sup=false;for(let i=0;i<12;i++){const ph=await p.evaluate(()=>window.__ki.S.stops["ki-ag-01"]?.phase);if(ph==="supported"){sup=true;break;}if(ph==="own")break;await solveScreen(p,false);}
 ok(sup,"skipSupported=1 but a step was wrong: supported item shown");
 await p.context().close();}

/* ===== 7. Pause and Read it ===== */
console.log("7. pause");
{const p=await newPage({clear:true});await p.goto(URL0+"?screen=S1a");await p.click("#pauseBtn");ok(await p.locator("#pauseOv").isVisible(),"Pause shows the paused card");
 await p.keyboard.press("5");ok((await p.locator(".box").textContent()).trim()==="","keys do nothing while paused");
 await p.click("#resumeBtn");ok(await p.locator("#pauseOv").isHidden(),"Go on closes it");await p.click("#readBtn");ok(true,"Read it runs without error");
 for(let i=0;i<3;i++)await p.click(".key[data-k=OK]");ok(await p.locator(".reply").count()===0,"OK on an empty box does nothing (no reply, no record)");
 await p.context().close();}

/* ===== 8. Phone width: no sideways scroll, targets at least 44 px ===== */
console.log("8. phone width");
{const p=await newPage({clear:true,viewport:{width:375,height:812},touch:true});
 const screens=["w01-1","w01-2","w01-3","sup01","w03-1","w03-2","w03-3","sup03",...KINDS];
 for(const s of screens){await p.goto(URL0+"?screen="+s);
  for(let round=0;round<2;round++){
   const sw=await p.evaluate(()=>document.documentElement.scrollWidth);ok(sw<=375,s+": no sideways scroll ("+sw+")");
   const small=await p.evaluate(()=>[...document.querySelectorAll("button")].filter(b=>b.offsetParent).map(b=>{const r=b.getBoundingClientRect();return {t:b.textContent.trim(),w:r.width,h:r.height};}).filter(r=>r.w<44||r.h<44));
   ok(small.length===0,s+": every button at least 44 px "+JSON.stringify(small.slice(0,2)));
   const info=await partInfo(p);if(!info||round)break;await answerRight(p,info,false);}
  if(["w01-1","S3","T5","w03-3","S7","T1incWhy"].includes(s))await p.screenshot({path:path.join(SHOTS,"phone-"+s+".png"),fullPage:true});}
 await p.context().close();}

/* ===== 9. Wording scan on everything she saw ===== */
console.log("9. wording");
const texts=[...seenText].filter(Boolean);
const bad=texts.filter(t=>BANNED.test(t));ok(bad.length===0,"no ids, teacher words or banned words on her screen "+JSON.stringify(bad.slice(0,5)));
const colon=texts.filter(t=>/[a-z]: /i.test(t));ok(colon.length===0,"no colon fragments "+JSON.stringify(colon.slice(0,3)));
const notQ=texts.filter(t=>/(what|which|is|can|do|does)\b[^.?]*$/i.test(t)&&/^(What|Which|Is|Can|Do|Does)\b/.test(t)&&!t.endsWith("?"));ok(notQ.length===0,"questions end with a question mark "+JSON.stringify(notQ.slice(0,3)));
const pfirst=texts.filter(t=>/\b(p|b|t) (pens|books|bus tickets)\b/.test(t));ok(pfirst.length===0,"a letter is never the first letter of the thing counted");
fs.writeFileSync(path.join(SHOTS,"strings-she-saw.txt"),texts.sort().join("\n"),"utf8");

ok(errors.length===0,"no page errors or outside requests "+JSON.stringify(errors.slice(0,3)));
await br.close();
console.log(`\n${pass} passed, ${fail} failed`);if(fail){console.log(fails.slice(0,40).join("\n"));process.exit(1);}
})().catch(e=>{console.error(e);process.exit(1);});
