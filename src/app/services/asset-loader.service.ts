import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingProgress {
  total: number;
  loaded: number;
  percentage: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetLoaderService {
  private loadingSubject = new BehaviorSubject<LoadingProgress>({
    total: 0,
    loaded: 0,
    percentage: 0,
    message: 'Initializing...'
  });
  
  public loading$ = this.loadingSubject.asObservable();
  private isComplete = false;

  constructor() {}

  /**
   * Preload all critical assets
   */
  async preloadAssets(): Promise<void> {
    const assets = [
      // Images
      'assets/images/hanuman-main.png',
      'assets/images/hanuman-deity.svg',
      'assets/images/temple-background.svg',
      'assets/images/diya-lamp.svg',
      'assets/images/temple-bell.svg',
      'assets/images/prasad.svg',
      'assets/images/incense.svg',
      
      // Audio files (only Hanuman Chalisa)
      'assets/audio/hanuman-chalisa.mp3'
    ];

    const total = assets.length;
    let loaded = 0;

    this.updateProgress(total, loaded, 'Loading temple assets...');

    const loadPromises = assets.map(async (assetPath) => {
      try {
        if (assetPath.endsWith('.mp3')) {
          await this.preloadAudio(assetPath);
        } else {
          await this.preloadImage(assetPath);
        }
        loaded++;
        const percentage = Math.round((loaded / total) * 100);
        this.updateProgress(total, loaded, `Loading... ${percentage}%`);
      } catch (error) {
        console.warn(`Failed to load ${assetPath}:`, error);
        loaded++;
        this.updateProgress(total, loaded, `Loading... ${Math.round((loaded / total) * 100)}%`);
      }
    });

    await Promise.all(loadPromises);
    
    // Small delay to show 100% before hiding
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.updateProgress(total, loaded, 'Ready!');
    this.isComplete = true;
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  private preloadAudio(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => resolve(), { once: true });
      audio.addEventListener('error', () => reject(new Error(`Failed to load audio: ${src}`)), { once: true });
      audio.src = src;
      audio.load();
    });
  }

  private updateProgress(total: number, loaded: number, message: string): void {
    const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
    this.loadingSubject.next({
      total,
      loaded,
      percentage,
      message
    });
  }

  public isLoadingComplete(): boolean {
    return this.isComplete;
  }
}
