'use strict';
/* Cut-paper pieces use the same bottom-centre anchors as the original art kit. */
const PaperScenes = (() => {
  const repeat = (n, draw) => Array.from({length:n}, (_, i) => draw(i)).join('');
  const stroke = (d, ink, width = 3) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const shape = (d, ink) => `<path d="${d}" fill="${ink}"/>`;
  const oval = (x, y, rx, ry, ink) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${ink}"/>`;
  const floating = art => `<g class="bob">${art}</g>`;
  function kite(birdShape = false, torn = false) {
    const ribbons = stroke('M0 26Q15 67 -20 81T-39 134', '#b24c43', 4) +
      repeat(3, i => at([3,-15,-41][i], 55+i*28, 1,shape('M0 0l-12 -7 2 13 10 -6 12 7 -1 -13Z','#e39643')));
    const sail = birdShape
      ? shape('M-73 -37 Q-35 -43 0 -8 Q22 -38 72 -44 L53 -7 36 -12 24 10 9 11 0 34 -13 19 -33 15 -37 0 -54 2Z','#39897c') + shape('M-73 -37L0 5 72 -44 0 -8Z','#a2cf9e')
      : shape('M0 -51L45 -5 0 42 -46 -6Z','#db5b43') + shape('M0 -51L0 42 -46 -6Z','#ee9361') + stroke('M-43 -5Q0 -15 43 -5M0 -48V38','#ffe8b5',2);
    return `<g class="paper-kite">${ribbons}${sail}${torn ? shape('M42 -9l-19 5 9 -11 -17 6 17 -19Z','#f8e7bd') : at(5,-6,.5,star(16,'#ffdb7c'))}</g>`;
  }
  function moss(sneeze = false) {
    return shape('M-25 -52Q-72 -39 -102 -84Q-109 -97 -106 -72Q-96 -10 -35 -14Z','#387b61') +
      shape('M-35 -71Q-69 -134 -33 -157Q-40 -127 -13 -117Q-27 -145 -4 -160Q-3 -114 19 -97Z','#418e72') +
      stroke('M-34 -135Q-40 -111 -27 -88M-14 -125l9 31','#a1c685',3) +
      shape('M-55 -39Q-58 -93 -29 -111Q-7 -128 24 -106Q50 -90 36 -39Q34 -8 -5 -9Q-44 -5 -55 -39Z','#71a875') +
      oval(10,-57,20,36,'#e5d491') + oval(-34,-8,21,9,'#4c8664') + oval(22,-8,18,9,'#4c8664') +
      shape('M-25 -60Q-2 -51 22 -66L39 -21Q8 -8 -30 -23Z','#477d88') + stroke('M-8 -38q10 4 20 -2','#e7cf8e',2) +
      shape('M-23 -118l-7 -25 22 11 3 -27 16 23 10 -19 6 27Z','#e6b95f') +
      shape('M-31 -117Q-31 -142 1 -144Q27 -146 37 -125Q64 -125 72 -110Q79 -88 48 -84Q11 -73 -14 -89Q-30 -94 -31 -117Z','#79b280') +
      oval(39,-101,28,14,'#9cc18c') + oval(61,-113,3,2,'#3d6452') +
      (sneeze ? stroke('M3 -119l10 4 -10 3','#264e45',3) : `<g class="blink">${oval(9,-119,6,8,'#fff5da')}${oval(11,-118,3,5,'#294d44')}</g>`) +
      oval(-1,-104,7,4,'#d59777') + stroke('M25 -96q14 8 27 -1','#365f4f',2.5) +
      stroke('M-24 -78q10 17 28 12','#649b6f',13);
  }
  function mouse() {
    return stroke('M-11 -9Q-47 0 -44 -22Q-39 -35 -32 -28','#bf8272',4) +
      oval(0,-21,18,23,'#a27668') + shape('M-15 -24q16 5 29 -2l7 21q-20 8 -39 -1Z','#d79a41') +
      oval(-3,-49,14,15,'#a27668') + oval(-4,-50,9,9,'#e5b09d') +
      shape('M-10 -40Q0 -59 17 -45L35 -32Q21 -21 7 -24Q-9 -25 -10 -40Z','#bd9280') +
      oval(18,-39,2.5,3,'#483c37') + oval(34,-33,3,2.5,'#593d3c') +
      stroke('M25 -30l15 2M24 -27l12 6','#664b45',1.5);
  }
  function leaf(served = false) {
    return shape('M-70 2Q-30 -28 32 -18Q60 -14 72 3Q31 26 -22 18Q-42 14 -70 2Z','#4b8b58') +
      shape('M-70 2Q-12 -9 72 3Q24 24 -22 18Z','#639c62') + stroke('M-64 2Q0 -5 68 3','#c5d88f',2) +
      repeat(7,i=>stroke(`M${-46+i*15} 0l12 -11m-12 11 12 10`,'#a1c17b',1.4)) +
      (served ? oval(11,2,17,8,'#fff1cc') + oval(-18,-7,8,4,'#e5ac48') + oval(-35,-4,6,4,'#a44c32') + oval(44,-5,10,6,'#efc56d') : '');
  }
  const chair = () => shape('M-25 -67h46l-3 39 -39 2Z','#b78043') + stroke('M-25 -67l6 68M20 -66l-4 65M-18 -29h42l6 27','#714d38',6);
  const stool = () => stroke('M-26 -29l-6 28M25 -29l7 28','#805238',8) + oval(0,-32,36,8,'#b47848');
  const tray = () => oval(0,0,57,12,'#ab733f')+oval(0,-4,55,10,'#d9ae60');
  const bareLamp = () => shape('M-23 -9Q-2 3 27 -12Q16 10 -4 8Q-17 7 -23 -9Z','#ab533e') + oval(-1,-8,21,5,'#783f32');
  const bowl = () => shape('M-32 -12Q-27 14 0 14Q23 14 32 -12Z','#b88046') + oval(0,-12,32,8,'#eccc8a') + oval(-5,-13,3,2,'#98612e');
  function cabbage() {
    return shape('M0 3Q-34 9 -42 -15Q-44 -23 -28 -20Q-44 -52 -17 -42Q-7 -63 9 -45Q38 -52 31 -27Q58 -33 43 -11Q29 4 0 3Z','#568b66') +
      shape('M-35 -20Q-9 -23 0 1Q0 -30 38 -26Q28 -3 0 3Z','#8cb384') +
      stroke('M-24 -17Q-5 -12 0 1Q13 -16 29 -21M-14 -36Q-5 -30 -3 -20','#bdd198',2);
  }
  const spool = (thread) => oval(0,-2,17,5,'#916349') + shape('M-13 -28h26v25q-13 6 -26 0Z',thread) +
    repeat(5,i=>stroke(`M-12 ${-23+i*4}l24 -2`,'#ffe5b1',1.2)) + oval(0,-29,17,5,'#bf935e') + oval(0,-29,4,1.6,'#70523e');
  const chalkFlower = () => repeat(8,i=>`<g transform="rotate(${45*i})">${stroke('M0 -5Q-22 -40 0 -51Q21 -40 0 -5Z','#fde6bf',2.6)}${oval(0,-59,2.3,2.3,'#fde6bf')}</g>`);
  function flowerCarpet() {
    return oval(0,0,85,40,'#bf783f') + repeat(22,i=>{
      const angle=i*Math.PI/11;
      return oval(66*Math.cos(angle),27*Math.sin(angle),10,6,'#edb54b');
    }) + oval(0,0,48,21,'#9e5242') + repeat(9,i=>oval(30*Math.cos(i*.698),12*Math.sin(i*.698),9,5,'#f6d879')) + oval(0,0,14,7,'#e68e48');
  }
  function dev(arms) {
    return stroke('M-10 -21v20M10 -22v21',SKIN,8) + shape('M-20 -42h40l-2 25H4L0 -25 -3 -16h-17Z','#294f55') +
      shape('M-12 -70q12 -7 24 0l13 10 -6 13 -5 -4 4 15q-17 6 -37 0l5 -17 -7 6 -6 -12Z','#db9c36') +
      stroke(arms==='up'?'M-23 -54l-10 -15M22 -55l10 -16':'M-22 -53l-2 20M22 -52l12 9',SKIN,6) +
      oval(0,-87,21,22,SKIN) + shape('M-21 -84q-8 -24 9 -27l-2 -6 13 6q22 -6 24 17l-9 -5 -3 7 -7 -8q-9 9 -19 6Z',HAIR) + face(0,-86);
  }
  const anu = arms => kid('#cf5f59','#e6b54f',arms,'braid');
  const leela = arms => kid('#388d83','#f6c977',arms,'braid');
  const granny = () => paatti('#85527b','down');
  const bag = () => shape('M-18 -35L17 -37 23 -4Q3 5 -22 -2Z','#bf7950') + stroke('M-11 -35q0 -30 20 0','#704a39',4);
  const wheel = x => oval(x,0,23,23,'#4b4853') + oval(x,0,19,19,'#cca49a') + stroke(`M${x-17} 0h34M${x} -17v34`,'#786774',2);
  const bike = () => wheel(-38)+wheel(38)+stroke('M-38 0l22 -29 15 29h-37m37 0 29 -33 10 33m-9 -33 -4 -12h-11m-30 16 -5 -8h-9','#346e76',5);

  function garden(night, stage) {
    const y = 300;
    return [sky(night?'#343552':'#80bbaa',night?'#b98185':'#ffe8b8') +
      (night ? stars(26,8,185)+(stage===1?'':at(625,82,.5,moonFace(62))) : at(620,91,1,sunFace(43,'#ffd77e'))),
      hills(y,52,night?'#6e6881':'#90ad7c',17)+at(82,321,.75,palm(245,32))+
      at(711,310,.66,palm(231,-26))+hills(320,32,night?'#7a6e7d':'#799875',11),
      ground(315,night?'#c49384':'#d9b78a') + shape('M-10 402Q380 319 835 360L835 388Q395 354 -10 425Z',night?'#ab8079':'#c5a47d')+
      at(stage%2?112:635,335,.9,night?tamilHouse('#af7978',stage>1):keralaHouse(true))];
  }
  const mat = (x,y,w) => at(x,y,1,shape(`M0 0l${w} -5 20 48 -${w+30} 6Z`,'#c39155')+repeat(5,i=>stroke(`M0 ${6+i*9}l${w+6} -5`,'#e4c18a',2)));
  function shop(outside) {
    if (outside) return [sky('#85bec6','#ffeac2')+at(165,88,1.15,cloud('#fff1ce'))+at(640,130,.8,cloud('#fff7df')),
      hills(371,103,'#8cb59a',2)+hills(437,115,'#639d88',7),
      hills(502,52,'#adc080',1)+repeat(11,i=>at(i*82-8,566+(i%3)*13,.72+(i%3)*.12,cabbage()))];
    return [sky('#d9a46e','#f6d7a2') + repeat(11,i=>stroke(`M${i*82} -10q-7 140 0 310`,'#c89564',3)),
      shape('M-20 6L820 3 820 40 -20 55Z','#94623f') + shape('M44 69h195v196H44Z','#986645') +
      shape('M54 79h175v175H54Z','#a6d1ca')+at(146,166,.65,cloud('#ffefcb'))+
      stroke('M141 80v173M54 180h174','#ad7d50',7)+
      at(638,111,.55,kite(true))+at(729,125,.5,kite()) + stroke('M0 300h800','#94714c',12) +
      at(362,187,.72,spool('#ce7963')) + at(389,187,.89,spool('#537f7c')) + at(419,187,.64,spool('#e1ac51')) +
      shape('M317 187h142l-8 10H320Z','#875e42') + shape('M330 197l13 19v-19Zm88 0 13 19v-19Z','#a67a51'),
      ground(308,'#b9855c')+repeat(7,i=>stroke(`M-20 ${330+i*52}q430 -10 850 -5`,'#aa7854',2))];
  }
  const prop = (label, say, sound, anim, x, y, size, art, centre = -15) => ({label,say,sound,anim,x,y,size,art,centre});
  function drawProps(props) {
    return props.map((p,i)=> F('detail-'+i,p.label,p.say,p.sound,p.anim,
      at(p.x,p.y,p.size,p.art),[p.x,p.y+p.centre*p.size,Math.max(42,23*p.size)])).join('');
  }
  function tabletop(color, seam) {
    return shape('M-24 335Q408 296 826 313V640H-24Z',color) +
      repeat(7,i=>stroke(`M-20 ${342+i*43}Q314 ${310+i*43} 825 ${322+i*43}`,seam,2));
  }
  function feast(n) {
    const layers = garden(false,n);
    const rows = n>=6;
    layers.push(at(n===1?525:99,389,.91,flowerCarpet()) + at(18,533,.88,banana('#528863')));
    if(n===1) layers.push(at(84,462,.72,pongalPot(true)));
    layers.push(mat(44,477,700)+(rows?mat(239,347,460):'')+
      repeat(rows?3:5,i=>at(98+i*(rows?241:147),503,.91,leaf(n>=4)))+
      (rows?repeat(3,i=>at(295+i*158,370,.83,leaf(true))):''));
    const boy = (x,y,s) => prop('Dev','One more cousin, one more place!','giggle','hop',x,y,s,dev(n===1?'up':'down'),-63);
    const cousin = (x,y,s) => prop('Leela','There is room for me!','giggle','dance',x,y,s,leela(n===1?'up':'reach'),-58);
    const plate = (x,y,s) => prop('Banana leaf','Follow the middle line to the pointy end.','pluck','wiggle',x,y,s,leaf(n>=4),0);
    if (n===0 || n===5) {
      const first=n===0;
      const people = first ? [boy(315,441,3.04),prop('Grandmother','Pointy ends to the left.','bell','wiggle',586,416,2.02,granny(),-96)] :
        [boy(302,437,3.16),cousin(567,407,2.8)];
      const table = tabletop('#cba273','#bd916a')+at(122,437,1.42,leaf(!first))+at(652,403,1.32,leaf(!first));
      const food = first ? at(349,485,2.51,leaf()) : at(323,482,2.45,leaf(true))+
        at(549,457,1.67,bowl());
      const find = first ? F('detail-2','Banana leaf','Follow the middle line to the pointy end.','pluck','wiggle',food,[349,485,71]) :
        F('detail-2','Pappadam','CRUNCH!','giggle','pop',at(298,471,1.7,oval(0,0,29,19,'#f3c56d')+stroke('M-14 -11l8 5 -4 6 9 6','#d5a451',2)),[298,471,45]);
      return [layers[0],layers[1]+at(64,311,.7,keralaHouse(true)),drawProps(people),table+(first?'':food)+find];
    }
    const casts = {
      1: () => [boy(315,462,1.93),cousin(551,420,1.82),prop('Travel bag','Rustle! Leela is here.','pluck','hop',646,434,1.65,bag())],
      2: () => [boy(386,465,2.05),cousin(510,450,1.92),prop('Stool','Scoot the stool to make some room.','pluck','hop',237,494,1.7,stool())],
      3: () => [boy(190,417,1.8),cousin(585,466,2.1),plate(335,452,1.4)],
      4: () => [boy(243,461,1.78),cousin(360,461,1.86),plate(608,504,1.18)],
      6: () => [boy(216,467,1.94),cousin(539,332,1.31),plate(426,499,1.22)],
      7: () => [boy(195,468,1.99),cousin(556,334,1.54),prop('Sweet payasam','A sweet finish to lunch.','bell','grow',442,536,1.8,bowl())]
    };
    const cast = casts[n]();
    layers.push(drawProps(cast)); return layers;
  }
  function lamps(n) {
    const layers = garden(n>0,n);
    layers.push(at(n>=4&&n<=5?148:446,379,1.24,tamilHouse(n<2?'#c6866e':'#a6747b',n>=2))+
      shape('M0 490Q337 450 800 414L800 427Q344 470 0 506Z','#d9aa91')+
      at(768,500,1.25,banana('#486b65')));
    const line = repeat(n===0?4:8,i=>at(57+i*90,543-i*4,.77,n<2?bareLamp():lamp()));
    layers.push(line);
    layers.push(`<g transform="translate(389 547) scale(1.5 .54)">${chalkFlower()}</g>`);
    if(n>=2) layers.push(repeat(6,i=>at(68+i*127,123+(i%3)*36,.32,star(6,'#ffdf9b'))));
    const girl = (x,y,s) => prop('Anu','Wave a little hello.','giggle','hop',x,y,s,anu(n>3?'up':'reach'),-58);
    const elder = (x,y,s) => prop('Paatti','One by one, the lamps will glow.','bell','wiggle',x,y,s,granny(),-84);
    const visitor = (x,y,s) => prop('Revathi','Step, step, rustle! Home at last.','pluck','wiggle',x,y,s,paatti('#478780','down')+at(28,-48,.8,bag()),-84);
    const light = (x,y,s) => prop('Little clay lamp',n<4?'One little lamp is waiting.':'A little golden hello!','twinkle','grow',x,y,s,n<4?bareLamp():lamp());
    const seat = (x,y) => prop('Chair','A place for a friend.','pluck','hop',x,y,1.65,chair(),-39);
    if(n===0) {
      return [sky('#d49885','#f9d29c')+at(656,88,.74,sunFace(52,'#ffd88a')),
        tamilFar(253,'#8a7582','#b0a184')+at(36,329,1.02,tamilHouse('#ba7969')),
        drawProps([girl(263,420,2.9),elder(573,411,2.06)]),
        tabletop('#bb8269','#ad755f')+at(403,478,3.24,tray())+
        repeat(5,i=>at(261+i*66,462+(i%2)*8,1.3,bareLamp()))+
        F('detail-2','Last little lamp','One tiny lamp. One big welcome!','twinkle','grow',at(399,491,2.33,bareLamp()),[399,490,47])];
    }
    if(n===7) {
      const seated = at(0,0,1,paatti('#478780','down'))+
        shape('M-14 -58q-30 9 -40 21l-1 31 12 2 5 -26q24 3 46 -9l8 -19Z','#478780')+
        stroke('M-48 -7l-9 3M7 -4l-9 2',SKIN,6);
      return [sky('#282f50','#8e7083')+stars(35,12,235)+at(618,92,.77,moonFace(60)),
        tamilFar(298,'#484b64','#737288')+ground(309,'#a78078')+at(63,371,1.15,tamilHouse('#ac7780',true)),
        at(490,475,2.25,chair())+at(496,467,1.56,seated)+at(766,490,1.17,banana('#416865')),
        drawProps([girl(310,476,2.35),prop('Welcome sweets','A chair, a sweet, a little light.','bell','pop',408,495,1.31,tray()+oval(-14,-9,11,7,'#e4a04d')+oval(10,-10,11,8,'#e4a04d')),light(637,475,1.93)]),
        line+`<g transform="translate(339 569) scale(1.4 .48)">${chalkFlower()}</g>`];
    }
    const casts = {
      1: () => [girl(343,492,2.25),prop('Quiet house','Who will welcome her home?','bell','grow',640,316,1,tamilHouse('#76657b',false),-70),prop('Moon','The lane grows quiet.','twinkle','wiggle',221,121,.76,moonFace(40))],
      2: () => [girl(349,472,2.12),prop('Bicycle','Ding-ding!','bell','shake',650,414,1.38,bike()),light(184,485,1.4)],
      3: () => [elder(199,455,1.62),light(414,491,1.65),seat(575,437)],
      4: () => [girl(303,464,2.15),visitor(585,442,1.48),light(137,426,1.1)],
      5: () => [girl(380,477,2.18),visitor(509,468,1.69),light(232,503,1.49)],
      6: () => [seat(414,463),girl(266,482,2.03),elder(582,445,1.62)],
    };
    const cast = casts[n]();
    layers.push(drawProps(cast)); return layers;
  }
  function dragon(n) {
    const outside = n>=4 && n!==7, layers=shop(outside);
    const big = (x,y,s) => prop('Moss',n===1?'Ah… ah… ATCHOO!':'Tiny claws. Clever knots!','wind',n===1?'shake':'wiggle',x,y,s,moss(n===1),-94);
    const small = (x,y,s) => prop('Mouse','Squeak! Give a tiny mouse cheer.','squeak','hop',x,y,s,at(0,0,1,mouse(),x>300),-33);
    const sail = (x,y,s,b=false) => prop(b?'Paper bird':'Ribbon kite',b?'Spread your arms and swoop!':'Follow the ribbon with your finger.','wind','fly',x,y,s,kite(b,n===1));
    if(n===2) {
      return [layers[0],layers[1],drawProps([big(232,452,2.31),small(603,337,2.82)]),
        tabletop('#cda273','#b48a62')+at(139,413,1.52,spool('#bd7769'))+at(675,439,1.47,spool('#498d89'))+
        stroke('M674 437q-58 38 -101 10t-65 16','#4f8a7e',3)+
        shape('M245 452l146 -106 160 87 -142 85Z','#c96950')+shape('M245 452l146 -106 18 172Z','#e69264')+
        stroke('M248 451l299 -18M391 350l18 165','#f6d9a1',3)+
        F('detail-2','Paper patch','Press it down. Smooth the corners.','bell','grow',at(431,444,1.09,shape('M-26 -15l46 -8 5 35 -46 6Z','#edc667')+at(0,0,.69,star(15,'#fff0c0'))),[431,444,44])];
    }
    const casts = {
      0: () => [big(272,469,1.68),small(550,467,1.92),sail(506,304,.94)],
      1: () => [big(248,481,1.93),sail(536,162,1.17),small(598,474,1.85)],
      3: () => [big(385,395,1.57),sail(210,437,.72),sail(577,425,.8,true)],
      4: () => [big(321,495,1.55),small(141,508,1.81),sail(589,195,1.28)],
      5: () => [big(246,492,1.69),small(419,508,1.69),sail(644,130,1.07)],
      6: () => [big(252,490,1.59),small(452,510,1.81),sail(550,212,1.24,true)],
      7: () => [big(294,482,1.64),small(546,483,1.85),sail(450,185,.82,true)]
    };
    const cast = casts[n]();
    if(n===3) layers.push(mat(72,412,640));
    if(n===1) layers.push(at(428,265,.94,floating(shape('M-17 8Q-22 -13 19 -25Q22 -1 -17 8Z','#f2dfaa')+stroke('M-29 17l46 -38','#a58259',2))));
    if(outside) {const [m,,k]=cast; layers.push(stroke(`M${m.x+20} ${m.y-109}Q${k.x-125} ${k.y+220} ${k.x} ${k.y+16}`,'#5f7265',2));}
    if(n===7) layers.push(at(350,68,1,shape('M-107 -27h219v45h-219Z','#f9d9a1')+'<text text-anchor="middle" fill="#674e40" font-family="serif" font-size="18">KITES MENDED HERE</text>'));
    layers.push(drawProps(cast)); return layers;
  }
  function scene(kind,stage,variant) {
    const frame=stage+(stage>=4 && variant==='b'?2:0);
    return {lamps,feast,dragon}[kind](frame);
  }
  /* A pop-up book on the library table. The sky and characters rise from its fold. */
  function frontispiece() {
    const pages = shape('M23 353Q178 316 335 365Q498 305 668 315L719 406Q507 390 342 455Q185 404 15 433Z','#285a55')+
      shape('M29 341Q185 305 334 354Q489 292 658 303L706 394Q502 384 341 443Q179 394 23 418Z','#e6cba1')+
      shape('M35 327Q202 294 334 343L341 433Q192 379 25 405Z','#fbebc5')+
      shape('M334 343Q471 283 650 291L695 382Q496 375 341 433Z','#ffefd0')+
      stroke('M44 395Q187 369 326 418M356 415Q487 373 671 374','#c89965',2);
    return `<svg class="grove-art scene" aria-hidden="true" viewBox="0 0 750 480">${oval(380,438,317,15,'#e2cdac')}${pages}
      ${shape('M62 346Q197 273 283 305Q366 197 467 267Q554 189 654 286L680 362Q522 349 339 408Q196 364 62 377Z','#8ca97a')}
      ${at(510,314,.83,tree('#517f68','#729878',194))}${at(608,337,.9,palm(239,-29))}
      ${shape('M90 355Q209 311 325 346Q487 275 619 304Q508 324 446 349Q406 366 343 388Q232 351 90 365Z','#6aa69c')}
      ${at(477,319,.57,keralaHouse(true))}${at(221,342,1.19,moss())}${at(337,375,.99,mouse())}
      ${stroke('M235 263Q375 278 413 136T490 66','#946a52',2)}${at(493,65,.87,kite())}
      ${at(404,345,.91,floating(paperBoat()))}${at(362,114,.59,puff())}
      ${at(664,347,1.03,banana('#487a63'))}${at(110,363,.73,flower('#d98359'))}</svg>`;
  }
  return {scene,frontispiece};
})();
