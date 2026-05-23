import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HinduCalendarService, PanchangData, HinduFestival } from '../../services/hindu-calendar.service';
import { DailyEngagementService, DailyChallenge } from '../../services/daily-engagement.service';
import { LanguageService } from '../../services/language.service';
import { DevoteeRewardsService } from '../../services/devotee-rewards.service';
import { ProductAnalyticsService } from '../../services/product-analytics.service';

@Component({
  selector: 'app-today-dashboard',
  template: `
    <!-- ===== TODAY'S SPIRITUAL DASHBOARD ===== -->
    <div class="dashboard-container" *ngIf="panchang">
      
      <!-- 🔮 PANCHANG CARD -->
      <div class="panchang-card glass-card" (click)="togglePanchang()">
        <div class="panchang-header">
          <div class="panchang-title-row">
            <span class="panchang-icon">🕉️</span>
            <h3 class="panchang-title">
              {{ lang.t('dashboard.panchangTitle') }}
            </h3>
            <span class="expand-icon" [class.rotated]="showPanchangDetails">▼</span>
          </div>
          
          <!-- Quick Info Always Visible -->
          <div class="panchang-quick">
            <div class="quick-item">
              <span class="quick-label">{{ lang.t('dashboard.tithi') }}</span>
              <span class="quick-value">{{ getLocalizedText(panchang.tithi.name, panchang.tithi.nameHi) }}</span>
            </div>
            <div class="quick-divider">•</div>
            <div class="quick-item">
              <span class="quick-label">{{ lang.t('dashboard.paksha') }}</span>
              <span class="quick-value">{{ getLocalizedText(panchang.paksha, panchang.pakshaHi) }}</span>
            </div>
            <div class="quick-divider">•</div>
            <div class="quick-item">
              <span class="quick-label">{{ lang.t('dashboard.day') }}</span>
              <span class="quick-value">{{ getLocalizedText(panchang.vara, panchang.varaHi) }}</span>
            </div>
          </div>
        </div>

        <!-- Expanded Panchang Details -->
        <div class="panchang-details" *ngIf="showPanchangDetails" @fadeSlide>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-icon">🌙</span>
              <span class="detail-label">{{ lang.t('dashboard.nakshatra') }}</span>
              <span class="detail-value">{{ getLocalizedText(panchang.nakshatra, panchang.nakshatraHi) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⚡</span>
              <span class="detail-label">{{ lang.t('dashboard.yoga') }}</span>
              <span class="detail-value">{{ getLocalizedText(panchang.yoga, panchang.yogaHi) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-label">{{ lang.t('dashboard.hinduMonth') }}</span>
              <span class="detail-value">{{ getLocalizedText(panchang.hinduMonth, panchang.hinduMonthHi) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🌅</span>
              <span class="detail-label">{{ lang.t('dashboard.sunrise') }}</span>
              <span class="detail-value">{{ panchang.sunrise }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🌇</span>
              <span class="detail-label">{{ lang.t('dashboard.sunset') }}</span>
              <span class="detail-value">{{ panchang.sunset }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⚠️</span>
              <span class="detail-label">{{ lang.t('dashboard.rahukaal') }}</span>
              <span class="detail-value rahu">{{ panchang.rahukaal }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🎨</span>
              <span class="detail-label">{{ lang.t('dashboard.luckyColor') }}</span>
              <span class="detail-value">{{ getLocalizedText(panchang.auspiciousColor, panchang.auspiciousColorHi) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🔢</span>
              <span class="detail-label">{{ lang.t('dashboard.luckyNumber') }}</span>
              <span class="detail-value">{{ panchang.luckyNumber }}</span>
            </div>
          </div>

          <!-- Today's Deity -->
          <div class="todays-deity">
            <span class="deity-badge" [class.auspicious]="panchang.isAuspicious">
              {{ getLocalizedText(panchang.varaDeity, panchang.varaDeityHi) }}
              {{ panchang.isAuspicious ? '✨' : '' }}
            </span>
            <span class="deity-label">{{ lang.t('dashboard.todayPresidingDeity') }}</span>
          </div>

          <!-- Tithi Significance -->
          <div class="tithi-significance">
            <p>{{ getLocalizedText(panchang.tithi.significance, panchang.tithi.significanceHi) }}</p>
          </div>
        </div>
      </div>

      <!-- 🌟 SPECIAL MESSAGE OF THE DAY -->
      <div class="special-message-card" *ngIf="panchang.specialMessage">
        <p class="special-message">
          {{ getLocalizedText(panchang.specialMessage, panchang.specialMessageHi) }}
        </p>
      </div>

      <!-- 🎯 DAILY CHALLENGES -->
      <div class="challenges-card glass-card" *ngIf="challenges.length > 0">
        <div class="challenges-header">
          <h3 class="challenges-title">
            🎯 {{ lang.t('dashboard.dailyChallengesTitle') }}
          </h3>
          <div class="challenges-progress">
            <div class="progress-ring">
              <span class="progress-text">{{ completedCount }}/{{ challenges.length }}</span>
            </div>
          </div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar" [style.width.%]="completionPercent"></div>
        </div>
        
        <div class="challenges-list">
          <button type="button" class="challenge-item" *ngFor="let challenge of challenges; trackBy: trackChallenge"
               [class.completed]="challenge.completed"
               [disabled]="challenge.completed"
               (click)="startChallenge(challenge)">
            <span class="challenge-icon">{{ challenge.completed ? '✅' : challenge.icon }}</span>
            <div class="challenge-info">
              <span class="challenge-name">{{ getLocalizedText(challenge.title, challenge.titleHi) }}</span>
              <span class="challenge-desc">{{ getLocalizedText(challenge.description, challenge.descriptionHi) }}</span>
            </div>
            <div class="challenge-meta">
              <span class="challenge-points" [class.earned]="challenge.completed">
                +{{ challenge.points }}
              </span>
              <span class="challenge-action" *ngIf="!challenge.completed">
                {{ lang.t('dashboard.startChallenge') }}
              </span>
            </div>
          </button>
        </div>

        <div class="all-done-banner" *ngIf="allCompleted">
          🎉 {{ lang.t('dashboard.allChallengesComplete') }}
        </div>
      </div>

      <!-- 🎪 UPCOMING FESTIVALS -->
      <div class="festivals-card glass-card" *ngIf="festivals.length > 0" (click)="toggleFestivals()">
        <div class="festivals-header">
          <h3 class="festivals-title">
            🎪 {{ lang.t('dashboard.upcomingFestivalsTitle') }}
          </h3>
          <span class="expand-icon" [class.rotated]="showFestivals">▼</span>
        </div>

        <!-- Always show next festival -->
        <div class="next-festival" *ngIf="festivals[0]">
          <div class="festival-countdown" [class.today]="festivals[0].isToday">
            <span class="festival-emoji">{{ festivals[0].emoji }}</span>
            <div class="festival-info">
              <span class="festival-name">{{ getLocalizedText(festivals[0].name, festivals[0].nameHi) }}</span>
              <span class="festival-date">
                {{ getFestivalCountdown(festivals[0]) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Expanded: All upcoming festivals -->
        <div class="festivals-list" *ngIf="showFestivals">
          <div class="festival-item" *ngFor="let festival of festivals.slice(1, 6); trackBy: trackFestival"
               [class.today]="festival.isToday">
            <span class="fest-emoji">{{ festival.emoji }}</span>
            <div class="fest-details">
              <span class="fest-name">{{ getLocalizedText(festival.name, festival.nameHi) }}</span>
              <span class="fest-desc">{{ getLocalizedText(festival.description, festival.descriptionHi) }}</span>
            </div>
            <span class="fest-days">
              {{ getFestivalDayBadge(festival) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 🔥 STREAK & LEVEL -->
      <div class="streak-card glass-card" *ngIf="streak > 0">
        <div class="streak-content">
          <div class="streak-flame">
            <span class="flame-emoji">{{ streakEmoji }}</span>
            <span class="streak-number">{{ streak }}</span>
          </div>
          <div class="streak-info">
            <span class="streak-label">
              {{ lang.t('dashboard.devotionStreak') }}
            </span>
            <span class="streak-encourage">
              {{ getStreakMessage() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .glass-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 248, 225, 0.85));
      backdrop-filter: blur(12px);
      border-radius: 16px;
      padding: 16px;
      border: 1px solid rgba(249, 115, 22, 0.15);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .glass-card:active {
      transform: scale(0.98);
    }

    /* === PANCHANG CARD === */
    .panchang-header { width: 100%; }
    
    .panchang-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .panchang-icon { font-size: 1.3rem; }
    
    .panchang-title {
      font-size: 1rem;
      font-weight: 700;
      color: #92400e;
      flex: 1;
      margin: 0;
    }

    .expand-icon {
      font-size: 0.7rem;
      color: #92400e;
      transition: transform 0.3s ease;
      opacity: 0.6;
    }

    .expand-icon.rotated { transform: rotate(180deg); }

    .panchang-quick {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .quick-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .quick-label {
      font-size: 0.65rem;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .quick-value {
      font-size: 0.85rem;
      font-weight: 600;
      color: #78350f;
    }

    .quick-divider {
      color: #d97706;
      font-size: 0.5rem;
      margin-top: 8px;
    }

    /* Panchang Details */
    .panchang-details {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(249, 115, 22, 0.15);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      background: rgba(255, 237, 213, 0.5);
      border-radius: 10px;
    }

    .detail-icon { font-size: 0.9rem; }
    
    .detail-label {
      font-size: 0.6rem;
      color: #b45309;
      display: none; /* Hidden on mobile, shown in hover/tooltip */
    }

    .detail-value {
      font-size: 0.75rem;
      font-weight: 600;
      color: #78350f;
    }

    .detail-value.rahu { color: #dc2626; }

    .todays-deity {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 12px;
      gap: 4px;
    }

    .deity-badge {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: #78350f;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.85rem;
      box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
    }

    .deity-badge.auspicious {
      background: linear-gradient(135deg, #34d399, #10b981);
      color: #064e3b;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    }

    .deity-label {
      font-size: 0.65rem;
      color: #92400e;
    }

    .tithi-significance {
      text-align: center;
      margin-top: 8px;
      font-size: 0.75rem;
      color: #92400e;
      font-style: italic;
    }

    /* === SPECIAL MESSAGE === */
    .special-message-card {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 12px;
      padding: 12px 16px;
      border-left: 4px solid #f59e0b;
    }

    .special-message {
      font-size: 0.8rem;
      color: #78350f;
      line-height: 1.6;
      margin: 0;
      font-weight: 500;
    }

    /* === DAILY CHALLENGES === */
    .challenges-card { cursor: default; }
    
    .challenges-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .challenges-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #92400e;
      margin: 0;
    }

    .progress-ring {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-text {
      font-size: 0.7rem;
      font-weight: 700;
      color: #78350f;
    }

    .progress-bar-container {
      height: 6px;
      background: rgba(249, 115, 22, 0.15);
      border-radius: 3px;
      margin-bottom: 12px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #10b981);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .challenges-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .challenge-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: rgba(255, 237, 213, 0.4);
      border: 0;
      border-radius: 12px;
      transition: all 0.3s ease;
      text-align: left;
      cursor: pointer;
      width: 100%;
    }

    .challenge-item.completed {
      background: rgba(16, 185, 129, 0.1);
      opacity: 0.7;
      cursor: default;
    }

    .challenge-item:not(.completed):hover {
      background: rgba(255, 237, 213, 0.72);
      transform: translateY(-1px);
    }

    .challenge-icon { font-size: 1.2rem; }
    
    .challenge-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .challenge-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: #78350f;
    }

    .challenge-item.completed .challenge-name {
      text-decoration: line-through;
      color: #6b7280;
    }

    .challenge-desc {
      font-size: 0.65rem;
      color: #92400e;
    }

    .challenge-points {
      font-size: 0.75rem;
      font-weight: 700;
      color: #d97706;
      background: rgba(251, 191, 36, 0.2);
      padding: 2px 8px;
      border-radius: 10px;
    }

    .challenge-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      flex-shrink: 0;
    }

    .challenge-action {
      color: #c2410c;
      font-size: 0.65rem;
      font-weight: 800;
    }

    .challenge-points.earned {
      color: #059669;
      background: rgba(16, 185, 129, 0.2);
    }

    .all-done-banner {
      text-align: center;
      margin-top: 12px;
      padding: 10px;
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #065f46;
      animation: pulseGlow 2s infinite;
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      50% { box-shadow: 0 0 12px 4px rgba(16, 185, 129, 0.2); }
    }

    /* === FESTIVALS === */
    .festivals-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .festivals-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #92400e;
      margin: 0;
    }

    .next-festival { margin-bottom: 4px; }

    .festival-countdown {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: rgba(255, 237, 213, 0.5);
      border-radius: 12px;
    }

    .festival-countdown.today {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.2));
      border: 1px solid rgba(251, 191, 36, 0.4);
      animation: pulseGlow 2s infinite;
    }

    .festival-emoji { font-size: 1.5rem; }
    
    .festival-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .festival-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: #78350f;
    }

    .festival-date {
      font-size: 0.7rem;
      color: #b45309;
    }

    .festivals-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(249, 115, 22, 0.1);
    }

    .festival-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 10px;
    }

    .festival-item.today {
      background: rgba(251, 191, 36, 0.15);
    }

    .fest-emoji { font-size: 1.1rem; }
    
    .fest-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .fest-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: #78350f;
    }

    .fest-desc {
      font-size: 0.6rem;
      color: #92400e;
    }

    .fest-days {
      font-size: 0.7rem;
      font-weight: 700;
      color: #d97706;
    }

    /* === STREAK CARD === */
    .streak-card {
      background: linear-gradient(135deg, rgba(255, 237, 213, 0.95), rgba(254, 243, 199, 0.9));
      cursor: default;
    }

    .streak-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .streak-flame {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .flame-emoji {
      font-size: 1.8rem;
      animation: flameFlicker 1.5s ease-in-out infinite;
    }

    @keyframes flameFlicker {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.1) rotate(-3deg); }
      75% { transform: scale(1.05) rotate(3deg); }
    }

    .streak-number {
      font-size: 1.4rem;
      font-weight: 800;
      color: #dc2626;
    }

    .streak-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .streak-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #78350f;
    }

    .streak-encourage {
      font-size: 0.7rem;
      color: #92400e;
    }

    /* === MOBILE === */
    @media (max-width: 480px) {
      .dashboard-container {
        padding: 0 8px;
        gap: 10px;
      }

      .glass-card {
        padding: 12px;
        border-radius: 14px;
      }

      .detail-grid {
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }

      .detail-item {
        padding: 4px 6px;
      }
    }
  `]
})
export class TodayDashboardComponent implements OnInit, OnDestroy {
  panchang: PanchangData | null = null;
  challenges: DailyChallenge[] = [];
  festivals: HinduFestival[] = [];
  
  showPanchangDetails = false;
  showFestivals = false;
  allCompleted = false;
  completedCount = 0;
  completionPercent = 0;
  streak = 0;
  streakEmoji = '🔥';

  get isHindi(): boolean {
    return this.lang.getCurrentLanguage() === 'hi';
  }

  private subs: Subscription[] = [];

  constructor(
    private calendar: HinduCalendarService,
    private engagement: DailyEngagementService,
    private rewards: DevoteeRewardsService,
    private router: Router,
    private analytics: ProductAnalyticsService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    // Panchang
    this.subs.push(
      this.calendar.panchang$.subscribe(p => {
        this.panchang = p;
      })
    );

    // Festivals
    this.subs.push(
      this.calendar.festivals$.subscribe(f => {
        this.festivals = f;
      })
    );

    // Daily challenges
    this.subs.push(
      this.engagement.engagement$.subscribe(data => {
        this.challenges = data.challenges;
        this.completedCount = data.totalChallengesCompleted;
        this.allCompleted = data.allChallengesCompleted;
        this.completionPercent = this.engagement.getCompletionPercentage();
      })
    );

    // Streak
    const profile = this.rewards.getProfile();
    this.streak = profile.streak.currentStreak;
    this.streakEmoji = this.getStreakEmoji(this.streak);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  togglePanchang(): void {
    this.showPanchangDetails = !this.showPanchangDetails;
    if (this.showPanchangDetails) {
      this.engagement.recordAction('quote'); // Reading panchang counts as engagement
    }
  }

  toggleFestivals(): void {
    this.showFestivals = !this.showFestivals;
  }

  startChallenge(challenge: DailyChallenge): void {
    if (challenge.completed) {
      return;
    }

    this.analytics.track('daily_challenge_started', {
      challengeId: challenge.id,
      action: challenge.action
    });

    if (challenge.action === 'quote') {
      this.engagement.recordAction('quote');
      return;
    }

    this.router.navigate(this.getChallengeRoute(challenge.action));
  }

  private getChallengeRoute(action: string): string[] {
    switch (action) {
      case 'wish':
        return [`/${this.getRecommendedDeity()}/wish`];
      case 'visit_shiva':
        return ['/shiva'];
      case 'visit_durga':
        return ['/durga'];
      case 'aarti':
        return ['/hanuman'];
      case 'diya':
      case 'bell':
      case 'flowers':
      default:
        return [`/${this.getRecommendedDeity()}`];
    }
  }

  private getRecommendedDeity(): string {
    const day = new Date().getDay();
    switch (day) {
      case 1: return 'shiva';
      case 2: return 'hanuman';
      case 3: return 'ganesh';
      case 4: return 'krishna';
      case 5: return 'durga';
      case 6: return 'hanuman';
      default: return 'ganesh';
    }
  }

  trackChallenge(index: number, challenge: DailyChallenge): string {
    return challenge.id;
  }

  trackFestival(index: number, festival: HinduFestival): string {
    return festival.name;
  }

  getStreakEmoji(streak: number): string {
    if (streak >= 100) return '👑';
    if (streak >= 30) return '⭐';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '✨';
    return '🌱';
  }

  getLocalizedText(english?: string | null, hindi?: string | null): string {
    return this.isHindi ? (hindi || english || '') : (english || hindi || '');
  }

  getFestivalCountdown(festival: HinduFestival): string {
    if (festival.isToday) {
      return this.lang.t('dashboard.festivalToday');
    }

    return this.lang.format('dashboard.festivalInDays', { count: festival.daysAway });
  }

  getFestivalDayBadge(festival: HinduFestival): string {
    if (festival.isToday) {
      return '🎉';
    }

    return this.lang.format('dashboard.festivalDayShort', { count: festival.daysAway });
  }

  getStreakMessage(): string {
    if (this.streak >= 100) {
      return this.lang.t('dashboard.streakTrueDevotee');
    }
    if (this.streak >= 30) {
      return this.lang.t('dashboard.streakMonth');
    }
    if (this.streak >= 7) {
      return this.lang.t('dashboard.streakWeek');
    }
    if (this.streak >= 3) {
      return this.lang.t('dashboard.streakGrowing');
    }
    return this.lang.t('dashboard.streakStarted');
  }
}
