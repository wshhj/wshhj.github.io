
function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function inline(s){
 s=esc(s);
 s=s.replace(/`([^`]+)`/g,'<code>$1</code>');
 s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
 s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
 return s;
}
function markdown(md){
 const lines=md.replace(/\r/g,'').split('\n'); let h='',inCode=false,code=[],inUl=false,inOl=false;
 function closeLists(){if(inUl){h+='</ul>';inUl=false} if(inOl){h+='</ol>';inOl=false}}
 for(let i=0;i<lines.length;i++){
  let l=lines[i];
  if(l.startsWith('```')){
   if(!inCode){closeLists();inCode=true;code=[]}else{h+='<pre><code>'+esc(code.join('\n'))+'</code></pre>';inCode=false}
   continue;
  }
  if(inCode){code.push(l);continue}
  if(!l.trim()){closeLists();continue}
  let m;
  if(m=l.match(/^(#{1,3})\s+(.+)$/)){closeLists();const n=m[1].length,id=m[2].toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g,'-');h+=`<h${n} id="${id}">${inline(m[2])}</h${n}>`;continue}
  if(m=l.match(/^>\s?(.+)$/)){closeLists();h+=`<blockquote>${inline(m[1])}</blockquote>`;continue}
  if(m=l.match(/^[-*]\s+(.+)$/)){if(!inUl){closeLists();h+='<ul>';inUl=true}h+=`<li>${inline(m[1])}</li>`;continue}
  if(m=l.match(/^\d+\.\s+(.+)$/)){if(!inOl){closeLists();h+='<ol>';inOl=true}h+=`<li>${inline(m[1])}</li>`;continue}
  closeLists();h+=`<p>${inline(l)}</p>`;
 }
 closeLists(); return h;
}
function buildTOC(){
 const toc=document.getElementById('tocLinks'),body=document.getElementById('articleBody');if(!toc||!body)return;
 const hs=[...body.querySelectorAll('h2,h3')];toc.innerHTML=hs.map(x=>`<a href="#${x.id}" style="${x.tagName==='H3'?'padding-left:10px':''}">${x.textContent}</a>`).join('');
}
document.addEventListener('DOMContentLoaded',async()=>{
 const body=document.getElementById('articleBody'); if(!body)return;
 const slug=new URLSearchParams(location.search).get('post')||'first-post';
 const meta=(window.SITE_DATA?.posts||[]).find(x=>x.slug===slug);
 if(meta){
   document.getElementById('articleTitle').textContent=meta.title;
   document.getElementById('articleDesc').textContent=meta.desc;
   document.getElementById('articleMeta').textContent=`${meta.date} · ${meta.category}`;
   document.title=meta.title+' · Arthur Engineer';
 }
 try{
   const r=await fetch(`content/${slug}.md`); if(!r.ok)throw new Error();
   body.innerHTML=markdown(await r.text()); buildTOC();
 }catch(e){body.innerHTML='<p>文章加载失败，请确认 Markdown 文件存在。</p>'}
});
