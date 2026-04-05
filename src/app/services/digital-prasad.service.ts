import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DevoteeRewardsService } from './devotee-rewards.service';
import { ToastService } from './toast.service';
import { LanguageService } from './language.service';

export interface DigitalPrasad {
  id: string;
  name: string;
  nameHi: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'divine';
  description: string;
  descriptionHi: string;
  receivedDate: string;
  fromDeity: string;
  shareMessage: string;
  shareMessageHi: string;
}

/**
 * DigitalPrasadService - Collectible spiritual blessings
 * 
 * Users receive random "prasad" (sacred offerings) after completing
 * rituals. These can be shared with friends and form a collection.
 * 
 * Addiction mechanics:
 * - Random rarity system (gamified like gacha)
 * - Share for bonus points
 * - Collection completion tracking
 * - Daily special prasad
 */
@Injectable({
  providedIn: 'root'
})
export class DigitalPrasadService {
  private readonly STORAGE_KEY = 'temple_prasad_collection';
  
  private collectionSubject = new BehaviorSubject<DigitalPrasad[]>(this.loadCollection());
  public collection$ = this.collectionSubject.asObservable();

  // All possible prasad items
  private readonly ALL_PRASAD: Omit<DigitalPrasad, 'id' | 'receivedDate' | 'fromDeity'>[] = [
    // Common (60% chance)
    { name: 'Sacred Tulsi Leaf', nameHi: 'पवित्र तुलसी पत्ता', emoji: '🌿', rarity: 'common',
      description: 'A blessed tulsi leaf from the temple garden', descriptionHi: 'मंदिर के बगीचे से पवित्र तुलसी पत्ता',
      shareMessage: '🌿 I received a sacred Tulsi leaf from Manokamna Temple! May its blessings reach you too 🙏', 
      shareMessageHi: '🌿 मुझे मनोकामना मंदिर से पवित्र तुलसी पत्ता मिला! इसकी कृपा आप पर भी बरसे 🙏' },
    { name: 'Kumkum Tilak', nameHi: 'कुमकुम तिलक', emoji: '🔴', rarity: 'common',
      description: 'A sacred kumkum mark of divine protection', descriptionHi: 'दिव्य सुरक्षा का पवित्र कुमकुम चिह्न',
      shareMessage: '🔴 Received Kumkum Tilak from Manokamna Temple. Divine protection for you! 🙏', 
      shareMessageHi: '🔴 मनोकामना मंदिर से कुमकुम तिलक प्राप्त हुआ। आपकी दिव्य रक्षा हो! 🙏' },
    { name: 'Prasad Laddu', nameHi: 'प्रसाद का लड्डू', emoji: '🟡', rarity: 'common',
      description: 'A sweet laddu blessed by the deity', descriptionHi: 'भगवान का आशीर्वाद प्राप्त मिठा लड्डू',
      shareMessage: '🟡 Got a blessed Laddu from Manokamna Temple! Sweet blessings for you 🙏', 
      shareMessageHi: '🟡 मनोकामना मंदिर से आशीर्वाद प्राप्त लड्डू मिला! आपके लिए मीठे आशीर्वाद 🙏' },
    { name: 'Sacred Thread', nameHi: 'पवित्र धागा', emoji: '🧵', rarity: 'common',
      description: 'A blessed thread (mauli) for protection', descriptionHi: 'रक्षा के लिए पवित्र मौली',
      shareMessage: '🧵 Received a sacred thread from Manokamna Temple. May it protect you! 🙏', 
      shareMessageHi: '🧵 मनोकामना मंदिर से पवित्र धागा मिला। यह आपकी रक्षा करे! 🙏' },
    { name: 'Holy Water', nameHi: 'गंगा जल', emoji: '💧', rarity: 'common',
      description: 'A drop of sacred Ganga Jal', descriptionHi: 'पवित्र गंगा जल की एक बूंद',
      shareMessage: '💧 Blessed with Ganga Jal from Manokamna Temple! May it purify your soul 🙏', 
      shareMessageHi: '💧 मनोकामना मंदिर से गंगा जल का आशीर्वाद! यह आपकी आत्मा को शुद्ध करे 🙏' },

    // Uncommon (25% chance)
    { name: 'Sandalwood Paste', nameHi: 'चंदन का लेप', emoji: '🟤', rarity: 'uncommon',
      description: 'Fragrant sandalwood paste from the deity idol', descriptionHi: 'देव मूर्ति से सुगंधित चंदन',
      shareMessage: '🟤 Received sacred Sandalwood paste! Its fragrance carries divine peace 🙏', 
      shareMessageHi: '🟤 पवित्र चंदन प्राप्त! इसकी सुगंध दिव्य शांति लाती है 🙏' },
    { name: 'Camphor Flame', nameHi: 'कपूर की ज्योत', emoji: '🔥', rarity: 'uncommon',
      description: 'The sacred light of camphor aarti', descriptionHi: 'कपूर आरती की पवित्र ज्योत',
      shareMessage: '🔥 The camphor flame from Manokamna Temple illuminates your path! 🙏', 
      shareMessageHi: '🔥 मनोकामना मंदिर की कपूर ज्योत आपका मार्ग प्रकाशित करे! 🙏' },
    { name: 'Marigold Garland', nameHi: 'गेंदे की माला', emoji: '🌼', rarity: 'uncommon',
      description: 'A marigold garland from the deity', descriptionHi: 'भगवान से गेंदे के फूलों की माला',
      shareMessage: '🌼 A blessed Marigold garland from Manokamna Temple! Joy and prosperity for you 🙏', 
      shareMessageHi: '🌼 मनोकामना मंदिर से आशीर्वाद प्राप्त माला! आपके लिए आनंद और समृद्धि 🙏' },
    { name: 'Sacred Ash', nameHi: 'विभूति', emoji: '⚪', rarity: 'uncommon',
      description: 'Vibhuti - the sacred ash of divine transformation', descriptionHi: 'विभूति - दिव्य परिवर्तन की पवित्र भस्म',
      shareMessage: '⚪ Received Vibhuti from Manokamna Temple! May it transform your life 🙏', 
      shareMessageHi: '⚪ मनोकामना मंदिर से विभूति प्राप्त! यह आपके जीवन को बदल दे 🙏' },

    // Rare (12% chance)
    { name: 'Lotus Flower', nameHi: 'कमल का फूल', emoji: '🪷', rarity: 'rare',
      description: 'A rare lotus from the sacred pond', descriptionHi: 'पवित्र सरोवर से दुर्लभ कमल',
      shareMessage: '🪷 A rare Lotus from Manokamna Temple! May wisdom bloom in your life 🙏', 
      shareMessageHi: '🪷 मनोकामना मंदिर से दुर्लभ कमल! आपके जीवन में ज्ञान पुष्पित हो 🙏' },
    { name: 'Rudraksha Bead', nameHi: 'रुद्राक्ष', emoji: '📿', rarity: 'rare',
      description: 'A blessed Rudraksha - the tear of Lord Shiva', descriptionHi: 'आशीर्वाद प्राप्त रुद्राक्ष - शिव का अश्रु',
      shareMessage: '📿 Received a blessed Rudraksha from Manokamna Temple! Lord Shiva protects you 🙏', 
      shareMessageHi: '📿 मनोकामना मंदिर से आशीर्वाद प्राप्त रुद्राक्ष! भोलेनाथ आपकी रक्षा करें 🙏' },
    { name: 'Golden Modak', nameHi: 'सुवर्ण मोदक', emoji: '🍬', rarity: 'rare',
      description: 'A golden modak - Lord Ganesh\'s favorite sweet', descriptionHi: 'सुवर्ण मोदक - गणेश जी की प्रिय मिठाई',
      shareMessage: '🍬 A rare Golden Modak from Lord Ganesh at Manokamna Temple! 🐘🙏', 
      shareMessageHi: '🍬 मनोकामना मंदिर से गणेश जी का दुर्लभ सुवर्ण मोदक! 🐘🙏' },

    // Divine (3% chance)
    { name: 'Sudarshan Chakra Blessing', nameHi: 'सुदर्शन चक्र आशीर्वाद', emoji: '☸️', rarity: 'divine',
      description: 'The rarest blessing - divine protection of Lord Vishnu', descriptionHi: 'दुर्लभतम आशीर्वाद - भगवान विष्णु की दिव्य सुरक्षा',
      shareMessage: '☸️ I received the DIVINE Sudarshan Chakra blessing from Manokamna Temple! Supreme protection! 🙏✨', 
      shareMessageHi: '☸️ मनोकामना मंदिर से दिव्य सुदर्शन चक्र आशीर्वाद प्राप्त! परम सुरक्षा! 🙏✨' },
    { name: 'Shiva\'s Third Eye Blessing', nameHi: 'शिव की तृतीय नेत्र कृपा', emoji: '👁️', rarity: 'divine',
      description: 'The rarest blessing - Lord Shiva\'s inner vision', descriptionHi: 'दुर्लभतम आशीर्वाद - महादेव का अंतर्दृष्टि',
      shareMessage: '👁️ DIVINE blessing! Shiva\'s Third Eye vision from Manokamna Temple! Ultimate wisdom! 🔱🙏', 
      shareMessageHi: '👁️ दिव्य आशीर्वाद! मनोकामना मंदिर से शिव की तृतीय नेत्र कृपा! परम ज्ञान! 🔱🙏' },
    { name: 'Krishna\'s Flute Melody', nameHi: 'कृष्ण की बांसुरी धुन', emoji: '🎵', rarity: 'divine',
      description: 'The rarest blessing - hear the divine flute in your heart', descriptionHi: 'दुर्लभतम आशीर्वाद - हृदय में दिव्य बांसुरी सुनें',
      shareMessage: '🎵 DIVINE blessing! Krishna\'s Flute Melody from Manokamna Temple! Eternal bliss! 🦚🙏', 
      shareMessageHi: '🎵 दिव्य आशीर्वाद! मनोकामना मंदिर से कृष्ण की बांसुरी धुन! शाश्वत आनंद! 🦚🙏' },
  ];

  constructor(
    private rewards: DevoteeRewardsService,
    private toast: ToastService,
    private lang: LanguageService
  ) {}

  /**
   * Award a random prasad after a ritual
   */
  awardPrasad(deityName: string): DigitalPrasad {
    const roll = Math.random() * 100;
    let rarity: DigitalPrasad['rarity'];
    
    if (roll < 3) rarity = 'divine';
    else if (roll < 15) rarity = 'rare';
    else if (roll < 40) rarity = 'uncommon';
    else rarity = 'common';

    const candidates = this.ALL_PRASAD.filter(p => p.rarity === rarity);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    
    const prasad: DigitalPrasad = {
      ...chosen,
      id: `prasad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      receivedDate: new Date().toISOString(),
      fromDeity: deityName
    };

    // Add to collection
    const collection = this.collectionSubject.value;
    collection.push(prasad);
    this.collectionSubject.next(collection);
    this.saveCollection();

    // Award points
    this.rewards.recordPrasadReceived();

    // Show toast with rarity indication
    const isHi = this.lang.getCurrentLanguage() === 'hi';
    const rarityLabel = this.getRarityLabel(rarity, isHi);
    this.toast.success(
      `${prasad.emoji} ${rarityLabel} ${isHi ? prasad.nameHi : prasad.name}!`,
      rarity === 'divine' ? 6000 : rarity === 'rare' ? 4000 : 3000
    );

    return prasad;
  }

  private getRarityLabel(rarity: string, isHi: boolean): string {
    switch (rarity) {
      case 'divine': return isHi ? '✨ दिव्य प्रसाद:' : '✨ DIVINE Prasad:';
      case 'rare': return isHi ? '💎 दुर्लभ प्रसाद:' : '💎 Rare Prasad:';
      case 'uncommon': return isHi ? '🌟 विशेष प्रसाद:' : '🌟 Special Prasad:';
      default: return isHi ? '🙏 प्रसाद:' : '🙏 Prasad:';
    }
  }

  /**
   * Get collection grouped by rarity
   */
  getCollectionSummary(): { total: number; common: number; uncommon: number; rare: number; divine: number } {
    const collection = this.collectionSubject.value;
    return {
      total: collection.length,
      common: collection.filter(p => p.rarity === 'common').length,
      uncommon: collection.filter(p => p.rarity === 'uncommon').length,
      rare: collection.filter(p => p.rarity === 'rare').length,
      divine: collection.filter(p => p.rarity === 'divine').length
    };
  }

  /**
   * Get unique prasad types collected
   */
  getUniqueCount(): number {
    const names = new Set(this.collectionSubject.value.map(p => p.name));
    return names.size;
  }

  /**
   * Get total possible unique prasad
   */
  getTotalPossible(): number {
    return this.ALL_PRASAD.length;
  }

  private loadCollection(): DigitalPrasad[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private saveCollection(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.collectionSubject.value));
    } catch { /* ignore */ }
  }
}
