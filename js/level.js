/* Level loading: clears per-level objects and builds the next one from LEVELS */
let LV=0,STATIC_N=-1;
function loadLevel(i){
 if(STATIC_N<0)STATIC_N=S.children.length;
 while(S.children.length>STATIC_N)S.remove(S.children[S.children.length-1]);
 plats.length=0;toys.length=0;dogs.length=0;
 LV=i;const L=LEVELS[i];LEN=L.len;gate.position.z=-LEN;
 for(const r of L.props){if(r[0]==='bed')bed(r[1],r[2],r[3]);else prop(...r);}
 for(const[x,z]of L.toys)addToy(x,z);
 for(const[x,z]of L.vases)addVase(x,z);
 for(const[x,z]of L.dogs)makeDog(x,z);
 reset();$('msg').textContent=L.hint;
 if(L.hint)setTimeout(()=>{if(!P.won)$('msg').textContent='';},7000);}
