/* Test for site/quadrilaterals-1.html (make a quadrilateral, KI-GE-21). Run: node tests/quadrilaterals-1.test.cjs */
require("./quad-test-lib.cjs").run({page:"quadrilaterals-1.html",phoneShots:["w1","w2","sup","line"],
 extra:async({p,URL0,ok,lastReply,lastAnswer})=>{
  /* real pointer taps on the picture: 4 points around the shape and the first again, then the decision button */
  await p.goto(URL0+"?seed=9&screen=four");
  const order=await p.evaluate(()=>{const pts=[...document.querySelectorAll("#pic .pt")].map(g=>{const c=g.querySelector(".pdot");return [+c.getAttribute("cx"),+c.getAttribute("cy")];});
    const cx=pts.reduce((s,q)=>s+q[0],0)/4,cy=pts.reduce((s,q)=>s+q[1],0)/4;return [0,1,2,3].sort((i,j)=>Math.atan2(pts[i][1]-cy,pts[i][0]-cx)-Math.atan2(pts[j][1]-cy,pts[j][0]-cx));});
  ok((await p.locator("#words .reply").count())===0,"nothing is judged before she says the shape is finished");
  for(const i of order.concat([order[0]]))await p.locator(`#pic .pt[data-i="${i}"]`).click();
  ok(await p.locator("#pic .side").count()===4,"each tap draws a side; the fifth tap closes the shape (4 sides)");
  ok(await p.locator("#pic .lbl").count()===4,"the 4 vertices are named in tap order");
  await p.getByRole("button",{name:"My shape is finished"}).click();
  ok((await lastReply(p)).startsWith("ABCD is closed"),"pointer: a quadrilateral gets the right reply");ok(await p.locator("#pic .arc").count()===4,"the 4 angles are marked when it is right");
  /* keyboard: Enter on a point taps it */
  await p.goto(URL0+"?seed=9&screen=five");await p.locator('#pic .pt[data-i="0"]').focus();await p.keyboard.press("Enter");
  ok(await p.locator("#pic .pt.used").count()===1,"Enter on a point taps it");
  /* the decision button with no side yet: an honest note, nothing judged */
  await p.goto(URL0+"?screen=five");await p.getByRole("button",{name:"My shape is finished"}).click();
  ok(await p.locator("#words .reply[data-unreadable]").count()===1&&!(await lastAnswer(p)),"no side yet: a note, no answer recorded");
  /* Start again clears her drawing */
  await p.locator('#pic .pt[data-i="1"]').click();await p.getByRole("button",{name:"Start again"}).click();ok(await p.locator("#pic .side").count()===0,"Start again clears her shape");
 }});
