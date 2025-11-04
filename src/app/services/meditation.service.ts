import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface MeditationSession {
  duration: number;
  startTime: number;
  endTime: number;
  completed: boolean;
}

interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string;
  sessions: MeditationSession[];
}

@Injectable({
  providedIn: 'root'
})
export class MeditationService {
  private readonly STORAGE_KEY = 'temple-meditation-stats';
  private readonly MAX_SESSIONS_STORED = 100;

  private stats$ = new BehaviorSubject<MeditationStats>(this.loadStats());
  private isActive$ = new BehaviorSubject<boolean>(false);
  private timeRemaining$ = new BehaviorSubject<number>(0);
  private currentDuration$ = new BehaviorSubject<number>(0);

  private timer?: any;
  private sessionStartTime = 0;

  constructor() {}

  /**
   * Get meditation statistics
   */
  getStats(): Observable<MeditationStats> {
    return this.stats$.asObservable();
  }

  /**
   * Check if meditation is active
   */
  isActive(): Observable<boolean> {
    return this.isActive$.asObservable();
  }

  /**
   * Get time remaining in seconds
   */
  getTimeRemaining(): Observable<number> {
    return this.timeRemaining$.asObservable();
  }

  /**
   * Get current session duration
   */
  getCurrentDuration(): Observable<number> {
    return this.currentDuration$.asObservable();
  }

  /**
   * Start meditation timer
   */
  startMeditation(minutes: number): void {
    if (this.isActive$.value) {
      this.stopMeditation();
    }

    const seconds = minutes * 60;
    this.sessionStartTime = Date.now();
    this.currentDuration$.next(minutes);
    this.timeRemaining$.next(seconds);
    this.isActive$.next(true);

    this.timer = setInterval(() => {
      const remaining = this.timeRemaining$.value - 1;
      this.timeRemaining$.next(remaining);

      if (remaining <= 0) {
        this.completeMeditation();
      }
    }, 1000);
  }

  /**
   * Stop meditation timer
   */
  stopMeditation(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.isActive$.next(false);
    this.timeRemaining$.next(0);
    this.currentDuration$.next(0);
  }

  /**
   * Complete meditation session
   */
  private completeMeditation(): void {
    const duration = this.currentDuration$.value;
    const session: MeditationSession = {
      duration,
      startTime: this.sessionStartTime,
      endTime: Date.now(),
      completed: true
    };

    this.recordSession(session);
    this.stopMeditation();
  }

  /**
   * Record completed meditation session
   */
  private recordSession(session: MeditationSession): void {
    const stats = this.stats$.value;
    const today = new Date().toDateString();
    const lastSessionDate = stats.lastSessionDate;

    // Update stats
    stats.totalSessions++;
    stats.totalMinutes += session.duration;
    stats.lastSessionDate = today;
    
    // Add session to history
    stats.sessions.unshift(session);
    if (stats.sessions.length > this.MAX_SESSIONS_STORED) {
      stats.sessions = stats.sessions.slice(0, this.MAX_SESSIONS_STORED);
    }

    // Calculate streak
    if (lastSessionDate === today) {
      // Already meditated today, streak remains same
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastSessionDate === yesterdayStr) {
        // Continued streak
        stats.currentStreak++;
      } else {
        // Broke streak, restart
        stats.currentStreak = 1;
      }

      // Update longest streak
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
    }

    this.saveStats(stats);
    this.stats$.next(stats);
  }

  /**
   * Get current statistics values
   */
  getCurrentStats(): MeditationStats {
    return this.stats$.value;
  }

  /**
   * Load stats from localStorage
   */
  private loadStats(): MeditationStats {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading meditation stats:', e);
      }
    }

    return {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: '',
      sessions: []
    };
  }

  /**
   * Save stats to localStorage
   */
  private saveStats(stats: MeditationStats): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  /**
   * Format time for display (MM:SS)
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
