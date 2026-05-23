/**
 * Ganesh Temple Configuration
 * Complete configuration for Ganesha Ji temple including mantras, aarti times, offerings, and blessings
 */

import { TempleConfig } from '../models/temple.model';
import { DeityType } from '../models/deity.model';

export const GANESH_CONFIG: TempleConfig = {
  deity: {
    id: DeityType.GANESH,
    name: 'Ganesha Ji',
    nameHindi: 'श्री गणेश जी',
    description: 'Lord Ganesha - Remover of Obstacles',
    descriptionHindi: 'विघ्नहर्ता गणेश - बुद्धि और मंगल के देव',
    icon: '🐘',
    color: 'red',
    gradients: {
      sunrise: 'bg-gradient-to-b from-red-200 via-orange-100 to-yellow-50',
      day: 'bg-gradient-to-b from-amber-100 via-yellow-50 to-white',
      sunset: 'bg-gradient-to-b from-red-400 via-orange-200 to-yellow-100',
      night: 'bg-gradient-to-b from-red-900 via-orange-900 to-gray-900'
    }
  },
  
  mantras: [
    {
      deityId: DeityType.GANESH,
      name: 'Ganesh Aarti',
      nameHindi: 'गणेश आरती',
      audioFile: 'assets/audio/aarti/ganesh-aarti.mp3',
      duration: 150, // 2 minutes 30 seconds
      schedule: {
        frequency: 'hourly',
        startHour: 0,
        endHour: 24
      }
    },
    {
      deityId: DeityType.GANESH,
      name: 'Om Gam Ganapataye Namaha',
      nameHindi: 'ॐ गं गणपतये नमः',
      audioFile: 'assets/audio/ganesha/ganesh-aarti.mp3',
      duration: 120, // 2 minutes
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
      hour: 19, 
      minute: 0, 
      label: 'Evening Aarti', 
      labelHindi: 'संध्या आरती', 
      emoji: '🌆' 
    }
  ],
  
  offerings: [
    {
      name: 'Modak',
      nameHindi: 'मोदक',
      icon: '🥟',
      description: 'Lord Ganesha\'s favorite sweet',
      descriptionHindi: 'भगवान गणेश का पसंदीदा मीठा'
    },
    {
      name: 'Flowers',
      nameHindi: 'पुष्प',
      icon: '🌺',
      description: 'Red hibiscus flowers',
      descriptionHindi: 'लाल जवा के फूल'
    },
    {
      name: 'Durva Grass',
      nameHindi: 'दूर्वा',
      icon: '🌿',
      description: 'Sacred durva grass',
      descriptionHindi: 'पवित्र दूर्वा घास'
    },
    {
      name: 'Coconut',
      nameHindi: 'नारियल',
      icon: '🥥',
      description: 'Fresh coconut offering',
      descriptionHindi: 'ताज़ा नारियल'
    },
    {
      name: 'Lamp',
      nameHindi: 'दीपक',
      icon: '🪔',
      description: 'Ghee lamp',
      descriptionHindi: 'घी का दीपक'
    },
    {
      name: 'Incense',
      nameHindi: 'धूप',
      icon: '🔥',
      description: 'Fragrant incense sticks',
      descriptionHindi: 'सुगंधित अगरबत्ती'
    }
  ],
  
  blessings: {
    general: [
      'May Lord Ganesha remove all obstacles from your path',
      'May Lord Ganesha bless you with wisdom and prosperity',
      'May Lord Ganesha grant you success in all your endeavors',
      'May Lord Ganesha fill your life with joy and abundance',
      'May Lord Ganesha protect you and your loved ones'
    ],
    generalHindi: [
      'भगवान गणेश आपके सभी विघ्नों को दूर करें',
      'भगवान गणेश आपको बुद्धि और समृद्धि का आशीर्वाद दें',
      'भगवान गणेश आपके सभी प्रयासों में सफलता प्रदान करें',
      'भगवान गणेश आपके जीवन को आनंद और प्रचुरता से भरें',
      'भगवान गणेश आपकी और आपके प्रियजनों की रक्षा करें'
    ],
    specific: {
      health: [
        'May Ganesha Ji bless you with robust health and well-being',
        'May all health obstacles be removed from your life'
      ],
      healthHindi: [
        'गणेश जी आपको मजबूत स्वास्थ्य और कल्याण का आशीर्वाद दें',
        'आपके जीवन से सभी स्वास्थ्य बाधाएं दूर हों'
      ],
      prosperity: [
        'May Lord Ganesha shower you with wealth and prosperity',
        'May financial obstacles be removed from your path'
      ],
      prosperityHindi: [
        'भगवान गणेश आप पर धन और समृद्धि की वर्षा करें',
        'आपके मार्ग से वित्तीय बाधाएं दूर हों'
      ],
      education: [
        'May Ganesha Ji bless you with supreme knowledge and intelligence',
        'May you excel in your academic pursuits'
      ],
      educationHindi: [
        'गणेश जी आपको सर्वोच्च ज्ञान और बुद्धि का आशीर्वाद दें',
        'आप अपनी शैक्षणिक गतिविधियों में उत्कृष्टता प्राप्त करें'
      ],
      family: [
        'May Lord Ganesha bless your family with unity and harmony',
        'May all family obstacles be removed'
      ],
      familyHindi: [
        'भगवान गणेश आपके परिवार को एकता और सौहार्द का आशीर्वाद दें',
        'सभी पारिवारिक बाधाएं दूर हों'
      ],
      career: [
        'May Ganesha Ji grant you success in your career and business',
        'May all professional obstacles be cleared'
      ],
      careerHindi: [
        'गणेश जी आपको करियर और व्यवसाय में सफलता प्रदान करें',
        'सभी पेशेवर बाधाएं दूर हों'
      ]
    }
  },
  
  ritualInstructions: [
    {
      step: 1,
      action: 'Ring the Bell',
      actionHindi: 'घंटी बजाएँ',
      instruction: 'Ring the temple bell 3 times to invoke Lord Ganesha',
      instructionHindi: 'भगवान गणेश का आह्वान करने के लिए मंदिर की घंटी 3 बार बजाएँ',
      duration: 5
    },
    {
      step: 2,
      action: 'Offer Durva',
      actionHindi: 'दूर्वा अर्पित करें',
      instruction: 'Offer sacred durva grass to Lord Ganesha',
      instructionHindi: 'भगवान गणेश को पवित्र दूर्वा घास अर्पित करें',
      duration: 10
    },
    {
      step: 3,
      action: 'Chant Mantra',
      actionHindi: 'मंत्र जाप करें',
      instruction: 'Chant "Om Gam Ganapataye Namaha" 21 times',
      instructionHindi: '"ॐ गं गणपतये नमः" 21 बार जाप करें',
      duration: 30
    },
    {
      step: 4,
      action: 'Offer Modak',
      actionHindi: 'मोदक अर्पित करें',
      instruction: 'Offer modak (sweet) to Lord Ganesha',
      instructionHindi: 'भगवान गणेश को मोदक (मीठा) अर्पित करें',
      duration: 10
    },
    {
      step: 5,
      action: 'Express Your Wish',
      actionHindi: 'अपनी मनोकामना व्यक्त करें',
      instruction: 'Share your wish with Lord Ganesha, the remover of obstacles',
      instructionHindi: 'विघ्नहर्ता भगवान गणेश के साथ अपनी मनोकामना साझा करें',
      duration: 60
    },
    {
      step: 6,
      action: 'Receive Blessings',
      actionHindi: 'आशीर्वाद प्राप्त करें',
      instruction: 'Bow down and receive the divine blessings of Lord Ganesha',
      instructionHindi: 'प्रणाम करें और भगवान गणेश का दिव्य आशीर्वाद प्राप्त करें',
      duration: 10
    }
  ]
};
