# 📁 Assets Organization Guide

## Directory Structure

```
src/assets/
├── audio/              # Audio files
│   ├── aarti/         # Aarti devotional songs
│   ├── mantras/       # Mantras and chalisas
│   ├── ambient/       # Background ambient sounds
│   └── effects/       # Sound effects (bell, etc.)
│
├── icons/             # Icons and favicons
│   ├── source/        # Source SVG files (DO NOT DELETE)
│   ├── pwa/          # Generated PWA icons
│   └── favicon/      # Generated favicon files
│
├── images/            # Image assets
│   ├── deities/      # Deity images
│   │   ├── ganesh/   # Lord Ganesh images
│   │   └── hanuman/  # Lord Hanuman images
│   ├── offerings/    # Offering items (diya, flowers, etc.)
│   └── temple/       # Temple-related images
│
├── svg/              # Reusable SVG components
│   ├── diya.svg
│   └── incense_smoke.svg
│
└── screenshots/      # App screenshots for PWA
    └── home.png
```

---

## 📱 Icons

### Source Files
- **Location**: `assets/icons/source/`
- **Purpose**: Master SVG file used to generate all icons
- **File**: `temple-icon.svg`
- ⚠️ **DO NOT DELETE** - This is the source for all generated icons

### Generated Icons
- **PWA Icons**: `assets/icons/pwa/` (Auto-generated, can be regenerated)
  - Standard sizes: 72, 96, 128, 144, 152, 192, 384, 512 px
  - Maskable icon: `icon-512x512-maskable.png` (with safe zone padding)
  - Apple touch icons: Various sizes for iOS devices

- **Favicons**: `assets/icons/favicon/` (Auto-generated)
  - 16x16, 32x32, 48x48 px

### Regenerating Icons
To regenerate all icons from the source SVG:

```bash
npm run generate-icons
```

Or manually:
```bash
node scripts/generate-icons.js
```

---

## 🎵 Audio Files

### Aarti (`audio/aarti/`)
Devotional aarti songs for different deities:
- `ganesh-aarti.mp3`
- `hanuman-aarti-1.mp3`
- `hanuman-aarti-2.mp3`

### Mantras & Chalisas (`audio/mantras/`)
Sacred mantras and chalisas:
- `ganesh-mantra.mp3`
- `hanuman-chalisa-1.mp3`
- `hanuman-chalisa-2.mp3`
- `hanuman-chalisa-3.mp3`

### Ambient Sounds (`audio/ambient/`)
Background ambient temple sounds:
- `temple_ambient.mp3` - General temple atmosphere
- `shankh_drone.mp3` - Conch shell sound
- `om-chant.mp3` - Om chanting

### Effects (`audio/effects/`)
Sound effects:
- `mandir_bell.wav` - Temple bell sound

---

## 🖼️ Images

### Deity Images (`images/deities/`)

#### Ganesh (`deities/ganesh/`)
- `ganesh-deity.svg` - Main deity image
- `ganesh-hero.svg` - Hero section image
- `ganesh-idol.svg` - Idol representation

#### Hanuman (`deities/hanuman/`)
- `hanuman-deity.svg` - Main deity image
- `hanuman-hero.svg` - Hero section image
- `hanuman-idol.svg` - Idol representation
- `hanuman-main.svg` - Main temple image

### Offerings (`images/offerings/`)
Items used in worship:
- `diya-lamp.svg` - Diya/lamp
- `incense.svg` - Incense sticks
- `prasad.svg` - Prasad offerings
- `flowers.svg.txt` - Flowers (placeholder)
- `fruits.svg.txt` - Fruits (placeholder)
- `modak.svg.txt` - Modak (placeholder)

### Temple (`images/temple/`)
Temple-related images:
- `temple-background.svg` - Temple background
- `temple-bell.svg` - Temple bell
- `temple-exterior.svg` - Temple exterior view

---

## 🔄 Reusable SVG Components (`svg/`)

Small, reusable SVG components for animations and effects:
- `diya.svg` - Diya component for animations
- `incense_smoke.svg` - Smoke effect for incense

---

## 📸 Screenshots (`screenshots/`)

App screenshots for PWA manifest and store listings:
- `home.png` - Home screen screenshot

### Adding More Screenshots
Place additional screenshots here and reference them in `manifest.webmanifest`:
```json
"screenshots": [
  {
    "src": "assets/screenshots/home.png",
    "sizes": "1080x1920",
    "type": "image/png"
  }
]
```

---

## 🎨 Best Practices

### File Naming
- Use **lowercase** with **hyphens** (kebab-case): `temple-bell.svg`
- Be descriptive: `hanuman-aarti-1.mp3` instead of `audio1.mp3`
- Include size in icon names: `icon-192x192.png`

### Image Formats
- **SVG**: Vector graphics (logos, icons, illustrations)
- **PNG**: Raster graphics with transparency (icons, screenshots)
- **WEBP**: Optimized photos (future consideration)
- **MP3**: Audio files

### Organization
- Keep source files separate from generated files
- Group files by type and purpose
- Use subdirectories for different deities/categories
- Add README.md files in subdirectories for documentation

### Performance
- Optimize SVGs: Remove unnecessary metadata
- Compress audio: Use appropriate bitrate (128-192 kbps for music)
- Lazy load: Large assets should be lazy-loaded
- Cache: Ensure proper caching in service worker

---

## 🔧 Maintenance

### Adding New Deity
1. Create subdirectory: `assets/images/deities/new-deity/`
2. Add deity images (hero, idol, deity)
3. Create configuration in `src/app/configs/new-deity.config.ts`
4. Add audio files in respective folders

### Updating Icons
1. Edit source SVG: `assets/icons/source/temple-icon.svg`
2. Run: `npm run generate-icons`
3. Icons automatically regenerated with new design

### Adding New Audio
1. Place in appropriate subfolder (`aarti`, `mantras`, `ambient`, `effects`)
2. Reference in respective service (e.g., `audio-player.service.ts`)
3. Update audio configuration if needed

---

## 📦 Build & Deployment

All assets in `src/assets/` are automatically copied to the build output.

### Build Command
```bash
npm run build
```

Assets will be available at `/assets/*` in production.

---

## 🔗 References

- Manifest icons referenced in: `src/manifest.webmanifest`
- Audio paths configured in: `src/app/services/audio-player.service.ts`
- Image paths used in: Component templates and configs
- Icon generation script: `scripts/generate-icons.js`

---

**Last Updated**: November 7, 2025  
**Maintained By**: Temple App Development Team
