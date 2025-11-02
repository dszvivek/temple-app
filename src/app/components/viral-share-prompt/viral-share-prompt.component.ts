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
        ? '�✨ श्री हनुमान वर्चुअल मंदिर दर्शन सूचना ✨🚩' 
        : '� Shri Hanuman Virtual Temple 🔥',
      text: this.lang.getCurrentLanguage() === 'hi'
        ? `🚩✨ श्री हनुमान वर्चुअल मंदिर दर्शन सूचना ✨🚩

अब आप अपने मोबाइल / कंप्यूटर से:

🪔 श्री हनुमान जी के चरणों में *दीया प्रज्ज्वलित कर सकते हैं*
🔔 डिजिटल मन्दिर में घंटा बजा सकते हैं
🙏 अपनी मनोकामना लिखकर समर्पित कर सकते हैं
🕯️ वर्चुअल पूजा एवं अर्पण कर सकते हैं
🎵 प्रत्येक घड़ी श्री हनुमान चालीसा का श्रवण कर सकते हैं (५ AM – ७ PM)

✅ कोई पंजीकरण आवश्यक नहीं
✅ कोई शुल्क नहीं – पूर्णतः निःशुल्क सेवा
✅ मनोकामनाएँ आपके उपकरण में ही सुरक्षित रहती हैं

🔗 दर्शन हेतु पधारें: ${window.location.origin}
🕉️ "संकट मोचन हनुमान अंजनि सुता" 🚩`
        : `A temple experience… but online.
Now you can *light a real-time virtual diya* in front of Hanuman Ji,
offer your wish, ring the bell, and listen to Hanuman Chalisa every hour.

No app. No login. Just pure devotion.

Enter the digital mandir → ${window.location.origin}
Jai Bajrang Bali 🚩🔥🪔`,
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
      ? `🚩✨ श्री हनुमान वर्चुअल मंदिर दर्शन सूचना ✨🚩

अब आप अपने मोबाइल / कंप्यूटर से:

🪔 श्री हनुमान जी के चरणों में *दीया प्रज्ज्वलित कर सकते हैं*
🔔 डिजिटल मन्दिर में घंटा बजा सकते हैं
🙏 अपनी मनोकामना लिखकर समर्पित कर सकते हैं
🕯️ वर्चुअल पूजा एवं अर्पण कर सकते हैं
🎵 प्रत्येक घड़ी श्री हनुमान चालीसा का श्रवण कर सकते हैं (५ AM – ७ PM)

✅ कोई पंजीकरण आवश्यक नहीं
✅ कोई शुल्क नहीं – पूर्णतः निःशुल्क सेवा
✅ मनोकामनाएँ आपके उपकरण में ही सुरक्षित रहती हैं

🔗 दर्शन हेतु पधारें: ${window.location.origin}
🕉️ "संकट मोचन हनुमान अंजनि सुता" 🚩`
      : `A temple experience… but online.
Now you can *light a real-time virtual diya* in front of Hanuman Ji,
offer your wish, ring the bell, and listen to Hanuman Chalisa every hour.

No app. No login. Just pure devotion.

Enter the digital mandir → ${window.location.origin}
Jai Bajrang Bali 🚩🔥🪔`;

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
