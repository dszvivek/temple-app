import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';

/**
 * LiveStatsService - Manages live devotee count and wish statistics
 * 
 * Features:
 * - Simulates live devotee presence (realistic fluctuation)
 * - Tracks total wishes submitted across all users
 * - Updates counter smoothly with random variations
 * - Persists wish count in localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class LiveStatsService {
  private liveDevoteesSubject = new BehaviorSubject<number>(0);
  private totalWishesSubject = new BehaviorSubject<number>(0);

  public liveDevotees$: Observable<number> = this.liveDevoteesSubject.asObservable();
  public totalWishes$: Observable<number> = this.totalWishesSubject.asObservable();

  // Base numbers for realistic simulation
  private baseDevoteeCount = 500; // Starting base
  private baseTotalWishes = 1000; // Starting total wishes
  
  // Storage keys
  private readonly WISHES_KEY = 'temple-total-wishes';
  private readonly DEVOTEES_SEED_KEY = 'temple-devotee-seed';

  constructor() {
    this.initializeStats();
    this.startLiveUpdates();
  }

  /**
   * Initialize statistics from localStorage or defaults
   */
  private initializeStats(): void {
    // Load total wishes
    const storedWishes = localStorage.getItem(this.WISHES_KEY);
    if (storedWishes) {
      this.baseTotalWishes = parseInt(storedWishes, 10);
    } else {
      localStorage.setItem(this.WISHES_KEY, this.baseTotalWishes.toString());
    }
    this.totalWishesSubject.next(this.baseTotalWishes);

    // Initialize live devotees with random variation
    const initialDevotees = this.calculateLiveDevotees();
    this.liveDevoteesSubject.next(initialDevotees);
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
   * Start live updates (every 10 seconds)
   */
  private startLiveUpdates(): void {
    // Update devotee count every 10 seconds with smooth transitions
    interval(10000).subscribe(() => {
      const newCount = this.calculateLiveDevotees();
      this.liveDevoteesSubject.next(newCount);
    });

    // Gradually increment total wishes to simulate activity (every 30 seconds)
    interval(30000).subscribe(() => {
      // Randomly increment by 0-2 wishes every 30 seconds
      if (Math.random() > 0.3) { // 70% chance
        const increment = Math.random() > 0.5 ? 1 : 2;
        this.incrementTotalWishes(increment);
      }
    });
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
