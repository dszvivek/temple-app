import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PetalService } from '../../services/petal.service';
import { LanguageService } from '../../services/language.service';
import { DailyEngagementService } from '../../services/daily-engagement.service';

/**
 * FloatingFlowerComponent - A floating button to offer flowers on deity images
 * Shows a button in bottom-left corner that triggers flower petals
 */
@Component({
  selector: 'app-floating-flower',
  templateUrl: './floating-flower.component.html',
  styleUrls: ['./floating-flower.component.css']
})
export class FloatingFlowerComponent {
  constructor(
    private router: Router,
    private petalService: PetalService,
    public lang: LanguageService,
    private engagement: DailyEngagementService
  ) {}

  /**
   * Offer flowers - triggers petal animation
   */
  offerFlowers(): void {
    // Find deity image container or use body
    const deityImage = document.querySelector('.ganesh-frame, .hanuman-frame, .hero-image-container') as HTMLElement;
    const container = deityImage || document.body;
    
    // Trigger flower offering
    this.petalService.addOffering(container, 8);
    
    // Track engagement
    this.engagement.recordAction('flowers');
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  /**
   * Check if we're on a temple page (not on selector or donate)
   */
  shouldShow(): boolean {
    const url = this.router.url;
    return url.includes('/hanuman') || url.includes('/ganesh');
  }
}
