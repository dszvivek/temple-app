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
    return deityType === DeityType.HANUMAN ? '🙏' : '🐘';
  }

  /**
   * Get the gradient class for a deity card
   */
  getCardGradient(deityType: DeityType): string {
    return deityType === DeityType.HANUMAN 
      ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'
      : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300';
  }

  /**
   * Get the text color for a deity
   */
  getTextColor(deityType: DeityType): string {
    return deityType === DeityType.HANUMAN 
      ? 'text-orange-800'
      : 'text-amber-800';
  }

  /**
   * Get the button class for a deity
   */
  getButtonClass(deityType: DeityType): string {
    return deityType === DeityType.HANUMAN 
      ? 'bg-orange-600 hover:bg-orange-700'
      : 'bg-amber-600 hover:bg-amber-700';
  }
}
