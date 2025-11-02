import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { format, differenceInSeconds, addDays, setHours, setMinutes, setSeconds } from 'date-fns';

export interface TempleSchedule {
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
}

export interface NextEvent {
  type: 'opening' | 'closing' | 'aarti';
  label: string;
  time: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TempleScheduleService {
  private readonly schedule: TempleSchedule = {
    openHour: 5,
    openMinute: 0,
    closeHour: 19,
    closeMinute: 0
  };

  // Aarti times (evening aarti at 7 PM when temple closes)
  private readonly aartiTimes = [
    { hour: 19, minute: 0, label: 'Evening Aarti' }
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

  constructor() {
    // Update every second
    interval(1000).subscribe(() => {
      this.updateStatus();
    });
  }

  /**
   * Check if temple is currently open based on local time
   */
  private checkIfOpen(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const openTimeInMinutes = this.schedule.openHour * 60 + this.schedule.openMinute;
    const closeTimeInMinutes = this.schedule.closeHour * 60 + this.schedule.closeMinute;

    return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
  }

  /**
   * Calculate the next event (opening, closing, or aarti)
   */
  private calculateNextEvent(): NextEvent | null {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const openTimeInMinutes = this.schedule.openHour * 60 + this.schedule.openMinute;
    const closeTimeInMinutes = this.schedule.closeHour * 60 + this.schedule.closeMinute;

    let nextEventTime: Date;
    let eventType: 'opening' | 'closing' | 'aarti';
    let eventLabel: string;

    // If temple is closed (before opening)
    if (currentTimeInMinutes < openTimeInMinutes) {
      nextEventTime = this.getTimeToday(this.schedule.openHour, this.schedule.openMinute);
      eventType = 'opening';
      eventLabel = 'Temple Opens';
    }
    // If temple is open, check for aarti or closing
    else if (currentTimeInMinutes < closeTimeInMinutes) {
      // Check if there's an upcoming aarti before closing
      const upcomingAarti = this.aartiTimes.find(aarti => {
        const aartiTimeInMinutes = aarti.hour * 60 + aarti.minute;
        return aartiTimeInMinutes > currentTimeInMinutes;
      });

      if (upcomingAarti) {
        nextEventTime = this.getTimeToday(upcomingAarti.hour, upcomingAarti.minute);
        eventType = 'aarti';
        eventLabel = upcomingAarti.label;
      } else {
        nextEventTime = this.getTimeToday(this.schedule.closeHour, this.schedule.closeMinute);
        eventType = 'closing';
        eventLabel = 'Temple Closes';
      }
    }
    // Temple is closed (after closing time)
    else {
      nextEventTime = this.getTimeTomorrow(this.schedule.openHour, this.schedule.openMinute);
      eventType = 'opening';
      eventLabel = 'Temple Opens';
    }

    return {
      type: eventType,
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
}
