#!/usr/bin/env node
'use strict';
// Usage: node scripts/prepare-clip.cjs raw.mp4 painting.webp [output.mp4]
// Development tools only: Node and ffmpeg. Alignment maps video onto 800 x 600.
const fs = require('node:fs'), path = require('node:path');
const {execFileSync} = require('node:child_process');
const [raw, painting, supplied] = process.argv.slice(2);
if (!raw || !painting) {
  console.error('Usage: node scripts/prepare-clip.cjs raw.mp4 painting.webp [output.mp4]');
  process.exit(1);
}
const output = supplied || painting.replace(/\.[^.]+$/, '.mp4');
if ([raw, painting].some(p => path.resolve(p) === path.resolve(output))) throw Error('Output must be a new file.');
const W = 200, H = 150;
function edges(file) {
  const bytes = execFileSync('ffmpeg', ['-v','error','-i',file,'-frames:v','1','-vf',`scale=${W}:${H}`,'-pix_fmt','gray','-f','rawvideo','-'], {maxBuffer: 1e7});
  const a = new Float32Array(W * H);
  for (let y=1;y<H-1;y++) for(let x=1;x<W-1;x++) {
    const i=y*W+x;
    a[i]=Math.hypot(bytes[i+1]-bytes[i-1],bytes[i+W]-bytes[i-W]);
  }
  return a;
}
const still=edges(painting), frame=edges(raw);
function score(scale,x,y) {
  let ab=0, aa=0, bb=0, n=0;
  for(let v=8;v<H-8;v+=3) for(let u=8;u<W-8;u+=3) {
    // Prefer scenery at the edges over the actor, who may already have moved.
    if(u>65 && u<145 && v>50 && v<125) continue;
    const px=Math.round((u-W/2)*scale+W/2+x), py=Math.round((v-H/2)*scale+H/2+y);
    if(px<2||px>=W-2||py<2||py>=H-2) continue;
    const a=frame[v*W+u], b=still[py*W+px];
    ab+=a*b; aa+=a*a; bb+=b*b; n++;
  }
  return n>500 ? ab/Math.sqrt(aa*bb || 1) : 0;
}
let best={score:-1,scale:1,x:0,y:0};
function search(s0,s1,ds,x0,x1,y0,y1,dxy) {
  for(let s=s0;s<=s1+.0001;s+=ds) for(let x=x0;x<=x1;x+=dxy) for(let y=y0;y<=y1;y+=dxy) {
    const q=score(s,x,y); if(q>best.score) best={score:q,scale:s,x,y};
  }
}
search(.80,1.08,.02,-14,14,-12,12,2);
const coarse={...best};
search(coarse.scale-.02,coarse.scale+.02,.002,coarse.x-2,coarse.x+2,coarse.y-2,coarse.y+2,.5);
fs.mkdirSync(path.dirname(output),{recursive:true});
const encode = crf => execFileSync('ffmpeg',['-v','error','-y','-i',raw,'-map','0:v:0','-an','-sn','-dn','-map_metadata','-1','-vf','scale=752:-2','-c:v','libx264','-preset','slow','-crf',String(crf),'-pix_fmt','yuv420p','-movflags','+faststart',output],{stdio:'inherit'});
encode(24);
if(fs.statSync(output).size>=1500000) encode(30);
if(fs.statSync(output).size>=1500000) { fs.unlinkSync(output); throw Error('Clip exceeds 1.5 MB. Trim the raw performance and retry.'); }
console.log(JSON.stringify({src:output.replaceAll('\\','/'),scale:+best.scale.toFixed(3),x:best.x*4,y:best.y*4},null,2));
console.log(`Alignment edge correlation ${best.score.toFixed(3)}; inspect the crossfade. ${fs.statSync(output).size} bytes, silent H.264.`);
