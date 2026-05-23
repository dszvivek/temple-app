/**
 * Krishna Temple Configuration
 * Complete configuration for Lord Krishna temple including mantras, aarti times, offerings, and blessings
 */

import { TempleConfig } from '../models/temple.model';
import { DeityType } from '../models/deity.model';

export const KRISHNA_CONFIG: TempleConfig = {
  deity: {
    id: DeityType.KRISHNA,
    name: 'Lord Krishna',
    nameHindi: 'भगवान श्री कृष्ण',
    description: 'Lord Krishna - The Divine Flute Player',
    descriptionHindi: 'बांसुरी वादक - प्रेम और ज्ञान के देव',
    icon: '🦚',
    color: 'blue',
    gradients: {
      sunrise: 'bg-gradient-to-b from-blue-300 via-cyan-100 to-yellow-50',
      day: 'bg-gradient-to-b from-sky-100 via-blue-50 to-white',
      sunset: 'bg-gradient-to-b from-blue-400 via-purple-200 to-orange-100',
      night: 'bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900'
    }
  },
  
  mantras: [
    {
      deityId: DeityType.KRISHNA,
      name: 'Krishna Aarti',
      nameHindi: 'कृष्ण आरती',
      audioFile: 'assets/audio/krishna/krishna-aarti.mp3',
      duration: 240, // 4 minutes
      schedule: {
        frequency: 'hourly',
        startHour: 0,
        endHour: 24
      }
    },
    {
      deityId: DeityType.KRISHNA,
      name: 'Hare Krishna Mahamantra',
      nameHindi: 'हरे कृष्ण महामंत्र',
      audioFile: 'assets/audio/krishna/krishna-aarti.mp3',
      duration: 300, // 5 minutes
      schedule: {
        frequency: 'custom',
        times: [
          { hour: 5, minute: 30 },
          { hour: 12, minute: 0 },
          { hour: 19, minute: 30 }
        ]
      }
    }
  ],
  
  aartiTimes: [
    { 
      hour: 5, 
      minute: 30, 
      label: 'Mangala Aarti', 
      labelHindi: 'मंगला आरती', 
      emoji: '🌅' 
    },
    { 
      hour: 12, 
      minute: 0, 
      label: 'Raj Bhog Aarti', 
      labelHindi: 'राज भोग आरती', 
      emoji: '☀️' 
    },
    { 
      hour: 19, 
      minute: 30, 
      label: 'Sandhya Aarti', 
      labelHindi: 'संध्या आरती', 
      emoji: '🌆' 
    }
  ],
  
  offerings: [
    {
      name: 'Butter',
      nameHindi: 'मक्खन',
      icon: '🧈',
      description: 'Fresh butter - Krishna\'s favorite',
      descriptionHindi: 'ताजा मक्खन - कृष्ण का प्रिय'
    },
    {
      name: 'Tulsi Leaves',
      nameHindi: 'तुलसी',
      icon: '🌿',
      description: 'Sacred Tulsi leaves',
      descriptionHindi: 'पवित्र तुलसी पत्र'
    },
    {
      name: 'Peacock Feather',
      nameHindi: 'मोर पंख',
      icon: '🦚',
      description: 'Beautiful peacock feather',
      descriptionHindi: 'सुंदर मोर पंख'
    },
    {
      name: 'Flute',
      nameHindi: 'बांसुरी',
      icon: '🎵',
      description: 'Divine flute music',
      descriptionHindi: 'दिव्य बांसुरी संगीत'
    },
    {
      name: 'Yellow Flowers',
      nameHindi: 'पीले फूल',
      icon: '🌼',
      description: 'Marigold and yellow flowers',
      descriptionHindi: 'गेंदा और पीले फूल'
    }
  ],
  
  blessings: {
    general: [
      'May Lord Krishna bless you with divine love',
      'May Govinda fill your heart with joy and devotion',
      'May Lord Krishna guide you on the path of dharma',
      'May Murlidhar protect you from all sorrow',
      'May Lord Krishna bless you with eternal bliss'
    ],
    generalHindi: [
      'भगवान कृष्ण आपको दिव्य प्रेम से आशीर्वाद दें',
      'गोविंद आपके हृदय को आनंद और भक्ति से भरें',
      'भगवान कृष्ण आपको धर्म के मार्ग पर ले जाएं',
      'मुरलीधर आपको सभी दुखों से बचाएं',
      'भगवान कृष्ण आपको शाश्वत आनंद प्रदान करें'
    ],
    specific: {
      health: [
        'May Lord Krishna bless you with good health',
        'May you be free from all illness and suffering'
      ],
      healthHindi: [
        'भगवान कृष्ण आपको अच्छा स्वास्थ्य प्रदान करें',
        'आप सभी बीमारियों और कष्टों से मुक्त हों'
      ],
      prosperity: [
        'May Govinda bring prosperity to your life',
        'May you be blessed with abundance and wealth'
      ],
      prosperityHindi: [
        'गोविंद आपके जीवन में समृद्धि लाएं',
        'आप धन और संपत्ति से आशीर्वादित हों'
      ],
      education: [
        'May Lord Krishna grant you wisdom like Arjuna',
        'May you gain knowledge of Bhagavad Gita'
      ],
      educationHindi: [
        'भगवान कृष्ण आपको अर्जुन जैसी बुद्धि प्रदान करें',
        'आप भगवद्गीता का ज्ञान प्राप्त करें'
      ],
      family: [
        'May your family be blessed like Yashoda\'s',
        'May love and harmony prevail in your home'
      ],
      familyHindi: [
        'आपका परिवार यशोदा जी के समान आशीर्वादित हो',
        'आपके घर में प्रेम और सौहार्द बना रहे'
      ],
      career: [
        'May Lord Krishna guide you like he guided Arjuna',
        'May you achieve success through righteous action'
      ],
      careerHindi: [
        'भगवान कृष्ण आपका मार्गदर्शन अर्जुन की तरह करें',
        'आप धर्मपूर्ण कर्म से सफलता प्राप्त करें'
      ]
    }
  },
  
  ritualInstructions: [
    {
      step: 1,
      action: 'Ring the Bell',
      actionHindi: 'घंटी बजाएँ',
      instruction: 'Ring the temple bell to invoke Lord Krishna',
      instructionHindi: 'भगवान कृष्ण का आह्वान करने के लिए घंटी बजाएँ',
      duration: 5
    },
    {
      step: 2,
      action: 'Chant Hare Krishna',
      actionHindi: 'हरे कृष्ण का जाप करें',
      instruction: 'Chant the Mahamantra with love',
      instructionHindi: 'प्रेम से महामंत्र का जाप करें',
      duration: 30
    },
    {
      step: 3,
      action: 'Offer Prayers',
      actionHindi: 'प्रार्थना करें',
      instruction: 'Pray with a loving heart like the Gopis',
      instructionHindi: 'गोपियों की तरह प्रेमपूर्ण हृदय से प्रार्थना करें',
      duration: 30
    },
    {
      step: 4,
      action: 'Make Your Wish',
      actionHindi: 'अपनी मनोकामना करें',
      instruction: 'Share your heart\'s desire with Krishna',
      instructionHindi: 'अपने हृदय की इच्छा कृष्ण से साझा करें',
      duration: 60
    },
    {
      step: 5,
      action: 'Receive Blessings',
      actionHindi: 'आशीर्वाद प्राप्त करें',
      instruction: 'Receive Krishna\'s divine grace',
      instructionHindi: 'कृष्ण की दिव्य कृपा प्राप्त करें',
      duration: 10
    }
  ]
};
