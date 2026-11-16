const fs=require('fs');
for(const f of ['site/equations-1.html','site/equations-2.html']){
let s=fs.readFileSync(f,'utf8');
s=s.replaceAll('out.outcome==="needs-teaching"','out.outcome==="needs-more-teaching"');
s=s.replace('const isLast=pi===it.parts.length-1||','const isLast=(window.LearningBridge&&!res.right)||pi===it.parts.length-1||');
s=s.replace('reply:plain(res.text||""),itemDone','reply:plain(res.text||""),feedbackDeferred:!!window.LearningBridge&&!res.right,itemDone');
s=s.replace('if(!it.holdReply&&res.text)reply(rich(res.text),res.right?"ok":"no");','if(!it.holdReply&&res.text&&(!window.LearningBridge||res.right))reply(rich(res.text),res.right?"ok":"no");\n      if(window.LearningBridge&&!res.right){pi=it.parts.length;return finish();}');
fs.writeFileSync(f,s);
}
