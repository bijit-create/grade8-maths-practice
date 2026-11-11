/* Shared test for Student 2's quadrilateral pages (site/quadrilaterals-N.html, engine site/assets/quad-engine.js). 11 Nov 2026.
   Modelled on HTML-TOOL student2/page-test-lib.cjs (10 Nov 2026).
   SAFETY: the page is tested from a COPY with the two Sheet script lines removed, so sheetlog.js is never loaded and a stub
   SheetLog records rows in the page. Every http(s) request is blocked and counted as a failure.
   Each page has tests/quadrilaterals-N.test.cjs that calls run({page:"quadrilaterals-N.html", extra}).
   Needs Playwright: PLAYWRIGHT_PATH, or HTML-TOOL/agentic-generator/node_modules/playwright. */
const path=require("path"),fs=require("fs"),os=require("os");
const PW=[process.env.PLAYWRIGHT_PATH,"playwright","C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright"].filter(Boolean);
let chromium;for(const p of PW){try{chromium=require(p).chromium;break;}catch(e){}}
const SHEET_LINES='<script src="assets/sheet-config.js"></script><script src="assets/sheetlog.js"></script>';
const SHEET_STUB=`window.__sheet=[];window.__state=[];window.SheetLog={setSession(){},activity(r){window.__sheet.push(r)},state(r){window.__state.push(r)},flush(){},pending(){return 0}};`;
const BANNED=/KI-|SK-|M8\d\d|knowledge item|\bskill|mastery|\blevel\b|\brung|\bmoves?\b|\u2014|signal|contrast|supported|teacher|\bcounts?\b|\bkind\b/i;
const norm=s=>String(s).replace(/\u00a0/g," ").replace(/\s+/g," ").trim();

async function run(cfg){
if(!chromium){console.error("Playwright not found. Set PLAYWRIGHT_PATH.");process.exit(2);}
const SITE=path.resolve(__dirname,"../site"),SRC=path.join(SITE,cfg.page);
const html=fs.readFileSync(SRC,"utf8");
const name=cfg.page.replace(/\.html$/,"");
const SHOTS=process.env.SHOTS||path.join(__dirname,"shots",name);fs.mkdirSync(SHOTS,{recursive:true});
let pass=0,fail=0;const fails=[];const seen=new Set();
function ok(c,m){if(c)pass++;else{fail++;fails.push(m);console.log("  FAIL "+m);}}

console.log("1. source and the copy without the Sheet");
ok(html.includes(SHEET_LINES),"the page loads sheet-config.js and sheetlog.js");
ok(html.indexOf(SHEET_LINES)<html.indexOf('<script src="assets/quad-engine.js"></script>'),"the Sheet lines come before the page scripts");
const TMP=fs.mkdtempSync(path.join(os.tmpdir(),"quadtest-"));fs.mkdirSync(path.join(TMP,"assets"));
const copy=html.replace(SHEET_LINES,"");fs.writeFileSync(path.join(TMP,cfg.page),copy);
for(const f of ["quad-engine.js","quad.css"])fs.copyFileSync(path.join(SITE,"assets",f),path.join(TMP,"assets",f));
ok(!/sheetlog|sheet-config/.test(copy),"the tested copy has no Sheet scripts");
ok(!fs.existsSync(path.join(TMP,"assets","sheetlog.js")),"sheetlog.js is not next to the tested copy");
const code=html.replace(/<!--[\s\S]*?-->/g,"");
ok(!/\bfetch\(|XMLHttpRequest|https?:\/\/(?!www\.w3\.org)/.test(code),"the page itself makes no outside request");
const URL0=require("url").pathToFileURL(path.join(TMP,cfg.page)).href;

const br=await chromium.launch();const errors=[];
async function newPage(o={}){const ctx=await br.newContext({viewport:o.viewport||{width:1100,height:900},hasTouch:!!o.touch});
  await ctx.addInitScript(SHEET_STUB);if(o.clear)await ctx.addInitScript(()=>{try{localStorage.clear()}catch(e){}});
  const p=await ctx.newPage();p.on("pageerror",e=>errors.push(e.message));p.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  await ctx.route(/^https?:/,r=>{errors.push("outside request "+r.request().url());r.abort();});return p;}
const collect=async p=>{(await p.evaluate(()=>[...document.querySelectorAll("#h1,#words p,#words button,#acts button,#pic button,#pic text,#pic th,#pic td,.top .btn,#pauseOv p,#pauseOv .btn")].map(e=>e.textContent))).forEach(t=>seen.add(norm(t)));};
const lastReply=async p=>norm((await p.locator("#words .reply:not([data-unreadable])").allTextContents()).pop()||"");
const hasNext=async p=>(await p.locator("#acts .next").count())>0;
const lastAnswer=async p=>p.evaluate(()=>window.__records.filter(r=>r.event==="answer").pop()||null);
const META=await (async()=>{const p=await newPage({clear:true});await p.goto(URL0+"?screen=w1");
  const m=await p.evaluate(()=>{const P=window.__qe.PAGE;return {set:P.set,ki:P.ki,worked:P.worked.length,kinds:Object.keys(P.gen),contrasts:P.contrasts,plan:P.plan};});await p.context().close();return m;})();
const SCREENS=[...Array(META.worked).keys()].map(i=>"w"+(i+1)).concat(["sup"],META.kinds);

console.log("2. every planned wrong answer and every right answer ("+SCREENS.length+" screens, 4 seeds each)");
let tried=0;
{const p=await newPage({clear:true});
 for(const s of SCREENS)for(const seed of [3,11,29,47]){
  await p.goto(URL0+"?seed="+seed+"&screen="+s);await collect(p);
  const n=await p.evaluate(()=>window.__qe.part?window.__qe.part.wrongs.length:-1);
  ok(n>=1||s.startsWith("w"),s+" seed "+seed+": the test knows its planned wrong answers");
  for(let w=0;w<n;w++){await p.goto(URL0+"?seed="+seed+"&screen="+s);
   const expect=await p.evaluate(i=>{const W=window.__qe.part.wrongs[i];W.fn();return W.expect;},w);
   const label=`${s} seed ${seed} wrong ${w+1}`,r=await lastReply(p),rec=await lastAnswer(p);
   ok(r.length>0,label+": a reply is shown");ok(!(await p.locator("#words .reply.ok").count()),label+": nothing green");
   if(expect)ok(r.includes(expect),label+": planned reply ("+expect+") got: "+r.slice(0,90));
   ok(rec&&rec.right===0,label+": recorded right = 0");ok(await hasNext(p),label+": Next is shown");await collect(p);tried++;}
  await p.goto(URL0+"?seed="+seed+"&screen="+s);await p.evaluate(()=>window.__qe.part.right());
  const rec=await lastAnswer(p);ok(rec&&rec.right===1,s+" seed "+seed+": the right answer is recorded right = 1 ("+(await lastReply(p)).slice(0,60)+")");
  ok(await p.locator("#words .reply.ok").count()===1,s+" seed "+seed+": the right answer gets a green reply");await collect(p);}
 await p.context().close();}
console.log("   "+tried+" planned wrong answers tried");
if(cfg.extra){const p=await newPage({clear:true});await cfg.extra({p,URL0,ok,norm,lastReply,lastAnswer,hasNext,collect});await p.context().close();}

async function step(p){if(await hasNext(p)){await collect(p);await p.locator("#acts .next").click();return true;}
  const has=await p.evaluate(()=>!!window.__qe.part);if(!has)return false;await p.evaluate(()=>window.__qe.part.right());return true;}
const phase=p=>p.evaluate(()=>window.__qe.S&&window.__qe.S.st?window.__qe.S.st.phase:null);
const stateKey="student2-"+META.set+"-v1";

console.log("3. full journey");
{const p=await newPage({});await p.goto(URL0+"?a");await p.evaluate(()=>localStorage.clear());await p.goto(URL0);
 await p.screenshot({path:path.join(SHOTS,"journey-start.png"),fullPage:true});
 ok(await p.locator("#teacher").isHidden(),"teacher strip hidden on her screen");
 let n=0,sawSup=false;while(n++<200){if(await phase(p)==="supported")sawSup=true;if(!(await step(p)))break;}
 await collect(p);const end=norm(await p.locator("#words").textContent());
 ok(end.includes("That is the end of this part"),"journey reaches the end screen ("+end.slice(0,50)+")");
 const K=await p.evaluate(()=>JSON.parse(localStorage.getItem("student2-ki-v1")));ok(K&&K[META.set]&&K[META.set].passed,"the item holds in student2-ki-v1 under "+META.set);
 ok(sawSup,"the supported item is shown");
 const sheet=await p.evaluate(()=>window.__sheet),F=["event","set","role","eq","answer","right","own","support","checks","detail"];
 ok(sheet.length>0&&sheet.every(r=>F.every(f=>f in r)),"every Sheet row has the ten fields");
 ok(sheet.every(r=>typeof r.detail==="string"),"detail is sent as text");
 const ans=sheet.filter(r=>r.event==="answer");ok(ans.length>=META.plan.length,"one Sheet row per answer ("+ans.length+")");
 ok(ans.some(r=>r.role==="supported"&&r.own===0),"the supported item is recorded own = 0");
 ok(sheet.filter(r=>r.event==="item holds").length===1,"one 'item holds' row");
 const st=await p.evaluate(()=>window.__state);ok(st.length===1&&st[0].status==="held"&&st[0].set===META.set,"a state row says held");
 const checks=ans.filter(r=>r.role==="own"&&r.right===1).map(r=>r.checks).join("|");
 for(const c of META.contrasts)ok(checks.includes("contrast: "+c),"contrast case right on her own: "+c);
 const kinds=new Set(ans.filter(r=>r.role==="own").map(r=>JSON.parse(r.detail).kind));ok(META.kinds.every(k=>kinds.has(k)),"every kind was shown ("+META.kinds.filter(k=>!kinds.has(k))+")");
 await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));s.lastDay="2000-01-01";localStorage.setItem(k,JSON.stringify(s));},stateKey);
 await p.goto(URL0);ok(await p.evaluate(()=>!!window.__qe.part),"next day opens with a review item");
 await p.evaluate(()=>window.__qe.part.wrongs[0].fn());ok((await lastAnswer(p)).role==="review","the review answer is recorded with role review");
 await p.locator("#acts .next").click();
 const K2=await p.evaluate(()=>JSON.parse(localStorage.getItem("student2-ki-v1")));ok(K2[META.set].passed===false,"a wrong review item sends the page back to practice");
 ok(await phase(p)==="own","back to practice starts with her own items");
 await p.context().close();}

console.log("4. two misses in a row");
{const p=await newPage({});await p.goto(URL0+"?b");await p.evaluate(()=>localStorage.clear());await p.goto(URL0);
 let g=0;while(await phase(p)!=="own"&&g++<30)await step(p);
 const kind=()=>p.evaluate(()=>{const s=window.__qe.S.st;return s.queue?s.queue[s.pi]:window.__qe.PAGE.plan[0];});
 const k1=await kind();
 await p.evaluate(()=>window.__qe.part.wrongs[0].fn());await p.locator("#acts .next").click();
 ok(await kind()===k1,"after one miss the next item is a fresh one of the same kind ("+k1+")");
 await p.evaluate(()=>window.__qe.part.wrongs[0].fn());await p.locator("#acts .next").click();
 const t=norm(await p.locator("#words").textContent());ok(t.includes("We stop here for today. Your place is kept."),"two misses: saved stop screen");
 ok(await p.locator("#acts button, #words .ch, #words input").count()===0,"the stop screen has no answer controls");
 await collect(p);await p.screenshot({path:path.join(SHOTS,"saved-stop.png"),fullPage:true});
 ok((await p.evaluate(()=>window.__sheet)).some(r=>r.event==="saved stop"),"the saved stop is recorded");
 await p.reload();ok(norm(await p.locator("#words").textContent()).includes("We stop here for today"),"reload on the same day stays stopped");
 await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));s.stoppedOn="2000-01-01";s.lastDay="2000-01-01";localStorage.setItem(k,JSON.stringify(s));},stateKey);
 await p.reload();ok(await phase(p)==="worked","next day starts with the worked example again");
 let sup=false;g=0;while(await phase(p)!=="own"&&g++<30){if(await phase(p)==="supported")sup=true;await step(p);}
 ok(!sup,"after a saved stop, the worked examples lead straight to her own items");ok(await kind()===k1,"her place is kept: the same kind comes next");
 await p.context().close();}

console.log("5. pause");
{const p=await newPage({clear:true});await p.goto(URL0+"?screen=sup");await p.click("#pauseBtn");ok(await p.locator("#pauseOv").isVisible(),"Pause shows the paused card");
 await collect(p);await p.click("#resumeBtn");ok(await p.locator("#pauseOv").isHidden(),"Go on closes it");await p.click("#readBtn");await p.context().close();}

console.log("6. phone width 375 px");
{const p=await newPage({clear:true,viewport:{width:375,height:812},touch:true});
 for(const s of SCREENS){for(const after of [false,true]){await p.goto(URL0+"?seed=5&screen="+s);if(after)await p.evaluate(()=>window.__qe.part&&window.__qe.part.right());
   const sw=await p.evaluate(()=>document.documentElement.scrollWidth);ok(sw<=375,s+(after?" after answer":"")+": no sideways scroll ("+sw+")");
   const small=await p.evaluate(()=>[...document.querySelectorAll("button")].filter(b=>b.offsetParent).map(b=>{const r=b.getBoundingClientRect();return {t:b.textContent.trim(),w:Math.round(r.width),h:Math.round(r.height)};}).filter(r=>r.w<44||r.h<44));
   ok(small.length===0,s+": every button at least 44 px "+JSON.stringify(small.slice(0,2)));
   const tiny=await p.evaluate(()=>[...document.querySelectorAll("#pic .hit")].map(c=>c.getBoundingClientRect()).filter(r=>r.width<40).length);ok(tiny===0,s+": every tap target in the picture at least 40 px wide on a phone");
   if(!after&&(cfg.phoneShots||[]).includes(s))await p.screenshot({path:path.join(SHOTS,"phone-"+s+".png"),fullPage:true});}}
 await p.context().close();}

console.log("7. wording on her screen");
const texts=[...seen].filter(Boolean);
const bad=texts.filter(t=>BANNED.test(t));ok(bad.length===0,"no ids, teacher words or banned words "+JSON.stringify(bad.slice(0,4)));
const colon=texts.filter(t=>/[a-z]: /i.test(t));ok(colon.length===0,"no colon fragments "+JSON.stringify(colon.slice(0,3)));
const notQ=texts.filter(t=>/^(What|Which|Is|Can|Do|Does|Are|How)\b/.test(t)&&!t.includes("?"));ok(notQ.length===0,"questions end with a question mark "+JSON.stringify(notQ.slice(0,3)));
fs.writeFileSync(path.join(SHOTS,"strings-she-saw.txt"),texts.sort().join("\n"),"utf8");
ok(errors.length===0,"no page errors and no outside requests "+JSON.stringify(errors.slice(0,3)));
await br.close();fs.rmSync(TMP,{recursive:true,force:true});
console.log(`\n${cfg.page}: ${pass} passed, ${fail} failed`);if(fail){console.log(fails.slice(0,40).join("\n"));process.exit(1);}
}
module.exports={run};
