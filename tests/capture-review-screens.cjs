/* Captures the screens she would meet in the 16 Nov update, at phone width, with their visible words, for review.
   Local server; outside requests blocked; nothing is sent anywhere. Output: tests/shots/review-16-nov/ */
'use strict';
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright');
const site=path.resolve(__dirname,'../site'),out=path.join(__dirname,'shots','review-16-nov');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const p=path.join(site,decodeURIComponent(req.url.split('?')[0]));if(!p.startsWith(site+path.sep)){res.writeHead(403);return res.end();}try{const b=fs.readFileSync(p);res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':'text/css');res.end(b);}catch(e){res.writeHead(404);res.end();}});
const words={};
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';const br=await chromium.launch();
async function page(){const c=await br.newContext({viewport:{width:390,height:844}});await c.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());return c.newPage();}
async function shot(p,name){await p.screenshot({path:path.join(out,name+'.png'),fullPage:true});words[name]=(await p.evaluate(()=>document.body.innerText)).replace(/\n{2,}/g,'\n').trim();}
async function prereqs(p,ids){await p.evaluate(ids=>{const P=LearningBridge.policy;for(const id of ids){const d=TeachingCatalogue.get(id);for(let c=0;c<2;c++)for(const decision of d.decisions)P.recordAnswer({target:id,kind:d.kind,item:'fixture-'+decision+c,decision,response:'fixture',right:true,role:'own',supplied:[],version:'review fixture'});}},ids);}
let p=await page();await p.goto(base+'index.html');await shot(p,'01-home');
await p.goto(base+'quadrilaterals-5.html');await shot(p,'02-earlier-ideas-first');
await prereqs(p,['KI-GE-21','KI-GE-23']);await p.goto(base+'quadrilaterals-5.html?action=practise&seed=3');await shot(p,'03-question-with-example-button');
await p.evaluate(()=>__qe.part.wrongs[0].fn());await shot(p,'04-after-wrong-answer');
await p.locator('#acts .next').click();await shot(p,'05-short-check');
await p.locator('#learning-support input').fill('999');await p.getByRole('button',{name:'Check my answer',exact:true}).click();await shot(p,'06-short-check-not-right');
await p.locator('#learning-support').getByRole('button',{name:'Next',exact:true}).click();await shot(p,'07-worked-example');
await p.getByRole('button',{name:'Try a new question',exact:true}).click();await p.locator('#learning-support input').fill('300');await p.getByRole('button',{name:'Check my answer',exact:true}).click();
await shot(p,'08-still-not-right-after-teaching');
await p.getByRole('button',{name:'Go on',exact:true}).click();await shot(p,'09-saved-stop');
await p.goto(base+'next-practice.html');await shot(p,'10-choose-next-page');
await p.goto(base+'prepare.html?target=KI-GE-21');await shot(p,'11-prepare-page');
await p.context().close();await br.close();server.close();
fs.writeFileSync(path.join(out,'words.json'),JSON.stringify(words,null,1));console.log('captured '+Object.keys(words).length+' screens to '+out);
})().catch(e=>{console.error(e);process.exit(1);});
