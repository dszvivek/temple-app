import { Injectable } from '@angular/core';
import { AudioStateService } from './audio-state.service';

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
  
  // Hourly schedule info
  public nextChantTime: Date | null = null;
  public timeUntilNextChant = '';
  public currentlyInChantWindow = false;
  public minutesIntoHour = 0;

  // Hanuman Chalisa duration (in seconds) - 8 minutes 32 seconds
  private readonly CHALISA_DURATION = 512; // 8:32 actual duration
  private readonly START_HOUR = 5; // 5 AM
  private readonly END_HOUR = 19; // 7 PM

  constructor(private audioStateService: AudioStateService) {
    this.initialize();
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
    this.audio.volume = this.volume;
    this.audio.loop = false;
    this.audioEnabled = true;
    
    // Setup event listeners
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
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

    // Check if we're currently in a chant window
    if (currentHour >= this.START_HOUR && currentHour < this.END_HOUR) {
      const secondsIntoHour = (currentMinute * 60) + currentSecond;
      if (secondsIntoHour < this.CHALISA_DURATION) {
        this.currentlyInChantWindow = true;
        // Next chant is next hour
        this.nextChantTime = new Date(now);
        this.nextChantTime.setHours(currentHour + 1, 0, 0, 0);
        return;
      }
    }

    this.currentlyInChantWindow = false;

    // Find next chant time
    const nextChant = new Date(now);
    
    if (currentHour < this.START_HOUR) {
      nextChant.setHours(this.START_HOUR, 0, 0, 0);
    } else if (currentHour >= this.START_HOUR && currentHour < this.END_HOUR) {
      nextChant.setHours(currentHour + 1, 0, 0, 0);
    } else {
      nextChant.setDate(nextChant.getDate() + 1);
      nextChant.setHours(this.START_HOUR, 0, 0, 0);
    }

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

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    if (currentHour >= this.START_HOUR && currentHour < this.END_HOUR) {
      const secondsIntoHour = (currentMinute * 60) + currentSecond;
      
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
    if (this.audio) {
      this.audio.volume = volume;
    }
  }

  /**
   * Get status message
   */
  getStatusMessage(): string {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour < this.START_HOUR || currentHour >= this.END_HOUR) {
      return `Hanuman Chalisa plays every hour from 5 AM to 7 PM`;
    }
    
    if (this.currentlyInChantWindow) {
      return 'Hanuman Chalisa is playing now! 🙏';
    }
    
    return 'Waiting for next hourly chant...';
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
