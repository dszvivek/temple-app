/**
 * Production Environment Configuration
 */
export const environment = {
  production: true,
  
  // Firebase Configuration
  // IMPORTANT: Replace with your Firebase project credentials
  // Get these from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
  firebase: {
    apiKey: 'AIzaSyDLQAzjvix0B5Kpno0DQPtDkf0tyZK1iY4',
    authDomain: 'manokamna-online.firebaseapp.com',
    projectId: 'manokamna-online',
    storageBucket: 'manokamna-online.appspot.com',
    messagingSenderId: '590194861297',
    appId: '1:590194861297:web:889d36f2af3f308e2eb550'
    // measurementId: 'G-XXXXXXXXXX' // Optional: Add if you want Google Analytics
  },
  
  // Backend Features
  useBackend: true, // Set to false to use offline-only mode
  
  // UPI Payment Configuration
  // IMPORTANT: Replace with your actual UPI VPA before deployment
  upiVpa: 'dszvivek@icici',
  
  // App Configuration
  appName: 'Manokamna',
  appNameHindi: 'ई-दर्शन मंदिर',
  version: '1.0.0',
  
  // Audio Assets - Deity-specific
  audioAssets: {
    // Hanuman Temple Audio
    hanumanChalisa: 'assets/audio/mantras/hanuman-chalisa.mp3',
    hanumanAarti: 'assets/audio/hanuman-aarti.mp3',
    
    // Ganesh Temple Audio
    ganeshAarti: 'assets/audio/ganesh-aarti.mp3',
    ganeshMantra: 'assets/audio/mantras/ganesh-mantra.mp3',
    
    // Common Audio
    omChant: 'assets/audio/mantras/om-chant.mp3',
    templeBell: 'assets/audio/effects/mandir_bell.wav',
    shankh: 'assets/audio/ambient/shankh_drone.wav',
    templeAmbience: 'assets/audio/temple_ambience.wav'
  },
  
  // Image Assets - Deity-specific
  imageAssets: {
    // Hanuman Temple Images
    hanumanIdol: 'assets/images/deities/hanuman/hanuman-idol.svg',
    hanumanDeity: 'assets/images/deities/hanuman/hanuman-deity.svg',
    hanumanHero: 'assets/images/deities/hanuman/hanuman-main.png',
    
    // Ganesh Temple Images
    ganeshIdol: 'assets/images/deities/ganesh/ganesh-idol.svg',
    ganeshDeity: 'assets/images/deities/ganesh/ganesh-deity.svg',
    ganeshHero: 'assets/images/deities/ganesh/Ganesh.png',
    
    // Common Temple Images
    placeholderIdol: 'assets/images/placeholder-idol.svg',
    templeBackground: 'assets/images/temple/temple-background.svg',
    templeExterior: 'assets/images/temple/temple-exterior.svg',
    templeBell: 'assets/images/temple/temple-bell.svg',
    
    // Offering Images
    diyaLamp: 'assets/images/offerings/diya-lamp.svg',
    incense: 'assets/images/offerings/incense.svg',
    prasad: 'assets/images/offerings/prasad.svg',
    modak: 'assets/images/modak.svg',
    flowers: 'assets/images/flowers.svg',
    fruits: 'assets/images/fruits.svg'
  },
  
  // Feature Flags
  features: {
    notifications: true,
    audio: true,
    pwa: true
  }
};
