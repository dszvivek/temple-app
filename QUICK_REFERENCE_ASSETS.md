# 🎯 Quick Reference - Asset Management

## Common Commands

```bash
# Generate all icons from SVG source
npm run generate-icons

# Start development server
npm start

# Build for production
npm run build:prod

# Deploy to Firebase
firebase deploy
```

---

## Asset Paths

### Images
```typescript
import { ASSET_PATHS } from '@app/configs/asset-paths.config';

// Deity images
ASSET_PATHS.images.ganesh.hero
ASSET_PATHS.images.hanuman.deity

// Offerings
ASSET_PATHS.images.offerings.diya
ASSET_PATHS.images.offerings.incense
```

### Audio
```typescript
// Aarti
ASSET_PATHS.audio.aarti.ganesh
ASSET_PATHS.audio.aarti.hanuman.version1

// Mantras
ASSET_PATHS.audio.mantras.hanuman.chalisa1

// Ambient
ASSET_PATHS.audio.ambient.temple

// Effects
ASSET_PATHS.audio.effects.bell
```

### Icons
```typescript
// Source
ASSET_PATHS.icons.source

// PWA
ASSET_PATHS.icons.pwa.icon192
ASSET_PATHS.icons.pwa.maskable

// Favicon
ASSET_PATHS.icons.favicon.favicon32
```

---

## Directory Structure Quick View

```
assets/
├── audio/
│   ├── aarti/       → Devotional songs
│   ├── mantras/     → Mantras & chalisas  
│   ├── ambient/     → Background sounds
│   └── effects/     → Sound effects
│
├── icons/
│   ├── source/      → SOURCE SVG (edit this!)
│   ├── pwa/        → Generated (don't edit)
│   └── favicon/    → Generated (don't edit)
│
├── images/
│   ├── deities/
│   │   ├── ganesh/
│   │   └── hanuman/
│   ├── offerings/
│   └── temple/
│
├── svg/            → Reusable components
└── screenshots/    → App screenshots
```

---

## When to Regenerate Icons

✅ **YES - Regenerate when**:
- Updated source SVG design
- After cloning repository
- Before production deployment
- Source icon changed

❌ **NO - Don't regenerate when**:
- Just adding audio/images
- Making code changes
- Updating text content
- Normal development

---

## File Naming Conventions

```bash
# Images
deity-name-type.svg          # ganesh-hero.svg
offering-name.svg            # diya-lamp.svg

# Audio
deity-type-version.mp3       # hanuman-aarti-1.mp3
effect-name.wav              # mandir_bell.wav

# Icons (generated automatically)
icon-SIZExSIZE.png          # icon-192x192.png
favicon-SIZExSIZE.png       # favicon-32x32.png
```

---

## Troubleshooting

### Icon errors in console
```bash
npm run generate-icons
```

### Sharp installation fails
```bash
npm install sharp --save-dev --legacy-peer-deps
```

### Asset not loading
1. Check path in `asset-paths.config.ts`
2. Verify file exists in assets folder
3. Check angular.json includes assets directory

---

## Quick Links

📖 **Full Documentation**:
- Assets: `src/assets/ASSETS_ORGANIZATION.md`
- Scripts: `scripts/README.md`
- Summary: `ASSET_SETUP_SUMMARY.md`

🔧 **Configuration**:
- Paths: `src/app/configs/asset-paths.config.ts`
- Manifest: `src/manifest.webmanifest`
- Generator: `scripts/generate-icons.js`

---

**Last Updated**: November 7, 2025
