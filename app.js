
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const projects=window.SAMX_PROJECTS||[];
const sectionMeta=window.SAMX_SECTION_META||{};
const experience=window.SAMX_EXPERIENCE||[];
const certs=window.SAMX_CERTS||[];
const skills=window.SAMX_SKILLS||[];
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=prefersReduced.matches, rafId=0, waveRAF=0;
if(!motionPaused) document.documentElement.classList.add('js-motion');

const header=$('.site-header'), progress=$('#readingProgress');
const links=$$('.desktop-links a');
const sectionTargets=['about','featured','project-directory','skills','experience','contact'];
let scrollScheduled=false;
function onScroll(){scrollScheduled=false;const y=window.scrollY;header.classList.toggle('scrolled',y>24);const full=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.width=`${Math.min(100,Math.max(0,y/full*100))}%`;let active='';for(const id of sectionTargets){const s=document.getElementById(id);if(s&&s.getBoundingClientRect().top<innerHeight*.34) active=id;}links.forEach(a=>{const isActive=a.getAttribute('href')==='#'+active;a.classList.toggle('active',isActive);if(isActive)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

const toggle=$('#menuToggle'), mobile=$('#mobileMenu');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');mobile.hidden=true;document.body.classList.remove('menu-open');}
if(toggle){toggle.addEventListener('click',()=>{const show=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(show));toggle.setAttribute('aria-label',show?'Close menu':'Open menu');mobile.hidden=!show;document.body.classList.toggle('menu-open',show);});}
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
window.addEventListener('resize',()=>{if(innerWidth>760)closeMenu()});

const observed=$$('.reveal');
const io=new IntersectionObserver(entries=>{for(const e of entries) if(e.isIntersecting){e.target.classList.add('shown');io.unobserve(e.target)}},{threshold:.08,rootMargin:'0px 0px -3% 0px'});
observed.forEach(el=>io.observe(el));
if(motionPaused) observed.forEach(el=>el.classList.add('shown'));

function revealMount(el){ if(!el) return; if(motionPaused) el.classList.add('shown'); else io.observe(el); }

function buildProjectCard(project,{small=false}={}){
  const btn=document.createElement('button');
  btn.type='button';
  btn.className=`project-card reveal${small?' small':''}`;
  btn.dataset.project=project.id;
  btn.setAttribute('aria-label',`View ${project.title}`);
  btn.innerHTML=`
    <img src="assets/project-covers/${project.id}.svg" alt="${project.title} project cover" loading="lazy" width="1600" height="900">
    <span class="project-overlay">
      <span class="project-arrow" aria-hidden="true">↗</span>
      <span class="project-meta">${project.group}</span>
      <span class="project-title">${project.title}</span>
      <span class="project-summary">${project.what}</span>
      <span class="project-tags">${project.tags.slice(0,4).map(tag=>`<span>${tag}</span>`).join('')}</span>
    </span>`;
  return btn;
}

function mountProjects(){
  const featuredGrid=$('#featuredGrid');
  const sectionsRoot=$('#projectSections');
  const featured=projects.filter(p=>p.featured);
  featured.forEach(p=>{ const card=buildProjectCard(p); featuredGrid.appendChild(card); revealMount(card); });

  for(const sectionId of ['A','B','C','D']){
    const items=projects.filter(p=>p.section===sectionId);
    const meta=sectionMeta[sectionId]||{};
    const wrapper=document.createElement('section');
    wrapper.className='project-section reveal';
    wrapper.innerHTML=`<header><div><span class="section-label">${sectionId} / CATEGORY</span><h3>${meta.title||''}</h3><p>${meta.summary||''}</p></div><span class="section-count">${items.length} projects</span></header>`;
    const grid=document.createElement('div');
    grid.className='project-list-grid';
    items.forEach(p=>{ const card=buildProjectCard(p,{small:true}); grid.appendChild(card); revealMount(card); });
    wrapper.appendChild(grid);
    sectionsRoot.appendChild(wrapper);
    revealMount(wrapper);
  }
}

function mountSkills(){
  const root=$('#skillsGrid');
  const icons=[
    '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="6" y="8" width="28" height="18" rx="2"/><path d="M14 32h12M20 26v6"/></svg>',
    '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4 32 10v11c0 9-6 13-12 16C14 34 8 30 8 21V10Z"/><path d="m15 20 4 4 7-8"/></svg>',
    '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 4 15 9-15 9L5 13Zm-15 17 15 9 15-9M5 28l15 9 15-9"/></svg>',
    '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="14" r="6"/><path d="M8 34c1-6 6-10 12-10s11 4 12 10"/></svg>',
    '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 28h22M13 10h14M14 16h12M12 22h16"/></svg>',
    '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 28V12l12-6 12 6v16l-12 6Z"/><path d="M8 12l12 6 12-6"/></svg>',
    '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m15 12-9 8 9 8m10-16 9 8-9 8M23 8l-6 24"/></svg>',
    '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 30c4-4 8-6 12-6s8 2 12 6"/><path d="M8 22c4-4 8-6 12-6s8 2 12 6"/><path d="M8 14c4-4 8-6 12-6s8 2 12 6"/></svg>'
  ];
  skills.forEach((skill,i)=>{const el=document.createElement('div');el.className='skill-item reveal';el.innerHTML=`${icons[i%icons.length]}<span>${skill}</span>`;root.appendChild(el);revealMount(el);});
}

function mountExperience(){
  const root=$('#experienceList');
  experience.forEach(item=>{const row=document.createElement('div');row.className='timeline-row reveal';row.innerHTML=`<span class="timeline-dot"></span><span class="timeline-main"><strong>${item.title}</strong><i>${item.company}</i><p>${item.detail}</p></span><time>${item.dates}</time><span class="timeline-arrow" aria-hidden="true">↗</span>`;root.appendChild(row);revealMount(row);});
}

function mountCertifications(){
  const root=$('#certificationsList');
  certs.forEach(cert=>{const s=document.createElement('span');s.textContent=cert;root.appendChild(s);});
}

mountProjects(); mountSkills(); mountExperience(); mountCertifications();

const dialog=$('#projectDialog');let lastFocus=null;
function openProject(name,origin){const p=projects.find(x=>x.id===name);if(!p)return;lastFocus=origin;$('#dialogIndex').textContent=`${p.section} / ${p.group}`;$('#dialogTitle').textContent=p.title;$('#dialogLead').textContent=(p.stack||[]).join(' · ');$('#dialogWhat').textContent=p.what||'';$('#dialogImplementation').textContent=p.did||'';$('#dialogOutcome').textContent=p.result||'';$('#dialogTech').replaceChildren(...(p.tags||[]).map(t=>{const el=document.createElement('span');el.textContent=t;return el;})); const repo=$('#dialogRepo'); if(p.repo){repo.href=p.repo; repo.textContent='View repository ↗'; repo.removeAttribute('aria-disabled');} else {repo.href='#'; repo.textContent='Repository not public'; repo.setAttribute('aria-disabled','true');}
  if(typeof dialog.showModal==='function')dialog.showModal(); else dialog.setAttribute('open',''); document.body.classList.add('dialog-open'); $('#dialogClose').focus({preventScroll:true});}
function closeProject(){if(dialog.open&&dialog.close)dialog.close(); else dialog.removeAttribute('open'); document.body.classList.remove('dialog-open'); lastFocus?.focus?.({preventScroll:true});}
document.addEventListener('click',e=>{const card=e.target.closest('[data-project]'); if(card) openProject(card.dataset.project,card);});
$('#dialogClose')?.addEventListener('click',closeProject); $('#dialogBack')?.addEventListener('click',closeProject); dialog?.addEventListener('click',e=>{if(e.target===dialog) closeProject()}); dialog?.addEventListener('close',()=>{document.body.classList.remove('dialog-open'); lastFocus?.focus?.({preventScroll:true})});

const canvas=$('#waveCanvas'); const ctx=canvas?.getContext('2d',{alpha:true}); let waveW=0,waveH=0,waveDpr=1,waveVisible=false,waveLast=0,waveT=0; const TAU=Math.PI*2;
function waveResize(){if(!ctx)return;const r=canvas.getBoundingClientRect();waveDpr=Math.min(devicePixelRatio||1,2);waveW=r.width;waveH=r.height;canvas.width=Math.round(waveW*waveDpr);canvas.height=Math.round(waveH*waveDpr);ctx.setTransform(waveDpr,0,0,waveDpr,0,0); if(motionPaused) drawWave(0)}
function drawWave(t){if(!ctx||!waveW||!waveH)return;ctx.clearRect(0,0,waveW,waveH);const rows=24,cols=72;const waveX=waveW*.18;const spanX=waveW*.78;for(let row=0;row<rows;row++){let yy=row/(rows-1);let last=null;for(let col=0;col<cols;col++){let xx=col/(cols-1);const field=Math.sin(xx*TAU*1.3-yy*2.7+t*.55)*.34+Math.cos(xx*TAU*.76+yy*4.2-t*.2)*.18;const hump=Math.exp(-Math.pow((xx-.52)*1.6,2));const x=waveX+xx*spanX+(yy-.5)*-18;const y=waveH*(.42+yy*.52)+field*waveH*.14-hump*waveH*.10;const depth=1-yy;const shine=Math.max(0,1-Math.abs(xx-.58)*1.3);const bright=Math.max(0,Math.min(1,(shine*depth*.86+.18)));ctx.fillStyle=`rgba(${150+Math.round(bright*46)},${178+Math.round(bright*42)},${205+Math.round(bright*38)},${(.20+.25*bright)})`;ctx.beginPath();ctx.arc(x,y,(.52+depth*.62)*Math.max(.6,waveW/1300),0,TAU);ctx.fill(); if(last&&col%3===0){ctx.strokeStyle=`rgba(153,182,209,${bright*.08})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(x,y);ctx.stroke();} last={x,y};}}}
function waveLoop(ts){waveRAF=0;if(motionPaused||!waveVisible)return;if(ts-waveLast<24){waveRAF=requestAnimationFrame(waveLoop);return;}const delta=Math.min(60,ts-(waveLast||ts));waveLast=ts;waveT+=delta/1000;drawWave(waveT);waveRAF=requestAnimationFrame(waveLoop)}
function waveStart(){if(!motionPaused&&waveVisible&&!waveRAF){waveLast=0;waveRAF=requestAnimationFrame(waveLoop)}}
if(ctx){new ResizeObserver(waveResize).observe(canvas); const obs=new IntersectionObserver(entries=>{waveVisible=entries[0].isIntersecting;if(waveVisible)waveStart()},{threshold:.01}); obs.observe(canvas); waveResize();}

const motionToggle=$('#motionToggle'), toolbar=$('.motion-toolbar');
function setMotion(pause){motionPaused=pause; motionToggle.setAttribute('aria-pressed',String(pause)); motionToggle.setAttribute('aria-label',pause?'Enable animations':'Pause animations'); $('.motion-text',motionToggle).textContent=pause?'Play motion':'Pause motion'; motionToggle.querySelector('span').textContent=pause?'▷':'Ⅱ'; if(pause){if(waveRAF)cancelAnimationFrame(waveRAF); waveRAF=0; $$('.reveal').forEach(el=>el.classList.add('shown')); drawWave(0);} else {waveStart();}}
motionToggle?.addEventListener('click',()=>setMotion(!motionPaused)); window.addEventListener('scroll',()=>{toolbar?.classList.toggle('visible',window.scrollY>260)},{passive:true}); setMotion(motionPaused);
if(window.matchMedia('(pointer:fine)').matches){$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{if(motionPaused)return;const r=el.getBoundingClientRect();el.style.transform=`translate(${((e.clientX-r.left-r.width/2)*.04).toFixed(1)}px,${((e.clientY-r.top-r.height/2)*.08).toFixed(1)}px)`}); el.addEventListener('pointerleave',()=>{el.style.transform='';});});}
