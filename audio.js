// audio.js — ระบบเสียงทั้งหมดของเว็บ: เพลงประจำเทป (สร้างสดด้วย Web Audio) + เอฟเฟกต์เสียง
// อยากใช้ไฟล์เสียงเอง: ใส่ `sound: sounds/ชื่อไฟล์.mp3` ในไฟล์ .md ของเทปนั้น หรือใส่ path ใน BGM ด้านล่าง (ใช้กับทุกเทปที่ไม่มี sound)
const BGM="";
const AC=window.AudioContext||window.webkitAudioContext,N=m=>440*2**((m-69)/12),PM=[1,1.122,1.26,.944,1.335,1.19];
// ธีมเพลง 6 แบบ วนตามสีปกเทป: ch=คอร์ด pl=เล่นแบบดีดสั้น dr=กลอง(0 ไม่มี) lead=ความถี่ทำนอง sc=สเกล am=[ความถี่,ความดัง,ความเร็ว,ความลึกคลื่น]เสียงบรรยากาศ
const TH=[
{n:"Sunny Morning",bpm:84,ch:[[48,55,59,64],[45,55,60,64],[41,57,60,64],[43,55,59,62]],pl:0,dr:1,lead:.5,sc:[0,2,4,7,9],am:[2500,.012,.2,0]},
{n:"Dreamy Dusk",bpm:66,ch:[[50,57,60,64],[43,53,59,65],[48,55,59,64],[45,55,60,64]],pl:0,dr:0,lead:.35,sc:[0,3,5,7,10],am:[900,.03,.15,.02]},
{n:"Mint Marimba",bpm:100,ch:[[52,59,62,66],[45,57,61,64],[50,57,62,66],[43,55,59,62]],pl:1,dr:1,lead:.25,sc:[0,2,4,7,9],am:[3000,.008,.2,0]},
{n:"Ocean Blue",bpm:58,ch:[[41,48,55,60],[43,50,57,62],[45,52,59,64],[40,47,54,59]],pl:0,dr:0,lead:.2,sc:[0,2,7,9],am:[600,.05,.12,.04]},
{n:"Pink Candy",bpm:112,ch:[[53,57,60,64],[50,55,59,62],[48,52,55,59],[55,59,62,65]],pl:1,dr:2,lead:.55,sc:[0,4,7,9],am:[4000,.006,.2,0]},
{n:"Peach Bossa",bpm:90,ch:[[50,57,60,65],[43,55,59,65],[48,55,60,64],[45,52,57,64]],pl:0,dr:3,lead:.3,sc:[0,2,4,7],am:[2000,.01,.2,0]}];
let ac,mg,sx,an,fd,NB,hf,hg,lf,ld,tm=0,nt=0,st=0,au,cur=0,lk=-1,cf="",ug=0;
addEventListener("pointerdown",()=>ug=1,{once:true});addEventListener("keydown",()=>ug=1,{once:true});
const TRK=()=>cf?"ไฟล์เสียงของเทปนี้":BGM?"เพลงรวม":TH[cur].n;
function ens(){if(!AC||ac)return;ac=new AC();mg=ac.createGain();mg.gain.value=0;an=ac.createAnalyser();an.fftSize=64;fd=new Uint8Array(32);const lp=ac.createBiquadFilter();lp.frequency.value=3600;mg.connect(lp);lp.connect(an);an.connect(ac.destination);sx=ac.createGain();sx.connect(ac.destination);
NB=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
const hs=ac.createBufferSource();hg=ac.createGain();hf=ac.createBiquadFilter();lf=ac.createOscillator();ld=ac.createGain();hs.buffer=NB;hs.loop=true;hs.connect(hf);hf.connect(hg);hg.connect(mg);lf.connect(ld);ld.connect(hg.gain);hs.start();lf.start();setVol()}
function setVol(){if(ac){mg.gain.setTargetAtTime(S.mus?S.vol*.8:0,ac.currentTime,.3);sx.gain.value=S.vol}if(au)au.volume=S.vol}
function note(t,f,d,v,ty="triangle"){const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=f;o.detune.value=Math.sin(t*.7)*9;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}
function nz(t,d,v,fq,dest){const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=NB;f.type="bandpass";f.frequency.value=fq;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(f);f.connect(g);g.connect(dest||mg);s.start(t,Math.random());s.stop(t+d)}
function kick(t){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);g.gain.setValueAtTime(.3,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);g.connect(mg);o.start(t);o.stop(t+.3)}
function play(t,s){const T=TH[cur],b=s%8,c=T.ch[Math.floor(s/8)%4],bl=60/T.bpm;
if(T.pl)note(t,N(c[b%4]+(b>3?12:0)),.45,.05);else if(b===0)c.forEach(m=>note(t,N(m),bl*5,.05));
if(b===0||(b===4&&T.dr))note(t,N(c[0]-12),.8,.12,"sine");
if(T.dr){if(b%2)nz(t,.04,.03,7000);if(b===0||b===5)kick(t);if(T.dr===1&&(b===2||b===6))nz(t,.14,.07,1800);if(T.dr===3&&(b===3||b===6))nz(t,.03,.08,3500);if(T.dr===2&&b%4===2)nz(t,.1,.06,5000)}
if(b%2&&Math.random()<T.lead)note(t,N(c[0]+12+T.sc[Math.floor(Math.random()*T.sc.length)]),T.pl?.8:1.4,.03,"sine");
if(cur===0&&Math.random()<.25)nz(t+Math.random()*.2,.01,.05,6000)}
function tick(){while(nt<ac.currentTime+.4){play(nt,st++);nt+=30/TH[cur].bpm}}
function startTrack(){if(!ug||!S.mus)return;const f=cf||BGM;clearInterval(tm);tm=0;
if(f){if(au&&!au.src.endsWith(f))au.src=f;au=au||Object.assign(new Audio(f),{loop:true});au.volume=S.vol;au.play().catch(()=>{});if(ac)setVol();return}
if(au)au.pause();ens();if(!ac)return;ac.resume();mg.gain.setTargetAtTime(0,ac.currentTime,.08);
setTimeout(()=>{if(!S.mus)return;const a=TH[cur].am;hf.frequency.value=a[0];hg.gain.value=a[1];lf.frequency.value=a[2];ld.gain.value=a[3];nt=ac.currentTime+.05;st=0;clearInterval(tm);tm=setInterval(tick,120);setVol()},260)}
const musicOn=startTrack;
function musicOff(){if(au)au.pause();clearInterval(tm);tm=0;setVol()}
function tapeSound(i,f){const k=i%6,x=f||"";if(k===lk&&x===cf)return;lk=k;cur=k;cf=x;startTrack()}
// เอฟเฟกต์เสียง: ทุกเสียงปรับระดับตามคีย์ของเทปที่เลือก (PM)
function tone(t,f1,f2,d,v,ty="square"){const o=ac.createOscillator(),g=ac.createGain(),p=PM[cur];o.type=ty;o.frequency.setValueAtTime(f1*p,t);o.frequency.exponentialRampToValueAtTime(f2*p,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d+.05);o.connect(g);g.connect(sx);o.start(t);o.stop(t+d+.08)}
const sn=(t,d,v,f)=>nz(t,d,v,f,sx);
const FX={
whoosh:t=>{sn(t,.3,.12,900);sn(t+.08,.2,.06,3000)},
tick:t=>tone(t,900,600,.04,.05),
click:t=>{tone(t,1200,800,.03,.06);tone(t+.03,600,900,.05,.04,"triangle")},
insert:t=>{tone(t,120,50,.18,.25,"sine");sn(t+.05,.45,.08,1200);tone(t+.2,300,330,.25,.04,"sawtooth")},
eject:t=>{sn(t,.4,.1,1800);tone(t+.3,90,60,.15,.2,"sine")},
pop:t=>[0,1,2].forEach(i=>tone(t+i*.05,600+i*300,900+i*400,.1,.045,"sine")),
chime:t=>[72,76,79,84].forEach((m,i)=>tone(t+i*.12,N(m),N(m)*1.002,.9,.06,"sine")),
rewind:t=>{sn(t,.7,.1,2500);tone(t,200,900,.7,.04,"sawtooth")},
open:t=>{tone(t,300,700,.2,.06,"triangle");sn(t,.2,.06,3000)},
close:t=>tone(t,700,250,.2,.06,"triangle"),
glitch:t=>{for(let i=0;i<5;i++)tone(t+i*.03,200+Math.random()*1800,100+Math.random()*900,.03,.03)}};
function sfx(a,d=.09){if(!S.sfx||!AC||!ug)return;ens();if(ac.state==="suspended")ac.resume();const t=ac.currentTime;if(typeof a==="string"){if(FX[a])FX[a](t)}else tone(t,a,a*1.5,d,.05)}
