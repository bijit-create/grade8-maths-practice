/* Runtime checks without a browser process; pixel/layout assertions are separate. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const {JSDOM}=require('C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/jsdom');
const C=require('../site/assets/teaching-catalogue.js'),P=require('../site/assets/learning-policy.js'),site=path.resolve(__dirname,'../site');
vm.runInNewContext(fs.readFileSync(path.join(site,'assets/preparation.js'),'utf8'),{window:{TeachingCatalogue:C},Math});
function load(file,query='',fixtures=true){const dom=new JSDOM(fs.readFileSync(path.join(site,file),'utf8'),{url:'http://localhost/'+file+query,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.speechSynthesis={cancel(){},speak(){}};w.SpeechSynthesisUtterance=function(){};w.HTMLElement.prototype.scrollIntoView=function(){};w.fetch=()=>{throw Error('Unexpected network');};
 if(fixtures){const p=P.create({storage:w.localStorage,targets:C.targets});for(const d of C.targets)for(let n=0;n<2;n++)for(const k of d.evidence.decisions)p.recordAnswer({target:d.id,kind:d.kind,item:'fixture'+n+k,decision:k,response:'fixture',right:true,role:'own',supplied:[],version:'fixture'});}
 for(const tag of [...w.document.querySelectorAll('script')]){const code=tag.src?fs.readFileSync(path.join(site,tag.getAttribute('src')),'utf8'):tag.textContent;vm.runInContext(code,dom.getInternalVMContext());}
 return {dom,w,run:s=>vm.runInContext(s,dom.getInternalVMContext()),click:t=>{const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===t&&!b.disabled);assert(b,'missing '+t);b.click();}};
}
let checks=0;
for(const n of [1,2]){const h=load(`equations-${n}.html`,'?action=practise');try{h.run('activeBox._v="999";typeKey("OK")');assert(h.w.document.querySelector('.actions'));{const r=[...h.w.document.querySelectorAll('#stage .reply.no')].map(x=>x.textContent);assert.equal(r.length,1);assert(r[0].startsWith('That answer is not right.'),r[0]);}h.click('Look at this together');assert(h.w.document.querySelector('#learning-support'));const e=h.w.LearningBridge.policy.snapshot().events.at(-1);assert(e);checks++;}finally{h.dom.window.close();}}
for(let n=1;n<=7;n++){const h=load(`quadrilaterals-${n}.html`,'?action=practise');try{h.w.__qe.part.right();const e=h.w.LearningBridge.policy.snapshot().events.filter(e=>e.type==='answer').at(-1);assert(e.valid,JSON.stringify(e.issues));assert(e.right);checks++;}finally{h.dom.window.close();}}
{const h=load('return-sitting.html','?seed=3',false);try{h.w.document.querySelector('#acts .decide').click();for(let n=0;n<13;n++){h.w.__qe.part.right();h.w.document.querySelector('#acts .next').click();}const e=h.w.LearningBridge.policy.snapshot().events.filter(e=>e.type==='answer');assert.equal(e.length,13);assert(e.every(e=>e.valid),JSON.stringify(e.filter(e=>!e.valid)));assert(e.some(e=>e.evidence==='after-related-teaching'));checks++;}finally{h.dom.window.close();}}
{const h=load('next-practice.html','',false);try{assert(h.w.document.querySelector('#choices a.primary').href.endsWith('return-sitting.html'));checks++;}finally{h.dom.window.close();}}
console.log(`${checks} actual-page DOM checks passed: equations repair, all geometry adapters, full return sitting and first next-work recommendation.`);
