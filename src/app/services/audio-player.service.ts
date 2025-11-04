import { Injectable } from '@angular/core';
import { AudioStateService } from './audio-state.service';
import { DevModeService } from './dev-mode.service';
import { AmbientAudioService } from './ambient-audio.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audio?: HTMLAudioElement;
  private checkInterval?: any;
  private updateInterval?: any;

  public isPlaying = false;
  public audioEnabled = false;
  public volume = 0.7;
  public isMuted = false;
  private volumeBeforeMute = 0.7;
  
  // LocalStorage keys
  private readonly MUTE_STATE_KEY = 'temple-chalisa-muted';
  private readonly VOLUME_STATE_KEY = 'temple-chalisa-volume';
  
  // Hourly schedule info
  public nextChantTime: Date | null = null;
  public timeUntilNextChant = '';
  public currentlyInChantWindow = false;
  public minutesIntoHour = 0;

  // Hanuman Chalisa duration (in seconds) - 8 minutes 32 seconds
  private readonly CHALISA_DURATION = 512; // 8:32 actual duration
  // 24/7 operation - no time restrictions
  public manualPlayback = false; // Track if user is manually playing

  constructor(
    private audioStateService: AudioStateService,
    private devMode: DevModeService,
    private ambientAudioService: AmbientAudioService
  ) {
    this.loadSavedState();
    this.initialize();
  }

  /**
   * Load saved mute and volume state from localStorage
   */
  private loadSavedState(): void {
    // Load mute state
    const savedMute = localStorage.getItem(this.MUTE_STATE_KEY);
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
    
    // Load volume state
    const savedVolume = localStorage.getItem(this.VOLUME_STATE_KEY);
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
      this.volumeBeforeMute = this.volume;
    }
  }

  /**
   * Save mute state to localStorage
   */
  private saveMuteState(): void {
    localStorage.setItem(this.MUTE_STATE_KEY, this.isMuted.toString());
  }

  /**
   * Save volume state to localStorage
   */
  private saveVolumeState(): void {
    localStorage.setItem(this.VOLUME_STATE_KEY, this.volume.toString());
  }

  /**
   * Initialize the audio service
   */
  initialize(): void {
    this.calculateNextChantTime();
    
    // Update countdown every second
    this.updateInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
    
    // Check every second if we should start playing
    this.checkInterval = setInterval(() => {
      this.checkAndAutoPlay();
    }, 1000);
  }

  /**
   * Enable audio (must be called by user gesture)
   */
  enableAudio(): void {
    if (this.audioEnabled) return;

    this.audio = new Audio();
    this.audio.src = 'assets/audio/hanuman-chalisa.mp3';
    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.audio.loop = false;
    this.audioEnabled = true;
    
    // Setup event listeners
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.manualPlayback = false; // Reset manual playback when audio ends
      this.audioStateService.setPlayingState(false);
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.isPlaying = false;
      this.audioStateService.setPlayingState(false);
    });

    // Immediately check if we should start playing
    this.checkAndAutoPlay();
  }

  /**
   * Calculate the next scheduled chant time
   */
  private calculateNextChantTime(): void {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Calculate minutes into current hour
    this.minutesIntoHour = currentMinute;

    // Check if we're currently in a chant window (24/7 operation)
    const secondsIntoHour = (currentMinute * 60) + currentSecond;
    if (secondsIntoHour < this.CHALISA_DURATION) {
      this.currentlyInChantWindow = true;
      // Next chant is next hour
      this.nextChantTime = new Date(now);
      this.nextChantTime.setHours(currentHour + 1, 0, 0, 0);
      return;
    }

    this.currentlyInChantWindow = false;

    // Next chant is at the start of next hour (24/7 operation)
    const nextChant = new Date(now);
    nextChant.setHours(currentHour + 1, 0, 0, 0);
    this.nextChantTime = nextChant;
  }

  /**
   * Update countdown display
   */
  private updateCountdown(): void {
    if (!this.nextChantTime) return;

    const now = new Date();
    const diff = this.nextChantTime.getTime() - now.getTime();

    if (diff <= 0) {
      this.calculateNextChantTime();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      this.timeUntilNextChant = `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      this.timeUntilNextChant = `${minutes}m ${seconds}s`;
    } else {
      this.timeUntilNextChant = `${seconds}s`;
    }
  }

  /**
   * Check if we should auto-play
   */
  private checkAndAutoPlay(): void {
    if (!this.audioEnabled || !this.audio) return;
    
    // Don't interrupt manual playback
    if (this.manualPlayback) return;

    // Check dev mode override first
    const forcedPlay = this.devMode.getForcedChalisaPlayState();
    if (forcedPlay !== null) {
      if (forcedPlay && !this.isPlaying) {
        // Force play
        const now = new Date();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();
        const secondsIntoHour = (currentMinute * 60) + currentSecond;
        this.audio.currentTime = secondsIntoHour % this.CHALISA_DURATION;
        this.play();
        this.currentlyInChantWindow = true;
      } else if (!forcedPlay && this.isPlaying) {
        // Force stop
        this.pause();
        this.currentlyInChantWindow = false;
      }
      return;
    }

    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const secondsIntoHour = (currentMinute * 60) + currentSecond;
    
    // 24/7 operation - play during the first ~8:32 minutes of every hour
    if (secondsIntoHour < this.CHALISA_DURATION) {
      if (!this.isPlaying) {
        this.audio.currentTime = secondsIntoHour;
        this.play();
        this.currentlyInChantWindow = true;
      }
    } else {
      if (this.isPlaying) {
        this.pause();
      }
      this.currentlyInChantWindow = false;
    }

    this.calculateNextChantTime();
  }

  /**
   * Play audio
   */
  private play(): void {
    if (!this.audio) return;
    
    this.audio.play()
      .then(() => {
        this.isPlaying = true;
        this.audioStateService.setPlayingState(true);
      })
      .catch(error => {
        console.error('Play error:', error);
      });
  }

  /**
   * Pause audio
   */
  private pause(): void {
    if (!this.audio) return;
    
    this.audio.pause();
    this.isPlaying = false;
    this.audioStateService.setPlayingState(false);
  }

  /**
   * Change volume
   */
  setVolume(volume: number): void {
    this.volume = volume;
    this.saveVolumeState();
    if (this.audio) {
      this.audio.volume = volume;
    }
    // If volume is set above 0, unmute
    if (volume > 0 && this.isMuted) {
      this.isMuted = false;
      this.saveMuteState();
    }
  }

  /**
   * Toggle mute/unmute (Master Mute - affects both Chalisa and Ambient audio)
   */
  public toggleMute(): void {
    if (this.isMuted) {
      // Unmute: restore previous volume
      this.isMuted = false;
      this.volume = this.volumeBeforeMute;
      if (this.audio) {
        this.audio.volume = this.volumeBeforeMute;
      }
      // Unmute ambient audio as well
      this.ambientAudioService.setMute(false);
    } else {
      // Mute: save current volume and set to 0
      this.isMuted = true;
      this.volumeBeforeMute = this.volume;
      this.volume = 0;
      if (this.audio) {
        this.audio.volume = 0;
      }
      // Mute ambient audio as well
      this.ambientAudioService.setMute(true);
    }
    this.saveMuteState();
  }

  /**
   * Manually play Hanuman Chalisa from the beginning
   */
  public playManually(): void {
    if (!this.audio || !this.audioEnabled) return;
    
    this.manualPlayback = true;
    this.audio.currentTime = 0;
    this.play();
  }

  /**
   * Manually pause Hanuman Chalisa
   */
  public pauseManually(): void {
    if (!this.audio) return;
    
    this.manualPlayback = false;
    this.pause();
  }

  /**
   * Toggle manual playback
   */
  public toggleManualPlayback(): void {
    if (this.isPlaying && this.manualPlayback) {
      this.pauseManually();
    } else {
      this.playManually();
    }
  }

  /**
   * Get status message
   */
  getStatusMessage(): string {
    if (this.manualPlayback) {
      return 'Playing Hanuman Chalisa (Manual) 🎵';
    }
    
    if (this.currentlyInChantWindow) {
      return 'Hanuman Chalisa is playing now! 🙏';
    }
    
    return 'Hanuman Chalisa plays every hour, 24/7 🕉️';
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = undefined;
    }
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
