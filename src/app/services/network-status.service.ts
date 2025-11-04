import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    this.initializeNetworkListeners();
  }

  /**
   * Get online status as observable
   */
  getOnlineStatus(): Observable<boolean> {
    return this.online$.asObservable();
  }

  /**
   * Get current online status
   */
  isOnline(): boolean {
    return this.online$.value;
  }

  /**
   * Initialize network event listeners
   */
  private initializeNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false))
      ).subscribe(status => {
        this.online$.next(status);
      });
    }
  }
}
