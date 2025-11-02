import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmbientAudioService } from '../../services/ambient-audio.service';
import { Subscription } from 'rxjs';

/**
 * Example component demonstrating AmbientAudioService integration
 * 
 * Usage:
 * 1. Add this component to your app.module.ts declarations
 * 2. Include <app-ambient-controls></app-ambient-controls> in your template
 * 3. Style as needed for your temple theme
 */
@Component({
  selector: 'app-ambient-controls',
  templateUrl: './ambient-controls.component.html',
  styleUrls: ['./ambient-controls.component.css']
})
export class AmbientControlsComponent implements OnInit, OnDestroy {
  isTempleOpen = false;
  isMuted = false;
  isAmbiencePlaying = false;
  nextStatusChange: Date | null = null;
  
  private subscriptions: Subscription[] = [];

  constructor(public ambientAudio: AmbientAudioService) {}

  ngOnInit(): void {
    // Subscribe to temple open status
    this.subscriptions.push(
      this.ambientAudio.isTempleOpen$.subscribe(isOpen => {
        this.isTempleOpen = isOpen;
        this.updateNextStatusChange();
      })
    );

    // Subscribe to mute state
    this.subscriptions.push(
      this.ambientAudio.isMuted$.subscribe(muted => {
        this.isMuted = muted;
      })
    );

    // Subscribe to ambience playing state
    this.subscriptions.push(
      this.ambientAudio.isAmbiencePlaying$.subscribe(playing => {
        this.isAmbiencePlaying = playing;
      })
    );

    this.updateNextStatusChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Initialize audio on user interaction (required for autoplay)
   */
  onUserInteraction(): void {
    this.ambientAudio.initialize();
  }

  /**
   * Toggle mute/unmute
   */
  toggleMute(): void {
    this.ambientAudio.toggleMute();
  }

  /**
   * Play ambience manually
   */
  playAmbience(): void {
    this.ambientAudio.playAmbience();
  }

  /**
   * Stop ambience manually
   */
  stopAmbience(): void {
    this.ambientAudio.stopAmbience();
  }

  /**
   * Ring the temple bell
   */
  ringBell(): void {
    this.ambientAudio.ringBell();
  }

  /**
   * Play shankh sound
   */
  playShankh(): void {
    this.ambientAudio.playShankh();
  }

  /**
   * Update next status change time
   */
  private updateNextStatusChange(): void {
    this.nextStatusChange = this.ambientAudio.getNextTempleStatusChange();
  }

  /**
   * Get formatted time until next status change
   */
  getTimeUntilChange(): string {
    if (!this.nextStatusChange) {
      return '';
    }

    const now = new Date();
    const diff = this.nextStatusChange.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
