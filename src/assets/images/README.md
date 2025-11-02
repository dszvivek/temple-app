# Temple Image Assets

All images are SVG format for scalability and crisp display at any size.

## Available Images

### Deity Images
- **hanuman-deity.svg** - Full illustration of Lord Hanuman with crown, gada (mace), and tail
- **hanuman-idol.svg** - Original Om symbol with gradient (kept for compatibility)
- **placeholder-idol.svg** - Fallback Om symbol

### Temple Elements
- **temple-exterior.svg** - Complete temple complex with shikhara, pillars, and entrance
- **diya-lamp.svg** - Traditional oil lamp with glowing flame
- **temple-bell.svg** - Golden temple bell with clapper

### Offerings
- **prasad.svg** - Offering plate with flowers, sweets, and kumkum
- **incense.svg** - Agarbatti (incense sticks) with rising smoke

## Usage in Components

Images are referenced through the environment configuration:

```typescript
import { environment } from '@environments/environment';

// In component template
<img [src]="environment.imageAssets.hanumanDeity" alt="Lord Hanuman">
```

Or directly:
```html
<img src="assets/images/hanuman-deity.svg" alt="Lord Hanuman">
```

## Design Notes

- All images use authentic temple colors (saffron orange #f97316, gold #fbbf24)
- Include Devanagari text where appropriate
- Optimized for both light and dark backgrounds
- Scalable without quality loss (vector format)

## Customization

To replace with your own images:
1. Keep the same filenames
2. Maintain aspect ratios for best display
3. SVG format recommended for quality and performance
4. Can also use PNG/JPG - just update file extensions in environment.ts
