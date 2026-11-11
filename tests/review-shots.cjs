/* Screenshots of one quadrilateral page for a reviewer: node tests/review-shots.cjs <N>
   Uses a copy of site/quadrilaterals-N.html without the Sheet scripts; every http(s) request is blocked. */
const path=require("path"),fs=require("fs"),os=require("os"),url=require("url");
const PW=[process.env.PLAYWRIGHT_PATH,"playwright","C:/Users/Bijit Krishna Sarkar/Downloads/HTML-TOOL/agentic-generator/node_modules/playwright"].filter(Boolean);
let chromium;for(const p of PW){try{chromium=require(p).chromium;break;}catch(e){}}
const N=process.argv[2],page="quadrilaterals-"+N+".html",SITE=path.resolve(__dirname,"../site");
const TMP=fs.mkdtempSync(path.join(os.tmpdir(),"qshots-"));fs.mkdirSync(path.join(TMP,"assets"));
fs.writeFileSync(path.join(TMP,page),fs.readFileSync(path.join(SITE,page),"utf8").replace('<script src="assets/sheet-config.js"></script><script src="assets/sheetlog.js"></script>',""));
for(const f of ["quad-engine.js","quad.css"])fs.copyFileSync(path.join(SITE,"assets",f),path.join(TMP,"assets",f));
const OUT=path.join(__dirname,"shots","review-q"+N);fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();const U=url.pathToFileURL(path.join(TMP,page)).href;
 for(const [w,h,tag] of [[1100,800,"wide"],[375,812,"phone"]]){const ctx=await b.newContext({viewport:{width:w,height:h}});
  await ctx.route(/^https?:/,r=>r.abort());await ctx.addInitScript(`window.SheetLog={setSession(){},activity(){},state(){},flush(){},pending(){return 0}}`);
  const p=await ctx.newPage();await p.goto(U+"?screen=w1");
  const P=await p.evaluate(()=>({w:window.__qe.PAGE.worked.length,kinds:Object.keys(window.__qe.PAGE.gen)}));
  const screens=[...Array(P.w).keys()].map(i=>"w"+(i+1)).concat(["sup"],P.kinds);
  for(const s of screens){for(const act of ["ask","wrong","right"]){if(tag==="phone"&&act!=="ask")continue;
    await p.goto(U+"?seed=13&screen="+s);
    if(act==="wrong"){const ok=await p.evaluate(()=>{const a=window.__qe.part;if(!a||!a.wrongs.length)return false;a.wrongs[0].fn();return true;});if(!ok)continue;}
    if(act==="right")await p.evaluate(()=>window.__qe.part&&window.__qe.part.right());
    await p.screenshot({path:path.join(OUT,`${tag}-${s}-${act}.png`),fullPage:true});}}
  await ctx.close();}
 await b.close();fs.rmSync(TMP,{recursive:true,force:true});console.log("screenshots in "+OUT);})();
