import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiyaService } from '../../services/diya.service';
import { LanguageService } from '../../services/language.service';
import { Diya } from '../../models/diya.model';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

/**
 * DiyaDisplayComponent - Shows all active lit diyas
 * 
 * Features:
 * - Displays diyas at bottom of darshan area
 * - Shows person's name under each diya
 * - Flickering flame animation
 * - Auto-updates when new diyas are added
 * - Stacks horizontally with wrapping
 */
@Component({
  selector: 'app-diya-display',
  templateUrl: './diya-display.component.html',
  styleUrls: ['./diya-display.component.css'],
  animations: [
    trigger('diyaListAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.8) translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          stagger(50, [
            animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DiyaDisplayComponent implements OnInit, OnDestroy {
  diyas: Diya[] = [];
  private subscription?: Subscription;

  constructor(
    public diyaService: DiyaService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    // Subscribe to diyas stream
    this.subscription = this.diyaService.diyas$.subscribe(allDiyas => {
      // Filter only active diyas
      this.diyas = this.diyaService.getActiveDiyas();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Track diyas by ID for *ngFor performance
   */
  trackByDiyaId(index: number, diya: Diya): string {
    return diya.id;
  }

  /**
   * Get time remaining text for a diya
   */
  getTimeRemaining(diya: Diya): string {
    return this.diyaService.getTimeRemainingText(diya);
  }
}
