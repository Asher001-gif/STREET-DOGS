/* Street, buildings, lamps, crates (safe spots), toys */
// world
// grey asphalt, brightened near each street lamp (vertex colours: no extra lights, cheap on old machines)
const LAMPS=[];for(let z=-6,i=0;z>-66;z-=14,i++)LAMPS.push([i%2?6.3:-6.3,z]);
(function(){const g=new THREE.PlaneGeometry(14,100,28,100);g.rotateX(-Math.PI/2);g.translate(0,0,-30);
 const pos=g.attributes.position,col=[];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let l=.4;
  for(const[lx,lz]of LAMPS){const d=Math.hypot(x-lx,z-lz);l+=Math.pow(Math.max(0,1-d/9),2)*1.1;}
  l=Math.min(l,1.5);col.push(.36*l,.37*l,.40*l);}
 g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 S.add(new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true})));})();
for(let z=-3;z>-100;z-=6)box(.18,.02,2,0x9a9da6,0,.01,z); // lane dashes
box(5,.3,100,0x4a4e57,-9.5,-.05,-30);box(5,.3,100,0x4a4e57,9.5,-.05,-30);
for(let i=0;i<7;i++)for(const s of[-1,1]){const h=7+((i*7+(s>0?3:0))%5)*2;box(7,h,12,s<0?0x141a30:0x171428,s*13,h/2,-4-i*14);
 for(let k=0;k<3;k++)if((i+k+(s>0))%2)box(.1,.9,1,0xffd27a,s*9.45,2+k*2.2,-4-i*14+(k-1)*3,0xaa8830);}
const gate=new THREE.Group();S.add(gate);
for(const m of[box(.4,4,.4,0x33ee77,-6,2,0,0x22aa55),box(.4,4,.4,0x33ee77,6,2,0,0x22aa55),box(12.4,.4,.4,0x33ee77,0,4,0,0x22aa55)]){S.remove(m);gate.add(m);}
for(let z=-6,i=0;z>-66;z-=14,i++){const x=i%2?6.3:-6.3;box(.15,4.5,.15,0x444455,x,2.25,z);box(.5,.3,.5,0xffd27a,x,4.6,z,0xffc860);
 const p=new THREE.Mesh(new THREE.CircleGeometry(4.5,12),new THREE.MeshBasicMaterial({color:0xffc860,transparent:true,opacity:.08}));p.rotation.x=-Math.PI/2;p.position.set(x,.02,z);S.add(p);}
// props are rebuilt per level (see level.js). plats = collision/climb rectangles with a top height.
const plats=[],toys=[];
function setRect(p,x,z){p.x=x;p.z=z;p.x0=x-p.w;p.x1=x+p.w;p.z0=z-p.d;p.z1=z+p.d;if(p.m)p.m.position.set(x,0,z);}
function prop(name,x,z,sc,ry,top){const m=model(name,sc);const a=ASSETS[name].size;m.rotation.y=ry;const q=Math.abs(Math.sin(ry))>.5;
 const p={w:(q?a[2]:a[0])*sc/2,d:(q?a[0]:a[2])*sc/2,top:top||a[1]*sc,m,heavy:false,hx:x,hz:z};setRect(p,x,z);plats.push(p);return p;}
function bed(x,z,ry){const g=new THREE.Group();const a=ASSETS.mattress.size;
 for(let k=0;k<6;k++){const mm=model('mattress',1);S.remove(mm);mm.position.y=k*a[1];g.add(mm);}
 g.rotation.y=ry;S.add(g);const q=Math.abs(Math.sin(ry))>.5;
 const p={w:(q?a[2]:a[0])/2,d:(q?a[0]:a[2])/2,top:a[1]*6,m:g,heavy:true,hx:x,hz:z};setRect(p,x,z);plats.push(p);return p;}
// carryable items: toys squeak when stepped on, vases shatter when bumped or dropped
function addToy(x,z){const m=box(.4,.3,.4,0xff4fa0,x,.15,z,0x551133);toys.push({m,kind:'toy',y0:.15,hx:x,hz:z,carried:false,hot:false,dead:false});}
function addVase(x,z){const m=model('vase',1.8);m.position.set(x,0,z);toys.push({m,kind:'vase',y0:0,hx:x,hz:z,carried:false,hot:false,dead:false});}
