import { Injectable } from '@angular/core';

/**
 * PetalService - Manages flower offerings with actual flower images
 * 
 * Features:
 * - Programmatic flower spawning (roses and marigolds)
 * - Random flower generation (5-8 flowers)
 * - Auto-cleanup after animation
 * - Beautiful rotating fall animation
 */
@Injectable({
  providedIn: 'root'
})
export class PetalService {
  private flowers = [
    { emoji: '🌹', name: 'rose', colors: ['#FF1744', '#E91E63', '#C2185B'] },
    { emoji: '🌺', name: 'hibiscus', colors: ['#FF5252', '#FF4081', '#F50057'] },
    { emoji: '🏵️', name: 'marigold', colors: ['#FF9800', '#FFB300', '#FFA000'] },
    { emoji: '🌼', name: 'daisy', colors: ['#FFEB3B', '#FDD835', '#FBC02D'] },
    { emoji: '🌸', name: 'cherry', colors: ['#FFB6C1', '#FFC0CB', '#FFE4E1'] }
  ];

  /**
   * Add flower offering (spawn flowers)
   * @param container The container element to spawn flowers in
   * @param count Number of flowers to spawn (default: random 5-8)
   */
  addOffering(container: HTMLElement, count?: number): void {
    const flowerCount = count || this.getRandomFlowerCount();
    
    for (let i = 0; i < flowerCount; i++) {
      // Stagger flower creation slightly for more natural effect
      setTimeout(() => {
        this.createFlower(container);
      }, i * 80);
    }
  }

  /**
   * Create a single flower element
   */
  private createFlower(container: HTMLElement): void {
    const flower = document.createElement('div');
    flower.className = 'falling-flower';
    
    // Random flower type
    const flowerType = this.flowers[Math.floor(Math.random() * this.flowers.length)];
    flower.textContent = flowerType.emoji;
    
    // Random starting position (top of container)
    const startX = Math.random() * container.offsetWidth;
    flower.style.left = `${startX}px`;
    flower.style.top = '-50px';
    
    // Random rotation and animation properties
    const rotation = Math.random() * 1080 - 540; // -540 to 540 degrees (multiple spins)
    const duration = 2.5 + Math.random() * 2; // 2.5-4.5 seconds
    const delay = Math.random() * 0.3; // 0-0.3s delay
    const horizontalDrift = (Math.random() - 0.5) * 250; // -125px to 125px
    const swingAmplitude = 20 + Math.random() * 30; // 20-50px swing
    
    // Set CSS custom properties for animation
    flower.style.setProperty('--rotation', `${rotation}deg`);
    flower.style.setProperty('--duration', `${duration}s`);
    flower.style.setProperty('--delay', `${delay}s`);
    flower.style.setProperty('--drift', `${horizontalDrift}px`);
    flower.style.setProperty('--swing', `${swingAmplitude}px`);
    
    // Add flower styling
    this.styleFlower(flower);
    
    // Append to container
    container.appendChild(flower);
    
    // Remove flower after animation completes
    setTimeout(() => {
      if (flower.parentNode) {
        flower.remove();
      }
    }, (duration + delay) * 1000 + 100);
  }

  /**
   * Style the flower element
   */
  private styleFlower(flower: HTMLElement): void {
    flower.style.fontSize = '32px'; // Larger size for visibility
    flower.style.position = 'absolute';
    flower.style.pointerEvents = 'none';
    flower.style.opacity = '0.95';
    flower.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
    flower.style.animation = `flower-fall var(--duration) var(--delay) ease-out forwards`;
    flower.style.zIndex = '9999';
    flower.style.userSelect = 'none';
  }

  /**
   * Get random flower count between 5 and 8
   */
  private getRandomFlowerCount(): number {
    return Math.floor(Math.random() * 4) + 5; // 5 to 8
  }

  /**
   * Trigger offering at specific coordinates
   * Useful for click events
   */
  addOfferingAtPosition(container: HTMLElement, x: number, y: number, count?: number): void {
    const flowerCount = count || this.getRandomFlowerCount();
    
    for (let i = 0; i < flowerCount; i++) {
      setTimeout(() => {
        this.createFlowerAtPosition(container, x, y);
      }, i * 80);
    }
  }

  /**
   * Create flower at specific position
   */
  private createFlowerAtPosition(container: HTMLElement, x: number, y: number): void {
    const flower = document.createElement('div');
    flower.className = 'falling-flower';
    
    // Random flower type
    const flowerType = this.flowers[Math.floor(Math.random() * this.flowers.length)];
    flower.textContent = flowerType.emoji;
    
    // Position at click location
    const rect = container.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    
    flower.style.left = `${relativeX}px`;
    flower.style.top = `${relativeY}px`;
    
    // Animation properties with more natural movement
    const rotation = Math.random() * 1080 - 540; // Multiple spins
    const duration = 2.5 + Math.random() * 2;
    const delay = Math.random() * 0.2;
    const horizontalDrift = (Math.random() - 0.5) * 200;
    const swingAmplitude = 20 + Math.random() * 30;
    
    flower.style.setProperty('--rotation', `${rotation}deg`);
    flower.style.setProperty('--duration', `${duration}s`);
    flower.style.setProperty('--delay', `${delay}s`);
    flower.style.setProperty('--drift', `${horizontalDrift}px`);
    flower.style.setProperty('--swing', `${swingAmplitude}px`);
    
    this.styleFlower(flower);
    container.appendChild(flower);
    
    // Auto-cleanup
    setTimeout(() => {
      if (flower.parentNode) {
        flower.remove();
      }
    }, (duration + delay) * 1000 + 100);
  }
}
