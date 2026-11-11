/* Test for ki-ag-04-06.html (KI-AG-04 terms, KI-AG-06 coefficients), driven with real pointer clicks and key presses.
   Run:  node study-materials/equations-pages/equations-2.test.cjs   (tests site/equations-2.html)   (the checklist is in page-test-lib.cjs, copied from ki-ag-01-03.test.cjs) */
require("./page-test-lib.cjs").run({page:"equations-2.html",phoneShots:["w1-3","sup1","U3","U5diff","w2-3","V5b"],
 extra:async({p,URL0,ok,partInfo,typeIn,answerRight,MINUS,norm})=>{
  /* W3 of KI-AG-04: the same expression with the x term not first is not what was asked; the asked form is right */
  await p.goto(URL0+"?screen=w1-3");await typeIn(p,"9"+MINUS+"4x",false);
  ok(norm(await p.locator(".reply").last().textContent()).includes("the term in x is not first"),"9 − 4x typed back: told the x term is not first");
  await p.goto(URL0+"?screen=w1-3");await typeIn(p,MINUS+"4x+9",false);ok(await p.locator(".box.right").count()===1,"−4x + 9 accepted (leading minus on the keypad)");
  /* U4: the terms in the other order are accepted */
  await p.goto(URL0+"?screen=U4");let i=await partInfo(p);await typeIn(p,MINUS+(-i.b)+"+"+i.a+i.L,false);ok(await p.locator(".box.right").count()===1,"U4: −k + ax accepted");
  /* supported item: the terms in either order */
  await p.goto(URL0+"?screen=sup1");await typeIn(p,MINUS+"8",false);await typeIn(p,"3x",false);ok(await p.locator(".box.right").count()===2,"terms of 3x − 8 accepted in either order");
  /* U5 is held back until U2 is right on her own */
  await p.goto(URL0);await p.evaluate(()=>localStorage.clear());
  const gated=await p.evaluate(()=>{const S=window.__ki.STOPS["ki-ag-04"];return S.plan.indexOf("U5same")>S.plan.indexOf("U2")&&JSON.stringify(S.gates.U5same)==='["U2"]';});ok(gated,"U5 comes only after an own-right U2");
 }});
