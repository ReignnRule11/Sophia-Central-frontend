import { promises as fs } from 'node:fs';
import sharp from 'sharp';

const fullLogoPath = 'public/sophia-central-logo.png';
const markPath = 'public/sophia-central-mark.png';
const homepagePngPath = 'public/images/students-collaborating.png';
const homepageWebpPath = 'public/images/students-collaborating.webp';

async function optimizePng(inputPath, outputPath, width, height) {
  const input = sharp(inputPath);
  const before = await input.metadata();
  const result = await input
    .resize({ width, height, fit: 'inside', withoutEnlargement: true })
    .png({ palette: true, quality: 88, effort: 10, compressionLevel: 9 })
    .toBuffer();
  await fs.writeFile(outputPath, result);
  const after = await sharp(outputPath).metadata();
  console.log(
    `${inputPath}: ${before.width}x${before.height} -> ${after.width}x${after.height}; ${result.length} bytes`,
  );
}

await optimizePng(fullLogoPath, fullLogoPath, 280, 315);
await optimizePng(markPath, markPath, 140, 190);

const homepageMetadata = await sharp(homepagePngPath).metadata();
const homepageWidth = Math.min(1280, homepageMetadata.width ?? 1280);
const homepageResult = await sharp(homepagePngPath)
  .rotate()
  .resize({ width: homepageWidth, withoutEnlargement: true })
  .webp({ quality: 78, effort: 6, smartSubsample: true })
  .toBuffer();
await fs.writeFile(homepageWebpPath, homepageResult);
const homepageOutputMetadata = await sharp(homepageWebpPath).metadata();
console.log(
  `Homepage hero: ${homepageMetadata.width}x${homepageMetadata.height} PNG -> ${homepageOutputMetadata.width}x${homepageOutputMetadata.height} WebP; ${homepageResult.length} bytes`,
);
await fs.unlink(homepagePngPath);
