import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WishService } from '../../services/wish.service';
import { LanguageService } from '../../services/language.service';
import { AmbientAudioService } from '../../services/ambient-audio.service';
import { PetalService } from '../../services/petal.service';
import { BlessingsService, Blessing } from '../../services/blessings.service';
import { DeityService } from '../../services/deity.service';
import { DevoteeRewardsService } from '../../services/devotee-rewards.service';
import { ToastService } from '../../services/toast.service';
import { Wish, WishCategory, WishStatus } from '../../models/wish.model';
import { DeityType } from '../../models/deity.model';

@Component({
  selector: 'app-wish-flow',
  templateUrl: './wish-flow.component.html',
  styleUrls: ['./wish-flow.component.css']
})
export class WishFlowComponent implements OnInit {
  step: 'create' | 'ritual' | 'complete' = 'create';
  
  // Current deity
  currentDeity: DeityType = DeityType.HANUMAN;
  
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
    { value: WishCategory.SPIRITUAL, label: '🕉️ Spiritual Growth', icon: '🕉️' },
    { value: WishCategory.GENERAL, label: '🙏 General Blessings', icon: '🙏' }
  ];

  // Offering types
  offerings = ['Prasad', 'Flowers', 'Incense', 'Lamp', 'Fruits'];

  constructor(
    private wishService: WishService,
    private router: Router,
    private route: ActivatedRoute,
    public lang: LanguageService,
    private ambientAudio: AmbientAudioService,
    private petalService: PetalService,
    public blessingsService: BlessingsService,
    private deityService: DeityService,
    private rewardsService: DevoteeRewardsService,
    private toastService: ToastService
  ) {
    // Set initial random blessing
    this.currentBlessing = this.blessingsService.getRandomBlessing();
  }

  ngOnInit(): void {
    // Get deity from route data or use current deity
    this.route.data.subscribe(data => {
      if (data['deity']) {
        this.currentDeity = data['deity'] as DeityType;
        this.deityService.setDeity(this.currentDeity);
        // Set language service deity context for proper translations
        this.lang.setDeityContext(this.currentDeity);
      } else {
        this.currentDeity = this.deityService.getCurrentDeity().id;
        this.lang.setDeityContext(this.currentDeity);
      }
    });
  }

  /**
   * Create a new wish
   */
  async createWish(): Promise<void> {
    if (!this.wishTitle.trim()) {
      this.toastService.warning('Please enter a wish title');
      return;
    }

    try {
      this.currentWish = await this.wishService.createWish({
        deityId: this.currentDeity,
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
      this.toastService.error('Failed to create wish. Please try again.');
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
      
      // Trigger flower offering celebration
      this.triggerFlowerOffering();
    }
  }

  /**
   * Proceed directly to activation after ritual completion
   */
  proceedToActivate(): void {
    if (!this.isRitualComplete) return;
    this.activateWish();
  }

  /**
   * Share temple info - opens native share or fallback (optional feature)
   */
  async shareTemple(): Promise<void> {
    const currentDeity = this.deityService.getCurrentDeity();
    const deityName = this.lang.getCurrentLanguage() === 'hi' 
      ? currentDeity.nameHindi 
      : currentDeity.name;

    const hindiMessage = `🚩 ${deityName} का डिजिटल ई-मंदिर अब 24×7 खुला है 🚩

यह कोई भौतिक मंदिर नहीं — एक ऑनलाइन पवित्र स्थल है,
जहाँ हज़ारों भक्त हर दिन दर्शन कर रहे हैं और मनोकामनाएँ अर्पित कर रहे हैं।

यहाँ आप अपने मोबाइल से ही:
🕯️ दीया जला सकते हैं  
🔔 मंदिर की घंटी बजा सकते हैं  
📿 अपनी मनोकामना लिखकर ${deityName} को समर्पित कर सकते हैं  
🎵 दिव्य मंत्र और आरती सुन सकते हैं  

✅ कोई लॉगिन नहीं  
✅ कोई ऐप डाउनलोड नहीं  
✅ मनोकामनाएँ निजी रहती हैं (केवल आपके फ़ोन में)  
✅ शुद्ध भक्ति, बिना किसी शुल्क के  

🌐 दर्शन हेतु पधारें: ${window.location.origin}  
🙏 "डिजिटल मंदिर, पर भक्ति वही"  
🚩 नमस्ते`;

    const englishMessage = `🚩 The ${deityName} Digital Temple is now open 24×7 🚩

This is not a physical temple — it is a sacred online space
created for those who wish to pray, offer devotion, and submit
their wishes from anywhere in the world.

Inside the digital temple, you can:
🕯️ Light a virtual Diya
🔔 Ring the temple bell
📿 Write and offer your personal wish to ${deityName}
🎵 Listen to divine mantras and aartis

✅ No login required
✅ No app to install
✅ Your wishes stay private on your own device
✅ 100% free — devotion only, no mandatory donation

Visit and offer your prayer: ${window.location.origin}  
🙏 Namaste 🚩`;

    const messageToShare = this.lang.getCurrentLanguage() === 'hi' ? hindiMessage : englishMessage;

    try {
      // Try native Web Share API first (works on mobile)
      if (navigator.share) {
        await navigator.share({
          text: messageToShare,
          url: window.location.origin
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(messageToShare);
        this.toastService.success(
          this.lang.getCurrentLanguage() === 'hi' 
            ? 'मंदिर की जानकारी कॉपी हो गई! अब आप इसे WhatsApp, Email या किसी भी माध्यम से साझा कर सकते हैं।'
            : 'Temple info copied to clipboard! You can now share it via WhatsApp, Email, or any platform.'
        );
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // User cancelled or error - that's okay
    }
  }

  /**
   * Activate wish directly without share step
   */
  async activateWish(): Promise<void> {
    if (!this.currentWish) return;

    try {
      // Activate the wish
      await this.wishService.activateWish(this.currentWish.id);
      
      // Award Punya Points for making a wish
      this.rewardsService.recordWishMade();
      
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
      
      // Move to complete step
      this.step = 'complete';
    } catch (error) {
      console.error('Error activating wish:', error);
      this.toastService.error('Failed to submit wish. Please try again.');
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
      'spiritual': 'wish.spiritual',
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
