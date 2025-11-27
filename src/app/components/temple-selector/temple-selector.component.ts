import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeityService } from '../../services/deity.service';
import { LanguageService } from '../../services/language.service';
import { DeityType } from '../../models/deity.model';
import { Deity } from '../../models/deity.model';

@Component({
  selector: 'app-temple-selector',
  templateUrl: './temple-selector.component.html',
  styleUrls: ['./temple-selector.component.css']
})
export class TempleSelectorComponent implements OnInit {
  deities: Deity[] = [];
  DeityType = DeityType; // Expose enum to template

  constructor(
    private router: Router,
    private deityService: DeityService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.deities = this.deityService.getAllDeities();
  }

  /**
   * Select a temple and navigate to it
   */
  selectTemple(deityType: DeityType): void {
    this.deityService.setDeity(deityType);
    this.router.navigate([`/${deityType}`]);
  }

  /**
   * Get the icon for a deity
   */
  getDeityIcon(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: return '🙏';
      case DeityType.GANESH: return '🐘';
      case DeityType.SHIVA: return '🔱';
      case DeityType.KRISHNA: return '🦚';
      case DeityType.DURGA: return '🦁';
      default: return '🙏';
    }
  }

  /**
   * Get the gradient class for a deity card
   */
  getCardGradient(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: 
        return 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300';
      case DeityType.GANESH: 
        return 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300';
      case DeityType.SHIVA: 
        return 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300';
      case DeityType.KRISHNA: 
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300';
      case DeityType.DURGA: 
        return 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300';
      default: 
        return 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300';
    }
  }

  /**
   * Get the text color for a deity
   */
  getTextColor(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: return 'text-orange-800';
      case DeityType.GANESH: return 'text-amber-800';
      case DeityType.SHIVA: return 'text-indigo-800';
      case DeityType.KRISHNA: return 'text-blue-800';
      case DeityType.DURGA: return 'text-red-800';
      default: return 'text-orange-800';
    }
  }

  /**
   * Get the button class for a deity
   */
  getButtonClass(deityType: DeityType): string {
    switch (deityType) {
      case DeityType.HANUMAN: return 'bg-orange-600 hover:bg-orange-700';
      case DeityType.GANESH: return 'bg-amber-600 hover:bg-amber-700';
      case DeityType.SHIVA: return 'bg-indigo-600 hover:bg-indigo-700';
      case DeityType.KRISHNA: return 'bg-blue-600 hover:bg-blue-700';
      case DeityType.DURGA: return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-orange-600 hover:bg-orange-700';
    }
  }
}
