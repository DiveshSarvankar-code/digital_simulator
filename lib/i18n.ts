export type Language = 'en' | 'hi' | 'mr';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export type TranslationDict = {
  appName: string;
  appTagline: string;
  // Intake
  intakeTitle: string;
  intakeSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  ageLabel: string;
  agePlaceholder: string;
  chooseLanguage: string;
  startButton: string;
  nameRequired: string;
  ageRequired: string;
  // Flow chrome
  levelLabel: string;
  taskLabel: string;
  hintButton: string;
  hintTitle: string;
  hintNoMore: string;
  notNeededForTask: string;
  taskComplete: string;
  nextTaskLoading: string;
  // Thank you
  thankYouTitle: string;
  thankYouMessage: string;
  startNewSession: string;
  // Phone chrome
  phoneHome: string;
  phoneSettings: string;
  phoneCamera: string;
  phoneMaps: string;
  phoneBrowser: string;
  phoneWhatsapp: string;
  phoneUpi: string;
  phoneClock: string;
  phoneMessages: string;
  phonePhone: string;
  phoneShareLocation: string;
  connected: string;
  notConnected: string;
  connectButton: string;
  // Settings categories (~15 rows)
  settingsNetwork: string;
  settingsConnectedDevices: string;
  settingsApps: string;
  settingsNotifications: string;
  settingsBattery: string;
  settingsSound: string;
  settingsDisplay: string;
  settingsWallpaper: string;
  settingsAccessibility: string;
  settingsSecurity: string;
  settingsLocation: string;
  settingsSafety: string;
  settingsPasswords: string;
  settingsSystem: string;
  settingsAbout: string;
  // Display settings
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  brightnessTitle: string;
  brightnessSubtitle: string;
  sampleText: string;
  // Wi-Fi
  wifiTitle: string;
  wifiSubtitle: string;
  wifiUseWifi: string;
  wifiSelectNetwork: string;
  wifiSecured: string;
  wifiOpen: string;
  // Task instructions + hints (per task)
  // L1
  task_text_size_title: string;
  task_text_size_instruction: string;
  task_text_size_hint1: string;
  task_text_size_hint2: string;
  task_text_size_hint3: string;
  task_brightness_title: string;
  task_brightness_instruction: string;
  task_brightness_hint1: string;
  task_brightness_hint2: string;
  task_brightness_hint3: string;
  task_wifi_title: string;
  task_wifi_instruction: string;
  task_wifi_hint1: string;
  task_wifi_hint2: string;
  task_wifi_hint3: string;
  // L2
  task_whatsapp_message_title: string;
  task_whatsapp_message_instruction: string;
  task_whatsapp_message_hint1: string;
  task_whatsapp_message_hint2: string;
  task_whatsapp_message_hint3: string;
  task_whatsapp_media_title: string;
  task_whatsapp_media_instruction: string;
  task_whatsapp_media_hint1: string;
  task_whatsapp_media_hint2: string;
  task_whatsapp_media_hint3: string;
  task_search_title: string;
  task_search_instruction: string;
  task_search_hint1: string;
  task_search_hint2: string;
  task_search_hint3: string;
  // L3
  task_maps_title: string;
  task_maps_instruction: string;
  task_maps_hint1: string;
  task_maps_hint2: string;
  task_maps_hint3: string;
  task_upi_title: string;
  task_upi_instruction: string;
  task_upi_hint1: string;
  task_upi_hint2: string;
  task_upi_hint3: string;
  task_reminder_title: string;
  task_reminder_instruction: string;
  task_reminder_hint1: string;
  task_reminder_hint2: string;
  task_reminder_hint3: string;
  // L4
  task_fake_sms_title: string;
  task_fake_sms_instruction: string;
  task_fake_sms_hint1: string;
  task_fake_sms_hint2: string;
  task_fake_sms_hint3: string;
  task_otp_scam_title: string;
  task_otp_scam_instruction: string;
  task_otp_scam_hint1: string;
  task_otp_scam_hint2: string;
  task_otp_scam_hint3: string;
  task_emergency_title: string;
  task_emergency_instruction: string;
  task_emergency_hint1: string;
  task_emergency_hint2: string;
  task_emergency_hint3: string;
  // WhatsApp UI
  chatContactName: string;
  chatTypeMessage: string;
  suggestedMessage: string;
  messageSent: string;
  gallery: string;
  holdToRecord: string;
  recording: string;
  voiceMessage: string;
  photoSent: string;
  // Search / Maps
  searchPlaceholder: string;
  directions: string;
  searchResultHospital: string;
  searchResultClinic: string;
  searchResultPharmacy: string;
  mapsDirections: string;
  // UPI
  upiSimulatedBanner: string;
  upiScanPrompt: string;
  upiScanning: string;
  upiVerifyPrompt: string;
  upiReceiverName: string;
  upiReceiverConfirm: string;
  upiReceiverWrong: string;
  upiAmountPrompt: string;
  upiAmountPlaceholder: string;
  upiConfirm: string;
  upiPaymentSuccess: string;
  upiWrongReceiver: string;
  // Reminder
  reminderTimeLabel: string;
  reminderNameLabel: string;
  reminderNamePlaceholder: string;
  reminderRepeatDaily: string;
  reminderSave: string;
  reminderSaved: string;
  // Fake SMS
  smsLegitimate: string;
  smsScam: string;
  smsLegitimateExplanation: string;
  smsScamSelected: string;
  smsTapScam: string;
  // OTP scam
  otpIncomingCall: string;
  otpTranscript: string;
  otpOption1: string;
  otpOption2: string;
  otpOption3: string;
  otpOptionCorrect: string;
  otpWrongExplanation: string;
  otpCorrectExplanation: string;
  // Emergency
  emergencyCallContact: string;
  emergencyContactName: string;
  emergencyCalling: string;
  emergencyCallEnded: string;
  emergencyShareLocation: string;
  emergencyShareTo: string;
  emergencyLocationShared: string;
  emergencyDone: string;
  // Levels
  level1Name: string;
  level2Name: string;
  level3Name: string;
  level4Name: string;
  // Assessment
  assessmentBaselineTitle: string;
  assessmentBaselineSubtitle: string;
  assessmentPostTitle: string;
  assessmentPostSubtitle: string;
  assessmentCanDoUnaided: string;
  assessmentCanDoYes: string;
  assessmentCanDoNo: string;
  assessmentConfidence: string;
  assessmentFacilitatorObserved: string;
  assessmentObservedPass: string;
  assessmentObservedFail: string;
  assessmentSaveContinue: string;
  assessmentSkip: string;
  assessmentSkipConfirm: string;
  assessmentResume: string;
  assessmentNextSteps: string;
  assessmentStartTraining: string;
  assessmentFinish: string;
  venueLabel: string;
  venuePlaceholder: string;
  visitDateLabel: string;
  assessmentSaved: string;
  assessmentSkipped: string;
  assessmentLoadingTasks: string;
};

export const translations: Record<Language, TranslationDict> = {
  en: {
    appName: 'Digital Literacy Simulator',
    appTagline: 'Learn smartphone skills, one step at a time',
    intakeTitle: 'Welcome',
    intakeSubtitle: 'Tell us a little about yourself to begin',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    ageLabel: 'Your Age',
    agePlaceholder: 'Enter your age',
    chooseLanguage: 'Choose your language',
    startButton: 'Start Learning',
    nameRequired: 'Please enter your name',
    ageRequired: 'Please enter your age',
    levelLabel: 'Level',
    taskLabel: 'Task',
    hintButton: 'Hint',
    hintTitle: 'Hint',
    hintNoMore: 'No more hints for this task',
    notNeededForTask: 'Not needed for this task. Try the highlighted option.',
    taskComplete: 'Well done! Task complete.',
    nextTaskLoading: 'Loading next task...',
    thankYouTitle: 'Thank you!',
    thankYouMessage:
      'You have completed all the tasks. Great work learning new smartphone skills.',
    startNewSession: 'Start New Session',
    phoneHome: 'Home',
    phoneSettings: 'Settings',
    phoneCamera: 'Camera',
    phoneMaps: 'Maps',
    phoneBrowser: 'Browser',
    phoneWhatsapp: 'WhatsApp',
    phoneUpi: 'UPI',
    phoneClock: 'Clock',
    phoneMessages: 'Messages',
    phonePhone: 'Phone',
    phoneShareLocation: 'Share Location',
    connected: 'Connected',
    notConnected: 'Not connected',
    connectButton: 'Connect',
    settingsNetwork: 'Network & internet',
    settingsConnectedDevices: 'Connected devices',
    settingsApps: 'Apps',
    settingsNotifications: 'Notifications',
    settingsBattery: 'Battery',
    settingsSound: 'Sound & vibration',
    settingsDisplay: 'Display',
    settingsWallpaper: 'Wallpaper',
    settingsAccessibility: 'Accessibility',
    settingsSecurity: 'Security & privacy',
    settingsLocation: 'Location',
    settingsSafety: 'Safety & emergency',
    settingsPasswords: 'Passwords & accounts',
    settingsSystem: 'System',
    settingsAbout: 'About phone',
    fontSizeTitle: 'Font size',
    fontSizeSubtitle: 'Drag the slider to make text bigger',
    brightnessTitle: 'Brightness level',
    brightnessSubtitle: 'Drag the slider to change brightness',
    sampleText:
      'The quick brown fox jumps over the lazy dog. This text shows your font size.',
    wifiTitle: 'Wi-Fi',
    wifiSubtitle: 'Turn on Wi-Fi and connect to a network',
    wifiUseWifi: 'Use Wi-Fi',
    wifiSelectNetwork: 'Select a network to connect',
    wifiSecured: 'Secured',
    wifiOpen: 'Open',
    task_text_size_title: 'Make the text bigger',
    task_text_size_instruction:
      'Open Settings, then Display. Drag the font size slider until the sample text is easy to read.',
    task_text_size_hint1: 'Look for the Settings app on the phone.',
    task_text_size_hint2: 'Inside Settings, find the Display option.',
    task_text_size_hint3: 'Drag the font size slider to the right to enlarge the text.',
    task_brightness_title: 'Adjust the brightness',
    task_brightness_instruction:
      'Open Settings, then Display. Drag the brightness slider to make the screen brighter.',
    task_brightness_hint1: 'Settings has a Display section.',
    task_brightness_hint2: 'Display contains a brightness control.',
    task_brightness_hint3: 'Drag the brightness slider to the right.',
    task_wifi_title: 'Connect to Wi-Fi',
    task_wifi_instruction:
      'Open Settings, then Network & internet. Turn on Wi-Fi and connect to one of the networks shown.',
    task_wifi_hint1: 'Settings has a Network & internet section.',
    task_wifi_hint2: 'Turn on the Wi-Fi switch first.',
    task_wifi_hint3: 'Tap a network name, then tap Connect.',
    task_whatsapp_message_title: 'Send a WhatsApp message',
    task_whatsapp_message_instruction:
      'Open WhatsApp. Tap the suggested message chip to send it to your contact.',
    task_whatsapp_message_hint1: 'Open the WhatsApp app.',
    task_whatsapp_message_hint2:
      'A suggested message appears below the chat. Tap it to send.',
    task_whatsapp_message_hint3: 'Tap the highlighted message chip — it sends instantly.',
    task_whatsapp_media_title: 'Send a photo and a voice message',
    task_whatsapp_media_instruction:
      'In WhatsApp, tap a photo from the gallery to send it. Then press and hold the mic icon to record a short voice message.',
    task_whatsapp_media_hint1: 'Open the gallery to pick a photo.',
    task_whatsapp_media_hint2: 'Tap a photo to send it as a message.',
    task_whatsapp_media_hint3:
      'Press and hold the microphone icon until the recording finishes.',
    task_search_title: 'Search the internet',
    task_search_instruction:
      'Open the Browser. Type the name of a hospital, then tap Directions on the correct result.',
    task_search_hint1: 'Open the Browser app.',
    task_search_hint2: 'Type a hospital name in the search bar.',
    task_search_hint3: 'Tap Directions on the matching result.',
    task_maps_title: 'Find a hospital using Maps',
    task_maps_instruction:
      'Open Maps. Type "hospital" in the search bar and tap Directions on a result.',
    task_maps_hint1: 'Open the Maps app.',
    task_maps_hint2: 'Type "hospital" in the search box.',
    task_maps_hint3: 'Tap Directions on a hospital result.',
    task_upi_title: 'Scan a QR code and make a demo payment',
    task_upi_instruction:
      'Open UPI. Scan the QR code, confirm the receiver name, enter the amount, and tap Confirm.',
    task_upi_hint1: 'Open the UPI app and scan the QR code.',
    task_upi_hint2: 'Check the receiver name matches before continuing.',
    task_upi_hint3: 'Enter the amount and tap Confirm.',
    task_reminder_title: 'Set a medicine reminder',
    task_reminder_instruction:
      'Open Clock. Set a reminder time, type a name, turn on Repeat daily, and tap Save.',
    task_reminder_hint1: 'Open the Clock app.',
    task_reminder_hint2: 'Set the time and give the reminder a name.',
    task_reminder_hint3: 'Turn on Repeat daily and tap Save.',
    task_fake_sms_title: 'Identify a fake SMS',
    task_fake_sms_instruction:
      'Look at the two messages. Tap the one that looks like a scam.',
    task_fake_sms_hint1: 'Read both messages carefully.',
    task_fake_sms_hint2: 'Scam messages ask for urgent action or personal details.',
    task_fake_sms_hint3: 'The message asking for your OTP or card details is the scam.',
    task_otp_scam_title: 'Recognize an OTP scam',
    task_otp_scam_instruction:
      'Listen to the caller. Choose the safest response from the four options.',
    task_otp_scam_hint1: 'The caller is asking for your OTP.',
    task_otp_scam_hint2: 'Never share an OTP with anyone over a call.',
    task_otp_scam_hint3: 'Decline and use the official channel instead.',
    task_emergency_title: 'Respond to an emergency',
    task_emergency_instruction:
      'Call the emergency contact, let the call end, then share your location with the same contact.',
    task_emergency_hint1: 'Call the highlighted emergency contact first.',
    task_emergency_hint2: 'Wait for the simulated call to end.',
    task_emergency_hint3: 'Then share your location with the same contact.',
    chatContactName: 'Ramesh',
    chatTypeMessage: 'Type a message',
    suggestedMessage: 'Namaste, how are you?',
    messageSent: 'Message sent',
    gallery: 'Gallery',
    holdToRecord: 'Press and hold to record',
    recording: 'Recording...',
    voiceMessage: 'Voice message',
    photoSent: 'Photo sent',
    searchPlaceholder: 'Search for a place or hospital',
    directions: 'Directions',
    searchResultHospital: 'City Care Hospital',
    searchResultClinic: 'Sunrise Family Clinic',
    searchResultPharmacy: 'HealthPlus Pharmacy',
    mapsDirections: 'Directions',
    upiSimulatedBanner: 'This is a simulated payment. No real money is involved.',
    upiScanPrompt: 'Point the camera at the QR code to scan',
    upiScanning: 'Scanning...',
    upiVerifyPrompt: 'Is this the correct receiver?',
    upiReceiverName: 'Ramesh Kumar',
    upiReceiverConfirm: 'Yes, confirm',
    upiReceiverWrong: 'No, rescan',
    upiAmountPrompt: 'Enter amount to pay',
    upiAmountPlaceholder: '₹0',
    upiConfirm: 'Confirm Payment',
    upiPaymentSuccess: 'Payment of ₹{amount} sent to {name}',
    upiWrongReceiver: 'Wrong receiver. Please rescan.',
    reminderTimeLabel: 'Time',
    reminderNameLabel: 'Reminder name',
    reminderNamePlaceholder: 'e.g. Blood pressure medicine',
    reminderRepeatDaily: 'Repeat daily',
    reminderSave: 'Save',
    reminderSaved: 'Reminder saved',
    smsLegitimate:
      'Your account balance is Rs 5,200. Thank you for banking with us. - SBI',
    smsScam:
      'URGENT! Your account will be blocked. Share your OTP and card details now to verify: 9123456780',
    smsLegitimateExplanation:
      'This is a normal bank message. It does not ask for any secret details.',
    smsScamSelected: 'Correct! That message asks for your OTP and card details — it is a scam.',
    smsTapScam: 'Tap the scam message',
    otpIncomingCall: 'Incoming call: +91 98765 43210',
    otpTranscript:
      'Hello, I am calling from your bank. We detected unusual activity. Please tell me the OTP you just received to secure your account.',
    otpOption1: 'Share the OTP to protect my account',
    otpOption2: 'Ask the caller to wait while I check',
    otpOption3: 'Share only the last 4 digits',
    otpOptionCorrect: 'Decline and use the official bank channel',
    otpWrongExplanation:
      'Never share an OTP with anyone, even part of it. Banks never ask for OTPs on a call.',
    otpCorrectExplanation:
      'Correct. Always decline and use the official channel. Banks never ask for OTPs on a call.',
    emergencyCallContact: 'Call',
    emergencyContactName: 'Son - Amit',
    emergencyCalling: 'Calling Amit...',
    emergencyCallEnded: 'Call ended',
    emergencyShareLocation: 'Share your location',
    emergencyShareTo: 'Share with Amit',
    emergencyLocationShared: 'Location shared with Amit',
    emergencyDone: 'Emergency handled',
    level1Name: 'Everyday Basics',
    level2Name: 'Communication & Internet',
    level3Name: 'Digital Services & Independence',
    level4Name: 'Safety & Problem Solving',
    assessmentBaselineTitle: 'Baseline Check',
    assessmentBaselineSubtitle: 'Before the training starts, record what the learner can do today.',
    assessmentPostTitle: 'Post-Training Check',
    assessmentPostSubtitle: 'After the training, record what the learner can do now.',
    assessmentCanDoUnaided: 'Can the learner do this unaided?',
    assessmentCanDoYes: 'Yes',
    assessmentCanDoNo: 'No',
    assessmentConfidence: 'Confidence level',
    assessmentFacilitatorObserved: 'Facilitator observed result',
    assessmentObservedPass: 'Pass',
    assessmentObservedFail: 'Fail',
    assessmentSaveContinue: 'Save & Continue',
    assessmentSkip: 'Skip for now',
    assessmentSkipConfirm: 'Skip this assessment? You can resume it later.',
    assessmentResume: 'Resume Assessment',
    assessmentNextSteps: 'What happens next?',
    assessmentStartTraining: 'Start Training',
    assessmentFinish: 'Finish Session',
    venueLabel: 'Venue',
    venuePlaceholder: 'e.g. Pune Public Library',
    visitDateLabel: 'Visit Date',
    assessmentSaved: 'Assessment saved',
    assessmentSkipped: 'Assessment skipped — you can resume later',
    assessmentLoadingTasks: 'Loading assessment...',
  },
  hi: {
    appName: 'डिजिटल साक्षरता सिम्युलेटर',
    appTagline: 'स्मार्टफोन कौशल सीखें, एक समय में एक कदम',
    intakeTitle: 'स्वागत है',
    intakeSubtitle: 'शुरू करने के लिए अपने बारे में थोड़ी जानकारी दें',
    nameLabel: 'आपका नाम',
    namePlaceholder: 'अपना नाम दर्ज करें',
    ageLabel: 'आपकी आयु',
    agePlaceholder: 'अपनी आयु दर्ज करें',
    chooseLanguage: 'अपनी भाषा चुनें',
    startButton: 'शुरू करें',
    nameRequired: 'कृपया अपना नाम दर्ज करें',
    ageRequired: 'कृपया अपनी आयु दर्ज करें',
    levelLabel: 'स्तर',
    taskLabel: 'कार्य',
    hintButton: 'संकेत',
    hintTitle: 'संकेत',
    hintNoMore: 'इस कार्य के लिए और संकेत नहीं',
    notNeededForTask: 'इस कार्य के लिए आवश्यक नहीं। हाइलाइट किए गए विकल्प पर टैप करें।',
    taskComplete: 'शाबाश! कार्य पूरा हुआ।',
    nextTaskLoading: 'अगला कार्य लोड हो रहा है...',
    thankYouTitle: 'धन्यवाद!',
    thankYouMessage:
      'आपने सभी कार्य पूरे कर लिए हैं। नए स्मार्टफोन कौशल सीखने के लिए शानदार काम।',
    startNewSession: 'नया सत्र शुरू करें',
    phoneHome: 'होम',
    phoneSettings: 'सेटिंग्स',
    phoneCamera: 'कैमरा',
    phoneMaps: 'नक्शे',
    phoneBrowser: 'ब्राउज़र',
    phoneWhatsapp: 'व्हाट्सएप',
    phoneUpi: 'UPI',
    phoneClock: 'घड़ी',
    phoneMessages: 'संदेश',
    phonePhone: 'फ़ोन',
    phoneShareLocation: 'स्थान साझा करें',
    connected: 'जुड़ा हुआ',
    notConnected: 'जुड़ा नहीं है',
    connectButton: 'जोड़ें',
    settingsNetwork: 'नेटवर्क और इंटरनेट',
    settingsConnectedDevices: 'कनेक्टेड डिवाइस',
    settingsApps: 'ऐप्स',
    settingsNotifications: 'सूचनाएं',
    settingsBattery: 'बैटरी',
    settingsSound: 'ध्वनि और कंपन',
    settingsDisplay: 'डिस्प्ले',
    settingsWallpaper: 'वॉलपेपर',
    settingsAccessibility: 'सुलभता',
    settingsSecurity: 'सुरक्षा और गोपनीयता',
    settingsLocation: 'स्थान',
    settingsSafety: 'सुरक्षा और आपातकाल',
    settingsPasswords: 'पासवर्ड और खाते',
    settingsSystem: 'सिस्टम',
    settingsAbout: 'फ़ोन के बारे में',
    fontSizeTitle: 'फ़ॉन्ट आकार',
    fontSizeSubtitle: 'टेक्स्ट बड़ा करने के लिए स्लाइडर खींचें',
    brightnessTitle: 'चमक स्तर',
    brightnessSubtitle: 'चमक बदलने के लिए स्लाइडर खींचें',
    sampleText:
      'लोहे का लंबा तार फाटक पर झूलता है। यह टेक्स्ट आपका फ़ॉन्ट आकार दिखाता है।',
    wifiTitle: 'वाई-फाई',
    wifiSubtitle: 'वाई-फाई चालू करें और किसी नेटवर्क से जुड़ें',
    wifiUseWifi: 'वाई-फाई का उपयोग करें',
    wifiSelectNetwork: 'जुड़ने के लिए नेटवर्क चुनें',
    wifiSecured: 'सुरक्षित',
    wifiOpen: 'खुला',
    task_text_size_title: 'टेक्स्ट बड़ा करें',
    task_text_size_instruction:
      'सेटिंग्स खोलें, फिर डिस्प्ले। नमूना टेक्स्ट आसानी से पढ़ने योग्य होने तक फ़ॉन्ट आकार स्लाइडर खींचें।',
    task_text_size_hint1: 'फ़ोन पर सेटिंग्स ऐप खोजें।',
    task_text_size_hint2: 'सेटिंग्स में डिस्प्ले विकल्प खोजें।',
    task_text_size_hint3: 'टेक्स्ट बड़ा करने के लिए फ़ॉन्ट आकार स्लाइडर दाईं ओर खींचें।',
    task_brightness_title: 'चमक एडजस्ट करें',
    task_brightness_instruction:
      'सेटिंग्स खोलें, फिर डिस्प्ले। स्क्रीन को अधिक चमकदार बनाने के लिए चमक स्लाइडर खींचें।',
    task_brightness_hint1: 'सेटिंग्स में डिस्प्ले अनुभाग है।',
    task_brightness_hint2: 'डिस्प्ले में चमक नियंत्रण होता है।',
    task_brightness_hint3: 'चमक स्लाइडर को दाईं ओर खींचें।',
    task_wifi_title: 'वाई-फाई से जुड़ें',
    task_wifi_instruction:
      'सेटिंग्स खोलें, फिर नेटवर्क और इंटरनेट। वाई-फाई चालू करें और दिखाए गए नेटवर्क में से किसी एक से जुड़ें।',
    task_wifi_hint1: 'सेटिंग्स में नेटवर्क और इंटरनेट अनुभाग है।',
    task_wifi_hint2: 'पहले वाई-फाई स्विच चालू करें।',
    task_wifi_hint3: 'नेटवर्क नाम पर टैप करें, फिर जोड़ें पर टैप करें।',
    task_whatsapp_message_title: 'व्हाट्सएप संदेश भेजें',
    task_whatsapp_message_instruction:
      'व्हाट्सएप खोलें। अपने संपर्क को संदेश भेजने के लिए सुझाए गए संदेश चिप पर टैप करें।',
    task_whatsapp_message_hint1: 'व्हाट्सएप ऐप खोलें।',
    task_whatsapp_message_hint2:
      'चैट के नीचे एक सुझाया गया संदेश दिखाई देता है। भेजने के लिए उस पर टैप करें।',
    task_whatsapp_message_hint3: 'हाइलाइट किए गए संदेश चिप पर टैप करें — यह तुरंत भेजा जाता है।',
    task_whatsapp_media_title: 'फ़ोटो और वॉइस संदेश भेजें',
    task_whatsapp_media_instruction:
      'व्हाट्सएप में, गैलरी से कोई फ़ोटो चुनकर भेजें। फिर एक छोटा वॉइस संदेश रिकॉर्ड करने के लिए माइक आइकन दबाकर रखें।',
    task_whatsapp_media_hint1: 'फ़ोटो चुनने के लिए गैलरी खोलें।',
    task_whatsapp_media_hint2: 'संदेश के रूप में भेजने के लिए फ़ोटो पर टैप करें।',
    task_whatsapp_media_hint3:
      'रिकॉर्डिंग पूरी होने तक माइक्रोफ़ोन आइकन को दबाकर रखें।',
    task_search_title: 'इंटरनेट पर खोजें',
    task_search_instruction:
      'ब्राउज़र खोलें। किसी अस्पताल का नाम टाइप करें, फिर सही परिणाम पर दिशा-निर्देश टैप करें।',
    task_search_hint1: 'ब्राउज़र ऐप खोलें।',
    task_search_hint2: 'खोज पट्टी में अस्पताल का नाम टाइप करें।',
    task_search_hint3: 'मिलते-जुलते परिणाम पर दिशा-निर्देश टैप करें।',
    task_maps_title: 'नक्शे से अस्पताल खोजें',
    task_maps_instruction:
      'नक्शे खोलें। खोज पट्टी में "अस्पताल" टाइप करें और किसी परिणाम पर दिशा-निर्देश टैप करें।',
    task_maps_hint1: 'नक्शे ऐप खोलें।',
    task_maps_hint2: 'खोज बॉक्स में "अस्पताल" टाइप करें।',
    task_maps_hint3: 'किसी अस्पताल परिणाम पर दिशा-निर्देश टैप करें।',
    task_upi_title: 'QR कोड स्कैन करें और डेमो भुगतान करें',
    task_upi_instruction:
      'UPI खोलें। QR कोड स्कैन करें, रिसीवर नाम की पुष्टि करें, राशि दर्ज करें और पुष्टि करें टैप करें।',
    task_upi_hint1: 'UPI ऐप खोलें और QR कोड स्कैन करें।',
    task_upi_hint2: 'जारी रखने से पहले रिसीवर नाम मिलान की जाँच करें।',
    task_upi_hint3: 'राशि दर्ज करें और पुष्टि करें टैप करें।',
    task_reminder_title: 'दवा रिमाइंडर सेट करें',
    task_reminder_instruction:
      'घड़ी खोलें। रिमाइंडर समय सेट करें, नाम टाइप करें, रोज़ दोहराएं चालू करें और सहेजें टैप करें।',
    task_reminder_hint1: 'घड़ी ऐप खोलें।',
    task_reminder_hint2: 'समय सेट करें और रिमाइंडर को नाम दें।',
    task_reminder_hint3: 'रोज़ दोहराएं चालू करें और सहेजें टैप करें।',
    task_fake_sms_title: 'फ़र्ज़ी SMS पहचानें',
    task_fake_sms_instruction:
      'दोनों संदेश देखें। जो स्कैम जैसा दिखता है उस पर टैप करें।',
    task_fake_sms_hint1: 'दोनों संदेश ध्यान से पढ़ें।',
    task_fake_sms_hint2: 'स्कैम संदेश तत्काल कार्रवाई या व्यक्तिगत जानकारी मांगते हैं।',
    task_fake_sms_hint3: 'आपका OTP या कार्ड विवरण मांगने वाला संदेह स्कैम है।',
    task_otp_scam_title: 'OTP स्कैम पहचानें',
    task_otp_scam_instruction:
      'कॉलर को सुनें। चार विकल्पों में से सबसे सुरक्षित प्रतिक्रिया चुनें।',
    task_otp_scam_hint1: 'कॉलर आपका OTP मांग रहा है।',
    task_otp_scam_hint2: 'किसी के साथ कॉल पर OTP साझा न करें।',
    task_otp_scam_hint3: 'अस्वीकार करें और आधिकारिक चैनल का उपयोग करें।',
    task_emergency_title: 'आपातकाल का जवाब दें',
    task_emergency_instruction:
      'आपातकाल संपर्क को कॉल करें, कॉल समाप्त होने दें, फिर उसी संपर्क के साथ अपना स्थान साझा करें।',
    task_emergency_hint1: 'पहले हाइलाइट किए गए आपातकाल संपर्क को कॉल करें।',
    task_emergency_hint2: 'सिम्युलेटेड कॉल समाप्त होने का इंतज़ार करें।',
    task_emergency_hint3: 'फिर उसी संपर्क के साथ अपना स्थान साझा करें।',
    chatContactName: 'रमेश',
    chatTypeMessage: 'संदेश टाइप करें',
    suggestedMessage: 'नमस्ते, आप कैसे हैं?',
    messageSent: 'संदेश भेजा गया',
    gallery: 'गैलरी',
    holdToRecord: 'रिकॉर्ड करने के लिए दबाकर रखें',
    recording: 'रिकॉर्डिंग...',
    voiceMessage: 'वॉइस संदेश',
    photoSent: 'फ़ोटो भेजी गई',
    searchPlaceholder: 'किसी स्थान या अस्पताल की खोज करें',
    directions: 'दिशा-निर्देश',
    searchResultHospital: 'सिटी केयर अस्पताल',
    searchResultClinic: 'सनराइज़ परिवार क्लिनिक',
    searchResultPharmacy: 'हेल्थप्लस फार्मेसी',
    mapsDirections: 'दिशा-निर्देश',
    upiSimulatedBanner: 'यह एक सिम्युलेटेड भुगतान है। इसमें कोई वास्तविक पैसा शामिल नहीं है।',
    upiScanPrompt: 'स्कैन करने के लिए कैमरे को QR कोड पर लगाएं',
    upiScanning: 'स्कैन हो रहा है...',
    upiVerifyPrompt: 'क्या यह सही रिसीवर है?',
    upiReceiverName: 'रमेश कुमार',
    upiReceiverConfirm: 'हाँ, पुष्टि करें',
    upiReceiverWrong: 'नहीं, फिर से स्कैन करें',
    upiAmountPrompt: 'भुगतान के लिए राशि दर्ज करें',
    upiAmountPlaceholder: '₹0',
    upiConfirm: 'भुगतान की पुष्टि करें',
    upiPaymentSuccess: '{name} को ₹{amount} का भुगतान भेजा गया',
    upiWrongReceiver: 'गलत रिसीवर। कृपया फिर से स्कैन करें।',
    reminderTimeLabel: 'समय',
    reminderNameLabel: 'रिमाइंडर नाम',
    reminderNamePlaceholder: 'जैसे ब्लड प्रेशर की दवा',
    reminderRepeatDaily: 'रोज़ दोहराएं',
    reminderSave: 'सहेजें',
    reminderSaved: 'रिमाइंडर सहेजा गया',
    smsLegitimate:
      'आपके खाते का बैलेंस Rs 5,200 है। हमारे साथ बैंकिंग के लिए धन्यवाद। - SBI',
    smsScam:
      'जरूरी! आपका खाता ब्लॉक हो जाएगा। सत्यापित करने के लिए अभी अपना OTP और कार्ड विवरण भेजें: 9123456780',
    smsLegitimateExplanation:
      'यह एक सामान्य बैंक संदेश है। यह कोई गुप्त जानकारी नहीं मांगता।',
    smsScamSelected: 'सही! वह संदेश आपका OTP और कार्ड विवरण मांगता है — यह स्कैम है।',
    smsTapScam: 'स्कैम संदेश पर टैप करें',
    otpIncomingCall: 'इनकमिंग कॉल: +91 98765 43210',
    otpTranscript:
      'नमस्कार, मैं आपके बैंक से कॉल कर रहा हूं। हमें असामान्य गतिविधि मिली है। अपना खाता सुरक्षित करने के लिए अभी प्राप्त OTP बताएं।',
    otpOption1: 'खाता सुरक्षित करने के लिए OTP साझा करें',
    otpOption2: 'जाँचने तक कॉलर को रुकने के लिए कहें',
    otpOption3: 'केवल अंतिम 4 अंक साझा करें',
    otpOptionCorrect: 'अस्वीकार करें और आधिकारिक बैंक चैनल का उपयोग करें',
    otpWrongExplanation:
      'OTP कभी किसी के साथ साझा न करें, चाहे वह आंशिक ही क्यों न हो। बैंक कॉल पर OTP नहीं मांगते।',
    otpCorrectExplanation:
      'सही। हमेशा अस्वीकार करें और आधिकारिक चैनल का उपयोग करें। बैंक कॉल पर OTP नहीं मांगते।',
    emergencyCallContact: 'कॉल करें',
    emergencyContactName: 'बेटा - अमित',
    emergencyCalling: 'अमित को कॉल हो रहा है...',
    emergencyCallEnded: 'कॉल समाप्त',
    emergencyShareLocation: 'अपना स्थान साझा करें',
    emergencyShareTo: 'अमित के साथ साझा करें',
    emergencyLocationShared: 'अमित के साथ स्थान साझा हुआ',
    emergencyDone: 'आपातकाल निपटाया गया',
    level1Name: 'रोज़मर्रा की मूल बातें',
    level2Name: 'संचार और इंटरनेट',
    level3Name: 'डिजिटल सेवाएं और आत्मनिर्भरता',
    level4Name: 'सुरक्षा और समस्या समाधान',
    assessmentBaselineTitle: 'बेसलाइन जांच',
    assessmentBaselineSubtitle: 'प्रशिक्षण शुरू होने से पहले, दर्ज करें कि शिक्षार्थी आज क्या कर सकता है।',
    assessmentPostTitle: 'प्रशिक्षण के बाद की जांच',
    assessmentPostSubtitle: 'प्रशिक्षण के बाद, दर्ज करें कि शिक्षार्थी अब क्या कर सकता है।',
    assessmentCanDoUnaided: 'क्या शिक्षार्थी यह बिना सहायता के कर सकता है?',
    assessmentCanDoYes: 'हाँ',
    assessmentCanDoNo: 'नहीं',
    assessmentConfidence: 'आत्मविश्वास स्तर',
    assessmentFacilitatorObserved: 'सुविधाकर्ता द्वारा देखा गया परिणाम',
    assessmentObservedPass: 'उत्तीर्ण',
    assessmentObservedFail: 'अनुत्तीर्ण',
    assessmentSaveContinue: 'सहेजें और जारी रखें',
    assessmentSkip: 'अभी के लिए छोड़ें',
    assessmentSkipConfirm: 'इस मूल्यांकन को छोड़ें? आप इसे बाद में फिर से शुरू कर सकते हैं।',
    assessmentResume: 'मूल्यांकन फिर से शुरू करें',
    assessmentNextSteps: 'आगे क्या होगा?',
    assessmentStartTraining: 'प्रशिक्षण शुरू करें',
    assessmentFinish: 'सत्र समाप्त करें',
    venueLabel: 'स्थान',
    venuePlaceholder: 'उदा. पुणे पब्लिक लाइब्रेरी',
    visitDateLabel: 'दौरा तिथि',
    assessmentSaved: 'मूल्यांकन सहेजा गया',
    assessmentSkipped: 'मूल्यांकन छोड़ा गया — आप बाद में फिर से शुरू कर सकते हैं',
    assessmentLoadingTasks: 'मूल्यांकन लोड हो रहा है...',
  },
  mr: {
    appName: 'डिजिटल साक्षरता सिम्युलेटर',
    appTagline: 'स्मार्टफोन कौशल शिका, एका वेळी एक पाऊल',
    intakeTitle: 'स्वागत आहे',
    intakeSubtitle: 'सुरू करण्यासाठी तुमच्याबद्दल थोडी माहिती द्या',
    nameLabel: 'तुमचे नाव',
    namePlaceholder: 'तुमचे नाव टाका',
    ageLabel: 'तुमचे वय',
    agePlaceholder: 'तुमचे वय टाका',
    chooseLanguage: 'तुमची भाषा निवडा',
    startButton: 'सुरू करा',
    nameRequired: 'कृपया तुमचे नाव टाका',
    ageRequired: 'कृपया तुमचे वय टाका',
    levelLabel: 'स्तर',
    taskLabel: 'कार्य',
    hintButton: 'संकेत',
    hintTitle: 'संकेत',
    hintNoMore: 'या कार्यासाठी आणखी संकेत नाहीत',
    notNeededForTask: 'या कार्यासाठी आवश्यक नाही. हायलाइट केलेल्या पर्यायावर टॅप करा.',
    taskComplete: 'शाब्बास! कार्य पूर्ण झाले.',
    nextTaskLoading: 'पुढील कार्य लोड होत आहे...',
    thankYouTitle: 'धन्यवाद!',
    thankYouMessage:
      'तुम्ही सर्व कार्ये पूर्ण केली आहेत. नवीन स्मार्टफोन कौशल शिकण्यासाठी उत्तम काम.',
    startNewSession: 'नवीन सत्र सुरू करा',
    phoneHome: 'होम',
    phoneSettings: 'सेटिंग्ज',
    phoneCamera: 'कॅमेरा',
    phoneMaps: 'नकाशे',
    phoneBrowser: 'ब्राउझर',
    phoneWhatsapp: 'व्हॉट्अॅप',
    phoneUpi: 'UPI',
    phoneClock: 'घड्याळ',
    phoneMessages: 'संदेश',
    phonePhone: 'फोन',
    phoneShareLocation: 'स्थान शेअर करा',
    connected: 'कनेक्ट झाले',
    notConnected: 'कनेक्ट नाही',
    connectButton: 'कनेक्ट',
    settingsNetwork: 'नेटवर्क आणि इंटरनेट',
    settingsConnectedDevices: 'कनेक्टेड डिव्हाइस',
    settingsApps: 'अॅप्स',
    settingsNotifications: 'सूचना',
    settingsBattery: 'बॅटरी',
    settingsSound: 'ध्वनी आणि कंपन',
    settingsDisplay: 'डिस्प्ले',
    settingsWallpaper: 'वॉलपेपर',
    settingsAccessibility: 'सुलभता',
    settingsSecurity: 'सुरक्षा आणि गोपनीयता',
    settingsLocation: 'स्थान',
    settingsSafety: 'सुरक्षा आणि आपत्काल',
    settingsPasswords: 'पासवर्ड आणि खाती',
    settingsSystem: 'सिस्टम',
    settingsAbout: 'फोन बद्दल',
    fontSizeTitle: 'फॉन्ट आकार',
    fontSizeSubtitle: 'मजकूर मोठा करण्यासाठी स्लायडर ओढा',
    brightnessTitle: 'ब्राइटनेस स्तर',
    brightnessSubtitle: 'ब्राइटनेस बदलण्यासाठी स्लायडर ओढा',
    sampleText:
      'चांदण्या रात्री चंद्र प्रकाशात सखा म्हणाला हे वाचणे सोपे आहे. हा मजकूर तुमचा फॉन्ट आकार दर्शवतो.',
    wifiTitle: 'वाय-फाय',
    wifiSubtitle: 'वाय-फाय चालू करा आणि नेटवर्कशी कनेक्ट व्हा',
    wifiUseWifi: 'वाय-फाय वापरा',
    wifiSelectNetwork: 'कनेक्ट होण्यासाठी नेटवर्क निवडा',
    wifiSecured: 'सुरक्षित',
    wifiOpen: 'खुले',
    task_text_size_title: 'मजकूर मोठा करा',
    task_text_size_instruction:
      'सेटिंग्ज उघडा, मग डिस्प्ले. नमुना मजकूर सहज वाचता येईपर्यंत फॉन्ट आकार स्लायडर ओढा.',
    task_text_size_hint1: 'फोनवर सेटिंग्ज अॅप शोधा.',
    task_text_size_hint2: 'सेटिंग्जमध्ये डिस्प्ले पर्याय शोधा.',
    task_text_size_hint3: 'मजकूर मोठा करण्यासाठि फॉन्ट आकार स्लायडर उजवीकडे ओढा.',
    task_brightness_title: 'ब्राइटनेस एडजस्ट करा',
    task_brightness_instruction:
      'सेटिंग्ज उघडा, मग डिस्प्ले. स्क्रीन अधिक चमकदार करण्यासाठी ब्राइटनेस स्लायडर ओढा.',
    task_brightness_hint1: 'सेटिंग्जमध्ये डिस्प्ले विभाग आहे.',
    task_brightness_hint2: 'डिस्प्लेमध्ये ब्राइटनेस नियंत्रण असते.',
    task_brightness_hint3: 'ब्राइटनेस स्लायडर उजवीकडे ओढा.',
    task_wifi_title: 'वाय-फायशी कनेक्ट व्हा',
    task_wifi_instruction:
      'सेटिंग्ज उघडा, मग नेटवर्क आणि इंटरनेट. वाय-फाय चालू करा आणि दर्शविलेल्या नेटवर्कपैकी एकाशी कनेक्ट व्हा.',
    task_wifi_hint1: 'सेटिंग्जमध्ये नेटवर्क आणि इंटरनेट विभाग आहे.',
    task_wifi_hint2: 'आधी वाय-फाय स्विच चालू करा.',
    task_wifi_hint3: 'नेटवर्क नावावर टॅप करा, मग कनेक्टवर टॅप करा.',
    task_whatsapp_message_title: 'व्हॉट्अॅप संदेश पाठवा',
    task_whatsapp_message_instruction:
      'व्हॉट्अॅप उघडा. तुमच्या संपर्काला संदेश पाठवण्यासाठी सुचविलेल्या संदेश चिपवर टॅप करा.',
    task_whatsapp_message_hint1: 'व्हॉट्अॅप अॅप उघडा.',
    task_whatsapp_message_hint2:
      'चॅटच्या खाली सुचविलेला संदेश दिसतो. पाठवण्यासाठी त्यावर टॅप करा.',
    task_whatsapp_message_hint3: 'हायलाइट केलेल्या संदेश चिपवर टॅप करा — तो लगेच पाठवला जातो.',
    task_whatsapp_media_title: 'फोटो आणि व्हॉइस संदेश पाठवा',
    task_whatsapp_media_instruction:
      'व्हॉट्अॅपमध्ये, गॅलरीतून एखादा फोटो निवडा आणि पाठवा. मग एक छोटा व्हॉइस संदेश रेकॉर्ड करण्यासाठी मायक आयकॉन दाबून ठेवा.',
    task_whatsapp_media_hint1: 'फोटो निवडण्यासाठी गॅलरी उघडा.',
    task_whatsapp_media_hint2: 'संदेश म्हणून पाठवण्यासाठी फोटोवर टॅप करा.',
    task_whatsapp_media_hint3: 'रेकॉर्डिंग पूर्ण होईपर्यंत मायक्रोफोन आयकॉन दाबून ठेवा.',
    task_search_title: 'इंटरनेटवर शोधा',
    task_search_instruction:
      'ब्राउझर उघडा. एखाद्या रुग्णालयाचे नाव टाईप करा, मग योग्य परिणामावर दिशानिर्देश टॅप करा.',
    task_search_hint1: 'ब्राउझर अॅप उघडा.',
    task_search_hint2: 'शोध पट्टीत रुग्णालयाचे नाव टाईप करा.',
    task_search_hint3: 'जुळणाऱ्या परिणामावर दिशानिर्देश टॅप करा.',
    task_maps_title: 'नकाशेतून रुग्णालय शोधा',
    task_maps_instruction:
      'नकाशे उघडा. शोध पट्टीत "रुग्णालय" टाईप करा आणि एखाद्या परिणामावर दिशानिर्देश टॅप करा.',
    task_maps_hint1: 'नकाशे अॅप उघडा.',
    task_maps_hint2: 'शोध बॉक्समध्ये "रुग्णालय" टाईप करा.',
    task_maps_hint3: 'एखाद्या रुग्णालय परिणामावर दिशानिर्देश टॅप करा.',
    task_upi_title: 'QR कोड स्कॅन करा आणि डेमो पेमेंट करा',
    task_upi_instruction:
      'UPI उघडा. QR कोड स्कॅन करा, रिसीव्हर नावाची पुष्टी करा, रक्कम टाईप करा आणि पुष्टी करा टॅप करा.',
    task_upi_hint1: 'UPI अॅप उघडा आणि QR कोड स्कॅन करा.',
    task_upi_hint2: 'पुढे जाण्यापूर्वी रिसीव्हर नाव जुळते का ते तपासा.',
    task_upi_hint3: 'रक्कम टाईप करा आणि पुष्टी करा टॅप करा.',
    task_reminder_title: 'औषध रिमाइंडर सेट करा',
    task_reminder_instruction:
      'घड्याळ उघडा. रिमाइंडर वेळ सेट करा, नाव टाईप करा, रोज पुनरावृत्ती चालू करा आणि जतन करा टॅप करा.',
    task_reminder_hint1: 'घड्याळ अॅप उघडा.',
    task_reminder_hint2: 'वेळ सेट करा आणि रिमाइंडरला नाव द्या.',
    task_reminder_hint3: 'रोज पुनरावृत्ती चालू करा आणि जतन करा टॅप करा.',
    task_fake_sms_title: 'फकी SMS ओळखा',
    task_fake_sms_instruction:
      'दोन्ही संदेश पहा. जो फसवणूक दिसतो त्यावर टॅप करा.',
    task_fake_sms_hint1: 'दोन्ही संदेश काळजीपूर्वक वाचा.',
    task_fake_sms_hint2: 'फसवणुकीचे संदेश तात्काळ कृती किंवा वैयक्तिक माहिती मागतात.',
    task_fake_sms_hint3: 'तुमचा OTP किंवा कार्ड तपशील मागणारा संदेश फसवणूक आहे.',
    task_otp_scam_title: 'OTP फसवणूक ओळखा',
    task_otp_scam_instruction:
      'कॉलरला ऐका. चार पर्यायांमधून सर्वात सुरक्षित प्रतिसाद निवडा.',
    task_otp_scam_hint1: 'कॉलर तुमचा OTP मागत आहे.',
    task_otp_scam_hint2: 'कॉलवर कोणाशीही OTP शेअर करू नका.',
    task_otp_scam_hint3: 'नकार द्या आणि अधिकृत चॅनेल वापरा.',
    task_emergency_title: 'आपत्कालाचा प्रतिसाद द्या',
    task_emergency_instruction:
      'आपत्काल संपर्काला कॉल करा, कॉल संपूर्ण होऊ द्या, मग त्याच संपर्कासोबत तुमचे स्थान शेअर करा.',
    task_emergency_hint1: 'आधी हायलाइट केलेल्या आपत्काल संपर्काला कॉल करा.',
    task_emergency_hint2: 'सिम्युलेटेड कॉल संपण्याची वाट पहा.',
    task_emergency_hint3: 'मग त्याच संपर्कासोबत तुमचे स्थान शेअर करा.',
    chatContactName: 'रमेश',
    chatTypeMessage: 'संदेश टाईप करा',
    suggestedMessage: 'नमस्कार, तुम्ही कसे आहात?',
    messageSent: 'संदेश पाठवला',
    gallery: 'गॅलरी',
    holdToRecord: 'रेकॉर्ड करण्यासाठी दाबून ठेवा',
    recording: 'रेकॉर्डिंग...',
    voiceMessage: 'व्हॉइस संदेश',
    photoSent: 'फोटो पाठवला',
    searchPlaceholder: 'स्थान किंवा रुग्णालय शोधा',
    directions: 'दिशानिर्देश',
    searchResultHospital: 'सिटी केअर रुग्णालय',
    searchResultClinic: 'सनराईज फॅमिली क्लिनिक',
    searchResultPharmacy: 'हेल्थप्लस फार्मसी',
    mapsDirections: 'दिशानिर्देश',
    upiSimulatedBanner: 'हे एक सिम्युलेटेड पेमेंट आहे. यात खरे पैसे गुंतलेले नाहीत.',
    upiScanPrompt: 'स्कॅन करण्यासाठी कॅमेरा QR कोडवर ठेवा',
    upiScanning: 'स्कॅन होत आहे...',
    upiVerifyPrompt: 'हा योग्य रिसीव्हर आहे का?',
    upiReceiverName: 'रमेश कुमार',
    upiReceiverConfirm: 'होय, पुष्टी करा',
    upiReceiverWrong: 'नाही, पुन्हा स्कॅन करा',
    upiAmountPrompt: 'पेमेंटसाठी रक्कम टाईप करा',
    upiAmountPlaceholder: '₹0',
    upiConfirm: 'पेमेंटची पुष्टी करा',
    upiPaymentSuccess: '{name} ला ₹{amount} पेमेंट पाठवले',
    upiWrongReceiver: 'चुकीचा रिसीव्हर. कृपया पुन्हा स्कॅन करा.',
    reminderTimeLabel: 'वेळ',
    reminderNameLabel: 'रिमाइंडर नाव',
    reminderNamePlaceholder: 'उदा. ब्लड प्रेशरचे औषध',
    reminderRepeatDaily: 'रोज पुनरावृत्ती',
    reminderSave: 'जतन करा',
    reminderSaved: 'रिमाइंडर जतन झाले',
    smsLegitimate:
      'तुमच्या खात्याचे बॅलन्स Rs 5,200 आहे. आमच्यासोबत बँकिंग केल्याबद्दल धन्यवाद. - SBI',
    smsScam:
      'तात्काळ! तुमचे खाते ब्लॉक होईल. पडताळणीसाठी आता तुमचा OTP आणि कार्ड तपशील पाठवा: 9123456780',
    smsLegitimateExplanation:
      'हा एक सामान्य बँक संदेश आहे. तो कोणतीही गुप्त माहिती मागत नाही.',
    smsScamSelected: 'बरोबर! तो संदेश तुमचा OTP आणि कार्ड तपशील मागतो — ती फसवणूक आहे.',
    smsTapScam: 'फसवणूक संदेशावर टॅप करा',
    otpIncomingCall: 'येणारा कॉल: +91 98765 43210',
    otpTranscript:
      'नमस्कार, मी तुमच्या बँकेतून कॉल करत आहे. आम्हाला असामान्य क्रियाकलाप आढळले. तुमचे खाते सुरक्षित करण्यासाठी आता मिळालेला OTP सांगा.',
    otpOption1: 'खाते सुरक्षित करण्यासाठी OTP शेअर करा',
    otpOption2: 'तपासताना कॉलरला थांबायला सांगा',
    otpOption3: 'फक्त शेवटचे 4 अंक शेअर करा',
    otpOptionCorrect: 'नकार द्या आणि अधिकृत बँक चॅनेल वापरा',
    otpWrongExplanation:
      'OTP कधीच कोणाशीही शेअर करू नका, तो अंशातही नाही. बँका कॉलवर OTP मागत नाहीत.',
    otpCorrectExplanation:
      'बरोबर. नेहमी नकार द्या आणि अधिकृत चॅनेल वापरा. बँका कॉलवर OTP मागत नाहीत.',
    emergencyCallContact: 'कॉल करा',
    emergencyContactName: 'मुलगा - अमित',
    emergencyCalling: 'अमितला कॉल होत आहे...',
    emergencyCallEnded: 'कॉल संपला',
    emergencyShareLocation: 'तुमचे स्थान शेअर करा',
    emergencyShareTo: 'अमितसोबत शेअर करा',
    emergencyLocationShared: 'अमितसोबत स्थान शेअर झाले',
    emergencyDone: 'आपत्काल हाताळला',
    level1Name: 'दैनंदिन मूलभूत गोष्टी',
    level2Name: 'संवाद आणि इंटरनेट',
    level3Name: 'डिजिटल सेवा आणि स्वावलंबन',
    level4Name: 'सुरक्षा आणि समस्या निवारण',
    assessmentBaselineTitle: 'बेसलाइन तपासणी',
    assessmentBaselineSubtitle: 'प्रशिक्षण सुरू होण्यापूर्वी, नोंदवा की शिक्षणार्थी आज काय करू शकतो.',
    assessmentPostTitle: 'प्रशिक्षणानंतरची तपासणी',
    assessmentPostSubtitle: 'प्रशिक्षणानंतर, नोंदवा की शिक्षणार्थी आता काय करू शकतो.',
    assessmentCanDoUnaided: 'शिक्षणार्थी हे स्वतःहून करू शकतो का?',
    assessmentCanDoYes: 'होय',
    assessmentCanDoNo: 'नाही',
    assessmentConfidence: 'आत्मविश्वास स्तर',
    assessmentFacilitatorObserved: 'सुविधादात्याने दिलेले निरीक्षण',
    assessmentObservedPass: 'उत्तीर्ण',
    assessmentObservedFail: 'अनुत्तीर्ण',
    assessmentSaveContinue: 'जतन करा आणि पुढे जा',
    assessmentSkip: 'आतापर्यंत वगळा',
    assessmentSkipConfirm: 'हे मूल्यांकन वगळायचे? आपण नंतर पुन्हा सुरू करू शकता.',
    assessmentResume: 'मूल्यांकन पुन्हा सुरू करा',
    assessmentNextSteps: 'पुढे काय होईल?',
    assessmentStartTraining: 'प्रशिक्षण सुरू करा',
    assessmentFinish: 'सत्र संपवा',
    venueLabel: 'स्थान',
    venuePlaceholder: 'उदा. पुणे पब्लिक लायब्ररी',
    visitDateLabel: 'भेटीची तारीख',
    assessmentSaved: 'मूल्यांकन जतन झाले',
    assessmentSkipped: 'मूल्यांकन वगळले — आपण नंतर पुन्हा सुरू करू शकता',
    assessmentLoadingTasks: 'मूल्यांकन लोड होत आहे...',
  },
};

export function t(lang: Language, key: keyof TranslationDict, vars?: Record<string, string | number>): string {
  let str: string = translations[lang][key] ?? translations.en[key] ?? String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}
