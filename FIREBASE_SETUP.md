# 🔥 Firebase Backend Setup Guide

## Overview

This guide will help you set up Firebase backend for the E-Darshan Mandir app. The backend provides **real-time global features** without requiring user accounts:

- ✅ **Real-time global statistics** (wishes, diyas, devotees)
- ✅ **Community prayer wall** (anonymous shared wishes)
- ✅ **Global diya lighting** (see diyas lit worldwide)
- ✅ **Temple events & announcements**
- ✅ **Anonymous donation tracking** (transparency)

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**

### 1.2 Project Setup

1. **Project name**: `temple-app` (or your preferred name)
2. **Google Analytics**: Enable (recommended) or Skip
3. Click **"Create project"** and wait for setup to complete

---

## 📱 Step 2: Register Web App

### 2.1 Add Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. **App nickname**: `Karunamayi Temple PWA`
3. ✅ Check **"Also set up Firebase Hosting"** (optional, for deployment)
4. Click **"Register app"**

### 2.2 Copy Configuration

You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "temple-app-xxxxx.firebaseapp.com",
  projectId: "temple-app-xxxxx",
  storageBucket: "temple-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
  measurementId: "G-XXXXXXXXXX"
};
```

**📋 IMPORTANT**: Keep this configuration handy for Step 5!

---

## 🗄️ Step 3: Enable Firestore Database

### 3.1 Create Firestore Database

1. In Firebase Console, go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. **Security rules**: Choose **"Start in production mode"** (we'll add custom rules)
4. **Location**: Choose closest to your users (e.g., `asia-south1` for India)
5. Click **"Enable"**

### 3.2 Initialize Global Statistics Document

1. Go to **Firestore Database** → **Data tab**
2. Click **"Start collection"**
3. Collection ID: `globals`
4. Document ID: `statistics`
5. Add the following fields:

| Field | Type | Value |
|-------|------|-------|
| `totalWishes` | number | `0` |
| `totalDiyas` | number | `0` |
| `totalDonations` | number | `0` |
| `donationCount` | number | `0` |
| `liveDevotees` | number | `0` |
| `lastUpdated` | timestamp | *Click "Add timestamp"* |

6. Click **"Save"**

---

## 🔒 Step 4: Set Up Security Rules

### 4.1 Deploy Security Rules

1. In Firebase Console, go to **"Firestore Database"** → **"Rules"** tab
2. **Replace the entire content** with the rules from `firestore.rules` file in your project
3. Click **"Publish"**

### 4.2 Verify Rules

The rules allow:
- ✅ Anonymous reads (no sign-in needed)
- ✅ Anonymous writes with validation
- ✅ Rate limiting to prevent spam
- ❌ No authentication required

---

## 🔧 Step 5: Configure Your App

### 5.1 Update Environment Files

Open `src/environments/environment.ts` and **replace the placeholder values** with your Firebase config:

```typescript
export const environment = {
  production: false,
  
  firebase: {
    apiKey: 'YOUR_ACTUAL_API_KEY',
    authDomain: 'your-project-id.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project-id.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID'
  },
  
  useBackend: true, // Keep this true to enable Firebase
  
  // ... rest of config
};
```

### 5.2 Update Production Environment

Repeat the same for `src/environments/environment.prod.ts`

---

## 📊 Step 6: Create Database Indexes

Firebase may require indexes for some queries. They'll be auto-created when you first use the app, but you can create them manually:

### 6.1 Community Wishes Index

1. Go to **Firestore Database** → **Indexes** tab
2. Click **"Add index"**
3. Collection: `communityWishes`
4. Fields to index:
   - `timestamp` - Descending
   - `__name__` - Descending
5. Query scope: **Collection**
6. Click **"Create"**

### 6.2 Diyas Index

1. Click **"Add index"** again
2. Collection: `diyas`
3. Fields to index:
   - `timestamp` - Descending
   - `__name__` - Descending
4. Query scope: **Collection**
5. Click **"Create"**

### 6.3 Events Index

1. Click **"Add index"** again
2. Collection: `events`
3. Fields to index:
   - `eventDate` - Ascending
   - `__name__` - Ascending
4. Query scope: **Collection**
5. Click **"Create"**

---

## 🎉 Step 7: Test the Connection

### 7.1 Run Your App

```powershell
npm start
```

### 7.2 Check Browser Console

Open the browser console and look for:
```
📊 Connected to Firebase real-time stats
```

### 7.3 Test Features

1. **Create a wish** → Check if `totalWishes` increments in Firestore
2. **Light a diya** → Check if new document appears in `diyas` collection
3. **View community wishes** → Should load if any exist

---

## 🎨 Step 8: Create Sample Data (Optional)

### 8.1 Add Sample Announcements

1. Go to Firestore → Create collection: `announcements`
2. Add document with auto-ID:

```json
{
  "title": "Welcome to Virtual Temple",
  "message": "May Lord Hanuman bless you with strength and devotion",
  "type": "info",
  "isActive": true,
  "createdAt": 1699281600000,
  "expiresAt": 1731676800000
}
```

### 8.2 Add Sample Event

1. Create collection: `events`
2. Add document:

```json
{
  "title": "Hanuman Jayanti Celebration",
  "description": "Special aarti and prasad distribution",
  "eventDate": 1731849600000,
  "deityId": "hanuman",
  "type": "festival",
  "notifyBefore": 60
}
```

---

## 🔐 Step 9: Enable Offline Persistence (Already Done)

The app automatically enables offline persistence, so it works even when users lose internet connection. Data syncs when they reconnect.

---

## 📈 Step 10: Monitor Usage

### 10.1 Firebase Console Dashboard

Monitor:
- **Firestore Usage**: Read/Write operations
- **Database Size**: Current storage
- **Active Users**: Real-time analytics

### 10.2 Set Up Budget Alerts

1. Go to **"Usage and billing"**
2. Set up alerts for:
   - Firestore reads: 50k/day free tier
   - Firestore writes: 20k/day free tier
   - Storage: 1 GB free tier

---

## 🚀 Advanced: Cloud Functions (Optional)

For advanced features like auto-cleanup and admin operations:

### Install Firebase CLI

```powershell
npm install -g firebase-tools
```

### Initialize Functions

```powershell
firebase login
firebase init functions
```

### Sample Cleanup Function

Create `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Auto-cleanup expired diyas (runs daily)
export const cleanupExpiredDiyas = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    
    const snapshot = await admin.firestore()
      .collection('diyas')
      .where('timestamp', '<', twentyFourHoursAgo)
      .get();
    
    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    
    await batch.commit();
    console.log(`Cleaned up ${snapshot.size} expired diyas`);
  });

// Count live devotees based on recent presence
export const updateLiveDevotees = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    const snapshot = await admin.firestore()
      .collection('presence')
      .where('timestamp', '>', fiveMinutesAgo)
      .get();
    
    await admin.firestore()
      .doc('globals/statistics')
      .update({
        liveDevotees: snapshot.size,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
  });
```

### Deploy Functions

```powershell
firebase deploy --only functions
```

---

## 🎯 Features Summary

### ✅ What Works Now:

1. **Global Statistics**
   - Real-time wish count across all users
   - Real-time diya count
   - Live devotee presence

2. **Community Prayer Wall**
   - Anonymous wishes shared for collective prayers
   - Users can pray for others' wishes
   - Real-time updates

3. **Global Diya Display**
   - See diyas lit by devotees worldwide
   - 24-hour auto-expiry
   - Names visible to all for collective blessings

4. **Temple Events**
   - Festival announcements
   - Special puja schedules
   - Automated reminders

5. **Donation Transparency**
   - Anonymous donation logging
   - Total donations visible to all
   - Build trust and transparency

### 🔄 Offline-First Architecture:

- All features work offline
- Data syncs when back online
- No data loss
- Graceful degradation

---

## 🆘 Troubleshooting

### Issue: "Failed to get document because the client is offline"

**Solution**: This is normal! The app works offline and will sync when reconnected.

### Issue: "Missing or insufficient permissions"

**Solution**: Check that firestore.rules are properly deployed in Firebase Console.

### Issue: "Index creation required"

**Solution**: Click the link in the error message, or manually create indexes in Step 6.

### Issue: Stats not updating

**Solution**: 
1. Check browser console for errors
2. Verify Firebase config in environment files
3. Ensure `useBackend: true` in environment

---

## 📚 Next Steps

1. ✅ **Test all features** locally
2. ✅ **Deploy to Firebase Hosting** (optional)
3. ✅ **Set up Cloud Functions** for auto-cleanup
4. ✅ **Monitor usage** and set budget alerts
5. ✅ **Add more events and announcements** as needed

---

## 🙏 Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [AngularFire Documentation](https://github.com/angular/angularfire)

---

**May Lord Hanuman bless your temple app! 🕉️**
