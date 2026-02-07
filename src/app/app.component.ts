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
import { SHIVA_CONFIG } from './configs/shiva.config';
import { KRISHNA_CONFIG } from './configs/krishna.config';
import { DURGA_CONFIG } from './configs/durga.config';
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
    
    <div class="app-container">
      <!-- ========== FIXED TOP HEADER BAR ========== -->
      <header class="top-header-bar">
        <div class="header-content">
          <!-- Left: Language Switcher -->
          <div class="header-left">
            <app-language-switcher></app-language-switcher>
          </div>
          
          <!-- Center: Punya Points -->
          <div class="header-center">
            <app-punya-points-display></app-punya-points-display>
          </div>
          
          <!-- Right: Global Mute -->
          <div class="header-right">
            <app-global-mute></app-global-mute>
          </div>
        </div>
      </header>
      
      <!-- ========== MAIN SCROLLABLE CONTENT ========== -->
      <main class="main-content" [@slideInAnimation]="getRouteAnimationData()">
        <!-- Daily Spiritual Quote -->
        <app-daily-quote></app-daily-quote>
        
        <router-outlet></router-outlet>
        
        <!-- Enhanced Footer -->
        <footer class="app-footer">
          <div class="footer-content">
            <p class="footer-greeting">
              🙏 {{ lang.getDeityGreeting() }} 🙏
            </p>
            <p class="footer-description">
              {{ lang.t('footer.description') }}
            </p>
            <p class="footer-copyright">
              © {{ currentYear }} Manokamna | Open Source PWA
            </p>
            <p class="footer-donate">
              <a routerLink="/donate" class="donate-link">
                <span>💝</span>
                <span>{{ lang.t('home.supportButton') }}</span>
              </a>
            </p>
          </div>
        </footer>
      </main>
      
      <!-- ========== FIXED BOTTOM ACTION BAR ========== -->
      <nav class="bottom-action-bar" *ngIf="isInsideTemple">
        <div class="action-bar-content">
          <!-- Left Actions -->
          <div class="action-group action-left">
            <app-floating-bell></app-floating-bell>
            <app-floating-shankh></app-floating-shankh>
          </div>
          
          <!-- Center: Main Actions (Aarti + Incense) -->
          <div class="action-center">
            <app-floating-incense></app-floating-incense>
            <app-floating-aarti></app-floating-aarti>
          </div>
          
          <!-- Right Actions -->
          <div class="action-group action-right">
            <app-floating-flower></app-floating-flower>
          </div>
        </div>
      </nav>
      
      <!-- Simpler bottom bar for non-temple pages -->
      <nav class="bottom-action-bar bottom-bar-simple" *ngIf="!isInsideTemple">
        <div class="action-bar-content">
          <app-floating-bell></app-floating-bell>
          <app-floating-shankh></app-floating-shankh>
          <app-floating-flower></app-floating-flower>
        </div>
      </nav>
    </div>
  `,
  styles: [`
    /* ========== APP CONTAINER ========== */
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 10;
    }
    
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
    
    /* ========== FIXED TOP HEADER BAR ========== */
    .top-header-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      z-index: 1000;
      background: linear-gradient(135deg, 
        rgba(255, 248, 225, 0.95), 
        rgba(255, 237, 213, 0.95));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 2px solid rgba(249, 115, 22, 0.15);
      box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 8px;
      max-width: 100%;
      gap: 8px;
    }
    
    .header-left,
    .header-right {
      flex: 0 0 auto;
    }
    
    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
      overflow: hidden;
      min-width: 0;
    }
    
    /* ========== MAIN CONTENT AREA ========== */
    .main-content {
      flex: 1;
      padding-top: 68px; /* Header height + gap */
      padding-bottom: 80px; /* Bottom bar height + gap */
      position: relative;
      z-index: 10;
    }
    
    /* ========== FIXED BOTTOM ACTION BAR ========== */
    .bottom-action-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 72px;
      z-index: 1000;
      background: linear-gradient(135deg, 
        rgba(255, 248, 225, 0.98), 
        rgba(255, 237, 213, 0.98));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 2px solid rgba(249, 115, 22, 0.15);
      box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08);
    }
    
    .action-bar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 16px;
      max-width: 480px;
      margin: 0 auto;
    }
    
    .action-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .action-center {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    
    .action-left,
    .action-right {
      flex: 1;
    }
    
    .action-left {
      justify-content: flex-start;
    }
    
    .action-right {
      justify-content: flex-end;
    }
    
    /* Simple bottom bar for non-temple pages */
    .bottom-bar-simple .action-bar-content {
      justify-content: center;
      gap: 16px;
    }
    
    /* ========== FOOTER ========== */
    .app-footer {
      background: linear-gradient(to right, 
        rgba(30, 20, 10, 0.95), 
        rgba(45, 30, 15, 0.95), 
        rgba(30, 20, 10, 0.95));
      color: #fef3c7;
      padding: 24px 16px;
      margin-top: 32px;
      border-top: 2px solid rgba(251, 191, 36, 0.3);
    }
    
    .footer-content {
      max-width: 640px;
      margin: 0 auto;
      text-align: center;
    }
    
    .footer-greeting {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 12px;
      animation: pulse 2s infinite;
    }
    
    .footer-description {
      font-size: 0.75rem;
      opacity: 0.9;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    
    .footer-copyright {
      font-size: 0.75rem;
      opacity: 0.6;
      margin-bottom: 8px;
    }
    
    .footer-donate {
      margin-top: 16px;
    }
    
    .donate-link {
      font-size: 0.75rem;
      opacity: 0.5;
      text-decoration: underline;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }
    
    .donate-link:hover {
      opacity: 1;
      color: #fbbf24;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    /* ========== MOBILE RESPONSIVE ========== */
    @media (max-width: 480px) {
      .top-header-bar {
        height: 54px;
      }
      
      .header-content {
        padding: 0 8px;
      }
      
      .main-content {
        padding-top: 60px;
        padding-bottom: 76px;
      }
      
      .bottom-action-bar {
        height: 68px;
      }
      
      .action-bar-content {
        padding: 0 10px;
        gap: 6px;
      }
      
      .action-group {
        gap: 6px;
      }
      
      .app-footer {
        padding: 20px 12px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Manokamna';
  themeClasses = '';
  isInsideTemple = false; // Track if user is inside a temple page
  currentYear = new Date().getFullYear();

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
    
    // Initialize Firebase connection and presence tracking
    this.initializeBackend();
    
    // Listen to route changes to control UI elements
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        
        // Show aarti/incense only inside temple pages
        this.isInsideTemple = url.includes('/hanuman') || url.includes('/ganesh') || 
                               url.includes('/shiva') || url.includes('/krishna') || 
                               url.includes('/durga');
      }
    });
  }

  /**
   * Initialize temple configurations
   */
  private initializeTemples(): void {
    // Register Hanuman Temple
    this.deityService.registerTemple(HANUMAN_CONFIG);
    
    // Register Ganesh Temple
    this.deityService.registerTemple(GANESH_CONFIG);
    
    // Register Shiva Temple
    this.deityService.registerTemple(SHIVA_CONFIG);
    
    // Register Krishna Temple
    this.deityService.registerTemple(KRISHNA_CONFIG);
    
    // Register Durga Temple
    this.deityService.registerTemple(DURGA_CONFIG);
  }

  /**
   * Initialize Firebase backend and presence tracking
   */
  private initializeBackend(): void {
    // Update presence immediately
    this.firebaseBackend.updateDevoteePresence();
    
    // Monitor global stats connection
    this.firebaseBackend.getGlobalStats().subscribe(stats => {
      // Stats connected or using offline mode
    });
  }

  ngOnInit(): void {
    // Subscribe to deity changes to update language and theme context
    this.deityService.currentDeity$.subscribe(deity => {
      this.lang.setDeityContext(deity.id);
      this.themeService.setDeity(deity.id);
    });
    
    // Subscribe to theme changes (re-evaluates every minute)
    this.themeService.currentTheme$.subscribe((theme) => {
      this.themeClasses = this.themeService.getCurrentGradient();
    });
  }

  getRouteAnimationData() {
    const outlet = this.router.routerState.root.firstChild;
    return outlet?.snapshot?.data?.['animation'];
  }
}
