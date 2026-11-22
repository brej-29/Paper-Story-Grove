const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const ctx=vm.createContext({});
for(const f of ['art','stories','illustration','story-tamil-new','story-kerala-new','story-english-new'])vm.runInContext(fs.readFileSync('js/'+f+'.js','utf8'),ctx);
const stories=vm.runInContext('STORIES',ctx).slice(3),allPaths=new Set(),allHashes=new Set();
let min=Infinity,max=0;
for(const story of stories){
 const paths=new Set();
 for(const p of Object.values(story.pages)){
  const images=[...p.scene().join('').matchAll(/<image[^>]*href="([^"]+)"/g)];
  assert.equal(images.length,1,'one full-frame painting per page');
  const file=images[0][1];assert.ok(fs.existsSync(file),file+' missing');
  assert.ok(!paths.has(file),file+' reused within story');paths.add(file);allPaths.add(file);
  const bytes=fs.readFileSync(file);assert.ok(bytes.length>20000,file+' empty');const hash=crypto.createHash('sha256').update(bytes).digest('hex');assert.ok(!allHashes.has(hash),'identical art repeated');allHashes.add(hash);
  const count=p.text.join(' ').trim().split(/\s+/).length;min=Math.min(min,count);max=Math.max(max,count);assert.ok(count<=40,story.id+'/'+p.title+' too wordy');
  assert.ok(!/[a-z]\?[a-z]/i.test(p.text.join(' ')),'damaged punctuation');
 }
 assert.equal(paths.size,8);
}
assert.equal(allPaths.size,24);assert.ok(fs.statSync('assets/stories/library.webp').size>20000);
console.log(`PASS: 24 unique painting paths and SHA-256 hashes, all local assets present; page text ${min}-${max} words; no damaged apostrophes.`);
