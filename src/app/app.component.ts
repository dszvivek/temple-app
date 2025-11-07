import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { Router, RouterOutlet } from '@angular/router';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';
import { DeityService } from './services/deity.service';
import { FirebaseBackendService } from './services/firebase-backend.service';
import { LiveStatsService } from './services/live-stats.service';
import { HANUMAN_CONFIG } from './configs/hanuman.config';
import { GANESH_CONFIG } from './configs/ganesh.config';
import { slideInAnimation } from './animations/route-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  animations: [slideInAnimation],
  template: `
    <!-- Loading Screen -->
    <app-loading-screen></app-loading-screen>
    
    <!-- Offline Indicator -->
    <app-offline-indicator></app-offline-indicator>
    
    <!-- Dynamic Theme Background with Gradient -->
    <div [class]="themeClasses + ' temple-background'"></div>
    
    <div class="min-h-screen flex flex-col relative z-10">
      <!-- Language Switcher (Fixed Top Right) -->
      <div class="fixed top-2 right-2 z-50 sm:top-3 sm:right-3">
        <app-language-switcher></app-language-switcher>
      </div>
      
      <!-- Install Prompt - Disabled to avoid hindering mobile view -->
      <!-- <app-install-prompt></app-install-prompt> -->
      
      <!-- Developer Controls -->
      <app-dev-controls></app-dev-controls>
      
      <!-- Floating Temple Bell Button -->
      <app-floating-bell></app-floating-bell>
      
      <!-- Floating Flower Button -->
      <app-floating-flower></app-floating-flower>
      
      <!-- Main Content -->
      <main class="flex-grow relative z-10" [@slideInAnimation]="getRouteAnimationData()">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="bg-temple-dark text-saffron-100 py-4 md:py-6 mt-6 md:mt-8 relative z-10">
        <div class="container mx-auto px-4 text-center">
          <p class="text-xs md:text-sm mb-2">
            🙏 {{ lang.getDeityGreeting() }} 🙏
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
           class="fixed bottom-4 right-4 left-4 sm:left-auto bg-temple-gold text-temple-dark p-4 rounded-lg shadow-2xl max-w-sm z-50 animate-slide-up">
        <div class="flex items-start gap-3">
          <span class="text-2xl flex-shrink-0">🔄</span>
          <div class="flex-grow">
            <p class="font-bold text-base mb-1">{{ lang.t('footer.updateTitle') }}</p>
            <p class="text-sm mb-3 opacity-90">{{ lang.t('footer.updateMessage') }}</p>
            <button (click)="activateUpdate()" 
                    class="btn-primary w-full text-sm font-semibold py-2.5"
                    style="background: linear-gradient(135deg, #f97316, #ea580c); box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);">
              {{ lang.t('footer.updateButton') }}
            </button>
          </div>
        </div>
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
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      z-index: -1;
      opacity: 0.4;
      transition: background 1000ms ease-in-out;
    }

    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slide-up 0.4s ease-out;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'E-Darshan Mandir';
  updateAvailable = false;
  themeClasses = '';

  constructor(
    private swUpdate: SwUpdate,
    public lang: LanguageService,
    private themeService: ThemeService,
    private deityService: DeityService,
    private firebaseBackend: FirebaseBackendService,
    private liveStats: LiveStatsService,
    private router: Router
  ) {
    // Initialize temple configurations
    this.initializeTemples();
    
    // Initialize theme immediately
    this.themeClasses = this.themeService.getCurrentGradient();
    console.log('🏛️ AppComponent initialized with theme classes:', this.themeClasses);
    
    // Initialize Firebase connection and presence tracking
    this.initializeBackend();
  }

  /**
   * Initialize temple configurations
   */
  private initializeTemples(): void {
    // Register Hanuman Temple
    this.deityService.registerTemple(HANUMAN_CONFIG);
    console.log('🙏 Hanuman Temple registered');
    
    // Register Ganesh Temple
    this.deityService.registerTemple(GANESH_CONFIG);
    console.log('🐘 Ganesh Temple registered');
  }

  /**
   * Initialize Firebase backend and presence tracking
   */
  private initializeBackend(): void {
    // Update presence immediately
    this.firebaseBackend.updateDevoteePresence();
    
    // Monitor global stats connection
    this.firebaseBackend.getGlobalStats().subscribe(stats => {
      if (stats) {
        console.log('📊 Connected to Firebase real-time stats:', stats);
      } else {
        console.log('📴 Using offline mode - Firebase not connected');
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to deity changes to update language context
    this.deityService.currentDeity$.subscribe(deity => {
      this.lang.setDeityContext(deity.id);
      console.log('🏛️ Deity context updated in app:', deity.name);
    });
    
    // Subscribe to theme changes (re-evaluates every minute)
    this.themeService.currentTheme$.subscribe((theme) => {
      this.themeClasses = this.themeService.getCurrentGradient();
      console.log('🎨 AppComponent theme updated:', theme.name, '| Classes:', this.themeClasses);
    });

    // Listen for service worker updates
    if (this.swUpdate.isEnabled) {
      // Check for updates immediately on app load
      this.swUpdate.checkForUpdate().then(() => {
        console.log('✅ Checked for updates');
      });

      // Check for updates every 30 seconds
      setInterval(() => {
        this.swUpdate.checkForUpdate().then(() => {
          console.log('🔄 Periodic update check');
        });
      }, 30000);

      // Listen for available updates
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          console.log('🆕 New version available!');
          this.updateAvailable = true;
          
          // Auto-activate update after 3 seconds (give user time to see notification)
          setTimeout(() => {
            if (this.updateAvailable) {
              console.log('🔄 Auto-activating update...');
              this.activateUpdate();
            }
          }, 3000);
        });
    }
  }

  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      window.location.reload();
    });
  }

  getRouteAnimationData() {
    const outlet = this.router.routerState.root.firstChild;
    return outlet?.snapshot?.data?.['animation'];
  }
}
