import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LanguageService } from '../../services/language.service';

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
    }
  ];

  constructor(public lang: LanguageService) {}

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
