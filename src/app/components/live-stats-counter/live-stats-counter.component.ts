import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LiveStatsService } from '../../services/live-stats.service';
import { LanguageService } from '../../services/language.service';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * LiveStatsCounterComponent - Shows live devotee count and total wishes
 * 
 * Features:
 * - Real-time devotee count with smooth updates
 * - Total wishes submitted counter
 * - Pulsing animation to show "live" status
 * - Bilingual support
 */
@Component({
  selector: 'app-live-stats-counter',
  templateUrl: './live-stats-counter.component.html',
  styleUrls: ['./live-stats-counter.component.css'],
  animations: [
    trigger('counterUpdate', [
      transition(':increment', [
        style({ transform: 'scale(1.1)', color: '#f59e0b' }),
        animate('300ms ease-out', style({ transform: 'scale(1)', color: '*' }))
      ]),
      transition(':decrement', [
        style({ transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class LiveStatsCounterComponent implements OnInit, OnDestroy {
  liveDevotees = 0;
  totalWishes = 0;

  private devoteesSubscription?: Subscription;
  private wishesSubscription?: Subscription;

  constructor(
    private liveStatsService: LiveStatsService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    // Subscribe to live devotee count
    this.devoteesSubscription = this.liveStatsService.liveDevotees$.subscribe(
      count => {
        this.liveDevotees = count;
      }
    );

    // Subscribe to total wishes count
    this.wishesSubscription = this.liveStatsService.totalWishes$.subscribe(
      count => {
        this.totalWishes = count;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.devoteesSubscription) {
      this.devoteesSubscription.unsubscribe();
    }
    if (this.wishesSubscription) {
      this.wishesSubscription.unsubscribe();
    }
  }

  /**
   * Format number with commas
   */
  formatNumber(num: number): string {
    return this.liveStatsService.formatNumber(num);
  }
}
