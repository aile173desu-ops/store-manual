const fs = require('fs');
const path = require('path');

async function main() {
  // Dynamic import for ESM module
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { createCanvas } = require('canvas');

  const pdfPath = 'C:/Users/173de/OneDrive/Documents/奥村小顔矯正ツール.pdf';
  const outDir = 'C:/Users/173de/OneDrive/Documents/小顔矯正マニュアル/images';
  const outDir2 = 'C:/Users/173de/store-manual/docs/images';

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;
  console.log('Total pages:', pdf.numPages);

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const scale = 2.0;
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;

    const pngBuffer = canvas.toBuffer('image/png');
    const filename = `p${i}.png`;
    fs.writeFileSync(path.join(outDir, filename), pngBuffer);
    fs.writeFileSync(path.join(outDir2, filename), pngBuffer);
    console.log(`Saved ${filename} (${pngBuffer.length} bytes)`);
  }

  console.log('All pages extracted!');
}

main().catch(e => console.error(e));
