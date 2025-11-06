/**
 * Hanuman Temple Configuration
 * Complete configuration for Hanuman Ji temple including mantras, aarti times, offerings, and blessings
 */

import { TempleConfig } from '../models/temple.model';
import { DeityType } from '../models/deity.model';

export const HANUMAN_CONFIG: TempleConfig = {
  deity: {
    id: DeityType.HANUMAN,
    name: 'Hanuman Ji',
    nameHindi: 'श्री हनुमान जी',
    description: 'Lord Hanuman - Symbol of Strength and Devotion',
    descriptionHindi: 'संकट मोचन हनुमान - शक्ति और भक्ति के प्रतीक',
    icon: '🙏',
    color: 'orange',
    gradients: {
      sunrise: 'bg-gradient-to-b from-orange-200 via-pink-100 to-yellow-50',
      day: 'bg-gradient-to-b from-red-100 via-orange-50 to-white',
      sunset: 'bg-gradient-to-b from-orange-400 via-pink-200 to-purple-100',
      night: 'bg-gradient-to-b from-orange-900 via-red-900 to-gray-900'
    }
  },
  
  mantras: [
    {
      deityId: DeityType.HANUMAN,
      name: 'Hanuman Chalisa',
      nameHindi: 'हनुमान चालीसा',
      audioFile: 'assets/audio/hanuman-chalisa.mp3',
      duration: 512, // 8 minutes 32 seconds
      schedule: {
        frequency: 'hourly',
        startHour: 0,
        endHour: 24
      }
    },
    {
      deityId: DeityType.HANUMAN,
      name: 'Hanuman Aarti',
      nameHindi: 'हनुमान आरती',
      audioFile: 'assets/audio/hanuman-aarti.mp3',
      duration: 180, // 3 minutes
      schedule: {
        frequency: 'custom',
        times: [
          { hour: 8, minute: 0 },
          { hour: 13, minute: 0 },
          { hour: 19, minute: 0 }
        ]
      }
    }
  ],
  
  aartiTimes: [
    { 
      hour: 8, 
      minute: 0, 
      label: 'Morning Aarti', 
      labelHindi: 'प्रातः आरती', 
      emoji: '🌅' 
    },
    { 
      hour: 13, 
      minute: 0, 
      label: 'Afternoon Aarti', 
      labelHindi: 'दोपहर आरती', 
      emoji: '☀️' 
    },
    { 
      hour: 19, 
      minute: 0, 
      label: 'Evening Aarti', 
      labelHindi: 'संध्या आरती', 
      emoji: '🌆' 
    }
  ],
  
  offerings: [
    {
      name: 'Prasad',
      nameHindi: 'प्रसाद',
      icon: '🍬',
      description: 'Sweet offerings',
      descriptionHindi: 'मीठा प्रसाद'
    },
    {
      name: 'Flowers',
      nameHindi: 'पुष्प',
      icon: '🌺',
      description: 'Red flowers',
      descriptionHindi: 'लाल फूल'
    },
    {
      name: 'Incense',
      nameHindi: 'धूप',
      icon: '🪔',
      description: 'Fragrant incense',
      descriptionHindi: 'सुगंधित धूप'
    },
    {
      name: 'Lamp',
      nameHindi: 'दीपक',
      icon: '🕯️',
      description: 'Oil lamp',
      descriptionHindi: 'तेल का दीपक'
    },
    {
      name: 'Fruits',
      nameHindi: 'फल',
      icon: '🍎',
      description: 'Fresh fruits',
      descriptionHindi: 'ताज़े फल'
    }
  ],
  
  blessings: {
    general: [
      'May Lord Hanuman bless you with strength and courage',
      'May Lord Hanuman remove all obstacles from your path',
      'May Lord Hanuman grant you wisdom and devotion',
      'May Lord Hanuman protect you from all evil',
      'May Lord Hanuman fill your life with joy and peace'
    ],
    generalHindi: [
      'भगवान हनुमान आपको शक्ति और साहस प्रदान करें',
      'भगवान हनुमान आपके सभी विघ्नों को दूर करें',
      'भगवान हनुमान आपको बुद्धि और भक्ति प्रदान करें',
      'भगवान हनुमान आपको सभी बुराइयों से बचाएं',
      'भगवान हनुमान आपके जीवन को आनंद और शांति से भरें'
    ],
    specific: {
      health: [
        'May Hanuman Ji bless you with perfect health and vitality',
        'May you be free from all illnesses and pain'
      ],
      healthHindi: [
        'हनुमान जी आपको संपूर्ण स्वास्थ्य और जीवन शक्ति प्रदान करें',
        'आप सभी बीमारियों और दर्द से मुक्त हों'
      ],
      prosperity: [
        'May Lord Hanuman bring prosperity and abundance to your life',
        'May all your material needs be fulfilled'
      ],
      prosperityHindi: [
        'भगवान हनुमान आपके जीवन में समृद्धि और प्रचुरता लाएं',
        'आपकी सभी भौतिक आवश्यकताएं पूरी हों'
      ],
      education: [
        'May Hanuman Ji grant you wisdom and knowledge',
        'May you excel in your studies and career'
      ],
      educationHindi: [
        'हनुमान जी आपको बुद्धि और ज्ञान प्रदान करें',
        'आप अपनी पढ़ाई और करियर में उत्कृष्टता प्राप्त करें'
      ],
      family: [
        'May Lord Hanuman bless your family with harmony and love',
        'May your relationships be filled with understanding'
      ],
      familyHindi: [
        'भगवान हनुमान आपके परिवार को सौहार्द और प्रेम से आशीर्वाद दें',
        'आपके रिश्ते समझ से भरे हों'
      ],
      career: [
        'May Hanuman Ji grant you success in all your endeavors',
        'May you overcome all challenges in your professional life'
      ],
      careerHindi: [
        'हनुमान जी आपको अपने सभी प्रयासों में सफलता प्रदान करें',
        'आप अपने पेशेवर जीवन में सभी चुनौतियों को पार करें'
      ]
    }
  },
  
  ritualInstructions: [
    {
      step: 1,
      action: 'Ring the Bell',
      actionHindi: 'घंटी बजाएँ',
      instruction: 'Ring the temple bell 3 times to announce your presence',
      instructionHindi: 'अपनी उपस्थिति की घोषणा के लिए मंदिर की घंटी 3 बार बजाएँ',
      duration: 5
    },
    {
      step: 2,
      action: 'Offer Prayers',
      actionHindi: 'प्रार्थना करें',
      instruction: 'Close your eyes and pray with a pure heart',
      instructionHindi: 'अपनी आँखें बंद करें और शुद्ध हृदय से प्रार्थना करें',
      duration: 30
    },
    {
      step: 3,
      action: 'Chant Mantra',
      actionHindi: 'मंत्र जाप करें',
      instruction: 'Chant "Jai Hanuman" 11 times',
      instructionHindi: '"जय हनुमान" 11 बार जाप करें',
      duration: 20
    },
    {
      step: 4,
      action: 'Make Your Wish',
      actionHindi: 'अपनी मनोकामना करें',
      instruction: 'Express your wish to Lord Hanuman',
      instructionHindi: 'भगवान हनुमान से अपनी मनोकामना व्यक्त करें',
      duration: 60
    },
    {
      step: 5,
      action: 'Receive Blessings',
      actionHindi: 'आशीर्वाद प्राप्त करें',
      instruction: 'Bow down and receive divine blessings',
      instructionHindi: 'प्रणाम करें और दिव्य आशीर्वाद प्राप्त करें',
      duration: 10
    }
  ]
};
