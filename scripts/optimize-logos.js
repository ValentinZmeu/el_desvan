const sharp = require('sharp');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');

async function createCircularLogos() {
  console.log('Optimizing logos...\n');

  // Create circular mask for 210x210 (footer)
  const circleMask210 = Buffer.from(
    '<svg width="210" height="210"><circle cx="105" cy="105" r="105" fill="white"/></svg>'
  );

  // Create circular mask for 105x105 (header)
  const circleMask105 = Buffer.from(
    '<svg width="105" height="105"><circle cx="52.5" cy="52.5" r="52.5" fill="white"/></svg>'
  );

  // Footer logo (210x210 circular)
  const logo210 = await sharp(path.join(IMAGES_DIR, 'logo.png'))
    .resize(210, 210)
    .composite([{ input: circleMask210, blend: 'dest-in' }])
    .webp({ quality: 60, alphaQuality: 80 })
    .toFile(path.join(IMAGES_DIR, 'logo.webp'));
  console.log(`Footer logo: ${(logo210.size / 1024).toFixed(1)} KiB`);

  // Header logo (105x105 circular)
  const logo105 = await sharp(path.join(IMAGES_DIR, 'logo-header.png'))
    .resize(105, 105)
    .composite([{ input: circleMask105, blend: 'dest-in' }])
    .webp({ quality: 60, alphaQuality: 80 })
    .toFile(path.join(IMAGES_DIR, 'logo-header.webp'));
  console.log(`Header logo: ${(logo105.size / 1024).toFixed(1)} KiB`);

  console.log('\nDone!');
}

createCircularLogos().catch(console.error);
