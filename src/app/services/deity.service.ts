/**
 * Deity Service
 * Manages deity selection and switching between temples
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Deity, DeityType } from '../models/deity.model';
import { TempleConfig } from '../models/temple.model';

@Injectable({
  providedIn: 'root'
})
export class DeityService {
  private readonly DEITY_KEY = 'selected-deity';
  
  private deities: Map<DeityType, TempleConfig> = new Map();
  
  private currentDeitySubject: BehaviorSubject<Deity>;
  public currentDeity$: Observable<Deity>;
  
  private currentTempleConfigSubject: BehaviorSubject<TempleConfig | null>;
  public currentTempleConfig$: Observable<TempleConfig | null>;

  constructor() {
    // Initialize with default deity (will be populated by configs)
    const savedDeityType = this.loadSavedDeityType();
    this.currentDeitySubject = new BehaviorSubject<Deity>(this.getDefaultDeity());
    this.currentDeity$ = this.currentDeitySubject.asObservable();
    
    this.currentTempleConfigSubject = new BehaviorSubject<TempleConfig | null>(null);
    this.currentTempleConfig$ = this.currentTempleConfigSubject.asObservable();
  }

  /**
   * Register a temple configuration
   */
  registerTemple(config: TempleConfig): void {
    this.deities.set(config.deity.id, config);
    
    // If this is the first temple or matches saved deity, set it as current
    if (this.deities.size === 1 || config.deity.id === this.loadSavedDeityType()) {
      this.setDeity(config.deity.id);
    }
  }

  /**
   * Get current deity
   */
  getCurrentDeity(): Deity {
    return this.currentDeitySubject.value;
  }

  /**
   * Get current temple configuration
   */
  getCurrentTempleConfig(): TempleConfig | null {
    return this.currentTempleConfigSubject.value;
  }

  /**
   * Set active deity
   */
  setDeity(deityType: DeityType): void {
    const config = this.deities.get(deityType);
    if (config) {
      this.currentDeitySubject.next(config.deity);
      this.currentTempleConfigSubject.next(config);
      localStorage.setItem(this.DEITY_KEY, deityType);
    } else {
      console.warn(`Temple configuration for ${deityType} not found`);
    }
  }

  /**
   * Get all available deities
   */
  getAllDeities(): Deity[] {
    return Array.from(this.deities.values()).map(config => config.deity);
  }

  /**
   * Get temple configuration for a specific deity
   */
  getTempleConfig(deityType: DeityType): TempleConfig | undefined {
    return this.deities.get(deityType);
  }

  /**
   * Check if a deity temple is registered
   */
  hasTemple(deityType: DeityType): boolean {
    return this.deities.has(deityType);
  }

  /**
   * Load saved deity from localStorage
   */
  private loadSavedDeityType(): DeityType {
    const saved = localStorage.getItem(this.DEITY_KEY) as DeityType;
    return saved || DeityType.HANUMAN; // Default to Hanuman
  }

  /**
   * Get default deity (used for initialization)
   */
  private getDefaultDeity(): Deity {
    return {
      id: DeityType.HANUMAN,
      name: 'Hanuman Ji',
      nameHindi: 'श्री हनुमान जी',
      description: 'Lord Hanuman - Symbol of Strength and Devotion',
      descriptionHindi: 'संकट मोचन हनुमान',
      icon: '🙏',
      color: 'orange',
      gradients: {
        sunrise: 'bg-gradient-to-b from-orange-200 via-pink-100 to-yellow-50',
        day: 'bg-gradient-to-b from-red-100 via-orange-50 to-white',
        sunset: 'bg-gradient-to-b from-orange-400 via-pink-200 to-purple-100',
        night: 'bg-gradient-to-b from-orange-900 via-red-900 to-gray-900'
      }
    };
  }
}
