// Exercise app wiring in a lightweight DOM fixture, independent of a speech engine.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
class El {
 constructor(){this.style={setProperty(){},removeProperty(){}};this.dataset={};this.classList={add(){},remove(){},toggle(){}};this.listeners={};this.options=[];this.value='';this.children=[];this.disabled=false;}
 set innerHTML(v){this.html=v;} get innerHTML(){return this.html||'';} setAttribute(k,v){this[k]=v;} addEventListener(k,fn){this.listeners[k]=fn;} replaceChildren(...v){this.options=v;} add(v){this.options.push(v);} focus(){} remove(){} showModal(){this.open=true;} getBoundingClientRect(){return {left:0,top:0,width:800,height:600};}
 querySelector(){return null;} insertAdjacentHTML(pos,html){const el=new El();el.html=html;this.children=[el];this.firstElementChild=el;this.lastElementChild=el;} }
const nodes=new Map();const get=s=>{if(!nodes.has(s))nodes.set(s,new El());return nodes.get(s)};get('#readSpeed').value='1';
const document={querySelector:get,querySelectorAll:()=>[],documentElement:new El(),body:new El()};let errors=[];
const ctx=vm.createContext({document,window:{},matchMedia:()=>({matches:true}),localStorage:{getItem:()=>null,setItem(){}},Option:function(text,value){this.text=text;this.value=value;},Sound:{setVolume(){},setMusicVolume(){},stop(){},setOn(){},fx(){},music(){}},setTimeout:()=>1,clearTimeout(){},addEventListener(){},scrollTo(){}});
for(const f of ['art','stories','paper-scenes','illustration','story-tamil-new','story-kerala-new','story-english-new','narration','living-pages','living','app'])vm.runInContext(fs.readFileSync(`js/${f}.js`,'utf8'),ctx,{filename:f+'.js'});
const stories=vm.runInContext('STORIES',ctx);assert.equal((get('#books').innerHTML.match(/class="book"/g)||[]).length,6);
for(const story of stories){get('#books').onclick({target:{closest:()=>({dataset:{story:story.id}})}});assert.equal(get('#reader').hidden,false);assert.ok(get('#stage').firstElementChild.html.includes(story.pages[story.start].title));get('#readPlay').onclick();assert.match(get('#readStatus').textContent,/No available voice/);get('#readReplay').onclick();get('#tRead').onclick();get('#tRead').onclick();get('#next').onclick();get('#home').onclick();assert.equal(get('#reader').hidden,true);}
console.log('PASS: app startup, six shelf entries, all story opening/next/home handlers, and controls without speech support; no runtime exceptions in DOM fixture.');

for(const story of stories) for(const branch of [0,1]) {
 get('#books').onclick({target:{closest:()=>({dataset:{story:story.id}})}});
 let id=story.start;
 while(!story.pages[id].end){const p=story.pages[id];if(p.next){get('#next').onclick();id=p.next;}else {const to=p.choice[branch].to;get('#stage').listeners.click({target:{closest:selector=>selector==='.choice'?{dataset:{to}}:null}});id=to;}}
 assert.ok(get('#stage').firstElementChild.html.includes(story.pages[id].end.name));
 get('#stage').listeners.click({target:{closest:selector=>selector==='[data-other]'?{}:null}});
 assert.ok(get('#stage').firstElementChild.html.includes(story.pages[story.pages[id].back].ask));
 get('#home').onclick();
}
console.log('PASS: all 12 ending routes and Try the other way handlers exercised through app events.');

for (const story of stories.filter(book => book.painted)) {
  for (const [pid, page] of Object.entries(story.pages)) {
    const drawing = page.scene(true).join('');
    assert.doesNotMatch(drawing, /<image|undefined|NaN/);
    assert.match(page.scene(false).join(''), /class="painting /);
    assert.deepEqual([...drawing.matchAll(/data-id="([^"]+)"/g)].map(m => m[1]).sort(),
      Array.from(story.findIds[pid]).sort());
  }
}
get('#paintEdition').checked = true;
get('#paintEdition').onchange();
assert.equal((get('#books').innerHTML.match(/class="book"/g) || []).length, 3);
assert.equal((get('#books').innerHTML.match(/class="painting /g) || []).length, 3);
get('#paintEdition').checked = false;
get('#paperEdition').onchange();
assert.equal((get('#books').innerHTML.match(/class="book"/g) || []).length, 6);
assert.doesNotMatch(get('#books').innerHTML, /class="painting /);
console.log('PASS: six paper books, three Higgsfield books and corresponding discovery IDs on all 24 alternate pages.');
