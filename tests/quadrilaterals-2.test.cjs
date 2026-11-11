/* Test for site/quadrilaterals-2.html (decide whether each shape is a quadrilateral, KI-GE-21). Run: node tests/quadrilaterals-2.test.cjs */
require("./quad-test-lib.cjs").run({page:"quadrilaterals-2.html",phoneShots:["w1","w2","sup","crossed"],
 extra:async({p,URL0,ok,lastReply,lastAnswer})=>{
  const YES="Yes, it is a quadrilateral",NO="No, it is not a quadrilateral";
  const KINDS={concave:[true,4],kite:[true,4],irregular:[true,4],open:[false,4],triangle:[false,3],curved:[false,4],pentagon:[false,5],crossed:[false,4]};
  /* the plan: yes and no about equal, never more than two of the same answer in a row */
  await p.goto(URL0+"?screen=w1");
  const plan=await p.evaluate(()=>window.__qe.PAGE.plan);
  ok(plan.filter(k=>KINDS[k][0]).length===plan.filter(k=>!KINDS[k][0]).length,"the plan has as many yes as no ("+plan.length+" items)");
  ok(plan.every((k,i)=>i<2||!(KINDS[k][0]===KINDS[plan[i-1]][0]&&KINDS[k][0]===KINDS[plan[i-2]][0])),"never three of the same answer in a row");
  ok(Object.keys(KINDS).every(k=>plan.includes(k)),"every kind of shape is in the plan");
  /* 25 seeds of every kind: right number of corners, everything inside the picture, the right answer, the marks that belong to the kind */
  let bad=[];
  for(const [kind,[yes,n]] of Object.entries(KINDS))for(let seed=1;seed<=25;seed++){
   await p.goto(URL0+"?seed="+seed+"&screen="+kind);
   const pre=await p.evaluate(()=>({dots:document.querySelectorAll("#pic .dot").length,marks:document.querySelectorAll("#pic .numbg,#pic .gap,#pic .marked").length,replies:document.querySelectorAll("#words .reply").length,
     out:[...document.querySelectorAll("#pic .dot")].some(c=>+c.getAttribute("cx")<20||+c.getAttribute("cx")>400||+c.getAttribute("cy")<20||+c.getAttribute("cy")>360)||[...document.querySelectorAll("#pic .lbl")].some(t=>+t.getAttribute("x")<10||+t.getAttribute("x")>410||+t.getAttribute("y")<18||+t.getAttribute("y")>372),
     letters:[...document.querySelectorAll("#pic .lbl")].map(t=>t.textContent).join("")}));
   if(pre.dots!==n||pre.marks||pre.replies||pre.out)bad.push(kind+" seed "+seed+" "+JSON.stringify(pre));
   await p.evaluate(()=>window.__qe.part.right());const r=await lastReply(p);
   if(!r.startsWith(yes?"Yes, ":"No, ")||!r.includes({concave:"points into the shape",open:"ringed",curved:"is curved",crossed:"crosses side"}[kind]||"quadrilateral"))bad.push(kind+" seed "+seed+" reply "+r.slice(0,80));
   if((kind==="kite"||kind==="irregular")&&r.includes("points into"))bad.push(kind+" seed "+seed+" wrongly has a corner pointing in");
   if(kind==="concave"&&!r.includes("points into the shape"))bad.push("concave seed "+seed+" has no inward corner");
   if(kind==="pentagon"&&!r.includes("5 straight sides"))bad.push("pentagon seed "+seed+" reply");
   const marks=await p.evaluate(()=>({numbers:document.querySelectorAll("#pic .numbg").length,rings:document.querySelectorAll("#pic .gap").length,curve:document.querySelectorAll("#pic .side.curve.marked").length,crossed:document.querySelectorAll("#pic .side.crossed").length}));
   const want={open:{numbers:3,rings:2,curve:0,crossed:0},curved:{numbers:3,rings:0,curve:1,crossed:0},crossed:{numbers:0,rings:1,curve:0,crossed:2},triangle:{numbers:3,rings:0,curve:0,crossed:0},pentagon:{numbers:5,rings:0,curve:0,crossed:0}}[kind]||{numbers:4,rings:0,curve:0,crossed:0};
   if(JSON.stringify(marks)!==JSON.stringify(want))bad.push(kind+" seed "+seed+" marks "+JSON.stringify(marks));}
  ok(bad.length===0,"750 shapes: corners, margins, answers, marks "+JSON.stringify(bad.slice(0,4)));
  /* fresh shapes: another seed gives another picture, the same seed the same picture; the lettering varies */
  const pic=async seed=>{await p.goto(URL0+"?seed="+seed+"&screen=kite");return p.evaluate(()=>document.querySelector("#pic svg").innerHTML);};
  ok((await pic(4))!==(await pic(5))&&(await pic(4))===(await pic(4)),"fresh shapes for a new seed, the same shape for the same seed");
  const sets=new Set();for(let seed=1;seed<=30;seed++){await p.goto(URL0+"?seed="+seed+"&screen=concave");sets.add(await p.evaluate(()=>document.querySelector("#pic .lbl").textContent));}
  ok(sets.size>=3,"the lettering starts at different letters ("+[...sets]+")");
  /* real pointer clicks on Yes and No: a wrong Yes on a crossed shape */
  await p.goto(URL0+"?seed=9&screen=crossed");
  ok((await p.locator("#words .reply").count())===0&&(await p.locator("#pic .numbg").count())===0,"nothing is judged or marked before she answers");
  await p.getByRole("button",{name:YES}).click();
  const r1=await lastReply(p);
  ok(r1.startsWith("Your answer was yes, but")&&/side [A-Z]{2} crosses side [A-Z]{2}\./.test(r1),"a wrong Yes on crossing sides names the two sides: "+r1.slice(0,95));
  ok(await p.locator("#pic .side.crossed").count()===2&&await p.locator("#pic .gap").count()===1,"the two crossing sides are coloured and the crossing point is ringed");
  const a1=await lastAnswer(p);ok(a1&&a1.answer==="yes"&&a1.right===0,"the wrong Yes is recorded as yes, right 0");
  ok(await p.locator("#words .ch:disabled").count()===2,"both buttons are off after the answer");
  /* real click on No on a curved shape */
  await p.goto(URL0+"?seed=9&screen=curved");await p.getByRole("button",{name:NO}).click();
  ok((await lastReply(p)).startsWith("No, ")&&await p.locator("#pic .side.curve.marked").count()===1&&await p.locator("#pic .numbg").count()===3,"No on a curved shape: right, the curved side is coloured, 3 straight sides numbered");
  /* a wrong No on a dart: the inward corner is named */
  await p.goto(URL0+"?seed=9&screen=concave");await p.getByRole("button",{name:NO}).click();
  ok(/^Your answer was no, but [A-Z]+ is a quadrilateral\./.test(await lastReply(p))&&(await lastReply(p)).includes("does not have to look like a square"),"a wrong No on a dart says it need not look like a square");
  /* a second worked example has two pictures, the explained one and her fresh one */
  await p.goto(URL0+"?seed=9&screen=w2");
  ok(await p.locator("#pic svg").count()===2,"the second example shows the explained shape and a new one");
  await p.getByRole("button",{name:NO}).click();ok((await lastReply(p)).startsWith("No, PQRS is not a quadrilateral"),"her step on the second example is Yes or No on PQRS");
  /* after an answer the buttons cannot be pressed again (her actions are ignored once the item is done) */
  const n0=await p.evaluate(()=>window.__records.length);await p.evaluate(()=>document.querySelector("#words .ch").click());ok(await p.evaluate(()=>window.__records.length)===n0,"a second press records nothing");
 }});
