# 🙏 Karunamayi Hanuman E-Mandir - Virtual Hanuman Temple PWA

A devotional Progressive Web Application (PWA) that provides a virtual temple experience for Lord Hanuman devotees. This client-only application runs entirely in the browser with offline support and no backend requirements.

## ✨ Features

- **🏛️ Virtual Temple**: Beautiful, responsive temple interface with saffron theme
- **🙏 Wish Management**: Create, activate, and fulfill spiritual wishes
- **💰 QR-Based Donations**: UPI payment QR code generation (client-side only)
- **🎵 Audio Chants**: Play devotional chants (Hanuman Chalisa, Aarti)
- **⏰ Chant Scheduler**: Schedule daily prayer reminders with notifications
- **📱 PWA Support**: Install as app, works offline
- **💾 Local Storage**: All data stored locally using IndexedDB/localStorage
- **♿ Accessible**: Large buttons, high contrast, keyboard navigation
- **🌐 Multi-language Ready**: Stub for language toggle (Hindi/English)

## 🛠️ Technology Stack

- **Angular 16+**: Modern Angular framework
- **Tailwind CSS**: Utility-first CSS framework
- **PWA**: Service Worker, Web App Manifest
- **LocalForage**: IndexedDB with localStorage fallback
- **QRCode.js**: Client-side QR code generation
- **TypeScript**: Type-safe development

## 📋 Prerequisites

- Node.js 16+ and npm 8+
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Configure UPI VPA

**IMPORTANT**: Before deployment, update the UPI VPA in environment files:

- Edit `src/environments/environment.ts` (development)
- Edit `src/environments/environment.prod.ts` (production)

Replace `dszvivek@icici` with your actual UPI ID:

```typescript
export const environment = {
  production: false,
  upiVpa: 'your-actual-upi-id@provider', // ← Change this
  // ...
};
```

### 3. Add Audio Assets (Optional)

Place devotional audio files in `src/assets/audio/`:
- `hanuman-chalisa.mp3`
- `hanuman-aarti.mp3`
- `om-chant.mp3`

See `src/assets/audio/README.md` for guidelines.

### 4. Generate PWA Icons (Optional)

Create icons in various sizes in `src/assets/icons/`:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Use tools like [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator).

See `src/assets/icons/README.md` for details.

## 💻 Development

### Start Development Server

```powershell
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

### Build for Production

```powershell
npm run build:prod
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/karya-siddhi-temple/` directory.

### Run Tests

```powershell
npm test
# or
ng test
```

This runs unit tests using Karma and Jasmine.

## 📦 Deployment

The built application is a **static website** that can be deployed to any static hosting service.

### Recommended Hosts

1. **Netlify**: 
   - Drag & drop `dist/karya-siddhi-temple` folder
   - Or connect Git repo for automatic deployments

2. **Vercel**:
   - Import project from Git
   - Auto-detects Angular configuration

3. **GitHub Pages**:
   ```powershell
   npm run build:prod
   # Deploy dist/karya-siddhi-temple to gh-pages branch
   ```

4. **Firebase Hosting**:
   ```powershell
   npm install -g firebase-tools
   firebase init hosting
   firebase deploy
   ```

5. **Azure Static Web Apps**, **AWS S3 + CloudFront**, etc.

### Deployment Checklist

- [ ] Update UPI VPA in `src/environments/environment.prod.ts`
- [ ] Add actual audio files or remove audio references
- [ ] Generate and add PWA icons
- [ ] Test on mobile devices
- [ ] Verify PWA installation works
- [ ] Test offline functionality
- [ ] Review legal disclaimers

## 🏗️ Project Structure

```
karya-siddhi-temple/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/                 # Temple home page
│   │   │   ├── qr-payment/           # UPI QR code generator
│   │   │   ├── wish-flow/            # Wish creation flow
│   │   │   ├── audio-player/         # Chant audio player
│   │   │   ├── recent-wishes/        # Wish list display
│   │   │   └── install-prompt/       # PWA install banner
│   │   ├── services/
│   │   │   ├── wish.service.ts       # Wish CRUD with localForage
│   │   │   └── scheduler.service.ts  # Chant scheduling
│   │   ├── models/
│   │   │   └── wish.model.ts         # Wish interface & enums
│   │   ├── app.module.ts             # Main app module
│   │   ├── app-routing.module.ts     # Routes configuration
│   │   └── app.component.ts          # Root component
│   ├── assets/
│   │   ├── audio/                    # Devotional audio files
│   │   ├── images/                   # Temple images
│   │   └── icons/                    # PWA icons
│   ├── environments/
│   │   ├── environment.ts            # Dev config (UPI VPA here)
│   │   └── environment.prod.ts       # Prod config
│   ├── manifest.webmanifest          # PWA manifest
│   ├── styles.css                    # Global Tailwind styles
│   └── index.html                    # HTML entry point
├── angular.json                      # Angular CLI configuration
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind configuration
├── ngsw-config.json                  # Service Worker config
└── README.md                         # This file
```

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      saffron: { /* your colors */ },
      temple: { /* your colors */ }
    }
  }
}
```

### Modify Wish Categories

Edit `src/app/models/wish.model.ts`:

```typescript
export enum WishCategory {
  HEALTH = 'health',
  PROSPERITY = 'prosperity',
  // Add more categories...
}
```

### Update Temple Timings

Edit `src/app/services/scheduler.service.ts`:

```typescript
private setDefaultSchedule(): void {
  // Modify default chant schedules
}
```

## � Support This Project

This is a **free, open-source devotional service** created with love and dedication for Lord Hanuman's devotees.

### Transparency in Contributions

If you appreciate this service and wish to support its maintenance, contributions are gratefully accepted but **completely optional**.

**Actual Monthly Costs:**
- Domain Name: ~₹67/month (₹800/year)
- Hosting & SSL: ~₹200/month
- CDN & Storage: ~₹150/month
- **Total: ~₹417/month (~₹5,000/year)**

**Your contribution helps:**
- Keep the service free for all devotees
- Maintain uptime and performance
- Cover domain and hosting costs
- Support future enhancements

**100% Transparency:**
- All contributions go to the developer maintaining this service
- UPI ID is clearly displayed (verify before payment)
- No hidden fees or organizations
- Service remains free regardless of contributions

> *"Whether you contribute or not, your devotion is what truly matters. This service is offered freely to all."* 🙏

## �🔒 Privacy & Data

- **No Backend**: All data stays on the user's device
- **IndexedDB Storage**: Wishes stored locally using localForage
- **No Analytics**: No tracking or data collection
- **No Cookies**: No cookie usage
- **Offline First**: Works without internet after first load
- **No Payment Processing**: UPI payments go directly to configured address

## ⚖️ Legal Disclaimer

**IMPORTANT - READ CAREFULLY**

### About This Service

1. **Independent Project**: This is an independent, free devotional web application created by an individual developer. It is NOT:
   - Affiliated with any official temple or religious organization
   - A registered charity or trust
   - A commercial entity or business

2. **Free Service**: This application is provided completely free of charge to all devotees. No features are locked behind payments.

### Support/Contribution Disclaimer

1. **Optional Contributions**: Any contribution made is entirely voluntary and goes directly to the individual developer maintaining this free service for website hosting and maintenance costs.

2. **Direct Payment**: Contributions go DIRECTLY to the UPI address configured in the application. The application does NOT:
   - Process payments
   - Store payment information
   - Have any control over transactions

3. **Verification Responsibility**: Users must verify the UPI ID displayed before making any contribution.

4. **No Guarantees**: The developer makes NO guarantees about:
   - Availability or uptime of the service
   - Future features or updates
   - Religious or spiritual outcomes
   - Tax deductibility (not a registered charity)

5. **Voluntary & Non-Refundable**: By contributing, you acknowledge that:
   - Contribution is voluntary and supports website maintenance
   - You understand it goes directly to the configured UPI ID
   - Contributions are non-refundable
   - The service remains free for all regardless of contribution
   - You will not hold the application developers liable for any issues

6. **No Refunds**: The application has no ability to process refunds. Contact your payment provider or the UPI VPA owner directly for refund requests.

### Application Disclaimer

1. **Devotional Purpose**: This application is for devotional and spiritual purposes only.

2. **No Professional Advice**: This app does not provide legal, financial, medical, or professional advice.

3. **As-Is Basis**: The application is provided "AS IS" without any warranties of any kind.

4. **User Responsibility**: Users are solely responsible for:
   - Verifying payment details before transactions
   - Backing up their wish data (stored locally)
   - Compliance with local laws regarding donations

### Legal Compliance

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
