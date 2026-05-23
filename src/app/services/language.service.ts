import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeityType } from '../models/deity.model';

export type Language = 'hi' | 'en';

export interface Translations {
  // Header
  appTitle: string;
  
  // Home Page
  home: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    makeWish: string;
    aboutTemple: string;
    supportTitle: string;
    supportMessage: string;
    supportButton: string;
    supportOptional: string;
  };
  
  // Onboarding Welcome
  onboarding: {
    welcomeRitual: string;
    step1: string;
    step2: string;
    step3: string;
    enterTemple: string;
    skipIntro: string;
  };
  
  // Audio Player
  audio: {
    title: string;
    subtitle: string;
    enableButton: string;
    enableHint: string;
    automaticChanting: string;
    liveSync: string;
    playing: string;
    waiting: string;
    schedule: string;
    playsEveryHour: string;
    operatingHours: string;
    operatingHoursTime: string;
    frequency: string;
    everyHour: string;
    nextChantIn: string;
    at: string;
    liveNow: string;
    joinedMinutes: string;
    audioSynced: string;
    volumeControl: string;
    tip: string;
    tipMessage: string;
    duration: string;
    perSession: string;
    statusPlaying: string;
    statusMessage: string;
    scheduleInfo: string;
    durationInfo: string;
  };
  
  // Viral Share Flow
  viralShare: {
    title: string;
    subtitle: string;
    description: string;
    shareButton: string;
    skipButton: string;
    blessing: string;
    shareCount: string;
  };
  
  // Wish Flow
  wish: {
    createTitle: string;
    createStep: string;
    ritualStep: string;
    shareStep: string;
    completeStep: string;
    wishTitle: string;
    wishTitlePlaceholder: string;
    category: string;
    health: string;
    education: string;
    career: string;
    family: string;
    wealth: string;
    spiritual: string;
    general: string;
    description: string;
    descriptionPlaceholder: string;
    selectOffering: string;
    virtualOffering: string;
    prasad: string;
    flowers: string;
    incense: string;
    lamp: string;
    coconut: string;
    fruits: string;
    continue: string;
    continueToRitual: string;
    backToHome: string;
    
    // Ritual
    ritualTitle: string;
    ringBell: string;
    bellInstructions: string;
    bellTapInstruction: string;
    chantTitle: string;
    chantButton: string;
    chantInstructions: string;
    submitWish: string;
    proceedToShare: string;
    rings: string;
    chants: string;
    ritualComplete: string;
    completeBothRituals: string;
    
    // Share Step
    shareTitle: string;
    shareSubtitle: string;
    shareMessage: string;
    shareInstructions: string;
    shareOption1: string;
    shareOption2: string;
    shareOption3: string;
    shareButton: string;
    shareSuccess: string;
    continueToSubmit: string;
    shareOptional: string;
    skipShare: string;
    
    // Complete
    wishSubmitted: string;
    submittedMessage: string;
    sankalpStartedTitle: string;
    sankalpStartedText: string;
    blessingFrom: string;
    getAnotherBlessing: string;
    disclaimer: string;
    disclaimerText: string;
    disclaimerIntro: string;
    disclaimerPoints: string[];
    disclaimerNote: string;
    remember: string;
    rememberText: string;
    
    // 14-Day Practice
    sacredPractice: string;
    practiceSubtitle: string;
    practiceIntro: string;
    dailyPractices: string;
    dailyPractice1: string;
    dailyPractice2: string;
    dailyPractice3: string;
    spreadBlessings: string;
    spreadBlessing1: string;
    spreadBlessing2: string;
    completeCycle: string;
    completeCycle1: string;
    completeCycle2: string;
    completeCycle3: string;
    whyStrengthens: string;
    whyStrengthensText: string;
    optionalNote: string;
    noteLabel: string;
    
    // Final tips
    tip1: string;
    tip2: string;
    tip3: string;
    returnToTemple: string;
    makeAnother: string;
    shareTempleInfo: string;
    enterWishTitle: string;
    submitFailed: string;
  };
  
  // About Page
  about: {
    title: string;
    mission: string;
    missionText: string;
    features: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
    disclaimer: string;
    disclaimerText: string;
  };
  
  // Donate Page
  donate: {
    title: string;
    subtitle: string;
    optional: string;
    scanQR: string;
    scanInstruction: string;
    orUseUPI: string;
    upiInstruction: string;
    payNow: string;
    mobileOnly: string;
    transparency: string;
    point1: string;
    point2: string;
    point3: string;
    point4: string;
    copySuccess: string;
    copyButtonTitle: string;
    qrAlt: string;
    invalidAmount: string;
    loggedSuccess: string;
    thankYou: string;
    blessings: string;
    backToHome: string;
  };

  dailyQuote: {
    label: string;
    instruction: string;
    shareButton: string;
  };

  templeSelector: {
    headerTitle: string;
    dailyLoopAriaLabel: string;
    dailyDarshanTitle: string;
    dailyDarshanSubtitle: string;
    dailyRitualSteps: string[];
    todayFocus: string;
    startDarshan: string;
    startWish: string;
    sankalpWaiting: string;
    sankalpPractice: string;
    sankalpComplete: string;
    sankalpDay: string;
    continueSankalp: string;
    renewSankalp: string;
    chooseAnotherTemple: string;
    chooseTemple: string;
    shareWhatsApp: string;
    switchTempleAnytime: string;
    todayDeityFallback: string;
    enterTemple: string;
  };

  stats: {
    online: string;
    wishes: string;
  };

  flowerControl: {
    offerAction: string;
    label: string;
  };

  rewards: {
    spiritualJourney: string;
    pointsLabel: string;
    dayStreak: string;
    totalVisits: string;
    aartisDone: string;
    prasadReceived: string;
    earnedBadges: string;
    noBadges: string;
    recentActivity: string;
    activityDailyVisit: string;
    activityDailyVisitStreakBonus: string;
    activityWelcome: string;
    activityLightDiya: string;
    activityMakeWish: string;
    activityCompleteRitual: string;
    activityPerformAarti: string;
    activityRingBell: string;
    activityOfferFlowers: string;
    activityShareApp: string;
    activityReceivePrasad: string;
    activitySharePrasad: string;
    activityMeditation: string;
    activityWeeklyBonus: string;
    activityMonthlyBonus: string;
    activityDailyChallenge: string;
    activityMinutesInTemple: string;
    challengeActionDiya: string;
    challengeActionBell: string;
    challengeActionFlowers: string;
    challengeActionQuote: string;
    challengeActionAarti: string;
    challengeActionWish: string;
    challengeActionVisitShiva: string;
    challengeActionVisitDurga: string;
  };

  notifications: {
    promptTitle: string;
    promptDescription: string;
    enableButton: string;
    laterButton: string;
    welcomeBody: string;
    systemTitle: string;
    aartiStarting: string;
    joinInDevotion: string;
    morningAarti: string;
    afternoonAarti: string;
    eveningAarti: string;
    chantReminderTitle: string;
    chantReminderBody: string;
  };

  streak: {
    tapToExpand: string;
    levelLabel: string;
    nextMilestone: string;
    milestoneCongrats: string;
    startMessage: string;
    dayOneMessage: string;
    keepGoingMessage: string;
    weekCompleteMessage: string;
    devotionMessage: string;
    habitFormedMessage: string;
    amazingMessage: string;
    mandalaCompleteMessage: string;
    trueDevoteeMessage: string;
    sacredNumberMessage: string;
    greatSeekerMessage: string;
  };

  dashboard: {
    panchangTitle: string;
    tithi: string;
    paksha: string;
    day: string;
    nakshatra: string;
    yoga: string;
    hinduMonth: string;
    sunrise: string;
    sunset: string;
    rahukaal: string;
    luckyColor: string;
    luckyNumber: string;
    todayPresidingDeity: string;
    dailyChallengesTitle: string;
    startChallenge: string;
    allChallengesComplete: string;
    upcomingFestivalsTitle: string;
    festivalToday: string;
    festivalInDays: string;
    festivalDayShort: string;
    devotionStreak: string;
    streakTrueDevotee: string;
    streakMonth: string;
    streakWeek: string;
    streakGrowing: string;
    streakStarted: string;
  };

  prasadCollection: {
    title: string;
    progressLabel: string;
    rarityDivine: string;
    rarityRare: string;
    rarityUncommon: string;
    rarityCommon: string;
    emptyMessage: string;
    fromLabel: string;
    shareWhatsApp: string;
    toastDivine: string;
    toastRare: string;
    toastUncommon: string;
    toastCommon: string;
  };

  meditation: {
    title: string;
    sessions: string;
    minutes: string;
    streak: string;
    best: string;
    remaining: string;
    endSession: string;
    minuteUnit: string;
    infoMessage: string;
  };
  
  // Footer
  footer: {
    jaiHanuman: string;
    description: string;
    copyright: string;
    updateTitle: string;
    updateMessage: string;
    updateButton: string;
  };
  
  // Diya Feature
  diya: {
    lightButton: string;
    modalTitle: string;
    modalDescription: string;
    nameLabel: string;
    namePlaceholder: string;
    charCounter: string;
    remaining: string;
    cancel: string;
    lightDiya: string;
    lighting: string;
    noteTitle: string;
    noteDescription: string;
    diyaLit: string;
    diyas: string;
    hoursRemaining: string;
    minutesRemaining: string;
    timeRemaining: string;
  };

  // Developer Mode
  devMode: {
    title: string;
    close: string;
    templeHoursTitle: string;
    overrideTemple: string;
    forceOpen: string;
    templeOpenStatus: string;
    templeClosedStatus: string;
    hourlyChalisa: string;
    overrideChalisa: string;
    forcePlay: string;
    chalisaPlayingStatus: string;
    chalisaStoppedStatus: string;
    enableAudioFirst: string;
    scheduledChants: string;
    triggerChants: string;
    triggerChantInfo: string;
    debugging: string;
    showDebugLogs: string;
    quickInfo: string;
    toggleDevMode: string;
    changesPersist: string;
    refreshToSee: string;
  };

  // Common
  common: {
    jaiHanuman: string;
    loading: string;
    error: string;
    copyFailed: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = new BehaviorSubject<Language>('hi'); // Hindi default
  public language$: Observable<Language> = this.currentLanguage.asObservable();
  
  // Store current deity type for dynamic translations
  private currentDeity: DeityType = DeityType.HANUMAN;

  private translations: Record<Language, Translations> = {
    hi: {
  appTitle: 'श्री हनुमान मंदिर',
      
      home: {
      welcomeTitle: 'श्री हनुमान जी के पावन दरबार में आपका स्वागत है',
      welcomeSubtitle: 'शांत मन से दर्शन करें, प्रार्थना अर्पित करें और अपनी मनोकामना श्रद्धा से समर्पित करें।',
      makeWish: 'मनोकामना अर्पित करें 🪔',
      aboutTemple: 'मंदिर के बारे में',
      supportTitle: 'इस सेवा को सहयोग दें',
      supportMessage: 'यदि यह डिजिटल मंदिर आपकी भक्ति-यात्रा में सहायक लगे, तो आप इसके संचालन और रखरखाव में स्वेच्छा से सहयोग कर सकते हैं।',
      supportButton: '💰 सहयोग करें',
      supportOptional: 'यह पूरी तरह वैकल्पिक है - सेवा सभी भक्तों के लिए निःशुल्क रहेगी',
      },
      
      onboarding: {
        welcomeRitual: '🙏 पावन स्वागत अनुष्ठान',
        step1: '🔔 घंटी बजाएं और मंदिर में प्रवेश करें',
        step2: '🪔 दीप जलाएं और प्रणाम करें',
        step3: '🌺 श्री हनुमान को पुष्प अर्पित करें',
        enterTemple: 'मंदिर में प्रवेश करें',
        skipIntro: 'छोड़ें',
      },
      
      audio: {
  title: 'पावन श्रवण',
  subtitle: 'घंटेवार पावन पाठ',
  enableButton: 'दर्शन के दौरान पावन पाठ स्वतः चलने दें',
  enableHint: 'एक बार अनुमति दें ताकि ब्राउज़र स्वतः ऑडियो चला सके',
  automaticChanting: 'घंटेवार पावन पाठ',
  liveSync: 'लाइव प्रगति:',
  playing: 'पावन पाठ चल रहा है',
  waiting: 'अगले पाठ की प्रतीक्षा...',
  schedule: 'पाठ समय',
  playsEveryHour: 'हर घंटे की शुरुआत में',
  operatingHours: 'उपलब्धता',
  operatingHoursTime: '24x7',
  frequency: 'अंतराल',
  everyHour: 'हर घंटा',
  nextChantIn: 'अगला पाठ शुरू होगा:',
  at: 'पर',
  liveNow: 'अभी सुनें',
  joinedMinutes: 'आप इस घंटे के {{ minutes }}वें मिनट से जुड़े हैं',
  audioSynced: 'ऑडियो वर्तमान समय के अनुसार स्वतः सिंक हो गया है',
  volumeControl: 'आवाज़',
        tip: 'सुझाव:',
        tipMessage: 'आप किसी भी समय जुड़ें, पाठ उसी क्षण से शुरू होगा ताकि आपको पूरे घंटे की धारा से जुड़ने का अनुभव मिले। दूसरे पृष्ठ पर जाने पर भी ऑडियो चलता रहेगा।',
        duration: 'अवधि:',
        perSession: 'प्रति सत्र',
        statusPlaying: 'पावन पाठ चल रहा है',
        statusMessage: 'मंदिर का पाठ हर घंटे अपने समय पर शुरू होता है; आप जब भी आएँ, वहीं से जुड़ सकते हैं।',
        scheduleInfo: 'हर घंटे की शुरुआत में पावन पाठ अपने आप शुरू होता है',
        durationInfo: 'अवधि देवता के अनुसार बदलती है',
      },
      
      viralShare: {
        title: '🌟 भक्ति आगे बढ़ाएँ',
        subtitle: 'इस दर्शन को 3 प्रियजनों के साथ साझा करें',
        description: 'यदि आप चाहें, तो इस मंदिर को तीन लोगों तक पहुँचाएँ ताकि वे भी दर्शन, प्रार्थना और मनोकामना का लाभ ले सकें। भक्ति बाँटना भी एक सेवा है। 🙏',
        shareButton: '📱 3 लोगों तक भेजें',
        skipButton: 'अभी रहने दें',
        blessing: '✨ धन्यवाद! आपका साझा किया गया निमंत्रण भी एक भक्ति-सेवा है',
        shareCount: 'आपने अब तक {{ count }} लोगों के साथ साझा किया है',
      },
      
      wish: {
  createTitle: 'अपनी मनोकामना लिखें',
  createStep: 'मनोकामना',
  ritualStep: 'अनुष्ठान',
  shareStep: 'आमंत्रण साझा करें',
  completeStep: 'समर्पण पूर्ण',
  wishTitle: 'मनोकामना / प्रार्थना',
  wishTitlePlaceholder: 'जैसे - परिवार के लिए स्वास्थ्य और शांति',
  category: 'मनोकामना की श्रेणी',
  health: 'स्वास्थ्य एवं कल्याण',
  education: 'विद्या एवं ज्ञान',
  career: 'कैरियर एवं सफलता',
  family: 'परिवार एवं संबंध',
  wealth: 'समृद्धि एवं धन',
  spiritual: 'आध्यात्मिक साधना',
  general: 'सामान्य मनोकामना',
  description: 'विस्तार से लिखें (वैकल्पिक)',
  descriptionPlaceholder: 'यदि चाहें, तो अपनी प्रार्थना का भाव यहाँ लिखें...',
  selectOffering: 'भक्ति-भेंट चुनें',
  virtualOffering: 'आभासी भक्ति भेंट',
  prasad: 'प्रसाद',
  flowers: 'पुष्प',
  incense: 'अगरबत्ती',
  lamp: 'दीप',
  coconut: 'नारियल',
  fruits: 'फल',
  continue: 'आगे बढ़ें',
  continueToRitual: 'अनुष्ठान की ओर बढ़ें 🙏',
  backToHome: 'मुख्य मंदिर पृष्ठ पर लौटें',
        
  ritualTitle: 'पावन अनुष्ठान',
  ringBell: 'मंदिर की घंटी बजाएँ',
  bellInstructions: 'श्रद्धा से घंटी बजाकर अनुष्ठान आरंभ करें',
  bellTapInstruction: 'घंटी {{ count }} बार बजाएँ',
  chantTitle: 'नाम-स्मरण',
  chantButton: 'जय श्री हनुमान',
  chantInstructions: 'इष्टदेव का नाम ११ बार श्रद्धा से जपें',
  submitWish: 'मनोकामना अर्पित करें',
  proceedToShare: 'आशीर्वाद साझा करने के लिए आगे बढ़ें',
  rings: 'बार',
  chants: 'जप',
  ritualComplete: 'अनुष्ठान पूर्ण हुआ - अब अपनी मनोकामना अर्पित करें',
  completeBothRituals: 'मनोकामना अर्पित करने से पहले दोनों अनुष्ठान पूरे करें',
  
  shareTitle: 'मंदिर का आमंत्रण साझा करें',
  shareSubtitle: 'भक्ति आगे बढ़ाएँ',
  shareMessage: 'यदि आप चाहें, तो इस मंदिर को कम से कम 3 लोगों तक पहुँचाएँ ताकि वे भी दर्शन, प्रार्थना और मनोकामना का अनुभव कर सकें।',
  shareInstructions: 'आप निम्न माध्यमों से साझा कर सकते हैं:',
  shareOption1: 'WhatsApp पर परिवार या मित्रों को भेजें',
  shareOption2: 'Email, SMS, या सोशल मीडिया के माध्यम से',
  shareOption3: 'कोई भी अन्य संदेश ऐप',
  shareButton: 'मंदिर का आमंत्रण साझा करें',
  shareSuccess: 'धन्यवाद! अब आप अपनी मनोकामना अर्पित कर सकते हैं',
  continueToSubmit: 'मनोकामना अर्पित करें',
  shareOptional: 'यह कदम वैकल्पिक है, पर भक्तिभाव से अनुशंसित है',
  skipShare: 'इस कदम को छोड़ें',
        
        wishSubmitted: 'आपकी मनोकामना अर्पित हो गई',
        submittedMessage: 'आपकी प्रार्थना श्रद्धा सहित इष्टदेव के चरणों में समर्पित कर दी गई है।',
        sankalpStartedTitle: '14-दिवसीय संकल्प शुरू हो गया',
        sankalpStartedText: 'हर दिन लौटें, छोटा दर्शन करें और इसी मनोकामना को श्रद्धा से याद रखें।',
        blessingFrom: '{{ deity }} का आशीर्वाद',
        getAnotherBlessing: 'एक और आशीर्वाद पढ़ें',
        disclaimer: 'महत्वपूर्ण सूचना',
        disclaimerText: 'मनोकामना की सिद्धि पूर्णतः आपकी श्रद्धा, विश्वास, भक्ति और इष्टदेव की कृपा पर निर्भर करती है।',
        disclaimerIntro: 'यह मंच केवल भक्ति और आत्मिक अभिव्यक्ति हेतु है। हम किसी भी मनोकामना की पूर्ति का वादा या दावा नहीं करते। परिणाम निम्न बातों पर आधारित हैं:',
        disclaimerPoints: [
          'इष्टदेव में आपकी सच्ची श्रद्धा और विश्वास',
          'अपने लक्ष्यों के लिए आपका परिश्रम और कर्म',
          'दैवीय इच्छा और कृपा',
          'जीवन की परिस्थितियाँ और पूर्व कर्म'
        ],
        disclaimerNote: 'यह मंच केवल भक्ति और आत्मिक अभिव्यक्ति का स्थान है—किसी भी परिणाम की कोई गारंटी नहीं देता।',
        remember: 'याद रखें:',
        rememberText: 'सच्ची श्रद्धा, भक्ति और ईमानदार प्रयास ही सबसे महत्वपूर्ण हैं। देव सब भक्तों पर समान कृपा करते हैं, भेंट या अनुष्ठान से परे।',
        
  sacredPractice: 'पावन १४-दिवसीय साधना',
  practiceSubtitle: 'अपनी मनोकामना को जीवित रखने हेतु वैकल्पिक साधना',
  practiceIntro: 'प्राचीन परंपराओं के अनुसार, जो भक्त इन पावन साधनाओं का पालन करते हैं, उन्हें इष्टदेव की विशेष कृपा प्राप्त होती है। यह मार्ग ऐच्छिक है, किंतु अनगिनत भक्तों ने इसे अपनाया है।',
  dailyPractices: 'दैनिक साधना (१४ दिन)',
  dailyPractice1: 'हर सुबह श्रद्धा और एकाग्रता से इष्टदेव का पाठ और नाम-स्मरण करें',
  dailyPractice2: 'शुद्ध सात्त्विक (शाकाहारी) भोजन ग्रहण करें, जिससे मन और शरीर निर्मल रहें',
  dailyPractice3: 'हर दिन कृतज्ञता और प्रेम से प्रार्थना करें',
  spreadBlessings: 'आशीर्वाद साझा करें',
  spreadBlessing1: 'इस मंदिर का अनुभव कम से कम तीन लोगों से साझा करें',
  spreadBlessing2: 'उन्हें भी अपनी मनोकामना हेतु इष्टदेव का आशीर्वाद लेने को प्रेरित करें',
  completeCycle: 'पावन चक्र पूर्ण करें',
  completeCycle1: 'निरंतर 14 दिन साधना के बाद पुनः लौटें',
  completeCycle2: 'वही अनुष्ठान दोहराएँ (घंटी पाँच बार, इष्टदेव का नाम ग्यारह बार जपें)',
  completeCycle3: 'अपनी भक्ति और संकल्प को दृढ़ करने हेतु पुनः मनोकामना समर्पित करें',
  whyStrengthens: 'यह साधना आपकी मनोकामना को सशक्त क्यों बनाती है',
  whyStrengthensText: 'यह 14-दिवसीय साधना आपकी निष्ठा, समर्पण और अटूट श्रद्धा का प्रमाण है। परंपरा के अनुसार, ऐसी भक्ति दैवीय शक्तियों के संग गहन संबंध स्थापित कर आपकी मनोकामना की आध्यात्मिक शक्ति को बढ़ाती है। अनेक भक्तों ने इस साधना से आंतरिक शांति, स्पष्टता और जीवन में सकारात्मक परिवर्तन अनुभव किए हैं।',
  optionalNote: 'यह साधना पूर्णतः ऐच्छिक है और पारंपरिक आध्यात्मिक ज्ञान पर आधारित है। श्रद्धा और भक्ति प्रत्येक की निजी यात्रा है—केवल वही अपनाएँ जो आपके हृदय को स्पर्श करे। चाहे कोई साधना करें या न करें, देव की कृपा सबके लिए सुलभ है।',
  noteLabel: 'नोट:',
        
  tip1: 'हर दिन सच्ची श्रद्धा से इष्टदेव का पाठ और नाम-स्मरण करें',
  tip2: 'अपने लक्ष्य की ओर समर्पण और निरंतर प्रयास करें',
  tip3: 'दैवीय समय और श्री हनुमान जी की कृपा पर अटूट विश्वास रखें',
  returnToTemple: 'मंदिर लौटें',
  makeAnother: 'एक और मनोकामना करें',
  shareTempleInfo: 'मंदिर का आमंत्रण साझा करें',
  enterWishTitle: 'कृपया मनोकामना का शीर्षक लिखें',
  submitFailed: 'मनोकामना अर्पित नहीं हो सकी। कृपया फिर प्रयास करें।',
      },
      
      about: {
  title: 'मंदिर का परिचय',
  mission: 'हमारा उद्देश्य',
      missionText: 'यह एक डिजिटल मंदिर है, जहाँ भक्त कहीं से भी दर्शन, प्रार्थना और मनोकामना अर्पित कर सकते हैं।',
  features: 'विशेषताएँ',
  feature1: 'हर घंटे देव की दिव्य आरती और पाठ',
  feature2: 'मनोकामना अर्पण सेवा',
  feature3: 'पावन अनुष्ठान',
  feature4: 'आध्यात्मिक मार्गदर्शन',
  disclaimer: 'अस्वीकरण',
      disclaimerText: 'यह मंच केवल दर्शन, भक्ति और आत्मिक अभिव्यक्ति हेतु है।',
      },
      
      donate: {
        title: 'इस सेवा को सहयोग दें',
        subtitle: 'यदि यह मंदिर ऐप आपकी भक्ति में सहायक रहा हो, तो आप स्वेच्छा से योगदान कर सकते हैं',
        optional: 'यह पूर्णतः वैकल्पिक है - सेवा सभी के लिए निःशुल्क रहेगी',
        scanQR: 'UPI QR स्कैन करें',
        scanInstruction: 'किसी भी UPI ऐप से स्कैन करें और अपनी श्रद्धानुसार राशि अर्पित करें',
        orUseUPI: 'या UPI ID से भुगतान करें',
        upiInstruction: 'UPI ID कॉपी करें और अपने भुगतान ऐप में पेस्ट करें',
        payNow: 'अभी भुगतान करें',
        mobileOnly: 'यह बटन आमतौर पर मोबाइल उपकरणों पर बेहतर काम करता है',
        transparency: 'आपका सहयोग कहाँ उपयोग होता है',
        point1: '💰 योगदान सीधे ऐप के रखरखाव और सुधार में जाता है',
        point2: '🔒 कोई अनिवार्य शुल्क, संस्था शुल्क या छिपी फीस नहीं',
        point3: '✅ चाहे आप सहयोग करें या न करें, सेवा सभी के लिए खुली है',
        point4: '📊 वर्तमान मासिक लागत: लगभग ₹417 (डोमेन + होस्टिंग)',
        copySuccess: 'UPI ID कॉपी हो गई',
        copyButtonTitle: 'UPI ID कॉपी करें',
        qrAlt: 'UPI भुगतान QR कोड',
        invalidAmount: 'कृपया उचित दान राशि दर्ज करें',
        loggedSuccess: 'धन्यवाद! आपका योगदान दर्ज हो गया। 🙏',
        thankYou: 'आपके सहयोग के लिए धन्यवाद',
        blessings: 'ईश्वर की कृपा और शांति सदा आपके साथ रहे',
        backToHome: 'मंदिर लौटें',
      },

      dailyQuote: {
        label: 'आज का चिंतन',
        instruction: 'आज के दिन इस संदेश को अपने आचरण में उतारें 🙏',
        shareButton: 'WhatsApp पर साझा करें',
      },

      templeSelector: {
        headerTitle: 'मनोकामना वर्चुअल मंदिर',
        dailyLoopAriaLabel: 'आज का भक्ति अभ्यास',
        dailyDarshanTitle: 'आज का संक्षिप्त दर्शन',
        dailyDarshanSubtitle: '{{ deity }} के साथ 2 मिनट की शांत भक्ति',
        dailyRitualSteps: ['घंटी बजाएँ', 'दीया जलाएँ', 'मनोकामना करें'],
        todayFocus: 'आज का इष्टदेव',
        startDarshan: 'आज का दर्शन शुरू करें',
        startWish: 'आज की मनोकामना अर्पित करें',
        sankalpWaiting: 'आज का संकल्प अभी बाकी है',
        sankalpPractice: 'चल रहा संकल्प',
        sankalpComplete: '14 दिन पूर्ण',
        sankalpDay: 'दिन {{ day }} / {{ total }}',
        continueSankalp: 'संकल्प जारी रखें',
        renewSankalp: 'फिर से 14 दिन शुरू करें',
        chooseAnotherTemple: 'या किसी दूसरे मंदिर में जाएँ',
        chooseTemple: 'मंदिर चुनें',
        shareWhatsApp: 'WhatsApp पर साझा करें',
        switchTempleAnytime: 'आप किसी भी समय मंदिर बदल सकते हैं',
        todayDeityFallback: 'आज का देवता',
        enterTemple: 'प्रवेश करें',
      },

      stats: {
        online: 'ऑनलाइन',
        wishes: 'मनोकामनाएँ',
      },

      flowerControl: {
        offerAction: 'पुष्प अर्पित करें',
        label: 'पुष्प',
      },

      rewards: {
        spiritualJourney: 'आपकी भक्ति-यात्रा',
        pointsLabel: 'पुण्य अंक',
        dayStreak: 'लगातार दिन',
        totalVisits: 'कुल दर्शन',
        aartisDone: 'की गई आरतियाँ',
        prasadReceived: 'प्राप्त प्रसाद',
        earnedBadges: 'अर्जित बैज',
        noBadges: 'अभी कोई बैज नहीं। भक्ति जारी रखें।',
        recentActivity: 'हाल की गतिविधि',
        activityDailyVisit: 'आज दर्शन किए',
        activityDailyVisitStreakBonus: 'दैनिक दर्शन और निरंतरता बोनस',
        activityWelcome: 'मंदिर में प्रथम आगमन',
        activityLightDiya: 'दीया जलाया 🪔',
        activityMakeWish: 'मनोकामना अर्पित की 🙏',
        activityCompleteRitual: 'अनुष्ठान पूरा किया',
        activityPerformAarti: 'आरती की 🎵',
        activityRingBell: 'मंदिर की घंटी बजाई 🔔',
        activityOfferFlowers: 'पुष्प अर्पित किए 🌺',
        activityShareApp: 'मंदिर साझा किया 📤',
        activityReceivePrasad: 'प्रसाद प्राप्त किया 🍬',
        activitySharePrasad: 'प्रसाद साझा किया',
        activityMeditation: 'ध्यान साधना की 🧘',
        activityWeeklyBonus: '7 दिन की निरंतरता बोनस! 🎉',
        activityMonthlyBonus: '30 दिन की निरंतरता बोनस! 🎊',
        activityDailyChallenge: 'आज की साधना पूरी: {{ action }}',
        activityMinutesInTemple: 'मंदिर में {{ minutes }} मिनट बिताए',
        challengeActionDiya: 'दीया जलाना',
        challengeActionBell: 'घंटी बजाना',
        challengeActionFlowers: 'पुष्प अर्पित करना',
        challengeActionQuote: 'आज का चिंतन पढ़ना',
        challengeActionAarti: 'आरती सुनना',
        challengeActionWish: 'मनोकामना अर्पित करना',
        challengeActionVisitShiva: 'शिव मंदिर दर्शन',
        challengeActionVisitDurga: 'दुर्गा मंदिर दर्शन',
      },

      notifications: {
        promptTitle: '🙏 सुबह की आरती और पर्व स्मरण पाएं',
        promptDescription: 'सुबह-शाम की आरती, त्योहारों और विशेष भक्ति-दिवसों की सौम्य याद दिलाने दें',
        enableButton: '✅ हाँ, याद दिलाएँ',
        laterButton: 'बाद में',
        welcomeBody: 'अब आपको आरती, पर्व और विशेष दिनों की याद दिलाई जाएगी।',
        systemTitle: '🙏 मनोकामना',
        aartiStarting: '{{ label }} अभी शुरू हो रही है!',
        joinInDevotion: 'आइए भक्ति में शामिल हों।',
        morningAarti: 'प्रातः आरती',
        afternoonAarti: 'दोपहर आरती',
        eveningAarti: 'संध्या आरती',
        chantReminderTitle: 'मंदिर पाठ स्मरण',
        chantReminderBody: '{{ name }} का समय हो गया है',
      },

      streak: {
        tapToExpand: 'टैप करें',
        levelLabel: 'स्तर',
        nextMilestone: '{{ streak }}/{{ nextMilestone }} दिन अगले मील के पत्थर तक',
        milestoneCongrats: 'बधाई! {{ streak }} दिन की निरंतर भक्ति पूरी हुई!',
        startMessage: 'आज से अपनी भक्ति-लय शुरू करें!',
        dayOneMessage: 'पहला दिन! मंगलमय शुरुआत 🌱',
        keepGoingMessage: '{{ streak }} दिन! निरंतर बने रहें 💪',
        weekCompleteMessage: '7 दिन! एक सप्ताह की साधना पूर्ण 🎉',
        devotionMessage: '{{ streak }} दिन की भक्ति जारी है 🙏',
        habitFormedMessage: '21 दिन! साधना अब लय बन चुकी है ✨',
        amazingMessage: '{{ streak }} दिन! अद्भुत निष्ठा 🕉️',
        mandalaCompleteMessage: '40 दिन! एक मंडल पूर्ण 🪔',
        trueDevoteeMessage: '{{ streak }} दिन! सच्ची भक्ति बनी हुई है 🌺',
        sacredNumberMessage: '108 दिन! पावन संख्या पूर्ण 📿',
        greatSeekerMessage: '{{ streak }} दिन! आपकी साधना गहरी होती जा रही है 👑',
      },

      dashboard: {
        panchangTitle: 'आज का पंचांग',
        tithi: 'तिथि',
        paksha: 'पक्ष',
        day: 'वार',
        nakshatra: 'नक्षत्र',
        yoga: 'योग',
        hinduMonth: 'हिंदू मास',
        sunrise: 'सूर्योदय',
        sunset: 'सूर्यास्त',
        rahukaal: 'राहुकाल',
        luckyColor: 'शुभ रंग',
        luckyNumber: 'शुभ अंक',
        todayPresidingDeity: 'आज के अधिष्ठाता देवता',
        dailyChallengesTitle: 'आज की चुनौतियाँ',
        startChallenge: 'शुरू करें',
        allChallengesComplete: 'सभी चुनौतियाँ पूरी! कल फिर आएँ!',
        upcomingFestivalsTitle: 'आगामी त्योहार',
        festivalToday: '🎉 आज!',
        festivalInDays: '{{ count }} दिन बाद',
        festivalDayShort: '{{ count }} दिन',
        devotionStreak: 'लगातार भक्ति के दिन',
        streakTrueDevotee: '💎 आप सच्चे भक्त हैं! 100+ दिन!',
        streakMonth: '⭐ एक पूरा महीना! अद्भुत!',
        streakWeek: '🔥 एक सप्ताह पूरा! शानदार!',
        streakGrowing: '✨ लगातार बढ़ रहे हैं!',
        streakStarted: '🌱 यात्रा शुरू हुई! कल भी आएँ!',
      },

      prasadCollection: {
        title: 'मेरा प्रसाद संग्रह',
        progressLabel: '{{ count }}/{{ total }} अद्वितीय प्रसाद प्राप्त',
        rarityDivine: 'दिव्य',
        rarityRare: 'दुर्लभ',
        rarityUncommon: 'विशेष',
        rarityCommon: 'सामान्य',
        emptyMessage: 'आरती करें और दिव्य प्रसाद प्राप्त करें!',
        fromLabel: 'से प्राप्त:',
        shareWhatsApp: '📤 WhatsApp पर साझा करें',
        toastDivine: '✨ दिव्य प्रसाद:',
        toastRare: '💎 दुर्लभ प्रसाद:',
        toastUncommon: '🌟 विशेष प्रसाद:',
        toastCommon: '🙏 प्रसाद:',
      },

      meditation: {
        title: 'ध्यान साधना टाइमर',
        sessions: 'सत्र',
        minutes: 'मिनट',
        streak: '🔥 क्रम',
        best: 'श्रेष्ठ',
        remaining: 'शेष',
        endSession: '⏹️ सत्र समाप्त करें',
        minuteUnit: 'मिन',
        infoMessage: '🕉️ शांति में ठहरें। प्रतिदिन थोड़ी ध्यान साधना करें।',
      },
      
      footer: {
  jaiHanuman: 'जय श्री हनुमान',
  description: 'सभी भक्तों के लिए एक निःशुल्क डिजिटल भक्ति-स्थल। किसी भौतिक मंदिर ट्रस्ट से संबद्ध नहीं।',
  copyright: '© मनोकामना | ओपन-सोर्स PWA',
  updateTitle: 'नया संस्करण उपलब्ध!',
  updateMessage: 'मंदिर ऐप का नया संस्करण उपलब्ध है।',
  updateButton: 'अभी अपडेट करें',
      },
      
      common: {
  jaiHanuman: 'जय श्री हनुमान',
  loading: 'कृपया प्रतीक्षा करें...',
  error: 'त्रुटि',
  copyFailed: 'अभी कॉपी नहीं हो सका। कृपया फिर प्रयास करें।',
      },
      
      diya: {
        lightButton: 'दीया जलाएं',
        modalTitle: '🪔 किसी के लिए दीया जलाएं',
        modalDescription: 'अपने प्रियजन के लिए एक आभासी दीया जलाएँ। यह 24 घंटे तक आपकी प्रार्थना, स्नेह और मंगलकामना का प्रतीक बना रहेगा।',
        nameLabel: 'व्यक्ति का नाम',
        namePlaceholder: 'नाम दर्ज करें (जैसे, अम्मा, पापा, प्रिया)',
        charCounter: 'अक्षर',
        remaining: 'शेष',
        cancel: 'रद्द करें',
        lightDiya: '🪔 दीया जलाएं',
        lighting: 'जला रहे हैं...',
        noteTitle: 'नोट:',
        noteDescription: 'दीया 24 घंटे तक प्रकाशित रहेगा और उसके बाद स्वयं समाप्त हो जाएगा। सभी दीये केवल आपके अपने उपकरण में सुरक्षित रहते हैं।',
        diyaLit: 'दीया जलाया गया',
        diyas: 'दीये जलाए गए',
        hoursRemaining: 'घंटे शेष',
        minutesRemaining: 'मिनट शेष',
        timeRemaining: 'समय शेष',
      },
      
      devMode: {
        title: '🔧 डेवलपर नियंत्रण',
        close: 'बंद करें',
        templeHoursTitle: '⏰ मंदिर समय (24/7)',
        overrideTemple: 'मंदिर खुलने/बंद होने के समय को ओवरराइड करें',
        forceOpen: 'मंदिर को खुला रखने के लिए बाध्य करें',
        templeOpenStatus: '✅ मंदिर जबरन खुला है - परिवेशी ध्वनियां सक्रिय',
        templeClosedStatus: '🔒 मंदिर जबरन बंद है - परिवेशी ध्वनियां बंद',
        hourlyChalisa: '🎵 घंटेवार पवित्र संगीत',
        overrideChalisa: 'घंटेवार संगीत समय को ओवरराइड करें',
        forcePlay: 'संगीत अभी बजाने के लिए बाध्य करें',
        chalisaPlayingStatus: '▶️ संगीत तुरंत बजेगा',
        chalisaStoppedStatus: '⏸️ संगीत प्लेबैक रोका गया',
        enableAudioFirst: '(पहले ऑडियो प्लेयर सक्षम करें!)',
        scheduledChants: '🔔 निर्धारित जप',
        triggerChants: '⚡ सभी निर्धारित जप अभी शुरू करें',
        triggerChantInfo: 'यह तुरंत सभी सक्षम निर्धारित जप (सुबह की चालीसा, शाम की आरती, आदि) को सक्रिय करता है',
        debugging: '🐛 डीबगिंग',
        showDebugLogs: 'डीबग कंसोल लॉग दिखाएं',
        quickInfo: 'ℹ️ त्वरित जानकारी',
        toggleDevMode: 'डेव मोड टॉगल करें',
        changesPersist: 'परिवर्तन localStorage में बने रहते हैं',
        refreshToSee: 'प्रभाव देखने के लिए पृष्ठ रीफ्रेश करें',
      },
    },
    
    en: {
      appTitle: 'Hanuman Temple',
      
      home: {
        welcomeTitle: 'Welcome to the sacred darshan of Hanuman Ji',
        welcomeSubtitle: 'Offer a prayer, light a diya, and place your heartfelt wish before the deity.',
        makeWish: 'Offer a wish 🪔',
        aboutTemple: 'About this temple',
        supportTitle: 'Support this seva',
        supportMessage: 'If this digital temple has become part of your daily devotion, you can optionally help with its upkeep.',
        supportButton: '💰 Support',
        supportOptional: 'Entirely optional - the service stays free for every devotee',
      },
      
      onboarding: {
        welcomeRitual: '🙏 Sacred Welcome Ritual',
        step1: '🔔 Ring the bell and enter the temple',
        step2: '🪔 Light the lamp and bow down',
        step3: '🌺 Offer flowers to Shri Hanuman',
        enterTemple: 'Enter Temple',
        skipIntro: 'Skip',
      },
      
      audio: {
        title: 'Sacred Audio',
        subtitle: 'Hourly devotional recitation',
        enableButton: 'Let the sacred recitation play automatically during darshan',
        enableHint: 'Tap once so the browser can allow audio playback',
        automaticChanting: 'Hourly sacred recitation',
        liveSync: 'Live progress:',
        playing: 'Sacred recitation in progress',
        waiting: 'Waiting for the next recitation...',
        schedule: 'Recitation schedule',
        playsEveryHour: 'Begins at the start of every hour',
        operatingHours: 'Availability',
        operatingHoursTime: '24/7',
        frequency: 'Frequency',
        everyHour: 'Every hour',
        nextChantIn: 'Next recitation begins in:',
        at: 'at',
        liveNow: 'Live now',
        joinedMinutes: 'You joined {{ minutes }} minute(s) into the current hour',
        audioSynced: 'Audio was synced to the current point in the recitation',
        volumeControl: 'Volume',
        tip: 'Tip:',
        tipMessage: 'Join at any point in the hour and the audio will pick up from that moment, so your darshan stays in sync with the live cycle. It keeps playing even if you open another page.',
        duration: 'Duration:',
        perSession: 'per session',
        statusPlaying: 'Sacred recitation in progress',
        statusMessage: 'A fresh recitation begins every hour, and you can join from the current point whenever you arrive.',
        scheduleInfo: 'A new recitation starts automatically at the beginning of every hour',
        durationInfo: 'Length varies slightly by deity',
      },
      
      viralShare: {
        title: '🌟 Pass the blessing forward',
        subtitle: 'Share this darshan with 3 loved ones',
        description: 'If you wish, invite three people to visit this temple for darshan, prayer, and a heartfelt wish. Sharing a sacred space is also a form of devotion. 🙏',
        shareButton: '📱 Share with 3 people',
        skipButton: 'Maybe later',
        blessing: '✨ Thank you. Your invitation has carried this blessing forward.',
        shareCount: 'You have shared this temple with {{ count }} people',
      },
      
      wish: {
        createTitle: 'Place your wish before the deity',
        createStep: 'Wish',
        ritualStep: 'Ritual',
        shareStep: 'Share the invitation',
        completeStep: 'Offering complete',
        wishTitle: 'Wish or prayer',
        wishTitlePlaceholder: 'For example: Peace and good health for my family',
        category: 'Category',
        health: 'Health',
        education: 'Education',
        career: 'Career',
        family: 'Family',
        wealth: 'Wealth',
        spiritual: 'Spiritual',
        general: 'General',
        description: 'More context (optional)',
        descriptionPlaceholder: 'If you would like, share a little more about what you are praying for...',
        selectOffering: 'Choose a devotional offering',
        virtualOffering: 'Virtual Offering',
        prasad: 'Prasad',
        flowers: 'Flowers',
        incense: 'Incense',
        lamp: 'Lamp',
        coconut: 'Coconut',
        fruits: 'Fruits',
        continue: 'Continue',
        continueToRitual: 'Continue to the ritual 🙏',
        backToHome: 'Back to temple home',
        
        ritualTitle: 'Sacred ritual',
        ringBell: 'Ring the temple bell',
        bellInstructions: 'Begin the ritual by ringing the bell with focus',
        bellTapInstruction: 'Ring the bell {{ count }} times',
        chantTitle: 'Chant with devotion',
        chantButton: 'Jai Hanuman',
        chantInstructions: 'Chant the deity name 11 times with devotion',
        submitWish: 'Offer this wish',
        proceedToShare: 'Proceed to Share Blessings',
        rings: 'rings',
        chants: 'chants',
        ritualComplete: 'The ritual is complete. You may now offer your wish.',
        completeBothRituals: 'Complete both ritual steps before offering your wish',
        
        shareTitle: 'Invite someone to this temple',
        shareSubtitle: 'Let someone else take darshan too',
        shareMessage: 'If you wish, share this temple with at least 3 people so they can also visit for darshan, prayer, and a heartfelt wish.',
        shareInstructions: 'You can share through:',
        shareOption1: 'WhatsApp with family or friends',
        shareOption2: 'Email, SMS, or social media',
        shareOption3: 'Any other messaging platform',
        shareButton: 'Share this temple',
        shareSuccess: 'Thank you! Now you can submit your wish',
        continueToSubmit: 'Submit Your Wish',
        shareOptional: 'Optional, but meaningful if you want to pass the blessing forward',
        skipShare: 'Skip this step',
        
        wishSubmitted: 'Your wish has been offered',
        submittedMessage: 'Your prayer has been placed with devotion before your chosen deity.',
        sankalpStartedTitle: 'Your 14-day sankalp has begun',
        sankalpStartedText: 'Return each day for a short darshan and keep this wish in steady remembrance.',
        blessingFrom: 'A blessing from {{ deity }}',
        getAnotherBlessing: 'Read another blessing',
        disclaimer: 'Important Disclaimer',
        disclaimerText: 'Wish fulfillment is entirely a matter of personal faith, devotion, and spiritual belief.',
        disclaimerIntro: 'This is a digital platform for devotional expression only. We make no guarantees, promises, or claims about wish fulfillment. Results depend solely on:',
        disclaimerPoints: [
          'Your sincere devotion and faith in your chosen deity',
          'Your personal efforts and actions towards your goals',
          'Divine will and spiritual grace',
          'Natural life circumstances and karma'
        ],
        disclaimerNote: 'This platform does not guarantee any outcomes. We are simply providing a space for spiritual expression and devotion.',
        remember: 'Remember:',
        rememberText: 'Faith, devotion, and sincere effort are what truly matter. The divine power blesses all devotees equally, regardless of offerings.',
        
        sacredPractice: 'Sacred 14-Day Practice',
        practiceSubtitle: 'Optional devotional guidance to strengthen your wish',
        practiceIntro: 'According to ancient spiritual traditions, devotees who follow these sacred practices are believed to receive enhanced blessings from their chosen deity. While completely optional, this path has been followed by millions of devotees throughout centuries.',
        dailyPractices: 'Daily Spiritual Practices (14 Days)',
        dailyPractice1: 'Recite your deity\'s sacred mantras every morning with devotion and focus',
        dailyPractice2: 'Maintain a vegetarian diet (sattvic food) to purify body and mind',
        dailyPractice3: 'Offer daily prayers with sincere devotion and gratitude',
        spreadBlessings: 'Spread Divine Blessings',
        spreadBlessing1: 'Share your experience of this virtual temple with at least 3 people',
        spreadBlessing2: 'Encourage them to seek divine blessings for their own wishes',
        completeCycle: 'Complete the Sacred Cycle',
        completeCycle1: 'Return after 14 days of consistent practice',
        completeCycle2: 'Perform the same ritual again (ring bell 5 times, chant your deity\'s sacred name 11 times)',
        completeCycle3: 'Resubmit your wish to reinforce your devotion and intention',
        whyStrengthens: 'Why This Practice Strengthens Your Wish',
        whyStrengthensText: 'A 14-day sankalp does not guarantee any outcome, but it can deepen remembrance, discipline, and devotion around your prayer. Many devotees find that this steady rhythm brings greater clarity and inner calm.',
        optionalNote: 'This guidance is optional. Follow only what feels sincere to your own path of devotion and prayer.',
        noteLabel: 'Note:',
        
        tip1: 'Recite your deity\'s sacred mantras daily with sincere devotion',
        tip2: 'Work hard towards your goal with dedication',
        tip3: 'Have unwavering faith and patience in divine timing',
        returnToTemple: 'Return to the temple',
        makeAnother: 'Offer another wish',
        shareTempleInfo: 'Share this temple',
        enterWishTitle: 'Please enter a wish title',
        submitFailed: 'Your wish could not be submitted. Please try again.',
      },
      
      about: {
        title: 'About Temple',
        mission: 'Our Mission',
        missionText: 'This is a digital temple created as a quiet space for darshan, prayer, and devotional intention from anywhere.',
        features: 'Features',
        feature1: 'Hourly Automatic Divine Aarti',
        feature2: 'Wish Submission',
        feature3: 'Sacred Rituals',
        feature4: 'Spiritual Guidance',
        disclaimer: 'Disclaimer',
        disclaimerText: 'This platform is meant for darshan, prayer, and devotional expression only',
      },
      
      donate: {
        title: 'Support this seva',
        subtitle: 'If this temple app has supported your devotion, you may contribute voluntarily to help maintain it.',
        optional: 'Completely optional - the service remains free for everyone',
        scanQR: 'Scan the UPI QR',
        scanInstruction: 'Open any UPI app, scan the code, and offer any amount you feel is right.',
        orUseUPI: 'Or pay with the UPI ID',
        upiInstruction: 'Copy the UPI ID and paste it into your payment app',
        payNow: 'Pay now',
        mobileOnly: 'This button usually works best on mobile devices',
        transparency: 'Where your contribution goes',
        point1: '💰 Contributions go directly toward running and improving the app',
        point2: '🔒 No mandatory fees, middlemen, or hidden charges',
        point3: '✅ The service stays open to everyone, whether they contribute or not',
        point4: '📊 Current monthly cost: about ₹417 (domain + hosting)',
        copySuccess: 'UPI ID copied',
        copyButtonTitle: 'Copy UPI ID',
        qrAlt: 'UPI payment QR code',
        invalidAmount: 'Please enter a valid contribution amount',
        loggedSuccess: 'Thank you. Your contribution has been recorded. 🙏',
        thankYou: 'Thank you for your support',
        blessings: 'May grace, peace, and strength stay with you always',
        backToHome: 'Back to the temple',
      },

      dailyQuote: {
        label: 'Today\'s reflection',
        instruction: 'Carry this wisdom into your day 🙏',
        shareButton: 'Share on WhatsApp',
      },

      templeSelector: {
        headerTitle: 'Manokamna Virtual Temple',
        dailyLoopAriaLabel: 'Today\'s devotional practice',
        dailyDarshanTitle: 'Today\'s guided darshan',
        dailyDarshanSubtitle: 'A 2-minute devotional pause with {{ deity }}',
        dailyRitualSteps: ['Ring the bell', 'Light a diya', 'Offer your wish'],
        todayFocus: 'Today\'s deity',
        startDarshan: 'Begin today\'s darshan',
        startWish: 'Offer a wish today',
        sankalpWaiting: 'Today\'s sankalp is still pending',
        sankalpPractice: 'Active sankalp',
        sankalpComplete: '14 days complete',
        sankalpDay: 'Day {{ day }} of {{ total }}',
        continueSankalp: 'Continue sankalp',
        renewSankalp: 'Begin another 14 days',
        chooseAnotherTemple: 'Or visit another temple',
        chooseTemple: 'Temples',
        shareWhatsApp: 'Share on WhatsApp',
        switchTempleAnytime: 'You can switch temples anytime',
        todayDeityFallback: 'today\'s deity',
        enterTemple: 'Enter',
      },

      stats: {
        online: 'Online',
        wishes: 'Wishes',
      },

      flowerControl: {
        offerAction: 'Offer Flowers',
        label: 'Flowers',
      },

      rewards: {
        spiritualJourney: 'Your devotional journey',
        pointsLabel: 'Punya Points',
        dayStreak: 'Day Streak',
        totalVisits: 'Temple Visits',
        aartisDone: 'Aartis Completed',
        prasadReceived: 'Prasad Received',
        earnedBadges: 'Earned Badges',
        noBadges: 'No badges yet. Keep your practice going.',
        recentActivity: 'Recent Activity',
        activityDailyVisit: 'Visited the temple today',
        activityDailyVisitStreakBonus: 'Daily visit and streak bonus',
        activityWelcome: 'First visit to the temple',
        activityLightDiya: 'Lit a diya 🪔',
        activityMakeWish: 'Offered a wish 🙏',
        activityCompleteRitual: 'Completed a ritual',
        activityPerformAarti: 'Performed aarti 🎵',
        activityRingBell: 'Rang the temple bell 🔔',
        activityOfferFlowers: 'Offered flowers 🌺',
        activityShareApp: 'Shared the temple 📤',
        activityReceivePrasad: 'Received prasad 🍬',
        activitySharePrasad: 'Shared prasad',
        activityMeditation: 'Completed a meditation session 🧘',
        activityWeeklyBonus: '7-day streak bonus! 🎉',
        activityMonthlyBonus: '30-day streak bonus! 🎊',
        activityDailyChallenge: 'Completed today\'s practice: {{ action }}',
        activityMinutesInTemple: 'Spent {{ minutes }} minute(s) in the temple',
        challengeActionDiya: 'Lighting a diya',
        challengeActionBell: 'Ringing the bell',
        challengeActionFlowers: 'Offering flowers',
        challengeActionQuote: 'Reading today\'s reflection',
        challengeActionAarti: 'Listening to aarti',
        challengeActionWish: 'Offering a wish',
        challengeActionVisitShiva: 'Visiting the Shiva temple',
        challengeActionVisitDurga: 'Visiting the Durga temple',
      },

      notifications: {
        promptTitle: '🙏 Receive morning aarti and festival reminders',
        promptDescription: 'Get gentle reminders for morning and evening aarti, festivals, and special devotional days',
        enableButton: '✅ Yes, remind me',
        laterButton: 'Later',
        welcomeBody: 'You will now receive reminders for aarti, festivals, and special devotional days.',
        systemTitle: '🙏 Manokamna',
        aartiStarting: '{{ label }} is starting now!',
        joinInDevotion: 'Join us in devotion.',
        morningAarti: 'Morning Aarti',
        afternoonAarti: 'Afternoon Aarti',
        eveningAarti: 'Evening Aarti',
        chantReminderTitle: 'Temple Chant Reminder',
        chantReminderBody: 'It is time for {{ name }}',
      },

      streak: {
        tapToExpand: 'Tap to expand',
        levelLabel: 'Level',
        nextMilestone: '{{ streak }}/{{ nextMilestone }} days to the next milestone',
        milestoneCongrats: 'Congratulations! {{ streak }} days of steady devotion!',
        startMessage: 'Begin your devotional rhythm today!',
        dayOneMessage: 'Day 1! An auspicious beginning 🌱',
        keepGoingMessage: '{{ streak }} days! Keep the rhythm going 💪',
        weekCompleteMessage: '7 days! One full week of devotion 🎉',
        devotionMessage: '{{ streak }} days of steady devotion 🙏',
        habitFormedMessage: '21 days! The practice is becoming a habit ✨',
        amazingMessage: '{{ streak }} days! Remarkable dedication 🕉️',
        mandalaCompleteMessage: '40 days! One mandala complete 🪔',
        trueDevoteeMessage: '{{ streak }} days! A true devotee\'s rhythm 🌺',
        sacredNumberMessage: '108 days! A sacred milestone 📿',
        greatSeekerMessage: '{{ streak }} days! Your practice keeps deepening 👑',
      },

      dashboard: {
        panchangTitle: 'Today\'s Panchang',
        tithi: 'Tithi',
        paksha: 'Paksha',
        day: 'Day',
        nakshatra: 'Nakshatra',
        yoga: 'Yoga',
        hinduMonth: 'Hindu Month',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        rahukaal: 'Rahukaal',
        luckyColor: 'Lucky Color',
        luckyNumber: 'Lucky Number',
        todayPresidingDeity: 'Today\'s Presiding Deity',
        dailyChallengesTitle: 'Daily Challenges',
        startChallenge: 'Start',
        allChallengesComplete: 'All done! Come back tomorrow for new challenges!',
        upcomingFestivalsTitle: 'Upcoming Festivals',
        festivalToday: '🎉 Today!',
        festivalInDays: 'in {{ count }} days',
        festivalDayShort: '{{ count }}d',
        devotionStreak: 'Devotion Streak',
        streakTrueDevotee: '💎 You are a true devotee! 100+ days!',
        streakMonth: '⭐ A full month! Amazing!',
        streakWeek: '🔥 One week strong! Brilliant!',
        streakGrowing: '✨ Keep going, growing stronger!',
        streakStarted: '🌱 Journey started! Come back tomorrow!',
      },

      prasadCollection: {
        title: 'My Prasad Collection',
        progressLabel: '{{ count }}/{{ total }} unique prasad collected',
        rarityDivine: 'DIVINE',
        rarityRare: 'RARE',
        rarityUncommon: 'SPECIAL',
        rarityCommon: 'COMMON',
        emptyMessage: 'Perform aarti to receive divine prasad!',
        fromLabel: 'From:',
        shareWhatsApp: '📤 Share on WhatsApp',
        toastDivine: '✨ DIVINE Prasad:',
        toastRare: '💎 Rare Prasad:',
        toastUncommon: '🌟 Special Prasad:',
        toastCommon: '🙏 Prasad:',
      },

      meditation: {
        title: 'Meditation Timer',
        sessions: 'Sessions',
        minutes: 'Minutes',
        streak: '🔥 Streak',
        best: 'Best',
        remaining: 'remaining',
        endSession: '⏹️ End Session',
        minuteUnit: 'min',
        infoMessage: '🕉️ Find peace in stillness. Return for a little meditation each day.',
      },
      
      footer: {
        jaiHanuman: 'Jai Hanuman Ji',
        description: 'A free digital space for darshan and prayer. Not affiliated with a physical temple trust.',
        copyright: '© Manokamna | Open Source PWA',
        updateTitle: 'Update Available!',
        updateMessage: 'A new version of the temple app is ready.',
        updateButton: 'Update Now',
      },
      
      common: {
        jaiHanuman: 'Jai Hanuman',
        loading: 'Loading...',
        error: 'Error',
        copyFailed: 'Could not copy right now. Please try again.',
      },
      
      diya: {
        lightButton: 'Light a Diya',
        modalTitle: '🪔 Light a Diya for Someone',
        modalDescription: 'Light a virtual diya for someone you care about. It will glow for 24 hours as a gentle symbol of your prayer and goodwill.',
        nameLabel: 'Name of Person',
        namePlaceholder: 'Enter name (e.g., Amma, Papa, Priya)',
        charCounter: 'characters',
        remaining: 'remaining',
        cancel: 'Cancel',
        lightDiya: '🪔 Light Diya',
        lighting: 'Lighting...',
        noteTitle: 'Note:',
        noteDescription: 'The diya remains lit for 24 hours and then expires on its own. All diya data stays locally on your device.',
        diyaLit: 'Diya Lit',
        diyas: 'Diyas Lit',
        hoursRemaining: 'hours remaining',
        minutesRemaining: 'minutes remaining',
        timeRemaining: 'time remaining',
      },
      
      devMode: {
        title: '🔧 Developer Controls',
        close: 'Close',
        templeHoursTitle: '⏰ Temple Hours (24/7)',
        overrideTemple: 'Override temple open/close times',
        forceOpen: 'Force temple to be OPEN',
        templeOpenStatus: '✅ Temple is forced OPEN - ambient sounds active',
        templeClosedStatus: '🔒 Temple is forced CLOSED - ambient sounds off',
        hourlyChalisa: '🎵 Hourly Sacred Audio',
        overrideChalisa: 'Override hourly audio timing',
        forcePlay: 'Force audio to play now',
        chalisaPlayingStatus: '▶️ Audio will play immediately',
        chalisaStoppedStatus: '⏸️ Audio playback stopped',
        enableAudioFirst: '(first enable audio player!)',
        scheduledChants: '🔔 Scheduled Chants',
        triggerChants: '⚡ Trigger All Scheduled Chants Now',
        triggerChantInfo: 'This immediately triggers all enabled scheduled chants (Morning Chalisa, Evening Aarti, etc.)',
        debugging: '🐛 Debugging',
        showDebugLogs: 'Show debug console logs',
        quickInfo: 'ℹ️ Quick Info',
        toggleDevMode: 'Toggle dev mode',
        changesPersist: 'Changes persist in localStorage',
        refreshToSee: 'Refresh page to see effects',
      },
    },
  };

  constructor() {
    // Load saved language preference
    const savedLang = localStorage.getItem('temple-language') as Language;
    if (savedLang && (savedLang === 'hi' || savedLang === 'en')) {
      this.currentLanguage.next(savedLang);
    }
  }
  
  /**
   * Set current deity for context-aware translations
   */
  setDeityContext(deity: DeityType): void {
    this.currentDeity = deity;
  }
  
  /**
   * Private deity data map for all 5 deities
   */
  private readonly deityData: Record<DeityType, {
    audioTitle: { hi: string; en: string };
    enableAudio: { hi: string; en: string };
    playing: { hi: string; en: string };
    statusMsg: { hi: string; en: string };
    name: { hi: string; en: string };
    templeLabel: { hi: string; en: string };
    homeDescription: { hi: string; en: string };
    quoteSource: { hi: string; en: string };
    cardSubtitle: { hi: string; en: string };
    greeting: { hi: string; en: string };
    chantButton: { hi: string; en: string };
    chantInstructions: { hi: string; en: string };
    ritualTitle: { hi: string; en: string };
    blessing: { hi: string; en: string };
  }> = {
    [DeityType.HANUMAN]: {
      audioTitle: { hi: 'हनुमान चालीसा', en: 'Hanuman Chalisa' },
      enableAudio: { hi: 'दर्शन के दौरान हनुमान चालीसा स्वतः चलने दें', en: 'Let Hanuman Chalisa play automatically during darshan' },
      playing: { hi: 'हनुमान चालीसा चल रही है', en: 'Hanuman Chalisa is playing' },
      statusMsg: { hi: 'हनुमान चालीसा हर घंटे शुरू होती है; आप जब भी जुड़ें, वहीं से सुन सकते हैं।', en: 'Hanuman Chalisa begins every hour, and you can join from the current point whenever you arrive.' },
      name: { hi: 'श्री हनुमान जी', en: 'Lord Hanuman' },
      templeLabel: { hi: 'हनुमान मंदिर', en: 'Hanuman Temple' },
      homeDescription: { hi: 'हनुमान जी के चरणों में अपनी प्रार्थना अर्पित करें और साहस, सेवा तथा रक्षा का आशीर्वाद माँगें।', en: 'Offer your prayer at Hanuman Ji\'s feet and seek courage, protection, and steady strength.' },
      quoteSource: { hi: 'हनुमान चालीसा', en: 'Hanuman Chalisa' },
      cardSubtitle: { hi: 'बजरंगबली दर्शन', en: 'Bajrangbali Darshan' },
      greeting: { hi: 'जय श्री हनुमान', en: 'Jai Hanuman' },
      chantButton: { hi: 'जय श्री हनुमान', en: 'Jai Hanuman' },
      chantInstructions: { hi: '"जय श्री हनुमान" ११ बार श्रद्धा से जपें', en: 'Chant "Jai Hanuman" 11 times with devotion' },
      ritualTitle: { hi: 'हनुमान जी के लिए पावन अनुष्ठान', en: 'Sacred Hanuman ritual' },
      blessing: { hi: '✨ आपने यह भक्ति आगे बढ़ाई - श्री हनुमान जी की कृपा आप पर बनी रहे', en: '✨ You carried this blessing forward. May Shri Hanuman\'s grace stay with you.' }
    },
    [DeityType.GANESH]: {
      audioTitle: { hi: 'गणेश आरती', en: 'Ganesh Aarti' },
      enableAudio: { hi: 'दर्शन के दौरान गणेश आरती स्वतः चलने दें', en: 'Let Ganesh Aarti play automatically during darshan' },
      playing: { hi: 'गणेश आरती चल रही है', en: 'Ganesh Aarti is playing' },
      statusMsg: { hi: 'गणेश आरती हर घंटे शुरू होती है; आप जब भी जुड़ें, वहीं से सुन सकते हैं।', en: 'Ganesh Aarti begins every hour, and you can join from the current point whenever you arrive.' },
      name: { hi: 'श्री गणेश जी', en: 'Lord Ganesha' },
      templeLabel: { hi: 'गणेश मंदिर', en: 'Ganesh Temple' },
      homeDescription: { hi: 'श्री गणेश जी के समक्ष नई शुरुआत, बुद्धि और विघ्नों के निवारण के लिए प्रार्थना करें।', en: 'Pray before Shri Ganesha for wise beginnings, clarity, and the removal of obstacles.' },
      quoteSource: { hi: 'गणेश स्तोत्र', en: 'Ganesh Stotra' },
      cardSubtitle: { hi: 'विघ्नहर्ता दर्शन', en: 'Vighnaharta Darshan' },
      greeting: { hi: 'जय गणेश', en: 'Jai Ganesh' },
      chantButton: { hi: 'जय गणेश', en: 'Jai Ganesh' },
      chantInstructions: { hi: '"जय गणेश" ११ बार श्रद्धा से जपें', en: 'Chant "Jai Ganesh" 11 times with devotion' },
      ritualTitle: { hi: 'गणेश जी के लिए पावन अनुष्ठान', en: 'Sacred Ganesh ritual' },
      blessing: { hi: '✨ आपने यह भक्ति आगे बढ़ाई - श्री गणेश जी की कृपा आप पर बनी रहे', en: '✨ You carried this blessing forward. May Lord Ganesha\'s grace stay with you.' }
    },
    [DeityType.SHIVA]: {
      audioTitle: { hi: 'शिव आरती', en: 'Shiva Aarti' },
      enableAudio: { hi: 'दर्शन के दौरान शिव आरती स्वतः चलने दें', en: 'Let Shiva Aarti play automatically during darshan' },
      playing: { hi: 'शिव आरती चल रही है', en: 'Shiva Aarti is playing' },
      statusMsg: { hi: 'शिव आरती हर घंटे शुरू होती है; आप जब भी जुड़ें, वहीं से सुन सकते हैं।', en: 'Shiva Aarti begins every hour, and you can join from the current point whenever you arrive.' },
      name: { hi: 'भगवान शिव', en: 'Lord Shiva' },
      templeLabel: { hi: 'शिव मंदिर', en: 'Shiva Temple' },
      homeDescription: { hi: 'महादेव के शांत और करुणामय स्वरूप में ध्यान लगाएँ और भीतर की स्थिरता का आशीर्वाद माँगें।', en: 'Rest your mind in Mahadev\'s presence and seek inner stillness, grace, and strength.' },
      quoteSource: { hi: 'शिव स्तुति', en: 'Shiva Stuti' },
      cardSubtitle: { hi: 'महादेव दर्शन', en: 'Mahadev Darshan' },
      greeting: { hi: 'ॐ नमः शिवाय', en: 'Om Namah Shivaya' },
      chantButton: { hi: 'ॐ नमः शिवाय', en: 'Om Namah Shivaya' },
      chantInstructions: { hi: '"ॐ नमः शिवाय" ११ बार श्रद्धा से जपें', en: 'Chant "Om Namah Shivaya" 11 times with devotion' },
      ritualTitle: { hi: 'भगवान शिव के लिए पावन अनुष्ठान', en: 'Sacred Shiva ritual' },
      blessing: { hi: '✨ आपने यह भक्ति आगे बढ़ाई - भगवान शिव की कृपा आप पर बनी रहे', en: '✨ You carried this blessing forward. May Lord Shiva\'s grace stay with you.' }
    },
    [DeityType.KRISHNA]: {
      audioTitle: { hi: 'कृष्ण आरती', en: 'Krishna Aarti' },
      enableAudio: { hi: 'दर्शन के दौरान कृष्ण आरती स्वतः चलने दें', en: 'Let Krishna Aarti play automatically during darshan' },
      playing: { hi: 'कृष्ण आरती चल रही है', en: 'Krishna Aarti is playing' },
      statusMsg: { hi: 'कृष्ण आरती हर घंटे शुरू होती है; आप जब भी जुड़ें, वहीं से सुन सकते हैं।', en: 'Krishna Aarti begins every hour, and you can join from the current point whenever you arrive.' },
      name: { hi: 'श्री कृष्ण जी', en: 'Lord Krishna' },
      templeLabel: { hi: 'कृष्ण मंदिर', en: 'Krishna Temple' },
      homeDescription: { hi: 'श्री कृष्ण के मधुर सान्निध्य में प्रेम, करुणा और सही दिशा के लिए प्रार्थना करें।', en: 'Pray in Krishna\'s presence for love, wisdom, and gentle guidance.' },
      quoteSource: { hi: 'श्रीमद्भगवद्गीता, अध्याय 2, श्लोक 47', en: 'Bhagavad Gita, Chapter 2 Verse 47' },
      cardSubtitle: { hi: 'गोविंद दर्शन', en: 'Radhe Krishna Darshan' },
      greeting: { hi: 'हरे कृष्ण', en: 'Hare Krishna' },
      chantButton: { hi: 'हरे कृष्ण', en: 'Hare Krishna' },
      chantInstructions: { hi: '"हरे कृष्ण" ११ बार श्रद्धा से जपें', en: 'Chant "Hare Krishna" 11 times with devotion' },
      ritualTitle: { hi: 'श्री कृष्ण के लिए पावन अनुष्ठान', en: 'Sacred Krishna ritual' },
      blessing: { hi: '✨ आपने यह भक्ति आगे बढ़ाई - श्री कृष्ण की कृपा आप पर बनी रहे', en: '✨ You carried this blessing forward. May Lord Krishna\'s grace stay with you.' }
    },
    [DeityType.DURGA]: {
      audioTitle: { hi: 'दुर्गा आरती', en: 'Durga Aarti' },
      enableAudio: { hi: 'दर्शन के दौरान दुर्गा आरती स्वतः चलने दें', en: 'Let Durga Aarti play automatically during darshan' },
      playing: { hi: 'दुर्गा आरती चल रही है', en: 'Durga Aarti is playing' },
      statusMsg: { hi: 'दुर्गा आरती हर घंटे शुरू होती है; आप जब भी जुड़ें, वहीं से सुन सकते हैं।', en: 'Durga Aarti begins every hour, and you can join from the current point whenever you arrive.' },
      name: { hi: 'माँ दुर्गा', en: 'Goddess Durga' },
      templeLabel: { hi: 'दुर्गा मंदिर', en: 'Durga Temple' },
      homeDescription: { hi: 'माँ दुर्गा के चरणों में साहस, संरक्षण और शक्ति की प्रार्थना अर्पित करें।', en: 'Place your prayer before Maa Durga and seek strength, protection, and fearless grace.' },
      quoteSource: { hi: 'दुर्गा स्तुति', en: 'Durga Stuti' },
      cardSubtitle: { hi: 'शक्ति दर्शन', en: 'Sherawali Mata Darshan' },
      greeting: { hi: 'जय माता दी', en: 'Jai Mata Di' },
      chantButton: { hi: 'जय माता दी', en: 'Jai Mata Di' },
      chantInstructions: { hi: '"जय माता दी" ११ बार श्रद्धा से जपें', en: 'Chant "Jai Mata Di" 11 times with devotion' },
      ritualTitle: { hi: 'माँ दुर्गा के लिए पावन अनुष्ठान', en: 'Sacred Durga ritual' },
      blessing: { hi: '✨ आपने यह भक्ति आगे बढ़ाई - माँ दुर्गा की कृपा आप पर बनी रहे', en: '✨ You carried this blessing forward. May Goddess Durga\'s grace stay with you.' }
    }
  };

  private normalizeDeity(deity: DeityType | string): DeityType {
    return (Object.values(DeityType).includes(deity as DeityType)
      ? deity
      : DeityType.HANUMAN) as DeityType;
  }

  private getTextForDeity(deity: DeityType | string, field: 'templeLabel' | 'homeDescription' | 'quoteSource' | 'cardSubtitle'): string {
    const normalizedDeity = this.normalizeDeity(deity);
    const lang = this.currentLanguage.value;
    return this.deityData[normalizedDeity]?.[field]?.[lang] || '';
  }

  private getDeityText(field: string): string {
    const lang = this.currentLanguage.value;
    const data = this.deityData[this.currentDeity] || this.deityData[DeityType.HANUMAN];
    return (data as any)[field]?.[lang] || '';
  }

  /**
   * Get deity-specific audio title
   */
  getAudioTitle(): string {
    return this.getDeityText('audioTitle');
  }
  
  /**
   * Get deity-specific enable audio button text
   */
  getEnableAudioText(): string {
    return this.getDeityText('enableAudio');
  }
  
  /**
   * Get deity-specific "playing" status text
   */
  getPlayingText(): string {
    return this.getDeityText('playing');
  }
  
  /**
   * Get deity-specific status message
   */
  getStatusMessage(): string {
    return this.getDeityText('statusMsg');
  }
  
  /**
   * Get deity name for general use
   */
  getDeityName(): string {
    return this.getDeityText('name');
  }

  getTempleLabel(deity: DeityType | string): string {
    return this.getTextForDeity(deity, 'templeLabel');
  }

  getTempleHomeDescription(deity: DeityType | string): string {
    return this.getTextForDeity(deity, 'homeDescription');
  }

  getTempleQuoteSource(deity: DeityType | string): string {
    return this.getTextForDeity(deity, 'quoteSource');
  }

  getTempleCardSubtitle(deity: DeityType | string): string {
    return this.getTextForDeity(deity, 'cardSubtitle');
  }
  
  /**
   * Get deity-specific greeting
   */
  getDeityGreeting(): string {
    return this.getDeityText('greeting');
  }
  
  /**
   * Get deity-specific chant button text
   */
  getChantButtonText(): string {
    return this.getDeityText('chantButton');
  }
  
  /**
   * Get deity-specific chant instructions
   */
  getChantInstructions(): string {
    return this.getDeityText('chantInstructions');
  }
  
  /**
   * Get deity-specific ritual title
   */
  getRitualTitle(): string {
    return this.getDeityText('ritualTitle');
  }
  
  /**
   * Get deity-specific blessing text
   */
  getBlessingText(): string {
    return this.getDeityText('blessing');
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.next(lang);
    localStorage.setItem('temple-language', lang);
  }

  getTranslations(): Translations {
    return this.translations[this.currentLanguage.value];
  }

  format(key: string, params: Record<string, string | number>): string {
    const template = this.t(key);
    if (typeof template !== 'string') {
      return template;
    }

    return Object.entries(params).reduce((result, [paramKey, value]) => {
      const pattern = new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g');
      return result.replace(pattern, String(value));
    }, template);
  }

  t(key: string): any {
    const translations = this.getTranslations();
    const keys = key.split('.');
    let result: any = translations;
    
    for (const k of keys) {
      result = result?.[k];
    }
    
    return result || key;
  }
}
