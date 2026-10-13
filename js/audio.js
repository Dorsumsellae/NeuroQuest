// audio.js : sons, musique d'ambiance procédurale et vibrations.
// Tout est synthétisé avec la Web Audio API (aucun fichier audio, fonctionne hors ligne).
// Règles : un seul AudioContext, débloqué au premier geste utilisateur ; chaque note est
// programmée sur l'horloge audio (pas de setTimeout) avec une enveloppe pour éviter les clics.
window.NQ = window.NQ || {};
NQ.audio = (function () {
  'use strict';
  let AC = null, master = null, unlocked = false;
  const prof = () => NQ.store.profile;

  function ctx() {
    if (AC) return AC;
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain(); master.gain.value = 1; master.connect(AC.destination);
    } catch (e) { AC = null; }
    return AC;
  }
  // À appeler depuis un geste utilisateur (clic, touche) : crée / reprend le contexte.
  function unlock() {
    const ac = ctx(); if (!ac) return;
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    unlocked = true;
    if (prof().music && !music.playing) music.start();
  }

  // ---------- Effets ----------
  // Note programmée à l'instant `at` (secondes audio), enveloppe attaque / relâchement.
  function note(f, dur, type, at, vol) {
    const ac = ctx(); if (!ac || prof().muted) return;
    try {
      const o = ac.createOscillator(), g = ac.createGain();
      const t0 = Math.max(at || ac.currentTime, ac.currentTime), v = vol || 0.05;
      o.type = type || 'square'; o.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(v, t0 + 0.012);
      g.gain.setValueAtTime(v, t0 + dur - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
      o.onended = () => { o.disconnect(); g.disconnect(); };
    } catch (e) { /* audio indisponible */ }
  }
  const sfx = {
    good() { const ac = ctx(); if (!ac) return; const t = ac.currentTime; note(660, 0.12, 'square', t); note(880, 0.16, 'square', t + 0.1); },
    bad() { const ac = ctx(); if (!ac) return; note(120, 0.3, 'sawtooth', ac.currentTime, 0.045); vibrate([60, 40, 120]); },
    unlock() { const ac = ctx(); if (!ac) return; const t = ac.currentTime; [523, 659, 784, 1047].forEach((f, i) => note(f, 0.18, 'triangle', t + i * 0.09, 0.05)); },
    // Souffle d'accélération : bruit filtré dont la fréquence de coupure monte tant que le boost est maintenu.
    boost(on) {
      const ac = ctx(); if (!ac) return;
      if (on && !boostNode && !prof().muted) {
        try {
          const len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
          for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
          const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
          const flt = ac.createBiquadFilter(); flt.type = 'bandpass'; flt.Q.value = 0.8;
          const g = ac.createGain();
          const t = ac.currentTime;
          flt.frequency.setValueAtTime(300, t); flt.frequency.exponentialRampToValueAtTime(1800, t + 0.6);
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.25);
          src.connect(flt); flt.connect(g); g.connect(master); src.start();
          boostNode = { src, flt, g };
        } catch (e) { boostNode = null; }
      } else if (!on && boostNode) {
        const n = boostNode; boostNode = null;
        const t = ac.currentTime;
        try {
          n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t);
          n.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
          n.flt.frequency.cancelScheduledValues(t); n.flt.frequency.setValueAtTime(n.flt.frequency.value, t);
          n.flt.frequency.exponentialRampToValueAtTime(300, t + 0.25);
          n.src.stop(t + 0.3); n.src.onended = () => { n.src.disconnect(); n.flt.disconnect(); n.g.disconnect(); };
        } catch (e) { /* déjà arrêté */ }
      }
    }
  };
  let boostNode = null;

  // ---------- Musique d'ambiance ----------
  // Nappe de deux oscillateurs désaccordés sous un filtre passe-bas, progression lente d'accords,
  // et un arpège discret. Planifiée par petits blocs sur l'horloge audio.
  const CHORDS = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]; // Cmaj Am Fmaj Gmaj (MIDI)
  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const music = {
    playing: false, timer: null, bus: null, next: 0, bar: 0, STEP: 4.0,
    start() {
      const ac = ctx(); if (!ac || this.playing) return;
      this.bus = ac.createGain(); this.bus.gain.value = 0.0001; this.bus.connect(master);
      this.bus.gain.exponentialRampToValueAtTime(0.9, ac.currentTime + 2);
      this.playing = true; this.next = ac.currentTime + 0.1; this.bar = 0;
      this.timer = setInterval(() => this.schedule(), 500);
      this.schedule();
    },
    stop() {
      const ac = ctx(); if (!this.playing) return;
      this.playing = false; clearInterval(this.timer);
      const b = this.bus; this.bus = null;
      try { b.gain.cancelScheduledValues(ac.currentTime); b.gain.setValueAtTime(b.gain.value, ac.currentTime); b.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1); } catch (e) { /* ignore */ }
      setTimeout(() => { try { b.disconnect(); } catch (e) { /* ignore */ } }, 1200);
    },
    schedule() {
      const ac = ctx(); if (!ac || !this.playing) return;
      while (this.next < ac.currentTime + 1.2) { this.playBar(this.next); this.next += this.STEP; this.bar++; }
    },
    pad(f, t, dur, detune) {
      const ac = AC;
      const o = ac.createOscillator(), g = ac.createGain(), flt = ac.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = f; o.detune.value = detune;
      flt.type = 'lowpass'; flt.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.028, t + 0.8);
      g.gain.setValueAtTime(0.028, t + dur - 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(flt); flt.connect(g); g.connect(this.bus); o.start(t); o.stop(t + dur + 0.05);
      o.onended = () => { o.disconnect(); flt.disconnect(); g.disconnect(); };
    },
    pluck(f, t) {
      const ac = AC;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g); g.connect(this.bus); o.start(t); o.stop(t + 0.5);
      o.onended = () => { o.disconnect(); g.disconnect(); };
    },
    playBar(t) {
      if (!this.bus) return;
      const chord = CHORDS[this.bar % CHORDS.length];
      chord.forEach((n, i) => { this.pad(midi(n), t, this.STEP + 0.4, i % 2 ? 6 : -6); });
      // arpège : 8 croches sur l'accord, une octave au-dessus, quelques silences
      for (let s = 0; s < 8; s++) {
        if ((this.bar + s) % 5 === 3) continue;
        const n = chord[(s * 2 + (this.bar % 3)) % chord.length] + 12 + (s === 7 ? 12 : 0);
        this.pluck(midi(n), t + s * (this.STEP / 8));
      }
    },
    toggle(on) { if (on) { if (unlocked) this.start(); } else this.stop(); }
  };

  // ---------- Vibrations (mobile) ----------
  function vibrate(pattern) {
    try { if (prof().vibrate !== false && navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* non supporté */ }
  }

  return { unlock, note, sfx, music, vibrate, isUnlocked: () => unlocked };
})();
