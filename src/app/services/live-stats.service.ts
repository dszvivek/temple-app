import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { FirebaseBackendService } from './firebase-backend.service';

/**
 * LiveStatsService - Manages live devotee count and wish statistics
 * 
 * Features:
 * - Real-time global statistics from Firebase
 * - Fallback to simulated stats if offline
 * - Tracks total wishes submitted across all users
 * - Updates counter smoothly with real data
 * - Persists wish count in localStorage
 * - Updates devotee presence in Firebase
 */
@Injectable({
  providedIn: 'root'
})
export class LiveStatsService {
  private liveDevoteesSubject = new BehaviorSubject<number>(0);
  private totalWishesSubject = new BehaviorSubject<number>(0);
  private totalDiyasSubject = new BehaviorSubject<number>(0);

  public liveDevotees$: Observable<number> = this.liveDevoteesSubject.asObservable();
  public totalWishes$: Observable<number> = this.totalWishesSubject.asObservable();
  public totalDiyas$: Observable<number> = this.totalDiyasSubject.asObservable();

  // Base numbers for realistic simulation (fallback)
  private baseDevoteeCount = 500; // Starting base
  private baseTotalWishes = 1000; // Starting total wishes
  
  // Storage keys
  private readonly WISHES_KEY = 'temple-total-wishes';
  private readonly DEVOTEES_SEED_KEY = 'temple-devotee-seed';
  
  private isUsingFirebase = false;

  constructor(private firebaseBackend: FirebaseBackendService) {
    this.initializeStats();
    this.startLiveUpdates();
  }

  /**
   * Initialize statistics from Firebase or localStorage fallback
   */
  private initializeStats(): void {
    // Try to connect to Firebase for real-time stats
    this.firebaseBackend.getGlobalStats().subscribe(stats => {
      if (stats) {
        this.isUsingFirebase = true;
        this.totalWishesSubject.next(stats.totalWishes || 0);
        this.totalDiyasSubject.next(stats.totalDiyas || 0);
        this.liveDevoteesSubject.next(stats.liveDevotees || 0);
        console.log('📊 Connected to Firebase real-time stats');
      } else {
        // Fallback to simulated stats
        this.initializeLocalStats();
      }
    });
    
    // Initial load from local storage while Firebase connects
    this.initializeLocalStats();
  }

  /**
   * Initialize from localStorage (fallback mode)
   */
  private initializeLocalStats(): void {
    const storedWishes = localStorage.getItem(this.WISHES_KEY);
    if (storedWishes) {
      this.baseTotalWishes = parseInt(storedWishes, 10);
    } else {
      localStorage.setItem(this.WISHES_KEY, this.baseTotalWishes.toString());
    }
    
    if (!this.isUsingFirebase) {
      this.totalWishesSubject.next(this.baseTotalWishes);
      const initialDevotees = this.calculateLiveDevotees();
      this.liveDevoteesSubject.next(initialDevotees);
    }
  }

  /**
   * Calculate live devotees based on time of day and randomness
   */
  private calculateLiveDevotees(): number {
    const now = new Date();
    const hour = now.getHours();
    
    // Peak hours: 6-9 AM (morning prayers) and 6-9 PM (evening aarti)
    let multiplier = 1.0;
    
    if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21)) {
      multiplier = 1.8; // 80% more during peak hours
    } else if (hour >= 5 && hour <= 19) {
      multiplier = 1.3; // 30% more during temple hours
    } else {
      multiplier = 0.7; // 30% less during night
    }

    // Add random variation (±20%)
    const randomFactor = 0.8 + (Math.random() * 0.4);
    
    const count = Math.round(this.baseDevoteeCount * multiplier * randomFactor);
    return Math.max(3, count); // Minimum 3 devotees always
  }

  /**
   * Start live updates (every 10 seconds for devotees, 30 seconds for presence)
   */
  private startLiveUpdates(): void {
    // Update devotee presence in Firebase every 30 seconds
    interval(30000).subscribe(() => {
      this.firebaseBackend.updateDevoteePresence();
    });
    
    // If using simulated mode, update devotee count every 10 seconds
    interval(10000).subscribe(() => {
      if (!this.isUsingFirebase) {
        const newCount = this.calculateLiveDevotees();
        this.liveDevoteesSubject.next(newCount);
      }
    });

    // Auto-increment wishes continuously to simulate activity
    const incrementWishes = async () => {
      // Randomly increment by 1 or 2 wishes
      const increment = Math.random() > 0.5 ? 1 : 2;
      this.incrementTotalWishes(increment);
      
      // Also update Firebase global counter
      for (let i = 0; i < increment; i++) {
        await this.firebaseBackend.incrementGlobalWishCount();
      }
      
      // Schedule next increment after random delay (5-12 seconds)
      const nextDelay = 5000 + Math.random() * 7000;
      setTimeout(incrementWishes, nextDelay);
    };
    
    // Start the auto-increment cycle
    const initialDelay = 3000 + Math.random() * 5000;
    setTimeout(incrementWishes, initialDelay);
  }

  /**
   * Increment total wishes when user submits a wish
   */
  public incrementWishCount(): void {
    this.incrementTotalWishes(1);
  }

  /**
   * Increment total wishes by a specific amount
   */
  private incrementTotalWishes(amount: number): void {
    const newTotal = this.totalWishesSubject.value + amount;
    this.baseTotalWishes = newTotal;
    this.totalWishesSubject.next(newTotal);
    localStorage.setItem(this.WISHES_KEY, newTotal.toString());
  }

  /**
   * Get current live devotee count
   */
  public getLiveDevoteeCount(): number {
    return this.liveDevoteesSubject.value;
  }

  /**
   * Get total wishes count
   */
  public getTotalWishesCount(): number {
    return this.totalWishesSubject.value;
  }

  /**
   * Format number with commas (e.g., 1,247)
   */
  public formatNumber(num: number): string {
    return num.toLocaleString('en-IN');
  }
}
