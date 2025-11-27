import { Injectable } from '@angular/core';
import { AudioStateService } from './audio-state.service';
import { AmbientAudioService } from './ambient-audio.service';
import { DeityService } from './deity.service';
import { DeityType } from '../models/deity.model';

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
  private currentDeityType: DeityType | null = null;
  
  // LocalStorage keys
  private readonly MUTE_STATE_KEY = 'temple-audio-muted';
  private readonly VOLUME_STATE_KEY = 'temple-audio-volume';
  
  // Audio file mapping by deity - uses existing audio as fallback until new files are added
  private readonly DEITY_AUDIO_FILES: Record<DeityType, string> = {
    [DeityType.HANUMAN]: 'assets/audio/mantras/hanuman-chalisa.mp3',
    [DeityType.GANESH]: 'assets/audio/aarti/ganesh-aarti.mp3',
    // New deities - fallback to existing audio until dedicated files are added
    [DeityType.SHIVA]: 'assets/audio/aarti/ganesh-aarti.mp3',    // TODO: Replace with shiva-aarti.mp3
    [DeityType.KRISHNA]: 'assets/audio/aarti/ganesh-aarti.mp3',  // TODO: Replace with krishna-aarti.mp3
    [DeityType.DURGA]: 'assets/audio/aarti/ganesh-aarti.mp3'     // TODO: Replace with durga-aarti.mp3
  };
  
  // Hourly schedule info
  public nextChantTime: Date | null = null;
  public timeUntilNextChant = '';
  public currentlyInChantWindow = false;
  public minutesIntoHour = 0;

  // Audio duration (in seconds) - varies by deity
  private readonly AUDIO_DURATIONS: Record<DeityType, number> = {
    [DeityType.HANUMAN]: 512, // 8:32 - Hanuman Chalisa
    [DeityType.GANESH]: 150,  // 2:30 - Ganesh Aarti
    [DeityType.SHIVA]: 300,   // 5:00 - Shiva Aarti
    [DeityType.KRISHNA]: 300, // 5:00 - Krishna Aarti
    [DeityType.DURGA]: 300    // 5:00 - Durga Aarti
  };
  
  // 24/7 operation - no time restrictions
  public manualPlayback = false; // Track if user is manually playing

  constructor(
    private audioStateService: AudioStateService,
    private ambientAudio: AmbientAudioService,
    private deityService: DeityService
  ) {
    this.loadSavedState();
    this.initialize();
    this.subscribeToDeityChanges();
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
   * Subscribe to deity changes and stop audio when switching
   */
  private subscribeToDeityChanges(): void {
    this.deityService.currentDeity$.subscribe(deity => {
      const newDeityType = deity.id;
      
      // If deity changed and audio is playing, stop it
      if (this.currentDeityType && this.currentDeityType !== newDeityType) {
        console.log(`🎵 Switching from ${this.currentDeityType} to ${newDeityType} - stopping audio`);
        this.stop();
        this.manualPlayback = false;
      }
      
      // Update current deity and reload audio if enabled
      this.currentDeityType = newDeityType;
      
      // If audio is enabled, reload with new deity's audio
      if (this.audioEnabled) {
        this.loadAudioForCurrentDeity();
      }
    });
  }

  /**
   * Load audio file for current deity
   */
  private loadAudioForCurrentDeity(): void {
    if (!this.currentDeityType || !this.audio) return;
    
    const audioFile = this.DEITY_AUDIO_FILES[this.currentDeityType];
    if (audioFile && this.audio.src !== audioFile) {
      const wasPlaying = this.isPlaying;
      
      // Stop current audio
      if (wasPlaying) {
        this.audio.pause();
      }
      
      // Load new audio
      this.audio.src = audioFile;
      this.audio.volume = this.isMuted ? 0 : this.volume;
      
      console.log(`🎵 Loaded audio for ${this.currentDeityType}: ${audioFile}`);
    }
  }

  /**
   * Get current audio duration based on deity
   */
  private getCurrentAudioDuration(): number {
    if (!this.currentDeityType) {
      return this.AUDIO_DURATIONS[DeityType.HANUMAN]; // Default
    }
    return this.AUDIO_DURATIONS[this.currentDeityType] || 150;
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

    // Get current deity
    const currentDeity = this.deityService.getCurrentDeity();
    this.currentDeityType = currentDeity.id;
    
    const audioFile = this.DEITY_AUDIO_FILES[this.currentDeityType];
    
    this.audio = new Audio();
    this.audio.src = audioFile;
    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.audio.loop = false;
    this.audioEnabled = true;
    
    console.log(`🎵 Audio enabled for ${this.currentDeityType}: ${audioFile}`);
    
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
    
    const audioDuration = this.getCurrentAudioDuration();

    // Calculate minutes into current hour
    this.minutesIntoHour = currentMinute;

    // Check if we're currently in a chant window (24/7 operation)
    const secondsIntoHour = (currentMinute * 60) + currentSecond;
    if (secondsIntoHour < audioDuration) {
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

    const audioDuration = this.getCurrentAudioDuration();

    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const secondsIntoHour = (currentMinute * 60) + currentSecond;
    
    // 24/7 operation - play during the audio duration at start of every hour
    if (secondsIntoHour < audioDuration) {
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
   * Stop audio completely (resets playback position)
   */
  public stop(): void {
    if (!this.audio) return;
    
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.manualPlayback = false;
    this.audioStateService.setPlayingState(false);
    console.log('🔇 Audio stopped');
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
      this.ambientAudio.setMute(false);
    } else {
      // Mute: save current volume and set to 0
      this.isMuted = true;
      this.volumeBeforeMute = this.volume;
      this.volume = 0;
      if (this.audio) {
        this.audio.volume = 0;
      }
      // Mute ambient audio as well
      this.ambientAudio.setMute(true);
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
    const audioName = this.getAudioName();
    
    if (this.manualPlayback) {
      return `Playing ${audioName} (Manual) 🎵`;
    }
    
    if (this.currentlyInChantWindow) {
      return `${audioName} is playing now! 🙏`;
    }
    
    return `${audioName} plays every hour, 24/7 🕉️`;
  }

  /**
   * Get the name of the current audio based on deity
   */
  getAudioName(): string {
    if (!this.currentDeityType) {
      return 'Sacred Audio';
    }
    
    switch (this.currentDeityType) {
      case DeityType.HANUMAN:
        return 'Hanuman Chalisa';
      case DeityType.GANESH:
        return 'Ganesh Aarti';
      default:
        return 'Sacred Audio';
    }
  }

  /**
   * Get the play button text based on deity
   */
  getPlayButtonText(): string {
    if (!this.currentDeityType) {
      return '▶️ Play';
    }
    
    switch (this.currentDeityType) {
      case DeityType.HANUMAN:
        return '▶️ Play Chalisa';
      case DeityType.GANESH:
        return '▶️ Play Aarti';
      default:
        return '▶️ Play';
    }
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
