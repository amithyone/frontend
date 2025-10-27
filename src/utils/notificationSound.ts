// Notification sound utilities
export class NotificationSound {
  private static audioContext: AudioContext | null = null;
  private static isEnabled = true;

  static init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('AudioContext not supported:', error);
      }
    }
  }

  static setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('notification_sound_enabled', enabled.toString());
  }

  static isSoundEnabled(): boolean {
    const stored = localStorage.getItem('notification_sound_enabled');
    return stored === null ? true : stored === 'true';
  }

  static playInboxSound() {
    if (!this.isEnabled || !this.isSoundEnabled()) return;
    this.playTone(800, 0.1, 'sine'); // Higher pitch for inbox
  }

  static playSupportSound() {
    if (!this.isEnabled || !this.isSoundEnabled()) return;
    this.playTone(600, 0.15, 'triangle'); // Different pitch for support
  }

  static playCustomSound(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.isEnabled || !this.isSoundEnabled()) return;
    this.playTone(frequency, duration, type);
  }

  private static playTone(frequency: number, duration: number, type: OscillatorType) {
    if (!this.audioContext) {
      this.init();
      if (!this.audioContext) return;
    }

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      // Create a pleasant envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  // Predefined sound patterns
  static playSuccessSound() {
    this.playCustomSound(800, 0.1, 'sine');
    setTimeout(() => this.playCustomSound(1000, 0.1, 'sine'), 150);
  }

  static playErrorSound() {
    this.playCustomSound(400, 0.2, 'sawtooth');
    setTimeout(() => this.playCustomSound(300, 0.2, 'sawtooth'), 200);
  }

  static playMessageSound() {
    this.playCustomSound(700, 0.1, 'triangle');
    setTimeout(() => this.playCustomSound(900, 0.1, 'triangle'), 100);
  }

  static playAlertSound() {
    this.playCustomSound(600, 0.15, 'square');
    setTimeout(() => this.playCustomSound(400, 0.15, 'square'), 200);
    setTimeout(() => this.playCustomSound(600, 0.15, 'square'), 400);
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  NotificationSound.init();
  NotificationSound.isEnabled = NotificationSound.isSoundEnabled();
}
