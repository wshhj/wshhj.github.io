
(function(){
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generic menu for subpages.
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const overlay = document.querySelector('[data-menu-overlay]');
  function setMenu(open){
    document.body.classList.toggle('menu-open', open);
    if(menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
    if(mobileNav) mobileNav.setAttribute('aria-hidden', String(!open));
  }
  menuBtn?.addEventListener('click', ()=> setMenu(!document.body.classList.contains('menu-open')));
  overlay?.addEventListener('click', ()=> setMenu(false));
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> setMenu(false)));
  addEventListener('keydown', e => { if(e.key === 'Escape') setMenu(false); });

  // Homepage side menu toggle.
  const homeToggle = document.querySelector('[data-home-toggle]');
  const homeClose = document.querySelector('[data-home-close]');
  function toggleHomeMenu(){
    if(window.innerWidth <= 760){
      document.body.classList.toggle('menu-open');
    }else{
      document.body.classList.toggle('home-menu-hidden');
    }
  }
  homeToggle?.addEventListener('click', toggleHomeMenu);
  homeClose?.addEventListener('click', toggleHomeMenu);

  // Click copy article link.
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-copy-link]');
    if(!b) return;
    try{
      await navigator.clipboard.writeText(location.href);
      const old = b.textContent; b.textContent = '已复制';
      setTimeout(() => b.textContent = old, 900);
    }catch{}
  });

  // Filtering.
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', ()=>{
    document.querySelectorAll('[data-filter]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const value = btn.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(item => {
      item.style.display = (value === '全部' || item.dataset.category === value) ? 'grid' : 'none';
    });
  }));

  // Search.
  const input = document.getElementById('siteSearch');
  const out = document.getElementById('searchResults');
  if(input && out && window.SITE_DATA){
    const records = [
      ...SITE_DATA.posts.map(x => ({...x, type:'文章', url:`article.html?post=${x.slug}`})),
      ...SITE_DATA.projects.map(x => ({...x, type:'项目'}))
    ];
    const render = (q='') => {
      const k = q.trim().toLowerCase();
      const list = !k ? records : records.filter(x => [x.title, x.category, x.desc, ...(x.tags || [])].join(' ').toLowerCase().includes(k));
      out.innerHTML = (list.slice(0,8).map(x => `<a class="search-item" href="${x.url}"><strong>${x.title}</strong><span>${x.type} · ${x.category} — ${x.desc}</span></a>`).join('')) || '<div class="search-item"><strong>没有结果</strong><span>换个关键词试试。</span></div>';
    };
    render(); input.addEventListener('input', e => render(e.target.value));
  }

  // Close mobile homepage sidebar when clicking backdrop area via ESC only on resize.
  addEventListener('resize', () => {
    if(window.innerWidth > 760) document.body.classList.remove('menu-open');
  }, {passive:true});
})();
