/* Test for Student 2's return sitting (site/return-sitting.html). 16 Nov 2026.   node tests/return-sitting.test.cjs
   SAFETY, as tests/quad-test-lib.cjs: the page is tested from a COPY with the two Sheet script lines removed, a stub SheetLog
   records rows in the page, and every http(s) request is blocked and counted as a failure. Nothing reaches her Sheet.
   Needs Playwright: PLAYWRIGHT_PATH, or HTML-TOOL/agentic-generator/node_modules/playwright. */
const path=require("path"),fs=require("fs"),os=require("os"),url=require("url");
const PW=[process.env.PLAYWRIGHT_PATH,"playwright","C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright"].filter(Boolean);
let chromium;for(const p of PW){try{chromium=require(p).chromium;break;}catch(e){}}
if(!chromium){console.error("Playwright not found. Set PLAYWRIGHT_PATH.");process.exit(2);}
const SHEET_LINES='<script src="assets/sheet-config.js"></script><script src="assets/sheetlog.js"></script>';
const SHEET_STUB=`window.__sheet=JSON.parse(sessionStorage.getItem("__sheet")||"[]");window.SheetLog={setSession(){},activity(r){window.__sheet.push(r);sessionStorage.setItem("__sheet",JSON.stringify(window.__sheet));},state(){window.__sheet.push({event:"STATE"})},flush(){},pending(){return 0}};`;
const BANNED=/KI-|SK-|M8\d\d|knowledge item|\bskill|mastery|\blevel\b|\brung|\bmoves?\b|\u2014|signal|contrast|supported|teacher|\bcounts?\b|\bkind\b|prototype|first answer|supplied/i;
const SITE=path.resolve(__dirname,"../site"),PAGE="return-sitting.html";
const SHOTS=process.env.SHOTS||path.join(__dirname,"shots","return-sitting");fs.mkdirSync(SHOTS,{recursive:true});
let pass=0,fail=0;const fails=[];
function ok(c,m){if(c)pass++;else{fail++;fails.push(m);console.log("  FAIL "+m);}}
const suffix=(a,b)=>{let n=0;while(n<a.length&&n<b.length&&a[a.length-1-n]===b[b.length-1-n])n++;return a.slice(a.length-n);};

(async()=>{
console.log("1. source, and the copy without the Sheet");
const html=fs.readFileSync(path.join(SITE,PAGE),"utf8");
ok(html.includes(SHEET_LINES),"the page loads sheet-config.js and sheetlog.js");
ok(html.indexOf(SHEET_LINES)<html.indexOf('<script src="assets/quad-engine.js"></script>'),"the Sheet lines come before the engine");
ok(/href="return-sitting\.html"/.test(fs.readFileSync(path.join(SITE,"index.html"),"utf8")),"the home page links to the sitting");
ok(/href="index\.html"/.test(html),"the page has a way back to the home page");
const TMP=fs.mkdtempSync(path.join(os.tmpdir(),"returntest-"));fs.mkdirSync(path.join(TMP,"assets"));
const copy=html.replace(SHEET_LINES,"");fs.writeFileSync(path.join(TMP,PAGE),copy);
for(const f of ["quad-engine.js","quad.css"])fs.copyFileSync(path.join(SITE,"assets",f),path.join(TMP,"assets",f));
ok(!/sheetlog|sheet-config/.test(copy),"the tested copy has no Sheet scripts");
const U=url.pathToFileURL(path.join(TMP,PAGE)).href;
const b=await chromium.launch();let blocked=0;const errors=[];
async function ctxNew(w,h){const c=await b.newContext({viewport:{width:w||1280,height:h||800},colorScheme:"light"});
  await c.route(/^https?:/,r=>{blocked++;r.abort();});await c.addInitScript(SHEET_STUB);return c;}
const texts=new Set();
const grab=async p=>(await p.evaluate(()=>[document.getElementById("h1").textContent,...[...document.querySelectorAll("#words p,#words button,#acts button,#pic button,.top .btn,#pauseOv p,#pauseOv button")].map(e=>e.textContent)])).forEach(t=>texts.add(t));

console.log("2. ?try=1 sends and stores nothing");
{const c=await ctxNew(),p=await c.newPage();p.on("pageerror",e=>errors.push(e.message));
 await p.goto(U+"?try=1&seed=3");await grab(p);await p.click("#acts .decide");
 for(let i=0;i<13;i++){await p.evaluate(()=>window.__qe.part.right());await p.click("#acts .next");}
 const r=await p.evaluate(()=>({sheet:window.__sheet.length,ls:localStorage.getItem("student2-return-sitting-v1"),rows:window.__sitting.rows.length,end:document.getElementById("words").textContent}));
 ok(r.sheet===0,"try: no row goes to the Sheet logger (got "+r.sheet+")");ok(r.ls===null,"try: nothing is stored");
 ok(r.rows===15,"try: the page still builds its 15 rows for the teacher strip (got "+r.rows+")");ok(/end of these questions/.test(r.end),"try: the end screen shows");
 await c.close();}

console.log("3. every planned answer on every item: its reply, and the same answer words after right and wrong");
{const c=await ctxNew(),p=await c.newPage();p.on("pageerror",e=>errors.push(e.message));
 await p.goto(U+"?try=1&seed=5");await p.click("#acts .decide");
 const order=await p.evaluate(()=>window.__sitting.order);ok(order.length===13&&new Set(order).size===13,"13 different items");
 ok(order[0]==="decide-yes","the first item is the shape that is a quadrilateral");
 const reply=()=>p.evaluate(()=>{const e=document.querySelector("#words .reply");return e?{cls:e.className,t:e.textContent}:{cls:"",t:""};});
 for(let i=0;i<13;i++){
   const nw=await p.evaluate(i=>{pos=i;QE.start(PAGE);return window.__qe.part.wrongs.length;},i);await grab(p);
   ok(nw>=1,order[i]+": has a planned wrong answer");
   await p.evaluate(()=>window.__qe.part.right());const R=await reply();texts.add(R.t);await grab(p);
   ok(/\bok\b/.test(R.cls),order[i]+": the right answer is marked right");
   ok(await p.evaluate(()=>!!document.querySelector("#acts .next")&&document.querySelectorAll("#acts button").length===1),order[i]+": after the answer only Next is offered");
   for(let k=0;k<nw;k++){const exp=await p.evaluate(([i,k])=>{pos=i;QE.start(PAGE);const w=window.__qe.part.wrongs[k];w.fn();return w.expect;},[i,k]);
     const W=await reply();texts.add(W.t);
     ok(/\bno\b/.test(W.cls)&&W.t.includes(exp),order[i]+" wrong "+(k+1)+": reply has \""+exp+"\"");
     const s=suffix(R.t,W.t);ok(s.length>=60,order[i]+" wrong "+(k+1)+": the answer words are the same as after a right answer ("+s.length+" characters)");}}
 /* the order differs with the seed, and no two items of one group are neighbours */
 const orders=[];for(const sd of [1,2,3,4,5,6,7,8]){await p.goto(U+"?try=1&seed="+sd);orders.push(await p.evaluate(()=>({o:window.__sitting.order,adj:ORDER.some((x,i)=>i>0&&x.group===ORDER[i-1].group)})));}
 ok(new Set(orders.map(x=>x.o.join())).size>=6,"the order changes with the seed");ok(orders.every(x=>!x.adj),"no two items of one group are next to each other");
 await c.close();}

console.log("4. a real sitting: rows, a reload in the middle, the end");
{const c=await ctxNew(),p=await c.newPage();p.on("pageerror",e=>errors.push(e.message));
 await p.goto(U+"?seed=7");
 ok((await p.evaluate(()=>window.__sheet.length))===0,"nothing is logged before Start");
 await p.click("#acts .decide");const order=await p.evaluate(()=>window.__sitting.order);
 await p.evaluate(()=>window.__qe.part.wrongs[0].fn());                       /* item 1 wrong, then reload before Next */
 await p.reload();
 let st=await p.evaluate(()=>({pos:pos,item:ORDER[pos].id,q:document.querySelector("#words .q")&&document.querySelector("#words .q").textContent,order:window.__sitting.order}));
 ok(st.pos===1&&st.item===order[1],"after a reload the page goes to the next item, not the answered one");
 ok(st.order.join()===order.join(),"the order is kept over a reload");ok(!!st.q,"the next question is on the screen after a reload");
 await p.click("#readBtn");                                                       /* Read it on item 2 */
 for(let i=1;i<13;i++){if(order[i]==="howmany")await p.evaluate(()=>{const g=document.querySelectorAll("#pic .pt");g[0].dispatchEvent(new MouseEvent("click",{bubbles:true}));document.querySelectorAll("#pic .pt")[2].dispatchEvent(new MouseEvent("click",{bubbles:true}));});
   await p.evaluate(i=>{const a=window.__qe.part;(i%2?a.right:a.wrongs[0].fn)();},i);await p.click("#acts .next");}
 const rows=await p.evaluate(()=>window.__sheet);const ans=rows.filter(r=>r.event==="answer");
 ok(ans.length===13,"13 answer rows (got "+ans.length+")");
 ok(new Set(ans.map(r=>JSON.parse(r.detail).item)).size===13,"one row for each item, none twice");
 ok(rows.filter(r=>r.event==="sitting start").length===1&&rows.filter(r=>r.event==="sitting resumed").length===1&&rows.filter(r=>r.event==="sitting end").length===1,"one start, one resumed and one end row");
 ok(!rows.some(r=>r.event==="STATE"),"no state row (the Now tab is not written)");
 let good=true,det=[];for(const r of ans){let d;try{d=JSON.parse(r.detail);}catch(e){good=false;continue;}det.push(d);
   if(r.set!=="return-sitting"||r.role!=="first answer"||d.first_answer!==true||!Array.isArray(d.supplied)||d.version!=="return-sitting 1.0 (16 Nov 2026)"||!(d.seat>=1&&d.seat<=13)||(r.right!==0&&r.right!==1)||!r.answer||!d.reply||!/\|/.test(r.checks))good=false;
   if((d.supplied.length===0)!==(r.support==="none"))good=false;}
 ok(good,"every answer row has role first answer, first_answer true, supplied as a list, the page version, a seat, right 0 or 1, her answer and the reply");
 ok(det.map(d=>d.seat).join()===[1,2,3,4,5,6,7,8,9,10,11,12,13].join(),"the seats run 1 to 13 in order");
 const by=id=>ans.find(r=>JSON.parse(r.detail).item===id);
 ok(/worked answer/.test(by("check-slip").support),"the worked-answer item says what the screen supplied");
 ok(/read aloud/.test(by(order[1]).support),"Read it is added to what was supplied, on that item only");
 ok(ans.filter(r=>/read aloud/.test(r.support)).length===1,"read aloud is on one row only");
 ok(/lines she drew/.test(by("howmany").support),"lines drawn to try are added to what was supplied");
 ok(by("fourth-angle").support==="none"&&by("eq-1").support==="none","an item where the screen did nothing has support none");
 await p.reload();const end=await p.evaluate(()=>({t:document.getElementById("words").textContent,n:window.__sheet.filter(r=>r.event==="answer").length,acts:document.querySelectorAll("#acts button").length}));
 ok(/end of these questions/.test(end.t)&&end.n===13&&end.acts===0,"after the end, a reload shows the end screen and asks nothing again");
 await grab(p);await c.close();}

console.log("5. her words, and the screens at laptop and tablet size");
for(const t of texts)ok(!BANNED.test(t),"no teacher word or id in: "+String(t).slice(0,70));
ok(![...texts].some(t=>/:\s/.test(t)),"no colon fragments in her words");
for(const [w,h,tag] of [[1280,800,"laptop"],[768,1024,"tablet"]]){const c=await ctxNew(w,h),p=await c.newPage();
 await p.goto(U+"?try=1&seed=7");await p.screenshot({path:path.join(SHOTS,tag+"-00-start.png"),fullPage:true});await p.click("#acts .decide");
 const order=await p.evaluate(()=>window.__sitting.order);
 for(let i=0;i<13;i++){const n=tag+"-"+String(i+1).padStart(2,"0")+"-"+order[i];await p.screenshot({path:path.join(SHOTS,n+"-ask.png"),fullPage:true});
   await p.evaluate(()=>window.__qe.part.wrongs[0].fn());await p.screenshot({path:path.join(SHOTS,n+"-wrong.png"),fullPage:true});
   ok(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),n+": no sideways scroll");await p.click("#acts .next");}
 await p.screenshot({path:path.join(SHOTS,tag+"-99-end.png"),fullPage:true});await c.close();}
fs.writeFileSync(path.join(SHOTS,"her-words.json"),JSON.stringify([...texts],null,1));

ok(blocked===0,"no http(s) request was attempted ("+blocked+")");ok(errors.length===0,"no page errors: "+errors.slice(0,3).join(" | "));
await b.close();fs.rmSync(TMP,{recursive:true,force:true});
console.log(`\n${pass} passed, ${fail} failed`);if(fail){console.log(fails.join("\n"));process.exit(1);}
})();
