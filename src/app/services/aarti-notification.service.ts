import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TempleScheduleService } from './temple-schedule.service';

@Injectable({
  providedIn: 'root'
})
export class AartiNotificationService {
  private readonly NOTIFICATION_ENABLED_KEY = 'temple-aarti-notifications-enabled';
  private readonly LAST_NOTIFICATION_KEY = 'temple-last-aarti-notification';
  
  private notificationsEnabled = new BehaviorSubject<boolean>(this.loadNotificationState());
  public notificationsEnabled$ = this.notificationsEnabled.asObservable();
  
  private checkInterval?: any;
  private permissionGranted = false;

  constructor(private scheduleService: TempleScheduleService) {
    this.initializeNotifications();
  }

  /**
   * Initialize notification system
   */
  private async initializeNotifications(): Promise<void> {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    // Check current permission
    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
    }

    // Start checking for aarti times if enabled
    if (this.notificationsEnabled.value && this.permissionGranted) {
      this.startNotificationChecker();
    }
  }

  /**
   * Request notification permission from user
   */
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    }

    return false;
  }

  /**
   * Enable aarti notifications
   */
  public async enableNotifications(): Promise<boolean> {
    const granted = await this.requestPermission();
    
    if (granted) {
      this.notificationsEnabled.next(true);
      this.saveNotificationState(true);
      this.startNotificationChecker();
      return true;
    }
    
    return false;
  }

  /**
   * Disable aarti notifications
   */
  public disableNotifications(): void {
    this.notificationsEnabled.next(false);
    this.saveNotificationState(false);
    this.stopNotificationChecker();
  }

  /**
   * Toggle notifications on/off
   */
  public async toggleNotifications(): Promise<boolean> {
    if (this.notificationsEnabled.value) {
      this.disableNotifications();
      return false;
    } else {
      return await this.enableNotifications();
    }
  }

  /**
   * Check if notifications are enabled
   */
  public areNotificationsEnabled(): boolean {
    return this.notificationsEnabled.value && this.permissionGranted;
  }

  /**
   * Start checking for aarti times
   */
  private startNotificationChecker(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkForAartiTime();
    }, 60000);

    // Check immediately
    this.checkForAartiTime();
  }

  /**
   * Stop checking for aarti times
   */
  private stopNotificationChecker(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
  }

  /**
   * Check if it's time to send an aarti notification
   */
  private checkForAartiTime(): void {
    if (!this.permissionGranted || !this.notificationsEnabled.value) {
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour}:${currentMinute}`;

    const aartiTimes = this.scheduleService.getAartiTimes();
    
    for (const aarti of aartiTimes) {
      const aartiTime = `${aarti.hour}:${aarti.minute}`;
      
      if (currentTime === aartiTime) {
        // Check if we already sent notification for this aarti today
        const lastNotification = localStorage.getItem(this.LAST_NOTIFICATION_KEY);
        const today = new Date().toDateString();
        const notificationKey = `${today}-${aartiTime}`;
        
        if (lastNotification !== notificationKey) {
          this.sendNotification(aarti);
          localStorage.setItem(this.LAST_NOTIFICATION_KEY, notificationKey);
        }
      }
    }
  }

  /**
   * Send aarti notification
   */
  private sendNotification(aarti: { hour: number; minute: number; label: string; emoji: string }): void {
    if (!this.permissionGranted) {
      return;
    }

    const notification = new Notification('🙏 Karunamayi Hanuman E-Mandir', {
      body: `${aarti.emoji} ${aarti.label} is starting now!\nJoin us in devotion.`,
      icon: 'assets/icons/icon-192x192.png',
      badge: 'assets/icons/icon-72x72.png',
      tag: `aarti-${aarti.hour}`,
      requireInteraction: false,
      silent: false
    });

    // Auto-close notification after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    // Optional: Open app when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  /**
   * Get next aarti time
   */
  public getNextAarti(): { time: Date; label: string; emoji: string } | null {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const aartiTimes = this.scheduleService.getAartiTimes();
    
    for (const aarti of aartiTimes) {
      const aartiTimeInMinutes = aarti.hour * 60 + aarti.minute;
      
      if (aartiTimeInMinutes > currentTimeInMinutes) {
        const nextTime = new Date();
        nextTime.setHours(aarti.hour, aarti.minute, 0, 0);
        return {
          time: nextTime,
          label: aarti.label,
          emoji: aarti.emoji
        };
      }
    }

    // If no aarti left today, return first aarti tomorrow
    if (aartiTimes.length > 0) {
      const firstAarti = aartiTimes[0];
      const nextTime = new Date();
      nextTime.setDate(nextTime.getDate() + 1);
      nextTime.setHours(firstAarti.hour, firstAarti.minute, 0, 0);
      return {
        time: nextTime,
        label: firstAarti.label,
        emoji: firstAarti.emoji
      };
    }

    return null;
  }

  /**
   * Load notification state from localStorage
   */
  private loadNotificationState(): boolean {
    try {
      const saved = localStorage.getItem(this.NOTIFICATION_ENABLED_KEY);
      return saved === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Save notification state to localStorage
   */
  private saveNotificationState(enabled: boolean): void {
    try {
      localStorage.setItem(this.NOTIFICATION_ENABLED_KEY, String(enabled));
    } catch (error) {
      console.error('Failed to save notification state:', error);
    }
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.stopNotificationChecker();
  }
}
