import { Component, EventEmitter, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * OnboardingWelcomeComponent - 5-second guided welcome ritual
 * 
 * Features:
 * - Auto-plays 3-step ritual animation
 * - Each step shown for ~1.5 seconds
 * - Can skip or let it complete automatically
 * - Shows only on first visit
 */
@Component({
  selector: 'app-onboarding-welcome',
  templateUrl: './onboarding-welcome.component.html',
  styleUrls: ['./onboarding-welcome.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class OnboardingWelcomeComponent {
  @Output() complete = new EventEmitter<void>();

  currentStep = 0;
  isVisible = true;
  private stepTimeout?: any;

  constructor(public lang: LanguageService) {
    this.startRitual();
  }

  startRitual(): void {
    // Auto-advance through steps
    this.stepTimeout = setInterval(() => {
      if (this.currentStep < 2) {
        this.currentStep++;
      } else {
        this.finish();
      }
    }, 1500); // 1.5 seconds per step = 4.5 seconds total + fade time
  }

  skip(): void {
    this.finish();
  }

  finish(): void {
    if (this.stepTimeout) {
      clearInterval(this.stepTimeout);
    }
    this.isVisible = false;
    
    // Mark onboarding as complete in localStorage
    localStorage.setItem('temple-onboarding-complete', 'true');
    
    setTimeout(() => {
      this.complete.emit();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.stepTimeout) {
      clearInterval(this.stepTimeout);
    }
  }
}
