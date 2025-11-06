import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FirebaseBackendService, TempleAnnouncement, TempleEvent } from './firebase-backend.service';

/**
 * TempleEventsService
 * 
 * Manages temple events, announcements, and festival notifications
 * Provides real-time updates from Firebase for:
 * - Festival announcements
 * - Special puja timings
 * - Temple maintenance updates
 * - Upcoming events
 */
@Injectable({
  providedIn: 'root'
})
export class TempleEventsService {

  constructor(private firebaseBackend: FirebaseBackendService) {}

  /**
   * Get active announcements
   */
  getActiveAnnouncements(): Observable<TempleAnnouncement[]> {
    return this.firebaseBackend.getActiveAnnouncements();
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(): Observable<TempleEvent[]> {
    return this.firebaseBackend.getUpcomingEvents();
  }

  /**
   * Check if there are any important announcements
   */
  hasImportantAnnouncements(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getActiveAnnouncements().subscribe(announcements => {
        const hasImportant = announcements.some(a => a.type === 'important');
        observer.next(hasImportant);
      });
    });
  }

  /**
   * Get next scheduled event
   */
  getNextEvent(): Observable<TempleEvent | null> {
    return new Observable<TempleEvent | null>(observer => {
      this.getUpcomingEvents().subscribe(events => {
        if (events && events.length > 0) {
          observer.next(events[0]); // First event is the soonest
        } else {
          observer.next(null);
        }
      });
    });
  }

  /**
   * Get festival announcements
   */
  getFestivalAnnouncements(): Observable<TempleAnnouncement[]> {
    return new Observable<TempleAnnouncement[]>(observer => {
      this.getActiveAnnouncements().subscribe(announcements => {
        const festivals = announcements.filter(a => a.type === 'festival');
        observer.next(festivals);
      });
    });
  }

  /**
   * Format event date for display
   */
  formatEventDate(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${this.formatTime(date)}`;
    }

    // Check if tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${this.formatTime(date)}`;
    }

    // Within a week
    const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${dayNames[date.getDay()]} at ${this.formatTime(date)}`;
    }

    // More than a week away
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format time for display
   */
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Get time until event (human readable)
   */
  getTimeUntilEvent(timestamp: number): string {
    const now = Date.now();
    const diff = timestamp - now;

    if (diff < 0) {
      return 'Started';
    }

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'starting soon';
    }
  }
}
