/* Level data. props: [model,x,z,scale,rotY,topOverride]  |  ['bed',x,z,rotY] = heavy, draggable stack of mattresses */
const H=Math.PI/2;
const bedRow=(z,n=6,x0=-4.75,step=1.9)=>Array.from({length:n},(_,i)=>['bed',x0+i*step,z,0]);
const LEVELS=[
{name:'Level 1',len:60,hint:'',
 dogs:[[-2,-14],[3,-31],[-3,-47]],
 props:[['couch',4,-18,1.1,H],['couch',-4.2,-36,1.1,H],['couch',3.5,-52,1.1,H],['mattress',0,-22,1,0,.15],['mattress',-3,-8,1,H,.15],
  ['shelf',-5.4,-6,1,0],['fridge',5.2,-25,1,0],['fridge',-5,-44,1,0],['chair',2,-12,1,.6,.55],['chair',-5,-30,1,-.5,.55],['chair',1,-56,1,2,.55]],
 toys:[[1,-8],[-4,-22],[2,-27],[-1,-40],[4,-43]],vases:[[-1.5,-33],[1.2,-46]]},
{name:'Level 2',len:64,hint:'Beds block the street. Hold E (or 5) beside one to drag it slowly, or jump on top and walk across.',
 dogs:[[3,-16],[-3,-27],[1,-40],[-4,-50],[4,-56]],
 props:[...bedRow(-9),...bedRow(-34),...bedRow(-35.1),
  ['couch',-4.2,-20,1.1,H],['couch',4.2,-45,1.1,H],['couch',0,-60,1.1,H],['shelf',5.3,-27,1,0],['fridge',-5.2,-42,1,0],
  ['chair',2,-24,1,.4,.55],['chair',-5,-52,1,-.6,.55]],
 toys:[[0,-14],[-3,-22],[2,-30],[-2,-46],[1,-52]],vases:[[1,-24],[-3,-55]]}
];
