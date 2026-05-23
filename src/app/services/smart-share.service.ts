import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { DevoteeRewardsService, POINTS_CONFIG } from './devotee-rewards.service';
import { DailyEngagementService } from './daily-engagement.service';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';
import { ProductAnalyticsService } from './product-analytics.service';

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

export type BlessingShareContext = 'diya' | 'prasad' | 'aarti' | 'festival' | 'streak';

@Injectable({
  providedIn: 'root'
})
export class SmartShareService {
  private readonly SHARE_STATS_KEY = 'temple_share_stats';
  private readonly APP_URL = environment.appUrl;
  
  constructor(
    private lang: LanguageService,
    private rewards: DevoteeRewardsService,
    private engagement: DailyEngagementService,
    private toast: ToastService,
    private analytics: ProductAnalyticsService
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
      ? `${blessing}\n\nयह आशीर्वाद आपके लिए भेजा गया है।\n${this.getReferralUrl('blessing')}`
      : `${blessing}\n\nThis blessing was sent for you.\n${this.getReferralUrl('blessing')}`;
    this.shareOnWhatsApp(message);
  }

  shareContextualBlessing(context: BlessingShareContext, detail?: string): void {
    this.shareOnWhatsApp(this.getContextualBlessingMessage(context, detail));
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
      return `आज आपके लिए एक छोटा सा आशीर्वाद भेज रहा/रही हूं।\n\n` +
        `दीया जलाएं, शांत मन से दर्शन करें, और अपने प्रियजनों के लिए शुभकामना करें।\n\n` +
        `${this.getReferralUrl('blessing_share')}`;
    }
    return `Sending you a small blessing today.\n\n` +
      `Light a diya, take a quiet darshan, and offer a wish for someone you love.\n\n` +
      `${this.getReferralUrl('blessing_share')}`;
  }

  private getContextualBlessingMessage(context: BlessingShareContext, detail?: string): string {
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    const url = this.getReferralUrl(context);

    const messages: Record<BlessingShareContext, { hi: string; en: string }> = {
      diya: {
        hi: 'मैंने आपके लिए एक दीया जलाया है। यह प्रकाश आपके घर में शांति और शुभता लाए।',
        en: 'I lit a diya for you. May this light bring peace and goodness to your home.'
      },
      prasad: {
        hi: 'आपके लिए प्रसाद का आशीर्वाद भेज रहा/रही हूं। श्रद्धा और शांति बनी रहे।',
        en: 'Sending prasad blessings for you. May devotion and peace stay with you.'
      },
      aarti: {
        hi: 'आज की आरती का आशीर्वाद आपके लिए। मन शांत रहे और दिन मंगलमय हो।',
        en: "Sharing today's aarti blessing with you. May your mind be peaceful and your day auspicious."
      },
      festival: {
        hi: `${detail || 'त्योहार'} की शुभकामनाएं। यह दिन आपके परिवार के लिए मंगल और आनंद लाए।`,
        en: `Blessings for ${detail || 'this festival'}. May this day bring joy and auspiciousness to your family.`
      },
      streak: {
        hi: `${detail || 'भक्ति'} का संकल्प जारी है। आपके लिए भी शांति और शुभता की प्रार्थना।`,
        en: `${detail || 'Devotion'} continues. Praying for peace and goodness for you too.`
      }
    };

    return `${isHi ? messages[context].hi : messages[context].en}\n\n${url}`;
  }

  private getReferralUrl(ref: string): string {
    return `${this.APP_URL}?ref=${encodeURIComponent(ref)}`;
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
    this.analytics.track('share_sent', {
      platform,
      totalShares: this.getTotalShares() + 1
    });

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
