const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
for(const r of JSON.parse(fs.readFileSync('tests/preservation-baseline.json','utf8').replace(/^\uFEFF/,''))) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(r.path)).digest('hex').toUpperCase(),r.sha256,`${r.path} changed`);
const ctx=vm.createContext({});
for(const f of ['art','stories','illustration','story-tamil-new','story-kerala-new','story-english-new']) vm.runInContext(fs.readFileSync(`js/${f}.js`,'utf8'),ctx);
const stories=vm.runInContext('STORIES',ctx);
assert.equal(stories.length,6);assert.equal(new Set(stories.map(s=>s.id)).size,6);
assert.deepEqual(Array.from(stories.slice(0,3),s=>s.id),['kerala','tamil','cloud']);
let pages=0,ends=0,finds=0;
for(const st of stories){
 assert.ok(st.cover().join('').includes('<')); const visited=new Set();
 function walk(id,path=[]){assert.ok(!path.includes(id),'cycle');const p=st.pages[id];assert.ok(p,`${st.id}/${id}`);visited.add(id);assert.ok(p.title&&p.text.length);const svg=p.scene().join('');assert.ok(!/undefined|NaN/.test(svg),`${st.id}/${id} broken art`);const ids=[...svg.matchAll(/data-id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);assert.ok(ids.length>0);if(p.end){assert.equal(path.length+1,st.length);assert.ok(st.pages[p.back].choice);ends++;}else if(p.next)walk(p.next,[...path,id]);else {assert.equal(p.choice.length,2);for(const c of p.choice){assert.ok(c.label&&c.icon());walk(c.to,[...path,id]);}}}
 walk(st.start);assert.equal(visited.size,Object.keys(st.pages).length,'unreachable page');pages+=visited.size;
 for(const p of Object.values(st.pages))finds+=(p.scene().join('').match(/data-id=/g)||[]).length;
}
console.log(`PASS: original story/art SHA-256 unchanged; 6 stories, ${pages} pages, ${ends} reachable endings, ${finds} discoveries; all paths and SVG helpers valid.`);

