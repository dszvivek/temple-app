import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AudioStateService } from '../../services/audio-state.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isChalisaPlaying = false;
  private audioSubscription?: Subscription;

  constructor(
    private router: Router,
    private audioStateService: AudioStateService,
    public lang: LanguageService
  ) {}

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
}
