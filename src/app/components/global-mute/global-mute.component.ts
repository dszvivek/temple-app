import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmbientAudioService } from '../../services/ambient-audio.service';
import { AudioPlayerService } from '../../services/audio-player.service';

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
      position: fixed;
      top: 20px;
      right: 20px;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 225, 0.98));
      border: 2px solid rgba(249, 115, 22, 0.2);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(12px);
    }

    .global-mute-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(249, 115, 22, 0.2);
    }

    .global-mute-btn:active {
      transform: scale(0.95);
    }

    .global-mute-btn.muted {
      background: linear-gradient(135deg, rgba(200, 200, 200, 0.98), rgba(180, 180, 180, 0.98));
      border-color: rgba(150, 150, 150, 0.3);
    }

    .mute-icon {
      font-size: 1.4rem;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .global-mute-btn {
        width: 42px;
        height: 42px;
        top: 16px;
        right: 16px;
      }

      .mute-icon {
        font-size: 1.2rem;
      }
    }
  `]
})
export class GlobalMuteComponent {
  isMuted = false;
  private readonly GLOBAL_MUTE_KEY = 'temple-global-muted';

  constructor(
    private ambientAudio: AmbientAudioService,
    private audioPlayer: AudioPlayerService
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
  }
}
