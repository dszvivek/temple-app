import { Directive, ElementRef, HostListener } from '@angular/core';
import { PetalService } from '../services/petal.service';

/**
 * FlowerOfferingDirective
 * 
 * Usage: Add [flowerOffering] to any container element
 * 
 * Features:
 * - Spawns 6-10 marigold petals on click
 * - Petals fall with random rotation and easing
 * - Uses CSS keyframes for performance
 * - Auto-cleans DOM after animation ends
 * - Optimized with requestAnimationFrame
 * 
 * Example:
 * <div class="darshan-container" flowerOffering>
 *   <!-- content -->
 * </div>
 */
@Directive({
  selector: '[flowerOffering]'
})
export class FlowerOfferingDirective {
  private animationFrameId?: number;

  constructor(
    private el: ElementRef<HTMLElement>,
    private petalService: PetalService
  ) {
    // Ensure container has relative positioning for absolute petals
    this.setupContainer();
  }

  /**
   * Setup container for petal positioning
   */
  private setupContainer(): void {
    const element = this.el.nativeElement;
    const position = window.getComputedStyle(element).position;
    
    if (position === 'static') {
      element.style.position = 'relative';
    }
    
    // Ensure overflow is visible for petals
    element.style.overflow = 'visible';
  }

  /**
   * Handle click events - spawn petals at click location
   */
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();
    
    // Use requestAnimationFrame for better performance
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.spawnPetalsAtClick(event);
    });
  }

  /**
   * Spawn petals at click position
   */
  private spawnPetalsAtClick(event: MouseEvent): void {
    const container = this.el.nativeElement;
    const x = event.clientX;
    const y = event.clientY;
    
    // Use petal service to create offering
    this.petalService.addOfferingAtPosition(container, x, y);
  }

  /**
   * Cleanup on directive destroy
   */
  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
