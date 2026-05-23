/**
 * Asset Paths Configuration
 * Centralized location for all asset paths in the application
 * 
 * Benefits:
 * - Easy to maintain and update paths
 * - Type-safe asset references
 * - Auto-complete support in IDE
 * - Single source of truth
 */

export const ASSET_PATHS = {
  
  // ==================== ICONS ====================
  icons: {
    source: 'assets/icons/source/temple-icon.svg',
    pwa: {
      icon72: 'assets/icons/pwa/icon-72x72.png',
      icon96: 'assets/icons/pwa/icon-96x96.png',
      icon128: 'assets/icons/pwa/icon-128x128.png',
      icon144: 'assets/icons/pwa/icon-144x144.png',
      icon152: 'assets/icons/pwa/icon-152x152.png',
      icon192: 'assets/icons/pwa/icon-192x192.png',
      icon384: 'assets/icons/pwa/icon-384x384.png',
      icon512: 'assets/icons/pwa/icon-512x512.png',
      maskable: 'assets/icons/pwa/icon-512x512-maskable.png',
      appleTouchIcon: 'assets/icons/pwa/apple-touch-icon.png'
    },
    favicon: {
      favicon16: 'assets/icons/favicon/favicon-16x16.png',
      favicon32: 'assets/icons/favicon/favicon-32x32.png',
      favicon48: 'assets/icons/favicon/favicon-48x48.png'
    }
  },

  // ==================== IMAGES ====================
  images: {
    // Ganesh Deity Images
    ganesh: {
      main: 'assets/images/deities/ganesh/Ganesh.png',
      deity: 'assets/images/deities/ganesh/ganesh-deity.svg',
      hero: 'assets/images/deities/ganesh/ganesh-hero.svg',
      idol: 'assets/images/deities/ganesh/ganesh-idol.svg'
    },
    
    // Hanuman Deity Images
    hanuman: {
      deity: 'assets/images/deities/hanuman/hanuman-deity.svg',
      hero: 'assets/images/deities/hanuman/hanuman-hero.svg',
      idol: 'assets/images/deities/hanuman/hanuman-idol.svg',
      main: 'assets/images/deities/hanuman/hanuman-main.svg'
    },
    
    // Offerings
    offerings: {
      diya: 'assets/images/offerings/diya-lamp.svg',
      incense: 'assets/images/offerings/incense.svg',
      prasad: 'assets/images/offerings/prasad.svg',
      flowers: 'assets/images/offerings/flowers.svg',
      fruits: 'assets/images/offerings/fruits.svg',
      modak: 'assets/images/offerings/modak.svg'
    },
    
    // Temple Images
    temple: {
      background: 'assets/images/temple/temple-background.svg',
      bell: 'assets/images/temple/temple-bell.svg',
      exterior: 'assets/images/temple/temple-exterior.svg'
    },
    
    // General
    placeholder: 'assets/images/placeholder.svg'
  },

  // ==================== AUDIO ====================
  audio: {
    // Aarti Songs
    aarti: {
      ganesh: 'assets/audio/aarti/ganesh-aarti.mp3',
      hanuman: {
        version1: 'assets/audio/mantras/hanuman-chalisa.mp3',
        version2: 'assets/audio/hanuman/hanuman-chalisa.mp3'
      }
    },
    
    // Mantras and Chalisas
    mantras: {
      ganesh: 'assets/audio/ganesha/ganesh-aarti.mp3',
      hanuman: {
        chalisa1: 'assets/audio/mantras/hanuman-chalisa-1.mp3',
        chalisa2: 'assets/audio/mantras/hanuman-chalisa-2.mp3',
        chalisa3: 'assets/audio/mantras/hanuman-chalisa-3.mp3'
      }
    },
    
    // Ambient Sounds
    ambient: {
      temple: 'assets/audio/ambient/temple_ambient.mp3',
      shankh: 'assets/audio/ambient/shankh_drone.mp3',
      omChant: 'assets/audio/ambient/shankh_drone.mp3'
    },
    
    // Sound Effects
    effects: {
      bell: 'assets/audio/effects/mandir_bell.mp3'
    }
  },

  // ==================== SVG COMPONENTS ====================
  svg: {
    diya: 'assets/svg/diya.svg',
    incenseSmoke: 'assets/svg/incense_smoke.svg'
  },

  // ==================== SCREENSHOTS ====================
  screenshots: {
    home: 'assets/screenshots/home.png'
  }

} as const;

// Type-safe helper to get asset path
export function getAssetPath(path: string): string {
  return path;
}

// Deity-specific helper
export function getDeityImage(deityId: string, type: 'deity' | 'hero' | 'idol' | 'main'): string {
  const deityImages = ASSET_PATHS.images[deityId as keyof typeof ASSET_PATHS.images];
  if (!deityImages || typeof deityImages !== 'object' || !('deity' in deityImages)) {
    return ASSET_PATHS.images.placeholder;
  }
  return (deityImages as any)[type] || ASSET_PATHS.images.placeholder;
}

// Audio helper
export function getAudioPath(category: 'aarti' | 'mantras' | 'ambient' | 'effects', deityId?: string, version?: string): string {
  const categoryPaths = ASSET_PATHS.audio[category];
  
  if (!deityId) {
    return typeof categoryPaths === 'string' ? categoryPaths : '';
  }
  
  const deityPaths = (categoryPaths as any)[deityId];
  if (!deityPaths) return '';
  
  if (typeof deityPaths === 'string') {
    return deityPaths;
  }
  
  if (version && deityPaths[version]) {
    return deityPaths[version];
  }
  
  // Return first available version
  return Object.values(deityPaths)[0] as string;
}
