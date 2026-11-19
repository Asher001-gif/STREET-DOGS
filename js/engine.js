/* Renderer, scene, camera, lights, mesh helpers */
const R=new THREE.WebGLRenderer({antialias:false,powerPreference:'low-power'});
R.setPixelRatio(1);R.setSize(innerWidth,innerHeight);document.body.appendChild(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0x060914);S.fog=new THREE.Fog(0x060914,6,38);
const cam=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,60);
S.add(new THREE.HemisphereLight(0x6677bb,0x151525,.9));
const torch=new THREE.PointLight(0xffe0a0,.5,14);S.add(torch);
const mat=(c,e)=>new THREE.MeshLambertMaterial({color:c,flatShading:true,emissive:e||0});
const box=(w,h,d,c,x,y,z,e)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,e));m.position.set(x,y,z);S.add(m);return m};
