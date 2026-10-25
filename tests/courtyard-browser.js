/* Run in a disposable local browser session, after loading the lesson.
   Evaluates actual generated questions, correction views and touch controls. */
async function checkCourtyardLayout(){
 const failures=[];let checked=0;
 const settle=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 const inspect=async label=>{
   await settle();
   const pages=[...work.querySelectorAll('.question-page')];
   for(let i=0;i<pages.length;i++){
     pages.forEach((p,j)=>p.hidden=i!==j);
     const area=work.querySelector('.work-body').getBoundingClientRect();
     const bad=[...pages[i].querySelectorAll('button,.q,.sub,.ln,.mv,.ansbox,.hints,.ex')].filter(el=>{
       if(!el.getClientRects().length)return false;
       const r=el.getBoundingClientRect();return r.top<area.top-2||r.bottom>area.bottom+2||r.left<area.left-2||r.right>area.right+2;
     });
     if(bad.length)failures.push({label,page:i+1,area:{w:area.width,h:area.height},bad:bad.map(el=>({text:el.textContent.slice(0,80),height:el.getBoundingClientRect().height}))});
   }
   pages.forEach((p,j)=>p.hidden=j!==0);
   const footer=document.querySelector('.bottom').getBoundingClientRect();
   if(footer.bottom>innerHeight+1||document.documentElement.scrollHeight>innerHeight+1||document.documentElement.scrollWidth>innerWidth+1)failures.push({label,error:'Document or footer overflow'});
   checked++;
 };
 for(let round=0;round<2;round++)for(const key of SKILL_ORDER)for(let rung=1;rung<=5;rung++){
   const q=genSkill(key,rung);cur=q;const type=CARD[key].type;hideNext();peekBtn.classList.add('hide');fb.textContent='';
   if(type==='write')presentWrite(q,rung,()=>{},()=>{});
   else if(type==='solve')presentSolve(q,rung,()=>{},()=>{},()=>{});
   else presentProb(q,rung,()=>{},()=>{},()=>{});
   await inspect(`${key}/${rung}`);
   if(!peekBtn.classList.contains('hide')){peekBtn.click();await inspect(`${key}/${rung}/help`);}
   if(type!=='write'){
     const err=[...(q.errs||[]),...(q.dis||[])].sort((a,b)=>(b.msg||'').length-(a.msg||'').length)[0];
     afterWrong(q,{ok:false,err},work.querySelector('#sbox'));showNext('Next',()=>{});
     await inspect(`${key}/${rung}/correction`);
   }
 }
 for(const key of ITEM_ORDER){const q=ITEMGEN[key]();h(`<div class="q${q.small?' small':''}">${fx(q.q)}</div><div class="sub">${fx(q.sub||'')}</div><div class="choices">${q.choices.map(x=>`<button class="ch txt">${fx(x)}</button>`).join('')}</div><div class="sub">${fx(q.show||'')}</div>`);await inspect(key);}
 return {viewport:[innerWidth,innerHeight],checked,failures};
}

async function checkBilliBehaviour(){
 const checks=[];const cat=courtyard.querySelector('.cat-traveller');
 const assert=(label,ok)=>{if(!ok)throw new Error(label);checks.push(label);};
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 assert('Generated raster renderer replaces SVG',!!cat.querySelector('.cat-sprite')&&!cat.querySelector('svg'));
 assert('No visible title, step count or speech bubbles',!courtyard.querySelector('.journey-title,#journeyCount,.cat-bubble'));
 const sprite=cat.querySelector('.cat-sprite');
 const atlas=new Image();atlas.src=new URL('assets/cats/cat-sprites.webp',location.href).href;await atlas.decode();
 assert('Sprite image loads with the expected 6 by 4 grid',atlas.naturalWidth===1536&&atlas.naturalHeight===1024);
 Billi.start();Billi.answer(true);assert('Correct answer walks',cat.dataset.state==='walk');
 const first=getComputedStyle(sprite).backgroundPositionX;await wait(180);
 assert('Walking advances actual image frames',first!==getComputedStyle(sprite).backgroundPositionX&&getComputedStyle(sprite).backgroundPositionY==='0%');
 const earned=cat.style.left;Billi.answer(false);assert('Mistake sits without losing distance',cat.dataset.state==='sit'&&cat.style.left===earned);
 Billi.answer(true);Billi.answer(true);Billi.answer(true);Billi.answer(true);await wait(750);
 assert('Five successes celebrate',cat.dataset.state==='celebrate'&&courtyard.querySelectorAll('.celebration i').length>0);
 Billi.answer(false);await wait(1200);assert('Mistake cancels prior celebration',cat.dataset.state==='sit');
 const clock=Date.now;try{const now=clock();Date.now=()=>now+91000;await wait(1100);assert('Inactivity triggers knock',cat.dataset.state==='knock');}
 finally{Date.now=clock;}
 document.dispatchEvent(new Event('pointerdown'));assert('Interaction dismisses knock',cat.dataset.state==='rest');
 document.getElementById('pauseCat').click();Billi.answer(true);assert('Pause stops reactions',cat.dataset.state==='rest');
 assert('Pause freezes sprite playback',getComputedStyle(sprite).animationPlayState==='paused');
 document.getElementById('pauseCat').click();Billi.finish();assert('Homecoming opens door and celebrates',cat.dataset.state==='home'&&courtyard.querySelector('.home-door').classList.contains('open'));
 Billi.reset();assert('New session clears celebration',courtyard.querySelectorAll('.celebration i').length===0&&!courtyard.querySelector('.home-door').classList.contains('open'));
 return checks;
}

async function checkSpriteViewport(){
 const manifest=await (await fetch('assets/cats/manifest.json')).json();
 const traveller=courtyard.querySelector('.cat-traveller');
 const previous={state:traveller.dataset.state,left:traveller.style.left,transition:traveller.style.transition};
 const failures=[];let checked=0;
 traveller.style.transition='none';
 for(const [state,frames] of Object.entries(manifest.frames))for(const left of ['4%','calc(83% - 64px)']){
   traveller.dataset.state=state;traveller.style.left=left;
   const sprite=traveller.querySelector('.cat-sprite').getBoundingClientRect();
   const scene=courtyard.getBoundingClientRect();
   frames.bounds.forEach((box,index)=>{
     const x1=sprite.left+box[0]/manifest.cellSize*sprite.width;
     const x2=sprite.left+box[2]/manifest.cellSize*sprite.width;
     const y1=sprite.top+box[1]/manifest.cellSize*sprite.height;
     const y2=sprite.top+box[3]/manifest.cellSize*sprite.height;
     if(x1<scene.left||x2>scene.right||y1<scene.top||y2>scene.bottom)failures.push({state,left,frame:index,box:[x1,y1,x2,y2],scene:[scene.left,scene.top,scene.right,scene.bottom]});
     checked++;
   });
 }
 traveller.dataset.state=previous.state;traveller.style.left=previous.left;traveller.style.transition=previous.transition;
 return {viewport:[innerWidth,innerHeight],checked,failures};
}
