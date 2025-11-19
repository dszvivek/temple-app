import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmbientAudioService } from '../../services/ambient-audio.service';
import { TempleScheduleService } from '../../services/temple-schedule.service';
import { Subscription } from 'rxjs';

/**
 * FloatingShankhComponent - Floating shankh (conch) button
 * 
 * Features:
 * - Circular button with shankh icon
 * - Plays shankh sound on click with vibration
 * - Auto-hides when temple is closed
 * - Positioned to the left of bell button
 */
@Component({
  selector: 'app-floating-shankh',
  templateUrl: './floating-shankh.component.html',
  styleUrls: ['./floating-shankh.component.css']
})
export class FloatingShankhComponent implements OnInit, OnDestroy {
  isVisible = true;
  isPlaying = false;
  private subscription?: Subscription;

  constructor(
    private ambientAudio: AmbientAudioService,
    private scheduleService: TempleScheduleService
  ) {}

  ngOnInit(): void {
    // Subscribe to temple open/close status
    this.subscription = this.scheduleService.isOpen$.subscribe(isOpen => {
      this.isVisible = isOpen;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Play the shankh sound
   */
  playShankh(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    
    // Initialize audio if needed (requires user gesture)
    this.ambientAudio.initialize();
    
    // Play shankh sound
    this.ambientAudio.playShankh();
    
    // Trigger vibration on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }

    // Reset playing state after sound duration (shankh is ~2 seconds)
    setTimeout(() => {
      this.isPlaying = false;
    }, 2500);
  }
}
