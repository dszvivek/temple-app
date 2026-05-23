import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DevoteeRewardsService, DevoteeProfile } from '../../services/devotee-rewards.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-punya-points-display',
  templateUrl: './punya-points-display.component.html',
  styleUrls: ['./punya-points-display.component.css'],
  animations: [
    trigger('pointsPopup', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.8)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(-20px) scale(0.8)' }))
      ])
    ]),
    trigger('badgeEarned', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class PunyaPointsDisplayComponent implements OnInit, OnDestroy {
  profile: DevoteeProfile | null = null;
  pointsAnimation: { points: number; message: string } | null = null;
  showProfilePanel = false;
  levelProgress = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    public rewardsService: DevoteeRewardsService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.rewardsService.profile$.subscribe(profile => {
        this.profile = profile;
        this.levelProgress = this.rewardsService.getLevelProgress();
      })
    );

    this.subscriptions.push(
      this.rewardsService.pointsAnimation$.subscribe(animation => {
        this.pointsAnimation = animation;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleProfilePanel(): void {
    this.showProfilePanel = !this.showProfilePanel;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getStreakEmoji(): string {
    const streak = this.profile?.streak.currentStreak || 0;
    if (streak >= 30) return '👑';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '✨';
    return '🌱';
  }

  getLevelColor(): string {
    const level = this.profile?.level || 1;
    const colors = [
      'from-gray-400 to-gray-500',
      'from-green-400 to-green-600',
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-orange-400 to-orange-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600',
      'from-pink-400 to-pink-600'
    ];
    return colors[Math.min(level - 1, colors.length - 1)];
  }

  getActivityDescription(description: string): string {
    return this.rewardsService.localizeActivityDescription(description);
  }
}
