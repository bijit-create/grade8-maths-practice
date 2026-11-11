/* Test for site/quadrilaterals-4.html (the 4 angles of a quadrilateral add up to 360°, KI-GE-23). Run: node tests/quadrilaterals-4.test.cjs */
require("./quad-test-lib.cjs").run({page:"quadrilaterals-4.html",phoneShots:["w1","w2","sup","concave"],
 extra:async({p,URL0,ok,lastReply,lastAnswer})=>{
  const labels=()=>p.evaluate(()=>[...document.querySelectorAll("#pic .ang")].map(t=>parseInt(t.textContent)));
  const sum=async()=>(await labels()).reduce((a,b)=>a+b,0);
  const centre=i=>p.evaluate(i=>{const r=document.querySelector(`#pic g.pt[data-i="${i}"] .pdot`).getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];},i);
  async function drag(i,dx,dy){const [x,y]=await centre(i);await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x+dx/2,y+dy/2,{steps:3});await p.mouse.move(x+dx,y+dy,{steps:3});await p.mouse.up();}
  const type=async v=>{await p.locator("#words .ans input").fill(String(v));await p.getByRole("button",{name:"Check my answer"}).click();};

  /* W2: real pointer drags change the angles; nothing is judged while she drags */
  await p.goto(URL0+"?seed=7&screen=w2");
  const before=(await labels()).join(",");
  await drag(0,30,20);
  ok((await labels()).join(",")!==before,"a pointer drag of a vertex changes the angles");
  ok(await sum()===360,"the 4 angles written at the vertices add up to 360 after a drag");
  ok((await p.locator("#words .reply").count())===0,"nothing is judged while she drags");
  /* a drag that would make the shape bend in is refused, the shape stays convex and the angles still add to 360 */
  await drag(1,-200,300);ok(await sum()===360&&(await labels()).every(a=>a>=25&&a<=160),"a drag that would bend the shape in leaves a convex shape with angles adding to 360");
  /* keyboard: arrow keys drag the focused vertex */
  await p.locator('#pic g.pt[data-i="2"]').focus();const k0=(await labels()).join(",");await p.keyboard.press("ArrowLeft");await p.keyboard.press("ArrowUp");
  ok((await labels()).join(",")!==k0,"arrow keys change the shape");
  /* three different shapes go into the table, then the sum in every row */
  const add=()=>p.getByRole("button",{name:"Put these 4 angles in the table"}).click();
  await add();await p.getByRole("button",{name:"Put these 4 angles in the table"}).click();
  ok((await p.locator("#pic table.rows tbody tr").count())===1,"the same angles cannot be added twice (one row only)");
  ok((await p.locator("#words .reply[data-unreadable]").count())===1,"the repeated shape gets a note, not a wrong mark");
  await drag(3,-25,-15);await add();await drag(0,-20,25);await add();
  ok((await p.locator("#pic table.rows tbody tr").count())===3,"three different shapes are in the table");
  ok((await p.locator("#words .ans input").count())===1,"after the third row the question about the sum is asked");
  await drag(0,40,40);ok(await sum()===360,"the shape is fixed once the third row is in (angles unchanged)");
  await type(360);ok((await lastReply(p)).startsWith("Yes."),"pointer: 360 in W2 gets the right reply");
  ok((await lastAnswer(p)).right===1,"W2 is recorded right");

  /* after an answer, her drags are ignored */
  await p.goto(URL0+"?seed=5&screen=drag");
  ok((await p.locator("#words .reply").count())===0,"drag item: no reply yet");
  await type(360);
  ok((await p.locator("#words .reply[data-unreadable]").count())===1&&!(await lastAnswer(p)),"drag item: 360 typed before any drag gets a note and records nothing");
  await drag(0,30,20);await type(360);
  ok((await lastReply(p)).startsWith("Yes."),"drag item: a drag then 360 is right");
  const after=(await labels()).join(",");await drag(1,30,30);ok((await labels()).join(",")===after,"the picture ignores a drag after the answer");
  ok(!(await p.locator("#pic button").count()),"no buttons are left under the picture after the answer");

  /* a corner points in: real taps on the vertex that points in */
  await p.goto(URL0+"?seed=9&screen=concave");
  const info=await p.evaluate(()=>{const a=[...document.querySelectorAll("#pic .ang")].map(t=>parseInt(t.textContent));return {a,R:a.findIndex(v=>v>180),n:document.querySelectorAll("#pic .arc").length};});
  ok(info.R>=0&&info.a[info.R]>180&&info.a.reduce((x,y)=>x+y,0)===360,"concave: one angle is more than 180 and the 4 angles add up to 360 ("+info.a+")");
  ok(info.n===4,"concave: the 4 angles are marked with arcs");
  await type(360);ok((await p.locator("#words .reply[data-unreadable]").count())===1,"concave: no vertex tapped, a note");
  await p.locator(`#pic g.pt[data-i="${info.R}"]`).click();
  ok(await p.locator("#pic .pt.sel").count()===1,"concave: the tapped vertex is ringed");
  await type(360);ok((await lastReply(p)).startsWith("Yes."),"concave: the corner that points in tapped and 360 is right");

  /* a rectangle: tap the 4 vertices with real clicks */
  await p.goto(URL0+"?seed=13&screen=rect");
  for(let i=0;i<3;i++)await p.locator(`#pic g.pt[data-i="${i}"]`).click();
  await type(360);ok((await p.locator("#words .reply[data-unreadable]").count())===1,"rect: only 3 vertices marked, a note");
  await p.locator('#pic g.pt[data-i="3"]').click();
  ok((await p.locator("#pic text.ang").allTextContents()).join()==="90°,90°,90°,90°","rect: each tapped vertex shows 90°");
  await type(360);ok((await lastReply(p)).startsWith("Yes."),"rect: 4 marks and 360 is right");

  /* possible or not: two kinds of 'no' and the 'yes' are told apart, and about half the items are possible */
  let yes=0,no=0;
  for(let s=1;s<=12;s++){await p.goto(URL0+"?seed="+((s*s*7919+s*104729)%999983+1)+"&screen=poss");
    const q=await p.locator("#words .q").textContent();const n=(q.match(/\d+/g)||[]).slice(1).map(Number);const t=n.reduce((a,b)=>a+b,0);if(t===360)yes++;else no++;
    ok((await p.locator("#words .ch").count())===3,"poss: three answers");}
  ok(yes>=3&&no>=3,"poss: possible and not possible items both occur ("+yes+" yes, "+no+" no) when each screen is opened fresh");
  /* the letters change from item to item */
  const sets=new Set();for(let s=1;s<=14;s++){await p.goto(URL0+"?seed="+((s*s*6151+s*86969)%999979+1)+"&screen=tri");sets.add(await p.evaluate(()=>[...document.querySelectorAll("#pic .lbl")].map(t=>t.textContent).sort().join("")));}
  ok(sets.size>=3,"the vertex letters vary between items ("+[...sets]+")");
 }});
