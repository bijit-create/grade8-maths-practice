/* Test for site/quadrilaterals-5.html (find the missing angle, SK-GE-08). Run: node tests/quadrilaterals-5.test.cjs */
require("./quad-test-lib.cjs").run({page:"quadrilaterals-5.html",phoneShots:["w1","w2","reflex","noPicture"],
 extra:async({p,URL0,ok,lastReply,lastAnswer})=>{
  const item=()=>p.evaluate(()=>window.__item);
  /* real typing and a real click on the decision button */
  await p.goto(URL0+"?seed=9&screen=pictureOther");
  ok((await p.locator("#words .reply").count())===0,"nothing is judged before she checks her answer");
  ok(await p.locator("#pic .ang").count()===4&&(await p.locator("#pic .ang",{hasText:"?"}).count())===1,"the picture writes 3 angles and one ?");
  ok(await p.locator("#pic .arc").count()===4,"each of the 4 angles is marked");
  let it=await item();ok(it.h!==3,"pictureOther hides an angle that is not at D");
  await p.locator("#words input").fill("75.5");await p.getByRole("button",{name:"Check my answer"}).click();
  ok(await p.locator("#words .reply[data-unreadable]").count()===1&&!(await lastAnswer(p)),"a number with a decimal point gets a note, no wrong mark");
  await p.locator("#words input").fill(String(it.right));await p.getByRole("button",{name:"Check my answer"}).click();
  ok((await lastReply(p)).startsWith("Yes."),"typed right answer gets the right reply");
  ok(await p.locator("#pic .ang",{hasText:"?"}).count()===0,"the right answer replaces the ? in the picture");
  /* the angles of every picture add up to 360 and the shown ones match the answer */
  for(const kind of ["pictureD","pictureOther","looksRight","reflex","noPicture"])for(const seed of [1,2,3,4,5,6,7,8]){
    await p.goto(URL0+`?seed=${seed}&screen=${kind}`);it=await item();
    ok(it.ang.reduce((a,b)=>a+b,0)===360&&it.right===360-it.ks,`${kind} seed ${seed}: the 4 angles add up to 360`);
    if(kind==="looksRight")ok([89,91].includes(it.right),`looksRight seed ${seed}: hidden angle is 89 or 91 (${it.right})`);
    if(kind==="reflex")ok(it.right>180&&it.right<=290,`reflex seed ${seed}: hidden angle is more than 180 (${it.right})`);
    if(kind==="pictureD")ok(it.h===3,"pictureD hides D");
    if(kind==="noPicture")ok(await p.locator("#pic svg").count()===0&&!/∠[A-D]/.test(await p.locator("#words").textContent()),"noPicture: no picture and no letters A to D");}
  /* hidden vertex and letters vary */
  const hs=new Set(),ls=new Set();
  for(let s=1;s<=30;s++){await p.goto(URL0+`?seed=${s}&screen=pictureOther`);hs.add((await item()).h);await p.goto(URL0+`?seed=${s*7919}&screen=noPicture`);ls.add((await item()).names);}
  ok(hs.size===3,"the hidden vertex varies among A, B and C");ok(ls.size>=3,"the letters vary on no-picture items ("+[...ls]+")");
  /* the reply to 90 on a shape that looks rectangular */
  await p.goto(URL0+"?seed=9&screen=looksRight");await p.locator("#words input").fill("90");await p.keyboard.press("Enter");
  ok((await lastReply(p)).startsWith("You wrote 90°. It looks like a right angle, but"),"90° on the looks-like item gets its own reply");
  /* the reflex answer sits outside the shape: arc goes the long way */
  await p.goto(URL0+"?seed=4&screen=reflex");
  ok(await p.locator('#pic .arc[d*=" 0 1 1 "]').count()===1,"the reflex angle is drawn as a large arc");
  /* two wrong answers in a row: the second reply shows the worked answer */
  await p.goto(URL0+"?seed=9&screen=pictureD");await p.locator("#words input").fill("5");await p.keyboard.press("Enter");
  ok(!(await lastReply(p)).includes("Here is the answer"),"the first wrong answer does not show the worked answer");
 }});
