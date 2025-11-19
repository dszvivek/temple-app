import { Injectable } from '@angular/core';

/**
 * TempleBellService - Manages temple bell audio
 * 
 * Features:
 * - Preloads mandir-bell.mp3 for instant playback
 * - Reuses single audio instance for performance
 * - Handles browser autoplay restrictions
 * - Volume control and mute state
 */
@Injectable({
  providedIn: 'root'
})
export class TempleBellService {
  private bellAudio?: HTMLAudioElement;
  private isPreloaded = false;
  private volume = 0.8;
  private isMuted = false;

  constructor() {
    this.preloadBellAudio();
  }

  /**
   * Preload the bell audio file
   */
  private preloadBellAudio(): void {
    try {
      this.bellAudio = new Audio('assets/audio/effects/mandir_bell.mp3');
      this.bellAudio.preload = 'auto';
      this.bellAudio.volume = this.volume;
      
      // Mark as preloaded once it can play
      this.bellAudio.addEventListener('canplaythrough', () => {
        this.isPreloaded = true;
      }, { once: true });

      // Handle errors
      this.bellAudio.addEventListener('error', (e) => {
        console.error('Failed to preload temple bell audio:', e);
        this.isPreloaded = false;
      });

      // Start preloading
      this.bellAudio.load();
    } catch (error) {
      console.error('Error initializing temple bell audio:', error);
    }
  }

  /**
   * Ring the temple bell
   * Returns a promise that resolves when the sound finishes playing
   */
  ringBell(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.bellAudio) {
        console.warn('Bell audio not initialized');
        reject(new Error('Bell audio not initialized'));
        return;
      }

      if (this.isMuted) {
        console.log('Bell is muted');
        resolve();
        return;
      }

      try {
        // Reset to start if already playing
        this.bellAudio.currentTime = 0;
        this.bellAudio.volume = this.volume;

        // Play the bell sound
        const playPromise = this.bellAudio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Successfully started playing
              console.log('🔔 Temple bell ringing...');
              
              // Resolve when sound ends
              const endHandler = () => {
                this.bellAudio?.removeEventListener('ended', endHandler);
                resolve();
              };
              this.bellAudio?.addEventListener('ended', endHandler);
            })
            .catch((error) => {
              // Autoplay was prevented
              console.warn('Bell autoplay prevented:', error);
              reject(error);
            });
        }
      } catch (error) {
        console.error('Error playing bell sound:', error);
        reject(error);
      }
    });
  }

  /**
   * Set bell volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.bellAudio) {
      this.bellAudio.volume = this.volume;
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Mute the bell
   */
  mute(): void {
    this.isMuted = true;
  }

  /**
   * Unmute the bell
   */
  unmute(): void {
    this.isMuted = false;
  }

  /**
   * Toggle mute state
   */
  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  /**
   * Check if bell is muted
   */
  isBellMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Check if bell audio is ready
   */
  isReady(): boolean {
    return this.isPreloaded;
  }

  /**
   * Get audio duration in milliseconds
   */
  getDuration(): number {
    return this.bellAudio?.duration ? this.bellAudio.duration * 1000 : 0;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.bellAudio) {
      this.bellAudio.pause();
      this.bellAudio.src = '';
      this.bellAudio = undefined;
    }
    this.isPreloaded = false;
  }
}
