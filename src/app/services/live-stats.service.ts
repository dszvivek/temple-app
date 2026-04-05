import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs'; // interval used for presence ping
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

  // Storage keys
  private readonly WISHES_KEY = 'temple-total-wishes';

  private isUsingFirebase = false;

  constructor(private firebaseBackend: FirebaseBackendService) {
    this.initializeStats();
    this.startPresenceUpdates();
  }

  /**
   * Initialize statistics from Firebase. Only show real data — no fabricated counts.
   */
  private initializeStats(): void {
    this.firebaseBackend.getGlobalStats().subscribe(stats => {
      if (stats) {
        this.isUsingFirebase = true;
        this.totalWishesSubject.next(stats.totalWishes || 0);
        this.totalDiyasSubject.next(stats.totalDiyas || 0);
        this.liveDevoteesSubject.next(stats.liveDevotees || 0);
      } else {
        // Offline: show locally cached wish count, 0 for live devotees
        const storedWishes = localStorage.getItem(this.WISHES_KEY);
        if (storedWishes) {
          this.totalWishesSubject.next(parseInt(storedWishes, 10));
        }
        this.liveDevoteesSubject.next(0);
      }
    });
  }

  /**
   * Ping Firebase presence every 30 seconds so other users see this devotee online
   */
  private startPresenceUpdates(): void {
    interval(30000).subscribe(() => {
      this.firebaseBackend.updateDevoteePresence();
    });
  }

  /**
   * Increment total wishes when user submits a wish
   */
  public incrementWishCount(): void {
    const newTotal = this.totalWishesSubject.value + 1;
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
