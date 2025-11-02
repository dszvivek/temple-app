import { Component } from '@angular/core';
import { LanguageService, Language } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  currentLang: Language;

  constructor(public langService: LanguageService) {
    this.currentLang = this.langService.getCurrentLanguage();
    this.langService.language$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  switchLanguage(lang: Language): void {
    this.langService.setLanguage(lang);
  }
}
