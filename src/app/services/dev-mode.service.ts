import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * DevModeService
 * Provides development/debug utilities for testing features.
 * In production, all dev features are disabled.
 */
export interface DevConfig {
  enabled: boolean;
  triggerScheduledChants: boolean;
  showDebugInfo: boolean;
  skipOnboarding: boolean;
  fastAnimations: boolean;
}

const DEFAULT_CONFIG: DevConfig = {
  enabled: false,
  triggerScheduledChants: false,
  showDebugInfo: false,
  skipOnboarding: false,
  fastAnimations: false
};

@Injectable({
  providedIn: 'root'
})
export class DevModeService {
  private readonly DEV_KEY = 'temple_dev_mode';
  private config: DevConfig = { ...DEFAULT_CONFIG };
  private configSubject = new BehaviorSubject<DevConfig>(this.config);
  
  public config$ = this.configSubject.asObservable();

  constructor() {
    this.loadConfig();
  }

  /**
   * Load dev config from localStorage
   */
  private loadConfig(): void {
    try {
      const stored = localStorage.getItem(this.DEV_KEY);
      if (stored) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
        this.configSubject.next(this.config);
      }
    } catch {
      // Use defaults
    }
  }

  /**
   * Check if dev mode is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Check if scheduled chants should be triggered (dev override)
   */
  shouldTriggerScheduledChants(): boolean {
    return this.config.enabled && this.config.triggerScheduledChants;
  }

  /**
   * Update dev config
   */
  updateConfig(updates: Partial<DevConfig>): void {
    this.config = { ...this.config, ...updates };
    this.configSubject.next(this.config);
    try {
      localStorage.setItem(this.DEV_KEY, JSON.stringify(this.config));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Enable dev mode
   */
  enable(): void {
    this.updateConfig({ enabled: true });
  }

  /**
   * Disable dev mode
   */
  disable(): void {
    this.updateConfig({ ...DEFAULT_CONFIG });
  }

  /**
   * Check if debug info should be shown
   */
  showDebugInfo(): boolean {
    return this.config.enabled && this.config.showDebugInfo;
  }
}
