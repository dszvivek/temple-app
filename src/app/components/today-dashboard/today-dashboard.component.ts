import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HinduCalendarService, PanchangData, HinduFestival } from '../../services/hindu-calendar.service';
import { DailyEngagementService, DailyChallenge } from '../../services/daily-engagement.service';
import { LanguageService } from '../../services/language.service';
import { DevoteeRewardsService } from '../../services/devotee-rewards.service';

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
              {{ isHindi ? 'आज का पंचांग' : "Today's Panchang" }}
            </h3>
            <span class="expand-icon" [class.rotated]="showPanchangDetails">▼</span>
          </div>
          
          <!-- Quick Info Always Visible -->
          <div class="panchang-quick">
            <div class="quick-item">
              <span class="quick-label">{{ isHindi ? 'तिथि' : 'Tithi' }}</span>
              <span class="quick-value">{{ isHindi ? panchang.tithi.nameHi : panchang.tithi.name }}</span>
            </div>
            <div class="quick-divider">•</div>
            <div class="quick-item">
              <span class="quick-label">{{ isHindi ? 'पक्ष' : 'Paksha' }}</span>
              <span class="quick-value">{{ isHindi ? panchang.pakshaHi : panchang.paksha }}</span>
            </div>
            <div class="quick-divider">•</div>
            <div class="quick-item">
              <span class="quick-label">{{ isHindi ? 'वार' : 'Day' }}</span>
              <span class="quick-value">{{ isHindi ? panchang.varaHi : panchang.vara }}</span>
            </div>
          </div>
        </div>

        <!-- Expanded Panchang Details -->
        <div class="panchang-details" *ngIf="showPanchangDetails" @fadeSlide>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-icon">🌙</span>
              <span class="detail-label">{{ isHindi ? 'नक्षत्र' : 'Nakshatra' }}</span>
              <span class="detail-value">{{ isHindi ? panchang.nakshatraHi : panchang.nakshatra }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⚡</span>
              <span class="detail-label">{{ isHindi ? 'योग' : 'Yoga' }}</span>
              <span class="detail-value">{{ isHindi ? panchang.yogaHi : panchang.yoga }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-label">{{ isHindi ? 'हिंदू मास' : 'Hindu Month' }}</span>
              <span class="detail-value">{{ isHindi ? panchang.hinduMonthHi : panchang.hinduMonth }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🌅</span>
              <span class="detail-label">{{ isHindi ? 'सूर्योदय' : 'Sunrise' }}</span>
              <span class="detail-value">{{ panchang.sunrise }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🌇</span>
              <span class="detail-label">{{ isHindi ? 'सूर्यास्त' : 'Sunset' }}</span>
              <span class="detail-value">{{ panchang.sunset }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⚠️</span>
              <span class="detail-label">{{ isHindi ? 'राहुकाल' : 'Rahukaal' }}</span>
              <span class="detail-value rahu">{{ panchang.rahukaal }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🎨</span>
              <span class="detail-label">{{ isHindi ? 'शुभ रंग' : 'Lucky Color' }}</span>
              <span class="detail-value">{{ isHindi ? panchang.auspiciousColorHi : panchang.auspiciousColor }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🔢</span>
              <span class="detail-label">{{ isHindi ? 'शुभ अंक' : 'Lucky Number' }}</span>
              <span class="detail-value">{{ panchang.luckyNumber }}</span>
            </div>
          </div>

          <!-- Today's Deity -->
          <div class="todays-deity">
            <span class="deity-badge" [class.auspicious]="panchang.isAuspicious">
              {{ isHindi ? panchang.varaDeityHi : panchang.varaDeity }}
              {{ panchang.isAuspicious ? '✨' : '' }}
            </span>
            <span class="deity-label">{{ isHindi ? 'आज के अधिष्ठाता देवता' : "Today's Presiding Deity" }}</span>
          </div>

          <!-- Tithi Significance -->
          <div class="tithi-significance">
            <p>{{ isHindi ? panchang.tithi.significanceHi : panchang.tithi.significance }}</p>
          </div>
        </div>
      </div>

      <!-- 🌟 SPECIAL MESSAGE OF THE DAY -->
      <div class="special-message-card" *ngIf="panchang.specialMessage">
        <p class="special-message">
          {{ isHindi ? panchang.specialMessageHi : panchang.specialMessage }}
        </p>
      </div>

      <!-- 🎯 DAILY CHALLENGES -->
      <div class="challenges-card glass-card" *ngIf="challenges.length > 0">
        <div class="challenges-header">
          <h3 class="challenges-title">
            {{ isHindi ? '🎯 आज की चुनौतियां' : '🎯 Daily Challenges' }}
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
          <div class="challenge-item" *ngFor="let challenge of challenges; trackBy: trackChallenge"
               [class.completed]="challenge.completed">
            <span class="challenge-icon">{{ challenge.completed ? '✅' : challenge.icon }}</span>
            <div class="challenge-info">
              <span class="challenge-name">{{ isHindi ? challenge.titleHi : challenge.title }}</span>
              <span class="challenge-desc">{{ isHindi ? challenge.descriptionHi : challenge.description }}</span>
            </div>
            <span class="challenge-points" [class.earned]="challenge.completed">
              +{{ challenge.points }}
            </span>
          </div>
        </div>

        <div class="all-done-banner" *ngIf="allCompleted">
          🎉 {{ isHindi ? 'सभी चुनौतियां पूरी! कल फिर आएं!' : 'All done! Come back tomorrow for new challenges!' }}
        </div>
      </div>

      <!-- 🎪 UPCOMING FESTIVALS -->
      <div class="festivals-card glass-card" *ngIf="festivals.length > 0" (click)="toggleFestivals()">
        <div class="festivals-header">
          <h3 class="festivals-title">
            {{ isHindi ? '🎪 आगामी त्योहार' : '🎪 Upcoming Festivals' }}
          </h3>
          <span class="expand-icon" [class.rotated]="showFestivals">▼</span>
        </div>

        <!-- Always show next festival -->
        <div class="next-festival" *ngIf="festivals[0]">
          <div class="festival-countdown" [class.today]="festivals[0].isToday">
            <span class="festival-emoji">{{ festivals[0].emoji }}</span>
            <div class="festival-info">
              <span class="festival-name">{{ isHindi ? festivals[0].nameHi : festivals[0].name }}</span>
              <span class="festival-date">
                {{ festivals[0].isToday 
                  ? (isHindi ? '🎉 आज!' : '🎉 Today!') 
                  : (isHindi ? festivals[0].daysAway + ' दिन बाद' : 'in ' + festivals[0].daysAway + ' days') }}
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
              <span class="fest-name">{{ isHindi ? festival.nameHi : festival.name }}</span>
              <span class="fest-desc">{{ isHindi ? festival.descriptionHi : festival.description }}</span>
            </div>
            <span class="fest-days">
              {{ festival.isToday 
                ? '🎉' 
                : festival.daysAway + (isHindi ? ' दिन' : 'd') }}
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
              {{ isHindi ? 'दिन की लगातार भक्ति' : 'Day Devotion Streak' }}
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
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .challenge-item.completed {
      background: rgba(16, 185, 129, 0.1);
      opacity: 0.7;
    }

    .challenge-icon { font-size: 1.2rem; }
    
    .challenge-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
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

  getStreakMessage(): string {
    const isHi = this.isHindi;
    if (this.streak >= 100) {
      return isHi ? '💎 आप सच्चे भक्त हैं! 100+ दिन!' : '💎 You are a true devotee! 100+ days!';
    }
    if (this.streak >= 30) {
      return isHi ? '⭐ एक पूरा महीना! अद्भुत!' : '⭐ A full month! Amazing!';
    }
    if (this.streak >= 7) {
      return isHi ? '🔥 एक सप्ताह पूरा! शानदार!' : '🔥 One week strong! Brilliant!';
    }
    if (this.streak >= 3) {
      return isHi ? '✨ लगातार बढ़ रहे हैं!' : '✨ Keep going, growing stronger!';
    }
    return isHi ? '🌱 यात्रा शुरू हुई! कल भी आएं!' : '🌱 Journey started! Come back tomorrow!';
  }
}
