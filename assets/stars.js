
(function(){
  const canvas=document.getElementById('heroStars');
  if(!canvas) return;
  const ctx=canvas.getContext('2d',{alpha:true});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=matchMedia('(pointer:fine)').matches;
  let w=0,h=0,ratio=1,stars=[],shooters=[],mouse={x:null,y:null};
  let running=true,lastFrame=0,nextShooter=0;
  const FPS=36,FRAME=1000/FPS;

  function resize(){
    ratio=Math.min(devicePixelRatio||1,1.25);
    w=canvas.clientWidth;h=canvas.clientHeight;
    canvas.width=Math.max(1,Math.floor(w*ratio));
    canvas.height=Math.max(1,Math.floor(h*ratio));
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const count=reduced?28:(w<760?38:62);
    stars=Array.from({length:count},()=>({
      x:Math.random()*w,y:Math.random()*h,r:.45+Math.random()*1.25,
      vx:(Math.random()-.5)*.035,vy:(Math.random()-.5)*.035,
      a:.28+Math.random()*.62,p:Math.random()*Math.PI*2
    }));
  }

  function spawnShooter(){
    shooters.push({
      x:w*(.35+Math.random()*.6),y:20+Math.random()*h*.24,
      vx:-5.2-Math.random()*1.6,vy:2.2+Math.random()*1.2,
      len:90+Math.random()*70,life:0,ttl:32+Math.random()*12
    });
  }

  function draw(ts){
    if(!running){requestAnimationFrame(draw);return;}
    if(ts-lastFrame<FRAME){requestAnimationFrame(draw);return;}
    lastFrame=ts;
    ctx.clearRect(0,0,w,h);

    for(const s of stars){
      if(!reduced){s.x+=s.vx;s.y+=s.vy;s.p+=.014;}
      if(s.x<0)s.x=w;if(s.x>w)s.x=0;if(s.y<0)s.y=h;if(s.y>h)s.y=0;
      const alpha=Math.max(.14,Math.min(1,s.a+Math.sin(s.p)*.14));
      ctx.fillStyle=`rgba(255,255,255,${alpha})`;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
      if(finePointer&&mouse.x!==null&&!reduced){
        const dx=s.x-mouse.x,dy=s.y-mouse.y,d2=dx*dx+dy*dy;
        if(d2<110*110){
          const d=Math.sqrt(d2);
          ctx.strokeStyle=`rgba(139,214,255,${.20*(1-d/110)})`;
          ctx.lineWidth=.45;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();
        }
      }
    }

    if(!reduced&&ts>nextShooter){
      spawnShooter();
      nextShooter=ts+3200+Math.random()*4200;
    }
    shooters=shooters.filter(s=>s.life<s.ttl);
    for(const s of shooters){
      s.x+=s.vx;s.y+=s.vy;s.life++;
      const a=1-s.life/s.ttl;
      const grad=ctx.createLinearGradient(s.x,s.y,s.x-s.len,s.y-s.len*.42);
      grad.addColorStop(0,`rgba(255,255,255,${a})`);
      grad.addColorStop(.35,`rgba(139,214,255,${a*.72})`);
      grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle=grad;ctx.lineWidth=1.35;
      ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.len,s.y-s.len*.42);ctx.stroke();
    }
    requestAnimationFrame(draw);
  }

  if(finePointer&&!reduced){
    canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top},{passive:true});
    canvas.addEventListener('mouseleave',()=>{mouse.x=null;mouse.y=null},{passive:true});
  }
  document.addEventListener('visibilitychange',()=>{running=!document.hidden});
  addEventListener('resize',resize,{passive:true});
  resize();requestAnimationFrame(draw);
})();
