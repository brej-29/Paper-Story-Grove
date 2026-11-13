'use strict';
/* All sound is synthesised with the Web Audio API: no audio files. */
const Sound = (() => {
  let ctx, master, musicBus, on = true, song = null, timer = null, nextT = 0, step = 0, rainSrc = null, noiseBuf;

  const SONGS = {
    // root Hz, scale in semitones, seconds per step, steps per bar
    home: { root: 196, scale: [0, 2, 4, 7, 9], dt: .42, bar: 8, wave: 'sine', seed: 5, len: 1.4 },
    kerala: { root: 220, scale: [0, 2, 4, 7, 9], dt: .27, bar: 6, wave: 'triangle', seed: 11, len: .7, beat: [0, 3], rain: true },
    tamil: { root: 261.63, scale: [0, 2, 4, 7, 11], dt: .3, bar: 8, wave: 'triangle', seed: 23, len: .6, birds: true },
    cloud: { root: 174.61, scale: [0, 2, 4, 7, 9], dt: .56, bar: 6, wave: 'sine', seed: 31, len: 2 },
  };

  const ensure = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = .9; master.connect(ctx.destination);
      musicBus = ctx.createGain(); musicBus.gain.value = .55;
      const delay = ctx.createDelay(1), fb = ctx.createGain();
      delay.delayTime.value = .33; fb.gain.value = .28;
      musicBus.connect(master); musicBus.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  const tone = (f, t, dur, type = 'sine', vol = .2, f2, dest = master) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + .05);
  };

  const noise = (t, dur, vol = .2, type = 'lowpass', f = 1000, f2) => {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true; fl.type = type; fl.frequency.setValueAtTime(f, t);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(master); s.start(t); s.stop(t + dur + .05);
  };

  const FX = {
    turn: t => noise(t, .35, .12, 'bandpass', 900, 3200),
    pop: t => tone(520, t, .16, 'sine', .3, 880),
    pluck: t => tone(660, t, .3, 'triangle', .25),
    bell: t => { tone(880, t, 1.1, 'sine', .22); tone(1320, t, .8, 'sine', .08); },
    twinkle: t => [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, t + i * .07, .4, 'sine', .14)),
    chirp: t => [0, .14, .28].forEach(d => tone(2200, t + d, .09, 'sine', .16, 3400)),
    squeak: t => { tone(1400, t, .12, 'sine', .18, 2100); tone(1500, t + .16, .14, 'sine', .18, 2300); },
    croak: t => [0, .22].forEach(d => { tone(150, t + d, .16, 'square', .12, 110); tone(300, t + d, .16, 'sawtooth', .05, 200); }),
    quack: t => [0, .2, .4].forEach(d => tone(420, t + d, .13, 'sawtooth', .1, 300)),
    splash: t => { noise(t, .45, .3, 'lowpass', 3000, 400); tone(300, t, .2, 'sine', .15, 90); },
    drip: t => tone(1200, t, .14, 'sine', .22, 600),
    bubble: t => [0, .12, .22, .36].forEach((d, i) => tone(300 + i * 90, t + d, .12, 'sine', .2, 700 + i * 90)),
    thud: t => { tone(120, t + .25, .25, 'sine', .5, 50); noise(t + .25, .12, .15, 'lowpass', 500); },
    drum: t => [0, .25, .5].forEach(d => { tone(110, t + d, .22, 'sine', .5, 55); noise(t + d, .05, .12, 'lowpass', 900); }),
    thunder: t => noise(t, 1.6, .5, 'lowpass', 220, 60),
    wind: t => noise(t, 1.2, .16, 'bandpass', 400, 1400),
    horn: t => { tone(196, t, .8, 'sawtooth', .09); tone(247, t, .8, 'sawtooth', .07); },
    giggle: t => [660, 784, 660, 880, 784].forEach((f, i) => tone(f, t + i * .09, .1, 'triangle', .18)),
    crow: t => { tone(500, t, .14, 'sawtooth', .1, 700); tone(700, t + .16, .12, 'sawtooth', .1, 800); tone(850, t + .3, .5, 'sawtooth', .1, 520); },
    peacock: t => [0, .5].forEach(d => tone(620, t + d, .4, 'sawtooth', .08, 900)),
    moo: t => tone(150, t, 1, 'sawtooth', .1, 115),
    hoot: t => { tone(420, t, .25, 'sine', .25); tone(380, t + .32, .5, 'sine', .25, 340); },
    yawn: t => tone(520, t, 1.1, 'sine', .18, 180),
    snore: t => { noise(t, .7, .1, 'lowpass', 300, 150); tone(600, t + .8, .5, 'sine', .06, 900); },
    win: t => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * .12, .6, 'triangle', .18)),
  };

  const phrase = (rand, n) => {
    const p = []; let d = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < n; i++) {
      if (i && rand() < .28) { p.push(null); continue; }
      d = Math.max(0, Math.min(9, d + Math.floor(rand() * 5) - 2));
      p.push(d);
    }
    p[n - 1] = null;
    return p;
  };

  const startSong = name => {
    stopSong();
    const s = SONGS[name]; if (!s || !on || !ensure()) return;
    let seed = s.seed;
    const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    const A = phrase(rand, s.bar), B = phrase(rand, s.bar), Cc = phrase(rand, s.bar);
    const seq = [A, B, A, Cc];
    const hz = d => s.root * 2 ** ((s.scale[d % 5] + 12 * Math.floor(d / 5)) / 12);
    step = 0; nextT = ctx.currentTime + .15; song = name;
    musicBus.gain.cancelScheduledValues(ctx.currentTime); musicBus.gain.setValueAtTime(.55, ctx.currentTime);
    timer = setInterval(() => {
      while (nextT < ctx.currentTime + .4) {
        const bar = Math.floor(step / s.bar) % 4, i = step % s.bar, d = seq[bar][i];
        if (d !== null) tone(hz(d), nextT, s.len, s.wave, .16, null, musicBus);
        if (i === 0) { tone(s.root / 2, nextT, s.dt * s.bar, 'sine', .12, null, musicBus); tone(s.root * .75, nextT, s.dt * s.bar, 'sine', .05, null, musicBus); }
        if (s.beat && s.beat.includes(i)) tone(90, nextT, .16, 'sine', .14, 50, musicBus);
        if (s.birds && Math.random() < .05) [0, .12].forEach(x => tone(2400, nextT + x, .08, 'sine', .04, 3300));
        nextT += s.dt; step++;
      }
    }, 120);
    if (s.rain) {
      rainSrc = ctx.createBufferSource(); rainSrc.buffer = noiseBuf; rainSrc.loop = true;
      const f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = .4; g.gain.value = .035;
      rainSrc.connect(f); f.connect(g); g.connect(master); rainSrc.start();
    }
  };

  const stopSong = () => {
    clearInterval(timer); timer = null; song = null;
    if (rainSrc) { try { rainSrc.stop(); } catch (e) { /* already stopped */ } rainSrc = null; }
  };

  return {
    music(name) { this.want = name; if (name === song) { if (on) ensure(); return; } startSong(name); },
    fx(name) { if (!on || !FX[name] || !ensure()) return; FX[name](ctx.currentTime + .01); },
    setOn(v) {
      on = v;
      if (!v) { stopSong(); if (ctx) ctx.suspend(); }
      else if (this.want) startSong(this.want);
    },
    want: null,
  };
})();
