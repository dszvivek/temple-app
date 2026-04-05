import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PunyaPoints {
  total: number;
  todayEarned: number;
  weeklyEarned: number;
  monthlyEarned: number;
  lifetimeEarned: number;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;
  totalVisits: number;
}

export interface Badge {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  earnedDate?: string;
  requirement: number;
  type: 'streak' | 'diyas' | 'wishes' | 'aarti' | 'visits' | 'sharing' | 'special';
}

export interface DevoteeProfile {
  points: PunyaPoints;
  streak: DailyStreak;
  badges: Badge[];
  activities: ActivityLog[];
  level: number;
  levelName: string;
  levelNameHi: string;
  nextLevelPoints: number;
  prasadReceived: number;
  prasadShared: number;
  aartiPerformed: number;
}

export interface ActivityLog {
  type: string;
  points: number;
  timestamp: string;
  description: string;
}

// Points configuration
export const POINTS_CONFIG = {
  dailyVisit: 10,
  consecutiveDay: 5, // Bonus per consecutive day
  lightDiya: 25,
  makeWish: 50,
  completeRitual: 30,
  performAarti: 40,
  ringBell: 5,
  offerFlowers: 15,
  shareApp: 100,
  receivePrasad: 20,
  sharePrasad: 35,
  meditation: 30,
  weeklyBonus: 50, // 7-day streak
  monthlyBonus: 200, // 30-day streak
};

// Level thresholds
export const LEVELS = [
  { level: 1, name: 'Devotee', nameHi: 'भक्त', minPoints: 0 },
  { level: 2, name: 'Regular Devotee', nameHi: 'नियमित भक्त', minPoints: 100 },
  { level: 3, name: 'Dedicated Devotee', nameHi: 'समर्पित भक्त', minPoints: 500 },
  { level: 4, name: 'Senior Devotee', nameHi: 'वरिष्ठ भक्त', minPoints: 1000 },
  { level: 5, name: 'Temple Patron', nameHi: 'मंदिर सेवक', minPoints: 2500 },
  { level: 6, name: 'Divine Devotee', nameHi: 'दिव्य भक्त', minPoints: 5000 },
  { level: 7, name: 'Blessed Soul', nameHi: 'आशीर्वादित आत्मा', minPoints: 10000 },
  { level: 8, name: 'Spiritual Master', nameHi: 'आध्यात्मिक गुरु', minPoints: 25000 },
];

// Badge definitions
export const BADGES: Badge[] = [
  // Streak badges
  { id: 'streak_3', name: 'Early Riser', nameHi: 'प्रातःकालीन', description: '3-day visit streak', descriptionHi: '3 दिन की यात्रा', icon: '🌅', requirement: 3, type: 'streak' },
  { id: 'streak_7', name: 'Weekly Devotee', nameHi: 'साप्ताहिक भक्त', description: '7-day visit streak', descriptionHi: '7 दिन की यात्रा', icon: '🔥', requirement: 7, type: 'streak' },
  { id: 'streak_30', name: 'Monthly Master', nameHi: 'मासिक गुरु', description: '30-day visit streak', descriptionHi: '30 दिन की यात्रा', icon: '⭐', requirement: 30, type: 'streak' },
  { id: 'streak_100', name: 'Century Devotee', nameHi: 'शतदिवसीय भक्त', description: '100-day visit streak', descriptionHi: '100 दिन की यात्रा', icon: '👑', requirement: 100, type: 'streak' },
  
  // Diya badges
  { id: 'diya_10', name: 'Light Bringer', nameHi: 'प्रकाश वाहक', description: 'Light 10 diyas', descriptionHi: '10 दीये जलाएं', icon: '🪔', requirement: 10, type: 'diyas' },
  { id: 'diya_50', name: 'Flame Keeper', nameHi: 'ज्योति रक्षक', description: 'Light 50 diyas', descriptionHi: '50 दीये जलाएं', icon: '🔥', requirement: 50, type: 'diyas' },
  { id: 'diya_100', name: 'Divine Light', nameHi: 'दिव्य ज्योति', description: 'Light 100 diyas', descriptionHi: '100 दीये जलाएं', icon: '✨', requirement: 100, type: 'diyas' },
  
  // Wish badges
  { id: 'wish_5', name: 'Wishful Heart', nameHi: 'आशावादी हृदय', description: 'Make 5 wishes', descriptionHi: '5 मनोकामनाएं करें', icon: '🙏', requirement: 5, type: 'wishes' },
  { id: 'wish_25', name: 'Faithful Soul', nameHi: 'विश्वासी आत्मा', description: 'Make 25 wishes', descriptionHi: '25 मनोकामनाएं करें', icon: '💫', requirement: 25, type: 'wishes' },
  
  // Aarti badges
  { id: 'aarti_10', name: 'Aarti Singer', nameHi: 'आरती गायक', description: 'Perform 10 aartis', descriptionHi: '10 आरती करें', icon: '🎵', requirement: 10, type: 'aarti' },
  { id: 'aarti_50', name: 'Aarti Master', nameHi: 'आरती विशेषज्ञ', description: 'Perform 50 aartis', descriptionHi: '50 आरती करें', icon: '🎶', requirement: 50, type: 'aarti' },
  
  // Special badges
  { id: 'first_visit', name: 'Welcome!', nameHi: 'स्वागत!', description: 'First temple visit', descriptionHi: 'पहली मंदिर यात्रा', icon: '🏛️', requirement: 1, type: 'visits' },
  { id: 'sharer', name: 'Divine Messenger', nameHi: 'दिव्य संदेशवाहक', description: 'Share the temple with friends', descriptionHi: 'मंदिर साझा करें', icon: '📤', requirement: 1, type: 'sharing' },
];

@Injectable({
  providedIn: 'root'
})
export class DevoteeRewardsService {
  private storageKey = 'devotee_profile';
  
  private profileSubject = new BehaviorSubject<DevoteeProfile>(this.loadProfile());
  public profile$ = this.profileSubject.asObservable();
  
  private pointsAnimationSubject = new BehaviorSubject<{ points: number; message: string } | null>(null);
  public pointsAnimation$ = this.pointsAnimationSubject.asObservable();

  constructor() {
    this.checkDailyVisit();
  }

  private loadProfile(): DevoteeProfile {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Corrupted data — start fresh
        localStorage.removeItem(this.storageKey);
      }
    }
    return this.createNewProfile();
  }

  private createNewProfile(): DevoteeProfile {
    const profile: DevoteeProfile = {
      points: {
        total: 0,
        todayEarned: 0,
        weeklyEarned: 0,
        monthlyEarned: 0,
        lifetimeEarned: 0
      },
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastVisitDate: '',
        totalVisits: 0
      },
      badges: [],
      activities: [],
      level: 1,
      levelName: 'Devotee',
      levelNameHi: 'भक्त',
      nextLevelPoints: 100,
      prasadReceived: 0,
      prasadShared: 0,
      aartiPerformed: 0
    };
    this.saveProfile(profile);
    return profile;
  }

  private saveProfile(profile: DevoteeProfile): void {
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
    this.profileSubject.next(profile);
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private checkDailyVisit(): void {
    const profile = this.profileSubject.value;
    const today = this.getTodayDate();
    const lastVisit = profile.streak.lastVisitDate;

    if (lastVisit !== today) {
      // Reset today's points
      profile.points.todayEarned = 0;

      // Check streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastVisit === yesterdayStr) {
        // Continue streak
        profile.streak.currentStreak++;
        const streakBonus = POINTS_CONFIG.consecutiveDay * profile.streak.currentStreak;
        this.addPointsInternal(profile, POINTS_CONFIG.dailyVisit + streakBonus, 'Daily visit + streak bonus');
        
        // Check for weekly/monthly bonuses
        if (profile.streak.currentStreak === 7) {
          this.addPointsInternal(profile, POINTS_CONFIG.weeklyBonus, '🎉 7-day streak bonus!');
        }
        if (profile.streak.currentStreak === 30) {
          this.addPointsInternal(profile, POINTS_CONFIG.monthlyBonus, '🎊 30-day streak bonus!');
        }
      } else if (lastVisit !== '') {
        // Streak broken
        profile.streak.currentStreak = 1;
        this.addPointsInternal(profile, POINTS_CONFIG.dailyVisit, 'Daily visit');
      } else {
        // First visit ever
        profile.streak.currentStreak = 1;
        this.addPointsInternal(profile, POINTS_CONFIG.dailyVisit, 'Welcome to the temple!');
        this.awardBadge('first_visit');
      }

      profile.streak.lastVisitDate = today;
      profile.streak.totalVisits++;
      
      if (profile.streak.currentStreak > profile.streak.longestStreak) {
        profile.streak.longestStreak = profile.streak.currentStreak;
      }

      this.checkStreakBadges(profile);
      this.saveProfile(profile);
    }
  }

  private addPointsInternal(profile: DevoteeProfile, points: number, description: string): void {
    profile.points.total += points;
    profile.points.todayEarned += points;
    profile.points.weeklyEarned += points;
    profile.points.monthlyEarned += points;
    profile.points.lifetimeEarned += points;

    // Add to activity log
    profile.activities.unshift({
      type: 'points',
      points,
      timestamp: new Date().toISOString(),
      description
    });

    // Keep only last 50 activities
    if (profile.activities.length > 50) {
      profile.activities = profile.activities.slice(0, 50);
    }

    // Update level
    this.updateLevel(profile);
  }

  public addPoints(activityType: keyof typeof POINTS_CONFIG, customMessage?: string): void {
    const profile = this.profileSubject.value;
    const points = POINTS_CONFIG[activityType];
    const message = customMessage || this.getActivityMessage(activityType);
    
    this.addPointsInternal(profile, points, message);
    this.saveProfile(profile);

    // Trigger animation
    this.pointsAnimationSubject.next({ points, message });
    setTimeout(() => this.pointsAnimationSubject.next(null), 3000);
  }

  private getActivityMessage(type: keyof typeof POINTS_CONFIG): string {
    const messages: Record<string, string> = {
      dailyVisit: 'Daily temple visit',
      consecutiveDay: 'Streak bonus',
      lightDiya: 'Lit a diya 🪔',
      makeWish: 'Made a wish 🙏',
      completeRitual: 'Completed ritual',
      performAarti: 'Performed aarti 🎵',
      ringBell: 'Rang temple bell 🔔',
      offerFlowers: 'Offered flowers 🌺',
      shareApp: 'Shared temple 📤',
      receivePrasad: 'Received prasad 🍬',
      sharePrasad: 'Shared prasad',
      meditation: 'Meditation session 🧘',
      weeklyBonus: '7-day streak!',
      monthlyBonus: '30-day streak!'
    };
    return messages[type] || 'Activity completed';
  }

  private updateLevel(profile: DevoteeProfile): void {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (profile.points.total >= LEVELS[i].minPoints) {
        profile.level = LEVELS[i].level;
        profile.levelName = LEVELS[i].name;
        profile.levelNameHi = LEVELS[i].nameHi;
        profile.nextLevelPoints = i < LEVELS.length - 1 ? LEVELS[i + 1].minPoints : LEVELS[i].minPoints;
        break;
      }
    }
  }

  private checkStreakBadges(profile: DevoteeProfile): void {
    const streakBadges = BADGES.filter(b => b.type === 'streak');
    for (const badge of streakBadges) {
      if (profile.streak.currentStreak >= badge.requirement) {
        this.awardBadge(badge.id);
      }
    }
  }

  public awardBadge(badgeId: string): boolean {
    const profile = this.profileSubject.value;
    
    // Check if already earned
    if (profile.badges.some(b => b.id === badgeId)) {
      return false;
    }

    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      const earnedBadge = { ...badge, earnedDate: new Date().toISOString() };
      profile.badges.push(earnedBadge);
      this.saveProfile(profile);
      return true;
    }
    return false;
  }

  public checkAndAwardBadges(type: Badge['type'], count: number): void {
    const typeBadges = BADGES.filter(b => b.type === type);
    for (const badge of typeBadges) {
      if (count >= badge.requirement) {
        this.awardBadge(badge.id);
      }
    }
  }

  public recordDiyaLit(): void {
    this.addPoints('lightDiya');
    const profile = this.profileSubject.value;
    const diyaCount = profile.activities.filter(a => a.description.includes('diya')).length;
    this.checkAndAwardBadges('diyas', diyaCount);
  }

  public recordWishMade(): void {
    this.addPoints('makeWish');
    const profile = this.profileSubject.value;
    const wishCount = profile.activities.filter(a => a.description.includes('wish')).length;
    this.checkAndAwardBadges('wishes', wishCount);
  }

  public recordAartiPerformed(): void {
    this.addPoints('performAarti');
    const profile = this.profileSubject.value;
    profile.aartiPerformed++;
    this.saveProfile(profile);
    this.checkAndAwardBadges('aarti', profile.aartiPerformed);
  }

  public recordPrasadReceived(): void {
    this.addPoints('receivePrasad');
    const profile = this.profileSubject.value;
    profile.prasadReceived++;
    this.saveProfile(profile);
  }

  public recordPrasadShared(): void {
    this.addPoints('sharePrasad');
    const profile = this.profileSubject.value;
    profile.prasadShared++;
    this.saveProfile(profile);
  }

  public recordAppShared(): void {
    this.addPoints('shareApp');
    this.awardBadge('sharer');
  }

  public getProfile(): DevoteeProfile {
    return this.profileSubject.value;
  }

  public getAllBadges(): Badge[] {
    return BADGES;
  }

  public getEarnedBadges(): Badge[] {
    return this.profileSubject.value.badges;
  }

  public getUnearnedBadges(): Badge[] {
    const earnedIds = this.profileSubject.value.badges.map(b => b.id);
    return BADGES.filter(b => !earnedIds.includes(b.id));
  }

  public getLevelProgress(): number {
    const profile = this.profileSubject.value;
    const currentLevelPoints = LEVELS.find(l => l.level === profile.level)?.minPoints || 0;
    const pointsInLevel = profile.points.total - currentLevelPoints;
    const pointsNeeded = profile.nextLevelPoints - currentLevelPoints;
    return Math.min(100, (pointsInLevel / pointsNeeded) * 100);
  }
}
