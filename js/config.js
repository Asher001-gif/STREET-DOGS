/* Game constants */
let LEN=60;

/* Touch devices: coarse primary pointer (phones/tablets), or add ?touch=1 to the URL to force it on */
const TOUCH=matchMedia('(pointer:coarse)').matches||/[?&]touch=1/.test(location.search)||(navigator.maxTouchPoints>0&&!matchMedia('(hover:hover)').matches);
const HK=TOUCH?'Hold the screen':'Hold E (or 5)'; // wording for the carry/drag action
