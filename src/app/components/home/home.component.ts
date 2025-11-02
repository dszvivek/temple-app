import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AudioStateService } from '../../services/audio-state.service';
import { LanguageService } from '../../services/language.service';
import { DiyaService } from '../../services/diya.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isChalisaPlaying = false;
  showDiyaModal = false;
  showOnboarding = false;
  showViralShare = false;
  private audioSubscription?: Subscription;

  constructor(
    private router: Router,
    private audioStateService: AudioStateService,
    private diyaService: DiyaService,
    public lang: LanguageService
  ) {
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
        this.isChalisaPlaying = isPlaying;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.audioSubscription) {
      this.audioSubscription.unsubscribe();
    }
  }

  navigateToWish(): void {
    this.router.navigate(['/wish']);
  }

  openDiyaModal(): void {
    this.showDiyaModal = true;
  }

  closeDiyaModal(): void {
    this.showDiyaModal = false;
  }

  onDiyaLit(name: string): void {
    console.log(`Diya lit for: ${name}`);
    // Show viral share prompt after lighting diya
    setTimeout(() => {
      this.showViralShare = true;
    }, 500);
  }

  onOnboardingComplete(): void {
    this.showOnboarding = false;
  }

  onViralShareClose(): void {
    this.showViralShare = false;
  }

  onViralShared(): void {
    console.log('User shared the temple!');
  }
}
