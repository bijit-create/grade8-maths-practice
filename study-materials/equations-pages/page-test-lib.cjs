/* Shared test for the Student 2 KI pages built by build/make-pages.cjs.
   Same checklist as the approved ki-ag-01-03.test.cjs, read from the page itself (its STOPS) instead of being typed out.
   Each page has its own <page>.test.cjs that calls run({...}). Needs Playwright (PLAYWRIGHT_PATH if not found). */
const path=require("path"),fs=require("fs");
const PW=[process.env.PLAYWRIGHT_PATH,"playwright",path.resolve(__dirname,"../agentic-generator/node_modules/playwright"),"C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright"].filter(Boolean);
let chromium;for(const p of PW){try{chromium=require(p).chromium;break;}catch(e){}}
const MINUS="\u2212",TIMES="\u00d7";
const norm=s=>String(s).replace(/`/g,"").replace(/[\u00a0]/g," ").replace(/\u2060/g,"").replace(/\s+/g," ").trim();
const SHEET_STUB=`window.__sheet=[];window.__state=[];window.SheetLog={setSession(){},activity(r){window.__sheet.push(r)},state(r){window.__state.push(r)},flush(){},pending(){return 0}};`;
const BANNED=/KI-|SK-|M8\d\d|knowledge item|\bskill|mastery|\blevel|\brung|\bstays?\b|\bmoves?\b|\u2014|\bcop(y|ies)\b|\bturned\b|signal|contrast|supported|teacher|\bcounts?\b/i;

async function run(cfg){
if(!chromium){console.error("Playwright not found. Set PLAYWRIGHT_PATH.");process.exit(2);}
/* cfg.page is a file in site/. The test runs a copy in a temp folder with no assets/, so the stub logger is used and nothing reaches her real Sheet. */
const TMP=fs.mkdtempSync(path.join(require("os").tmpdir(),"s2-page-"));const PAGE=path.join(TMP,path.basename(cfg.page));fs.writeFileSync(PAGE,fs.readFileSync(path.resolve(__dirname,"../../site",cfg.page),"utf8").replace(/<script src="assets\/[^"]+"><\/script>\n?/g,""));const URL0=require("url").pathToFileURL(PAGE).href;
const SHOTS=process.env.SHOTS||path.join(TMP,"test-shots",cfg.page.replace(/\.html$/,""));fs.mkdirSync(SHOTS,{recursive:true});
let pass=0,fail=0;const fails=[];const seenText=new Set();
function ok(cond,msg){if(cond)pass++;else{fail++;fails.push(msg);console.log("  FAIL "+msg);}}

/* ---------- driving the page ---------- */
async function key(p,k,kb){if(k==="-")k=MINUS;if(k==="*")k=TIMES;if(kb){const map={[MINUS]:"-",[TIMES]:"*","OK":"Enter","⌫":"Backspace"};await p.keyboard.press(map[k]||k);}else await p.click(`.key[data-k="${k}"]`);}
async function typeIn(p,str,kb){for(const ch of str.replace(/\s+/g,""))await key(p,ch,kb);await key(p,"OK",kb);}
const toKeys=s=>s.replace(/\s+/g,"").replace(/-/g,MINUS).replace(/\*/g,TIMES);
async function partInfo(p){return p.evaluate(()=>{const P=window.__ki.part,C=window.__ki.ctx||{};if(!P)return null;
  const o={type:P.type,ans:P.ans,yes:P.yes,no:P.no,canon:P.canon,L:P.L||C.letter,v:P.v,T:P.T,solve:P.solve,wrongs:P.wrongs,a:P.a,b:P.b,letterFirst:P.letterFirst||null,want:P.want||null,sol:P.sol,
   forms2:(P.forms||[]).filter(f=>f.l).map(f=>({l:f.l,r:f.r,reply:f.reply})),
   rows:P.rows&&P.rows.map(r=>({ans:r.ans})),wrongReply:P.wrongReply,wrong:P.wrong||null,forms:(P.forms||[]).filter(f=>f.a!==undefined).map(f=>({a:f.a,b:f.b,reply:f.reply})),
   options:P.options&&P.options.map(x=>({t:x.t,right:!!x.right,reply:x.reply||""})),hold:!!C.hold};return o;});}
async function clickChoice(p,text){const want=norm(text);const btns=p.locator(".choices .ch:not([disabled])");const n=await btns.count();
  for(let i=0;i<n;i++){if(norm(await btns.nth(i).textContent())===want){await btns.nth(i).click();return true;}}return false;}
function exprString(a,b,L){const term=a===1?L:a===-1?MINUS+L:a+L;
  if(a===0)return String(b).replace("-",MINUS);if(b===0)return term.replace("-",MINUS);if(a<0)return `${String(b).replace("-",MINUS)}${MINUS}${Math.abs(a)===1?"":Math.abs(a)}${L}`;return `${term}${b<0?MINUS:"+"}${Math.abs(b)}`;}
async function typeTwo(p,l,r,L,kb){await typeIn(p,exprString(l[0],l[1],L),kb);await typeIn(p,exprString(r[0],r[1],L),kb);}
async function answerRight(p,info,kb){
  if(info.type==="num")return typeIn(p,toKeys(String(info.ans)),kb);
  if(info.type==="own")return typeIn(p,toKeys(String(info.solve)),kb);
  if(info.type==="nums"){for(const r of info.rows)await typeIn(p,toKeys(String(r.ans)),kb);return;}
  if(info.type==="expr")return typeIn(p,toKeys(info.canon),kb);
  if(info.type==="exprs"){for(const f of info.ans)await typeIn(p,exprString(f[0],f[1],info.L),kb);return;}
  if(info.type==="eqn")return typeTwo(p,info.want.l,info.want.r,info.L,kb);
  if(info.type==="ownexpr")return typeIn(p,`${info.L}+${info.T-info.v}`,kb);
  if(info.type==="yn")return clickChoice(p,info.ans?info.yes:info.no);
  if(info.type==="choice")return clickChoice(p,info.options.find(o=>o.right).t);
}
function plannedWrongs(info){const W=[];
  if(info.type==="num"){for(const k in (info.wrong||{}))W.push({type:"num",val:k,expect:info.wrong[k]});if(!W.length||info.hold)W.push({type:"num",val:String(Number(info.ans)+100),expect:null});}
  if(info.type==="own")for(const w of info.wrongs)W.push({type:"num",val:String(w),expect:null});
  if(info.type==="nums")W.push({type:"nums",vals:info.rows.map((r,i)=>String(i?r.ans:r.ans+1)),expect:null});
  if(info.type==="expr"){for(const f of info.forms)W.push({type:"expr",val:exprString(f.a,f.b,info.L),expect:f.reply});if(info.letterFirst&&info.b!==0)W.push({type:"expr",val:exprString(info.a,info.b,info.L),expect:info.letterFirst,mustBeLetterLast:true});}
  if(info.type==="exprs"){const k=Object.keys(info.wrong||{});if(k.length)for(const key of k)W.push({type:"exprs",vals:key.split(" | ").map(s=>s.replace(/-/g,MINUS)),expect:info.wrong[key]});else W.push({type:"exprs",vals:info.ans.map((f,i)=>exprString(f[0]+(i?0:1),f[1],info.L)),expect:null});}
  if(info.type==="eqn"){for(const f of info.forms2)W.push({type:"eqn",l:f.l,r:f.r,expect:f.reply.includes("{VALUES}")?f.reply.split("{VALUES}")[0]:f.reply});}
  if(info.type==="ownexpr"){W.push({type:"expr",val:String(info.T),expect:"is a number with no"});W.push({type:"expr",val:`${info.L}+${info.T-info.v+1}`,expect:"That is not"});}
  if(info.type==="yn")W.push({type:"yn",pick:info.ans?info.no:info.yes,expect:info.hold?null:info.wrongReply});
  if(info.type==="choice")for(const o of info.options.filter(o=>!o.right))W.push({type:"choice",pick:o.t,expect:info.hold?null:(o.reply||null)});
  return W;}
async function giveWrong(p,w,kb,info){
  if(w.type==="num")return typeIn(p,toKeys(w.val),kb);
  if(w.type==="nums"||w.type==="exprs"){for(const v of w.vals)await typeIn(p,toKeys(v),kb);return;}
  if(w.type==="expr")return typeIn(p,toKeys(w.val),kb);
  if(w.type==="eqn")return typeTwo(p,w.l,w.r,info.L,kb);
  return clickChoice(p,w.pick);}
async function collectText(p){const t=await p.evaluate(()=>[...document.querySelectorAll("#stage p,#stage .reply,#stage .ch,#stage th,#stage td,.top .btn,#pauseOv p,#pauseOv .btn,.key")].map(e=>e.textContent));t.forEach(x=>seenText.add(norm(x)));}
async function controls(p){return p.locator(".keypad, .choices .ch:not([disabled])").count();}
async function finishItem(p){for(let g=0;g<10;g++){const done=await p.evaluate(()=>{const r=window.__records.filter(r=>r.event==="answer").pop();return !!(r&&r.detail&&r.detail.itemDone);});if(done)return;
  if(await controls(p)){await answerRight(p,await partInfo(p),false);continue;}const nx=p.locator(".actions .btn");if(await nx.count())await nx.click();else return;}}
async function solveScreen(p,kb){
  for(let guard=0;guard<12;guard++){
    const next=p.locator(".actions .btn");if(await next.count()){await collectText(p);if(kb){await next.focus();await p.keyboard.press("Enter");}else await next.click();return true;}
    const info=await partInfo(p);if(!info||!(await controls(p)))return false;
    await answerRight(p,info,kb);}
  return true;}

const br=await chromium.launch();const errors=[];
const newPage=async(opts={})=>{const ctx=await br.newContext({viewport:opts.viewport||{width:900,height:1000},hasTouch:!!opts.touch});
  if(opts.sheet!==false)await ctx.addInitScript(SHEET_STUB);
  if(opts.clear)await ctx.addInitScript(()=>{try{localStorage.clear()}catch(e){}});
  const p=await ctx.newPage();p.on("pageerror",e=>errors.push(e.message));p.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  await ctx.route(/^https?:/,r=>{errors.push("outside request "+r.request().url());r.abort();});return p;};

console.log("1. source");
const src=fs.readFileSync(PAGE,"utf8");const code=src.replace(/<!--[\s\S]*?-->/g,"").replace(/\/\*[\s\S]*?\*\//g,"");
ok(!/\bfetch\(|https?:\/\/(?!www\.w3\.org)/.test(src.replace(/<!--[\s\S]*?-->/g,"")),"page makes no outside request");
ok(!/bag|counter|balance/i.test(code),"no bags, counters or balance in the page");

/* what the page holds */
const META=await (async()=>{const p=await newPage({clear:true});await p.goto(URL0+"?screen=w1-1");
  const m=await p.evaluate(()=>{const S=window.__ki.STOPS;const order=Object.keys(S);return {order,stops:order.map(id=>({id,ki:S[id].ki,kinds:Object.keys(S[id].gen),worked:S[id].worked.length,contrasts:S[id].contrasts,first:S[id].worked[0].lines[0],stateKey:null}))};});
  await p.context().close();return m;})();
const KINDS=[].concat(...META.stops.map(s=>s.kinds));
const WSCREENS=[].concat(...META.stops.map((s,i)=>[...Array(s.worked).keys()].map(n=>`w${i+1}-${n+1}`).concat([`sup${i+1}`])));
const firstStop=META.order[0];

console.log("2. planned wrong answers ("+KINDS.length+" kinds, "+WSCREENS.length+" worked and helped screens)");
let wrongCount=0;
{const p=await newPage({clear:true});
 for(const kind of [...WSCREENS,...KINDS]){
  for(let j=0;j<6;j++){
   const reach=async()=>{await p.goto(URL0+"?seed="+(7+j)+"&screen="+kind);let inf=await partInfo(p);
     for(let i=0;i<j;i++){if(!inf||!(await controls(p)))return null;await answerRight(p,inf,false);const nx=p.locator(".actions .btn");if(await nx.count())await nx.click();inf=await partInfo(p);}
     if(!inf||!(await controls(p)))return null;return inf;};
   let info=await reach();if(!info)break;
   const wrongs=plannedWrongs(info);
   for(let w=0;w<wrongs.length;w++){
    if(w>0)info=await reach();
    const W=plannedWrongs(info)[w];await giveWrong(p,W,w%2===1&&W.type!=="yn"&&W.type!=="choice",info);
    let guard=0;while(info.hold&&guard++<4){if(await p.locator(".actions .btn").count()||!(await controls(p)))break;await answerRight(p,await partInfo(p),false);}
    const label=`${kind} part ${j+1} wrong "${W.val||W.vals||W.pick||JSON.stringify([W.l,W.r])}"`;
    const replies=(await p.locator("#stage .reply:not([data-unreadable])").allTextContents()).map(norm);const last=replies[replies.length-1]||"";
    ok(last.length>0,label+": a reply is shown");ok(!/^Right\b/.test(last),label+": the reply does not say Right");
    if(W.expect)ok(last.includes(norm(W.expect)),label+": reply is the planned one ("+norm(W.expect).slice(0,60)+"...) got: "+last.slice(0,80));
    if(["num","expr","exprs","eqn"].includes(W.type))ok(await p.locator(".box.wrong").count()>=1,label+": her box is marked not right");
    if(W.type==="choice"&&!info.hold)ok(await p.locator(".ch.wrong").count()===1,label+": her choice is marked not right");
    const recs=await p.evaluate(()=>window.__records.filter(r=>r.event==="answer"));
    ok(recs.some(r=>r.right===0),label+": a record says right = 0");
    const itemEnd=recs.filter(r=>r.detail&&r.detail.itemDone);if(itemEnd.length)ok(itemEnd[itemEnd.length-1].detail.itemRight===false,label+": the item is not counted right");
    await collectText(p);wrongCount++;}
  }
 }
 /* every kind can be answered right: right reply and green */
 for(const kind of KINDS){await p.goto(URL0+"?screen="+kind);let g=0;
  while(g++<10){if(await controls(p)){await answerRight(p,await partInfo(p),g%2===0);continue;}
   const done=await p.evaluate(()=>{const r=window.__records.filter(r=>r.event==="answer").pop();return !!(r&&r.detail&&r.detail.itemDone);});if(done)break;
   const nx=p.locator(".actions .btn");if(await nx.count())await nx.click();else break;}
  const recs=await p.evaluate(()=>window.__records.filter(r=>r.event==="answer"));const end=recs.filter(r=>r.detail&&r.detail.itemDone).pop();
  ok(end&&end.detail.itemRight===true,kind+": right answers give a right item");await collectText(p);}
 /* unreadable answers are said honestly and not marked wrong */
 const exprKind=KINDS.find(k=>true);await p.goto(URL0+"?screen="+META.stops[0].kinds[0]);
 let info=await partInfo(p);if(info&&info.type==="num"){await typeIn(p,info.L,false);const t=await p.locator(".reply[data-unreadable]").count();ok(t===1,"letter typed in a number box: honest reply");ok(await p.locator(".box.wrong").count()===0,"unreadable: not marked wrong");}
 await p.context().close();}
console.log(`   ${wrongCount} planned wrong answers tried`);
if(cfg.extra){const p=await newPage({clear:true});await cfg.extra({p,URL0,ok,partInfo,typeIn,answerRight,clickChoice,toKeys,norm,MINUS,TIMES,collectText});await p.context().close();}

console.log("3. full journey");
{const p=await newPage({});await p.goto(URL0+"?fresh");await p.evaluate(()=>localStorage.clear());await p.goto(URL0);
 ok(await p.locator("#stage").evaluate(e=>e.innerHTML.length)>200,"page boots with content");
 ok(await p.locator("#teacher").isHidden(),"teacher strip hidden on her screen");
 await p.screenshot({path:path.join(SHOTS,"journey-start.png"),fullPage:true});
 let screens=0,kb=false,sawSupported=false;
 while(screens<220){const ph=await p.evaluate(()=>window.__ki.S.stops[window.__ki.S.stop]?.phase);if(ph==="supported")sawSupported=true;if(!(await solveScreen(p,kb)))break;screens++;kb=!kb;}
 await collectText(p);
 const endText=norm(await p.locator("#stage").textContent());ok(endText.includes("That is the end of this part"),"journey reaches the end screen ("+endText.slice(0,60)+")");
 const K=await p.evaluate(()=>window.__ki.K);ok(META.order.every(id=>K[id]&&K[id].passed),"every item holds in student2-ki-v1");
 ok(sawSupported,"helped item shown by default");
 const sheet=await p.evaluate(()=>window.__sheet);const fields=["event","set","role","eq","answer","right","own","support","checks","detail"];
 ok(sheet.length>0&&sheet.every(r=>fields.every(f=>f in r)),"every Sheet row has the ten fields");
 const answers=sheet.filter(r=>r.event==="answer");ok(answers.length>=12*META.order.length,"one Sheet row per answer ("+answers.length+")");
 ok(answers.every(r=>typeof r.detail==="string"),"detail is sent as text");
 ok(sheet.filter(r=>r.event==="item holds").length===META.order.length,"one 'item holds' row per item");
 ok(answers.some(r=>r.role==="supported"&&r.own===0),"helped item recorded as not her own");
 const st=await p.evaluate(()=>window.__state);ok(st.length===META.order.length&&st.every(s=>s.status==="held"),"state rows sent for every held item");
 const checks=answers.filter(r=>r.role==="own"&&r.right===1).map(r=>r.checks).join("|");
 for(const s of META.stops)for(const c of s.contrasts)ok(checks.includes("contrast: "+c),s.ki+" contrast case reached: "+c);
 for(const s of META.stops){const kinds=new Set(answers.filter(r=>r.role==="own"&&r.set===s.id).map(r=>JSON.parse(r.detail).kind));ok(s.kinds.every(k=>kinds.has(k)),s.ki+": every authored kind was shown ("+s.kinds.filter(k=>!kinds.has(k)).join(",")+")");}
 const stateKey=await p.evaluate(()=>Object.keys(localStorage).find(k=>k.startsWith("student2-ki-ag")));
 await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));s.lastDay="2000-01-01";localStorage.setItem(k,JSON.stringify(s));},stateKey);
 await p.goto(URL0);let info=await partInfo(p);ok(!!info,"next day opens with a review item");
 await giveWrong(p,plannedWrongs(info)[0],false,info);await finishItem(p);
 const recs=await p.evaluate(()=>window.__records.filter(r=>r.event==="answer"));ok(recs[recs.length-1].role==="review","review answer recorded with role review");
 await p.locator(".actions .btn").click();
 const K2=await p.evaluate(()=>window.__ki.K);ok(K2[firstStop].passed===false,"a wrong review item sends "+firstStop+" back to practice");
 cfg.stateKey=stateKey;await p.context().close();}

console.log("4. two-miss stop");
{const p=await newPage({});await p.goto(URL0+"?x");await p.evaluate(()=>localStorage.clear());await p.goto(URL0);
 while(await p.evaluate(()=>window.__ki.S.stops[window.__ki.S.stop]?.phase)!=="own")await solveScreen(p,false);
 const kind1=await p.evaluate(f=>{const s=window.__ki.S.stops[f];return s.queue[s.pi];},firstStop);
 for(let miss=0;miss<2;miss++){let info=await partInfo(p);await giveWrong(p,plannedWrongs(info)[0],false,info);
   await finishItem(p);
   if(miss===0){const nk=await p.evaluate(f=>{const s=window.__ki.S.stops[f];return s.queue[s.pi];},firstStop);ok(nk===kind1,"after one miss, the next item is a fresh one of the same kind ("+kind1+")");}
   await p.locator(".actions .btn").click();}
 ok(norm(await p.locator("#stage").textContent()).includes("We stop here for today. Your place is kept."),"two misses in a row: saved stop screen");
 await collectText(p);await p.screenshot({path:path.join(SHOTS,"saved-stop.png"),fullPage:true});
 ok(await p.locator(".keypad, .choices .ch").count()===0,"stop screen has no answer controls");
 ok((await p.evaluate(()=>window.__sheet)).some(r=>r.event==="saved stop"),"saved stop recorded");
 await p.reload();ok(norm(await p.locator("#stage").textContent()).includes("We stop here for today"),"reload on the same day stays stopped");
 await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));s.stoppedOn="2000-01-01";s.lastDay="2000-01-01";localStorage.setItem(k,JSON.stringify(s));},cfg.stateKey);
 await p.reload();ok(norm(await p.locator("#stage").textContent()).includes(norm(META.stops[0].first)),"next day starts with the worked example again");
 let sawSup=false;for(let i=0;i<12;i++){const ph=await p.evaluate(f=>window.__ki.S.stops[f].phase,firstStop);if(ph==="supported")sawSup=true;if(ph==="own")break;await solveScreen(p,false);}
 ok(!sawSup,"after a saved stop, worked examples lead straight to her own items");
 const k2=await p.evaluate(f=>{const s=window.__ki.S.stops[f];return s.queue[s.pi];},firstStop);ok(k2===kind1,"her place is kept: the same kind comes next");
 await p.context().close();}

console.log("5. skip setting");
{const p=await newPage({});await p.goto(URL0+"?y");await p.evaluate(()=>localStorage.clear());await p.goto(URL0+"?skipSupported=1");
 let sup=false;for(let i=0;i<14;i++){const ph=await p.evaluate(f=>window.__ki.S.stops[f]?.phase,firstStop);if(ph==="supported")sup=true;if(ph==="own")break;await solveScreen(p,false);}
 ok(!sup,"skipSupported=1 and every step right first time: helped item skipped");
 ok((await p.evaluate(()=>window.__sheet)).some(r=>r.event==="supported item skipped"),"the skip is recorded");
 await p.evaluate(()=>localStorage.clear());await p.goto(URL0+"?skipSupported=1&z");
 {const info=await partInfo(p);await giveWrong(p,plannedWrongs(info)[0],false,info);}
 sup=false;for(let i=0;i<14;i++){const ph=await p.evaluate(f=>window.__ki.S.stops[f]?.phase,firstStop);if(ph==="supported"){sup=true;break;}if(ph==="own")break;await solveScreen(p,false);}
 ok(sup,"skipSupported=1 but a step was wrong: helped item shown");
 await p.context().close();}

console.log("6. pause");
{const p=await newPage({clear:true});await p.goto(URL0+"?screen="+KINDS.find(k=>true));await p.click("#pauseBtn");ok(await p.locator("#pauseOv").isVisible(),"Pause shows the paused card");
 if(await p.locator(".box").count()){await p.keyboard.press("5");ok((await p.locator(".box").first().textContent()).trim()==="","keys do nothing while paused");}
 await p.click("#resumeBtn");ok(await p.locator("#pauseOv").isHidden(),"Go on closes it");await p.click("#readBtn");
 await p.context().close();}

console.log("7. phone width");
{const p=await newPage({clear:true,viewport:{width:375,height:812},touch:true});
 for(const s of [...WSCREENS,...KINDS]){await p.goto(URL0+"?screen="+s);
  for(let round=0;round<3;round++){
   const sw=await p.evaluate(()=>document.documentElement.scrollWidth);ok(sw<=375,s+": no sideways scroll ("+sw+")");
   const small=await p.evaluate(()=>[...document.querySelectorAll("button")].filter(b=>b.offsetParent).map(b=>{const r=b.getBoundingClientRect();return {t:b.textContent.trim(),w:r.width,h:r.height};}).filter(r=>r.w<44||r.h<44));
   ok(small.length===0,s+": every button at least 44 px "+JSON.stringify(small.slice(0,2)));
   const info=await partInfo(p);if(!info||!(await controls(p)))break;await answerRight(p,info,false);}
  if((cfg.phoneShots||[]).includes(s))await p.screenshot({path:path.join(SHOTS,"phone-"+s+".png"),fullPage:true});}
 await p.context().close();}

console.log("8. wording");
const texts=[...seenText].filter(Boolean);
const bad=texts.filter(t=>BANNED.test(t));ok(bad.length===0,"no ids, teacher words or banned words on her screen "+JSON.stringify(bad.slice(0,5)));
const colon=texts.filter(t=>/[a-z]: /i.test(t));ok(colon.length===0,"no colon fragments "+JSON.stringify(colon.slice(0,3)));
const notQ=texts.filter(t=>/^(What|Which|Is|Can|Do|Does|Are|How)\b/.test(t)&&!/[?]/.test(t));ok(notQ.length===0,"questions end with a question mark "+JSON.stringify(notQ.slice(0,3)));
const slash=texts.filter(t=>/\d\s*\/\s*\d/.test(t));ok(slash.length===0,"no fraction written with a slash "+JSON.stringify(slash.slice(0,3)));
fs.writeFileSync(path.join(SHOTS,"strings-she-saw.txt"),texts.sort().join("\n"),"utf8");
ok(errors.length===0,"no page errors or outside requests "+JSON.stringify(errors.slice(0,3)));
await br.close();
console.log(`\n${cfg.page}: ${pass} passed, ${fail} failed`);if(fail){console.log(fails.slice(0,40).join("\n"));process.exit(1);}
}
module.exports={run};
