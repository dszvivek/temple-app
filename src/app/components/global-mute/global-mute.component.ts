import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmbientAudioService } from '../../services/ambient-audio.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { TempleBellService } from '../../services/temple-bell.service';

@Component({
  selector: 'app-global-mute',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="global-mute-btn"
      [class.muted]="isMuted"
      (click)="toggleMute()"
      [attr.aria-label]="isMuted ? 'Unmute all sounds' : 'Mute all sounds'"
      title="{{ isMuted ? 'Unmute' : 'Mute' }}">
      <span class="mute-icon">{{ isMuted ? '🔇' : '🔊' }}</span>
    </button>
  `,
  styles: [`
    .global-mute-btn {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(249, 115, 22, 0.1);
      border: 2px solid transparent;
      box-shadow: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: none;
    }

    .global-mute-btn:hover {
      transform: scale(1.1);
      background: rgba(249, 115, 22, 0.2);
      border-color: rgba(249, 115, 22, 0.3);
    }

    .global-mute-btn:active {
      transform: scale(0.95);
    }

    .global-mute-btn.muted {
      background: rgba(150, 150, 150, 0.2);
      border-color: rgba(150, 150, 150, 0.3);
    }

    .mute-icon {
      font-size: 1.2rem;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .global-mute-btn {
        width: 36px;
        height: 36px;
      }

      .mute-icon {
        font-size: 1rem;
      }
    }
  `]
})
export class GlobalMuteComponent {
  isMuted = false;
  private readonly GLOBAL_MUTE_KEY = 'temple-global-muted';

  constructor(
    private ambientAudio: AmbientAudioService,
    private audioPlayer: AudioPlayerService,
    private templeBell: TempleBellService
  ) {
    // Load saved mute state
    const savedMute = localStorage.getItem(this.GLOBAL_MUTE_KEY);
    this.isMuted = savedMute === 'true';
    
    // Apply initial state
    if (this.isMuted) {
      this.muteAll();
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    localStorage.setItem(this.GLOBAL_MUTE_KEY, this.isMuted.toString());

    if (this.isMuted) {
      this.muteAll();
    } else {
      this.unmuteAll();
    }
  }

  private muteAll(): void {
    // Mute ambient audio
    if (!this.ambientAudio.isMuted()) {
      this.ambientAudio.setMute(true);
    }
    
    // Mute main audio player
    if (!this.audioPlayer.isMuted) {
      this.audioPlayer.toggleMute();
    }
    
    // Mute temple bell
    this.templeBell.mute();
  }

  private unmuteAll(): void {
    // Unmute ambient audio
    if (this.ambientAudio.isMuted()) {
      this.ambientAudio.setMute(false);
    }
    
    // Unmute main audio player
    if (this.audioPlayer.isMuted) {
      this.audioPlayer.toggleMute();
    }
    
    // Unmute temple bell
    this.templeBell.unmute();
  }
}
