// A user leaves during a page turn, opens another book, then an old timer fires.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let timers=[],focuses=[];
class El {
 constructor(){this.style={setProperty(){},removeProperty(){}};this.dataset={};this.classList={add(){},remove(){},toggle(){}};this.listeners={};this.options=[];this.children=[];this.value='';}
 set innerHTML(v){this.html=v;this.children=[];}get innerHTML(){return this.html||'';}
 get firstElementChild(){return this.children[0];}get lastElementChild(){return this.children.at(-1);}
 setAttribute(k,v){this[k]=v;} addEventListener(k,fn){this.listeners[k]=fn;}replaceChildren(...v){this.options=v;}add(v){this.options.push(v);}focus(){focuses.push(this.html);}showModal(){}
 querySelector(s){return s==='.sheet'?this.children[0]||null:null;}
 insertAdjacentHTML(pos,html){const el=new El();el.html=html;el.parent=this;if(pos==='afterbegin')this.children.unshift(el);else this.children.push(el);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);}
}
const nodes=new Map(),get=s=>{if(!nodes.has(s))nodes.set(s,new El());return nodes.get(s);};
const ctx=vm.createContext({document:{querySelector:get,querySelectorAll:()=>[],documentElement:new El(),body:new El()},window:{},matchMedia:()=>({matches:true}),localStorage:{getItem:()=>null,setItem(){}},Option:function(text,value){this.value=value;},Sound:{setVolume(){},setMusicVolume(){},stop(){},setOn(){},fx(){},music(){}},Narrator:{state:'idle',voices:()=>[],init(){},load(){},stop(){},configure(){},play(){},pause(){},replay(){}},setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},addEventListener(){},scrollTo(){}});
for(const f of ['art','stories','paper-scenes','illustration','story-tamil-new','story-kerala-new','story-english-new','app'])vm.runInContext(fs.readFileSync('js/'+f+'.js','utf8'),ctx);
const open=id=>get('#books').onclick({target:{closest:()=>({dataset:{story:id}})}});
open('kerala');get('#next').onclick();assert.equal(get('#stage').children.length,2);
const stale=timers.at(-1);get('#home').onclick();open('tamil-lamps');
assert.match(get('#stage').firstElementChild.html,/One lamp left/);
get('#next').onclick();assert.equal(get('#stage').children.length,2);const current=timers.at(-1),focusCount=focuses.length;
stale();assert.equal(focuses.length,focusCount,'old book must not steal focus');
get('#next').onclick();assert.equal(get('#stage').children.length,2,'old timer must not unlock a current turn');
current();assert.equal(get('#stage').children.length,1);assert.match(get('#stage').firstElementChild.html,/Someone is missing/);
get('#next').onclick();assert.equal(get('#stage').children.length,2);
console.log('PASS: leaving mid-turn opens another story immediately; stale completion cannot steal focus, remove its page, or unlock its active transition.');
