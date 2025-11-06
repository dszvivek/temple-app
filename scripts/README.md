# 🛠️ Scripts Documentation

## Available Scripts

### Icon Generation

#### `npm run generate-icons`
Generates all PWA icons, favicons, and Apple touch icons from the source SVG.

**Source**: `scripts/generate-icons.js`

**What it does**:
- Reads source SVG from `src/assets/icons/source/temple-icon.svg`
- Generates PWA icons (72x72 to 512x512)
- Creates favicons (16x16, 32x32, 48x48)
- Generates Apple touch icons (multiple sizes)
- Creates maskable icon with safe zone padding

**Output directories**:
- `src/assets/icons/pwa/` - PWA icons
- `src/assets/icons/favicon/` - Favicon files

**When to use**:
- After updating the source SVG design
- Initial project setup
- Before production deployment
- After cloning the repository

**Example**:
```bash
# Generate all icons
npm run generate-icons

# Or directly
node scripts/generate-icons.js
```

---

### Development Scripts

#### `npm start`
Starts the development server with hot reload.

```bash
npm start
# App runs at: http://localhost:4200
```

#### `npm run watch`
Builds the app and watches for changes.

```bash
npm run watch
```

---

### Build Scripts

#### `npm run build`
Creates a development build.

```bash
npm run build
# Output: dist/karya-siddhi-temple/
```

#### `npm run build:prod`
Creates an optimized production build.

```bash
npm run build:prod
# Output: dist/karya-siddhi-temple/
# Features: Minification, tree-shaking, AOT compilation
```

---

### Testing Scripts

#### `npm test`
Runs unit tests with Karma.

```bash
npm test
```

#### `npm run lint`
Lints the codebase for code quality.

```bash
npm run lint
```

---

## Firebase Scripts

### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

Deploys security rules to Firebase.

### Deploy Full App

```bash
# Build first
npm run build:prod

# Deploy to Firebase Hosting
firebase deploy
```

---

## Custom Scripts Guide

### Creating New Scripts

Add to `package.json` scripts section:

```json
{
  "scripts": {
    "your-script": "command to run"
  }
}
```

Then run:
```bash
npm run your-script
```

---

## Script Dependencies

### Icon Generation (`generate-icons.js`)

**Dependencies**:
- `sharp` - Image processing library

**Requirements**:
- Node.js 14+
- Source SVG must exist at `src/assets/icons/source/temple-icon.svg`

**Error handling**:
- Checks if source SVG exists
- Creates output directories if missing
- Exits with error code on failure

---

## Useful Command Combinations

### Fresh Start
```bash
# Install dependencies
npm install

# Generate icons
npm run generate-icons

# Start development server
npm start
```

### Production Deployment
```bash
# Generate latest icons
npm run generate-icons

# Build for production
npm run build:prod

# Deploy to Firebase
firebase deploy
```

### After Git Clone
```bash
# Install dependencies
npm install --legacy-peer-deps

# Generate icons (not committed to git)
npm run generate-icons

# Start dev server
npm start
```

---

## Troubleshooting

### Icon Generation Fails

**Problem**: "Source SVG not found"
```bash
# Solution: Check if source exists
ls src/assets/icons/source/temple-icon.svg

# If missing, copy from backup
cp src/assets/icons/temple-favicon.svg src/assets/icons/source/temple-icon.svg
```

**Problem**: Sharp installation fails
```bash
# Solution: Rebuild sharp
npm rebuild sharp

# Or reinstall with legacy deps
npm install --save-dev sharp --legacy-peer-deps
```

### Build Issues

**Problem**: "Out of memory"
```bash
# Solution: Increase Node memory
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build:prod
```

---

## Advanced Usage

### Custom Icon Sizes

Edit `scripts/generate-icons.js`:

```javascript
// Add custom size to PWA_SIZES array
const PWA_SIZES = [72, 96, 128, 144, 152, 192, 256, 384, 512];
//                                                   ^^^
```

### Custom Output Directory

```javascript
// Change OUTPUT_DIR in generate-icons.js
const OUTPUT_DIR = path.join(__dirname, '../dist/icons');
```

---

## Performance Tips

1. **Icon Generation**: Only run when source SVG changes
2. **Development**: Use `npm start` for faster rebuilds
3. **Production**: Always use `build:prod` for deployments
4. **Firebase**: Deploy only changed files with `--only` flag

---

**Last Updated**: November 7, 2025
