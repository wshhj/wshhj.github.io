
(function(){
  const canvas = document.getElementById('heroStars');
  if(!canvas) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, ratio = 1, stars = [], meteors = [], running = true;
  function resize(){
    ratio = Math.min(window.devicePixelRatio || 1, 1.25);
    width = canvas.offsetWidth; height = canvas.offsetHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const count = Math.max(50, Math.min(88, Math.floor(width / 20)));
    stars = Array.from({length:count}, () => ({
      x: Math.random()*width,
      y: Math.random()*height,
      r: Math.random()*1.4 + .35,
      a: Math.random()*.6 + .25,
      da: (Math.random()*.015) + .004,
      d: Math.random() > .5 ? 1 : -1
    }));
  }
  function spawnMeteor(){
    meteors.push({
      x: width * (.18 + Math.random()*.62),
      y: 40 + Math.random()*height*.24,
      len: 68 + Math.random()*60,
      dx: -4.2 - Math.random()*1.8,
      dy: 2.1 + Math.random()*1.2,
      life: 0,
      ttl: 32 + Math.random()*14
    });
  }
  let last = 0;
  function draw(ts){
    if(!running) return;
    if(ts - last < 25){ requestAnimationFrame(draw); return; } // ~40fps
    last = ts;
    ctx.clearRect(0,0,width,height);
    for(const s of stars){
      s.a += s.da * s.d;
      if(s.a > 1 || s.a < .16) s.d *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    if(Math.random() < .012 && meteors.length < 4) spawnMeteor();
    meteors = meteors.filter(m => m.life < m.ttl);
    for(const m of meteors){
      m.x += m.dx; m.y += m.dy; m.life += 1;
      const alpha = 1 - m.life / m.ttl;
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len*.48);
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grad.addColorStop(.45, `rgba(133,149,255,${alpha*.7})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x - m.len, m.y - m.len*.48); ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  document.addEventListener('visibilitychange', ()=>{ running = !document.hidden; if(running) requestAnimationFrame(draw); });
  addEventListener('resize', resize, {passive:true});
  resize(); requestAnimationFrame(draw);
})();
