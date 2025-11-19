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
   * Preload only critical assets - defer heavy media files
   */
  async preloadAssets(): Promise<void> {
    const assets = [
      // Only preload critical small images and SVGs
      'assets/images/temple/temple-background.svg',
      'assets/images/offerings/diya-lamp.svg',
      'assets/images/temple/temple-bell.svg',
      'assets/images/offerings/prasad.svg',
      'assets/images/offerings/incense.svg',
      
      // Defer large images - they'll load on demand
      // 'assets/images/deities/hanuman/hanuman-main.png', // 1.7MB
      // 'assets/images/deities/ganesh/Ganesh.png', // 2.5MB
      
      // Defer audio files - they'll load on demand when user plays them
      // 'assets/audio/mantras/hanuman-chalisa.mp3', // 11.7MB
      // 'assets/audio/aarti/ganesh-aarti.mp3' // 2.3MB
    ];

    const total = assets.length;
    let loaded = 0;

    this.updateProgress(total, loaded, 'Loading temple assets...');

    const loadPromises = assets.map(async (assetPath) => {
      try {
        if (assetPath.endsWith('.mp3') || assetPath.endsWith('.wav')) {
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
    
    // Shorter delay since we're loading less
    await new Promise(resolve => setTimeout(resolve, 200));
    
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
