/* Game loop and rendering/HUD */
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(locked&&!P.won)update(dt);
 render(dt);}
function render(dt){
 for(const d of dogs){d.g.position.set(d.x,0,d.z);
  const c=d.st===0?0x44ff88:d.st===1?0xffd23a:0xff3b3b;d.ind.material.color.setHex(c);
  d.g.scale.y=d.st===0?.78:1;d.head.rotation.z=d.st===1?Math.sin(performance.now()/60)*.12:0;}
 for(const t of toys)t.m.visible=!t.dead;
 if(held){held.m.position.set(P.x-Math.sin(P.yaw)*.6+Math.cos(P.yaw)*.3,P.y+1.2,P.z-Math.cos(P.yaw)*.6-Math.sin(P.yaw)*-.3);}
 const bob=(P.mv&&P.vy===0&&!P.won)?Math.sin(performance.now()/110)*.035*(P.spr?1.6:1):0;
 cam.fov+=((P.spr&&P.mv?82:75)-cam.fov)*.12;cam.updateProjectionMatrix();
 cam.position.set(P.x,P.y+1.6+bob,P.z);sky.position.copy(cam.position);cam.rotation.set(P.pit,P.yaw,0,'YXZ');torch.position.set(P.x,P.y+2,P.z);
 sh.position.set(P.x,groundAt(P.x,P.y+.3)+.03,P.z);
 const toyNear=!held&&!drag&&toys.some(t=>!t.carried&&!t.dead&&Math.hypot(P.x-t.m.position.x,P.z-t.m.position.z)<2.2);
 const pr=held?'Release to drop':drag?'Release to let go':toyNear?HK+' to pick up':(!held&&nearHeavy())?HK+' to drag':'';
 $('prompt').textContent=pr;$('prompt').style.opacity=pr?1:0;
 $('nf').style.width=(P.noise*100)+'%';$('sf').style.width=(P.stam*100)+'%';
 const n=[0,0,0];for(const d of dogs)n[d.st]++;
 $('dogs').innerHTML=LEVELS[LV].name+' / '+LEVELS.length+'<br>Dogs<br>🟢 asleep: '+n[0]+'<br>🟡 ear twitch: '+n[1]+'<br>🔴 awake: '+n[2]+'<br>Bites: '+P.bites+'/2<br>Distance left: '+Math.max(0,Math.round(LEN+P.z))+' m';
 const fl=$('flash');fl.style.opacity=Math.max(0,fl.style.opacity-dt*1.5);
 R.render(S,cam);}
loadLevel(Math.min(LEVELS.length,Math.max(1,parseInt(location.hash.slice(1))||1))-1); // #2 in the URL starts at level 2
requestAnimationFrame(loop);
