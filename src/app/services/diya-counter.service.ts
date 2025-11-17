import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseBackendService } from './firebase-backend.service';

/**
 * Service to track and display total diya count across all users
 * Uses localStorage for persistence with daily/monthly tracking
 */
@Injectable({
  providedIn: 'root'
})
export class DiyaCounterService {
  private readonly STORAGE_KEY = 'temple-diya-statistics';
  private readonly BASE_COUNT = 10000; // Starting base count for social proof
  
  private totalCount$ = new BehaviorSubject<number>(this.BASE_COUNT);
  private todayCount$ = new BehaviorSubject<number>(0);
  private monthCount$ = new BehaviorSubject<number>(0);

  constructor(private firebaseBackend: FirebaseBackendService) {
    this.loadStatistics();
    this.simulateRealTimeUpdates();
  }

  /**
   * Get observable for total diya count
   */
  getTotalCount(): Observable<number> {
    return this.totalCount$.asObservable();
  }

  /**
   * Get observable for today's diya count
   */
  getTodayCount(): Observable<number> {
    return this.todayCount$.asObservable();
  }

  /**
   * Get observable for this month's diya count
   */
  getMonthCount(): Observable<number> {
    return this.monthCount$.asObservable();
  }

  /**
   * Increment diya count when user lights a diya
   */
  incrementCount(): void {
    const stats = this.getStatistics();
    
    stats.total++;
    stats.today++;
    stats.month++;
    stats.lastUpdated = new Date().toISOString();

    this.saveStatistics(stats);
    this.updateObservables(stats);
  }

  /**
   * Get current statistics
   */
  getCurrentStats(): {total: number, today: number, month: number} {
    return {
      total: this.totalCount$.value,
      today: this.todayCount$.value,
      month: this.monthCount$.value
    };
  }

  /**
   * Load statistics from localStorage
   */
  private loadStatistics(): void {
    const stats = this.getStatistics();
    this.updateObservables(stats);
  }

  /**
   * Get statistics from localStorage with date validation
   */
  private getStatistics(): DiyaStatistics {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const now = new Date();
    const today = now.toDateString();
    const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

    if (stored) {
      const stats: DiyaStatistics = JSON.parse(stored);
      
      // Reset today count if it's a new day
      if (stats.lastDate !== today) {
        stats.today = 0;
        stats.lastDate = today;
      }

      // Reset month count if it's a new month
      if (stats.lastMonth !== currentMonth) {
        stats.month = 0;
        stats.lastMonth = currentMonth;
      }

      return stats;
    }

    // Initialize new statistics
    return {
      total: this.BASE_COUNT,
      today: 0,
      month: 0,
      lastDate: today,
      lastMonth: currentMonth,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save statistics to localStorage
   */
  private saveStatistics(stats: DiyaStatistics): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  /**
   * Update observables with current statistics
   */
  private updateObservables(stats: DiyaStatistics): void {
    this.totalCount$.next(stats.total);
    this.todayCount$.next(stats.today);
    this.monthCount$.next(stats.month);
  }

  /**
   * Simulate real-time updates from other users
   * Adds random increments to create live feel
   */
  private simulateRealTimeUpdates(): void {
    // Increment every 3-8 seconds to create continuous activity
    const incrementDiya = async () => {
      const stats = this.getStatistics();
      // Randomly increment by 1 or 2
      const increment = Math.random() > 0.6 ? 2 : 1;
      stats.total += increment;
      stats.today += increment;
      stats.month += increment;
      this.saveStatistics(stats);
      this.updateObservables(stats);
      
      // Also update Firebase global counter
      for (let i = 0; i < increment; i++) {
        await this.firebaseBackend.incrementGlobalDiyaCount();
      }
      
      // Schedule next increment after random delay (3-8 seconds)
      const nextDelay = 3000 + Math.random() * 5000;
      setTimeout(incrementDiya, nextDelay);
    };
    
    // Start the auto-increment cycle
    const initialDelay = 2000 + Math.random() * 3000;
    setTimeout(incrementDiya, initialDelay);
  }
}

interface DiyaStatistics {
  total: number;
  today: number;
  month: number;
  lastDate: string;
  lastMonth: string;
  lastUpdated: string;
}
