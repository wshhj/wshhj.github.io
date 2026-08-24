
(function(){
  const progress=document.createElement('div');
  progress.className='top-progress';
  document.body.appendChild(progress);
  function updateProgress(){const h=document.documentElement,t=h.scrollHeight-h.clientHeight;progress.style.width=(t?Math.min(100,h.scrollTop/t*100):0)+'%'}
  addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

  const root=document.documentElement; const btn=document.getElementById('themeToggle');
  const saved=localStorage.getItem('hero-theme');
  if(saved==='light'){root.classList.add('light')}
  if(btn){btn.onclick=()=>{root.classList.toggle('light')}}

  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-copy-link]');
    if(b){try{await navigator.clipboard.writeText(location.href); const old=b.textContent; b.textContent='已复制'; setTimeout(()=>b.textContent=old,1000);}catch{}}
  });

  const filters=document.querySelectorAll('[data-filter]');
  const items=document.querySelectorAll('[data-category]');
  filters.forEach(f=>f.addEventListener('click',()=>{
    filters.forEach(x=>x.classList.remove('active')); f.classList.add('active');
    const v=f.dataset.filter;
    items.forEach(i=>{i.style.display=(v==='全部'||i.dataset.category===v)?'grid':'none'});
  }));

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
      out.innerHTML=(list.slice(0,8).map(x=>`<a class="search-item" href="${x.url}"><strong>${x.title}</strong><span>${x.type} · ${x.category} — ${x.desc}</span></a>`).join('')) || '<div class="search-item"><strong>没有结果</strong><span>换个关键词试试。</span></div>';
    };
    render(); input.addEventListener('input',e=>render(e.target.value));
  }
})();
