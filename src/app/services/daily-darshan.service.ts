import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Daily Darshan Service
 * Provides daily deity darshan with different moods/themes
 * based on time of day, creating the "pull" to come back
 */

export interface DarshanMood {
  id: string;
  name: string;
  nameHi: string;
  timeRange: string;
  greeting: string;
  greetingHi: string;
  mantra: string;
  mantraHi: string;
  atmosphere: string; // CSS class
  emoji: string;
  prayerSuggestion: string;
  prayerSuggestionHi: string;
}

@Injectable({
  providedIn: 'root'
})
export class DailyDarshanService {
  private currentMoodSubject = new BehaviorSubject<DarshanMood>(this.getCurrentMood());
  public currentMood$ = this.currentMoodSubject.asObservable();

  private readonly MOODS: DarshanMood[] = [
    {
      id: 'brahma_muhurta',
      name: 'Brahma Muhurta', nameHi: 'ब्रह्म मुहूर्त',
      timeRange: '4:00 AM - 5:30 AM',
      greeting: 'The most sacred time. Gods are closest now.',
      greetingHi: 'सबसे पवित्र समय। देवता अभी सबसे निकट हैं।',
      mantra: 'Om Brahmane Namah 🙏',
      mantraHi: 'ॐ ब्रह्मणे नमः 🙏',
      atmosphere: 'mood-brahma',
      emoji: '🌌',
      prayerSuggestion: 'Meditate in silence. This is the golden hour for spiritual practice.',
      prayerSuggestionHi: 'मौन में ध्यान करें। यह साधना का स्वर्णिम समय है।'
    },
    {
      id: 'sunrise',
      name: 'Sunrise Darshan', nameHi: 'प्रातःकालीन दर्शन',
      timeRange: '5:30 AM - 8:00 AM',
      greeting: 'Begin your day with divine blessings!',
      greetingHi: 'दिव्य आशीर्वाद के साथ दिन की शुरुआत करें!',
      mantra: 'Om Suryaya Namah ☀️',
      mantraHi: 'ॐ सूर्याय नमः ☀️',
      atmosphere: 'mood-sunrise',
      emoji: '🌅',
      prayerSuggestion: 'Offer water to the sun. Light a diya and start your day blessed.',
      prayerSuggestionHi: 'सूर्य को जल अर्पित करें। दीया जलाएं और दिन की शुभ शुरुआत करें।'
    },
    {
      id: 'morning',
      name: 'Morning Aarti', nameHi: 'प्रातः आरती',
      timeRange: '8:00 AM - 12:00 PM',
      greeting: 'Morning blessings are upon you!',
      greetingHi: 'प्रातःकालीन आशीर्वाद आप पर है!',
      mantra: 'Om Ganeshaya Namah 🙏',
      mantraHi: 'ॐ गणेशाय नमः 🙏',
      atmosphere: 'mood-morning',
      emoji: '🌞',
      prayerSuggestion: 'Ring the bell, offer flowers, and seek blessings for the day ahead.',
      prayerSuggestionHi: 'घंटी बजाएं, फूल चढ़ाएं, और आगे के दिन के लिए आशीर्वाद लें।'
    },
    {
      id: 'afternoon',
      name: 'Afternoon Peace', nameHi: 'दोपहर की शांति',
      timeRange: '12:00 PM - 4:00 PM',
      greeting: 'Pause. Breathe. Connect with the divine.',
      greetingHi: 'रुकें। साँस लें। परमात्मा से जुड़ें।',
      mantra: 'Om Shanti Shanti Shanti 🙏',
      mantraHi: 'ॐ शांति शांति शांति 🙏',
      atmosphere: 'mood-afternoon',
      emoji: '☀️',
      prayerSuggestion: 'Take a 5-minute meditation break. Refresh your soul.',
      prayerSuggestionHi: '5 मिनट ध्यान करें। अपनी आत्मा को ताज़ा करें।'
    },
    {
      id: 'evening',
      name: 'Sandhya Aarti', nameHi: 'संध्या आरती',
      timeRange: '4:00 PM - 7:00 PM',
      greeting: 'Evening aarti time! Light diyas and worship.',
      greetingHi: 'संध्या आरती का समय! दीये जलाएं और पूजा करें।',
      mantra: 'Om Jai Jagdish Hare 🪔',
      mantraHi: 'ॐ जय जगदीश हरे 🪔',
      atmosphere: 'mood-evening',
      emoji: '🌇',
      prayerSuggestion: 'This is the most powerful time for aarti. Light diyas and offer your gratitude.',
      prayerSuggestionHi: 'आरती के लिए सबसे शक्तिशाली समय। दीये जलाएं और कृतज्ञता अर्पित करें।'
    },
    {
      id: 'twilight',
      name: 'Twilight Prayer', nameHi: 'गोधूलि प्रार्थना',
      timeRange: '7:00 PM - 9:00 PM',
      greeting: 'Twilight blessings. The divine is listening.',
      greetingHi: 'गोधूलि का आशीर्वाद। परमात्मा सुन रहे हैं।',
      mantra: 'Om Namah Shivaya 🔱',
      mantraHi: 'ॐ नमः शिवाय 🔱',
      atmosphere: 'mood-twilight',
      emoji: '🌆',
      prayerSuggestion: 'Make a wish. Share blessings with your family. Read tonight\'s quote.',
      prayerSuggestionHi: 'मनोकामना करें। परिवार को आशीर्वाद दें। आज का विचार पढ़ें।'
    },
    {
      id: 'night',
      name: 'Night Worship', nameHi: 'रात्रि पूजा',
      timeRange: '9:00 PM - 12:00 AM',
      greeting: 'Under the stars, the divine embraces you.',
      greetingHi: 'तारों के नीचे, परमात्मा आपको गले लगा रहे हैं।',
      mantra: 'Om Namo Bhagavate Vasudevaya 🌙',
      mantraHi: 'ॐ नमो भगवते वासुदेवाय 🌙',
      atmosphere: 'mood-night',
      emoji: '🌙',
      prayerSuggestion: 'Reflect on your day. Express gratitude. Pray for peaceful sleep.',
      prayerSuggestionHi: 'अपने दिन पर विचार करें। कृतज्ञता व्यक्त करें। शांतिपूर्ण नींद की प्रार्थना करें।'
    },
    {
      id: 'late_night',
      name: 'Sacred Silence', nameHi: 'पवित्र मौन',
      timeRange: '12:00 AM - 4:00 AM',
      greeting: 'In the silence of the night, the soul speaks.',
      greetingHi: 'रात के सन्नाटे में, आत्मा बोलती है।',
      mantra: 'Om 🙏',
      mantraHi: 'ॐ 🙏',
      atmosphere: 'mood-sacred',
      emoji: '✨',
      prayerSuggestion: 'This is the time of deep meditation. If you\'re awake, the universe has called you.',
      prayerSuggestionHi: 'यह गहन ध्यान का समय है। यदि आप जागे हैं, तो ब्रह्मांड ने आपको बुलाया है।'
    }
  ];

  constructor() {
    // Refresh mood every 30 minutes
    setInterval(() => {
      this.currentMoodSubject.next(this.getCurrentMood());
    }, 30 * 60 * 1000);
  }

  getCurrentMood(): DarshanMood {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 5.5) return this.MOODS[0]; // Brahma Muhurta
    if (hour >= 5.5 && hour < 8) return this.MOODS[1]; // Sunrise
    if (hour >= 8 && hour < 12) return this.MOODS[2]; // Morning
    if (hour >= 12 && hour < 16) return this.MOODS[3]; // Afternoon
    if (hour >= 16 && hour < 19) return this.MOODS[4]; // Evening
    if (hour >= 19 && hour < 21) return this.MOODS[5]; // Twilight
    if (hour >= 21 && hour < 24) return this.MOODS[6]; // Night
    return this.MOODS[7]; // Late night (0-4)
  }

  /**
   * Get all daily moods/darshan times
   */
  getAllMoods(): DarshanMood[] {
    return this.MOODS;
  }
}
