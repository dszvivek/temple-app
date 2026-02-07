import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { DeityService } from '../../services/deity.service';
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
      
    const shareData = {
      title: this.lang.getCurrentLanguage() === 'hi' 
        ? `🚩 ${deityName} डिजिटल मंदिर 🚩` 
        : `🚩 ${deityName} Digital Temple 🚩`,
      text: this.lang.getCurrentLanguage() === 'hi'
        ? `🚩 ${deityName} का डिजिटल ई-मंदिर अब 24×7 खुला है 🚩

यह कोई भौतिक मंदिर नहीं — एक ऑनलाइन पवित्र स्थल है,
जहाँ हज़ारों भक्त हर दिन दर्शन कर रहे हैं और मनोकामनाएँ अर्पित कर रहे हैं।

यहाँ आप अपने मोबाइल से ही:
🕯️ दीया जला सकते हैं  
🔔 मंदिर की घंटी बजा सकते हैं  
🌺 फूल चढ़ा सकते हैं  
📿 अपनी मनोकामना लिखकर ${deityName} को समर्पित कर सकते हैं  
🎵 दिव्य मंत्र और आरती सुन सकते हैं  
📊 लाइव भक्त काउंटर देख सकते हैं

✅ कोई लॉगिन नहीं  
✅ कोई ऐप डाउनलोड नहीं  
✅ मनोकामनाएँ निजी रहती हैं (केवल आपके फ़ोन में)  
✅ ऑफलाइन भी काम करता है (PWA)  
✅ शुद्ध भक्ति, बिना किसी शुल्क के  

🔗 दर्शन हेतु पधारें: ${window.location.origin}
🙏 "डिजिटल मंदिर, पर भक्ति वही"  
🚩 नमस्ते`
        : `🚩 The ${deityName} Digital Temple is now open 24×7 🚩

This is not a physical temple — it is a sacred online space
created for those who wish to pray, offer devotion, and submit
their wishes from anywhere in the world.

Inside the digital temple, you can:
🕯️ Light a virtual Diya
🔔 Ring the temple bell
🌺 Offer flowers
📿 Write and offer your personal wish to ${deityName}
🎵 Listen to divine mantras and aartis
📊 See live devotee counter

✅ No login required
✅ No app to install
✅ Your wishes stay private on your own device
✅ Works offline too (PWA)
✅ 100% free — devotion only, no mandatory donation

Visit and offer your prayer: ${window.location.origin}
🙏 Namaste 🚩`,
      url: window.location.origin
    };

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
      
    const shareText = this.lang.getCurrentLanguage() === 'hi'
      ? `🚩 ${deityName} का डिजिटल ई-मंदिर अब 24×7 खुला है 🚩

यह कोई भौतिक मंदिर नहीं — एक ऑनलाइन पवित्र स्थल है,
जहाँ हज़ारों भक्त हर दिन दर्शन कर रहे हैं और मनोकामनाएँ अर्पित कर रहे हैं।

यहाँ आप अपने मोबाइल से ही:
🕯️ दीया जला सकते हैं  
🔔 मंदिर की घंटी बजा सकते हैं  
🌺 फूल चढ़ा सकते हैं  
📿 अपनी मनोकामना लिखकर ${deityName} को समर्पित कर सकते हैं  
🎵 दिव्य मंत्र और आरती सुन सकते हैं  
📊 लाइव भक्त काउंटर देख सकते हैं  

✅ कोई लॉगिन नहीं  
✅ कोई ऐप डाउनलोड नहीं  
✅ मनोकामनाएँ निजी रहती हैं (केवल आपके फ़ोन में)  
✅ ऑफलाइन भी काम करता है (PWA)  
✅ शुद्ध भक्ति, बिना किसी शुल्क के  

🔗 दर्शन हेतु पधारें: ${window.location.origin}
🙏 "डिजिटल मंदिर, पर भक्ति वही"  
🚩 नमस्ते`
      : `🚩 The ${deityName} Digital Temple is now open 24×7 🚩

This is not a physical temple — it is a sacred online space
created for those who wish to pray, offer devotion, and submit
their wishes from anywhere in the world.

Inside the digital temple, you can:
🕯️ Light a virtual Diya
🔔 Ring the temple bell
🌺 Offer flowers
📿 Write and offer your personal wish to ${deityName}
🎵 Listen to divine mantras and aartis
📊 See live devotee counter

✅ No login required
✅ No app to install
✅ Your wishes stay private on your own device
✅ Works offline too (PWA)
✅ 100% free — devotion only, no mandatory donation

Visit and offer your prayer: ${window.location.origin}
🙏 Namaste 🚩`;

    navigator.clipboard.writeText(shareText).then(() => {
      this.toastService.success(
        this.lang.getCurrentLanguage() === 'hi' 
          ? 'संदेश कॉपी हो गया! अब इसे 3 लोगों के साथ साझा करें।'
          : 'Message copied! Now share it with 3 people.'
      );
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
