import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { format, differenceInSeconds, addDays, setHours, setMinutes, setSeconds } from 'date-fns';
import { DevModeService } from './dev-mode.service';

export interface TempleSchedule {
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
}

export interface NextEvent {
  type: 'opening' | 'closing' | 'chalisa';
  label: string;
  time: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TempleScheduleService {
  // Temple operates 24/7 for spiritual service
  private readonly schedule: TempleSchedule = {
    openHour: 0,
    openMinute: 0,
    closeHour: 24,
    closeMinute: 0
  };

  // Hanuman Chalisa plays every hour, 24/7
  private readonly chalisaTimes = [
    { hour: 0, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 1, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 2, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 3, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 4, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 5, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 6, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 7, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 8, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 9, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 10, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 11, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 12, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 13, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 14, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 15, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 16, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 17, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 18, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 19, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 20, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 21, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 22, minute: 0, label: 'Hanuman Chalisa' },
    { hour: 23, minute: 0, label: 'Hanuman Chalisa' }
  ];

  // Aarti times for notifications (Morning, Afternoon, Evening)
  private readonly aartiTimes = [
    { hour: 8, minute: 0, label: 'Morning Aarti', emoji: '🌅' },
    { hour: 13, minute: 0, label: 'Afternoon Aarti', emoji: '☀️' },
    { hour: 19, minute: 0, label: 'Evening Aarti', emoji: '🌆' }
  ];

  private isOpenSubject = new BehaviorSubject<boolean>(this.checkIfOpen());
  private nextEventSubject = new BehaviorSubject<NextEvent | null>(this.calculateNextEvent());
  private countdownSubject = new BehaviorSubject<string>('--:--:--');

  public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  public nextEventLabel$: Observable<string> = this.nextEventSubject.pipe(
    map(event => event ? event.label : 'No upcoming events'),
    distinctUntilChanged()
  );
  public countdown$: Observable<string> = this.countdownSubject.asObservable();

  constructor(private devMode: DevModeService) {
    // Update every second
    interval(1000).subscribe(() => {
      this.updateStatus();
    });
  }

  /**
   * Check if temple is currently open based on local time
   */
  private checkIfOpen(): boolean {
    // Dev mode override
    const forcedState = this.devMode.getForcedTempleOpenState();
    if (forcedState !== null) {
      return forcedState;
    }

    // Temple is always open (24/7 spiritual service)
    return true;
  }

  /**
   * Calculate the next event (chalisa - temple is always open)
   */
  private calculateNextEvent(): NextEvent | null {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Find upcoming chalisa
    const upcomingChalisa = this.chalisaTimes.find(chalisa => {
      const chalisaTimeInMinutes = chalisa.hour * 60 + chalisa.minute;
      return chalisaTimeInMinutes > currentTimeInMinutes;
    });

    let nextEventTime: Date;
    let eventLabel: string;

    if (upcomingChalisa) {
      // Next chalisa is today
      nextEventTime = this.getTimeToday(upcomingChalisa.hour, upcomingChalisa.minute);
      eventLabel = upcomingChalisa.label;
    } else {
      // Next chalisa is tomorrow at midnight
      nextEventTime = this.getTimeTomorrow(0, 0);
      eventLabel = 'Hanuman Chalisa';
    }

    return {
      type: 'chalisa',
      label: eventLabel,
      time: nextEventTime
    };
  }

  /**
   * Get a specific time today
   */
  private getTimeToday(hour: number, minute: number): Date {
    let time = new Date();
    time = setHours(time, hour);
    time = setMinutes(time, minute);
    time = setSeconds(time, 0);
    return time;
  }

  /**
   * Get a specific time tomorrow
   */
  private getTimeTomorrow(hour: number, minute: number): Date {
    let time = addDays(new Date(), 1);
    time = setHours(time, hour);
    time = setMinutes(time, minute);
    time = setSeconds(time, 0);
    return time;
  }

  /**
   * Format seconds into hh:mm:ss countdown string
   */
  private formatCountdown(seconds: number): string {
    if (seconds < 0) return '00:00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(secs)}`;
  }

  /**
   * Pad single digit numbers with leading zero
   */
  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  /**
   * Update all observables every second
   */
  private updateStatus(): void {
    const isOpen = this.checkIfOpen();
    const nextEvent = this.calculateNextEvent();

    // Update isOpen if changed
    if (this.isOpenSubject.value !== isOpen) {
      this.isOpenSubject.next(isOpen);
    }

    // Update next event
    this.nextEventSubject.next(nextEvent);

    // Calculate and update countdown
    if (nextEvent) {
      const now = new Date();
      const secondsUntilEvent = differenceInSeconds(nextEvent.time, now);
      this.countdownSubject.next(this.formatCountdown(secondsUntilEvent));
    } else {
      this.countdownSubject.next('--:--:--');
    }
  }

  /**
   * Get the current temple schedule
   */
  public getSchedule(): TempleSchedule {
    return { ...this.schedule };
  }

  /**
   * Get formatted opening time
   */
  public getOpeningTime(): string {
    return `${this.padZero(this.schedule.openHour)}:${this.padZero(this.schedule.openMinute)}`;
  }

  /**
   * Get formatted closing time
   */
  public getClosingTime(): string {
    return `${this.padZero(this.schedule.closeHour)}:${this.padZero(this.schedule.closeMinute)}`;
  }

  /**
   * Get aarti times for notifications
   */
  public getAartiTimes() {
    return [...this.aartiTimes];
  }
}
