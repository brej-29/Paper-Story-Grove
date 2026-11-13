'use strict';
/* Paper-cut art kit. Every helper returns an SVG string drawn around a local
   origin (usually the feet / bottom centre). Scenes are 800 x 600. */

const SKIN = '#a05f38', SKIN2 = '#8c4f2c', HAIR = '#22130f';
let uid = 0;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const rng = seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const at = (x, y, s, inner, flip) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${inner}</g>`;

/* A tappable discovery. hit = [cx, cy, r] adds a generous invisible touch target. */
const F = (id, label, say, snd, anim, inner, hit, extra = '') =>
  `<g class="find" data-id="${id}" data-say="${esc(say)}" data-snd="${snd}" data-anim="${anim}" tabindex="0" role="button" aria-label="${esc(label)}" ${extra}>` +
  (hit ? `<circle cx="${hit[0]}" cy="${hit[1]}" r="${hit[2]}" fill="transparent"/>` : '') +
  `<g class="find-in">${inner}</g></g>`;

/* ---------- land, sky, water ---------- */
const sky = (a, b, c) => {
  const id = 'sky' + (++uid);
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="${c ? .6 : 1}" stop-color="${b}"/>${c ? `<stop offset="1" stop-color="${c}"/>` : ''}</linearGradient></defs><rect x="-40" y="-40" width="880" height="680" fill="url(#${id})"/>`;
};

const hills = (y, amp, fill, seed = 1) => {
  const r = rng(seed), p = [];
  for (let x = -50; x <= 850; x += 100) p.push([x, y - r() * amp]);
  let d = `M-50 660 L${p[0]}`;
  for (let i = 1; i < p.length; i++) d += ` Q${p[i - 1]} ${[(p[i - 1][0] + p[i][0]) / 2, (p[i - 1][1] + p[i][1]) / 2]}`;
  return `<path d="${d} L850 ${p.at(-1)[1]} L850 660Z" fill="${fill}"/>`;
};

const ground = (y, fill) => `<rect x="-40" y="${y}" width="880" height="${660 - y}" fill="${fill}"/>`;

const water = (y, fill, line, h = 600 - y) => {
  const r = rng(y + 7); let w = '';
  for (let i = 0; i < 16; i++) {
    const x = r() * 760, yy = y + 12 + r() * (h - 24);
    w += `<path class="wave" style="animation-delay:-${(r() * 6).toFixed(1)}s" d="M${x.toFixed(0)} ${yy.toFixed(0)} q10 -5 20 0 t20 0"/>`;
  }
  return `<rect x="-40" y="${y}" width="880" height="${h + 60}" fill="${fill}"/><g fill="none" stroke="${line}" stroke-width="3" stroke-linecap="round" opacity=".75">${w}</g>`;
};

const ripple = (x, y, c = '#fff') =>
  `<g fill="none" stroke="${c}" stroke-width="2.5" opacity=".7"><ellipse class="ripple" cx="${x}" cy="${y}" rx="26" ry="6"/><ellipse class="ripple" style="animation-delay:-1.2s" cx="${x}" cy="${y}" rx="26" ry="6"/></g>`;

const rain = (color = '#e8f4f6', n = 46, seed = 5) => {
  const r = rng(seed); let d = '';
  for (let i = 0; i < n; i++) { const x = r() * 900 - 50, y = r() * 600; d += `M${x.toFixed(0)} ${y.toFixed(0)}l-6 22`; }
  const g = `<path d="${d}"/>`;
  return `<g class="rain" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity=".7"><g>${g}</g><g transform="translate(0 -600)">${g}</g></g>`;
};

const cloud = (fill = '#fff', o = 1) =>
  `<g fill="${fill}" opacity="${o}"><circle cx="-34" cy="0" r="24"/><circle cx="0" cy="-16" r="32"/><circle cx="36" cy="-2" r="26"/><rect x="-58" y="-2" width="120" height="26" rx="13"/></g>`;

const stars = (n, seed, maxY = 300, c = '#fff6c9') => {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) s += `<circle class="twinkle" style="animation-delay:-${(r() * 4).toFixed(1)}s" cx="${(r() * 800).toFixed(0)}" cy="${(r() * maxY).toFixed(0)}" r="${(1.5 + r() * 2.2).toFixed(1)}" fill="${c}"/>`;
  return s;
};

const star = (r = 16, fill = '#ffe27a') => {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = Math.PI * i / 5 - Math.PI / 2, q = i % 2 ? r * .45 : r; d += `${i ? 'L' : 'M'}${(Math.cos(a) * q).toFixed(1)} ${(Math.sin(a) * q).toFixed(1)}`; }
  return `<path d="${d}Z" fill="${fill}" stroke="${fill}" stroke-width="3" stroke-linejoin="round"/>`;
};

const sunFace = (r = 46, fill = '#ffc93c', mood = 'smile') => {
  let rays = '';
  for (let i = 0; i < 12; i++) rays += `<path transform="rotate(${i * 30})" d="M0 ${-r - 8} l7 -20 l-14 0Z"/>`;
  const eyes = mood === 'sleepy'
    ? `<path d="M-18 -4 q7 6 14 0M4 -4 q7 6 14 0" fill="none" stroke="#7a4a12" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="16" rx="7" ry="9" fill="#7a4a12"/>`
    : `<g class="blink" fill="#7a4a12"><circle cx="-13" cy="-4" r="4"/><circle cx="13" cy="-4" r="4"/></g><path d="M-12 12 q12 12 24 0" fill="none" stroke="#7a4a12" stroke-width="3.5" stroke-linecap="round"/>`;
  return `<g><g class="spin-slow" fill="${fill}">${rays}</g><circle r="${r}" fill="${fill}"/><circle cx="-24" cy="10" r="7" fill="#ff8f6b" opacity=".5"/><circle cx="24" cy="10" r="7" fill="#ff8f6b" opacity=".5"/>${eyes}</g>`;
};

const moonFace = (r = 60, asleep) =>
  `<g><circle r="${r + 22}" fill="#fff3bf" opacity=".18"/><circle r="${r}" fill="#fff1b8"/><circle cx="${-r * .4}" cy="${-r * .35}" r="${r * .14}" fill="#f1dc92"/><circle cx="${r * .45}" cy="${r * .4}" r="${r * .1}" fill="#f1dc92"/><circle cx="${r * .3}" cy="${-r * .5}" r="${r * .07}" fill="#f1dc92"/>` +
  (asleep
    ? `<path d="M-22 -4 q8 7 16 0M6 -4 q8 7 16 0" fill="none" stroke="#8a6a2a" stroke-width="3" stroke-linecap="round"/>`
    : `<g class="blink" fill="#8a6a2a"><circle cx="-14" cy="-4" r="3.6"/><circle cx="14" cy="-4" r="3.6"/></g>`) +
  `<path d="M-10 14 q10 9 20 0" fill="none" stroke="#8a6a2a" stroke-width="3" stroke-linecap="round"/><circle cx="-26" cy="10" r="7" fill="#ffb38a" opacity=".5"/><circle cx="26" cy="10" r="7" fill="#ffb38a" opacity=".5"/></g>`;

/* ---------- plants ---------- */
const frond = (rot, flip, len, fill) =>
  `<path transform="${flip ? 'scale(-1 1) ' : ''}rotate(${rot}) scale(${len})" d="M0 0 Q48 -36 104 8 Q54 -8 0 0Z" fill="${fill}"/>`;

const palm = (h = 220, lean = 30, g1 = '#2f8a57', g2 = '#1f6b4f') =>
  `<g><path d="M-8 0 Q${lean * .15 - 5} ${-h * .5} ${lean - 4} ${-h} L${lean + 4} ${-h} Q${lean * .15 + 9} ${-h * .5} 9 0Z" fill="#7a5a3c"/>` +
  `<g transform="translate(${lean} ${-h})"><g class="sway">${frond(-62, 0, .85, g2)}${frond(-62, 1, .85, g2)}${frond(-30, 0, 1, g1)}${frond(-30, 1, 1, g1)}${frond(8, 0, .95, g2)}${frond(8, 1, .95, g2)}<circle cx="-7" cy="7" r="8" fill="#6f8f2e"/><circle cx="8" cy="9" r="8" fill="#5d7a2a"/></g></g></g>`;

const tree = (leaf = '#2f8f4e', leaf2 = '#3fa66b', h = 150) =>
  `<g><path d="M-10 0 L-6 ${-h * .6} L6 ${-h * .6} L10 0Z" fill="#6b4a32"/><g class="sway"><circle cx="-38" cy="${-h * .7}" r="42" fill="${leaf}"/><circle cx="36" cy="${-h * .72}" r="46" fill="${leaf}"/><circle cx="0" cy="${-h}" r="50" fill="${leaf2}"/><circle cx="-6" cy="${-h * .68}" r="40" fill="${leaf2}"/></g></g>`;

const banana = (g = '#3fa66b') =>
  `<g><path d="M-7 0 L-4 -70 L4 -70 L7 0Z" fill="#8fae4a"/><g class="sway" fill="${g}"><path d="M0 -64 Q-70 -120 -104 -52 Q-96 -30 -84 -34 Q-50 -62 0 -64Z"/><path d="M0 -64 Q70 -128 110 -60 Q104 -36 90 -40 Q52 -66 0 -64Z"/><path d="M0 -64 Q-40 -150 4 -176 Q34 -150 0 -64Z" fill="#57b877"/><path d="M0 -64 Q-50 -86 -92 -44M0 -64 Q52 -90 98 -50M0 -64 Q-12 -130 4 -170" fill="none" stroke="#2f8a57" stroke-width="2.5" opacity=".5"/></g></g>`;

const paddy = (y, h, a = '#8fcf5a', b = '#6fb847') => {
  let s = `<rect x="-40" y="${y}" width="880" height="${h}" fill="${a}"/>`;
  for (let i = 0; i < 5; i++) s += `<path d="M-40 ${y + 8 + i * (h / 5)} H840" stroke="${b}" stroke-width="5" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  return s;
};

const lily = (c = '#f48fb1', open = 1) =>
  `<g><ellipse cx="0" cy="6" rx="34" ry="11" fill="#2f8a57"/><path d="M0 6 L30 0 L26 12Z" fill="#2e7f8c" opacity=".001"/>` +
  `<g fill="${c}" transform="scale(${open})"><path d="M0 4 Q-22 -6 -24 -22 Q-8 -14 0 4Z"/><path d="M0 4 Q22 -6 24 -22 Q8 -14 0 4Z"/><path d="M0 4 Q-12 -16 0 -32 Q12 -16 0 4Z" fill="#fbc1d4"/></g><circle cx="0" cy="0" r="4" fill="#ffd24d"/></g>`;

const hibiscus = () => {
  let p = '';
  for (let i = 0; i < 5; i++) p += `<ellipse transform="rotate(${i * 72})" cx="0" cy="-13" rx="10" ry="14" fill="#e23b3b"/>`;
  return `<g><path d="M0 0 Q-4 30 -2 60" stroke="#2f8a57" stroke-width="5" fill="none"/><ellipse cx="-14" cy="34" rx="14" ry="7" fill="#2f8a57" transform="rotate(-20 -14 34)"/>${p}<circle r="5" fill="#8f1d2c"/><path d="M0 0 L10 -20" stroke="#ffd24d" stroke-width="3" stroke-linecap="round"/><circle cx="10" cy="-20" r="3.5" fill="#ffd24d"/></g>`;
};

const flower = (c = '#ff8fa3', closed) =>
  `<g><path d="M0 0 V46" stroke="#3f8f55" stroke-width="5" stroke-linecap="round"/><ellipse cx="10" cy="30" rx="11" ry="5" fill="#3f8f55"/>` +
  (closed ? `<ellipse cx="0" cy="-6" rx="9" ry="14" fill="${c}"/>`
    : [0, 60, 120, 180, 240, 300].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="-11" rx="7" ry="10" fill="${c}"/>`).join('') + `<circle r="6" fill="#ffd24d"/>`) + `</g>`;

const sugarcane = () =>
  `<g><g stroke="#7a4a8f" stroke-width="9" stroke-linecap="round" fill="none"><path d="M-12 0 L-22 -150"/><path d="M8 0 L12 -160"/></g><g stroke="#4f2f66" stroke-width="2"><path d="M-19 -40h10M-21 -80h10M-23 -120h10M4 -45h10M6 -90h10M7 -130h10"/></g><g fill="#3fa66b"><path d="M-22 -150 Q-60 -180 -70 -140 Q-46 -158 -22 -150Z"/><path d="M-22 -150 Q-10 -200 14 -196 Q-4 -176 -22 -150Z"/><path d="M12 -160 Q50 -200 64 -160 Q40 -172 12 -160Z"/><path d="M12 -160 Q0 -210 -20 -210 Q-2 -188 12 -160Z"/></g></g>`;

/* ---------- buildings & boats ---------- */
const keralaHouse = (lit) =>
  `<g><rect x="-110" y="-90" width="220" height="90" fill="#fbf1dc"/><rect x="-110" y="-12" width="220" height="12" fill="#b4472e"/>` +
  `<path d="M-140 -84 L-70 -150 L70 -150 L140 -84Z" fill="#9c3b25"/><path d="M-70 -150 L0 -186 L70 -150Z" fill="#b4472e"/><path d="M-122 -100h244M-104 -116h208M-88 -132h176" stroke="#7d2c1a" stroke-width="3" opacity=".6"/>` +
  `<rect x="-18" y="-64" width="36" height="64" rx="3" fill="#6b4a32"/><circle cx="10" cy="-30" r="2.5" fill="#f2b33d"/>` +
  `<rect x="44" y="-66" width="46" height="36" rx="3" fill="${lit ? '#ffd98a' : '#8fc4c8'}"/><path d="M59 -66v36M75 -66v36" stroke="#6b4a32" stroke-width="3"/><rect x="44" y="-66" width="46" height="36" rx="3" fill="none" stroke="#6b4a32" stroke-width="4"/>` +
  `<rect x="-92" y="-66" width="46" height="36" rx="3" fill="#8fc4c8"/><path d="M-77 -66v36M-61 -66v36" stroke="#6b4a32" stroke-width="3"/><rect x="-92" y="-66" width="46" height="36" rx="3" fill="none" stroke="#6b4a32" stroke-width="4"/></g>`;

const tamilHouse = (wall = '#3aa7a0', lit) =>
  `<g><rect x="-150" y="-150" width="300" height="150" fill="${wall}"/>` +
  `<path d="M-170 -150 L-150 -186 L150 -186 L170 -150Z" fill="#b5532f"/><path d="M-160 -168h320" stroke="#8a3a1e" stroke-width="3" opacity=".6"/>` +
  `<rect x="-170" y="-22" width="340" height="22" fill="#d9c7a3"/><rect x="-170" y="-22" width="340" height="6" fill="#c2253a"/>` +
  `<rect x="-26" y="-112" width="52" height="90" fill="#6b3f24"/><rect x="-32" y="-118" width="64" height="8" fill="#f4b72b"/><path d="M0 -112v90" stroke="#4d2c18" stroke-width="2"/>` +
  `<g fill="#2f8f4e">${[-26, -17, -8, 1, 10, 19].map(x => `<path d="M${x} -110 l4 12 l4 -12Z"/>`).join('')}</g>` +
  `<rect x="-116" y="-104" width="50" height="44" rx="3" fill="${lit ? '#ffd98a' : '#274a6b'}"/><path d="M-100 -104v44M-83 -104v44" stroke="#6b3f24" stroke-width="3"/><rect x="-116" y="-104" width="50" height="44" rx="3" fill="none" stroke="#f6eeda" stroke-width="5"/>` +
  `<rect x="66" y="-104" width="50" height="44" rx="3" fill="#274a6b"/><path d="M82 -104v44M99 -104v44" stroke="#6b3f24" stroke-width="3"/><rect x="66" y="-104" width="50" height="44" rx="3" fill="none" stroke="#f6eeda" stroke-width="5"/>` +
  `<rect x="-140" y="-150" width="12" height="128" fill="#f6eeda"/><rect x="128" y="-150" width="12" height="128" fill="#f6eeda"/></g>`;

const gopuram = (fill = '#3d356e') => {
  let s = '';
  for (let i = 0; i < 6; i++) { const w = 100 - i * 13, y = -30 - i * 24; s += `<path d="M${-w / 2} ${y + 24} L${-w / 2 + 6} ${y} L${w / 2 - 6} ${y} L${w / 2} ${y + 24}Z"/>`; }
  return `<g fill="${fill}"><rect x="-56" y="-8" width="112" height="8"/>${s}<path d="M-18 -150 Q-20 -176 0 -178 Q20 -176 18 -150Z"/><path d="M-9 -178v-10M0 -180v-12M9 -178v-10" stroke="${fill}" stroke-width="3" stroke-linecap="round"/></g>`;
};

const canoe = (fill = '#5a3b26') =>
  `<g><path d="M-112 -14 Q-70 24 0 24 Q70 24 112 -14 Q60 2 0 2 Q-60 2 -112 -14Z" fill="${fill}"/><path d="M-96 -4 Q-50 8 0 8 Q50 8 96 -4" fill="none" stroke="#3e2717" stroke-width="2.5" opacity=".6"/></g>`;

const paperBoat = (c = '#fffdf5') =>
  `<g><path d="M0 -34 L18 -6 L-18 -6Z" fill="${c}"/><path d="M0 -34 L0 -6" stroke="#c9c2ae" stroke-width="1.5"/><path d="M-34 -8 L34 -8 L20 12 L-20 12Z" fill="${c}"/><path d="M-34 -8 L0 2 L34 -8" fill="none" stroke="#c9c2ae" stroke-width="1.5"/><path d="M-12 5h8M0 7h10M-8 -16h5M4 -14h6" stroke="#9aa0a6" stroke-width="1.6" stroke-linecap="round"/></g>`;

const houseboat = () =>
  `<g><path d="M-170 -20 Q-150 26 -80 26 L90 26 Q150 26 176 -34 Q130 -6 80 -6 L-90 -6 Q-140 -6 -170 -20Z" fill="#4d3222"/>` +
  `<path d="M-120 -8 L-120 -50 Q-120 -96 -40 -96 L50 -96 Q120 -96 120 -50 L120 -8Z" fill="#d9a85a"/>` +
  `<g fill="none" stroke="#b07f38" stroke-width="2.5"><path d="M-120 -30h240M-120 -52h240M-112 -74h224M-80 -96v88M-40 -96v88M0 -96v88M40 -96v88M80 -96v88"/></g>` +
  `<rect x="-96" y="-58" width="40" height="30" rx="4" fill="#3b2a1e"/><rect x="-22" y="-58" width="40" height="30" rx="4" fill="#3b2a1e"/><rect x="52" y="-58" width="40" height="30" rx="4" fill="#3b2a1e"/><rect x="-92" y="-54" width="32" height="12" rx="3" fill="#ffd98a"/><rect x="-18" y="-54" width="32" height="12" rx="3" fill="#ffd98a"/><rect x="56" y="-54" width="32" height="12" rx="3" fill="#ffd98a"/></g>`;

const snakeBoat = () => {
  let men = '';
  for (let i = 0; i < 13; i++) {
    const x = -215 + i * 31;
    men += `<g transform="translate(${x} 0)"><g class="oar" style="animation-delay:-${(i % 2) * .08}s"><path d="M0 -14 L-16 26" stroke="#e9d9b0" stroke-width="4" stroke-linecap="round"/><ellipse cx="-17" cy="30" rx="5" ry="9" fill="#e9d9b0" transform="rotate(20 -17 30)"/></g><rect x="-7" y="-22" width="14" height="20" rx="6" fill="${i % 2 ? '#f4b72b' : '#fffdf5'}"/><circle cy="-30" r="8" fill="${SKIN2}"/><path d="M-8 -32 a8 8 0 0 1 16 0Z" fill="${HAIR}"/></g>`;
  }
  return `<g><path d="M-290 -6 Q-240 22 -120 22 L200 22 Q262 20 288 -28 Q310 -78 296 -138 Q286 -84 250 -40 Q226 -10 190 -6 L-250 -6Z" fill="#2a1b14"/>` +
    `<path d="M296 -138 Q286 -84 250 -40" fill="none" stroke="#f2b33d" stroke-width="5" stroke-linecap="round"/><circle cx="296" cy="-140" r="7" fill="#f2b33d"/><circle cx="276" cy="-92" r="4" fill="#f2b33d"/><circle cx="260" cy="-62" r="4" fill="#f2b33d"/>` +
    `<path d="M-4 -6 V-110" stroke="#e9d9b0" stroke-width="4"/><path d="M-44 -104 Q-4 -150 36 -104Z" fill="#c2253a"/><path d="M-44 -104 q8 10 16 0 q8 10 16 0 q8 10 16 0 q8 10 16 0 q8 10 16 0" fill="none" stroke="#f2b33d" stroke-width="4"/>` +
    men + `<path d="M-290 -6 Q-240 22 -120 22 L200 22 Q250 20 276 -10 L-250 -2Z" fill="#2a1b14"/><path d="M-240 8 H220" stroke="#f2b33d" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/></g>`;
};

const pongalPot = (boil) =>
  `<g><rect x="-52" y="-16" width="26" height="16" rx="3" fill="#a5492c"/><rect x="26" y="-16" width="26" height="16" rx="3" fill="#a5492c"/><rect x="-14" y="-12" width="28" height="12" rx="3" fill="#8a3a1e"/>` +
  `<g class="flame"><path d="M-22 -8 Q-30 -30 -14 -44 Q-14 -28 -4 -34 Q-2 -52 8 -58 Q6 -40 18 -34 Q30 -24 22 -8Z" fill="#ff8a2a"/><path d="M-10 -8 Q-14 -24 -2 -32 Q0 -22 8 -24 Q14 -16 10 -8Z" fill="#ffd24d"/></g>` +
  `<path d="M-50 -60 Q-58 -18 0 -16 Q58 -18 50 -60 Q46 -92 0 -92 Q-46 -92 -50 -60Z" fill="#c96a3b"/><path d="M-40 -66 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0" fill="none" stroke="#fffdf5" stroke-width="3"/><circle cx="-20" cy="-46" r="3" fill="#fffdf5"/><circle cx="0" cy="-42" r="3" fill="#fffdf5"/><circle cx="20" cy="-46" r="3" fill="#fffdf5"/>` +
  `<path d="M-30 -92 Q-34 -104 0 -104 Q34 -104 30 -92 Q0 -84 -30 -92Z" fill="#a5492c"/>` +
  `<g fill="#3fa66b"><path d="M-30 -94 Q-66 -110 -74 -80 Q-52 -96 -30 -94Z"/><path d="M30 -94 Q66 -112 76 -82 Q52 -96 30 -94Z"/></g><path d="M-30 -96 Q0 -88 30 -96" fill="none" stroke="#f4b72b" stroke-width="4"/>` +
  (boil ? `<g class="boil" fill="#fffdf5"><circle cx="-18" cy="-106" r="14"/><circle cx="4" cy="-114" r="18"/><circle cx="24" cy="-104" r="13"/><path d="M-32 -100 Q-44 -70 -38 -56 Q-30 -70 -28 -96Z"/><path d="M34 -98 Q46 -74 40 -62 Q32 -76 30 -94Z"/></g>` : '') + `</g>`;

const lamp = () =>
  `<g><path d="M-18 -8 Q0 8 18 -8 Q22 -12 28 -12 Q20 6 0 6 Q-16 6 -18 -8Z" fill="#b5532f"/><ellipse cx="0" cy="-8" rx="18" ry="5" fill="#8a3a1e"/><g class="flame"><path d="M22 -12 Q14 -28 24 -40 Q34 -26 26 -12Z" fill="#ffb02e"/><path d="M23 -13 Q19 -22 24 -30 Q29 -22 25 -13Z" fill="#fff1b8"/></g><circle class="glow" cx="24" cy="-26" r="34" fill="#ffd98a" opacity=".22"/></g>`;

/* ---------- people ---------- */
const face = (x, y, mood) =>
  `<g transform="translate(${x} ${y})">` +
  (mood === 'sleepy'
    ? `<path d="M-11 1 q4 4 8 0M3 1 q4 4 8 0" fill="none" stroke="#2a1710" stroke-width="2.2" stroke-linecap="round"/>`
    : `<g class="blink" fill="#2a1710"><circle cx="-7" cy="1" r="2.4"/><circle cx="7" cy="1" r="2.4"/></g>`) +
  (mood === 'wow'
    ? `<ellipse cx="0" cy="10" rx="4" ry="5" fill="#5a2414"/>`
    : `<path d="M-5 8 q5 5 10 0" fill="none" stroke="#5a2414" stroke-width="2.2" stroke-linecap="round"/>`) +
  `<circle cx="-12" cy="7" r="3.6" fill="#e0523f" opacity=".35"/><circle cx="12" cy="7" r="3.6" fill="#e0523f" opacity=".35"/></g>`;

const kid = (dress = '#f25c3d', trim = '#f4b72b', arms = 'down', hair = 'pig', mood) => {
  const arm = {
    down: 'M-11 -52 q-12 10 -13 24M11 -52 q12 10 13 24',
    up: 'M-11 -52 q-16 -8 -19 -27M11 -52 q16 -8 19 -27',
    reach: 'M-11 -52 q-12 10 -13 24M11 -52 q16 6 27 14',
  }[arms];
  const long = hair === 'braid';
  return `<g><path d="M-6 -24v22M6 -24v22" stroke="${SKIN}" stroke-width="7" stroke-linecap="round"/>` +
    (long
      ? `<path d="M-13 -60 Q0 -68 13 -60 L24 -6 Q0 2 -24 -6Z" fill="${dress}"/><path d="M-23 -12 L-24 -6 Q0 2 24 -6 L23 -12 Q0 -4 -23 -12Z" fill="${trim}"/><path d="M-13 -60 Q0 -68 13 -60 L15 -44 Q0 -38 -15 -44Z" fill="${trim}"/>`
      : `<path d="M-13 -60 Q0 -68 13 -60 L22 -20 Q0 -12 -22 -20Z" fill="${dress}"/><path d="M-21 -26 L-22 -20 Q0 -12 22 -20 L21 -26 Q0 -18 -21 -26Z" fill="${trim}"/>`) +
    `<path d="${arm}" fill="none" stroke="${SKIN}" stroke-width="6.5" stroke-linecap="round"/>` +
    (long
      ? `<path d="M13 -86 q17 14 9 44" stroke="${HAIR}" stroke-width="8" fill="none" stroke-linecap="round"/><g fill="#fffdf5"><circle cx="19" cy="-82" r="3.2"/><circle cx="24" cy="-76" r="3.2"/><circle cx="26" cy="-69" r="3.2"/></g>`
      : `<circle cx="-21" cy="-76" r="8" fill="${HAIR}"/><circle cx="21" cy="-76" r="8" fill="${HAIR}"/><circle cx="-15" cy="-83" r="3.6" fill="${trim}"/><circle cx="15" cy="-83" r="3.6" fill="${trim}"/>`) +
    `<circle cy="-80" r="19" fill="${SKIN}"/><path d="M-19 -82 a19 19 0 0 1 38 0 q-9 -9 -19 -8 q-10 -1 -19 8Z" fill="${HAIR}"/>` +
    (long ? `<circle cy="-88" r="2.2" fill="#c2253a"/>` : '') + face(0, -80, mood) + `</g>`;
};

const grandpa = (arms = 'down') =>
  `<g><path d="M-17 -64 L17 -64 L21 0 L-21 0Z" fill="#fbf6e6"/><path d="M-21 -7 L21 -7 L21 0 L-21 0Z" fill="#d9a520"/><path d="M0 -64V-7" stroke="#e6dcc0" stroke-width="2"/>` +
  `<path d="M-19 -108 Q0 -116 19 -108 L18 -60 L-18 -60Z" fill="#6fb0a2"/>` +
  `<path d="${arms === 'paddle' ? 'M-16 -100 q-18 14 -8 34M16 -100 q20 8 24 26' : 'M-16 -100 q-14 16 -12 40M16 -100 q14 16 12 40'}" fill="none" stroke="${SKIN2}" stroke-width="7.5" stroke-linecap="round"/>` +
  `<circle cy="-130" r="21" fill="${SKIN2}"/><path d="M-21 -134 a21 21 0 0 1 42 0 q-6 -13 -21 -13 q-15 0 -21 13Z" fill="#f0eee8"/><circle cx="-20" cy="-131" r="6" fill="#f0eee8"/><circle cx="20" cy="-131" r="6" fill="#f0eee8"/>` +
  face(0, -131) + `<path d="M-10 -124 q10 -7 20 0 q-10 4 -20 0Z" fill="#f0eee8"/></g>`;

const paatti = (sari = '#8f1d4a', arms = 'down') =>
  `<g><path d="M-19 -108 Q0 -116 19 -108 L27 0 L-27 0Z" fill="${sari}"/><path d="M-26 -8 L26 -8 L27 0 L-27 0Z" fill="#f4b72b"/>` +
  `<path d="M19 -108 L-22 -40 L-14 -34 L21 -92Z" fill="#f4b72b"/><path d="M17 -104 L-20 -42" stroke="#2f8f4e" stroke-width="3"/>` +
  `<path d="${arms === 'pinch' ? 'M-16 -100 q-14 16 -12 40M16 -100 q22 20 30 44' : 'M-16 -100 q-14 16 -12 40M16 -100 q14 16 12 40'}" fill="none" stroke="${SKIN2}" stroke-width="7.5" stroke-linecap="round"/>` +
  `<circle cx="-18" cy="-140" r="11" fill="#e4e1da"/><circle cy="-130" r="21" fill="${SKIN2}"/><path d="M-21 -132 a21 21 0 0 1 42 0 q-8 -10 -21 -10 q-13 0 -21 10Z" fill="#e4e1da"/>` +
  `<circle cy="-139" r="3" fill="#c2253a"/><circle cx="9" cy="-125" r="1.8" fill="#f4b72b"/>` + face(0, -131) + `</g>`;

/* ---------- animals ---------- */
const frog = () =>
  `<g><ellipse cx="0" cy="-10" rx="24" ry="15" fill="#58b368"/><ellipse cx="0" cy="-5" rx="15" ry="8" fill="#b7e39a"/><circle cx="-12" cy="-24" r="9" fill="#58b368"/><circle cx="12" cy="-24" r="9" fill="#58b368"/><g class="blink"><circle cx="-12" cy="-25" r="4" fill="#1d2b1f"/><circle cx="12" cy="-25" r="4" fill="#1d2b1f"/></g><path d="M-9 -11 q9 6 18 0" fill="none" stroke="#2c6b3a" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="-22" cy="-1" rx="10" ry="5" fill="#3f9150"/><ellipse cx="22" cy="-1" rx="10" ry="5" fill="#3f9150"/></g>`;

const fish = (c = '#ff9a3c') =>
  `<g><path d="M-22 0 Q0 -18 22 0 Q0 18 -22 0Z" fill="${c}"/><path d="M-20 0 L-38 -12 L-34 0 L-38 12Z" fill="${c}"/><circle cx="11" cy="-3" r="3" fill="#1d2b1f"/><path d="M-2 -9 Q4 0 -2 9" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/></g>`;

const kingfisher = () =>
  `<g><ellipse cx="0" cy="-22" rx="15" ry="20" fill="#f08a3c"/><path d="M-15 -24 Q-18 -48 2 -46 Q16 -44 14 -22 Q8 -4 -8 2 Q-18 -8 -15 -24Z" fill="#1e88c8"/><ellipse cx="3" cy="-18" rx="8" ry="13" fill="#f08a3c"/><circle cx="4" cy="-48" r="14" fill="#1e88c8"/><path d="M14 -52 L46 -44 L14 -42Z" fill="#c2253a"/><circle cx="8" cy="-50" r="3.2" fill="#fff"/><circle cx="9" cy="-50" r="1.8" fill="#1d2b1f"/><path d="M-8 2 L-14 20 L-2 6Z" fill="#14679c"/><path d="M-2 0v8M5 0v8" stroke="#c2253a" stroke-width="2.5"/></g>`;

const duck = (c = '#fffdf5') =>
  `<g><path d="M-30 -14 Q-34 10 0 10 Q30 10 28 -10 Q10 -20 -8 -14 Q-20 -26 -30 -14Z" fill="${c}"/><circle cx="24" cy="-28" r="13" fill="${c}"/><path d="M34 -30 L52 -26 L34 -21Z" fill="#f29a2e"/><circle cx="28" cy="-31" r="2.4" fill="#1d2b1f"/><path d="M-12 -6 Q0 4 14 -6" fill="none" stroke="#d6d0bd" stroke-width="2.5"/></g>`;

const egret = () =>
  `<g><path d="M-6 0V-44M6 0V-44" stroke="#2a2a2a" stroke-width="3"/><ellipse cx="0" cy="-58" rx="26" ry="17" fill="#fffdf5"/><path d="M-22 -58 L-44 -48 L-20 -48Z" fill="#fffdf5"/><path d="M18 -66 Q34 -90 22 -112" stroke="#fffdf5" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="22" cy="-116" r="9" fill="#fffdf5"/><path d="M29 -119 L56 -114 L29 -111Z" fill="#f2b33d"/><circle cx="25" cy="-118" r="2" fill="#1d2b1f"/></g>`;

const otter = (small) =>
  `<g>${small ? '' : '<ellipse cx="0" cy="0" rx="36" ry="7" fill="#fff" opacity=".45"/>'}<path d="M-22 0 Q-24 -40 0 -42 Q24 -40 22 0Z" fill="#7a5134"/><circle cx="-18" cy="-36" r="6" fill="#7a5134"/><circle cx="18" cy="-36" r="6" fill="#7a5134"/><ellipse cx="0" cy="-14" rx="14" ry="11" fill="#e7cfae"/><ellipse cx="0" cy="-19" rx="5" ry="3.6" fill="#2a1710"/><g class="blink" fill="#2a1710"><circle cx="-9" cy="-28" r="2.8"/><circle cx="9" cy="-28" r="2.8"/></g><path d="M-5 -11 q5 4 10 0" fill="none" stroke="#2a1710" stroke-width="2" stroke-linecap="round"/><path d="M-14 -15h-14M-14 -11l-13 4M14 -15h14M14 -11l13 4" stroke="#fff" stroke-width="1.5" opacity=".8"/></g>`;

const sparrow = () =>
  `<g><path d="M-18 -8 L-34 -14 L-20 -18Z" fill="#7a5134"/><ellipse cx="0" cy="-12" rx="20" ry="13" fill="#b9895a"/><ellipse cx="4" cy="-8" rx="12" ry="8" fill="#ead7b7"/><path d="M-12 -18 Q0 -26 10 -16 Q0 -10 -12 -18Z" fill="#7a5134"/><circle cx="16" cy="-22" r="10" fill="#b9895a"/><path d="M8 -28 a10 10 0 0 1 16 0Z" fill="#6b4226"/><path d="M25 -23 L34 -20 L25 -17Z" fill="#3b2a1e"/><circle cx="19" cy="-23" r="2.2" fill="#1d2b1f"/><path d="M-2 0v7M6 0v7" stroke="#3b2a1e" stroke-width="2"/></g>`;

const squirrel = () =>
  `<g><path d="M-18 -6 Q-52 -10 -44 -48 Q-36 -70 -18 -58 Q-34 -44 -22 -22Z" fill="#8c7458"/><ellipse cx="0" cy="-16" rx="22" ry="15" fill="#a48a6a"/><g stroke="#fff3d6" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-16 -24 Q0 -30 16 -22"/><path d="M-17 -18 Q0 -24 17 -16"/></g><path d="M-16 -21 Q0 -27 16 -19" stroke="#4d3a28" stroke-width="2" fill="none"/><circle cx="22" cy="-28" r="11" fill="#a48a6a"/><circle cx="17" cy="-39" r="4" fill="#a48a6a"/><circle cx="26" cy="-30" r="2.4" fill="#1d2b1f"/><circle cx="33" cy="-25" r="2" fill="#3b2a1e"/><path d="M-8 -2v6M10 -2v6" stroke="#8c7458" stroke-width="4" stroke-linecap="round"/></g>`;

const ants = (n = 5) => {
  let s = '';
  for (let i = 0; i < n; i++) s += `<g transform="translate(${i * 24} ${i % 2 ? -3 : 2})"><circle cx="-6" r="3.6"/><circle r="2.8"/><circle cx="6" r="3.4"/><path d="M-3 0l-3 6M0 0v6M3 0l3 6M8 -2l4 -5" stroke="#2a1710" stroke-width="1.2" fill="none"/></g>`;
  return `<g fill="#2a1710">${s}</g>`;
};

const rooster = () =>
  `<g><path d="M-20 -30 Q-56 -70 -30 -84 Q-28 -60 -10 -44Z" fill="#2f4f6f"/><path d="M-22 -30 Q-60 -52 -48 -72 Q-36 -50 -12 -40Z" fill="#c2253a"/><ellipse cx="0" cy="-28" rx="26" ry="20" fill="#e98a2c"/><path d="M12 -38 Q16 -70 28 -74 Q40 -70 34 -40Z" fill="#e98a2c"/><circle cx="28" cy="-74" r="12" fill="#e98a2c"/><path d="M20 -84 q3 -10 8 -2 q4 -10 8 0 q6 -6 4 6Z" fill="#c2253a"/><path d="M38 -74 L52 -70 L38 -66Z" fill="#f4b72b"/><path d="M34 -64 q3 10 -4 10Z" fill="#c2253a"/><circle cx="31" cy="-76" r="2.4" fill="#1d2b1f"/><path d="M-6 -8v8l-6 0M8 -8v8l6 0" stroke="#f4b72b" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;

const peacock = (open) => {
  let tail = '';
  if (open) {
    for (let i = 0; i < 9; i++) {
      const a = -80 + i * 20;
      tail += `<g transform="rotate(${a})"><path d="M0 0 Q-16 -70 0 -128 Q16 -70 0 0Z" fill="${i % 2 ? '#1f9d7a' : '#27b08a'}"/><circle cy="-104" r="11" fill="#f4b72b"/><circle cy="-104" r="7" fill="#1e5fb8"/><circle cy="-102" r="3.5" fill="#12224f"/></g>`;
    }
    tail = `<g transform="translate(0 -40)"><g class="fan">${tail}</g></g>`;
  } else {
    tail = `<path d="M-10 -34 Q-110 -30 -170 10 Q-100 -6 -8 -18Z" fill="#1f9d7a"/><circle cx="-120" cy="-12" r="6" fill="#1e5fb8"/><circle cx="-90" cy="-18" r="6" fill="#1e5fb8"/><circle cx="-146" cy="0" r="6" fill="#1e5fb8"/>`;
  }
  return `<g>${tail}<path d="M-7 -2v14M7 -2v14" stroke="#6b5a3a" stroke-width="3.5"/><ellipse cx="0" cy="-26" rx="24" ry="28" fill="#1e5fb8"/><path d="M6 -46 Q12 -84 24 -92" stroke="#1e5fb8" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="26" cy="-96" r="11" fill="#1e5fb8"/><path d="M35 -98 L48 -94 L35 -90Z" fill="#e9d9b0"/><circle cx="29" cy="-98" r="2.4" fill="#fff"/><circle cx="29.5" cy="-98" r="1.4" fill="#12224f"/><g stroke="#12224f" stroke-width="1.6"><path d="M22 -106 L18 -122M26 -107 L26 -124M30 -106 L34 -122"/></g><circle cx="18" cy="-123" r="3" fill="#27b08a"/><circle cx="26" cy="-125" r="3" fill="#27b08a"/><circle cx="34" cy="-123" r="3" fill="#27b08a"/></g>`;
};

const cow = () =>
  `<g><path d="M-52 -64 Q-58 -30 -48 0h12l2 -26h60l2 26h12Q52 -30 50 -62 Q30 -76 0 -72 Q-14 -92 -34 -74 Q-48 -72 -52 -64Z" fill="#fbf6ea"/><path d="M-52 -60 q-10 20 -6 36" stroke="#fbf6ea" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M44 -76 Q78 -84 82 -54 Q84 -36 66 -36 Q50 -40 44 -60Z" fill="#fbf6ea"/><ellipse cx="74" cy="-44" rx="11" ry="9" fill="#e9c7b0"/><circle cx="64" cy="-62" r="2.8" fill="#1d2b1f"/><path d="M52 -80 Q44 -104 56 -110" stroke="#2f6fb8" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M68 -80 Q74 -104 62 -110" stroke="#c2253a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M44 -66 l-12 -6 l8 12Z" fill="#fbf6ea"/><path d="M46 -52 Q58 -34 72 -34" fill="none" stroke="#f4b72b" stroke-width="4"/><circle cx="58" cy="-30" r="6" fill="#f4b72b"/><g fill="#ff8fa3"><circle cx="50" cy="-82" r="5"/><circle cx="60" cy="-86" r="5"/><circle cx="70" cy="-82" r="5"/></g></g>`;

const owl = () =>
  `<g><ellipse cx="0" cy="-30" rx="26" ry="32" fill="#8c6a4a"/><ellipse cx="0" cy="-20" rx="15" ry="19" fill="#d9bf9a"/><path d="M-22 -54 L-26 -70 L-10 -60Z M22 -54 L26 -70 L10 -60Z" fill="#8c6a4a"/><circle cx="-10" cy="-42" r="10" fill="#fff"/><circle cx="10" cy="-42" r="10" fill="#fff"/><g class="blink"><circle cx="-10" cy="-42" r="5" fill="#1d2b1f"/><circle cx="10" cy="-42" r="5" fill="#1d2b1f"/></g><path d="M0 -36 l-5 8 h10Z" fill="#f2b33d"/></g>`;

const sheep = (asleep) =>
  `<g><path d="M-16 -6v10M14 -6v10" stroke="#3b3b4a" stroke-width="5" stroke-linecap="round"/><g fill="#fffdf5"><circle cx="-18" cy="-22" r="16"/><circle cx="0" cy="-30" r="18"/><circle cx="18" cy="-22" r="16"/><circle cx="0" cy="-14" r="16"/></g><ellipse cx="30" cy="-28" rx="12" ry="14" fill="#3b3b4a"/>` +
  (asleep ? `<path d="M26 -30 q4 3 8 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>` : `<circle cx="32" cy="-31" r="2.4" fill="#fff"/>`) + `</g>`;

const bird = (c = '#3b3b4a') => `<path class="flap" d="M-16 0 Q-8 -12 0 0 Q8 -12 16 0" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;

/* Puff, the littlest cloud */
const puff = (mood = 'awake', fill = '#ffffff') => {
  const eyes = mood === 'sleep'
    ? `<path d="M-22 0 q7 7 14 0M8 0 q7 7 14 0" fill="none" stroke="#4a4470" stroke-width="3.5" stroke-linecap="round"/>`
    : mood === 'giggle'
      ? `<path d="M-22 2 q7 -8 14 0M8 2 q7 -8 14 0" fill="none" stroke="#4a4470" stroke-width="3.5" stroke-linecap="round"/>`
      : `<g class="blink" fill="#4a4470"><circle cx="-15" cy="0" r="4.6"/><circle cx="15" cy="0" r="4.6"/></g>`;
  const mouth = mood === 'yawn' ? `<ellipse cx="0" cy="18" rx="8" ry="10" fill="#4a4470"/>`
    : mood === 'giggle' ? `<path d="M-10 12 Q0 26 10 12Z" fill="#4a4470"/>`
      : mood === 'brr' ? `<path d="M-10 16 q3 -5 7 0 q3 5 7 0 q3 -5 6 0" fill="none" stroke="#4a4470" stroke-width="3" stroke-linecap="round"/>`
        : `<path d="M-8 13 q8 8 16 0" fill="none" stroke="#4a4470" stroke-width="3.5" stroke-linecap="round"/>`;
  return `<g class="bob"><g fill="${fill}"><circle cx="-44" cy="4" r="30"/><circle cx="-8" cy="-22" r="40"/><circle cx="40" cy="0" r="34"/><rect x="-74" y="2" width="148" height="34" rx="17"/></g>${eyes}${mouth}<circle cx="-32" cy="14" r="8" fill="#ff9fb2" opacity=".55"/><circle cx="32" cy="14" r="8" fill="#ff9fb2" opacity=".55"/></g>`;
};

/* ---------- kolam: 8 dots around an open middle ---------- */
const KOLAM_DOTS = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];
const kolam = (cx, cy, sp = 62, done = false, centre = '') => {
  let dots = '', loops = '';
  KOLAM_DOTS.forEach(([i, j], n) => {
    const x = cx + i * sp, y = cy + j * sp * .62, r = sp * .44;
    loops += `<ellipse class="kloop${done ? ' show' : ''}" id="kl${n}" cx="${x}" cy="${y}" rx="${r}" ry="${r * .62}" pathLength="100"/>`;
    dots += done
      ? `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.4" fill="#fffdf5"/>`
      : F('dot' + n, 'Kolam dot ' + (n + 1), ['One dot!', 'Two dots!', 'Round it goes!', 'Loop the loop!', 'Keep going!', 'Swirl!', 'Nearly there!', 'Last one!'][n], 'pluck', 'pop',
        `<ellipse cx="${x}" cy="${y}" rx="10" ry="7" fill="#fffdf5"/>`, [x, y, 26], `data-reveal="#kl${n}"`);
  });
  // scalloped outer line: 16 points alternating near and far, smoothed through midpoints
  const w = sp * 2, pts = [];
  for (let k = 0; k < 16; k++) {
    const a = k * Math.PI / 8, r = k % 2 ? 1 : 1.2;
    pts.push([+(cx + Math.cos(a) * w * r).toFixed(1), +(cy + Math.sin(a) * w * r * .62).toFixed(1)]);
  }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let border = `M${mid(pts[15], pts[0])}`;
  pts.forEach((p, k) => border += ` Q${p} ${mid(p, pts[(k + 1) % 16])}`);
  return `<g class="kolam" fill="none" stroke="#fffdf5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${loops}<path class="kloop kborder${done ? ' show' : ''}" d="${border}Z" pathLength="100"/></g>${centre}${dots}`;
};

const kolamPeacock = (x, y) =>
  `<g transform="translate(${x} ${y})" fill="none" stroke="#fffdf5" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="-6" cy="4" rx="12" ry="9"/><path d="M2 -2 Q8 -18 14 -18M14 -18 l7 3 l-7 2M12 -20 l-2 -7M15 -21 l1 -7"/><path d="M-16 6 Q-30 0 -38 12 M-16 8 Q-28 10 -32 20M-14 2 Q-26 -10 -38 -2"/><circle cx="-38" cy="12" r="2.5"/><circle cx="-32" cy="20" r="2.5"/><circle cx="-38" cy="-2" r="2.5"/></g>`;

const kolamSun = (x, y) => {
  let r = '';
  for (let i = 0; i < 10; i++) r += `<path transform="rotate(${i * 36})" d="M0 -17 V-27"/>`;
  return `<g transform="translate(${x} ${y}) scale(1 .7)" fill="none" stroke="#fffdf5" stroke-width="3.5" stroke-linecap="round"><circle r="12"/>${r}</g>`;
};
