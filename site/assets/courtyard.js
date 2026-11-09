/* Generated raster sprite animation; lesson data and mastery rules stay in the lesson. */
const courtyard = document.getElementById('courtyard');
courtyard.innerHTML = `
 <div class="journey-track" aria-hidden="true">${Array.from({length:10},()=>'<i></i>').join('')}</div>
 <div class="home-door" aria-hidden="true"></div>
 <div class="cat-traveller" data-state="rest" aria-hidden="true">
 <span class="cat cat-sprite"></span></div>
 <div class="celebration" aria-hidden="true"></div>
 <span class="journey-live" role="status" aria-live="polite"></span>`;

const Billi = (()=>{
 const traveller=courtyard.querySelector('.cat-traveller');
 let active=false,running=false,progress=0,right=0,attempts=0,lastActive=Date.now(),nudged=false,reaction=null,walkTimer=null,celebrationTimer=null;
 const live=courtyard.querySelector('.journey-live');
 function state(value){traveller.dataset.state=value;}
 function message(text,announce=false){if(announce)live.textContent=text;}
 function position(p){
   progress=Math.max(progress,Math.min(.96,p));
   const target=courtyard.clientWidth*(.04+progress*.78)-progress*64;
   const distance=Math.abs(target-traveller.offsetLeft);
   // One stride covers roughly 28% of the sprite box. Match translation to the
   // fixed twelve-frame gait instead of playing fast steps over a slow glide.
   const duration=distance<.5?0:Math.max(240,Math.min(2500,distance/(traveller.offsetWidth*.28)*960));
   clearTimeout(walkTimer);traveller.style.setProperty('--travel-duration',`${duration}ms`);
   traveller.style.left=`calc(${4+progress*78}% - ${progress*64}px)`;
   if(active&&duration){state('walk');walkTimer=setTimeout(()=>{if(traveller.dataset.state==='walk')state('rest');},duration);}
   courtyard.querySelectorAll('.journey-track i').forEach((dot,i)=>dot.classList.toggle('reached',i<Math.floor(progress*10)));
   return duration;
 }
 function activity(){lastActive=Date.now();if(nudged){cancelReaction();nudged=false;message('');state('rest');}}
 function cancelReaction(){clearTimeout(reaction);reaction=null;clearTimeout(walkTimer);if(traveller.dataset.state==='walk'){const left=traveller.offsetLeft;traveller.style.setProperty('--travel-duration','0ms');traveller.style.left=`${left}px`;}}
 function celebrate(final=false){cancelReaction();clearTimeout(celebrationTimer);state(final?'home':'celebrate');message(final?'Home at last. Well done!':'A little closer to home!',true);
   const confetti=courtyard.querySelector('.celebration');confetti.replaceChildren();
   for(let i=0;i<(final?38:12);i++){const bit=document.createElement('i');bit.style.cssText=`--x:${(i*37)%100}%;--c:${['#d29b42','#3e8585','#c87561','#fff0ca'][i%4]};--delay:${(i%6)*.06}s`;confetti.append(bit);}
   if(final){traveller.style.left='calc(83% - 64px)';courtyard.querySelector('.home-door').classList.add('open');}
   celebrationTimer=setTimeout(()=>{confetti.replaceChildren();if(!final){state('rest');message('');}},final?3000:1800);
 }
 function reset(){cancelReaction();clearTimeout(celebrationTimer);active=running=false;progress=right=attempts=0;nudged=false;traveller.dataset.paused='false';traveller.style.left='4%';courtyard.querySelector('.home-door').classList.remove('open');courtyard.querySelector('.celebration').replaceChildren();state('rest');message('');activity();}
 function answer(ok){if(!active)return;cancelReaction();clearTimeout(celebrationTimer);courtyard.querySelector('.celebration').replaceChildren();activity();attempts++;
   if(ok){right++;const duration=position(progress+Math.max(.004,(1-progress)*.025));message('');if(right%5===0)reaction=setTimeout(()=>celebrate(),Math.max(650,duration));}
   else{state('sit');message('Take your time.');}

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
