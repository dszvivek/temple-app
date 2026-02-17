import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * AmbientAudioService - Manages temple ambient sounds with smart autoplay
 * 
 * Features:
 * - Preloads three audio assets (ambience, bell, shankh)
 * - Handles iOS/Chrome autoplay restrictions (requires user gesture)
 * - Persists mute state in localStorage
 * - Provides isTempleOpen$ observable based on local time (5AM-7PM)
 * - Auto-starts ambience when temple is open (after user interaction)
 */
@Injectable({
  providedIn: 'root'
})
export class AmbientAudioService {
  // Audio elements
  private ambienceAudio?: HTMLAudioElement;
  private bellAudio?: HTMLAudioElement;
  private shankhAudio?: HTMLAudioElement;

  // State management
  private readonly MUTE_STATE_KEY = 'temple-ambient-muted';
  private readonly VOLUME_KEY = 'temple-ambient-volume';
  
  private userHasInteracted = false;
  private assetsPreloaded = false;
  
  // Observable state
  private muteStateSubject = new BehaviorSubject<boolean>(this.loadMuteState());
  public isMuted$ = this.muteStateSubject.asObservable();
  
  private ambiencePlaying = new BehaviorSubject<boolean>(false);
  public isAmbiencePlaying$ = this.ambiencePlaying.asObservable();
  
  // Temple operates 24/7 - ambient audio always available
  private readonly TEMPLE_OPEN_HOUR = 0;
  private readonly TEMPLE_CLOSE_HOUR = 24;
  
  private templeOpenSubject = new BehaviorSubject<boolean>(this.checkIfTempleOpen());
  public isTempleOpen$: Observable<boolean> = this.templeOpenSubject.asObservable();
  
  // Check interval for temple hours
  private checkInterval?: any;

  constructor() {
    this.initializeTempleHoursCheck();
  }

  /**
   * Initialize the service with user gesture (required for autoplay)
   * This must be called from a user interaction (click, touch, etc.)
   */
  public initialize(): void {
    if (this.userHasInteracted) {
      return; // Already initialized
    }

    this.userHasInteracted = true;
    this.preloadAudioAssets();
    
    // Auto-start ambience if temple is open and not muted
    if (this.checkIfTempleOpen() && !this.muteStateSubject.value) {
      setTimeout(() => this.playAmbience(), 100);
    }
  }

  /**
   * Preload all audio assets
   */
  private preloadAudioAssets(): void {
    if (this.assetsPreloaded) {
      return;
    }

    const savedVolume = this.loadVolume();

    // Preload temple ambience (looping background sound)
    this.ambienceAudio = new Audio();
    this.ambienceAudio.src = 'assets/audio/temple_ambience.mp3';
    this.ambienceAudio.loop = true;
    this.ambienceAudio.volume = savedVolume * 0.4; // Lower volume for ambience
    this.ambienceAudio.preload = 'auto';

    // Preload bell sound
    this.bellAudio = new Audio();
    this.bellAudio.src = 'assets/audio/effects/mandir_bell.mp3';
    this.bellAudio.loop = false;
    this.bellAudio.volume = savedVolume * 0.8;
    this.bellAudio.preload = 'auto';

    // Preload shankh sound
    this.shankhAudio = new Audio();
    this.shankhAudio.src = 'assets/audio/ambient/shankh_drone.mp3';
    this.shankhAudio.loop = false;
    this.shankhAudio.volume = savedVolume * 0.7;
    this.shankhAudio.preload = 'auto';

    // Setup event listeners
    this.setupEventListeners();
    
    this.assetsPreloaded = true;
  }

  /**
   * Setup event listeners for audio elements
   */
  private setupEventListeners(): void {
    if (this.ambienceAudio) {
      this.ambienceAudio.addEventListener('play', () => {
        this.ambiencePlaying.next(true);
      });
      
      this.ambienceAudio.addEventListener('pause', () => {
        this.ambiencePlaying.next(false);
      });
      
      this.ambienceAudio.addEventListener('ended', () => {
        this.ambiencePlaying.next(false);
      });

      this.ambienceAudio.addEventListener('error', (e) => {
        console.error('Ambience audio error:', e);
        this.ambiencePlaying.next(false);
      });
    }
  }

  /**
   * Play temple ambience (looping background sound)
   */
  public playAmbience(): void {
    if (!this.userHasInteracted) {
      console.warn('Cannot play ambience: User interaction required first');
      return;
    }

    if (!this.ambienceAudio) {
      this.preloadAudioAssets();
    }

    if (this.ambienceAudio && !this.muteStateSubject.value) {
      this.ambienceAudio.play().catch(err => {
        console.error('Failed to play ambience:', err);
      });
    }
  }

  /**
   * Stop temple ambience
   */
  public stopAmbience(): void {
    if (this.ambienceAudio) {
      this.ambienceAudio.pause();
      this.ambienceAudio.currentTime = 0;
    }
  }

  /**
   * Ring the temple bell
   */
  public ringBell(): void {
    if (!this.userHasInteracted) {
      console.warn('Cannot ring bell: User interaction required first');
      return;
    }

    if (!this.bellAudio) {
      this.preloadAudioAssets();
    }

    if (this.bellAudio && !this.muteStateSubject.value) {
      // Reset to beginning if already playing
      this.bellAudio.currentTime = 0;
      this.bellAudio.play().catch(err => {
        console.error('Failed to ring bell:', err);
      });
    }
  }

  /**
   * Play the shankh (conch shell) sound
   */
  public playShankh(): void {
    if (!this.userHasInteracted) {
      console.warn('Cannot play shankh: User interaction required first');
      return;
    }

    if (!this.shankhAudio) {
      this.preloadAudioAssets();
    }

    if (this.shankhAudio && !this.muteStateSubject.value) {
      // Reset to beginning if already playing
      this.shankhAudio.currentTime = 0;
      this.shankhAudio.play().catch(err => {
        console.error('Failed to play shankh:', err);
      });
    }
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): void {
    const newMuteState = !this.muteStateSubject.value;
    this.setMute(newMuteState);
  }

  /**
   * Set mute state
   */
  public setMute(muted: boolean): void {
    this.muteStateSubject.next(muted);
    this.saveMuteState(muted);

    if (muted) {
      this.stopAmbience();
    } else if (this.checkIfTempleOpen() && this.userHasInteracted) {
      this.playAmbience();
    }
  }

  /**
   * Get current mute state
   */
  public isMuted(): boolean {
    return this.muteStateSubject.value;
  }

  /**
   * Set volume for all ambient sounds
   */
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.saveVolume(clampedVolume);

    if (this.ambienceAudio) {
      this.ambienceAudio.volume = clampedVolume * 0.4;
    }
    if (this.bellAudio) {
      this.bellAudio.volume = clampedVolume * 0.8;
    }
    if (this.shankhAudio) {
      this.shankhAudio.volume = clampedVolume * 0.7;
    }
  }

  /**
   * Check if temple is currently open (24/7 - always open)
   */
  private checkIfTempleOpen(): boolean {
    return true; // Temple operates 24/7
  }

  /**
   * Initialize periodic check for temple hours
   */
  private initializeTempleHoursCheck(): void {
    // Check every minute if temple hours have changed
    this.checkInterval = setInterval(() => {
      const isOpen = this.checkIfTempleOpen();
      const wasOpen = this.templeOpenSubject.value;

      if (isOpen !== wasOpen) {
        this.templeOpenSubject.next(isOpen);
        
        // Auto-start ambience when temple opens
        if (isOpen && this.userHasInteracted && !this.muteStateSubject.value) {
          this.playAmbience();
        }
        // Auto-stop ambience when temple closes
        else if (!isOpen) {
          this.stopAmbience();
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Get next temple opening/closing time
   */
  public getNextTempleStatusChange(): Date {
    const now = new Date();
    const currentHour = now.getHours();
    const nextChange = new Date(now);

    if (currentHour < this.TEMPLE_OPEN_HOUR) {
      // Before opening - next change is opening time today
      nextChange.setHours(this.TEMPLE_OPEN_HOUR, 0, 0, 0);
    } else if (currentHour >= this.TEMPLE_CLOSE_HOUR) {
      // After closing - next change is opening time tomorrow
      nextChange.setDate(nextChange.getDate() + 1);
      nextChange.setHours(this.TEMPLE_OPEN_HOUR, 0, 0, 0);
    } else {
      // During opening hours - next change is closing time today
      nextChange.setHours(this.TEMPLE_CLOSE_HOUR, 0, 0, 0);
    }

    return nextChange;
  }

  /**
   * Load mute state from localStorage
   */
  private loadMuteState(): boolean {
    try {
      const saved = localStorage.getItem(this.MUTE_STATE_KEY);
      return saved === 'true';
    } catch (error) {
      console.error('Failed to load mute state:', error);
      return false;
    }
  }

  /**
   * Save mute state to localStorage
   */
  private saveMuteState(muted: boolean): void {
    try {
      localStorage.setItem(this.MUTE_STATE_KEY, String(muted));
    } catch (error) {
      console.error('Failed to save mute state:', error);
    }
  }

  /**
   * Load volume from localStorage
   */
  private loadVolume(): number {
    try {
      const saved = localStorage.getItem(this.VOLUME_KEY);
      return saved ? parseFloat(saved) : 0.7;
    } catch (error) {
      console.error('Failed to load volume:', error);
      return 0.7;
    }
  }

  /**
   * Save volume to localStorage
   */
  private saveVolume(volume: number): void {
    try {
      localStorage.setItem(this.VOLUME_KEY, String(volume));
    } catch (error) {
      console.error('Failed to save volume:', error);
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.stopAmbience();
  }
}
