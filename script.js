const pages=[...document.querySelectorAll('.page')];
const balloonColors=['#f5a1b5','#c9b5e9','#f5d77f','#9ed5e8','#f6b99e','#a9d9c5'];
document.querySelectorAll('.balloon-field').forEach(field=>{
  for(let i=0;i<20;i++){const b=document.createElement('i');b.className='balloon';b.style.setProperty('--x',(2+Math.random()*94)+'%');b.style.setProperty('--c',balloonColors[i%balloonColors.length]);b.style.setProperty('--t',(11+Math.random()*9)+'s');b.style.setProperty('--delay',(-Math.random()*18)+'s');field.appendChild(b);}
});

// A gentle original music-box melody is generated locally with Web Audio; no audio download required.
let audioCtx=null, musicTimer=null, musicOn=false, musicMode='soft', noteIndex=0;
const softNotes=[523.25,659.25,783.99,659.25,587.33,698.46,783.99,698.46,523.25,587.33,659.25,587.33];
const birthdayNotes=[523.25,659.25,783.99,1046.5,783.99,659.25,587.33,698.46,880,1046.5,880,698.46];
function playNote(freq,duration=.34){
  if(!audioCtx||!musicOn)return;
  const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
  osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.07,audioCtx.currentTime+.035);
  gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
  osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration+.03);
}
function startMusic(mode){
  musicMode=mode;
  if(!musicOn)return;
  if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended')audioCtx.resume();
  clearInterval(musicTimer);noteIndex=0;
  const notes=mode==='birthday'?birthdayNotes:softNotes;
  musicTimer=setInterval(()=>{playNote(notes[noteIndex%notes.length],mode==='birthday'?.42:.32);noteIndex++;},mode==='birthday'?390:470);
}
function setMusic(on){
  musicOn=on;const button=document.getElementById('musicToggle');
  button.textContent=on?'♫ Music: on':'♫ Music: off';
  button.setAttribute('aria-pressed',String(on));
  if(on)startMusic(location.hash==='#birthday'||location.hash==='#cake'||location.hash==='#final'?'birthday':'soft');
  else clearInterval(musicTimer);
}
document.getElementById('musicToggle').addEventListener('click',()=>setMusic(!musicOn));
function showPage(id){
  pages.forEach(p=>p.classList.toggle('active',p.id===id));
  if(id==='question'){const input=document.getElementById('password');input.value='';setTimeout(()=>input.focus(),100);}
  if(['birthday','cake','final'].includes(id)){if(musicOn)startMusic('birthday');}
  else if(musicOn)startMusic('soft');
  if(id==='cake')resetCake();
}
function route(){const id=location.hash.slice(1)||'welcome';showPage(['welcome','question','wrong','birthday','cake','final'].includes(id)?id:'welcome');}
window.addEventListener('hashchange',route);route();
document.getElementById('passwordForm').addEventListener('submit',e=>{e.preventDefault();location.hash=document.getElementById('password').value.trim().toLowerCase()==='dheros'?'birthday':'wrong';});

// Cake interaction: tap each candle flame, then the cake itself to cut it.
let extinguished=0,cutting=false;
const candles=[...document.querySelectorAll('.candle')],knife=document.getElementById('knife');
function resetCake(){extinguished=0;cutting=false;candles.forEach(c=>c.classList.remove('out'));knife.classList.remove('show');document.getElementById('instruction').textContent='First, blow out the candles by touching each flame! 🕯️';document.getElementById('cutHint').textContent='Tap the three flames to make a wish.';document.getElementById('cakeToCut').classList.remove('cut');}
candles.forEach(c=>c.addEventListener('click',e=>{e.stopPropagation();if(c.classList.contains('out')||cutting)return;c.classList.add('out');extinguished++;if(extinguished===3){document.getElementById('instruction').textContent='Wish made! Now tap the cake to cut it. 💗';document.getElementById('cutHint').textContent='The birthday knife is ready — click the cake!';knife.classList.add('show');}}));
function cutCake(){if(extinguished!==3||cutting)return;cutting=true;document.getElementById('cutHint').textContent='Making the first slice… 🍰';document.getElementById('cakeToCut').classList.add('cut');setTimeout(()=>location.hash='final',1050);}
document.getElementById('cakeToCut').addEventListener('click',cutCake);
document.getElementById('cakeToCut').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cutCake();}});
