# Karya Siddhi Temple - Icon Assets

# Karunamayi Hanuman E-Mandir - Icon Assets

This directory contains all the icon files for the Progressive Web App (PWA).

## Required Icon Sizes

Generate icons in the following sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## How to Generate Icons

You can use online tools to generate icons from a single source image:

1. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
2. **RealFaviconGenerator**: https://realfavicongenerator.net/
3. **Icon Generator**: https://icon.kitchen/

## Design Recommendations

- Use a simple, recognizable symbol (Om, Hanuman image, etc.)
- Ensure good contrast and visibility at small sizes
- Use saffron/orange theme colors to match the app
- Make the icon work on both light and dark backgrounds

## Placeholder

For development, you can use a simple colored square or the Om symbol as a placeholder until you create proper icons.

## Example Using ImageMagick

```bash
# Convert a single image to multiple sizes
convert source.png -resize 72x72 icon-72x72.png
convert source.png -resize 96x96 icon-96x96.png
convert source.png -resize 128x128 icon-128x128.png
convert source.png -resize 144x144 icon-144x144.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 384x384 icon-384x384.png
convert source.png -resize 512x512 icon-512x512.png
```
