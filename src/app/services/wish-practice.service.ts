import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Wish } from '../models/wish.model';
import { ProductAnalyticsService } from './product-analytics.service';

export interface WishPractice {
  wishId: string;
  title: string;
  deityId: string;
  category: string;
  startedAt: string;
  lastCompletedDate?: string;
  completedDays: number;
  totalDays: number;
  status: 'active' | 'completed';
}

@Injectable({
  providedIn: 'root'
})
export class WishPracticeService {
  private readonly STORAGE_KEY = 'manokamna_wish_practice';
  private readonly DEFAULT_TOTAL_DAYS = 14;
  private practiceSubject = new BehaviorSubject<WishPractice | null>(this.loadPractice());
  practice$ = this.practiceSubject.asObservable();

  constructor(private analytics: ProductAnalyticsService) {}

  startPractice(wish: Wish): WishPractice {
    const practice: WishPractice = {
      wishId: wish.id,
      title: wish.title,
      deityId: wish.deityId,
      category: wish.category,
      startedAt: new Date().toISOString(),
      completedDays: 1,
      totalDays: this.DEFAULT_TOTAL_DAYS,
      status: 'active',
      lastCompletedDate: this.getToday()
    };

    this.savePractice(practice);
    this.analytics.track('ritual_action', {
      action: 'sankalp_started',
      deity: practice.deityId,
      totalDays: practice.totalDays
    });
    return practice;
  }

  getActivePractice(): WishPractice | null {
    const practice = this.practiceSubject.value;
    return practice?.status === 'active' ? practice : practice;
  }

  getCurrentDay(practice: WishPractice | null = this.practiceSubject.value): number {
    if (!practice) {
      return 0;
    }

    const started = new Date(practice.startedAt);
    const now = new Date();
    const daysElapsed = Math.floor((this.startOfDay(now).getTime() - this.startOfDay(started).getTime()) / 86400000);
    return Math.min(practice.totalDays, Math.max(1, daysElapsed + 1));
  }

  needsTodayPractice(practice: WishPractice | null = this.practiceSubject.value): boolean {
    return !!practice && practice.status === 'active' && practice.lastCompletedDate !== this.getToday();
  }

  completeToday(): WishPractice | null {
    const practice = this.practiceSubject.value;
    if (!practice || practice.status === 'completed') {
      return practice;
    }

    const today = this.getToday();
    if (practice.lastCompletedDate === today) {
      return practice;
    }

    const currentDay = this.getCurrentDay(practice);
    const updated: WishPractice = {
      ...practice,
      completedDays: Math.max(practice.completedDays, currentDay),
      lastCompletedDate: today,
      status: currentDay >= practice.totalDays ? 'completed' : 'active'
    };

    this.savePractice(updated);
    this.analytics.track('ritual_action', {
      action: updated.status === 'completed' ? 'sankalp_completed' : 'sankalp_day_completed',
      deity: updated.deityId,
      currentDay,
      totalDays: updated.totalDays
    });
    return updated;
  }

  renewPractice(): WishPractice | null {
    const practice = this.practiceSubject.value;
    if (!practice) {
      return null;
    }

    const renewed: WishPractice = {
      ...practice,
      startedAt: new Date().toISOString(),
      lastCompletedDate: this.getToday(),
      completedDays: 1,
      status: 'active'
    };

    this.savePractice(renewed);
    this.analytics.track('ritual_action', {
      action: 'sankalp_renewed',
      deity: renewed.deityId,
      totalDays: renewed.totalDays
    });
    return renewed;
  }

  clearPractice(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
    this.practiceSubject.next(null);
  }

  private loadPractice(): WishPractice | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) as WishPractice : null;
    } catch {
      return null;
    }
  }

  private savePractice(practice: WishPractice): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(practice));
    } catch {
      // The app should continue even if local storage is full.
    }
    this.practiceSubject.next(practice);
  }

  private getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
