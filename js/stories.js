'use strict';
/* Story text and scenes. Each scene returns an array of SVG layers, back to
   front. Layers lift like pop-up paper and drift with the pointer. */

const crew = (ammuArms = 'down', mood) => {
  const id = 'crew' + (++uid);
  return `<clipPath id="${id}"><rect x="-200" y="-300" width="400" height="303"/></clipPath><g clip-path="url(#${id})">${at(-42, 44, 1, grandpa('paddle'))}${at(48, 34, 1, kid('#f25c3d', '#f4b72b', ammuArms, 'pig', mood))}</g>${canoe()}`;
};
const paddle = `<path d="M-14 -34 L-86 44" stroke="#c9a36a" stroke-width="6" stroke-linecap="round"/><ellipse cx="-92" cy="50" rx="9" ry="17" fill="#c9a36a" transform="rotate(42 -92 50)"/>`;

const K = { sky1: '#7fa3b3', sky2: '#c4dcd4', far: '#3f8f6a', near: '#57a86a', water: '#3f97a0', line: '#c9ece6' };
const farBank = (y, seed = 3) =>
  hills(y, 26, K.far, seed) + at(70, y + 4, .55, palm(200, 20)) + at(210, y - 4, .5, palm(210, -24)) + at(520, y, .5, palm(190, 26)) + at(735, y + 2, .6, palm(210, -20));

const T = { earth: '#5c4152', earthDay: '#b9855f', paddy: '#5f9d54' };
const meenu = (arms, mood) => kid('#2f9d63', '#f4b72b', arms, 'braid', mood);
const tamilFar = (y, sil, pad) =>
  at(610, y + 6, 1.1, gopuram(sil)) + hills(y + 10, 18, pad, 9) + at(90, y + 20, .6, palm(210, 18, sil, sil)) + at(200, y + 24, .5, palm(200, -20, sil, sil)) + at(760, y + 22, .55, palm(200, -16, sil, sil));

const C = { hill: '#7fbf8f', hill2: '#5fa87a', nightHill: '#3d6b6f', nightHill2: '#2f5560' };

const STORIES = [
  /* ============================ KERALA ============================ */
  {
    id: 'kerala', title: 'Ammu and the Monsoon Boat', place: 'A story from the backwaters of Kerala',
    ink: '#0f4b47', paper: '#f3fbf4', accent: '#f25c3d', length: 7, start: 'k1',
    cover: () => [
      sky(K.sky1, K.sky2) + at(600, 110, 1.3, cloud('#fff', .7)) + at(180, 150, 1, cloud('#fff', .6)),
      farBank(300),
      water(300, K.water, K.line) + at(560, 420, 1.5, paperBoat()),
      at(300, 520, 1.5, crew('up')) + rain('#eef8f8', 26),
    ],
    pages: {
      k1: {
        title: 'The first rain', next: 'k2',
        text: ['Pitter, patter. Pitter, patter.', 'The first monsoon rain was drumming on the roof tiles. Ammu pressed her nose to the window.', '“It’s here, Appooppa! The rain is here!”'],
        scene: () => {
          const id = 'win' + (++uid);
          return [
            sky('#6f93a5', '#b7d0cb') + at(170, 110, 1.4, cloud('#dfe9ea', .9)) +
            F('cloud', 'Rain cloud', 'Grumble, rumble! The cloud is full of rain.', 'thunder', 'shake', at(560, 110, 1.8, cloud('#5e7887')), [560, 105, 90]),
            hills(340, 50, K.far, 4) + at(80, 372, .9, palm(230, 26)) + at(715, 366, 1, palm(250, -34)),
            ground(372, K.near) + at(400, 486, 1.55, keralaHouse(true)) +
            `<clipPath id="${id}"><rect x="469" y="384" width="70" height="55"/></clipPath><g clip-path="url(#${id})">${at(504, 482, .85, kid('#f25c3d', '#f4b72b', 'up', 'pig', 'wow'))}</g>` +
            `<path d="M340 486 Q380 540 330 640 L500 640 Q450 540 460 486Z" fill="#d9b98a"/>`,
            `<ellipse cx="250" cy="548" rx="92" ry="18" fill="#8fc9cf"/>` + ripple(230, 548) +
            F('frog', 'Frog', 'Pokrom, pokrom! The frog loves the rain.', 'croak', 'hop', at(160, 556, 1.5, frog()), [160, 536, 46]) +
            at(730, 640, 1.5, banana()) +
            F('hibiscus', 'Hibiscus flower', 'A red hibiscus catches a raindrop.', 'drip', 'wiggle', at(640, 500, 1.5, hibiscus()), [640, 500, 44]),
            rain(),
          ];
        },
      },
      k2: {
        title: 'A boat of her own', next: 'k3',
        text: ['Ammu folded a sheet of old newspaper. Fold, fold, tuck. A little boat!', 'She set it on the canal behind the house.', '“Go and see the world,” she whispered.'],
        scene: () => [
          sky(K.sky1, K.sky2) + at(620, 90, 1.4, cloud('#e6efee', .9)) + at(200, 70, 1.1, cloud('#e6efee', .8)),
          farBank(290),
          water(290, K.water, K.line, 250) +
          F('lily', 'Water lily', 'An ambal, a water lily, opens to drink the rain.', 'bell', 'grow', at(640, 372, 1.5, lily()), [640, 364, 52]) +
          at(540, 330, .9, lily('#f8a9c4')) +
          F('fish', 'Fish', 'Splash! A little fish jumps up to look.', 'splash', 'jump', at(300, 440, 1.3, fish()), [300, 440, 46]) + ripple(300, 452) +
          F('boat', 'Paper boat', 'Bob, bob, bob. The little boat is ready.', 'pop', 'wiggle', at(460, 420, 1.6, paperBoat()), [460, 410, 56]) + ripple(460, 442),
          hills(530, 26, K.near, 8) + at(175, 560, 1.7, kid('#f25c3d', '#f4b72b', 'reach')) + at(50, 640, 1.5, palm(380, 50)) +
          at(700, 600, 1.3, banana('#3f9d5f')),
          rain('#eef8f8', 30),
        ],
      },
      k3: {
        title: 'Off it sails', next: 'k4',
        text: ['The canal tugged the little boat away.', '“Wait for me!” cried Ammu.', 'Appooppan untied his wooden canoe. “Hop in, Ammukutty. We will follow it together.”'],
        scene: () => [
          sky(K.sky1, K.sky2) + at(420, 80, 1.5, cloud('#e6efee', .9)),
          farBank(270, 6) + at(390, 268, .5, keralaHouse()),
          water(270, K.water, K.line) +
          `<path d="M110 420 V250" stroke="#6b4a32" stroke-width="7" stroke-linecap="round"/>` +
          F('kingfisher', 'Kingfisher', 'A ponman, a kingfisher, as blue as a jewel!', 'chirp', 'hop', at(108, 250, 1.3, kingfisher()), [112, 205, 50]) +
          F('ducks', 'Ducks', 'Quack, quack, quack. Three ducks in a wobbly line.', 'quack', 'wiggle', at(480, 330, .8, duck()) + at(545, 338, .7, duck()) + at(600, 346, .6, duck('#e9d9b0')), [540, 325, 80]) +
          at(690, 420, 1.2, paperBoat()) + ripple(690, 438),
          at(350, 510, 1.6, crew('reach', 'wow')) +
          F('paddle', 'Paddle', 'Swish, swoosh. Appooppan paddles the canoe.', 'splash', 'row', at(350, 510, 1.6, paddle), [230, 560, 50]),
          rain('#eef8f8', 22),
        ],
      },
      k4: {
        title: 'Through the green world', next: 'k5',
        text: ['They paddled past paddy fields shining like green glass, and past a great kettuvallam, a houseboat with a roof woven like a basket.', 'The paper boat bobbed on ahead.'],
        scene: () => [
          sky('#93b8c2', '#d6ead9') + at(200, 80, 1.3, cloud('#fff', .85)) + at(610, 110, 1, cloud('#fff', .8)),
          paddy(236, 70) + at(60, 300, .8, palm(240, 20)) + at(730, 300, .9, palm(250, -30)) +
          F('coconut', 'Coconut', 'Thud! A tender coconut plops down.', 'thud', 'drop', `<circle cx="712" cy="96" r="13" fill="#6f8f2e"/>`, [712, 96, 40]) +
          F('egret', 'Egret', 'A white egret stands very, very still.', 'chirp', 'hop', at(250, 300, .9, egret()), [255, 250, 52]),
          water(300, K.water, K.line) +
          F('houseboat', 'Houseboat', 'Pooom! goes the houseboat horn.', 'horn', 'wiggle', at(500, 420, 1.15, houseboat()), [500, 380, 120]) + ripple(500, 452),
          at(210, 560, 1.1, crew()) + at(660, 540, 1.4, paperBoat()) + ripple(660, 560),
          rain('#eef8f8', 12),
        ],
      },
      k5: {
        title: 'Two waterways',
        text: ['Where the canal split in two, the little boat spun around and around.', 'One way lay a quiet channel of pink water lilies. The other way lay the wide lake, where drums were beating.'],
        ask: 'Which way should the little boat go?',
        choice: [{ label: 'The quiet lily channel', to: 'k6a', icon: () => at(0, 8, .9, lily()) }, { label: 'The wide lake with the drums', to: 'k6b', icon: () => `<circle r="20" fill="#c2253a"/><circle r="13" fill="#f6e3b8"/><path d="M-24 -22 L-4 -4M24 -22 L4 -4" stroke="#6b4a32" stroke-width="5" stroke-linecap="round"/>` }],
        scene: () => [
          sky('#93b8c2', '#d6ead9') + at(400, 80, 1.3, cloud('#fff', .85)),
          hills(250, 20, K.far, 12) + at(40, 256, .5, palm(200, 16)) + at(770, 254, .5, palm(200, -16)),
          water(250, K.water, K.line) +
          `<path d="M250 250 L550 250 Q500 300 452 380 Q430 430 400 432 Q370 430 348 380 Q300 300 250 250Z" fill="#2f7a5c"/><path d="M262 244 L538 244 Q490 296 444 370 Q426 412 400 414 Q374 412 356 370 Q310 296 262 244Z" fill="${K.near}"/>` + at(400, 300, .8, palm(210, 10)) + at(350, 290, .5, banana()) +
          F('lilies', 'Lily channel', 'Pink lilies as far as you can see. Shhh, so quiet.', 'bell', 'wiggle',
            at(150, 330, .8, lily()) + at(80, 400, 1.1, lily('#f8a9c4')) + at(220, 420, 1, lily()) + at(130, 490, 1.3, lily('#f8a9c4')) + at(250, 350, .6, lily()), [150, 400, 110]) +
          F('drums', 'Far away boat', 'Boom, boom, boom! Something exciting is out on the lake.', 'drum', 'shake',
            at(660, 300, .26, snakeBoat()) + `<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"><path class="twinkle" d="M610 250 q8 -8 16 0"/><path class="twinkle" style="animation-delay:-1s" d="M650 234 q10 -10 20 0"/><path class="twinkle" style="animation-delay:-2s" d="M696 250 q8 -8 16 0"/></g>`, [660, 285, 90]),
          F('boat', 'Paper boat', 'Round and round! Which way, little boat?', 'pop', 'spin', at(400, 520, 1.7, paperBoat()), [400, 505, 64]) + ripple(400, 544),
        ],
      },
      k6a: {
        title: 'The lily channel', next: 'k7a',
        text: ['The lilies closed behind them like a curtain. It was so quiet they could hear the rain kiss the water.', 'Then, a squeak. A splash. Two shiny brown heads popped up.'],
        scene: () => [
          sky('#6f9b93', '#b5d6bf'),
          hills(250, 30, '#2f7a5c', 14) + at(110, 300, 1.3, tree('#2a7a55', '#37916a', 190)) + at(690, 300, 1.4, tree('#2a7a55', '#37916a', 200)) + at(400, 270, .8, tree('#2f8560', '#3c9c73', 160)),
          water(280, '#2f8279', '#bfe6dc') + at(120, 350, 1, lily()) + at(690, 380, 1.2, lily('#f8a9c4')) + at(300, 330, .8, lily('#f8a9c4')) + at(600, 320, .7, lily()) +
          F('frog', 'Frog on a lily pad', 'Pokrom! The frog has a lily pad all to himself.', 'croak', 'hop', at(210, 440, 1.2, lily('#2f8a57', 0)) + at(210, 440, 1.1, frog()), [210, 425, 48]) +
          at(380, 420, 1.3, paperBoat()) + ripple(380, 440) +
          F('otter1', 'Otter', 'Squeak! An otter pops up to look.', 'squeak', 'hop', at(520, 400, 1.3, otter()), [520, 375, 50]) +
          F('otter2', 'Another otter', 'Splash! Here is her friend.', 'splash', 'hop', at(640, 460, 1.1, otter()), [640, 438, 46]),
          at(210, 580, 1.3, crew('down', 'wow')),
          rain('#e2f3ee', 14),
        ],
      },
      k7a: {
        title: 'The otters’ boat', end: { id: 'otters', name: 'The otters’ boat' }, back: 'k5',
        text: ['A family of otters! The smallest pup climbed into the paper boat, and it held him, just barely.', 'Ammu laughed until her tummy hurt. “Keep it,” she said. “I can fold another one tomorrow.”', 'And the rain sang them all the way home.'],
        scene: () => [
          sky('#6f9b93', '#b5d6bf'),
          hills(250, 30, '#2f7a5c', 15) + at(90, 300, 1.3, tree('#2a7a55', '#37916a', 190)) + at(720, 300, 1.3, tree('#2a7a55', '#37916a', 190)),
          water(280, '#2f8279', '#bfe6dc') + at(110, 360, 1, lily()) + at(700, 350, 1, lily('#f8a9c4')) + at(300, 320, .7, lily()) +
          F('mama', 'Mother otter', 'Mama otter watches her brave little pup.', 'squeak', 'hop', at(630, 440, 1.4, otter()), [630, 412, 52]) +
          F('pup', 'Otter pup in the boat', 'The pup is the captain now!', 'pop', 'wiggle', at(430, 420, 2, paperBoat()) + at(482, 405, .85, otter(1)), [435, 400, 76]) + ripple(430, 446),
          F('ammu', 'Ammu', 'Ha ha ha! Ammu cannot stop laughing.', 'giggle', 'wiggle', at(200, 580, 1.3, crew('up')), [215, 500, 80]),
          rain('#e2f3ee', 12),
        ],
      },
      k6b: {
        title: 'The wide lake', next: 'k7b',
        text: ['The lake opened as wide as the sky. Boom, boom, boom went the drums.', 'And there, longer than the tallest coconut tree, came a snake boat with its tail curled high. A chundan vallam, practising for the big race!'],
        scene: () => [
          sky('#8fc0d0', '#e3f1dc') +
          F('sun', 'Sun', 'The sun peeks out to watch.', 'bell', 'grow', at(640, 110, .9, sunFace(42)), [640, 110, 70]) + at(560, 130, 1.5, cloud('#fff', .95)),
          hills(236, 12, K.far, 20) + at(100, 240, .35, palm(200, 16)) + at(160, 240, .3, palm(200, -16)) + at(700, 240, .35, palm(200, 16)) +
          F('birds', 'Birds', 'Whee! The birds race the boat.', 'chirp', 'fly', at(230, 130, 1, bird('#3b5560')) + at(280, 110, .8, bird('#3b5560')) + at(190, 100, .7, bird('#3b5560')), [235, 115, 70]),
          water(236, '#4aa3b0', '#d6f1ee') +
          F('snake', 'Snake boat', 'So many rowers, all dipping their oars together!', 'drum', 'wiggle', at(420, 390, 1.05, snakeBoat()), [420, 360, 150]) + ripple(200, 420) + ripple(620, 424),
          at(160, 590, 1.1, crew('up', 'wow')) + at(640, 540, 1.4, paperBoat()) + ripple(640, 560),
        ],
      },
      k7b: {
        title: 'Row, little boat!', end: { id: 'race', name: 'The snake boat race' }, back: 'k5',
        text: ['“Thi-thi-thara, thi-thi-thai!” sang the rowers, and all the oars dipped as one.', 'Their wave lifted the paper boat and carried it along beside them. “Look, Appooppa! My boat is racing too!”', 'And for one whole song, the smallest boat on the lake kept up with the biggest.'],
        scene: () => [
          sky('#8fc0d0', '#e3f1dc') + at(640, 100, .9, sunFace(42)) + at(200, 110, 1.2, cloud('#fff', .9)),
          hills(236, 12, K.far, 21) + at(90, 240, .35, palm(200, 16)) + at(720, 240, .35, palm(200, -16)),
          water(236, '#4aa3b0', '#d6f1ee') +
          F('rowers', 'Rowers', 'Thi-thi-thara, thi-thi-thai! sing the rowers.', 'drum', 'wiggle', at(400, 380, 1.3, snakeBoat()), [400, 340, 170]),
          `<path d="M120 500 q40 -22 80 0 t80 0 t80 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>` +
          F('boat', 'Paper boat', 'Zoom! The smallest boat on the lake.', 'pop', 'hop', at(250, 500, 1.8, paperBoat()), [250, 485, 66]) +
          F('ammu', 'Ammu', 'Go, little boat, go! cheers Ammu.', 'giggle', 'hop', at(620, 590, 1.2, crew('up')), [640, 510, 80]),
        ],
      },
    },
  },

  /* ============================ TAMIL NADU ============================ */
  {
    id: 'tamil', title: 'Meenu and the Morning Kolam', place: 'A story from a village in Tamil Nadu',
    ink: '#3a1f4d', paper: '#fff6ea', accent: '#c2253a', length: 6, start: 't1',
    cover: () => [
      sky('#3d3a7a', '#e88aa0', '#ffc48a') + stars(14, 3, 160),
      tamilFar(300, '#4a3f85', '#6a5a9a'),
      ground(330, T.earth) + kolam(400, 450, 64, true, kolamSun(400, 450)),
      at(130, 440, 1.5, meenu('up')) + at(680, 440, 1.5, paatti(), true),
    ],
    pages: {
      t1: {
        title: 'Before the sun', next: 't2',
        text: ['It was still dark when Meenu felt a gentle hand on her hair.', '“Wake up, kanna,” whispered Paatti. “The doorstep is waiting for us.”', 'Meenu rubbed her eyes. Today she would draw a kolam all by herself.'],
        scene: () => [
          sky('#1c1a47', '#3d3478', '#7a4f8f') + stars(26, 11, 300) + `<path d="M150 70 a40 40 0 1 0 40 60 a32 32 0 1 1 -40 -60Z" fill="#fff1b8"/>` +
          F('star', 'Star', 'A sleepy star winks goodnight.', 'twinkle', 'spin', at(600, 90, 1.3, star()), [600, 90, 44]),
          tamilFar(390, '#2a2760', '#2f2c66'),
          ground(424, '#3f2f52') + at(330, 520, 1.4, tamilHouse('#2a8088', true)) +
          F('lamp', 'Clay lamp', 'The little clay lamp glows warm and gold.', 'bell', 'grow', at(520, 492, 1.3, lamp()), [530, 470, 46]),
          at(60, 620, 1.3, tree('#1f5c48', '#28705a', 260)) + `<rect x="600" y="520" width="240" height="60" fill="#6a4f6e"/><rect x="592" y="510" width="250" height="14" rx="4" fill="#84658a"/>` +
          F('rooster', 'Rooster', 'Kokkarako! Time to wake up!', 'crow', 'hop', at(690, 512, 1.3, rooster()), [695, 455, 60]),
        ],
      },
      t2: {
        title: 'Dots first', next: 't3', tip: 'Tap each white dot to help draw the kolam.', allSay: 'The kolam is finished. How lovely!',
        text: ['Paatti sprinkled water on the ground and swept it smooth. She pinched white rice flour between her fingers.', '“Dots first,” she said. “Then a line that dances around them all.”'],
        scene: () => [
          `<rect x="-40" y="-40" width="880" height="400" fill="#2a8088"/>` + at(400, 330, 2.3, tamilHouse('#2a8088', true)),
          ground(330, T.earth) + `<ellipse cx="400" cy="470" rx="330" ry="130" fill="#4d3646"/>`,
          at(110, 455, 1.7, paatti('#8f1d4a', 'pinch')) + at(695, 455, 1.7, meenu('reach'), true) +
          `<path d="M196 470 q26 14 52 0 q-6 22 -26 22 q-20 0 -26 -22Z" fill="#b5532f"/><ellipse cx="222" cy="470" rx="26" ry="7" fill="#fffdf5"/>`,
          kolam(400, 470, 62),
        ],
      },
      t3: {
        title: 'Breakfast for the small ones', next: 't4',
        text: ['“Why rice flour, Paatti?”', '“So the ants and the sparrows can have breakfast,” said Paatti. “A kolam says welcome to everyone, even the littlest ones.”', 'And look, the guests were already arriving.'],
        scene: () => [
          sky('#4d3f7d', '#5c4152') + ground(120, T.earth) + `<rect x="-40" y="60" width="880" height="70" fill="#e9dcc0"/><g fill="#b5332f">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<rect x="${i * 84 - 30}" y="60" width="26" height="70"/>`).join('')}</g><rect x="-40" y="-40" width="880" height="100" fill="#2a8088"/>`,
          `<ellipse cx="400" cy="350" rx="340" ry="170" fill="#4d3646"/>` + kolam(400, 350, 74, true),
          at(120, 300, 1.5, meenu('up')) +
          F('squirrel', 'Squirrel', 'A striped squirrel sneaks a nibble.', 'squeak', 'hop', at(690, 250, 1.6, squirrel()), [690, 222, 56]),
          F('ants', 'Ants', 'Tiny ants carry tiny crumbs. Breakfast time!', 'pluck', 'wiggle', at(110, 520, 1.6, ants(6)), [200, 520, 100]) +
          F('sparrow', 'Sparrow', 'Chirp, chirp! Thank you for the rice flour.', 'chirp', 'hop', at(600, 540, 2, sparrow()), [605, 515, 56]) + at(700, 500, 1.4, sparrow(), true),
        ],
      },
      t4: {
        title: 'The middle of the kolam',
        text: ['There was a space left in the middle, just the right size for one more picture.', 'The sky was turning pink. Far away, a peacock called, “May-awe! May-awe!”'],
        ask: 'What should Meenu draw in the middle?',
        choice: [{ label: 'A peacock with a long tail', to: 't5a', icon: () => `<g transform="scale(1.1)">${kolamPeacock(8, 0)}</g>` }, { label: 'A big round sun', to: 't5b', icon: () => `<g transform="scale(1.2 1.7)">${kolamSun(0, 0)}</g>` }],
        scene: () => [
          sky('#3d3a7a', '#e88aa0', '#ffc48a') + stars(8, 4, 120) +
          F('glow', 'Pink sky', 'The sky is turning pink. The sun is almost here.', 'bell', 'grow', `<ellipse cx="330" cy="330" rx="150" ry="50" fill="#ffd9a0" opacity=".7"/>`, [330, 320, 80]),
          tamilFar(300, '#4a3f85', '#6a5a9a') +
          F('peacock', 'Peacock far away', 'May-awe! calls the peacock from far away.', 'peacock', 'hop', at(450, 318, .45, peacock()), [440, 300, 50]),
          ground(336, T.earth) + `<ellipse cx="400" cy="470" rx="330" ry="125" fill="#4d3646"/>` + kolam(400, 470, 62, true) +
          F('middle', 'Empty middle of the kolam', 'An empty spot, just the right size.', 'twinkle', 'spin', `<ellipse class="twinkle" cx="400" cy="470" rx="26" ry="17" fill="none" stroke="#ffe27a" stroke-width="4" stroke-dasharray="3 9" stroke-linecap="round"/>`, [400, 470, 34]),
          at(100, 470, 1.6, meenu('down', 'wow')) + at(705, 470, 1.6, paatti(), true),
        ],
      },
      t5a: {
        title: 'The peacock', next: 't6a',
        text: ['Meenu drew a small round body and a long, long tail with eyes like raindrops.', 'Just then a cool wind came hurrying over the paddy fields. Grey clouds piled up above the temple tower.'],
        scene: () => [
          sky('#5a5a8f', '#b99ab8', '#e8c3a8') +
          F('clouds', 'Grey clouds', 'Big grey clouds are rolling in.', 'thunder', 'shake', at(560, 110, 1.9, cloud('#6b6a94')) + at(380, 80, 1.4, cloud('#8584ad')), [500, 100, 120]) + at(160, 120, 1.2, cloud('#8584ad')),
          tamilFar(300, '#4a4580', '#5d7a5a'),
          ground(336, T.earth) + `<ellipse cx="400" cy="470" rx="330" ry="125" fill="#4d3646"/>` + kolam(400, 470, 62, true) +
          F('drawing', 'Kolam peacock', 'Meenu’s peacock has a long, curly tail.', 'twinkle', 'wiggle', kolamPeacock(408, 470), [400, 470, 40]),
          at(100, 470, 1.6, meenu('reach')) + at(705, 470, 1.6, paatti(), true) +
          F('leaves', 'Leaves in the wind', 'Whoosh! The wind tickles the leaves.', 'wind', 'fly', `<g fill="#3fa66b"><ellipse cx="560" cy="250" rx="16" ry="7" transform="rotate(-30 560 250)"/><ellipse cx="610" cy="280" rx="14" ry="6" transform="rotate(20 610 280)"/><ellipse cx="520" cy="290" rx="12" ry="5" transform="rotate(-10 520 290)"/></g><path d="M470 260 q30 -14 60 0M500 310 q30 -12 60 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`, [560, 275, 70]),
        ],
      },
      t6a: {
        title: 'The rain dance', end: { id: 'peacock', name: 'The rain dance' }, back: 't4',
        text: ['Down from the neem tree stepped a real peacock, a mayil! He looked at the kolam. He looked at the clouds. Then he opened his tail like a giant fan and danced.', 'Plip, plop, came the rain. “He liked your drawing,” said Paatti, and they danced too.', '“Tomorrow I will draw a new one,” said Meenu.'],
        scene: () => [
          sky('#5a5a8f', '#a99ab8') + at(560, 100, 1.9, cloud('#6b6a94')) + at(220, 90, 1.6, cloud('#7b7aa4')),
          tamilFar(300, '#4a4580', '#5d7a5a') + at(60, 420, 1.3, tree('#2f7a50', '#3c9463', 250)),
          ground(336, T.earth) + `<g opacity=".45">${kolam(400, 540, 50, true, kolamPeacock(406, 540))}</g>`,
          F('mayil', 'Peacock', 'Look at all the eyes on his tail!', 'peacock', 'dance', at(400, 450, 1.5, peacock(true)), [400, 360, 130]) +
          F('meenu', 'Meenu', 'Meenu twirls in the rain.', 'giggle', 'dance', at(130, 540, 1.6, meenu('up')), [130, 460, 70]) +
          F('paatti', 'Paatti', 'Even Paatti is dancing!', 'giggle', 'dance', at(680, 540, 1.6, paatti(), true), [680, 440, 80]),
          rain('#eef0fa', 40),
        ],
      },
      t5b: {
        title: 'The sun', next: 't6b',
        text: ['Meenu drew a big round sun with rays like sugarcane sticks.', 'As she finished, the real sun peeped over the paddy fields, and the whole street turned gold. From the yard came a bubbling sound.'],
        scene: () => [
          sky('#ff9f6b', '#ffd27a', '#fff0b8') +
          F('sun', 'Rising sun', 'Good morning, sun!', 'bell', 'grow', at(330, 310, 1.1, sunFace(46)), [330, 280, 80]),
          tamilFar(300, '#b5683f', T.paddy),
          ground(336, '#8a5f52') + `<ellipse cx="400" cy="470" rx="330" ry="125" fill="#7a5148"/>` + kolam(400, 470, 62, true) +
          F('drawing', 'Kolam sun', 'A kolam sun with rays like sugarcane.', 'twinkle', 'spin', kolamSun(400, 470), [400, 470, 40]),
          at(100, 470, 1.6, meenu('up')) +
          F('pot', 'Bubbling pot', 'Blub, blub. What is bubbling over there?', 'bubble', 'wiggle', at(700, 470, 1, pongalPot()), [700, 420, 70]),
        ],
      },
      t6b: {
        title: 'Pongalo Pongal!', end: { id: 'pongal', name: 'Pongal morning' }, back: 't4',
        text: ['It was Pongal morning! The new pot of rice and milk bubbled up, up, up and spilled over the rim.', '“Pongalo Pongal!” everyone shouted. The cow jingled her bells, because tomorrow would be the cows’ own festival day.', 'And Meenu’s kolam sun and the real sun smiled at each other all day long.'],
        scene: () => [
          sky('#8fd0e8', '#ffe9a8') + at(640, 110, 1.1, sunFace(50)) + at(200, 100, 1.2, cloud('#fff', .9)),
          tamilFar(300, '#7a8fb8', T.paddy),
          ground(336, T.earthDay) +
          F('cane', 'Sugarcane', 'Sweet, tall sugarcane for Pongal.', 'pluck', 'wiggle', at(60, 470, 1.5, sugarcane()), [60, 360, 70]) + at(760, 440, 1.2, sugarcane()) +
          F('cow', 'Cow', 'Jingle, jingle! Tomorrow is the cows’ own day.', 'moo', 'hop', at(640, 500, 1.5, cow(), true), [630, 440, 95]),
          at(160, 520, 1.5, paatti()) + at(270, 550, 1.5, meenu('up')) +
          F('pot', 'Pongal pot', 'Pongalo Pongal! The pot bubbles over!', 'bubble', 'hop', at(420, 570, 1.45, pongalPot(true)), [420, 480, 90]),
        ],
      },
    },
  },

  /* ============================ PUFF ============================ */
  {
    id: 'cloud', title: 'Puff, the Sleepy Little Cloud', place: 'A bedtime story for the very young',
    ink: '#2b2f66', paper: '#f7f4ff', accent: '#7a5cd6', length: 5, start: 'c1',
    cover: () => [
      sky('#3b3f8a', '#8f7fd0', '#f0a8c0') + stars(22, 8, 320),
      at(620, 150, 1, moonFace(54)),
      hills(470, 60, C.nightHill, 2) + hills(540, 40, C.nightHill2, 5),
      at(330, 300, 1.5, puff('yawn')),
    ],
    pages: {
      c1: {
        title: 'Not sleepy', next: 'c2',
        text: ['The sun was yawning. The sky turned pink, then purple.', 'All the big clouds had drifted off to bed. But Puff, the littlest cloud, was still wide awake.', '“Where do I sleep?” wondered Puff.'],
        scene: () => [
          sky('#b79be8', '#f7a8b8', '#ffd0a0') + at(660, 90, 1.1, cloud('#fff', .5)) + at(90, 120, .9, cloud('#fff', .45)) +
          F('sun', 'Sleepy sun', 'Yaaawn! Goodnight, says the sun.', 'yawn', 'shrink', at(150, 400, 1.3, sunFace(46, '#ffb84d', 'sleepy')), [150, 360, 80]),
          hills(440, 70, C.hill, 2) +
          F('birds', 'Birds', 'Home we go! sing the birds.', 'chirp', 'fly', at(590, 230, 1.2, bird('#5a4a8a')) + at(650, 205, 1, bird('#5a4a8a')) + at(700, 240, .8, bird('#5a4a8a')), [645, 222, 80]),
          hills(520, 40, C.hill2, 5) +
          F('flower', 'Flower', 'The flower folds its petals for the night.', 'bell', 'shrink', at(650, 520, 1.8, flower('#ff8fa3')), [650, 510, 50]) + at(120, 540, 1.4, flower('#ffd24d')) + at(720, 560, 1.2, flower('#fff')),
          F('puff', 'Puff', 'Puff is not sleepy. Not one bit!', 'pop', 'hop', at(400, 210, 1.3, puff()), [400, 205, 110]),
        ],
      },
      c2: {
        title: 'The tree', next: 'c3',
        text: ['Puff tried the top of a tree. Tickle, tickle went the leaves.', '“Hee hee! Too tickly!”', '“Hoo-hoo,” said the owl. “This is MY bed.”'],
        scene: () => [
          sky('#7a6fd0', '#c79be0', '#f5b0c0') + stars(8, 13, 200) +
          F('moon', 'Moon', 'The moon is just waking up.', 'bell', 'grow', at(680, 110, .6, moonFace(54)), [680, 110, 56]),
          hills(480, 50, C.hill2, 7),
          at(400, 640, 2.6, tree('#3f8f6a', '#4fa87d', 150)) +
          F('owl', 'Owl', 'Hoo-hoo! This is MY bed.', 'hoot', 'hop', at(510, 400, 1.4, owl()), [510, 360, 56]),
          F('puff', 'Puff', 'Hee hee hee! That tickles!', 'giggle', 'wiggle', at(400, 150, 1.3, puff('giggle')), [400, 150, 110]) +
          F('leaf', 'Tickly leaves', 'Tickle, tickle, tickle!', 'pluck', 'shake', `<g fill="#6fc394"><ellipse cx="300" cy="225" rx="20" ry="9" transform="rotate(-30 300 225)"/><ellipse cx="350" cy="215" rx="20" ry="9" transform="rotate(-70 350 215)"/><ellipse cx="450" cy="215" rx="20" ry="9" transform="rotate(70 450 215)"/><ellipse cx="500" cy="225" rx="20" ry="9" transform="rotate(30 500 225)"/></g>`, [300, 240, 44]),
        ],
      },
      c3: {
        title: 'The pond', next: 'c4',
        text: ['Puff tried the pond. Splish!', '“Brrr! Too wet!”', 'The frog laughed, ribbit, ribbit, and the fish blew a bubble goodnight.'],
        scene: () => [
          sky('#4f4aa8', '#8f7fd0', '#d9a0c8') + stars(16, 21, 240) + at(680, 100, .6, moonFace(54)),
          hills(400, 50, C.nightHill, 3),
          ground(420, '#3f7a6a') + `<ellipse cx="400" cy="510" rx="380" ry="110" fill="#5aa7c7"/><ellipse cx="400" cy="506" rx="360" ry="98" fill="#6fb9d6"/>` + ripple(400, 470) + ripple(380, 480) +
          F('frog', 'Frog', 'Ribbit, ribbit! laughs the frog.', 'croak', 'hop', at(160, 520, 1.3, lily('#2f8a57', 0)) + at(160, 520, 1.3, frog()), [160, 500, 52]) +
          F('fish', 'Fish', 'Blub. Goodnight! says the fish.', 'bubble', 'jump', at(640, 530, 1.4, fish('#ffb347')) + `<circle cx="686" cy="505" r="6" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="698" cy="486" r="4" fill="none" stroke="#fff" stroke-width="2"/>`, [650, 520, 56]),
          F('puff', 'Puff', 'Brrr! Too wet!', 'splash', 'shake', at(400, 400, 1.3, puff('brr')) + `<g fill="#bfe6f5"><path d="M330 470 q-7 14 0 20 q7 -6 0 -20Z"/><path d="M400 478 q-7 14 0 20 q7 -6 0 -20Z"/><path d="M470 470 q-7 14 0 20 q7 -6 0 -20Z"/></g>`, [400, 400, 110]),
        ],
      },
      c4: {
        title: 'One big yawn',
        text: ['Now the stars were coming out. One, two, three.', 'Puff gave a great big yawn. Up high, the moon was glowing. Down low, the hill looked soft and round.'],
        ask: 'Where should Puff go?',
        choice: [{ label: 'Up to the moon', to: 'c5a', icon: () => `<g transform="scale(.4)">${moonFace(54)}</g>` }, { label: 'Down to the hill', to: 'c5b', icon: () => `<path d="M-30 18 Q0 -34 30 18Z" fill="#5fa87a"/><g transform="translate(0 4) scale(.45)">${sheep(1)}</g>` }],
        scene: () => [
          sky('#232a66', '#4a4aa0', '#8f7fd0') + stars(24, 31, 330) +
          F('s1', 'First star', 'One!', 'twinkle', 'spin', at(150, 110, 1.5, star()), [150, 110, 44]) +
          F('s2', 'Second star', 'Two!', 'twinkle', 'spin', at(330, 70, 1.3, star()), [330, 70, 44]) +
          F('s3', 'Third star', 'Three! Three twinkly stars.', 'twinkle', 'spin', at(500, 130, 1.4, star()), [500, 130, 44]),
          at(670, 130, 1.1, moonFace(54)),
          hills(520, 20, C.nightHill, 40) + `<path d="M-40 640 Q60 380 260 400 Q440 420 520 640Z" fill="${C.nightHill2}"/>` + at(200, 430, 1.1, sheep()) + at(300, 450, .9, sheep(), true),
          at(430, 300, 1.3, puff('yawn')),
        ],
      },
      c5a: {
        title: 'Goodnight, Moon', end: { id: 'moon', name: 'A bed on the moon' }, back: 'c4',
        text: ['Puff floated up, up, up. The moon was warm and bright, like a night-light.', 'Puff curled up on the moon’s round cheek. “Goodnight, Moon.” “Goodnight, Puff.”', 'And the stars turned down their twinkle, just a little.'],
        scene: () => [
          sky('#1a1f52', '#2f3580', '#5a54a8') + stars(30, 51, 600) +
          F('star', 'Star', 'The stars turn down their twinkle. Shhh.', 'twinkle', 'shrink', at(130, 140, 1.6, star()), [130, 140, 46]),
          F('moon', 'Moon', 'Goodnight, Puff, whispers the moon.', 'bell', 'wiggle', at(400, 330, 2.5, moonFace(60)), [400, 400, 120]),
          F('puff', 'Puff', 'Shhh. Puff is fast asleep.', 'snore', 'grow', at(500, 215, 1.05, puff('sleep')) + `<text class="zzz" x="590" y="150" font-size="34" fill="#fff" font-family="Baloo 2, sans-serif" font-weight="800">z</text><text class="zzz" style="animation-delay:-1.2s" x="620" y="115" font-size="46" fill="#fff" font-family="Baloo 2, sans-serif" font-weight="800">z</text>`, [500, 210, 100]),
        ],
      },
      c5b: {
        title: 'Goodnight, Hill', end: { id: 'hill', name: 'A blanket for the hill' }, back: 'c4',
        text: ['Puff floated down, down, down. The hill was sleepy too, and a little bit chilly.', 'So Puff stretched out wide and tucked the hill in like a soft white blanket. “Goodnight, Hill.”', 'The sheep snuggled close, and everybody slept until morning.'],
        scene: () => [
          sky('#1a1f52', '#2f3580', '#5a54a8') + stars(26, 61, 300) +
          F('moon', 'Moon', 'The moon keeps watch all night.', 'bell', 'grow', at(660, 110, .9, moonFace(54)), [660, 110, 70]),
          hills(520, 30, C.nightHill, 44),
          `<path d="M-40 660 Q150 250 400 270 Q650 250 840 660Z" fill="${C.nightHill2}"/>` +
          F('sheep', 'Sheep', 'Baa... zzz. The sheep are dreaming.', 'snore', 'wiggle', at(250, 520, 1.5, sheep(1)) + at(560, 540, 1.3, sheep(1), true) + at(410, 570, 1.1, sheep(1)), [400, 520, 120]),
          F('puff', 'Puff the blanket', 'Puff is a soft, white blanket.', 'snore', 'grow', `<g transform="translate(400 300) scale(2.3 1.1)">${puff('sleep')}</g><text class="zzz" x="560" y="220" font-size="34" fill="#fff" font-family="Baloo 2, sans-serif" font-weight="800">z</text><text class="zzz" style="animation-delay:-1.2s" x="592" y="184" font-size="46" fill="#fff" font-family="Baloo 2, sans-serif" font-weight="800">z</text>`, [400, 300, 150]),
        ],
      },
    },
  },
];

const GROWNUPS = [
  ['Ammu and the Monsoon Boat', 'An invented story set in the Kerala backwaters. Appooppan is a Malayalam word for grandfather, and Ammukutty is an affectionate way to say “little Ammu”. A kettuvallam is a traditional houseboat with a woven roof. A chundan vallam is the long snake boat rowed in Kerala’s boat races, where rowers keep time with boat songs. Ponman is a Malayalam name for the kingfisher, and ambal for the water lily.'],
  ['Meenu and the Morning Kolam', 'An invented story set in a Tamil Nadu village. A kolam is a pattern drawn at the doorstep, traditionally with rice flour, often around a grid of dots. Paatti means grandmother and kanna is a term of endearment. Mayil is the Tamil word for peacock. Pongal is the harvest festival in which a pot of rice and milk is allowed to boil over, with the call “Pongalo Pongal!”. The day after is traditionally dedicated to cattle. The kolam here is a simplified drawing, not a specific traditional design.'],
  ['Puff, the Sleepy Little Cloud', 'A short bedtime story for the very youngest listeners, with counting, sounds to copy and two cosy endings.'],
];
