'use strict';
const $=(q,from=document)=>from.querySelector(q);
const $$=(q,from=document)=>Array.from(from.querySelectorAll(q));
const projects=window.SAMX_PROJECTS||[];
const featureSet=projects.filter(p=>p.featured);
const sectionNames={A:'Security operations',B:'Application security',C:'IT & cloud',D:'Software & AI'};
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeFilter='all', searchTerm='', visibleLimit=6, lastFocus=null;
const siteHeader=$('.site-header'), mobileNav=$('#mobileNav'), menuToggle=$('#menuToggle');
function closeMenu(){mobileNav.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');document.body.classList.remove('menu-open')}
menuToggle.addEventListener('click',()=>{const isOpen=menuToggle.getAttribute('aria-expanded')==='true';if(isOpen)closeMenu();else{mobileNav.hidden=false;menuToggle.setAttribute('aria-expanded','true');menuToggle.setAttribute('aria-label','Close navigation');document.body.classList.add('menu-open')}});
$$('.mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu()});
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
let ticking=false;window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{siteHeader.classList.toggle('is-scrolled',window.scrollY>30);const d=Math.max(1,document.documentElement.scrollHeight-innerHeight);$('#progressFill').style.width=`${Math.min(100,Math.max(0,scrollY/d*100))}%`;ticking=false});ticking=true}},{passive:true});
const escapeHtml=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cover(p){return `<img src="${escapeHtml(p.image)}" alt="Illustrative visual for ${escapeHtml(p.title)}" loading="lazy" decoding="async" width="1440" height="900">`}
function featureMarkup(p,index){return `<button type="button" class="feature-card reveal" data-project="${escapeHtml(p.id)}" aria-label="View case study: ${escapeHtml(p.title)}"><span class="feature-art">${cover(p)}</span><span class="feature-body"><span class="feature-meta">${String(index+1).padStart(2,'0')} / ${escapeHtml(p.area)}</span><span class="feature-title">${escapeHtml(p.title)}</span><span class="feature-desc">${escapeHtml(p.short)}</span><span class="feature-arrow" aria-hidden="true">↗</span></span></button>`}
$('#featuredGrid').innerHTML=featureSet.map(featureMarkup).join('');
function listMarkup(p){return `<button type="button" class="library-card" data-project="${escapeHtml(p.id)}" aria-label="View project: ${escapeHtml(p.title)}"><span class="library-art">${cover(p)}</span><span class="library-text"><span class="library-area">${escapeHtml(p.area)}</span><span class="library-title">${escapeHtml(p.title)}</span><span class="library-summary">${escapeHtml(p.short)}</span></span><span class="library-arrow" aria-hidden="true">↗</span></button>`}
function getMatches(){return projects.filter(p=>{if(activeFilter!=='all'&&p.section!==activeFilter)return false;if(!searchTerm)return true;return [p.title,p.what,p.did,p.result,...(p.stack||[]),...(p.tags||[])].join(' ').toLowerCase().includes(searchTerm)})}
function renderLibrary(){const matches=getMatches();const visible=matches.slice(0,visibleLimit);$('#projectGrid').innerHTML=visible.map(listMarkup).join('');$('#projectCount').textContent=`Showing ${visible.length} of ${matches.length} projects`;$('#noResults').hidden=matches.length!==0;const load=$('#loadMore');load.hidden=matches.length<=visibleLimit;load.textContent=`Show more projects (${matches.length-visible.length} remaining) ↓`;}
renderLibrary();
$$('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;visibleLimit=6;$$('.filter').forEach(item=>{const active=item===b;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active))});renderLibrary()}));
$('#projectSearch').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLowerCase();visibleLimit=6;renderLibrary()});
$('#loadMore').addEventListener('click',()=>{visibleLimit+=6;renderLibrary()});
const modal=$('#projectDialog');
function fillText(q,value){$(q).textContent=value||''}
function openProject(p,trigger){lastFocus=trigger;fillText('#modalArea',sectionNames[p.section]||p.group);fillText('#modalTitle',p.title);fillText('#modalLead',p.what||p.short);fillText('#modalWork',p.did||'See project repository for details.');fillText('#modalResult',p.result||'The project documents applied technical skills in a controlled environment.');$('#modalImage').src=p.image;$('#modalImage').alt=`Illustrative artwork for ${p.title}`;
  $('#modalTech').replaceChildren(...(p.stack||p.tags||[]).map(s=>{const chip=document.createElement('span');chip.textContent=s;return chip}));
  const action=$('#modalAction');action.replaceChildren();if(p.repo&&/^https:\/\/github\.com\/SamXl-Codes\//i.test(p.repo)){const link=document.createElement('a');link.href=p.repo;link.target='_blank';link.rel='noopener noreferrer';link.textContent='View repository ↗';action.appendChild(link)}else{const label=document.createElement('p');label.textContent='Project materials are not publicly linked.';action.appendChild(label)}
  if(!modal.open)modal.showModal();document.body.classList.add('modal-open');$('#modalClose').focus({preventScroll:true});}
function closeProject(){if(modal.open)modal.close()}
document.addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(!button)return;const p=projects.find(item=>item.id===button.dataset.project);if(p)openProject(p,button)});
$('#modalClose').addEventListener('click',closeProject);
modal.addEventListener('click',e=>{if(e.target===modal)closeProject()});modal.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus?.({preventScroll:true})});
if(!reduced&&'IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const obs=new IntersectionObserver(es=>es.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -25px 0px'});$$('.reveal').forEach(e=>obs.observe(e));}else{$$('.reveal').forEach(e=>e.classList.add('visible'))}
// Subtle depth motion affects only the atmosphere, never the actual portrait.
if(!reduced&&window.matchMedia('(pointer:fine)').matches){const hero=$('.hero'),halo=$('.hero-halo');let aimX=0,aimY=0,mx=0,my=0;hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();aimX=((e.clientX-r.left)/r.width-.5)*16;aimY=((e.clientY-r.top)/r.height-.5)*12;},{passive:true});hero.addEventListener('pointerleave',()=>{aimX=aimY=0});let onScreen=true;const io=new IntersectionObserver(es=>onScreen=es[0].isIntersecting);io.observe(hero);function loop(){if(onScreen){mx+=(aimX-mx)*.05;my+=(aimY-my)*.05;halo.style.transform=`translate3d(${mx.toFixed(1)}px,${my.toFixed(1)}px,0)`}requestAnimationFrame(loop)}requestAnimationFrame(loop)}
