import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { DevoteeRewardsService, POINTS_CONFIG } from './devotee-rewards.service';
import { DailyEngagementService } from './daily-engagement.service';
import { ToastService } from './toast.service';

/**
 * Smart Sharing Service
 * Handles WhatsApp, social sharing, and viral growth mechanisms.
 * This is how the app "auto-reaches" people.
 */

export interface ShareContent {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SmartShareService {
  private readonly SHARE_STATS_KEY = 'temple_share_stats';
  private readonly APP_URL = 'https://manokamna.web.app';
  
  constructor(
    private lang: LanguageService,
    private rewards: DevoteeRewardsService,
    private engagement: DailyEngagementService,
    private toast: ToastService
  ) {}

  /**
   * Share on WhatsApp — THE primary growth channel for India
   */
  shareOnWhatsApp(customMessage?: string): void {
    const message = customMessage || this.getShareMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    this.recordShare('whatsapp');
  }

  /**
   * Share on WhatsApp with a specific contact/group
   */
  shareWhatsAppDirect(phone: string, customMessage?: string): void {
    const message = customMessage || this.getShareMessage();
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    this.recordShare('whatsapp_direct');
  }

  /**
   * Share on Facebook
   */
  shareOnFacebook(): void {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.APP_URL)}`;
    window.open(url, '_blank', 'width=600,height=400');
    this.recordShare('facebook');
  }

  /**
   * Share on Twitter/X
   */
  shareOnTwitter(): void {
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    const text = isHi 
      ? '🙏 मनोकामना - अपने फोन पर करें मंदिर दर्शन और मनोकामना पूरी करें! #मनोकामना #वर्चुअलमंदिर' 
      : '🙏 Manokamna - Visit virtual temples and make divine wishes! #Manokamna #VirtualTemple';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.APP_URL)}`;
    window.open(url, '_blank', 'width=600,height=400');
    this.recordShare('twitter');
  }

  /**
   * Copy link to clipboard
   */
  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(`${this.APP_URL}?ref=copy`);
      const isHi = this.lang.getCurrentLanguage() === 'hi';
      this.toast.success(isHi ? '📋 लिंक कॉपी हो गया!' : '📋 Link copied!');
      this.recordShare('copy_link');
    } catch {
      this.toast.error('Could not copy link');
    }
  }

  /**
   * Use Web Share API (native OS share sheet)
   */
  async shareNative(): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    const isHi = this.lang.getCurrentLanguage() === 'hi';
    try {
      await navigator.share({
        title: isHi ? 'मनोकामना - वर्चुअल मंदिर' : 'Manokamna - Virtual Temple',
        text: this.getShareMessage(),
        url: `${this.APP_URL}?ref=native_share`
      });
      this.recordShare('native');
      return true;
    } catch {
      // User cancelled
      return false;
    }
  }

  /**
   * Smart share — tries native first, falls back to WhatsApp
   */
  async smartShare(): Promise<void> {
    const nativeWorked = await this.shareNative();
    if (!nativeWorked) {
      this.shareOnWhatsApp();
    }
  }

  /**
   * Share a specific blessing/quote
   */
  shareBlessingOnWhatsApp(blessing: string): void {
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    const message = isHi
      ? `${blessing}\n\n🙏 यह आशीर्वाद आपको मनोकामना वर्चुअल मंदिर से प्राप्त हुआ है\n${this.APP_URL}?ref=blessing`
      : `${blessing}\n\n🙏 This blessing was received from Manokamna Virtual Temple\n${this.APP_URL}?ref=blessing`;
    this.shareOnWhatsApp(message);
  }

  /**
   * Share festival greetings
   */
  shareFestivalGreeting(festivalName: string, festivalNameHi: string): void {
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    const message = isHi
      ? `🎉 ${festivalNameHi} की हार्दिक शुभकामनाएं! 🙏\n\nआइए मनोकामना वर्चुअल मंदिर में दर्शन करें और आशीर्वाद प्राप्त करें!\n\n🪔 ${this.APP_URL}?ref=festival`
      : `🎉 Happy ${festivalName}! 🙏\n\nVisit Manokamna Virtual Temple for divine blessings!\n\n🪔 ${this.APP_URL}?ref=festival`;
    this.shareOnWhatsApp(message);
  }

  /**
   * Generate morning share message (for notification sharing)
   */
  getMorningShareMessage(): string {
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    if (isHi) {
      return `🙏 शुभ प्रभात! 🌅\n\nआज का दिन मंगलमय हो! मनोकामना मंदिर में आकर आशीर्वाद लें।\n\n🪔 दीये जलाएं\n📿 मंत्र सुनें\n⭐ मनोकामना करें\n\n${this.APP_URL}?ref=morning`;
    }
    return `🙏 Good Morning! 🌅\n\nMay your day be blessed! Visit Manokamna Temple for divine darshan.\n\n🪔 Light diyas\n📿 Listen to mantras\n⭐ Make a divine wish\n\n${this.APP_URL}?ref=morning`;
  }

  /**
   * Get the standard share message
   */
  getShareMessage(): string {
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    if (isHi) {
      return `🙏 मनोकामना - वर्चुअल मंदिर 🙏\n\n` +
        `अब अपने फोन पर ही करें हनुमान, गणेश, शिव, कृष्ण और दुर्गा मंदिर के दर्शन!\n\n` +
        `🪔 दीये जलाएं\n` +
        `📿 आरती-चालीसा सुनें\n` +
        `🔔 घंटी बजाएं\n` +
        `⭐ मनोकामना करें\n` +
        `🌺 फूल चढ़ाएं\n` +
        `🧘 ध्यान करें\n\n` +
        `जय हो! 🙏\n\n` +
        `${this.APP_URL}?ref=share`;
    }
    return `🙏 Manokamna - Virtual Temple 🙏\n\n` +
      `Visit Hanuman, Ganesh, Shiva, Krishna & Durga temples on your phone!\n\n` +
      `🪔 Light diyas for loved ones\n` +
      `📿 Listen to Aarti & Chalisa\n` +
      `🔔 Ring temple bells\n` +
      `⭐ Make divine wishes\n` +
      `🌺 Offer flowers\n` +
      `🧘 Meditate peacefully\n\n` +
      `Jai Ho! 🙏\n\n` +
      `${this.APP_URL}?ref=share`;
  }

  /**
   * Record a share action
   */
  private recordShare(platform: string): void {
    this.rewards.recordAppShared();
    this.engagement.recordAction('share');
    
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    this.toast.success(
      isHi ? `🙏 साझा करने के लिए धन्यवाद! +${POINTS_CONFIG.shareApp} पुण्य अंक` 
           : `🙏 Thanks for sharing! +${POINTS_CONFIG.shareApp} Punya Points`,
      3000
    );

    // Update share stats
    try {
      const stats = JSON.parse(localStorage.getItem(this.SHARE_STATS_KEY) || '{}');
      stats[platform] = (stats[platform] || 0) + 1;
      stats.total = (stats.total || 0) + 1;
      stats.lastShareDate = new Date().toISOString();
      localStorage.setItem(this.SHARE_STATS_KEY, JSON.stringify(stats));
    } catch { /* ignore */ }
  }

  /**
   * Check if Web Share API is available
   */
  canUseNativeShare(): boolean {
    return !!navigator.share;
  }

  /**
   * Get total shares count
   */
  getTotalShares(): number {
    try {
      const stats = JSON.parse(localStorage.getItem(this.SHARE_STATS_KEY) || '{}');
      return stats.total || 0;
    } catch {
      return 0;
    }
  }
}
