/**
 * Shiva Temple Configuration
 * Complete configuration for Lord Shiva temple including mantras, aarti times, offerings, and blessings
 */

import { TempleConfig } from '../models/temple.model';
import { DeityType } from '../models/deity.model';

export const SHIVA_CONFIG: TempleConfig = {
  deity: {
    id: DeityType.SHIVA,
    name: 'Lord Shiva',
    nameHindi: 'भगवान शिव',
    description: 'Lord Shiva - The Destroyer and Transformer',
    descriptionHindi: 'भोलेनाथ - संहारक और परिवर्तक',
    icon: '🔱',
    color: 'blue',
    gradients: {
      sunrise: 'bg-gradient-to-b from-blue-200 via-indigo-100 to-purple-50',
      day: 'bg-gradient-to-b from-blue-100 via-indigo-50 to-white',
      sunset: 'bg-gradient-to-b from-indigo-400 via-purple-200 to-pink-100',
      night: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900'
    }
  },
  
  mantras: [
    {
      deityId: DeityType.SHIVA,
      name: 'Shiv Aarti',
      nameHindi: 'शिव आरती',
      audioFile: 'assets/audio/shiva/shiva-aarti.mp3',
      duration: 300, // 5 minutes
      schedule: {
        frequency: 'hourly',
        startHour: 0,
        endHour: 24
      }
    },
    {
      deityId: DeityType.SHIVA,
      name: 'Om Namah Shivaya',
      nameHindi: 'ॐ नमः शिवाय',
      audioFile: 'assets/audio/mantras/om-namah-shivaya.mp3',
      duration: 180, // 3 minutes
      schedule: {
        frequency: 'custom',
        times: [
          { hour: 5, minute: 0 },
          { hour: 12, minute: 0 },
          { hour: 19, minute: 0 }
        ]
      }
    }
  ],
  
  aartiTimes: [
    { 
      hour: 5, 
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
      name: 'Bilva Leaves',
      nameHindi: 'बेलपत्र',
      icon: '🍃',
      description: 'Sacred Bilva leaves',
      descriptionHindi: 'पवित्र बेलपत्र'
    },
    {
      name: 'Milk',
      nameHindi: 'दूध',
      icon: '🥛',
      description: 'Pure milk for Abhishek',
      descriptionHindi: 'अभिषेक के लिए शुद्ध दूध'
    },
    {
      name: 'Dhatura',
      nameHindi: 'धतूरा',
      icon: '🌸',
      description: 'White Dhatura flowers',
      descriptionHindi: 'सफेद धतूरा के फूल'
    },
    {
      name: 'Incense',
      nameHindi: 'धूप',
      icon: '🪔',
      description: 'Fragrant sandalwood incense',
      descriptionHindi: 'सुगंधित चंदन धूप'
    },
    {
      name: 'Rudraksha',
      nameHindi: 'रुद्राक्ष',
      icon: '📿',
      description: 'Sacred Rudraksha beads',
      descriptionHindi: 'पवित्र रुद्राक्ष माला'
    }
  ],
  
  blessings: {
    general: [
      'May Lord Shiva bless you with inner peace and tranquility',
      'May Mahadev remove all negativity from your life',
      'May Lord Shiva grant you wisdom and enlightenment',
      'May Bholenath protect you from all evil',
      'May Lord Shiva fill your life with divine grace'
    ],
    generalHindi: [
      'भगवान शिव आपको आंतरिक शांति प्रदान करें',
      'महादेव आपके जीवन से सभी नकारात्मकता दूर करें',
      'भगवान शिव आपको बुद्धि और ज्ञान प्रदान करें',
      'भोलेनाथ आपको सभी बुराइयों से बचाएं',
      'भगवान शिव आपके जीवन को दिव्य कृपा से भरें'
    ],
    specific: {
      health: [
        'May Lord Shiva bless you with perfect health',
        'May you be free from all suffering and pain'
      ],
      healthHindi: [
        'भगवान शिव आपको संपूर्ण स्वास्थ्य प्रदान करें',
        'आप सभी कष्टों और पीड़ा से मुक्त हों'
      ],
      prosperity: [
        'May Mahadev bring abundance to your life',
        'May all your material needs be fulfilled'
      ],
      prosperityHindi: [
        'महादेव आपके जीवन में समृद्धि लाएं',
        'आपकी सभी भौतिक आवश्यकताएं पूरी हों'
      ],
      education: [
        'May Lord Shiva grant you supreme knowledge',
        'May you excel in your spiritual and worldly pursuits'
      ],
      educationHindi: [
        'भगवान शिव आपको परम ज्ञान प्रदान करें',
        'आप अपनी आध्यात्मिक और सांसारिक खोज में उत्कृष्टता प्राप्त करें'
      ],
      family: [
        'May Lord Shiva bless your family with harmony',
        'May your home be filled with divine presence'
      ],
      familyHindi: [
        'भगवान शिव आपके परिवार को सौहार्द से आशीर्वाद दें',
        'आपका घर दिव्य उपस्थिति से भरा रहे'
      ],
      career: [
        'May Mahadev grant you success in all endeavors',
        'May you overcome all obstacles in your path'
      ],
      careerHindi: [
        'महादेव आपको सभी प्रयासों में सफलता प्रदान करें',
        'आप अपने मार्ग की सभी बाधाओं को पार करें'
      ]
    }
  },
  
  ritualInstructions: [
    {
      step: 1,
      action: 'Ring the Bell',
      actionHindi: 'घंटी बजाएँ',
      instruction: 'Ring the temple bell to invoke Lord Shiva',
      instructionHindi: 'भगवान शिव का आह्वान करने के लिए घंटी बजाएँ',
      duration: 5
    },
    {
      step: 2,
      action: 'Chant Om Namah Shivaya',
      actionHindi: 'ॐ नमः शिवाय का जाप करें',
      instruction: 'Chant the sacred mantra 11 times',
      instructionHindi: 'पवित्र मंत्र 11 बार जाप करें',
      duration: 30
    },
    {
      step: 3,
      action: 'Offer Prayers',
      actionHindi: 'प्रार्थना करें',
      instruction: 'Close your eyes and pray with devotion',
      instructionHindi: 'आँखें बंद करें और भक्ति से प्रार्थना करें',
      duration: 30
    },
    {
      step: 4,
      action: 'Make Your Wish',
      actionHindi: 'अपनी मनोकामना करें',
      instruction: 'Express your wish to Lord Shiva',
      instructionHindi: 'भगवान शिव से अपनी मनोकामना व्यक्त करें',
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
