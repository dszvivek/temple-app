import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { LanguageService } from './services/language.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <!-- Loading Screen -->
    <app-loading-screen></app-loading-screen>
    
    <!-- Temple Background -->
    <div class="temple-background"></div>
    
    <div class="min-h-screen flex flex-col relative">
      <!-- Language Switcher (Fixed Top Right) -->
      <div class="fixed top-2 right-2 z-50 sm:top-3 sm:right-3">
        <app-language-switcher></app-language-switcher>
      </div>
      
      <!-- Install Prompt -->
      <app-install-prompt></app-install-prompt>
      
      <!-- Developer Controls -->
      <app-dev-controls></app-dev-controls>
      
      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="bg-temple-dark text-saffron-100 py-4 md:py-6 mt-6 md:mt-8">
        <div class="container mx-auto px-4 text-center">
          <p class="text-xs md:text-sm mb-2">
            🙏 {{ lang.t('footer.jaiHanuman') }} 🙏
          </p>
          <p class="text-xs opacity-75 px-2">
            {{ lang.t('footer.description') }}
          </p>
          <p class="text-xs opacity-50 mt-2">
            {{ lang.t('footer.copyright') }}
          </p>
          <p class="text-xs opacity-40 mt-3">
            <a routerLink="/donate" 
               class="hover:opacity-100 transition-opacity underline"
               rel="noopener noreferrer">
              {{ lang.t('home.supportButton') }}
            </a>
          </p>
        </div>
      </footer>
      
      <!-- Update Notification -->
      <div *ngIf="updateAvailable" 
           class="fixed bottom-4 right-4 left-4 sm:left-auto bg-temple-gold text-temple-dark p-3 md:p-4 rounded-lg shadow-2xl max-w-sm z-50">
        <p class="font-semibold mb-1 md:mb-2 text-sm md:text-base">{{ lang.t('footer.updateTitle') }}</p>
        <p class="text-xs md:text-sm mb-2 md:mb-3">{{ lang.t('footer.updateMessage') }}</p>
        <button (click)="activateUpdate()" 
                class="btn-primary w-full text-xs md:text-sm"
                style="padding: 0.5rem 1rem;">
          {{ lang.t('footer.updateButton') }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .temple-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('/assets/images/temple-background.svg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      z-index: -1;
      opacity: 0.95;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Karunamayi Hanuman E-Mandir';
  updateAvailable = false;

  constructor(
    private swUpdate: SwUpdate,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    // Listen for service worker updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          this.updateAvailable = true;
        });
    }
  }

  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      window.location.reload();
    });
  }
}
