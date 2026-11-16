/* DOM integration only: does not launch a browser or render pixels. No network. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const {JSDOM}=require('C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/jsdom');
const C=require('../site/assets/teaching-catalogue.js'),P=require('../site/assets/learning-policy.js'),site=path.resolve(__dirname,'../site');
vm.runInNewContext(fs.readFileSync(path.join(site,'assets/preparation.js'),'utf8'),{window:{TeachingCatalogue:C},Math});
let paths=0;
for(const d of Object.values(C.preparations)){
 const html=fs.readFileSync(path.join(site,'prepare.html'),'utf8');const dom=new JSDOM(html,{url:'http://localhost/prepare.html?target='+d.id,runScripts:'outside-only'}),w=dom.window;
 w.speechSynthesis={cancel(){},speak(){}};w.SpeechSynthesisUtterance=function(){};w.HTMLElement.prototype.scrollIntoView=function(){};w.fetch=()=>{throw Error('Unexpected network');};
 const pol=P.create({storage:w.localStorage,targets:C.targets});for(const t of C.targets)if(t.id!==d.id)for(let n=0;n<3;n++)for(const k of t.evidence.decisions)pol.recordAnswer({target:t.id,kind:t.kind,item:'fixture'+n+k,decision:k,response:'fixture',right:true,role:'own',supplied:[],version:'fixture'});
 for(const tag of [...w.document.querySelectorAll('script[src]')])vm.runInContext(fs.readFileSync(path.join(site,tag.getAttribute('src')),'utf8'),dom.getInternalVMContext());
 const click=t=>{const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent===t&&!b.disabled);assert(b,'missing button '+d.id+' '+t);b.click();};
 click('Complete an example');let n=0;
 while(n++<30){const s=JSON.parse(w.localStorage.getItem('student2-preparation-'+d.id));if(['done','exhausted'].includes(s.phase))break;const t=s.task;assert(t,'no task '+d.id);if(t.options)click(t.options[t.answer]);else{w.document.querySelector('#lesson input').value=String(t.answer);click('Check my answer');}
  const after=P.create({storage:w.localStorage,targets:C.targets}).snapshot().events.filter(e=>e.target===d.id&&e.type==='answer').at(-1);assert(after.valid,d.id+after.issues);assert.equal(after.evidence,s.phase==='supported'?'supported':'after-related-teaching');
  const label=s.phase==='supported'?'Try without the example':[...w.document.querySelectorAll('button')].find(b=>/Try another question|Finish this part/.test(b.textContent))?.textContent;assert(label,'no continuation '+d.id);click(label);
 }
 const status=P.create({storage:w.localStorage,targets:C.targets}).status(d.id);assert.equal(status.state,'ready-for-review',d.id+JSON.stringify(status));assert(n<30);paths++;dom.window.close();
}
console.log(`${paths} prerequisite teaching-to-practice paths pass in DOM integration (not a visual browser check).`);
