import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeityType } from '../models/deity.model';

export interface Blessing {
  hindi: string;
  english: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlessingsService {
  // Universal blessings that work for all deities
  private readonly universalBlessings: Blessing[] = [
    { hindi: 'मन, वचन, कर्म में पवित्रता बनी रहे।', english: 'May purity dwell in thought, word, and deed.' },
    { hindi: 'भय दूर हो, विश्वास स्थिर हो।', english: 'Fear dissolves, faith remains firm.' },
    { hindi: 'कष्ट कटें, कृपा बरसें।', english: 'Compassion flows, pain subsides.' },
    { hindi: 'बुद्धि, बल, विवेक की वृद्धि हो।', english: 'Growth in intellect, strength, and discernment.' },
    { hindi: 'रोग-शोक दूर हों, आरोग्य प्राप्त हो।', english: 'Health, vitality, and peace of mind.' },
    { hindi: 'परिवार में सुख-शांति बनी रहे।', english: 'Harmony and happiness at home.' },
    { hindi: 'कार्य सिद्ध हों, मार्ग प्रशस्त हो।', english: 'Doors open, efforts bear fruit.' },
    { hindi: 'सात्त्विकता और धैर्य बढ़े।', english: 'Satvik thoughts and steady patience.' },
    { hindi: 'मनोकामनाएँ मंगलमय हों।', english: 'May your wishes turn auspicious.' },
    { hindi: 'सद्बुद्धि और सद्गति मिले।', english: 'Right understanding and noble path.' },
    { hindi: 'निश्छल भक्ति का वरदान मिले।', english: 'Blessing of pure devotion.' },
    { hindi: 'लक्ष्मी संग सदाचार का वास हो।', english: 'Prosperity with righteousness.' },
    { hindi: 'दीन-जन की सेवा का अवसर मिले।', english: 'Opportunity to serve the needy.' },
    { hindi: 'अध्ययन में प्रगति, कर्म में सफलता।', english: 'Progress in studies and work.' },
    { hindi: 'घर-आँगन में मंगल दीप जले।', english: 'May a lamp of goodness shine in your home.' },
    { hindi: 'सेवा में आनंद, कर्म में सिद्धि।', english: 'Joy in service, success in duty.' },
  ];

  // Deity-specific blessings
  private readonly deityBlessings: Record<DeityType, Blessing[]> = {
    [DeityType.HANUMAN]: [
      { hindi: 'श्री हनुमान जी आपकी रक्षा करें।', english: 'May Lord Hanuman protect you and your family.' },
      { hindi: 'संकट मोचन आपकी हर बाधा हरें।', english: 'May obstacles melt away by His grace.' },
      { hindi: 'पराक्रम और विनय साथ रहें।', english: 'Courage with humility, strength with wisdom.' },
      { hindi: 'प्रभु राम का स्मरण अखंड रहे।', english: 'Constant remembrance of Shri Ram.' },
      { hindi: '"जय बजरंगबली" से दिन शुभ हो।', english: 'Begin the day with "Jai Bajrang Bali."' },
      { hindi: 'भय-भ्रम-बंधन से मुक्ति।', english: 'Freedom from fear and bondage.' },
      { hindi: 'शुभ मार्गदर्शन सुलभ हो।', english: 'Timely guidance and right decisions.' },
      { hindi: 'स्वाभिमान और नम्रता संतुलित रहें।', english: 'Self-respect with humility.' },
    ],
    [DeityType.GANESH]: [
      { hindi: 'श्री गणेश आपके मार्ग की बाधाएं हरें।', english: 'May Lord Ganesha remove all obstacles from your path.' },
      { hindi: 'विघ्नहर्ता की कृपा सदा बनी रहे।', english: 'May the grace of Vighnaharta always be with you.' },
      { hindi: 'नई शुरुआत मंगलमय हो।', english: 'May every new beginning be auspicious.' },
      { hindi: 'बुद्धि और विवेक की वृद्धि हो।', english: 'May wisdom and discernment grow.' },
      { hindi: 'गणपति बप्पा मोरया!', english: 'Ganpati Bappa Morya!' },
      { hindi: 'सिद्धिविनायक आपकी हर कामना पूरी करें।', english: 'May Siddhivinayak fulfill your every wish.' },
      { hindi: 'मंगल मूर्ति की कृपा से सब कार्य सिद्ध हों।', english: 'May all endeavors succeed by the grace of Mangal Murti.' },
      { hindi: 'प्रथम पूज्य गणेश की जय!', english: 'Victory to Lord Ganesha, the first worshipped!' },
    ],
    [DeityType.SHIVA]: [
      { hindi: 'महादेव आपकी रक्षा करें।', english: 'May Mahadev protect you always.' },
      { hindi: 'भोलेनाथ की कृपा से मन शांत रहे।', english: 'May peace dwell in your mind by Bholenath\'s grace.' },
      { hindi: 'ॐ नमः शिवाय से दिन शुभ हो।', english: 'Begin the day with "Om Namah Shivaya."' },
      { hindi: 'त्रिनेत्र की कृपा से सत्य का मार्ग प्रशस्त हो।', english: 'May the path of truth be illuminated by Trinethra\'s grace.' },
      { hindi: 'शिव शक्ति का आशीर्वाद मिले।', english: 'May the blessing of Shiv Shakti be upon you.' },
      { hindi: 'नीलकंठ विष को भी अमृत बना दें।', english: 'May Neelkanth turn even poison into nectar for you.' },
      { hindi: 'हर हर महादेव!', english: 'Har Har Mahadev!' },
      { hindi: 'ध्यान और तपस्या से मन निर्मल हो।', english: 'May meditation and devotion purify your mind.' },
    ],
    [DeityType.KRISHNA]: [
      { hindi: 'श्री कृष्ण की बांसुरी से मन प्रफुल्लित हो।', english: 'May Krishna\'s flute fill your heart with joy.' },
      { hindi: 'गोविंद की कृपा से जीवन में आनंद आए।', english: 'May Govind\'s grace bring bliss into your life.' },
      { hindi: 'हरे कृष्ण हरे राम!', english: 'Hare Krishna Hare Rama!' },
      { hindi: 'गीता का ज्ञान आपका मार्गदर्शन करे।', english: 'May the wisdom of the Gita guide your way.' },
      { hindi: 'राधे कृष्ण की जोड़ी से प्रेम और भक्ति बढ़े।', english: 'May Radhe Krishna\'s love inspire your devotion.' },
      { hindi: 'कर्म करो, फल की चिंता मत करो।', english: 'Do your duty without attachment to results.' },
      { hindi: 'कान्हा की माखन चुराने वाली मुस्कान सदा साथ रहे।', english: 'May Kanha\'s playful smile always be with you.' },
      { hindi: 'वासुदेव की शरण में सब कुछ मंगल है।', english: 'In Vasudev\'s refuge, all is auspicious.' },
    ],
    [DeityType.DURGA]: [
      { hindi: 'माँ दुर्गा आपकी रक्षा करें।', english: 'May Maa Durga protect you always.' },
      { hindi: 'जय माता दी! शक्ति और साहस मिले।', english: 'Jai Mata Di! May you receive strength and courage.' },
      { hindi: 'नवदुर्गा की कृपा से नवजीवन मिले।', english: 'May Navdurga\'s grace bring new life and energy.' },
      { hindi: 'माँ अम्बे की शक्ति से बुराई का नाश हो।', english: 'May Maa Ambe\'s power destroy all evil.' },
      { hindi: 'शेरावाली माँ की जय!', english: 'Victory to Sherawali Maa!' },
      { hindi: 'माँ चामुंडा सब संकट हरें।', english: 'May Maa Chamunda remove all crises.' },
      { hindi: 'दुर्गा माँ की कृपा से भय का नाश हो।', english: 'May all fears be destroyed by Durga Maa\'s grace.' },
      { hindi: 'माँ भवानी की शरण में सुख-शांति मिले।', english: 'May peace and joy be found in Maa Bhavani\'s refuge.' },
    ]
  };

  private currentDeity: DeityType = DeityType.HANUMAN;
  private currentIndexSubject = new BehaviorSubject<number>(0);
  public currentBlessing$: Observable<Blessing>;

  constructor() {
    this.currentIndexSubject.next(this.getRandomIndex());
    this.currentBlessing$ = this.currentIndexSubject.pipe(
      map(index => this.getBlessingsForCurrentDeity()[index % this.getBlessingsForCurrentDeity().length])
    );
  }

  /**
   * Set current deity context
   */
  setDeityContext(deity: DeityType): void {
    this.currentDeity = deity;
  }

  /**
   * Get combined blessings for current deity
   */
  private getBlessingsForCurrentDeity(): Blessing[] {
    const deitySpecific = this.deityBlessings[this.currentDeity] || this.deityBlessings[DeityType.HANUMAN];
    return [...deitySpecific, ...this.universalBlessings];
  }

  /**
   * Get a random blessing
   */
  public getRandomBlessing(): Blessing {
    const blessings = this.getBlessingsForCurrentDeity();
    const randomIndex = Math.floor(Math.random() * blessings.length);
    return blessings[randomIndex];
  }

  /**
   * Get blessing by index
   */
  public getBlessing(index: number): Blessing {
    const blessings = this.getBlessingsForCurrentDeity();
    const safeIndex = index % blessings.length;
    return blessings[safeIndex];
  }

  /**
   * Get next blessing in sequence
   */
  public getNextBlessing(): Blessing {
    const blessings = this.getBlessingsForCurrentDeity();
    const currentIndex = this.currentIndexSubject.value;
    const nextIndex = (currentIndex + 1) % blessings.length;
    this.currentIndexSubject.next(nextIndex);
    return blessings[nextIndex];
  }

  /**
   * Set a new random blessing
   */
  public setRandomBlessing(): void {
    this.currentIndexSubject.next(this.getRandomIndex());
  }

  /**
   * Get total number of blessings
   */
  public getBlessingsCount(): number {
    return this.getBlessingsForCurrentDeity().length;
  }

  /**
   * Get all blessings
   */
  public getAllBlessings(): Blessing[] {
    return [...this.getBlessingsForCurrentDeity()];
  }

  /**
   * Get random index
   */
  private getRandomIndex(): number {
    const blessings = this.getBlessingsForCurrentDeity();
    return Math.floor(Math.random() * blessings.length);
  }

  /**
   * Get blessing text in specified language
   */
  public getBlessingText(blessing: Blessing, language: 'hi' | 'en'): string {
    return language === 'hi' ? blessing.hindi : blessing.english;
  }
}
