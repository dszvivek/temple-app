# 🎨 Asset Requirements & Placeholders Guide

## Overview

This guide lists all audio and image assets required for the multi-deity E-Darshan Mandir app. Each deity temple requires specific assets while sharing common temple resources.

---

## 📊 Asset Status Summary

### ✅ Available Assets (Hanuman Temple)
- Hanuman Chalisa audio
- Hanuman Aarti audio
- Hanuman deity images (hero, idol, main)
- Common temple images (bell, background, exterior)
- Common offering images (diya, incense, prasad)
- Om chant audio
- Temple sound effects (bell, shankh, ambience)

### 🔶 Placeholder Assets (Ganesh Temple)
- Ganesh Aarti audio → **PLACEHOLDER**
- Ganesh Mantra audio → **PLACEHOLDER**
- Ganesh deity images → **PLACEHOLDER**
- Modak image → **PLACEHOLDER**

### 🔶 Placeholder Assets (Common)
- Flowers image → **PLACEHOLDER**
- Fruits image → **PLACEHOLDER**

---

## 🎵 Audio Assets Required

### Hanuman Temple Audio
| File | Status | Duration | Description |
|------|--------|----------|-------------|
| `hanuman-chalisa.mp3` | ✅ Available | ~8min 32s | Main prayer chant |
| `hanuman-aarti.mp3` | ✅ Available | ~3 min | Temple aarti |

### Ganesh Temple Audio
| File | Status | Duration | Description |
|------|--------|----------|-------------|
| `ganesh-aarti.mp3` | 🔶 PLACEHOLDER | ~3 min | "Jai Ganesh Jai Ganesh Deva" |
| `ganesh-mantra.mp3` | 🔶 PLACEHOLDER | ~2 min | "Om Gam Ganapataye Namaha" |

### Common Temple Audio
| File | Status | Duration | Description |
|------|--------|----------|-------------|
| `om-chant.mp3` | ✅ Available | Variable | Universal Om chanting |
| `mandir_bell.wav` | ✅ Available | ~2 sec | Temple bell sound |
| `shankh_drone.wav` | ✅ Available | Variable | Conch shell sound |
| `temple_ambience.wav` | ✅ Available | Variable | Background temple sounds |

---

## 🖼️ Image Assets Required

### Hanuman Temple Images
| File | Status | Dimensions | Description |
|------|--------|------------|-------------|
| `hanuman-main.png` | ✅ Available | 1200x500px | Hero image |
| `hanuman-deity.svg` | ✅ Available | Vector | Main deity illustration |
| `hanuman-idol.svg` | ✅ Available | Vector | Icon/small idol |

### Ganesh Temple Images
| File | Status | Dimensions | Description |
|------|--------|------------|-------------|
| `ganesh-hero.png` | 🔶 PLACEHOLDER | 1200x500px | Hero banner image |
| `ganesh-deity.svg` | 🔶 PLACEHOLDER | Vector | Main deity illustration |
| `ganesh-idol.svg` | 🔶 PLACEHOLDER | Vector | Icon/small idol |

### Common Temple Images
| File | Status | Dimensions | Description |
|------|--------|------------|-------------|
| `placeholder-idol.svg` | ✅ Available | Vector | Generic deity placeholder |
| `temple-background.svg` | ✅ Available | Vector | Temple pattern background |
| `temple-exterior.svg` | ✅ Available | Vector | Temple building illustration |
| `temple-bell.svg` | ✅ Available | Vector | Bell icon |

### Offering Images
| File | Status | Dimensions | Description |
|------|--------|------------|-------------|
| `diya-lamp.svg` | ✅ Available | Vector | Oil lamp |
| `incense.svg` | ✅ Available | Vector | Incense sticks |
| `prasad.svg` | ✅ Available | Vector | General prasad/sweets |
| `modak.svg` | 🔶 PLACEHOLDER | Vector | Ganesh's favorite sweet |
| `flowers.svg` | 🔶 PLACEHOLDER | Vector | Flower offerings |
| `fruits.svg` | 🔶 PLACEHOLDER | Vector | Fruit offerings |

---

## 📁 Directory Structure

```
src/assets/
├── audio/
│   ├── hanuman-chalisa.mp3 ✅
│   ├── hanuman-aarti.mp3 ✅
│   ├── ganesh-aarti.mp3 🔶 (placeholder)
│   ├── ganesh-mantra.mp3 🔶 (placeholder)
│   ├── om-chant.mp3 ✅
│   ├── mandir_bell.wav ✅
│   ├── shankh_drone.wav ✅
│   └── temple_ambience.wav ✅
│
└── images/
    ├── hanuman-main.png ✅
    ├── hanuman-deity.svg ✅
    ├── hanuman-idol.svg ✅
    ├── ganesh-hero.png 🔶 (placeholder)
    ├── ganesh-deity.svg 🔶 (placeholder)
    ├── ganesh-idol.svg 🔶 (placeholder)
    ├── placeholder-idol.svg ✅
    ├── temple-background.svg ✅
    ├── temple-exterior.svg ✅
    ├── temple-bell.svg ✅
    ├── diya-lamp.svg ✅
    ├── incense.svg ✅
    ├── prasad.svg ✅
    ├── modak.svg 🔶 (placeholder)
    ├── flowers.svg 🔶 (placeholder)
    └── fruits.svg 🔶 (placeholder)
```

---

## 🔧 Configuration Files

### Environment Configuration
Both `environment.ts` and `environment.prod.ts` have been updated with:
- ✅ Deity-specific audio paths
- ✅ Deity-specific image paths
- ✅ Common asset paths
- ✅ Organized by category

### Temple Configurations
- ✅ `hanuman.config.ts` - Complete Hanuman temple setup
- ✅ `ganesh.config.ts` - Complete Ganesh temple setup

---

## 📝 How to Replace Placeholders

### For Audio Files:

1. **Obtain Audio:**
   - Download from royalty-free sources
   - Record your own with permission
   - Use YouTube Audio Library (convert to MP3)

2. **Format Requirements:**
   - Convert to MP3 (128 kbps or higher)
   - Ensure 44.1 kHz sample rate
   - Trim to appropriate duration
   - Normalize audio levels

3. **Replace Placeholder:**
   - Delete the `.txt` placeholder file
   - Add your actual `.mp3` file
   - Keep the exact filename specified
   - Test playback in the app

### For Image Files:

1. **Obtain Images:**
   - Create custom illustrations
   - Use free vector sites (Flaticon, Freepik)
   - Ensure culturally respectful representations

2. **Format Requirements:**
   - **SVG preferred** (scalable, smaller size)
   - **PNG alternative** (higher quality, larger size)
   - Transparent backgrounds
   - Appropriate dimensions (see table above)

3. **Replace Placeholder:**
   - Delete the `.txt` placeholder file
   - Add your actual image file
   - Keep the exact filename specified
   - Optimize for web (compress if needed)

---

## 🎨 Design Guidelines

### Color Schemes

**Hanuman Temple:**
- Primary: Orange (#F97316, #FB923C)
- Secondary: Red (#DC2626, #EF4444)
- Accent: Yellow (#FDE047)

**Ganesh Temple:**
- Primary: Red (#DC2626, #EF4444)
- Secondary: Orange (#F97316, #FB923C)
- Accent: Yellow (#FCD34D)

### Image Style:
- **Traditional:** Respect cultural and religious significance
- **Clean:** Simple, uncluttered designs
- **Vibrant:** Use rich, saturated colors
- **Scalable:** SVG format ensures clarity at any size

### Audio Quality:
- **Clear:** No background noise
- **Professional:** Well-recorded or high-quality sources
- **Respectful:** Appropriate for worship context
- **Consistent:** Similar volume levels across tracks

---

## 🚀 Priority Order for Replacements

### High Priority (Core Features):
1. ✅ Ganesh Aarti audio - Used in scheduled playback
2. ✅ Ganesh Mantra audio - Used in prayer sequences
3. ✅ Ganesh deity images - Main temple visuals

### Medium Priority (Enhanced Experience):
4. ✅ Modak image - Ganesh-specific offering
5. ✅ Flowers image - Common offering visualization
6. ✅ Fruits image - Common offering visualization

### Low Priority (Optional Enhancements):
- Additional mantras for other deities
- Seasonal/festival-specific images
- Multiple aarti variations

---

## 🔍 Asset Validation Checklist

Before deploying with new assets:

### Audio Files:
- [ ] File format is MP3
- [ ] Duration matches config specification
- [ ] Audio plays without errors
- [ ] Volume level is appropriate
- [ ] No clipping or distortion
- [ ] Filename matches exactly

### Image Files:
- [ ] Format is SVG or PNG
- [ ] Dimensions are correct
- [ ] Background is transparent (where applicable)
- [ ] Colors match temple theme
- [ ] File size is optimized (< 200KB for PNGs)
- [ ] Filename matches exactly
- [ ] Displays correctly on mobile and desktop

---

## 📚 Free Resource Links

### Audio Resources:
- **YouTube Audio Library:** https://www.youtube.com/audiolibrary
- **Freesound:** https://freesound.org/ (devotional music)
- **Archive.org:** Public domain mantras and bhajans

### Image Resources:
- **Flaticon:** https://www.flaticon.com/ (search "Hindu god" / "Ganesha")
- **Freepik:** https://www.freepik.com/ (temple illustrations)
- **Pixabay:** https://pixabay.com/ (royalty-free images)
- **SVG Repo:** https://www.svgrepo.com/ (free SVG icons)

### Tools:
- **Audio Conversion:** Audacity (free), Online-Convert.com
- **Image Editing:** Inkscape (SVG), GIMP (PNG), Photopea (online)
- **Compression:** TinyPNG.com, Squoosh.app

---

## 🎯 Adding New Deity Temples

To add a new deity (e.g., Shiva, Krishna):

1. **Create Configuration:**
   - Copy `hanuman.config.ts` as template
   - Update deity details, mantras, aarti times
   - Add to `DeityType` enum in `deity.model.ts`

2. **Add Assets:**
   - Create deity-specific audio files
   - Create deity-specific image files
   - Add paths to `environment.ts`

3. **Create Placeholder Files:**
   - Add `.txt` placeholder files in assets folders
   - Document requirements clearly

4. **Register Temple:**
   - Add temple config to `app.component.ts`
   - Update temple selector component

---

## 🛠️ Technical Implementation

### Environment Configuration:
```typescript
audioAssets: {
  // Deity-specific
  hanumanChalisa: 'assets/audio/hanuman-chalisa.mp3',
  ganeshAarti: 'assets/audio/ganesh-aarti.mp3',
  
  // Common
  omChant: 'assets/audio/om-chant.mp3',
  templeBell: 'assets/audio/mandir_bell.wav'
}
```

### Temple Configuration:
```typescript
mantras: [
  {
    deityId: DeityType.GANESH,
    name: 'Ganesh Aarti',
    audioFile: 'assets/audio/ganesh-aarti.mp3',
    duration: 180
  }
]
```

---

## 📞 Support

For questions about:
- **Asset formats:** Check placeholder `.txt` files
- **File specifications:** See tables above
- **Design guidelines:** Review color schemes section
- **Technical issues:** Check browser console for errors

---

## ✅ Summary

**Current Status:**
- ✅ Hanuman temple: Fully operational
- 🔶 Ganesh temple: Needs 6 asset replacements
- ✅ Infrastructure: Ready for multiple deities

**Next Steps:**
1. Replace Ganesh audio placeholders (2 files)
2. Replace Ganesh image placeholders (3 files)
3. Add common offering images (3 files)
4. Test all features with new assets
5. Deploy and share! 🙏

---

**Last Updated:** November 6, 2025  
**Total Placeholder Files:** 8  
**Files Ready:** Ready for production once placeholders replaced
