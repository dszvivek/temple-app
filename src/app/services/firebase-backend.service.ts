import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, setDoc, doc, query, where, orderBy, limit, getDocs, onSnapshot, increment, serverTimestamp, Timestamp, writeBatch, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * FirebaseBackendService
 * 
 * Handles all Firebase Firestore operations for the temple app
 * Provides real-time sync for:
 * - Global statistics (wishes, diyas, devotees)
 * - Community prayer wall
 * - Temple events and announcements
 * - Anonymous donations
 * 
 * No user authentication required - all operations are anonymous
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseBackendService {
  
  private isOnline$ = new BehaviorSubject<boolean>(true);
  
  constructor(private firestore: Firestore) {
    this.monitorConnection();
  }

  /**
   * Monitor online/offline status
   */
  private monitorConnection(): void {
    window.addEventListener('online', () => this.isOnline$.next(true));
    window.addEventListener('offline', () => this.isOnline$.next(false));
  }

  /**
   * Check if backend is enabled and online
   */
  isBackendAvailable(): boolean {
    return environment.useBackend && this.isOnline$.value;
  }

  // ==================== GLOBAL STATISTICS ====================

  /**
   * Get real-time global statistics
   */
  getGlobalStats(): Observable<GlobalStats | null> {
    if (!this.isBackendAvailable()) {
      return of(null);
    }

    const statsDoc = doc(this.firestore, 'globals/statistics');
    
    return new Observable<GlobalStats | null>(observer => {
      const unsubscribe = onSnapshot(statsDoc, 
        (snapshot) => {
          if (snapshot.exists()) {
            observer.next(snapshot.data() as GlobalStats);
          } else {
            observer.next(null);
          }
        },
        (error) => {
          console.error('Error fetching global stats:', error);
          observer.next(null);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * Increment global wish counter
   */
  async incrementGlobalWishCount(): Promise<void> {
    if (!this.isBackendAvailable()) return;

    try {
      const statsDoc = doc(this.firestore, 'globals/statistics');
      await updateDoc(statsDoc, {
        totalWishes: increment(1),
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error incrementing wish count:', error);
    }
  }

  /**
   * Increment global diya counter
   */
  async incrementGlobalDiyaCount(): Promise<void> {
    if (!this.isBackendAvailable()) return;

    try {
      const statsDoc = doc(this.firestore, 'globals/statistics');
      await updateDoc(statsDoc, {
        totalDiyas: increment(1),
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error incrementing diya count:', error);
    }
  }

  /**
   * Update live devotee count (called periodically)
   */
  async updateDevoteePresence(): Promise<void> {
    if (!this.isBackendAvailable()) return;

    try {
      const deviceId = this.getDeviceId();
      const presenceDoc = doc(this.firestore, 'presence', deviceId);
      
      // Use setDoc with merge to create or update the document
      await setDoc(presenceDoc, {
        deviceId: deviceId,
        lastSeen: serverTimestamp(),
        timestamp: Date.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  // ==================== COMMUNITY PRAYER WALL ====================

  /**
   * Add wish to community prayer wall (anonymous)
   */
  async addCommunityWish(wish: CommunityWish): Promise<void> {
    if (!this.isBackendAvailable()) return;

    try {
      const communityWishesCol = collection(this.firestore, 'communityWishes');
      
      // Build data object, excluding undefined fields (Firestore doesn't accept undefined)
      const wishData: any = {
        category: wish.category,
        deityId: wish.deityId,
        title: wish.title,
        isAnonymous: wish.isAnonymous,
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
        prayerCount: 0
      };
      
      // Only add offeringType if it's defined
      if (wish.offeringType !== undefined && wish.offeringType !== null && wish.offeringType !== '') {
        wishData.offeringType = wish.offeringType;
      }
      
      await addDoc(communityWishesCol, wishData);
    } catch (error) {
      console.error('Error adding community wish:', error);
      throw error;
    }
  }

  /**
   * Get recent community wishes for prayer wall
   */
  getCommunityWishes(limitCount: number = 20): Observable<CommunityWishWithId[]> {
    if (!this.isBackendAvailable()) {
      return of([]);
    }

    const communityWishesCol = collection(this.firestore, 'communityWishes');
    const q = query(
      communityWishesCol,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    return new Observable<CommunityWishWithId[]>(observer => {
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const wishes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as CommunityWishWithId));
          observer.next(wishes);
        },
        (error) => {
          console.error('Error fetching community wishes:', error);
          observer.next([]);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * Add prayer/support to community wish
   */
  async prayForWish(wishId: string): Promise<void> {
    if (!this.isBackendAvailable()) return;

    try {
      const wishDoc = doc(this.firestore, 'communityWishes', wishId);
      await updateDoc(wishDoc, {
        prayerCount: increment(1)
      });
    } catch (error) {
      console.error('Error adding prayer:', error);
    }
  }

  // ==================== GLOBAL DIYAS ====================

  /**
   * Add diya to global collection
   */
  async addGlobalDiya(diya: GlobalDiya): Promise<void> {
    if (!this.isBackendAvailable()) return;

    try {
      const diyasCol = collection(this.firestore, 'diyas');
      
      // Build data object, excluding undefined fields (Firestore doesn't accept undefined)
      const diyaData: any = {
        name: diya.name,
        deityId: diya.deityId,
        litAt: serverTimestamp(),
        timestamp: Date.now()
      };
      
      // Only add message if it's defined
      if (diya.message !== undefined && diya.message !== null && diya.message !== '') {
        diyaData.message = diya.message;
      }
      
      await addDoc(diyasCol, diyaData);
      
      await this.incrementGlobalDiyaCount();
    } catch (error) {
      console.error('Error adding global diya:', error);
    }
  }

  /**
   * Get active diyas (lit in last 24 hours)
   */
  getActiveDiyas(limitCount: number = 50): Observable<GlobalDiyaWithId[]> {
    if (!this.isBackendAvailable()) {
      return of([]);
    }

    const diyasCol = collection(this.firestore, 'diyas');
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    const q = query(
      diyasCol,
      where('timestamp', '>', twentyFourHoursAgo),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    return new Observable<GlobalDiyaWithId[]>(observer => {
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const diyas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as GlobalDiyaWithId));
          observer.next(diyas);
        },
        (error) => {
          console.error('Error fetching diyas:', error);
          observer.next([]);
        }
      );

      return () => unsubscribe();
    });
  }

  // ==================== TEMPLE EVENTS & ANNOUNCEMENTS ====================

  /**
   * Get active temple announcements
   */
  getActiveAnnouncements(): Observable<TempleAnnouncement[]> {
    if (!this.isBackendAvailable()) {
      return of([]);
    }

    const announcementsCol = collection(this.firestore, 'announcements');
    const now = Date.now();
    
    const q = query(
      announcementsCol,
      where('isActive', '==', true),
      where('expiresAt', '>', now),
      orderBy('expiresAt', 'asc'),
      limit(10)
    );

    return new Observable<TempleAnnouncement[]>(observer => {
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const announcements = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as TempleAnnouncement));
          observer.next(announcements);
        },
        (error) => {
          console.error('Error fetching announcements:', error);
          observer.next([]);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * Get upcoming temple events
   */
  getUpcomingEvents(): Observable<TempleEvent[]> {
    if (!this.isBackendAvailable()) {
      return of([]);
    }

    const eventsCol = collection(this.firestore, 'events');
    const now = Date.now();
    
    const q = query(
      eventsCol,
      where('eventDate', '>', now),
      orderBy('eventDate', 'asc'),
      limit(5)
    );

    return new Observable<TempleEvent[]>(observer => {
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as TempleEvent));
          observer.next(events);
        },
        (error) => {
          console.error('Error fetching events:', error);
          observer.next([]);
        }
      );

      return () => unsubscribe();
    });
  }

  // ==================== DONATIONS ====================

  /**
   * Log anonymous donation (for transparency)
   */
  async logDonation(amount: number, purpose: string = 'General'): Promise<void> {
    if (!this.isBackendAvailable()) return;

    try {
      const donationsCol = collection(this.firestore, 'donations');
      await addDoc(donationsCol, {
        amount,
        purpose,
        timestamp: Date.now(),
        donatedAt: serverTimestamp(),
        isAnonymous: true
      });

      // Update total donations in stats
      const statsDoc = doc(this.firestore, 'globals/statistics');
      await updateDoc(statsDoc, {
        totalDonations: increment(amount),
        donationCount: increment(1)
      });
    } catch (error) {
      console.error('Error logging donation:', error);
    }
  }

  /**
   * Get total donations (for transparency)
   */
  getTotalDonations(): Observable<number> {
    if (!this.isBackendAvailable()) {
      return of(0);
    }

    const statsDoc = doc(this.firestore, 'globals/statistics');
    
    return new Observable<number>(observer => {
      const unsubscribe = onSnapshot(statsDoc,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            observer.next(data['totalDonations'] || 0);
          } else {
            observer.next(0);
          }
        },
        (error) => {
          console.error('Error fetching donations:', error);
          observer.next(0);
        }
      );

      return () => unsubscribe();
    });
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get unique device ID for presence tracking
   */
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('temple_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('temple_device_id', deviceId);
    }
    return deviceId;
  }
}

// ==================== TYPE DEFINITIONS ====================

export interface GlobalStats {
  totalWishes: number;
  totalDiyas: number;
  totalDonations: number;
  donationCount: number;
  liveDevotees: number;
  lastUpdated: any; // Firestore Timestamp
}

export interface CommunityWish {
  category: string;
  deityId: string;
  title: string;
  isAnonymous: boolean;
  offeringType?: string;
}

export interface CommunityWishWithId extends CommunityWish {
  id: string;
  createdAt: any;
  timestamp: number;
  prayerCount: number;
}

export interface GlobalDiya {
  name: string;
  deityId: string;
  message?: string;
}

export interface GlobalDiyaWithId extends GlobalDiya {
  id: string;
  litAt: any;
  timestamp: number;
}

export interface TempleAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'festival' | 'event' | 'important';
  isActive: boolean;
  createdAt: number;
  expiresAt: number;
}

export interface TempleEvent {
  id: string;
  title: string;
  description: string;
  eventDate: number;
  deityId: string;
  type: 'aarti' | 'festival' | 'special';
  notifyBefore?: number; // minutes
}
