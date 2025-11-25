import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { DevoteeRewardsService } from '../../services/devotee-rewards.service';

@Component({
  selector: 'app-floating-aarti',
  templateUrl: './floating-aarti.component.html',
  styleUrls: ['./floating-aarti.component.css'],
  animations: [
    trigger('overlayFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FloatingAartiComponent implements OnInit, OnDestroy {
  @Input() deityType: 'hanuman' | 'ganesh' = 'hanuman';
  
  showOverlay = false;
  isPerforming = false;
  rotationCount = 0;
  targetRotations = 7;
  isComplete = false;
  currentRotation = 0;
  
  // Flames for thali
  flames = [0, 1, 2, 3, 4];
  
  // Audio
  private aartiAudio: HTMLAudioElement | null = null;
  private rotationInterval: any;

  constructor(private rewardsService: DevoteeRewardsService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopAarti();
  }

  startAarti(): void {
    if (this.isPerforming) return;
    
    this.showOverlay = true;
    this.isPerforming = true;
    this.rotationCount = 0;
    this.currentRotation = 0;
    this.isComplete = false;
    
    // Play aarti audio
    this.playAartiAudio();
    
    // Start auto-rotation - like real aarti swinging
    this.startAutoRotation();
  }

  private startAutoRotation(): void {
    // Rotate the thali automatically - simulating real aarti motion
    // Each rotation cycle takes ~2 seconds (clockwise swing)
    this.rotationInterval = setInterval(() => {
      if (!this.isPerforming || this.isComplete) return;
      
      // Swing motion: rotate back and forth like real aarti
      this.currentRotation += 360;
      this.rotationCount++;
      
      if (this.rotationCount >= this.targetRotations) {
        this.completeAarti();
      }
    }, 2000); // 2 seconds per rotation
  }

  private playAartiAudio(): void {
    try {
      // Try to play bell/aarti sound
      this.aartiAudio = new Audio('assets/audio/temple_bell.mp3');
      this.aartiAudio.volume = 0.5;
      this.aartiAudio.loop = true;
      this.aartiAudio.play().catch(() => {
        console.log('Audio autoplay blocked');
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }

  private completeAarti(): void {
    this.isComplete = true;
    this.isPerforming = false;
    
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }
    
    // Award points
    this.rewardsService.recordAartiPerformed();
    
    // Auto close after showing completion
    setTimeout(() => {
      this.stopAarti();
    }, 2500);
  }

  stopAarti(): void {
    this.isPerforming = false;
    
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }

    if (this.aartiAudio) {
      this.aartiAudio.pause();
      this.aartiAudio = null;
    }

    this.showOverlay = false;
  }

  get progressPercent(): number {
    return Math.min((this.rotationCount / this.targetRotations) * 100, 100);
  }
}
