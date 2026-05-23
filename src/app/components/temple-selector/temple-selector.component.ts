import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeityService } from '../../services/deity.service';
import { LanguageService } from '../../services/language.service';
import { SmartShareService } from '../../services/smart-share.service';
import { DailyEngagementService } from '../../services/daily-engagement.service';
import { ProductAnalyticsService } from '../../services/product-analytics.service';
import { WishPractice, WishPracticeService } from '../../services/wish-practice.service';
import { DeityType } from '../../models/deity.model';
import { Deity } from '../../models/deity.model';

@Component({
  selector: 'app-temple-selector',
  templateUrl: './temple-selector.component.html',
  styleUrls: ['./temple-selector.component.css']
})
export class TempleSelectorComponent implements OnInit, OnDestroy {
  deities: Deity[] = [];
  todaysDeityType = DeityType.HANUMAN;
  todaysDeity?: Deity;
  activePractice: WishPractice | null = null;
  DeityType = DeityType; // Expose enum to template
  private practiceSub?: Subscription;

  constructor(
    private router: Router,
    private deityService: DeityService,
    public lang: LanguageService,
    private shareService: SmartShareService,
    private engagement: DailyEngagementService,
    private analytics: ProductAnalyticsService,
    private wishPractice: WishPracticeService
  ) {}

  ngOnInit(): void {
    this.deities = this.deityService.getAllDeities();
    this.todaysDeityType = this.getRecommendedDeity();
    this.todaysDeity = this.deities.find(deity => deity.id === this.todaysDeityType);
    this.practiceSub = this.wishPractice.practice$.subscribe(practice => {
      this.activePractice = practice;
    });
  }

  ngOnDestroy(): void {
    this.practiceSub?.unsubscribe();
  }

  /**
   * Select a temple and navigate to it
   */
  selectTemple(deityType: DeityType, entryPoint = 'temple_card'): void {
    this.analytics.track('temple_selected', {
      deity: deityType,
      entryPoint
    });
    this.deityService.setDeity(deityType);
    this.router.navigate([`/${deityType}`]);
  }

  startTodaysDarshan(): void {
    this.analytics.track('daily_darshan_started', {
      deity: this.todaysDeityType,
      entryPoint: 'home_primary_cta'
    });
    this.selectTemple(this.todaysDeityType, 'home_primary_cta');
  }

  startTodaysWish(): void {
    this.analytics.track('wish_started', {
      deity: this.todaysDeityType,
      entryPoint: 'home_daily_loop'
    });
    this.deityService.setDeity(this.todaysDeityType);
    this.router.navigate([`/${this.todaysDeityType}/wish`]);
  }

  continueSankalp(): void {
    if (!this.activePractice) {
      return;
    }

    this.wishPractice.completeToday();
    this.analytics.track('ritual_action', {
      action: 'sankalp_continue_clicked',
      deity: this.activePractice.deityId,
      currentDay: this.getSankalpDay()
    });
    this.router.navigate([`/${this.activePractice.deityId}`]);
  }

  renewSankalp(): void {
    const renewed = this.wishPractice.renewPractice();
    if (!renewed) {
      return;
    }

    this.router.navigate([`/${renewed.deityId}`]);
  }

  getSankalpDay(): number {
    return this.wishPractice.getCurrentDay(this.activePractice);
  }

  getSankalpProgress(): number {
    if (!this.activePractice) {
      return 0;
    }
    return Math.round((this.getSankalpDay() / this.activePractice.totalDays) * 100);
  }

  needsSankalpToday(): boolean {
    return this.wishPractice.needsTodayPractice(this.activePractice);
  }

  getDailyRitualTitle(): string {
    return this.lang.getCurrentLanguage() === 'hi'
      ? 'आज का छोटा दर्शन'
      : "Today's Simple Darshan";
  }

  getDailyRitualSubtitle(): string {
    const deityName = this.lang.getCurrentLanguage() === 'hi'
      ? this.todaysDeity?.nameHindi
      : this.todaysDeity?.name;

    return this.lang.getCurrentLanguage() === 'hi'
      ? `${deityName || 'भगवान'} के साथ 2 मिनट की साधना`
      : `A 2-minute practice with ${deityName || 'the deity'}`;
  }

  getDailyRitualSteps(): string[] {
    return this.lang.getCurrentLanguage() === 'hi'
      ? ['घंटी बजाएं', 'दीया जलाएं', 'मनोकामना करें']
      : ['Ring the bell', 'Light a diya', 'Make a wish'];
  }

  getTodaysDeityName(): string {
    return this.lang.getCurrentLanguage() === 'hi'
      ? this.todaysDeity?.nameHindi || 'आज का देवता'
      : this.todaysDeity?.name || "Today's deity";
  }

  private getRecommendedDeity(): DeityType {
    const day = new Date().getDay();
    switch (day) {
      case 1: return DeityType.SHIVA;
      case 2: return DeityType.HANUMAN;
      case 3: return DeityType.GANESH;
      case 4: return DeityType.KRISHNA;
      case 5: return DeityType.DURGA;
      case 6: return DeityType.HANUMAN;
      default: return DeityType.GANESH;
    }
  }

  /**
   * Get the icon for a deity
   */
  getDeityIcon(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: return '🙏';
      case DeityType.GANESH: return '🐘';
      case DeityType.SHIVA: return '🔱';
      case DeityType.KRISHNA: return '🦚';
      case DeityType.DURGA: return '🦁';
      default: return '🙏';
    }
  }

  /**
   * Get the gradient class for a deity card
   */
  getCardGradient(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: 
        return 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300';
      case DeityType.GANESH: 
        return 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300';
      case DeityType.SHIVA: 
        return 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300';
      case DeityType.KRISHNA: 
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300';
      case DeityType.DURGA: 
        return 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300';
      default: 
        return 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300';
    }
  }

  /**
   * Get the text color for a deity
   */
  getTextColor(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: return 'text-orange-800';
      case DeityType.GANESH: return 'text-amber-800';
      case DeityType.SHIVA: return 'text-indigo-800';
      case DeityType.KRISHNA: return 'text-blue-800';
      case DeityType.DURGA: return 'text-red-800';
      default: return 'text-orange-800';
    }
  }

  /**
   * Get the button class for a deity
   */
  getButtonClass(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: return 'bg-orange-600 hover:bg-orange-700';
      case DeityType.GANESH: return 'bg-amber-600 hover:bg-amber-700';
      case DeityType.SHIVA: return 'bg-indigo-600 hover:bg-indigo-700';
      case DeityType.KRISHNA: return 'bg-blue-600 hover:bg-blue-700';
      case DeityType.DURGA: return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-orange-600 hover:bg-orange-700';
    }
  }

  /**
   * Share app via WhatsApp
   */
  shareApp(): void {
    this.shareService.shareOnWhatsApp();
  }
}
