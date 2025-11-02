import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DevModeConfig {
  enabled: boolean;
  overrideTempleOpen: boolean;
  forceTempleOpen: boolean;
  overrideHourlyChalisa: boolean;
  forceChalisaPlay: boolean;
  overrideScheduler: boolean;
  triggerScheduledChants: boolean;
  showDebugInfo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DevModeService {
  private readonly DEV_MODE_KEY = 'temple_dev_mode';
  
  private configSubject = new BehaviorSubject<DevModeConfig>({
    enabled: false,
    overrideTempleOpen: false,
    forceTempleOpen: true,
    overrideHourlyChalisa: false,
    forceChalisaPlay: false,
    overrideScheduler: false,
    triggerScheduledChants: false,
    showDebugInfo: false
  });

  public config$: Observable<DevModeConfig> = this.configSubject.asObservable();

  constructor() {
    this.loadConfig();
    
    // Add global keyboard shortcut: Ctrl+Shift+D to toggle dev mode
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.toggleDevMode();
        }
      });
    }
  }

  /**
   * Load dev mode config from localStorage
   */
  private loadConfig(): void {
    try {
      const stored = localStorage.getItem(this.DEV_MODE_KEY);
      if (stored) {
        const config = JSON.parse(stored);
        this.configSubject.next(config);
      }
    } catch (error) {
      console.error('Error loading dev mode config:', error);
    }
  }

  /**
   * Save config to localStorage
   */
  private saveConfig(config: DevModeConfig): void {
    try {
      localStorage.setItem(this.DEV_MODE_KEY, JSON.stringify(config));
      this.configSubject.next(config);
    } catch (error) {
      console.error('Error saving dev mode config:', error);
    }
  }

  /**
   * Get current config
   */
  public getConfig(): DevModeConfig {
    return this.configSubject.value;
  }

  /**
   * Toggle dev mode on/off
   */
  public toggleDevMode(): void {
    const current = this.configSubject.value;
    this.saveConfig({
      ...current,
      enabled: !current.enabled
    });
    console.log(`🔧 Dev Mode: ${!current.enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Enable dev mode
   */
  public enableDevMode(): void {
    const current = this.configSubject.value;
    if (!current.enabled) {
      this.saveConfig({ ...current, enabled: true });
      console.log('🔧 Dev Mode: ENABLED');
    }
  }

  /**
   * Disable dev mode
   */
  public disableDevMode(): void {
    const current = this.configSubject.value;
    if (current.enabled) {
      this.saveConfig({ ...current, enabled: false });
      console.log('🔧 Dev Mode: DISABLED');
    }
  }

  /**
   * Update specific config option
   */
  public updateConfig(updates: Partial<DevModeConfig>): void {
    const current = this.configSubject.value;
    this.saveConfig({ ...current, ...updates });
  }

  /**
   * Check if dev mode is enabled
   */
  public isDevMode(): boolean {
    return this.configSubject.value.enabled;
  }

  /**
   * Check if temple open override is active
   */
  public isTempleOpenOverrideActive(): boolean {
    const config = this.configSubject.value;
    return config.enabled && config.overrideTempleOpen;
  }

  /**
   * Get forced temple open state (only if override is active)
   */
  public getForcedTempleOpenState(): boolean | null {
    if (this.isTempleOpenOverrideActive()) {
      return this.configSubject.value.forceTempleOpen;
    }
    return null;
  }

  /**
   * Check if scheduler override is active
   */
  public isSchedulerOverrideActive(): boolean {
    const config = this.configSubject.value;
    return config.enabled && config.overrideScheduler;
  }

  /**
   * Check if hourly Chalisa override is active
   */
  public isHourlyChalisaOverrideActive(): boolean {
    const config = this.configSubject.value;
    return config.enabled && config.overrideHourlyChalisa;
  }

  /**
   * Get forced Chalisa play state (only if override is active)
   */
  public getForcedChalisaPlayState(): boolean | null {
    if (this.isHourlyChalisaOverrideActive()) {
      return this.configSubject.value.forceChalisaPlay;
    }
    return null;
  }

  /**
   * Check if should trigger scheduled chants
   */
  public shouldTriggerScheduledChants(): boolean {
    const config = this.configSubject.value;
    return config.enabled && config.triggerScheduledChants;
  }

  /**
   * Reset to default settings
   */
  public resetToDefaults(): void {
    this.saveConfig({
      enabled: false,
      overrideTempleOpen: false,
      forceTempleOpen: true,
      overrideHourlyChalisa: false,
      forceChalisaPlay: false,
      overrideScheduler: false,
      triggerScheduledChants: false,
      showDebugInfo: false
    });
    console.log('🔧 Dev Mode: Reset to defaults');
  }

  /**
   * Log dev mode status
   */
  public logStatus(): void {
    const config = this.configSubject.value;
    console.group('🔧 Dev Mode Status');
    console.log('Enabled:', config.enabled);
    console.log('Override Temple Open:', config.overrideTempleOpen);
    console.log('Force Temple Open:', config.forceTempleOpen);
    console.log('Override Scheduler:', config.overrideScheduler);
    console.log('Show Debug Info:', config.showDebugInfo);
    console.groupEnd();
  }
}
