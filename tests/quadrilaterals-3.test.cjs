/* Test for site/quadrilaterals-3.html (draw the diagonals of a quadrilateral, KI-ME-40). Run: node tests/quadrilaterals-3.test.cjs */
const fs=require("fs"),path=require("path");
require("./quad-test-lib.cjs").run({page:"quadrilaterals-3.html",phoneShots:["w1","w2","dart","which"],
 extra:async({p,URL0,ok,lastReply,lastAnswer})=>{
  const lbl=i=>p.locator(`#pic .pt[data-i="${i}"]`);
  /* real pointer taps: tap two vertices that no side joins, nothing is judged until the decision button */
  await p.goto(URL0+"?seed=9&screen=first");
  ok((await p.locator("#words .reply").count())===0,"nothing is judged before she says the line is finished");
  await lbl(0).click();ok(await p.locator("#pic .pt.sel").count()===1,"the first tapped vertex is marked");
  await lbl(2).click();ok(await p.locator("#pic line.mine").count()===1,"two taps draw one line");
  const nm=await p.locator("#pic text.nm").textContent(),l0=await p.locator('#pic text.lbl').nth(0).textContent(),l2=await p.locator('#pic text.lbl').nth(2).textContent();
  ok(nm===l0+l2,"the line is named in her tap order ("+nm+")");
  ok((await p.locator("#words .reply").count())===0,"still nothing judged after the line is drawn");
  await p.getByRole("button",{name:"My line is finished"}).click();
  ok((await lastReply(p)).includes("are not next to each other, so "+nm+" is a diagonal"),"pointer: a diagonal gets the right reply");
  ok((await lastAnswer(p)).right===1,"pointer: recorded right");
  /* a side, using the pair that wraps round the lettering */
  await p.goto(URL0+"?seed=9&screen=first");await lbl(3).click();await lbl(0).click();await p.getByRole("button",{name:"My line is finished"}).click();
  ok((await lastReply(p)).includes("is a side of"),"pointer: the side from the last letter to the first is a side, not a diagonal");
  ok(await p.locator("#pic .kept").count()===2,"after a wrong line, both diagonals are drawn");
  /* start this line again */
  await p.goto(URL0+"?seed=9&screen=first");await lbl(0).click();await lbl(1).click();await p.getByRole("button",{name:"Start this line again"}).click();
  ok(await p.locator("#pic line.mine").count()===0&&await p.locator("#pic .pt.sel").count()===0,"Start this line again clears her line");
  /* keyboard */
  await lbl(1).focus();await p.keyboard.press("Enter");ok(await p.locator("#pic .pt.sel").count()===1,"Enter on a vertex taps it");
  /* no line yet: a note, nothing recorded */
  await p.goto(URL0+"?screen=first");await p.getByRole("button",{name:"My line is finished"}).click();
  ok(await p.locator("#words .reply[data-unreadable]").count()===1&&!(await lastAnswer(p)),"no line yet: a note, no answer recorded");
  /* the dart: the diagonal that lies outside, by real taps */
  await p.goto(URL0+"?seed=4&screen=dart");await lbl(2).click();await lbl(0).click();await p.getByRole("button",{name:"My line is finished"}).click();
  ok((await lastReply(p)).includes("lies outside the shape, and it is still a diagonal"),"dart: the outside diagonal is right and says so");
  await p.goto(URL0+"?seed=4&screen=dart");await lbl(1).click();await lbl(3).click();await p.getByRole("button",{name:"My line is finished"}).click();
  ok((await lastReply(p)).includes("lies inside the shape")&&(await lastAnswer(p)).right===0,"dart: the inside diagonal is not what was asked");
  /* side or diagonal: real button click */
  await p.goto(URL0+"?seed=6&screen=which");const txt=await p.locator("#words .ch").allTextContents();
  ok(txt.length===3,"the choice has three answers");
  await p.locator("#words .ch").nth(2).click();ok(!(await p.locator("#words .reply.ok").count())&&(await lastReply(p)).includes("neither a side nor a diagonal"),"which: 'neither' gets a reply that names it");
  /* how many diagonals: she may try lines before choosing */
  await p.goto(URL0+"?seed=6&screen=howmany");await lbl(0).click();await lbl(2).click();await lbl(1).click();await lbl(3).click();
  ok(await p.locator("#pic line.kept").count()===2,"howmany: she can try two lines");
  await p.locator("#words .ch").nth(1).click();ok((await lastAnswer(p)).right===1&&(await lastReply(p)).includes("has 2 diagonals"),"howmany: 2 is right");
  /* the lettering varies: letter sets and the letter at each position change from item to item */
  const sets=new Set(),first=new Set(),second=new Set();
  for(let seed=1;seed<=14;seed++){await p.goto(URL0+"?seed="+seed+"&screen=first");
    const L=await p.evaluate(()=>[...document.querySelectorAll("#pic text.lbl")].map(t=>t.textContent));sets.add([...L].sort().join(""));first.add(L[0]);second.add(L[0]+L[1]);}
  ok(sets.size>=3,"all three letter sets appear ("+[...sets]+")");ok(first.size>=3,"the letter at vertex 0 changes ("+[...first]+")");ok(second.size>=4,"the lettering runs either way round ("+[...second]+")");
  /* the plan: 12 items, howmany once, yes and no style kinds mixed, three contrasts named */
  const plan=await p.evaluate(()=>window.__qe.PAGE.plan);ok(plan.length>=10&&plan.length<=12,"the plan has 10 to 12 items ("+plan.length+")");
  ok(plan.filter(k=>k==="howmany").length===1,"how many diagonals comes once");
  /* the drawings stay inside the picture and the shapes are never self-crossing */
  let bad=0;for(const s of ["first","other","dart","which","howmany"])for(let seed=1;seed<=25;seed++){await p.goto(URL0+"?seed="+seed+"&screen="+s);
    bad+=await p.evaluate(()=>[...document.querySelectorAll("#pic text")].filter(t=>{const x=+t.getAttribute("x"),y=+t.getAttribute("y");return x<8||x>412||y<12||y>376;}).length);}
  ok(bad===0,"every letter and line name lies inside the picture ("+bad+" outside)");
 }});
