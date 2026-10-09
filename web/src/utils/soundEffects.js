/**
 * Synthesizes audio feedback using Web Audio API (100% offline, zero assets needed).
 */
class SoundEffectsSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Checkpoint Reached: Ascending ethereal arpeggio (C5 -> E5 -> G5 -> C6)
   */
  playCheckpointReached() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.4);
      });
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }

  /**
   * Choice Prompt: Double stereo alert beep
   */
  playDecisionPrompt() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [440, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.18, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.22);
      });
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }

  /**
   * Choice Made: Tactile confirm snap click
   */
  playChoiceSelected(isLeft = true) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const pan = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isLeft ? 350 : 700, now);
      osc.frequency.exponentialRampToValueAtTime(isLeft ? 600 : 1100, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      if (pan) {
        pan.pan.setValueAtTime(isLeft ? -0.8 : 0.8, now);
        osc.connect(gain);
        gain.connect(pan);
        pan.connect(this.ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }

  /**
   * Story Completed: Grand victory fanfare
   */
  playVictoryFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chords = [
        { freqs: [392.0, 493.88, 587.33], t: 0, dur: 0.25 }, // G
        { freqs: [440.0, 554.37, 659.25], t: 0.28, dur: 0.25 }, // A
        { freqs: [523.25, 659.25, 783.99, 1046.5], t: 0.58, dur: 0.8 } // C high
      ];

      chords.forEach(c => {
        c.freqs.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + c.t);
          gain.gain.setValueAtTime(0, now + c.t);
          gain.gain.linearRampToValueAtTime(0.18, now + c.t + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + c.t);
          osc.stop(now + c.t + c.dur + 0.1);
        });
      });
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }
}

export const sfx = new SoundEffectsSynthesizer();
