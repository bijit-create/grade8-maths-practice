/* Run directly with node. Tests a local copy; no Sheet or external requests. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../site/assets/teaching-catalogue.js');
const {chromium}=require('C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright');
const catalog=fs.readFileSync(path.join(__dirname,'../site/assets/teaching-catalogue.js'),'utf8');
const support=fs.readFileSync(path.join(__dirname,'../site/assets/teaching-support.js'),'utf8');
const routeSets={quadrilateral:'q1-make',diagonals:'ki-me-40','angle-total':'ki-ge-23','missing-angle':'sk-ge-08','angle-beside':'sk-ge-11','angle-equation':'sk-ge-09',letters:'ki-ag-01',expressions:'ki-ag-03',terms:'ki-ag-04',products:'ki-ag-04',coefficients:'ki-ag-06'};
(async()=>{
 assert.equal(C.get('q1-make'),C.get('ki-ge-21'),'construction and recognition share canonical target');
 assert.equal(C.routeFor('ki-ag-04','U1x','').id,'products');
 assert.equal(C.routeFor('ki-ag-04','U2','sign detached').id,'terms');
 for(const t of C.targets){assert(t.decisions.length);assert(t.evidence.requiredDecisions.every(k=>t.decisions.includes(k)));assert(t.scope);assert(t.requires.every(r=>r.gate==='teach'&&r.basis));}
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:520,height:950}});const faults=[];page.on('pageerror',e=>faults.push(e.message));
 await page.route(/^https?:/,r=>{faults.push('network '+r.request().url());r.abort();});
 async function start(set,kind,mode='repair'){
  await page.setContent('<!doctype html><meta charset="utf-8"><div id="help"></div>');await page.addScriptTag({content:catalog});await page.addScriptTag({content:support});
  await page.evaluate(({set,kind,mode})=>{window.events=[];window.result=null;window.handle=TeachingSupport[mode]({set,kind,container:document.getElementById('help'),onEvent:e=>events.push(e),onDone:r=>result=r});},{set,kind,mode});
 }
 async function answer(task,right=true,next=true){
  if(task.options){const index=right?task.correct:task.options.findIndex((_,i)=>i!==task.correct);await page.getByRole('button',{name:task.options[index],exact:true}).click();}
  else{await page.getByRole('textbox').fill(String(right?task.correct:task.correct+1));await page.getByRole('button',{name:'Check my answer',exact:true}).click();}
  if(next)await page.getByRole('button',{name:'Next',exact:true}).click();
 }
 async function check(plan,right=true){await page.getByRole('button',{name:'Try a new question',exact:true}).click();await answer(plan.check,right,right);
  /* A wrong supported answer: told it is not right, shown the worked answer, then the saved stop; no Next. */
  if(!right){const t=await page.locator('#help').innerText();const c=plan.check,ans=c.options?c.options[c.correct]:String(c.correct).replace('-','−');
   assert(t.includes('That answer is not right.'));assert(t.includes('The answer is '+ans+'.'));assert(t.includes('We stop this page here for today. Your place is kept.'));assert.equal(await page.getByRole('button',{name:'Next',exact:true}).count(),0);}
  await page.getByRole('button',{name:'Go on',exact:true}).click();}
 let cases=0;
 for(const [id,r] of Object.entries(C.routes)){
  const set=routeSets[id],kind=id==='products'?'U1x':'';
  // A miss at either part teaches that part, with no unsupported diagnosis.
  for(let miss=0;miss<r.probes.length;miss++){
   await start(set,kind);for(let i=0;i<=miss;i++)await answer(r.probes[i],i!==miss);await check(r.probes[miss].lesson);
   const result=await page.evaluate(()=>({events,result}));assert.equal(result.result.outcome,'supported-success');
   assert.equal(result.events.filter(e=>e.role==='probe'&&e.event==='answer').length,miss+1);
   assert(result.events.some(e=>e.event==='teaching'&&e.target===r.probes[miss].target));
   const last=result.events.findLast(e=>e.event==='answer');assert.equal(last.role,'supported check');assert(last.supplied.length>0);
   cases++;
  }
  // Checked parts can be correct while the original cause remains unresolved.
  await start(set,kind);for(const t of r.probes)await answer(t);await check(r.whole);
  assert((await page.evaluate(()=>events)).some(e=>e.outcome==='parts-correct-cause-unresolved'));cases++;
  // Help is available immediately, without a preliminary test.
  await start(set,kind,'help');await check(r.whole,false);
  assert.equal(await page.evaluate(()=>result.outcome),'needs-more-teaching');assert.equal(await page.evaluate(()=>events.filter(e=>e.role==='probe').length),0);cases++;
 }
 await start('sk-ge-08','');await page.getByRole('textbox').fill('abc');await page.getByRole('button',{name:'Check my answer',exact:true}).click();
 assert.equal(await page.evaluate(()=>events.filter(e=>e.event==='answer').length),0,'invalid input is not a maths error');
 await page.evaluate(()=>handle.cancel());assert.equal(await page.locator('#help').textContent(),'');assert.equal(await page.evaluate(()=>result),null);
 assert.deepEqual(faults,[]);await browser.close();console.log(`${cases} teaching-route paths passed, plus canonical targets, invalid input and cancellation.`);
})().catch(e=>{console.error(e);process.exit(1);});
