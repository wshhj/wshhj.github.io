
function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function inline(s){s=esc(s);s=s.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');return s}
function markdown(md){
  const L=md.replace(/\r/g,'').split('\n');let h='',code=false,c=[],ul=false,ol=false;
  const close=()=>{if(ul){h+='</ul>';ul=false}if(ol){h+='</ol>';ol=false}};
  for(const l of L){
    if(l.startsWith('```')){if(!code){close();code=true;c=[]}else{h+='<pre><code>'+esc(c.join('\n'))+'</code></pre>';code=false}continue}
    if(code){c.push(l);continue}
    if(!l.trim()){close();continue}
    let m;
    if(m=l.match(/^(#{1,3})\s+(.+)$/)){close();const n=m[1].length,id=m[2].toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g,'-');h+=`<h${n} id="${id}">${inline(m[2])}</h${n}>`;continue}
    if(m=l.match(/^>\s?(.+)$/)){close();h+=`<blockquote>${inline(m[1])}</blockquote>`;continue}
    if(m=l.match(/^[-*]\s+(.+)$/)){if(!ul){close();h+='<ul>';ul=true}h+=`<li>${inline(m[1])}</li>`;continue}
    if(m=l.match(/^\d+\.\s+(.+)$/)){if(!ol){close();h+='<ol>';ol=true}h+=`<li>${inline(m[1])}</li>`;continue}
    close();h+=`<p>${inline(l)}</p>`;
  }
  close();return h;
}
function toc(){
  const t=document.getElementById('tocLinks'),b=document.getElementById('articleBody');
  if(t&&b)t.innerHTML=[...b.querySelectorAll('h2,h3')].map(x=>`<a href="#${x.id}">${x.textContent}</a>`).join('');
}
function enhance(meta){
  document.querySelectorAll('#articleBody pre').forEach(pre=>{
    const b=document.createElement('button');
    b.className='copy-code';b.textContent='复制';
    b.onclick=async()=>{await navigator.clipboard.writeText(pre.innerText.replace(/^复制\s*/,''));b.textContent='已复制';setTimeout(()=>b.textContent='复制',1000)};
    pre.appendChild(b);
  });
  const info=document.getElementById('articleInfo');
  if(info&&meta)info.innerHTML=`<span>约 ${meta.reading} 分钟阅读</span><span>${meta.tags.map(t=>'#'+t).join(' ')}</span>`;
  const rel=document.getElementById('relatedPosts');
  if(rel&&meta){
    const related=SITE_DATA.posts.filter(x=>x.slug!==meta.slug&&(x.category===meta.category||x.tags.some(t=>meta.tags.includes(t)))).slice(0,2);
    rel.innerHTML=related.map(x=>`<a class="related-card" href="article.html?post=${x.slug}"><strong>${x.title}</strong><span>${x.category} · ${x.reading} min</span></a>`).join('');
  }
}
document.addEventListener('DOMContentLoaded',async()=>{
  const b=document.getElementById('articleBody'); if(!b)return;
  const s=new URLSearchParams(location.search).get('post')||'first-post';
  const m=SITE_DATA.posts.find(x=>x.slug===s);
  if(m){articleTitle.textContent=m.title;articleDesc.textContent=m.desc;articleMeta.textContent=`${m.date} · ${m.category}`;document.title=m.title+' · Hero'}
  try{const r=await fetch(`content/${s}.md`);b.innerHTML=markdown(await r.text());toc();enhance(m)}catch{b.innerHTML='<p>文章加载失败，请确认 Markdown 文件存在。</p>'}
});
