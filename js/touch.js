/* Touch controls (phones/tablets). Only active when TOUCH is true (see config.js).
   Left half   : floating joystick (push past the ring to sprint)
   Right half  : drag to look; press and hold without moving to carry/drag (same as holding E)
   Jump button : bottom right
   Also: restart button (top right) and a Next level / Play again button when a level is cleared */
if(TOUCH){(function(){
 document.body.classList.add('touch');
 const mk=(tag,cls,parent,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;(parent||document.body).appendChild(e);return e;};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

 // ---- overlay wording
 const ovBox=$('ov').firstElementChild;
 ovBox.innerHTML='Cross the street to the green gate.<br>Left thumb: joystick (push past the ring to sprint)<br>Right thumb: drag to look, press and hold to carry an item<br>Toys squeak. Crates are safe spots. Hold the screen beside a bed to drag it slowly. Two bites and you restart.<br><br><b>Tap to play</b><br><small>Best in landscape</small>';
 $('ov').onclick=()=>{
  AC=AC||new(window.AudioContext||window.webkitAudioContext)();
  $('ov').style.display='none';locked=true;
  try{const el=document.documentElement,p=el.requestFullscreen&&el.requestFullscreen({navigationUI:'hide'});
   if(p&&p.then)p.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{});}catch(_){}}).catch(()=>{});}catch(_){}
 };

 // ---- layout
 const root=mk('div','','');root.id='tc';
 const zl=mk('div','tzone',root);zl.id='tl';
 const zr=mk('div','tzone',root);zr.id='tr';
 const base=mk('div','tbase',root);base.id='tbase';
 const knob=mk('div','tknob',base);
 const ring=mk('div','thold',root);
 const jump=mk('div','tbtn',root,'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14l6-6 6 6"/><path d="M6 20l6-6 6 6" opacity=".45"/></svg>');jump.id='tjump';
 const rst=mk('div','tbtn tsmall',root,'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/></svg>');rst.id='trst';
 const nxt=mk('div','tpill',root);nxt.id='tnext';

 // ---- joystick (floating: appears under the thumb, rests at bottom-left when idle)
 const R=46,DEAD=.14,SPRINT_ON=1.45,SPRINT_OFF=1.15;
 let mp=null,bx=0,by=0,spr=false;
 function placeBase(x,y){bx=x;by=y;base.style.left=x+'px';base.style.top=y+'px';}
 function restBase(){placeBase(clamp(innerWidth*.16,86,130),innerHeight-clamp(innerHeight*.26,90,130));}
 function stick(x,y){
  const dx=x-bx,dy=y-by,d=Math.hypot(dx,dy)||1,c=Math.min(d,R);
  knob.style.transform='translate('+(dx/d*c)+'px,'+(dy/d*c)+'px)';
  let v=clamp(c/R,0,1);v=v<DEAD?0:(v-DEAD)/(1-DEAD);
  TI.x=dx/d*v;TI.y=-dy/d*v;
  if(!spr&&d>R*SPRINT_ON)spr=true;else if(spr&&d<R*SPRINT_OFF)spr=false;
  TI.sprint=spr&&v>0;base.classList.toggle('sprint',spr);
 }
 function stickEnd(){mp=null;TI.x=TI.y=0;TI.sprint=false;spr=false;base.classList.remove('on','sprint');knob.style.transform='';restBase();}
 zl.addEventListener('pointerdown',e=>{if(mp!==null)return;e.preventDefault();mp=e.pointerId;zl.setPointerCapture(mp);
  placeBase(clamp(e.clientX,R+14,innerWidth*.5-R),clamp(e.clientY,R+14,innerHeight-R-14));base.classList.add('on');stick(e.clientX,e.clientY);});
 zl.addEventListener('pointermove',e=>{if(e.pointerId===mp){e.preventDefault();stick(e.clientX,e.clientY);}});
 for(const t of['pointerup','pointercancel','lostpointercapture'])zl.addEventListener(t,e=>{if(e.pointerId===mp)stickEnd();});

 // ---- look + press-and-hold (right half)
 const SENS=.0058,HOLD_MS=260,SLOP=14;
 let lp=null,lx=0,ly=0,sx=0,sy=0,tm=0,holding=false,canHold=false;
 function holdOn(){if(lp===null||!canHold)return;holding=true;TI.hold=true;ring.classList.add('on');try{navigator.vibrate&&navigator.vibrate(12);}catch(_){}}
 function holdOff(){clearTimeout(tm);holding=false;canHold=false;TI.hold=false;ring.classList.remove('on');}
 zr.addEventListener('pointerdown',e=>{if(lp!==null)return;e.preventDefault();lp=e.pointerId;zr.setPointerCapture(lp);
  lx=sx=e.clientX;ly=sy=e.clientY;canHold=true;ring.style.left=lx+'px';ring.style.top=ly+'px';clearTimeout(tm);tm=setTimeout(holdOn,HOLD_MS);});
 zr.addEventListener('pointermove',e=>{if(e.pointerId!==lp)return;e.preventDefault();
  P.yaw-=(e.clientX-lx)*SENS;P.pit=clamp(P.pit-(e.clientY-ly)*SENS,-1.3,1.3);lx=e.clientX;ly=e.clientY;
  if(canHold&&!holding&&Math.hypot(lx-sx,ly-sy)>SLOP){canHold=false;clearTimeout(tm);} // moved: it's a look drag, not a hold
  if(holding){ring.style.left=lx+'px';ring.style.top=ly+'px';}});
 for(const t of['pointerup','pointercancel','lostpointercapture'])zr.addEventListener(t,e=>{if(e.pointerId===lp){lp=null;holdOff();}});

 // ---- jump (held a minimum of 90 ms so a quick tap is never missed between frames)
 let jp=null,jt=0;
 jump.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();jp=e.pointerId;jump.setPointerCapture(jp);jump.classList.add('on');
  TI.jump=true;jt=performance.now();});
 const jumpEnd=e=>{if(e.pointerId!==jp)return;jp=null;jump.classList.remove('on');setTimeout(()=>{if(jp===null)TI.jump=false;},Math.max(0,90-(performance.now()-jt)));};
 for(const t of['pointerup','pointercancel','lostpointercapture'])jump.addEventListener(t,jumpEnd);

 // ---- restart / next level
 for(const b of[rst,nxt])b.addEventListener('pointerdown',e=>e.stopPropagation());
 rst.addEventListener('click',()=>{if(locked)reset();});
 nxt.addEventListener('click',()=>{if(!P.clear)return;if(LV<LEVELS.length-1)loadLevel(LV+1);else reset();});
 let shown=null;
 (function tick(){requestAnimationFrame(tick);
  const s=!!(P.clear&&locked);
  if(s!==shown){shown=s;nxt.classList.toggle('show',s);}
  if(s){const t=LV<LEVELS.length-1?'Next level  \u25B8':'Play again';if(nxt.textContent!==t)nxt.textContent=t;}})();

 // ---- housekeeping
 const drop=()=>{stickEnd();holdOff();lp=null;jp=null;TI.jump=false;};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)drop();});
 addEventListener('blur',drop);
 addEventListener('resize',()=>{if(mp===null)restBase();});
 addEventListener('contextmenu',e=>e.preventDefault());
 restBase();
})();}
