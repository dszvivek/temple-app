import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseBackendService } from './firebase-backend.service';

/**
 * Service to track and display total diya count across all users
 * Syncs with Firebase for real-time global counts
 * Falls back to localStorage simulation if Firebase is unavailable
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
  
  private isConnectedToFirebase = false;

  constructor(private firebaseBackend: FirebaseBackendService) {
    this.initializeFromFirebase();
    this.loadLocalStatistics(); // Fallback while Firebase loads
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
   * This updates LOCAL today/month counters only
   * Total count comes from Firebase real-time sync
   */
  incrementCount(): void {
    const stats = this.getLocalStatistics();
    
    // Only increment local today/month counters
    // (Total is synced from Firebase automatically)
    stats.today++;
    stats.month++;
    stats.lastUpdated = new Date().toISOString();

    this.saveStatistics(stats);
    
    // Update only today/month observables
    this.todayCount$.next(stats.today);
    this.monthCount$.next(stats.month);
    
    // Note: total count will be updated by Firebase subscription
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
   * Initialize from Firebase real-time stats
   */
  private initializeFromFirebase(): void {
    // Subscribe to Firebase global stats for real-time sync
    this.firebaseBackend.getGlobalStats().subscribe(stats => {
      if (stats && stats.totalDiyas) {
        this.isConnectedToFirebase = true;
        
        // Update total count from Firebase
        this.totalCount$.next(stats.totalDiyas);
        
        // Calculate today/month stats from localStorage or estimate
        const localStats = this.getLocalStatistics();
        this.todayCount$.next(localStats.today);
        this.monthCount$.next(localStats.month);
        
        console.log('🪔 Connected to Firebase diya counter:', stats.totalDiyas);
      } else {
        // Firebase not available, use local simulation
        if (!this.isConnectedToFirebase) {
          console.log('🪔 Using local diya counter (Firebase unavailable)');
          this.startSimulation();
        }
      }
    });
  }

  /**
   * Load statistics from localStorage (used as supplement to Firebase)
   */
  private loadLocalStatistics(): void {
    const stats = this.getLocalStatistics();
    
    // Only update if not connected to Firebase yet
    if (!this.isConnectedToFirebase) {
      this.totalCount$.next(stats.total);
      this.todayCount$.next(stats.today);
      this.monthCount$.next(stats.month);
    }
  }

  /**
   * Get statistics from localStorage with date validation
   */
  private getLocalStatistics(): DiyaStatistics {
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
   * Simulate real-time updates from other users (fallback when Firebase unavailable)
   * Only runs if not connected to Firebase
   */
  private startSimulation(): void {
    // Only simulate if Firebase is not available
    if (this.isConnectedToFirebase) {
      return;
    }
    
    // Increment every 5-10 seconds to create continuous activity
    const incrementDiya = () => {
      if (this.isConnectedToFirebase) {
        // Stop simulation if Firebase connects
        return;
      }
      
      const stats = this.getLocalStatistics();
      // Randomly increment by 1 or 2
      const increment = Math.random() > 0.6 ? 2 : 1;
      stats.total += increment;
      stats.today += increment;
      stats.month += increment;
      this.saveStatistics(stats);
      
      // Update observables
      this.totalCount$.next(stats.total);
      this.todayCount$.next(stats.today);
      this.monthCount$.next(stats.month);
      
      // Schedule next increment after random delay (5-10 seconds)
      const nextDelay = 5000 + Math.random() * 5000;
      setTimeout(incrementDiya, nextDelay);
    };
    
    // Start the auto-increment cycle
    const initialDelay = 3000 + Math.random() * 3000;
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
