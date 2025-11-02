import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WishService } from '../../services/wish.service';
import { LanguageService } from '../../services/language.service';
import { AmbientAudioService } from '../../services/ambient-audio.service';
import { PetalService } from '../../services/petal.service';
import { BlessingsService, Blessing } from '../../services/blessings.service';
import { Wish, WishCategory, WishStatus } from '../../models/wish.model';

@Component({
  selector: 'app-wish-flow',
  templateUrl: './wish-flow.component.html',
  styleUrls: ['./wish-flow.component.css']
})
export class WishFlowComponent {
  step: 'create' | 'ritual' | 'share' | 'complete' = 'create';
  
  // Wish creation form
  wishTitle = '';
  wishDescription = '';
  selectedCategory: WishCategory = WishCategory.GENERAL;
  offeringType = 'Prasad';

  // Ritual interaction tracking
  bellTaps = 0;
  chantCount = 0;
  requiredBellTaps = 5;
  requiredChants = 11;
  isRitualComplete = false;
  showOfferingAnimation = false;
  fallingOfferings: any[] = [];
  
  // Share tracking
  hasShared = false;

  // Current wish being processed
  currentWish?: Wish;
  
  // Blessing message
  currentBlessing?: Blessing;

  // Categories for selection
  categories = [
    { value: WishCategory.HEALTH, label: '🏥 Health & Wellness', icon: '🏥' },
    { value: WishCategory.PROSPERITY, label: '💰 Prosperity & Wealth', icon: '💰' },
    { value: WishCategory.EDUCATION, label: '📚 Education & Knowledge', icon: '📚' },
    { value: WishCategory.FAMILY, label: '👨‍👩‍👧 Family & Relationships', icon: '👨‍👩‍👧' },
    { value: WishCategory.CAREER, label: '💼 Career & Success', icon: '💼' },
    { value: WishCategory.GENERAL, label: '🙏 General Blessings', icon: '🙏' }
  ];

  // Offering types
  offerings = ['Prasad', 'Flowers', 'Incense', 'Lamp', 'Fruits'];

  constructor(
    private wishService: WishService,
    private router: Router,
    public lang: LanguageService,
    private ambientAudio: AmbientAudioService,
    private petalService: PetalService,
    public blessingsService: BlessingsService
  ) {
    // Set initial random blessing
    this.currentBlessing = this.blessingsService.getRandomBlessing();
  }

  /**
   * Create a new wish
   */
  async createWish(): Promise<void> {
    if (!this.wishTitle.trim()) {
      alert('Please enter a wish title');
      return;
    }

    try {
      this.currentWish = await this.wishService.createWish({
        title: this.wishTitle,
        description: this.wishDescription,
        category: this.selectedCategory,
        donationAmount: 0,
        offeringType: this.offeringType
      });

      // Move to ritual step instead of completing immediately
      this.step = 'ritual';
    } catch (error) {
      console.error('Error creating wish:', error);
      alert('Failed to create wish. Please try again.');
    }
  }

  /**
   * Ring the temple bell
   */
  ringBell(): void {
    if (this.bellTaps < this.requiredBellTaps) {
      this.bellTaps++;
      
      // Initialize ambient audio on first interaction if not already done
      this.ambientAudio.initialize();
      
      // Play bell sound using ambient audio service
      this.ambientAudio.ringBell();
      
      // Visual feedback
      const bellElement = document.querySelector('.temple-bell');
      if (bellElement) {
        bellElement.classList.add('ringing');
        setTimeout(() => bellElement.classList.remove('ringing'), 500);
      }
      
      this.checkRitualComplete();
    }
  }

  /**
   * Chant "Jai Hanuman"
   */
  chantJaiHanuman(): void {
    if (this.chantCount < this.requiredChants) {
      this.chantCount++;
      
      // Visual feedback
      const chantElement = document.querySelector('.chant-button');
      if (chantElement) {
        chantElement.classList.add('chanting');
        setTimeout(() => chantElement.classList.remove('chanting'), 300);
      }
      
      this.checkRitualComplete();
    }
  }

  /**
   * Check if ritual is complete
   */
  checkRitualComplete(): void {
    if (this.bellTaps >= this.requiredBellTaps && this.chantCount >= this.requiredChants) {
      this.isRitualComplete = true;
      
      // Play shankh sound when ritual completes
      this.ambientAudio.playShankh();
      
      // Trigger flower offering celebration
      this.triggerFlowerOffering();
    }
  }

  /**
   * Move to sharing step after ritual completion
   */
  proceedToShare(): void {
    if (!this.isRitualComplete) return;
    this.step = 'share';
  }

  /**
   * Share temple info - opens native share or fallback
   */
  async shareTemple(): Promise<void> {
    const hindiMessage = `� जय श्री राम 🚩
अब एक ऐसा ऑनलाइन मंदिर तैयार हुआ है जहाँ:

🕓 हर घंटे हनुमान चालीसा स्वचालित रूप से बजती है (5 AM – 7 PM)
🙏 आप अपनी मनोकामना लिखकर घंटा बजा सकते हैं
🪔 वर्चुअल चढ़ावा, आरती और पूजा का अनुभव मिलता है
📿 आपकी सभी इच्छाएँ केवल आपके मोबाइल में सुरक्षित रहती हैं
🌍 दुनिया भर के भक्त एक ही समय पर चालीसा सुनते हैं
📱 किसी ऐप की जरूरत नहीं — बस लिंक खोलें और दर्शन करें

यह सिर्फ वेबसाइट नहीं — एक *डिजिटल भक्ति स्थल* है।

🔗 https://manokamna.online
🕉 जय बजरंगबली �`;

    const englishMessage = `🚩 Jai Shree Ram �

A unique spiritual experience has been created for devotees across the world:

🕓 Automatic Hanuman Chalisa every hour (5 AM – 7 PM)
🙏 Write your personal wish and offer it to Lord Hanuman
🔔 Ring the digital temple bell and complete a guided ritual
🪔 Experience virtual Aarti and offerings
📿 All wishes are stored only on your device — fully private
🌍 Devotees worldwide hear the same Chalisa timing together
📱 No download, no login — works instantly on any device

This is not just a website.
It is a **real digital temple of faith and devotion**.

🔗 Visit now: https://manokamna.online
🕉 Jai Bajrang Bali 🔱`;

    const messageToShare = this.lang.getCurrentLanguage() === 'hi' ? hindiMessage : englishMessage;

    try {
      // Try native Web Share API first (works on mobile)
      if (navigator.share) {
        await navigator.share({
          text: messageToShare
        });
        this.hasShared = true;
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(messageToShare);
        alert(this.lang.getCurrentLanguage() === 'hi' 
          ? 'मंदिर की जानकारी कॉपी हो गई! अब आप इसे WhatsApp, Email या किसी भी माध्यम से साझा कर सकते हैं।'
          : 'Temple info copied to clipboard! You can now share it via WhatsApp, Email, or any platform.');
        this.hasShared = true;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // User cancelled or error - that's okay
    }
  }

  /**
   * Share directly to WhatsApp
   */
  shareToWhatsApp(): void {
    const hindiMessage = `🚩 जय श्री राम 🚩
अब एक ऐसा ऑनलाइन मंदिर तैयार हुआ है जहाँ:

🕓 हर घंटे हनुमान चालीसा स्वचालित रूप से बजती है (5 AM – 7 PM)
🙏 आप अपनी मनोकामना लिखकर घंटा बजा सकते हैं
🪔 वर्चुअल चढ़ावा, आरती और पूजा का अनुभव मिलता है
📿 आपकी सभी इच्छाएँ केवल आपके मोबाइल में सुरक्षित रहती हैं
🌍 दुनिया भर के भक्त एक ही समय पर चालीसा सुनते हैं
📱 किसी ऐप की जरूरत नहीं — बस लिंक खोलें और दर्शन करें

यह सिर्फ वेबसाइट नहीं — एक *डिजिटल भक्ति स्थल* है।

🔗 https://manokamna.online
🕉 जय बजरंगबली 🚩`;

    const englishMessage = `🚩 Jai Shree Ram 🚩

A unique spiritual experience has been created for devotees across the world:

🕓 Automatic Hanuman Chalisa every hour (5 AM – 7 PM)
🙏 Write your personal wish and offer it to Lord Hanuman
🔔 Ring the digital temple bell and complete a guided ritual
🪔 Experience virtual Aarti and offerings
📿 All wishes are stored only on your device — fully private
🌍 Devotees worldwide hear the same Chalisa timing together
📱 No download, no login — works instantly on any device

This is not just a website.
It is a **real digital temple of faith and devotion**.

🔗 Visit now: https://manokamna.online
🕉 Jai Bajrang Bali 🔱`;

    const messageToShare = this.lang.getCurrentLanguage() === 'hi' ? hindiMessage : englishMessage;
    const encodedMessage = encodeURIComponent(messageToShare);
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    this.hasShared = true;
  }

  /**
   * Skip sharing step
   */
  skipSharing(): void {
    this.step = 'complete';
    this.submitWishFinal();
  }

  /**
   * Continue after sharing
   */
  continueAfterSharing(): void {
    this.step = 'complete';
    this.submitWishFinal();
  }

  /**
   * Submit wish after sharing
   */
  async submitWishFinal(): Promise<void> {
    if (!this.currentWish) return;

    try {
      // Activate the wish
      await this.wishService.activateWish(this.currentWish.id);
      
      // Get a new random blessing for the completion message
      this.currentBlessing = this.blessingsService.getRandomBlessing();
      
      // Trigger flower offering celebration
      this.triggerFlowerOffering();
      
      // Show offering animation
      this.showOfferingAnimation = true;
      this.startOfferingAnimation();
      
      // Hide animation after 5 seconds
      setTimeout(() => {
        this.showOfferingAnimation = false;
      }, 5000);
    } catch (error) {
      console.error('Error activating wish:', error);
      alert('Failed to submit wish. Please try again.');
    }
  }

  /**
   * Trigger flower petal offering
   */
  private triggerFlowerOffering(): void {
    const container = document.querySelector('.card') as HTMLElement;
    if (container) {
      // Spawn 8-10 marigold petals
      this.petalService.addOffering(container, 10);
    }
  }

  /**
   * Start the falling offerings animation
   */
  startOfferingAnimation(): void {
    this.showOfferingAnimation = true;
    this.fallingOfferings = [];
    
    // Get offering emoji based on type
    const offeringEmoji = this.getOfferingEmoji();
    
    // Create 30-40 falling offerings over 5 seconds
    const totalOfferings = 35;
    const duration = 5000;
    
    for (let i = 0; i < totalOfferings; i++) {
      setTimeout(() => {
        const offering = {
          id: Date.now() + i,
          emoji: offeringEmoji,
          left: Math.random() * 100, // Random horizontal position (%)
          duration: 2 + Math.random() * 2, // 2-4 seconds fall time
          delay: Math.random() * 0.5, // Small random delay
          rotation: Math.random() * 360 // Random rotation
        };
        this.fallingOfferings.push(offering);
        
        // Remove after animation completes
        setTimeout(() => {
          this.fallingOfferings = this.fallingOfferings.filter(o => o.id !== offering.id);
        }, offering.duration * 1000 + 1000);
      }, (i / totalOfferings) * duration);
    }
  }

  /**
   * Get emoji for offering type
   */
  getOfferingEmoji(): string {
    const emojiMap: { [key: string]: string } = {
      'Prasad': '🍬',
      'Flowers': '🌺',
      'Incense': '🔥',
      'Lamp': '🪔',
      'Fruits': '🍎'
    };
    return emojiMap[this.offeringType] || '🌺';
  }

  /**
   * Play bell sound
   */
  /**
   * Play bell sound (DEPRECATED - now using AmbientAudioService)
   * Kept for backward compatibility but not actively used
   */
  playBellSound(): void {
    // Now handled by AmbientAudioService.ringBell()
    // This method is deprecated and no longer called
    /*
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Silent fail if audio context not supported
    }
    */
  }

  /**
   * Complete the flow and return home
   */
  completeFlow(): void {
    this.router.navigate(['/']);
  }

  /**
   * Get category label
   */
  getCategoryLabel(category: WishCategory): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  /**
   * Get translated category name
   */
  getCategoryName(categoryValue: string): string {
    const mapping: { [key: string]: string } = {
      'health': 'wish.health',
      'prosperity': 'wish.wealth',
      'education': 'wish.education',
      'family': 'wish.family',
      'career': 'wish.career',
      'general': 'wish.spiritual'
    };
    return this.lang.t(mapping[categoryValue] || 'wish.spiritual');
  }

  /**
   * Get translated offering name
   */
  getOfferingName(offering: string): string {
    const mapping: { [key: string]: string } = {
      'Prasad': 'wish.prasad',
      'Flowers': 'wish.flowers',
      'Incense': 'wish.incense',
      'Lamp': 'wish.lamp',
      'Fruits': 'wish.fruits'
    };
    return this.lang.t(mapping[offering] || offering);
  }

  /**
   * Reset and start over
   */
  startOver(): void {
    this.step = 'create';
    this.wishTitle = '';
    this.wishDescription = '';
    this.selectedCategory = WishCategory.GENERAL;
    this.offeringType = 'Prasad';
    this.currentWish = undefined;
    this.bellTaps = 0;
    this.chantCount = 0;
    this.isRitualComplete = false;
    this.showOfferingAnimation = false;
    this.fallingOfferings = [];
    this.hasShared = false;
  }

  /**
   * Return to temple home page
   */
  returnToTemple(): void {
    this.router.navigate(['/']);
  }

  /**
   * Make another wish (reset form)
   */
  makeAnotherWish(): void {
    this.startOver();
  }

  /**
   * Get a new random blessing
   */
  getNewBlessing(): void {
    this.currentBlessing = this.blessingsService.getRandomBlessing();
  }

  /**
   * Get blessing text in current language
   */
  getBlessingText(): string {
    if (!this.currentBlessing) {
      return '';
    }
    return this.lang.getCurrentLanguage() === 'hi' 
      ? this.currentBlessing.hindi 
      : this.currentBlessing.english;
  }
}
