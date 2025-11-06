import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as localforage from 'localforage';
import { Diya } from '../models/diya.model';
import { DiyaCounterService } from './diya-counter.service';
import { FirebaseBackendService } from './firebase-backend.service';
import { DeityType } from '../models/deity.model';

/**
 * DiyaService - Manages virtual diyas lit for loved ones
 * 
 * Features:
 * - Add diya with person's name (max 20 chars)
 * - Store in IndexedDB using localforage
 * - Auto-cleanup expired diyas (24 hours)
 * - Observable stream for reactive UI updates
 * - Offline-first architecture
 * NEW: Syncs with Firebase for global diya count and display
 */
@Injectable({
  providedIn: 'root'
})
export class DiyaService {
  private readonly DIYA_STORE_KEY = 'temple_diyas';
  private readonly EXPIRY_HOURS = 24;
  private readonly EXPIRY_MS = this.EXPIRY_HOURS * 60 * 60 * 1000; // 24 hours in milliseconds
  
  private diyasSubject = new BehaviorSubject<Diya[]>([]);
  public diyas$: Observable<Diya[]> = this.diyasSubject.asObservable();
  
  private cleanupInterval?: any;

  constructor(
    private diyaCounterService: DiyaCounterService,
    private firebaseBackend: FirebaseBackendService
  ) {
    this.initializeStore();
    this.startAutoCleanup();
  }

  /**
   * Initialize the diya store
   */
  private async initializeStore(): Promise<void> {
    try {
      await this.loadDiyas();
      await this.cleanupExpired();
    } catch (error) {
      console.error('Error initializing diya store:', error);
    }
  }

  /**
   * Load diyas from IndexedDB
   */
  private async loadDiyas(): Promise<void> {
    try {
      const stored = await localforage.getItem<Diya[]>(this.DIYA_STORE_KEY);
      if (stored && Array.isArray(stored)) {
        this.diyasSubject.next(stored);
      }
    } catch (error) {
      console.error('Error loading diyas:', error);
    }
  }

  /**
   * Save diyas to IndexedDB
   */
  private async saveDiyas(diyas: Diya[]): Promise<void> {
    try {
      await localforage.setItem(this.DIYA_STORE_KEY, diyas);
      this.diyasSubject.next(diyas);
    } catch (error) {
      console.error('Error saving diyas:', error);
      throw error;
    }
  }

  /**
   * Add a new diya for someone
   * @param name - Person's name (max 20 characters)
   * @param deityId - Which deity the diya is for (default: Hanuman)
   * @param message - Optional prayer message
   * @returns Promise<Diya> - The created diya
   */
  async addDiya(name: string, deityId: DeityType = DeityType.HANUMAN, message?: string): Promise<Diya> {
    // Validate name
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 20) {
      throw new Error('Name cannot exceed 20 characters');
    }

    // Create new diya
    const now = Date.now();
    const newDiya: Diya = {
      id: this.generateId(),
      name: trimmedName,
      timestamp: now,
      expiresAt: now + this.EXPIRY_MS
    };

    // Add to store
    const currentDiyas = this.diyasSubject.value;
    const updatedDiyas = [...currentDiyas, newDiya];
    await this.saveDiyas(updatedDiyas);

    // Increment global counter (local)
    this.diyaCounterService.incrementCount();
    
    // Sync to Firebase (global)
    await this.firebaseBackend.addGlobalDiya({
      name: trimmedName,
      deityId: deityId,
      message: message
    });

    console.log(`🪔 Diya lit for ${trimmedName}`);
    return newDiya;
  }

  /**
   * Get global diyas from Firebase (all users)
   */
  getGlobalDiyas(): Observable<any[]> {
    return this.firebaseBackend.getActiveDiyas(50);
  }

  /**
   * Get all active (non-expired) diyas
   * @returns Diya[] - Array of active diyas
   */
  getActiveDiyas(): Diya[] {
    const now = Date.now();
    return this.diyasSubject.value.filter(diya => diya.expiresAt > now);
  }

  /**
   * Get total count of active diyas
   */
  getActiveDiyaCount(): number {
    return this.getActiveDiyas().length;
  }

  /**
   * Remove expired diyas from storage
   * @returns Promise<number> - Count of diyas removed
   */
  async cleanupExpired(): Promise<number> {
    const now = Date.now();
    const currentDiyas = this.diyasSubject.value;
    const activeDiyas = currentDiyas.filter(diya => diya.expiresAt > now);
    
    const removedCount = currentDiyas.length - activeDiyas.length;
    
    if (removedCount > 0) {
      await this.saveDiyas(activeDiyas);
      console.log(`🧹 Cleaned up ${removedCount} expired diya(s)`);
    }
    
    return removedCount;
  }

  /**
   * Remove a specific diya by ID
   */
  async removeDiya(id: string): Promise<void> {
    const currentDiyas = this.diyasSubject.value;
    const updatedDiyas = currentDiyas.filter(diya => diya.id !== id);
    await this.saveDiyas(updatedDiyas);
  }

  /**
   * Get time remaining for a diya (in hours)
   */
  getTimeRemaining(diya: Diya): number {
    const now = Date.now();
    const remaining = diya.expiresAt - now;
    return Math.max(0, Math.floor(remaining / (1000 * 60 * 60))); // Hours
  }

  /**
   * Get formatted time remaining string
   */
  getTimeRemainingText(diya: Diya): string {
    const now = Date.now();
    const remaining = diya.expiresAt - now;
    
    if (remaining <= 0) {
      return 'Expired';
    }
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Start automatic cleanup every hour
   */
  private startAutoCleanup(): void {
    // Run cleanup immediately
    this.cleanupExpired();
    
    // Then run every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Generate unique ID for diya
   */
  private generateId(): string {
    return `diya_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all diyas (for testing/reset)
   */
  async clearAllDiyas(): Promise<void> {
    await this.saveDiyas([]);
    console.log('🧹 All diyas cleared');
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
