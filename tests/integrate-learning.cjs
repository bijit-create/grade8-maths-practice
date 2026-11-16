// Repeatable integration of the shared policy with the existing page engines.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
function replace(s,a,b,label){if(!s.includes(a))throw Error('Anchor missing: '+label);return s.replace(a,b);}
const scripts='<script src="assets/teaching-catalogue.js"></script><script src="assets/learning-policy.js"></script><script src="assets/teaching-support.js"></script><script src="assets/learning-bridge.js"></script>';
for(const name of fs.readdirSync(path.join(root,'site')).filter(n=>/^(equations-[12]|quadrilaterals-[1-7]|return-sitting)\.html$/.test(n))){
 let s=read('site/'+name);if(s.includes('assets/learning-bridge.js'))continue;
 s=replace(s,'</head>','<link rel="stylesheet" href="assets/learning-support.css">\n</head>',name+' head');
 s=replace(s,'<script src="assets/sheetlog.js"></script>','<script src="assets/sheetlog.js"></script>\n'+scripts,name+' scripts');
 if(name.startsWith('equations')){
  s=replace(s,'if(S){S.events.push(row);','if(window.LearningBridge)LearningBridge.observe(row);\n  if(S){S.events.push(row);',name+' record');
  s=replace(s,'const st=ST(),def=STOPS[S.stop];','if(window.LearningBridge&&!LearningBridge.guard(S.stop))return;\n  const st=ST(),def=STOPS[S.stop];',name+' gate');
  s=replace(s,'const right=results.every(r=>r.right);','const right=results.every(r=>r.right);',name+' finish');
  s=replace(s,'if(right){st.missRun=0;st.pi++;}',`if(!right&&window.LearningBridge&&!SAMPLE){
      st.pi++;st.queue.splice(st.pi,0,kind);saveAll();
      return nextButton("Look at this together",()=>LearningBridge.repair(S.stop,kind,results.find(r=>!r.right)?.tag||"",out=>{
        if(out.outcome==="stop"||out.outcome==="needs-teaching")return stopForToday(def);
        st.missRun=0;saveAll();go();}));
    }
    if(right){st.missRun=0;st.pi++;}`,name+' repair');
  s=replace(s,'  runNext();\n}',`  runNext();
  if(window.LearningBridge)LearningBridge.begin(def.id,role,kind,CONFIG.version,()=>showItem(def,st,kind,role,after));
}`,name+' begin');
  s=replace(s,'  loadState();','  loadState();\n  const target=new URLSearchParams(location.search).get("target");\n  const selected=ORDER.find(id=>STOPS[id].ki===target);if(selected)S.stop=selected;\n  if(window.LearningBridge)ORDER.forEach(id=>LearningBridge.init(id,CONFIG.version));',name+' target');
  // A pure sample must not send to the real Sheet or update the learner state.
  s=s.replace('const HAS_SHEET=typeof SheetLog!=="undefined";','const HAS_SHEET=typeof SheetLog!=="undefined"&&!new URLSearchParams(location.search).has("screen")&&new URLSearchParams(location.search).get("try")!=="1";');
  s=s.replace('function saveAll(){store.set(CONFIG.stateKey,S);store.set(CONFIG.kiKey,K);}','function saveAll(){if(new URLSearchParams(location.search).has("screen")||new URLSearchParams(location.search).get("try")==="1")return;store.set(CONFIG.stateKey,S);store.set(CONFIG.kiKey,K);}');
 }
 write('site/'+name,s);
}
let s=read('site/assets/quad-engine.js');
if(!s.includes('LearningBridge.observe')){
 s=replace(s,'  if(S&&!SAMPLE){S.events.push(row);','  if(window.LearningBridge&&!SAMPLE)LearningBridge.observe(row);\n  if(S&&!SAMPLE){S.events.push(row);','quad record');
 s=replace(s,'task(ctx);return ctx;}',`task(ctx);if(window.LearningBridge&&!SAMPLE)LearningBridge.begin(PAGE.set,role,kind,PAGE.version,()=>runTask(task,role,kind,onDone));return ctx;}`,'quad begin');
 s=replace(s,'  S=store.get(stateKey);','  if(window.LearningBridge)LearningBridge.init(PAGE.set,PAGE.version);\n  S=store.get(stateKey);','quad init');
 s=replace(s,'  const st=S.st;\n  if(st.phase', '  if(window.LearningBridge&&!LearningBridge.guard(PAGE.set))return;\n  const st=S.st;\n  if(st.phase','quad guard');
 s=replace(s,'    if(r.right){st.missRun=0;st.pi++;}',`    if(!r.right&&window.LearningBridge&&!SAMPLE){
      st.pi++;q.splice(st.pi,0,kind);saveAll();
      return nextButton(()=>LearningBridge.repair(PAGE.set,kind,r.tag||"",out=>{
        if(out.outcome==="stop"||out.outcome==="needs-teaching")return stopForToday();
        st.missRun=0;saveAll();go();}));
    }
    if(r.right){st.missRun=0;st.pi++;}`,'quad repair');
 s=s.replace('const res={kind,contrast:ctx.contrast||"",right:!!r.right,','const res={kind,tag:r.tag||"",contrast:ctx.contrast||"",right:!!r.right,');
 // try mode preserves runtime behavior for preview but never overwrites learner progress.
 s=s.replace('function saveAll(){if(SAMPLE)return;','function saveAll(){if(SAMPLE||QS.get("try")==="1")return;');
 s=s.replace('const HAS_SHEET=typeof SheetLog!=="undefined";','const HAS_SHEET=typeof SheetLog!=="undefined"&&QS.get("try")!=="1";');
 write('site/assets/quad-engine.js',s);
}
// Disable networking in previews BEFORE the existing logger initializes its queue.
s=read('site/assets/sheetlog.js');
if(!s.includes('Preview rows never')){
 s=replace(s,'const SheetLog=(()=>{',`const SheetLog=(()=>{
 // Preview rows never join or flush the real learner queue.
 const q=new URLSearchParams(location.search);
 if(location.protocol==="file:"||["localhost","127.0.0.1"].includes(location.hostname)||q.get("try")==="1"||(q.has("screen")&&q.get("screen")!=="sitting")){
   const rows=[];window.__previewSheet=rows;return {setSession(){},activity(r){rows.push(r)},state(r){rows.push(r)},pending(){return 0},flush(){}};
 }`,'logger preview');write('site/assets/sheetlog.js',s);
}
console.log('Integrated existing engines and preview logging.');
