import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';
import { DeityService } from './services/deity.service';
import { FirebaseBackendService } from './services/firebase-backend.service';
import { LiveStatsService } from './services/live-stats.service';
import { SeoService } from './services/seo.service';
import { HANUMAN_CONFIG } from './configs/hanuman.config';
import { GANESH_CONFIG } from './configs/ganesh.config';
import { slideInAnimation } from './animations/route-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  animations: [slideInAnimation],
  template: `
    <!-- Toast Notifications -->
    <app-toast></app-toast>
    
    <!-- Loading Screen -->
    <app-loading-screen></app-loading-screen>
    
    <!-- Offline Indicator -->
    <app-offline-indicator></app-offline-indicator>
    
    <!-- Dynamic Theme Background with Gradient -->
    <div [class]="themeClasses + ' temple-background animate-fade-in'"></div>
    
    <div class="min-h-screen flex flex-col relative z-10">
      <!-- Language Switcher (Fixed Top Right) - Only on temple selector page -->
      <div *ngIf="showLanguageSwitcher" class="fixed top-2 right-2 z-50 sm:top-3 sm:right-3 animate-slide-in-right">
        <app-language-switcher></app-language-switcher>
      </div>
      
      <!-- Install Prompt - Disabled to avoid hindering mobile view -->
      <!-- <app-install-prompt></app-install-prompt> -->
      
      <!-- Floating Action Buttons -->
      <app-floating-bell></app-floating-bell>
      <app-floating-shankh></app-floating-shankh>
      <app-floating-incense></app-floating-incense>
      <app-floating-flower></app-floating-flower>
      <app-floating-aarti></app-floating-aarti>
      
      <!-- Punya Points Display -->
      <app-punya-points-display></app-punya-points-display>
      
      <!-- Daily Spiritual Quote -->
      <app-daily-quote></app-daily-quote>
      
      <!-- Main Content -->
      <main class="flex-grow relative z-10" [@slideInAnimation]="getRouteAnimationData()">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Enhanced Footer -->
      <footer class="bg-gradient-to-r from-temple-dark via-temple-dark-soft to-temple-dark text-saffron-100 py-6 md:py-8 mt-8 md:mt-12 relative z-10 border-t-2 border-temple-gold/30">
        <div class="container mx-auto px-4 text-center">
          <p class="text-sm md:text-base mb-3 font-semibold animate-pulse-slow">
            🙏 {{ lang.getDeityGreeting() }} 🙏
          </p>
          <p class="text-xs md:text-sm opacity-90 px-2 mb-3 leading-relaxed">
            {{ lang.t('footer.description') }}
          </p>
          <p class="text-xs opacity-60 mt-2">
            {{ lang.t('footer.copyright') }}
          </p>
          <p class="text-xs opacity-50 mt-4">
            <a routerLink="/donate" 
               class="hover:opacity-100 hover:text-temple-gold transition-all duration-300 underline inline-flex items-center gap-2"
               rel="noopener noreferrer">
              <span>💝</span>
              <span>{{ lang.t('home.supportButton') }}</span>
            </a>
          </p>
        </div>
      </footer>
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
  `]
})
export class AppComponent implements OnInit {
  title = 'Manokamna';
  themeClasses = '';
  showLanguageSwitcher = true;

  constructor(
    public lang: LanguageService,
    private themeService: ThemeService,
    private deityService: DeityService,
    private firebaseBackend: FirebaseBackendService,
    private liveStats: LiveStatsService,
    private router: Router,
    private seoService: SeoService
  ) {
    // Initialize SEO service for dynamic meta tags
    this.seoService.init();
    
    // Initialize temple configurations
    this.initializeTemples();
    
    // Initialize theme immediately
    this.themeClasses = this.themeService.getCurrentGradient();
    console.log('🏛️ AppComponent initialized with theme classes:', this.themeClasses);
    
    // Initialize Firebase connection and presence tracking
    this.initializeBackend();
    
    // Listen to route changes to show/hide language switcher
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      // Show language switcher only on the temple selector page (root path)
      if (event instanceof NavigationEnd) {
        this.showLanguageSwitcher = event.url === '/' || event.url === '';
      }
    });
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
  }

  getRouteAnimationData() {
    const outlet = this.router.routerState.root.firstChild;
    return outlet?.snapshot?.data?.['animation'];
  }
}
