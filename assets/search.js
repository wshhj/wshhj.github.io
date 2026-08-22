
document.addEventListener('DOMContentLoaded',()=>{
 const d=window.SITE_DATA||{posts:[],projects:[]};
 const inp=document.getElementById('siteSearch'),out=document.getElementById('searchResults');
 function render(q=''){
   if(!out)return;
   const k=q.trim().toLowerCase();
   let list=[
    ...d.posts.map(x=>({...x,type:'文章',url:`article.html?post=${x.slug}`})),
    ...d.projects.map(x=>({...x,type:'项目'}))
   ];
   if(k) list=list.filter(x=>[x.title,x.category,x.desc,...(x.tags||[])].join(' ').toLowerCase().includes(k));
   out.innerHTML=(list.slice(0,8).map(x=>`<a class="search-item" href="${x.url}"><strong>${x.title}</strong><span>${x.type} · ${x.category} — ${x.desc}</span></a>`).join(''))||'<div class="search-item"><strong>没有结果</strong><span>换一个关键词试试。</span></div>';
 }
 if(inp){render();inp.addEventListener('input',e=>render(e.target.value))}
 const filters=document.querySelectorAll('[data-filter]'),items=document.querySelectorAll('[data-category]');
 filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;items.forEach(i=>i.style.display=(f==='全部'||i.dataset.category===f)?'grid':'none')}));
});
