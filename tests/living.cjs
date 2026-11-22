'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});
for(const f of ['art','stories','illustration','story-tamil-new','story-kerala-new','story-english-new','living-pages'])
  vm.runInContext(fs.readFileSync(`js/${f}.js`,'utf8'),ctx);
const data=vm.runInContext('LIVING',ctx), stories=vm.runInContext('STORIES',ctx).slice(3),keys=[];
function point(p,label){assert.ok(Number.isFinite(p.x)&&p.x>=0&&p.x<=800,label+' x');assert.ok(Number.isFinite(p.y)&&p.y>=0&&p.y<=600,label+' y');}
for(const story of stories)for(const page of Object.values(story.pages)){
  const key=page.scene().join('').match(/stories\/(\w+\/[^/]+)\.webp/)[1];keys.push(key);
  const d=data[key];assert.ok(d,key+' missing');
  assert.equal(d.focus.length,1+page.text.length+(page.choice?3:0),key+' paragraph focuses');
  for(const f of d.focus){point(f,key);assert.ok(f.zoom>=1&&f.zoom<=1.12);}
  assert.ok(d.regions.length>0&&d.regions.length<=12,key+' region budget');
  for(const r of d.regions){point(r,key);assert.ok(['sway','flutter','breathe','flame','glow'].includes(r.type));assert.ok(r.rx>0&&r.ry>0&&r.amp>0&&r.amp<=5&&r.speed>0);assert.equal(r.direction.length,2);}
  for(const p of d.particles){point(p,key);assert.ok(['dust','petals','leaves','sparks','steam','fireflies'].includes(p.type));assert.ok(p.count>0&&p.count<=30);}
  if(key.startsWith('dragon/')){assert.ok(d.regions.every(r=>!['flame','glow'].includes(r.type)));assert.ok(d.particles.every(p=>p.type!=='sparks'));}
  if(d.clip){assert.ok(fs.existsSync(d.clip.src));assert.ok(fs.statSync(d.clip.src).size<2500000);assert.ok(d.clip.scale>0&&Number.isFinite(d.clip.x+d.clip.y));}
}
assert.equal(keys.length,24);assert.deepEqual(Object.keys(data).sort(),keys.sort());
const hero=['dragon/01','dragon/02','dragon/05a','dragon/05b','feast/02','feast/03','feast/05a','feast/06b','lamps/01','lamps/03','lamps/05a','lamps/05b'];
assert.deepEqual(Object.keys(data).filter(k=>data[k].clip).sort(),hero);
for(const k of hero)assert.ok(fs.statSync(data[k].clip.src).size<1500000,k+' clip too large');
console.log('PASS: 24 exact painting keys, paragraph focuses, bounded regions/particles, no dragon fire, 12 hero clips each under 1.5 MB.');

// Real engine lifecycle without WebGL, Canvas2D or a browser dependency.
class El {
  constructor(tag){this.tag=tag;this.children=[];this.style={};this.attrs={};this.listeners={};this.isConnected=true;this.classes=new Set();this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c)};}
  appendChild(el){el.remove();this.children.push(el);el.parentNode=this;return el;}
  insertBefore(el,before){el.remove();this.children.splice(this.children.indexOf(before),0,el);el.parentNode=this;}
  remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(e=>e!==this);this.parentNode=null;}
  querySelector(sel){if(sel==='image')return this.image||null;if(sel==='.scene')return this.scene||null;return null;}
  setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}removeAttribute(k){delete this.attrs[k];}
  addEventListener(k,fn){this.listeners[k]=fn;}getContext(){return null;}closest(){return this.sheet||{inert:false};}
  pause(){this.paused=true;}load(){}play(){this.plays=(this.plays||0)+1;this.paused=false;this.listeners.playing?.();return Promise.resolve();}
}
function fixture({reduced=false,broken=false}={}){
  const pic=new El(),scene=new El(),image=new El();image.setAttribute('href','assets/stories/dragon/02.webp');
  scene.image=image;pic.image=image;pic.scene=scene;pic.appendChild(scene);
  let n=0, raf=new Map(),media;
  const document={hidden:false,documentElement:{dataset:{motion:'full'}},createElement:tag=>{if(broken)throw Error('unavailable');return new El(tag);},listeners:{},addEventListener(k,f){this.listeners[k]=f;},removeEventListener(k){delete this.listeners[k];}};
  const sandbox=vm.createContext({document,performance:{now:()=>0},matchMedia:()=>media={matches:reduced,addEventListener(k,f){this.change=f;}},
    requestAnimationFrame:f=>{raf.set(++n,f);return n;},cancelAnimationFrame:i=>raf.delete(i)});
  vm.runInContext(fs.readFileSync('js/living-pages.js','utf8')+fs.readFileSync('js/living.js','utf8'),sandbox);
  const living=vm.runInContext('Living',sandbox);
  return {pic,scene,document,living,raf,media,step(t){const calls=[...raf.values()];raf.clear();calls.forEach(f=>f(t));}};
}
{
  const f=fixture();f.living.mount(f.pic);assert.equal(f.pic.children.length,2,'camera and replay button');
  assert.equal(f.raf.size,1,'fallback camera still renders without WebGL or 2D');
  f.step(100);const camera=f.scene.parentNode;assert.match(camera.style.transform,/scale\(1\.00/);
  const before=camera.style.transform;f.living.focus(2);f.step(150);assert.notEqual(camera.style.transform,before);
  f.living.poke(480,300);
  f.document.hidden=true;f.document.listeners.visibilitychange();assert.equal(f.raf.size,0);
  f.document.hidden=false;f.document.listeners.visibilitychange();assert.equal(f.raf.size,1);
  f.living.setCalm(true);assert.equal(f.pic.children.length,1);assert.equal(f.pic.children[0],f.scene);assert.equal(f.raf.size,0);
  f.living.setCalm(false);assert.equal(f.raf.size,1);f.media.matches=true;f.media.change();assert.equal(f.pic.children.length,1);f.media.matches=false;f.media.change();assert.equal(f.raf.size,1);
  f.living.mount(null);assert.equal(f.raf.size,0);assert.equal(f.pic.children.length,1);
  f.living.mount(f.pic);f.pic.sheet={inert:true};f.step(200);assert.equal(f.raf.size,0,'inactive sheet pauses');f.living.unmount();
}
for(const options of [{reduced:true},{broken:true}]){const f=fixture(options);assert.doesNotThrow(()=>f.living.mount(f.pic));assert.equal(f.pic.children.length,1);assert.equal(f.raf.size,0);}
console.log('PASS: no-WebGL/no-2D fallback, focus, poke, hidden/inert suspension, Calm removal/remount, reduced motion and engine-error recovery.');
{
  const f=fixture();f.living.mount(f.pic);const camera=f.scene.parentNode;
  const video=camera.children.find(e=>e.tag==='video'),button=f.pic.children.find(e=>e.tag==='button');
  for(let t=80;t<=1040;t+=80)f.step(t);
  assert.equal(video.plays,1,'automatic performance after 0.8 seconds');
  assert.ok(video.classes.has('is-playing'));
  video.duration=4;video.currentTime=3.5;video.listeners.timeupdate();assert.ok(!video.classes.has('is-playing'),'return crossfade starts before clip ends');
  video.listeners.ended();assert.equal(button.hidden,false);
  for(let t=1120;t<=2400;t+=80)f.step(t);
  assert.equal(video.plays,1,'performance never loops');button.onclick();assert.equal(video.plays,2,'explicit replay');
  f.document.hidden=true;f.document.listeners.visibilitychange();assert.equal(video.paused,true);
  f.document.hidden=false;f.document.listeners.visibilitychange();assert.equal(video.plays,3,'resume preserves current play');
  video.listeners.error();assert.equal(video.parentNode,null);assert.equal(button.parentNode,null);assert.equal(f.raf.size,1,'failed clip leaves ambient');
  f.living.unmount();assert.equal(f.raf.size,0);
}
{
  const f=fixture();f.living.mount(f.pic);f.media.matches=true;f.media.change();assert.equal(f.pic.children.length,1);
  f.media.matches=false;f.media.change();assert.equal(f.raf.size,1);f.living.unmount();
}
console.log('PASS: delayed one-shot clip, early return crossfade, no loop, explicit replay, visibility pause/resume, clip-error ambient fallback and live reduced-motion changes.');
