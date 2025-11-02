# 🙏 Karunamayi Hanuman E-Mandir - Virtual Temple PWA# 🙏 Karunamayi Hanuman E-Mandir - Virtual Hanuman Temple PWA



A devotional Progressive Web Application (PWA) that provides a virtual temple experience for Lord Hanuman devotees. This client-only application runs entirely in the browser with offline support.A devotional Progressive Web Application (PWA) that provides a virtual temple experience for Lord Hanuman devotees. This client-only application runs entirely in the browser with offline support and no backend requirements.



## ✨ Features## ✨ Features



### 🏛️ Virtual Temple Experience- **🏛️ Virtual Temple**: Beautiful, responsive temple interface with saffron theme

- **Beautiful UI**: Saffron-themed responsive temple interface- **🙏 Wish Management**: Create, activate, and fulfill spiritual wishes

- **Divine Imagery**: Animated Hanuman deity with Aarti flames and rotating Mala beads- **💰 QR-Based Donations**: UPI payment QR code generation (client-side only)

- **Temple Background**: Sacred patterns and Om symbols throughout- **🎵 Audio Chants**: Play devotional chants (Hanuman Chalisa, Aarti)

- **Loading Screen**: Animated Om symbol with progress bar for smooth startup- **⏰ Chant Scheduler**: Schedule daily prayer reminders with notifications

- **📱 PWA Support**: Install as app, works offline

### 🙏 Wish Management System- **💾 Local Storage**: All data stored locally using IndexedDB/localStorage

Create and track your spiritual wishes with an interactive 4-step process:- **♿ Accessible**: Large buttons, high contrast, keyboard navigation

- **🌐 Multi-language Ready**: Stub for language toggle (Hindi/English)

1. **Create Wish** - Enter your prayer with title, description, and category:

   - 🏥 Health & Wellness## 🛠️ Technology Stack

   - 💰 Prosperity & Wealth

   - 📚 Education & Knowledge- **Angular 16+**: Modern Angular framework

   - 👨‍👩‍👧 Family & Relationships- **Tailwind CSS**: Utility-first CSS framework

   - 💼 Career & Success- **PWA**: Service Worker, Web App Manifest

   - 🙏 General Blessings- **LocalForage**: IndexedDB with localStorage fallback

- **QRCode.js**: Client-side QR code generation

2. **Ritual** - Perform virtual puja:- **TypeScript**: Type-safe development

   - Ring temple bell 5 times 🔔

   - Chant "Jai Hanuman" 11 times## 📋 Prerequisites

   - Choose virtual offering (Prasad, Flowers, Incense, Lamp, Fruits)

   - Beautiful falling offerings animation- Node.js 16+ and npm 8+

- Angular CLI (`npm install -g @angular/cli`)

3. **Share Blessings** - Spread devotion:

   - Share temple information with others via WhatsApp, Email, SMS, etc.## 🚀 Quick Start

   - Native mobile share API support

   - Optional step (can be skipped)### 1. Install Dependencies



4. **Complete** - Your wish is activated and stored locally```powershell

npm install

### 🎵 Automatic Hourly Hanuman Chalisa```

- **Smart Scheduling**: Plays automatically every hour from 5 AM to 7 PM

- **Live Sync**: Join mid-session if you open the app during playback### 2. Configure UPI VPA

- **Real-time Countdown**: See when the next chant begins

- **8:32 Duration**: Full authentic Hanuman Chalisa recitation**IMPORTANT**: Before deployment, update the UPI VPA in environment files:

- **One-click Enable**: Browser autoplay protection requires user interaction

- Edit `src/environments/environment.ts` (development)

### 💰 Optional Support/Donation- Edit `src/environments/environment.prod.ts` (production)

- **Completely Optional**: All features are 100% free

- **QR Code**: Scan UPI QR code for instant paymentReplace `dszvivek@icici` with your actual UPI ID:

- **UPI Link**: Mobile deep-link for UPI apps

- **Copy UPI ID**: Manual payment option```typescript

- **Transparency**: Clear information about how contributions are usedexport const environment = {

  production: false,

### 📱 Progressive Web App  upiVpa: 'your-actual-upi-id@provider', // ← Change this

- **Install to Home Screen**: Works like a native app  // ...

- **Offline Support**: Full functionality without internet (after first load)};

- **Service Worker**: Fast loading with cached assets```

- **Responsive Design**: Adapts to phone, tablet, and desktop

- **Cross-browser**: Works on Chrome, Firefox, Edge, Safari### 3. Add Audio Assets (Optional)



### 🌐 Multi-language SupportPlace devotional audio files in `src/assets/audio/`:

- **Hindi Interface**: Complete Hindi translation- `hanuman-chalisa.mp3`

- **English Interface**: Default English language- `hanuman-aarti.mp3`

- **Easy Toggle**: Switch languages anytime with one click- `om-chant.mp3`

- **Sanskrit Verses**: Authentic devotional mantras displayed

See `src/assets/audio/README.md` for guidelines.

### 💾 Local Data Storage

- **Privacy First**: All data stays on your device### 4. Generate PWA Icons (Optional)

- **IndexedDB**: Efficient storage with localStorage fallback

- **No Backend**: Completely client-side applicationCreate icons in various sizes in `src/assets/icons/`:

- **No Tracking**: Zero analytics or data collection- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

- **No Registration**: Use immediately, no account needed

Use tools like [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator).

## 🛠️ Technology Stack

See `src/assets/icons/README.md` for details.

- **Angular 16+**: Modern TypeScript framework

- **Tailwind CSS**: Utility-first styling## 💻 Development

- **Service Worker**: PWA offline support

- **LocalForage**: IndexedDB with fallback### Start Development Server

- **Web Audio API**: Bell sound generation

- **Native Share API**: Mobile-friendly sharing```powershell

npm start

## 📋 Prerequisites# or

ng serve

- Node.js 16+ and npm 8+```

- Angular CLI (`npm install -g @angular/cli`)

Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

## 🚀 Quick Start

### Build for Production

### 1. Install Dependencies

```powershell

```powershellnpm run build:prod

npm install# or

```ng build --configuration production

```

### 2. Configure UPI (Optional)

The build artifacts will be stored in the `dist/karya-siddhi-temple/` directory.

If you want to enable donations, update the UPI VPA in:

- `src/environments/environment.ts` (development)### Run Tests

- `src/environments/environment.prod.ts` (production)

```powershell

```typescriptnpm test

upiVpa: 'your-actual-upi-id@provider'# or

```ng test

```

### 3. Add Audio Assets

This runs unit tests using Karma and Jasmine.

Place devotional audio files in `src/assets/audio/`:

- `hanuman-chalisa.mp3` (required for hourly chanting)## 📦 Deployment

- `hanuman-aarti.mp3` (optional)

- `om-chant.mp3` (optional)The built application is a **static website** that can be deployed to any static hosting service.



See `src/assets/audio/README.md` for guidelines.### Recommended Hosts



### 4. Add Images1. **Netlify**: 

   - Drag & drop `dist/karya-siddhi-temple` folder

Place temple images in `src/assets/images/`:   - Or connect Git repo for automatic deployments

- `hanuman-main.png` - Hero image (1200x500px recommended)

- `temple-background.svg` - Background pattern2. **Vercel**:

- Other SVG icons for offerings   - Import project from Git

   - Auto-detects Angular configuration

See `src/assets/images/README.md` for details.

3. **GitHub Pages**:

## 💻 Development   ```powershell

   npm run build:prod

### Start Development Server   # Deploy dist/karya-siddhi-temple to gh-pages branch

   ```

```powershell

npm start4. **Firebase Hosting**:

```   ```powershell

   npm install -g firebase-tools

Navigate to `http://localhost:4200/`   firebase init hosting

   firebase deploy

### Build for Production   ```



```powershell5. **Azure Static Web Apps**, **AWS S3 + CloudFront**, etc.

npm run build:prod

```### Deployment Checklist



Build artifacts will be in `dist/karya-siddhi-temple/`- [ ] Update UPI VPA in `src/environments/environment.prod.ts`

- [ ] Add actual audio files or remove audio references

### Run Tests- [ ] Generate and add PWA icons

- [ ] Test on mobile devices

```powershell- [ ] Verify PWA installation works

npm test- [ ] Test offline functionality

```- [ ] Review legal disclaimers



## 🎨 Customization## 🏗️ Project Structure



### Change Temple Timings```

karya-siddhi-temple/

Edit `src/app/services/audio-player.service.ts`:├── src/

│   ├── app/

```typescript│   │   ├── components/

private readonly START_HOUR = 5; // 5 AM│   │   │   ├── home/                 # Temple home page

private readonly END_HOUR = 19; // 7 PM│   │   │   ├── qr-payment/           # UPI QR code generator

```│   │   │   ├── wish-flow/            # Wish creation flow

│   │   │   ├── audio-player/         # Chant audio player

### Modify Wish Categories│   │   │   ├── recent-wishes/        # Wish list display

│   │   │   └── install-prompt/       # PWA install banner

Edit `src/app/models/wish.model.ts`:│   │   ├── services/

│   │   │   ├── wish.service.ts       # Wish CRUD with localForage

```typescript│   │   │   └── scheduler.service.ts  # Chant scheduling

export enum WishCategory {│   │   ├── models/

  HEALTH = 'health',│   │   │   └── wish.model.ts         # Wish interface & enums

  PROSPERITY = 'prosperity',│   │   ├── app.module.ts             # Main app module

  // Add more categories...│   │   ├── app-routing.module.ts     # Routes configuration

}│   │   └── app.component.ts          # Root component

```│   ├── assets/

│   │   ├── audio/                    # Devotional audio files

### Update Ritual Requirements│   │   ├── images/                   # Temple images

│   │   └── icons/                    # PWA icons

Edit `src/app/components/wish-flow/wish-flow.component.ts`:│   ├── environments/

│   │   ├── environment.ts            # Dev config (UPI VPA here)

```typescript│   │   └── environment.prod.ts       # Prod config

requiredBellTaps = 5;│   ├── manifest.webmanifest          # PWA manifest

requiredChants = 11;│   ├── styles.css                    # Global Tailwind styles

```│   └── index.html                    # HTML entry point

├── angular.json                      # Angular CLI configuration

## 📱 Features Deep Dive├── package.json                      # Dependencies

├── tailwind.config.js                # Tailwind configuration

### Hourly Hanuman Chalisa System├── ngsw-config.json                  # Service Worker config

└── README.md                         # This file

The app intelligently manages automatic playback:```

- Checks every second if it should be playing

- Syncs playback to the hour (everyone hears the same part)## 🎨 Customization

- Auto-starts when enabled during operating hours

- Auto-stops outside operating hours### Change Theme Colors

- Shows countdown to next session

- Displays "joined X minutes into hour" statusEdit `tailwind.config.js`:



### Wish Flow Journey```javascript

theme: {

1. User creates a wish with personal details  extend: {

2. Performs interactive ritual (bell + chants)    colors: {

3. Optionally shares temple with others      saffron: { /* your colors */ },

4. Wish is activated and stored locally      temple: { /* your colors */ }

5. Can view/track wishes anytime    }

6. Beautiful animations throughout  }

}

### Asset Preloading```



The loading screen preloads ALL assets before showing the app:### Modify Wish Categories

- All SVG and PNG images

- All MP3 audio filesEdit `src/app/models/wish.model.ts`:

- Progress bar shows real loading status

- Prevents broken images or loading delays```typescript

export enum WishCategory {

## 🔒 Privacy & Security  HEALTH = 'health',

  PROSPERITY = 'prosperity',

- **No Backend**: 100% client-side application  // Add more categories...

- **Local Storage**: IndexedDB keeps wishes on your device}

- **No Analytics**: Zero tracking or data collection```

- **No Cookies**: No cookie usage

- **No User Accounts**: Anonymous usage### Update Temple Timings

- **Direct Payments**: UPI payments go directly to configured address

- **Open Source**: Code is transparent and auditableEdit `src/app/services/scheduler.service.ts`:



## ⚖️ Legal & Transparency```typescript

private setDefaultSchedule(): void {

### Donation Disclaimer  // Modify default chant schedules

}

- **Optional**: All features work without contributing```

- **Direct Payment**: Goes directly to the configured UPI ID

- **No Processing**: App doesn't handle payments## � Support This Project

- **Verify Before Paying**: Always check the UPI ID

- **No Refunds**: App cannot process refundsThis is a **free, open-source devotional service** created with love and dedication for Lord Hanuman's devotees.

- **Not Tax-Deductible**: This is not a registered charity

### Transparency in Contributions

### Application Disclaimer

If you appreciate this service and wish to support its maintenance, contributions are gratefully accepted but **completely optional**.

- **Devotional Purpose**: For spiritual use only

- **No Guarantees**: Provided "AS IS" without warranties**Actual Monthly Costs:**

- **No Professional Advice**: Not legal, financial, or medical advice- Domain Name: ~₹67/month (₹800/year)

- **User Responsibility**: You verify payment details and compliance- Hosting & SSL: ~₹200/month

- CDN & Storage: ~₹150/month

## 📦 Deployment- **Total: ~₹417/month (~₹5,000/year)**



### GitHub Pages**Your contribution helps:**

- Keep the service free for all devotees

1. Build the production version:- Maintain uptime and performance

```powershell- Cover domain and hosting costs

npm run build:prod- Support future enhancements

```

**100% Transparency:**

2. Deploy to GitHub Pages:- All contributions go to the developer maintaining this service

```powershell- UPI ID is clearly displayed (verify before payment)

npx angular-cli-ghpages --dir=dist/karya-siddhi-temple- No hidden fees or organizations

```- Service remains free regardless of contributions



### Netlify> *"Whether you contribute or not, your devotion is what truly matters. This service is offered freely to all."* 🙏



1. Connect your GitHub repository## �🔒 Privacy & Data

2. Build command: `npm run build:prod`

3. Publish directory: `dist/karya-siddhi-temple`- **No Backend**: All data stays on the user's device

- **IndexedDB Storage**: Wishes stored locally using localForage

### Other Hosting- **No Analytics**: No tracking or data collection

- **No Cookies**: No cookie usage

Deploy the contents of `dist/karya-siddhi-temple/` to any static hosting service.- **Offline First**: Works without internet after first load

- **No Payment Processing**: UPI payments go directly to configured address

## 🤝 Contributing

## ⚖️ Legal Disclaimer

Contributions welcome! This is a devotional project for Lord Hanuman's devotees.

**IMPORTANT - READ CAREFULLY**

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)### About This Service

3. Commit your changes (`git commit -m 'Add amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)1. **Independent Project**: This is an independent, free devotional web application created by an individual developer. It is NOT:

5. Open a Pull Request   - Affiliated with any official temple or religious organization

   - A registered charity or trust

## 🙏 Acknowledgments   - A commercial entity or business



- Devotion to Lord Hanuman 🙏2. **Free Service**: This application is provided completely free of charge to all devotees. No features are locked behind payments.

- Angular team for the excellent framework

- Tailwind CSS for beautiful styling### Support/Contribution Disclaimer

- LocalForage for client-side storage

- All devotees and contributors1. **Optional Contributions**: Any contribution made is entirely voluntary and goes directly to the individual developer maintaining this free service for website hosting and maintenance costs.



## 📞 Support2. **Direct Payment**: Contributions go DIRECTLY to the UPI address configured in the application. The application does NOT:

   - Process payments

### Technical Issues   - Store payment information

- Check browser console for errors   - Have any control over transactions

- Use a modern browser (Chrome, Firefox, Edge, Safari)

- Clear browser cache and reload3. **Verification Responsibility**: Users must verify the UPI ID displayed before making any contribution.

- Ensure audio files exist in `src/assets/audio/`

4. **No Guarantees**: The developer makes NO guarantees about:

### Spiritual Guidance   - Availability or uptime of the service

- Visit your local temple   - Future features or updates

- Read the Hanuman Chalisa daily 🙏   - Religious or spiritual outcomes

- Consult with spiritual leaders   - Tax deductibility (not a registered charity)



## 🔮 Roadmap5. **Voluntary & Non-Refundable**: By contributing, you acknowledge that:

   - Contribution is voluntary and supports website maintenance

Potential future enhancements:   - You understand it goes directly to the configured UPI ID

- [ ] More language support (Telugu, Tamil, Gujarati)   - Contributions are non-refundable

- [ ] Additional audio tracks (different renditions)   - The service remains free for all regardless of contribution

- [ ] Lunar calendar integration   - You will not hold the application developers liable for any issues

- [ ] Virtual Aarti ceremony

- [ ] Word-by-word Chalisa recitation6. **No Refunds**: The application has no ability to process refunds. Contact your payment provider or the UPI VPA owner directly for refund requests.

- [ ] Dark mode

- [ ] Wish fulfillment tracking with reminders### Application Disclaimer



---1. **Devotional Purpose**: This application is for devotional and spiritual purposes only.



## जय हनुमान ज्ञान गुण सागर 🙏2. **No Professional Advice**: This app does not provide legal, financial, medical, or professional advice.



**May Lord Hanuman bless all devotees!**3. **As-Is Basis**: The application is provided "AS IS" without any warranties of any kind.



---4. **User Responsibility**: Users are solely responsible for:

   - Verifying payment details before transactions

*Created with devotion for Lord Hanuman devotees worldwide.*   - Backing up their wish data (stored locally)

   - Compliance with local laws regarding donations

**Version**: 1.0.0  

**Last Updated**: November 2025### Legal Compliance


- **Charitable Regulations**: If you are deploying this for an actual temple or charitable organization, ensure compliance with local charitable organization laws and regulations.

- **Payment Regulations**: Ensure compliance with payment gateway regulations and RBI guidelines for UPI payments in your jurisdiction.

- **Tax Compliance**: Consult a tax professional regarding donation tax implications.

### Intellectual Property

- The code is provided for devotional and educational purposes
- Hanuman Chalisa and other devotional texts are in the public domain
- Ensure you have rights to any audio/image assets you use

## 🤝 Contributing

This is a devotional project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open-source and available for devotional and educational purposes. 

**Important**: 
- Not for commercial use without proper authorization
- Ensure compliance with all local laws if deploying publicly
- You are responsible for any modifications you make

## 🙏 Acknowledgments

- Devotion to Lord Hanuman 🙏
- Angular team for the excellent framework
- Tailwind CSS team for the styling framework
- LocalForage for client-side storage
- All devotees and contributors

## 📞 Support

For technical issues:
- Check the browser console for errors
- Ensure you're using a modern browser (Chrome, Firefox, Edge, Safari)
- Clear browser cache and reload
- Check that audio files exist if using audio features

For spiritual guidance:
- Visit your local temple
- Consult with spiritual leaders
- Read the Hanuman Chalisa daily 🙏

## 🔮 Roadmap

Potential future enhancements:
- [ ] Multiple language support (Hindi, English, Telugu, Tamil)
- [ ] More devotional audio tracks
- [ ] Lunar calendar integration
- [ ] Virtual Aarti ceremony
- [ ] Hanuman Chalisa word-by-word recitation
- [ ] Dark mode
- [ ] Share wishes feature (optional)

---

## जय हनुमान ज्ञान गुन सागर 🙏

**May Lord Hanuman bless all devotees!**

---

*Created with devotion for Lord Hanuman devotees worldwide.*

**Version**: 1.0.0  
**Last Updated**: November 2025
