/* Street, buildings, lamps, crates (safe spots), toys */
// world
box(14,.2,100,0x1c2030,0,-.1,-30);
box(5,.3,100,0x2b3042,-9.5,-.05,-30);box(5,.3,100,0x2b3042,9.5,-.05,-30);
for(let i=0;i<7;i++)for(const s of[-1,1]){const h=7+((i*7+(s>0?3:0))%5)*2;box(7,h,12,s<0?0x141a30:0x171428,s*13,h/2,-4-i*14);
 for(let k=0;k<3;k++)if((i+k+(s>0))%2)box(.1,.9,1,0xffd27a,s*9.45,2+k*2.2,-4-i*14+(k-1)*3,0xaa8830);}
box(.4,4,.4,0x33ee77,-6,2,-LEN,0x22aa55);box(.4,4,.4,0x33ee77,6,2,-LEN,0x22aa55);box(12.4,.4,.4,0x33ee77,0,4,-LEN,0x22aa55);
for(let z=-6,i=0;z>-66;z-=14,i++){const x=i%2?6.3:-6.3;box(.15,4.5,.15,0x444455,x,2.25,z);box(.5,.3,.5,0xffd27a,x,4.6,z,0xffc860);
 const p=new THREE.Mesh(new THREE.CircleGeometry(4.5,12),new THREE.MeshBasicMaterial({color:0xffc860,transparent:true,opacity:.13}));p.rotation.x=-Math.PI/2;p.position.set(x,.02,z);S.add(p);}
// crates (safe spots)
const plats=[];
for(const[x,z]of[[4,-18],[-4.2,-36],[3.5,-52]]){box(2.2,.9,2.2,0x7a5532,x,.45,z);plats.push({x0:x-1.1,x1:x+1.1,z0:z-1.1,z1:z+1.1,top:.9});}
// toys
const toys=[];
for(const[x,z]of[[1,-8],[-4,-22],[2,-27],[-1,-40],[4,-43]]){const m=box(.4,.3,.4,0xff4fa0,x,.15,z,0x551133);toys.push({m,hx:x,hz:z,carried:false,hot:false});}
