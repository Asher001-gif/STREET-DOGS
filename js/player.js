/* Player state, input, movement, physics, toys, win check */
// shadow marker
const sh=new THREE.Mesh(new THREE.CircleGeometry(.35,10),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.5}));sh.rotation.x=-Math.PI/2;S.add(sh);
// carried toy
let held=null;
// player
const P={x:0,y:0,z:0,vy:0,yaw:0,pit:0,stam:1,tired:false,bites:0,slow:0,noise:0,won:false};
const keys={};let locked=false,AC=null,bite_cd=0;
const $=id=>document.getElementById(id);
function reset(){Object.assign(P,{x:0,y:0,z:0,vy:0,yaw:0,pit:0,stam:1,tired:false,bites:0,slow:0,noise:0,won:false});
 for(const d of dogs){Object.assign(d,{x:d.hx,z:d.hz,st:0,al:0,lose:0,ret:false,cd:0});}
 for(const t of toys){t.carried=false;t.hot=false;t.dead=false;t.m.position.set(t.hx,t.y0,t.hz);t.m.visible=true;}held=null;$('msg').textContent='';}
/* Alternate keys for remote/keyboard-limited users: 5 = hold (E), 0 = jump (Space), on top row and numpad */
const ALIAS={Digit5:'KeyE',Numpad5:'KeyE',Digit0:'Space',Numpad0:'Space'};
addEventListener('keydown',e=>{const c=ALIAS[e.code]||e.code;keys[c]=true;if(c==='Space'||c.startsWith('Arrow'))e.preventDefault();if(c==='KeyR')reset();});
addEventListener('keyup',e=>{keys[ALIAS[e.code]||e.code]=false;});
$('ov').onclick=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();R.domElement.requestPointerLock&&R.domElement.requestPointerLock();$('ov').style.display='none';locked=true;};
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement!==R.domElement){locked=false;$('ov').style.display='flex';}});
addEventListener('mousemove',e=>{if(document.pointerLockElement===R.domElement){P.yaw-=e.movementX*.0025;P.pit=Math.max(-1.3,Math.min(1.3,P.pit-e.movementY*.0025));}});
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();});
function groundAt(x,y){let g=0;for(const p of plats)if(x>p.x0-.3&&x<p.x1+.3&&P.z>p.z0-.3&&P.z<p.z1+.3&&y>=p.top-.3)g=Math.max(g,p.top);return g;}
function blocked(x,z){for(const p of plats)if(x>p.x0-.35&&x<p.x1+.35&&z>p.z0-.35&&z<p.z1+.35&&P.y<p.top-.3)return true;return false;}
let jumpLatch=false;
function update(dt){
 const f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
 const mv=f||s;let sprint=false;
 if(keys.ShiftLeft||keys.ShiftRight){if(mv&&P.stam>0&&!P.tired){sprint=true;P.stam-=dt*.35;if(P.stam<=0){P.stam=0;P.tired=true;}}}
 if(!sprint){P.stam=Math.min(1,P.stam+dt*.25);if(P.tired&&P.stam>.3)P.tired=false;}
 let sp=(sprint?7:4)*(P.slow>0?.5:1);P.slow=Math.max(0,P.slow-dt);
 if(mv){const l=Math.hypot(f,s),sn=Math.sin(P.yaw),cs=Math.cos(P.yaw);
  const dx=(-sn*f+cs*s)/l*sp*dt,dz=(-cs*f-sn*s)/l*sp*dt;
  let nx=Math.max(-5.8,Math.min(5.8,P.x+dx));if(!blocked(nx,P.z))P.x=nx;
  let nz=P.z+dz;if(nz>.5)nz=.5;if(!blocked(P.x,nz))P.z=nz;}
 // jump / gravity
 const g=groundAt(P.x,P.y);
 if(keys.Space&&P.y<=g+.01&&!jumpLatch){P.vy=6.5;jumpLatch=true;}if(!keys.Space)jumpLatch=false;
 P.vy-=18*dt;P.y+=P.vy*dt;const g2=groundAt(P.x,P.y+.3);if(P.y<g2){P.y=g2;P.vy=0;}
 const safe=P.y>=.7&&g2>=.8;
 // noise
 const tn=mv?(sprint?.7:.25):0;P.noise+=(tn-P.noise)*Math.min(1,dt*8);
 // toys + carry
 for(const t of toys){if(t.carried||t.dead)continue;const d=Math.hypot(P.x-t.m.position.x,P.z-t.m.position.z);
  if(d<.7&&P.y<.3){if(!t.hot){t.hot=true;hitItem(t);}}else if(d>1.3)t.hot=false;}
 if(keys.KeyE){if(!held){let b=null,bd=2.2;for(const t of toys){if(t.carried||t.dead)continue;const d=Math.hypot(P.x-t.m.position.x,P.z-t.m.position.z);if(d<bd){bd=d;b=t;}}
   if(b){held=b;b.carried=true;b.hot=false;}}}
 else if(held){held.carried=false;held.m.position.set(P.x-Math.sin(P.yaw)*1.4,.15,P.z-Math.cos(P.yaw)*1.4);held.hot=true;if(held.kind==='vase')hitItem(held);held=null;}
 // dogs
 if(updateDogs(dt,safe))return;
 if(P.z<-LEN){P.won=true;$('msg').textContent='You made it! Level 1 clear. Press R to play again.';}
 else if(P.slow>0&&!P.won)$('msg').textContent='';
}
