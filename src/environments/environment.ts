/**
 * Development Environment Configuration
 */
export const environment = {
  production: false,
  
  // UPI Payment Configuration
  // IMPORTANT: Replace with your actual UPI VPA before deployment
  upiVpa: 'dszvivek@icici',
  
  // App Configuration
  appName: 'Karunamayi Hanuman E-Mandir',
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
