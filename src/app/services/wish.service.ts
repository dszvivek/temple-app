import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wish, WishStatus } from '../models/wish.model';
import { DeityType } from '../models/deity.model';
import { LiveStatsService } from './live-stats.service';
import { FirebaseBackendService } from './firebase-backend.service';
import * as localforage from 'localforage';

/**
 * WishService
 * Manages wishes using IndexedDB via localForage with localStorage fallback
 * NEW: Syncs with Firebase backend for global prayer wall and statistics
 */
@Injectable({
  providedIn: 'root'
})
export class WishService {
  private readonly WISHES_KEY = 'temple_wishes';
  private wishesSubject = new BehaviorSubject<Wish[]>([]);
  public wishes$: Observable<Wish[]> = this.wishesSubject.asObservable();

  constructor(
    private liveStatsService: LiveStatsService,
    private firebaseBackend: FirebaseBackendService
  ) {
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
          deityId: wish.deityId || DeityType.HANUMAN, // Default to Hanuman for existing wishes
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
  async activateWish(wishId: string, shareOnCommunityWall: boolean = false): Promise<void> {
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
    
    // Increment the global wish counter (local and Firebase)
    this.liveStatsService.incrementWishCount();
    
    // Sync to Firebase global statistics
    await this.firebaseBackend.incrementGlobalWishCount();
    
    // Optionally share on community prayer wall
    if (shareOnCommunityWall) {
      await this.shareOnCommunityWall(wishes[wishIndex]);
    }
  }

  /**
   * Share wish on community prayer wall (anonymous)
   */
  private async shareOnCommunityWall(wish: Wish): Promise<void> {
    try {
      await this.firebaseBackend.addCommunityWish({
        category: wish.category,
        deityId: wish.deityId,
        title: wish.title,
        isAnonymous: true,
        offeringType: wish.offeringType
      });
    } catch (error) {
      console.error('Error sharing on community wall:', error);
      // Don't throw - this is optional feature
    }
  }

  /**
   * Get community wishes from Firebase (prayer wall)
   */
  getCommunityWishes(): Observable<any[]> {
    return this.firebaseBackend.getCommunityWishes(20);
  }

  /**
   * Send prayer/support to community wish
   */
  async prayForCommunityWish(wishId: string): Promise<void> {
    await this.firebaseBackend.prayForWish(wishId);
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
   * Get wishes by deity
   */
  getWishesByDeity(deityId: DeityType): Wish[] {
    return this.wishesSubject.value.filter(w => w.deityId === deityId);
  }

  /**
   * Get wishes by deity and status
   */
  getWishesByDeityAndStatus(deityId: DeityType, status: WishStatus): Wish[] {
    return this.wishesSubject.value.filter(w => 
      w.deityId === deityId && w.status === status
    );
  }

  /**
   * Get recent wishes for a specific deity
   */
  getRecentWishesByDeity(deityId: DeityType, limit: number = 10): Wish[] {
    return this.wishesSubject.value
      .filter(w => w.deityId === deityId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
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
