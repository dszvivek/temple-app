import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';

export interface Theme {
  name: 'sunrise' | 'day' | 'sunset' | 'night';
  gradient: string;
}

/**
 * ThemeService - Manages time-based theme cycling and dark mode
 * 
 * Themes:
 * - Sunrise: 5:00 - 9:00
 * - Day: 9:00 - 17:00
 * - Sunset: 17:00 - 19:00
 * - Night: 19:00 - 5:00
 * 
 * Dark Mode:
 * - Manual toggle available
 * - Auto-enable after sunset (19:00)
 * - Persists preference in localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_MODE_KEY = 'temple-dark-mode-preference';
  private readonly AUTO_DARK_HOUR = 19; // 7 PM
  private readonly AUTO_LIGHT_HOUR = 6; // 6 AM

  private readonly themes: Record<Theme['name'], string> = {
    sunrise: 'bg-gradient-to-b from-orange-200 via-pink-100 to-yellow-50',
    day: 'bg-gradient-to-b from-blue-100 via-sky-50 to-white',
    sunset: 'bg-gradient-to-b from-orange-400 via-pink-200 to-purple-100',
    night: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900'
  };

  private readonly darkThemes: Record<Theme['name'], string> = {
    sunrise: 'bg-gradient-to-b from-gray-800 via-gray-900 to-black',
    day: 'bg-gradient-to-b from-gray-800 via-gray-900 to-black',
    sunset: 'bg-gradient-to-b from-indigo-950 via-purple-950 to-black',
    night: 'bg-gradient-to-b from-gray-950 via-black to-gray-950'
  };

  private currentThemeSubject!: BehaviorSubject<Theme>;
  public currentTheme$!: Observable<Theme>;
  
  private darkModeSubject: BehaviorSubject<boolean>;
  public darkMode$: Observable<boolean>;
  private manualOverride = false;

  constructor() {
    // Load dark mode preference
    const savedDarkMode = this.loadDarkModePreference();
    const autoDarkMode = this.shouldAutoEnableDarkMode();
    const initialDarkMode = savedDarkMode !== null ? savedDarkMode : autoDarkMode;
    
    this.darkModeSubject = new BehaviorSubject<boolean>(initialDarkMode);
    this.darkMode$ = this.darkModeSubject.asObservable();
    
    // Initialize theme subject after themes are defined
    this.currentThemeSubject = new BehaviorSubject<Theme>(this.calculateTheme());
    this.currentTheme$ = this.currentThemeSubject.asObservable();
    
    // Apply dark mode class
    this.applyDarkModeClass(initialDarkMode);
    
    // Log initial theme
    const initialTheme = this.getCurrentTheme();
    console.log('🎨 ThemeService initialized:', initialTheme.name, 'at hour:', new Date().getHours(), 'Dark mode:', initialDarkMode);
    console.log('🎨 Gradient classes:', initialTheme.gradient);
    
    // Re-evaluate theme every minute
    interval(60000).subscribe(() => {
      this.updateTheme();
      if (!this.manualOverride) {
        this.checkAutoDarkMode();
      }
    });
  }

  /**
   * Calculate current theme based on local time and dark mode
   */
  private calculateTheme(): Theme {
    const hour = new Date().getHours();
    
    let themeName: Theme['name'];
    
    if (hour >= 5 && hour < 9) {
      themeName = 'sunrise';
    } else if (hour >= 9 && hour < 17) {
      themeName = 'day';
    } else if (hour >= 17 && hour < 19) {
      themeName = 'sunset';
    } else {
      themeName = 'night';
    }

    const isDark = this.darkModeSubject?.value || false;
    const gradient = isDark ? this.darkThemes[themeName] : this.themes[themeName];

    return {
      name: themeName,
      gradient
    };
  }

  /**
   * Update current theme
   */
  private updateTheme(): void {
    const newTheme = this.calculateTheme();
    console.log('🔄 Theme update check - Current:', this.currentThemeSubject.value.name, 'New:', newTheme.name);
    if (newTheme.name !== this.currentThemeSubject.value.name || newTheme.gradient !== this.currentThemeSubject.value.gradient) {
      console.log('✨ Theme changed to:', newTheme.name, 'Dark:', this.darkModeSubject.value);
      this.currentThemeSubject.next(newTheme);
    }
  }

  /**
   * Toggle dark mode manually
   */
  public toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    this.darkModeSubject.next(newValue);
    this.manualOverride = true;
    this.saveDarkModePreference(newValue);
    this.applyDarkModeClass(newValue);
    this.updateTheme();
  }

  /**
   * Get current dark mode state
   */
  public isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  /**
   * Check if dark mode should be auto-enabled
   */
  private shouldAutoEnableDarkMode(): boolean {
    const hour = new Date().getHours();
    return hour >= this.AUTO_DARK_HOUR || hour < this.AUTO_LIGHT_HOUR;
  }

  /**
   * Check and update dark mode based on time
   */
  private checkAutoDarkMode(): void {
    const shouldBeDark = this.shouldAutoEnableDarkMode();
    if (shouldBeDark !== this.darkModeSubject.value) {
      this.darkModeSubject.next(shouldBeDark);
      this.applyDarkModeClass(shouldBeDark);
      this.updateTheme();
    }
  }

  /**
   * Apply dark mode class to document
   */
  private applyDarkModeClass(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  /**
   * Load dark mode preference from localStorage
   */
  private loadDarkModePreference(): boolean | null {
    const saved = localStorage.getItem(this.DARK_MODE_KEY);
    return saved !== null ? saved === 'true' : null;
  }

  /**
   * Save dark mode preference to localStorage
   */
  private saveDarkModePreference(isDark: boolean): void {
    localStorage.setItem(this.DARK_MODE_KEY, isDark.toString());
  }

  /**
   * Get current theme
   */
  public getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  /**
   * Get current gradient classes
   */
  public getCurrentGradient(): string {
    return this.currentThemeSubject.value.gradient;
  }
}
