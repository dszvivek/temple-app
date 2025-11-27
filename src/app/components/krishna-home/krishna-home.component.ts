import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeityType } from '../../models/deity.model';
import { DeityService } from '../../services/deity.service';
import { LanguageService } from '../../services/language.service';
import { AudioStateService } from '../../services/audio-state.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { TempleBellService } from '../../services/temple-bell.service';
import { DiyaService } from '../../services/diya.service';

@Component({
  selector: 'app-krishna-home',
  templateUrl: './krishna-home.component.html',
  styleUrls: ['./krishna-home.component.css']
})
export class KrishnaHomeComponent implements OnInit, OnDestroy {
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
    // Set Krishna as the current deity
    this.deityService.setDeity(DeityType.KRISHNA);
    // Set language service deity context for proper translations
    this.lang.setDeityContext(DeityType.KRISHNA);
    
    // Check if onboarding is needed
    const onboardingComplete = localStorage.getItem('temple-onboarding-complete');
    if (!onboardingComplete) {
      this.showOnboarding = true;
    }
  }

  ngOnInit(): void {
    // Subscribe to audio playing state
    this.audioSubscription = this.audioStateService.isPlaying$.subscribe(
      (isPlaying: boolean) => {
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

  navigateToTempleSelector(): void {
    this.router.navigate(['/']);
  }

  navigateToWish(): void {
    this.router.navigate(['/krishna/wish']);
  }

  openDiyaModal(): void {
    this.showDiyaModal = true;
  }

  closeDiyaModal(): void {
    this.showDiyaModal = false;
  }

  onDiyaLit(name: string): void {
    console.log(`Diya lit for: ${name}`);
  }

  onOnboardingComplete(): void {
    this.showOnboarding = false;
  }

  private handlePlayAartiAction(): void {
    setTimeout(() => {
      this.audioPlayerService.playManually();
    }, 500);
  }

  private handleRingBellAction(): void {
    setTimeout(() => {
      this.templeBellService.ringBell();
    }, 500);
  }
}
