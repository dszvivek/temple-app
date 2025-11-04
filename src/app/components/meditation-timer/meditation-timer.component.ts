import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeditationService } from '../../services/meditation.service';
import { TempleBellService } from '../../services/temple-bell.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meditation-timer',
  templateUrl: './meditation-timer.component.html',
  styleUrls: ['./meditation-timer.component.css']
})
export class MeditationTimerComponent implements OnInit, OnDestroy {
  isActive = false;
  timeRemaining = 0;
  currentDuration = 0;
  showStats = false;

  presets = [5, 10, 15, 30];
  
  stats = {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0
  };

  private subscriptions: Subscription[] = [];

  constructor(
    public meditationService: MeditationService,
    private templeBellService: TempleBellService
  ) {}

  ngOnInit(): void {
    const activeSub = this.meditationService.isActive().subscribe(active => {
      this.isActive = active;
      
      // Ring bell when meditation completes
      if (!active && this.timeRemaining === 0 && this.currentDuration > 0) {
        this.onMeditationComplete();
      }
    });

    const timeSub = this.meditationService.getTimeRemaining().subscribe(time => {
      this.timeRemaining = time;
    });

    const durationSub = this.meditationService.getCurrentDuration().subscribe(duration => {
      this.currentDuration = duration;
    });

    const statsSub = this.meditationService.getStats().subscribe(stats => {
      this.stats = {
        totalSessions: stats.totalSessions,
        totalMinutes: stats.totalMinutes,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak
      };
    });

    this.subscriptions.push(activeSub, timeSub, durationSub, statsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Start meditation with preset duration
   */
  startMeditation(minutes: number): void {
    this.meditationService.startMeditation(minutes);
  }

  /**
   * Stop current meditation
   */
  stopMeditation(): void {
    this.meditationService.stopMeditation();
  }

  /**
   * Toggle stats display
   */
  toggleStats(): void {
    this.showStats = !this.showStats;
  }

  /**
   * Get formatted time remaining
   */
  getFormattedTime(): string {
    return this.meditationService.formatTime(this.timeRemaining);
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (this.currentDuration === 0) return 0;
    const totalSeconds = this.currentDuration * 60;
    return ((totalSeconds - this.timeRemaining) / totalSeconds) * 100;
  }

  /**
   * Handle meditation completion
   */
  private async onMeditationComplete(): Promise<void> {
    await this.templeBellService.ringBell();
    // Reset duration after bell rings
    setTimeout(() => {
      this.currentDuration = 0;
    }, 2000);
  }
}
