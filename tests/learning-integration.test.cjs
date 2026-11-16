/* Actual-page integration. Local server, fresh browser profiles, all external requests blocked. */
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),vm=require('vm');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright');
const site=path.resolve(__dirname,'../site'),shots=path.join(__dirname,'shots/learning-update');fs.mkdirSync(shots,{recursive:true});
for(const f of fs.readdirSync(path.join(site,'assets')).filter(x=>x.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(site,'assets',f),'utf8'),{filename:f});
for(const f of fs.readdirSync(site).filter(x=>x.endsWith('.html')))for(const m of fs.readFileSync(path.join(site,f),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:f});
const server=http.createServer((req,res)=>{const p=path.join(site,decodeURIComponent(req.url.split('?')[0]));if(!p.startsWith(site+path.sep)){res.writeHead(403);return res.end();}try{const b=fs.readFileSync(p);res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':'text/css');res.end(b);}catch(e){res.writeHead(404);res.end();}});
let browser;const errors=[],network=[];
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';browser=await chromium.launch({headless:true});
async function page(width=1100){const c=await browser.newContext({viewport:{width,height:900}});await c.route('**/*',r=>{if(r.request().url().startsWith(base))r.continue();else{network.push(r.request().url());r.abort();}});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));return p;}
const last=p=>p.evaluate(()=>LearningBridge.policy.snapshot().events.filter(e=>e.type==='answer').at(-1));
async function prereqs(p,ids){await p.evaluate(ids=>{const p=LearningBridge.policy;for(const id of ids){const d=TeachingCatalogue.get(id);for(let cycle=0;cycle<2;cycle++)for(const decision of d.decisions)p.recordAnswer({target:id,kind:d.kind,item:'fixture-'+decision+cycle,decision,response:'fixture',right:true,role:'own',supplied:[],version:'test fixture'});}},ids);}
// Every old page and every shared script loads, with previews isolated from prior evidence.
let screens=0,answers=0;
for(let i=1;i<=7;i++){const p=await page();await p.goto(base+`quadrilaterals-${i}.html?screen=w1`);const kinds=await p.evaluate(()=>['w1','w2','sup',...Object.keys(__qe.PAGE.gen)]);
 for(const kind of kinds){for(const seed of [3,29]){await p.goto(base+`quadrilaterals-${i}.html?screen=${kind}&seed=${seed}`);const n=await p.evaluate(()=>__qe.part?.wrongs.length||0);
  await p.evaluate(()=>__qe.part.right());assert.equal(await p.evaluate(()=>__records.filter(r=>r.event==='answer').at(-1).right),1);answers++;
  for(let w=0;w<n;w++){await p.goto(base+`quadrilaterals-${i}.html?screen=${kind}&seed=${seed}`);await p.evaluate(w=>__qe.part.wrongs[w].fn(),w);assert.equal(await p.evaluate(()=>__records.filter(r=>r.event==='answer').at(-1).right),0);answers++;}
  assert.equal(await p.evaluate(()=>localStorage.length),0);screens++;
 }}await p.context().close();}
console.log(`Geometry content: ${screens} rendered variants, ${answers} authored right/wrong responses; no preview storage.`);
// Fresh learner: only eligible work, all declared prerequisites have a real page.
{const p=await page(390);await p.goto(base+'next-practice.html?teacher=1');assert((await p.locator('#choices a').count())>=2);await p.screenshot({path:path.join(shots,'next-practice-mobile.png'),fullPage:true});await p.goto(base+'quadrilaterals-7.html');assert.equal(await p.locator('#learning-prerequisites').count(),1);const hrefs=await p.locator('#learning-prerequisites a').evaluateAll(a=>a.map(x=>x.getAttribute('href')));assert(hrefs.some(x=>x.includes('prepare.html')));await p.context().close();}
// Whole response -> no solution revealed -> probe -> worked example -> supported check -> fresh task.
{const p=await page(390);await p.goto(base+'quadrilaterals-5.html');await prereqs(p,['KI-GE-21','KI-GE-23']);await p.goto(base+'quadrilaterals-5.html?action=practise&seed=3');
 const prompt=await p.locator('#words').textContent();assert(!prompt.includes('add up to 360'));await p.evaluate(()=>__qe.part.wrongs[0].fn());assert.equal((await last(p)).right,false);
 /* CLAUDE.md: after a wrong whole answer, say what her answer describes; the 360° rule and the working stay back for the check. */
 {const r=await p.locator('#words .reply.no').allTextContents();assert.equal(r.length,1);assert(r[0].startsWith('That answer is not right. You wrote '),r[0]);assert(!r[0].includes('360'),r[0]);}
 await p.locator('#acts .next').click();
 assert.equal(await p.locator('#learning-support').count(),1);assert(!await p.locator('#words').isVisible());await p.screenshot({path:path.join(shots,'probe-mobile.png'),fullPage:true});
 await p.locator('#learning-support input').fill('999');await p.getByRole('button',{name:'Check my answer',exact:true}).click();assert.equal((await last(p)).role,'probe');await p.locator('#learning-support').getByRole('button',{name:'Next',exact:true}).click();await p.screenshot({path:path.join(shots,'worked-mobile.png'),fullPage:true});
 await p.getByRole('button',{name:'Try a new question',exact:true}).click();await p.locator('#learning-support input').fill('360');await p.getByRole('button',{name:'Check my answer',exact:true}).click();assert.equal((await last(p)).evidence,'supported');await p.locator('#learning-support').getByRole('button',{name:'Next',exact:true}).click();await p.getByRole('button',{name:'Go on',exact:true}).click();assert.equal(await p.locator('#learning-support').count(),0);assert(await p.locator('#words').isVisible());await p.evaluate(()=>__qe.part.right());assert.equal((await last(p)).evidence,'after-related-teaching');await p.context().close();}
// Equations route: access help without failure, supported answer never becomes fresh independent.
for(const n of [1,2]){const p=await page();await p.goto(base+`equations-${n}.html`);if(n===2){await prereqs(p,['KI-AG-01','KI-AG-03']);}
 await p.goto(base+`equations-${n}.html?action=practise`);assert.equal(await p.locator('#learning-help').count(),1);await p.locator('#learning-help').click();assert(await p.getByRole('button',{name:'Try a new question',exact:true}).isVisible());await p.getByRole('button',{name:'Try a new question',exact:true}).click();assert.equal((await p.evaluate(()=>LearningBridge.policy.snapshot().events.filter(e=>e.role==='probe').length)),0);
 await p.context().close();const sample=await page();await sample.goto(base+`equations-${n}.html?screen=${n===1?'S1a':'U1'}`);assert.equal(await sample.evaluate(()=>localStorage.length),0);await sample.context().close();}
// Existing return sitting remains complete, and related feedback contaminates later cold claims.
{const p=await page();await p.goto(base+'return-sitting.html?seed=3');await p.locator('#acts .decide').click();for(let i=0;i<13;i++){await p.evaluate(()=>__qe.part.right());await p.locator('#acts .next').click();}const e=await p.evaluate(()=>LearningBridge.policy.snapshot().events.filter(e=>e.type==='answer'));assert.equal(e.length,13);assert(e.every(x=>x.valid),JSON.stringify(e.filter(x=>!x.valid)));assert(e.some(x=>x.evidence==='after-related-teaching'));assert(await p.getByRole('link',{name:'Choose the next page',exact:true}).isVisible());await p.context().close();}
assert.deepEqual(errors,[]);assert.deepEqual(network,[]);console.log('Actual-page integration passed: prerequisite routes, mobile layout captures, probes before teaching, supported checks, fresh return, help on request, return sitting, zero external requests.');
})().finally(async()=>{if(browser)await browser.close();server.close();}).catch(e=>{console.error(e);process.exitCode=1;});
