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
    chantTitle: string;
    chantButton: string;
    chantInstructions: string;
    submitWish: string;
    proceedToShare: string;
    rings: string;
    chants: string;
    ritualComplete: string;
    
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
    
    // Final tips
    tip1: string;
    tip2: string;
    tip3: string;
    returnToTemple: string;
    makeAnother: string;
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
    thankYou: string;
    blessings: string;
    backToHome: string;
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
  welcomeTitle: 'श्री हनुमान जी की कृपा में आपका हार्दिक स्वागत',
  welcomeSubtitle: 'अपनी मनोकामना प्रकट करें, भक्ति भाव से प्रार्थना करें और पवनपुत्र श्री हनुमान जी की दिव्य कृपा पाएं',
  makeWish: 'श्री हनुमान को अपनी मनोकामना अर्पित करें 🪔',
  aboutTemple: 'मंदिर का परिचय',
  supportTitle: 'इस सेवा का समर्थन करें',
  supportMessage: 'यदि आपको यह सेवा उपयोगी लगी हो और आप इसके रखरखाव में सहयोग करना चाहें, तो योगदान का स्वागत है।',
  supportButton: '💰 दान करें',
  supportOptional: 'पूर्णतः स्वैच्छिक - सेवा सभी के लिए निःशुल्क रहेगी',
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
  title: 'हनुमान चालीसा',
  subtitle: 'हर घंटे पावन पाठ',
  enableButton: 'हनुमान चालीसा स्वतः चलाएं – अपने घर को आशीर्वाद दें',
  enableHint: 'ऑटो-प्ले हेतु आवश्यक—ब्राउज़र सुरक्षा नीति',
  automaticChanting: 'स्वचालित घंटेवार जप',
  liveSync: 'लाइव सिंक:',
  playing: 'हनुमान चालीसा का पाठ हो रहा है',
  waiting: 'प्रतीक्षा करें...',
  schedule: 'समय-सारणी',
  playsEveryHour: 'हर घंटे बजती है',
  operatingHours: 'मंदिर संचालन समय',
  operatingHoursTime: 'सुबह 5 बजे से शाम 7 बजे तक',
  frequency: 'आवृत्ति',
  everyHour: 'हर घंटा',
  nextChantIn: 'अगला जप शुरू होगा:',
  at: 'पर',
  liveNow: 'अभी लाइव!',
  joinedMinutes: '{{ minutes }} मिनट बाद जुड़े',
  audioSynced: 'ऑडियो समय के अनुसार स्वतः सिंक हो गया है',
  volumeControl: 'आवाज़ नियंत्रण',
        tip: 'सुझाव:',
        tipMessage: 'यदि आप 10:05 पर जुड़ते हैं, तो ऑडियो स्वतः 5वें मिनट से शुरू होगा ताकि आप घंटेवार कार्यक्रम के साथ पूरी तरह सिंक रहें। अन्य पृष्ठों पर जाने पर भी ऑडियो चलता रहेगा।',
        duration: 'अवधि:',
        perSession: 'प्रति सत्र',
        statusPlaying: 'हनुमान चालीसा चल रही है',
        statusMessage: 'हनुमान चालीसा हर घंटे सुबह 5 बजे से शाम 7 बजे तक चलती है',
        scheduleInfo: 'हर घंटे की शुरुआत में ऑडियो चलता है (सुबह 5 बजे से शाम 7 बजे तक)',
        durationInfo: 'अवधि: प्रति सत्र 8 मिनट 32 सेकंड',
      },
      
      viralShare: {
        title: '🌟 विशेष आशीर्वाद प्राप्त करें',
        subtitle: 'इस मंदिर को 3 भक्तों के साथ साझा करें',
        description: 'जब आप इस पावन मंदिर के बारे में अपने 3 प्रियजनों को बताते हैं, तो आपकी भक्ति और मनोकामना की शक्ति कई गुना बढ़ जाती है। आशीर्वाद बांटना ही आशीर्वाद पाना है। 🙏',
        shareButton: '📱 3 भक्तों के साथ साझा करें',
        skipButton: 'अभी नहीं',
        blessing: '✨ धन्यवाद! श्री हनुमान की विशेष कृपा आप पर बनी रहे',
        shareCount: 'आपने {{ count }} लोगों के साथ साझा किया है',
      },
      
      wish: {
  createTitle: 'अपनी मनोकामना यहाँ लिखें',
  createStep: 'मनोकामना लिखें',
  ritualStep: 'पवित्र अनुष्ठान',
  shareStep: 'आशीर्वाद साझा करें',
  completeStep: 'समर्पण पूर्ण',
  wishTitle: 'मनोकामना का शीर्षक',
  wishTitlePlaceholder: 'जैसे— मेरे परिवार को स्वस्थ रखें',
  category: 'मनोकामना की श्रेणी',
  health: 'स्वास्थ्य एवं कल्याण',
  education: 'विद्या एवं ज्ञान',
  career: 'कैरियर एवं सफलता',
  family: 'परिवार एवं संबंध',
  wealth: 'समृद्धि एवं धन',
  spiritual: 'आध्यात्मिक साधना',
  description: 'विस्तृत विवरण (वैकल्पिक)',
  descriptionPlaceholder: 'अपनी मनोकामना के भाव और कारण साझा करें…',
  selectOffering: 'अपनी भक्ति भेंट चुनें',
  virtualOffering: 'आभासी भक्ति भेंट',
  prasad: 'प्रसाद',
  flowers: 'पुष्प',
  incense: 'अगरबत्ती',
  lamp: 'दीप',
  coconut: 'नारियल',
  fruits: 'फल',
  continue: 'आगे बढ़ें',
  continueToRitual: 'पवित्र अनुष्ठान की ओर बढ़ें 🙏',
  backToHome: '← मंदिर पृष्ठ पर लौटें',
        
  ritualTitle: 'पवित्र हनुमान साधना',
  ringBell: 'घंटी बजाएँ (पावन ध्वनि)',
  bellInstructions: 'घंटी ५ बार बजाएँ',
  chantTitle: 'जप एवं स्मरण',
  chantButton: 'जय श्री हनुमान',
  chantInstructions: '"जय श्री हनुमान" ११ बार श्रद्धा से जपें',
  submitWish: 'अपनी मनोकामना अर्पित करें',
  proceedToShare: 'आशीर्वाद साझा करने के लिए आगे बढ़ें',
  rings: 'बार',
  chants: 'जप',
  ritualComplete: 'अनुष्ठान पूर्ण! अब आप आशीर्वाद साझा कर सकते हैं',
  
  shareTitle: 'मंदिर की जानकारी साझा करें',
  shareSubtitle: 'दिव्य आशीर्वाद फैलाएं',
  shareMessage: 'कृपया इस मंदिर के बारे में कम से कम 3 लोगों को बताएं और उन्हें भी दिव्य आशीर्वाद लेने के लिए प्रोत्साहित करें। आशीर्वाद साझा करना आपके विश्वास और भक्ति को मजबूत करता है।',
  shareInstructions: 'आप निम्न माध्यमों से साझा कर सकते हैं:',
  shareOption1: 'WhatsApp पर परिवार या मित्रों को भेजें',
  shareOption2: 'Email, SMS, या सोशल मीडिया के माध्यम से',
  shareOption3: 'कोई भी अन्य संदेश ऐप',
  shareButton: 'मंदिर की जानकारी साझा करें',
  shareSuccess: 'धन्यवाद! अब आप अपनी मनोकामना अर्पित कर सकते हैं',
  continueToSubmit: 'मनोकामना अर्पित करें',
  shareOptional: 'यह कदम वैकल्पिक है, लेकिन अनुशंसित है',
  skipShare: 'इस कदम को छोड़ें',
        
        wishSubmitted: 'आपकी मनोकामना अर्पित हो गई!',
        submittedMessage: 'आपकी प्रार्थना श्रद्धा सहित श्री हनुमान जी के चरणों में समर्पित कर दी गई है।',
        disclaimer: 'महत्वपूर्ण सूचना',
        disclaimerText: 'मनोकामना की सिद्धि पूर्णतः आपकी श्रद्धा, विश्वास, भक्ति और श्री हनुमान जी की कृपा पर निर्भर करती है।',
        disclaimerIntro: 'यह मंच केवल भक्ति और आत्मिक अभिव्यक्ति हेतु है। हम किसी भी मनोकामना की पूर्ति का वादा या दावा नहीं करते। परिणाम निम्न बातों पर आधारित हैं:',
        disclaimerPoints: [
          'श्री हनुमान जी में आपकी सच्ची श्रद्धा और विश्वास',
          'अपने लक्ष्यों के लिए आपका परिश्रम और कर्म',
          'दैवीय इच्छा और कृपा',
          'जीवन की परिस्थितियाँ और पूर्व कर्म'
        ],
        disclaimerNote: 'यह मंच केवल भक्ति और आत्मिक अभिव्यक्ति का स्थान है—किसी भी परिणाम की कोई गारंटी नहीं देता।',
        remember: 'याद रखें:',
        rememberText: 'सच्ची श्रद्धा, भक्ति और ईमानदार प्रयास ही सबसे महत्वपूर्ण हैं। श्री हनुमान जी सब भक्तों पर समान कृपा करते हैं, भेंट या अनुष्ठान से परे।',
        
  sacredPractice: 'पावन १४-दिवसीय साधना',
  practiceSubtitle: 'अपनी मनोकामना को सशक्त करने हेतु वैकल्पिक साधना मार्ग',
  practiceIntro: 'प्राचीन परंपराओं के अनुसार, जो भक्त इन पावन साधनाओं का पालन करते हैं, उन्हें श्री हनुमान जी की विशेष कृपा प्राप्त होती है। यह मार्ग ऐच्छिक है, किंतु अनगिनत भक्तों ने इसे अपनाया है।',
  dailyPractices: 'दैनिक साधना (१४ दिन)',
  dailyPractice1: 'हर सुबह श्रद्धा और एकाग्रता से श्री हनुमान चालीसा का पाठ करें',
  dailyPractice2: 'शुद्ध सात्त्विक (शाकाहारी) भोजन ग्रहण करें, जिससे मन और शरीर निर्मल रहें',
  dailyPractice3: 'हर दिन कृतज्ञता और प्रेम से प्रार्थना करें',
  spreadBlessings: 'आशीर्वाद साझा करें',
  spreadBlessing1: 'इस मंदिर का अनुभव कम से कम तीन लोगों से साझा करें',
  spreadBlessing2: 'उन्हें भी अपनी मनोकामना हेतु श्री हनुमान जी का आशीर्वाद लेने को प्रेरित करें',
  completeCycle: 'पावन चक्र पूर्ण करें',
  completeCycle1: 'निरंतर 14 दिन साधना के बाद पुनः लौटें',
  completeCycle2: 'वही अनुष्ठान दोहराएँ (घंटी पाँच बार, “जय हनुमान” ग्यारह बार जपें)',
  completeCycle3: 'अपनी भक्ति और संकल्प को दृढ़ करने हेतु पुनः मनोकामना समर्पित करें',
  whyStrengthens: 'यह साधना आपकी मनोकामना को सशक्त क्यों बनाती है',
  whyStrengthensText: 'यह 14-दिवसीय साधना आपकी निष्ठा, समर्पण और अटूट श्रद्धा का प्रमाण है। परंपरा के अनुसार, ऐसी भक्ति दैवीय शक्तियों के संग गहन संबंध स्थापित कर आपकी मनोकामना की आध्यात्मिक शक्ति को बढ़ाती है। अनेक भक्तों ने इस साधना से आंतरिक शांति, स्पष्टता और जीवन में सकारात्मक परिवर्तन अनुभव किए हैं।',
  optionalNote: 'नोट: यह साधना पूर्णतः ऐच्छिक है और पारंपरिक आध्यात्मिक ज्ञान पर आधारित है। श्रद्धा और भक्ति प्रत्येक की निजी यात्रा है—केवल वही अपनाएँ जो आपके हृदय को स्पर्श करे। चाहे कोई साधना करें या न करें, श्री हनुमान जी की कृपा सबके लिए सुलभ है।',
        
  tip1: 'हर दिन सच्ची श्रद्धा से श्री हनुमान चालीसा का पाठ करें',
  tip2: 'अपने लक्ष्य की ओर समर्पण और निरंतर प्रयास करें',
  tip3: 'दैवीय समय और श्री हनुमान जी की कृपा पर अटूट विश्वास रखें',
  returnToTemple: 'मंदिर लौटें',
  makeAnother: 'नई मनोकामना करें',
      },
      
      about: {
  title: 'मंदिर का परिचय',
  mission: 'हमारा उद्देश्य',
  missionText: 'यह एक आभासी मंदिर है, जो भक्तों को श्री हनुमान जी की भक्ति और कृपा से जोड़ने हेतु समर्पित है।',
  features: 'विशेषताएँ',
  feature1: 'हर घंटे श्री हनुमान चालीसा का दिव्य पाठ',
  feature2: 'मनोकामना अर्पण सेवा',
  feature3: 'पावन अनुष्ठान',
  feature4: 'आध्यात्मिक मार्गदर्शन',
  disclaimer: 'अस्वीकरण',
  disclaimerText: 'यह मंच केवल भक्ति और आत्मिक अभिव्यक्ति हेतु है।',
      },
      
      donate: {
        title: 'इस सेवा का समर्थन करें',
        subtitle: 'यदि आपको यह सेवा उपयोगी लगी हो, तो आप स्वेच्छा से योगदान कर सकते हैं',
        optional: 'पूर्णतः स्वैच्छिक - सेवा सभी के लिए निःशुल्क रहेगी',
        scanQR: 'QR कोड स्कैन करें',
        scanInstruction: 'किसी भी UPI ऐप से स्कैन करें और भुगतान करें',
        orUseUPI: 'या UPI ID का उपयोग करें',
        upiInstruction: 'UPI ID कॉपी करें और अपने भुगतान ऐप में उपयोग करें',
        payNow: 'अभी भुगतान करें',
        mobileOnly: 'केवल मोबाइल उपकरणों पर काम करता है',
        transparency: '100% पारदर्शिता',
        point1: '💰 सभी योगदान सीधे डेवलपर के पास जाते हैं',
        point2: '🔒 कोई छिपी हुई फीस या संस्था नहीं',
        point3: '✅ सेवा योगदान की परवाह किए बिना निःशुल्क रहती है',
        point4: '📊 मासिक लागत: ~₹417 (डोमेन + होस्टिंग)',
        thankYou: 'आपकी उदारता के लिए धन्यवाद',
        blessings: 'श्री हनुमान जी की कृपा सदा आप पर बनी रहे',
        backToHome: 'मंदिर लौटें',
      },
      
      footer: {
  jaiHanuman: 'जय श्री हनुमान',
  description: 'यह सेवा सभी भक्तों के लिए पूर्णतः निःशुल्क है। किसी भी मंदिर संस्था से कोई औपचारिक संबंध नहीं है।',
  copyright: '© 2025 करुणामयी श्री हनुमान ई-मंदिर | ओपन-सोर्स PWA',
  updateTitle: 'नया संस्करण उपलब्ध!',
  updateMessage: 'मंदिर ऐप का नया संस्करण उपलब्ध है।',
  updateButton: 'अभी अपडेट करें',
      },
      
      common: {
  jaiHanuman: 'जय श्री हनुमान',
  loading: 'कृपया प्रतीक्षा करें...',
  error: 'त्रुटि',
      },
      
      diya: {
        lightButton: 'दीया जलाएं',
        modalTitle: '🪔 किसी के लिए दीया जलाएं',
        modalDescription: 'अपने प्रियजनों के लिए श्री हनुमान मंदिर में एक आभासी दीया जलाएं। दीया आपकी भक्ति और प्रार्थनाओं के प्रतीक के रूप में 24 घंटे तक जलता रहेगा।',
        nameLabel: 'व्यक्ति का नाम',
        namePlaceholder: 'नाम दर्ज करें (जैसे, अम्मा, पापा, प्रिया)',
        charCounter: 'अक्षर',
        remaining: 'शेष',
        cancel: 'रद्द करें',
        lightDiya: '🪔 दीया जलाएं',
        lighting: 'जला रहे हैं...',
        noteTitle: 'नोट:',
        noteDescription: 'आपका दीया 24 घंटे तक जलता रहेगा और फिर स्वचालित रूप से समाप्त हो जाएगा। सभी दीये केवल आपके उपकरण में स्थानीय रूप से संग्रहीत हैं।',
        diyaLit: 'दीया जलाया गया',
        diyas: 'दीये जलाए गए',
        hoursRemaining: 'घंटे शेष',
        minutesRemaining: 'मिनट शेष',
        timeRemaining: 'समय शेष',
      },
      
      devMode: {
        title: '🔧 डेवलपर नियंत्रण',
        close: 'बंद करें',
        templeHoursTitle: '⏰ मंदिर समय (सुबह 5 बजे - शाम 7 बजे)',
        overrideTemple: 'मंदिर खुलने/बंद होने के समय को ओवरराइड करें',
        forceOpen: 'मंदिर को खुला रखने के लिए बाध्य करें',
        templeOpenStatus: '✅ मंदिर जबरन खुला है - परिवेशी ध्वनियां सक्रिय',
        templeClosedStatus: '🔒 मंदिर जबरन बंद है - परिवेशी ध्वनियां बंद',
        hourlyChalisa: '🎵 घंटेवार हनुमान चालीसा',
        overrideChalisa: 'घंटेवार चालीसा समय को ओवरराइड करें',
        forcePlay: 'चालीसा को अभी बजाने के लिए बाध्य करें',
        chalisaPlayingStatus: '▶️ चालीसा तुरंत बजेगी',
        chalisaStoppedStatus: '⏸️ चालीसा प्लेबैक रोका गया',
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
        welcomeTitle: 'Welcome to Hanuman Ji\'s Blessings',
        welcomeSubtitle: 'Make your wishes, offer prayers, and seek blessings from the mighty Pawanputra',
        makeWish: 'Offer Your Manokamna to Shri Hanuman 🪔',
        aboutTemple: 'About Temple',
        supportTitle: 'Support This Service',
        supportMessage: 'If you find this service helpful and wish to support its maintenance, contributions are gratefully accepted.',
        supportButton: '💰 Donate',
        supportOptional: 'Completely optional - service remains free for all',
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
        title: 'Hanuman Chalisa',
        subtitle: 'Hourly Divine Recitation',
        enableButton: 'Let Hanuman Chalisa Play Automatically – Bless Your Home',
        enableHint: 'Required for auto-playing audio - browser security policy',
        automaticChanting: 'Automatic Hourly Chanting',
        liveSync: 'Live Sync:',
        playing: 'Playing Hanuman Chalisa',
        waiting: 'Waiting...',
        schedule: 'Schedule',
        playsEveryHour: 'Plays every hour on the hour',
        operatingHours: 'Operating Hours',
        operatingHoursTime: '5 AM to 7 PM',
        frequency: 'Frequency',
        everyHour: 'Every Hour',
        nextChantIn: 'Next Chant Starts In:',
        at: 'at',
        liveNow: 'Live Now!',
        joinedMinutes: 'Joined {{ minutes }} minute(s) into the hour',
        audioSynced: 'Audio automatically synced to current time',
        volumeControl: 'Volume Control',
        tip: 'Tip:',
        tipMessage: 'If you join at 10:05, the audio will automatically start from the 5-minute mark, keeping you perfectly synced with the hourly schedule! The audio will continue playing even when you navigate to other pages!',
        duration: 'Duration:',
        perSession: 'per session',
        statusPlaying: 'Playing Hanuman Chalisa',
        statusMessage: 'Hanuman Chalisa plays automatically every hour from 5 AM to 7 PM',
        scheduleInfo: 'Audio plays at the start of every hour (5 AM to 7 PM)',
        durationInfo: 'Duration: 8 minutes 32 seconds per session',
      },
      
      viralShare: {
        title: '🌟 Get Special Blessings',
        subtitle: 'Share This Temple With 3 Devotees',
        description: 'When you share this sacred temple with 3 loved ones, your devotion and wish become many times more powerful. Sharing blessings is receiving blessings. 🙏',
        shareButton: '📱 Share With 3 Devotees',
        skipButton: 'Not Now',
        blessing: '✨ Thank You! May Shri Hanuman\'s Special Grace Be With You',
        shareCount: 'You have shared with {{ count }} people',
      },
      
      wish: {
        createTitle: 'Create Your Wish',
        createStep: 'Create',
        ritualStep: 'Ritual',
        shareStep: 'Share Blessings',
        completeStep: 'Complete',
        wishTitle: 'Wish Title',
        wishTitlePlaceholder: 'e.g., Good health for my family',
        category: 'Category',
        health: 'Health',
        education: 'Education',
        career: 'Career',
        family: 'Family',
        wealth: 'Wealth',
        spiritual: 'Spiritual',
        description: 'Detailed Description (Optional)',
        descriptionPlaceholder: 'Tell us more about your wish...',
        selectOffering: 'Select Offering',
        virtualOffering: 'Virtual Offering',
        prasad: 'Prasad',
        flowers: 'Flowers',
        incense: 'Incense',
        lamp: 'Lamp',
        coconut: 'Coconut',
        fruits: 'Fruits',
        continue: 'Continue',
        continueToRitual: 'Continue to Ritual 🙏',
        backToHome: '← Back to Home',
        
        ritualTitle: 'Sacred Ritual',
        ringBell: 'Ring the Bell',
        bellInstructions: 'Ring the bell 5 times',
        chantTitle: 'Chant',
        chantButton: 'Jai Hanuman',
        chantInstructions: 'Chant "Jai Hanuman" 11 times',
        submitWish: 'Submit Wish',
        proceedToShare: 'Proceed to Share Blessings',
        rings: 'rings',
        chants: 'chants',
        ritualComplete: 'Ritual Complete! Now you can share the blessings',
        
        shareTitle: 'Share Temple Information',
        shareSubtitle: 'Spread Divine Blessings',
        shareMessage: 'Please tell at least 3 people about this temple and encourage them to seek divine blessings as well. Sharing blessings strengthens your faith and devotion.',
        shareInstructions: 'You can share through:',
        shareOption1: 'WhatsApp with family or friends',
        shareOption2: 'Email, SMS, or social media',
        shareOption3: 'Any other messaging platform',
        shareButton: 'Share Temple Information',
        shareSuccess: 'Thank you! Now you can submit your wish',
        continueToSubmit: 'Submit Your Wish',
        shareOptional: 'This step is optional but recommended',
        skipShare: 'Skip this step',
        
        wishSubmitted: 'Wish Submitted!',
        submittedMessage: 'Your wish has been submitted to Lord Hanuman with devotion',
        disclaimer: 'Important Disclaimer',
        disclaimerText: 'Wish fulfillment is entirely a matter of personal faith, devotion, and spiritual belief.',
        disclaimerIntro: 'This is a digital platform for devotional expression only. We make no guarantees, promises, or claims about wish fulfillment. Results depend solely on:',
        disclaimerPoints: [
          'Your sincere devotion and faith in Lord Hanuman',
          'Your personal efforts and actions towards your goals',
          'Divine will and spiritual grace',
          'Natural life circumstances and karma'
        ],
        disclaimerNote: 'This platform does not guarantee any outcomes. We are simply providing a space for spiritual expression and devotion.',
        remember: 'Remember:',
        rememberText: 'Faith, devotion, and sincere effort are what truly matter. Lord Hanuman blesses all devotees equally, regardless of offerings.',
        
        sacredPractice: 'Sacred 14-Day Practice',
        practiceSubtitle: 'Optional devotional guidance to strengthen your wish',
        practiceIntro: 'According to ancient spiritual traditions, devotees who follow these sacred practices are believed to receive enhanced blessings from Lord Hanuman. While completely optional, this path has been followed by millions of devotees throughout centuries.',
        dailyPractices: 'Daily Spiritual Practices (14 Days)',
        dailyPractice1: 'Recite Hanuman Chalisa every morning with devotion and focus',
        dailyPractice2: 'Maintain a vegetarian diet (sattvic food) to purify body and mind',
        dailyPractice3: 'Offer daily prayers with sincere devotion and gratitude',
        spreadBlessings: 'Spread Divine Blessings',
        spreadBlessing1: 'Share your experience of this virtual temple with at least 3 people',
        spreadBlessing2: 'Encourage them to seek divine blessings for their own wishes',
        completeCycle: 'Complete the Sacred Cycle',
        completeCycle1: 'Return after 14 days of consistent practice',
        completeCycle2: 'Perform the same ritual again (ring bell 5 times, chant "Jai Hanuman" 11 times)',
        completeCycle3: 'Resubmit your wish to reinforce your devotion and intention',
        whyStrengthens: 'Why This Practice Strengthens Your Wish',
        whyStrengthensText: 'This 14-day sadhana (spiritual practice) demonstrates your sincerity, commitment, and unwavering faith. According to spiritual tradition, such dedicated devotion creates a powerful resonance with divine energies, significantly enhancing the spiritual merit of your wish. Many devotees have reported experiencing profound inner peace, clarity, and positive life changes through this practice.',
        optionalNote: 'Note: This practice is entirely optional and based on traditional spiritual wisdom. Faith and devotion are personal journeys. Follow only what resonates with your heart and beliefs. Lord Hanuman\'s grace is available to all devotees, regardless of practices followed.',
        
        tip1: 'Chant Hanuman Chalisa daily with sincere devotion',
        tip2: 'Work hard towards your goal with dedication',
        tip3: 'Have unwavering faith and patience in divine timing',
        returnToTemple: 'Return to Temple',
        makeAnother: 'Make Another Wish',
      },
      
      about: {
        title: 'About Temple',
        mission: 'Our Mission',
        missionText: 'This is a virtual temple dedicated to connecting devotees with Lord Hanuman',
        features: 'Features',
        feature1: 'Hourly Automatic Hanuman Chalisa',
        feature2: 'Wish Submission',
        feature3: 'Sacred Rituals',
        feature4: 'Spiritual Guidance',
        disclaimer: 'Disclaimer',
        disclaimerText: 'This is a digital platform for devotional expression only',
      },
      
      donate: {
        title: 'Support This Service',
        subtitle: 'If you find this service helpful, you may contribute voluntarily',
        optional: 'Completely optional - service remains free for all',
        scanQR: 'Scan QR Code',
        scanInstruction: 'Scan with any UPI app and make payment',
        orUseUPI: 'Or Use UPI ID',
        upiInstruction: 'Copy UPI ID and use in your payment app',
        payNow: 'Pay Now',
        mobileOnly: 'Works on mobile devices only',
        transparency: '100% Transparency',
        point1: '💰 All contributions go directly to the developer',
        point2: '🔒 No hidden fees or organizations',
        point3: '✅ Service remains free regardless of contributions',
        point4: '📊 Monthly costs: ~₹417 (domain + hosting)',
        thankYou: 'Thank You for Your Generosity',
        blessings: 'May Lord Hanuman\'s Blessings Be With You Always',
        backToHome: 'Back to Temple',
      },
      
      footer: {
        jaiHanuman: 'Jai Hanuman Ji',
        description: 'A free devotional service for all devotees. No affiliation with any temple organization.',
        copyright: '© 2025 E-Darshan Mandir | Open Source PWA',
        updateTitle: 'Update Available!',
        updateMessage: 'A new version of the temple app is ready.',
        updateButton: 'Update Now',
      },
      
      common: {
        jaiHanuman: 'Jai Hanuman',
        loading: 'Loading...',
        error: 'Error',
      },
      
      diya: {
        lightButton: 'Light a Diya',
        modalTitle: '🪔 Light a Diya for Someone',
        modalDescription: 'Light a virtual diya in Lord Hanuman\'s temple for your loved ones. The diya will glow for 24 hours as a symbol of your devotion and prayers.',
        nameLabel: 'Name of Person',
        namePlaceholder: 'Enter name (e.g., Amma, Papa, Priya)',
        charCounter: 'characters',
        remaining: 'remaining',
        cancel: 'Cancel',
        lightDiya: '🪔 Light Diya',
        lighting: 'Lighting...',
        noteTitle: 'Note:',
        noteDescription: 'Your diya will remain lit for 24 hours and then automatically expire. All diyas are stored locally on your device only.',
        diyaLit: 'Diya Lit',
        diyas: 'Diyas Lit',
        hoursRemaining: 'hours remaining',
        minutesRemaining: 'minutes remaining',
        timeRemaining: 'time remaining',
      },
      
      devMode: {
        title: '🔧 Developer Controls',
        close: 'Close',
        templeHoursTitle: '⏰ Temple Hours (5AM-7PM)',
        overrideTemple: 'Override temple open/close times',
        forceOpen: 'Force temple to be OPEN',
        templeOpenStatus: '✅ Temple is forced OPEN - ambient sounds active',
        templeClosedStatus: '🔒 Temple is forced CLOSED - ambient sounds off',
        hourlyChalisa: '🎵 Hourly Hanuman Chalisa',
        overrideChalisa: 'Override hourly Chalisa timing',
        forcePlay: 'Force Chalisa to play now',
        chalisaPlayingStatus: '▶️ Chalisa will play immediately',
        chalisaStoppedStatus: '⏸️ Chalisa playback stopped',
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
   * Get deity-specific audio title (Hanuman Chalisa vs Ganesh Aarti)
   */
  getAudioTitle(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' ? 'गणेश आरती' : 'Ganesh Aarti';
    }
    return lang === 'hi' ? 'हनुमान चालीसा' : 'Hanuman Chalisa';
  }
  
  /**
   * Get deity-specific enable audio button text
   */
  getEnableAudioText(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' 
        ? 'गणेश आरती स्वतः चलाएं – अपने घर को आशीर्वाद दें'
        : 'Let Ganesh Aarti Play Automatically – Bless Your Home';
    }
    return lang === 'hi'
      ? 'हनुमान चालीसा स्वतः चलाएं – अपने घर को आशीर्वाद दें'
      : 'Let Hanuman Chalisa Play Automatically – Bless Your Home';
  }
  
  /**
   * Get deity-specific "playing" status text
   */
  getPlayingText(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' ? 'गणेश आरती का पाठ हो रहा है' : 'Playing Ganesh Aarti';
    }
    return lang === 'hi' ? 'हनुमान चालीसा का पाठ हो रहा है' : 'Playing Hanuman Chalisa';
  }
  
  /**
   * Get deity-specific status message
   */
  getStatusMessage(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' 
        ? 'गणेश आरती हर घंटे सुबह 5 बजे से शाम 7 बजे तक चलती है'
        : 'Ganesh Aarti plays automatically every hour from 5 AM to 7 PM';
    }
    return lang === 'hi'
      ? 'हनुमान चालीसा हर घंटे सुबह 5 बजे से शाम 7 बजे तक चलती है'
      : 'Hanuman Chalisa plays automatically every hour from 5 AM to 7 PM';
  }
  
  /**
   * Get deity name for general use
   */
  getDeityName(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' ? 'श्री गणेश जी' : 'Lord Ganesha';
    }
    return lang === 'hi' ? 'श्री हनुमान जी' : 'Lord Hanuman';
  }
  
  /**
   * Get deity-specific greeting
   */
  getDeityGreeting(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' ? 'जय गणेश' : 'Jai Ganesh';
    }
    return lang === 'hi' ? 'जय श्री हनुमान' : 'Jai Hanuman';
  }
  
  /**
   * Get deity-specific chant button text
   */
  getChantButtonText(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' ? 'जय गणेश' : 'Jai Ganesh';
    }
    return lang === 'hi' ? 'जय श्री हनुमान' : 'Jai Hanuman';
  }
  
  /**
   * Get deity-specific chant instructions
   */
  getChantInstructions(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' 
        ? '"जय गणेश" ११ बार श्रद्धा से जपें'
        : 'Chant "Jai Ganesh" 11 times with devotion';
    }
    return lang === 'hi'
      ? '"जय श्री हनुमान" ११ बार श्रद्धा से जपें'
      : 'Chant "Jai Hanuman" 11 times with devotion';
  }
  
  /**
   * Get deity-specific ritual title
   */
  getRitualTitle(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' ? 'पवित्र गणेश साधना' : 'Sacred Ganesh Ritual';
    }
    return lang === 'hi' ? 'पवित्र हनुमान साधना' : 'Sacred Hanuman Ritual';
  }
  
  /**
   * Get deity-specific blessing text
   */
  getBlessingText(): string {
    const lang = this.currentLanguage.value;
    if (this.currentDeity === DeityType.GANESH) {
      return lang === 'hi' 
        ? '✨ धन्यवाद! श्री गणेश की विशेष कृपा आप पर बनी रहे'
        : '✨ Thank You! May Lord Ganesha\'s Special Grace Be With You';
    }
    return lang === 'hi'
      ? '✨ धन्यवाद! श्री हनुमान की विशेष कृपा आप पर बनी रहे'
      : '✨ Thank You! May Shri Hanuman\'s Special Grace Be With You';
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
