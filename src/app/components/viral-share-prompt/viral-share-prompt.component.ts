import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { DeityService } from '../../services/deity.service';
import { SmartShareService } from '../../services/smart-share.service';
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * ViralSharePromptComponent - Encourage users to share with 3 devotees
 * 
 * Features:
 * - Shows after lighting a diya or making a wish
 * - Native Web Share API
 * - Tracks share count
 * - Can skip or share
 */
@Component({
  selector: 'app-viral-share-prompt',
  templateUrl: './viral-share-prompt.component.html',
  styleUrls: ['./viral-share-prompt.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ViralSharePromptComponent {
  @Input() isOpen = false;
  @Output() closePrompt = new EventEmitter<void>();
  @Output() shared = new EventEmitter<void>();

  shareCount = 0;

  constructor(
    public lang: LanguageService,
    private deityService: DeityService,
    private shareService: SmartShareService,
    private toastService: ToastService
  ) {
    this.loadShareCount();
  }

  loadShareCount(): void {
    const count = localStorage.getItem('temple-share-count');
    this.shareCount = count ? parseInt(count, 10) : 0;
  }

  async share(): Promise<void> {
    const currentDeity = this.deityService.getCurrentDeity();
    const deityName = this.lang.getCurrentLanguage() === 'hi' 
      ? currentDeity.nameHindi 
      : currentDeity.name;
    const shareData = this.shareService.getTempleInviteShareData(deityName);

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        this.incrementShareCount();
        this.shared.emit();
        setTimeout(() => this.close(), 1500);
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      // Fallback: Copy link to clipboard
      this.copyToClipboard();
    }
  }

  copyToClipboard(): void {
    const currentDeity = this.deityService.getCurrentDeity();
    const deityName = this.lang.getCurrentLanguage() === 'hi' 
      ? currentDeity.nameHindi 
      : currentDeity.name;
    const shareData = this.shareService.getTempleInviteShareData(deityName);
    const shareText = `${shareData.text}\n\n${shareData.url}`;

    navigator.clipboard.writeText(shareText).then(() => {
      this.toastService.success(this.shareService.getTempleInviteCopiedMessage());
      this.incrementShareCount();
      this.shared.emit();
    });
  }

  incrementShareCount(): void {
    this.shareCount++;
    localStorage.setItem('temple-share-count', this.shareCount.toString());
  }

  skip(): void {
    this.close();
  }

  close(): void {
    this.isOpen = false;
    this.closePrompt.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
