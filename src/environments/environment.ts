/**
 * Development Environment Configuration
 */
export const environment = {
  production: false,
  
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
  appName: 'E-Darshan Mandir',
  version: '1.0.0',
  
  // Audio Assets
  audioAssets: {
    hanumanChalisa: 'assets/audio/hanuman-chalisa.mp3',
    hanumanAarti: 'assets/audio/hanuman-aarti.mp3',
    omChant: 'assets/audio/om-chant.mp3'
  },
  
  // Image Assets
  imageAssets: {
    hanumanIdol: 'assets/images/hanuman-idol.svg',
    placeholderIdol: 'assets/images/placeholder-idol.svg',
    hanumanDeity: 'assets/images/hanuman-deity.svg',
    hanumanHero: 'assets/images/hanuman-main.png',
    templeBackground: 'assets/images/temple-background.svg',
    diyaLamp: 'assets/images/diya-lamp.svg',
    incense: 'assets/images/incense.svg',
    prasad: 'assets/images/prasad.svg',
    templeBell: 'assets/images/temple-bell.svg',
    templeExterior: 'assets/images/temple-exterior.svg'
  },
  
  // Feature Flags
  features: {
    notifications: true,
    audio: true,
    pwa: true
  }
};
