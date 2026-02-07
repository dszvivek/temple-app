import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AudioStateService } from '../../services/audio-state.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { TempleBellService } from '../../services/temple-bell.service';
import { LanguageService } from '../../services/language.service';
import { DiyaService } from '../../services/diya.service';
import { DeityService } from '../../services/deity.service';
import { DeityType } from '../../models/deity.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ganesh-home',
  templateUrl: './ganesh-home.component.html',
  styleUrls: ['./ganesh-home.component.css']
})
export class GaneshHomeComponent implements OnInit, OnDestroy {
  isAartiPlaying = false;
  showDiyaModal = false;
  showOnboarding = false;
  private audioSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private audioStateService: AudioStateService,
    private audioPlayerService: AudioPlayerService,
    private templeBellService: TempleBellService,
    private diyaService: DiyaService,
    private deityService: DeityService,
    public lang: LanguageService
  ) {
    // Set Ganesh as the current deity
    this.deityService.setDeity(DeityType.GANESH);
    // Set language service deity context for proper translations
    this.lang.setDeityContext(DeityType.GANESH);
    
    // Check if onboarding is needed
    const onboardingComplete = localStorage.getItem('temple-onboarding-complete');
    if (!onboardingComplete) {
      this.showOnboarding = true;
    }
  }

  ngOnInit(): void {
    // Subscribe to audio playing state
    this.audioSubscription = this.audioStateService.isPlaying$.subscribe(
      isPlaying => {
        this.isAartiPlaying = isPlaying;
      }
    );

    // Handle PWA quick actions
    this.route.queryParams.subscribe(params => {
      const action = params['action'];
      if (action === 'play-aarti') {
        this.handlePlayAartiAction();
      } else if (action === 'ring-bell') {
        this.handleRingBellAction();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.audioSubscription) {
      this.audioSubscription.unsubscribe();
    }
  }

  navigateToWish(): void {
    this.router.navigate(['/ganesh/wish']);
  }

  navigateToTempleSelector(): void {
    this.router.navigate(['/']);
  }

  openDiyaModal(): void {
    this.showDiyaModal = true;
  }

  closeDiyaModal(): void {
    this.showDiyaModal = false;
  }

  onDiyaLit(name: string): void {
    // No viral share prompt - let user continue their spiritual journey
  }

  onOnboardingComplete(): void {
    this.showOnboarding = false;
  }

  /**
   * Handle PWA quick action: Play Aarti
   */
  private handlePlayAartiAction(): void {
    setTimeout(() => {
      this.audioPlayerService.playManually();
    }, 500);
  }

  /**
   * Handle PWA quick action: Ring Bell
   */
  private handleRingBellAction(): void {
    setTimeout(() => {
      this.templeBellService.ringBell();
    }, 500);
  }
}
