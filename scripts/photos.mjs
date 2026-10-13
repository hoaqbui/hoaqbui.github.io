import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = '/Users/hoaqbui/github/portfolio/design/photos/';
const OUTPUT_DIR = path.resolve('public/photos');

const files = [
  'jp-29',
  'cz-51',
  'cz-34',
  'jp-16',
  'cz-17',
  'jp-28',
  'cz-58',
  'jp-40',
];

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const dimensions = [];

for (const name of files) {
  const srcPath = path.join(SOURCE_DIR, `${name}.jpg`);
  const outPath = path.join(OUTPUT_DIR, `${name}.webp`);
  const thumbPath = path.join(OUTPUT_DIR, `${name}-thumb.webp`);

  // Long edge 2400 px (no upscaling, quality 82)
  const fullInfo = await sharp(srcPath)
    .resize({
      width: 2400,
      height: 2400,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(outPath);

  // Long edge 320 px (quality 70)
  await sharp(srcPath)
    .resize({
      width: 320,
      height: 320,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 70 })
    .toFile(thumbPath);

  dimensions.push({
    id: name,
    width: fullInfo.width,
    height: fullInfo.height,
  });

  console.log(`${name}: ${fullInfo.width}x${fullInfo.height}`);
}
