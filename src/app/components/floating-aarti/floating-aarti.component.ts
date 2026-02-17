import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { DevoteeRewardsService } from '../../services/devotee-rewards.service';
import { AudioStateService } from '../../services/audio-state.service';
import { DailyEngagementService } from '../../services/daily-engagement.service';
import { DigitalPrasadService } from '../../services/digital-prasad.service';
import { DeityService } from '../../services/deity.service';

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
  @Input() deityType: 'hanuman' | 'ganesh' | 'shiva' | 'krishna' | 'durga' = 'hanuman';
  
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
  private readonly GLOBAL_MUTE_KEY = 'temple-global-muted';

  constructor(
    private rewardsService: DevoteeRewardsService,
    private audioStateService: AudioStateService,
    private engagement: DailyEngagementService,
    private prasadService: DigitalPrasadService,
    private deityService: DeityService
  ) {}

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
    // Check if globally muted
    const isGloballyMuted = localStorage.getItem(this.GLOBAL_MUTE_KEY) === 'true';
    if (isGloballyMuted) {
      return;
    }
    
    try {
      // Try to play bell/aarti sound
      this.aartiAudio = new Audio('assets/audio/effects/mandir_bell.mp3');
      this.aartiAudio.volume = 0.5;
      this.aartiAudio.loop = true;
      this.aartiAudio.play().catch(() => {
        // Audio autoplay blocked
      });
      
      // Notify audio state service that aarti is playing
      this.audioStateService.setPlayingState(true);
    } catch (e) {
      // Audio not available
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
    
    // Track engagement
    this.engagement.recordAction('aarti');
    
    // Award digital prasad after aarti
    const deityName = this.deityService.getCurrentDeity()?.name || 'Temple';
    setTimeout(() => {
      this.prasadService.awardPrasad(deityName);
    }, 1000);
    
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
    
    // Notify audio state service that aarti stopped
    this.audioStateService.setPlayingState(false);

    this.showOverlay = false;
  }

  get progressPercent(): number {
    return Math.min((this.rotationCount / this.targetRotations) * 100, 100);
  }
}
