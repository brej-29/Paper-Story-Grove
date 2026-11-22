const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
let timers=new Map(),next=0,contexts=[];
class Param{constructor(){this.value=0;}setValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}setTargetAtTime(v){this.value=v;}cancelScheduledValues(){}}
class AudioContext{constructor(){this.currentTime=0;this.sampleRate=100;this.state='running';this.destination={};this.gains=[];this.oscs=[];contexts.push(this);}createGain(){const g={gain:new Param(),connect(){}};this.gains.push(g);return g;}createDelay(){return {delayTime:new Param(),connect(){}};}createBuffer(){return {getChannelData:()=>new Float32Array(200)}};createOscillator(){const o={frequency:new Param(),connect(){},start(){},stop(){}};this.oscs.push(o);return o;}createBiquadFilter(){return {frequency:new Param(),Q:new Param(),connect(){}}}createBufferSource(){return {connect(){},start(){},stop(){}}}suspend(){this.state='suspended';}resume(){this.state='running';}}
const ctx=vm.createContext({window:{AudioContext},setInterval(fn){timers.set(++next,fn);return next;},clearInterval(id){timers.delete(id)}});vm.runInContext(fs.readFileSync('js/sound.js','utf8'),ctx);const sound=vm.runInContext('Sound',ctx);
sound.music('tamil-lamps');const ac=contexts[0];assert.equal(ac.gains[0].gain.value,.22);assert.equal(ac.gains[1].gain.value,.12);
const signatures=[];
for(const id of ['tamil-lamps','kerala-feast','english-dragon']){sound.music(id);ac.oscs=[];for(const fn of timers.values())fn();signatures.push(ac.oscs.map(o=>o.frequency.value).join(','));assert.equal(timers.size,1);}
assert.equal(new Set(signatures).size,3,'music identities must differ');
sound.setVolume(0);assert.equal(ac.gains[0].gain.value,0);sound.setVolume(.2);assert.equal(ac.gains[0].gain.value,.2);sound.setMusicVolume(0);sound.music('kerala-feast');assert.equal(ac.gains[1].gain.value,0);
sound.setOn(false);assert.equal(timers.size,0);assert.equal(ac.state,'suspended');let count=ac.oscs.length;sound.fx('bell');assert.equal(ac.oscs.length,count);
sound.setOn(true);assert.equal(timers.size,1);sound.stop();assert.equal(timers.size,0);assert.equal(sound.want,null);assert.equal(ac.state,'suspended');
console.log('PASS: soft default gain, three distinct music identities, master/music volume zero, mute, resume and stop without leftover music timers.');
