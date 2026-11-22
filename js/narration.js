'use strict';
/* Page-scoped narration. Written story data is never changed. */
const Narrator = (() => {
  const synth = window.speechSynthesis;
  let parts = [], index = 0, generation = 0, timer, utterance, clip;
  let state = 'idle', speed = 1, selected = '', online = false, key = '';
  let notify = () => {}, mark = () => {};
  const voices = () => synth ? synth.getVoices().filter(v => /^en\b/i.test(v.lang) && (online || v.localService)) : [];
  const choose = () => voices().find(v => v.voiceURI === selected) || voices().slice().sort((a, b) => {
    const rank = v => (/natural|neural|premium|enhanced/i.test(v.name) ? 10 : 0) + (/en[-_]IN/i.test(v.lang) ? 2 : 0) + (v.default ? 1 : 0);
    return rank(b) - rank(a);
  })[0];
  function status(value, message = '') { state = value; notify(value, message); }
  function cancel() {
    generation++; clearTimeout(timer);
    if (synth) synth.cancel();
    if (clip) { clip.pause(); clip.removeAttribute('src'); clip.load(); clip = null; }
    utterance = null;
  }
  function stop() { cancel(); mark(-1); status('idle'); }
  function run() {
    if (index >= parts.length) { mark(-1); status('ended'); return; }
    const token = generation, part = parts[index];
    mark(part.paragraph); status('playing');
    let completed = false, speaking = false;
    const next = () => {
      if (token !== generation || completed) return;
      completed = true;
      index++;
      timer = setTimeout(run, part.pause / speed);
    };
    // Optional locally hosted, reviewed sentence recordings; no service keys in the app.
    const src = window.STORY_AUDIO?.[key]?.[index];
    if (src && /^(?:audio\/|\.\/audio\/)/.test(src) && !src.includes('..')) {
      clip = new Audio(src); clip.playbackRate = speed;
      clip.onended = next;
      clip.onerror = () => { if (token === generation) speakPart(); };
      clip.play().catch(() => { if (token === generation) speakPart(); });
    } else speakPart();
    function speakPart() {
      if (token !== generation || speaking || completed) return;
      speaking = true;
      if (clip) { clip.onended = null; clip.onerror = null; clip.pause(); clip = null; }
      const voice = choose();
      if (!synth || !voice) { mark(-1); status('error', 'No available voice. Try another voice or read together on the page.'); return; }
      utterance = new SpeechSynthesisUtterance(part.text);
      utterance.voice = voice; utterance.lang = voice.lang;
      utterance.rate = .94 * speed; utterance.pitch = 1;
      utterance.onend = next;
      utterance.onerror = e => { if (token === generation && e.error !== 'canceled' && e.error !== 'interrupted') { mark(-1); status('error', 'Voice unavailable. Choose another voice and press Play.'); } };
      synth.speak(utterance);
    }
  }
  function segments(paragraphs) {
    return paragraphs.flatMap((text, paragraph) => {
      const sentences = text.match(/[^.!?]+(?:[.!?]+[”"’']*|$)/g) || [text];
      return sentences.map((s, i) => ({ text: s.trim(), paragraph, pause: i === sentences.length - 1 ? 480 : 180 })).filter(s => s.text);
    });
  }
  return {
    voices, segments,
    init(onState, onMark) { notify = onState; mark = onMark; },
    load(paragraphs, pageKey, autoplay) { stop(); parts = segments(paragraphs); key = pageKey; index = 0; if (autoplay) run(); },
    play() { if (state === 'playing') return; if (state === 'ended') index = 0; cancel(); run(); },
    pause() { if (state !== 'playing') return; cancel(); status('paused', 'Paused. Resume continues from a sentence boundary.'); },
    replay() { cancel(); index = 0; run(); },
    stop,
    configure(options) {
      const playing = state === 'playing'; cancel();
      speed = options.speed; selected = options.voice; online = options.online;
      if (playing) run(); else { mark(-1); status('idle'); }
    },
    get state() { return state; }
  };
})();
