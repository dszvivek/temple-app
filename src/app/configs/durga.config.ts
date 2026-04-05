/**
 * Durga Temple Configuration
 * Complete configuration for Maa Durga temple including mantras, aarti times, offerings, and blessings
 */

import { TempleConfig } from '../models/temple.model';
import { DeityType } from '../models/deity.model';

export const DURGA_CONFIG: TempleConfig = {
  deity: {
    id: DeityType.DURGA,
    name: 'Maa Durga',
    nameHindi: 'माँ दुर्गा',
    description: 'Maa Durga - The Divine Mother Goddess',
    descriptionHindi: 'जगतजननी - शक्ति की देवी',
    icon: '🦁',
    color: 'red',
    gradients: {
      sunrise: 'bg-gradient-to-b from-red-200 via-pink-100 to-orange-50',
      day: 'bg-gradient-to-b from-red-100 via-pink-50 to-white',
      sunset: 'bg-gradient-to-b from-red-400 via-pink-200 to-orange-100',
      night: 'bg-gradient-to-b from-red-900 via-pink-900 to-gray-900'
    }
  },
  
  mantras: [
    {
      deityId: DeityType.DURGA,
      name: 'Durga Aarti',
      nameHindi: 'दुर्गा आरती',
      audioFile: 'assets/audio/durga/durga-aarti.mp3',
      duration: 270, // 4.5 minutes
      schedule: {
        frequency: 'hourly',
        startHour: 0,
        endHour: 24
      }
    },
    {
      deityId: DeityType.DURGA,
      name: 'Durga Chalisa',
      nameHindi: 'दुर्गा चालीसा',
      audioFile: 'assets/audio/mantras/durga-chalisa.mp3',
      duration: 480, // 8 minutes
      schedule: {
        frequency: 'custom',
        times: [
          { hour: 6, minute: 0 },
          { hour: 12, minute: 0 },
          { hour: 18, minute: 0 }
        ]
      }
    }
  ],
  
  aartiTimes: [
    { 
      hour: 6, 
      minute: 0, 
      label: 'Morning Aarti', 
      labelHindi: 'प्रातः आरती', 
      emoji: '🌅' 
    },
    { 
      hour: 12, 
      minute: 0, 
      label: 'Afternoon Aarti', 
      labelHindi: 'दोपहर आरती', 
      emoji: '☀️' 
    },
    { 
      hour: 18, 
      minute: 0, 
      label: 'Evening Aarti', 
      labelHindi: 'संध्या आरती', 
      emoji: '🌆' 
    }
  ],
  
  offerings: [
    {
      name: 'Red Flowers',
      nameHindi: 'लाल फूल',
      icon: '🌺',
      description: 'Red hibiscus and roses',
      descriptionHindi: 'लाल जवा और गुलाब'
    },
    {
      name: 'Coconut',
      nameHindi: 'नारियल',
      icon: '🥥',
      description: 'Sacred coconut offering',
      descriptionHindi: 'पवित्र नारियल'
    },
    {
      name: 'Sindoor',
      nameHindi: 'सिंदूर',
      icon: '🔴',
      description: 'Sacred vermillion',
      descriptionHindi: 'पवित्र सिंदूर'
    },
    {
      name: 'Sweets',
      nameHindi: 'मिठाई',
      icon: '🍬',
      description: 'Traditional sweets',
      descriptionHindi: 'पारंपरिक मिठाई'
    },
    {
      name: 'Red Chunari',
      nameHindi: 'लाल चुनरी',
      icon: '🧣',
      description: 'Sacred red cloth',
      descriptionHindi: 'पवित्र लाल चुनरी'
    }
  ],
  
  blessings: {
    general: [
      'May Maa Durga bless you with strength and courage',
      'May the Divine Mother protect you from all evil',
      'May Maa Durga grant you victory over all obstacles',
      'May Jagadamba fill your life with shakti',
      'May Maa Durga bless you with fearlessness'
    ],
    generalHindi: [
      'माँ दुर्गा आपको शक्ति और साहस प्रदान करें',
      'जगत जननी आपको सभी बुराइयों से बचाएं',
      'माँ दुर्गा आपको सभी बाधाओं पर विजय प्रदान करें',
      'जगदंबा आपके जीवन को शक्ति से भरें',
      'माँ दुर्गा आपको निर्भयता प्रदान करें'
    ],
    specific: {
      health: [
        'May Maa Durga bless you with perfect health',
        'May you be free from all diseases and suffering'
      ],
      healthHindi: [
        'माँ दुर्गा आपको संपूर्ण स्वास्थ्य प्रदान करें',
        'आप सभी रोगों और कष्टों से मुक्त हों'
      ],
      prosperity: [
        'May Maa Lakshmi-Durga bring wealth to your home',
        'May you be blessed with abundance and prosperity'
      ],
      prosperityHindi: [
        'माँ लक्ष्मी-दुर्गा आपके घर में धन लाएं',
        'आप समृद्धि और संपन्नता से आशीर्वादित हों'
      ],
      education: [
        'May Maa Saraswati-Durga grant you wisdom',
        'May you excel in all your studies'
      ],
      educationHindi: [
        'माँ सरस्वती-दुर्गा आपको बुद्धि प्रदान करें',
        'आप अपनी पढ़ाई में उत्कृष्टता प्राप्त करें'
      ],
      family: [
        'May Maa Durga protect your family',
        'May your home be filled with divine grace'
      ],
      familyHindi: [
        'माँ दुर्गा आपके परिवार की रक्षा करें',
        'आपका घर दिव्य कृपा से भरा रहे'
      ],
      career: [
        'May Maa Durga grant you success in your career',
        'May you defeat all competition like she defeated Mahishasur'
      ],
      careerHindi: [
        'माँ दुर्गा आपको अपने करियर में सफलता प्रदान करें',
        'आप सभी प्रतिस्पर्धा को जीतें जैसे माँ ने महिषासुर को हराया'
      ]
    }
  },
  
  ritualInstructions: [
    {
      step: 1,
      action: 'Ring the Bell',
      actionHindi: 'घंटी बजाएँ',
      instruction: 'Ring the temple bell to invoke Maa Durga',
      instructionHindi: 'माँ दुर्गा का आह्वान करने के लिए घंटी बजाएँ',
      duration: 5
    },
    {
      step: 2,
      action: 'Chant Jai Mata Di',
      actionHindi: 'जय माता दी का जाप करें',
      instruction: 'Chant with devotion 9 times',
      instructionHindi: 'भक्ति से 9 बार जाप करें',
      duration: 30
    },
    {
      step: 3,
      action: 'Offer Prayers',
      actionHindi: 'प्रार्थना करें',
      instruction: 'Pray to the Divine Mother',
      instructionHindi: 'जगत जननी से प्रार्थना करें',
      duration: 30
    },
    {
      step: 4,
      action: 'Make Your Wish',
      actionHindi: 'अपनी मनोकामना करें',
      instruction: 'Share your wish with Maa Durga',
      instructionHindi: 'माँ दुर्गा से अपनी मनोकामना साझा करें',
      duration: 60
    },
    {
      step: 5,
      action: 'Receive Blessings',
      actionHindi: 'आशीर्वाद प्राप्त करें',
      instruction: 'Receive the Mother\'s divine blessings',
      instructionHindi: 'माँ का दिव्य आशीर्वाद प्राप्त करें',
      duration: 10
    }
  ]
};
