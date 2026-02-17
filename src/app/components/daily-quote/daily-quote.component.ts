import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LanguageService } from '../../services/language.service';
import { SmartShareService } from '../../services/smart-share.service';
import { DailyEngagementService } from '../../services/daily-engagement.service';

interface SpiritualQuote {
  text: string;
  textHi: string;
  source: string;
  sourceHi: string;
  icon: string;
}

@Component({
  selector: 'app-daily-quote',
  templateUrl: './daily-quote.component.html',
  styleUrls: ['./daily-quote.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DailyQuoteComponent implements OnInit {
  currentQuote: SpiritualQuote | null = null;
  isExpanded = false;

  private quotes: SpiritualQuote[] = [
    {
      text: "Whatever happened, happened for the good. Whatever is happening, is happening for the good. Whatever will happen, will also happen for the good.",
      textHi: "जो हुआ, अच्छे के लिए हुआ। जो हो रहा है, अच्छे के लिए हो रहा है। जो होगा, वह भी अच्छे के लिए होगा।",
      source: "Bhagavad Gita",
      sourceHi: "भगवद्गीता",
      icon: "📖"
    },
    {
      text: "When you feel my presence in everything, you will feel fear of nothing.",
      textHi: "जब तुम हर चीज़ में मेरी उपस्थिति महसूस करोगे, तो किसी भी चीज़ से डर नहीं लगेगा।",
      source: "Lord Hanuman",
      sourceHi: "हनुमान जी",
      icon: "🙏"
    },
    {
      text: "Rise above all obstacles with faith. Nothing is impossible for one who has unwavering devotion.",
      textHi: "विश्वास के साथ सभी बाधाओं से ऊपर उठो। जिसकी भक्ति अटल है, उसके लिए कुछ भी असंभव नहीं।",
      source: "Lord Ganesha",
      sourceHi: "गणेश जी",
      icon: "🙏"
    },
    {
      text: "Do your duty without attachment to the results. This is the path to peace and liberation.",
      textHi: "फल की चिंता किए बिना अपना कर्तव्य करो। यही शांति और मुक्ति का मार्ग है।",
      source: "Bhagavad Gita",
      sourceHi: "भगवद्गीता",
      icon: "📖"
    },
    {
      text: "Where there is faith, there is love. Where there is love, there is peace. Where there is peace, there is God.",
      textHi: "जहाँ विश्वास है, वहाँ प्रेम है। जहाँ प्रेम है, वहाँ शांति है। जहाँ शांति है, वहाँ भगवान है।",
      source: "Ancient Wisdom",
      sourceHi: "प्राचीन ज्ञान",
      icon: "✨"
    },
    {
      text: "The mind is everything. What you think, you become.",
      textHi: "मन ही सब कुछ है। जो तुम सोचते हो, वही तुम बन जाते हो।",
      source: "Lord Buddha",
      sourceHi: "भगवान बुद्ध",
      icon: "🧘"
    },
    {
      text: "In the stillness of the mind, the divine speaks. Meditate and listen.",
      textHi: "मन की शांति में परमात्मा बोलता है। ध्यान करो और सुनो।",
      source: "Patanjali",
      sourceHi: "पतंजलि",
      icon: "🕉️"
    },
    {
      text: "Anger is the enemy of wisdom. A calm mind sees the truth clearly.",
      textHi: "क्रोध ज्ञान का शत्रु है। शांत मन सत्य को स्पष्ट देखता है।",
      source: "Chanakya",
      sourceHi: "चाणक्य",
      icon: "🦉"
    },
    {
      text: "Courage is not the absence of fear, but acting despite it with faith in the divine.",
      textHi: "साहस डर की अनुपस्थिति नहीं है, बल्कि ईश्वर में विश्वास के साथ डर के बावजूद काम करना है।",
      source: "Lord Hanuman",
      sourceHi: "हनुमान जी",
      icon: "🦸"
    },
    {
      text: "True wealth is not measured by possessions, but by the contentment in one's heart.",
      textHi: "सच्ची संपत्ति सम्पत्तियों से नहीं, बल्कि हृदय की संतुष्टि से मापी जाती है।",
      source: "Vedas",
      sourceHi: "वेद",
      icon: "💎"
    },
    {
      text: "Before every new beginning, there must be an ending. Embrace change as divine will.",
      textHi: "हर नई शुरुआत से पहले, एक अंत होना चाहिए। परिवर्तन को दिव्य इच्छा के रूप में स्वीकार करो।",
      source: "Lord Ganesha",
      sourceHi: "गणेश जी",
      icon: "🌅"
    },
    {
      text: "Service to others is the highest form of worship.",
      textHi: "दूसरों की सेवा पूजा का सर्वोच्च रूप है।",
      source: "Swami Vivekananda",
      sourceHi: "स्वामी विवेकानंद",
      icon: "🙌"
    },
    {
      text: "Like the lotus that rises from muddy waters, rise above your circumstances with grace.",
      textHi: "कीचड़ से उठने वाले कमल की तरह, अपनी परिस्थितियों से शान से ऊपर उठो।",
      source: "Hindu Wisdom",
      sourceHi: "हिंदू ज्ञान",
      icon: "🪷"
    },
    {
      text: "Prayer is not asking for what you want. It is asking for what is right.",
      textHi: "प्रार्थना वह नहीं है जो आप चाहते हैं। यह वह माँगना है जो सही है।",
      source: "Spiritual Teaching",
      sourceHi: "आध्यात्मिक शिक्षा",
      icon: "🙏"
    },
    // === BHAGAVAD GITA QUOTES ===
    {
      text: "You have the right to perform your duties, but you are not entitled to the fruits of your actions.",
      textHi: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। तुम्हें केवल कर्म करने का अधिकार है, फल पर नहीं।",
      source: "Bhagavad Gita 2.47",
      sourceHi: "भगवद्गीता 2.47",
      icon: "📖"
    },
    {
      text: "The soul is neither born, nor does it ever die. It is eternal, unchangeable, and ancient.",
      textHi: "आत्मा न कभी जन्मती है, न मरती है। यह शाश्वत, अपरिवर्तनीय और पुरातन है।",
      source: "Bhagavad Gita 2.20",
      sourceHi: "भगवद्गीता 2.20",
      icon: "📖"
    },
    {
      text: "Set thy heart upon thy work, but never on its reward.",
      textHi: "अपना मन काम पर लगाओ, पर उसके फल पर कभी नहीं।",
      source: "Bhagavad Gita 2.47",
      sourceHi: "भगवद्गीता 2.47",
      icon: "📖"
    },
    {
      text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
      textHi: "जब ध्यान में सिद्धि प्राप्त होती है, तो मन हवारहित स्थान में दीपक की लौ जैसा स्थिर हो जाता है।",
      source: "Bhagavad Gita 6.19",
      sourceHi: "भगवद्गीता 6.19",
      icon: "🪔"
    },
    {
      text: "I am the beginning, the middle, and the end of all beings.",
      textHi: "मैं सभी प्राणियों का आदि, मध्य और अंत हूँ।",
      source: "Bhagavad Gita 10.20",
      sourceHi: "भगवद्गीता 10.20",
      icon: "🕉️"
    },
    {
      text: "A person can rise through the efforts of his own mind; he can also degrade himself.",
      textHi: "व्यक्ति अपने मन के प्रयासों से ऊपर उठ सकता है; वह स्वयं को गिरा भी सकता है।",
      source: "Bhagavad Gita 6.5",
      sourceHi: "भगवद्गीता 6.5",
      icon: "📖"
    },
    {
      text: "Reshape yourself through the power of your will. Those who have conquered themselves live in peace.",
      textHi: "अपनी इच्छा शक्ति से स्वयं को बदलो। जिन्होंने स्वयं को जीता है, वे शांति में जीते हैं।",
      source: "Bhagavad Gita 6.6",
      sourceHi: "भगवद्गीता 6.6",
      icon: "📖"
    },
    {
      text: "There is neither this world, nor the world beyond. Happiness belongs to those who are self-controlled.",
      textHi: "न यह संसार है, न परलोक। सुख उनका है जो आत्म-नियंत्रित हैं।",
      source: "Bhagavad Gita 4.40",
      sourceHi: "भगवद्गीता 4.40",
      icon: "📖"
    },
    // === HANUMAN QUOTES ===
    {
      text: "Ram's grace makes the impossible possible. Have faith and keep walking.",
      textHi: "राम की कृपा असंभव को संभव बनाती है। विश्वास रखो और चलते रहो।",
      source: "Hanuman Chalisa",
      sourceHi: "हनुमान चालीसा",
      icon: "🙏"
    },
    {
      text: "The devotee who surrenders completely is never abandoned by the divine.",
      textHi: "जो भक्त पूर्ण समर्पण करता है, उसे परमात्मा कभी नहीं छोड़ते।",
      source: "Lord Hanuman",
      sourceHi: "हनुमान जी",
      icon: "🙏"
    },
    {
      text: "Strength of body comes from strength of mind. And strength of mind comes from devotion.",
      textHi: "शरीर की शक्ति मन की शक्ति से आती है। और मन की शक्ति भक्ति से आती है।",
      source: "Hanuman Ji",
      sourceHi: "हनुमान जी",
      icon: "💪"
    },
    // === SHIVA QUOTES ===
    {
      text: "Destruction of the old is creation of the new. Every ending is a new beginning.",
      textHi: "पुराने का विनाश नए का निर्माण है। हर अंत एक नई शुरुआत है।",
      source: "Lord Shiva",
      sourceHi: "भगवान शिव",
      icon: "🔱"
    },
    {
      text: "I am the silence between the thoughts. Find me there.",
      textHi: "मैं विचारों के बीच की शांति हूँ। मुझे वहीं खोजो।",
      source: "Lord Shiva",
      sourceHi: "भगवान शिव",
      icon: "🔱"
    },
    {
      text: "The universe is within you. The whole cosmos is playing inside your consciousness.",
      textHi: "ब्रह्मांड तुम्हारे अंदर है। पूरा संसार तुम्हारी चेतना में खेल रहा है।",
      source: "Shiv Purana",
      sourceHi: "शिव पुराण",
      icon: "🔱"
    },
    // === KRISHNA QUOTES ===
    {
      text: "Whenever dharma declines and evil rises, I incarnate to restore balance.",
      textHi: "जब-जब धर्म की हानि होती है और अधर्म बढ़ता है, तब-तब मैं अवतार लेता हूँ।",
      source: "Lord Krishna, Gita 4.7",
      sourceHi: "भगवान कृष्ण, गीता 4.7",
      icon: "🦚"
    },
    {
      text: "Do not let the fruits of action be your motive, but do not be attached to inaction either.",
      textHi: "कर्मफल को अपना उद्देश्य मत बनाओ, लेकिन अकर्मण्यता में भी आसक्त मत होओ।",
      source: "Lord Krishna",
      sourceHi: "भगवान कृष्ण",
      icon: "🦚"
    },
    {
      text: "I am the taste of water, the light of the sun and the moon, the syllable Om in the Vedic mantras.",
      textHi: "मैं जल का स्वाद हूँ, सूर्य और चंद्रमा का प्रकाश हूँ, वैदिक मंत्रों में ओम का अक्षर हूँ।",
      source: "Lord Krishna, Gita 7.8",
      sourceHi: "भगवान कृष्ण, गीता 7.8",
      icon: "🦚"
    },
    // === DURGA/DEVI QUOTES ===
    {
      text: "The divine feminine is the source of all creation. Respect, honor, and worship the shakti within.",
      textHi: "दिव्य स्त्री शक्ति सृष्टि का स्रोत है। अपने अंदर की शक्ति का सम्मान करें।",
      source: "Devi Mahatmya",
      sourceHi: "देवी महात्म्य",
      icon: "🌺"
    },
    {
      text: "Fear not, for I am with you. No evil can touch the one who takes refuge in me.",
      textHi: "डरो मत, क्योंकि मैं तुम्हारे साथ हूँ। जो मेरी शरण में आता है, उसे कोई बुराई छू नहीं सकती।",
      source: "Maa Durga",
      sourceHi: "माँ दुर्गा",
      icon: "🌺"
    },
    // === GANESH QUOTES ===
    {
      text: "Every new beginning starts with the removal of obstacles. Trust in Ganesha.",
      textHi: "हर नई शुरुआत बाधाओं को हटाने से होती है। गणेश जी पर विश्वास रखें।",
      source: "Lord Ganesha",
      sourceHi: "गणेश जी",
      icon: "🐘"
    },
    {
      text: "Big or small, Ganesha removes all obstacles for those who call upon him with love.",
      textHi: "बड़ी हो या छोटी, गणेश जी उन सभी बाधाओं को हटाते हैं जो प्रेम से उन्हें पुकारते हैं।",
      source: "Ganesh Purana",
      sourceHi: "गणेश पुराण",
      icon: "🐘"
    },
    // === SWAMI VIVEKANANDA ===
    {
      text: "Arise, awake, and stop not till the goal is reached.",
      textHi: "उठो, जागो, और लक्ष्य प्राप्त होने तक मत रुको।",
      source: "Swami Vivekananda",
      sourceHi: "स्वामी विवेकानंद",
      icon: "🔥"
    },
    {
      text: "In a conflict between the heart and the brain, follow your heart.",
      textHi: "हृदय और मस्तिष्क के बीच संघर्ष में, अपने हृदय का अनुसरण करो।",
      source: "Swami Vivekananda",
      sourceHi: "स्वामी विवेकानंद",
      icon: "🔥"
    },
    {
      text: "All the powers in the universe are already ours. It is we who have put our hands before our eyes and cry that it is dark.",
      textHi: "ब्रह्मांड की सारी शक्तियाँ पहले से हमारी हैं। हम ही हैं जिन्होंने अपनी आँखों के सामने हाथ रख लिए और रोते हैं कि अंधेरा है।",
      source: "Swami Vivekananda",
      sourceHi: "स्वामी विवेकानंद",
      icon: "🔥"
    },
    {
      text: "The greatest religion is to be true to your own nature. Have faith in yourselves.",
      textHi: "सबसे बड़ा धर्म अपने स्वभाव के प्रति सच्चा होना है। अपने आप पर विश्वास रखो।",
      source: "Swami Vivekananda",
      sourceHi: "स्वामी विवेकानंद",
      icon: "🔥"
    },
    // === KABIR & SANT QUOTES ===
    {
      text: "Don't find God in temples alone. He lives within you, closer than your own breath.",
      textHi: "ईश्वर को केवल मंदिरों में मत खोजो। वह तुम्हारे अंदर बसता है, तुम्हारी साँसों से भी करीब।",
      source: "Kabir Das",
      sourceHi: "कबीर दास",
      icon: "🕉️"
    },
    {
      text: "Yesterday is gone, tomorrow is not here yet. All you have is today. Make it count.",
      textHi: "कल बीत गया, कल अभी आया नहीं। तुम्हारे पास बस आज है। इसे सार्थक बनाओ।",
      source: "Kabir Das",
      sourceHi: "कबीर दास",
      icon: "🕉️"
    },
    {
      text: "Drop by drop, the ocean is filled. Petal by petal, the flower blooms. Step by step, the devotee rises.",
      textHi: "बूँद-बूँद से सागर भरता है। पंखुड़ी-पंखुड़ी से फूल खिलता है। कदम-कदम से भक्त ऊपर उठता है।",
      source: "Sant Tulsidas",
      sourceHi: "संत तुलसीदास",
      icon: "🌸"
    },
    {
      text: "The world is a garden. God is the gardener. We are the flowers. Let yourself bloom.",
      textHi: "संसार एक बगीचा है। ईश्वर माली है। हम फूल हैं। अपने आप को खिलने दो।",
      source: "Guru Nanak",
      sourceHi: "गुरु नानक",
      icon: "🌷"
    },
    // === UPANISHAD QUOTES ===
    {
      text: "From darkness, lead me to light. From ignorance, lead me to knowledge. From death, lead me to immortality.",
      textHi: "तमसो मा ज्योतिर्गमय। अज्ञान से ज्ञान की ओर ले चलो। मृत्यु से अमरत्व की ओर ले चलो।",
      source: "Brihadaranyaka Upanishad",
      sourceHi: "बृहदारण्यक उपनिषद",
      icon: "🕉️"
    },
    {
      text: "You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed.",
      textHi: "तुम वही हो जो तुम्हारी गहरी इच्छा है। जैसी इच्छा, वैसा संकल्प। जैसा संकल्प, वैसा कर्म।",
      source: "Brihadaranyaka Upanishad",
      sourceHi: "बृहदारण्यक उपनिषद",
      icon: "🕉️"
    },
    {
      text: "The Self is not born, it does not die. It is without cause and is eternal. It remains even when the body is destroyed.",
      textHi: "आत्मा न जन्मती है, न मरती है। यह अकारण और शाश्वत है। शरीर नष्ट होने पर भी यह बनी रहती है।",
      source: "Katha Upanishad",
      sourceHi: "कठ उपनिषद",
      icon: "🕉️"
    },
    // === RAMAYANA QUOTES ===
    {
      text: "He who has faith has everything. He who lacks faith lacks everything.",
      textHi: "जिसके पास विश्वास है उसके पास सब कुछ है। जिसमें विश्वास नहीं उसके पास कुछ नहीं।",
      source: "Ramcharitmanas",
      sourceHi: "रामचरितमानस",
      icon: "📜"
    },
    {
      text: "There is no dharma greater than truth, and no sin greater than falsehood.",
      textHi: "सत्य से बड़ा कोई धर्म नहीं, और असत्य से बड़ा कोई पाप नहीं।",
      source: "Ramcharitmanas",
      sourceHi: "रामचरितमानस",
      icon: "📜"
    },
    // === PRACTICAL WISDOM ===
    {
      text: "Forgiveness is the fragrance that a flower gives to the foot that crushes it.",
      textHi: "क्षमा वह सुगंध है जो एक फूल उस पैर को देता है जो उसे कुचलता है।",
      source: "Hindu Wisdom",
      sourceHi: "हिंदू ज्ञान",
      icon: "🌸"
    },
    {
      text: "Let go of what you cannot control. Focus on what you can — your actions, your thoughts, your devotion.",
      textHi: "जो आपके नियंत्रण में नहीं है उसे छोड़ दो। जो आप कर सकते हो उस पर ध्यान दो — कर्म, विचार, भक्ति।",
      source: "Spiritual Teaching",
      sourceHi: "आध्यात्मिक शिक्षा",
      icon: "🧘"
    },
    {
      text: "Gratitude turns what we have into enough. Count your blessings, not your problems.",
      textHi: "कृतज्ञता हमारे पास जो है उसे पर्याप्त बना देती है। अपनी समस्याएं नहीं, आशीर्वाद गिनो।",
      source: "Ancient Wisdom",
      sourceHi: "प्राचीन ज्ञान",
      icon: "✨"
    },
    {
      text: "Your thoughts create your reality. Think divine thoughts, and divinity will manifest around you.",
      textHi: "आपके विचार आपकी वास्तविकता बनाते हैं। दिव्य विचार करो, और दिव्यता आपके चारों ओर प्रकट होगी।",
      source: "Vedantic Teaching",
      sourceHi: "वेदांत शिक्षा",
      icon: "💫"
    },
    {
      text: "Happiness is not something ready-made. It comes from your own actions and your own devotion.",
      textHi: "खुशी कोई तैयार चीज़ नहीं है। यह आपके कर्मों और भक्ति से आती है।",
      source: "Spiritual Wisdom",
      sourceHi: "आध्यात्मिक ज्ञान",
      icon: "😊"
    },
    {
      text: "A moment of patience in a moment of anger saves you a hundred moments of regret.",
      textHi: "क्रोध के क्षण में एक पल का धैर्य आपको सौ पलों के पछतावे से बचाता है।",
      source: "Chanakya Niti",
      sourceHi: "चाणक्य नीति",
      icon: "🦉"
    },
    {
      text: "The river does not drink its own water; the tree does not eat its own fruit. Live for others.",
      textHi: "नदी अपना जल नहीं पीती; वृक्ष अपना फल नहीं खाता। दूसरों के लिए जियो।",
      source: "Hindu Wisdom",
      sourceHi: "हिंदू ज्ञान",
      icon: "🌳"
    },
    {
      text: "Speak truth. Practice dharma. Do not neglect your daily worship. This is the threefold path.",
      textHi: "सत्य बोलो। धर्म का पालन करो। दैनिक पूजा की उपेक्षा न करो। यही त्रिपथ है।",
      source: "Taittiriya Upanishad",
      sourceHi: "तैत्तिरीय उपनिषद",
      icon: "🕉️"
    }
  ];

  constructor(
    public lang: LanguageService,
    private shareService: SmartShareService,
    private engagement: DailyEngagementService
  ) {}

  ngOnInit(): void {
    this.setDailyQuote();
  }

  private setDailyQuote(): void {
    // Use date-based selection so same quote appears all day
    const today = new Date();
    const dayOfYear = this.getDayOfYear(today);
    const quoteIndex = dayOfYear % this.quotes.length;
    this.currentQuote = this.quotes[quoteIndex];
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.engagement.recordAction('quote');
    }
  }

  shareQuote(event: Event): void {
    event.stopPropagation();
    if (this.currentQuote) {
      const quoteText = this.getQuoteText();
      const source = this.getQuoteSource();
      this.shareService.shareBlessingOnWhatsApp(`"${quoteText}" — ${source}`);
    }
  }

  getQuoteText(): string {
    if (!this.currentQuote) return '';
    return this.lang.getCurrentLanguage() === 'hi' 
      ? this.currentQuote.textHi 
      : this.currentQuote.text;
  }

  getQuoteSource(): string {
    if (!this.currentQuote) return '';
    return this.lang.getCurrentLanguage() === 'hi' 
      ? this.currentQuote.sourceHi 
      : this.currentQuote.source;
  }
}
