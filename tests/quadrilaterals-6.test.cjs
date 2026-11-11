/* Test for site/quadrilaterals-6.html (find an angle from the angle beside it, SK-GE-11). Run: node tests/quadrilaterals-6.test.cjs */
const path=require("path");
const SH=path.join(__dirname,"shots","q6");require("fs").mkdirSync(SH,{recursive:true});
require("./quad-test-lib.cjs").run({page:"quadrilaterals-6.html",phoneShots:["w1","w2","outBig","twoStep"],
 extra:async({p,URL0,ok,lastReply,lastAnswer,norm})=>{
  const outsideOf=()=>p.evaluate(()=>{const t=[...document.querySelectorAll("#pic text.ang")].map(e=>e.textContent).filter(s=>/^\d+°$/.test(s));return t.length?parseInt(t[0]):null;});
  const vertexOf=()=>p.evaluate(()=>document.querySelector("#words .q").textContent.match(/∠(\w)/)[1]);
  const check=()=>p.getByRole("button",{name:"Check my answer"}).click();
  /* the drawn angle is the angle written: the interior angle at the extended vertex is 180 minus the outside angle */
  for(const seed of [2,5,8,13,21,34]){
    for(const s of ["outBig","outSmall","otherVertex"]){
      await p.goto(URL0+"?seed="+seed+"&screen="+s);const out=await outsideOf();
      const g=await p.evaluate(()=>{const gp=document.querySelector("#pic .gap");const V=[+gp.getAttribute("x1"),+gp.getAttribute("y1")];
        const E=[+gp.getAttribute("x2"),+gp.getAttribute("y2")];
        const near=(a)=>Math.hypot(a[0]-V[0],a[1]-V[1])<.05;const nb=[];
        document.querySelectorAll("#pic .side").forEach(l=>{const a=[+l.getAttribute("x1"),+l.getAttribute("y1")],b=[+l.getAttribute("x2"),+l.getAttribute("y2")];
          if(near(a))nb.push(b);else if(near(b))nb.push(a);});
        const ang=(u,w)=>Math.acos(Math.max(-1,Math.min(1,(u[0]*w[0]+u[1]*w[1])/(Math.hypot(...u)*Math.hypot(...w)))))*180/Math.PI;
        const d=nb.map(n=>[n[0]-V[0],n[1]-V[1]]);const e=[E[0]-V[0],E[1]-V[1]];
        const straight=d.some(q=>Math.abs(ang(q,e)-180)<.5);
        return {inside:ang(d[0],d[1]),straight,sides:nb.length,inbox:E[0]>0&&E[0]<420&&E[1]>0&&E[1]<380};});
      ok(g.sides===2&&g.straight&&g.inbox,`${s} seed ${seed}: the dashed line continues a side straight on and stays in the picture`);
      ok(Math.abs(g.inside-(180-out))<1.2,`${s} seed ${seed}: the angle drawn at the vertex is ${180-out}° (${g.inside.toFixed(1)}°)`);
      if(s==="outBig")ok(out>90,"outBig has an outside angle above 90°");
      if(s==="outSmall")ok(out<90,"outSmall has an outside angle below 90°");}}
  /* real taps: nothing is judged while she taps; the tap shades the angle; the decision button judges */
  await p.goto(URL0+"?seed=9&screen=outBig");const out=await outsideOf();
  ok(await p.locator("#pic .pt").count()===2,"the picture job: two marked angles can be tapped");
  await p.locator('#pic .pt[data-w="in"]').click();
  ok(await p.locator('#pic path[fill="var(--mark)"]').count()===1,"the tapped angle is shaded");
  await p.locator("#words input").fill(String(180-out));
  ok((await p.locator("#words .reply").count())===0,"nothing is judged before she presses Check my answer");
  await check();
  ok((await lastReply(p)).startsWith("Yes."),"tap the inside angle and write 180 minus the outside angle: right");
  ok((await lastAnswer(p)).right===1&&/tapped the inside angle/.test((await lastAnswer(p)).answer),"the record keeps the tap and the number");
  ok(await p.locator("#pic text.ang",{hasText:(180-out)+"°"}).count()===1,"the angle's size is written on the picture after a right answer");
  await p.screenshot({path:path.join(SH,"3-right.png"),fullPage:true});
  /* tapping the outside angle */
  await p.goto(URL0+"?seed=9&screen=outBig");await p.locator('#pic .pt[data-w="out"]').click();await p.locator("#words input").fill(String(180-out));
  await check();
  const r1=await lastReply(p);ok(r1.startsWith("You tapped ∠")&&r1.includes("the angle outside the quadrilateral"),"tapped the outside angle: the reply says what she tapped ("+r1.slice(0,60)+")");
  ok((await lastAnswer(p)).right===0,"tapping the outside angle is not recorded right");
  /* the outside angle written as the answer, with real pointer taps */
  await p.goto(URL0+"?seed=9&screen=outSmall");const o2=await outsideOf();await p.locator('#pic .pt[data-w="in"]').click();await p.locator("#words input").fill(String(o2));
  await check();
  const r2=await lastReply(p);ok(r2.startsWith(`You wrote ${o2}°.`)&&r2.includes("already written on the picture"),"wrote the outside angle: reply names it ("+r2.slice(0,60)+")");
  await p.screenshot({path:path.join(SH,"2-own-wrong.png"),fullPage:true});
  /* honest notes, nothing judged */
  await p.goto(URL0+"?seed=9&screen=outBig");await check();
  ok(await p.locator("#words .reply[data-unreadable]").count()===1&&!(await lastAnswer(p)),"no tap yet: a note, no answer recorded");
  await p.locator('#pic .pt[data-w="in"]').click();await p.locator("#words input").fill("70.5");await check();
  ok(await p.locator("#words .reply[data-unreadable]").count()===1&&!(await lastAnswer(p)),"a number that is not whole: a note, not a wrong mark");
  /* keyboard */
  await p.goto(URL0+"?seed=9&screen=outBig");await p.locator('#pic .pt[data-w="in"]').focus();await p.keyboard.press("Enter");
  ok(await p.locator('#pic path[fill="var(--mark)"]').count()===1,"Enter on an angle taps it");
  ok(await p.evaluate(()=>document.activeElement&&document.activeElement.getAttribute("data-w")==="in"),"focus stays on the angle after a tap");
  /* without the picture job: no tap targets, a ? at the inside angle */
  await p.goto(URL0+"?seed=9&screen=outBig&tap=0");const o3=await outsideOf();
  ok(await p.locator("#pic .pt").count()===0&&await p.locator("#pic text.ang",{hasText:"?"}).count()===1,"without the picture job the inside angle is marked ?");
  await p.locator("#words input").fill(String(180-o3));await check();
  ok((await lastReply(p)).startsWith("Yes."),"the item still works without the tap");
  /* the picture job fades in the plan: early own items have it, later ones do not */
  await p.goto(URL0+"?seed=3");await p.evaluate(()=>localStorage.clear());await p.goto(URL0+"?seed=3");
  let sawTap=false,sawNoTap=false,g2=0;
  while(g2++<60){const ph=await p.evaluate(()=>window.__qe.S&&window.__qe.S.st?window.__qe.S.st.phase:null);
    if(ph==="own"){const n=await p.locator("#pic .pt").count();const kind=await p.evaluate(()=>{const s=window.__qe.S.st;return s.queue[s.pi]});
      if(kind!=="which"){if(n===2)sawTap=true;if(n===0)sawNoTap=true;}}
    if(await p.locator("#acts .next").count())await p.locator("#acts .next").click();
    else if(await p.evaluate(()=>!!window.__qe.part))await p.evaluate(()=>window.__qe.part.right());else break;}
  ok(sawTap&&sawNoTap,"the tap job is on the early own items and off the later ones");
  /* two steps */
  await p.goto(URL0+"?seed=4&screen=twoStep");
  const known=await p.evaluate(()=>[...document.querySelectorAll("#pic text.ang")].map(e=>e.textContent));
  ok(known.includes("?")&&known.filter(t=>/°$/.test(t)).length===3,"two steps: the outside angle, two known angles and a ? are written ("+known+")");
  await p.locator('#pic .pt[data-w="in"]').click();
  const nw=await p.evaluate(()=>window.__qe.part.wrongs.length);ok(nw>=3,"two steps has at least 3 planned wrong answers ("+nw+")");
  /* which: a real click on a choice */
  await p.goto(URL0+"?seed=6&screen=which");
  const names=await p.locator("#words .ch").allTextContents();ok(names.length===3,"which: three choices");
  const at=await p.evaluate(()=>document.querySelector("#words .q").textContent.match(/at (\w)\?/)[1]);
  const inside=names.find(n=>n.length===4&&n[2]===at&&!/E/.test(n));
  await p.locator("#words .ch",{hasText:inside}).click();ok((await lastReply(p)).startsWith("Yes."),"which: the angle made by two sides is right ("+inside+")");
  /* shots */
  await p.goto(URL0+"?screen=w2");await p.screenshot({path:path.join(SH,"1-worked-2.png"),fullPage:true});
  await p.goto(URL0+"?screen=w1");await p.screenshot({path:path.join(SH,"0-worked-1.png"),fullPage:true});
 }});
