/* 16 Nov 2026 fixes, checked on the actual pages. Local server, fresh browser profiles, every outside request blocked.
   1. A check (probe and teaching) started after a wrong answer reopens after a reload, and is cleared when it ends.
   2. After "Show me an example", the redrawn question's answer is logged as helped, not as her own fresh work.
   3. With no example asked for, the same answer is still logged as her own (the fix does not over-mark). */
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright');
const site=path.resolve(__dirname,'../site');
const server=http.createServer((req,res)=>{const p=path.join(site,decodeURIComponent(req.url.split('?')[0]));if(!p.startsWith(site+path.sep)){res.writeHead(403);return res.end();}try{const b=fs.readFileSync(p);res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':'text/css');res.end(b);}catch(e){res.writeHead(404);res.end();}});
let browser,pass=0;const errors=[],network=[];
const ok=(c,m)=>{assert(c,m);pass++;console.log('PASS '+m);};
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';browser=await chromium.launch({headless:true});
async function page(){const c=await browser.newContext({viewport:{width:390,height:900}});await c.route('**/*',r=>{if(r.request().url().startsWith(base))r.continue();else{network.push(r.request().url());r.abort();}});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));return p;}
const lastAnswer=p=>p.evaluate(()=>LearningBridge.policy.snapshot().events.filter(e=>e.type==='answer').at(-1));
const pendingKey=p=>p.evaluate(()=>localStorage.getItem('student2-pending-check-v1'));
async function prereqs(p,ids){await p.evaluate(ids=>{const P=LearningBridge.policy;for(const id of ids){const d=TeachingCatalogue.get(id);for(let c=0;c<2;c++)for(const decision of d.decisions)P.recordAnswer({target:id,kind:d.kind,item:'fixture-'+decision+c,decision,response:'fixture',right:true,role:'own',supplied:[],version:'test fixture'});}},ids);}

// 1. Reload during the check reopens it; finishing it clears the saved check.
{const p=await page();await p.goto(base+'quadrilaterals-5.html');await prereqs(p,['KI-GE-21','KI-GE-23']);
 await p.goto(base+'quadrilaterals-5.html?action=practise&seed=3');
 await p.evaluate(()=>__qe.part.wrongs[0].fn());await p.locator('#acts .next').click();
 ok(await p.locator('#learning-support').count()===1,'after a wrong whole answer the check opens');
 ok(!!(await pendingKey(p)),'the open check is saved on this device');
 await p.reload();
 ok(await p.locator('#learning-support').count()===1,'after a reload the check opens again, not a fresh whole question');
 ok(!(await p.locator('#words').isVisible()),'the whole question is not shown while the check is open');
 await p.locator('#learning-support input').fill('999');await p.getByRole('button',{name:'Check my answer',exact:true}).click();
 await p.locator('#learning-support').getByRole('button',{name:'Next',exact:true}).click();
 await p.getByRole('button',{name:'Try a new question',exact:true}).click();await p.locator('#learning-support input').fill('360');
 await p.getByRole('button',{name:'Check my answer',exact:true}).click();await p.locator('#learning-support').getByRole('button',{name:'Next',exact:true}).click();
 await p.getByRole('button',{name:'Go on',exact:true}).click();
 ok(await p.locator('#learning-support').count()===0&&await p.locator('#words').isVisible(),'after the check, a fresh whole question follows');
 ok(!(await pendingKey(p)),'the saved check is cleared when it ends');
 await p.reload();ok(await p.locator('#learning-support').count()===0,'a later reload does not reopen a finished check');
 await p.context().close();}

// 2. An answer straight after "Show me an example" is helped.
async function helpRun(askHelp){const p=await page();await p.goto(base+'quadrilaterals-5.html');await prereqs(p,['KI-GE-21','KI-GE-23']);
 await p.goto(base+'quadrilaterals-5.html?action=practise&seed=7');
 if(askHelp){await p.locator('#learning-help').click();await p.getByRole('button',{name:'Try a new question',exact:true}).click();
  /* 80 is the right answer to the supported question; a wrong one now ends in the worked answer and a saved stop. */
  await p.locator('#learning-support input').fill('80');await p.getByRole('button',{name:'Check my answer',exact:true}).click();
  await p.locator('#learning-support').getByRole('button',{name:'Next',exact:true}).click();await p.getByRole('button',{name:'Go on',exact:true}).click();}
 await p.evaluate(()=>__qe.part.right());const e=await lastAnswer(p);
 const row=await p.evaluate(()=>__records.filter(r=>r.event==='answer').at(-1));await p.context().close();return {e,row};}
{const {e,row}=await helpRun(true);
 ok(e.evidence!=='independent-fresh','after an example, the answer is not counted as fresh work on her own ('+e.evidence+')');
 ok((e.supplied||[]).includes('example requested during this item'),'the answer records that an example was asked for');
 ok(row.own===0,'the Sheet row for that answer has own = 0');}
{const {e,row}=await helpRun(false);
 ok(e.evidence==='independent-fresh'&&row.own===1,'with no example asked for, the same answer is still her own (own = 1)');}

assert.deepEqual(errors,[]);assert.deepEqual(network,[]);console.log(pass+' fix checks passed; no page errors, no outside requests.');
})().finally(async()=>{if(browser)await browser.close();server.close();}).catch(e=>{console.error(e);process.exitCode=1;});
