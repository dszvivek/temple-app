import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Blessing {
  hindi: string;
  english: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlessingsService {
  private readonly blessings: Blessing[] = [
    {
      hindi: 'श्री हनुमान जी आपकी रक्षा करें।',
      english: 'May Lord Hanuman protect you and your family.'
    },
    {
      hindi: 'संकट मोचन आपकी हर बाधा हरें।',
      english: 'May obstacles melt away by His grace.'
    },
    {
      hindi: 'मन, वचन, कर्म में पवित्रता बनी रहे।',
      english: 'May purity dwell in thought, word, and deed.'
    },
    {
      hindi: 'पराक्रम और विनय साथ रहें।',
      english: 'Courage with humility, strength with wisdom.'
    },
    {
      hindi: 'प्रभु राम का स्मरण अखंड रहे।',
      english: 'Constant remembrance of Shri Ram.'
    },
    {
      hindi: 'सेवा में आनंद, कर्म में सिद्धि।',
      english: 'Joy in service, success in duty.'
    },
    {
      hindi: 'भय दूर हो, विश्वास स्थिर हो।',
      english: 'Fear dissolves, faith remains firm.'
    },
    {
      hindi: 'कष्ट कटें, कृपा बरसें।',
      english: 'Compassion flows, pain subsides.'
    },
    {
      hindi: 'बुद्धि, बल, विवेक की वृद्धि हो।',
      english: 'Growth in intellect, strength, and discernment.'
    },
    {
      hindi: 'रोग-शोक दूर हों, आरोग्य प्राप्त हो।',
      english: 'Health, vitality, and peace of mind.'
    },
    {
      hindi: 'परिवार में सुख-शांति बनी रहे।',
      english: 'Harmony and happiness at home.'
    },
    {
      hindi: 'कार्य सिद्ध हों, मार्ग प्रशस्त हो।',
      english: 'Doors open, efforts bear fruit.'
    },
    {
      hindi: 'सात्त्विकता और धैर्य बढ़े।',
      english: 'Satvik thoughts and steady patience.'
    },
    {
      hindi: 'मनोकामनाएँ मंगलमय हों।',
      english: 'May your wishes turn auspicious.'
    },
    {
      hindi: 'सद्बुद्धि और सद्गति मिले।',
      english: 'Right understanding and noble path.'
    },
    {
      hindi: 'निश्छल भक्ति का वरदान मिले।',
      english: 'Blessing of pure devotion.'
    },
    {
      hindi: 'स्वाभिमान और नम्रता संतुलित रहें।',
      english: 'Self-respect with humility.'
    },
    {
      hindi: 'लक्ष्मी संग सदाचार का वास हो।',
      english: 'Prosperity with righteousness.'
    },
    {
      hindi: 'दीन-जन की सेवा का अवसर मिले।',
      english: 'Opportunity to serve the needy.'
    },
    {
      hindi: 'अध्ययन में प्रगति, कर्म में सफलता।',
      english: 'Progress in studies and work.'
    },
    {
      hindi: 'भय-भ्रम-बंधन से मुक्ति।',
      english: 'Freedom from fear and bondage.'
    },
    {
      hindi: 'शुभ मार्गदर्शन सुलभ हो।',
      english: 'Timely guidance and right decisions.'
    },
    {
      hindi: 'घर-आँगन में मंगल दीप जले।',
      english: 'May a lamp of goodness shine in your home.'
    },
    {
      hindi: '"जय बजरंगबली" से दिन शुभ हो।',
      english: 'Begin the day with "Jai Bajrang Bali."'
    }
  ];

  private currentIndexSubject = new BehaviorSubject<number>(0);
  public currentBlessing$: Observable<Blessing>;

  constructor() {
    // Initialize with random blessing
    this.currentIndexSubject.next(this.getRandomIndex());

    // Map index to actual blessing
    this.currentBlessing$ = this.currentIndexSubject.pipe(
      map(index => this.blessings[index])
    );
  }

  /**
   * Get a random blessing
   */
  public getRandomBlessing(): Blessing {
    const randomIndex = this.getRandomIndex();
    return this.blessings[randomIndex];
  }

  /**
   * Get blessing by index
   */
  public getBlessing(index: number): Blessing {
    const safeIndex = index % this.blessings.length;
    return this.blessings[safeIndex];
  }

  /**
   * Get next blessing in sequence
   */
  public getNextBlessing(): Blessing {
    const currentIndex = this.currentIndexSubject.value;
    const nextIndex = (currentIndex + 1) % this.blessings.length;
    this.currentIndexSubject.next(nextIndex);
    return this.blessings[nextIndex];
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
    return this.blessings.length;
  }

  /**
   * Get all blessings
   */
  public getAllBlessings(): Blessing[] {
    return [...this.blessings];
  }

  /**
   * Get random index
   */
  private getRandomIndex(): number {
    return Math.floor(Math.random() * this.blessings.length);
  }

  /**
   * Get blessing text in specified language
   */
  public getBlessingText(blessing: Blessing, language: 'hi' | 'en'): string {
    return language === 'hi' ? blessing.hindi : blessing.english;
  }
}
