const fs=require('fs');
for(const name of fs.readdirSync('site').filter(f=>/^(equations|quadrilaterals|return-sitting).*\.html$/.test(f))){let s=fs.readFileSync('site/'+name,'utf8');s=s.replace('<script src="assets/learning-policy.js">','<script src="assets/preparation.js"></script><script src="assets/learning-policy.js">');
if(name.startsWith('equations')){s=s.replace('  go();\n}\nlet SAMPLE=false;',`  const action=new URLSearchParams(location.search).get("action");
  if(action==="review"&&S.stop)S.review=[S.stop];
  if(action==="repair"&&S.stop){S.stoppedOn=null;const st=ST();st.phase="own";st.missRun=0;}
  go();
}
let SAMPLE=false;`);
s=s.replace('function go(){if(SAMPLE){clearStage();return;}','function go(){if(SAMPLE){clearStage();return;}');}
fs.writeFileSync('site/'+name,s);}
let f='site/assets/quad-engine.js',s=fs.readFileSync(f,'utf8');s=s.replace('  saveAll();go();}\nfunction go()',`  if(QS.get("action")==="review")S.review=true;
  if(QS.get("action")==="repair"){S.stoppedOn=null;S.st.phase="own";S.st.missRun=0;}
  saveAll();go();}
function go()`);fs.writeFileSync(f,s);
f='site/index.html';s=fs.readFileSync(f,'utf8');s=s.replace('<h2 class="part">Questions on your earlier work</h2>','<a class="card practice" href="next-practice.html"><h2>Choose your next practice</h2><p>Use your earlier work to choose what to practise, learn or revisit.</p></a>\n<h2 class="part">Questions on your earlier work</h2>');s=s.replace('Do this page next. It has 13 questions','This page has 13 questions');s=s.replace('Start the quadrilaterals here, after the equations pages.','You can begin quadrilaterals here.');s=s.replace('Start here. You find','You find');fs.writeFileSync(f,s);
// New return answers retain first-attempt identity but do not pretend no earlier teaching occurred.
f='site/return-sitting.html';s=fs.readFileSync(f,'utf8');s=s.replace('function logRow(it,r){','function logRow(it,r){');s=s.replace('  send({event:"answer",set:"return-sitting",role:"first answer",','  const row={event:"answer",set:"return-sitting",role:"first answer",');s=s.replace('detail:{item:it.id,seat:pos+1,first_answer:true,supplied,version:VERSION,tag:r.tag||"",reply:r.reply||""}});}',`detail:{item:it.id,seat:pos+1,first_attempt:true,supplied,version:VERSION,tag:r.tag||"",reply:r.reply||""}};
  const target=(it.graph.match(/(?:KI|SK)-[A-Z]+-\\d+/)||[])[0],d=TeachingCatalogue.get(target);
  if(d){LearningBridge.init(d.sets[0],VERSION);const adapted=Object.assign({},row,{set:d.sets[0]});LearningBridge.observe(adapted);row.detail=adapted.detail;}
  send(row);}`);fs.writeFileSync(f,s);
