import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';

export interface Theme {
  name: 'sunrise' | 'day' | 'sunset' | 'night';
  gradient: string;
}

/**
 * ThemeService - Manages time-based theme cycling
 * 
 * Themes:
 * - Sunrise: 5:00 - 9:00
 * - Day: 9:00 - 17:00
 * - Sunset: 17:00 - 19:00
 * - Night: 19:00 - 5:00
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themes: Record<Theme['name'], string> = {
    sunrise: 'bg-gradient-to-b from-orange-200 via-pink-100 to-yellow-50',
    day: 'bg-gradient-to-b from-blue-100 via-sky-50 to-white',
    sunset: 'bg-gradient-to-b from-orange-400 via-pink-200 to-purple-100',
    night: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900'
  };

  private currentThemeSubject!: BehaviorSubject<Theme>;
  public currentTheme$!: Observable<Theme>;

  constructor() {
    // Initialize theme subject after themes are defined
    this.currentThemeSubject = new BehaviorSubject<Theme>(this.calculateTheme());
    this.currentTheme$ = this.currentThemeSubject.asObservable();
    
    // Log initial theme
    const initialTheme = this.getCurrentTheme();
    console.log('🎨 ThemeService initialized:', initialTheme.name, 'at hour:', new Date().getHours());
    console.log('🎨 Gradient classes:', initialTheme.gradient);
    
    // Re-evaluate theme every minute
    interval(60000).subscribe(() => {
      this.updateTheme();
    });
  }

  /**
   * Calculate current theme based on local time
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

    return {
      name: themeName,
      gradient: this.themes[themeName]
    };
  }

  /**
   * Update current theme
   */
  private updateTheme(): void {
    const newTheme = this.calculateTheme();
    console.log('🔄 Theme update check - Current:', this.currentThemeSubject.value.name, 'New:', newTheme.name);
    if (newTheme.name !== this.currentThemeSubject.value.name) {
      console.log('✨ Theme changed to:', newTheme.name);
      this.currentThemeSubject.next(newTheme);
    }
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
