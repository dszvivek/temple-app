import { Component, OnInit, OnDestroy } from '@angular/core';
import { TempleScheduleService } from '../../services/temple-schedule.service';
import { Subscription } from 'rxjs';

/**
 * FloatingIncenseComponent - Floating agarbatti (incense) button
 * 
 * Features:
 * - Circular button with incense icon
 * - Creates animated smoke effect on screen when clicked
 * - Auto-hides when temple is closed
 * - Positioned above shankh button
 */
@Component({
  selector: 'app-floating-incense',
  templateUrl: './floating-incense.component.html',
  styleUrls: ['./floating-incense.component.css']
})
export class FloatingIncenseComponent implements OnInit, OnDestroy {
  isVisible = true; // Always visible for now
  isActive = false;
  smokeParticles: SmokeParticle[] = [];
  incenseSticks = [1, 2, 3, 4, 5]; // Five incense sticks
  private subscription?: Subscription;
  private smokeInterval?: any;

  constructor(private scheduleService: TempleScheduleService) {}

  ngOnInit(): void {
    // Keep visible at all times - temple schedule check disabled for testing
    // Subscribe to temple open/close status
    // this.subscription = this.scheduleService.isOpen$.subscribe(isOpen => {
    //   this.isVisible = isOpen;
    //   if (!isOpen && this.isActive) {
    //     this.stopIncense();
    //   }
    // });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.stopIncense();
  }

  /**
   * Toggle incense smoke effect
   */
  toggleIncense(): void {
    if (this.isActive) {
      this.stopIncense();
    } else {
      this.startIncense();
    }
    
    // Trigger vibration on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }

  /**
   * Start the incense smoke animation
   */
  private startIncense(): void {
    this.isActive = true;
    this.generateSmoke();
    
    // Generate new smoke particles every 350ms (continuous smoke from all 5 sticks)
    this.smokeInterval = setInterval(() => {
      this.generateSmoke();
    }, 350);
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (this.isActive) {
        this.stopIncense();
      }
    }, 30000);
  }

  /**
   * Stop the incense smoke animation
   */
  private stopIncense(): void {
    this.isActive = false;
    if (this.smokeInterval) {
      clearInterval(this.smokeInterval);
      this.smokeInterval = null;
    }
    
    // Clear particles after animation completes
    setTimeout(() => {
      this.smokeParticles = [];
    }, 5000);
  }

  /**
   * Generate smoke particles from incense sticks at deity position (center bottom)
   * Smoke follows the swaying motion of the incense holder
   */
  private generateSmoke(): void {
    // Calculate current sway position based on time (matches holder-sway animation)
    const time = Date.now() / 1000; // seconds
    const swayAmount = Math.sin(time * Math.PI / 2) * 1.5; // -1.5% to +1.5% sway
    
    // Create 2-3 smoke particles per generation
    const particleCount = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < particleCount; i++) {
      // Random variance around center, following the sway
      const centerPercent = 50 + swayAmount;
      const variance = (Math.random() - 0.5) * 8; // ±4% for spread across 5 sticks
      
      const particle: SmokeParticle = {
        id: Date.now() + Math.random(),
        leftPercent: centerPercent + variance,
        bottom: 125, // Start from incense stick height
        animationDuration: 8 + Math.random() * 3, // 8-11 seconds for graceful rise
        delay: Math.random() * 0.8
      };
      
      this.smokeParticles.push(particle);
      
      // Remove particle after animation completes
      setTimeout(() => {
        this.smokeParticles = this.smokeParticles.filter(p => p.id !== particle.id);
      }, (particle.animationDuration + particle.delay) * 1000);
    }
    
    // Limit total particles to prevent performance issues
    if (this.smokeParticles.length > 25) {
      this.smokeParticles = this.smokeParticles.slice(-25);
    }
  }

  /**
   * Track particles for ngFor performance
   */
  trackParticle(index: number, particle: SmokeParticle): number {
    return particle.id;
  }
}

interface SmokeParticle {
  id: number;
  leftPercent: number; // percentage position from left (centered around 50%)
  bottom: number; // px position from bottom
  animationDuration: number;
  delay: number;
}
