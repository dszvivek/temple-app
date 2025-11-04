import { Component, OnInit } from '@angular/core';
import { AssetLoaderService, LoadingProgress } from '../../services/asset-loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {
  loading$: Observable<LoadingProgress>;
  isVisible = true;
  currentMessage = '';

  private devotionalMessages = [
    '🕉️ Preparing the divine space...',
    '🪔 Lighting the sacred lamps...',
    '🙏 Invoking Lord Hanuman\'s blessings...',
    '✨ Awakening spiritual energies...',
    '🔔 Ringing the temple bells...',
    '🌺 Offering divine flowers...',
    '📿 Chanting sacred mantras...',
    '🕉️ Opening the doors of devotion...',
    '💫 Connecting to divine consciousness...',
    '🎵 Harmonizing with celestial vibrations...'
  ];

  constructor(private assetLoader: AssetLoaderService) {
    this.loading$ = this.assetLoader.loading$;
    this.currentMessage = this.getRandomMessage();
  }

  ngOnInit(): void {
    this.loadAssets();
    this.rotateMessages();
  }

  private async loadAssets(): Promise<void> {
    await this.assetLoader.preloadAssets();
    
    // Fade out animation
    setTimeout(() => {
      this.isVisible = false;
    }, 300);
  }

  private rotateMessages(): void {
    // Change message every 2 seconds while loading
    const interval = setInterval(() => {
      if (!this.isVisible) {
        clearInterval(interval);
        return;
      }
      this.currentMessage = this.getRandomMessage();
    }, 2000);
  }

  private getRandomMessage(): string {
    const randomIndex = Math.floor(Math.random() * this.devotionalMessages.length);
    return this.devotionalMessages[randomIndex];
  }
}
