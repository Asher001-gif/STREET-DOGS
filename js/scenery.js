/* Scenery: lit-window building textures, sky (stars + moon), lamp glow, soft shadow blobs */
function windowTexture(seed){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
 let r=seed*9301+49297;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
 x.fillStyle=['#161b30','#1a1a2c','#141c2a'][seed%3];x.fillRect(0,0,128,128);
 x.fillStyle='#0d1020';x.fillRect(0,0,128,3);x.fillRect(0,0,3,128);
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=rnd();
  x.fillStyle=v<.45?'#0a0d18':v<.8?'#ffd27a':v<.92?'#ffb35a':'#8fb4ff';
  x.fillRect(i*32+7,j*32+6,18,20);if(v>=.45){x.fillStyle='#0006';x.fillRect(i*32+15,j*32+6,2,20);}}
 const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;}
const WINTEX=[1,2,3].map(windowTexture);
function buildingMat(i,h,len){const t=WINTEX[i%3].clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(len/8,h/8);
 return new THREE.MeshLambertMaterial({map:t,emissiveMap:t,emissive:0xffffff,flatShading:true});}
// sky follows the camera so it never gets closer
const sky=new THREE.Group();S.add(sky);
(function(){const n=220,p=new Float32Array(n*3);let r=7;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
 for(let i=0;i<n;i++){const a=rnd()*6.283,e=.15+rnd()*1.2,d=120;p[i*3]=Math.cos(a)*Math.cos(e)*d;p[i*3+1]=Math.sin(e)*d;p[i*3+2]=Math.sin(a)*Math.cos(e)*d;}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
 sky.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xcfd8ff,size:2,sizeAttenuation:false,fog:false})));
 const m=new THREE.Mesh(new THREE.SphereGeometry(5,10,8),new THREE.MeshBasicMaterial({color:0xe8ecff,fog:false}));m.position.set(-45,70,-85);sky.add(m);
 const h=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color:0x8899cc,blending:THREE.AdditiveBlending,fog:false,depthWrite:false,transparent:true}));h.scale.set(40,40,1);h.position.copy(m.position);sky.add(h);})();
function glowTexture(){if(glowTexture.t)return glowTexture.t;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
 const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');
 x.fillStyle=g;x.fillRect(0,0,64,64);return glowTexture.t=new THREE.CanvasTexture(c);}
function lampGlow(x,y,z){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color:0xffc860,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.9}));
 s.scale.set(3.4,3.4,1);s.position.set(x,y,z);S.add(s);}
const BLOB={g:new THREE.CircleGeometry(.6,10),m:new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.4})};
function blobShadow(parent,r){const b=new THREE.Mesh(BLOB.g,BLOB.m);b.rotation.x=-Math.PI/2;b.position.y=.02;b.scale.set(r,r,1);parent.add(b);}
