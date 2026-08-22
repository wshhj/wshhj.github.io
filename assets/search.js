
const BLOG_INDEX = [
  {title:"我的第一篇正式博客",type:"博客",category:"成长",url:"posts/first-post.html",desc:"从一个简单网页开始，建立属于自己的长期知识库。"},
  {title:"E-Bike 电机测试方法",type:"文章",category:"E-Bike",url:"posts/ebike-motor-test.html",desc:"整理轮毂电机测试的核心项目、参数与判定思路。"},
  {title:"如何建立长期学习系统",type:"文章",category:"学习",url:"posts/learning-system.html",desc:"输入、练习、输出、复盘形成稳定学习闭环。"},
  {title:"E-Bike 测试管理系统",type:"项目",category:"项目",url:"projects/test-management.html",desc:"用于项目测试进度、异常和状态管理的个人工具。"},
  {title:"UART 充电器通讯工具",type:"项目",category:"项目",url:"projects/uart-tool.html",desc:"用于单线 UART 充电器通讯分析与测试。"},
  {title:"视频：E-Bike 测试记录",type:"视频",category:"视频",url:"videos.html",desc:"整车、电机、爬坡和异常复现视频。"}
];

function renderSearch(q){
  const box=document.getElementById('searchResults');
  if(!box) return;
  const kw=(q||'').trim().toLowerCase();
  const data=!kw ? BLOG_INDEX.slice(0,5) : BLOG_INDEX.filter(x =>
    [x.title,x.type,x.category,x.desc].join(' ').toLowerCase().includes(kw)
  );
  box.innerHTML=data.length?data.map(x=>`
    <a class="search-item" href="${x.url}">
      <strong>${x.title}</strong>
      <span>${x.type} · ${x.category} — ${x.desc}</span>
    </a>`).join(''):'<div class="search-item"><strong>没有找到结果</strong><span>换一个关键词试试。</span></div>';
}
document.addEventListener('DOMContentLoaded',()=>{
  const input=document.getElementById('siteSearch');
  if(input){
    renderSearch('');
    input.addEventListener('input',e=>renderSearch(e.target.value));
  }
  const filters=document.querySelectorAll('[data-filter]');
  const items=document.querySelectorAll('[data-category]');
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    filters.forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    items.forEach(it=>it.style.display=(f==='全部'||it.dataset.category===f)?'grid':'none');
  }));
});
