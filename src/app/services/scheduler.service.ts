import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { DevModeService } from './dev-mode.service';

/**
 * Chant Schedule Entry
 */
export interface ChantSchedule {
  id: string;
  name: string;
  time: string; // HH:mm format
  enabled: boolean;
  audioUrl?: string;
}

/**
 * SchedulerService
 * Manages in-app scheduling for chants and prayers
 */
@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  private readonly SCHEDULE_KEY = 'temple_chant_schedule';
  private scheduleSubject = new BehaviorSubject<ChantSchedule[]>([]);
  public schedule$: Observable<ChantSchedule[]> = this.scheduleSubject.asObservable();

  private checkInterval: any;
  private notificationCallback?: (schedule: ChantSchedule) => void;

  constructor(private devMode: DevModeService) {
    this.loadSchedule();
    this.startScheduleChecker();
  }

  /**
   * Load schedule from localStorage
   */
  private loadSchedule(): void {
    try {
      const stored = localStorage.getItem(this.SCHEDULE_KEY);
      if (stored) {
        const schedule = JSON.parse(stored) as ChantSchedule[];
        this.scheduleSubject.next(schedule);
      } else {
        // Set default schedule
        this.setDefaultSchedule();
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      this.setDefaultSchedule();
    }
  }

  /**
   * Save schedule to localStorage
   */
  private saveSchedule(schedule: ChantSchedule[]): void {
    try {
      localStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(schedule));
      this.scheduleSubject.next(schedule);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  }

  /**
   * Set default chant schedule
   */
  private setDefaultSchedule(): void {
    const defaultSchedule: ChantSchedule[] = [
      {
        id: 'morning_chant',
        name: 'Morning Hanuman Chalisa',
        time: '06:00',
        enabled: true,
        audioUrl: 'assets/audio/mantras/hanuman-chalisa.mp3'
      },
      {
        id: 'evening_chant',
        name: 'Evening Aarti',
        time: '18:00',
        enabled: true,
        audioUrl: 'assets/audio/aarti/hanuman-aarti.mp3'
      },
      {
        id: 'night_prayer',
        name: 'Night Prayer',
        time: '21:00',
        enabled: false,
        audioUrl: 'assets/audio/mantras/hanuman-chalisa.mp3'
      }
    ];
    this.saveSchedule(defaultSchedule);
  }

  /**
   * Start checking for scheduled chants every minute
   */
  private startScheduleChecker(): void {
    // Check every minute
    this.checkInterval = interval(60000).subscribe(() => {
      this.checkScheduledChants();
    });
  }

  /**
   * Check if any scheduled chants should be triggered
   */
  private checkScheduledChants(): void {
    // Check if dev mode wants to trigger scheduled chants
    if (this.devMode.shouldTriggerScheduledChants()) {
      const schedule = this.scheduleSubject.value;
      // Trigger all enabled chants when dev mode forces it
      schedule.forEach(item => {
        if (item.enabled) {
          this.triggerChant(item);
        }
      });
      // Reset the trigger flag
      this.devMode.updateConfig({ triggerScheduledChants: false });
      return;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const schedule = this.scheduleSubject.value;
    schedule.forEach(item => {
      if (item.enabled && item.time === currentTime) {
        this.triggerChant(item);
      }
    });
  }

  /**
   * Trigger a scheduled chant
   */
  private triggerChant(schedule: ChantSchedule): void {
    // Call notification callback if registered
    if (this.notificationCallback) {
      this.notificationCallback(schedule);
    }

    // Could also trigger browser notification here if permissions granted
    this.showNotification(schedule);
  }

  /**
   * Show browser notification for scheduled chant
   */
  private showNotification(schedule: ChantSchedule): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Temple Chant Reminder', {
        body: `It's time for ${schedule.name}`,
        icon: 'assets/icons/icon-192x192.png',
        badge: 'assets/icons/icon-72x72.png',
        tag: schedule.id,
        requireInteraction: false
      });
    }
  }

  /**
   * Register callback for chant notifications
   */
  onChantScheduled(callback: (schedule: ChantSchedule) => void): void {
    this.notificationCallback = callback;
  }

  /**
   * Get all scheduled chants
   */
  getSchedule(): ChantSchedule[] {
    return this.scheduleSubject.value;
  }

  /**
   * Add a new scheduled chant
   */
  addSchedule(schedule: Omit<ChantSchedule, 'id'>): void {
    const newSchedule: ChantSchedule = {
      ...schedule,
      id: this.generateId()
    };
    
    const schedules = [...this.scheduleSubject.value, newSchedule];
    this.saveSchedule(schedules);
  }

  /**
   * Update a scheduled chant
   */
  updateSchedule(id: string, updates: Partial<ChantSchedule>): void {
    const schedules = this.scheduleSubject.value.map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    this.saveSchedule(schedules);
  }

  /**
   * Toggle schedule enabled/disabled
   */
  toggleSchedule(id: string): void {
    const schedules = this.scheduleSubject.value.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    this.saveSchedule(schedules);
  }

  /**
   * Delete a scheduled chant
   */
  deleteSchedule(id: string): void {
    const schedules = this.scheduleSubject.value.filter(s => s.id !== id);
    this.saveSchedule(schedules);
  }

  /**
   * Request notification permissions
   */
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  /**
   * Check if notifications are enabled
   */
  areNotificationsEnabled(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
    }
  }
}
