import { Component, OnInit, OnDestroy } from '@angular/core';
import { TempleBellService } from '../../services/temple-bell.service';
import { TempleScheduleService } from '../../services/temple-schedule.service';
import { Subscription } from 'rxjs';

/**
 * FloatingBellComponent - Floating temple bell button
 * 
 * Features:
 * - Circular golden gradient button with bell SVG
 * - Plays mandir-bell.mp3 on click with vibration
 * - Auto-hides when temple is closed (7PM-5AM)
 * - Pulse animation for visual appeal
 * - Mobile and desktop responsive
 */
@Component({
  selector: 'app-floating-bell',
  templateUrl: './floating-bell.component.html',
  styleUrls: ['./floating-bell.component.css']
})
export class FloatingBellComponent implements OnInit, OnDestroy {
  isVisible = true;
  isRinging = false;
  private subscription?: Subscription;

  constructor(
    private bellService: TempleBellService,
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
   * Ring the temple bell
   */
  ringBell(): void {
    if (this.isRinging) return;

    this.isRinging = true;
    
    // Play bell sound
    this.bellService.ringBell();
    
    // Trigger vibration on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }

    // Reset ringing state after animation
    setTimeout(() => {
      this.isRinging = false;
    }, 600);
  }
}
