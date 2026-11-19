/* Street, buildings, lamps, crates (safe spots), toys */
// world
box(14,.2,100,0x1c2030,0,-.1,-30);
box(5,.3,100,0x2b3042,-9.5,-.05,-30);box(5,.3,100,0x2b3042,9.5,-.05,-30);
for(let i=0;i<7;i++)for(const s of[-1,1]){const h=7+((i*7+(s>0?3:0))%5)*2;box(7,h,12,s<0?0x141a30:0x171428,s*13,h/2,-4-i*14);
 for(let k=0;k<3;k++)if((i+k+(s>0))%2)box(.1,.9,1,0xffd27a,s*9.45,2+k*2.2,-4-i*14+(k-1)*3,0xaa8830);}
box(.4,4,.4,0x33ee77,-6,2,-LEN,0x22aa55);box(.4,4,.4,0x33ee77,6,2,-LEN,0x22aa55);box(12.4,.4,.4,0x33ee77,0,4,-LEN,0x22aa55);
for(let z=-6,i=0;z>-66;z-=14,i++){const x=i%2?6.3:-6.3;box(.15,4.5,.15,0x444455,x,2.25,z);box(.5,.3,.5,0xffd27a,x,4.6,z,0xffc860);
 const p=new THREE.Mesh(new THREE.CircleGeometry(4.5,12),new THREE.MeshBasicMaterial({color:0xffc860,transparent:true,opacity:.13}));p.rotation.x=-Math.PI/2;p.position.set(x,.02,z);S.add(p);}
// props: PSX furniture. kind 'safe' = climbable safe spot, 'solid' = obstacle (jump onto low ones)
const plats=[];
function prop(name,x,z,sc,ry,top){const m=model(name,sc);const a=ASSETS[name].size;m.position.set(x,0,z);m.rotation.y=ry;
 const q=Math.abs(Math.sin(ry))>.5,w=(q?a[2]:a[0])*sc/2,d=(q?a[0]:a[2])*sc/2;
 plats.push({x0:x-w,x1:x+w,z0:z-d,z1:z+d,top:top||a[1]*sc});}
const H=Math.PI/2;
prop('couch',4,-18,1.1,H);prop('couch',-4.2,-36,1.1,H);prop('couch',3.5,-52,1.1,H);
prop('mattress',0,-22,1,0,.15);prop('mattress',-3,-8,1,H,.15);
prop('shelf',-5.4,-6,1,0);prop('fridge',5.2,-25,1,0);prop('fridge',-5,-44,1,0);
prop('chair',2,-12,1,.6,.55);prop('chair',-5,-30,1,-.5,.55);prop('chair',1,-56,1,2,.55);
// carryable items: toys squeak when stepped on, vases shatter when bumped or dropped
const toys=[];
for(const[x,z]of[[1,-8],[-4,-22],[2,-27],[-1,-40],[4,-43]]){const m=box(.4,.3,.4,0xff4fa0,x,.15,z,0x551133);toys.push({m,kind:'toy',y0:.15,hx:x,hz:z,carried:false,hot:false,dead:false});}
for(const[x,z]of[[-1.5,-33],[1.2,-46]]){const m=model('vase',1.8);m.position.set(x,0,z);toys.push({m,kind:'vase',y0:0,hx:x,hz:z,carried:false,hot:false,dead:false});}
