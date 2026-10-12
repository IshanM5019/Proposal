// Web Audio API Synth Engine for Proposal Website
// 100% self-contained, no external mp3 files required, works reliably offline.

class RomanticAudio {
  constructor() {
    this.ctx = null;
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.currentThemeIndex = 0;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft sweet chime
  playChime(freq = 523.25, duration = 0.6) {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  // Play playful dodge sound for NO button
  playDodge() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.12);
      osc.frequency.linearRampToValueAtTime(300, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Play grand celebration fanfare when YES is clicked
  playCelebration() {
    try {
      this.init();
      const notes = [
        { f: 523.25, t: 0.0, d: 0.4 },  // C5
        { f: 659.25, t: 0.12, d: 0.4 }, // E5
        { f: 783.99, t: 0.24, d: 0.4 }, // G5
        { f: 1046.50, t: 0.36, d: 0.8 },// C6
        { f: 1318.51, t: 0.52, d: 1.2 },// E6
        { f: 1567.98, t: 0.70, d: 1.8 } // G6
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const start = this.ctx.currentTime + t;

        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + d);
      });
    } catch (e) {}
  }

  // Romantic ambient lullaby melody generator
  toggleBgm(callback) {
    this.init();
    if (this.isPlayingBgm) {
      this.isPlayingBgm = false;
      if (this.bgmTimer) clearTimeout(this.bgmTimer);
      if (callback) callback(false);
      return false;
    } else {
      this.isPlayingBgm = true;
      this.playRomanticMelodyLoop();
      if (callback) callback(true);
      return true;
    }
  }

  playRomanticMelodyLoop() {
    if (!this.isPlayingBgm) return;

    // Dreamy romantic chord arpeggios (Canon in D / Romantic Piano progression)
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23], // F Major
      [196.00, 246.94, 293.66, 392.00], // G Major
      [220.00, 261.63, 329.63, 523.25], // Am7
      [174.61, 261.63, 329.63, 440.00], // Fmaj7
      [196.00, 293.66, 392.00, 587.33], // G
      [261.63, 392.00, 523.25, 659.25]  // Cadd9
    ];

    let chordIndex = 0;
    const playNextBar = () => {
      if (!this.isPlayingBgm) return;

      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      // Play warm synth pad note
      try {
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        padOsc.type = 'triangle';
        padOsc.frequency.setValueAtTime(currentChord[0] * 0.5, this.ctx.currentTime);
        padGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        padGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.2);

        padOsc.connect(padGain);
        padGain.connect(this.masterGain);
        padOsc.start();
        padOsc.stop(this.ctx.currentTime + 3.2);

        // Arpeggiate chord notes like a music box
        currentChord.forEach((freq, idx) => {
          const noteOsc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();
          noteOsc.type = 'sine';
          const noteTime = this.ctx.currentTime + idx * 0.45;

          noteOsc.frequency.setValueAtTime(freq, noteTime);
          noteGain.gain.setValueAtTime(0.09, noteTime);
          noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.2);

          noteOsc.connect(noteGain);
          noteGain.connect(this.masterGain);
          noteOsc.start(noteTime);
          noteOsc.stop(noteTime + 1.2);
        });
      } catch (err) {}

      this.bgmTimer = setTimeout(playNextBar, 2200);
    };

    playNextBar();
  }
}

window.romanticAudio = new RomanticAudio();
