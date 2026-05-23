import { Component, OnInit, OnDestroy } from '@angular/core';
import { DailyEngagementService } from '../../services/daily-engagement.service';
import { DevoteeRewardsService } from '../../services/devotee-rewards.service';
import { LanguageService } from '../../services/language.service';

/**
 * StreakBannerComponent - Persistent streak & engagement banner
 * 
 * Shows at the top of every temple page to encourage daily returns:
 * - 🔥 Current streak with fire animation
 * - Daily challenge progress ring
 * - Motivational comeback messages
 * - Mini celebration on streak milestones (7, 21, 40, 108 days)
 */
@Component({
  selector: 'app-streak-banner',
  template: `
    <div class="streak-banner" *ngIf="visible" [class.milestone]="isMilestone" (click)="toggleExpanded()">
      <!-- Compact View -->
      <div class="streak-compact">
        <!-- Streak Fire -->
        <div class="streak-fire" [class.active]="streak > 0">
          <span class="fire-emoji">{{ streak > 0 ? '🔥' : '🕯️' }}</span>
          <span class="streak-count">{{ streak }}</span>
        </div>
        
        <!-- Daily Progress Ring -->
        <div class="progress-ring-container">
          <svg class="progress-ring" viewBox="0 0 36 36">
            <circle class="progress-bg" cx="18" cy="18" r="15.5" fill="none" stroke-width="3"/>
            <circle class="progress-fill" cx="18" cy="18" r="15.5" fill="none" stroke-width="3"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="progressOffset"
              stroke-linecap="round"/>
          </svg>
          <span class="progress-text">{{ completedChallenges }}/{{ totalChallenges }}</span>
        </div>
        
        <!-- Message -->
        <div class="streak-message">
          <span class="message-text">{{ getMessage() }}</span>
          <span class="sub-text" *ngIf="!expanded">{{ lang.t('streak.tapToExpand') }}</span>
        </div>
        
        <!-- Level Badge -->
        <div class="level-badge" *ngIf="level">
          <span class="level-icon">{{ getLevelIcon() }}</span>
        </div>
      </div>
      
      <!-- Expanded View -->
      <div class="streak-expanded" *ngIf="expanded" (click)="$event.stopPropagation()">
        <!-- Streak Details -->
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-icon">📅</span>
            <span class="detail-label">{{ lang.t('rewards.dayStreak') }}</span>
            <span class="detail-value">{{ streak }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">⭐</span>
            <span class="detail-label">{{ lang.t('rewards.pointsLabel') }}</span>
            <span class="detail-value">{{ totalPoints }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">🏆</span>
            <span class="detail-label">{{ lang.t('streak.levelLabel') }}</span>
            <span class="detail-value">{{ getLevelName() }}</span>
          </div>
        </div>
        
        <!-- Milestone Progress -->
        <div class="milestone-progress" *ngIf="nextMilestone">
          <div class="milestone-bar">
            <div class="milestone-fill" [style.width.%]="milestoneProgress"></div>
          </div>
          <span class="milestone-label">{{ getMilestoneLabel() }}</span>
        </div>
        
        <!-- Motivation -->
        <div class="motivation-text" *ngIf="isMilestone">
          🎉 {{ getMilestoneCongrats() }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .streak-banner {
      background: linear-gradient(135deg, rgba(255, 248, 225, 0.95), rgba(255, 237, 213, 0.92));
      border-radius: 12px;
      margin: 8px 12px;
      padding: 10px 14px;
      border: 1px solid rgba(249, 115, 22, 0.2);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .streak-banner:active {
      transform: scale(0.98);
    }
    
    .streak-banner.milestone {
      border-color: rgba(251, 191, 36, 0.5);
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
      animation: milestoneGlow 2s ease-in-out infinite;
    }
    
    @keyframes milestoneGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.2); }
      50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.4); }
    }
    
    .streak-compact {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .streak-fire {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 48px;
    }
    
    .streak-fire.active .fire-emoji {
      animation: fireFlicker 1s ease-in-out infinite;
    }
    
    @keyframes fireFlicker {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    
    .fire-emoji {
      font-size: 1.3rem;
    }
    
    .streak-count {
      font-size: 1.1rem;
      font-weight: 700;
      color: #c2410c;
    }
    
    .progress-ring-container {
      position: relative;
      width: 36px;
      height: 36px;
      flex-shrink: 0;
    }
    
    .progress-ring {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    
    .progress-bg {
      stroke: rgba(249, 115, 22, 0.15);
    }
    
    .progress-fill {
      stroke: #f97316;
      transition: stroke-dashoffset 0.5s ease;
    }
    
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.55rem;
      font-weight: 700;
      color: #9a3412;
    }
    
    .streak-message {
      flex: 1;
      min-width: 0;
    }
    
    .message-text {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #7c2d12;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .sub-text {
      font-size: 0.6rem;
      color: #9a3412;
      opacity: 0.6;
    }
    
    .level-badge {
      flex-shrink: 0;
    }
    
    .level-icon {
      font-size: 1.4rem;
    }
    
    /* Expanded Section */
    .streak-expanded {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(249, 115, 22, 0.15);
    }
    
    .detail-row {
      display: flex;
      justify-content: space-around;
      gap: 8px;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    
    .detail-icon {
      font-size: 1.1rem;
    }
    
    .detail-label {
      font-size: 0.6rem;
      color: #9a3412;
      opacity: 0.7;
    }
    
    .detail-value {
      font-size: 0.85rem;
      font-weight: 700;
      color: #7c2d12;
    }
    
    .milestone-progress {
      margin-top: 10px;
    }
    
    .milestone-bar {
      height: 6px;
      background: rgba(249, 115, 22, 0.15);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .milestone-fill {
      height: 100%;
      background: linear-gradient(90deg, #f97316, #fbbf24);
      border-radius: 3px;
      transition: width 0.5s ease;
    }
    
    .milestone-label {
      display: block;
      text-align: center;
      font-size: 0.6rem;
      color: #9a3412;
      margin-top: 4px;
    }
    
    .motivation-text {
      text-align: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: #c2410c;
      margin-top: 8px;
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class StreakBannerComponent implements OnInit, OnDestroy {
  visible = true;
  expanded = false;
  streak = 0;
  totalPoints = 0;
  level = 1;
  completedChallenges = 0;
  totalChallenges = 0;
  isMilestone = false;
  nextMilestone = 0;
  milestoneProgress = 0;
  
  // SVG circle
  readonly circumference = 2 * Math.PI * 15.5; // ~97.39
  progressOffset = this.circumference;
  
  private refreshInterval?: any;
  
  private readonly milestones = [7, 21, 40, 51, 72, 108, 365];

  constructor(
    private engagement: DailyEngagementService,
    private rewards: DevoteeRewardsService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.refresh();
    // Refresh every 30 seconds to catch challenge completions
    this.refreshInterval = setInterval(() => this.refresh(), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private refresh(): void {
    // Streak
    const comebackData = JSON.parse(localStorage.getItem('temple_comeback_data') || '{}');
    this.streak = comebackData.streak || 0;
    
    // Points & level
    const profile = this.rewards.getProfile();
    this.totalPoints = profile.points?.total || 0;
    this.level = profile.level || 1;
    
    // Challenges
    const challenges = this.engagement.getDailyChallenges();
    this.totalChallenges = challenges.length;
    this.completedChallenges = challenges.filter(c => c.completed).length;
    
    // Progress ring
    const progress = this.totalChallenges > 0 ? this.completedChallenges / this.totalChallenges : 0;
    this.progressOffset = this.circumference * (1 - progress);
    
    // Milestone check
    this.isMilestone = this.milestones.includes(this.streak);
    
    // Next milestone
    this.nextMilestone = this.milestones.find(m => m > this.streak) || 365;
    const prevMilestone = [...this.milestones].reverse().find(m => m <= this.streak) || 0;
    const range = this.nextMilestone - prevMilestone;
    this.milestoneProgress = range > 0 ? ((this.streak - prevMilestone) / range) * 100 : 0;
  }

  getLevelName(): string {
    const profile = this.rewards.getProfile();
    if (this.lang.getCurrentLanguage() === 'hi') {
      return profile.levelNameHi || profile.levelName || 'साधक';
    }
    return profile.levelName || 'Seeker';
  }

  getMilestoneLabel(): string {
    return this.lang.format('streak.nextMilestone', {
      streak: this.streak,
      nextMilestone: this.nextMilestone
    });
  }

  getMilestoneCongrats(): string {
    return this.lang.format('streak.milestoneCongrats', {
      streak: this.streak
    });
  }

  getMessage(): string {
    if (this.streak === 0) {
      return this.lang.t('streak.startMessage');
    }
    if (this.streak === 1) {
      return this.lang.t('streak.dayOneMessage');
    }
    if (this.streak < 7) {
      return this.lang.format('streak.keepGoingMessage', { streak: this.streak });
    }
    if (this.streak === 7) {
      return this.lang.t('streak.weekCompleteMessage');
    }
    if (this.streak < 21) {
      return this.lang.format('streak.devotionMessage', { streak: this.streak });
    }
    if (this.streak === 21) {
      return this.lang.t('streak.habitFormedMessage');
    }
    if (this.streak < 40) {
      return this.lang.format('streak.amazingMessage', { streak: this.streak });
    }
    if (this.streak === 40) {
      return this.lang.t('streak.mandalaCompleteMessage');
    }
    if (this.streak < 108) {
      return this.lang.format('streak.trueDevoteeMessage', { streak: this.streak });
    }
    if (this.streak === 108) {
      return this.lang.t('streak.sacredNumberMessage');
    }
    return this.lang.format('streak.greatSeekerMessage', { streak: this.streak });
  }

  getLevelIcon(): string {
    const icons = ['🌱', '🪷', '🌺', '🪔', '⭐', '🌟', '💎', '👑'];
    return icons[Math.min(this.level - 1, icons.length - 1)];
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.refresh(); // Fresh data when expanding
    }
  }
}
