'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const KEY = 'three-little-stories-v1';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- saved state (works without storage too) ---------- */
  let S = { finds: {}, ends: {}, sound: true, read: false, calm: reduced };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* private mode */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  /* ---------- scene rendering ---------- */
  const sceneSVG = (layers, label, cover) =>
    `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid ${cover ? 'slice' : 'meet'}" ${cover ? 'aria-hidden="true"' : `role="group" aria-label="${esc(label)}"`}>` +
    layers.map((l, i) => `<g class="layer" style="--z:${i}"><g class="pop" style="--i:${i}">${l}</g></g>`).join('') + `</svg>`;

  // Count the things to find in each story once, from the scenes themselves.
  const TOTAL = {};
  STORIES.forEach(st => {
    st.findIds = {};
    TOTAL[st.id] = 0;
    for (const [pid, p] of Object.entries(st.pages)) {
      st.findIds[pid] = [...p.scene().join('').matchAll(/data-id="([^"]+)"/g)].map(m => m[1]);
      TOTAL[st.id] += st.findIds[pid].length;
    }
  });
  const foundIn = (st, pid) => st.findIds[pid].filter(id => S.finds[`${st.id}/${pid}/${id}`]).length;
  const foundAll = st => Object.keys(st.pages).reduce((n, pid) => n + foundIn(st, pid), 0);
  const endsOf = st => Object.values(st.pages).filter(p => p.end).map(p => p.end);

  /* ---------- controls ---------- */
  const setTog = (el, v) => el.setAttribute('aria-pressed', v);
  const applyPrefs = () => {
    setTog($('#tSound'), S.sound); setTog($('#tRead'), S.read); setTog($('#tCalm'), S.calm);
    document.documentElement.dataset.motion = S.calm ? 'calm' : 'full';
    Sound.setOn(S.sound);
  };
  $('#tSound').onclick = () => { S.sound = !S.sound; save(); applyPrefs(); if (S.sound) Sound.fx('pop'); };
  $('#tCalm').onclick = () => { S.calm = !S.calm; save(); applyPrefs(); };
  const canSpeak = 'speechSynthesis' in window;
  if (!canSpeak) $('#tRead').hidden = true;
  $('#tRead').onclick = () => { S.read = !S.read; save(); applyPrefs(); if (S.read) readPage(); else speechSynthesis.cancel(); };

  const speak = text => {
    if (!S.read || !canSpeak) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[“”]/g, '"'));
    const vs = speechSynthesis.getVoices();
    u.voice = vs.find(v => /en[-_]IN/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
    u.rate = .85; u.pitch = 1.1;
    speechSynthesis.speak(u);
  };

  /* ---------- shelf ---------- */
  const medal = on => `<svg class="medal${on ? ' on' : ''}" viewBox="-12 -12 24 24" aria-hidden="true">${star(9, 'currentColor')}</svg>`;
  const renderShelf = () => {
    $('#books').innerHTML = STORIES.map((st, i) => {
      const ends = endsOf(st), got = ends.filter(e => S.ends[`${st.id}/${e.id}`]).length, f = foundAll(st);
      return `<button class="book" data-story="${st.id}" style="--ink:${st.ink};--accent:${st.accent};--tilt:${[-2, 1.2, -1.2][i]}deg">
        <span class="cover">${sceneSVG(st.cover(), '', true)}</span>
        <span class="label"><span class="t">${st.title}</span><span class="p">${st.place}</span></span>
        <span class="progress">${ends.map(e => medal(S.ends[`${st.id}/${e.id}`])).join('')}
          <span>${got} of ${ends.length} endings, ${f} of ${TOTAL[st.id]} surprises found</span></span>
      </button>`;
    }).join('');
  };
  $('#books').onclick = e => { const b = e.target.closest('.book'); if (b) openStory(b.dataset.story); };

  $('#notesBody').innerHTML = GROWNUPS.map(([t, d]) => `<h3>${t}</h3><p>${d}</p>`).join('');
  $('#grown').onclick = () => $('#notes').showModal();

  /* ---------- reader ---------- */
  let st = null, hist = [], tapped = new Set(), busy = false;
  const page = () => st.pages[hist.at(-1)];

  const sheetHTML = pid => {
    const p = st.pages[pid];
    return `<article class="sheet" tabindex="-1" aria-label="${esc(p.title)}">
      <div class="pic">${sceneSVG(p.scene(), 'Picture: ' + p.title)}<p class="caption" aria-live="polite"></p></div>
      <div class="words">
        <h2>${p.title}</h2>
        ${p.text.map(t => `<p>${t}</p>`).join('')}
        ${p.tip ? `<p class="tip">${p.tip}</p>` : ''}
        ${p.choice ? `<p class="ask">${p.ask}</p><div class="choices">${p.choice.map(c =>
      `<button class="choice" data-to="${c.to}"><svg viewBox="-36 -36 72 72" aria-hidden="true">${c.icon()}</svg><span>${c.label}</span></button>`).join('')}</div>` : ''}
        ${p.end ? `<div class="theend"><p class="fin">The end</p><p class="got">Ending found: <b>${p.end.name}</b></p>
          <div class="two"><button class="btn" data-other>Try the other way</button><button class="btn ghost" data-home>All stories</button></div></div>` : ''}
      </div></article>`;
  };

  const readPage = () => { const p = page(); speak([p.title + '.', ...p.text, p.ask || ''].join(' ')); };

  const updateNav = () => {
    const pid = hist.at(-1), p = page(), n = st.findIds[pid].length, f = foundIn(st, pid);
    $('#prev').disabled = hist.length < 2;
    $('#next').hidden = !p.next;
    $('#dots').innerHTML = Array.from({ length: st.length }, (_, i) => `<i class="${i < hist.length ? 'on' : ''}"></i>`).join('');
    $('#dots').setAttribute('aria-label', `Page ${hist.length} of ${st.length}`);
    $('#hint').innerHTML = st.findIds[pid].map((_, i) => medal(i < f)).join('') + `<span>${f === n ? 'All found!' : `Find ${n - f} more`}</span>`;
    $('#hint').setAttribute('aria-label', `${f} of ${n} surprises found on this page. Press for a hint.`);
  };

  const show = (pid, dir) => {
    if (busy) return;
    const stage = $('#stage'), old = stage.querySelector('.sheet');
    stage.insertAdjacentHTML(dir < 0 ? 'beforeend' : 'afterbegin', sheetHTML(pid));
    const neu = dir < 0 ? stage.lastElementChild : stage.firstElementChild;
    tapped = new Set();
    const p = st.pages[pid];
    if (p.end) { S.ends[`${st.id}/${p.end.id}`] = 1; save(); setTimeout(() => Sound.fx('win'), 700); }
    updateNav();
    const done = () => { if (old) old.remove(); busy = false; neu.focus({ preventScroll: true }); };
    if (old && dir) {
      busy = true; Sound.fx('turn');
      const mover = dir < 0 ? neu : old;
      mover.classList.add(dir < 0 ? 'turn-in' : 'turn-out');
      old.inert = true;
      let fired = false;
      const end = () => { if (fired) return; fired = true; mover.classList.remove('turn-in', 'turn-out'); done(); };
      mover.addEventListener('animationend', e => { if (e.target === mover) end(); });
      setTimeout(end, 1100); // safety net if the animation never runs
    } else done();
    readPage();
  };

  const go = (to, dir = 1) => { if (busy) return; hist.push(to); show(to, dir); };
  const back = () => { if (busy || hist.length < 2) return; hist.pop(); show(hist.at(-1), -1); };
  const next = () => { const p = page(); if (p.next) go(p.next); };

  const openStory = id => {
    st = STORIES.find(s => s.id === id); hist = [st.start];
    const r = $('#reader');
    r.style.setProperty('--ink', st.ink); r.style.setProperty('--paper', st.paper); r.style.setProperty('--accent', st.accent);
    document.body.style.setProperty('--bg', st.ink);
    $('#shelf').hidden = true; r.hidden = false; $('#home').hidden = false;
    $('#barTitle').textContent = st.title;
    $('#stage').innerHTML = '';
    Sound.music(st.id); Sound.fx('turn');
    show(st.start, 0);
    scrollTo(0, 0);
  };

  const goHome = () => {
    if (canSpeak) speechSynthesis.cancel();
    const last = st && st.id; st = null;
    document.body.style.removeProperty('--bg');
    $('#reader').hidden = true; $('#shelf').hidden = false; $('#home').hidden = true;
    $('#barTitle').textContent = '';
    renderShelf(); Sound.music('home');
    const b = last && document.querySelector(`.book[data-story="${last}"]`);
    if (b) b.focus();
  };

  $('#next').onclick = next; $('#prev').onclick = back; $('#home').onclick = goHome;
  $('#hint').onclick = () => {
    const finds = [...document.querySelectorAll('#stage .sheet:not([inert]) .find')];
    const pid = hist.at(-1), left = finds.filter(f => !S.finds[`${st.id}/${pid}/${f.dataset.id}`]);
    (left.length ? left : finds).forEach(f => { f.classList.remove('hint'); void f.getBoundingClientRect(); f.classList.add('hint'); });
    if (S.calm) caption(left.length ? 'Look for: ' + left.map(f => f.getAttribute('aria-label').toLowerCase()).join(', ') : 'You found everything here!');
  };

  let capT;
  const caption = text => {
    const c = document.querySelector('#stage .sheet:not([inert]) .caption'); if (!c) return;
    c.textContent = text; c.classList.add('show');
    clearTimeout(capT); capT = setTimeout(() => c.classList.remove('show'), 3800);
  };

  const tap = f => {
    const pid = hist.at(-1), p = page(), id = f.dataset.id;
    f.classList.remove('go', 'hint'); void f.getBoundingClientRect(); f.classList.add('go');
    Sound.fx(f.dataset.snd);
    let say = f.dataset.say;
    if (f.dataset.reveal) f.ownerSVGElement.querySelectorAll(f.dataset.reveal).forEach(el => el.classList.add('show'));
    tapped.add(id);
    if (p.allSay && tapped.size === st.findIds[pid].length) {
      say = p.allSay;
      f.ownerSVGElement.querySelectorAll('.kborder').forEach(el => el.classList.add('show'));
      setTimeout(() => Sound.fx('win'), 400);
    }
    caption(say); speak(say);
    S.finds[`${st.id}/${pid}/${id}`] = 1; save(); updateNav();
  };

  $('#stage').addEventListener('click', e => {
    const f = e.target.closest('.find'); if (f) return tap(f);
    const c = e.target.closest('.choice'); if (c) return go(c.dataset.to);
    if (e.target.closest('[data-home]')) return goHome();
    if (e.target.closest('[data-other]')) {
      if (busy) return;
      const b = page().back; hist = hist.slice(0, hist.indexOf(b) + 1); show(b, -1);
    }
  });
  $('#stage').addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('find')) { e.preventDefault(); tap(e.target); }
  });

  addEventListener('keydown', e => {
    if (!st || $('#notes').open || e.target.closest('.choice')) return;
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') back();
    else if (e.key === 'Escape') goHome();
  });

  // swipe to turn pages
  let sx = null, sy = 0;
  $('#stage').addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  $('#stage').addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) dx < 0 ? next() : back();
  });

  // layers drift a little with the pointer, like looking around a pop-up page
  $('#stage').addEventListener('pointermove', e => {
    if (S.calm || e.pointerType === 'touch') return;
    const svg = document.querySelector('#stage .sheet:not([inert]) .scene'); if (!svg) return;
    const r = svg.getBoundingClientRect();
    svg.style.setProperty('--px', (((e.clientX - r.left) / r.width - .5) * -2).toFixed(3));
    svg.style.setProperty('--py', (((e.clientY - r.top) / r.height - .5) * -2).toFixed(3));
  });

  // browsers only allow sound after a first touch or key press
  const wake = () => { if (S.sound) Sound.music(st ? st.id : 'home'); };
  addEventListener('pointerdown', wake, { once: true });
  addEventListener('keydown', wake, { once: true });

  applyPrefs();
  renderShelf();
})();
