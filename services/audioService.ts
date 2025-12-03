import { SoundType } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;

  constructor() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private initCtx() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ctx) {
       this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  play(type: SoundType) {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;

    switch (type) {
      case 'correct':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'wrong':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'win':
        osc.type = 'triangle';
        // Simple arpeggio
        [440, 554, 659, 880].forEach((freq, i) => {
            const o = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            o.connect(g);
            g.connect(this.ctx!.destination);
            o.frequency.value = freq;
            g.gain.setValueAtTime(0.2, now + i * 0.1);
            g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
            o.start(now + i * 0.1);
            o.stop(now + i * 0.1 + 0.4);
        });
        break;

      case 'click':
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
        
      case 'engine':
         // Low rumble simulation
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
    }
  }
}

export const audioService = new AudioService();
