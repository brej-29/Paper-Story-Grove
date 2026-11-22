const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
(async()=>{
 const files=new Set(['index.html','styles.css','assets/stories/library.webp']);
 const html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('styles.css','utf8');
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^(https?:|plugin:)/.test(m[1]))files.add(m[1]);
 for(const m of css.matchAll(/url\(['"]?([^'")]+)['"]?\)/g))files.add(m[1]);
 const ctx=vm.createContext({});for(const f of ['art','stories','illustration','story-tamil-new','story-kerala-new','story-english-new','living-pages'])vm.runInContext(fs.readFileSync('js/'+f+'.js','utf8'),ctx);
 for(const st of vm.runInContext('STORIES',ctx))for(const p of Object.values(st.pages))for(const m of p.scene().join('').matchAll(/href="([^"]+)"/g))files.add(m[1]);
 for(const entry of Object.values(vm.runInContext('LIVING',ctx)))if(entry.clip)files.add(entry.clip.src);
 for(const file of files){const response=await fetch('http://127.0.0.1:8000/'+file);assert.equal(response.status,200,file);assert.ok((await response.arrayBuffer()).byteLength>0,file+' empty');}
 console.log(`PASS: ${files.size} referenced HTML, script, style, font and image resources served successfully over HTTP.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
