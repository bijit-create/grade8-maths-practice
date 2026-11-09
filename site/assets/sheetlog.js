/* Sends every answer, every event and every practice-set state to Student 2's Google Sheet (apps-script/Code.gs).
   Rows wait in a queue in this browser until they are sent, so nothing is lost offline or on reload.
   Modelled on Student 1's sheetlog.js (9 Nov 2026). kind "activity" -> Activity tab; kind "state" -> Now tab. */
const SheetLog=(()=>{
 const CFG=window.SHEET_CONFIG||{}, QKEY="student2-sheet-queue", DKEY="student2-device";
 const lesson=document.title;
 const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
 let device=store.get(DKEY);if(!device){device="d-"+Math.random().toString(36).slice(2,8);store.set(DKEY,device);}
 let queue=[];try{queue=JSON.parse(store.get(QKEY))||[]}catch(e){queue=[]}
 let sending=false,timer=0,session="";
 const uid=()=>Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
 function persist(){store.set(QKEY,JSON.stringify(queue.slice(-3000)));}
 function push(kind,row){queue.push(Object.assign({kind,uid:uid(),ts:new Date().toISOString(),lesson,device,session},row));persist();clearTimeout(timer);timer=setTimeout(flush,1500);}
 function flush(){
   if(!CFG.url||sending||!queue.length||navigator.onLine===false)return;
   const batch=queue.slice(0,40);sending=true;
   // text/plain keeps this a simple request, so Apps Script needs no CORS preflight.
   fetch(CFG.url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({token:CFG.token,rows:batch})})
     .then(()=>{const sent=new Set(batch.map(r=>r.uid));queue=queue.filter(r=>!sent.has(r.uid));persist();})
     .catch(()=>{})
     .finally(()=>{sending=false;if(queue.length)timer=setTimeout(flush,4000);});
 }
 window.addEventListener("online",flush);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)flush();});
 setTimeout(flush,800);
 return {
   setSession(id){session=id||"";},
   /* One answer or event. Fields: event, set, role, eq, x, answer, right, own, support, checks, detail. */
   activity(r){push("activity",r);},
   /* A practice set's latest state: set, ki, teacher, status, stage, own_right, items. */
   state(r){push("state",r);},
   pending(){return queue.length;},
   flush
 };
})();
