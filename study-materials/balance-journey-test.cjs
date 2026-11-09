/* Scenario tests for balance-journey.html (Student 2, 9 Nov 2026). Headless Edge through playwright-core.
   Run: NODE_PATH="<Downloads>/HTML-TOOL/agentic-generator/node_modules" node balance-journey-test.cjs
   A driver plays the page the way a learner would: it reads the balance and the equation on the screen and works the controls.
   These check software behaviour only; they say nothing about whether she learns. */
const { chromium } = require("playwright-core");
const path = require("path");
const URL = "file:///" + path.resolve(__dirname, "balance-journey.html").replace(/\\/g, "/");
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BANNED = [/\bKI-/, /\bSK-/, /\bM8\d\d\b/, /\bmove\b/i, /\bstay/i, /knowledge item/i, /\bskill/i, /mastery/i, /\blevel \d/i, /\brung/i, /undefined|NaN|null/];
let failures = 0;
const ok = (c, m) => { if (!c) { failures++; console.log("  FAIL " + m); } else console.log("  ok   " + m); };

function solve(eq) { // "ax + b = cx + d" with whole numbers, either side may lack a term
  const side = s => { let b = 0, c = 0; s.split("+").map(t => t.trim()).forEach(t => { if (t.endsWith("x")) b += t === "x" ? 1 : +t.slice(0, -1); else c += +t; }); return { b, c }; };
  const [L, R] = eq.split("=").map(side); return (R.c - L.c) / (L.b - R.b);
}

async function state(page) {
  return page.evaluate(() => ({
    mode: P ? P.mode : null, P: P ? JSON.parse(JSON.stringify(P)) : null,
    eq: document.getElementById("eq") ? document.getElementById("eq").textContent : "",
    q: document.getElementById("q") ? document.getElementById("q").textContent : "",
    fb: document.getElementById("fb") ? document.getElementById("fb").textContent : "",
    box: !!document.getElementById("box"),
    buttons: [...document.querySelectorAll("#act button.btn")].map(b => b.textContent),
    text: document.querySelector(".app").innerText,
    task: S.task, taskId: TASKS_IDS[S.task]
  }));
}
const click = (page, label) => page.locator("#act button.btn", { hasText: label }).first().click();
async function ctl(page, side, label, n) { const idx = side === "L" ? 0 : 1; for (let i = 0; i < n; i++) await page.locator(".pan").nth(idx).locator("button", { hasText: label }).click(); }
async function type(page, n) { await page.fill("#box", String(n)); await page.locator(".keys .go").click(); }

/* One step of play. plan(st) may return an override: "wrongBags", "wrongCounters", "wrongX". */
async function play(page, seen, plan = () => null) {
  const st = await state(page); seen.add(st.text);
  const o = plan(st);
  if (st.mode === "bags" && st.buttons[0] && st.buttons[0].startsWith("I have taken bags")) {
    const n = Math.min(st.P.L.b, st.P.R.b);
    if (o === "wrongBags") { await ctl(page, st.P.L.b >= st.P.R.b ? "L" : "R", "Take a bag off", 1); }
    else { await ctl(page, "L", "Take a bag off", n - st.P.L.ob); await ctl(page, "R", "Take a bag off", n - st.P.R.ob); }
    await click(page, "I have taken bags"); return "bags";
  }
  if (st.mode === "counters" && st.buttons[0] && st.buttons[0].startsWith("I have taken counters")) {
    const bs = st.P.L.b ? "L" : "R", n = st.P[bs].c;
    if (o === "wrongCounters") await ctl(page, bs, "Take a counter off", 1);
    else { await ctl(page, "L", "Take a counter off", n - st.P.L.oc); await ctl(page, "R", "Take a counter off", n - st.P.R.oc); }
    await click(page, "I have taken counters"); return "counters";
  }
  if (st.mode === "share" && st.buttons[0] === "The counters are shared") {
    const bs = st.P.L.b ? "L" : "R", os = bs === "L" ? "R" : "L", x = st.P[os].c / st.P[bs].b;
    await ctl(page, bs, "Put 1 counter in every bag", x - st.P[bs].dealt); await click(page, "The counters are shared"); return "share";
  }
  if (st.box) {
    let x;
    if (st.q === "How many counters are in one bag?") { x = st.P.L.dealt || st.P.R.dealt; }
    else x = solve(st.eq);
    if (o === "wrongX") x = x + 1;
    if (o === "unsure") { await page.locator("#act button.btn", { hasText: "I don't know yet" }).click(); return "unsure"; }
    if (o === "balance") { await page.locator("#act button.btn", { hasText: "Show me the balance" }).click(); return "balance"; }
    await type(page, x); return "typed";
  }
  if (st.buttons.includes("Yes, the same")) {
    const cand = +st.q.match(/x = (\d+)/)[1], same = solve(st.eq) === cand;
    await click(page, same ? "Yes, the same" : "No, not the same"); return "check";
  }
  if (st.buttons.length) { await page.locator("#act button.btn").first().click(); return "next:" + st.buttons[0]; }
  return "idle";
}
async function runUntil(page, seen, stop, plan, max = 900) {
  let idle = 0;
  for (let i = 0; i < max; i++) { const st = await state(page); if (stop(st)) return st; const r = await play(page, seen, plan);
    if (r === "idle") { if (++idle > 8) return st; await page.waitForTimeout(250); } else idle = 0; }
  throw new Error("did not finish");
}
const hygiene = (seen, name) => { const bad = []; for (const t of seen) for (const b of BANNED) if (b.test(t)) bad.push(b + " in: " + t.slice(0, 160).replace(/\n/g, " | ")); ok(bad.length === 0, name + ": no ids, teacher words or broken text on her screen" + (bad.length ? "\n      " + [...new Set(bad)].slice(0, 5).join("\n      ") : "")); };

(async () => {
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const newPage = async (w = 1100, h = 900) => { const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage();
    page.on("pageerror", e => { failures++; console.log("  FAIL page error " + e.message); }); await page.goto(URL); return page; };

  console.log("1. Everything right: intro, every set holds, then the gap");
  { const page = await newPage(), seen = new Set();
    const st = await runUntil(page, seen, s => /ready in 3 days/.test(s.text));
    ok(st.taskId === "delay", "reaches the 3-day gap after all six sets");
    const K = await page.evaluate(() => JSON.parse(localStorage.getItem("student2-ki-v1")));
    ok(["bags", "counters", "share", "check"].every(k => K[k] && K[k].passed), "the four knowledge-item sets hold and are stored once for her (student2-ki-v1)");
    const ev = await page.evaluate(() => S.events);
    ok(ev.filter(e => e.event === "worked example shown").length === 6, "a worked example before each of the six sets (success first)");
    ok(ev.some(e => e.event === "answer" && e.role === "guided_practice" && e.own === false), "the item straight after a worked example is recorded as supported, not as her own");
    ok(!ev.some(e => e.role === "component_check"), "no probes when every answer is right");
    hygiene(seen, "scenario 1");
    console.log("   after 3 days: retrieval, the later task and paper");
    await page.evaluate(() => { S.reviewDue = Date.now() - 1000; S.lastDay = "2000-01-01"; store.set(S); });
    await page.reload(); const seen2 = new Set();
    const end = await runUntil(page, seen2, s => /end of this part/.test(s.text));
    const ev2 = await page.evaluate(() => S.events);
    ok(ev2.filter(e => e.role === "retrieval" && e.event === "answer").length === 6, "after the gap, one item of each set already passed");
    ok(ev2.some(e => e.event === "delayed whole task" && e.right === true), "a fresh whole task with no help after the gap");
    ok(ev2.some(e => e.role === "paper" && e.paper), "the paper task is recorded honestly (the paper itself is not seen)");
    ok(/end of this part/.test(end.text), "journey ends with a plain end text");
    hygiene(seen2, "scenario 1 after the gap");
    await page.context().close(); }

  console.log("2. Bags off one side only on the first supported item");
  { const page = await newPage(), seen = new Set();
    await runUntil(page, seen, s => s.mode === "bags" && s.buttons[0] && s.buttons[0].startsWith("I have taken bags"));
    await play(page, seen, () => "wrongBags"); await page.waitForTimeout(900);
    const st = await state(page);
    ok(/none off the (left|right) side\. The balance tips/.test(st.fb), "the reply says what she did and that the balance tips");
    ok(st.P.L.ob === 0 && st.P.R.ob === 0, "the bags go back where they started");
    ok(st.P.tilt === 0, "the balance is level again for her next try");
    const eq0 = st.eq, x0 = solve(st.eq), n0 = Math.min(st.P.L.b, st.P.R.b);
    await play(page, seen, () => "wrongBags"); await page.waitForTimeout(300);
    const st2 = await state(page);
    ok(/^Take \d+ bags? off each side/.test(st2.fb) && st2.mode === "none", "after a second reply the right step is shown and the controls are put away");
    await click(page, "Next"); await page.waitForTimeout(200);
    const st3 = await state(page), last = st3.P.lines[st3.P.lines.length - 1];
    ok(solve(last) === x0 && Math.min(st3.P.L.b, st3.P.R.b) === 0, `the written line (${last}) still has the same answer as ${eq0}, with bags on one side only`);
    await page.context().close(); }

  console.log("3. Two items in a row not right end the practice for today");
  { const page = await newPage(), seen = new Set(); let n = 0;
    const st = await runUntil(page, seen, s => /We stop this practice here for today/.test(s.text),
      s => s.mode === "bags" && s.buttons[0] && s.buttons[0].startsWith("I have taken bags") ? "wrongBags" : null);
    const p = await page.evaluate(() => JSON.parse(localStorage.getItem("student2-ki-v1")).bags); const ev3 = await page.evaluate(() => S.events.map(e => e.event + ":" + (e.set || "") + ":" + (e.role || "") + ":" + (e.right ?? "")));
    ok(p && p.stopped === true && !p.passed, "bags practice is stopped for today with her place kept " + (p && p.stopped ? "" : JSON.stringify(p) + " " + st.text.split("\n").join(" / ").slice(0, 300) + " EVENTS " + JSON.stringify(ev3)));
    await page.reload(); const seen2 = new Set();
    await runUntil(page, seen2, s => /Here is one done for you/.test(s.text));
    ok(true, "the next session starts that practice again with a worked example");
    await page.context().close(); }

  console.log("4. A wrong whole answer with no picture leads to chained checks, then back to the whole task");
  { const page = await newPage(), seen = new Set();
    await page.evaluate(() => { for (const k of ["bags", "counters", "share", "check"]) K[k] = { ki: SETS[k].ki, res: [], passed: true, stage: "contrast" };
      S.pr.whole = { res: [], passed: true }; S.task = TASKS_IDS.indexOf("lines"); S.lastDay = todayKey(); saveAll(); });
    await page.reload();
    await runUntil(page, seen, s => s.box && s.q === "What is x?" && !/done for you/.test(s.text));
    await play(page, seen, () => "wrongX");
    let st = await state(page);
    ok(/^If x = \d+, the left side holds \d+ and the right side holds \d+\. The two sides are not the same/.test(st.fb), "the reply says what her number does to the two sides");
    await runUntil(page, seen, s => /the first equation again/.test(s.text));
    const ev = await page.evaluate(() => S.events);
    ok(["bags", "counters", "share"].every(k => ev.some(e => e.role === "component_check" && e.set === k)), "short checks of bags, counters and sharing, in turn, while each is right");
    await runUntil(page, seen, s => s.box && s.q === "What is x?" && !/first equation again/.test(s.text) || /ready in 3 days/.test(s.text));
    const ev2 = await page.evaluate(() => S.events);
    ok(ev2.some(e => e.role === "return_whole" && e.own === false), "the return to the whole task is recorded as helped");
    hygiene(seen, "scenario 4");
    await page.context().close(); }

  console.log("5. Asking for the balance on a whole task");
  { const page = await newPage(), seen = new Set();
    await page.evaluate(() => { for (const k of ["bags", "counters", "share", "check"]) K[k] = { ki: SETS[k].ki, res: [], passed: true };
      S.pr.whole = { res: [], passed: true }; S.pr.lines = { res: [{ first: false, conds: [] }], passed: false }; S.task = TASKS_IDS.indexOf("lines"); S.lastDay = todayKey(); saveAll(); });
    await page.reload();
    await runUntil(page, seen, s => s.box && s.q === "What is x?");
    await play(page, seen, () => "balance");
    const st = await state(page);
    ok(st.mode === "bags", "the balance opens for the same equation");
    await runUntil(page, seen, s => s.buttons[0] === "Next" && /Each bag holds/.test(s.fb) === false && s.mode === "none" && /Yes\. Each bag holds/.test(s.text));
    const ev = await page.evaluate(() => S.events);
    ok(ev.some(e => e.event === "balance asked for") && ev.some(e => e.support === "balance"), "the balance is recorded as supplied");
    await page.context().close(); }

  console.log("6. Phone width: nothing wider than the screen");
  { const page = await newPage(375, 812), seen = new Set();
    await runUntil(page, seen, s => s.mode === "bags" && s.buttons[0] && s.buttons[0].startsWith("I have taken bags"));
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    ok(w[0] <= w[1], `no sideways scroll at 375 px (${w[0]} ≤ ${w[1]})`);
    const small = await page.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.offsetParent && (b.offsetHeight < 44 || b.offsetWidth < 44)).map(b => b.textContent));
    ok(small.length === 0, "every visible button is at least 44 px" + (small.length ? " (" + small.join(", ") + ")" : ""));
    await page.screenshot({ path: path.join(__dirname, "balance-journey-phone.png"), fullPage: true });
    await page.context().close(); }

  await browser.close();
  console.log(failures ? `\n${failures} failure(s)` : "\nAll scenarios passed.");
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
