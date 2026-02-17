import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, combineLatest } from 'rxjs';
import { HinduCalendarService } from './hindu-calendar.service';
import { DevoteeRewardsService, POINTS_CONFIG } from './devotee-rewards.service';
import { LanguageService } from './language.service';
import { ToastService } from './toast.service';

/**
 * Daily Engagement Service
 * The BRAIN behind daily return visits. Tracks everything a devotee
 * does in a session and encourages them to come back.
 */

export interface DailyChallenge {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  action: string; // What action completes it
  target: number;
  current: number;
  completed: boolean;
  points: number;
}

export interface DailyEngagementData {
  date: string; // YYYY-MM-DD
  challenges: DailyChallenge[];
  totalChallengesCompleted: number;
  allChallengesCompleted: boolean;
  dailyBlessingReceived: boolean;
  aartiPerformed: boolean;
  diyaLit: boolean;
  bellRung: boolean;
  wishMade: boolean;
  quoteRead: boolean;
  sharedApp: boolean;
  meditationDone: boolean;
  sessionStartTime: number;
  totalTimeSpent: number; // minutes
  bonusPointsEarned: number;
}

@Injectable({
  providedIn: 'root'
})
export class DailyEngagementService {
  private readonly STORAGE_KEY = 'temple_daily_engagement';
  private readonly COMEBACK_KEY = 'temple_comeback_data';
  
  private engagementSubject = new BehaviorSubject<DailyEngagementData>(this.getDefaultData());
  public engagement$ = this.engagementSubject.asObservable();

  private comebackMessageSubject = new BehaviorSubject<{ message: string; messageHi: string } | null>(null);
  public comebackMessage$ = this.comebackMessageSubject.asObservable();

  constructor(
    private calendar: HinduCalendarService,
    private rewards: DevoteeRewardsService,
    private lang: LanguageService,
    private toast: ToastService
  ) {
    this.initializeDaily();
    this.trackSessionTime();
    this.generateComebackMessage();
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getDefaultData(): DailyEngagementData {
    return {
      date: this.getToday(),
      challenges: this.generateDailyChallenges(),
      totalChallengesCompleted: 0,
      allChallengesCompleted: false,
      dailyBlessingReceived: false,
      aartiPerformed: false,
      diyaLit: false,
      bellRung: false,
      wishMade: false,
      quoteRead: false,
      sharedApp: false,
      meditationDone: false,
      sessionStartTime: Date.now(),
      totalTimeSpent: 0,
      bonusPointsEarned: 0
    };
  }

  private initializeDaily(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as DailyEngagementData;
        if (data.date === this.getToday()) {
          // Same day — resume
          data.sessionStartTime = Date.now();
          this.engagementSubject.next(data);
        } else {
          // New day — fresh start + award daily visit
          const fresh = this.getDefaultData();
          this.engagementSubject.next(fresh);
          this.rewards.addPoints('dailyVisit');
          this.save();
        }
      } else {
        // First ever visit
        const fresh = this.getDefaultData();
        this.engagementSubject.next(fresh);
        this.rewards.addPoints('dailyVisit');
        this.save();
      }
    } catch {
      const fresh = this.getDefaultData();
      this.engagementSubject.next(fresh);
    }
  }

  /**
   * Generate dynamic daily challenges based on day, festivals, etc.
   */
  private generateDailyChallenges(): DailyChallenge[] {
    const dayOfWeek = new Date().getDay();
    const todaysFestival = this.calendar.getTodaysFestival();
    
    const baseChallenges: DailyChallenge[] = [
      {
        id: 'light_diya', title: 'Light a Diya', titleHi: 'दीया जलाएं',
        description: 'Light a diya for your loved ones', descriptionHi: 'अपने प्रियजनों के लिए दीया जलाएं',
        icon: '🪔', action: 'diya', target: 1, current: 0, completed: false, points: 25
      },
      {
        id: 'ring_bell', title: 'Ring the Temple Bell', titleHi: 'मंदिर की घंटी बजाएं',
        description: 'Ring the bell 3 times', descriptionHi: '3 बार घंटी बजाएं',
        icon: '🔔', action: 'bell', target: 3, current: 0, completed: false, points: 15
      },
      {
        id: 'offer_flowers', title: 'Offer Flowers', titleHi: 'फूल चढ़ाएं',
        description: 'Offer flowers to the deity', descriptionHi: 'भगवान को फूल चढ़ाएं',
        icon: '🌺', action: 'flowers', target: 1, current: 0, completed: false, points: 15
      },
      {
        id: 'read_quote', title: 'Read Today\'s Quote', titleHi: 'आज का विचार पढ़ें',
        description: 'Read and reflect on today\'s spiritual quote', descriptionHi: 'आज के आध्यात्मिक विचार को पढ़ें',
        icon: '📖', action: 'quote', target: 1, current: 0, completed: false, points: 10
      }
    ];

    // Day-specific challenges
    if (dayOfWeek === 2) { // Tuesday - Hanuman day
      baseChallenges.push({
        id: 'hanuman_chalisa', title: 'Listen to Hanuman Chalisa', titleHi: 'हनुमान चालीसा सुनें',
        description: 'Tuesday special: Listen to Hanuman Chalisa', descriptionHi: 'मंगलवार विशेष: हनुमान चालीसा सुनें',
        icon: '🙏', action: 'aarti', target: 1, current: 0, completed: false, points: 40
      });
    } else if (dayOfWeek === 1) { // Monday - Shiva day
      baseChallenges.push({
        id: 'shiva_worship', title: 'Visit Shiva Temple', titleHi: 'शिव मंदिर जाएं',
        description: 'Monday special: Visit Shiva temple and chant', descriptionHi: 'सोमवार विशेष: शिव मंदिर जाएं',
        icon: '🔱', action: 'visit_shiva', target: 1, current: 0, completed: false, points: 30
      });
    } else if (dayOfWeek === 5) { // Friday - Durga/Lakshmi
      baseChallenges.push({
        id: 'durga_worship', title: 'Visit Durga Temple', titleHi: 'दुर्गा मंदिर जाएं',
        description: 'Friday special: Seek Maa Durga\'s blessings', descriptionHi: 'शुक्रवार विशेष: माँ दुर्गा का आशीर्वाद लें',
        icon: '🌺', action: 'visit_durga', target: 1, current: 0, completed: false, points: 30
      });
    }

    // Bonus challenge: Make a wish (not every day)
    if (dayOfWeek % 2 === 0) {
      baseChallenges.push({
        id: 'make_wish', title: 'Make a Wish', titleHi: 'मनोकामना करें',
        description: 'Submit a wish with full ritual', descriptionHi: 'पूरे अनुष्ठान के साथ मनोकामना करें',
        icon: '⭐', action: 'wish', target: 1, current: 0, completed: false, points: 50
      });
    }

    // Festival special challenge
    if (todaysFestival) {
      baseChallenges.push({
        id: 'festival_special', title: `${todaysFestival.emoji} Festival Special`, titleHi: `${todaysFestival.emoji} त्योहार विशेष`,
        description: `Celebrate ${todaysFestival.name}! Light 3 diyas`, descriptionHi: `${todaysFestival.nameHi} मनाएं! 3 दीये जलाएं`,
        icon: todaysFestival.emoji, action: 'diya', target: 3, current: 0, completed: false, points: 100
      });
    }

    return baseChallenges;
  }

  /**
   * Record an action and check against challenges
   */
  recordAction(action: string): void {
    const data = this.engagementSubject.value;
    let pointsEarned = 0;

    // Update tracking flags
    switch (action) {
      case 'diya': data.diyaLit = true; break;
      case 'bell': data.bellRung = true; break;
      case 'aarti': data.aartiPerformed = true; break;
      case 'wish': data.wishMade = true; break;
      case 'quote': data.quoteRead = true; break;
      case 'share': data.sharedApp = true; break;
      case 'meditation': data.meditationDone = true; break;
      case 'blessing': data.dailyBlessingReceived = true; break;
    }

    // Update challenges
    data.challenges.forEach(challenge => {
      if (challenge.action === action && !challenge.completed) {
        challenge.current++;
        if (challenge.current >= challenge.target) {
          challenge.completed = true;
          data.totalChallengesCompleted++;
          pointsEarned += challenge.points;
          
          const isHi = this.lang.getCurrentLanguage() === 'hi';
          this.toast.success(
            isHi 
              ? `✅ चुनौती पूरी: ${challenge.titleHi} (+${challenge.points} पुण्य)`
              : `✅ Challenge Complete: ${challenge.title} (+${challenge.points} Punya)`,
            3000
          );
        }
      }
    });

    // Check all challenges completed
    if (!data.allChallengesCompleted && data.challenges.every(c => c.completed)) {
      data.allChallengesCompleted = true;
      const bonusPoints = 100;
      pointsEarned += bonusPoints;
      data.bonusPointsEarned += bonusPoints;
      
      const isHi = this.lang.getCurrentLanguage() === 'hi';
      setTimeout(() => {
        this.toast.success(
          isHi 
            ? `🎉 सभी चुनौतियां पूरी! +${bonusPoints} बोनस पुण्य अंक!`
            : `🎉 All challenges completed! +${bonusPoints} bonus Punya Points!`,
          5000
        );
      }, 1500);
    }

    // Award points
    if (pointsEarned > 0) {
      this.rewards.addPoints('completeRitual', `Daily challenge: ${action}`);
    }

    this.engagementSubject.next(data);
    this.save();
  }

  /**
   * Track session time
   */
  private trackSessionTime(): void {
    interval(60000).subscribe(() => { // Every minute
      const data = this.engagementSubject.value;
      data.totalTimeSpent++;
      
      // Award time-based points every 5 minutes
      if (data.totalTimeSpent % 5 === 0 && data.totalTimeSpent <= 30) {
        this.rewards.addPoints('dailyVisit', `${data.totalTimeSpent} minutes in temple`);
      }
      
      this.engagementSubject.next(data);
      this.save();
    });
  }

  /**
   * Generate comeback message based on last visit
   */
  private generateComebackMessage(): void {
    try {
      const stored = localStorage.getItem(this.COMEBACK_KEY);
      if (stored) {
        const lastVisit = JSON.parse(stored);
        const lastDate = new Date(lastVisit.date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          this.comebackMessageSubject.next({
            message: `🔥 Welcome back! Day ${lastVisit.streak + 1} streak! The Gods are pleased with your devotion.`,
            messageHi: `🔥 स्वागत है! ${lastVisit.streak + 1} दिन की लगातार यात्रा! देवता आपकी भक्ति से प्रसन्न हैं।`
          });
        } else if (daysDiff === 0) {
          // Same day return
          this.comebackMessageSubject.next({
            message: '🙏 Welcome back again today! Your devotion grows stronger with each visit.',
            messageHi: '🙏 आज फिर स्वागत है! हर दर्शन से आपकी भक्ति और मजबूत होती है।'
          });
        } else if (daysDiff <= 3) {
          this.comebackMessageSubject.next({
            message: `🌸 We missed you for ${daysDiff} days! The temple bells were waiting for you.`,
            messageHi: `🌸 ${daysDiff} दिन से हम आपकी प्रतीक्षा कर रहे थे! मंदिर की घंटियाँ आपका इंतज़ार कर रही थीं।`
          });
        } else if (daysDiff <= 7) {
          this.comebackMessageSubject.next({
            message: '💛 Welcome back after a week! The divine light is always here for you. Resume your journey.',
            messageHi: '💛 एक सप्ताह बाद स्वागत है! दिव्य प्रकाश सदैव आपके लिए है। अपनी यात्रा जारी रखें।'
          });
        } else {
          this.comebackMessageSubject.next({
            message: '🙏 The temple doors are always open for you. Welcome back, devotee! Start fresh today.',
            messageHi: '🙏 मंदिर के द्वार सदैव आपके लिए खुले हैं। स्वागत है भक्त! आज नई शुरुआत करें।'
          });
        }
      }

      // Save current visit for next time
      const streak = this.rewards.getProfile().streak.currentStreak;
      localStorage.setItem(this.COMEBACK_KEY, JSON.stringify({
        date: this.getToday(),
        streak
      }));
    } catch {
      // First visit
      localStorage.setItem(this.COMEBACK_KEY, JSON.stringify({
        date: this.getToday(),
        streak: 1
      }));
    }
  }

  /**
   * Get current daily challenges
   */
  getDailyChallenges(): DailyChallenge[] {
    return this.engagementSubject.value.challenges;
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const data = this.engagementSubject.value;
    if (data.challenges.length === 0) return 0;
    return Math.round((data.totalChallengesCompleted / data.challenges.length) * 100);
  }

  /**
   * Get remaining challenges
   */
  getRemainingChallenges(): DailyChallenge[] {
    return this.engagementSubject.value.challenges.filter(c => !c.completed);
  }

  private save(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.engagementSubject.value));
    } catch {
      // Ignore
    }
  }
}
