import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
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

  constructor(public lang: LanguageService) {
    this.loadShareCount();
  }

  loadShareCount(): void {
    const count = localStorage.getItem('temple-share-count');
    this.shareCount = count ? parseInt(count, 10) : 0;
  }

  async share(): Promise<void> {
    const shareData = {
      title: this.lang.getCurrentLanguage() === 'hi' 
        ? '🚩 श्री हनुमान डिजिटल मंदिर 🚩' 
        : '🚩 Shri Hanuman Digital Temple 🚩',
      text: this.lang.getCurrentLanguage() === 'hi'
        ? `🚩 श्री हनुमान जी का डिजिटल ई-मंदिर अब 24×7 खुला है 🚩

यह कोई भौतिक मंदिर नहीं — एक ऑनलाइन पवित्र स्थल है,
जहाँ हज़ारों भक्त हर दिन दर्शन कर रहे हैं और मनोकामनाएँ अर्पित कर रहे हैं।

यहाँ आप अपने मोबाइल से ही:
🕯️ दीया जला सकते हैं  
🔔 मंदिर की घंटी बजा सकते हैं  
� अपनी मनोकामना लिखकर श्री हनुमान जी को समर्पित कर सकते हैं  
🎵 हर घंटे श्री हनुमान चालीसा अपने-आप बजती है — दिन हो या रात  

✅ कोई लॉगिन नहीं  
✅ कोई ऐप डाउनलोड नहीं  
✅ मनोकामनाएँ निजी रहती हैं (केवल आपके फ़ोन में)  
✅ शुद्ध भक्ति, बिना किसी शुल्क के  

🔗 दर्शन हेतु पधारें: ${window.location.origin}
� "डिजिटल मंदिर, पर भक्ति वही"  
🚩 जय बजरंगबली`
        : `🚩 The Digital Hanuman Temple is now open 24×7 🚩

This is not a physical temple — it is a sacred online space
created for those who wish to pray, offer devotion, and submit
their wishes from anywhere in the world.

Inside the digital temple, you can:
🕯️ Light a virtual Diya
🔔 Ring the temple bell
📿 Write and offer your personal wish to Hanuman Ji
🎵 Listen to the Hanuman Chalisa every hour, automatically (day & night)

✅ No login required
✅ No app to install
✅ Your wishes stay private on your own device
✅ 100% free — devotion only, no mandatory donation

Visit and offer your prayer: ${window.location.origin}
🙏 Jai Bajrang Bali 🚩`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        this.incrementShareCount();
        this.shared.emit();
        setTimeout(() => this.close(), 1500);
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: Copy link to clipboard
      this.copyToClipboard();
    }
  }

  copyToClipboard(): void {
    const shareText = this.lang.getCurrentLanguage() === 'hi'
      ? `🚩 श्री हनुमान जी का डिजिटल ई-मंदिर अब 24×7 खुला है 🚩

यह कोई भौतिक मंदिर नहीं — एक ऑनलाइन पवित्र स्थल है,
जहाँ हज़ारों भक्त हर दिन दर्शन कर रहे हैं और मनोकामनाएँ अर्पित कर रहे हैं।

यहाँ आप अपने मोबाइल से ही:
🕯️ दीया जला सकते हैं  
🔔 मंदिर की घंटी बजा सकते हैं  
� अपनी मनोकामना लिखकर श्री हनुमान जी को समर्पित कर सकते हैं  
🎵 हर घंटे श्री हनुमान चालीसा अपने-आप बजती है — दिन हो या रात  

✅ कोई लॉगिन नहीं  
✅ कोई ऐप डाउनलोड नहीं  
✅ मनोकामनाएँ निजी रहती हैं (केवल आपके फ़ोन में)  
✅ शुद्ध भक्ति, बिना किसी शुल्क के  

🔗 दर्शन हेतु पधारें: ${window.location.origin}
� "डिजिटल मंदिर, पर भक्ति वही"  
🚩 जय बजरंगबली`
      : `🚩 The Digital Hanuman Temple is now open 24×7 🚩

This is not a physical temple — it is a sacred online space
created for those who wish to pray, offer devotion, and submit
their wishes from anywhere in the world.

Inside the digital temple, you can:
🕯️ Light a virtual Diya
🔔 Ring the temple bell
📿 Write and offer your personal wish to Hanuman Ji
🎵 Listen to the Hanuman Chalisa every hour, automatically (day & night)

✅ No login required
✅ No app to install
✅ Your wishes stay private on your own device
✅ 100% free — devotion only, no mandatory donation

Visit and offer your prayer: ${window.location.origin}
🙏 Jai Bajrang Bali 🚩`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert(this.lang.getCurrentLanguage() === 'hi' 
        ? 'संदेश कॉपी हो गया! अब इसे 3 लोगों के साथ साझा करें।'
        : 'Message copied! Now share it with 3 people.');
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
