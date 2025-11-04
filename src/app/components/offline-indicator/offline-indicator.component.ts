import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NetworkStatusService } from '../../services/network-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offline-indicator',
  templateUrl: './offline-indicator.component.html',
  styleUrls: ['./offline-indicator.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class OfflineIndicatorComponent implements OnInit, OnDestroy {
  isOnline = true;
  showNotification = false;
  
  private subscription?: Subscription;
  private notificationTimeout?: any;

  constructor(private networkStatusService: NetworkStatusService) {}

  ngOnInit(): void {
    this.subscription = this.networkStatusService.getOnlineStatus().subscribe(online => {
      const wasOffline = !this.isOnline;
      this.isOnline = online;

      // Show notification when status changes
      if (!online || (online && wasOffline)) {
        this.showStatusNotification();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }

  /**
   * Show temporary status notification
   */
  private showStatusNotification(): void {
    this.showNotification = true;
    
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    // Auto-hide after 5 seconds
    this.notificationTimeout = setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  /**
   * Manually close notification
   */
  closeNotification(): void {
    this.showNotification = false;
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }
}
