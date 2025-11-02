import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wish, WishStatus } from '../models/wish.model';
import { LiveStatsService } from './live-stats.service';
import * as localforage from 'localforage';

/**
 * WishService
 * Manages wishes using IndexedDB via localForage with localStorage fallback
 */
@Injectable({
  providedIn: 'root'
})
export class WishService {
  private readonly WISHES_KEY = 'temple_wishes';
  private wishesSubject = new BehaviorSubject<Wish[]>([]);
  public wishes$: Observable<Wish[]> = this.wishesSubject.asObservable();

  constructor(private liveStatsService: LiveStatsService) {
    this.initializeStorage();
    this.loadWishes();
  }

  /**
   * Initialize localForage with IndexedDB and localStorage fallback
   */
  private initializeStorage(): void {
    localforage.config({
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
      name: 'KaryaSiddhiTemple',
      version: 1.0,
      storeName: 'wishes',
      description: 'Storage for devotee wishes and prayers'
    });
  }

  /**
   * Load wishes from storage
   */
  private async loadWishes(): Promise<void> {
    try {
      const wishes = await localforage.getItem<Wish[]>(this.WISHES_KEY);
      if (wishes && Array.isArray(wishes)) {
        // Convert date strings back to Date objects
        const parsedWishes = wishes.map(wish => ({
          ...wish,
          createdAt: new Date(wish.createdAt),
          activatedAt: wish.activatedAt ? new Date(wish.activatedAt) : undefined,
          fulfilledAt: wish.fulfilledAt ? new Date(wish.fulfilledAt) : undefined
        }));
        this.wishesSubject.next(parsedWishes);
      }
    } catch (error) {
      console.error('Error loading wishes:', error);
      // Fallback to empty array if there's an error
      this.wishesSubject.next([]);
    }
  }

  /**
   * Save wishes to storage
   */
  private async saveWishes(wishes: Wish[]): Promise<void> {
    try {
      await localforage.setItem(this.WISHES_KEY, wishes);
      this.wishesSubject.next(wishes);
    } catch (error) {
      console.error('Error saving wishes:', error);
      throw new Error('Failed to save wish. Please try again.');
    }
  }

  /**
   * Create a new wish
   */
  async createWish(wish: Omit<Wish, 'id' | 'createdAt' | 'status'>): Promise<Wish> {
    const newWish: Wish = {
      ...wish,
      id: this.generateId(),
      createdAt: new Date(),
      status: WishStatus.CREATED
    };

    const wishes = this.wishesSubject.value;
    wishes.push(newWish);
    await this.saveWishes(wishes);
    
    return newWish;
  }

  /**
   * Activate a wish (after donation/offering)
   */
  async activateWish(wishId: string): Promise<void> {
    const wishes = this.wishesSubject.value;
    const wishIndex = wishes.findIndex(w => w.id === wishId);
    
    if (wishIndex === -1) {
      throw new Error('Wish not found');
    }

    wishes[wishIndex] = {
      ...wishes[wishIndex],
      status: WishStatus.ACTIVATED,
      activatedAt: new Date()
    };

    await this.saveWishes(wishes);
    
    // Increment the global wish counter
    this.liveStatsService.incrementWishCount();
  }

  /**
   * Mark a wish as fulfilled
   */
  async fulfillWish(wishId: string): Promise<void> {
    const wishes = this.wishesSubject.value;
    const wishIndex = wishes.findIndex(w => w.id === wishId);
    
    if (wishIndex === -1) {
      throw new Error('Wish not found');
    }

    wishes[wishIndex] = {
      ...wishes[wishIndex],
      status: WishStatus.FULFILLED,
      fulfilledAt: new Date()
    };

    await this.saveWishes(wishes);
  }

  /**
   * Get a single wish by ID
   */
  getWish(wishId: string): Wish | undefined {
    return this.wishesSubject.value.find(w => w.id === wishId);
  }

  /**
   * Get all wishes
   */
  getAllWishes(): Wish[] {
    return this.wishesSubject.value;
  }

  /**
   * Get recent wishes (last 10)
   */
  getRecentWishes(limit: number = 10): Wish[] {
    return this.wishesSubject.value
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get wishes by status
   */
  getWishesByStatus(status: WishStatus): Wish[] {
    return this.wishesSubject.value.filter(w => w.status === status);
  }

  /**
   * Delete a wish
   */
  async deleteWish(wishId: string): Promise<void> {
    const wishes = this.wishesSubject.value.filter(w => w.id !== wishId);
    await this.saveWishes(wishes);
  }

  /**
   * Clear all wishes (for testing/reset)
   */
  async clearAllWishes(): Promise<void> {
    await this.saveWishes([]);
  }

  /**
   * Generate a unique ID for wishes
   */
  private generateId(): string {
    return `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get statistics
   */
  getStatistics(): { total: number; activated: number; fulfilled: number } {
    const wishes = this.wishesSubject.value;
    return {
      total: wishes.length,
      activated: wishes.filter(w => w.status === WishStatus.ACTIVATED).length,
      fulfilled: wishes.filter(w => w.status === WishStatus.FULFILLED).length
    };
  }
}
