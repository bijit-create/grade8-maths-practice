/* Test of the Signals tab script, with a fake Sheet. Run: node study-materials/signals-test.cjs
   It loads apps-script/Code.gs and Signals.gs as Apps Script would (one shared scope), posts the simulated rows
   (signals-sample-rows.js, not Student 2's answers) through doPost, and checks what updateSignals writes.
   It checks software behaviour only. It cannot check the real Sheet or the deployed script. */
const fs=require("fs"),path=require("path"),vm=require("vm"),assert=require("assert");
const root=path.join(__dirname,"..");
const read=f=>fs.readFileSync(path.join(root,f),"utf8");

function fakeSheet(name,rows){const sh={name,rows:rows||[],written:null,calls:[],
  getLastRow:()=>sh.rows.length,
  getRange:(r,c,n,w)=>({getValues:()=>sh.rows.slice(r-1,r-1+n).map(x=>x.slice(c-1,c-1+w)),
    setValues:v=>{v.forEach(x=>assert.strictEqual(x.length,w,"every row has the same number of cells"));
      if(name==="Signals"){if(sh.failNext){sh.failNext=false;throw new Error("fake failure");}sh.written=v;}
      else v.forEach((x,i)=>{sh.rows[r-1+i]=x;});
      const self={setVerticalAlignment:()=>self,setWrap:()=>self};return self;}}),
  getRangeList:a=>{sh.calls.push(a);const self={setWrapStrategy:()=>self,setFontWeight:()=>self,setFontSize:()=>self,setBackground:()=>self};return self;},
  clear:()=>{sh.written=null;},setColumnWidth:()=>{}};return sh;}

function world(){const sheets={};
  const ctx={console,JSON,Date,Set,Object,Number,String,Array,Error,
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
    ContentService:{MimeType:{JSON:"json"},createTextOutput:t=>({setMimeType:()=>t})},
    SpreadsheetApp:{WrapStrategy:{OVERFLOW:"OVERFLOW"},getActiveSpreadsheet:()=>({getName:()=>"fake",
      getSheetByName:n=>sheets[n]||null,insertSheet:n=>(sheets[n]=fakeSheet(n))})}};
  vm.createContext(ctx);
  vm.runInContext(read("apps-script/Code.gs"),ctx,{filename:"Code.gs"});
  vm.runInContext(read("apps-script/Signals.gs"),ctx,{filename:"Signals.gs"});
  vm.runInContext(read("study-materials/signals-sample-rows.js"),ctx,{filename:"rows.js"});
  const cols=vm.runInContext("ACTIVITY_COLS",ctx),now=vm.runInContext("NOW_COLS",ctx);
  sheets.Activity=fakeSheet("Activity",[cols.slice()]);sheets.Now=fakeSheet("Now",[now.slice()]);
  const post=rows=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify({token:vm.runInContext("TOKEN",ctx),rows})}}));
  return {ctx,sheets,post,rows:vm.runInContext("SIMULATED_ROWS",ctx)};}
const text=sh=>sh.written.map(r=>r.join(" | ")).join("\n");
let n=0;const ok=(name,fn)=>{fn();n++;console.log("ok  "+name);};

ok("before she has answered, the tab says so and every reading is under 'not reached'",()=>{const w=world();
  w.ctx.updateSignals();const t=text(w.sheets.Signals);
  assert(t.includes("There are no answers for these two knowledge items yet."));
  assert(t.includes("No wrong answer has matched a planned reading."));
  assert(!/\d+ of \d+ \| .* \| \d+ tasks?\./.test(t),"no reading is shown as reached");
  assert((t.match(/^0 of \d+ \|/gm)||[]).length>=20,"each reading is listed as not reached");});

ok("the simulated rows go through doPost: answers are stored and the tab is written",()=>{const w=world();
  const res=w.post(w.rows);assert.strictEqual(res.activity,w.rows.length);assert.strictEqual(res.signals,"updated");
  const t=text(w.sheets.Signals);
  assert(t.includes("2 answers fit this reading, in 2 kinds of task. She gave both on her own, on 12 Nov."));
  assert.strictEqual((t.match(/One answer fits this reading\. A single answer can be a slip\./g)||[]).length,3);
  assert(/What number does x stand for when x \+ 4 is 17\? \| 14 \| Her answer was right\. \| None/.test(t),"the unplanned answer is shown as she gave it");
  assert(t.includes("This list reads 59 answers recorded on 12 Nov and 13 Nov for two knowledge items. 53 were right and 6 were not right."));
  assert(t.includes("3 tasks. 1 was not right, and no wrong answer fitted this reading. The wrong answer is under Order reversed in part 1."));
  assert(/^0 of 1 \| numerical expression given where an expression with the letter was asked for/m.test(t),"T6 was not reached");
  assert(!/second|minute|fast|slow|quick|time taken/i.test(t.replace(/second kind|second, different/g,"")),"nothing about speed or time");});

ok("the same rows posted twice are stored once, and the tab does not change",()=>{const w=world();
  w.post(w.rows);const first=text(w.sheets.Signals);const res=w.post(w.rows);
  assert.strictEqual(res.activity,0);assert.strictEqual(text(w.sheets.Signals),first);});

ok("one answer in one kind of task twice remains a possibility",()=>{const w=world();
  const miss=w.rows.find(r=>r.event==="answer"&&/"tag":"order reversed"/.test(r.detail));
  w.post(w.rows.concat([Object.assign({},miss,{uid:"again-1",ts:"2026-11-14T11:00:00.000Z"})]));
  assert(text(w.sheets.Signals).includes("2 answers fit this reading, all in one kind of task. It remains a possibility until it appears in a second kind of task."));});

ok("if writing the tab fails, her answers are still stored",()=>{const w=world();
  w.ctx.updateSignals();w.sheets.Signals.failNext=true;
  const res=w.post(w.rows);assert.strictEqual(res.ok,true);assert.strictEqual(res.activity,w.rows.length);
  assert(/^failed/.test(res.signals));assert.strictEqual(w.sheets.Activity.rows.length,w.rows.length+1);});

ok("rows from other practice pages are left out",()=>{const w=world();
  w.post([{uid:"b1",ts:"2026-11-12T10:00:00.000Z",event:"answer",set:"balance-1",role:"own",eq:"x + 3 = 7",answer:"5",right:0,own:1,support:"none",detail:"{}"}]);
  assert(text(w.sheets.Signals).includes("There are no answers for these two knowledge items yet."));});

console.log(n+" checks passed");
