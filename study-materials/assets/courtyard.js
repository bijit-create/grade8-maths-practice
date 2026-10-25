/* Original vector character; all lesson data and mastery rules stay in the lesson. */
const courtyard = document.getElementById('courtyard');
courtyard.innerHTML = `
 <span class="journey-title">Billi goes home <span id="journeyCount"></span></span>
 <div class="journey-track" aria-hidden="true">${Array.from({length:10},()=>'<i></i>').join('')}</div>
 <div class="home-door" aria-hidden="true"></div>
 <div class="cat-traveller" data-state="rest" aria-hidden="true">
 <svg class="cat" viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg">
 <g stroke="#263538" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
 <g class="walking">
 <path class="cat-tail" d="M34 48C8 48 10 22 19 14C27 7 34 16 26 22C20 27 21 38 36 37" fill="#263538"/>
 <path class="leg-b" d="M68 48L64 74Q63 79 73 77L80 51" fill="#faf5e7"/>
 <path class="leg-a" d="M37 49L29 73Q27 79 37 77L49 53" fill="#faf5e7"/>
 <path d="M28 39Q36 28 58 34L79 30L85 50Q66 65 41 57Q29 54 28 39" fill="#faf5e7"/>
 <path d="M31 38Q48 28 61 35L58 49Q48 56 37 49Z" fill="#263538" stroke="none"/>
 <path class="leg-b" d="M77 49L85 72Q88 76 95 74L88 49" fill="#faf5e7"/>
 <path class="leg-a" d="M44 52L47 74Q49 79 56 76L56 55" fill="#faf5e7"/>
 <path d="M73 34L74 11L85 20L99 14L97 35Q96 47 83 47Q73 44 73 34" fill="#263538"/>
 <path d="M77 17L78 25L83 23M94 20L89 25L94 27" stroke="#cd947f"/>
 <path d="M85 26Q80 35 80 40Q90 47 96 36L92 30" fill="#faf5e7" stroke="none"/>
 <path d="M91 34L95 34L93 37Z" fill="#c48376" stroke="none"/>
 <path d="M82 29L85 28M95 28L98 27M92 39L100 40M92 42L99 45" stroke-width="1.3"/>
 </g>
 <g class="seated">
 <path d="M51 73Q24 79 25 60Q25 53 31 54Q37 55 34 62Q35 69 51 65" fill="#263538"/>
 <path d="M48 39Q38 52 40 74Q47 82 75 76Q73 53 66 39" fill="#263538"/>
 <path d="M55 42L51 73Q52 79 59 76L61 57L63 75Q67 79 72 75L65 43" fill="#faf5e7"/>
 <path d="M43 28L43 9L55 18L70 10L72 30Q73 45 58 46Q42 43 43 28" fill="#263538"/>
 <path d="M46 15L48 23L52 21M67 16L63 22L68 24" stroke="#cd947f"/>
 <path d="M57 24Q50 34 49 39Q58 48 67 37Z" fill="#faf5e7" stroke="none"/>
 <path d="M48 29Q51 32 54 29M63 29Q66 32 69 28M56 35L60 35M58 36L58 39M46 36L35 33M46 39L35 41M68 35L80 31M69 39L81 41" stroke-width="1.4"/>
 </g>
 <g class="front">
 <path d="M46 45Q36 57 40 77Q57 83 73 77L66 45" fill="#263538"/>
 <path d="M52 46L49 76L58 77L60 56L64 76L72 76L66 45" fill="#faf5e7"/>
 <path d="M43 28L42 8L55 18L71 9L73 30Q73 46 58 47Q42 43 43 28" fill="#263538"/>
 <path d="M46 14L48 23L52 21M68 15L63 22L69 23" stroke="#cd947f"/>
 <path d="M58 22L49 39Q59 49 68 38Z" fill="#faf5e7" stroke="none"/>
 <path d="M47 29Q51 25 54 29M63 29Q67 25 70 29" stroke="#d9b95e" stroke-width="3"/>
 <path d="M56 35L60 35L58 38M58 38L55 40M58 38L62 40M46 36L34 33M46 40L34 42M70 36L81 32" stroke-width="1.3"/>
 <g class="knock-paw"><path d="M68 54Q76 52 80 37Q82 30 88 34Q93 38 88 45L77 62Q72 66 68 61" fill="#faf5e7"/><ellipse cx="85" cy="38" rx="3.5" ry="4" fill="#ce9a87" stroke="none"/></g>
 <path class="tap-marks" d="M91 25L94 20M96 31L103 29M97 37L104 40" stroke="#a87338"/>
 </g></g></svg></div>
 <div class="cat-bubble" hidden></div><div class="celebration" aria-hidden="true"></div>
 <span class="journey-live" role="status" aria-live="polite"></span>`;

const Billi = (()=>{
 const traveller=courtyard.querySelector('.cat-traveller'),bubble=courtyard.querySelector('.cat-bubble');
 let active=false,running=false,progress=0,right=0,attempts=0,lastActive=Date.now(),nudged=false,reaction=null,celebrationTimer=null;
 const live=courtyard.querySelector('.journey-live');
 function state(value){traveller.dataset.state=value;}
 function message(text,announce=false){bubble.hidden=!text;bubble.textContent=text;if(announce)live.textContent=text;}
 function position(p){progress=Math.max(progress,Math.min(.96,p));traveller.style.left=`${4+progress*78}%`;courtyard.querySelectorAll('.journey-track i').forEach((dot,i)=>dot.classList.toggle('reached',i<Math.floor(progress*10)));}
 function activity(){lastActive=Date.now();if(nudged){cancelReaction();nudged=false;message('');state('rest');}}
 function cancelReaction(){clearTimeout(reaction);reaction=null;}
 function celebrate(final=false){cancelReaction();clearTimeout(celebrationTimer);state(final?'home':'celebrate');message(final?'Home at last. Well done!':'A little closer to home!',true);
   const confetti=courtyard.querySelector('.celebration');confetti.replaceChildren();
   for(let i=0;i<(final?38:12);i++){const bit=document.createElement('i');bit.style.cssText=`--x:${(i*37)%100}%;--c:${['#d29b42','#3e8585','#c87561','#fff0ca'][i%4]};--delay:${(i%6)*.06}s`;confetti.append(bit);}
   if(final){traveller.style.left='83%';courtyard.querySelector('.home-door').classList.add('open');}
   celebrationTimer=setTimeout(()=>{confetti.replaceChildren();if(!final){state('rest');message('');}},final?3000:1800);
 }
 function reset(){cancelReaction();clearTimeout(celebrationTimer);active=running=false;progress=right=attempts=0;nudged=false;traveller.dataset.paused='false';traveller.style.left='4%';courtyard.querySelector('.home-door').classList.remove('open');courtyard.querySelector('.celebration').replaceChildren();document.getElementById('journeyCount').textContent='';state('rest');message('');activity();}
 function answer(ok){if(!active)return;cancelReaction();clearTimeout(celebrationTimer);courtyard.querySelector('.celebration').replaceChildren();activity();attempts++;
   if(ok){right++;position(progress+Math.max(.004,(1-progress)*.025));state('walk');message('');if(right%5===0){reaction=setTimeout(()=>celebrate(),650);}else reaction=setTimeout(()=>state('rest'),1200);}
   else{state('sit');message('Take your time.');}
   document.getElementById('journeyCount').textContent=`· ${right} ${right===1?'step':'steps'}`;
 }
 function idle(){if(!active||document.hidden||!document.getElementById('overlay').classList.contains('hide'))return;
   const elapsed=Date.now()-lastActive;
   if(elapsed>=90000&&!nudged){cancelReaction();nudged=true;state('knock');message('Knock, knock. Ready when you are.',true);reaction=setTimeout(()=>{state('sit');message('I’ll wait here.');},4500);}
 }
 ['pointerdown','keydown'].forEach(event=>document.addEventListener(event,activity,{passive:true}));
 document.addEventListener('visibilitychange',activity);setInterval(idle,1000);
 document.getElementById('pauseCat').onclick=()=>{if(!running)return;active=!active;traveller.dataset.paused=String(!active);cancelReaction();clearTimeout(celebrationTimer);courtyard.querySelector('.celebration').replaceChildren();state('rest');message('');const button=document.getElementById('pauseCat');button.setAttribute('aria-pressed',String(!active));button.textContent=active?'Pause cat':'Wake cat';activity();};
 return {reset,start(){reset();active=running=true;document.getElementById('pauseCat').textContent='Pause cat';document.getElementById('pauseCat').setAttribute('aria-pressed','false');},answer,
 block(index,total){if(active&&total)position(index/total*.9);},finish(){running=false;const show=active;active=false;if(show)celebrate(true);}};
})();

/* Paginate overflowing question content; keep the original nodes and event handlers.
   No scrolling, clipped solutions or shrinking an entire question to illegible text. */
const PracticeLayout=(()=>{
 const work=document.getElementById('work');let frame=0,pageIndex=0;
 const observer=new MutationObserver(schedule);
 function watch(){observer.observe(work,{childList:true,subtree:true,characterData:true});}
 function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;layout();});}
 function stepDeck(box){
   if(box.dataset.deck)return;
   const cells=Array.from(box.children);if(cells.length<4)return;
   box.dataset.deck='true';cells.forEach(n=>n.dataset.deckCell='true');const pairs=[];for(let i=0;i<cells.length;i+=2)pairs.push([cells[i],cells[i+1]]);
   let index=pairs.length-1;
   const controls=document.createElement('div');controls.className='step-controls';
   const prev=document.createElement('button'),label=document.createElement('span'),next=document.createElement('button');prev.type=next.type='button';prev.className=next.className='btn small';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous worked step');next.setAttribute('aria-label','Next worked step');controls.append(prev,label,next);box.append(controls);
   function paint(){pairs.forEach((pair,i)=>pair.forEach(node=>{if(node)node.style.display=i===index?'':'none';}));label.textContent=index===0?'Starting equation':`Step ${index} of ${pairs.length-1}`;prev.disabled=index===0;next.disabled=index===pairs.length-1;schedule();}
   prev.onclick=()=>{index--;paint();};next.onclick=()=>{index++;paint();};paint();
 }
 function layout(){
   observer.disconnect();
   const focused=document.activeElement;
   // New dynamically appended move rows must also join the worked-step deck.
   work.querySelectorAll('.steps').forEach(box=>{if(box.dataset.deck){const extras=Array.from(box.children).filter(n=>n.className==='ln'&&!n.dataset.deckCell);if(extras.length){box.querySelector('.step-controls')?.remove();box.querySelectorAll(':scope > span').forEach(n=>n.style.display='');delete box.dataset.deck;}}stepDeck(box);});
   let body=work.querySelector('.work-body');
   if(!body){pageIndex=0;body=document.createElement('div');body.className='work-body';body.append(...Array.from(work.childNodes));work.append(body);}
   // Flatten old page wrappers only; descendants retain their identities.
   body.querySelectorAll(':scope > .question-page').forEach(page=>page.replaceWith(...page.childNodes));
   work.querySelector('.page-nav')?.remove();
   const nodes=Array.from(body.children);if(!nodes.length){watch();return;}
   // Reserve pager space before measuring, so pagination cannot create its own overflow.
   const nav=document.createElement('div');nav.className='page-nav';nav.innerHTML='<button type="button" class="btn small" aria-label="Previous question panel">‹ Back</button><span></span><button type="button" class="btn small" aria-label="Next question panel">More ›</button>';work.append(nav);
   const available=body.clientHeight;
   let pages=[],page;
   function addPage(){page=document.createElement('div');page.className='question-page';body.append(page);pages.push(page);}
   addPage();
   nodes.forEach(node=>{page.append(node);if(page.scrollHeight>available+1&&page.children.length>1){node.remove();addPage();page.append(node);}});
   if(pages.length===1)nav.hidden=true;
   pageIndex=Math.min(pageIndex,pages.length-1);
   function paint(){pages.forEach((p,i)=>{p.hidden=i!==pageIndex;});nav.querySelector('span').textContent=`${pageIndex+1} / ${pages.length} · same question`;const buttons=nav.querySelectorAll('button');buttons[0].disabled=pageIndex===0;buttons[1].disabled=pageIndex===pages.length-1;}
   nav.querySelectorAll('button')[0].onclick=()=>{pageIndex--;paint();};nav.querySelectorAll('button')[1].onclick=()=>{pageIndex++;paint();};paint();if(focused!==document.body&&focused?.isConnected&&focused.getClientRects().length)focused.focus({preventScroll:true});watch();
 }
 watch();new ResizeObserver(schedule).observe(work);window.addEventListener('resize',schedule);schedule();return {schedule};
})();
