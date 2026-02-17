import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioPlayerService } from '../../services/audio-player.service';
import { LanguageService } from '../../services/language.service';
import { AartiNotificationService } from '../../services/aarti-notification.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  
  constructor(
    public audioService: AudioPlayerService,
    public lang: LanguageService,
    public notificationService: AartiNotificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // Service is already initialized
  }

  /**
   * Enable audio (must be called by user gesture)
   */
  enableAudio(): void {
    this.audioService.enableAudio();
    this.toast.success('🎵 Audio enabled! Devotional chants ready to play');
  }

  /**
   * Change volume
   */
  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value);
    this.audioService.setVolume(volume);
  }

  /**
   * Toggle manual playback
   */
  togglePlayback(): void {
    this.audioService.toggleManualPlayback();
    if (this.audioService.isPlaying) {
      this.toast.info(`🙏 ${this.audioService.getAudioName()} playing...`);
    } else {
      this.toast.info('⏸️ Playback paused');
    }
  }

  /**
   * Toggle mute/unmute
   */
  toggleMute(): void {
    this.audioService.toggleMute();
  }

  /**
   * Toggle aarti notifications
   */
  async toggleNotifications(): Promise<void> {
    await this.notificationService.toggleNotifications();
  }

  ngOnDestroy(): void {
    // Service persists, don't destroy it
  }
}
