# AmbientAudioService - Integration Guide

## Overview

The `AmbientAudioService` is a sophisticated Angular service that manages temple ambient sounds with smart autoplay, user gesture handling, and time-based automation.

## Features

✅ **Preloads three audio assets:**
- `temple_ambience.wav` - Looping background temple ambience
- `mandir_bell.wav` - Temple bell sound effect
- `shankh_drone.wav` - Conch shell (shankh) sound effect

✅ **Core Methods:**
- `playAmbience()` - Start looping temple ambience
- `stopAmbience()` - Stop temple ambience
- `ringBell()` - Play bell sound effect
- `playShankh()` - Play shankh sound effect

✅ **Autoplay Handling:**
- Respects iOS/Chrome autoplay restrictions
- Only plays audio after user gesture/interaction
- Graceful fallback with clear console messages

✅ **Persistent State:**
- Mute state saved in `localStorage`
- Volume settings saved in `localStorage`
- State survives page refreshes

✅ **RxJS Observables:**
- `isTempleOpen$: Observable<boolean>` - Temple open status (5 AM - 7 PM)
- `isMuted$: Observable<boolean>` - Current mute state
- `isAmbiencePlaying$: Observable<boolean>` - Ambience playback state

✅ **Auto-Start Logic:**
- Automatically starts ambience when temple opens (5 AM)
- Automatically stops when temple closes (7 PM)
- Only auto-plays if user has interacted and audio is not muted

## Files Created

1. **Service:**
   - `src/app/services/ambient-audio.service.ts` - Main service implementation
   - `src/app/services/ambient-audio.service.spec.ts` - Unit tests

2. **Example Component:**
   - `src/app/components/ambient-controls/ambient-controls.component.ts` - TypeScript
   - `src/app/components/ambient-controls/ambient-controls.component.html` - Template
   - `src/app/components/ambient-controls/ambient-controls.component.css` - Styles

3. **Module Updates:**
   - `src/app/app.module.ts` - Updated with new service and component

## Quick Start

### 1. Basic Usage in Any Component

```typescript
import { Component, OnInit } from '@angular/core';
import { AmbientAudioService } from './services/ambient-audio.service';

@Component({
  selector: 'app-your-component',
  template: `
    <button (click)="enableAudio()">Enable Temple Sounds</button>
    <button (click)="ambientAudio.ringBell()">Ring Bell</button>
    <button (click)="ambientAudio.playShankh()">Play Shankh</button>
    <button (click)="ambientAudio.toggleMute()">
      {{ (ambientAudio.isMuted$ | async) ? 'Unmute' : 'Mute' }}
    </button>
    <p>Temple is {{ (ambientAudio.isTempleOpen$ | async) ? 'Open' : 'Closed' }}</p>
  `
})
export class YourComponent implements OnInit {
  constructor(public ambientAudio: AmbientAudioService) {}

  ngOnInit() {
    // Subscribe to temple status
    this.ambientAudio.isTempleOpen$.subscribe(isOpen => {
      console.log('Temple is', isOpen ? 'open' : 'closed');
    });
  }

  enableAudio() {
    // Must be called from user interaction (click, touch, etc.)
    this.ambientAudio.initialize();
  }
}
```

### 2. Using the Pre-built Ambient Controls Component

Simply add the component to any template:

```html
<app-ambient-controls></app-ambient-controls>
```

This provides a complete UI with:
- Temple open/closed status indicator
- Countdown to next status change
- Initialize audio button
- Mute/unmute toggle
- Ambience play/stop control
- Bell and shankh buttons
- Responsive design with animations

### 3. Integration in Home Component

Add to `home.component.html`:

```html
<!-- Add near the top or wherever appropriate -->
<div class="ambient-audio-section">
  <app-ambient-controls></app-ambient-controls>
</div>
```

Add to `home.component.ts`:

```typescript
import { AmbientAudioService } from '../../services/ambient-audio.service';

export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    // ... existing dependencies
    private ambientAudio: AmbientAudioService
  ) {}

  ngOnInit(): void {
    // ... existing code
    
    // Optional: Auto-initialize on component load
    // (Still requires user gesture, but prepares the service)
  }

  ngOnDestroy(): void {
    // Optional: Stop ambience when leaving component
    // this.ambientAudio.stopAmbience();
  }
}
```

### 4. Integration in App Component (Global)

For temple-wide ambient audio, add to `app.component.ts`:

```typescript
import { Component, OnInit, HostListener } from '@angular/core';
import { AmbientAudioService } from './services/ambient-audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private ambientAudio: AmbientAudioService) {}

  ngOnInit() {
    // Subscribe to temple hours
    this.ambientAudio.isTempleOpen$.subscribe(isOpen => {
      console.log(`🕉️ Temple ${isOpen ? 'opened' : 'closed'}`);
    });
  }

  // Auto-initialize on first user interaction
  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onUserInteraction() {
    this.ambientAudio.initialize();
  }
}
```

## API Reference

### Methods

#### `initialize(): void`
**Must be called from user gesture.** Preloads audio assets and auto-starts ambience if temple is open.

```typescript
// In click handler
onClick() {
  this.ambientAudio.initialize();
}
```

#### `playAmbience(): void`
Start looping temple ambience. Respects mute state.

#### `stopAmbience(): void`
Stop temple ambience immediately.

#### `ringBell(): void`
Play bell sound effect once. Can be called repeatedly.

#### `playShankh(): void`
Play shankh (conch) sound effect once. Can be called repeatedly.

#### `toggleMute(): void`
Toggle between muted and unmuted state. Auto-saves to localStorage.

#### `setMute(muted: boolean): void`
Set mute state explicitly.

#### `isMuted(): boolean`
Get current mute state (synchronous).

#### `setVolume(volume: number): void`
Set volume for all ambient sounds (0.0 to 1.0).

```typescript
this.ambientAudio.setVolume(0.5); // 50% volume
```

#### `getNextTempleStatusChange(): Date`
Get the next time temple will open or close.

### Observables

#### `isTempleOpen$: Observable<boolean>`
Emits `true` when temple is open (5 AM - 7 PM), `false` otherwise. Updates automatically.

```typescript
this.ambientAudio.isTempleOpen$.subscribe(isOpen => {
  if (isOpen) {
    console.log('Temple is open!');
  }
});
```

#### `isMuted$: Observable<boolean>`
Emits current mute state. Updates when mute is toggled.

#### `isAmbiencePlaying$: Observable<boolean>`
Emits `true` when ambience is playing, `false` otherwise.

## Temple Hours Configuration

Default hours: **5:00 AM to 7:00 PM**

To customize, edit `ambient-audio.service.ts`:

```typescript
private readonly TEMPLE_OPEN_HOUR = 5;  // 5 AM
private readonly TEMPLE_CLOSE_HOUR = 19; // 7 PM
```

## Audio Volume Levels

The service uses different volume levels for each sound:

- **Ambience:** 40% of base volume (subtle background)
- **Bell:** 80% of base volume (prominent but not jarring)
- **Shankh:** 70% of base volume (balanced)

Default base volume: **0.7 (70%)**

## Browser Autoplay Policy Compliance

The service handles autoplay restrictions properly:

1. **Before user interaction:** Audio assets can be preloaded but not played
2. **After `initialize()` called:** All audio can play freely
3. **iOS Safari:** Full support with gesture requirement
4. **Chrome:** Full support with gesture requirement

## LocalStorage Keys

- `temple-ambient-muted` - Mute state (boolean)
- `temple-ambient-volume` - Volume level (0.0 - 1.0)

## Testing

Run unit tests:

```bash
ng test
```

The service includes basic tests in `ambient-audio.service.spec.ts`.

## Troubleshooting

### Audio doesn't play
✅ Ensure `initialize()` was called from a user gesture (click, touch)
✅ Check browser console for autoplay errors
✅ Verify audio files exist in `src/assets/audio/`
✅ Check if muted

### Ambience doesn't auto-start
✅ Verify temple is open (check console or use `isTempleOpen$`)
✅ Ensure `initialize()` was called
✅ Check mute state
✅ Verify current time is between 5 AM - 7 PM

### Volume issues
✅ Use `setVolume()` to adjust base volume
✅ Check device/browser volume settings
✅ Verify audio files aren't corrupted

## Example: Custom Temple Hours Component

```typescript
import { Component } from '@angular/core';
import { AmbientAudioService } from '../../services/ambient-audio.service';

@Component({
  selector: 'app-temple-hours',
  template: `
    <div class="temple-hours">
      <h3>Temple Hours: 5:00 AM - 7:00 PM</h3>
      <div *ngIf="ambientAudio.isTempleOpen$ | async; else closed">
        <p>🕉️ Temple is Open</p>
        <p>Closes at {{ getClosingTime() }}</p>
      </div>
      <ng-template #closed>
        <p>Temple is Closed</p>
        <p>Opens at {{ getOpeningTime() }}</p>
      </ng-template>
    </div>
  `
})
export class TempleHoursComponent {
  constructor(public ambientAudio: AmbientAudioService) {}

  getClosingTime(): string {
    return '7:00 PM';
  }

  getOpeningTime(): string {
    const next = this.ambientAudio.getNextTempleStatusChange();
    return next.toLocaleTimeString();
  }
}
```

## Advanced: Coordinating with Existing Audio Services

If you have existing audio services (like `AudioPlayerService` for Hanuman Chalisa), coordinate them:

```typescript
import { AmbientAudioService } from './services/ambient-audio.service';
import { AudioPlayerService } from './services/audio-player.service';

export class YourComponent {
  constructor(
    private ambientAudio: AmbientAudioService,
    private chalisaPlayer: AudioPlayerService
  ) {}

  playChalisaWithAmbience() {
    // Initialize ambient audio
    this.ambientAudio.initialize();
    
    // Lower ambience volume when chalisa plays
    this.ambientAudio.setVolume(0.3);
    
    // Play chalisa
    this.chalisaPlayer.enableAudio();
    
    // Optional: Ring bell before chalisa
    this.ambientAudio.ringBell();
  }
}
```

## Production Checklist

- [ ] Audio files are optimized (compressed WAV/MP3)
- [ ] Audio files are included in `assets` folder
- [ ] Service is provided in `app.module.ts`
- [ ] `initialize()` is called from user gesture
- [ ] Temple hours are configured correctly
- [ ] UI provides clear feedback for muted state
- [ ] Testing completed on iOS Safari and Chrome
- [ ] Service worker includes audio files in cache

## Next Steps

1. Test the ambient controls component: `<app-ambient-controls></app-ambient-controls>`
2. Customize the temple hours if needed
3. Integrate into your existing UI/UX
4. Add any additional sound effects
5. Configure service worker to cache audio files

---

**Created:** November 3, 2025
**Service Version:** 1.0.0
**Angular Version:** Compatible with Angular 14+
