/**
 * MINIMAL INTEGRATION EXAMPLE
 * 
 * This file demonstrates the simplest way to integrate AmbientAudioService
 * into your existing temple app components.
 */

// ============================================================================
// Example 1: Add to Home Component (Recommended)
// ============================================================================

// FILE: home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulerService } from '../../services/scheduler.service';
import { AudioStateService } from '../../services/audio-state.service';
import { LanguageService } from '../../services/language.service';
import { AmbientAudioService } from '../../services/ambient-audio.service'; // ADD THIS
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isChalisaPlaying = false;
  private audioSubscription?: Subscription;

  constructor(
    private router: Router,
    private schedulerService: SchedulerService,
    private audioStateService: AudioStateService,
    public lang: LanguageService,
    public ambientAudio: AmbientAudioService // ADD THIS
  ) {}

  ngOnInit(): void {
    // Subscribe to audio playing state
    this.audioSubscription = this.audioStateService.isPlaying$.subscribe(
      isPlaying => {
        this.isChalisaPlaying = isPlaying;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.audioSubscription) {
      this.audioSubscription.unsubscribe();
    }
  }

  navigateToWish(): void {
    this.router.navigate(['/wish']);
  }

  // ADD THIS METHOD - Call from a button click
  enableTempleAudio(): void {
    this.ambientAudio.initialize();
  }
}

// FILE: home.component.html
// Add this anywhere in your template (recommended: after audio player)
`
<!-- Ambient Audio Controls -->
<div class="mb-8">
  <app-ambient-controls></app-ambient-controls>
</div>
`

// ============================================================================
// Example 2: Global App-Wide Integration
// ============================================================================

// FILE: app.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { AmbientAudioService } from './services/ambient-audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'temple-app';

  constructor(private ambientAudio: AmbientAudioService) {}

  ngOnInit() {
    // Log temple status
    this.ambientAudio.isTempleOpen$.subscribe(isOpen => {
      console.log(`🕉️ Temple is ${isOpen ? 'open' : 'closed'}`);
    });
  }

  // Auto-initialize ambient audio on any user interaction
  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onUserInteraction() {
    this.ambientAudio.initialize();
  }
}

// ============================================================================
// Example 3: Minimal Standalone Usage (No UI Component)
// ============================================================================

// Any component:
import { Component } from '@angular/core';
import { AmbientAudioService } from '../../services/ambient-audio.service';

@Component({
  selector: 'app-any-component',
  template: `
    <button (click)="enableAudio()">🔊 Enable Temple Sounds</button>
    <button (click)="ambientAudio.ringBell()">🔔 Ring Bell</button>
    <button (click)="ambientAudio.playShankh()">🐚 Play Shankh</button>
    <button (click)="ambientAudio.toggleMute()">
      {{ (ambientAudio.isMuted$ | async) ? '🔇 Unmute' : '🔊 Mute' }}
    </button>
    
    <div *ngIf="ambientAudio.isTempleOpen$ | async" class="temple-status">
      ✅ Temple is Open (5 AM - 7 PM)
    </div>
    <div *ngIf="!(ambientAudio.isTempleOpen$ | async)" class="temple-status">
      ⏸️ Temple is Closed
    </div>
  `
})
export class AnyComponent {
  constructor(public ambientAudio: AmbientAudioService) {}

  enableAudio() {
    // Initialize on user click (required for autoplay)
    this.ambientAudio.initialize();
  }
}

// ============================================================================
// Example 4: Coordinate with Existing Audio Player
// ============================================================================

// FILE: audio-player.component.ts
import { Component, OnInit } from '@angular/core';
import { AudioPlayerService } from '../../services/audio-player.service';
import { AmbientAudioService } from '../../services/ambient-audio.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {
  constructor(
    public audioPlayer: AudioPlayerService,
    private ambientAudio: AmbientAudioService
  ) {}

  ngOnInit(): void {
    // Initialize ambient audio when main audio player is enabled
  }

  onEnableAudio(): void {
    // Enable main chalisa player
    this.audioPlayer.enableAudio();
    
    // Also initialize ambient audio
    this.ambientAudio.initialize();
    
    // Optional: Ring bell when starting
    this.ambientAudio.ringBell();
    
    // Optional: Lower ambience when chalisa plays
    this.ambientAudio.setVolume(0.3);
  }

  onPlayChalisaWithAarti(): void {
    // Play shankh before chalisa
    this.ambientAudio.playShankh();
    
    // Wait for shankh to finish, then start chalisa
    setTimeout(() => {
      this.audioPlayer.enableAudio();
    }, 2000);
  }
}

// ============================================================================
// Example 5: Simple Test in Browser Console
// ============================================================================

/**
 * After app loads, open browser console and test:
 * 
 * // Get the service (in component or console)
 * const ambient = this.ambientAudio; // in component
 * 
 * // Initialize (required first)
 * ambient.initialize();
 * 
 * // Play ambience
 * ambient.playAmbience();
 * 
 * // Ring bell
 * ambient.ringBell();
 * 
 * // Play shankh
 * ambient.playShankh();
 * 
 * // Check temple status
 * ambient.isTempleOpen$.subscribe(console.log);
 * 
 * // Toggle mute
 * ambient.toggleMute();
 * 
 * // Stop ambience
 * ambient.stopAmbience();
 */

// ============================================================================
// Common Patterns
// ============================================================================

// Pattern 1: Ring bell on page load (after user interaction)
class Component1 {
  constructor(private ambient: AmbientAudioService) {}
  
  onFirstClick() {
    this.ambient.initialize();
    this.ambient.ringBell(); // Welcome bell
  }
}

// Pattern 2: Play shankh when user makes a wish
class WishComponent {
  constructor(private ambient: AmbientAudioService) {}
  
  onWishSubmitted() {
    this.ambient.playShankh(); // Celebrate with shankh
  }
}

// Pattern 3: Auto-start ambience when entering temple
class TempleEntranceComponent {
  constructor(private ambient: AmbientAudioService) {}
  
  onEnterTemple() {
    this.ambient.initialize();
    setTimeout(() => this.ambient.ringBell(), 500); // Entrance bell
  }
}

// Pattern 4: Show temple status in UI
class HeaderComponent {
  constructor(public ambient: AmbientAudioService) {}
  
  // In template: {{ templeStatus }}
  get templeStatus(): string {
    // Subscribe to isTempleOpen$ in real component
    return 'Temple opens at 5 AM';
  }
}
