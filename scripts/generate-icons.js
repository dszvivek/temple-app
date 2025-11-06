/**
 * Icon Generator Script
 * Generates all required PWA icons from the SVG source
 * Run: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_SVG = path.join(__dirname, '../src/assets/icons/source/temple-icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/icons/pwa');
const FAVICON_DIR = path.join(__dirname, '../src/assets/icons/favicon');

// Icon sizes for PWA
const PWA_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Favicon sizes
const FAVICON_SIZES = [16, 32, 48];

// Apple touch icon sizes
const APPLE_SIZES = [120, 152, 167, 180];

async function generateIcons() {
  console.log('🎨 Starting icon generation...\n');

  // Create directories if they don't exist
  [OUTPUT_DIR, FAVICON_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Check if source SVG exists
  if (!fs.existsSync(SOURCE_SVG)) {
    console.error(`❌ Source SVG not found: ${SOURCE_SVG}`);
    console.log('📝 Please create the source SVG file first.');
    process.exit(1);
  }

  try {
    // Generate PWA icons
    console.log('📱 Generating PWA icons...');
    for (const size of PWA_SIZES) {
      await sharp(SOURCE_SVG)
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));
      console.log(`  ✅ Generated icon-${size}x${size}.png`);
    }

    // Generate favicons
    console.log('\n🔖 Generating favicons...');
    for (const size of FAVICON_SIZES) {
      await sharp(SOURCE_SVG)
        .resize(size, size)
        .png()
        .toFile(path.join(FAVICON_DIR, `favicon-${size}x${size}.png`));
      console.log(`  ✅ Generated favicon-${size}x${size}.png`);
    }

    // Generate Apple touch icons
    console.log('\n🍎 Generating Apple touch icons...');
    for (const size of APPLE_SIZES) {
      await sharp(SOURCE_SVG)
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `apple-touch-icon-${size}x${size}.png`));
      console.log(`  ✅ Generated apple-touch-icon-${size}x${size}.png`);
    }

    // Generate standard apple-touch-icon (180x180)
    await sharp(SOURCE_SVG)
      .resize(180, 180)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));
    console.log('  ✅ Generated apple-touch-icon.png (180x180)');

    // Generate maskable icon (512x512 with padding)
    console.log('\n🎭 Generating maskable icon...');
    await sharp(SOURCE_SVG)
      .resize(416, 416) // 512 * 0.8125 for safe zone
      .extend({
        top: 48,
        bottom: 48,
        left: 48,
        right: 48,
        background: { r: 249, g: 115, b: 22, alpha: 1 } // theme color
      })
      .png()
      .toFile(path.join(OUTPUT_DIR, 'icon-512x512-maskable.png'));
    console.log('  ✅ Generated maskable icon (512x512)');

    console.log('\n✨ All icons generated successfully!');
    console.log(`📁 PWA icons: ${OUTPUT_DIR}`);
    console.log(`📁 Favicons: ${FAVICON_DIR}`);
    
  } catch (error) {
    console.error('\n❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run the generator
generateIcons();
