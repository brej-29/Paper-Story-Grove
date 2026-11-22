'use strict';
/* One active painted page. Everything here is optional to the reader. */
const Living = (() => {
  let current = null, mounted = null, calm = false;
  const reduced = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const types = ['sway', 'flutter', 'breathe', 'flame', 'glow'];
  const vertex = `attribute vec2 p; varying vec2 uv;
    void main(){uv=vec2((p.x+1.0)*.5,(1.0-p.y)*.5);gl_Position=vec4(p,0,1);}`;
  const fragment = `precision mediump float;
    varying vec2 uv; uniform sampler2D painting; uniform float time;
    uniform vec4 regions[12]; uniform vec4 motion[12]; uniform vec2 anchors[12];
    uniform float kicks[12]; uniform vec2 fit; uniform int count;
    void main(){
      vec2 pos=uv*vec2(800,600), delta=vec2(0); float light=0.0;
      for(int i=0;i<12;i++){
        if(i>=count) break;
        vec4 r=regions[i], m=motion[i];
        vec2 q=(pos-r.xy)/r.zw;
        float mask=1.0-smoothstep(.1,1.0,length(q));
        float phase=time*m.z+float(i)*1.71;
        float a=m.y*(1.0+kicks[i]);
        float wave=sin(phase);
        vec2 d=anchors[i];
        if(m.x<.5){
          // A stalk stays anchored at its foot, the top leans in the breeze.
          delta+=d*a*1.8*(sin(phase+pos.x*.021+pos.y*.013)*.8+sin(phase*1.7+pos.x*.05)*.2)*clamp((r.y+r.w-pos.y)/(2.0*r.w),0.0,1.0)*mask;
        }else if(m.x<1.5){
          delta+=d*a*1.8*(sin(phase+q.y*2.0)*.75+sin(phase*1.37+q.x*3.0)*.25)*mask;
        }else if(m.x<2.5){
          delta+=(vec2(0.0,a*2.4)+(pos-r.xy)*(.006*a))*wave*mask;
        }else if(m.x<3.5){
          delta+=vec2(sin(phase*2.3+q.y*4.0)*a*.45,wave*a)*mask;
          light+=mask*(.025+.018*sin(phase*2.3));
        }else{
          light+=mask*(.018+.014*wave)*(1.0+kicks[i]);
        }
      }
      vec2 sampleUV=((pos+delta)/vec2(800,600)-.5)/fit+.5;
      if(sampleUV.x<0.0||sampleUV.x>1.0||sampleUV.y<0.0||sampleUV.y>1.0) discard;
      vec4 c=texture2D(painting,sampleUV);
      gl_FragColor=vec4(c.rgb+vec3(light,light*.65,light*.2),c.a);
    }`;

  function element(tag, name, parent) {
    const el = document.createElement(tag);
    el.className = name;
    parent.appendChild(el);
    return el;
  }

  function warp(s, href) {
    let canvas, gl, program, buffer, texture, shaders = [];
    const dispose = () => {
      if (gl) {
        if (texture) gl.deleteTexture(texture);
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        shaders.forEach(shader => gl.deleteShader(shader));
        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
    };
    s.releaseGL = dispose;
    try {
      canvas = element('canvas', 'living-warp', s.camera);
      const px = Math.min(1600, Math.max(800, Math.round((s.pic.clientWidth || 800) * (window.devicePixelRatio || 1))));
      canvas.width = px; canvas.height = Math.round(px * .75);
      canvas.setAttribute('aria-hidden', 'true');
      gl = canvas.getContext('webgl', {alpha: true, antialias: false, depth: false});
      if (!gl) throw Error('No WebGL');
      program = gl.createProgram();
      for (const [kind, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
        const shader = gl.createShader(kind); shaders.push(shader);
        gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error('Shader unavailable');
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error('Program unavailable');
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      const p = gl.getAttribLocation(program, 'p');
      gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
      const uniform = name => gl.getUniformLocation(program, name);
      const rects = new Float32Array(48), motions = new Float32Array(48), anchors = new Float32Array(24);
      s.data.regions.forEach((r, i) => {
        rects.set([r.x,r.y,r.rx,r.ry],i*4);
        motions.set([types.indexOf(r.type),r.amp,r.speed,0],i*4);
        anchors.set(r.direction || [1,0],i*2);
      });
      gl.uniform4fv(uniform('regions[0]'), rects);
      gl.uniform4fv(uniform('motion[0]'), motions);
      gl.uniform2fv(uniform('anchors[0]'), anchors);
      gl.uniform1i(uniform('count'), s.data.regions.length);
      const clock = uniform('time'), kick = uniform('kicks[0]');
      const image = new Image();
      image.onload = () => {
        if (current !== s) return;
        try {
          texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          if (gl.getError() !== gl.NO_ERROR) throw Error('Texture unavailable');
          const ratio = image.naturalWidth / image.naturalHeight;
          gl.uniform2f(uniform('fit'), Math.min(1,ratio/(4/3)),Math.min(1,(4/3)/ratio));
          s.drawWarp = t => {
            gl.uniform1f(clock,t); gl.uniform1fv(kick,s.kicks);
            gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
          };
        } catch (_) { canvas.remove(); dispose(); s.releaseGL = null; }
      };
      image.onerror = () => { if (current === s) { canvas.remove(); dispose(); s.releaseGL = null; } };
      image.src = href;
      canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); s.drawWarp = null; canvas.remove(); });
    } catch (_) {
      if (canvas) canvas.remove();
      dispose(); s.releaseGL = null;
    }
  }

  const colors = {dust:'#f9e4b3',petals:'#edb4a7',leaves:'#9dad66',sparks:'#ffc96d',steam:'#fff7df',fireflies:'#e4ed98'};
  function particle(source, burst = false) {
    return {type:source.type, x:source.x+(Math.random()-.5)*(source.width||40),
      y:source.y+(Math.random()-.5)*(source.height||30),
      vx:(Math.random()-.35)*(burst?40:8), vy:-(5+Math.random()*10)*(burst?2:1),
      life:burst?1.4:4+Math.random()*5, age:0, phase:Math.random()*6.28, burst};
  }
  function drawParticles(s, dt) {
    const ctx = s.ctx; if (!ctx) return;
    ctx.clearRect(0,0,800,600);
    s.particles = s.particles.filter(p => {
      p.age += dt;
      if(p.age >= p.life) {
        if(p.burst) return false;
        Object.assign(p,particle(p.source),{source:p.source});
      }
      p.x += p.vx*dt; p.y += p.vy*dt;
      const fade=Math.sin(Math.PI*p.age/p.life);
      ctx.globalAlpha=fade*(p.type==='steam'?.16:p.burst?.75:.48);
      ctx.fillStyle=colors[p.type];
      ctx.beginPath();
      const x=p.x+Math.sin(s.time*.7+p.phase)*6;
      if(p.type==='petals'||p.type==='leaves') ctx.ellipse(x,p.y,6,2.6,s.time*.4+p.phase,0,Math.PI*2);
      else ctx.arc(x,p.y,p.type==='steam'?5+p.age*1.3:p.type==='fireflies'?3:2.2,0,Math.PI*2);
      ctx.fill(); return true;
    });
    ctx.globalAlpha=1;
  }

  function clip(s) {
    if (!s.data.clip) return;
    const c = s.data.clip;
    const video = element('video','living-clip',s.camera);
    s.video=video; video.muted=true; video.defaultMuted=true;
    video.playsInline=true; video.preload='auto'; video.setAttribute('aria-hidden','true');
    video.style.transform=`translate(${c.x/8}%,${c.y/6}%) scale(${c.scale})`;
    video.src=c.src;
    const button=element('button','living-replay',s.pic);
    button.type='button'; button.textContent='Play again'; button.hidden=true;
    const finish = () => {
      // A clip whose actors end far from the painting rests on its last frame, so nobody ghosts back.
      if(!c.hold) video.classList.remove('is-playing');
      s.playing=false; s.clipDone=true; button.hidden=false;
    };
    s.finishClip=finish;
    s.playClip = () => {
      if(current!==s || s.paused || s.playing) return;
      s.playing=true; button.hidden=true;
      try {
        video.currentTime=0;
        const promise=video.play();
        if(promise) promise.catch(finish);
      } catch (_) { finish(); }
    };
    button.onclick=s.playClip;
    video.addEventListener('playing',() => { if(current===s && !s.paused) video.classList.add('is-playing'); });
    video.addEventListener('timeupdate',() => {
      if(!c.hold && video.duration && video.currentTime>video.duration-.65) video.classList.remove('is-playing');
    });
    video.addEventListener('ended',finish);
    video.addEventListener('error',() => {
      s.playing=false; s.clipDone=true; video.remove(); button.remove(); s.video=null; s.playClip=null;
    });
    s.button=button;
  }

  function edit(s) {
    if (typeof location === 'undefined' || new URLSearchParams(location.search).get('living') !== 'edit') return;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 800 600'); svg.setAttribute('class','living-edit');
    svg.setAttribute('aria-hidden','true');
    svg.innerHTML=s.data.regions.map((r,i)=>`<ellipse cx="${r.x}" cy="${r.y}" rx="${r.rx}" ry="${r.ry}"/><text x="${r.x}" y="${r.y}">${i+1} ${r.type}</text>`).join('')+
      s.data.focus.map((f,i)=>`<circle cx="${f.x}" cy="${f.y}" r="8"/><text x="${f.x+12}" y="${f.y}">P${i}</text>`).join('');
    s.camera.appendChild(svg);
  }

  function frame(s, now) {
    if(current!==s || s.paused) return;
    s.raf=requestAnimationFrame(t=>frame(s,t));
    if(now-s.last<32) return;
    const dt=Math.min(.08,(now-s.last)/1000); s.last=now; s.time+=dt;
    try {
      if(s.pic.closest('.sheet')?.inert || !s.pic.isConnected) { pause(s,true); return; }
      const points=s.data.focus;
      if(s.focusIndex===null) {
        const i=Math.floor(Math.max(0,s.time-5)/12)%points.length;
        s.target=points[i];
      }
      const f=s.target, z=Math.min(1.12,f.zoom||1.065);
      const desired={z,x:(400-f.x)*(z-1),y:(300-f.y)*(z-1)};
      const ease=1-Math.exp(-dt*.7);
      for(const k of ['x','y','z']) s.view[k]+=(desired[k]-s.view[k])*ease;
      s.camera.style.transform=`translate(${s.view.x/8}%,${s.view.y/6}%) scale(${s.view.z})`;
      for(let i=0;i<12;i++) s.kicks[i]*=Math.exp(-dt*2.8);
      if(s.drawWarp) s.drawWarp(s.time);
      drawParticles(s,dt);
      if(s.playClip && !s.clipDone && !s.playing && s.time>=.8) s.playClip();
    } catch (_) { stop(); }
  }
  function pause(s, yes) {
    s.paused=yes;
    cancelAnimationFrame(s.raf);
    if(yes) { if(s.video) s.video.pause(); }
    else {
      s.last=performance.now();
      if(s.playing && s.video) {
        try { const p=s.video.play(); if(p) p.catch(s.finishClip); }
        catch (_) { s.finishClip(); }
      }
      s.raf=requestAnimationFrame(t=>frame(s,t));
    }
  }
  function stop() {
    const s=current; current=null;
    if(!s) return;
    cancelAnimationFrame(s.raf);
    if(s.observer) s.observer.disconnect();
    document.removeEventListener('visibilitychange',s.visibility);
    if(s.video) { s.video.pause(); s.video.removeAttribute('src'); s.video.load(); }
    if(s.releaseGL) s.releaseGL();
    if(s.button) s.button.remove();
    if(s.scene && s.camera?.parentNode) s.pic.insertBefore(s.scene,s.next?.parentNode===s.pic?s.next:s.camera);
    if(s.camera) s.camera.remove();
  }
  function start() {
    if(!mounted || calm || reduced?.matches || document.documentElement.dataset.motion==='calm') return;
    const {pic,key}=mounted;
    if(!pic || typeof LIVING==='undefined' || !LIVING[key]) return;
    const scene=pic.querySelector('.scene'), image=scene?.querySelector('image');
    if(!image) return;
    const href=image.getAttribute('href');
    const s={pic,scene,next:scene.nextSibling,data:LIVING[key],time:0,last:performance.now(),focusIndex:null,
      kicks:new Float32Array(12),particles:[],view:{x:0,y:0,z:1},paused:false};
    current=s;
    try {
      s.camera=element('div','living-camera',pic);
      s.camera.style.backgroundImage=`url("${href}")`;
      s.camera.appendChild(scene);
      s.target=s.data.focus[0];
      warp(s,href);
      const particles=element('canvas','living-particles',s.camera);
      particles.width=800;particles.height=600;particles.setAttribute('aria-hidden','true');
      s.ctx=particles.getContext('2d');
      if(!s.ctx) particles.remove();
      for(const source of s.data.particles) for(let i=0;i<(source.count||8);i++) {
        const p=particle(source);p.source=source;p.age=Math.random()*p.life;s.particles.push(p);
      }
      clip(s); edit(s);
      s.visibility=()=>pause(s,document.hidden || s.offscreen);
      document.addEventListener('visibilitychange',s.visibility);
      if(typeof IntersectionObserver==='function') {
        s.observer=new IntersectionObserver(entries=>{s.offscreen=!entries[0].isIntersecting;s.visibility();});
        s.observer.observe(pic);
      }
      pause(s,!!document.hidden);
    } catch (_) { stop(); }
  }
  const api={
    mount(pic,key) {
      try {
        stop(); mounted=null;
        if(!pic) return;
        if(!key) key=pic.querySelector('image')?.getAttribute('href')?.match(/stories\/(\w+\/[^/]+)\.webp$/)?.[1];
        mounted={pic,key};start();
      } catch (_) { stop(); }
    },
    unmount() { stop();mounted=null; },
    focus(i) {
      const s=current;if(!s) return;
      s.focusIndex=Number.isInteger(i)&&i>=0 ? Math.min(i,s.data.focus.length-1) : null;
      if(s.focusIndex!==null) s.target=s.data.focus[s.focusIndex];
    },
    poke(x,y) {
      const s=current;if(!s || s.paused || !Number.isFinite(x+y)) return;
      s.data.regions.forEach((r,i)=>{if(Math.hypot((x-r.x)/(r.rx+60),(y-r.y)/(r.ry+60))<1.5)s.kicks[i]=1.5;});
      const source=s.data.particles.find(p=>Math.hypot(x-p.x,y-p.y)<100);
      const type=source?.type||'dust';
      if(s.particles.length<120)for(let i=0;i<10;i++)s.particles.push(particle({x,y,type,width:20,height:20},true));
    },
    setCalm(value) { if(calm===!!value) return;calm=!!value;stop();start(); }
  };
  if(reduced?.addEventListener) reduced.addEventListener('change',()=>{stop();start();});
  return api;
})();
