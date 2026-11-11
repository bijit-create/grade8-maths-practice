/* Test for site/quadrilaterals-7.html (angles of a quadrilateral written with x, SK-GE-09). Run: node tests/quadrilaterals-7.test.cjs */
const path=require("path"),fs=require("fs");
const SH=path.join(__dirname,"shots","q7");fs.mkdirSync(SH,{recursive:true});
require("./quad-test-lib.cjs").run({page:"quadrilaterals-7.html",phoneShots:["w1","angle","check"],
 extra:async({p,URL0,ok,lastReply,lastAnswer})=>{
  /* 1. fresh items obey the rules: whole numbers, 20 to 200, never 180, at most one above 180, angles sum to 360 */
  await p.goto(URL0+"?screen=w1");
  const gen=await p.evaluate(()=>{const ctx={rng:Math.random,int:(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick:a=>a[Math.floor(Math.random()*a.length)]};
    const bad=[];let concave=0,named=0;
    for(let i=0;i<400;i++){const o=[{E:"none"},{E:"none",concave:true},{E:"some",strict:true},{E:"some"},{E:"none",named:true,concave:true},{E:"none",named:true,concave:false}][i%6];
      const it=fresh(ctx,o);const s=it.ang.reduce((a,b)=>a+b,0);
      if(s!==360||it.ang.some(a=>!Number.isInteger(a)||a<20||a>200||a===180)||it.ang.filter(a=>a>180).length>1||!Number.isInteger(it.x))bad.push(JSON.stringify(it.ang));
      if(o.named){named++;if(!(it.c[it.target]>=2)||it.ang[it.target]===it.x)bad.push("named "+JSON.stringify(it));}
      if(it.concave)concave++;
      /* the picture's angles are the angles of the item */
      const P=it.P,area=P.reduce((t,q,m)=>{const r=P[(m+1)%4];return t+q[0]*r[1]-r[0]*q[1];},0);
      for(let v=0;v<4;v++){const a=P[(v+3)%4],b=P[v],c=P[(v+1)%4],e1=[b[0]-a[0],b[1]-a[1]],e2=[c[0]-b[0],c[1]-b[1]];
        const turn=Math.atan2(e1[0]*e2[1]-e1[1]*e2[0],e1[0]*e2[0]+e1[1]*e2[1])*180/Math.PI*Math.sign(area);
        if(Math.abs((180-turn)-it.ang[v])>3)bad.push("drawn "+(180-turn).toFixed(1)+" vs "+it.ang[v]);}
      if(P.some(q=>q[0]<80||q[0]>340||q[1]<80||q[1]>300))bad.push("outside "+JSON.stringify(P));}
    return {bad:bad.slice(0,3),concave,named};});
  ok(gen.bad.length===0,"400 fresh items: whole angles, 20 to 200, none 180, at most one above 180, drawn true to scale "+JSON.stringify(gen.bad));
  ok(gen.concave>20,"concave items come up ("+gen.concave+")");
  /* 2. the angle item: nothing to type until she taps a corner; the tap writes the expression beside the picture */
  await p.goto(URL0+"?seed=9&screen=angle");
  ok(await p.locator("#words input.box").count()===0,"angle: no answer box before she taps a corner");
  ok((await p.locator("#words .reply").count())===0,"angle: nothing is judged before she answers");
  const t=await p.evaluate(()=>window.__item.target);const other=(t+1)%4;
  await p.locator(`#pic .pt[data-i="${other}"]`).click();
  const said=(await p.locator("#words p").allTextContents()).join(" ");
  ok(/You tapped ∠[ABCD]\. ∠[ABCD] = /.test(said),"angle: a tap writes that corner's expression beside the picture");
  ok(await p.locator("#words input.box").count()===1&&await p.locator("#pic .pt.sel").count()===1,"angle: the box appears and the tapped corner is marked");
  await p.locator(`#pic .pt[data-i="${t}"]`).click();ok(await p.locator("#pic .pt.sel").count()===1,"angle: tapping another corner moves the mark");
  await p.screenshot({path:path.join(SH,"2-angle-after-tap.png")});
  /* real typing: x typed when the angle was asked */
  const info=await p.evaluate(()=>({x:window.__item.x,ans:window.__item.ang[window.__item.target]}));
  await p.locator("#words input.box").fill(String(info.x));await p.getByRole("button",{name:"Check my answer"}).click();
  const r=await lastReply(p);ok(r.startsWith("You wrote "+info.x+"°. That is x."),"angle: typing x gets 'That is x' ("+r.slice(0,60)+")");
  ok(r.includes("= "+info.ans+"°"),"angle: the reply gives the angle");
  await p.screenshot({path:path.join(SH,"2-angle-wrong-reply.png")});
  /* a word that is not a number gets a note, not a wrong mark */
  await p.goto(URL0+"?seed=9&screen=findx");await p.locator("#words input.box").fill("ten");await p.getByRole("button",{name:"Check my answer"}).click();
  ok(await p.locator("#words .reply[data-unreadable]").count()===1&&!(await lastAnswer(p)),"a non-number answer: a note, nothing recorded");
  await p.locator("#words input.box").fill("36.5");await p.getByRole("button",{name:"Check my answer"}).click();
  ok(await p.locator("#words .reply[data-unreadable]").count()===1&&!(await lastAnswer(p)),"a decimal answer: a note, nothing recorded");
  /* 3. real clicks on the equation choices, right one gives the green reply */
  await p.goto(URL0+"?seed=5&screen=equation");
  const eqs=await p.locator("#words .ch").allTextContents();ok(eqs.length===3&&eqs.filter(s=>/= 180°/.test(s)).length===1&&eqs.filter(s=>/= 360°/.test(s)).length===2,"equation: 3 choices, one with 180°, two with 360°");
  const full=await p.evaluate(()=>sumLine(window.__item));
  await p.getByRole("button",{name:full,exact:true}).click();ok((await lastReply(p)).startsWith("This equation is right."),"equation: the right choice gets the right reply");
  await p.screenshot({path:path.join(SH,"3-equation-right.png")});
  /* 4. check: both variants appear over seeds, and each gives its own reply */
  let slips=0,fine=0;
  for(const seed of [1,2,3,4,5,6,7,8,9,10,11,12]){await p.goto(URL0+"?seed="+seed+"&screen=check");
    const s=await p.evaluate(()=>{const w=window.__qe.part.wrongs[0];return w.expect.startsWith("Your answer was ye");});
    if(s)slips++;else fine++;}
  ok(slips>0&&fine>0,"check: some worked answers have a slip, some do not ("+slips+" and "+fine+")");
  /* 5. the first screens */
  await p.goto(URL0+"?seed=4&screen=w1");await p.screenshot({path:path.join(SH,"1-worked-example.png")});
  ok((await p.locator("#pic text").allTextContents()).join("|").includes("∠D = 4x"),"worked example 1 writes the 4 expressions at the corners");
 }});
