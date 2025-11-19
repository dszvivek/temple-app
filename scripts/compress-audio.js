// Audio Compression Script for Temple App
// Uses FFmpeg to compress audio files and reduce load time

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎵 Audio Compression Script');
console.log('================================\n');

// Check if FFmpeg is available
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('✓ FFmpeg found\n');
} catch (error) {
  console.error('❌ FFmpeg not found!');
  console.error('\nPlease install FFmpeg first:');
  console.error('  1. Download from: https://www.gyan.dev/ffmpeg/builds/');
  console.error('  2. Or install via winget: winget install Gyan.FFmpeg');
  console.error('  3. Or install via chocolatey: choco install ffmpeg\n');
  process.exit(1);
}

const audioDir = 'src/assets/audio';
const backupDir = 'src/assets/audio_backup';

// Create backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`📁 Created backup directory: ${backupDir}\n`);
}

// Compression settings for different audio types
const compressionSettings = {
  mantra: { bitrate: '96k', channels: 1, description: 'Mantras/Chanting' },
  aarti: { bitrate: '128k', channels: 2, description: 'Aarti Music' },
  ambient: { bitrate: '64k', channels: 1, description: 'Ambient Sounds' },
  effect: { bitrate: '64k', channels: 1, description: 'Sound Effects' }
};

function getFileSize(filePath) {
  return fs.statSync(filePath).size / (1024 * 1024); // Size in MB
}

function compressAudio(inputFile, outputFile, type) {
  const fileName = path.basename(inputFile);
  const originalSize = getFileSize(inputFile);
  
  console.log(`Processing: ${fileName} (${originalSize.toFixed(2)} MB)`);
  
  // Backup original if not already backed up
  const backupPath = path.join(backupDir, fileName);
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputFile, backupPath);
    console.log(`  ✓ Backed up to: ${backupPath}`);
  }
  
  const settings = compressionSettings[type];
  
  // Use temporary file if input and output are the same
  const isSameFile = path.resolve(inputFile) === path.resolve(outputFile);
  const tempOutput = isSameFile ? outputFile + '.tmp.mp3' : outputFile;
  
  try {
    // FFmpeg command to compress
    const cmd = `ffmpeg -i "${inputFile}" -vn -ar 44100 -ac ${settings.channels} -b:a ${settings.bitrate} -codec:a libmp3lame -y "${tempOutput}"`;
    execSync(cmd, { stdio: 'ignore' });
    
    // Replace original with compressed version if using temp file
    if (isSameFile && fs.existsSync(tempOutput)) {
      fs.unlinkSync(inputFile);
      fs.renameSync(tempOutput, outputFile);
    }
    
    const newSize = getFileSize(outputFile);
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`  ✓ Compressed: ${newSize.toFixed(2)} MB (↓${reduction}%)`);
    return { success: true, originalSize, newSize };
  } catch (error) {
    console.log(`  ✗ Failed to compress: ${error.message}`);
    // Clean up temp file if it exists
    if (fs.existsSync(tempOutput)) {
      fs.unlinkSync(tempOutput);
    }
    return { success: false, originalSize, newSize: originalSize };
  }
}

function processDirectory(dir, pattern, type, description) {
  console.log(`\n${description}...`);
  
  const files = fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.match(pattern))
    .map(dirent => path.join(dir, dirent.name));
  
  const results = [];
  
  for (const file of files) {
    const fileSize = getFileSize(file);
    
    // Skip empty or very small placeholder files (< 1 KB)
    if (fileSize < 0.001) {
      console.log(`Skipping placeholder file: ${path.basename(file)} (${(fileSize * 1024).toFixed(2)} KB)`);
      continue;
    }
    
    const ext = path.extname(file);
    const outputFile = ext === '.wav' ? file.replace('.wav', '.mp3') : file;
    
    const result = compressAudio(file, outputFile, type);
    results.push(result);
    
    // Remove original WAV file after successful conversion to MP3
    if (ext === '.wav' && result.success) {
      fs.unlinkSync(file);
      console.log(`  ✓ Converted WAV to MP3`);
    }
  }
  
  return results;
}

// Track totals
let totalBefore = 0;
let totalAfter = 0;

// Process different audio directories
const mantrasDir = path.join(audioDir, 'mantras');
const aartiDir = path.join(audioDir, 'aarti');
const ambientDir = path.join(audioDir, 'ambient');
const effectsDir = path.join(audioDir, 'effects');

// Compress Mantras
if (fs.existsSync(mantrasDir)) {
  processDirectory(mantrasDir, /\.mp3$/, 'mantra', '📿 Compressing Mantras');
}

// Compress Aarti
if (fs.existsSync(aartiDir)) {
  processDirectory(aartiDir, /\.mp3$/, 'aarti', '🔔 Compressing Aarti');
}

// Compress Ambient (WAV to MP3)
if (fs.existsSync(ambientDir)) {
  processDirectory(ambientDir, /\.wav$/, 'ambient', '🌊 Compressing Ambient');
}

// Compress root level temple ambience
const rootAmbience = path.join(audioDir, 'temple_ambience.wav');
if (fs.existsSync(rootAmbience)) {
  console.log('\n🏛️ Compressing Temple Ambience...');
  const mp3Output = path.join(audioDir, 'temple_ambience.mp3');
  const result = compressAudio(rootAmbience, mp3Output, 'ambient');
  if (result.success) {
    fs.unlinkSync(rootAmbience);
    console.log(`  ✓ Converted WAV to MP3`);
  }
}

// Compress Effects (WAV to MP3)
if (fs.existsSync(effectsDir)) {
  processDirectory(effectsDir, /\.wav$/, 'effect', '🔊 Compressing Effects');
}

// Calculate totals
console.log('\n================================');
console.log('✅ Audio Compression Complete!');
console.log('\nBefore/After comparison:');

// Calculate total sizes
if (fs.existsSync(backupDir)) {
  const backupFiles = fs.readdirSync(backupDir);
  backupFiles.forEach(file => {
    totalBefore += getFileSize(path.join(backupDir, file));
  });
}

function getAllMp3Files(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllMp3Files(fullPath));
    } else if (item.name.endsWith('.mp3')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const allMp3Files = getAllMp3Files(audioDir);
allMp3Files.forEach(file => {
  totalAfter += getFileSize(file);
});

const totalReduction = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);

console.log(`  Before: ${totalBefore.toFixed(2)} MB`);
console.log(`  After:  ${totalAfter.toFixed(2)} MB`);
console.log(`  Saved:  ${(totalBefore - totalAfter).toFixed(2)} MB (↓${totalReduction}%)`);

console.log(`\n💡 Tip: Original files are backed up in '${backupDir}'`);
console.log(`    If you need to restore, copy files back from there.\n`);
