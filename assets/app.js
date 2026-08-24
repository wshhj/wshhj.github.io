
(function(){
  const progress=document.createElement('div'); progress.className='top-progress'; document.body.appendChild(progress);
  function update(){const d=document.documentElement; const t=d.scrollHeight-d.clientHeight; progress.style.width=(t?Math.min(100,d.scrollTop/t*100):0)+'%';}
  addEventListener('scroll',update,{passive:true}); update();

  document.addEventListener('click', async e=>{
    const copy=e.target.closest('[data-copy-link]');
    if(copy){
      try{ await navigator.clipboard.writeText(location.href); const old=copy.textContent; copy.textContent='已复制'; setTimeout(()=>copy.textContent=old,900);}catch{}
    }
  });

  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    const group=btn.closest('.hero-actions, .filter-row') || document;
    document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const value=btn.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(item=>{
      item.style.display = value==='全部' || item.dataset.category===value ? (item.classList.contains('article-card') ? 'grid' : 'grid') : 'none';
    });
  }));

  const input=document.getElementById('siteSearch'); const out=document.getElementById('searchResults');
  if(input && out && window.SITE_DATA){
    const records=[
      ...SITE_DATA.posts.map(x=>({...x,type:'文章',url:`article.html?post=${x.slug}`})),
      ...SITE_DATA.projects.map(x=>({...x,type:'项目'}))
    ];
    const render=(q='')=>{
      const k=q.trim().toLowerCase();
      const list=!k ? records : records.filter(x=>[x.title,x.category,x.desc,...(x.tags||[])].join(' ').toLowerCase().includes(k));
      out.innerHTML = (list.slice(0,8).map(x=>`<a class="search-item" href="${x.url}"><strong>${x.title}</strong><span>${x.type} · ${x.category} — ${x.desc}</span></a>`).join('')) || '<div class="search-item"><strong>没有结果</strong><span>换个关键词试试。</span></div>';
    };
    render(); input.addEventListener('input', e=>render(e.target.value));
  }

  const tilt=document.querySelector('[data-tilt]');
  if(tilt){
    const area=tilt.parentElement;
    area.addEventListener('mousemove', e=>{
      const r=tilt.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      tilt.style.transform=`rotateX(${(-y*9).toFixed(2)}deg) rotateY(${(x*10).toFixed(2)}deg) translateY(-4px)`;
    });
    area.addEventListener('mouseleave', ()=>{tilt.style.transform='rotateX(0deg) rotateY(0deg) translateY(0px)';});
  }
})();
