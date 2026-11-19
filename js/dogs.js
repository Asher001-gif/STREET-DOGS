/* Dogs: creation, wake/chase/return AI, bites, noise reactions */
// dogs
const dogs=[];
function makeDog(x,z){
 const g=new THREE.Group();
 const head=model('dog',.5,0x2a1c1c);S.remove(head);g.add(head);
 const ind=new THREE.Mesh(new THREE.SphereGeometry(.12,6,4),new THREE.MeshBasicMaterial({color:0x44ff88}));ind.position.y=1.3;g.add(ind);
 g.position.set(x,0,z);g.rotation.y=Math.random()*6;S.add(g);
 dogs.push({g,head,ind,hx:x,hz:z,x,z,st:0,al:0,lose:0,ret:false,cd:0,base:4});}

function hitItem(t){if(t.kind==='vase'){t.dead=true;t.m.visible=false;snd(500,.5,'sawtooth',.2);snd(2200,.25,'square',.08);P.noise=1;
 for(const d of dogs)if(d.st===0&&Math.hypot(d.x-t.m.position.x,d.z-t.m.position.z)<12)d.al=1;}else squeak(t.m.position.x,t.m.position.z);}
function squeak(x,z){snd(1400,.15,'sine',.15);P.noise=1;
 for(const d of dogs)if(d.st===0&&Math.hypot(d.x-x,d.z-z)<10){d.al=1;}}

function updateDogs(dt,safe){
 bite_cd-=dt;
 for(const d of dogs){const dx=P.x-d.x,dz=P.z-d.z,dist=Math.hypot(dx,dz);
  if(d.st<2){const r=d.base*(.55+P.noise);
   if(dist<r&&!safe)d.al+=dt*1.3;else d.al=Math.max(0,d.al-dt*.6);
   const ns=d.al>=1?2:d.al>.5?1:0;if(ns===1&&d.st===0)snd(90,.5,'sawtooth',.08);
   if(ns===2&&d.st<2){snd(220,.35,'square',.1);d.lose=0;d.ret=false;}d.st=ns;}
  else{ // awake
   if(safe){d.lose+=dt;if(d.lose>4)d.ret=true;}else{d.lose=0;if(d.ret&&dist<6)d.ret=false;}
   let tx=P.x,tz=P.z,spd=6.5;if(d.ret){tx=d.hx;tz=d.hz;spd=3;}
   const ex=tx-d.x,ez=tz-d.z,ed=Math.hypot(ex,ez);
   if(d.ret&&ed<.3){d.st=0;d.al=0;d.ret=false;d.lose=0;}
   else if(ed>(d.ret?0:safe?2:.5)){d.x+=ex/ed*spd*dt;d.z+=ez/ed*spd*dt;d.g.rotation.y=Math.atan2(ex,ez);}
   d.cd-=dt;
   if(!d.ret&&!safe&&dist<1.2&&d.cd<=0&&bite_cd<=0){d.cd=1.5;bite_cd=1.2;P.bites++;snd(120,.2,'sawtooth',.2);$('flash').style.opacity=.55;
    if(P.bites>=2){$('msg').textContent='Caught! Restarting…';setTimeout(reset,1200);P.won=true;return true;}P.slow=4;}}}
 return false;
}
