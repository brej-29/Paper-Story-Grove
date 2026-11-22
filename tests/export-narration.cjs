// Export exact written text into the same sentence sequence used by the reader.
const fs=require('fs'),vm=require('vm');
const ctx=vm.createContext({window:{}});
for(const f of ['art','stories','illustration','story-tamil-new','story-kerala-new','story-english-new','narration'])vm.runInContext(fs.readFileSync(`js/${f}.js`,'utf8'),ctx);
const records=vm.runInContext(`STORIES.flatMap(s=>Object.entries(s.pages).map(([id,p])=>({key:s.id+'/'+id,segments:Narrator.segments([p.title+'.',...p.text,...(p.ask?[p.ask,...p.choice.map(c=>c.label)]:[])]).map((x,i)=>({index:i,text:x.text,file:'audio/'+s.id+'/'+id+'/'+i+'.mp3'}))})))`,ctx);
process.stdout.write(JSON.stringify(records,null,2)+'\n');
