
(function(){
  const root=document.documentElement;
  const btn=document.getElementById('themeToggle');
  const saved=localStorage.getItem('theme');
  const dark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme=saved || (dark?'dark':'light');
  if(btn){
    btn.addEventListener('click',()=>{
      const next=root.dataset.theme==='dark'?'light':'dark';
      root.dataset.theme=next;
      localStorage.setItem('theme',next);
    });
  }
})();
