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
,
{name:'Level 3',len:64,hint:'Dogs sleep on both sides. Vases shatter if bumped or dropped: jump over them. Nets are safe spots.',
 dogs:[[-4.2,-12],[4.2,-15],[-4.5,-26],[4.5,-29],[0,-42],[-4.2,-50],[4.2,-53]],
 props:[['net',-3.2,-33,2.8,2.2],['net',3.3,-50,2.8,2.2],['couch',4.4,-6,1.1,H],['shelf',-5.4,-6,1,0],['fridge',5.3,-10,1,0],['fridge',-5.3,-22,1,0],['chair',5.2,-38,1,-.4,.55],['chair',-5.2,-60,1,.5,.55]],
 toys:[[0,-8],[-1,-18],[1,-33],[0,-47],[-1,-62]],
 vases:[[-2.6,-20],[-1.3,-20],[0,-20],[1.3,-20],[2.6,-20],[-1.95,-36],[-.65,-36],[.65,-36],[1.95,-36],[-2.6,-58],[-1.3,-58],[0,-58],[1.3,-58],[2.6,-58]]}
];
