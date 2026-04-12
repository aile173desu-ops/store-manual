const fs = require('fs');

// Read the 小顔矯正マニュアル HTML
const manual = fs.readFileSync('C:/Users/173de/OneDrive/Documents/小顔矯正マニュアル/index.html', 'utf-8');

// Extract style and body
const styleMatch = manual.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = manual.match(/<body>([\s\S]*?)<\/body>/);
const css = styleMatch ? styleMatch[1] : '';
const body = bodyMatch ? bodyMatch[1].trim() : '';

// Scope CSS: prefix selectors with .km- to avoid conflicts with biyou.html styles
// We'll wrap everything in a container with class "km-wrap"
const scopedCss = css
  .replace(/:root/g, '.km-wrap')
  .replace(/\bbody\b/g, '.km-wrap')
  .replace(/\* \{[^}]+\}/, '');  // Remove universal selector reset

// Build the new tab content
const newTabContent = `<div class="tab-content" id="tab-kyouiku">
  <div style="width:100%; max-height:calc(100vh - 67px); overflow-y:auto;">
    <style>
      .km-wrap {
        font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", sans-serif;
        background: #faf8f5;
        color: #333;
        line-height: 1.8;
        padding: 0;
      }
      ${scopedCss}
    </style>
    <div class="km-wrap">
      ${body}
    </div>
  </div>
</div>`;

// Read biyou.html
let biyou = fs.readFileSync('C:/Users/173de/store-manual/docs/biyou.html', 'utf-8');

// Replace the 教育ツール tab content (matches both PDF embed and HTML versions)
const oldPattern = /<!-- ={2,} -->\n<!-- TAB 2: 教育ツール -->\n<!-- ={2,} -->\n<div class="tab-content" id="tab-kyouiku">[\s\S]*?(?=<!-- ={2,} -->\n<!-- TAB 3)/;

biyou = biyou.replace(oldPattern, `<!-- ============================================ -->\n<!-- TAB 2: 教育ツール -->\n<!-- ============================================ -->\n${newTabContent}\n`);

fs.writeFileSync('C:/Users/173de/store-manual/docs/biyou.html', biyou, 'utf-8');
console.log('Done! biyou.html updated.');

// Auto-sync to deploy folder
const deployDir = 'C:/Users/173de/OneDrive/Documents/store-manual-deploy/docs';
try {
  fs.copyFileSync('C:/Users/173de/store-manual/docs/biyou.html', deployDir + '/biyou.html');
  // Sync images
  const imgSrc = 'C:/Users/173de/store-manual/docs/images';
  const imgDst = deployDir + '/images';
  if (fs.existsSync(imgSrc)) {
    fs.readdirSync(imgSrc).forEach(f => {
      fs.copyFileSync(imgSrc + '/' + f, imgDst + '/' + f);
    });
  }
  console.log('Deploy folder synced.');
} catch(e) {
  console.log('Deploy folder sync skipped:', e.message);
}

// Auto-deploy to Netlify
const { execSync } = require('child_process');
try {
  execSync('npx netlify-cli deploy --dir="C:/Users/173de/OneDrive/Documents/store-manual-deploy" --prod --site 02d303df-77c8-4e46-99f5-ec4108b1276a', { stdio: 'pipe', timeout: 120000 });
  console.log('Netlify deploy complete!');
} catch(e) {
  console.log('Netlify deploy skipped (offline or auth issue).');
}
