
(function(){
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reading progress, throttled to animation frames.
  const progress=document.createElement('div');
  progress.className='top-progress';
  document.body.appendChild(progress);
  let scrollQueued=false;
  function updateProgress(){
    scrollQueued=false;
    const d=document.documentElement;
    const total=d.scrollHeight-d.clientHeight;
    progress.style.width=(total?Math.min(100,d.scrollTop/total*100):0)+'%';
  }
  addEventListener('scroll',()=>{
    if(scrollQueued)return;
    scrollQueued=true;
    requestAnimationFrame(updateProgress);
  },{passive:true});
  updateProgress();

  // Responsive navigation.
  const menuBtn=document.querySelector('[data-menu-toggle]');
  const mobileNav=document.querySelector('[data-mobile-nav]');
  const overlay=document.querySelector('[data-menu-overlay]');
  function setMenu(open){
    document.body.classList.toggle('menu-open',open);
    if(menuBtn) menuBtn.setAttribute('aria-expanded',String(open));
    if(mobileNav) mobileNav.setAttribute('aria-hidden',String(!open));
  }
  menuBtn?.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
  overlay?.addEventListener('click',()=>setMenu(false));
  mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  // Copy article link.
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-copy-link]');
    if(!b)return;
    try{
      await navigator.clipboard.writeText(location.href);
      const old=b.textContent;b.textContent='已复制';
      setTimeout(()=>b.textContent=old,900);
    }catch{}
  });

  // Category filtering.
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const value=btn.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(item=>{
      item.style.display=(value==='全部'||item.dataset.category===value)?'grid':'none';
    });
  }));

  // Site search.
  const input=document.getElementById('siteSearch');
  const out=document.getElementById('searchResults');
  if(input&&out&&window.SITE_DATA){
    const records=[
      ...SITE_DATA.posts.map(x=>({...x,type:'文章',url:`article.html?post=${x.slug}`})),
      ...SITE_DATA.projects.map(x=>({...x,type:'项目'}))
    ];
    const render=(q='')=>{
      const k=q.trim().toLowerCase();
      const list=!k?records:records.filter(x=>[x.title,x.category,x.desc,...(x.tags||[])].join(' ').toLowerCase().includes(k));
      out.innerHTML=(list.slice(0,8).map(x=>`<a class="search-item" href="${x.url}"><strong>${x.title}</strong><span>${x.type} · ${x.category} — ${x.desc}</span></a>`).join(''))||'<div class="search-item"><strong>没有结果</strong><span>换个关键词试试。</span></div>';
    };
    render();input.addEventListener('input',e=>render(e.target.value));
  }

  // Lightweight poster tilt: disabled on touch and reduced-motion environments.
  const tilt=document.querySelector('[data-tilt]');
  if(tilt && !reduced && matchMedia('(pointer:fine)').matches){
    const area=tilt.parentElement;
    let frame=0,lastEvent=null;
    area.addEventListener('mousemove',e=>{
      lastEvent=e;
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        frame=0;
        if(!lastEvent)return;
        const r=tilt.getBoundingClientRect();
        const x=(lastEvent.clientX-r.left)/r.width-.5;
        const y=(lastEvent.clientY-r.top)/r.height-.5;
        tilt.style.transform=`rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg) translateY(-3px)`;
      });
    },{passive:true});
    area.addEventListener('mouseleave',()=>{tilt.style.transform='rotateX(0deg) rotateY(0deg) translateY(0px)'});
  }
})();
