import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

/**
 * Hindu Calendar / Panchang Service
 * Provides tithi, nakshatra, festivals, auspicious timings
 * This brings users back DAILY — different content every day
 */

export interface PanchangData {
  date: Date;
  tithi: TithiInfo;
  nakshatra: string;
  nakshatraHi: string;
  yoga: string;
  yogaHi: string;
  paksha: 'Shukla' | 'Krishna';
  pakshaHi: string;
  hinduMonth: string;
  hinduMonthHi: string;
  vara: string; // Day of week in Sanskrit
  varaHi: string;
  varaDeity: string; // Which deity rules this day
  varaDeityHi: string;
  sunrise: string;
  sunset: string;
  rahukaal: string;
  auspiciousColor: string;
  auspiciousColorHi: string;
  luckyNumber: number;
  specialMessage: string;
  specialMessageHi: string;
  isAuspicious: boolean;
}

export interface TithiInfo {
  name: string;
  nameHi: string;
  number: number;
  significance: string;
  significanceHi: string;
}

export interface HinduFestival {
  name: string;
  nameHi: string;
  date: Date;
  description: string;
  descriptionHi: string;
  deity: string;
  emoji: string;
  rituals: string[];
  ritualsHi: string[];
  isToday: boolean;
  daysAway: number;
}

@Injectable({
  providedIn: 'root'
})
export class HinduCalendarService {
  // Initialized to null! — constructor calls updatePanchang() immediately after all
  // class fields (TITHIS, NAKSHATRAS, YOGAS…) are assigned, so subscribers always
  // get a valid value. Calling calculatePanchang() here would crash because the
  // readonly arrays below are not yet assigned at field-initializer time.
  private panchangSubject = new BehaviorSubject<PanchangData>(null!);
  public panchang$ = this.panchangSubject.asObservable();
  
  private festivalsSubject = new BehaviorSubject<HinduFestival[]>([]);
  public festivals$ = this.festivalsSubject.asObservable();

  private readonly TITHIS: { name: string; nameHi: string; significance: string; significanceHi: string }[] = [
    { name: 'Pratipada', nameHi: 'प्रतिपदा', significance: 'New beginnings', significanceHi: 'नई शुरुआत' },
    { name: 'Dwitiya', nameHi: 'द्वितीया', significance: 'Wealth & prosperity', significanceHi: 'धन और समृद्धि' },
    { name: 'Tritiya', nameHi: 'तृतीया', significance: 'Auspicious for rituals', significanceHi: 'अनुष्ठान के लिए शुभ' },
    { name: 'Chaturthi', nameHi: 'चतुर्थी', significance: 'Ganesh worship', significanceHi: 'गणेश पूजा' },
    { name: 'Panchami', nameHi: 'पंचमी', significance: 'Knowledge & wisdom', significanceHi: 'ज्ञान और बुद्धि' },
    { name: 'Shashthi', nameHi: 'षष्ठी', significance: 'Kartikeya worship', significanceHi: 'कार्तिकेय पूजा' },
    { name: 'Saptami', nameHi: 'सप्तमी', significance: 'Sun worship', significanceHi: 'सूर्य पूजा' },
    { name: 'Ashtami', nameHi: 'अष्टमी', significance: 'Durga worship', significanceHi: 'दुर्गा पूजा' },
    { name: 'Navami', nameHi: 'नवमी', significance: 'Ram worship', significanceHi: 'राम पूजा' },
    { name: 'Dashami', nameHi: 'दशमी', significance: 'Victory day', significanceHi: 'विजय दिवस' },
    { name: 'Ekadashi', nameHi: 'एकादशी', significance: 'Vishnu worship & fasting', significanceHi: 'विष्णु पूजा व उपवास' },
    { name: 'Dwadashi', nameHi: 'द्वादशी', significance: 'Devotion day', significanceHi: 'भक्ति दिवस' },
    { name: 'Trayodashi', nameHi: 'त्रयोदशी', significance: 'Shiva worship', significanceHi: 'शिव पूजा' },
    { name: 'Chaturdashi', nameHi: 'चतुर्दशी', significance: 'Hanuman worship', significanceHi: 'हनुमान पूजा' },
    { name: 'Purnima/Amavasya', nameHi: 'पूर्णिमा/अमावस्या', significance: 'Full/New Moon', significanceHi: 'पूर्ण/नव चंद्र' }
  ];

  private readonly NAKSHATRAS = [
    { name: 'Ashwini', nameHi: 'अश्विनी' }, { name: 'Bharani', nameHi: 'भरणी' },
    { name: 'Krittika', nameHi: 'कृत्तिका' }, { name: 'Rohini', nameHi: 'रोहिणी' },
    { name: 'Mrigashira', nameHi: 'मृगशिरा' }, { name: 'Ardra', nameHi: 'आर्द्रा' },
    { name: 'Punarvasu', nameHi: 'पुनर्वसु' }, { name: 'Pushya', nameHi: 'पुष्य' },
    { name: 'Ashlesha', nameHi: 'आश्लेषा' }, { name: 'Magha', nameHi: 'मघा' },
    { name: 'Purva Phalguni', nameHi: 'पूर्वा फाल्गुनी' }, { name: 'Uttara Phalguni', nameHi: 'उत्तरा फाल्गुनी' },
    { name: 'Hasta', nameHi: 'हस्त' }, { name: 'Chitra', nameHi: 'चित्रा' },
    { name: 'Swati', nameHi: 'स्वाति' }, { name: 'Vishakha', nameHi: 'विशाखा' },
    { name: 'Anuradha', nameHi: 'अनुराधा' }, { name: 'Jyeshtha', nameHi: 'ज्येष्ठा' },
    { name: 'Mula', nameHi: 'मूल' }, { name: 'Purva Ashadha', nameHi: 'पूर्वाषाढ़ा' },
    { name: 'Uttara Ashadha', nameHi: 'उत्तराषाढ़ा' }, { name: 'Shravana', nameHi: 'श्रवण' },
    { name: 'Dhanishtha', nameHi: 'धनिष्ठा' }, { name: 'Shatabhisha', nameHi: 'शतभिषा' },
    { name: 'Purva Bhadrapada', nameHi: 'पूर्वा भाद्रपद' }, { name: 'Uttara Bhadrapada', nameHi: 'उत्तरा भाद्रपद' },
    { name: 'Revati', nameHi: 'रेवती' }
  ];

  private readonly YOGAS = [
    { name: 'Vishkumbha', nameHi: 'विष्कम्भ' }, { name: 'Preeti', nameHi: 'प्रीति' },
    { name: 'Ayushman', nameHi: 'आयुष्मान' }, { name: 'Saubhagya', nameHi: 'सौभाग्य' },
    { name: 'Shobhana', nameHi: 'शोभन' }, { name: 'Atiganda', nameHi: 'अतिगंड' },
    { name: 'Sukarma', nameHi: 'सुकर्म' }, { name: 'Dhriti', nameHi: 'धृति' },
    { name: 'Shula', nameHi: 'शूल' }, { name: 'Ganda', nameHi: 'गंड' },
    { name: 'Vriddhi', nameHi: 'वृद्धि' }, { name: 'Dhruva', nameHi: 'ध्रुव' },
    { name: 'Vyaghata', nameHi: 'व्याघात' }, { name: 'Harshana', nameHi: 'हर्षण' },
    { name: 'Vajra', nameHi: 'वज्र' }, { name: 'Siddhi', nameHi: 'सिद्धि' },
    { name: 'Vyatipata', nameHi: 'व्यतीपात' }, { name: 'Variyan', nameHi: 'वरीयान' },
    { name: 'Parigha', nameHi: 'परिघ' }, { name: 'Shiva', nameHi: 'शिव' },
    { name: 'Siddha', nameHi: 'सिद्ध' }, { name: 'Sadhya', nameHi: 'साध्य' },
    { name: 'Shubha', nameHi: 'शुभ' }, { name: 'Shukla', nameHi: 'शुक्ल' },
    { name: 'Brahma', nameHi: 'ब्रह्म' }, { name: 'Indra', nameHi: 'इन्द्र' },
    { name: 'Vaidhriti', nameHi: 'वैधृति' }
  ];

  private readonly VARA_INFO = [
    { name: 'Ravivara', nameHi: 'रविवार', deity: 'Surya Dev', deityHi: 'सूर्य देव', color: 'Red', colorHi: 'लाल' },
    { name: 'Somavara', nameHi: 'सोमवार', deity: 'Lord Shiva', deityHi: 'भगवान शिव', color: 'White', colorHi: 'सफ़ेद' },
    { name: 'Mangalavara', nameHi: 'मंगलवार', deity: 'Lord Hanuman', deityHi: 'हनुमान जी', color: 'Red/Orange', colorHi: 'लाल/केसरिया' },
    { name: 'Budhavara', nameHi: 'बुधवार', deity: 'Lord Ganesha', deityHi: 'गणेश जी', color: 'Green', colorHi: 'हरा' },
    { name: 'Guruvara', nameHi: 'गुरुवार', deity: 'Lord Vishnu', deityHi: 'भगवान विष्णु', color: 'Yellow', colorHi: 'पीला' },
    { name: 'Shukravara', nameHi: 'शुक्रवार', deity: 'Goddess Lakshmi', deityHi: 'लक्ष्मी माता', color: 'White/Pink', colorHi: 'सफ़ेद/गुलाबी' },
    { name: 'Shanivara', nameHi: 'शनिवार', deity: 'Lord Shani', deityHi: 'शनिदेव', color: 'Black/Blue', colorHi: 'काला/नीला' }
  ];

  private readonly HINDU_MONTHS = [
    { name: 'Chaitra', nameHi: 'चैत्र' }, { name: 'Vaishakha', nameHi: 'वैशाख' },
    { name: 'Jyeshtha', nameHi: 'ज्येष्ठ' }, { name: 'Ashadha', nameHi: 'आषाढ़' },
    { name: 'Shravana', nameHi: 'श्रावण' }, { name: 'Bhadrapada', nameHi: 'भाद्रपद' },
    { name: 'Ashwina', nameHi: 'अश्विन' }, { name: 'Kartika', nameHi: 'कार्तिक' },
    { name: 'Margashirsha', nameHi: 'मार्गशीर्ष' }, { name: 'Pausha', nameHi: 'पौष' },
    { name: 'Magha', nameHi: 'माघ' }, { name: 'Phalguna', nameHi: 'फाल्गुन' }
  ];

  constructor() {
    this.updatePanchang();
    this.loadFestivals();
    
    // Update panchang at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(() => {
      this.updatePanchang();
      this.loadFestivals();
      // Then refresh daily
      interval(24 * 60 * 60 * 1000).subscribe(() => {
        this.updatePanchang();
        this.loadFestivals();
      });
    }, msUntilMidnight);
  }

  private updatePanchang(): void {
    this.panchangSubject.next(this.calculatePanchang(new Date()));
  }

  /**
   * Safe modulo that always returns a non-negative integer index within [0, length)
   */
  private safeIdx(value: number, length: number): number {
    const mod = ((Math.floor(value) % length) + length) % length;
    return Math.min(Math.max(mod, 0), length - 1);
  }

  /**
   * Calculate Panchang for a given date
   * Uses algorithmic approximation based on lunar cycles
   */
  calculatePanchang(date: Date): PanchangData {
    const dayOfWeek = date.getDay();
    const dayOfYear = this.getDayOfYear(date);
    const year = date.getFullYear();
    
    // Approximate tithi from lunar phase (29.53 day synodic month)
    const lunarAge = this.getLunarAge(date);
    const tithiIndex = this.safeIdx(lunarAge / 2, 15);
    const paksha = lunarAge < 15 ? 'Shukla' : 'Krishna';
    
    // Approximate nakshatra — use only dayOfYear to avoid large-number float drift
    const nakshatraRaw = (dayOfYear * 27.32 / 365.25) + (year % 100) * 3.7;
    const nakshatraIndex = this.safeIdx(nakshatraRaw, 27);
    const nakshatra = this.NAKSHATRAS[nakshatraIndex];
    
    // Approximate yoga — same safe approach
    const yogaRaw = (dayOfYear * 27 / 365.25) + (year % 100) * 2.1;
    const yogaIndex = this.safeIdx(yogaRaw, 27);
    const yoga = this.YOGAS[yogaIndex];
    
    // Hindu month approximation
    const hinduMonthIndex = this.safeIdx(date.getMonth() + (date.getDate() > 14 ? 1 : 0), 12);
    const hinduMonth = this.HINDU_MONTHS[hinduMonthIndex];
    
    // Vara (day of week)
    const vara = this.VARA_INFO[dayOfWeek];
    
    // Sunrise/sunset approximation (India Standard Time)
    const sunrise = this.getApproxSunrise(date);
    const sunset = this.getApproxSunset(date);
    
    // Rahukaal calculation
    const rahukaal = this.getRahukaal(dayOfWeek);
    
    // Lucky number based on tithi + nakshatra
    const luckyNumber = ((tithiIndex + nakshatraIndex + dayOfWeek) % 9) + 1;
    
    // Special messages based on tithi/day combinations
    const { message, messageHi } = this.getSpecialMessage(tithiIndex, dayOfWeek, paksha);
    
    // Auspiciousness check
    const isAuspicious = this.checkAuspicious(tithiIndex, dayOfWeek, yogaIndex);

    return {
      date,
      tithi: {
        ...this.TITHIS[tithiIndex],
        number: tithiIndex + 1
      },
      nakshatra: nakshatra.name,
      nakshatraHi: nakshatra.nameHi,
      yoga: yoga.name,
      yogaHi: yoga.nameHi,
      paksha,
      pakshaHi: paksha === 'Shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष',
      hinduMonth: hinduMonth.name,
      hinduMonthHi: hinduMonth.nameHi,
      vara: vara.name,
      varaHi: vara.nameHi,
      varaDeity: vara.deity,
      varaDeityHi: vara.deityHi,
      sunrise,
      sunset,
      rahukaal,
      auspiciousColor: vara.color,
      auspiciousColorHi: vara.colorHi,
      luckyNumber,
      specialMessage: message,
      specialMessageHi: messageHi,
      isAuspicious
    };
  }

  /**
   * Get approximate lunar age (days since last new moon)
   */
  private getLunarAge(date: Date): number {
    // Reference new moon: January 6, 2000, 18:14 UTC
    const refNewMoon = new Date(2000, 0, 6, 18, 14, 0).getTime();
    const synodicMonth = 29.53058770576; // days
    const daysSinceRef = (date.getTime() - refNewMoon) / (1000 * 60 * 60 * 24);
    return ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth;
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getApproxSunrise(date: Date): string {
    // Approximate for Indian Standard Time (Delhi-ish latitude)
    const month = date.getMonth();
    const sunriseHours = [7, 7, 6, 6, 5, 5, 5, 6, 6, 6, 6, 7];
    const sunriseMinutes = [10, 0, 30, 0, 40, 25, 35, 0, 10, 20, 40, 5];
    return `${sunriseHours[month]}:${String(sunriseMinutes[month]).padStart(2, '0')} AM`;
  }

  private getApproxSunset(date: Date): string {
    const month = date.getMonth();
    const sunsetHours = [5, 6, 6, 6, 7, 7, 7, 7, 6, 5, 5, 5];
    const sunsetMinutes = [30, 0, 20, 45, 5, 20, 15, 0, 20, 45, 25, 20];
    return `${sunsetHours[month]}:${String(sunsetMinutes[month]).padStart(2, '0')} PM`;
  }

  private getRahukaal(dayOfWeek: number): string {
    const rahukaalTimes = [
      '4:30 PM - 6:00 PM',  // Sunday
      '7:30 AM - 9:00 AM',  // Monday
      '3:00 PM - 4:30 PM',  // Tuesday
      '12:00 PM - 1:30 PM', // Wednesday
      '1:30 PM - 3:00 PM',  // Thursday
      '10:30 AM - 12:00 PM', // Friday
      '9:00 AM - 10:30 AM'  // Saturday
    ];
    return rahukaalTimes[dayOfWeek];
  }

  private checkAuspicious(tithiIndex: number, dayOfWeek: number, yogaIndex: number): boolean {
    // Ekadashi is always auspicious
    if (tithiIndex === 10) return true;
    // Tuesday = Hanuman day, Saturday = Shani day (for specific worship)
    if (dayOfWeek === 2 || dayOfWeek === 6) return true;
    // Siddhi, Shubha, Preeti yogas are auspicious
    if ([1, 15, 22].includes(yogaIndex)) return true;
    // Chaturthi for Ganesh
    if (tithiIndex === 3) return true;
    // General: more auspicious on certain tithis
    return [0, 1, 2, 4, 6, 9, 10, 12].includes(tithiIndex);
  }

  private getSpecialMessage(tithiIndex: number, dayOfWeek: number, paksha: string): { message: string; messageHi: string } {
    // Special day-tithi combinations
    if (tithiIndex === 10) { // Ekadashi
      return {
        message: '🙏 Today is Ekadashi — a sacred fasting day dedicated to Lord Vishnu. Extra merit for prayers today!',
        messageHi: '🙏 आज एकादशी है — भगवान विष्णु को समर्पित पवित्र उपवास दिवस। आज की प्रार्थना का विशेष फल मिलता है!'
      };
    }
    if (tithiIndex === 14 && paksha === 'Shukla') { // Purnima
      return {
        message: '🌕 Today is Purnima (Full Moon) — An auspicious day for worship and charity. Your prayers have extra power!',
        messageHi: '🌕 आज पूर्णिमा है — पूजा और दान के लिए शुभ दिन। आपकी प्रार्थनाओं में विशेष शक्ति है!'
      };
    }
    if (tithiIndex === 14 && paksha === 'Krishna') { // Amavasya
      return {
        message: '🌑 Today is Amavasya (New Moon) — Light diyas to dispel darkness. Ancestors are remembered today.',
        messageHi: '🌑 आज अमावस्या है — अंधकार दूर करने के लिए दीये जलाएं। आज पितरों का स्मरण करें।'
      };
    }
    if (dayOfWeek === 2) { // Tuesday
      return {
        message: '🔱 Today is Mangalvar — Hanuman Ji\'s special day! Recite Hanuman Chalisa for divine blessings.',
        messageHi: '🔱 आज मंगलवार है — हनुमान जी का विशेष दिन! हनुमान चालीसा का पाठ करें।'
      };
    }
    if (dayOfWeek === 4) { // Thursday
      return {
        message: '💛 Today is Guruvar — Worship Lord Vishnu and Brihaspati Dev for wisdom and prosperity.',
        messageHi: '💛 आज गुरुवार है — ज्ञान और समृद्धि के लिए भगवान विष्णु और बृहस्पति देव की पूजा करें।'
      };
    }
    if (dayOfWeek === 1) { // Monday
      return {
        message: '🔱 Today is Somvar — Lord Shiva\'s day! Offer Bilva leaves and chant Om Namah Shivaya.',
        messageHi: '🔱 आज सोमवार है — भगवान शिव का दिन! बिल्व पत्र अर्पित करें और ॐ नमः शिवाय का जाप करें।'
      };
    }
    if (dayOfWeek === 5) { // Friday
      return {
        message: '🌸 Today is Shukravar — Goddess Lakshmi & Durga Ma\'s day! Offer flowers and light diyas.',
        messageHi: '🌸 आज शुक्रवार है — लक्ष्मी माता और दुर्गा माँ का दिन! फूल चढ़ाएं और दीये जलाएं।'
      };
    }
    if (dayOfWeek === 3) { // Wednesday
      return {
        message: '🟢 Today is Budhvar — Lord Ganesha\'s day! Start new endeavors with Ganpati Bappa\'s blessings.',
        messageHi: '🟢 आज बुधवार है — गणेश जी का दिन! गणपति बप्पा के आशीर्वाद से नए काम शुरू करें।'
      };
    }
    if (dayOfWeek === 6) { // Saturday
      return {
        message: '💜 Today is Shanivar — Offer oil lamps and help the needy. Lord Hanuman protects from Shani Dosh.',
        messageHi: '💜 आज शनिवार है — तेल के दीये जलाएं और ज़रूरतमंदों की मदद करें। हनुमान जी शनि दोष से रक्षा करते हैं।'
      };
    }
    // Sunday
    return {
      message: '☀️ Today is Ravivar — Sun God\'s day! Offer water to the rising sun and seek health & vitality.',
      messageHi: '☀️ आज रविवार है — सूर्य देव का दिन! उगते सूर्य को जल अर्पित करें और स्वास्थ्य की कामना करें।'
    };
  }

  /**
   * Load upcoming festivals for the current year
   */
  private loadFestivals(): void {
    const year = new Date().getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const festivals: HinduFestival[] = [
      {
        name: 'Makar Sankranti', nameHi: 'मकर संक्रांति',
        date: new Date(year, 0, 14),
        description: 'Harvest festival celebrating the sun\'s journey into Capricorn',
        descriptionHi: 'सूर्य के मकर राशि में प्रवेश का त्योहार',
        deity: 'Surya', emoji: '☀️',
        rituals: ['Fly kites', 'Eat til-gur', 'Take holy dip'],
        ritualsHi: ['पतंग उड़ाएं', 'तिल-गुड़ खाएं', 'पवित्र स्नान करें'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Vasant Panchami', nameHi: 'वसंत पंचमी',
        date: new Date(year, 1, 2),
        description: 'Festival of Goddess Saraswati — knowledge and arts',
        descriptionHi: 'सरस्वती माता का त्योहार — ज्ञान और कला',
        deity: 'Saraswati', emoji: '📚',
        rituals: ['Wear yellow', 'Worship books', 'Pray to Saraswati'],
        ritualsHi: ['पीले वस्त्र पहनें', 'पुस्तकों की पूजा करें', 'सरस्वती वंदना करें'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Maha Shivaratri', nameHi: 'महाशिवरात्रि',
        date: new Date(year, 1, 26),
        description: 'The great night of Lord Shiva — fasting and all-night worship',
        descriptionHi: 'भगवान शिव की महान रात्रि — उपवास और रात्रि जागरण',
        deity: 'Shiva', emoji: '🔱',
        rituals: ['Fast all day', 'Pour milk on Shivling', 'Chant Om Namah Shivaya', 'Stay awake all night'],
        ritualsHi: ['पूरे दिन उपवास करें', 'शिवलिंग पर दूध चढ़ाएं', 'ॐ नमः शिवाय का जाप करें', 'रात भर जागें'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Holi', nameHi: 'होली',
        date: new Date(year, 2, 14),
        description: 'Festival of colors celebrating the triumph of good over evil',
        descriptionHi: 'रंगों का त्योहार — बुराई पर अच्छाई की जीत',
        deity: 'Krishna', emoji: '🎨',
        rituals: ['Play with colors', 'Holika Dahan bonfire', 'Drink thandai'],
        ritualsHi: ['रंगों से खेलें', 'होलिका दहन', 'ठंडाई पिएं'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Ram Navami', nameHi: 'राम नवमी',
        date: new Date(year, 3, 6),
        description: 'Birth of Lord Rama — ideal king and avatar of Vishnu',
        descriptionHi: 'भगवान राम का जन्मदिन — आदर्श राजा और विष्णु अवतार',
        deity: 'Rama', emoji: '🏹',
        rituals: ['Read Ramayana', 'Fast until noon', 'Visit Ram temple'],
        ritualsHi: ['रामायण पढ़ें', 'दोपहर तक उपवास', 'राम मंदिर जाएं'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Hanuman Jayanti', nameHi: 'हनुमान जयंती',
        date: new Date(year, 3, 15),
        description: 'Birthday of Lord Hanuman — the mighty devotee of Lord Rama',
        descriptionHi: 'हनुमान जी का जन्मदिन — भगवान राम के परम भक्त',
        deity: 'Hanuman', emoji: '🙏',
        rituals: ['Recite Hanuman Chalisa', 'Apply sindoor', 'Offer laddoo'],
        ritualsHi: ['हनुमान चालीसा पढ़ें', 'सिंदूर लगाएं', 'लड्डू अर्पित करें'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Raksha Bandhan', nameHi: 'रक्षा बंधन',
        date: new Date(year, 7, 9),
        description: 'Bond of protection between siblings',
        descriptionHi: 'भाई-बहन के प्यार का बंधन',
        deity: 'All', emoji: '🧵',
        rituals: ['Tie rakhi', 'Exchange gifts', 'Family feast'],
        ritualsHi: ['राखी बांधें', 'उपहार दें', 'परिवार के साथ भोजन'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Janmashtami', nameHi: 'जन्माष्टमी',
        date: new Date(year, 7, 16),
        description: 'Birth of Lord Krishna — the divine playmaker',
        descriptionHi: 'भगवान कृष्ण का जन्मदिन — दिव्य लीलाधारी',
        deity: 'Krishna', emoji: '🦚',
        rituals: ['Fast until midnight', 'Sing bhajans', 'Dahi Handi', 'Midnight celebration'],
        ritualsHi: ['मध्यरात्रि तक उपवास', 'भजन गाएं', 'दही हांडी', 'मध्यरात्रि उत्सव'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Ganesh Chaturthi', nameHi: 'गणेश चतुर्थी',
        date: new Date(year, 8, 7),
        description: 'Birthday of Lord Ganesha — the remover of obstacles',
        descriptionHi: 'गणेश जी का जन्मदिन — विघ्नहर्ता',
        deity: 'Ganesh', emoji: '🐘',
        rituals: ['Install Ganesh idol', 'Offer modak', 'Chant Ganesh Atharvashirsha'],
        ritualsHi: ['गणेश प्रतिमा स्थापित करें', 'मोदक अर्पित करें', 'गणेश अथर्वशीर्ष का पाठ करें'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Navratri Begins', nameHi: 'नवरात्रि आरंभ',
        date: new Date(year, 9, 2),
        description: '9 nights of Goddess Durga — fasting, prayer, and celebration',
        descriptionHi: 'दुर्गा माँ की 9 रातें — उपवास, प्रार्थना और उत्सव',
        deity: 'Durga', emoji: '🔥',
        rituals: ['Fast for 9 days', 'Garba/Dandiya dance', 'Daily Durga puja'],
        ritualsHi: ['9 दिन का उपवास', 'गरबा/डांडिया', 'दैनिक दुर्गा पूजा'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Dussehra', nameHi: 'दशहरा',
        date: new Date(year, 9, 12),
        description: 'Victory of Rama over Ravana — triumph of dharma',
        descriptionHi: 'राम की रावण पर विजय — धर्म की जीत',
        deity: 'Rama', emoji: '🏹',
        rituals: ['Burn Ravana effigies', 'Watch Ramlila', 'Cross boundaries (Seemollanghan)'],
        ritualsHi: ['रावण दहन', 'रामलीला देखें', 'सीमोल्लंघन करें'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Diwali', nameHi: 'दिवाली',
        date: new Date(year, 10, 1),
        description: 'Festival of lights — Lord Rama\'s return to Ayodhya',
        descriptionHi: 'दीपों का त्योहार — भगवान राम की अयोध्या वापसी',
        deity: 'All', emoji: '🪔',
        rituals: ['Light diyas everywhere', 'Lakshmi-Ganesh puja', 'Burst crackers', 'Exchange sweets'],
        ritualsHi: ['दीये जलाएं', 'लक्ष्मी-गणेश पूजा', 'पटाखे', 'मिठाई बांटें'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Govardhan Puja', nameHi: 'गोवर्धन पूजा',
        date: new Date(year, 10, 2),
        description: 'Krishna lifted Govardhan mountain to protect villagers',
        descriptionHi: 'कृष्ण ने ग्रामवासियों की रक्षा के लिए गोवर्धन पर्वत उठाया',
        deity: 'Krishna', emoji: '⛰️',
        rituals: ['Prepare annakut', 'Worship Govardhan', 'Feed cows'],
        ritualsHi: ['अन्नकूट बनाएं', 'गोवर्धन पूजा', 'गायों को खिलाएं'],
        isToday: false, daysAway: 0
      },
      {
        name: 'Dev Deepawali', nameHi: 'देव दीपावली',
        date: new Date(year, 10, 15),
        description: 'When the Gods celebrate Diwali — Ganga Ghats illuminated',
        descriptionHi: 'जब देवता दिवाली मनाते हैं — गंगा घाट दीपों से जगमगाते हैं',
        deity: 'Shiva', emoji: '✨',
        rituals: ['Light diyas on riverbank', 'Visit Varanasi virtually', 'Special prayers'],
        ritualsHi: ['नदी तट पर दीये जलाएं', 'वाराणसी दर्शन', 'विशेष प्रार्थना'],
        isToday: false, daysAway: 0
      }
    ];

    // Calculate days away and isToday
    festivals.forEach(f => {
      const festDate = new Date(f.date);
      festDate.setHours(0, 0, 0, 0);
      const diff = festDate.getTime() - today.getTime();
      f.daysAway = Math.ceil(diff / (1000 * 60 * 60 * 24));
      f.isToday = f.daysAway === 0;
      
      // If festival already passed this year, set to next year
      if (f.daysAway < 0) {
        f.date = new Date(year + 1, f.date.getMonth(), f.date.getDate());
        const newDiff = f.date.getTime() - today.getTime();
        f.daysAway = Math.ceil(newDiff / (1000 * 60 * 60 * 24));
      }
    });

    // Sort by closest first
    festivals.sort((a, b) => a.daysAway - b.daysAway);
    this.festivalsSubject.next(festivals);
  }

  /**
   * Get today's festival if any
   */
  getTodaysFestival(): HinduFestival | null {
    return this.festivalsSubject.value.find(f => f.isToday) || null;
  }

  /**
   * Get next N upcoming festivals
   */
  getUpcomingFestivals(count: number = 5): HinduFestival[] {
    return this.festivalsSubject.value.filter(f => f.daysAway >= 0).slice(0, count);
  }

  /**
   * Get the recommended deity for today
   */
  getTodaysDeity(): { name: string; nameHi: string; id: string } {
    const day = new Date().getDay();
    const deityMap: { name: string; nameHi: string; id: string }[] = [
      { name: 'Surya Dev', nameHi: 'सूर्य देव', id: 'hanuman' },
      { name: 'Lord Shiva', nameHi: 'भगवान शिव', id: 'shiva' },
      { name: 'Hanuman Ji', nameHi: 'हनुमान जी', id: 'hanuman' },
      { name: 'Lord Ganesha', nameHi: 'गणेश जी', id: 'ganesh' },
      { name: 'Lord Krishna', nameHi: 'भगवान कृष्ण', id: 'krishna' },
      { name: 'Durga Ma', nameHi: 'दुर्गा माँ', id: 'durga' },
      { name: 'Hanuman Ji', nameHi: 'हनुमान जी', id: 'hanuman' }
    ];
    return deityMap[day];
  }
}
