
(function(){
  const canvas=document.getElementById('heroStars');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let width=0, height=0, stars=[], trails=[];
  const pointer={x:null,y:null};
  function resize(){
    const ratio=Math.max(1, window.devicePixelRatio||1);
    width=canvas.offsetWidth; height=canvas.offsetHeight;
    canvas.width=width*ratio; canvas.height=height*ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const count=Math.min(180, Math.floor(width/8));
    stars = Array.from({length:count}, ()=>({
      x:Math.random()*width,
      y:Math.random()*height,
      r:Math.random()*1.6+.35,
      dx:(Math.random()-.5)*.08,
      dy:(Math.random()-.5)*.08,
      alpha:Math.random()*.5+.35,
      drift:(Math.random()*.018)+.004,
    }));
  }
  function spawnTrail(){
    trails.push({
      x:width*(.18+Math.random()*.78),
      y:20+Math.random()*height*.28,
      len:90+Math.random()*110,
      dx:-5.5-Math.random()*3,
      dy:2.6+Math.random()*2.1,
      life:0,
      ttl:38+Math.random()*18,
      hue:Math.random()>.5?'139,214,255':'178,132,255'
    });
  }
  function scheduleTrail(){
    setTimeout(()=>{ spawnTrail(); scheduleTrail(); }, 1600+Math.random()*3200);
  }
  function step(){
    ctx.clearRect(0,0,width,height);
    // stars
    for(const s of stars){
      s.x += s.dx; s.y += s.dy;
      s.alpha += (Math.random()>.5?1:-1)*s.drift;
      if(s.alpha < .14 || s.alpha > 1) s.drift *= -1;
      if(s.x<0||s.x>width) s.dx *= -1;
      if(s.y<0||s.y>height) s.dy *= -1;
      ctx.beginPath();
      ctx.fillStyle=`rgba(255,255,255,${Math.max(.14,Math.min(1,s.alpha))})`;
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    // subtle connections
    ctx.lineWidth=.45;
    for(let i=0;i<stars.length;i++){
      const a=stars[i];
      for(let j=i+1;j<stars.length;j++){
        const b=stars[j];
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<58){
          ctx.strokeStyle=`rgba(125,142,255,${.11-(d/58)*.09})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      if(pointer.x!==null){
        const dp=Math.hypot(a.x-pointer.x,a.y-pointer.y);
        if(dp<140){
          ctx.strokeStyle=`rgba(139,214,255,${.32-(dp/140)*.28})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(pointer.x,pointer.y); ctx.stroke();
        }
      }
    }
    // trails
    trails = trails.filter(t=>t.life<t.ttl);
    for(const t of trails){
      t.x += t.dx; t.y += t.dy; t.life += 1;
      const alpha = 1 - t.life/t.ttl;
      const grad = ctx.createLinearGradient(t.x,t.y,t.x-t.len,t.y-t.len*.42);
      grad.addColorStop(0,`rgba(${t.hue},${alpha})`);
      grad.addColorStop(.38,`rgba(255,255,255,${alpha*.85})`);
      grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(t.x,t.y); ctx.lineTo(t.x-t.len,t.y-t.len*.42); ctx.stroke();
    }
    requestAnimationFrame(step);
  }
  canvas.addEventListener('mousemove',e=>{
    const rect=canvas.getBoundingClientRect();
    pointer.x=e.clientX-rect.left; pointer.y=e.clientY-rect.top;
  });
  canvas.addEventListener('mouseleave',()=>{pointer.x=null; pointer.y=null});
  window.addEventListener('resize',resize);
  resize(); scheduleTrail(); step();
})();
