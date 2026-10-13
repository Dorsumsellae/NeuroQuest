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
    // Réussite : petit carillon cristallin (arpège majeur rapide + cloche sur la dernière note).
    // Monte d'un ton par palier de série (mult 1 à 3) pour récompenser l'enchaînement.
    good(mult) {
      const ac = ctx(); if (!ac || prof().muted) return;
      const t = ac.currentTime, shift = Math.pow(2, ((mult || 1) - 1) * 2 / 12);
      const arp = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
      arp.forEach((f, i) => { note(f * shift, i === 3 ? 0.35 : 0.11, 'triangle', t + i * 0.055, 0.045); });
      // cloche : fondamentale + partiels inharmoniques courts, enveloppe longue
      [[1, 0.05, 0.7], [2.76, 0.018, 0.35], [5.4, 0.008, 0.2]].forEach(([k, v, d]) => {
        note(1046.5 * shift * k, d, 'sine', t + 0.165, v);
      });
      // scintillement : bruit très court filtré haut
      try {
        const len = Math.floor(ac.sampleRate * 0.12), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain();
        src.buffer = buf; flt.type = 'highpass'; flt.frequency.value = 6000; g.gain.value = 0.02;
        src.connect(flt); flt.connect(g); g.connect(master); src.start(t + 0.165); src.stop(t + 0.3);
        src.onended = () => { src.disconnect(); flt.disconnect(); g.disconnect(); };
      } catch (e) { /* ignore */ }
    },
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

  // ---------- Musique : synthwave énergique, 128 BPM ----------
  // Par mesure (4 temps) : grosse caisse sur chaque temps, charleston sur les contretemps, basse
  // en croches, arpège en doubles-croches et nappe discrète. Progression Am F C G.
  // Tout est planifié sur l'horloge audio par blocs d'une mesure.
  const CHORDS = [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]]; // Am Fmaj Cmaj Gmaj (MIDI)
  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const BPM = 128, BEAT = 60 / BPM;
  const music = {
    playing: false, timer: null, bus: null, next: 0, bar: 0, STEP: BEAT * 4, noise: null,
    start() {
      const ac = ctx(); if (!ac || this.playing) return;
      this.bus = ac.createGain(); this.bus.gain.value = 0.0001; this.bus.connect(master);
      this.bus.gain.exponentialRampToValueAtTime(0.8, ac.currentTime + 1);
      if (!this.noise) { // bruit blanc partagé pour la charleston
        const len = ac.sampleRate, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        this.noise = buf;
      }
      this.playing = true; this.next = ac.currentTime + 0.1; this.bar = 0;
      this.timer = setInterval(() => this.schedule(), 400);
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
    // Voix : oscillateur + filtre + enveloppe, nettoyés à la fin de la note
    voice(type, f, t, dur, vol, cutoff, opts) {
      const ac = AC; opts = opts || {};
      const o = ac.createOscillator(), g = ac.createGain(), flt = ac.createBiquadFilter();
      o.type = type; o.frequency.setValueAtTime(f, t); if (opts.detune) o.detune.value = opts.detune;
      if (opts.glideTo) o.frequency.exponentialRampToValueAtTime(opts.glideTo, t + (opts.glideTime || 0.08));
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(cutoff, t);
      if (opts.sweep) flt.frequency.exponentialRampToValueAtTime(Math.max(80, cutoff * opts.sweep), t + dur);
      const a = opts.attack || 0.005, r = Math.max(0.02, dur - a);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + r);
      o.connect(flt); flt.connect(g); g.connect(this.bus); o.start(t); o.stop(t + dur + 0.05);
      o.onended = () => { o.disconnect(); flt.disconnect(); g.disconnect(); };
    },
    kick(t) { this.voice('sine', 150, t, 0.28, 0.16, 400, { glideTo: 45, glideTime: 0.12 }); },
    hat(t, open) {
      const ac = AC, src = ac.createBufferSource(), g = ac.createGain(), flt = ac.createBiquadFilter();
      src.buffer = this.noise; flt.type = 'highpass'; flt.frequency.value = 7000;
      const dur = open ? 0.18 : 0.05;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(open ? 0.05 : 0.04, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(flt); flt.connect(g); g.connect(this.bus); src.start(t); src.stop(t + dur + 0.02);
      src.onended = () => { src.disconnect(); flt.disconnect(); g.disconnect(); };
    },
    bass(f, t, dur) { this.voice('sawtooth', f, t, dur, 0.09, 700, { sweep: 0.3, attack: 0.004 }); },
    lead(f, t, dur) { this.voice('square', f, t, dur, 0.035, 2600, { sweep: 0.5, attack: 0.004, detune: 4 }); },
    pad(f, t, dur, detune) { this.voice('sawtooth', f, t, dur, 0.012, 1100, { attack: 0.25, detune }); },
    playBar(t) {
      if (!this.bus) return;
      const chord = CHORDS[this.bar % CHORDS.length], root = chord[0], E = BEAT / 2, Sx = BEAT / 4;
      // nappe : fondamentale + quinte, discrète
      this.pad(midi(root + 12), t, this.STEP, -7); this.pad(midi(chord[1] + 12), t, this.STEP, 7);
      // batterie : grosse caisse sur chaque temps (+ 1 contretemps une mesure sur deux), charleston sur les contretemps
      for (let b = 0; b < 4; b++) {
        this.kick(t + b * BEAT);
        this.hat(t + b * BEAT + E, b === 3 && this.bar % 2 === 1);
      }
      if (this.bar % 2 === 1) this.kick(t + 3 * BEAT + E);
      // basse en croches : fondamentale, avec l'octave sur les contretemps 2 et 4
      for (let s = 0; s < 8; s++) {
        const up = (s === 3 || s === 7) ? 12 : 0;
        this.bass(midi(root - 12 + up), t + s * E, E * 0.9);
      }
      // arpège en doubles-croches : montée sur l'accord, une octave au-dessus, motif qui varie par mesure
      const pattern = [0, 1, 2, 3, 2, 1, 0, 2, 1, 3, 2, 0, 3, 1, 2, 3];
      for (let s = 0; s < 16; s++) {
        if ((s + this.bar) % 7 === 6) continue; // respirations
        const n = chord[pattern[(s + this.bar * 3) % 16]] + 12 + (s >= 12 && this.bar % 4 === 3 ? 12 : 0);
        this.lead(midi(n), t + s * Sx, Sx * 0.8);
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
