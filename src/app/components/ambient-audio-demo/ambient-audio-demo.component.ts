import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmbientAudioService } from '../../services/ambient-audio.service';
import { Subscription, interval } from 'rxjs';

/**
 * Demo/Test Component for AmbientAudioService
 * 
 * This component can be used for testing all features of the service.
 * Add route: { path: 'audio-demo', component: AmbientAudioDemoComponent }
 */
@Component({
  selector: 'app-ambient-audio-demo',
  templateUrl: './ambient-audio-demo.component.html',
  styleUrls: ['./ambient-audio-demo.component.css']
})
export class AmbientAudioDemoComponent implements OnInit, OnDestroy {
  // State
  isTempleOpen = false;
  isMuted = false;
  isAmbiencePlaying = false;
  currentVolume = 0.7;
  nextStatusChange: Date | null = null;
  currentTime: Date = new Date();
  
  // Logs
  eventLog: string[] = [];
  
  private subscriptions: Subscription[] = [];
  private timeInterval?: any;

  constructor(public ambientAudio: AmbientAudioService) {}

  ngOnInit(): void {
    this.log('Component initialized');

    // Subscribe to all observables
    this.subscriptions.push(
      this.ambientAudio.isTempleOpen$.subscribe(isOpen => {
        this.isTempleOpen = isOpen;
        this.log(`Temple status: ${isOpen ? 'OPEN' : 'CLOSED'}`);
        this.updateNextStatusChange();
      })
    );

    this.subscriptions.push(
      this.ambientAudio.isMuted$.subscribe(muted => {
        this.isMuted = muted;
        this.log(`Mute state: ${muted ? 'MUTED' : 'UNMUTED'}`);
      })
    );

    this.subscriptions.push(
      this.ambientAudio.isAmbiencePlaying$.subscribe(playing => {
        this.isAmbiencePlaying = playing;
        this.log(`Ambience: ${playing ? 'PLAYING' : 'STOPPED'}`);
      })
    );

    // Update current time every second
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.updateNextStatusChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  // Actions
  initialize(): void {
    this.log('Initializing audio service...');
    this.ambientAudio.initialize();
  }

  playAmbience(): void {
    this.log('Playing ambience...');
    this.ambientAudio.playAmbience();
  }

  stopAmbience(): void {
    this.log('Stopping ambience...');
    this.ambientAudio.stopAmbience();
  }

  ringBell(): void {
    this.log('Ringing bell 🔔');
    this.ambientAudio.ringBell();
  }

  playShankh(): void {
    this.log('Playing shankh 🐚');
    this.ambientAudio.playShankh();
  }

  toggleMute(): void {
    this.ambientAudio.toggleMute();
  }

  setVolume(value: number): void {
    this.currentVolume = value;
    this.ambientAudio.setVolume(value);
    this.log(`Volume set to ${Math.round(value * 100)}%`);
  }

  // Sequences
  playWelcomeSequence(): void {
    this.log('Playing welcome sequence...');
    this.ambientAudio.initialize();
    
    setTimeout(() => this.ambientAudio.ringBell(), 500);
    setTimeout(() => this.ambientAudio.playAmbience(), 2000);
  }

  playAartiSequence(): void {
    this.log('Playing aarti sequence...');
    this.ambientAudio.playShankh();
    
    setTimeout(() => this.ambientAudio.ringBell(), 3000);
    setTimeout(() => this.ambientAudio.ringBell(), 4000);
    setTimeout(() => this.ambientAudio.ringBell(), 5000);
  }

  // Utilities
  private updateNextStatusChange(): void {
    this.nextStatusChange = this.ambientAudio.getNextTempleStatusChange();
  }

  getTimeUntilChange(): string {
    if (!this.nextStatusChange) return '';

    const now = new Date();
    const diff = this.nextStatusChange.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLog.unshift(`[${timestamp}] ${message}`);
    
    // Keep only last 50 logs
    if (this.eventLog.length > 50) {
      this.eventLog = this.eventLog.slice(0, 50);
    }
    
    console.log(`[AmbientAudio] ${message}`);
  }

  clearLog(): void {
    this.eventLog = [];
  }

  // Test scenarios
  testAutoplay(): void {
    this.log('Testing autoplay (requires user gesture)...');
    this.ambientAudio.initialize();
  }

  testTempleHours(): void {
    this.log('Current temple status:');
    this.log(`  Temple is ${this.isTempleOpen ? 'OPEN' : 'CLOSED'}`);
    this.log(`  Current time: ${this.currentTime.toLocaleTimeString()}`);
    this.log(`  Temple hours: 5:00 AM - 7:00 PM`);
    this.log(`  Next change: ${this.nextStatusChange?.toLocaleString()}`);
  }

  testLocalStorage(): void {
    this.log('Testing localStorage...');
    const muteState = localStorage.getItem('temple-ambient-muted');
    const volume = localStorage.getItem('temple-ambient-volume');
    this.log(`  Mute state: ${muteState}`);
    this.log(`  Volume: ${volume}`);
  }

  simulateTempleOpen(): void {
    this.log('⚠️ Cannot simulate - uses real system time');
    this.log('Temple opens at 5:00 AM and closes at 7:00 PM');
  }
}
