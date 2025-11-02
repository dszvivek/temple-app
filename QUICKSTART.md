# 🙏 Karya Siddhi Temple

# 🙏 Karunamayi Hanuman E-Mandir

## Quick Start Guide

### 1. Install Dependencies
```powershell
npm install
```

### 2. Configure UPI VPA
Edit `src/environments/environment.ts` and update:
```typescript
upiVpa: 'your-upi-id@provider'
```

### 3. Start Development Server
```powershell
npm start
```

### 4. Build for Production
```powershell
npm run build:prod
```

## Important Files to Configure

- `src/environments/environment.ts` - Development config (UPI VPA)
- `src/environments/environment.prod.ts` - Production config (UPI VPA)
- `src/assets/audio/` - Add your audio files here
- `src/assets/icons/` - Add PWA icons here

## Features

✅ Virtual Hanuman Temple  
✅ Wish Management (Local Storage)  
✅ UPI QR Code Donations  
✅ Audio Chants Player  
✅ PWA with Offline Support  
✅ Chant Scheduler with Notifications  

## Tech Stack

- Angular 16+
- Tailwind CSS
- PWA (Service Worker)
- IndexedDB/LocalForage
- QRCode.js

## Legal Notice

⚠️ **This is a devotional application. All donations go directly to the configured UPI VPA. The app developers are NOT responsible for payment transactions. See README.md for full legal disclaimer.**

---

जय हनुमान! 🙏
