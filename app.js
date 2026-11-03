'use strict';
(() => {
const $=id=>document.getElementById(id), all=s=>[...document.querySelectorAll(s)];
const defaults={lesson:false,qc:0,qw:0,qu:0,fc:0,fw:0,fu:0};
let stats=loadStats(), system={bat:false,l:false,r:false,ext:false,ties:'norm',sense:false}, qi=0,si=0,qLocked=false,fLocked=false,deferredPrompt=null;
function loadStats(){try{return {...defaults,...JSON.parse(localStorage.getItem('ka350stats')||'{}')}}catch{return {...defaults}}}
function save(){try{localStorage.setItem('ka350stats',JSON.stringify(stats))}catch{} renderStats();renderProgress()}
function setLive(id,on){$(id).classList.toggle('live',!!on)}
function renderSystem(){
 const source=system.l||system.r||system.ext;
 const tieClosed=!system.sense&&system.ties==='norm'&&source;
 const batteryTie=system.bat&&!system.sense;
 const center=source||batteryTie, left=system.l||tieClosed, right=system.r||tieClosed, triple=center||left||right;
 setLive('lgen',system.l);setLive('rgen',system.r);setLive('ext',system.ext);setLive('battery',system.bat);setLive('lbus',left);setLive('centerbus',center);setLive('rbus',right);setLive('triple',triple);
 $('lTie').classList.toggle('closed',tieClosed);$('rTie').classList.toggle('closed',tieClosed);$('batTie').classList.toggle('closed',batteryTie);
 $('lTie').textContent='L GEN TIE '+(tieClosed?'CLOSED':'OPEN');$('rTie').textContent='R GEN TIE '+(tieClosed?'CLOSED':'OPEN');$('batTie').textContent='BAT TIE '+(batteryTie?'CLOSED':'OPEN');
 [['btnBat','BAT',system.bat],['btnL','L GEN',system.l],['btnR','R GEN',system.r],['btnExt','EXT PWR',system.ext]].forEach(([id,label,on])=>{$(id).textContent=label+' '+(on?'ON':'OFF');$(id).classList.toggle('on',on)});
 $('btnTies').textContent='GEN TIES '+system.ties.toUpperCase();$('btnSense').textContent=system.sense?'BUS SENSE RESET':'BUS SENSE TEST';
 $('volts').textContent=center?(source?'28.0':'24.5'):'0.0';const count=(system.l?1:0)+(system.r?1:0);$('lload').textContent=system.l?(count===2?42:76):0;$('rload').textContent=system.r?(count===2?42:76):0;
 const lamps=[];if(!system.l)lamps.push('L DC GENERATOR');if(!system.r)lamps.push('R DC GENERATOR');if(!tieClosed)lamps.push('L-R GEN TIE OPEN');if(!batteryTie)lamps.push('BATTERY TIE OPEN');if(system.ext)lamps.push('EXT PWR ACTIVE');
 $('cas').innerHTML=lamps.map((x,i)=>`<span class="lamp ${x.includes('ACTIVE')?'info':''}">${x}</span>`).join('');
 $('explain').textContent=system.sense?'BUS SENSE TEST aktiv: Generator Ties und Battery Tie sind geöffnet.':source?'Generator- oder externe Leistung ist verfügbar. In NORM sind die Generator Ties geschlossen.':system.bat?'Battery-only: Center Bus verfügbar; Generatorbusse bleiben in NORM isoliert.':'Cold & Dark: Keine Stromquelle online.';
}
function bindSystem(){
 $('btnBat').onclick=()=>{system.bat=!system.bat;renderSystem()};$('btnL').onclick=()=>{system.l=!system.l;renderSystem()};$('btnR').onclick=()=>{system.r=!system.r;renderSystem()};$('btnExt').onclick=()=>{system.ext=!system.ext;renderSystem()};$('btnTies').onclick=()=>{system.ties=system.ties==='norm'?'open':'norm';renderSystem()};$('btnSense').onclick=()=>{system.sense=!system.sense;renderSystem()};$('resetSystem').onclick=()=>{system={bat:false,l:false,r:false,ext:false,ties:'norm',sense:false};renderSystem()};
}
function bindTabs(){all('.tab').forEach(btn=>btn.onclick=()=>{all('.tab,.page').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$(btn.dataset.page).classList.add('active');if(btn.dataset.page==='progressPage')renderProgress()})}
function renderLessons(){$('lessonList').innerHTML=KA350_DATA.lessons.map(x=>`<section class="lesson"><h3>${x.title}</h3><p>${x.text}</p></section>`).join('');$('completeLesson').onclick=()=>{stats.lesson=true;save();showStatus('Lektion wurde gespeichert.')}}
function renderQuestion(){const q=KA350_DATA.questions[qi];qLocked=false;$('qText').textContent=q.q;$('qFeedback').textContent='Wähle eine Antwort.';$('qOptions').innerHTML=q.a.map((x,i)=>`<button class="option" data-answer="${i}">${x}</button>`).join('');all('#qOptions .option').forEach(b=>b.onclick=()=>answerQuiz(Number(b.dataset.answer)))}
function answerQuiz(choice){if(qLocked)return;qLocked=true;const q=KA350_DATA.questions[qi];if(choice===-1){stats.qu++;$('qFeedback').textContent='Als unsicher gespeichert. '+q.why}else{all('#qOptions .option').forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add('correct');else if(i===choice)b.classList.add('wrong')});if(choice===q.correct){stats.qc++;$('qFeedback').textContent='Richtig. '+q.why}else{stats.qw++;$('qFeedback').textContent='Nicht richtig. '+q.why}}save()}
function renderScenario(){const s=KA350_DATA.scenarios[si];fLocked=false;$('scenarioTitle').textContent=s.title;$('scenarioText').textContent=s.text;$('failureFeedback').textContent='Wähle die wahrscheinlichste Ursache.';$('failureOptions').innerHTML=s.a.map((x,i)=>`<button class="option" data-fanswer="${i}">${x}</button>`).join('');all('#failureOptions .option').forEach(b=>b.onclick=()=>answerFailure(Number(b.dataset.fanswer)))}
function answerFailure(choice){if(fLocked)return;fLocked=true;const s=KA350_DATA.scenarios[si];if(choice===-1){stats.fu++;$('failureFeedback').textContent='Als unsicher gespeichert. '+s.why}else{all('#failureOptions .option').forEach((b,i)=>{b.disabled=true;if(i===s.correct)b.classList.add('correct');else if(i===choice)b.classList.add('wrong')});if(choice===s.correct){stats.fc++;$('failureFeedback').textContent='Richtig. '+s.why}else{stats.fw++;$('failureFeedback').textContent='Nicht richtig. '+s.why}}save()}
function renderStats(){$('qCorrect').textContent=stats.qc;$('qWrong').textContent=stats.qw;$('qUnsure').textContent=stats.qu;$('fCorrect').textContent=stats.fc;$('fWrong').textContent=stats.fw;$('fUnsure').textContent=stats.fu}
function score(){const attempts=stats.qc+stats.qw+stats.qu+stats.fc+stats.fw+stats.fu, mastery=attempts?Math.round(100*(stats.qc+stats.fc)/attempts):0;return Math.min(100,Math.round((stats.lesson?25:0)+mastery*.75))}
function renderProgress(){const s=score(),attempts=stats.qc+stats.qw+stats.qu+stats.fc+stats.fw+stats.fu;$('overall').textContent=s+'%';$('progbar').style.width=s+'%';$('progressText').textContent=s+'% Electrical System Mastery';$('progressDetails').innerHTML=`<p>Bearbeitete Aufgaben: <b>${attempts}</b></p><p>Lektion abgeschlossen: <b>${stats.lesson?'Ja':'Nein'}</b></p>`}
function showStatus(text){$('statusBanner').textContent=text;$('statusBanner').classList.remove('hidden');setTimeout(()=>$('statusBanner').classList.add('hidden'),3500)}
function bindActions(){$('nextQuestion').onclick=()=>{qi=(qi+1)%KA350_DATA.questions.length;renderQuestion()};$('quizUnsure').onclick=()=>answerQuiz(-1);$('newScenario').onclick=()=>{si=(si+1)%KA350_DATA.scenarios.length;renderScenario()};$('failureUnsure').onclick=()=>answerFailure(-1);$('resetProgress').onclick=()=>{if(confirm('Fortschritt wirklich zurücksetzen?')){stats={...defaults};save()}}}
function setupPWA(){if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').then(()=>showStatus('Offline-Modus ist bereit.')).catch(e=>console.warn('Service Worker:',e)))}window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').classList.remove('hidden')});$('installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').classList.add('hidden')}}
function init(){bindTabs();bindSystem();bindActions();renderLessons();renderSystem();renderQuestion();renderScenario();renderStats();renderProgress();setupPWA()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
