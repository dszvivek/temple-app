import { Injectable } from '@angular/core';

/**
 * PetalService - Manages flower petal offerings
 * 
 * Features:
 * - Programmatic petal spawning
 * - Random petal generation (6-10 petals)
 * - Auto-cleanup after animation
 * - Event coordination
 */
@Injectable({
  providedIn: 'root'
})
export class PetalService {
  private petalColors = [
    '#FF9933', // Marigold orange
    '#FFB84D', // Light marigold
    '#FF8C1A', // Deep marigold
    '#FFA500', // Orange
    '#FFD700', // Golden
  ];

  /**
   * Add flower offering (spawn petals)
   * @param container The container element to spawn petals in
   * @param count Number of petals to spawn (default: random 6-10)
   */
  addOffering(container: HTMLElement, count?: number): void {
    const petalCount = count || this.getRandomPetalCount();
    
    for (let i = 0; i < petalCount; i++) {
      // Stagger petal creation slightly for more natural effect
      setTimeout(() => {
        this.createPetal(container);
      }, i * 50);
    }
  }

  /**
   * Create a single petal element
   */
  private createPetal(container: HTMLElement): void {
    const petal = document.createElement('div');
    petal.className = 'flower-petal';
    
    // Random starting position (top of container)
    const startX = Math.random() * container.offsetWidth;
    petal.style.left = `${startX}px`;
    petal.style.top = '-20px';
    
    // Random color from marigold palette
    const color = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
    petal.style.backgroundColor = color;
    
    // Random rotation and animation duration
    const rotation = Math.random() * 720 - 360; // -360 to 360 degrees
    const duration = 2 + Math.random() * 2; // 2-4 seconds
    const delay = Math.random() * 0.3; // 0-0.3s delay
    const horizontalDrift = (Math.random() - 0.5) * 200; // -100px to 100px
    
    // Set CSS custom properties for animation
    petal.style.setProperty('--rotation', `${rotation}deg`);
    petal.style.setProperty('--duration', `${duration}s`);
    petal.style.setProperty('--delay', `${delay}s`);
    petal.style.setProperty('--drift', `${horizontalDrift}px`);
    
    // Add petal shape
    this.stylePetal(petal);
    
    // Append to container
    container.appendChild(petal);
    
    // Remove petal after animation completes
    setTimeout(() => {
      if (petal.parentNode) {
        petal.remove();
      }
    }, (duration + delay) * 1000 + 100);
  }

  /**
   * Style the petal element to look like a marigold petal
   */
  private stylePetal(petal: HTMLElement): void {
    petal.style.width = '12px';
    petal.style.height = '20px';
    petal.style.borderRadius = '50% 50% 50% 0';
    petal.style.position = 'absolute';
    petal.style.pointerEvents = 'none';
    petal.style.opacity = '0.9';
    petal.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    petal.style.animation = `petal-fall var(--duration) var(--delay) ease-out forwards`;
    petal.style.zIndex = '9999';
  }

  /**
   * Get random petal count between 6 and 10
   */
  private getRandomPetalCount(): number {
    return Math.floor(Math.random() * 5) + 6; // 6 to 10
  }

  /**
   * Trigger offering at specific coordinates
   * Useful for click events
   */
  addOfferingAtPosition(container: HTMLElement, x: number, y: number, count?: number): void {
    const petalCount = count || this.getRandomPetalCount();
    
    for (let i = 0; i < petalCount; i++) {
      setTimeout(() => {
        this.createPetalAtPosition(container, x, y);
      }, i * 50);
    }
  }

  /**
   * Create petal at specific position
   */
  private createPetalAtPosition(container: HTMLElement, x: number, y: number): void {
    const petal = document.createElement('div');
    petal.className = 'flower-petal';
    
    // Position at click location
    const rect = container.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    
    petal.style.left = `${relativeX}px`;
    petal.style.top = `${relativeY}px`;
    
    // Random color
    const color = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
    petal.style.backgroundColor = color;
    
    // Animation properties
    const rotation = Math.random() * 720 - 360;
    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 0.2;
    const horizontalDrift = (Math.random() - 0.5) * 150;
    
    petal.style.setProperty('--rotation', `${rotation}deg`);
    petal.style.setProperty('--duration', `${duration}s`);
    petal.style.setProperty('--delay', `${delay}s`);
    petal.style.setProperty('--drift', `${horizontalDrift}px`);
    
    this.stylePetal(petal);
    container.appendChild(petal);
    
    // Auto-cleanup
    setTimeout(() => {
      if (petal.parentNode) {
        petal.remove();
      }
    }, (duration + delay) * 1000 + 100);
  }
}
