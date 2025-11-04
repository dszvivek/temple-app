import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService, Language } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  currentLang: Language;
  isDarkMode = false;
  private darkModeSubscription?: Subscription;

  constructor(
    public langService: LanguageService,
    private themeService: ThemeService
  ) {
    this.currentLang = this.langService.getCurrentLanguage();
    this.langService.language$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    this.darkModeSubscription = this.themeService.darkMode$.subscribe(dark => {
      this.isDarkMode = dark;
    });
  }

  ngOnDestroy(): void {
    if (this.darkModeSubscription) {
      this.darkModeSubscription.unsubscribe();
    }
  }

  switchLanguage(lang: Language): void {
    this.langService.setLanguage(lang);
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
