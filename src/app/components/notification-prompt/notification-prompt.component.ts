import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';

/**
 * NotificationPromptComponent - Gentle push notification opt-in
 * 
 * Shows after 3rd visit when user hasn't enabled notifications.
 * Uses spiritual framing to increase opt-in rates.
 */
@Component({
  selector: 'app-notification-prompt',
  template: `
    <div class="notif-prompt" *ngIf="visible" @fadeSlide>
      <div class="notif-content">
        <div class="notif-icon">🔔</div>
        <div class="notif-text">
          <p class="notif-title">
            {{ isHindi 
              ? '🙏 रोज़ सुबह आरती का अलर्ट पाएं' 
              : '🙏 Get daily morning aarti alerts' }}
          </p>
          <p class="notif-desc">
            {{ isHindi
              ? 'सुबह और शाम की आरती, त्योहार, और विशेष दिनों की याद दिलाने दें'
              : 'Get reminders for morning & evening aarti, festivals, and special days' }}
          </p>
        </div>
      </div>
      <div class="notif-actions">
        <button class="notif-btn enable" (click)="enableNotifications()">
          {{ isHindi ? '✅ हाँ, याद दिलाएं' : '✅ Yes, remind me' }}
        </button>
        <button class="notif-btn later" (click)="dismiss()">
          {{ isHindi ? 'बाद में' : 'Later' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notif-prompt {
      position: fixed;
      bottom: 80px;
      left: 12px;
      right: 12px;
      max-width: 400px;
      margin: 0 auto;
      background: linear-gradient(135deg, #fffbeb, #fef3c7);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      z-index: 999;
      animation: slideUp 0.4s ease-out;
    }
    
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .notif-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .notif-icon {
      font-size: 1.8rem;
      flex-shrink: 0;
      animation: bellRing 2s ease-in-out infinite;
    }
    
    @keyframes bellRing {
      0%, 80%, 100% { transform: rotate(0); }
      5%, 15% { transform: rotate(8deg); }
      10%, 20% { transform: rotate(-8deg); }
    }
    
    .notif-text {
      flex: 1;
    }
    
    .notif-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #7c2d12;
      margin: 0 0 4px 0;
    }
    
    .notif-desc {
      font-size: 0.72rem;
      color: #9a3412;
      margin: 0;
      line-height: 1.4;
    }
    
    .notif-actions {
      display: flex;
      gap: 8px;
    }
    
    .notif-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 10px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .notif-btn:active {
      transform: scale(0.97);
    }
    
    .notif-btn.enable {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: white;
    }
    
    .notif-btn.later {
      background: rgba(0, 0, 0, 0.05);
      color: #9a3412;
    }
  `]
})
export class NotificationPromptComponent implements OnInit {
  visible = false;
  
  private readonly DISMISS_KEY = 'temple_notif_dismissed';
  private readonly VISIT_COUNT_KEY = 'temple_visit_count';
  
  get isHindi(): boolean {
    return this.lang.getCurrentLanguage() === 'hi';
  }

  constructor(public lang: LanguageService) {}

  ngOnInit(): void {
    this.checkShouldShow();
  }

  private checkShouldShow(): void {
    // Don't show if notifications already granted
    if ('Notification' in window && Notification.permission === 'granted') {
      return;
    }
    
    // Don't show if dismissed recently (within 7 days)
    const dismissed = localStorage.getItem(this.DISMISS_KEY);
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }
    
    // Track visit count
    let visits = parseInt(localStorage.getItem(this.VISIT_COUNT_KEY) || '0', 10);
    visits++;
    localStorage.setItem(this.VISIT_COUNT_KEY, visits.toString());
    
    // Show after 3rd visit
    if (visits >= 3) {
      setTimeout(() => {
        this.visible = true;
      }, 5000); // Show after 5 seconds of browsing
    }
  }

  async enableNotifications(): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Show a welcome notification
        new Notification('🙏 Manokamna', {
          body: this.lang.getCurrentLanguage() === 'hi' 
            ? 'अब आपको रोज़ आरती और त्योहार की याद मिलेगी!' 
            : 'You will now receive daily aarti and festival reminders!',
          icon: '/assets/icons/pwa/icon-192x192.png'
        });
      }
    }
    this.visible = false;
  }

  dismiss(): void {
    localStorage.setItem(this.DISMISS_KEY, new Date().toISOString());
    this.visible = false;
  }
}
