'use strict';
/* SAMX approved design: interaction layer. No automatic image generation and no
   visual layout replacement. Supports reduced motion and keyboard access. */
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=prefersReduced.matches, rafId=0, waveRAF=0;
if(!motionPaused) document.documentElement.classList.add('js-motion');

// Nav, scroll indicator, section tracking.
const header=$('.site-header'), progress=$('#readingProgress');
const links=$$('.desktop-links a');
const sectionTargets=['about','projects','skills','experience','contact'];
let scrollScheduled=false;
function onScroll(){scrollScheduled=false;
  const y=window.scrollY;
  header.classList.toggle('scrolled',y>180);
  const full=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  progress.style.width=`${Math.min(100,Math.max(0,y/full*100))}%`;
  let active='';
  for(const id of sectionTargets){const s=document.getElementById(id);if(s&&s.getBoundingClientRect().top<innerHeight*.4) active=id;}
  links.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+active);if(a.classList.contains('active')) a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

// Mobile menu. Focus remains navigable and scrolling unlocks on exit.
const toggle=$('#menuToggle'), mobile=$('#mobileMenu');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');mobile.hidden=true;document.body.classList.remove('menu-open');}
toggle.addEventListener('click',()=>{const show=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(show));toggle.setAttribute('aria-label',show?'Close menu':'Open menu');mobile.hidden=!show;document.body.classList.toggle('menu-open',show);});
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
window.addEventListener('resize',()=>{if(innerWidth>740)closeMenu()});

// IntersectionObserver reveal: the original layout remains in normal flow.
const observed=$$('.reveal');
const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('shown');io.unobserve(e.target)}},{threshold:.08,rootMargin:'0px 0px -4% 0px'});
observed.forEach(el=>io.observe(el));
const revealFallback=()=>observed.forEach(el=>el.classList.add('shown'));
if(motionPaused) revealFallback();

// Exact supplied portrait remains unchanged, with subtle *container only* movement.
const hero=$('.hero'), portraitWrap=$('.hero-portrait-wrap');
let portraitAimX=0,portraitAimY=0,portraitX=0,portraitY=0;
hero.addEventListener('pointermove',e=>{if(motionPaused||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();portraitAimX=((e.clientX-r.left)/r.width-.5)*-11;portraitAimY=((e.clientY-r.top)/r.height-.5)*-8;},{passive:true});
hero.addEventListener('pointerleave',()=>{portraitAimX=0;portraitAimY=0;});
function animatePortrait(){if(motionPaused){rafId=0;return;}portraitX+=(portraitAimX-portraitX)*.065;portraitY+=(portraitAimY-portraitY)*.065;portraitWrap.style.setProperty('--portrait-x',portraitX.toFixed(2)+'px');portraitWrap.style.setProperty('--portrait-y',portraitY.toFixed(2)+'px');rafId=requestAnimationFrame(animatePortrait);}
if(!motionPaused)rafId=requestAnimationFrame(animatePortrait);

// Project tile interaction. Keep 2x2 layout unchanged while enhancing hover.
$$('.project-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{if(motionPaused||e.pointerType==='touch')return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;card.style.setProperty('--mouse-x',(x*100).toFixed(1)+'%');card.style.setProperty('--mouse-y',(y*100).toFixed(1)+'%');card.style.transform=`perspective(900px) rotateX(${((.5-y)*2.6).toFixed(2)}deg) rotateY(${((x-.5)*3.0).toFixed(2)}deg) translateY(-3px)`;},{passive:true});
  card.addEventListener('pointerleave',()=>{card.style.transform='';});
});

// Case studies: source-grounded summaries, no made-up live-production metrics.
const projects={
  wazuh:{index:'01 / SECURITY OPERATIONS',title:'Wazuh SIEM & AI-Assisted Alert Triage',lead:'A reproducible multi-endpoint security monitoring and triage lab.',challenge:'Security alerts need context, evidence and a consistent escalation process. I explored how to turn raw security telemetry into clearer, documented decisions.',implementation:'Deployed Wazuh across Windows 11 and Ubuntu endpoints, integrated Sysmon, configured five MITRE ATT&CK-mapped detection rules and tested controlled scenarios. Built a Flask, Python and local LLM workflow to summarise evidence, classify severity and recommend next steps.',outcome:'Created an isolated security-operations prototype with custom detection rules, automated summaries and documented investigations. All scenarios were tested in a lab, not in a live production SOC.',technologies:['Wazuh','Sysmon','Python','Flask','Ollama','MITRE ATT&CK']},
  opencanary:{index:'02 / THREAT DETECTION',title:'OpenCanary Honeypot & Wazuh Correlation',lead:'Creating structured deception signals and correlating them in a SIEM.',challenge:'Honeypot telemetry can generate large volumes of low-value alerts without useful correlation or context.',implementation:'Configured OpenCanary and integrated its events with Wazuh using a custom JSON decoder and five frequency-based rules. Tested simulated SSH, HTTP and SMB activity, then reviewed noisy sequences and thresholds.',outcome:'Captured 897 alerts during controlled test scenarios and documented how frequency correlation improved interpretation. Results represent a laboratory environment.',technologies:['OpenCanary','Wazuh','JSON','Log Correlation','SSH / HTTP / SMB']},
  gadm:{index:'03 / MSC APPLIED RESEARCH',title:'ML-Based DDoS Detection with Governance Mapping',lead:'Connecting machine-learning detection metrics with auditable security evidence.',challenge:'Model accuracy alone does not explain how detection performance supports controls, reporting and security governance.',implementation:'Evaluated Logistic Regression, SVM, MLP, Random Forest and XGBoost on CIC-DDoS2019 and BoT-IoT datasets. Used SHAP and LIME to interpret predictions and developed a matrix mapping detection metrics to NIST CSF 2.0 and ISO/IEC 27001:2022 controls.',outcome:'Built a governance-aligned research prototype with 50 metric-to-control mappings, notebooks and evaluation outputs. The study used laboratory datasets, not production traffic.',technologies:['Python','Machine Learning','XGBoost','SHAP','LIME','NIST CSF 2.0']},
  windows:{index:'04 / SYSTEM ADMINISTRATION',title:'Windows Server & Active Directory Lab',lead:'A practical identity and domain support environment.',challenge:'Reliable IT support depends on consistent account provisioning, domain policies and predictable endpoint access.',implementation:'Deployed Windows Server 2019 in VMware, configured Active Directory domain services, organisational units and user accounts, applied password policies and tested Windows client authentication and access.',outcome:'Created a repeatable lab for account administration, group policy and common domain troubleshooting, complementing professional IT user-support experience.',technologies:['Windows Server','Active Directory','Group Policy','VMware','User Administration']}
};
const dialog=$('#projectDialog');let lastFocus=null;
function openProject(name,origin){const p=projects[name];if(!p)return;lastFocus=origin;$('#dialogIndex').textContent=p.index;$('#dialogTitle').textContent=p.title;$('#dialogLead').textContent=p.lead;$('#dialogChallenge').textContent=p.challenge;$('#dialogImplementation').textContent=p.implementation;$('#dialogOutcome').textContent=p.outcome;$('#dialogTech').replaceChildren(...p.technologies.map(t=>{const el=document.createElement('span');el.textContent=t;return el}));
  if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');document.body.classList.add('dialog-open');$('#dialogClose').focus({preventScroll:true});
}
function closeProject(){if(dialog.open&&dialog.close)dialog.close();else dialog.removeAttribute('open');document.body.classList.remove('dialog-open');lastFocus?.focus?.({preventScroll:true});}
$$('[data-project]').forEach(el=>el.addEventListener('click',()=>openProject(el.dataset.project,el)));
$('#dialogClose').addEventListener('click',closeProject);$('#dialogBack').addEventListener('click',closeProject);
dialog.addEventListener('click',e=>{if(e.target===dialog)closeProject()});dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');lastFocus?.focus?.({preventScroll:true})});

// Experience expands in place without navigating to fabricated pages.
$$('[data-experience]').forEach(row=>row.addEventListener('click',()=>{const details=$('.timeline-detail',row);const expanded=row.getAttribute('aria-expanded')==='true';row.setAttribute('aria-expanded',String(!expanded));details.hidden=expanded;}));

// Elegant moving dot-wave for CTA: restrained silver-blue lighting, 2.5D projection.
const canvas=$('#waveCanvas');const ctx=canvas?.getContext('2d',{alpha:true});let waveW=0,waveH=0,waveDpr=1,waveVisible=false,waveLast=0,waveT=0;const TAU=Math.PI*2;
function waveResize(){if(!ctx)return;const r=canvas.getBoundingClientRect();waveDpr=Math.min(devicePixelRatio||1,2);waveW=r.width;waveH=r.height;canvas.width=Math.round(waveW*waveDpr);canvas.height=Math.round(waveH*waveDpr);ctx.setTransform(waveDpr,0,0,waveDpr,0,0);if(motionPaused)drawWave(0)}
function drawWave(t){if(!ctx||!waveW||!waveH)return;ctx.clearRect(0,0,waveW,waveH);const rows=27,cols=84;const waveX=waveW*.36;const spanX=waveW*.77;const perspective=1.0;ctx.lineWidth=.55;for(let row=0;row<rows;row++){let yy=row/(rows-1);const alpha=.10+.32*(1-yy);let last=null;for(let col=0;col<cols;col++){let xx=col/(cols-1);const field=Math.sin(xx*TAU*1.38-yy*2.6+t*.54)*.32+Math.cos(xx*TAU*.72+yy*4.5-t*.24)*.22;const hump=Math.exp(-Math.pow((xx-.50)*1.75,2));const x=waveX+xx*spanX+(yy-.5)*-34;const y=waveH*(.38+yy*.79)+field*waveH*(.18+.25*yy)-hump*waveH*.13;const depth=1-yy;const shine=Math.max(0,1-Math.abs(xx-.58)*1.3);const bright=Math.max(0,Math.min(1,(shine*depth*.8+.20)));let c=(bright*.45+.10);ctx.fillStyle=`rgba(${150+Math.round(bright*45)},${177+Math.round(bright*47)},${202+Math.round(bright*44)},${(alpha*.30+.18)*bright})`;ctx.beginPath();ctx.arc(x,y,(.55+depth*.65)*Math.max(.60,waveW/1300),0,TAU);ctx.fill();if(last&&col%3===0){ctx.strokeStyle=`rgba(156,190,217,${c*.08})`;ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(x,y);ctx.stroke()}last={x,y}}}}
function waveLoop(ts){waveRAF=0;if(motionPaused||!waveVisible)return;if(ts-waveLast<24){waveRAF=requestAnimationFrame(waveLoop);return;}const delta=Math.min(60,ts-(waveLast||ts));waveLast=ts;waveT+=delta/1000;drawWave(waveT);waveRAF=requestAnimationFrame(waveLoop)}
function waveStart(){if(!motionPaused&&waveVisible&&!waveRAF){waveLast=0;waveRAF=requestAnimationFrame(waveLoop)}}
if(ctx){new ResizeObserver(waveResize).observe(canvas);const wObs=new IntersectionObserver(entries=>{waveVisible=entries[0].isIntersecting;if(waveVisible)waveStart()},{threshold:.01});wObs.observe(canvas);waveResize();}

// Motion pause/resume, honouring OS reduced-motion on initial load.
const motionToggle=$('#motionToggle'),toolbar=$('.motion-toolbar');
function setMotion(pause){motionPaused=pause;motionToggle.setAttribute('aria-pressed',String(pause));motionToggle.setAttribute('aria-label',pause?'Enable animations':'Pause animations');$('.motion-text',motionToggle).textContent=pause?'Play motion':'Pause motion';motionToggle.querySelector('span').textContent=pause?'▷':'Ⅱ';
  if(pause){if(waveRAF)cancelAnimationFrame(waveRAF);if(rafId)cancelAnimationFrame(rafId);waveRAF=rafId=0;revealFallback();drawWave(0);portraitWrap.style.setProperty('--portrait-x','0px');portraitWrap.style.setProperty('--portrait-y','0px');}
  else{document.documentElement.classList.add('js-motion');if(!rafId)rafId=requestAnimationFrame(animatePortrait);waveStart();}
}
motionToggle.addEventListener('click',()=>setMotion(!motionPaused));
window.addEventListener('scroll',()=>{toolbar.classList.toggle('visible',window.scrollY>300)},{passive:true});
setMotion(motionPaused);

// Magnetic CTA treatment only on mouse devices and only while animation is enabled.
if(window.matchMedia('(pointer:fine)').matches){$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{if(motionPaused)return;const r=el.getBoundingClientRect();el.style.transform=`translate(${((e.clientX-r.left-r.width/2)*.06).toFixed(1)}px,${((e.clientY-r.top-r.height/2)*.1).toFixed(1)}px)`});el.addEventListener('pointerleave',()=>{el.style.transform='';});});}
